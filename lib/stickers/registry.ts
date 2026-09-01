// DearUs Sticker Registry
// Source of truth for valid sticker IDs and their asset paths.
// Server validates stickerId against this registry — never trust client input.

import type { StickerId, StickerDefinition } from "./types";

export const STICKER_REGISTRY: Record<StickerId, StickerDefinition> = {
  "cat-fight": {
    id: "cat-fight",
    asset: "/stickers/cat-fight.png",
  },
  "cat-with-fish": {
    id: "cat-with-fish",
    asset: "/stickers/cat-with-fish.png",
  },
  "love-milk": {
    id: "love-milk",
    asset: "/stickers/love-milk.png",
  },
  "terrified-hamster": {
    id: "terrified-hamster",
    asset: "/stickers/terrified-hamster.webp",
  },
  "white-and-blue": {
    id: "white-and-blue",
    asset: "/stickers/white-and-blue.webp",
  },
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
