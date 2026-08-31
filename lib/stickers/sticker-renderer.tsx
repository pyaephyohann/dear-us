// DearUs Sticker Renderer
// Renders the correct cat sticker by ID using local animated SVG assets.
// Used in both creator preview and recipient question views.

"use client";

import { STICKER_REGISTRY, getStickerAsset } from "./registry";

interface StickerRendererProps {
  stickerId: string | null;
  size?: number; // px, default 80
  className?: string;
}

/**
 * Renders a cat sticker by its ID using a local animated SVG asset.
 * If the stickerId is invalid or null, renders nothing.
 * Respects prefers-reduced-motion: CSS animations in the SVGs are
 * automatically disabled by the global reduced-motion rule.
 */
export function StickerRenderer({
  stickerId,
  size = 80,
  className = "",
}: StickerRendererProps) {
  if (!stickerId) return null;

  const asset = getStickerAsset(stickerId);
  if (!asset) return null;

  const def = STICKER_REGISTRY[stickerId as keyof typeof STICKER_REGISTRY];
  const label = def?.label ?? "Cute cat sticker";

  return (
    <div
      className={`mx-auto ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset}
        alt={label}
        width={size}
        height={size}
        className="h-full w-full object-contain"
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}
