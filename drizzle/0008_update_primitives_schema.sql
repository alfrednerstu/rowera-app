-- Update primitive table to new schema
ALTER TABLE "primitive" DROP COLUMN IF EXISTS "tag_name";
ALTER TABLE "primitive" DROP COLUMN IF EXISTS "attributes";
ALTER TABLE "primitive" DROP COLUMN IF EXISTS "default_content";
ALTER TABLE "primitive" DROP COLUMN IF EXISTS "css_styles";

ALTER TABLE "primitive" ADD COLUMN IF NOT EXISTS "description" text NOT NULL DEFAULT '';
ALTER TABLE "primitive" ADD COLUMN IF NOT EXISTS "tags" text NOT NULL DEFAULT '';

-- Remove defaults after adding columns
ALTER TABLE "primitive" ALTER COLUMN "description" DROP DEFAULT;
ALTER TABLE "primitive" ALTER COLUMN "tags" DROP DEFAULT;

-- Add foreign key constraint if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'primitive_field_primitive_id_primitive_id_fk'
    ) THEN
        ALTER TABLE "primitive_field" ADD CONSTRAINT "primitive_field_primitive_id_primitive_id_fk"
            FOREIGN KEY ("primitive_id") REFERENCES "public"."primitive"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;
