-- ============================================================
-- Mazees Portfolio v2 — Supabase Database Schema
-- Version: 1.1.0
-- Date: 2026-08-19
-- ============================================================

-- Enable UUID extension (biasanya sudah aktif di Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- 1. TABEL: tech_stacks
-- Menyimpan daftar teknologi yang bisa dipilih saat membuat project
-- ============================================================

CREATE TABLE IF NOT EXISTS tech_stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  icon_url TEXT,
  category TEXT NOT NULL CHECK (
    category IN ('frontend', 'backend', 'ai', 'desktop', 'infrastructure', 'other')
  ),
  color TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE tech_stacks IS 'Daftar teknologi/tools yang digunakan, dikelola via dashboard';
COMMENT ON COLUMN tech_stacks.icon IS 'Icon identifier (e.g. SiReact, SiNextdotjs, SiTailwindcss, SiTypescript, etc.)';
COMMENT ON COLUMN tech_stacks.category IS 'Kategori: frontend, backend, ai, desktop, infrastructure, other';
COMMENT ON COLUMN tech_stacks.color IS 'Hex color untuk badge, e.g. #61DAFB';
COMMENT ON COLUMN tech_stacks.order_index IS 'Urutan tampilan dalam kategori. Semakin kecil = semakin atas';


-- ============================================================
-- 2. TABEL: projects
-- Menyimpan project portfolio yang dikelola secara manual via dashboard
-- ============================================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  demo_url TEXT,
  repo_url TEXT,
  project_type TEXT DEFAULT 'personal',
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE projects IS 'Project portfolio custom, dikelola via dashboard. Bukan GitHub repos';
COMMENT ON COLUMN projects.slug IS 'URL-friendly identifier, kebab-case, unique';
COMMENT ON COLUMN projects.long_description IS 'Deskripsi panjang, mendukung markdown';
COMMENT ON COLUMN projects.image_url IS 'URL gambar cover dari Supabase Storage bucket project-images';
COMMENT ON COLUMN projects.is_featured IS 'Jika true, tampil di section Featured Projects';
COMMENT ON COLUMN projects.is_published IS 'Jika false, tidak tampil di public portfolio (draft)';


-- ============================================================
-- 3. TABEL: project_tech_stacks (Junction / Many-to-Many)
-- Menghubungkan project dengan tech stack yang digunakan
-- ============================================================

CREATE TABLE IF NOT EXISTS project_tech_stacks (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tech_stack_id UUID NOT NULL REFERENCES tech_stacks(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tech_stack_id)
);

COMMENT ON TABLE project_tech_stacks IS 'Junction table: many-to-many antara projects dan tech_stacks';


-- ============================================================
-- 4. TRIGGERS: Auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_projects_updated_at ON projects;
CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_tech_stacks_updated_at ON tech_stacks;
CREATE TRIGGER trigger_tech_stacks_updated_at
  BEFORE UPDATE ON tech_stacks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS pada semua tabel
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tech_stacks ENABLE ROW LEVEL SECURITY;

-- ----- projects -----
DROP POLICY IF EXISTS "Anyone can view published projects" ON projects;
CREATE POLICY "Anyone can view published projects"
  ON projects
  FOR SELECT
  USING (is_published = TRUE);

DROP POLICY IF EXISTS "Authenticated users have full access to projects" ON projects;
CREATE POLICY "Authenticated users have full access to projects"
  ON projects
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ----- tech_stacks -----
DROP POLICY IF EXISTS "Anyone can view tech stacks" ON tech_stacks;
CREATE POLICY "Anyone can view tech stacks"
  ON tech_stacks
  FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Authenticated users have full access to tech stacks" ON tech_stacks;
CREATE POLICY "Authenticated users have full access to tech stacks"
  ON tech_stacks
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ----- project_tech_stacks -----
DROP POLICY IF EXISTS "Anyone can view project tech stacks" ON project_tech_stacks;
CREATE POLICY "Anyone can view project tech stacks"
  ON project_tech_stacks
  FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Authenticated users have full access to project tech stacks" ON project_tech_stacks;
CREATE POLICY "Authenticated users have full access to project tech stacks"
  ON project_tech_stacks
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ============================================================
-- 6. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);
CREATE INDEX IF NOT EXISTS idx_tech_stacks_category ON tech_stacks(category);
CREATE INDEX IF NOT EXISTS idx_tech_stacks_order ON tech_stacks(category, order_index);


-- ============================================================
-- 7. STORAGE BUCKETS (jalankan manual di Supabase Dashboard
--    atau via Supabase Management API, SQL tidak bisa create bucket)
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('tech-icons', 'tech-icons', TRUE)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 8. STORAGE POLICIES
-- ============================================================

-- ----- project-images -----
DROP POLICY IF EXISTS "Public read project images" ON storage.objects;
CREATE POLICY "Public read project images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Authenticated upload project images" ON storage.objects;
CREATE POLICY "Authenticated upload project images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated update project images" ON storage.objects;
CREATE POLICY "Authenticated update project images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'project-images' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated delete project images" ON storage.objects;
CREATE POLICY "Authenticated delete project images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- ----- tech-icons -----
DROP POLICY IF EXISTS "Public read tech icons" ON storage.objects;
CREATE POLICY "Public read tech icons"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'tech-icons');

DROP POLICY IF EXISTS "Authenticated upload tech icons" ON storage.objects;
CREATE POLICY "Authenticated upload tech icons"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'tech-icons' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated update tech icons" ON storage.objects;
CREATE POLICY "Authenticated update tech icons"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'tech-icons' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'tech-icons' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated delete tech icons" ON storage.objects;
CREATE POLICY "Authenticated delete tech icons"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'tech-icons' AND auth.role() = 'authenticated');


-- ============================================================
-- 9. SEED DATA: Tech Stack default
-- ============================================================

INSERT INTO tech_stacks (name, icon, category, color, order_index) VALUES
  -- Frontend
  ('React', 'SiReact', 'frontend', '#61DAFB', 1),
  ('Next.js', 'SiNextdotjs', 'frontend', '#FFFFFF', 2),
  ('Tailwind CSS', 'SiTailwindcss', 'frontend', '#06B6D4', 3),
  ('HTML', 'SiHtml5', 'frontend', '#E34F26', 4),
  ('CSS', 'SiCss3', 'frontend', '#1572B6', 5),
  ('JavaScript', 'SiJavascript', 'frontend', '#F7DF1E', 6),
  ('TypeScript', 'SiTypescript', 'frontend', '#3178C6', 7),

  -- Backend
  ('Node.js', 'SiNodedotjs', 'backend', '#339933', 1),
  ('PHP', 'SiPhp', 'backend', '#777BB4', 2),
  ('SQL', 'SiPostgresql', 'backend', '#4479A1', 3),
  ('REST API', 'SiFastapi', 'backend', '#FF6C37', 4),

  -- AI
  ('LLM', 'SiOpenai', 'ai', '#F97316', 1),
  ('AI Agents', 'SiAnthropic', 'ai', '#F97316', 2),
  ('Agentic Systems', 'SiOpenai', 'ai', '#F97316', 3),
  ('Tool Calling', 'SiPython', 'ai', '#F97316', 4),
  ('AI Integration', 'SiPytorch', 'ai', '#F97316', 5),
  ('AI Middleware', 'SiFastapi', 'ai', '#F97316', 6),

  -- Desktop
  ('Electron', 'SiElectron', 'desktop', '#47848F', 1),

  -- Infrastructure
  ('Cloudflare', 'SiCloudflare', 'infrastructure', '#F38020', 1),
  ('Supabase', 'SiSupabase', 'infrastructure', '#3FCF8E', 2),
  ('GitHub', 'SiGithub', 'infrastructure', '#FFFFFF', 3)
ON CONFLICT (name) DO UPDATE SET
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  color = EXCLUDED.color,
  order_index = EXCLUDED.order_index;
