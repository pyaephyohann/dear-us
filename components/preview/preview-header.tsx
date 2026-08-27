"use client";

import { motion } from "framer-motion";

interface PreviewHeaderProps {
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

/**
 * A subtle header indicating this is a preview.
 * Shows different copy based on publication status.
 */
export function PreviewHeader({ status }: PreviewHeaderProps) {
  const message =
    status === "PUBLISHED"
      ? "This Little Thing is published ✨"
      : "This is what they'll see 💕";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 text-center"
    >
      <p className="font-handwritten text-base text-primary">Preview</p>
      <p className="mt-1 text-xs text-foreground-subtle">{message}</p>
    </motion.div>
  );
}
