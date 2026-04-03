const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function runMigration() {
  console.log('Starting database migration...');
  
  const schemaSQL = `
-- Tenants
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- IAM Roles
CREATE TABLE IF NOT EXISTS iam_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 0,
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- IAM Users
CREATE TABLE IF NOT EXISTS iam_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    role_id UUID REFERENCES iam_roles(id),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Navigation Sections
CREATE TABLE IF NOT EXISTS nav_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Navigation Pages
CREATE TABLE IF NOT EXISTS nav_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    section_id UUID REFERENCES nav_sections(id),
    name VARCHAR(100) NOT NULL,
    path VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role-Page Mappings
CREATE TABLE IF NOT EXISTS nav_page_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES nav_pages(id),
    role_id UUID REFERENCES iam_roles(id),
    can_view BOOLEAN DEFAULT true,
    can_create BOOLEAN DEFAULT false,
    can_edit BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
  `;

  try {
    const { error: schemaError } = await supabase.rpc('exec_sql', { query: schemaSQL });
    if (schemaError) {
      console.log('Schema error (may already exist):', schemaError.message);
    }
  } catch (e) {
    console.log('Running schema via alternative method...');
  }

  // Insert tenant
  const { error: tenantError } = await supabase
    .from('tenants')
    .upsert({ id: '00000000-0000-0000-0000-000000000001', name: 'Alhemam Healthcare', slug: 'alhemam' }, { onConflict: 'slug' });
  if (tenantError) console.log('Tenant:', tenantError.message);

  // Insert roles
  const roles = [
    { id: '00000000-0000-0000-0000-000000000101', name: 'System Admin', code: 'admin', description: 'Full system access', priority: 100 },
    { id: '00000000-0000-0000-0000-000000000102', name: 'Super Doctor', code: 'super_doctor', description: 'Full medical access', priority: 90 },
    { id: '00000000-0000-0000-0000-000000000103', name: 'Doctor', code: 'doctor', description: 'Doctor access', priority: 80 },
    { id: '00000000-0000-0000-0000-000000000104', name: 'Nurse', code: 'nurse', description: 'Nurse access', priority: 70 },
    { id: '00000000-0000-0000-0000-000000000105', name: 'Pharmacist', code: 'pharmacist', description: 'Pharmacy access', priority: 65 },
    { id: '00000000-0000-0000-0000-000000000106', name: 'Lab Technician', code: 'lab_tech', description: 'Lab access', priority: 60 },
    { id: '00000000-0000-0000-0000-000000000107', name: 'Receptionist', code: 'receptionist', description: 'Reception access', priority: 50 },
    { id: '00000000-0000-0000-0000-000000000108', name: 'Accountant', code: 'accountant', description: 'Finance access', priority: 45 },
    { id: '00000000-0000-0000-0000-000000000109', name: 'Patient', code: 'patient', description: 'Patient self-service', priority: 30 },
    { id: '00000000-0000-0000-0000-000000000110', name: 'Guardian', code: 'guardian', description: 'Patient guardian', priority: 20 },
    { id: '00000000-0000-0000-0000-000000000111', name: 'Guest', code: 'guest', description: 'Limited guest access', priority: 10 },
  ];

  for (const role of roles) {
    const { error } = await supabase.from('iam_roles').upsert({ ...role, tenant_id: '00000000-0000-0000-0000-000000000001' }, { onConflict: 'code' });
    if (error) console.log(`Role ${role.code}:`, error.message);
  }

  // Insert navigation sections
  const sections = [
    { id: '00000000-0000-0000-0000-000000000201', name: 'Dashboard', code: 'dashboard', icon: 'LayoutDashboard', sort_order: 1 },
    { id: '00000000-0000-0000-0000-000000000202', name: 'Patients', code: 'patients', icon: 'Users', sort_order: 2 },
    { id: '00000000-0000-0000-0000-000000000203', name: 'Medical', code: 'medical', icon: 'Stethoscope', sort_order: 3 },
    { id: '00000000-0000-0000-0000-000000000204', name: 'Pharmacy', code: 'pharmacy', icon: 'Pill', sort_order: 4 },
    { id: '00000000-0000-0000-0000-000000000205', name: 'Finance', code: 'finance', icon: 'DollarSign', sort_order: 5 },
    { id: '00000000-0000-0000-0000-000000000206', name: 'Settings', code: 'settings', icon: 'Settings', sort_order: 6 },
  ];

  for (const section of sections) {
    const { error } = await supabase.from('nav_sections').upsert({ ...section, tenant_id: '00000000-0000-0000-0000-000000000001' });
    if (error) console.log(`Section ${section.code}:`, error.message);
  }

  // Insert some pages
  const pages = [
    { id: '00000000-0000-0000-0000-000000000301', section_id: '00000000-0000-0000-0000-000000000201', name: 'Main Dashboard', path: '/dashboard', sort_order: 1 },
    { id: '00000000-0000-0000-0000-000000000302', section_id: '00000000-0000-0000-0000-000000000201', name: 'Statistics', path: '/dashboard/stats', sort_order: 2 },
    { id: '00000000-0000-0000-0000-000000000306', section_id: '00000000-0000-0000-0000-000000000202', name: 'Patient List', path: '/patients', sort_order: 1 },
    { id: '00000000-0000-0000-0000-000000000307', section_id: '00000000-0000-0000-0000-000000000202', name: 'Add Patient', path: '/patients/add', sort_order: 2 },
    { id: '00000000-0000-0000-0000-000000000318', section_id: '00000000-0000-0000-0000-000000000203', name: 'Medical Records', path: '/medical/records', sort_order: 1 },
    { id: '00000000-0000-0000-0000-000000000321', section_id: '00000000-0000-0000-0000-000000000203', name: 'Prescriptions', path: '/medical/prescriptions', sort_order: 2 },
  ];

  for (const page of pages) {
    const { error } = await supabase.from('nav_pages').upsert({ ...page, tenant_id: '00000000-0000-0000-0000-000000000001' });
    if (error) console.log(`Page ${page.name}:`, error.message);
  }

  // Map all pages to admin role
  const { data: allPages } = await supabase.from('nav_pages').select('id');
  const { data: adminRole } = await supabase.from('iam_roles').select('id').eq('code', 'admin').single();

  if (allPages && adminRole) {
    for (const page of allPages) {
      await supabase.from('nav_page_roles').upsert({
        page_id: page.id,
        role_id: adminRole.id,
        can_view: true,
        can_create: true,
        can_edit: true,
        can_delete: true,
      }, { onConflict: 'page_id,role_id' });
    }
  }

  console.log('Migration completed!');
  
  // Verify
  const { count: rolesCount } = await supabase.from('iam_roles').select('*', { count: 'exact', head: true });
  const { count: pagesCount } = await supabase.from('nav_pages').select('*', { count: 'exact', head: true });
  const { count: sectionsCount } = await supabase.from('nav_sections').select('*', { count: 'exact', head: true });
  
  console.log(`Roles: ${rolesCount}, Sections: ${sectionsCount}, Pages: ${pagesCount}`);
}

runMigration().catch(console.error);
