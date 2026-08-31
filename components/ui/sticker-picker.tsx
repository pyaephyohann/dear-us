"use client";

import { motion } from "framer-motion";
import { STICKER_REGISTRY } from "@/lib/stickers";
import { StickerRenderer } from "@/lib/stickers";
import type { StickerId } from "@/lib/stickers";
import { useTranslation } from "@/lib/i18n";

interface StickerPickerProps {
  selectedStickerId: string | null;
  onSelect: (stickerId: string | null) => void;
}

/**
 * A compact sticker picker for creator question cards.
 * Shows a "No sticker" option and a grid of sticker previews.
 */
export function StickerPicker({ selectedStickerId, onSelect }: StickerPickerProps) {
  const { t } = useTranslation();
  const stickerIds = Object.keys(STICKER_REGISTRY) as StickerId[];

  return (
    <div className="mt-3">
      <p className="text-xs font-medium text-foreground-subtle mb-2">
        {t("stickerLabel")}
      </p>

      <div className="flex flex-wrap gap-2">
        {/* No sticker option */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(null)}
          className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 text-xs transition-all sm:h-[72px] sm:w-[72px] ${
            selectedStickerId === null
              ? "border-primary bg-primary-light text-primary font-medium"
              : "border-border-light bg-background text-foreground-subtle hover:border-secondary"
          }`}
          aria-label={t("stickerNone")}
          role="radio"
          aria-checked={selectedStickerId === null}
        >
          <span className="text-lg leading-none">✕</span>
        </motion.button>

        {/* Sticker options */}
        {stickerIds.map((id) => {
          const def = STICKER_REGISTRY[id];
          const isSelected = selectedStickerId === id;

          return (
            <motion.button
              key={id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(id)}
              className={`relative flex h-16 w-16 items-center justify-center rounded-xl border-2 transition-all sm:h-[72px] sm:w-[72px] ${
                isSelected
                  ? "border-primary bg-primary-light shadow-sm"
                  : "border-border-light bg-white hover:border-secondary hover:bg-secondary-light"
              }`}
              aria-label={def.label}
              role="radio"
              aria-checked={isSelected}
            >
              <StickerRenderer stickerId={id} size={48} />
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-white"
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
