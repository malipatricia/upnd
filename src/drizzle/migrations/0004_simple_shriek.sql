ALTER TABLE "members" DROP CONSTRAINT "members_status_status_id_fk";
--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "status" SET DEFAULT 'Pending Section Review';