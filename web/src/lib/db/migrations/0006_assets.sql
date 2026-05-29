CREATE TABLE "assets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "filename" varchar(255) NOT NULL,
  "storage_key" text NOT NULL,
  "public_url" text NOT NULL,
  "mime_type" varchar(100) NOT NULL,
  "file_size_bytes" integer NOT NULL,
  "width" integer,
  "height" integer,
  "alt_text" text,
  "content_id" uuid,
  "content_type" varchar(100),
  "upload_status" varchar(20) DEFAULT 'pending' NOT NULL,
  "uploaded_by_user_id" uuid NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "assets"
ADD CONSTRAINT "assets_uploaded_by_user_id_users_id_fk"
FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users"("id")
ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "assets_storage_key_unique" ON "assets" USING btree ("storage_key");--> statement-breakpoint
CREATE INDEX "assets_uploaded_by_idx" ON "assets" USING btree ("uploaded_by_user_id");--> statement-breakpoint
CREATE INDEX "assets_mime_type_idx" ON "assets" USING btree ("mime_type");--> statement-breakpoint
CREATE INDEX "assets_created_at_idx" ON "assets" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "assets_content_ref_idx" ON "assets" USING btree ("content_id","content_type");--> statement-breakpoint
CREATE INDEX "assets_upload_status_idx" ON "assets" USING btree ("upload_status");
