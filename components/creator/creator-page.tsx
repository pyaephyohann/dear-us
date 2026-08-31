"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BasicInfoForm } from "./basic-info-form";
import { QuestionBuilder } from "./question-builder";
import { CreatorActions } from "./creator-actions";
import { useTranslation } from "@/lib/i18n";
import { FloatingLanguageToggle } from "@/components/ui/floating-language-toggle";
import type { QuestionDraft, AnswerDraft } from "./types";

let idCounter = 0;
function tempId() {
  return `tmp-${++idCounter}-${Date.now()}`;
}

function makeDefaultAnswer(): AnswerDraft {
  return { id: tempId(), text: "" };
}

function makeDefaultQuestion(): QuestionDraft {
  return {
    id: tempId(),
    text: "",
    stickerId: null,
    answers: [makeDefaultAnswer(), makeDefaultAnswer()],
  };
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validate(
  title: string,
  questions: QuestionDraft[],
  t: (key: string) => string
): {
  formErrors: Record<string, string | undefined>;
  questionErrors: Record<number, Record<string, string | undefined>>;
  valid: boolean;
} {
  const formErrors: Record<string, string | undefined> = {};
  if (!title.trim()) {
    formErrors.title = t("errorTitleRequired");
  }

  const questionErrors: Record<number, Record<string, string | undefined>> = {};
  let allValid = !formErrors.title;

  if (questions.length === 0) {
    allValid = false;
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const qe: Record<string, string | undefined> = {};

    if (!q.text.trim()) {
      qe.text = t("errorQuestionEmpty");
      allValid = false;
    }

    const nonEmptyAnswers = q.answers.filter((a) => a.text.trim());
    if (q.answers.length < 2) {
      qe.answers = t("errorQuestionMinAnswers");
      allValid = false;
    } else if (nonEmptyAnswers.length < 2) {
      qe.answers = t("errorQuestionFillAnswers");
      allValid = false;
    }

    if (Object.keys(qe).length > 0) {
      questionErrors[i] = qe;
    }
  }

  return { formErrors, questionErrors, valid: allValid };
}

// ---------------------------------------------------------------------------
// Edit mode initial data
// ---------------------------------------------------------------------------

export type EditorInitialQuestion = {
  id: string;
  text: string;
  stickerId: string | null;
  answers: { id: string; text: string }[];
};

export type EditorInitialData = {
  id: string;
  creatorAccessToken: string;
  title: string;
  introMessage: string | null;
  creatorName: string | null;
  recipientName: string | null;
  questions: EditorInitialQuestion[];
};

interface CreatorPageProps {
  editMode?: EditorInitialData | null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreatorPage({ editMode = null }: CreatorPageProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const isEditing = !!editMode;

  // Form state — initialize from edit data if provided
  const [recipientName, setRecipientName] = useState(editMode?.recipientName ?? "");
  const [creatorName, setCreatorName] = useState(editMode?.creatorName ?? "");
  const [title, setTitle] = useState(editMode?.title ?? "");
  const [introMessage, setIntroMessage] = useState(editMode?.introMessage ?? "");
  const [questions, setQuestions] = useState<QuestionDraft[]>(
    editMode?.questions.map((q) => ({
      id: q.id,
      text: q.text,
      stickerId: q.stickerId ?? null,
      answers: q.answers.map((a) => ({ id: a.id, text: a.text })),
    })) ?? []
  );

  // UI state
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});
  const [questionErrors, setQuestionErrors] = useState<Record<number, Record<string, string | undefined>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // --- Basic info change ---
  const handleBasicInfoChange = useCallback((field: string, value: string) => {
    setServerError(null);
    switch (field) {
      case "recipientName":
        setRecipientName(value);
        break;
      case "creatorName":
        setCreatorName(value);
        break;
      case "title":
        setTitle(value);
        setFormErrors((prev) => ({ ...prev, title: undefined }));
        break;
      case "introMessage":
        setIntroMessage(value);
        break;
    }
  }, []);

  // --- Question operations ---
  const addQuestion = useCallback(() => {
    setQuestions((prev) => [...prev, makeDefaultQuestion()]);
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setQuestionErrors({});
  }, []);

  const moveQuestionUp = useCallback((id: string) => {
    setQuestions((prev) => {
      const i = prev.findIndex((q) => q.id === id);
      if (i <= 0) return prev;
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  }, []);

  const moveQuestionDown = useCallback((id: string) => {
    setQuestions((prev) => {
      const i = prev.findIndex((q) => q.id === id);
      if (i < 0 || i >= prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  }, []);

  const changeQuestionText = useCallback((id: string, text: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, text } : q))
    );
    setServerError(null);
  }, []);

  const changeQuestionSticker = useCallback((id: string, stickerId: string | null) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, stickerId } : q))
    );
    setServerError(null);
  }, []);

  // --- Answer operations ---
  const addAnswer = useCallback((questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, answers: [...q.answers, makeDefaultAnswer()] }
          : q
      )
    );
  }, []);

  const changeAnswer = useCallback(
    (questionId: string, answerId: string, text: string) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                answers: q.answers.map((a) =>
                  a.id === answerId ? { ...a, text } : a
                ),
              }
            : q
        )
      );
      setServerError(null);
    },
    []
  );

  const deleteAnswer = useCallback(
    (questionId: string, answerId: string) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, answers: q.answers.filter((a) => a.id !== answerId) }
            : q
        )
      );
    },
    []
  );

  const moveAnswerUp = useCallback(
    (questionId: string, answerId: string) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id !== questionId) return q;
          const i = q.answers.findIndex((a) => a.id === answerId);
          if (i <= 0) return q;
          const next = [...q.answers];
          [next[i - 1], next[i]] = [next[i], next[i - 1]];
          return { ...q, answers: next };
        })
      );
    },
    []
  );

  const moveAnswerDown = useCallback(
    (questionId: string, answerId: string) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id !== questionId) return q;
          const i = q.answers.findIndex((a) => a.id === answerId);
          if (i < 0 || i >= q.answers.length - 1) return q;
          const next = [...q.answers];
          [next[i], next[i + 1]] = [next[i + 1], next[i]];
          return { ...q, answers: next };
        })
      );
    },
    []
  );

  // --- Submit ---
  const handleSave = useCallback(async () => {
    setServerError(null);
    setFormErrors({});
    setQuestionErrors({});
    setSaveSuccess(false);

    const { formErrors: fe, questionErrors: qe, valid } = validate(title, questions, t);

    if (!valid) {
      setFormErrors(fe);
      setQuestionErrors(qe);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && editMode) {
        // --- Edit mode: PATCH to update existing Little Thing ---
        const res = await fetch(`/api/little-things/${editMode.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creatorAccessToken: editMode.creatorAccessToken,
            title: title.trim(),
            introMessage: introMessage.trim() || undefined,
            creatorName: creatorName.trim() || undefined,
            recipientName: recipientName.trim() || undefined,
            questions: questions.map((q) => ({
              id: q.id.startsWith("tmp-") ? undefined : q.id,
              text: q.text.trim(),
              stickerId: q.stickerId,
              answers: q.answers
                .filter((a) => a.text.trim())
                .map((a) => ({
                  id: a.id.startsWith("tmp-") ? undefined : a.id,
                  text: a.text.trim(),
                })),
            })),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setServerError(data.error ?? "We couldn't save your changes just yet. Please try again. 💕");
          setIsSubmitting(false);
          return;
        }

        setSaveSuccess(true);
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // --- Create mode: POST to create new Little Thing ---
        const res = await fetch("/api/little-things", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            introMessage: introMessage.trim() || undefined,
            creatorName: creatorName.trim() || undefined,
            recipientName: recipientName.trim() || undefined,
            questions: questions.map((q) => ({
              text: q.text.trim(),
              stickerId: q.stickerId,
              answers: q.answers
                .filter((a) => a.text.trim())
                .map((a) => ({ text: a.text.trim() })),
            })),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setServerError(data.error ?? "Something went wrong. Please try again. 💕");
          setIsSubmitting(false);
          return;
        }

        // Navigate to preview
        router.push(`/preview/${data.id}`);
      }
    } catch {
      setServerError(isEditing
        ? "We couldn't save your changes just yet. Please try again. 💕"
        : "Something went wrong while saving. Please try again. 💕"
      );
      setIsSubmitting(false);
    }
  }, [isEditing, editMode, title, introMessage, creatorName, recipientName, questions, router, t]);

  return (
    <div className="relative mx-auto max-w-2xl px-5 pb-24 pt-24 sm:px-6 sm:pt-28">
      <FloatingLanguageToggle />
      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {isEditing ? t("editTitle") : t("createPageTitle")}
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">
          {isEditing ? t("editSubtitle") : t("createPageSubtitle")}
        </p>
      </motion.div>

      {/* Server error */}
      {serverError && (
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary-light p-4 text-center text-sm text-primary">
          {serverError}
        </div>
      )}

      {/* Save success */}
      {saveSuccess && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm text-green-700">
          Saved! 💕
        </div>
      )}

      {/* Sections */}
      <div className="mt-10 space-y-12">
        {/* Basic info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            {t("theBasics")}
          </h2>
          <div className="rounded-2xl border border-border-light bg-white p-5 shadow-sm sm:p-6">
            <BasicInfoForm
              recipientName={recipientName}
              creatorName={creatorName}
              title={title}
              introMessage={introMessage}
              errors={formErrors}
              onChange={handleBasicInfoChange}
            />
          </div>
        </motion.div>

        {/* Questions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            {t("yourQuestions")}
          </h2>
          <QuestionBuilder
            questions={questions}
            questionErrors={questionErrors}
            onAddQuestion={addQuestion}
            onQuestionTextChange={changeQuestionText}
            onQuestionStickerChange={changeQuestionSticker}
            onQuestionDelete={deleteQuestion}
            onQuestionMoveUp={moveQuestionUp}
            onQuestionMoveDown={moveQuestionDown}
            onAnswerAdd={addAnswer}
            onAnswerChange={changeAnswer}
            onAnswerDelete={deleteAnswer}
            onAnswerMoveUp={moveAnswerUp}
            onAnswerMoveDown={moveAnswerDown}
          />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <CreatorActions
            isSubmitting={isSubmitting}
            onSave={handleSave}
            mode={isEditing ? "edit" : "create"}
            backHref={isEditing && editMode ? `/creator/${editMode.creatorAccessToken}` : undefined}
            backLabel={isEditing ? t("backToDashboard") : undefined}
          />
        </motion.div>
      </div>
    </div>
  );
}
