"use client";

import { useTranslation } from "@/lib/i18n";

interface BasicInfoFormProps {
  recipientName: string;
  creatorName: string;
  title: string;
  introMessage: string;
  errors: Record<string, string | undefined>;
  onChange: (field: string, value: string) => void;
}

export function BasicInfoForm({
  recipientName,
  creatorName,
  title,
  introMessage,
  errors,
  onChange,
}: BasicInfoFormProps) {
  const { t } = useTranslation();
  const fieldClassName =
    "mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder-foreground-subtle outline-none transition-colors focus:border-primary focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0";

  return (
    <section className="space-y-6">
      {/* Recipient name */}
      <div>
        <label className="block text-sm font-medium text-foreground" htmlFor="recipientName">
          {t("labelRecipient")}
        </label>
        <input
          id="recipientName"
          type="text"
          value={recipientName}
          onChange={(e) => onChange("recipientName", e.target.value)}
          placeholder={t("placeholderRecipient")}
          className={fieldClassName}
        />
      </div>

      {/* Creator name */}
      <div>
        <label className="block text-sm font-medium text-foreground" htmlFor="creatorName">
          {t("labelCreator")}
        </label>
        <input
          id="creatorName"
          type="text"
          value={creatorName}
          onChange={(e) => onChange("creatorName", e.target.value)}
          placeholder={t("placeholderCreator")}
          className={fieldClassName}
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-foreground" htmlFor="title">
          {t("labelTitle")}
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder={t("placeholderTitle")}
          className={fieldClassName}
        />
        {errors.title && (
          <p className="mt-1.5 text-xs text-primary">{errors.title}</p>
        )}
      </div>

      {/* Intro message */}
      <div>
        <label className="block text-sm font-medium text-foreground" htmlFor="introMessage">
          {t("labelIntro")} <span className="text-foreground-subtle">{t("optional")}</span>
        </label>
        <textarea
          id="introMessage"
          value={introMessage}
          onChange={(e) => onChange("introMessage", e.target.value)}
          placeholder={t("placeholderIntro")}
          rows={2}
          className={fieldClassName}
        />
        {errors.introMessage && (
          <p className="mt-1.5 text-xs text-primary">{errors.introMessage}</p>
        )}
      </div>
    </section>
  );
}
