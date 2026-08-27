// GET /api/little-things/[id] — Fetch a Little Thing for preview.
// Uses the internal ID since this is creator-facing (not public).

import { NextResponse } from "next/server";
import { getLittleThingById } from "@/lib/data/little-thing";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const littleThing = await getLittleThingById(id);

    if (!littleThing) {
      return NextResponse.json(
        { error: "Little Thing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: littleThing.id,
      publicId: littleThing.publicId,
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
        answers: q.answers.map((a) => ({
          id: a.id,
          text: a.text,
          order: a.order,
        })),
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again. 💕" },
      { status: 500 }
    );
  }
}
