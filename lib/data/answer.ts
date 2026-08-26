// Answer data access operations.
// All functions are server-only — never import in client components.

import { prisma } from "../prisma";

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function createAnswer(data: {
  questionId: string;
  text: string;
  order: number;
}) {
  return prisma.answer.create({
    data,
  });
}

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export async function getAnswerById(id: string) {
  return prisma.answer.findUnique({
    where: { id },
  });
}

export async function getAnswersByQuestion(questionId: string) {
  return prisma.answer.findMany({
    where: { questionId },
    orderBy: { order: "asc" },
  });
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export async function updateAnswer(
  id: string,
  data: { text?: string; order?: number }
) {
  return prisma.answer.update({
    where: { id },
    data,
  });
}

// ---------------------------------------------------------------------------
// Reorder
// ---------------------------------------------------------------------------

/**
 * Reorder answers within a Question.
 * Accepts an ordered array of answer IDs — the new order is their index.
 */
export async function reorderAnswers(questionId: string, answerIds: string[]) {
  // Verify all answers belong to this Question
  const existing = await prisma.answer.findMany({
    where: {
      id: { in: answerIds },
      questionId,
    },
    select: { id: true },
  });

  if (existing.length !== answerIds.length) {
    throw new Error(
      "One or more answer IDs do not belong to this Question"
    );
  }

  // Update in a transaction
  return prisma.$transaction(
    answerIds.map((id, index) =>
      prisma.answer.update({
        where: { id },
        data: { order: index },
      })
    )
  );
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

export async function deleteAnswer(id: string) {
  // Cascade deletion handles responseAnswers
  return prisma.answer.delete({
    where: { id },
  });
}
