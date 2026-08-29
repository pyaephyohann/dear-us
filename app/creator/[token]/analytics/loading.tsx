"use client";

import { useTranslation } from "@/lib/i18n";

export default function AnalyticsLoading() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background px-5 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="inline-flex flex-col items-center gap-3">
          <span className="text-3xl animate-pulse">📊</span>
          <p className="font-handwritten text-lg text-primary animate-pulse">
            {t("loadingReadingAnswers")}
          </p>
        </div>
      </div>
    </main>
  );
}
