"use client";

import { motion } from "framer-motion";
import { StickerRenderer } from "@/lib/stickers";

interface LittleThingQuestionProps {
  questionText: string;
  stickerId?: string | null;
  answers: { id: string; text: string }[];
  selectedAnswerId: string | null;
  onSelect: (answerId: string) => void;
}

/**
 * A single question with its answer options.
 * Supports answer selection with visual feedback.
 * Reusable by both preview and recipient pages.
 */
export function LittleThingQuestion({
  questionText,
  stickerId,
  answers,
  selectedAnswerId,
  onSelect,
}: LittleThingQuestionProps) {
  return (
    <div className="min-h-[180px]">
      {/* Cat sticker */}
      {stickerId && (
        <div className="mb-4">
          <StickerRenderer stickerId={stickerId} size={80} />
        </div>
      )}
      <p className="text-center text-base font-medium leading-snug text-foreground">
        {questionText}
      </p>

      <div className="mt-5 space-y-2">
        {answers.map((answer) => {
          const isSelected = selectedAnswerId === answer.id;
          return (
            <motion.button
              key={answer.id}
              type="button"
              onClick={() => onSelect(answer.id)}
              whileTap={{ scale: 0.98 }}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                isSelected
                  ? "border-primary bg-primary-light text-foreground scale-[1.02]"
                  : "border-border-light bg-background text-foreground-muted hover:border-secondary hover:bg-secondary-light"
              }`}
              role="radio"
              aria-checked={isSelected}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-foreground-subtle"
                }`}
              >
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <span>{answer.text}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
