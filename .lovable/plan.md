
# Add Exercise #8: Reach-Back Shoulder Opener

Add a new "Reach-Back Shoulder Opener" exercise to the Mobility phase, matching the structure and styling of exercises 1–7. Use the uploaded comic illustration as its image asset.

## What's added

- **Asset**: Save uploaded image to `src/assets/exercises/reach-back-shoulder-opener.png`.
- **Data entry**: Append an 8th item to the `exercises` array in `src/data/exercises.ts`:
  - `id: "reach-back-opener"` (matches the id already referenced in `personalize.ts` under "Shoulder Health" goal — so FOCUS badges will start working automatically).
  - `number: 8`
  - `name: "Reach-Back Shoulder Opener"`
  - `muscles: "Shoulders · Chest · Upper Back"`
  - `dose: "3×10s Holds"`
  - `phase: "Mobility"`
  - `shortBenefit: "Opens tight shoulders and chest for a fuller swing arc"`
  - `steps`: 3 concise steps mirroring the uploaded illustration — (1) Hands behind head, elbows out wide. (2) Reach back, opening chest and shoulders. (3) Breathe, hold, feel — release and repeat.
  - `tip`: One line on why opening the chest/shoulders translates to better posture, mobility, and a stronger pickleball game.
  - `image`: imported `reachBackOpenerImage`.

## Why no other files change

- `ExerciseCard.tsx` renders any exercise generically from the array.
- `dashboard.tsx` and `SessionSummary.tsx` map over `exercises`, so #8 appears automatically in the list, progress bar denominator (now 8), Mobility phase group, and per-phase counts.
- `personalize.ts` already includes `"reach-back-opener"` in the "Shoulder Health" goal mapping — no edit needed.

## Files Touched

- `src/assets/exercises/reach-back-shoulder-opener.png` — new image (copied from upload).
- `src/data/exercises.ts` — add `reachBackOpenerImage` import and 8th array entry.

## Out of scope

- Video version, lightbox tweaks, or new badges.
- Reordering existing exercises.
- Adjusting the "MORE COMING SOON" placeholder grid (it auto-renumbers from the next free slot).
