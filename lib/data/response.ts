// Response data access operations.
// All functions are server-only — never import in client components.

import { prisma } from "../prisma";
import type { ResponseAnswerInput } from "../validations";

// ---------------------------------------------------------------------------
// Create — with full server-side validation
// ---------------------------------------------------------------------------

/**
 * Submit a response for a published Little Thing.
 *
 * Validates:
 * - Little Thing exists and is PUBLISHED
 * - All question IDs belong to this Little Thing
 * - All answer IDs belong to their respective questions
 * - Every question receives exactly one answer
 * - No duplicate question selections
 */
export async function createResponse(
  littleThingId: string,
  answers: ResponseAnswerInput[]
) {
  // 1. Verify Little Thing exists and is published
  const littleThing = await prisma.littleThing.findUnique({
    where: { id: littleThingId },
    select: { id: true, status: true },
  });

  if (!littleThing) {
    throw new ResponseError("Little Thing not found", 404);
  }

  if (littleThing.status !== "PUBLISHED") {
    throw new ResponseError(
      "This Little Thing is not available for responses",
      403
    );
  }

  // 2. Fetch all questions and answers for this Little Thing
  const questions = await prisma.question.findMany({
    where: { littleThingId },
    include: { answers: { select: { id: true, questionId: true } } },
  });

  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const questionIds = new Set(questions.map((q) => q.id));

  // 3. Validate no duplicate question selections
  const submittedQuestionIds = answers.map((a) => a.questionId);
  const uniqueQuestionIds = new Set(submittedQuestionIds);
  if (uniqueQuestionIds.size !== submittedQuestionIds.length) {
    throw new ResponseError("Duplicate question selections are not allowed", 400);
  }

  // 4. Validate every submitted question belongs to this Little Thing
  for (const answer of answers) {
    if (!questionIds.has(answer.questionId)) {
      throw new ResponseError(
        `Question ${answer.questionId} does not belong to this Little Thing`,
        400
      );
    }
  }

  // 5. Validate answer ownership — each answer must belong to its question
  for (const answer of answers) {
    const question = questionMap.get(answer.questionId)!;
    const validAnswerIds = new Set(question.answers.map((a) => a.id));

    if (!validAnswerIds.has(answer.answerId)) {
      throw new ResponseError(
        `Answer ${answer.answerId} does not belong to question ${answer.questionId}`,
        400
      );
    }
  }

  // 6. Validate every question receives an answer
  if (answers.length !== questions.length) {
    throw new ResponseError(
      `Expected answers for ${questions.length} questions, received ${answers.length}`,
      400
    );
  }

  // 7. Create response with response answers in a transaction
  return prisma.$transaction(async (tx) => {
    const response = await tx.response.create({
      data: {
        littleThingId,
        completedAt: new Date(),
      },
    });

    await tx.responseAnswer.createMany({
      data: answers.map((a) => ({
        responseId: response.id,
        questionId: a.questionId,
        answerId: a.answerId,
      })),
    });

    return response;
  });
}

// ---------------------------------------------------------------------------
// Read — responses for a Little Thing
// ---------------------------------------------------------------------------

export async function getResponsesByLittleThing(littleThingId: string) {
  return prisma.response.findMany({
    where: { littleThingId },
    orderBy: { createdAt: "desc" },
    include: {
      responseAnswers: {
        orderBy: { question: { order: "asc" } },
        include: {
          question: { select: { id: true, text: true, order: true } },
          answer: { select: { id: true, text: true } },
        },
      },
    },
  });
}

export async function getResponseById(id: string) {
  return prisma.response.findUnique({
    where: { id },
    include: {
      responseAnswers: {
        orderBy: { question: { order: "asc" } },
        include: {
          question: { select: { id: true, text: true, order: true } },
          answer: { select: { id: true, text: true } },
        },
      },
    },
  });
}

/**
 * Get a response by ID, verifying it belongs to the specified Little Thing.
 * Returns null if the response doesn't exist or doesn't belong to the Little Thing.
 */
export async function getResponseByIdAndLittleThing(
  responseId: string,
  littleThingId: string
) {
  return prisma.response.findFirst({
    where: {
      id: responseId,
      littleThingId,
    },
    include: {
      responseAnswers: {
        orderBy: { question: { order: "asc" } },
        include: {
          question: { select: { id: true, text: true, order: true } },
          answer: { select: { id: true, text: true } },
        },
      },
    },
  });
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

/**
 * Delete a response by ID, verifying it belongs to the specified Little Thing.
 * Cascade deletion handles ResponseAnswer records.
 */
export async function deleteResponse(
  responseId: string,
  littleThingId: string
) {
  const response = await prisma.response.findFirst({
    where: { id: responseId, littleThingId },
    select: { id: true },
  });

  if (!response) {
    throw new ResponseError("Response not found", 404);
  }

  await prisma.response.delete({ where: { id: responseId } });
}

// ---------------------------------------------------------------------------
// Response reference checks (for edit safety)
// ---------------------------------------------------------------------------

/**
 * Check which question IDs are referenced by existing responses.
 * Returns a Set of question IDs that have response references.
 */
export async function getReferencedQuestionIds(
  littleThingId: string
): Promise<Set<string>> {
  const refs = await prisma.responseAnswer.findMany({
    where: {
      response: { littleThingId },
    },
    select: { questionId: true },
    distinct: ["questionId"],
  });

  return new Set(refs.map((r) => r.questionId));
}

/**
 * Check which answer IDs are referenced by existing responses.
 * Returns a Set of answer IDs that have response references.
 */
export async function getReferencedAnswerIds(
  littleThingId: string
): Promise<Set<string>> {
  const refs = await prisma.responseAnswer.findMany({
    where: {
      response: { littleThingId },
    },
    select: { answerId: true },
    distinct: ["answerId"],
  });

  return new Set(refs.map((r) => r.answerId));
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export type QuestionAnalytics = {
  questionId: string;
  questionText: string;
  questionOrder: number;
  totalAnswers: number;
  answers: {
    answerId: string;
    answerText: string;
    answerOrder: number;
    count: number;
    percentage: number;
    isMostSelected: boolean;
  }[];
};

export type ResponseAnalytics = {
  totalResponses: number;
  firstResponseAt: string | null;
  latestResponseAt: string | null;
  activityByDate: { date: string; count: number }[];
  questions: QuestionAnalytics[];
};

/**
 * Get comprehensive analytics for a Little Thing's responses.
 * Server-side aggregation — never send raw ResponseAnswers to the client.
 */
export async function getResponseAnalytics(
  littleThingId: string
): Promise<ResponseAnalytics> {
  // 1. Response summary
  const responseSummary = await prisma.response.aggregate({
    where: { littleThingId },
    _count: { id: true },
    _min: { createdAt: true },
    _max: { createdAt: true },
  });

  const totalResponses = responseSummary._count.id;
  const firstResponseAt = responseSummary._min.createdAt?.toISOString() ?? null;
  const latestResponseAt = responseSummary._max.createdAt?.toISOString() ?? null;

  // 2. Activity by date (group responses by date)
  const responses = await prisma.response.findMany({
    where: { littleThingId },
    select: { createdAt: true },
  });

  const dateCounts = new Map<string, number>();
  for (const r of responses) {
    const dateKey = r.createdAt.toISOString().split("T")[0];
    dateCounts.set(dateKey, (dateCounts.get(dateKey) ?? 0) + 1);
  }

  const activityByDate = Array.from(dateCounts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 3. Answer distribution per question
  const questions = await prisma.question.findMany({
    where: { littleThingId },
    orderBy: { order: "asc" },
    include: {
      answers: {
        orderBy: { order: "asc" },
        select: { id: true, text: true, order: true },
      },
    },
  });

  const questionAnalytics: QuestionAnalytics[] = [];

  for (const question of questions) {
    // Count how many times each answer was selected
    const answerCounts = await prisma.responseAnswer.groupBy({
      by: ["answerId"],
      where: { questionId: question.id },
      _count: { answerId: true },
    });

    const countMap = new Map(answerCounts.map((ac) => [ac.answerId, ac._count.answerId]));
    const totalForQuestion = answerCounts.reduce((sum, ac) => sum + ac._count.answerId, 0);

    // Find most selected answer
    let maxCount = 0;
    for (const ac of answerCounts) {
      if (ac._count.answerId > maxCount) maxCount = ac._count.answerId;
    }

    const answerAnalytics = question.answers.map((a) => {
      const count = countMap.get(a.id) ?? 0;
      return {
        answerId: a.id,
        answerText: a.text,
        answerOrder: a.order,
        count,
        percentage: totalForQuestion > 0 ? Math.round((count / totalForQuestion) * 100) : 0,
        isMostSelected: count === maxCount && count > 0,
      };
    });

    questionAnalytics.push({
      questionId: question.id,
      questionText: question.text,
      questionOrder: question.order,
      totalAnswers: totalForQuestion,
      answers: answerAnalytics,
    });
  }

  return {
    totalResponses,
    firstResponseAt,
    latestResponseAt,
    activityByDate,
    questions: questionAnalytics,
  };
}

// ---------------------------------------------------------------------------
// Custom error class
// ---------------------------------------------------------------------------

export class ResponseError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ResponseError";
    this.statusCode = statusCode;
  }
}
