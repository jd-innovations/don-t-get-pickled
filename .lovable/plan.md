
# Replace Arm Circles Illustration

Swap the existing `arm-circles.png` asset with the newly uploaded comic-style illustration. No code changes needed — the import and data binding already point to this path.

## Steps

1. **Overwrite the asset** — copy `user-uploads://391C3906-3593-44EF-865B-5E48EE5C24B8.png` to `src/assets/exercises/arm-circles.png`, replacing the current file.

That's the entire change. `src/data/exercises.ts` already imports from this path and assigns it to the `arm-circles` entry, and `ExerciseCard.tsx` renders it generically. Vite will pick up the new asset on next build.

## Files Touched

- `src/assets/exercises/arm-circles.png` — overwritten with new illustration

## Out of Scope

- Editing exercise copy, name, steps, or dose.
- Changing card layout or lightbox behavior.
