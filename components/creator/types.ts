// Client-side types for the creator form state.
// These are local to the creator experience — not shared globally.

export type AnswerDraft = {
  id: string;
  text: string;
};

export type QuestionDraft = {
  id: string;
  text: string;
  answers: AnswerDraft[];
};

export type LittleThingDraft = {
  title: string;
  introMessage: string;
  creatorName: string;
  recipientName: string;
  questions: QuestionDraft[];
};
