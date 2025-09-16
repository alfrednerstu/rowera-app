-- Custom SQL migration file, put your code below! --

-- Step 1: Rename the existing project table to packet temporarily to avoid conflicts
ALTER TABLE "project" RENAME TO "packet_temp";

-- Step 2: Rename the product table to project
ALTER TABLE "product" RENAME TO "project";

-- Step 3: Rename the temporary packet table to packet
ALTER TABLE "packet_temp" RENAME TO "packet";

-- Step 4: Update foreign key column names in related tables

-- Update publication table: productId -> projectId
ALTER TABLE "publication" RENAME COLUMN "product_id" TO "project_id";

-- Update packet table: productId -> projectId  
ALTER TABLE "packet" RENAME COLUMN "product_id" TO "project_id";

-- Update page table: productId -> projectId
ALTER TABLE "page" RENAME COLUMN "product_id" TO "project_id";

-- Update presentation table: productId -> projectId
ALTER TABLE "presentation" RENAME COLUMN "product_id" TO "project_id";

-- Update preset table: projectId -> packetId
ALTER TABLE "preset" RENAME COLUMN "project_id" TO "packet_id";

-- Update piece table: projectId -> packetId
ALTER TABLE "piece" RENAME COLUMN "project_id" TO "packet_id";