import React from "react";
import { getLittleThingByCreatorToken } from "@/lib/data/little-thing";
import { getResponseAnalytics } from "@/lib/data/response";
import { DashboardPage } from "@/components/dashboard/dashboard-page";

type DashboardParams = {
  params: Promise<{ token: string }>;
};

export const metadata = {
  title: "Your Little Thing",
};

export default async function DashboardRoute({ params }: DashboardParams) {
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

  // Fetch analytics summary (lightweight — just first/last response dates)
  let firstResponseAt: string | null = null;
  let latestResponseAt: string | null = null;
  if (littleThing._count.responses > 0) {
    try {
      const analytics = await getResponseAnalytics(littleThing.id);
      firstResponseAt = analytics.firstResponseAt;
      latestResponseAt = analytics.latestResponseAt;
    } catch {
      // Non-critical — dashboard still works without analytics
    }
  }

  return (
    <DashboardPage
      creatorAccessToken={littleThing.creatorAccessToken}
      publicId={littleThing.publicId}
      littleThingId={littleThing.id}
      title={littleThing.title}
      recipientName={littleThing.recipientName}
      creatorName={littleThing.creatorName}
      status={littleThing.status}
      responseCount={littleThing._count.responses}
      firstResponseAt={firstResponseAt}
      latestResponseAt={latestResponseAt}
      createdAt={littleThing.createdAt.toISOString()}
      updatedAt={littleThing.updatedAt.toISOString()}
    />
  );
}
