"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LittleThingShell,
  LittleThingIntro,
  LittleThingQuestion,
  LittleThingProgress,
  LittleThingComplete,
} from "@/components/little-thing";
import { useTranslation } from "@/lib/i18n";
import { LanguageToggle } from "@/components/ui/language-toggle";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RecipientAnswer = { id: string; text: string; order: number };
type RecipientQuestion = {
  id: string;
  text: string;
  order: number;
  stickerId: string | null;
  answers: RecipientAnswer[];
};

export type RecipientLittleThing = {
  publicId: string;
  title: string;
  introMessage: string | null;
  creatorName: string | null;
  recipientName: string | null;
  questions: RecipientQuestion[];
};

interface RecipientPageProps {
  littleThing: RecipientLittleThing;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RecipientPage({ littleThing }: RecipientPageProps) {
  const { t } = useTranslation();

  // Interaction state
  const [phase, setPhase] = useState<"intro" | "questions" | "submitting" | "complete" | "error">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  // Submission state
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = littleThing.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // --- Start answering ---
  const handleStart = useCallback(() => {
    setPhase("questions");
  }, []);

  // --- Answer selection ---
  const handleSelectAnswer = useCallback(
    (answerId: string) => {
      if (!currentQuestion) return;

      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: answerId,
      }));

      // Auto-advance after a short delay
      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        } else {
          // All questions answered — submit
          setPhase("submitting");
        }
      }, 600);
    },
    [currentQuestion, currentQuestionIndex, totalQuestions]
  );

  // --- Submit response ---
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Build the answers array
    const answers = Object.entries(selectedAnswers).map(
      ([questionId, answerId]) => ({
        questionId,
        answerId,
      })
    );

    try {
      const res = await fetch(
        `/api/little-things/${littleThing.publicId}/responses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(
          data.error ??
            t("recipientSubmitError")
        );
        setIsSubmitting(false);
        setPhase("error");
        return;
      }

      setPhase("complete");
    } catch {
      setSubmitError(
        t("recipientSubmitError")
      );
      setIsSubmitting(false);
      setPhase("error");
    }
  }, [littleThing.publicId, selectedAnswers, t]);

  // --- Auto-submit when phase changes to submitting ---
  const hasSubmittedRef = useRef(false);
  useEffect(() => {
    if (phase === "submitting" && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      handleSubmit();
    }
    if (phase !== "submitting") {
      hasSubmittedRef.current = false;
    }
  }, [phase, handleSubmit]);

  // --- Retry after error ---
  const handleRetry = useCallback(() => {
    setPhase("submitting");
    setSubmitError(null);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-12 sm:px-6 sm:py-16">
      {/* Language toggle — top right */}
      <div className="fixed right-4 top-4 z-30">
        <LanguageToggle />
      </div>

      {/* Intro phase */}
      {phase === "intro" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto flex w-full max-w-sm flex-col gap-5 text-center sm:gap-6"
        >
          <p className="font-handwritten text-lg text-primary">
            {t("recipientIntroLine")}
          </p>

          <LittleThingShell>
            <LittleThingIntro
              title={littleThing.title}
              introMessage={littleThing.introMessage}
              recipientName={littleThing.recipientName}
            />

            {littleThing.creatorName && (
              <p className="mt-2 text-center text-sm text-foreground-muted">
                — {littleThing.creatorName}
              </p>
            )}

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleStart}
                className="rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:shadow-lg active:scale-[0.98]"
              >
                {t("recipientBegin")}
              </button>
            </div>
          </LittleThingShell>
        </motion.div>
      )}

      {/* Questions phase */}
      {phase === "questions" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto w-full max-w-sm"
        >
          <LittleThingShell>
            {/* Questions */}
            <div className="min-h-[260px]">
              <AnimatePresence mode="wait">
                {currentQuestion && (
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <LittleThingQuestion
                      questionText={currentQuestion.text}
                      stickerId={currentQuestion.stickerId}
                      answers={currentQuestion.answers}
                      selectedAnswerId={
                        selectedAnswers[currentQuestion.id] ?? null
                      }
                      onSelect={handleSelectAnswer}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress */}
            <LittleThingProgress
              current={currentQuestionIndex + 1}
              total={totalQuestions}
            />
          </LittleThingShell>
        </motion.div>
      )}

      {/* Submitting phase */}
      {phase === "submitting" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto w-full max-w-sm text-center"
        >
          <LittleThingShell>
            <div className="min-h-[180px] flex flex-col items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="mt-4 text-sm text-foreground-muted">
                {t("recipientSaving")}
              </p>
            </div>
          </LittleThingShell>
        </motion.div>
      )}

      {/* Error phase */}
      {phase === "error" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto w-full max-w-sm text-center"
        >
          <LittleThingShell>
            <div className="min-h-[180px] flex flex-col items-center justify-center">
              <p className="text-3xl">💌</p>
              <p className="mt-4 text-sm text-foreground-muted">
                {submitError}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                disabled={isSubmitting}
                className="mt-4 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary-hover disabled:opacity-50"
              >
                {t("recipientTryAgain")}
              </button>
            </div>
          </LittleThingShell>
        </motion.div>
      )}

      {/* Complete phase */}
      {phase === "complete" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto w-full max-w-sm"
        >
          <LittleThingShell>
            <LittleThingComplete creatorName={littleThing.creatorName} />
          </LittleThingShell>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-foreground-muted">
              {t("recipientThanks")}
            </p>
            {littleThing.creatorName && (
              <p className="mt-1 text-xs text-foreground-subtle">
                {t("recipientDoneDesc", { creator: littleThing.creatorName })}
              </p>
            )}
            <p className="mt-6 text-xs text-foreground-subtle">
              {t("madeWith", { brand: "DearUs" })} 💕
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
