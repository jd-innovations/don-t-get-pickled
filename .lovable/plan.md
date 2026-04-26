## What's happening now
On the Profile page (`/profile`), the "EDIT PROFILE" button in `PreferencesPanel` links to `/onboarding`. The onboarding route always starts at the `"register"` stage which shows a "Sign in" prompt at the bottom. For a signed-in user this looks like they were logged out. They are not — `/onboarding` is a public route — but the UI is misleading and the flow is wrong for editing.

## Ideal scenario
Editing preferences from `/profile` should:
1. **Skip the "register" stage entirely** — the user already has an account and a profile.
2. **Pre-fill** every question with their current saved answers so they only change what they want.
3. **Show "EDIT YOUR PROFILE"** copy (not "Create your profile") and a header "Save changes" / "Cancel" affordance back to `/profile`.
4. **Save and return to `/profile`** (not `/dashboard`) with a small toast like "Preferences updated."

## Changes

**1. `src/routes/onboarding.tsx`**
- Add `validateSearch` to accept an optional `?edit=1` flag and an optional `?from` redirect target (defaults to `/dashboard`, but `/profile` when editing).
- In `Onboarding()`:
  - Read `useAuth()` and existing `profile` from `useUserProfile()`.
  - If `search.edit === 1` OR (`user` exists AND `hasProfile`), initialize `stage = "questions"` and `step = 0`, and pre-populate `sex/age/fitness/frequency/injuries/goals` state from the existing `profile`.
  - Update the page `<title>` and intro copy to "Edit your profile" when in edit mode.
  - On completion, navigate to `search.from ?? "/dashboard"`.
  - Add a small "Cancel" link in the header that goes back to `/profile` when editing.

**2. `src/components/profile/PreferencesPanel.tsx`**
- Change the "EDIT PROFILE" `<Link>` to `to="/onboarding"` with `search={{ edit: 1, from: "/profile" }}`.

**3. (Optional polish) `src/routes/_authenticated/profile.tsx`**
- After a successful edit, the onboarding flow already returns the user here; no extra work needed beyond the existing `migrated` toast pattern. We can skip a dedicated "Preferences updated" toast for now to keep the change small.

## Why this fixes the reported bug
The user wasn't actually signed out — they were dropped into the registration step of onboarding, which displays a "Sign in" link that looked like an auth wall. By skipping that stage for signed-in users with an existing profile and pre-filling answers, the "Edit profile" button becomes a true edit flow instead of a re-onboarding flow.
