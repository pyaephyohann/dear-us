"use client";

interface CreatorActionsProps {
  isSubmitting: boolean;
  onSave: () => void;
}

export function CreatorActions({ isSubmitting, onSave }: CreatorActionsProps) {
  return (
    <div className="flex flex-col items-center gap-3 pt-4 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onSave}
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Saving...
          </>
        ) : (
          "Save & Continue 💕"
        )}
      </button>
    </div>
  );
}
