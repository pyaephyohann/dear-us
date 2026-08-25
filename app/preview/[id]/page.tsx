import React from "react";

type PreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Preview
        </h1>
        <p className="mt-4 text-foreground-muted">
          Preview your Little Thing before sharing.
        </p>
        <p className="mt-2 text-sm text-foreground-subtle">
          Little Thing ID: {id}
        </p>
        <p className="mt-2 text-sm text-foreground-subtle">
          Coming soon in the next milestone.
        </p>
      </div>
    </main>
  );
}
