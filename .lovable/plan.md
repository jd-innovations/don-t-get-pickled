
# Replace "Seated Knee Extensions" with "Seated Hamstring Reach"

Swap exercise #5's illustration with the new comic-style hamstring reach image and rename the exercise. Keep the same id so completion state and ordering are preserved.

## Changes

1. **Add new asset** — copy `user-uploads://0A5A9836-5285-4ABC-818A-5FB4A4159D3B.png` to `src/assets/exercises/seated-hamstring-reach.png`.

2. **Update `src/data/exercises.ts`** — for the entry currently identified as `knee-extensions`:
   - Add import: `import seatedHamstringReachImage from "@/assets/exercises/seated-hamstring-reach.png";`
   - Rename `name` from `"Seated Knee Extensions"` to `"Seated Hamstring Reach"`
   - Update `muscles` to `"Hamstrings · Lower Back · Hips"`
   - Update `shortBenefit` to reflect loosening tight hamstrings that pull on the lower back (matches the image's tagline)
   - Rewrite `steps` for a seated hamstring reach: sit at edge of chair, extend one leg straight with heel on floor and toes up, hinge from hips and reach toward the toes, hold ~15 seconds, switch sides
   - Update `dose` to a hold-based prescription (e.g. `"2×15s Each Leg"`)
   - Update `tip` to reinforce the hamstring → lower-back connection
   - Set `image: seatedHamstringReachImage`
   - Keep `id: "knee-extensions"`, `number: 5`, and `phase: "Strength"` unchanged so existing completion state and card ordering remain intact

No changes to `ExerciseCard.tsx`, lightbox, or any other component — they read these fields generically.

## Files Touched

- `src/assets/exercises/seated-hamstring-reach.png` — new image
- `src/data/exercises.ts` — rename, new copy, new image binding for entry #5

## Out of Scope

- Changing the exercise `id` (would reset completion tracking).
- Reordering exercises or moving phases.
- Editing other exercises' copy or assets.
