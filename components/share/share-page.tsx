"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "@/lib/i18n";
import { FloatingLanguageToggle } from "@/components/ui/floating-language-toggle";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SharePageProps {
  id: string;
  creatorAccessToken: string;
  publicId: string;
  title: string;
  recipientName: string | null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SharePage({ creatorAccessToken, publicId, title, recipientName }: SharePageProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [privateCopied, setPrivateCopied] = useState(false);

  // Build the public URL from window.location.origin
  const [shareUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/little/${publicId}`;
    }
    return "";
  });

  // Build the private creator URL
  const [privateUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/creator/${creatorAccessToken}/responses`;
    }
    return "";
  });

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Give up gracefully
      }
    }
  }, [shareUrl]);

  const handleCopyPrivate = useCallback(async () => {
    if (!privateUrl) return;

    try {
      await navigator.clipboard.writeText(privateUrl);
      setPrivateCopied(true);
      setTimeout(() => setPrivateCopied(false), 2000);
    } catch {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = privateUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setPrivateCopied(true);
        setTimeout(() => setPrivateCopied(false), 2000);
      } catch {
        // Give up gracefully
      }
    }
  }, [privateUrl]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-12 sm:px-6 sm:py-16">
      <FloatingLanguageToggle />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-sm text-center"
      >
        {/* Heading */}
        <p className="font-handwritten text-lg text-primary">
          {t("shareReady")}
        </p>
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {recipientName ? t("responseListFor", { name: recipientName }) : title}
        </h1>

        {/* QR Code */}
        {shareUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="mx-auto mt-8 w-fit rounded-2xl border border-border-light bg-white p-5 shadow-md"
          >
            <QRCodeSVG
              value={shareUrl}
              size={180}
              bgColor="#ffffff"
              fgColor="#2d2226"
              level="M"
              includeMargin={false}
            />
          </motion.div>
        )}

        <p className="mt-4 text-xs text-foreground-subtle">
          {t("shareQrTitle")}
        </p>

        {/* Divider */}
        <div className="my-6 border-t border-border-light" />

        {/* Share URL */}
        {shareUrl && (
          <p className="truncate text-sm text-foreground-muted">{shareUrl}</p>
        )}

        {/* Actions */}
        <div className="mt-6 space-y-3">
          {/* Copy link */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!shareUrl}
            className="w-full rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-background-secondary hover:shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {copied ? t("shareCopied") : t("shareCopyLink")}
          </button>

          {/* Open Little Thing */}
          <Link
            href={`/little/${publicId}`}
            className="block w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:shadow-lg active:scale-[0.98]"
          >
            {t("shareOpen")}
          </Link>
        </div>

        {/* Manage */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/creator/${creatorAccessToken}`}
            className="text-sm text-foreground-subtle hover:text-foreground transition-colors"
          >
            {t("shareManage")}
          </Link>
          <Link
            href={`/creator/${creatorAccessToken}/responses`}
            className="text-sm text-foreground-subtle hover:text-foreground transition-colors"
          >
            {t("shareResponses")}
          </Link>
          <Link
            href={`/creator/${creatorAccessToken}/analytics`}
            className="text-sm text-foreground-subtle hover:text-foreground transition-colors"
          >
            {t("shareAnalytics")}
          </Link>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-border-light" />

        {/* Private link */}
        <div className="rounded-xl border border-border-light bg-background-secondary p-4">
          <p className="text-xs font-medium text-foreground-muted">
            {t("dashboardPrivateLink")}
          </p>
          <p className="mt-1 text-xs text-foreground-subtle">
            {t("dashboardPrivateLinkDesc")}
          </p>
          <button
            type="button"
            onClick={handleCopyPrivate}
            disabled={!privateUrl}
            className="mt-3 w-full rounded-lg border border-border bg-white px-4 py-2 text-xs font-medium text-foreground transition-all hover:bg-background-secondary active:scale-[0.98] disabled:opacity-50"
          >
            {privateCopied ? t("shareCopied") : t("dashboardCopyLink")}
          </button>
          <p className="mt-2 text-[10px] text-foreground-subtle">
            {t("dashboardLinkWarning")}
          </p>
        </div>

        {/* Title display */}
        <p className="mt-6 font-handwritten text-base text-foreground-subtle">
          {title}
        </p>
      </motion.div>
    </div>
  );
}
