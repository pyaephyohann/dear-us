"use client";

import { AnimatePresence } from "framer-motion";
import type { AnswerDraft } from "./types";
import { AnswerItem } from "./answer-item";

interface AnswerListProps {
  answers: AnswerDraft[];
  onAdd: () => void;
  onChange: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export function AnswerList({
  answers,
  onAdd,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: AnswerListProps) {
  return (
    <div className="space-y-1">
      <AnimatePresence mode="popLayout">
        {answers.map((a, i) => (
          <AnswerItem
            key={a.id}
            answerId={a.id}
            text={a.text}
            index={i}
            total={answers.length}
            onChange={onChange}
            onDelete={onDelete}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
          />
        ))}
      </AnimatePresence>

      {/* Add answer button */}
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 text-sm text-primary hover:text-primary-hover transition-colors"
      >
        + Add answer
      </button>
    </div>
  );
}
