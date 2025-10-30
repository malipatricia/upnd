ALTER TABLE "satus" RENAME TO "status";--> statement-breakpoint
ALTER TABLE "status" DROP CONSTRAINT "satus_name_unique";--> statement-breakpoint
ALTER TABLE "members" DROP CONSTRAINT "members_status_satus_id_fk";
--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_status_status_id_fk" FOREIGN KEY ("status") REFERENCES "public"."status"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status" ADD CONSTRAINT "status_name_unique" UNIQUE("name");

INSERT INTO roles (name, description)
VALUES ('admin', 'System administrator with full permissions')
ON CONFLICT (name) DO NOTHING;

INSERT INTO status (name, description)
VALUES ('Pending Section Review', 'Initial review stage before higher-level approvals')
ON CONFLICT (name) DO NOTHING;

