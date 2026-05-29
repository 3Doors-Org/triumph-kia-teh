CREATE TABLE "research_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title" varchar(220) NOT NULL,
	"summary" text NOT NULL,
	"abstract" text NOT NULL,
	"authors" text[] DEFAULT '{}'::text[] NOT NULL,
	"venue" varchar(220),
	"status" varchar(32) DEFAULT 'published' NOT NULL,
	"external_url" text,
	"published_at" timestamp with time zone,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "research_items_slug_unique" ON "research_items" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "research_items_published_status_idx" ON "research_items" USING btree ("is_published","status");--> statement-breakpoint
CREATE INDEX "research_items_published_at_idx" ON "research_items" USING btree ("published_at");