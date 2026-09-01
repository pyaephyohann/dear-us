"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

interface AnswerItemProps {
  answerId: string;
  text: string;
  index: number;
  total: number;
  onChange: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export function AnswerItem({
  answerId,
  text,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: AnswerItemProps) {
  const { t } = useTranslation();
  const canDelete = total > 2;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2"
    >
      {/* Radio dot decoration */}
      <span className="mt-0.5 h-3 w-3 shrink-0 rounded-full border-2 border-foreground-subtle" />

      {/* Text input */}
      <input
        type="text"
        value={text}
        onChange={(e) => onChange(answerId, e.target.value)}
        placeholder={`${t("answerPlaceholder")} ${index + 1}`}
        className="flex-1 bg-transparent px-1 py-1.5 text-sm text-foreground placeholder-foreground-subtle outline-none border-b border-transparent focus:border-border-light focus:outline-none focus-visible:outline-none transition-colors"
        aria-label={`Answer ${index + 1}`}
      />

      {/* Move controls */}
      <button
        type="button"
        onClick={() => onMoveUp(answerId)}
        disabled={index === 0}
        aria-label="Move answer up"
        className="rounded-lg p-2 text-xs text-foreground-subtle hover:bg-background-secondary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={() => onMoveDown(answerId)}
        disabled={index === total - 1}
        aria-label="Move answer down"
        className="rounded-lg p-2 text-xs text-foreground-subtle hover:bg-background-secondary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
      >
        ↓
      </button>

      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete(answerId)}
        disabled={!canDelete}
        aria-label="Delete answer"
        title={!canDelete ? t("deleteTooltipMinAnswers") : undefined}
        className="rounded-lg p-2 text-xs text-foreground-subtle hover:bg-primary-light hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
      >
        ✕
      </button>
    </motion.div>
  );
}
