CREATE TABLE "achievements" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" varchar(220) NOT NULL,
  "summary" text NOT NULL,
  "category" varchar(80) NOT NULL,
  "venue" varchar(200),
  "achieved_at" timestamp with time zone,
  "external_url" text,
  "is_published" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "achievements_published_achieved_at_idx" ON "achievements" USING btree ("is_published","achieved_at");--> statement-breakpoint
CREATE INDEX "achievements_category_idx" ON "achievements" USING btree ("category");--> statement-breakpoint

CREATE TABLE "media_appearances" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" varchar(220) NOT NULL,
  "outlet" varchar(220) NOT NULL,
  "format" varchar(32) NOT NULL,
  "summary" text NOT NULL,
  "external_url" text NOT NULL,
  "published_at" timestamp with time zone,
  "is_published" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "media_appearances_published_at_idx" ON "media_appearances" USING btree ("is_published","published_at");--> statement-breakpoint
CREATE INDEX "media_appearances_format_idx" ON "media_appearances" USING btree ("format");
