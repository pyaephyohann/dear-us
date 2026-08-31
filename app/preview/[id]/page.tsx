import React from "react";
import { getLittleThingById } from "@/lib/data/little-thing";
import { PreviewPage } from "@/components/preview/preview-page";
import type { PreviewLittleThing } from "@/components/preview/preview-page";

type PreviewPageParams = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Preview your Little Thing",
};

export default async function PreviewRoute({ params }: PreviewPageParams) {
  const { id } = await params;

  let littleThing;
  try {
    littleThing = await getLittleThingById(id);
  } catch {
    // Database connection error — show friendly message
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-3xl">💌</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            Hmm... we couldn&apos;t find this little thing.
          </h1>
          <p className="mt-3 text-sm text-foreground-muted">
            It may have been deleted or the link might be wrong.
          </p>
          <a
            href="/create"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Create a new one 💕
          </a>
        </div>
      </main>
    );
  }

  if (!littleThing) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-3xl">💌</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            Hmm... we couldn&apos;t find this little thing.
          </h1>
          <p className="mt-3 text-sm text-foreground-muted">
            It may have been deleted or the link might be wrong.
          </p>
          <a
            href="/create"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Create a new one 💕
          </a>
        </div>
      </main>
    );
  }

  // Map to the client-safe type (strip internal fields if needed)
  const previewData: PreviewLittleThing = {
    id: littleThing.id,
    publicId: littleThing.publicId,
    creatorAccessToken: littleThing.creatorAccessToken,
    title: littleThing.title,
    introMessage: littleThing.introMessage,
    creatorName: littleThing.creatorName,
    recipientName: littleThing.recipientName,
    status: littleThing.status,
    createdAt: littleThing.createdAt.toISOString(),
    questions: littleThing.questions.map((q) => ({
      id: q.id,
      text: q.text,
      order: q.order,
      stickerId: q.stickerId,
      answers: q.answers.map((a) => ({
        id: a.id,
        text: a.text,
        order: a.order,
      })),
    })),
  };

  return <PreviewPage littleThing={previewData} />;
}
