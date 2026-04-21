
# Personalize Dashboard from Onboarding Answers

Wire the 6 onboarding answers into a global context, then use them to tailor the dashboard: a profile summary card, a weekly schedule with active vs rest days, dose adjustments per fitness level, and PRIORITY/FOCUS badges driven by injuries and goals.

## 1. Global UserProfile context

New file `src/contexts/UserProfileContext.tsx`:
- Shape: `{ gender, ageRange, fitnessLevel, playFrequency, injuries: string[], goals: string[] }` (all nullable until onboarding completes).
- Exposes `profile`, `setProfile(partial)`, `clearProfile()`.
- Persists to `localStorage` under `dgp:profile` so a refresh keeps personalization.
- Provider wraps `<Outlet />` inside `RootComponent` in `src/routes/__root.tsx`.

## 2. Wire onboarding answers in

In `src/routes/onboarding.tsx`:
- Pull `setProfile` from context.
- On `next()` when `step === totalSteps - 1`, save `{ gender: sex, ageRange: age, fitnessLevel: fitness, playFrequency: frequency, injuries, goals }` before switching to the `done` stage. (The "VIEW MY PLAN" button already navigates — no nav change needed.)

## 3. Profile summary card on dashboard

In `src/routes/dashboard.tsx`, directly under the welcome paragraph and above the session tracker, render a compact card on `#111111` with `#1e1e1e` border:
- Four labeled rows in a 2×2 grid: AGE, FITNESS, PLAYS, TOP GOAL.
- Labels in lime `#C8F135` uppercase 10px; values in white.
- Top goal = `goals[0]`. If no profile yet, hide the card entirely (graceful for users who skipped onboarding).

## 4. Weekly schedule strip

Above the session tracker, a single horizontal row of 7 day pills (M T W T F S S). Active days get a lime `#C8F135` dot, rest days get a neutral `#2a2a2a` dot. Active-day count from `playFrequency`:
- Once a Week → 2
- 2–3 Times a Week → 3
- 4–5 Times a Week → 5
- Daily / Competing → 6

Active days are placed deterministically (e.g., evenly spaced starting Monday) so the layout is stable across renders. Hidden when no profile exists.

## 5. Dose adjustments by fitness level

Add a helper `personalizeDose(dose, fitnessLevel)` in a new `src/lib/personalize.ts`:
- **Beginner**: parse leading numbers in the dose string and multiply by 0.7 (rounded), append " · Take it easy".
- **Moderate**: unchanged.
- **Active**: append " · Push it" on key exercises (Knee Extensions, Heel Raises, Chair Stand-ins → for now: `knee-extensions`, `heel-raises`).
- **Athlete**: append " · Challenge variation" on every card.

`ExerciseCard` accepts a new optional prop `displayDose?: string`; when present it replaces `exercise.dose`. Dashboard computes it per card. Landing page is unaffected (prop omitted).

## 6. PRIORITY (injury) and FOCUS (goal) badges

New file `src/lib/personalize.ts` also exports two maps:

```text
INJURY_TO_EXERCISES: { Elbow/Wrist: [wrist-circles], Shoulder: [arm-circles, shoulder-rolls], ... }
GOAL_TO_EXERCISES:   { Mobility & Flexibility: [hip-circles, figure-four, torso-twist, hamstring-reach], ... }
```

Helpers `getPriorityFor(id, injuries)` and `getFocusFor(id, goals)` return booleans.

`ExerciseCard` accepts new optional props `priority?: boolean` and `focus?: boolean`. When set, render small pill badges in the right-side metadata column above the dose:
- PRIORITY: red `#ef4444` background, white text.
- FOCUS: lime `#C8F135` background, black text.

Dashboard passes them per card based on the user's injuries/goals. Mappings include exercises that don't yet exist in `exercises.ts` (Chair Stand, Balance Hold, etc.) — those entries are simply inert until their data is added, no errors.

## 7. Note on "Athlete" challenge variation

For now this is a text marker in the dose row only — we do not add new exercise variations. Real variations can be authored later as an `Exercise.variations` field.

## Files touched

- `src/contexts/UserProfileContext.tsx` — new
- `src/lib/personalize.ts` — new (dose helper + injury/goal maps + lookup helpers)
- `src/routes/__root.tsx` — wrap `<Outlet />` with `<UserProfileProvider>`
- `src/routes/onboarding.tsx` — save answers to context on finish
- `src/routes/dashboard.tsx` — read profile, render summary card + weekly strip, compute per-card props
- `src/components/ExerciseCard.tsx` — accept `displayDose`, `priority`, `focus` props; render badges; fall back to existing behavior when omitted

## Out of scope

- Real authoring of new exercise variations for Athlete level.
- Persisting which weekday is "today" (we just display the week).
- Editing the profile from the dashboard (would need a Profile screen).
- Server-side persistence of the profile.
