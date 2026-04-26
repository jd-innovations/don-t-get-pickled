## Goal

1. Replace the "Biological Sex" question with a "Gender" question in onboarding.
2. Let users complete the entire onboarding flow without an account, but require sign-up before they can access the dashboard.

## Changes

### 1. Onboarding gender question (`src/routes/onboarding.tsx`)

- Rename the step 0 question title from `WHAT'S YOUR BIOLOGICAL SEX?` to `WHAT'S YOUR GENDER?`.
- Replace `sexOptions` with `genderOptions`: `Man`, `Woman`, `Non-binary`, `Prefer not to say`.
- Render them as a single vertical list (one column) using the existing `OptionCard`, so all 4 options fit cleanly. Drops the special 2-col + full-width layout currently used.
- Rename local state `sex` → `gender` for clarity (still maps to `profile.gender`, no schema change).

### 2. Gate dashboard behind authentication

Currently `/dashboard` is a public route. We need anonymous users to be able to:
- Click "UNLOCK FREE GUIDE" on the landing page → go through onboarding (no auth required).
- Reach the "YOU WON'T GET PICKLED" success screen and see their welcome gift.
- Be required to sign up / sign in before the dashboard renders.

Approach: move dashboard under the existing `_authenticated` layout.

- Move `src/routes/dashboard.tsx` → `src/routes/_authenticated/dashboard.tsx`. The existing `_authenticated.tsx` guard already redirects unauthenticated users to `/auth?redirect=...`.
- Update the onboarding success screen ("VIEW MY PLAN" button) so that:
  - If the user is already authenticated → navigate to `/dashboard` (unchanged behavior).
  - If the user is anonymous → navigate to `/auth?redirect=/dashboard` with a short helper line on the success screen ("Create a free account to save your plan and unlock your dashboard.").
- Keep the profile (saved to `localStorage` via `UserProfileContext`) so that after sign-up, when the user lands on `/dashboard`, their personalized plan is already there.
- Update the landing page "Skip for now" / header link so that unauthenticated users who try to reach the dashboard via direct URL still hit the auth gate (handled automatically by the `_authenticated` move).
- The `/onboarding` "Skip for now" link currently points to `/dashboard` — change it to `/auth?redirect=/dashboard` for anonymous users (keep `/dashboard` for already-signed-in users).

### 3. Auth redirect handling

`src/routes/auth.tsx` already supports `?redirect=` and defaults to `/profile`. No changes needed beyond passing `/dashboard` from onboarding.

## Files Edited

- `src/routes/onboarding.tsx` — gender question + redirect logic on success screen and skip link.
- `src/routes/dashboard.tsx` → moved to `src/routes/_authenticated/dashboard.tsx` (contents unchanged aside from the route path string in `createFileRoute`).

## Out of scope

- No database / profile schema changes (`profile.gender` field is reused).
- No change to existing authenticated routes or auth logic.
