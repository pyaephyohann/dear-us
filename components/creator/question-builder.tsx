"use client";

import { AnimatePresence } from "framer-motion";
import type { QuestionDraft } from "./types";
import { QuestionCard } from "./question-card";

interface QuestionBuilderProps {
  questions: QuestionDraft[];
  questionErrors: Record<number, Record<string, string | undefined>>;
  onAddQuestion: () => void;
  onQuestionTextChange: (id: string, text: string) => void;
  onQuestionDelete: (id: string) => void;
  onQuestionMoveUp: (id: string) => void;
  onQuestionMoveDown: (id: string) => void;
  onAnswerAdd: (questionId: string) => void;
  onAnswerChange: (questionId: string, answerId: string, text: string) => void;
  onAnswerDelete: (questionId: string, answerId: string) => void;
  onAnswerMoveUp: (questionId: string, answerId: string) => void;
  onAnswerMoveDown: (questionId: string, answerId: string) => void;
}

export function QuestionBuilder({
  questions,
  questionErrors,
  onAddQuestion,
  onQuestionTextChange,
  onQuestionDelete,
  onQuestionMoveUp,
  onQuestionMoveDown,
  onAnswerAdd,
  onAnswerChange,
  onAnswerDelete,
  onAnswerMoveUp,
  onAnswerMoveDown,
}: QuestionBuilderProps) {
  // Empty state
  if (questions.length === 0) {
    return (
      <section className="py-12 text-center">
        <p className="font-display text-lg font-medium text-foreground">
          Your little thing needs a few questions. 💕
        </p>
        <p className="mt-2 text-sm text-foreground-muted">
          Start with something simple...
        </p>
        <button
          type="button"
          onClick={onAddQuestion}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-light px-6 py-3 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground"
        >
          + Add Your First Question
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <AnimatePresence mode="popLayout">
        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            total={questions.length}
            questionErrors={questionErrors[i] ?? {}}
            onTextChange={onQuestionTextChange}
            onDelete={onQuestionDelete}
            onMoveUp={onQuestionMoveUp}
            onMoveDown={onQuestionMoveDown}
            onAnswerAdd={onAnswerAdd}
            onAnswerChange={onAnswerChange}
            onAnswerDelete={onAnswerDelete}
            onAnswerMoveUp={onAnswerMoveUp}
            onAnswerMoveDown={onAnswerMoveDown}
          />
        ))}
      </AnimatePresence>

      {/* Add question button */}
      <div className="text-center">
        <button
          type="button"
          onClick={onAddQuestion}
          className="inline-flex items-center gap-2 rounded-full border border-dashed border-border px-6 py-3 text-sm font-medium text-foreground-muted transition-all hover:border-primary hover:bg-primary-light hover:text-primary"
        >
          + Add another question
        </button>
      </div>
    </section>
  );
}
