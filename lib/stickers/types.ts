// Sticker types for DearUs
// Each sticker has a stable ID and a React component for rendering.

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
};
