# Target Final Architecture Specification

## Overview

Alhemam Healthcare Platform - Enterprise SaaS Foundation

## Current Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Supabase (Auth + Database)

## Target Architecture

### 1. Runtime Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                     Public Surface                        │
│  / (landing), /login                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Auth Surface                         │
│  Session via cookies (sb-access-token, sb-refresh-token) │
│  Middleware protection                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    App Shell                            │
│  Dashboard layout with Sidebar, dynamic navigation          │
│  Role-aware, tenant-aware                                │
└─────────────────────────────────────────────────────────────┘
```

### 2. Platform Core

| Layer | Location | Purpose |
|-------|----------|---------|
| Auth | `src/platform/auth.ts` | Session management, role derivation |
| Supabase Client | `src/platform/supabase-server.ts` | Service client for DB |
| Navigation | `src/platform/nav-engine.ts` | Build nav tree from DB |
| DB Access | `src/platform/db.ts` | Database utilities |

### 3. Data Flow

```
User Login → /api/v1/auth/signin → Set cookies
   ↓
Middleware checks sb-access-token cookie
   ↓
Dashboard Layout → getSession() → fetch navigation API
   ↓
Sidebar renders dynamic sections from DB
```

### 4. Database Schema (Canonical)

| Table | Purpose |
|-------|---------|
| `nav_sections` | Navigation section registry (6 sections) |
| `nav_pages` | Page registry (63 pages) |
| `iam_users` | User profiles |
| `iam_roles` | Role definitions |
| `iam_user_roles` | User role assignments |

### 5. Navigation Truth

**Canonical Source**: `/api/v1/nav` API endpoint

- Queries `nav_sections` and `nav_pages` from Supabase
- Groups pages by section_key
- Returns sorted sections with pages
- Dashboard layout calls this API (pattern required for CF workers)

### 6. Role Resolution

**Current Pattern**: Email prefix derivation
- `admin@` → admin role
- `doctor@` → doctor role
- Falls back to iam_users table if exists

### 7. Key Files Structure

```
src/
├── app/
│   ├── (auth)/login/        # Login page
│   ├── api/v1/             # API routes
│   ��   ├── auth/           # Auth endpoints
│   │   ├── nav/           # Navigation API
│   │   └── healthz/       # Health check
│   ├── dashboard/          # Protected app shell
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Landing page
├── platform/
│   ├── auth.ts            # Auth + session
│   ├── nav-engine.ts      # Navigation builder
│   ├── supabase-server.ts # Supabase client
│   └── db.ts            # DB utilities
├── ui/
│   └── layouts/Sidebar.tsx
└── middleware.ts         # Route protection
```

### 8. Security Model

- **Authentication**: Supabase Auth with session cookies
- **Middleware**: Cookie-based route protection
- **Service Access**: Service role key for privileged operations
- **RLS**: Database Row Level Security (via Supabase)

### 9. Design System

- **Framework**: Tailwind CSS 4
- **Theme**: Dark mode default (neutral-900)
- **Icons**: Lucide React
- **Primary Color**: Emerald

### 10. i18n

- Current: English primary
- Arabic labels stored in DB (`label_ar` fields)
- RTL ready via CSS

## Extension Points

### Adding New Pages
1. Add to `nav_pages` table in Supabase
2. Set section_key, route_path, name, icon_key, sort_order
3. Page automatically appears in sidebar

### Adding New Roles
1. Add to `iam_roles` table
2. Update auth.ts role derivation
3. Modify navigation visible pages via section_key

### Adding New Features
1. Create API route under `/api/v1/[feature]/`
2. Create page under `/app/[feature]/`
3. Add to navigation via DB

## Anti-Drift Rules

1. **Navigation must come from DB** - Never hardcode menu items
2. **Auth must use cookies** - Never store tokens in localStorage
3. **Admin pages must be dynamic** - Never hardcode access rules
4. **Service client for admin ops** - Never use anon key for admin
5. **One navigation source** - API-based, matches DB state