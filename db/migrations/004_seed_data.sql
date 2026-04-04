-- Seed data for complete SaaS platform
-- Run this after 003_complete_saas_schema.sql

-- ============================================
-- ORGANIZATIONS
-- ============================================

INSERT INTO organizations (name, name_ar, slug, domain, primary_color) 
VALUES 
  ('Alhemam Healthcare', 'الهمة للرعاية الصحية', 'alhemam', 'alhemam.sa', '#10b981'),
  ('Saudi Medical Center', 'المركز الطبي السعودي', 'smc', 'smc.sa', '#3b82f6')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ROLES
-- ============================================

INSERT INTO roles (organization_id, name, name_ar, key, level, permissions, is_system) 
SELECT id, 'مدير النظام', 'System Admin', 'admin', 100, '["all"]', true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, key) DO NOTHING;

INSERT INTO roles (organization_id, name, name_ar, key, level, permissions, is_system) 
SELECT id, 'طبيب أول', 'Super Doctor', 'super_doctor', 60, '["patients.read","patients.write","records.read","records.write","appointments.manage"]', false
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, key) DO NOTHING;

INSERT INTO roles (organization_id, name, name_ar, key, level, permissions, is_system) 
SELECT id, 'طبيب', 'Doctor', 'doctor', 50, '["patients.read","records.read","appointments.read"]', false
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, key) DO NOTHING;

INSERT INTO roles (organization_id, name, name_ar, key, level, permissions, is_system) 
SELECT id, 'ممرض', 'Nurse', 'nurse', 40, '["patients.read","records.read"]', false
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, key) DO NOTHING;

INSERT INTO roles (organization_id, name, name_ar, key, level, permissions, is_system) 
SELECT id, 'موظف استقبال', 'Receptionist', 'receptionist', 30, '["patients.read","patients.write","appointments.manage"]', false
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, key) DO NOTHING;

INSERT INTO roles (organization_id, name, name_ar, key, level, permissions, is_system) 
SELECT id, 'محاسب', 'Accountant', 'accountant', 35, '["invoices.manage","patients.read"]', false
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, key) DO NOTHING;

INSERT INTO roles (organization_id, name, name_ar, key, level, permissions, is_system) 
SELECT id, 'ولي أمر', 'Guardian', 'guardian', 20, '["patients.read","own_patients"]', false
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, key) DO NOTHING;

INSERT INTO roles (organization_id, name, name_ar, key, level, permissions, is_system) 
SELECT id, 'مريض', 'Patient', 'patient', 10, '["own_records","own_appointments"]', false
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, key) DO NOTHING;

INSERT INTO roles (organization_id, name, name_ar, key, level, permissions, is_system) 
SELECT id, 'زائر', 'Guest', 'guest', 10, '[]', false
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, key) DO NOTHING;

-- ============================================
-- DEPARTMENTS
-- ============================================

INSERT INTO departments (organization_id, name, name_ar, description, description_ar, icon_key, color, is_active, sort_order)
SELECT 
  id, 'الطب الباطني', 'Internal Medicine', 'Internal medicine department', 'قسم الطب ��لباطني', 'Stethoscope', '#10b981', true, 1
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, name) DO NOTHING;

INSERT INTO departments (organization_id, name, name_ar, description, description_ar, icon_key, color, is_active, sort_order)
SELECT 
  id, 'جراحة', 'Surgery', 'Surgery department', 'قسم الجراحة', 'Scissors', '#3b82f6', true, 2
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, name) DO NOTHING;

INSERT INTO departments (organization_id, name, name_ar, description, description_ar, icon_key, color, is_active, sort_order)
SELECT 
  id, 'الأطفال', 'Pediatrics', 'Pediatrics department', 'قسم الأطفال', 'Baby', '#8b5cf6', true, 3
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, name) DO NOTHING;

INSERT INTO departments (organization_id, name, name_ar, description, description_ar, icon_key, color, is_active, sort_order)
SELECT 
  id, 'النساء والولادة', 'Obstetrics & Gynecology', 'OB/GYN department', 'قسم النساء والولادة', 'Heart', '#ec4899', true, 4
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, name) DO NOTHING;

INSERT INTO departments (organization_id, name, name_ar, description, description_ar, icon_key, color, is_active, sort_order)
SELECT 
  id, 'الأسنان', 'Dentistry', 'Dentistry department', 'قسم طب الأسنان', 'Smile', '#f59e0b', true, 5
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, name) DO NOTHING;

INSERT INTO departments (organization_id, name, name_ar, description, description_ar, icon_key, color, is_active, sort_order)
SELECT 
  id, 'الطوارئ', 'Emergency', 'Emergency department', 'قسم الطوارئ', 'Ambulance', '#ef4444', true, 6
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, name) DO NOTHING;

-- ============================================
-- NAVIGATION SECTIONS
-- ============================================

INSERT INTO nav_sections (organization_id, section_key, label, label_ar, icon_key, sort_order, is_active)
SELECT id, 'clinical', 'الإدارة', 'Clinical', 'Shield', 1, true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, section_key) DO NOTHING;

INSERT INTO nav_sections (organization_id, section_key, label, label_ar, icon_key, sort_order, is_active)
SELECT id, 'operations', 'العمليات', 'Operations', 'Calendar', 2, true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, section_key) DO NOTHING;

INSERT INTO nav_sections (organization_id, section_key, label, label_ar, icon_key, sort_order, is_active)
SELECT id, 'reports', 'التقارير', 'Reports', 'BarChart', 3, true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, section_key) DO NOTHING;

INSERT INTO nav_sections (organization_id, section_key, label, label_ar, icon_key, sort_order, is_active)
SELECT id, 'settings', 'الإعدادات', 'Settings', 'Settings', 4, true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, section_key) DO NOTHING;

-- ============================================
-- NAVIGATION PAGES
-- ============================================

INSERT INTO nav_pages (organization_id, section_key, page_key, name, name_ar, route_path, icon_key, sort_order, is_active)
SELECT 
  id, 'clinical', 'dashboard', 'لوحة التحكم', 'Dashboard', '/dashboard', 'LayoutDashboard', 1, true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, page_key) DO NOTHING;

INSERT INTO nav_pages (organization_id, section_key, page_key, name, name_ar, route_path, icon_key, sort_order, is_active)
SELECT 
  id, 'clinical', 'patients', 'المرضى', 'Patients', '/dashboard/patients', 'Users', 1, true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, page_key) DO NOTHING;

INSERT INTO nav_pages (organization_id, section_key, page_key, name, name_ar, route_path, icon_key, sort_order, is_active)
SELECT 
  id, 'clinical', 'appointments', 'المواعيد', 'Appointments', '/dashboard/appointments', 'Calendar', 2, true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, page_key) DO NOTHING;

INSERT INTO nav_pages (organization_id, section_key, page_key, name, name_ar, route_path, icon_key, sort_order, is_active)
SELECT 
  id, 'clinical', 'records', 'السجلات الطبية', 'Medical Records', '/dashboard/records', 'FileText', 3, true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, page_key) DO NOTHING;

INSERT INTO nav_pages (organization_id, section_key, page_key, name, name_ar, route_path, icon_key, sort_order, is_active)
SELECT 
  id, 'operations', 'invoices', 'الفواتير', 'Invoices', '/dashboard/invoices', 'CreditCard', 1, true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, page_key) DO NOTHING;

INSERT INTO nav_pages (organization_id, section_key, page_key, name, name_ar, route_path, icon_key, sort_order, is_active)
SELECT 
  id, 'operations', 'staff', 'الموظفين', 'Staff', '/dashboard/staff', 'Briefcase', 2, true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, page_key) DO NOTHING;

INSERT INTO nav_pages (organization_id, section_key, page_key, name, name_ar, route_path, icon_key, sort_order, is_active)
SELECT 
  id, 'operations', 'departments', 'الأقسام', 'Departments', '/dashboard/departments', 'Building', 3, true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, page_key) DO NOTHING;

INSERT INTO nav_pages (organization_id, section_key, page_key, name, name_ar, route_path, icon_key, sort_order, is_active)
SELECT 
  id, 'reports', 'analytics', 'التحليلات', 'Analytics', '/dashboard/analytics', 'BarChart', 1, true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, page_key) DO NOTHING;

INSERT INTO nav_pages (organization_id, section_key, page_key, name, name_ar, route_path, icon_key, sort_order, is_active)
SELECT 
  id, 'reports', 'reports', 'التقارير', 'Reports', '/dashboard/reports', 'FileText', 2, true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, page_key) DO NOTHING;

INSERT INTO nav_pages (organization_id, section_key, page_key, name, name_ar, route_path, icon_key, sort_order, is_active)
SELECT 
  id, 'settings', 'settings', 'الإعدادات', 'Settings', '/dashboard/settings', 'Settings', 1, true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, page_key) DO NOTHING;

INSERT INTO nav_pages (organization_id, section_key, page_key, name, name_ar, route_path, icon_key, sort_order, is_active)
SELECT 
  id, 'settings', 'roles', 'الأدوار', 'Roles', '/dashboard/roles', 'Key', 2, true
FROM organizations WHERE slug = 'alhemam'
ON CONFLICT (organization_id, page_key) DO NOTHING;

-- ============================================
-- PAGE TEMPLATES
-- ============================================

INSERT INTO page_templates (template_key, name, name_ar, component_path, is_active) VALUES
('dashboard', 'Dashboard', 'لوحة التحكم', '@/components/templates/Dashboard', true),
('list', 'List View', 'عرض قائمة', '@/components/templates/ListView', true),
('form', 'Form', 'نموذج', '@/components/templates/FormView', true),
('detail', 'Detail View', 'عرض التفاصيل', '@/components/templates/DetailView', true),
('stats', 'Statistics', 'إحصائيات', '@/components/templates/StatsView', true),
('calendar', 'Calendar', 'تقويم', '@/components/templates/CalendarView', true)
ON CONFLICT (template_key) DO NOTHING;

-- ============================================
-- PAGE SECTIONS
-- ============================================

INSERT INTO page_sections (organization_id, page_key, section_key, title, title_ar, layout, config, sort_order, is_active)
SELECT 
  org.id, 'dashboard', 'hero', 'مرحباً', 'Welcome', 'full', '{}', 1, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

INSERT INTO page_sections (organization_id, page_key, section_key, title, title_ar, layout, config, sort_order, is_active)
SELECT 
  org.id, 'dashboard', 'stats', 'الإحصائيات', 'Statistics', 'grid', '{}', 2, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

INSERT INTO page_sections (organization_id, page_key, section_key, title, title_ar, layout, config, sort_order, is_active)
SELECT 
  org.id, 'dashboard', 'quick', 'الوصول السريع', 'Quick Access', 'columns', '{}', 3, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

-- ============================================
-- PAGE CONTENT
-- ============================================

INSERT INTO page_content (organization_id, page_key, section_key, content_type, title, title_ar, subtitle, subtitle_ar, content, config, sort_order, is_active)
SELECT 
  org.id, 'dashboard', 'hero', 'hero', 'لوحة التحكم', 'Dashboard', 'نظرة عامة على منصة الرعاية الصحية', 'Overview of Alhemam Healthcare Platform', 
  '{"message": "Welcome"}', '{}', 1, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

INSERT INTO page_content (organization_id, page_key, section_key, content_type, title, title_ar, content, config, sort_order, is_active)
SELECT 
  org.id, 'dashboard', 'stats', 'stat', 'إجمالي المرضى', 'Total Patients', 
  '{"value": "1,234", "trend": "+12%", "trendDirection": "up"}', '{}', 1, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

INSERT INTO page_content (organization_id, page_key, section_key, content_type, title, title_ar, content, config, sort_order, is_active)
SELECT 
  org.id, 'dashboard', 'stats', 'stat', 'المواعيد اليوم', 'Today Appointments', 
  '{"value": "45", "trend": "+5%", "trendDirection": "up"}', '{}', 2, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

INSERT INTO page_content (organization_id, page_key, section_key, content_type, title, title_ar, content, config, sort_order, is_active)
SELECT 
  org.id, 'dashboard', 'stats', 'stat', 'المرضى النشطين', 'Active Patients', 
  '{"value": "892", "trend": "+8%", "trendDirection": "up"}', '{}', 3, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

INSERT INTO page_content (organization_id, page_key, section_key, content_type, title, title_ar, content, config, sort_order, is_active)
SELECT 
  org.id, 'dashboard', 'stats', 'stat', 'المسجلين اليوم', 'Registered Today', 
  '{"value": "23", "trend": "+2%", "trendDirection": "up"}', '{}', 4, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

INSERT INTO page_content (organization_id, page_key, section_key, content_type, title, title_ar, subtitle, subtitle_ar, content, config, sort_order, is_active)
SELECT 
  org.id, 'dashboard', 'quick', 'card', 'المرضى', 'Patients', 'إدارة المرضى', 'Manage Patients',
  '{"icon": "Users", "count": 1234}', '{"color": "emerald"}', 1, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

INSERT INTO page_content (organization_id, page_key, section_key, content_type, title, title_ar, subtitle, subtitle_ar, content, config, sort_order, is_active)
SELECT 
  org.id, 'dashboard', 'quick', 'card', 'المواعيد', 'Appointments', 'إدارة المواعيد', 'Manage Appointments',
  '{"icon": "Calendar", "count": 45}', '{"color": "blue"}', 2, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

INSERT INTO page_content (organization_id, page_key, section_key, content_type, title, title_ar, subtitle, subtitle_ar, content, config, sort_order, is_active)
SELECT 
  org.id, 'dashboard', 'quick', 'card', 'الفواتير', 'Invoices', 'إدارة الفواتير', 'Manage Invoices',
  '{"icon": "CreditCard", "count": 89}', '{"color": "purple"}', 3, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

-- Insert for patients page
INSERT INTO page_sections (organization_id, page_key, section_key, title, title_ar, layout, config, sort_order, is_active)
SELECT 
  org.id, 'patients', 'main', 'قائمة المرضى', 'Patient List', 'full', '{}', 1, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

INSERT INTO page_content (organization_id, page_key, section_key, content_type, title, title_ar, content, config, sort_order, is_active)
SELECT 
  org.id, 'patients', 'main', 'table', 'المرضى', 'Patients', 
  '{"columns": ["Patient ID", "Name", "Phone", "Insurance", "Status"], "data": []}', '{"searchable": true, "filterable": true}', 1, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

-- Insert for appointments page
INSERT INTO page_sections (organization_id, page_key, section_key, title, title_ar, layout, config, sort_order, is_active)
SELECT 
  org.id, 'appointments', 'main', 'جدول المواعيد', 'Appointment Schedule', 'full', '{}', 1, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

INSERT INTO page_content (organization_id, page_key, section_key, content_type, title, title_ar, content, config, sort_order, is_active)
SELECT 
  org.id, 'appointments', 'main', 'calendar', 'المواعيد', 'Appointments', 
  '{"view": "week"}', '{}', 1, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

-- Insert for staff page
INSERT INTO page_sections (organization_id, page_key, section_key, title, title_ar, layout, config, sort_order, is_active)
SELECT 
  org.id, 'staff', 'main', 'قائمة الموظفين', 'Staff List', 'full', '{}', 1, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

INSERT INTO page_content (organization_id, page_key, section_key, content_type, title, title_ar, content, config, sort_order, is_active)
SELECT 
  org.id, 'staff', 'main', 'table', 'الموظفين', 'Staff', 
  '{"columns": ["Employee ID", "Name", "Department", "Role", "Status"], "data": []}', '{"searchable": true}', 1, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

-- Insert for invoices page
INSERT INTO page_sections (organization_id, page_key, section_key, title, title_ar, layout, config, sort_order, is_active)
SELECT 
  org.id, 'invoices', 'main', 'الفواتير', 'Invoices', 'full', '{}', 1, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

INSERT INTO page_content (organization_id, page_key, section_key, content_type, title, title_ar, content, config, sort_order, is_active)
SELECT 
  org.id, 'invoices', 'main', 'table', 'الفواتير', 'Invoices', 
  '{"columns": ["Invoice #", "Patient", "Amount", "Status", "Due Date"], "data": []}', '{"searchable": true, "filterable": true}', 1, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

-- Insert for analytics page
INSERT INTO page_sections (organization_id, page_key, section_key, title, title_ar, layout, config, sort_order, is_active)
SELECT 
  org.id, 'analytics', 'main', 'التحليلات', 'Analytics', 'grid', '{}', 1, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

INSERT INTO page_content (organization_id, page_key, section_key, content_type, title, title_ar, content, config, sort_order, is_active)
SELECT 
  org.id, 'analytics', 'main', 'chart', '趋势 patients', 'Patient Trends', 
  '{"type": "line", "data": "monthly"}', '{}', 1, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

INSERT INTO page_content (organization_id, page_key, section_key, content_type, title, title_ar, content, config, sort_order, is_active)
SELECT 
  org.id, 'analytics', 'main', 'chart', 'توزيع المرضى', 'Patient Distribution', 
  '{"type": "pie", "data": "department"}', '{}', 2, true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, page_key, section_key, sort_order) DO NOTHING;

-- ============================================
-- SAMPLE PATIENTS
-- ============================================

INSERT INTO patients (organization_id, patient_id, first_name, first_name_ar, last_name, last_name_ar, email, phone, date_of_birth, gender, blood_type, is_active)
SELECT 
  org.id, 'PAT-001', 'Ahmed', 'أحمد', 'Al-Rashid', 'الرشيد', 'ahmed@example.com', '+966501234567', '1985-03-15', 'male', 'A+', true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, patient_id) DO NOTHING;

INSERT INTO patients (organization_id, patient_id, first_name, first_name_ar, last_name, last_name_ar, email, phone, date_of_birth, gender, blood_type, is_active)
SELECT 
  org.id, 'PAT-002', 'Fatima', 'فاطمة', 'Al-Sayed', 'السيد', 'fatima@example.com', '+966501234568', '1990-07-22', 'female', 'O+', true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, patient_id) DO NOTHING;

INSERT INTO patients (organization_id, patient_id, first_name, first_name_ar, last_name, last_name_ar, email, phone, date_of_birth, gender, blood_type, is_active)
SELECT 
  org.id, 'PAT-003', 'Mohammed', 'محمد', 'Al-Ghamdi', 'الغامدي', 'mohammed@example.com', '+966501234569', '1978-11-30', 'male', 'B-', true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, patient_id) DO NOTHING;

-- ============================================
-- SAMPLE STAFF
-- ============================================

INSERT INTO staff (organization_id, employee_id, first_name, first_name_ar, last_name, last_name_ar, email, phone, specialization, specialization_ar, is_active)
SELECT 
  org.id, 'EMP-001', 'Dr. Sarah', 'د. سارة', 'Al-Nasser', 'الناصر', 'sarah@alhemam.sa', '+966501111111', 'Internal Medicine', 'الطب الباطني', true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, employee_id) DO NOTHING;

INSERT INTO staff (organization_id, employee_id, first_name, first_name_ar, last_name, last_name_ar, email, phone, specialization, specialization_ar, is_active)
SELECT 
  org.id, 'EMP-002', 'Dr. Omar', 'د. عمر', 'Al-Qahtani', 'القحطاني', 'omar@alhemam.sa', '+966501111112', 'Surgery', 'الجراحة', true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, employee_id) DO NOTHING;

INSERT INTO staff (organization_id, employee_id, first_name, first_name_ar, last_name, last_name_ar, email, phone, specialization, specialization_ar, is_active)
SELECT 
  org.id, 'EMP-003', 'Nurse Layla', 'ممرضة ليلى', 'Al-Harbi', 'الحربي', 'layla@alhemam.sa', '+966501111113', 'Nursing', 'التمريض', true
FROM organizations org WHERE org.slug = 'alhemam'
ON CONFLICT (organization_id, employee_id) DO NOTHING;