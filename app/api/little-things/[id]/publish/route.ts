// POST /api/little-things/[id]/publish — Publish a Little Thing.
// Validates completeness before transitioning DRAFT → PUBLISHED.

import { NextResponse } from "next/server";
import { getLittleThingById, updateLittleThingStatus } from "@/lib/data/little-thing";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const littleThing = await getLittleThingById(id);

    if (!littleThing) {
      return NextResponse.json(
        { error: "We couldn't find this little thing. 💌" },
        { status: 404 }
      );
    }

    // Already published — return success (idempotent)
    if (littleThing.status === "PUBLISHED") {
      return NextResponse.json({
        publicId: littleThing.publicId,
        status: "PUBLISHED",
      });
    }

    // Archived — cannot publish
    if (littleThing.status === "ARCHIVED") {
      return NextResponse.json(
        { error: "This little thing has been archived and can't be published. 💕" },
        { status: 400 }
      );
    }

    // Validate completeness
    if (!littleThing.title.trim()) {
      return NextResponse.json(
        { error: "Your little thing needs a title before it can be published. 💕" },
        { status: 400 }
      );
    }

    if (littleThing.questions.length === 0) {
      return NextResponse.json(
        {
          error:
            "Your little thing needs at least one question before it can be published. 💕",
        },
        { status: 400 }
      );
    }

    for (const question of littleThing.questions) {
      if (!question.text.trim()) {
        return NextResponse.json(
          {
            error:
              "Every question needs text before your little thing can be published. 💕",
          },
          { status: 400 }
        );
      }

      if (question.answers.length < 2) {
        return NextResponse.json(
          {
            error:
              "Every question needs at least 2 answers before your little thing can be published. 💕",
          },
          { status: 400 }
        );
      }

      for (const answer of question.answers) {
        if (!answer.text.trim()) {
          return NextResponse.json(
            {
              error:
                "Every answer needs text before your little thing can be published. 💕",
            },
            { status: 400 }
          );
        }
      }
    }

    // Publish
    await updateLittleThingStatus(id, "PUBLISHED");

    return NextResponse.json({
      publicId: littleThing.publicId,
      status: "PUBLISHED",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "We couldn't publish your little thing just yet. Please try again. 💕",
      },
      { status: 500 }
    );
  }
}
