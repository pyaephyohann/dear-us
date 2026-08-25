import React from "react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-md text-center">
        {/* Brand */}
        <h1 className="font-display text-5xl font-bold tracking-tight text-foreground md:text-6xl">
          DearUs
        </h1>

        <p className="mt-2 font-handwritten text-2xl text-primary">
          for you, for us 💕
        </p>

        {/* Tagline */}
        <p className="mt-8 text-lg leading-relaxed text-foreground-muted">
          Create a little thing for someone you love.
          <br />
          A personalized question experience, made with care.
        </p>

        {/* CTA placeholder */}
        <div className="mt-10">
          <span className="inline-block rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-md transition-colors hover:bg-primary-hover">
            Create Your Little Thing 💕
          </span>
        </div>

        {/* Subtle hint */}
        <p className="mt-16 text-sm text-foreground-subtle">
          Someone made this for you 💌
        </p>
      </div>
    </main>
  );
}
