-- Create preset_primitive table
CREATE TABLE "preset_primitive" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"preset_id" uuid NOT NULL,
	"primitive_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Create partial_primitive table
CREATE TABLE "partial_primitive" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partial_id" uuid NOT NULL,
	"primitive_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Create page_content table
CREATE TABLE "page_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"primitive_id" uuid,
	"source_partial_id" uuid,
	"content" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Create post_content table
CREATE TABLE "post_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"primitive_id" uuid,
	"source_preset_id" uuid,
	"source_partial_id" uuid,
	"content" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Create piece_content table
CREATE TABLE "piece_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"piece_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"primitive_id" uuid,
	"source_preset_id" uuid,
	"source_partial_id" uuid,
	"content" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Add foreign keys for preset_primitive
ALTER TABLE "preset_primitive" ADD CONSTRAINT "preset_primitive_preset_id_preset_id_fk"
	FOREIGN KEY ("preset_id") REFERENCES "public"."preset"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "preset_primitive" ADD CONSTRAINT "preset_primitive_primitive_id_primitive_id_fk"
	FOREIGN KEY ("primitive_id") REFERENCES "public"."primitive"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint

-- Add foreign keys for partial_primitive
ALTER TABLE "partial_primitive" ADD CONSTRAINT "partial_primitive_partial_id_partial_id_fk"
	FOREIGN KEY ("partial_id") REFERENCES "public"."partial"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "partial_primitive" ADD CONSTRAINT "partial_primitive_primitive_id_primitive_id_fk"
	FOREIGN KEY ("primitive_id") REFERENCES "public"."primitive"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint

-- Add foreign keys for page_content
ALTER TABLE "page_content" ADD CONSTRAINT "page_content_page_id_page_id_fk"
	FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "page_content" ADD CONSTRAINT "page_content_primitive_id_primitive_id_fk"
	FOREIGN KEY ("primitive_id") REFERENCES "public"."primitive"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "page_content" ADD CONSTRAINT "page_content_source_partial_id_partial_id_fk"
	FOREIGN KEY ("source_partial_id") REFERENCES "public"."partial"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint

-- Add foreign keys for post_content
ALTER TABLE "post_content" ADD CONSTRAINT "post_content_post_id_post_id_fk"
	FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "post_content" ADD CONSTRAINT "post_content_primitive_id_primitive_id_fk"
	FOREIGN KEY ("primitive_id") REFERENCES "public"."primitive"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "post_content" ADD CONSTRAINT "post_content_source_preset_id_preset_id_fk"
	FOREIGN KEY ("source_preset_id") REFERENCES "public"."preset"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "post_content" ADD CONSTRAINT "post_content_source_partial_id_partial_id_fk"
	FOREIGN KEY ("source_partial_id") REFERENCES "public"."partial"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint

-- Add foreign keys for piece_content
ALTER TABLE "piece_content" ADD CONSTRAINT "piece_content_piece_id_piece_id_fk"
	FOREIGN KEY ("piece_id") REFERENCES "public"."piece"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "piece_content" ADD CONSTRAINT "piece_content_primitive_id_primitive_id_fk"
	FOREIGN KEY ("primitive_id") REFERENCES "public"."primitive"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "piece_content" ADD CONSTRAINT "piece_content_source_preset_id_preset_id_fk"
	FOREIGN KEY ("source_preset_id") REFERENCES "public"."preset"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "piece_content" ADD CONSTRAINT "piece_content_source_partial_id_partial_id_fk"
	FOREIGN KEY ("source_partial_id") REFERENCES "public"."partial"("id") ON DELETE restrict ON UPDATE no action;
