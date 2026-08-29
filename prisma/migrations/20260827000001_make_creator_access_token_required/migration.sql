-- Backfill any NULL creatorAccessToken values with generated hex tokens
-- Uses md5(random()||clock_timestamp()) which works across all PostgreSQL versions
UPDATE "LittleThing"
SET "creatorAccessToken" = md5(random()::text || clock_timestamp()::text) || md5(random()::text || clock_timestamp()::text)
WHERE "creatorAccessToken" IS NULL;

-- Make creatorAccessToken NOT NULL
ALTER TABLE "LittleThing" ALTER COLUMN "creatorAccessToken" SET NOT NULL;
