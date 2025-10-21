-- Remove content columns from tables that have dedicated content tables
-- These tables should use their respective *_content tables instead

-- Remove content column from page (uses page_content table)
ALTER TABLE "page" DROP COLUMN IF EXISTS "content";
--> statement-breakpoint

-- Remove content column from post (uses post_content table)
ALTER TABLE "post" DROP COLUMN IF EXISTS "content";
--> statement-breakpoint

-- Remove content column from piece (uses piece_content table)
ALTER TABLE "piece" DROP COLUMN IF EXISTS "content";
--> statement-breakpoint

-- Remove content column from project (uses project_content table)
ALTER TABLE "project" DROP COLUMN IF EXISTS "content";
--> statement-breakpoint

-- Remove content column from publication (uses publication_content table)
ALTER TABLE "publication" DROP COLUMN IF EXISTS "content";
--> statement-breakpoint

-- Remove content column from packet (uses packet_content table)
ALTER TABLE "packet" DROP COLUMN IF EXISTS "content";
