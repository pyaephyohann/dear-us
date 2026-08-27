import React from "react";
import { getLittleThingByCreatorToken } from "@/lib/data/little-thing";
import { SharePage } from "@/components/share/share-page";

type SharePageParams = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Share your Little Thing",
};

export default async function ShareRoute({ params }: SharePageParams) {
  const { id } = await params;

  // The [id] param is now the creatorAccessToken
  let littleThing;
  try {
    littleThing = await getLittleThingByCreatorToken(id);
  } catch {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-3xl">💌</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            Hmm... we couldn&apos;t load this page.
          </h1>
          <p className="mt-3 text-sm text-foreground-muted">
            Please try again in a moment.
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
            That private link isn&apos;t valid anymore. 💌
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

  return (
    <SharePage
      id={littleThing.id}
      creatorAccessToken={littleThing.creatorAccessToken}
      publicId={littleThing.publicId}
      title={littleThing.title}
      recipientName={littleThing.recipientName}
    />
  );
}
