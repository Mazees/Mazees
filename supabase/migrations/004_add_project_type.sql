-- ============================================================
-- Migration: Add project_type to projects table
-- Version: 1.3.0
-- ============================================================

-- Add project_type column: 'client' | 'personal' | 'opensource'
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS project_type TEXT DEFAULT 'personal';

COMMENT ON COLUMN projects.project_type IS 'Type of project: client (client/commercial work), personal (personal lab/experiments), opensource (open source public tool)';
