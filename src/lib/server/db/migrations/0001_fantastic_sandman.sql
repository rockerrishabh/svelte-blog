DROP TABLE "providers" CASCADE;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "provider" "provider" DEFAULT 'Credentials' NOT NULL;