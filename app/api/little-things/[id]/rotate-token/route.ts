// POST /api/little-things/[id]/rotate-token
// Regenerate the creator access token for a Little Thing.
// Requires the current creatorAccessToken in the request body for authorization.

import { NextResponse } from "next/server";
import { getLittleThingByCreatorToken, rotateCreatorToken } from "@/lib/data/little-thing";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteParams) {
  try {
    // Rate limit: max 3 rotations per IP per 10 minutes
    const clientIp = getClientIp(request);
    const rl = checkRateLimit(clientIp, {
      namespace: "rotate-token",
      maxRequests: 3,
      windowMs: 600_000,
    });

    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many rotation attempts. Please wait a moment. 💌" },
        { status: 429 }
      );
    }

    const { id: token } = await params;

    // 1. Verify the current token
    const littleThing = await getLittleThingByCreatorToken(token);

    if (!littleThing) {
      return NextResponse.json(
        { error: "That private link isn't valid anymore. 💌" },
        { status: 404 }
      );
    }

    // 2. Rotate the token
    const newToken = await rotateCreatorToken(littleThing.id);

    return NextResponse.json({
      success: true,
      newCreatorAccessToken: newToken,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "We couldn't rotate your private link just yet. Please try again. 💕",
      },
      { status: 500 }
    );
  }
}
