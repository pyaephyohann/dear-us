// GET /api/little-things/[id] — Fetch a Little Thing for preview.
// PATCH /api/little-things/[id] — Update a Little Thing atomically (creator token auth).

import { NextResponse } from "next/server";
import { getLittleThingById, getLittleThingByCreatorToken } from "@/lib/data/little-thing";
import { prisma } from "@/lib/prisma";
import { littleThingFullUpdateSchema } from "@/lib/validations";

type RouteParams = {
  params: Promise<{ id: string }>;
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
  } catch {
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

    // 1. Parse body
    const body = await request.json();

    // 2. Verify creatorAccessToken is provided
    if (!body.creatorAccessToken || typeof body.creatorAccessToken !== "string") {
      return NextResponse.json(
        { error: "Creator access token is required. 💌" },
        { status: 401 }
      );
    }

    // 3. Verify the token maps to this LittleThing
    const tokenLittleThing = await getLittleThingByCreatorToken(body.creatorAccessToken);
    if (!tokenLittleThing || tokenLittleThing.id !== littleThingId) {
      return NextResponse.json(
        { error: "That private link isn't valid anymore. 💌" },
        { status: 403 }
      );
    }

    // 4. Validate body with Zod
    const parsed = littleThingFullUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const data = parsed.data;

    // 5. Verify the Little Thing exists
    const existing = await getLittleThingById(littleThingId);
    if (!existing) {
      return NextResponse.json(
        { error: "We couldn't find this little thing. 💌" },
        { status: 404 }
      );
    }

    // 3. Prevent editing archived Little Things
    if (existing.status === "ARCHIVED") {
      return NextResponse.json(
        { error: "This little thing has been archived and can't be edited. 💌" },
        { status: 400 }
      );
    }

    // 4. Collect existing response references to protect them
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

    // 5. Validate that questions/answers with response references aren't being removed
    const submittedQuestionIds = new Set(
      data.questions.filter((q) => q.id).map((q) => q.id!)
    );
    const submittedAnswerIds = new Set(
      data.questions.flatMap((q) => q.answers.filter((a) => a.id).map((a) => a.id!))
    );

    for (const rqId of referencedQuestionIds) {
      if (!submittedQuestionIds.has(rqId)) {
        return NextResponse.json(
          {
            error:
              "This question can't be removed because someone has already answered it. 💌",
          },
          { status: 400 }
        );
      }
    }

    for (const raId of referencedAnswerIds) {
      if (!submittedAnswerIds.has(raId)) {
        return NextResponse.json(
          {
            error:
              "This answer can't be removed because someone has already selected it. 💌",
          },
          { status: 400 }
        );
      }
    }

    // 6. Atomic save in a transaction
    await prisma.$transaction(async (tx) => {
      // Update basic info
      await tx.littleThing.update({
        where: { id: littleThingId },
        data: {
          title: data.title,
          introMessage: data.introMessage || null,
          creatorName: data.creatorName || null,
          recipientName: data.recipientName || null,
        },
      });

      // Build sets of IDs we expect to keep
      const keepQuestionIds = new Set<string>();
      const keepAnswerIds = new Set<string>();

      // Process each question in order
      for (let qi = 0; qi < data.questions.length; qi++) {
        const q = data.questions[qi];

        let questionId: string;

        if (q.id) {
          // Existing question — update text, order, and sticker
          await tx.question.update({
            where: { id: q.id },
            data: { text: q.text, order: qi, stickerId: q.stickerId || null },
          });
          questionId = q.id;
          keepQuestionIds.add(q.id);
        } else {
          // New question — create
          const created = await tx.question.create({
            data: {
              littleThingId,
              text: q.text,
              order: qi,
              stickerId: q.stickerId || null,
            },
          });
          questionId = created.id;
          keepQuestionIds.add(created.id);
        }

        // Process answers for this question
        for (let ai = 0; ai < q.answers.length; ai++) {
          const a = q.answers[ai];

          if (a.id) {
            // Existing answer — update text and order
            await tx.answer.update({
              where: { id: a.id },
              data: { text: a.text, order: ai },
            });
            keepAnswerIds.add(a.id);
          } else {
            // New answer — create
            const created = await tx.answer.create({
              data: {
                questionId,
                text: a.text,
                order: ai,
              },
            });
            keepAnswerIds.add(created.id);
          }
        }

        // Delete answers that were removed (but not referenced by responses)
        const existingAnswers = await tx.answer.findMany({
          where: { questionId },
          select: { id: true },
        });

        for (const ea of existingAnswers) {
          if (!keepAnswerIds.has(ea.id) && !referencedAnswerIds.has(ea.id)) {
            await tx.answer.delete({ where: { id: ea.id } });
          }
        }
      }

      // Delete questions that were removed (but not referenced by responses)
      const existingQuestions = await tx.question.findMany({
        where: { littleThingId },
        select: { id: true },
      });

      for (const eq of existingQuestions) {
        if (!keepQuestionIds.has(eq.id) && !referencedQuestionIds.has(eq.id)) {
          await tx.question.delete({ where: { id: eq.id } });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "We couldn't save your changes just yet. Please try again. 💕",
      },
      { status: 500 }
    );
  }
}
