-- The initial schema predated the event form contract. Keep event metadata
-- required so every event can be rendered consistently by the dashboard.
ALTER TABLE "events"
  ADD COLUMN "location" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "capacity" INTEGER NOT NULL DEFAULT 0;

-- The form has always supplied an end time. Existing records from before that
-- requirement are made readable before tightening the column constraint.
UPDATE "events" SET "endsAt" = "startsAt" WHERE "endsAt" IS NULL;
ALTER TABLE "events" ALTER COLUMN "endsAt" SET NOT NULL;

-- The Prisma schema uses the conventional double-L spelling. The initial
-- migration created the older spelling, which makes Task writes fail at
-- runtime without this rename.
ALTER TYPE "TaskStatus" RENAME VALUE 'CANCELED' TO 'CANCELLED';
