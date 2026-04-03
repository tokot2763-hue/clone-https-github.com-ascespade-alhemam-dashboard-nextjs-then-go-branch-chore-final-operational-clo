# Database Schema and RLS Specification

## Current Schema (Canonical Tables)

### 1. nav_sections
```sql
CREATE TABLE nav_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
  section_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  label_ar TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  icon_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Data**: 6 sections (admin, clinical, operations, insurance, guardian, patient)

### 2. nav_pages
```sql
CREATE TABLE nav_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL REFERENCES nav_sections(section_key),
  page_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  route_path TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_sidebar BOOLEAN DEFAULT true,
  icon_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Data**: 63 pages across all sections

### 3. iam_users (Schema exists, partial wiring)
```sql
CREATE TABLE iam_users (
  id UUID PRIMARY KEY,  -- Links to auth.users
  email TEXT NOT NULL,
  full_name TEXT,
  tenant_id UUID,
  role_id UUID REFERENCES iam_roles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. iam_roles (Schema exists)
```sql
CREATE TABLE iam_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role_level INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. iam_user_roles (Schema exists)
```sql
CREATE TABLE iam_user_roles (
  user_id UUID REFERENCES iam_users(id),
  role_id UUID REFERENCES iam_roles(id),
  tenant_id UUID,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);
```

## Current Access Pattern

### Role Resolution (Email-Based)
The current system derives roles from email prefix:
- `admin@alhemam.sa` → admin
- `doctor@alhemam.sa` → doctor
- Falls back to DB if iam_users has role_id

### Navigation Access
All authenticated users see all navigation (no filtering currently)

## RLS Policies

Current: Service key bypasses RLS for admin operations

Future needed:
- `nav_sections`: Read for authenticated
- `nav_pages`: Read for authenticated  
- `iam_users`: Admin only
- `iam_roles`: Admin only
- `iam_user_roles`: Admin only

## Recommended Schema Additions

### 1. Navigation Role Visibility
```sql
ALTER TABLE nav_pages ADD COLUMN allowed_roles TEXT[];
```

### 2. Platform Settings
```sql
CREATE TABLE platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ
);
```

### 3. Audit Log
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. User Sessions
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES iam_users(id),
  last_active TIMESTAMPTZ,
  ip_address INET
);
```

## Migration Safety

Using forward-safe migrations:
- Always add columns nullable
- Never remove columns with data
- Deprecate with views, not removal