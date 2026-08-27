-- AlterTable
ALTER TABLE "LittleThing" ADD COLUMN "creatorAccessToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "LittleThing_creatorAccessToken_key" ON "LittleThing"("creatorAccessToken");

-- CreateIndex
CREATE INDEX "LittleThing_creatorAccessToken_idx" ON "LittleThing"("creatorAccessToken");
