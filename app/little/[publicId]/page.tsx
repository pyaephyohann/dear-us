import React from "react";
import type { Metadata } from "next";
import { getPublishedLittleThingByPublicId, getLittleThingByPublicId } from "@/lib/data/little-thing";
import { RecipientPage } from "@/components/recipient/recipient-page";
import type { RecipientLittleThing } from "@/components/recipient/recipient-page";

type LittlePageParams = {
  params: Promise<{ publicId: string }>;
};

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function LittlePage({ params }: LittlePageParams) {
  const { publicId } = await params;

  // Try to fetch the published Little Thing
  let littleThing;
  try {
    littleThing = await getPublishedLittleThingByPublicId(publicId);
  } catch {
    // Database connection error — show generic not found
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-3xl">💌</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            Hmm...
          </h1>
          <p className="mt-3 text-sm text-foreground-muted">
            We couldn&apos;t load this little thing right now.
          </p>
        </div>
      </main>
    );
  }

  // Not found — show generic message (don't reveal status)
  if (!littleThing) {
    // Check if it exists but is not published (don't reveal this)
    let exists = false;
    try {
      const raw = await getLittleThingByPublicId(publicId);
      exists = !!raw;
    } catch {
      // Ignore
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-3xl">💌</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            Hmm...
          </h1>
          <p className="mt-3 text-sm text-foreground-muted">
            {exists
              ? "This little thing isn't ready yet."
              : "We couldn't find this little thing."}
          </p>
          <p className="mt-1 text-xs text-foreground-subtle">
            Maybe the link is no longer available.
          </p>
        </div>
      </main>
    );
  }

  // Map to public-safe DTO (strip internal IDs and timestamps)
  const publicData: RecipientLittleThing = {
    publicId: littleThing.publicId,
    title: littleThing.title,
    introMessage: littleThing.introMessage,
    creatorName: littleThing.creatorName,
    recipientName: littleThing.recipientName,
    questions: littleThing.questions.map((q) => ({
      id: q.id,
      text: q.text,
      order: q.order,
      answers: q.answers.map((a) => ({
        id: a.id,
        text: a.text,
        order: a.order,
      })),
    })),
  };

  return <RecipientPage littleThing={publicData} />;
}
