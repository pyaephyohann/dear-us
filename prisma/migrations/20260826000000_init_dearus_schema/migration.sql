-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";
-- CreateEnum
CREATE TYPE "LittleThingStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
-- CreateTable
CREATE TABLE "LittleThing" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "introMessage" TEXT,
    "creatorName" TEXT,
    "recipientName" TEXT,
    "status" "LittleThingStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LittleThing_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "littleThingId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "littleThingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "ResponseAnswer" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    CONSTRAINT "ResponseAnswer_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "LittleThing_publicId_key" ON "LittleThing"("publicId");
-- CreateIndex
CREATE INDEX "LittleThing_publicId_idx" ON "LittleThing"("publicId");
-- CreateIndex
CREATE INDEX "LittleThing_status_idx" ON "LittleThing"("status");
-- CreateIndex
CREATE INDEX "Question_littleThingId_idx" ON "Question"("littleThingId");
-- CreateIndex
CREATE INDEX "Question_littleThingId_order_idx" ON "Question"("littleThingId", "order");
-- CreateIndex
CREATE INDEX "Answer_questionId_idx" ON "Answer"("questionId");
-- CreateIndex
CREATE INDEX "Answer_questionId_order_idx" ON "Answer"("questionId", "order");
-- CreateIndex
CREATE INDEX "Response_littleThingId_idx" ON "Response"("littleThingId");
-- CreateIndex
CREATE INDEX "ResponseAnswer_responseId_idx" ON "ResponseAnswer"("responseId");
-- CreateIndex
CREATE INDEX "ResponseAnswer_questionId_idx" ON "ResponseAnswer"("questionId");
-- CreateIndex
CREATE INDEX "ResponseAnswer_answerId_idx" ON "ResponseAnswer"("answerId");
-- CreateIndex
CREATE UNIQUE INDEX "ResponseAnswer_responseId_questionId_key" ON "ResponseAnswer"("responseId", "questionId");
-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_littleThingId_fkey" FOREIGN KEY ("littleThingId") REFERENCES "LittleThing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_littleThingId_fkey" FOREIGN KEY ("littleThingId") REFERENCES "LittleThing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "ResponseAnswer" ADD CONSTRAINT "ResponseAnswer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "ResponseAnswer" ADD CONSTRAINT "ResponseAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "ResponseAnswer" ADD CONSTRAINT "ResponseAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
