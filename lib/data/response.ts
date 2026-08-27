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
