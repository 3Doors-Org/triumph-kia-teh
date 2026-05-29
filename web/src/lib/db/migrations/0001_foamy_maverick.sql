CREATE TABLE "community_impact_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(180) NOT NULL,
	"summary" text NOT NULL,
	"door" varchar(20) NOT NULL,
	"type" varchar(50) NOT NULL,
	"org_slug" varchar(64),
	"metric_label" varchar(100) NOT NULL,
	"metric_value" integer NOT NULL,
	"start_date" timestamp with time zone,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"label" varchar(120) NOT NULL,
	"value" integer NOT NULL,
	"suffix" varchar(30) DEFAULT '+' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "source_page" varchar(120) DEFAULT '/contact' NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "ip_hash" varchar(128);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "user_agent_hash" varchar(128);--> statement-breakpoint
ALTER TABLE "org_metrics" ADD CONSTRAINT "org_metrics_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "community_impact_door_idx" ON "community_impact_entries" USING btree ("door");--> statement-breakpoint
CREATE INDEX "community_impact_type_idx" ON "community_impact_entries" USING btree ("type");--> statement-breakpoint
CREATE INDEX "org_metrics_org_id_idx" ON "org_metrics" USING btree ("org_id");