# Navigation Runtime Truth Specification

## Canonical Navigation Source

**Single Source of Truth**: `/api/v1/nav` API endpoint

```typescript
// src/app/api/v1/nav/route.ts
export async function GET() {
  const supabase = createServiceClient();
  const { data: sections } = await supabase.from('nav_sections').select('*');
  const { data: pages } = await supabase.from('nav_pages').select('*');
  // Return grouped navigation
}
```

## Why This Pattern

### Problem: Supabase SDK in Cloudflare Workers

The nav-engine.ts couldn't run directly from server components:
- `.select('*').eq('is_active', true).order('sort_order')` pattern failed
- `.select('*', { count: 'exact', head: true })` pattern worked for counts but returned empty data

**Root Cause**: Cloudflare Workers environment + Supabase SDK behavior inconsistency

### Solution: API-based Navigation

Dashboard layout calls the nav API instead of calling nav-engine directly:

```typescript
// src/app/dashboard/layout.tsx
async function getNavTree() {
  const response = await fetch('/api/v1/nav', { cache: 'no-store' });
  return response.json();
}
```

This works because API routes use the full Supabase client correctly.

## Alternative Patterns Considered

### 1. Client-side Fetch (Rejected)
- Would expose navigation before auth check
- Adds latency

### 2. Server Component Direct (Rejected for CF)
- Works locally but fails in Cloudflare Workers

### 3. Middleware (Deferred)
- Could add but current API pattern works

## Current Implementation

### 1. API Endpoint (`/api/v1/nav`)
- Uses service client
- Returns all sections + pages grouped
- No filters (returns all data)

### 2. Dashboard Layout
- Fetches nav API on render
- Passes to Sidebar component

### 3. Sidebar Component
- Renders sections as expandable menu
- Uses Lucide icons mapped by icon_key
- Links to route_path

## Rules

1. **Navigation must come from DB** - No hardcoded menus
2. **Use API pattern** - For CF Workers compatibility
3. **Filter in display** - Not in query (let API return all)
4. **Empty section handling** - Hide sections with 0 pages

## Future Improvements

### Phase 2 (Role-Based Navigation)
```typescript
// Filter pages by user role
const { data: pages } = await supabase
  .from('nav_pages')
  .select('*')
  .in('allowed_roles', [userRole]);
```

### Phase 3 (Caching)
```typescript
// Add cache headers to nav API
export const dynamic = 'force-cache';
export const revalidate = 60; // 1 minute
```

## Visibility Control

Current: All authenticated users see all navigation

Future: Filter by role in nav_pages.allowed_roles column

## Icon System

Icons from Lucide React, mapped in Sidebar:
```typescript
const ICONS = {
  LayoutDashboard,
  Users,
  Stethoscope,
  ...
};
```

Icon key stored in DB: `nav_pages.icon_key`