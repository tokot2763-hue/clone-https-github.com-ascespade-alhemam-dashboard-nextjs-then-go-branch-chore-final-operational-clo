-- Seed Data for Healthcare Platform
-- 11 Roles, 14 Permissions, 6 Sections, 63 Pages

-- Create default tenant
INSERT INTO tenants (id, name, slug, settings) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Alhemam Healthcare', 'alhemam', '{}')
ON CONFLICT (slug) DO NOTHING;

-- Seed Permissions (14 scopes)
INSERT INTO iam_permissions (code, name, description, category) VALUES
('view', 'View', 'View records', 'read'),
('create', 'Create', 'Create new records', 'write'),
('edit', 'Edit', 'Edit existing records', 'write'),
('delete', 'Delete', 'Delete records', 'write'),
('approve', 'Approve', 'Approve requests', 'workflow'),
('report', 'Report', 'Generate reports', 'analytics'),
('manage_users', 'Manage Users', 'Manage user accounts', 'admin'),
('manage_roles', 'Manage Roles', 'Manage roles and permissions', 'admin'),
('settings', 'Settings', 'System settings', 'admin'),
('audit', 'Audit', 'View audit logs', 'admin'),
('export', 'Export', 'Export data', 'data'),
('import', 'Import', 'Import data', 'data'),
('backup', 'Backup', 'Backup system', 'admin'),
('api_access', 'API Access', 'Access API endpoints', 'integration')
ON CONFLICT (code) DO NOTHING;

-- Seed Roles (11 roles)
INSERT INTO iam_roles (id, tenant_id, name, code, description, priority, permissions) VALUES
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'System Admin', 'admin', 'Full system access', 100, '["view","create","edit","delete","approve","report","manage_users","manage_roles","settings","audit","export","import","backup","api_access"]'),
('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Super Doctor', 'super_doctor', 'Full medical access', 90, '["view","create","edit","delete","approve","report","export","api_access"]'),
('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'Doctor', 'doctor', 'Doctor access', 80, '["view","create","edit","report","export","api_access"]'),
('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001', 'Nurse', 'nurse', 'Nurse access', 70, '["view","create","edit","report"]'),
('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000001', 'Pharmacist', 'pharmacist', 'Pharmacy access', 65, '["view","create","edit","report","export"]'),
('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000001', 'Lab Technician', 'lab_tech', 'Lab access', 60, '["view","create","edit","report","export"]'),
('00000000-0000-0000-0000-000000000107', '00000000-0000-0000-0000-000000000001', 'Receptionist', 'receptionist', 'Reception access', 50, '["view","create","report"]'),
('00000000-0000-0000-0000-000000000108', '00000000-0000-0000-0000-000000000001', 'Accountant', 'accountant', 'Finance access', 45, '["view","create","edit","report","export","import"]'),
('00000000-0000-0000-0000-000000000109', '00000000-0000-0000-0000-000000000001', 'Patient', 'patient', 'Patient self-service', 30, '["view","report"]'),
('00000000-0000-0000-0000-000000000110', '00000000-0000-0000-0000-000000000001', 'Guardian', 'guardian', 'Patient guardian', 20, '["view"]'),
('00000000-0000-0000-0000-000000000111', '00000000-0000-0000-0000-000000000001', 'Guest', 'guest', 'Limited guest access', 10, '["view"]')
ON CONFLICT (code) DO NOTHING;

-- Seed Navigation Sections (6 sections)
INSERT INTO nav_sections (id, tenant_id, name, code, icon, sort_order, is_active) VALUES
('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'Dashboard', 'dashboard', 'LayoutDashboard', 1, true),
('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', 'Patients', 'patients', 'Users', 2, true),
('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', 'Medical', 'medical', 'Stethoscope', 3, true),
('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000001', 'Pharmacy', 'pharmacy', 'Pill', 4, true),
('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000001', 'Finance', 'finance', 'DollarSign', 5, true),
('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000001', 'Settings', 'settings', 'Settings', 6, true)
ON CONFLICT (code) DO NOTHING;

-- Seed Navigation Pages (63 pages)
INSERT INTO nav_pages (id, tenant_id, section_id, name, path, icon, sort_order, is_active) VALUES
-- Dashboard Section (5 pages)
('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000201', 'Main Dashboard', '/dashboard', 'LayoutDashboard', 1, true),
('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000201', 'Statistics', '/dashboard/stats', 'BarChart', 2, true),
('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000201', 'Reports', '/dashboard/reports', 'FileText', 3, true),
('00000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000201', 'Notifications', '/dashboard/notifications', 'Bell', 4, true),
('00000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000201', 'Calendar', '/dashboard/calendar', 'Calendar', 5, true),

-- Patients Section (12 pages)
('00000000-0000-0000-0000-000000000306', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000202', 'Patient List', '/patients', 'Users', 1, true),
('00000000-0000-0000-0000-000000000307', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000202', 'Add Patient', '/patients/add', 'UserPlus', 2, true),
('00000000-0000-0000-0000-000000000308', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000202', 'Patient Profile', '/patients/[id]', 'User', 3, true),
('00000000-0000-0000-0000-000000000309', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000202', 'Medical History', '/patients/[id]/history', 'FileText', 4, true),
('00000000-0000-0000-0000-000000000310', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000202', 'Appointments', '/patients/appointments', 'Clock', 5, true),
('00000000-0000-0000-0000-000000000311', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000202', 'Book Appointment', '/patients/appointments/book', 'CalendarPlus', 6, true),
('00000000-0000-0000-0000-000000000312', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000202', 'Patient Documents', '/patients/[id]/documents', 'Folder', 7, true),
('00000000-0000-0000-0000-000000000313', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000202', 'Insurance', '/patients/insurance', 'Shield', 8, true),
('00000000-0000-0000-0000-000000000314', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000202', 'Emergency Contacts', '/patients/emergency', 'Phone', 9, true),
('00000000-0000-0000-0000-000000000315', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000202', 'Discharged Patients', '/patients/discharged', 'UserMinus', 10, true),
('00000000-0000-0000-0000-000000000316', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000202', 'Patient Search', '/patients/search', 'Search', 11, true),
('00000000-0000-0000-0000-000000000317', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000202', 'Export Patients', '/patients/export', 'Download', 12, true),

-- Medical Section (15 pages)
('00000000-0000-0000-0000-000000000318', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Medical Records', '/medical/records', 'FileText', 1, true),
('00000000-0000-0000-0000-000000000319', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Consultations', '/medical/consultations', 'Stethoscope', 2, true),
('00000000-0000-0000-0000-000000000320', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Diagnoses', '/medical/diagnoses', 'Activity', 3, true),
('00000000-0000-0000-0000-000000000321', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Prescriptions', '/medical/prescriptions', 'Pill', 4, true),
('00000000-0000-0000-0000-000000000322', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Lab Results', '/medical/lab-results', 'TestTube', 5, true),
('00000000-0000-0000-0000-000000000323', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Radiology', '/medical/radiology', 'Scan', 6, true),
('00000000-0000-0000-0000-000000000324', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Surgery', '/medical/surgery', 'Scissors', 7, true),
('00000000-0000-0000-0000-000000000325', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Vitals', '/medical/vitals', 'Heart', 8, true),
('00000000-0000-0000-0000-000000000326', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Allergies', '/medical/allergies', 'AlertTriangle', 9, true),
('00000000-0000-0000-0000-000000000327', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Immunizations', '/medical/immunizations', 'Syringe', 10, true),
('00000000-0000-0000-0000-000000000328', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Inpatient', '/medical/inpatient', 'Bed', 11, true),
('00000000-0000-0000-0000-000000000329', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Outpatient', '/medical/outpatient', 'Walk', 12, true),
('00000000-0000-0000-0000-000000000330', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Emergency', '/medical/emergency', 'Ambulance', 13, true),
('00000000-0000-0000-0000-000000000331', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Ambulance', '/medical/ambulance', 'Truck', 14, true),
('00000000-0000-0000-0000-000000000332', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203', 'Medical Reports', '/medical/reports', 'FileBarChart', 15, true),

-- Pharmacy Section (10 pages)
('00000000-0000-0000-0000-000000000333', '00000000-00000000-000-0000-000000001', '00000000-0000-0000-0000-000000000204', 'Medications', '/pharmacy/medications', 'Pill', 1, true),
('00000000-0000-0000-0000-000000000334', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000204', 'Inventory', '/pharmacy/inventory', 'Package', 2, true),
('00000000-0000-0000-0000-000000000335', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000204', 'Dispense', '/pharmacy/dispense', 'Clipboard', 3, true),
('00000000-0000-0000-0000-000000000336', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000204', 'Prescription List', '/pharmacy/prescriptions', 'FileText', 4, true),
('00000000-0000-0000-0000-000000000337', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000204', 'Suppliers', '/pharmacy/suppliers', 'Truck', 5, true),
('00000000-0000-0000-0000-000000000338', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000204', 'Purchase Orders', '/pharmacy/orders', 'ShoppingCart', 6, true),
('00000000-0000-0000-0000-000000000339', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000204', 'Expiry Alerts', '/pharmacy/expiry', 'AlertCircle', 7, true),
('00000000-0000-0000-0000-000000000340', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000204', 'Stock Report', '/pharmacy/stock-report', 'BarChart', 8, true),
('00000000-0000-0000-0000-000000000341', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000204', 'Returns', '/pharmacy/returns', 'RotateCcw', 9, true),
('00000000-0000-0000-0000-000000000342', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000204', 'Pharmacy Settings', '/pharmacy/settings', 'Settings', 10, true),

-- Finance Section (11 pages)
('00000000-0000-0000-0000-000000000343', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000205', 'Invoices', '/finance/invoices', 'FileText', 1, true),
('00000000-0000-0000-0000-000000000344', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000205', 'Payments', '/finance/payments', 'CreditCard', 2, true),
('00000000-0000-0000-0000-000000000345', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000205', 'Billing', '/finance/billing', 'DollarSign', 3, true),
('00000000-0000-0000-0000-000000000346', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000205', 'Insurance Claims', '/finance/insurance', 'Shield', 4, true),
('00000000-0000-0000-0000-000000000347', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000205', 'Expenses', '/finance/expenses', 'MinusCircle', 5, true),
('00000000-0000-0000-0000-000000000348', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000205', 'Revenue', '/finance/revenue', 'TrendingUp', 6, true),
('00000000-0000-0000-0000-000000000349', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000205', 'Financial Reports', '/finance/reports', 'BarChart', 7, true),
('00000000-0000-0000-0000-000000000350', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000205', 'Budget', '/finance/budget', 'PieChart', 8, true),
('00000000-0000-0000-0000-000000000351', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000205', 'Tax', '/finance/tax', 'Receipt', 9, true),
('00000000-0000-0000-0000-000000000352', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000205', 'Payroll', '/finance/payroll', 'Users', 10, true),
('00000000-0000-0000-0000-000000000353', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000205', 'Finance Settings', '/finance/settings', 'Settings', 11, true),

-- Settings Section (10 pages)
('00000000-0000-0000-0000-000000000354', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000206', 'General Settings', '/settings/general', 'Settings', 1, true),
('00000000-0000-0000-0000-000000000355', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000206', 'User Management', '/settings/users', 'Users', 2, true),
('00000000-0000-0000-0000-000000000356', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000206', 'Roles & Permissions', '/settings/roles', 'Shield', 3, true),
('00000000-0000-0000-0000-000000000357', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000206', 'Audit Logs', '/settings/audit', 'History', 4, true),
('00000000-0000-0000-0000-000000000358', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000206', 'Notifications', '/settings/notifications', 'Bell', 5, true),
('00000000-0000-0000-0000-000000000359', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000206', 'Email Settings', '/settings/email', 'Mail', 6, true),
('00000000-0000-0000-0000-000000000360', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000206', 'SMS Settings', '/settings/sms', 'MessageSquare', 7, true),
('00000000-0000-0000-0000-000000000361', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000206', 'Backup', '/settings/backup', 'Database', 8, true),
('00000000-0000-0000-0000-000000000362', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000206', 'API Keys', '/settings/api', 'Key', 9, true),
('00000000-0000-0000-0000-000000000363', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000206', 'System Info', '/settings/system', 'Info', 10, true)
ON CONFLICT DO NOTHING;

-- Seed Role-Page Mappings (Admin gets all pages)
INSERT INTO nav_page_roles (page_id, role_id, can_view, can_create, can_edit, can_delete)
SELECT 
    p.id,
    r.id,
    true, true, true, true
FROM nav_pages p
CROSS JOIN iam_roles r
WHERE r.code = 'admin'
ON CONFLICT DO NOTHING;

-- Doctor gets most pages
INSERT INTO nav_page_roles (page_id, role_id, can_view, can_create, can_edit, can_delete)
SELECT p.id, r.id, true, true, true, false
FROM nav_pages p
CROSS JOIN iam_roles r
WHERE r.code = 'doctor'
ON CONFLICT DO NOTHING;

-- Super Doctor gets all with delete
INSERT INTO nav_page_roles (page_id, role_id, can_view, can_create, can_edit, can_delete)
SELECT p.id, r.id, true, true, true, true
FROM nav_pages p
CROSS JOIN iam_roles r
WHERE r.code = 'super_doctor'
ON CONFLICT DO NOTHING;

-- Nurse gets view and limited create/edit
INSERT INTO nav_page_roles (page_id, role_id, can_view, can_create, can_edit, can_delete)
SELECT p.id, r.id, true, true, false, false
FROM nav_pages p
CROSS JOIN iam_roles r
WHERE r.code = 'nurse'
ON CONFLICT DO NOTHING;

-- Patient gets limited pages (view only)
INSERT INTO nav_page_roles (page_id, role_id, can_view, can_create, can_edit, can_delete)
SELECT p.id, r.id, true, false, false, false
FROM nav_pages p
CROSS JOIN iam_roles r
WHERE r.code = 'patient' AND p.code IN ('main-dashboard', 'patient-list', 'patient-profile', 'medical-records', 'appointments', 'prescriptions', 'diagnoses')
ON CONFLICT DO NOTHING;
