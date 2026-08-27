export function Footer() {
  return (
    <footer className="border-t border-border-light px-5 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl text-center">
        <p className="font-display text-sm font-semibold text-foreground">
          DearUs <span className="text-primary">💕</span>
        </p>
        <p className="mt-1 text-xs text-foreground-subtle">
          Made for little moments that mean a lot.
        </p>
        <p className="mt-2 text-xs text-foreground-subtle">
          &copy; {new Date().getFullYear()} DearUs
        </p>
      </div>
    </footer>
  );
}
