// GET /api/little-things/[id] — Fetch a Little Thing for preview.
// PATCH /api/little-things/[id] — Update a Little Thing atomically (creator token auth).

import { NextResponse } from "next/server";
import { getLittleThingById, getLittleThingByCreatorToken } from "@/lib/data/little-thing";
import { prisma, MUTATION_TX_OPTIONS, withTransientRetry } from "@/lib/prisma";
import { littleThingFullUpdateSchema } from "@/lib/validations";
import { logApiEvent, logCaughtError } from "@/lib/api/db-errors";

export const runtime = "nodejs";
export const maxDuration = 30;

type RouteParams = {
  params: Promise<{ id: string }>;
};

type SavedQuestion = {
  id: string;
  text: string;
  stickerId: string | null;
  answers: { id: string; text: string }[];
};

// -----------------------------------------------------------------------
// GET — unchanged from Milestone 3
// -----------------------------------------------------------------------

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const littleThing = await getLittleThingById(id);

    if (!littleThing) {
      return NextResponse.json(
        { error: "Little Thing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: littleThing.id,
      publicId: littleThing.publicId,
      title: littleThing.title,
      introMessage: littleThing.introMessage,
      creatorName: littleThing.creatorName,
      recipientName: littleThing.recipientName,
      status: littleThing.status,
      createdAt: littleThing.createdAt.toISOString(),
      questions: littleThing.questions.map((q) => ({
        id: q.id,
        text: q.text,
        order: q.order,
        stickerId: q.stickerId,
        answers: q.answers.map((a) => ({
          id: a.id,
          text: a.text,
          order: a.order,
        })),
      })),
    });
  } catch (error) {
    logCaughtError("get-little-thing", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again. 💕" },
      { status: 500 }
    );
  }
}

// -----------------------------------------------------------------------
// PATCH — Atomic full-save with creator token authorization
// -----------------------------------------------------------------------

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id: littleThingId } = await params;

    const body = await request.json();

    if (!body.creatorAccessToken || typeof body.creatorAccessToken !== "string") {
      logApiEvent({
        operation: "edit-little-thing",
        httpStatus: 401,
        errorType: "Unauthorized",
      });
      return NextResponse.json(
        { error: "Creator access token is required. 💌" },
        { status: 401 }
      );
    }

    const creatorAccessToken = body.creatorAccessToken;

    const parsed = littleThingFullUpdateSchema.safeParse(body);

    if (!parsed.success) {
      logApiEvent({
        operation: "edit-little-thing",
        httpStatus: 400,
        errorType: "ValidationError",
        validationIssues: parsed.error.issues.map((issue) => ({
          path: issue.path,
          code: issue.code,
        })),
      });
      const message = parsed.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const data = parsed.data;

    type EditResult =
      | { kind: "forbidden" }
      | { kind: "not_found" }
      | { kind: "archived" }
      | { kind: "question_locked" }
      | { kind: "answer_locked" }
      | { kind: "ok"; questions: SavedQuestion[] };

    const result = await withTransientRetry(
      "edit-little-thing",
      async (): Promise<EditResult> => {
        const tokenLittleThing = await getLittleThingByCreatorToken(
          creatorAccessToken
        );
        if (!tokenLittleThing || tokenLittleThing.id !== littleThingId) {
          return { kind: "forbidden" };
        }

        const existing = await getLittleThingById(littleThingId);
        if (!existing) {
          return { kind: "not_found" };
        }

        if (existing.status === "ARCHIVED") {
          return { kind: "archived" };
        }

        const referencedQuestionIds = new Set<string>();
        const referencedAnswerIds = new Set<string>();

        const refs = await prisma.responseAnswer.findMany({
          where: { response: { littleThingId } },
          select: { questionId: true, answerId: true },
        });
        for (const ref of refs) {
          referencedQuestionIds.add(ref.questionId);
          referencedAnswerIds.add(ref.answerId);
        }

        const submittedQuestionIds = new Set(
          data.questions.filter((q) => q.id).map((q) => q.id!)
        );
        const submittedAnswerIds = new Set(
          data.questions.flatMap((q) =>
            q.answers.filter((a) => a.id).map((a) => a.id!)
          )
        );

        for (const rqId of referencedQuestionIds) {
          if (!submittedQuestionIds.has(rqId)) {
            return { kind: "question_locked" };
          }
        }

        for (const raId of referencedAnswerIds) {
          if (!submittedAnswerIds.has(raId)) {
            return { kind: "answer_locked" };
          }
        }

        const savedQuestions = await prisma.$transaction(async (tx) => {
          await tx.littleThing.update({
            where: { id: littleThingId },
            data: {
              title: data.title,
              introMessage: data.introMessage || null,
              creatorName: data.creatorName || null,
              recipientName: data.recipientName || null,
            },
          });

          const keepQuestionIds = new Set<string>();
          const keepAnswerIds = new Set<string>();
          const questions: SavedQuestion[] = [];

          for (let qi = 0; qi < data.questions.length; qi++) {
            const q = data.questions[qi];
            let questionId: string;

            if (q.id) {
              // Scope the update to this Little Thing so a stale/foreign ID
              // cannot overwrite another record (and won't throw P2025).
              const updated = await tx.question.updateMany({
                where: { id: q.id, littleThingId },
                data: {
                  text: q.text,
                  order: qi,
                  stickerId: q.stickerId || null,
                },
              });
              if (updated.count === 1) {
                questionId = q.id;
              } else {
                const created = await tx.question.create({
                  data: {
                    littleThingId,
                    text: q.text,
                    order: qi,
                    stickerId: q.stickerId || null,
                  },
                });
                questionId = created.id;
              }
            } else {
              const created = await tx.question.create({
                data: {
                  littleThingId,
                  text: q.text,
                  order: qi,
                  stickerId: q.stickerId || null,
                },
              });
              questionId = created.id;
            }

            keepQuestionIds.add(questionId);

            const savedAnswers: SavedQuestion["answers"] = [];

            for (let ai = 0; ai < q.answers.length; ai++) {
              const a = q.answers[ai];
              let answerId: string;

              if (a.id) {
                const updated = await tx.answer.updateMany({
                  where: { id: a.id, questionId },
                  data: { text: a.text, order: ai },
                });
                if (updated.count === 1) {
                  answerId = a.id;
                } else {
                  const created = await tx.answer.create({
                    data: {
                      questionId,
                      text: a.text,
                      order: ai,
                    },
                  });
                  answerId = created.id;
                }
              } else {
                const created = await tx.answer.create({
                  data: {
                    questionId,
                    text: a.text,
                    order: ai,
                  },
                });
                answerId = created.id;
              }

              keepAnswerIds.add(answerId);
              savedAnswers.push({ id: answerId, text: a.text });
            }

            const existingAnswers = await tx.answer.findMany({
              where: { questionId },
              select: { id: true },
            });

            for (const ea of existingAnswers) {
              if (!keepAnswerIds.has(ea.id) && !referencedAnswerIds.has(ea.id)) {
                await tx.answer.delete({ where: { id: ea.id } });
              }
            }

            questions.push({
              id: questionId,
              text: q.text,
              stickerId: q.stickerId || null,
              answers: savedAnswers,
            });
          }

          const existingQuestions = await tx.question.findMany({
            where: { littleThingId },
            select: { id: true },
          });

          for (const eq of existingQuestions) {
            if (!keepQuestionIds.has(eq.id) && !referencedQuestionIds.has(eq.id)) {
              await tx.question.delete({ where: { id: eq.id } });
            }
          }

          return questions;
        }, MUTATION_TX_OPTIONS);

        return { kind: "ok", questions: savedQuestions };
      }
    );

    if (result.kind === "forbidden") {
      return NextResponse.json(
        { error: "That private link isn't valid anymore. 💌" },
        { status: 403 }
      );
    }
    if (result.kind === "not_found") {
      return NextResponse.json(
        { error: "We couldn't find this little thing. 💌" },
        { status: 404 }
      );
    }
    if (result.kind === "archived") {
      return NextResponse.json(
        { error: "This little thing has been archived and can't be edited. 💌" },
        { status: 400 }
      );
    }
    if (result.kind === "question_locked") {
      return NextResponse.json(
        {
          error:
            "This question can't be removed because someone has already answered it. 💌",
        },
        { status: 400 }
      );
    }
    if (result.kind === "answer_locked") {
      return NextResponse.json(
        {
          error:
            "This answer can't be removed because someone has already selected it. 💌",
        },
        { status: 400 }
      );
    }

    logApiEvent({
      operation: "edit-little-thing",
      httpStatus: 200,
      txSucceeded: true,
    });

    return NextResponse.json({ success: true, questions: result.questions });
  } catch (error) {
    logCaughtError("edit-little-thing", error, { txSucceeded: false });
    return NextResponse.json(
      {
        error:
          "We couldn't save your changes just yet. Please try again. 💕",
      },
      { status: 500 }
    );
  }
}
