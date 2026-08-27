// DearUs — Development seed script
// Creates a realistic example Little Thing for testing and development.
//
// Usage: npx prisma db seed
// Only run in development — never seed production automatically.

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { randomBytes } from "crypto";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding DearUs database...\n");

  // Clean existing data
  await prisma.responseAnswer.deleteMany();
  await prisma.response.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.littleThing.deleteMany();

  // Create a Little Thing
  const littleThing = await prisma.littleThing.create({
    data: {
      publicId: "demo-a-little-something-for-you",
      creatorAccessToken: randomBytes(32).toString("hex"),
      title: "A Little Something For You 💕",
      introMessage:
        "I made this little thing just for you. Answer honestly, okay? 🥹",
      creatorName: "Pyae",
      recipientName: "Someone Special",
      status: "PUBLISHED",
    },
  });

  console.log(`  ✅ Created Little Thing: "${littleThing.title}"`);

  // Question 1
  const q1 = await prisma.question.create({
    data: {
      littleThingId: littleThing.id,
      text: "What's your favorite thing about me?",
      order: 0,
    },
  });

  await prisma.answer.createMany({
    data: [
      { questionId: q1.id, text: "My smile", order: 0 },
      { questionId: q1.id, text: "Your stupid jokes 😂", order: 1 },
      { questionId: q1.id, text: "Your personality", order: 2 },
      { questionId: q1.id, text: "Everything ❤️", order: 3 },
    ],
  });

  console.log(`  ✅ Created Question 1: "${q1.text}" (4 answers)`);

  // Question 2
  const q2 = await prisma.question.create({
    data: {
      littleThingId: littleThing.id,
      text: "Where should we go on our next date?",
      order: 1,
    },
  });

  await prisma.answer.createMany({
    data: [
      { questionId: q2.id, text: "Coffee shop ☕", order: 0 },
      { questionId: q2.id, text: "The beach 🏖️", order: 1 },
      { questionId: q2.id, text: "A cozy movie night 🎬", order: 2 },
      { questionId: q2.id, text: "Surprise me! 🎁", order: 3 },
    ],
  });

  console.log(`  ✅ Created Question 2: "${q2.text}" (4 answers)`);

  // Question 3
  const q3 = await prisma.question.create({
    data: {
      littleThingId: littleThing.id,
      text: "What song makes you think of us?",
      order: 2,
    },
  });

  await prisma.answer.createMany({
    data: [
      { questionId: q3.id, text: "our song (you know the one 🎵)", order: 0 },
      { questionId: q3.id, text: "Something by Taylor Swift", order: 1 },
      { questionId: q3.id, text: "That song from the cafe", order: 2 },
      { questionId: q3.id, text: "I haven't found it yet", order: 3 },
    ],
  });

  console.log(`  ✅ Created Question 3: "${q3.text}" (4 answers)`);

  // Create a draft Little Thing (for testing draft protection)
  await prisma.littleThing.create({
    data: {
      publicId: "demo-draft-little-thing",
      creatorAccessToken: randomBytes(32).toString("hex"),
      title: "Work in Progress 🚧",
      introMessage: "This one is still being crafted...",
      creatorName: "Pyae",
      recipientName: "Work In Progress",
      status: "DRAFT",
    },
  });

  console.log(`  ✅ Created draft Little Thing for testing`);

  console.log("\n🎉 Seed complete!\n");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
