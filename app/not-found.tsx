"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-5xl">💌</p>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("notFoundTitle")}
        </h1>
        <p className="mt-4 text-sm text-foreground-muted">
          {t("notFoundDesc")}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/"
            className="inline-block rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:shadow-lg active:scale-[0.98]"
          >
            {t("notFoundHome")}
          </Link>
          <Link
            href="/create"
            className="inline-block rounded-full border border-border bg-white px-8 py-3 text-sm font-medium text-foreground transition-all hover:bg-background-secondary hover:shadow-sm active:scale-[0.98]"
          >
            {t("notFoundCreate")}
          </Link>
        </div>
      </div>
    </main>
  );
}
