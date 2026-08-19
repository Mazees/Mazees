-- ============================================================
-- Migration: Add multiple images array to projects table
-- Version: 1.2.0
-- ============================================================

-- Add images column (TEXT ARRAY) to store multiple screenshot URLs
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

COMMENT ON COLUMN projects.images IS 'Array of screenshot image URLs from Supabase Storage';
