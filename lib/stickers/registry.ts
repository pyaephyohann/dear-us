// DearUs Sticker Registry
// Source of truth for valid sticker IDs.
// Server validates stickerId against this registry — never trust client input.

import type { StickerId, StickerDefinition } from "./types";

export const STICKER_REGISTRY: Record<StickerId, StickerDefinition> = {
  "cat-love":   { id: "cat-love",   label: "Cat Love 🐱💕" },
  "cat-happy":  { id: "cat-happy",  label: "Cat Happy 🐱✨" },
  "cat-shy":    { id: "cat-shy",    label: "Cat Shy 🐱💗" },
  "cat-kiss":   { id: "cat-kiss",   label: "Cat Kiss 🐱💋" },
  "cat-laugh":  { id: "cat-laugh",  label: "Cat Laugh 🐱😂" },
  "cat-sleepy": { id: "cat-sleepy", label: "Cat Sleepy 🐱💤" },
};

/** All valid sticker IDs. */
export const VALID_STICKER_IDS = new Set<string>(
  Object.keys(STICKER_REGISTRY) as StickerId[]
);

/** Check if a sticker ID is valid (or null/undefined). */
export function isValidStickerId(id: string | null | undefined): boolean {
  if (id == null || id === "") return true; // null/empty = no sticker = valid
  return VALID_STICKER_IDS.has(id);
}
