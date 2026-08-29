"use client";

import { useTranslation } from "@/lib/i18n";

export default function Loading() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-lg text-center">
        <div className="inline-flex items-center gap-2">
          <span className="text-2xl animate-pulse">💌</span>
          <span className="font-handwritten text-lg text-primary animate-pulse">
            {t("loading")}
          </span>
        </div>
      </div>
    </main>
  );
}
