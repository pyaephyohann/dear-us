"use client";

import { motion } from "framer-motion";
import { STICKER_REGISTRY, getStickerAsset } from "@/lib/stickers";
import type { StickerId } from "@/lib/stickers";
import { useTranslation } from "@/lib/i18n";

interface StickerPickerProps {
  selectedStickerId: string | null;
  onSelect: (stickerId: string | null) => void;
}

/**
 * A compact sticker picker for creator question cards.
 * Shows a "No sticker" option and a grid of sticker image previews.
 */
export function StickerPicker({ selectedStickerId, onSelect }: StickerPickerProps) {
  const { t } = useTranslation();
  const stickerIds = Object.keys(STICKER_REGISTRY) as StickerId[];

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t("stickerChoose")}>
        {/* No sticker option */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(null)}
          className={`flex h-[72px] w-[72px] items-center justify-center rounded-xl border-2 text-xs transition-all sm:h-[80px] sm:w-[80px] ${
            selectedStickerId === null
              ? "border-primary bg-primary-light text-primary font-medium"
              : "border-border-light bg-background text-foreground-subtle hover:border-secondary"
          }`}
          aria-label={t("stickerNone")}
          role="radio"
          aria-checked={selectedStickerId === null}
        >
          <span className="text-lg leading-none" aria-hidden>
            ✕
          </span>
        </motion.button>

        {/* Sticker options */}
        {stickerIds.map((id) => {
          const isSelected = selectedStickerId === id;
          const asset = getStickerAsset(id);

          return (
            <motion.button
              key={id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(id)}
              className={`relative flex h-[72px] w-[72px] items-center justify-center rounded-xl border-2 p-2 transition-all sm:h-[80px] sm:w-[80px] ${
                isSelected
                  ? "border-primary bg-primary-light shadow-sm ring-1 ring-primary/20"
                  : "border-border-light bg-white hover:border-secondary hover:bg-secondary-light"
              }`}
              aria-label={id}
              role="radio"
              aria-checked={isSelected}
            >
              {asset && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={asset}
                  alt=""
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                  loading="lazy"
                  draggable={false}
                />
              )}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-white shadow-sm"
                  aria-hidden
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
