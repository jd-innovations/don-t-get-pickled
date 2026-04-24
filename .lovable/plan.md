
# Add Exercise #7: Chair Stand

Add a new "Chair Stand" exercise to the Strength phase, matching the structure and styling of exercises 1–6. Use the uploaded comic illustration as its image asset.

## What's added

- **Asset**: Save uploaded image to `src/assets/exercises/chair-stand.png`.
- **Data entry**: Append a 7th item to the `exercises` array in `src/data/exercises.ts`:
  - `id: "chair-stand"` (matches the id already referenced in `personalize.ts` under "Leg Power", "Balance & Stability", and "Endurance" goals — so FOCUS badges will start working automatically).
  - `number: 7`
  - `name: "Chair Stand"`
  - `muscles: "Quads · Glutes · Core"`
  - `dose: "3×10 Reps"`
  - `phase: "Strength"`
  - `shortBenefit: "Builds the leg power for explosive starts and stops on court"`
  - `steps`: 4 concise steps mirroring the uploaded illustration ("Sit Down" → "Stand Tall, Power Up") — arms crossed over chest, drive through heels, no hands.
  - `tip`: One line on why chair stands translate to court power / injury prevention.
  - `image`: imported `chair-stand.png`

## Why no other files change

- `ExerciseCard.tsx` renders any exercise generically from the array.
- `dashboard.tsx` and `SessionSummary.tsx` map over `exercises`, so #7 appears automatically in the list, progress bar denominator (now 7), Strength phase group, and per-phase counts.
- `personalize.ts` already includes `"chair-stand"` in goal mappings — no edit needed.

## Files Touched

- `src/assets/exercises/chair-stand.png` — new image (copied from upload).
- `src/data/exercises.ts` — add `chairStandImage` import and 7th array entry.

## Out of scope

- Video version, lightbox tweaks, or new badges.
- Reordering existing exercises.
- Adjusting `activeDaysFromFrequency` or session-length copy that mentions "6 exercises" (none found in current code).
