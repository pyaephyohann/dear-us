"use client";

import { motion } from "framer-motion";

interface LittleThingCompleteProps {
  creatorName?: string | null;
}

/**
 * The completion state after all questions are answered.
 * Shows a warm message. In preview mode, includes the publish CTA.
 * In recipient mode, this will show a different message.
 */
export function LittleThingComplete({ creatorName }: LittleThingCompleteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-[180px] text-center"
    >
      <p className="text-3xl">💕</p>
      <p className="mt-4 font-display text-xl font-bold text-foreground">
        That&apos;s it!
      </p>
      <p className="mt-2 text-sm text-foreground-muted">
        {creatorName
          ? `You've seen everything ${creatorName} prepared for you.`
          : "You've seen all the questions."}
      </p>
    </motion.div>
  );
}
