// POST /api/little-things — Create a Little Thing with questions and answers.
// All data is validated server-side. The entire creation is atomic (transaction).

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { littleThingFullCreateSchema } from "@/lib/validations";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate with Zod
    const parsed = littleThingFullCreateSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const data = parsed.data;

    // 2. Create everything in a single transaction
    const littleThing = await prisma.$transaction(async (tx) => {
      const lt = await tx.littleThing.create({
        data: {
          title: data.title,
          introMessage: data.introMessage || null,
          creatorName: data.creatorName || null,
          recipientName: data.recipientName || null,
          publicId: crypto.randomUUID(),
          creatorAccessToken: randomBytes(32).toString("hex"),
          status: "DRAFT",
        },
      });

      for (let qi = 0; qi < data.questions.length; qi++) {
        const q = data.questions[qi];

        const question = await tx.question.create({
          data: {
            littleThingId: lt.id,
            text: q.text,
            order: qi,
          },
        });

        await tx.answer.createMany({
          data: q.answers.map((a, ai) => ({
            questionId: question.id,
            text: a.text,
            order: ai,
          })),
        });
      }

      return lt;
    });

    return NextResponse.json(
      { id: littleThing.id, publicId: littleThing.publicId, creatorAccessToken: littleThing.creatorAccessToken },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while saving your little thing. Please try again. 💕" },
      { status: 500 }
    );
  }
}
