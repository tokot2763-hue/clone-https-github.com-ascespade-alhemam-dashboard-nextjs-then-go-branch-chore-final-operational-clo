# Project Structure Specification

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth group
│   │   └── login/        # Login page
│   ├── api/              # API routes
│   │   └── v1/
│   │       ├── auth/
│   │       │   ├── signin/
│   │       │   └── signout/
│   │       ├── nav/           # Navigation API (canonical)
│   │       └── healthz/      # Health check
│   ├── dashboard/        # Protected app shell
│   │   ├── layout.tsx    # App layout with sidebar
│   │   └── page.tsx      # Dashboard page
│   ├── globals.css       # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
│
├── platform/              # Platform core
│   ├── auth.ts          # Auth + session + role
│   ├── nav-engine.ts    # Navigation builder
│   ├── supabase-server.ts # Supabase client
│   ├── db.ts           # DB utilities
│   └── index.ts        # Exports
│
├── ui/                  # UI components
│   └── layouts/
│       └── Sidebar.tsx  # Navigation sidebar
│
├── middleware.ts         # Route protection
│
└── env.ts             # Environment (optional)
```

## Layer Responsibilities

### app/ (Pages)
- Presentational only
- No business logic
- Call platform functions

### platform/ (Core)
- Business logic
- Data access
- Authentication
- Navigation building

### ui/ (Components)
- Reusable UI
- No platform imports (use props)
- Presentational

## Key Patterns

### Data Flow
```
Page → Platform Function → API Route → Supabase Client → DB
```

### Auth Flow  
```
Login → API → Set Cookie → Middleware → Protected Page
```

### Navigation Flow
```
Dashboard → fetch('/api/v1/nav') → Sidebar
```

## Forbidden Patterns

❌ Don't put business logic in pages
❌ Don't call Supabase directly in UI components
❌ Don't hardcode navigation
❌ Don't scatter auth logic