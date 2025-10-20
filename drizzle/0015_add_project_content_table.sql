-- Create project_content table
CREATE TABLE IF NOT EXISTS "project_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"primitive_id" uuid,
	"source_preset_id" uuid,
	"source_partial_id" uuid,
	"content" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign keys for project_content
DO $$ BEGIN
 ALTER TABLE "project_content" ADD CONSTRAINT "project_content_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "project_content" ADD CONSTRAINT "project_content_primitive_id_primitive_id_fk" FOREIGN KEY ("primitive_id") REFERENCES "public"."primitive"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "project_content" ADD CONSTRAINT "project_content_source_preset_id_preset_id_fk" FOREIGN KEY ("source_preset_id") REFERENCES "public"."preset"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "project_content" ADD CONSTRAINT "project_content_source_partial_id_partial_id_fk" FOREIGN KEY ("source_partial_id") REFERENCES "public"."partial"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
