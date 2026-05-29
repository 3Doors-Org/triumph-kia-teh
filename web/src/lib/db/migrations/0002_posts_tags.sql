ALTER TABLE "posts" ADD COLUMN "tags" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
CREATE INDEX "posts_published_door_idx" ON "posts" USING btree ("status","door");--> statement-breakpoint
CREATE INDEX "posts_tags_gin_idx" ON "posts" USING gin ("tags");