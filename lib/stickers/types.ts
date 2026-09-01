// Sticker types for DearUs
// Each sticker has a stable ID, a label, and a local asset path.

export type StickerId =
  | "cat-fight"
  | "cat-with-fish"
  | "love-milk"
  | "terrified-hamster"
  | "white-and-blue";

export type StickerDefinition = {
  id: StickerId;
  label: string;
  /** Path to the sticker image in /public/stickers/ */
  asset: string;
};
