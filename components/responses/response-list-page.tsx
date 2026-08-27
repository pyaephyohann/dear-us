"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function getResponseCountText(count: number): string {
  if (count === 0) return "Waiting for the first answer 💌";
  if (count === 1) return "1 person answered 💌";
  return `${count} people answered 💌`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ResponseListPage({
  creatorAccessToken,
  title,
  recipientName,
  responses,
}: ResponseListPageProps) {
  const responseCount = responses.length;

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
            Your little thing 💕
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {recipientName && (
            <p className="mt-1 text-sm text-foreground-muted">
              For {recipientName}
            </p>
          )}
          <p className="mt-3 text-sm text-foreground-subtle">
            {getResponseCountText(responseCount)}
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
              <h2 className="mt-4 font-display text-lg font-bold text-foreground">
                Not yet...
              </h2>
              <p className="mt-2 text-sm text-foreground-muted">
                Your little thing is waiting
                <br />
                for someone to answer.
              </p>
              <p className="mt-1 text-xs text-foreground-subtle">
                Share it with them and come
                <br />
                back later. 🥹
              </p>
              <Link
                href={`/share/${creatorAccessToken}`}
                className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Share Again 💕
              </Link>
            </div>
          </motion.div>
        )}

        {/* Response cards */}
        {responseCount > 0 && (
          <div className="mt-8 space-y-4">
            {responses.map((response, index) => (
              <motion.div
                key={response.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
              <Link
                href={`/creator/${creatorAccessToken}/responses/${response.id}`}
                  className="block rounded-2xl border border-border-light bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        💌 Someone answered
                      </p>
                      <p className="mt-1 text-xs text-foreground-subtle">
                        {formatRelativeTime(response.createdAt)}
                      </p>
                      <p className="mt-2 text-xs text-foreground-muted">
                        {response.responseAnswers.length} question{response.responseAnswers.length !== 1 ? "s" : ""} answered
                      </p>
                    </div>
                    <span className="text-sm text-primary">→</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Back to share */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            href={`/share/${creatorAccessToken}`}
            className="text-sm text-foreground-subtle hover:text-foreground transition-colors"
          >
            ← Back to share
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
