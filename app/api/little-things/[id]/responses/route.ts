// POST /api/little-things/[id]/responses — Submit a recipient's answers.
// The [id] param receives the publicId from the client.
// Full server-side validation.

import { NextResponse } from "next/server";
import { responseSubmitSchema } from "@/lib/validations";
import { getLittleThingByPublicId } from "@/lib/data/little-thing";
import { createResponse, ResponseError } from "@/lib/data/response";
import { withTimeout } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: publicId } = await params;

    // 0. Rate limit: max 10 submissions per IP per minute
    const clientIp = getClientIp(request);
    const rl = checkRateLimit(clientIp, {
      namespace: "response-submit",
      maxRequests: 10,
      windowMs: 60_000,
    });

    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a moment and try again. 💌" },
        { status: 429 }
      );
    }

    // 1. Find the Little Thing by publicId (with timeout to prevent infinite hangs)
    const littleThing = await withTimeout(
      getLittleThingByPublicId(publicId),
      10000,
      "Database connection timed out"
    );

    if (!littleThing) {
      return NextResponse.json(
        { error: "We couldn't find this little thing. 💌" },
        { status: 404 }
      );
    }

    // 2. Check status (don't reveal which status)
    if (littleThing.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "This little thing isn't available yet. 💌" },
        { status: 403 }
      );
    }

    // 3. Validate the request body
    const body = await request.json();
    const parsed = responseSubmitSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // 4. Submit the response (includes full server-side validation)
    await createResponse(littleThing.id, parsed.data.answers);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof ResponseError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        error:
          "Hmm... something went wrong while saving your answers. Please try again. 💕",
      },
      { status: 500 }
    );
  }
}
