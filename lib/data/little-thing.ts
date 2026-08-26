// LittleThing data access operations.
// All functions are server-only — never import in client components.

import { prisma } from "../prisma";
import type { LittleThingStatus } from "../../generated/prisma/client";

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function createLittleThing(data: {
  title: string;
  introMessage?: string;
  creatorName?: string;
  recipientName?: string;
}) {
  // Generate a unique publicId using crypto
  const publicId = crypto.randomUUID();

  return prisma.littleThing.create({
    data: {
      ...data,
      publicId,
    },
  });
}

// ---------------------------------------------------------------------------
// Read — by internal ID
// ---------------------------------------------------------------------------

export async function getLittleThingById(id: string) {
  return prisma.littleThing.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          answers: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });
}

// ---------------------------------------------------------------------------
// Read — by publicId (public recipient access)
// ---------------------------------------------------------------------------

export async function getLittleThingByPublicId(publicId: string) {
  return prisma.littleThing.findUnique({
    where: { publicId },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          answers: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });
}

/**
 * Get a published Little Thing for public recipient access.
 * Returns null for draft or archived Little Things.
 */
export async function getPublishedLittleThingByPublicId(publicId: string) {
  return prisma.littleThing.findFirst({
    where: {
      publicId,
      status: "PUBLISHED",
    },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          answers: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export async function updateLittleThing(
  id: string,
  data: {
    title?: string;
    introMessage?: string;
    creatorName?: string;
    recipientName?: string;
  }
) {
  return prisma.littleThing.update({
    where: { id },
    data,
  });
}

// ---------------------------------------------------------------------------
// Update status
// ---------------------------------------------------------------------------

export async function updateLittleThingStatus(
  id: string,
  status: LittleThingStatus
) {
  return prisma.littleThing.update({
    where: { id },
    data: { status },
  });
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

export async function deleteLittleThing(id: string) {
  // Cascade deletion handles questions, answers, responses, responseAnswers
  return prisma.littleThing.delete({
    where: { id },
  });
}

// ---------------------------------------------------------------------------
// List (for future use)
// ---------------------------------------------------------------------------

export async function listLittleThings(filters?: {
  status?: LittleThingStatus;
}) {
  return prisma.littleThing.findMany({
    where: filters,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { questions: true, responses: true },
      },
    },
  });
}
