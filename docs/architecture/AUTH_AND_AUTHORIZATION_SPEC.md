# Authentication and Authorization Specification

## Current Authentication

### Flow
```
1. User enters email/password
2. POST to /api/v1/auth/signin
3. Supabase validates credentials
4. API returns session with access_token + refresh_token
5. Set cookies: sb-access-token, sb-refresh-token
6. Redirect to /dashboard
```

### Cookie Configuration
```typescript
// Secure, HTTP-only, same-site
response.cookies.set('sb-access-token', accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none',
  maxAge: 60 * 60 * 24,
  path: '/'
});
```

### Session Validation
```typescript
// getSession() in platform/auth.ts
const cookieStore = await cookies();
const accessToken = cookieStore.get('sb-access-token')?.value;
const client = createClient(supabaseUrl, serviceKey);
await client.auth.setSession({ access_token: accessToken });
const { data: { session } } = await client.auth.getSession();
```

## Current Authorization (Simplified)

### Role Derivation
```typescript
// Email prefix → role mapping
const emailPrefix = email.split('@')[0];
if (emailPrefix === 'admin') role = 'admin';
else if (emailPrefix === 'doctor') role = 'doctor';
// ... etc
```

### Database IAM (Partial)
- iam_users table exists but not fully wired
- role_id field exists but not enforced in queries

## Current Access Control

### Middleware
```typescript
// middleware.ts
const sessionToken = request.cookies.get('sb-access-token')?.value;
if (!sessionToken) {
  return NextResponse.redirect(new URL('/login', request.url));
}
```

### Navigation
All authenticated users see all navigation (future: role-based filtering)

## Future RBAC Model

### 1. Database-Driven Roles
```sql
-- iam_roles table
admin: role_level = 100
doctor: role_level = 50  
nurse: role_level = 40
receptionist: role_level = 30
guardian: role_level = 20
patient: role_level = 10
```

### 2. Role Hierarchy
```typescript
const ROLE_LEVELS = {
  admin: 100,
  doctor: 50,
  nurse: 40,
  receptionist: 30,
  guardian: 20,
  patient: 10,
};

function canAccess(requiredRole: string, userRole: string): boolean {
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole];
}
```

### 3. Page-Level Permissions
```sql
-- nav_pages table
ALTER TABLE nav_pages ADD COLUMN min_role_level INTEGER DEFAULT 10;
```

### 4. Permission Helper
```typescript
function canAccessPage(userRole: string, pageMinRole: number): boolean {
  return ROLE_LEVELS[userRole] >= pageMinRole;
}
```

## Security Headers

Current:
```typescript
// In API responses
{
  httpOnly: true,  // JS cannot read
  secure: true,   // HTTPS only
  sameSite: 'none' // Cross-site cookies
}
```

Recommended additions:
- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`

## Logout Flow

```
1. POST /api/v1/auth/signout
2. Delete cookies: sb-access-token, sb-refresh-token
3. Redirect to /login
```

## Error Handling

| Error | Response |
|------|----------|
| Invalid credentials | 401 + error message |
| Session expired | Redirect to /login |
| Unauthorized | 403 + message |
| Server error | 500 + message |

## Theme and Locale Persistence

### Requirements
- **Arabic is the default locale** for new users unless saved preference exists
- **Dark theme is the default** theme
- Theme preference must be persisted
- Locale preference must be persisted
- Authenticated users must load saved preferences after login

### Precedence Order (Highest to Lowest)
1. Authenticated persisted user preference (from user_preferences table)
2. Safe guest persisted preference (localStorage fallback)
3. System or product default
4. Arabic default locale + Dark theme as final fallback

### Implementation
```sql
-- user_preferences table (must be implemented)
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES iam_users(id) UNIQUE,
  theme TEXT DEFAULT 'dark',
  locale TEXT DEFAULT 'ar',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Critical Rules
- ❌ Do NOT implement theme/language switching without persistence
- ❌ Do NOT keep user preference behavior session-local only
- ❌ Do NOT allow hydration mismatch or flashing from weak initialization
- ❌ Do NOT leave schema drift unresolved in user_preferences

### Current Gap
User preferences are NOT yet persisted. This is a known gap that needs fixing:
- Theme currently: session-only or default
- Locale currently: English fallback for some components
- Must add: user_preferences table and wire in auth flow