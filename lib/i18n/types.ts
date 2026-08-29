export type Language = "en" | "my";

export type TranslationDict = Record<string, string>;

export type TFunction = (
  key: string,
  params?: Record<string, string | number>
) => string;
