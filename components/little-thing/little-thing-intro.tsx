"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

interface LittleThingIntroProps {
  title: string;
  introMessage?: string | null;
  recipientName?: string | null;
}

/**
 * The intro section shown before questions begin.
 * Displays the title, recipient name, and intro message.
 */
export function LittleThingIntro({
  title,
  introMessage,
  recipientName,
}: LittleThingIntroProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="text-center"
    >
      {recipientName && (
        <p className="font-handwritten text-lg text-primary">
          {t("recipientForYou")} {recipientName}
        </p>
      )}
      <p className="mt-1 text-center font-handwritten text-2xl text-foreground">
        {title}
      </p>

      {introMessage && (
        <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
          {introMessage}
        </p>
      )}

      <div className="my-5 border-t border-border-light" />
    </motion.div>
  );
}
