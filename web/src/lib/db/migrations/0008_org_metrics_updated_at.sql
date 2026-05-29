ALTER TABLE "org_metrics" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
