## Generate a Custom Warm-Up Session (6 exercises)

A "Generate Warm-Up" flow that picks 6 exercises tailored to the user's profile, recent sessions, and today's chosen focus, plus a short AI-written coaching note explaining the pick.

### User flow

1. On the dashboard, a new card "Generate Today's Warm-Up" sits above the existing Session tracker.
2. Tapping it opens a sheet with:
   - Quick-pick chips: Shoulders, Hips, Legs, Full Body, Recovery, Power (single-select)
   - "Generate" button
3. After generating: shows the 6 exercises (image + name + dose), a 2–3 sentence AI coaching note, and two CTAs:
   - "Start Guided Session" — opens GuidedSession scoped to these 6
   - "Regenerate"
4. Auth is intentionally skipped for now — feature is available to anyone with an onboarding profile (`hasProfile`). A small note and stub will mark where the auth gate goes later.

### Selection logic (rules first, AI for explanation)

A pure function `generateWarmupPlan({ profile, focus, recentSessions })` returns 6 exercise IDs:

- Score every exercise by:
  - **Focus match** (Shoulders/Hips/Legs/Recovery/Power → curated id sets reusing the existing `GOAL_TO_EXERCISES` map; Full Body = neutral) → +5
  - **Injury priority** (uses `INJURY_TO_EXERCISES`) → +3
  - **User goals match** (`GOAL_TO_EXERCISES`) → +2
  - **Freshness**: subtract usage count over the last 5 sessions → -1 per recent appearance
  - Small random jitter so regenerate produces variety
- Compose the final 6 to keep balance: ideally 2 Warm-Up, 2 Mobility, 2 Strength (fill from the next-highest scores if a phase is short).
- Output is ordered by phase (Warm-Up → Mobility → Strength) so the guided flow feels natural.

### AI coaching note

- New TanStack server function `generateWarmupNote` in `src/utils/warmup.functions.ts`:
  - Input: focus tag, profile summary, picked exercise names + reasons (top scoring tags).
  - Calls Lovable AI Gateway (`google/gemini-3-flash-preview`) via `LOVABLE_API_KEY`.
  - Returns 2–3 sentences of coaching context. Non-streaming. Handles 402/429 with friendly fallbacks.
- If the AI call fails, the UI still shows the plan with a generic "Tailored to your focus today" line.

### GuidedSession integration

- Extend `GuidedSession` to accept an optional `exerciseIds?: string[]` prop. When provided, it runs through that subset (in the given order) instead of the full library. Defaults to current behavior when omitted.
- The new generated-session sheet passes the 6 IDs into GuidedSession.

### Files

- `src/lib/generateWarmup.ts` — pure scoring + selection function, focus tag → exercise sets, types.
- `src/utils/warmup.functions.ts` — `generateWarmupNote` server function (Lovable AI Gateway).
- `src/components/GenerateWarmupSheet.tsx` — modal/sheet with chips, generate button, results, regenerate, "Start Guided Session".
- `src/components/GuidedSession.tsx` — accept optional `exerciseIds` to scope the run.
- `src/routes/dashboard.tsx` — add the "Generate Today's Warm-Up" entry card and wire the sheet/guided session.

### Out of scope (for later)

- Authentication & cross-device persistence (recent sessions still come from `useSessionStats` in localStorage).
- Paywall/lock gating on generated picks (treats all 18 as available).
- Saving generated plans for later or sharing them.
