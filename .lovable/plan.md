# Wire the Schedule Tab — Pre-Generated Warm-Up Presets

Today the "Schedule" button in the bottom nav does nothing. We'll turn it into a real screen that gives the user 3–4 ready-to-go warm-up presets, pre-built from their profile, so they tap one card and immediately start a guided session.

## What the user will see

A new **Schedule** view (route `/schedule`, protected like `/profile`) with:

1. **Today's Pick** (hero card) — one preset auto-chosen for today based on profile + day of week. Big "START NOW" button.
2. **Preset library** — 3 more cards the user can tap any day:
   - **Quick Reset** (4 exercises, ~3 min) — light mobility, good for busy days
   - **Full Tune-Up** (6 exercises, ~6 min) — balanced full-body, the default
   - **Power Prep** (6 exercises, ~7 min) — emphasizes Strength + Power before competitive play
   - **Recovery Flow** (5 exercises, ~5 min) — gentle, post-play or sore days
3. Each card shows: name, focus tag, exercise count, est. duration, a 3-icon preview of the first exercises, and a "START" button.
4. Cards are personalized — exercises are picked using the same scoring engine that powers "Generate Warm-Up" (respects injuries, goals, fitness level, recent session freshness), so two users see different exercises under the same preset name.

Tapping any preset opens the existing **GuidedSession** with that exercise list — no extra screens.

## How it fits the existing app

- Reuses `generateWarmupPlan()` from `src/lib/generateWarmup.ts` — we just call it with different `focus` + size params per preset.
- Reuses `GuidedSession` component (already accepts `exerciseIds`).
- Reuses `useUserProfile` and `useCloudSessions` for personalization + freshness rotation.
- "Today's Pick" rotates deterministically by date so it feels scheduled, not random.

## Technical details

**New route**: `src/routes/_authenticated/schedule.tsx` (protected — requires auth, matches profile pattern).

**New file**: `src/lib/presets.ts`
- Defines `PRESETS` array: `{ id, name, focus: FocusTag, size: number, durationMin, blurb, accent }`.
- `buildPresetPlan(preset, profile, recentSessions)` → calls `generateWarmupPlan` with `focus`, then trims `picks` to `preset.size`.
- `pickTodaysPreset(date, profile)` → deterministic selection (e.g. weekday → Power Prep, weekend → Full Tune-Up, day-after-active → Recovery).

**Update**: `src/lib/generateWarmup.ts` — extend `generateWarmupPlan` to accept an optional `size` parameter (defaults to 6) so presets can request 4 or 5 exercises. Phase distribution scales proportionally.

**Update**: `src/routes/dashboard.tsx` — wire the bottom-nav "Schedule" button to `navigate({ to: "/schedule" })`, same pattern as Profile.

**Update**: `src/routes/_authenticated/schedule.tsx` includes the same bottom nav (Home / Schedule / Profile) for consistency, with Schedule highlighted as active.

**Schedule page structure**:
```text
[Header: DON'T GET PICKLED]
[Hero: "Today's Pick" — big preset card, START NOW]
[Section: "All Presets" — 3 preset cards in a column]
[Bottom nav]
```

Each preset card uses the lime accent palette and the same `hover-lift press` motion language already used elsewhere.

**No new database tables, no new server functions** — presets are deterministic client-side, computed from profile + cached session history.

## Out of scope (can be a follow-up)

- User-saved custom presets
- Calendar view / scheduling specific days/times
- Push reminders