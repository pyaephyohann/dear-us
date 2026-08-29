"use client";

import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border-light px-5 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl text-center">
        <p className="font-display text-sm font-semibold text-foreground">
          {t("brand")} <span className="text-primary">💕</span>
        </p>
        <p className="mt-1 text-xs text-foreground-subtle">
          {t("footerMadeWith")}
        </p>
        <p className="mt-2 text-xs text-foreground-subtle">
          &copy; {new Date().getFullYear()} DearUs
        </p>
      </div>
    </footer>
  );
}
