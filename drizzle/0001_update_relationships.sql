-- Drop old tables that don't match the new structure
DROP TABLE IF EXISTS "element_templates" CASCADE;
DROP TABLE IF EXISTS "feeds" CASCADE;
DROP TABLE IF EXISTS "presentations" CASCADE;

-- Update posts table structure (remove feed reference, add publication and preset references)
ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS "posts_feed_id_feeds_id_fk";
ALTER TABLE "posts" DROP COLUMN IF EXISTS "feed_id";
ALTER TABLE "posts" ADD COLUMN "publication_id" uuid NOT NULL;
ALTER TABLE "posts" ADD COLUMN "preset_id" uuid NOT NULL;
ALTER TABLE "posts" ALTER COLUMN "slug" DROP NOT NULL;
ALTER TABLE "posts" ALTER COLUMN "content" DROP NOT NULL;

-- Update pages table structure (remove user reference, add product reference)
ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_user_id_users_id_fk";
ALTER TABLE "pages" DROP COLUMN IF EXISTS "user_id";
ALTER TABLE "pages" DROP COLUMN IF EXISTS "title";
ALTER TABLE "pages" DROP COLUMN IF EXISTS "content";
ALTER TABLE "pages" DROP COLUMN IF EXISTS "is_published";
ALTER TABLE "pages" DROP COLUMN IF EXISTS "published_at";
ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_slug_unique";
ALTER TABLE "pages" ADD COLUMN "name" varchar(255) NOT NULL;
ALTER TABLE "pages" ADD COLUMN "product_id" uuid NOT NULL;

-- Update partials table structure (remove user reference and slug)
ALTER TABLE "partials" DROP CONSTRAINT IF EXISTS "partials_user_id_users_id_fk";
ALTER TABLE "partials" DROP COLUMN IF EXISTS "user_id";
ALTER TABLE "partials" DROP COLUMN IF EXISTS "slug";
ALTER TABLE "partials" DROP COLUMN IF EXISTS "description";
ALTER TABLE "partials" DROP COLUMN IF EXISTS "elements";

-- Create products table
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create parts table
CREATE TABLE "parts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"page_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create primitives table (renamed from element_templates)
CREATE TABLE "primitives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"tag_name" varchar(50) NOT NULL,
	"attributes" json,
	"default_content" text,
	"css_styles" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create publications table
CREATE TABLE "publications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"product_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create presets table
CREATE TABLE "presets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"publication_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create projects table
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"product_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create pieces table
CREATE TABLE "pieces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"project_id" uuid NOT NULL,
	"preset_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create junction tables for many-to-many relationships
CREATE TABLE "part_partials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"part_id" uuid NOT NULL,
	"partial_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "part_primitives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"part_id" uuid NOT NULL,
	"primitive_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "partial_primitives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partial_id" uuid NOT NULL,
	"primitive_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "post_partials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"partial_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "post_primitives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"primitive_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "preset_parts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"preset_id" uuid NOT NULL,
	"part_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "piece_partials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"piece_id" uuid NOT NULL,
	"partial_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "piece_primitives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"piece_id" uuid NOT NULL,
	"primitive_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraints
ALTER TABLE "products" ADD CONSTRAINT "products_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages" ADD CONSTRAINT "pages_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "parts" ADD CONSTRAINT "parts_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "publications" ADD CONSTRAINT "publications_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "presets" ADD CONSTRAINT "presets_publication_id_publications_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "posts" ADD CONSTRAINT "posts_publication_id_publications_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "posts" ADD CONSTRAINT "posts_preset_id_presets_id_fk" FOREIGN KEY ("preset_id") REFERENCES "public"."presets"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "projects" ADD CONSTRAINT "projects_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pieces" ADD CONSTRAINT "pieces_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pieces" ADD CONSTRAINT "pieces_preset_id_presets_id_fk" FOREIGN KEY ("preset_id") REFERENCES "public"."presets"("id") ON DELETE restrict ON UPDATE no action;

-- Add foreign keys for junction tables
ALTER TABLE "part_partials" ADD CONSTRAINT "part_partials_part_id_parts_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."parts"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "part_partials" ADD CONSTRAINT "part_partials_partial_id_partials_id_fk" FOREIGN KEY ("partial_id") REFERENCES "public"."partials"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "part_primitives" ADD CONSTRAINT "part_primitives_part_id_parts_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."parts"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "part_primitives" ADD CONSTRAINT "part_primitives_primitive_id_primitives_id_fk" FOREIGN KEY ("primitive_id") REFERENCES "public"."primitives"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "partial_primitives" ADD CONSTRAINT "partial_primitives_partial_id_partials_id_fk" FOREIGN KEY ("partial_id") REFERENCES "public"."partials"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "partial_primitives" ADD CONSTRAINT "partial_primitives_primitive_id_primitives_id_fk" FOREIGN KEY ("primitive_id") REFERENCES "public"."primitives"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "post_partials" ADD CONSTRAINT "post_partials_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "post_partials" ADD CONSTRAINT "post_partials_partial_id_partials_id_fk" FOREIGN KEY ("partial_id") REFERENCES "public"."partials"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "post_primitives" ADD CONSTRAINT "post_primitives_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "post_primitives" ADD CONSTRAINT "post_primitives_primitive_id_primitives_id_fk" FOREIGN KEY ("primitive_id") REFERENCES "public"."primitives"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "preset_parts" ADD CONSTRAINT "preset_parts_preset_id_presets_id_fk" FOREIGN KEY ("preset_id") REFERENCES "public"."presets"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "preset_parts" ADD CONSTRAINT "preset_parts_part_id_parts_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."parts"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "piece_partials" ADD CONSTRAINT "piece_partials_piece_id_pieces_id_fk" FOREIGN KEY ("piece_id") REFERENCES "public"."pieces"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "piece_partials" ADD CONSTRAINT "piece_partials_partial_id_partials_id_fk" FOREIGN KEY ("partial_id") REFERENCES "public"."partials"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "piece_primitives" ADD CONSTRAINT "piece_primitives_piece_id_pieces_id_fk" FOREIGN KEY ("piece_id") REFERENCES "public"."pieces"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "piece_primitives" ADD CONSTRAINT "piece_primitives_primitive_id_primitives_id_fk" FOREIGN KEY ("primitive_id") REFERENCES "public"."primitives"("id") ON DELETE cascade ON UPDATE no action;