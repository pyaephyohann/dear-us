"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DashboardPageProps {
  creatorAccessToken: string;
  publicId: string;
  littleThingId: string;
  title: string;
  recipientName: string | null;
  creatorName: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  responseCount: number;
  firstResponseAt: string | null;
  latestResponseAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "PUBLISHED":
      return "Published ✨";
    case "ARCHIVED":
      return "Archived";
    default:
      return status;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DashboardPage({
  creatorAccessToken,
  publicId,
  littleThingId,
  title,
  recipientName,
  creatorName,
  status,
  responseCount,
  firstResponseAt,
  latestResponseAt,
  createdAt,
  updatedAt,
}: DashboardPageProps) {
  const { t } = useTranslation();
  const [privateCopied, setPrivateCopied] = useState(false);

  const privateUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/creator/${creatorAccessToken}`
      : "";

  const handleCopyPrivate = useCallback(async () => {
    if (!privateUrl) return;

    try {
      await navigator.clipboard.writeText(privateUrl);
      setPrivateCopied(true);
      setTimeout(() => setPrivateCopied(false), 2000);
    } catch {
      // Give up gracefully
    }
  }, [privateUrl]);

  const greeting = recipientName
    ? t("responseListFor", { name: recipientName })
    : null;

  return (
    <div className="min-h-screen bg-background px-5 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="font-handwritten text-lg text-primary">
            {t("dashboardYourThing")}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {greeting && (
            <p className="mt-1 text-sm text-foreground-muted">{greeting}</p>
          )}
        </motion.div>

        {/* Status + meta */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-8 rounded-2xl border border-border-light bg-white p-6 shadow-sm"
        >
          <div className="space-y-3">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-muted">{t("dashboardPublished")}</span>
              <span className="text-sm font-medium text-foreground">
                {getStatusLabel(status)}
              </span>
            </div>

            {/* Response count */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-muted">{t("shareResponses")}</span>
              <span className="text-sm font-medium text-foreground">
                {t(responseCount === 0 ? "dashboardNoAnswers" : responseCount === 1 ? "dashboardOneAnswered" : "dashboardPeopleAnswered", { count: responseCount })}
              </span>
            </div>

            {/* Creator */}
            {creatorName && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-muted">{t("labelCreator")}</span>
                <span className="text-sm font-medium text-foreground">
                  {creatorName}
                </span>
              </div>
            )}

            {/* Created date */}
            <div className="flex items-center justify-between">                <span className="text-sm text-foreground-muted">{t("dashboardPublished")}</span>
              <span className="text-sm text-foreground-subtle">
                {formatDate(createdAt)}
              </span>
            </div>

            {/* Last updated */}
            <div className="flex items-center justify-between">                <span className="text-sm text-foreground-muted">{t("dashboardPublished")}</span>
              <span className="text-sm text-foreground-subtle">
                {formatDate(updatedAt)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick analytics */}
        {responseCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 rounded-2xl border border-border-light bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Link
                href={`/creator/${creatorAccessToken}/analytics`}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {t("dashboardQuickStats")}
              </Link>
              <Link
                href={`/creator/${creatorAccessToken}/analytics`}
                className="text-xs text-primary hover:text-primary-hover transition-colors"
              >
                {t("dashboardViewAnalytics")} →
              </Link>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-lg font-bold text-primary">{responseCount}</p>
                <p className="text-[10px] text-foreground-subtle">response{responseCount !== 1 ? "s" : ""}</p>
              </div>
              <div>
                {firstResponseAt && latestResponseAt && (
                  <>
                    <p className="text-[10px] text-foreground-subtle">First → Latest</p>
                    <p className="text-xs font-medium text-foreground">{formatDate(firstResponseAt)} → {formatDate(latestResponseAt)}</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 space-y-3"
        >
          {/* See Responses (primary for published) */}
          <Link
            href={`/creator/${creatorAccessToken}/responses`}
            className="block w-full rounded-full bg-primary px-6 py-3.5 text-center text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:shadow-lg active:scale-[0.98]"
          >
            {t("dashboardSeeResponses")}
          </Link>

          {/* Share */}
          <Link
            href={`/share/${creatorAccessToken}`}
            className="block w-full rounded-full border border-border bg-white px-6 py-3.5 text-center text-sm font-medium text-foreground transition-all hover:bg-background-secondary hover:shadow-sm active:scale-[0.98]"
          >
            {t("responseShareAgain")}
          </Link>

          {/* Preview */}
          <Link
            href={`/preview/${littleThingId}`}
            className="block w-full rounded-full border border-border bg-white px-6 py-3.5 text-center text-sm font-medium text-foreground transition-all hover:bg-background-secondary hover:shadow-sm active:scale-[0.98]"
          >
            {t("dashboardPreview")}
          </Link>

          {/* Analytics */}
          <Link
            href={`/creator/${creatorAccessToken}/analytics`}
            className="block w-full rounded-full border border-border bg-white px-6 py-3.5 text-center text-sm font-medium text-foreground transition-all hover:bg-background-secondary hover:shadow-sm active:scale-[0.98]"
          >
            {t("dashboardViewAnalytics")}
          </Link>

          {/* Edit */}
          <Link
            href={`/creator/${creatorAccessToken}/edit`}
            className="block w-full rounded-full border border-border bg-white px-6 py-3.5 text-center text-sm font-medium text-foreground transition-all hover:bg-background-secondary hover:shadow-sm active:scale-[0.98]"
          >
            {t("dashboardEdit")}
          </Link>
        </motion.div>

        {/* Private link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8 rounded-xl border border-border-light bg-background-secondary p-4"
        >
          <p className="text-xs font-medium text-foreground-muted">
            {t("dashboardPrivateLink")}
          </p>
          <p className="mt-1 text-xs text-foreground-subtle">
            {t("dashboardPrivateLinkDesc")}
          </p>
          <button
            type="button"
            onClick={handleCopyPrivate}
            disabled={!privateUrl}
            className="mt-3 w-full rounded-lg border border-border bg-white px-4 py-2 text-xs font-medium text-foreground transition-all hover:bg-background-secondary active:scale-[0.98] disabled:opacity-50"
          >
            {privateCopied ? t("dashboardCopiedLink") : t("dashboardCopyLink")}
          </button>
        </motion.div>

        {/* Public link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <Link
            href={`/little/${publicId}`}
            className="text-sm text-foreground-subtle hover:text-foreground transition-colors"
          >
            {t("shareOpen")} →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
