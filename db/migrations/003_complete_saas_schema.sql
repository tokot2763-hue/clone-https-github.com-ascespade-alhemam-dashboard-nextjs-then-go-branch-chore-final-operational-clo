-- Complete SaaS Healthcare Platform Schema
-- Schema-driven platform: All navigation and pages generated from DB

-- ============================================
-- ORGANIZATIONS & TENANTS
-- ============================================

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#10b981',
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROLES & PERMISSIONS
-- ============================================

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ar TEXT,
  key TEXT NOT NULL,
  level INT DEFAULT 0,
  permissions JSONB DEFAULT '[]',
  is_system BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, key)
);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID,
  UNIQUE(user_id, role_id, organization_id)
);

-- ============================================
-- NAVIGATION SECTIONS
-- ============================================

CREATE TABLE IF NOT EXISTS nav_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  label TEXT NOT NULL,
  label_ar TEXT,
  icon_key TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, section_key)
);

-- ============================================
-- NAVIGATION PAGES
-- ============================================

CREATE TABLE IF NOT EXISTS nav_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  page_key TEXT NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT,
  route_path TEXT NOT NULL,
  icon_key TEXT,
  sort_order INT DEFAULT 0,
  roles JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, page_key)
);

-- ============================================
-- PAGE TEMPLATES
-- ============================================

CREATE TABLE IF NOT EXISTS page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  component_path TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAGE CONTENT BLOCKS
-- ============================================

CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  page_key TEXT NOT NULL,
  template_key TEXT REFERENCES page_templates(template_key),
  content_type TEXT NOT NULL DEFAULT 'text' 
    CHECK (content_type IN ('hero', 'stat', 'card', 'table', 'chart', 'form', 'list', 'callout', 'tabs', 'timeline', 'KPI')),
  title TEXT,
  title_ar TEXT,
  subtitle TEXT,
  subtitle_ar TEXT,
  content JSONB,
  content_ar JSONB,
  config JSONB DEFAULT '{}',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, page_key, sort_order)
);

-- ============================================
-- PAGE SECTIONS (Grouping content blocks)
-- ============================================

CREATE TABLE IF NOT EXISTS page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  page_key TEXT NOT NULL,
  section_key TEXT NOT NULL,
  title TEXT,
  title_ar TEXT,
  layout TEXT DEFAULT 'grid' 
    CHECK (layout IN ('grid', 'columns', 'flex', 'full', 'sidebar', 'tabs')),
  config JSONB DEFAULT '{}',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, page_key, section_key, sort_order)
);

-- ============================================
-- PATIENTS
-- ============================================

CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  patient_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  first_name_ar TEXT,
  last_name TEXT NOT NULL,
  last_name_ar TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  blood_type TEXT,
  allergies JSONB DEFAULT '[]',
  chronic_conditions JSONB DEFAULT '[]',
  emergency_contact JSONB,
  address JSONB,
  insurance_id TEXT,
  insurance_expiry DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MEDICAL RECORDS
-- ============================================

CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL 
    CHECK (record_type IN ('diagnosis', 'prescription', 'lab', 'imaging', 'procedure', 'note', 'vitals')),
  record_date TIMESTAMPTZ DEFAULT NOW(),
  doctor_id UUID,
  department_id UUID,
  diagnosis JSONB,
  diagnosis_ar JSONB,
  notes TEXT,
  notes_ar TEXT,
  attachments JSONB DEFAULT '[]',
  is_confidential BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- APPOINTMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID,
  department_id UUID,
  appointment_date TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 30,
  type TEXT CHECK (type IN ('consultation', 'followup', 'emergency', 'checkup')),
  status TEXT DEFAULT 'scheduled' 
    CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  reason TEXT,
  reason_ar TEXT,
  notes TEXT,
  notes_ar TEXT,
  is_online BOOLEAN DEFAULT false,
  meeting_link TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DEPARTMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  description_ar TEXT,
  head_id UUID,
  icon_key TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STAFF
-- ============================================

CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  employee_id TEXT,
  first_name TEXT NOT NULL,
  first_name_ar TEXT,
  last_name TEXT NOT NULL,
  last_name_ar TEXT,
  department_id UUID REFERENCES departments(id),
  role_id UUID REFERENCES roles(id),
  specialization TEXT,
  specialization_ar TEXT,
  license_number TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  joining_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVOICES & PAYMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id),
  items JSONB NOT NULL,
  items_ar JSONB,
  subtotal NUMERIC(12, 2) NOT NULL,
  tax NUMERIC(12, 2) DEFAULT 0,
  discount NUMERIC(12, 2) DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL,
  status TEXT DEFAULT 'pending' 
    CHECK (status IN ('draft', 'pending', 'paid', 'partial', 'overdue', 'cancelled', 'refunded')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REPORTS & ANALYTICS
-- ============================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  user_id UUID,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER PREFERENCES
-- ============================================

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  locale TEXT DEFAULT 'ar' CHECK (locale IN ('ar', 'en')),
  notifications JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
  dashboard_layout JSONB,
  sidebar_collapsed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Organizations: Public read, service full access
CREATE POLICY "Public read organizations" ON organizations FOR SELECT USING (true);
CREATE POLICY "Service organizations" ON organizations FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Roles: Public read, service full access
CREATE POLICY "Public read roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Service roles" ON roles FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- User roles: User read own, service full access
CREATE POLICY "User read own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service user_roles" ON user_roles FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Navigation: Public read, service full access
CREATE POLICY "Public read nav_sections" ON nav_sections FOR SELECT USING (true);
CREATE POLICY "Service nav_sections" ON nav_sections FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Public read nav_pages" ON nav_pages FOR SELECT USING (true);
CREATE POLICY "Service nav_pages" ON nav_pages FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Page templates: Public read, service full access
CREATE POLICY "Public read page_templates" ON page_templates FOR SELECT USING (true);
CREATE POLICY "Service page_templates" ON page_templates FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Page content: Public read, service full access
CREATE POLICY "Public read page_content" ON page_content FOR SELECT USING (true);
CREATE POLICY "Service page_content" ON page_content FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Page sections: Public read, service full access
CREATE POLICY "Public read page_sections" ON page_sections FOR SELECT USING (true);
CREATE POLICY "Service page_sections" ON page_sections FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Patients: Related users can read, service full access
CREATE POLICY "Service patients" ON patients FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Medical records: Service full access
CREATE POLICY "Service medical_records" ON medical_records FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Appointments: Service full access
CREATE POLICY "Service appointments" ON appointments FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Departments: Public read, service full access
CREATE POLICY "Public read departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Service departments" ON departments FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Staff: Service full access
CREATE POLICY "Service staff" ON staff FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Invoices: Service full access
CREATE POLICY "Service invoices" ON invoices FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Analytics: Public insert, service full access
CREATE POLICY "Public insert analytics_events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Service analytics_events" ON analytics_events FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- User preferences: User own, service full access
CREATE POLICY "User read own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User update own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get user's role permissions
CREATE OR REPLACE FUNCTION get_user_permissions(p_user_id UUID, p_org_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  perms JSONB := '[]'::JSONB;
BEGIN
  SELECT COALESCE(jsonb_agg(r.permissions), '[]'::JSONB)
  INTO perms
  FROM user_roles ur
  JOIN roles r ON r.id = ur.role_id
  WHERE ur.user_id = p_user_id 
    AND (p_org_id IS NULL OR ur.organization_id = p_org_id);
  RETURN perms;
END;
$$;

-- Get user's accessible pages
CREATE OR REPLACE FUNCTION get_user_pages(p_user_id UUID, p_org_id UUID, p_locale TEXT DEFAULT 'ar')
RETURNS TABLE(
  page_key TEXT,
  name TEXT,
  name_ar TEXT,
  route_path TEXT,
  icon_key TEXT,
  section_key TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    np.page_key,
    CASE WHEN p_locale = 'ar' AND np.name_ar IS NOT NULL THEN np.name_ar ELSE np.name END,
    CASE WHEN p_locale = 'ar' AND np.name_ar IS NOT NULL THEN np.name_ar ELSE np.name END,
    np.route_path,
    np.icon_key,
    np.section_key
  FROM nav_pages np
  WHERE np.is_active = true
    AND (p_org_id IS NULL OR np.organization_id = p_org_id)
  ORDER BY np.sort_order;
END;
$$;

-- Get page content with sections
CREATE OR REPLACE FUNCTION get_page_with_content(
  p_page_key TEXT, 
  p_org_id UUID,
  p_locale TEXT DEFAULT 'ar'
)
RETURNS TABLE(
  section_key TEXT,
  section_title TEXT,
  section_layout TEXT,
  content_type TEXT,
  title TEXT,
  subtitle TEXT,
  content JSONB,
  config JSONB,
  sort_order INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ps.section_key,
    CASE WHEN p_locale = 'ar' AND ps.title_ar IS NOT NULL THEN ps.title_ar ELSE ps.title END,
    ps.layout,
    pc.content_type,
    CASE WHEN p_locale = 'ar' AND pc.title_ar IS NOT NULL THEN pc.title_ar ELSE pc.title END,
    CASE WHEN p_locale = 'ar' AND pc.subtitle_ar IS NOT NULL THEN pc.subtitle_ar ELSE pc.subtitle END,
    CASE WHEN p_locale = 'ar' AND pc.content_ar IS NOT NULL THEN pc.content_ar ELSE pc.content END,
    pc.config,
    pc.sort_order
  FROM page_sections pc
  JOIN page_content ps ON ps.page_key = pc.page_key AND ps.section_key = pc.section_key
  WHERE pc.page_key = p_page_key
    AND pc.is_active = true
    AND ps.is_active = true
    AND (p_org_id IS NULL OR pc.organization_id = p_org_id)
  ORDER BY pc.sort_order, ps.sort_order;
END;
$$;

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default organization
INSERT INTO organizations (name, name_ar, slug, primary_color) 
VALUES ('Alhemam Healthcare', 'الهمة للرعاية الصحية', 'alhemam', '#10b981')
ON CONFLICT (slug) DO NOTHING;

-- Insert system roles
INSERT INTO roles (name, name_ar, key, level, permissions, is_system) VALUES
('مدير النظام', 'System Admin', 'admin', 100, '["all"]', true),
('طبيب', 'Doctor', 'doctor', 50, '["patients.read", "patients.write", "records.read", "records.write", "appointments.manage"]', false),
('ممرض', 'Nurse', 'nurse', 40, '["patients.read", "records.read", "appointments.read"]', false),
('موظف استقبال', 'Receptionist', 'receptionist', 30, '["patients.read", "patients.write", "appointments.manage"]', false),
('محاسب', 'Accountant', 'accountant', 30, '["invoices.manage", "patients.read"]', false),
('زائر', 'Guest', 'guest', 10, '["readonly"]', false)
ON CONFLICT (organization_id, key) DO NOTHING;

-- Insert page templates
INSERT INTO page_templates (template_key, name, name_ar, component_path) VALUES
('dashboard', 'Dashboard', 'لوحة التحكم', '@/components/templates/Dashboard'),
('list', 'List View', 'عرض قائمة', '@/components/templates/ListView'),
('form', 'Form', 'نموذج', '@/components/templates/FormView'),
('detail', 'Detail View', 'عرض التفاصيل', '@/components/templates/DetailView'),
('stats', 'Statistics', 'إحصائيات', '@/components/templates/StatsView'),
('calendar', 'Calendar', 'تقويم', '@/components/templates/CalendarView')
ON CONFLICT (template_key) DO NOTHING;

-- Insert navigation sections
INSERT INTO nav_sections (section_key, label, label_ar, icon_key, sort_order) VALUES
('clinical', 'الإدارة', 'Clinical', 'Shield', 1),
('operations', 'العمليات', 'Operations', 'Calendar', 2),
('reports', 'التقارير', 'Reports', 'BarChart', 3),
('settings', 'الإعدادات', 'Settings', 'Settings', 4)
ON CONFLICT (organization_id, section_key) DO NOTHING;

-- Insert navigation pages
INSERT INTO nav_pages (section_key, page_key, name, name_ar, route_path, icon_key, sort_order) VALUES
-- Dashboard
('clinical', 'dashboard', 'لوحة التحكم', 'Dashboard', '/dashboard', 'LayoutDashboard', 1),
-- Clinical
('clinical', 'patients', 'المرضى', 'Patients', '/dashboard/patients', 'Users', 1),
('clinical', 'appointments', 'المواعيد', 'Appointments', '/dashboard/appointments', 'Calendar', 2),
('clinical', 'records', 'السجلات الطبية', 'Medical Records', '/dashboard/records', 'FileText', 3),
-- Operations
('operations', 'invoices', 'الفواتير', 'Invoices', '/dashboard/invoices', 'CreditCard', 1),
('operations', 'staff', 'الموظفين', 'Staff', '/dashboard/staff', 'Briefcase', 2),
('operations', 'departments', 'الأقسام', 'Departments', '/dashboard/departments', 'Building', 3),
-- Reports
('reports', 'analytics', 'التحليلات', 'Analytics', '/dashboard/analytics', 'BarChart', 1),
('reports', 'reports', 'التقارير', 'Reports', '/dashboard/reports', 'FileText', 2),
-- Settings
('settings', 'settings', 'الإعدادات', 'Settings', '/dashboard/settings', 'Settings', 1),
('settings', 'roles', 'الأدوار', 'Roles', '/dashboard/roles', 'Key', 2)
ON CONFLICT (organization_id, page_key) DO NOTHING;

-- Insert departments
INSERT INTO departments (name, name_ar, description, description_ar, icon_key, color, sort_order) VALUES
('الطب الباطني', 'Internal Medicine', 'Internal medicine department', 'قسم الطب الباطني', 'Stethoscope', '#10b981', 1),
('جراحة', 'Surgery', 'Surgery department', 'قسم الجراحة', 'Scissors', '#3b82f6', 2),
('الأطفال', 'Pediatrics', 'Pediatrics department', 'قسم الأطفال', 'Baby', '#8b5cf6', 3),
('النساء والولادة', 'Obstetrics & Gynecology', 'OB/GYN department', 'قسم النساء والولادة', 'Heart', '#ec4899', 4),
('الأسنان', 'Dentistry', 'Dentistry department', 'قسم طب الأسنان', 'Smile', '#f59e0b', 5),
('الطوارئ', 'Emergency', 'Emergency department', 'قسم الطوارئ', 'Ambulance', '#ef4444', 6)
ON CONFLICT (organization_id, name) DO NOTHING;

-- Insert default preferences function
CREATE OR REPLACE FUNCTION upsert_user_preference(
  p_user_id UUID,
  p_theme TEXT DEFAULT 'dark',
  p_locale TEXT DEFAULT 'ar'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_preferences (user_id, theme, locale, updated_at)
  VALUES (p_user_id, p_theme, p_locale, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    theme = EXCLUDED.theme,
    locale = EXCLUDED.locale,
    updated_at = NOW();
END;
$$;