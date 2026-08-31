"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { StickerRenderer } from "@/lib/stickers";

const questions = [
  {
    text: "What's your favorite memory with me?",
    stickerId: "cat-love",
    answers: [
      "Our first date",
      "That rainy day",
      "The stupid things we laugh about",
      "All of them ❤️",
    ],
  },
  {
    text: "What do you love most about us?",
    stickerId: "cat-happy",
    answers: [
      "How safe I feel",
      "The little moments",
      "We never stop laughing",
      "Everything we're building",
    ],
  },
  {
    text: "Where should we be in five years?",
    stickerId: null,
    answers: [
      "Still laughing together",
      "Traveling the world",
      "Building our little home",
      "Wherever, as long as it's us",
    ],
  },
];

export function Example() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const { t } = useTranslation();

  const q = questions[current];

  function handleSelect(i: number) {
    setSelected(i);
    // Auto-advance after a short delay
    setTimeout(() => {
      setSelected(null);
      setCurrent((prev) => (prev + 1) % questions.length);
    }, 800);
  }

  return (
    <section id="example" className="px-5 py-20 sm:px-6 sm:py-28 bg-background-secondary">
      <div className="mx-auto max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          className="font-handwritten text-lg text-primary"
        >
          {t("exampleSubtitle")}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.05 }}
          className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          {t("exampleTitle")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-md text-sm text-foreground-muted sm:text-base"
        >
          {t("exampleDesc")}
        </motion.p>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-12 w-full max-w-sm"
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

            <div className="my-5 border-t border-border-light" />

            {/* Question with AnimatePresence */}
            <div className="min-h-[180px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {q.stickerId && (
                    <div className="mb-2 flex justify-center">
                      <StickerRenderer stickerId={q.stickerId} size={56} />
                    </div>
                  )}
                  <p className="text-center text-base font-medium leading-snug text-foreground">
                    {q.text}
                  </p>

                  <div className="mt-4 space-y-2">
                    {q.answers.map((answer, i) => {
                      const isSelected = selected === i;
                      return (
                        <button
                          key={answer}
                          type="button"
                          onClick={() => handleSelect(i)}
                          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                            isSelected
                              ? "border-primary bg-primary-light text-foreground scale-[1.02]"
                              : "border-border-light bg-background text-foreground-muted hover:border-secondary hover:bg-secondary-light"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
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
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress */}
            <p className="mt-5 text-center text-xs text-foreground-subtle">
              {t("previewCardQuestionOf", { current: current + 1, total: questions.length })}
            </p>

            {/* Progress bar */}
            <div className="mt-2 mx-auto h-1 w-32 overflow-hidden rounded-full bg-border-light">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>

        <p className="mt-4 text-xs text-foreground-subtle">
          {t("exampleStickerHint")}
        </p>
        <p className="mt-2 text-xs text-foreground-subtle">
          {t("exampleTapHint")}
        </p>
      </div>
    </section>
  );
}
