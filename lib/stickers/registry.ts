// DearUs Sticker Registry
// Source of truth for valid sticker IDs and their asset paths.
// Server validates stickerId against this registry — never trust client input.

import type { StickerId, StickerDefinition } from "./types";

export const STICKER_REGISTRY: Record<StickerId, StickerDefinition> = {
  "cat-love":   { id: "cat-love",   label: "Cat Love 🐱💕",   asset: "/stickers/cat-love.svg" },
  "cat-happy":  { id: "cat-happy",  label: "Cat Happy 🐱✨",   asset: "/stickers/cat-happy.svg" },
  "cat-shy":    { id: "cat-shy",    label: "Cat Shy 🐱💗",     asset: "/stickers/cat-shy.svg" },
  "cat-kiss":   { id: "cat-kiss",   label: "Cat Kiss 🐱💋",    asset: "/stickers/cat-kiss.svg" },
  "cat-laugh":  { id: "cat-laugh",  label: "Cat Laugh 🐱😂",   asset: "/stickers/cat-laugh.svg" },
  "cat-sleepy": { id: "cat-sleepy", label: "Cat Sleepy 🐱💤",  asset: "/stickers/cat-sleepy.svg" },
};

/** All valid sticker IDs. */
export const VALID_STICKER_IDS = new Set<string>(
  Object.keys(STICKER_REGISTRY) as StickerId[]
);

/** Get the asset path for a sticker, or null if invalid. */
export function getStickerAsset(id: string | null | undefined): string | null {
  if (id == null || id === "") return null;
  const def = STICKER_REGISTRY[id as StickerId];
  return def ? def.asset : null;
}

/** Check if a sticker ID is valid (or null/undefined). */
export function isValidStickerId(id: string | null | undefined): boolean {
  if (id == null || id === "") return true; // null/empty = no sticker = valid
  return VALID_STICKER_IDS.has(id);
}
