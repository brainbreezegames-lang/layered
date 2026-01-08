-- Migration: Add titles and subtitles columns to Article table
-- Run this in Supabase Dashboard > SQL Editor

ALTER TABLE "Article"
ADD COLUMN IF NOT EXISTS "titles" JSONB,
ADD COLUMN IF NOT EXISTS "subtitles" JSONB;

-- Verify columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Article'
AND column_name IN ('titles', 'subtitles');
