-- Migration: Add page content tables for schema-driven pages
-- This enables dynamic page generation from database

-- Create page_content table: content blocks for each page
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'card', 'table', 'chart', 'form', 'stat', 'list', 'hero', 'callout')),
  title TEXT,
  title_ar TEXT,
  content JSONB,
  content_ar JSONB,
  config JSONB DEFAULT '{}',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_key, content_type, sort_order)
);

-- Create section_content table: sections that group content blocks
CREATE TABLE IF NOT EXISTS section_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL,
  page_key TEXT NOT NULL,
  title TEXT,
  title_ar TEXT,
  layout TEXT DEFAULT 'full' CHECK (layout IN ('full', 'grid', 'columns', 'flex', 'sidebar')),
  config JSONB DEFAULT '{}',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_key, section_key, sort_order)
);

-- Enable RLS
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_content ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_page_content_page_key ON page_content(page_key);
CREATE INDEX IF NOT EXISTS idx_page_content_active ON page_content(page_key, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_section_content_page_key ON section_content(page_key);
CREATE INDEX IF NOT EXISTS idx_section_content_active ON section_content(page_key, is_active) WHERE is_active = true;

-- RLS Policies for page_content
CREATE POLICY "Public read page content" ON page_content FOR SELECT USING (true);
CREATE POLICY "Service role page content" ON page_content FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- RLS Policies for section_content
CREATE POLICY "Public read section content" ON section_content FOR SELECT USING (true);
CREATE POLICY "Service role section content" ON section_content FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Helper function to get page content
CREATE OR REPLACE FUNCTION get_page_content(p_page_key TEXT)
RETURNS TABLE(
  content_type TEXT,
  title TEXT,
  title_ar TEXT,
  content JSONB,
  content_ar JSONB,
  config JSONB,
  sort_order INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pc.content_type,
    pc.title,
    pc.title_ar,
    pc.content,
    pc.content_ar,
    pc.config,
    pc.sort_order
  FROM page_content pc
  WHERE pc.page_key = p_page_key 
    AND pc.is_active = true
  ORDER BY pc.sort_order;
END;
$$;

-- Helper function to get section content
CREATE OR REPLACE FUNCTION get_section_content(p_page_key TEXT)
RETURNS TABLE(
  section_key TEXT,
  title TEXT,
  title_ar TEXT,
  layout TEXT,
  config JSONB,
  sort_order INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sc.section_key,
    sc.title,
    sc.title_ar,
    sc.layout,
    sc.config,
    sc.sort_order
  FROM section_content sc
  WHERE sc.page_key = p_page_key 
    AND sc.is_active = true
  ORDER BY sc.sort_order;
END;
$$;

-- Insert sample admin dashboard content
INSERT INTO page_content (page_key, content_type, title, title_ar, content, sort_order) VALUES
('dashboard', 'stat', 'إجمالي المستخدمين', 'Total Users', '{"value": "1,234", "trend": "+12%"}', 1),
('dashboard', 'stat', 'النشطون', 'Active Users', '{"value": "892", "trend": "+5%"}', 2),
('dashboard', 'stat', 'المستخدمون الجدد', 'New Users', '{"value": "156", "trend": "+8%"}', 3),
('dashboard', 'stat', 'المسجلون اليوم', 'Registered Today', '{"value": "23", "trend": "+2%"}', 4),
('dashboard', 'hero', 'لوحة التحكم', 'Dashboard', '{"subtitle": "نظرة عامة على منصة الرعاية الصحية"}', 5)
ON CONFLICT (page_key, content_type, sort_order) DO NOTHING;

-- Insert sample section content
INSERT INTO section_content (page_key, section_key, title, title_ar, layout, sort_order) VALUES
('dashboard', 'stats', 'الإحصائيات', 'Stats', 'grid', 1),
('dashboard', 'main', 'الرئيسية', 'Main', 'full', 2)
ON CONFLICT (page_key, section_key, sort_order) DO NOTHING;