# Schema Repair Requirements

## Objective

Deeply audit and repair schema quality so the repo has a stable enterprise-grade data foundation.

## Current Schema Assessment

### Working Tables
| Table | Status | Notes |
|-------|--------|-------|
| nav_sections | ✅ Working | 6 sections |
| nav_pages | ✅ Working | 68 pages |
| iam_users | ✅ Partial | User profiles |
| iam_roles | ✅ Working | 8 role levels |

### Known Gaps
1. **User Preferences** - NOT persisted, needs user_preferences table
2. **Schema Repair Log** - NOT implemented
3. **Platform Settings** - NOT implemented
4. **Audit Logs** - NOT implemented

## Must Do

### 1. Inspect Before Extending
- Audit real current schema before adding new tables
- Identify drift, duplication, overlap, weak naming
- Check missing constraints and indexes

### 2. Fix Issues
- Repair broken foreign-key intent
- Normalize canonical vs legacy overlap
- Ensure tenant-aware operations work

### 3. Normalize Access Control
- Navigation-related schema paths must be clean
- Role resolution schema paths must work
- Admin operations schema must be clean

### 4. Document Decisions
- Write all schema decisions in architecture docs
- Record migration history
- Track repair actions

## Must NOT Do

- ❌ Stack new tables on broken old tables without decision record
- ❌ Leave silent overlapping truth sources  
- ❌ Create decorative schema not used by runtime
- ❌ Implement theme/locale switching without persistence

## User Preferences Requirement

### Must Be Implemented
```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES iam_users(id) UNIQUE,
  theme TEXT DEFAULT 'dark',
  locale TEXT DEFAULT 'ar',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Rules
1. Arabic ('ar') is DEFAULT locale for new users
2. Dark theme is DEFAULT theme
3. Must persist for authenticated users
4. Must load after login
5. Precedence: authenticated → guest → system default

## Schema Repair Log

Track schema changes:
```sql
CREATE TABLE schema_repair_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_type TEXT NOT NULL,
  description TEXT,
  executed_by UUID,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Current Repair Status

| Item | Status |
|------|--------|
| Navigation schema | ✅ Working |
| Role schema | ✅ Working |
| User schema | ✅ Partial |
| Preferences schema | ❌ NOT-implemented |
| Audit schema | ❌ NOT-implemented |
| Settings schema | ❌ NOT-implemented |

## Next Repair Actions

1. Add user_preferences table
2. Wire preference loading in getSession()
3. Add theme/locale picker to settings
4. Create forward-safe migrations