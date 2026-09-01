// DearUs Sticker Renderer
// Renders the correct sticker by ID using local PNG/WebP assets.
// Used in both creator preview and recipient question views.

"use client";

import { getStickerAsset } from "./registry";

interface StickerRendererProps {
  stickerId: string | null;
  size?: number; // px, default 80
  className?: string;
}

/**
 * Renders a sticker by its ID using a local PNG or WebP asset.
 * If the stickerId is invalid or null, renders nothing.
 */
export function StickerRenderer({
  stickerId,
  size = 80,
  className = "",
}: StickerRendererProps) {
  if (!stickerId) return null;

  const asset = getStickerAsset(stickerId);
  if (!asset) return null;

  return (
    <div
      className={`mx-auto ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset}
        alt=""
        width={size}
        height={size}
        className="h-full w-full object-contain"
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}
