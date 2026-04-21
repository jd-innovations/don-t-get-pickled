
# Add Illustration to Wrist Circles & Flexion

Drop the new uploaded image into the second exercise card, following the same pattern as Arm Circles.

## Steps

1. **Save the asset** — copy `user-uploads://IMG_4956.png` to `src/assets/exercises/wrist-circles.png`.
2. **Wire it into the data** (`src/data/exercises.ts`)
   - Import the new asset.
   - Attach it to the `wrist-circles` entry via the existing `image` field.

No changes needed to `ExerciseCard.tsx` — the conditional image rendering is already in place from the Arm Circles work.

## Files Touched
- `src/assets/exercises/wrist-circles.png` — new
- `src/data/exercises.ts` — import + assign image to wrist-circles entry

## Out of Scope
- Illustrations for exercises #3–#6 (same pattern when assets arrive).
