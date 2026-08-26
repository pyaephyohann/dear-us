// Zod validation schemas for DearUs
// Used at API/server boundaries — never trust client input.

import { z } from "zod";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TITLE_MAX = 200;
const MESSAGE_MAX = 500;
const NAME_MAX = 100;
const QUESTION_TEXT_MAX = 500;
const ANSWER_TEXT_MAX = 200;

// ---------------------------------------------------------------------------
// LittleThing
// ---------------------------------------------------------------------------

export const littleThingCreateSchema = z.object({
  title: z
    .string()
    .min(1, "A title is required")
    .max(TITLE_MAX, `Title must be ${TITLE_MAX} characters or less`),
  introMessage: z
    .string()
    .max(MESSAGE_MAX, `Intro message must be ${MESSAGE_MAX} characters or less`)
    .optional(),
  creatorName: z
    .string()
    .max(NAME_MAX, `Creator name must be ${NAME_MAX} characters or less`)
    .optional(),
  recipientName: z
    .string()
    .max(NAME_MAX, `Recipient name must be ${NAME_MAX} characters or less`)
    .optional(),
});

export const littleThingUpdateSchema = littleThingCreateSchema.partial();

export const littleThingStatusSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export type LittleThingCreateInput = z.infer<typeof littleThingCreateSchema>;
export type LittleThingUpdateInput = z.infer<typeof littleThingUpdateSchema>;
export type LittleThingStatusInput = z.infer<typeof littleThingStatusSchema>;

// ---------------------------------------------------------------------------
// Question
// ---------------------------------------------------------------------------

export const questionCreateSchema = z.object({
  text: z
    .string()
    .min(1, "Question text is required")
    .max(QUESTION_TEXT_MAX, `Question text must be ${QUESTION_TEXT_MAX} characters or less`),
  order: z.number().int().min(0, "Order must be a non-negative integer"),
});

export const questionUpdateSchema = z.object({
  text: z
    .string()
    .min(1, "Question text is required")
    .max(QUESTION_TEXT_MAX, `Question text must be ${QUESTION_TEXT_MAX} characters or less`)
    .optional(),
  order: z.number().int().min(0, "Order must be a non-negative integer").optional(),
});

export const reorderQuestionsSchema = z.object({
  questionIds: z.array(z.string()).min(1, "At least one question ID is required"),
});

export type QuestionCreateInput = z.infer<typeof questionCreateSchema>;
export type QuestionUpdateInput = z.infer<typeof questionUpdateSchema>;
export type ReorderQuestionsInput = z.infer<typeof reorderQuestionsSchema>;

// ---------------------------------------------------------------------------
// Answer
// ---------------------------------------------------------------------------

export const answerCreateSchema = z.object({
  text: z
    .string()
    .min(1, "Answer text is required")
    .max(ANSWER_TEXT_MAX, `Answer text must be ${ANSWER_TEXT_MAX} characters or less`),
  order: z.number().int().min(0, "Order must be a non-negative integer"),
});

export const answerUpdateSchema = z.object({
  text: z
    .string()
    .min(1, "Answer text is required")
    .max(ANSWER_TEXT_MAX, `Answer text must be ${ANSWER_TEXT_MAX} characters or less`)
    .optional(),
  order: z.number().int().min(0, "Order must be a non-negative integer").optional(),
});

export const reorderAnswersSchema = z.object({
  answerIds: z.array(z.string()).min(1, "At least one answer ID is required"),
});

export type AnswerCreateInput = z.infer<typeof answerCreateSchema>;
export type AnswerUpdateInput = z.infer<typeof answerUpdateSchema>;
export type ReorderAnswersInput = z.infer<typeof reorderAnswersSchema>;

// ---------------------------------------------------------------------------
// Response submission
// ---------------------------------------------------------------------------

export const responseAnswerSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  answerId: z.string().min(1, "Answer ID is required"),
});

export const responseSubmitSchema = z
  .object({
    answers: z
      .array(responseAnswerSchema)
      .min(1, "At least one answer is required"),
  })
  .refine(
    (data) => {
      const questionIds = data.answers.map((a) => a.questionId);
      return new Set(questionIds).size === questionIds.length;
    },
    { message: "Duplicate question selections are not allowed" }
  );

export type ResponseAnswerInput = z.infer<typeof responseAnswerSchema>;
export type ResponseSubmitInput = z.infer<typeof responseSubmitSchema>;
