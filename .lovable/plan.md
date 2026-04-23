
# Replace Wrist Circles & Flexion Illustration

Swap the existing `wrist-circles.png` asset with the newly uploaded comic-style illustration. No code changes needed — the import and data binding already point to this path.

## Steps

1. **Overwrite the asset** — copy `user-uploads://A83149BC-C707-4BDE-8E39-B0F8536512EA.png` to `src/assets/exercises/wrist-circles.png`, replacing the current file.

`src/data/exercises.ts` already imports from this path and assigns it to the `wrist-circles` entry, and `ExerciseCard.tsx` renders it generically. Vite picks up the new asset on next build.

## Files Touched

- `src/assets/exercises/wrist-circles.png` — overwritten with new illustration

## Out of Scope

- Editing exercise copy, name, steps, or dose.
- Changing card layout or lightbox behavior.
