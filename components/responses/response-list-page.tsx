"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useTranslation } from "@/lib/i18n";
import { FloatingLanguageToggle } from "@/components/ui/floating-language-toggle";
import { formatRelativeTime } from "@/lib/i18n/date-format";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ResponseItem = {
  id: string;
  createdAt: string;
  completedAt: string | null;
  responseAnswers: {
    question: { id: string; text: string; order: number };
    answer: { id: string; text: string };
  }[];
};

interface ResponseListPageProps {
  creatorAccessToken: string;
  littleThingId: string;
  publicId: string;
  title: string;
  recipientName: string | null;
  responses: ResponseItem[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------



// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ResponseCardList({
  responses,
  creatorAccessToken,
}: {
  responses: ResponseItem[];
  creatorAccessToken: string;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDeleteConfirm = useCallback(async () => {
    if (!confirmDeleteId) return;
    const responseId = confirmDeleteId;
    setConfirmDeleteId(null);
    setDeletingId(responseId);
      try {
        const res = await fetch(
          `/api/little-things/${creatorAccessToken}/responses/${responseId}`,
          { method: "DELETE" }
        );

        if (res.ok) {
          // Remove from local state — page reloads fresh on next navigation
          window.location.reload();
        }
      } catch {
        // Silently fail — the user can try again
      } finally {
        setDeletingId(null);
      }
    },
    [confirmDeleteId, creatorAccessToken]
  );

  const { t, language } = useTranslation();

  return (
    <>
    <ConfirmModal
      open={confirmDeleteId !== null}
      title={t("confirmDeleteTitle")}
      message={t("confirmDeleteMessage")}
      confirmLabel={t("confirmDeleteYes")}
      cancelLabel={t("confirmDeleteKeep")}
      variant="danger"
      onConfirm={handleDeleteConfirm}
      onCancel={() => setConfirmDeleteId(null)}
    />
    <div className="mt-8 space-y-4">
      {responses.map((response, index) => (
        <motion.div
          key={response.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <div className="rounded-2xl border border-border-light bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
            <div className="flex items-start justify-between">
              <Link
                href={`/creator/${creatorAccessToken}/responses/${response.id}`}
                className="flex-1"
              >
                <p className="text-sm font-medium text-foreground">
                  {t("responseSomeoneAnswered")}
                </p>
                <p className="mt-1 text-xs text-foreground-subtle">
                  {formatRelativeTime(response.createdAt, language)}
                </p>
                <p className="mt-2 text-xs text-foreground-muted">
                  {response.responseAnswers.length === 1 ? t("responseQuestionCount", { count: response.responseAnswers.length }) : t("responseQuestionCountPlural", { count: response.responseAnswers.length })}
                </p>
              </Link>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/creator/${creatorAccessToken}/responses/${response.id}`}
                  className="text-sm text-primary"
                >
                  →
                </Link>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(response.id)}
                  disabled={deletingId === response.id}
                  className="text-xs text-foreground-subtle hover:text-red-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Delete response"
                >
                  {deletingId === response.id ? "..." : "✕"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
    </>
  );
}

export function ResponseListPage({
  creatorAccessToken,
  title,
  recipientName,
  responses,
}: ResponseListPageProps) {
  const { t } = useTranslation();
  const responseCount = responses.length;

  return (
    <div className="min-h-screen px-5 py-12 sm:px-6 sm:py-16">
      <FloatingLanguageToggle />
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="font-handwritten text-lg text-primary">
            {t("responseListTitle")}
          </p>
          <h1 className="mt-2 font-roboto text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {recipientName && (
            <p className="mt-1 text-sm text-foreground-muted">
              {t("responseListFor", { name: recipientName })}
            </p>
          )}
          <p className="mt-3 text-sm text-foreground-subtle">
            {responseCount === 0 ? t("responseCountZero") : responseCount === 1 ? t("responseCountOne") : t("responseCountMany", { count: responseCount })}
          </p>
        </motion.div>

        {/* Empty state */}
        {responseCount === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-12 text-center"
          >
            <div className="rounded-2xl border border-border-light bg-white p-8 shadow-sm">
              <p className="text-3xl">💌</p>
              <h2 className="mt-4 font-roboto text-lg font-bold text-foreground">
                {t("responseEmptyTitle")}
              </h2>
              <p className="mt-2 text-sm text-foreground-muted">
                {t("responseEmptyDesc")}
              </p>
              <p className="mt-1 text-xs text-foreground-subtle">
                {t("responseEmptyHint")}
              </p>
              <Link
                href={`/share/${creatorAccessToken}`}
                className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                {t("responseShareAgain")}
              </Link>
            </div>
          </motion.div>
        )}

        {/* Response cards */}
        {responseCount > 0 && (
          <ResponseCardList
            responses={responses}
            creatorAccessToken={creatorAccessToken}
          />
        )}

        {/* Back to dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            href={`/creator/${creatorAccessToken}`}
            className="text-sm text-foreground-subtle hover:text-foreground transition-colors"
          >
            {t("backToDashboardLink")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
