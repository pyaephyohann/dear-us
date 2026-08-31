"use client";

import { motion } from "framer-motion";
import { STICKER_REGISTRY, getStickerAsset } from "@/lib/stickers";
import type { StickerId } from "@/lib/stickers";
import { useTranslation } from "@/lib/i18n";

/** Map sticker IDs to their label translation keys. */
const STICKER_LABELS: Record<StickerId, string> = {
  "cat-love": "stickerLove",
  "cat-happy": "stickerHappy",
  "cat-shy": "stickerShy",
  "cat-kiss": "stickerKiss",
  "cat-laugh": "stickerLaugh",
  "cat-sleepy": "stickerSleepy",
};

interface StickerPickerProps {
  selectedStickerId: string | null;
  onSelect: (stickerId: string | null) => void;
}

/**
 * A compact sticker picker for creator question cards.
 * Shows a "No sticker" option and a grid of animated sticker previews with labels.
 */
export function StickerPicker({ selectedStickerId, onSelect }: StickerPickerProps) {
  const { t } = useTranslation();
  const stickerIds = Object.keys(STICKER_REGISTRY) as StickerId[];

  return (
    <div className="mt-3">
      <p className="text-xs font-medium text-foreground-subtle mb-2">
        {t("stickerLabel")}
      </p>

      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t("stickerChoose")}>
        {/* No sticker option */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(null)}
          className={`flex h-[72px] w-[72px] flex-col items-center justify-center gap-0.5 rounded-xl border-2 text-xs transition-all sm:h-[80px] sm:w-[80px] ${
            selectedStickerId === null
              ? "border-primary bg-primary-light text-primary font-medium"
              : "border-border-light bg-background text-foreground-subtle hover:border-secondary"
          }`}
          aria-label={t("stickerNone")}
          role="radio"
          aria-checked={selectedStickerId === null}
        >
          <span className="text-lg leading-none">✕</span>
          <span className="text-[10px] leading-tight">{t("stickerNone")}</span>
        </motion.button>

        {/* Sticker options */}
        {stickerIds.map((id) => {
          const isSelected = selectedStickerId === id;
          const labelKey = STICKER_LABELS[id];
          const asset = getStickerAsset(id);

          return (
            <motion.button
              key={id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(id)}
              className={`relative flex h-[72px] w-[72px] flex-col items-center justify-center gap-0.5 rounded-xl border-2 transition-all sm:h-[80px] sm:w-[80px] ${
                isSelected
                  ? "border-primary bg-primary-light shadow-sm ring-1 ring-primary/20"
                  : "border-border-light bg-white hover:border-secondary hover:bg-secondary-light"
              }`}
              aria-label={t(labelKey)}
              role="radio"
              aria-checked={isSelected}
            >
              {asset && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={asset}
                  alt={t(labelKey)}
                  width={44}
                  height={44}
                  className="h-[44px] w-[44px] object-contain"
                  loading="lazy"
                  draggable={false}
                />
              )}
              <span className={`text-[10px] leading-tight ${isSelected ? "text-primary font-medium" : "text-foreground-subtle"}`}>
                {t(labelKey)}
              </span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-white shadow-sm"
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
