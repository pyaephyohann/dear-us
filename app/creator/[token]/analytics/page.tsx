import React from "react";
import { getLittleThingByCreatorToken } from "@/lib/data/little-thing";
import { getResponseAnalytics } from "@/lib/data/response";
import { AnalyticsPage } from "@/components/analytics/analytics-page";

type AnalyticsParams = {
  params: Promise<{ token: string }>;
};

export const metadata = {
  title: "Analytics",
};

export default async function AnalyticsRoute({ params }: AnalyticsParams) {
  const { token } = await params;

  let littleThing;
  try {
    littleThing = await getLittleThingByCreatorToken(token);
  } catch {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-3xl">💌</p>
          <h1 className="mt-4 font-roboto text-2xl font-bold text-foreground">
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
          <h1 className="mt-4 font-roboto text-2xl font-bold text-foreground">
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

  let analytics;
  try {
    analytics = await getResponseAnalytics(littleThing.id);
  } catch {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-3xl">📊</p>
          <h1 className="mt-4 font-roboto text-2xl font-bold text-foreground">
            Hmm... we couldn&apos;t load analytics.
          </h1>
          <p className="mt-3 text-sm text-foreground-muted">
            Please try again in a moment.
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

  return (
    <AnalyticsPage
      creatorAccessToken={littleThing.creatorAccessToken}
      title={littleThing.title}
      recipientName={littleThing.recipientName}
      totalResponses={analytics.totalResponses}
      firstResponseAt={analytics.firstResponseAt}
      latestResponseAt={analytics.latestResponseAt}
      activityByDate={analytics.activityByDate}
      questions={analytics.questions}
    />
  );
}
