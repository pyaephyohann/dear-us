import React from "react";

type LittlePageProps = {
  params: Promise<{ publicId: string }>;
};

export default async function LittlePage({ params }: LittlePageProps) {
  const { publicId } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-lg text-center">
        <p className="font-handwritten text-xl text-primary">
          Someone made this for you 💌
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold text-foreground">
          Your Little Thing
        </h1>
        <p className="mt-4 text-foreground-muted">
          This is where you&apos;ll answer the questions someone prepared for you.
        </p>
        <p className="mt-2 text-sm text-foreground-subtle">
          Public ID: {publicId}
        </p>
        <p className="mt-2 text-sm text-foreground-subtle">
          Coming soon in the next milestone.
        </p>
      </div>
    </main>
  );
}
