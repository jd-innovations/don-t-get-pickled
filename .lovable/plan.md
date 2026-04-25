## Audit + Free/Locked Tier for Exercises

### 1. Fix duplicate / mislabeled exercise

I believe 5 is correct, please double check before implementing the correction 

&nbsp;

Exercise **#5** is currently broken:

- `id: "knee-extensions"` + `name: "Seated Hamstring Reach"` (mismatched — id says one thing, content says another)
- Exercise **#14** is the real `Seated Knee Extensions`

So #5 is effectively a duplicate slot pointing at the wrong content. Fix by giving #5 the correct id for what it actually is (a Hamstring Reach).

**Fix in `src/data/exercises.ts`:**

- Change #5 `id: "knee-extensions"` → `id: "hamstring-reach"`
- Keep its name/content as-is (Seated Hamstring Reach)
- Update `src/lib/personalize.ts`:
  - `INJURY_TO_EXERCISES.Knee`: `["knee-extensions"]` → `["seated-knee-extensions"]`
  - `INJURY_TO_EXERCISES.Hamstring`: `["hamstring-reach"]` ✓ (now resolves correctly)
  - `GOAL_TO_EXERCISES["Leg Power"]`: replace `"knee-extensions"` with `"seated-knee-extensions"`
  - `ACTIVE_PUSH_IDS`: replace `"knee-extensions"` with `"seated-knee-extensions"`
  - `GOAL_TO_EXERCISES["Mobility & Flexibility"]` already references `"hamstring-reach"` ✓
  - `GOAL_TO_EXERCISES["Recovery Speed"]` already references `"hamstring-reach"` ✓

No other duplicates found across all 18 exercises (verified by id and name).

### 2. Re-number sequentially within categories

Per request: "same categories, numbers sequential." Renumber so #1–6 are the free preview and 7–18 are locked, while keeping the existing 3 phases (Warm-Up, Mobility, Strength).

**Free (1–6) — a balanced mini-session across all 3 phases:**

1. Arm Circles — Warm-Up
2. Shoulder Rolls — Warm-Up
3. Seated Torso Twist — Mobility
4. Seated Hip Circles — Mobility
5. Chair Stand — Strength
6. Heel Raises — Strength

**Locked (7–18) — the rest, grouped by phase, sequential:**
7. Wrist Circles & Flexion — Warm-Up
8. Seated March — Warm-Up
9. Ankle Circles — Warm-Up
10. Reach-Back Shoulder Opener — Mobility
11. Wrist Prayer Stretch — Mobility
12. Paddle-Swing Simulation — Mobility
13. Neck Side Stretch — Mobility
14. Figure-4 Stretch — Mobility
15. Seated Hamstring Reach — Strength
16. Seated Knee Extensions — Strength
17. Seated Balance Hold — Strength
18. Pelvic Tilts — Strength

Numbers stay continuous 1–18, all three phases preserved.

### 3. Free vs. locked gating

Add an `isFree: boolean` field to the `Exercise` interface. Mark numbers 1–6 as `isFree: true`, the rest as `isFree: false`.

The landing page (`src/routes/index.tsx`) currently shows all exercises. Update it to:

- Always render all 18 cards in their phase sections (so users see what they unlock).
- For locked cards (when not authenticated), wrap `<ExerciseCard>` in a non-interactive container with:
  - reduced opacity + slight blur on the image
  - a small lock icon overlay (lucide `Lock`)
  - clicking it scrolls to / highlights the unlock CTA instead of opening the guided session
- Free cards remain fully interactive.

### 4. "Authenticated" definition

Since there is no real auth yet, treat **"has completed onboarding"** (`hasProfile` from `UserProfileContext`) as the unlock signal for now. This matches the existing flow: the landing CTA already routes to `/onboarding`, and after onboarding `hasProfile` becomes true.

When `hasProfile === true`, all 18 exercises are unlocked. When `false`, only 1–6 are interactive.

This keeps scope tight and avoids adding Lovable Cloud auth in this turn. If you want real email/password auth as the gate instead, say the word and I'll plan that as a follow-up (Lovable Cloud + email/password + Google, profiles table, `/login`, `/signup`, `/reset-password`).

### Files to edit

- `src/data/exercises.ts` — fix #5 id, add `isFree`, renumber 1–18
- `src/lib/personalize.ts` — update id references after the fix
- `src/routes/index.tsx` — render locked state for non-onboarded users
- `src/components/ExerciseCard.tsx` — accept optional `locked` prop and render lock overlay (or wrap in index.tsx — TBD during implementation, whichever is cleaner)