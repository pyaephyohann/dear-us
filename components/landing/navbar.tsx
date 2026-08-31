"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { DearUsLogo } from "@/components/ui/dearus-logo";
import { useTranslation } from "@/lib/i18n";

export function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-light">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="group flex items-center">
          <DearUsLogo size={28} />
        </Link>

        {/* Right side: Language toggle + CTA */}
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link
            href="/create"
            className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {t("createCta").replace(/\s*💕\s*$/, "")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
