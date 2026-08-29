// DELETE /api/little-things/[id]/responses/[responseId]
// Deletes a response with creator token authorization.

import { NextResponse } from "next/server";
import { getLittleThingByCreatorToken } from "@/lib/data/little-thing";
import { deleteResponse, ResponseError } from "@/lib/data/response";

type RouteParams = {
  params: Promise<{ id: string; responseId: string }>;
};

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id: token, responseId } = await params;

    // 1. Verify creator token
    const littleThing = await getLittleThingByCreatorToken(token);

    if (!littleThing) {
      return NextResponse.json(
        { error: "That private link isn't valid anymore. 💌" },
        { status: 404 }
      );
    }

    // 2. Delete the response (with ownership verification inside)
    await deleteResponse(responseId, littleThing.id);

    return NextResponse.json({ success: true });
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
          "We couldn't delete this response just yet. Please try again. 💕",
      },
      { status: 500 }
    );
  }
}
