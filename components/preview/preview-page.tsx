"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LittleThingShell,
  LittleThingIntro,
  LittleThingQuestion,
  LittleThingProgress,
  LittleThingComplete,
} from "@/components/little-thing";
import { PreviewHeader } from "./preview-header";
import { PreviewActions } from "./preview-actions";
import { useTranslation } from "@/lib/i18n";
import { FloatingLanguageToggle } from "@/components/ui/floating-language-toggle";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PreviewAnswer = { id: string; text: string; order: number };
type PreviewQuestion = {
  id: string;
  text: string;
  order: number;
  stickerId: string | null;
  answers: PreviewAnswer[];
};

export type PreviewLittleThing = {
  id: string;
  publicId: string;
  creatorAccessToken: string;
  title: string;
  introMessage: string | null;
  creatorName: string | null;
  recipientName: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
  questions: PreviewQuestion[];
};

interface PreviewPageProps {
  littleThing: PreviewLittleThing;
}

// ---------------------------------------------------------------------------
// Validation — can this Little Thing be published?
// ---------------------------------------------------------------------------

function canPublishLittleThing(lt: PreviewLittleThing): boolean {
  if (!lt.title.trim()) return false;
  if (lt.questions.length === 0) return false;

  return lt.questions.every(
    (q) =>
      q.text.trim().length > 0 &&
      q.answers.length >= 2 &&
      q.answers.every((a) => a.text.trim().length > 0)
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PreviewPage({ littleThing }: PreviewPageProps) {
  const router = useRouter();
  const { t } = useTranslation();

  // Local interaction state — no database writes
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isComplete, setIsComplete] = useState(false);

  // Publish state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const questions = littleThing.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isValid = canPublishLittleThing(littleThing);
  const isPublished = littleThing.status === "PUBLISHED";

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
          setIsComplete(true);
        }
      }, 600);
    },
    [currentQuestion, currentQuestionIndex, totalQuestions]
  );

  // --- Restart preview ---
  const handleRestart = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsComplete(false);
  }, []);

  // --- Publish ---
  const handlePublish = useCallback(async () => {
    setPublishError(null);
    setIsPublishing(true);

    try {
      const res = await fetch(`/api/little-things/${littleThing.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorAccessToken: littleThing.creatorAccessToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(
          data.error ??
            t("saveError")
        );
        setIsPublishing(false);
        return;
      }

      // Navigate to share page with creator token
      router.push(`/share/${data.creatorAccessToken}`);
    } catch {
      setPublishError(
        t("saveError")
      );
      setIsPublishing(false);
    }
  }, [littleThing.id, littleThing.creatorAccessToken, router, t]);

  return (
    <div className="relative flex min-h-screen flex-col items-center px-5 py-12 sm:px-6 sm:py-16">
      <FloatingLanguageToggle />
      {/* Preview header */}
      <PreviewHeader status={littleThing.status} />

      {/* The Little Thing card */}
      <LittleThingShell>
        {/* Intro (shown before first question) */}
        {!isComplete && currentQuestionIndex === 0 && (
          <LittleThingIntro
            title={littleThing.title}
            introMessage={littleThing.introMessage}
            recipientName={littleThing.recipientName}
          />
        )}

        {/* Questions */}
        {!isComplete && currentQuestion && (
          <div className="min-h-[260px]">
            <AnimatePresence mode="wait">
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
            </AnimatePresence>
          </div>
        )}

        {/* Progress */}
        {!isComplete && (
          <LittleThingProgress
            current={currentQuestionIndex + 1}
            total={totalQuestions}
          />
        )}

        {/* Completion */}
        {isComplete && (
          <LittleThingComplete creatorName={littleThing.creatorName} />
        )}
      </LittleThingShell>

      {/* Actions outside the card */}
      {isComplete && (
        <div className="mt-0 w-full max-w-sm">
          <PreviewActions
            isPublished={isPublished}
            isPublishing={isPublishing}
            canPublish={isValid}
            onPublish={handlePublish}
            publishError={publishError}
            creatorAccessToken={littleThing.creatorAccessToken}
          />

          {/* Restart preview */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleRestart}
              className="text-xs text-foreground-subtle hover:text-foreground transition-colors"
            >
              {t("previewBackToEditing")} ↺
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
