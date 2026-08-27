import React from "react";
import { getLittleThingById } from "@/lib/data/little-thing";
import { getResponsesByLittleThing } from "@/lib/data/response";
import { ResponseListPage } from "@/components/responses/response-list-page";

type ResponseListParams = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Responses",
};

export default async function ResponseListRoute({ params }: ResponseListParams) {
  const { id } = await params;

  let littleThing;
  try {
    littleThing = await getLittleThingById(id);
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

  let responses;
  try {
    responses = await getResponsesByLittleThing(id);
  } catch {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-3xl">💌</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            Hmm... 💌
          </h1>
          <p className="mt-3 text-sm text-foreground-muted">
            We couldn&apos;t load the answers right now.
          </p>
          <a
            href={`/creator/${id}/responses`}
            className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Try Again
          </a>
        </div>
      </main>
    );
  }

  const safeResponses = responses.map((r) => ({
    id: r.id,
    createdAt: r.createdAt.toISOString(),
    completedAt: r.completedAt?.toISOString() ?? null,
    responseAnswers: r.responseAnswers.map((ra) => ({
      question: {
        id: ra.question.id,
        text: ra.question.text,
        order: ra.question.order,
      },
      answer: {
        id: ra.answer.id,
        text: ra.answer.text,
      },
    })),
  }));

  return (
    <ResponseListPage
      littleThingId={littleThing.id}
      publicId={littleThing.publicId}
      title={littleThing.title}
      recipientName={littleThing.recipientName}
      responses={safeResponses}
    />
  );
}
