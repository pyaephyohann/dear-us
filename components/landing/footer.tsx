"use client";

import { DearUsLogo } from "@/components/ui/dearus-logo";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border-light px-5 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl text-center">
        <div className="flex items-center justify-center gap-1.5">
          <DearUsLogo size={20} showText={false} />
        </div>
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
