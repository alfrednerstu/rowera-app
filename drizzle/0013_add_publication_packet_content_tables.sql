-- Create publication_content table
CREATE TABLE IF NOT EXISTS "publication_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"publication_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"primitive_id" uuid,
	"source_preset_id" uuid,
	"source_partial_id" uuid,
	"content" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create packet_content table
CREATE TABLE IF NOT EXISTS "packet_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"packet_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"primitive_id" uuid,
	"source_preset_id" uuid,
	"source_partial_id" uuid,
	"content" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign keys for publication_content
DO $$ BEGIN
 ALTER TABLE "publication_content" ADD CONSTRAINT "publication_content_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "publication_content" ADD CONSTRAINT "publication_content_primitive_id_primitive_id_fk" FOREIGN KEY ("primitive_id") REFERENCES "public"."primitive"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "publication_content" ADD CONSTRAINT "publication_content_source_preset_id_preset_id_fk" FOREIGN KEY ("source_preset_id") REFERENCES "public"."preset"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "publication_content" ADD CONSTRAINT "publication_content_source_partial_id_partial_id_fk" FOREIGN KEY ("source_partial_id") REFERENCES "public"."partial"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Add foreign keys for packet_content
DO $$ BEGIN
 ALTER TABLE "packet_content" ADD CONSTRAINT "packet_content_packet_id_packet_id_fk" FOREIGN KEY ("packet_id") REFERENCES "public"."packet"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "packet_content" ADD CONSTRAINT "packet_content_primitive_id_primitive_id_fk" FOREIGN KEY ("primitive_id") REFERENCES "public"."primitive"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "packet_content" ADD CONSTRAINT "packet_content_source_preset_id_preset_id_fk" FOREIGN KEY ("source_preset_id") REFERENCES "public"."preset"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "packet_content" ADD CONSTRAINT "packet_content_source_partial_id_partial_id_fk" FOREIGN KEY ("source_partial_id") REFERENCES "public"."partial"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
