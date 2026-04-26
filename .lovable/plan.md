## Current Behavior
The "P" badge in the top-right of `/dashboard` (line 79-81 of `src/routes/dashboard.tsx`) is a static `<div>` — clicking it does **nothing**. It's not a link, has no `onClick`, and shows a hardcoded "P" instead of the actual user's initial.

## Changes

**`src/routes/dashboard.tsx`**
1. Import `Link` from `@tanstack/react-router` and `useAuth` from `@/contexts/AuthContext`.
2. Inside `Dashboard()`, read `const { user } = useAuth();`.
3. Compute the initial:
   ```ts
   const initial = (
     user?.user_metadata?.display_name ||
     user?.email ||
     "P"
   ).trim().charAt(0).toUpperCase();
   ```
4. Replace the static `<div>` badge with a `<Link to="/profile">` that:
   - Renders the same circular badge styling.
   - Adds hover state (`hover:bg-[#C8F135]/10 hover:border-[#C8F135] transition`).
   - Has `aria-label="Open profile"`.
   - Shows `{initial}` instead of hardcoded "P".

Note: `/profile` is under `_authenticated`, so unauthenticated users tapping the badge will be redirected to `/auth` automatically — no extra handling needed.
