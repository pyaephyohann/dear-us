"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { FloatingLanguageToggle } from "@/components/ui/floating-language-toggle";
import { formatDateShort, formatDateTime } from "@/lib/i18n/date-format";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type QuestionAnalytics = {
  questionId: string;
  questionText: string;
  questionOrder: number;
  totalAnswers: number;
  answers: {
    answerId: string;
    answerText: string;
    answerOrder: number;
    count: number;
    percentage: number;
    isMostSelected: boolean;
  }[];
};

interface AnalyticsPageProps {
  creatorAccessToken: string;
  title: string;
  recipientName: string | null;
  totalResponses: number;
  firstResponseAt: string | null;
  latestResponseAt: string | null;
  activityByDate: { date: string; count: number }[];
  questions: QuestionAnalytics[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------



// ---------------------------------------------------------------------------
// Activity Bar Chart (pure CSS, no library)
// ---------------------------------------------------------------------------

function ActivityChart({ data, language }: { data: { date: string; count: number }[]; language: "en" | "my" }) {
  const { t } = useTranslation();
  if (data.length === 0) return null;

  const maxCount = Math.max(...data.map((d) => d.count));
  // Ensure single bars are visible and have a reasonable minimum width
  const minBarWidth = data.length === 1 ? 48 : 16;

  return (
    <div className="flex items-end gap-1.5" style={{ height: 80 }}>
      {data.map((d) => {
        const height = maxCount > 0 ? (d.count / maxCount) * 100 : 0;
        return (
          <div
            key={d.date}
            className="group relative flex flex-col items-center"
            style={{ flex: data.length === 1 ? "none" : 1, minWidth: minBarWidth }}
          >
            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              {t("analyticsResponseActivity", { count: d.count, s: d.count !== 1 ? "s" : "" })}
            </div>
            {/* Bar */}
            <div
              className="w-full rounded-t-sm bg-primary transition-all"
              style={{ height: `${Math.max(height, 4)}%`, minHeight: 4 }}
            />
            {/* Label */}
            <span className="mt-1 text-[9px] text-foreground-subtle">
              {formatDateShort(d.date, language)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Answer Distribution Bar
// ---------------------------------------------------------------------------

function AnswerBar({
  text,
  count,
  percentage,
  isMostSelected,
  total,
}: {
  text: string;
  count: number;
  percentage: number;
  isMostSelected: boolean;
  total: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">{text}</span>
        <span className="text-xs text-foreground-muted">
          {count} ({percentage}%)
        </span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-background-secondary">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: total > 0 ? `${percentage}%` : "0%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`absolute inset-y-0 left-0 rounded-full ${
            isMostSelected ? "bg-primary" : "bg-secondary"
          }`}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function EmptyAnalytics({ creatorAccessToken, t }: { creatorAccessToken: string; t: (key: string) => string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mt-12 text-center"
    >
      <div className="rounded-2xl border border-border-light bg-white p-8 shadow-sm">
        <p className="text-4xl">📊</p>
        <h2 className="mt-4 font-roboto text-lg font-bold text-foreground">
          {t("analyticsNoResponses")}
        </h2>
        <p className="mt-2 text-sm text-foreground-muted">
          {t("analyticsNoResponsesDesc")}
        </p>
        <Link
          href={`/share/${creatorAccessToken}`}
          className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {t("analyticsShareNow")}
        </Link>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AnalyticsPage({
  creatorAccessToken,
  title,
  recipientName,
  totalResponses,
  firstResponseAt,
  latestResponseAt,
  activityByDate,
  questions,
}: AnalyticsPageProps) {
  const { t, language } = useTranslation();
  const hasResponses = totalResponses > 0;
  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen bg-background px-5 py-12 sm:px-6 sm:py-16">
      <FloatingLanguageToggle />
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="font-handwritten text-lg text-primary">
            {t("analyticsTitle")}
          </p>
          <h1 className="mt-2 font-roboto text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {recipientName && (
            <p className="mt-1 text-sm text-foreground-muted">
              {t("responseListFor", { name: recipientName })}
            </p>
          )}
        </motion.div>

        {/* Empty state */}
        {!hasResponses && (
          <EmptyAnalytics creatorAccessToken={creatorAccessToken} t={t} />
        )}

        {/* Summary cards */}
        {hasResponses && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-8 grid grid-cols-2 gap-3"
          >
            <div className="rounded-2xl border border-border-light bg-white p-4 text-center shadow-sm">
              <p className="font-roboto text-3xl font-bold text-primary">
                {totalResponses}
              </p>
              <p className="mt-1 text-xs text-foreground-muted">
                {t("analyticsTotalResponses")}
              </p>
            </div>
            <div className="rounded-2xl border border-border-light bg-white p-4 text-center shadow-sm">
              <p className="font-roboto text-3xl font-bold text-primary">
                {totalQuestions}
              </p>
              <p className="mt-1 text-xs text-foreground-muted">
                {t("analyticsTotalQuestions")}
              </p>
            </div>
          </motion.div>
        )}

        {/* Activity chart */}
        {hasResponses && activityByDate.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 rounded-2xl border border-border-light bg-white p-5 shadow-sm"
          >
            <h2 className="font-roboto text-sm font-semibold text-foreground mb-4">
              {t("analyticsActivityTitle")}
            </h2>
            <ActivityChart data={activityByDate} language={language} />
          </motion.div>
        )}

        {/* Timeline */}
        {hasResponses && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-4 rounded-2xl border border-border-light bg-white p-5 shadow-sm"
          >
            <h2 className="font-roboto text-sm font-semibold text-foreground mb-3">
              {t("analyticsTimeline")}
            </h2>
            <div className="space-y-2">
              {firstResponseAt && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground-muted">{t("analyticsFirstResponse")}</span>
                  <span className="text-xs text-foreground-subtle">
                    {formatDateTime(firstResponseAt, language)}
                  </span>
                </div>
              )}
              {latestResponseAt && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground-muted">{t("analyticsLatestResponse")}</span>
                  <span className="text-xs text-foreground-subtle">
                    {formatDateTime(latestResponseAt, language)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Question breakdown */}
        {hasResponses && (
          <div className="mt-6 space-y-4">
            <h2 className="font-roboto text-sm font-semibold text-foreground">
              {t("analyticsBreakdownTitle")}
            </h2>
            {questions.map((q, index) => (
              <motion.div
                key={q.questionId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="rounded-2xl border border-border-light bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-medium text-foreground pr-4">
                    {q.questionText}
                  </p>
                  <span className="shrink-0 text-xs text-foreground-subtle">
                    {q.totalAnswers}
                  </span>
                </div>
                <div className="space-y-3">
                  {q.answers.map((a) => (
                    <AnswerBar
                      key={a.answerId}
                      text={a.answerText}
                      count={a.count}
                      percentage={a.percentage}
                      isMostSelected={a.isMostSelected}
                      total={q.totalAnswers}
                    />
                  ))}
                </div>
                {q.answers.some((a) => a.isMostSelected) && (
                  <p className="mt-3 text-xs text-primary font-medium">
                    {t("analyticsMostSelected")}: {q.answers.find((a) => a.isMostSelected)?.answerText} ❤️
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex items-center justify-between"
        >
          <Link
            href={`/creator/${creatorAccessToken}`}
            className="text-sm text-foreground-subtle hover:text-foreground transition-colors"
          >
            {t("backToDashboardLink")}
          </Link>
          <Link
            href={`/creator/${creatorAccessToken}/responses`}
            className="text-sm text-foreground-subtle hover:text-foreground transition-colors"
          >
            {t("shareResponses")} →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
