import type { Language } from "./types";

/**
 * Language-aware relative time formatting.
 * Returns human-friendly relative times like "3 minutes ago" (EN)
 * or "လွန်ခဲ့တဲ့ ၃ မိနစ်က" (MY).
 */
export function formatRelativeTime(
  dateString: string,
  language: Language
): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (language === "my") {
    return formatRelativeTimeMy(diffMinutes, diffHours, diffDays);
  }
  return formatRelativeTimeEn(diffMinutes, diffHours, diffDays);
}

function formatRelativeTimeEn(
  diffMinutes: number,
  diffHours: number,
  diffDays: number
): string {
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7)
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return "";
}

function formatRelativeTimeMy(
  diffMinutes: number,
  diffHours: number,
  diffDays: number
): string {
  if (diffMinutes < 1) return "အခုပဲ";
  if (diffMinutes < 60)
    return `လွန်ခဲ့တဲ့ ${toMyanmarNum(diffMinutes)} မိနစ်က`;
  if (diffHours < 24)
    return `လွန်ခဲ့တဲ့ ${toMyanmarNum(diffHours)} နာရီက`;
  if (diffDays < 7)
    return `လွန်ခဲ့တဲ့ ${toMyanmarNum(diffDays)} ရက်က`;
  return "";
}

/**
 * Language-aware absolute date formatting (short: "Jan 5").
 */
export function formatDateShort(
  dateString: string,
  language: Language
): string {
  const date = new Date(dateString);
  if (language === "my") {
    return formatDateMy(date);
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Language-aware absolute date formatting (long: "January 5, 2026").
 */
export function formatDateLong(
  dateString: string,
  language: Language
): string {
  const date = new Date(dateString);
  if (language === "my") {
    return formatDateMyLong(date);
  }
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Language-aware absolute date formatting (full with time).
 */
export function formatDateTime(
  dateString: string,
  language: Language
): string {
  const date = new Date(dateString);
  if (language === "my") {
    return formatDateTimeMy(date);
  }
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Format a date for chart axis labels (short).
 */
export function formatChartDate(
  dateString: string,
  language: Language
): string {
  const date = new Date(dateString);
  if (language === "my") {
    return formatDateMy(date);
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Myanmar date helpers
// ---------------------------------------------------------------------------

const MYANMAR_MONTHS = [
  "ဇန်နဝါရီ",
  "ဖေဖော်ဝါရီ",
  "မတ်",
  "ဧပြီ",
  "မေ",
  "ဇွန်",
  "ဇူလိုင်",
  "ဩဂုတ်",
  "စက်တင်ဘာ",
  "အောက်တိုဘာ",
  "နိုဝင်ဘာ",
  "ဒီဇင်ဘာ",
];

/** Convert Arabic numeral to Myanmar numeral. */
export function toMyanmarNum(n: number): string {
  const myanmarDigits = ["၀", "၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉"];
  return String(n)
    .split("")
    .map((d) => {
      const digit = parseInt(d, 10);
      return Number.isNaN(digit) ? d : myanmarDigits[digit];
    })
    .join("");
}

function formatDateMy(date: Date): string {
  const month = MYANMAR_MONTHS[date.getMonth()];
  const day = toMyanmarNum(date.getDate());
  return `${month} ${day}`;
}

function formatDateMyLong(date: Date): string {
  const month = MYANMAR_MONTHS[date.getMonth()];
  const day = toMyanmarNum(date.getDate());
  const year = toMyanmarNum(date.getFullYear());
  return `${year}ခုနှစ် ${month} ${day}ရက်`;
}

function formatDateTimeMy(date: Date): string {
  const month = MYANMAR_MONTHS[date.getMonth()];
  const day = toMyanmarNum(date.getDate());
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "ညနေ" : "မနက်";
  const h12 = hours % 12 || 12;
  const m = minutes < 10 ? `၀${toMyanmarNum(minutes)}` : toMyanmarNum(minutes);
  return `${month} ${day}ရက် ${period} ${toMyanmarNum(h12)}:${m}`;
}
