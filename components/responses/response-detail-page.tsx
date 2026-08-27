"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ResponseDetail = {
  id: string;
  createdAt: string;
  completedAt: string | null;
  responseAnswers: {
    question: { id: string; text: string; order: number };
    answer: { id: string; text: string };
  }[];
};

interface ResponseDetailPageProps {
  creatorAccessToken: string;
  littleThingId: string;
  littleThingTitle: string;
  publicId: string;
  response: ResponseDetail;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ResponseDetailPage({
  creatorAccessToken,
  littleThingTitle,
  response,
}: ResponseDetailPageProps) {
  const completedDate = response.completedAt
    ? new Date(response.completedAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
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
            Someone answered 💕
          </p>
          <h1 className="mt-2 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {littleThingTitle}
          </h1>
          {completedDate && (
            <p className="mt-2 text-xs text-foreground-subtle">
              Answered on {completedDate}
            </p>
          )}
        </motion.div>

        {/* Answers card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 rounded-2xl border border-border-light bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-6">
            {response.responseAnswers.map((ra, index) => (
              <motion.div
                key={ra.question.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
              >
                {/* Question */}
                <p className="text-sm font-medium text-foreground">
                  {ra.question.text}
                </p>

                {/* Selected answer */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary">
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                  <p className="text-sm text-foreground-muted">
                    {ra.answer.text}
                  </p>
                </div>

                {/* Divider (except for last) */}
                {index < response.responseAnswers.length - 1 && (
                  <div className="mt-5 border-t border-border-light" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex items-center justify-between"
        >
          <Link
            href={`/creator/${creatorAccessToken}/responses`}
            className="text-sm text-foreground-subtle hover:text-foreground transition-colors"
          >
            ← All responses
          </Link>
          <Link
            href={`/share/${creatorAccessToken}`}
            className="text-sm text-foreground-subtle hover:text-foreground transition-colors"
          >
            Share page →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
