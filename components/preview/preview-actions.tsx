"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

interface PreviewActionsProps {
  isPublished: boolean;
  isPublishing: boolean;
  canPublish: boolean;
  onPublish: () => void;
  publishError: string | null;
  creatorAccessToken?: string;
}

/**
 * Action buttons for the preview page:
 * - Back to editing
 * - Publish (or "Already published" if published)
 */
export function PreviewActions({
  isPublished,
  isPublishing,
  canPublish,
  onPublish,
  publishError,
  creatorAccessToken,
}: PreviewActionsProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8 space-y-4"
    >
      {/* Publish error */}
      {publishError && (
        <div className="rounded-xl border border-primary/20 bg-primary-light p-4 text-center text-sm text-primary">
          {publishError}
        </div>
      )}

      {/* Publish button */}
      {!isPublished && (
        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing || !canPublish}
          className="w-full rounded-full bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPublishing ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {t("previewPublishing")}
            </span>
          ) : (
            t("previewShareCta")
          )}
        </button>
      )}

      {isPublished && (
        <div className="rounded-xl border border-border-light bg-background-secondary p-4 text-center">
          <p className="text-sm text-foreground-muted">
            {t("previewPublished")}
          </p>
          {creatorAccessToken && (
            <Link
              href={`/share/${creatorAccessToken}`}
              className="mt-2 inline-block text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              {t("shareReady")} →
            </Link>
          )}
        </div>
      )}

      {/* Back to editing */}
      <div className="text-center">
        <Link
          href={creatorAccessToken ? `/creator/${creatorAccessToken}/edit` : "/create"}
          className="text-sm text-foreground-subtle hover:text-foreground transition-colors"
        >
          {t("previewBackToEditing")}
        </Link>
      </div>
    </motion.div>
  );
}
