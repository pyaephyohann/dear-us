"use client";

import { motion } from "framer-motion";
import type { QuestionDraft } from "./types";
import { AnswerList } from "./answer-list";
import { StickerPicker } from "@/components/ui/sticker-picker";
import { useTranslation } from "@/lib/i18n";

interface QuestionCardProps {
  question: QuestionDraft;
  index: number;
  total: number;
  questionErrors: Record<string, string | undefined>;
  onTextChange: (id: string, text: string) => void;
  onStickerChange: (id: string, stickerId: string | null) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onAnswerAdd: (questionId: string) => void;
  onAnswerChange: (questionId: string, answerId: string, text: string) => void;
  onAnswerDelete: (questionId: string, answerId: string) => void;
  onAnswerMoveUp: (questionId: string, answerId: string) => void;
  onAnswerMoveDown: (questionId: string, answerId: string) => void;
}

export function QuestionCard({
  question,
  index,
  total,
  questionErrors,
  onTextChange,
  onStickerChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAnswerAdd,
  onAnswerChange,
  onAnswerDelete,
  onAnswerMoveUp,
  onAnswerMoveDown,
}: QuestionCardProps) {
  const { t } = useTranslation();
  const canDelete = total > 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-border-light bg-white p-5 shadow-sm sm:p-6"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        {/* Question number */}
        <span className="font-roboto text-lg font-bold text-primary/30">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex items-center gap-0.5">
          {/* Reorder buttons */}
          <button
            type="button"
            onClick={() => onMoveUp(question.id)}
            disabled={index === 0}
            aria-label="Move question up"
            className="rounded-lg p-2 text-xs text-foreground-subtle hover:bg-background-secondary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(question.id)}
            disabled={index === total - 1}
            aria-label="Move question down"
            className="rounded-lg p-2 text-xs text-foreground-subtle hover:bg-background-secondary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            ↓
          </button>

          {/* Delete question */}
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(question.id)}
              aria-label="Delete question"
              className="rounded-lg p-2 text-xs text-foreground-subtle hover:bg-primary-light hover:text-primary transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Question text input */}
      <div className="mt-3">
        <input
          type="text"
          value={question.text}
          onChange={(e) => onTextChange(question.id, e.target.value)}
          placeholder={t("questionPlaceholder")}
          className="w-full bg-transparent text-base font-medium text-foreground placeholder-foreground-subtle outline-none border-b border-border-light focus:border-primary focus:outline-none focus-visible:outline-none transition-colors pb-2"
          aria-label={`Question ${index + 1} text`}
        />
        {questionErrors.text && (
          <p className="mt-1 text-xs text-primary">{questionErrors.text}</p>
        )}
      </div>

      {/* Sticker picker */}
      <StickerPicker
        selectedStickerId={question.stickerId}
        onSelect={(stickerId) => onStickerChange(question.id, stickerId)}
      />

      {/* Answers */}
      <div className="mt-4">
        <p className="text-xs font-medium text-foreground-subtle mb-2">{t("answersLabel")}</p>
        <AnswerList
          answers={question.answers}
          onAdd={() => onAnswerAdd(question.id)}
          onChange={(answerId, text) => onAnswerChange(question.id, answerId, text)}
          onDelete={(answerId) => onAnswerDelete(question.id, answerId)}
          onMoveUp={(answerId) => onAnswerMoveUp(question.id, answerId)}
          onMoveDown={(answerId) => onAnswerMoveDown(question.id, answerId)}
        />
      </div>

      {questionErrors.answers && (
        <p className="mt-2 text-xs text-primary">{questionErrors.answers}</p>
      )}
    </motion.div>
  );
}
