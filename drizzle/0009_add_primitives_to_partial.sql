-- Add primitives column to partial table
ALTER TABLE "partial" ADD COLUMN IF NOT EXISTS "primitives" json;
