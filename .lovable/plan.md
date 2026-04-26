## Goal

Guests should be able to:
- Browse the landing page and see only the **6 free exercises unlocked** (other 12 stay locked).
- Go through the **full onboarding** (all 6 questions) without signing up.
- Be **prompted to sign up** at the end to access their dashboard.
- Have a clear way to **close the sign-up screen** or **go back home**.

## Current Gaps

1. **Locking is wrong.** `src/routes/index.tsx` locks exercises based on `hasProfile` (a localStorage flag set the moment onboarding finishes). So a guest who finishes onboarding gets all 18 exercises unlocked on the landing without ever signing up. It should be locked behind **authentication**, not profile completion.
2. **Sticky CTA on landing** for users who finished onboarding but aren't signed in says "GO TO DASHBOARD" and links to `/dashboard` — which immediately bounces them to `/auth`. Should instead push them to sign up.
3. **`/auth` page has no close button.** The only escape is a tiny "Continue without an account" link that points to `/dashboard`, which redirects right back to `/auth`. There's no way to actually return home.

## Changes

### 1. `src/routes/index.tsx` — lock by auth, not profile
- Replace `hasProfile` gating with `!!user` from `useAuth()`.
- Locked state, hero copy, and sticky CTA all key off `user`:
  - Signed out → 6 free unlocked, 12 locked, CTA = "UNLOCK FREE GUIDE" → `/onboarding`.
  - Signed in → all 18 unlocked, CTA = "GO TO DASHBOARD" → `/dashboard`.
- Locked-card tap still scrolls to the sticky CTA (unchanged).

### 2. `src/routes/onboarding.tsx` — minor copy alignment
- Already correctly routes guests to `/auth?redirect=/dashboard` after the success screen. No logic change needed.
- Keep "Skip for now" pointing home (`/`) instead of `/dashboard` so guests aren't bounced through auth when they bail mid-flow.

### 3. `src/routes/auth.tsx` — add close + back-to-home affordances
- Add a top-right **close (X) button** inside the card that navigates to `/` (home).
- Replace the misleading "Continue without an account" link (currently → `/dashboard`) with **"← Back to home"** link to `/`.
- Logo at top continues to link home (currently links to `/dashboard` — change to `/`).

## Technical Notes

- `useAuth()` already exposes `user` and `loading`; landing already imports it.
- No DB / route-tree changes. Pure component edits to three files.
- Locked exercises remain visually locked with the lock icon and reduced opacity (existing `ExerciseCard` `locked` prop).

## Files Edited

- `src/routes/index.tsx`
- `src/routes/onboarding.tsx` (one-line "Skip for now" target)
- `src/routes/auth.tsx`
