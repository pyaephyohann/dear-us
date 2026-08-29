"use client";

import { useTranslation } from "@/lib/i18n";

export default function LittleLoading() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-lg text-center">
        <div className="inline-flex flex-col items-center gap-3">
          <span className="text-3xl animate-pulse">💌</span>
          <p className="font-handwritten text-lg text-primary animate-pulse">
            {t("loadingOpening")}
          </p>
          <p className="text-xs text-foreground-subtle">
            {t("loadingOpeningSub")}
          </p>
        </div>
      </div>
    </main>
  );
}
