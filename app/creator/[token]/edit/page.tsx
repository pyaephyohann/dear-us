import React from "react";
import { getLittleThingForEditing } from "@/lib/data/little-thing";
import { CreatorPage } from "@/components/creator/creator-page";
import type { EditorInitialData } from "@/components/creator/creator-page";

type EditPageParams = {
  params: Promise<{ token: string }>;
};

export const metadata = {
  title: "Edit Little Thing",
};

export default async function EditRoute({ params }: EditPageParams) {
  const { token } = await params;

  let littleThing;
  try {
    littleThing = await getLittleThingForEditing(token);
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

  // Prevent editing archived Little Things
  if (littleThing.status === "ARCHIVED") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-3xl">💌</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            This little thing has been archived. 💌
          </h1>
          <p className="mt-3 text-sm text-foreground-muted">
            It can&apos;t be edited right now.
          </p>
          <a
            href={`/creator/${token}`}
            className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Back to dashboard 💕
          </a>
        </div>
      </main>
    );
  }

  const editData: EditorInitialData = {
    id: littleThing.id,
    creatorAccessToken: littleThing.creatorAccessToken,
    title: littleThing.title,
    introMessage: littleThing.introMessage,
    creatorName: littleThing.creatorName,
    recipientName: littleThing.recipientName,
    questions: littleThing.questions.map((q) => ({
      id: q.id,
      text: q.text,
      stickerId: q.stickerId,
      answers: q.answers.map((a) => ({
        id: a.id,
        text: a.text,
      })),
    })),
  };

  return <CreatorPage editMode={editData} />;
}
