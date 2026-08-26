// Shared TypeScript types for DearUs
// Types that mirror Prisma-generated models without exposing internals.

import type { LittleThingStatus } from "../generated/prisma/client";

// ---------------------------------------------------------------------------
// Re-export Prisma enums for client-safe usage
// ---------------------------------------------------------------------------

export type { LittleThingStatus };

// ---------------------------------------------------------------------------
// Route parameter types
// ---------------------------------------------------------------------------

export type PageParams = {
  id: string;
};

export type LittleThingParams = {
  publicId: string;
};

// ---------------------------------------------------------------------------
// API Response types
// ---------------------------------------------------------------------------

/**
 * A safe subset of a Little Thing for public/client consumption.
 * Never expose internal IDs or database internals.
 */
export type PublicLittleThing = {
  publicId: string;
  title: string;
  introMessage: string | null;
  creatorName: string | null;
  recipientName: string | null;
  status: LittleThingStatus;
  createdAt: string;
  questions: PublicQuestion[];
};

export type PublicQuestion = {
  id: string;
  text: string;
  order: number;
  answers: PublicAnswer[];
};

export type PublicAnswer = {
  id: string;
  text: string;
  order: number;
};
