"use client";

import Image from "next/image";

interface DearUsLogoProps {
  /** Height of the logo image in pixels. Default: 32 */
  size?: number;
  /** Show the "DearUs" text next to the image. Default: true */
  showText?: boolean;
  /** Additional class names for the container */
  className?: string;
}

/**
 * Reusable DearUs logo component.
 * Shows the official logo.png image alongside the DearUs wordmark.
 */
export function DearUsLogo({
  size = 40,
  showText = true,
  className = "",
}: DearUsLogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.png"
        alt="DearUs"
        width={size}
        height={size}
        className="rounded-sm object-contain"
        priority
      />
      {showText && (
        <span className="font-roboto text-xl font-bold tracking-tight text-foreground">
          DearUs
        </span>
      )}
    </span>
  );
}
