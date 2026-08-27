"use client";

import { motion } from "framer-motion";

interface LittleThingShellProps {
  children: React.ReactNode;
}

/**
 * The outer card that wraps the entire Little Thing experience.
 * Reusable by both preview and recipient pages.
 */
export function LittleThingShell({ children }: LittleThingShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-lg sm:p-8"
    >
      {children}
    </motion.div>
  );
}
