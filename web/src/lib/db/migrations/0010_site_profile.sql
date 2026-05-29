CREATE TABLE IF NOT EXISTS "site_profile" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"portrait_public_url" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "site_profile" ("id", "portrait_public_url", "updated_at")
VALUES (1, NULL, now())
ON CONFLICT ("id") DO NOTHING;
