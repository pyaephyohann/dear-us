// POST /api/little-things/[id]/publish — Publish a Little Thing.
// Requires creatorAccessToken in the request body for authorization.
// Validates completeness before transitioning DRAFT → PUBLISHED.

import { NextResponse } from "next/server";
import { getLittleThingById, getLittleThingByCreatorToken, updateLittleThingStatus } from "@/lib/data/little-thing";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: littleThingId } = await params;

    // 1. Verify creatorAccessToken is provided
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      // GET without body — still check token below
    }

    if (!body.creatorAccessToken || typeof body.creatorAccessToken !== "string") {
      return NextResponse.json(
        { error: "Creator access token is required. 💌" },
        { status: 401 }
      );
    }

    // 2. Verify the token maps to this LittleThing
    const tokenLittleThing = await getLittleThingByCreatorToken(body.creatorAccessToken);
    if (!tokenLittleThing || tokenLittleThing.id !== littleThingId) {
      return NextResponse.json(
        { error: "That private link isn't valid anymore. 💌" },
        { status: 403 }
      );
    }

    const littleThing = await getLittleThingById(littleThingId);

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
        creatorAccessToken: littleThing.creatorAccessToken,
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
    await updateLittleThingStatus(littleThingId, "PUBLISHED");

    return NextResponse.json({
      publicId: littleThing.publicId,
      creatorAccessToken: littleThing.creatorAccessToken,
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
