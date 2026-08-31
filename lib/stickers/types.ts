// Sticker types for DearUs
// Each sticker has a stable ID, a label, and a local asset path.

export type StickerId =
  | "cat-love"
  | "cat-happy"
  | "cat-shy"
  | "cat-kiss"
  | "cat-laugh"
  | "cat-sleepy";

export type StickerDefinition = {
  id: StickerId;
  label: string;
  /** Path to the animated sticker asset in /public/stickers/ */
  asset: string;
};
