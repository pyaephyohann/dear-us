"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

interface PreviewHeaderProps {
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

/**
 * A subtle header indicating this is a preview.
 * Shows different copy based on publication status.
 */
export function PreviewHeader({ status }: PreviewHeaderProps) {
  const { t } = useTranslation();

  const message =
    status === "PUBLISHED"
      ? t("previewHeaderPublished")
      : t("previewHeaderDraft");

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 text-center"
    >
      <p className="font-handwritten text-base text-primary">{t("previewHeaderLabel")}</p>
      <p className="mt-1 text-xs text-foreground-subtle">{message}</p>
    </motion.div>
  );
}
