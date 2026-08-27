import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-light">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-1.5">
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            DearUs
          </span>
          <span className="text-sm transition-transform duration-200 group-hover:scale-110">
            💕
          </span>
        </Link>

        {/* CTA */}
        <Link
          href="/create"
          className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Create Yours
        </Link>
      </div>
    </nav>
  );
}
