"use client";

import { useTranslation } from "@/lib/i18n";

export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-border-light bg-white px-1.5 py-0.5 text-xs shadow-sm"
      role="radiogroup"
      aria-label="Language selection"
    >
      <ToggleOption
        active={language === "en"}
        onClick={() => setLanguage("en")}
        label="EN"
      />
      <span className="text-border" aria-hidden="true">·</span>
      <ToggleOption
        active={language === "my"}
        onClick={() => setLanguage("my")}
        label="မြန်မာ"
      />
    </div>
  );
}

function ToggleOption({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={`Switch to ${label === "EN" ? "English" : "Burmese"}`}
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-foreground-subtle hover:text-foreground hover:bg-background-secondary"
      }`}
    >
      {label}
    </button>
  );
}
