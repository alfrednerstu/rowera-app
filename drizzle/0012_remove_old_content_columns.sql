-- Remove old content/primitives/elements columns that are no longer needed

-- Remove content and primitives columns from page
ALTER TABLE "page" DROP COLUMN IF EXISTS "content";
--> statement-breakpoint
ALTER TABLE "page" DROP COLUMN IF EXISTS "primitives";
--> statement-breakpoint

-- Remove content column from post
ALTER TABLE "post" DROP COLUMN IF EXISTS "content";
--> statement-breakpoint

-- Remove primitives column from preset
ALTER TABLE "preset" DROP COLUMN IF EXISTS "primitives";
--> statement-breakpoint

-- Remove elements and primitives columns from partial
ALTER TABLE "partial" DROP COLUMN IF EXISTS "elements";
--> statement-breakpoint
ALTER TABLE "partial" DROP COLUMN IF EXISTS "primitives";
--> statement-breakpoint

-- Drop old junction tables if they exist
DROP TABLE IF EXISTS "page_partial" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "post_partial" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "piece_partial" CASCADE;
