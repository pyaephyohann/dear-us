"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { StickerRenderer } from "@/lib/stickers";

const questions = [
  {
    text: "What's your favorite thing about me?",
    stickerId: "cat-love" as const,
    answers: ["My smile", "Your stupid jokes 😂", "Your personality", "Everything ❤️"],
    selected: 3,
  },
  {
    text: "Where should we go on our next date?",
    stickerId: null,
    answers: ["Coffee shop ☕", "The beach 🏖️", "Cozy movie night 🎬", "Surprise me! 🎁"],
    selected: null,
  },
  {
    text: "What song makes you think of us?",
    stickerId: "cat-happy" as const,
    answers: [
      "Our song 🎵",
      "Something by Taylor Swift",
      "That song from the cafe",
      "I haven't found it yet",
    ],
    selected: null,
  },
];

interface LittleThingPreviewProps {
  currentQuestion?: number;
  showProgress?: boolean;
}

export function LittleThingPreview({
  currentQuestion = 0,
  showProgress = true,
}: LittleThingPreviewProps) {
  const q = questions[currentQuestion] ?? questions[0];
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      <div className="rounded-2xl border border-border bg-white p-6 shadow-lg sm:p-8">
        {/* Header */}
        <p className="text-center font-handwritten text-lg text-primary">
          {t("previewCardHeader")}
        </p>
        <p className="text-center font-handwritten text-2xl text-foreground">
          {t("previewCardForYou")}
        </p>

        <p className="mt-4 text-center text-sm leading-relaxed text-foreground-muted">
          {t("previewCardIntro")}
        </p>

        {/* Divider */}
        <div className="my-5 border-t border-border-light" />

        {/* Sticker */}
        {q.stickerId && (
          <div className="mb-2 flex justify-center">
            <StickerRenderer stickerId={q.stickerId} size={48} />
          </div>
        )}

        {/* Question */}
        <p className="text-center text-base font-medium leading-snug text-foreground">
          {q.text}
        </p>

        {/* Answers */}
        <div className="mt-4 space-y-2">
          {q.answers.map((answer, i) => {
            const isSelected = q.selected === i;
            return (
              <div
                key={answer}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                  isSelected
                    ? "border-primary bg-primary-light text-foreground"
                    : "border-border-light bg-background text-foreground-muted"
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-foreground-subtle"
                  }`}
                >
                  {isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
                <span>{answer}</span>
              </div>
            );
          })}
        </div>

        {/* Progress */}
        {showProgress && (
          <p className="mt-5 text-center text-xs text-foreground-subtle">
            {t("previewCardQuestionOf", { current: currentQuestion + 1, total: questions.length })}
          </p>
        )}
      </div>
    </motion.div>
  );
}
