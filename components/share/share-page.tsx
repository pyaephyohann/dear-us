"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SharePageProps {
  id: string;
  publicId: string;
  title: string;
  recipientName: string | null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SharePage({ id, publicId, title, recipientName }: SharePageProps) {
  const [copied, setCopied] = useState(false);

  // Build the public URL from window.location.origin
  const [shareUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/little/${publicId}`;
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
      // Clipboard API might not be available
      // Fallback: select + copy
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

  const greeting = recipientName
    ? `Your little thing for ${recipientName}`
    : "Your little thing";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-12 sm:px-6 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-sm text-center"
      >
        {/* Heading */}
        <p className="font-handwritten text-lg text-primary">
          It&apos;s ready. 💕
        </p>
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {greeting}
          <br />
          is waiting.
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
          Scan to open your little thing
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
            {copied ? "Copied! 💕" : "Copy Link 💌"}
          </button>

          {/* Open Little Thing */}
          <Link
            href={`/little/${publicId}`}
            className="block w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:shadow-lg active:scale-[0.98]"
          >
            Open Little Thing 💌
          </Link>
        </div>

        {/* See responses */}
        <Link
          href={`/creator/${id}/responses`}
          className="mt-6 inline-block text-sm text-foreground-subtle hover:text-foreground transition-colors"
        >
          See Responses 💌
        </Link>

        {/* Title display */}
        <p className="mt-6 font-handwritten text-base text-foreground-subtle">
          {title}
        </p>
      </motion.div>
    </div>
  );
}
