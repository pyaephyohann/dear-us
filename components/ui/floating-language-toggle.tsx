import { LanguageToggle } from "./language-toggle";

/**
 * Floating language toggle positioned at top-right.
 * Reusable across pages that don't have a navbar.
 */
export function FloatingLanguageToggle() {
  return (
    <div className="fixed right-4 top-4 z-30">
      <LanguageToggle />
    </div>
  );
}
