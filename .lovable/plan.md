
# Replace Wrist Circles Illustration

Swap the existing `wrist-circles.png` asset with the new uploaded comic-style illustration. No code logic changes — same import, same `image` field — just a new asset file at the same path.

## Steps

1. **Save the asset** — copy `user-uploads://ABA1C40F-980D-4DD3-AF58-FF52F23A5231.png` to `src/assets/exercises/wrist-circles.png`, overwriting the previous file.

That's it. `src/data/exercises.ts` already imports `wrist-circles.png` and assigns it to the `wrist-circles` entry, and `ExerciseCard.tsx` already renders it. Vite will pick up the new file on next build.

## Files Touched

- `src/assets/exercises/wrist-circles.png` — overwritten with new illustration

## Out of Scope

- Changing the exercise card layout, copy, or video behavior.
- Adding the new image as a video/animation.
