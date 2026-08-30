"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

interface LittleThingProgressProps {
  current: number;
  total: number;
}

/**
 * Progress indicator showing "Question X of Y" and a progress bar.
 * Reusable by both preview and recipient pages.
 */
export function LittleThingProgress({ current, total }: LittleThingProgressProps) {
  const { t } = useTranslation();
  return (
    <div className="mt-5">
      <p className="text-center text-xs text-foreground-subtle">
        {t("previewCardQuestionOf", { current, total })}
      </p>
      <div className="mx-auto mt-2 h-1 w-32 overflow-hidden rounded-full bg-border-light">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${(current / total) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
