## Goal
Wire the "Sign In" button in the landing page header (top right) to navigate to the existing `/auth` page, and reflect the auth state (show "Profile" / "Sign Out" when logged in).

## Current State
- `src/routes/index.tsx` header has a `<button>Sign In</button>` that does nothing.
- `/auth` route already exists with full sign-in/sign-up + Google OAuth.
- `AuthContext` (`useAuth`) is already wired in `__root.tsx`.

## Changes

**`src/routes/index.tsx`**
1. Import `Link` (already imported) and `useAuth` from `@/contexts/AuthContext`.
2. In the header, replace the static `<button>Sign In</button>` with conditional rendering:
   - If `user` is null → `<Link to="/auth">Sign In</Link>` styled as before.
   - If `user` exists → show a `<Link to="/profile">Profile</Link>` plus a small "Sign Out" button calling `signOut()`.
3. Keep the existing styling (`text-sm text-neutral-400 hover:text-white story-link`).

## Notes
- No DB or backend changes needed — auth route, context, and profile route already exist.
- After sign-in, user is redirected to `/profile` (existing behavior of `/auth`).
