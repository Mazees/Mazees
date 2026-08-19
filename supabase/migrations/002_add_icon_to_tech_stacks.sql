-- ============================================================
-- Migration: Add icon column to tech_stacks
-- Version: 1.1.0
-- ============================================================

-- Add icon column if not exists
ALTER TABLE tech_stacks
ADD COLUMN IF NOT EXISTS icon TEXT;

COMMENT ON COLUMN tech_stacks.icon IS 'Icon identifier (e.g. SiReact, SiNextdotjs, SiTailwindcss, SiTypescript, etc.)';

-- Update existing default rows with icon identifiers
UPDATE tech_stacks SET icon = 'SiReact' WHERE name = 'React';
UPDATE tech_stacks SET icon = 'SiNextdotjs' WHERE name = 'Next.js';
UPDATE tech_stacks SET icon = 'SiTailwindcss' WHERE name = 'Tailwind CSS';
UPDATE tech_stacks SET icon = 'SiHtml5' WHERE name = 'HTML';
UPDATE tech_stacks SET icon = 'SiCss3' WHERE name = 'CSS';
UPDATE tech_stacks SET icon = 'SiJavascript' WHERE name = 'JavaScript';
UPDATE tech_stacks SET icon = 'SiTypescript' WHERE name = 'TypeScript';

UPDATE tech_stacks SET icon = 'SiNodedotjs' WHERE name = 'Node.js';
UPDATE tech_stacks SET icon = 'SiPhp' WHERE name = 'PHP';
UPDATE tech_stacks SET icon = 'SiPostgresql' WHERE name = 'SQL';
UPDATE tech_stacks SET icon = 'SiFastapi' WHERE name = 'REST API';

UPDATE tech_stacks SET icon = 'SiOpenai' WHERE name = 'LLM';
UPDATE tech_stacks SET icon = 'SiAnthropic' WHERE name = 'AI Agents';
UPDATE tech_stacks SET icon = 'SiOpenai' WHERE name = 'Agentic Systems';
UPDATE tech_stacks SET icon = 'SiPython' WHERE name = 'Tool Calling';
UPDATE tech_stacks SET icon = 'SiPytorch' WHERE name = 'AI Integration';
UPDATE tech_stacks SET icon = 'SiFastapi' WHERE name = 'AI Middleware';

UPDATE tech_stacks SET icon = 'SiElectron' WHERE name = 'Electron';

UPDATE tech_stacks SET icon = 'SiCloudflare' WHERE name = 'Cloudflare';
UPDATE tech_stacks SET icon = 'SiSupabase' WHERE name = 'Supabase';
UPDATE tech_stacks SET icon = 'SiGithub' WHERE name = 'GitHub';
