CREATE TABLE "testimonials" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "author_name" varchar(150) NOT NULL,
  "author_title" varchar(200),
  "author_organization" varchar(200),
  "quote" text NOT NULL,
  "status" varchar(20) DEFAULT 'published' NOT NULL,
  "avatar_url" text,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_published" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "testimonials_published_sort_idx" ON "testimonials" USING btree ("is_published","sort_order","id");--> statement-breakpoint
CREATE INDEX "testimonials_status_idx" ON "testimonials" USING btree ("status");
