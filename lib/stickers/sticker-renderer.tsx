// DearUs Sticker Renderer
// Renders the correct cat sticker SVG by ID.
// Used in both creator preview and recipient question views.

"use client";

import { CatLoveSticker } from "./cat-love";
import { CatHappySticker } from "./cat-happy";
import { CatShySticker } from "./cat-shy";
import { CatKissSticker } from "./cat-kiss";
import { CatLaughSticker } from "./cat-laugh";
import { CatSleepySticker } from "./cat-sleepy";
import type { StickerId } from "./types";

const STICKER_COMPONENTS: Record<StickerId, React.ComponentType> = {
  "cat-love": CatLoveSticker,
  "cat-happy": CatHappySticker,
  "cat-shy": CatShySticker,
  "cat-kiss": CatKissSticker,
  "cat-laugh": CatLaughSticker,
  "cat-sleepy": CatSleepySticker,
};

interface StickerRendererProps {
  stickerId: string | null;
  size?: number; // px, default 80
  className?: string;
}

/**
 * Renders a cat sticker by its ID.
 * If the stickerId is invalid or null, renders nothing.
 */
export function StickerRenderer({
  stickerId,
  size = 80,
  className = "",
}: StickerRendererProps) {
  if (!stickerId) return null;

  const Component = STICKER_COMPONENTS[stickerId as StickerId];
  if (!Component) return null;

  return (
    <div
      className={`mx-auto ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Cute cat sticker"
    >
      <Component />
    </div>
  );
}
