// Zod validation schemas
// Complete schemas will be added in Milestone 1.

import { z } from "zod";

/**
 * Minimal schema for a Little Thing.
 * Placeholder — will be expanded significantly in Milestone 1.
 */
export const littleThingSchema = z.object({
  title: z
    .string()
    .min(1, "A title is required")
    .max(100, "Title must be 100 characters or less"),
});

export type LittleThingInput = z.infer<typeof littleThingSchema>;
