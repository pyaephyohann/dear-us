// Question data access operations.
// All functions are server-only — never import in client components.

import { prisma } from "../prisma";

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function createQuestion(data: {
  littleThingId: string;
  text: string;
  order: number;
  stickerId?: string | null;
}) {
  return prisma.question.create({
    data,
  });
}

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export async function getQuestionById(id: string) {
  return prisma.question.findUnique({
    where: { id },
    include: {
      answers: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getQuestionsByLittleThing(littleThingId: string) {
  return prisma.question.findMany({
    where: { littleThingId },
    orderBy: { order: "asc" },
    include: {
      answers: {
        orderBy: { order: "asc" },
      },
    },
  });
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export async function updateQuestion(
  id: string,
  data: { text?: string; order?: number; stickerId?: string | null }
) {
  return prisma.question.update({
    where: { id },
    data,
  });
}

// ---------------------------------------------------------------------------
// Reorder
// ---------------------------------------------------------------------------

/**
 * Reorder questions within a Little Thing.
 * Accepts an ordered array of question IDs — the new order is their index.
 */
export async function reorderQuestions(
  littleThingId: string,
  questionIds: string[]
) {
  // Verify all questions belong to this Little Thing
  const existing = await prisma.question.findMany({
    where: {
      id: { in: questionIds },
      littleThingId,
    },
    select: { id: true },
  });

  if (existing.length !== questionIds.length) {
    throw new Error(
      "One or more question IDs do not belong to this Little Thing"
    );
  }

  // Update in a transaction
  return prisma.$transaction(
    questionIds.map((id, index) =>
      prisma.question.update({
        where: { id },
        data: { order: index },
      })
    )
  );
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

export async function deleteQuestion(id: string) {
  // Cascade deletion handles answers and responseAnswers
  return prisma.question.delete({
    where: { id },
  });
}
