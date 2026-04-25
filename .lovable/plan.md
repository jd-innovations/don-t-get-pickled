# Set Image for "Seated Hip Circles"

Add the uploaded comic illustration as the image for exercise #4 (Seated Hip Circles), matching the pattern used for exercises 1, 2, 3, 5, 7, and 8.

## What's added

- **Asset**: Save uploaded image to `src/assets/exercises/seated-hip-circles.png`.
- **Data wiring** in `src/data/exercises.ts`:
  - Add `import seatedHipCirclesImage from "@/assets/exercises/seated-hip-circles.png";`
  - Add `image: seatedHipCirclesImage` to the existing `hip-circles` exercise entry.

## Files Touched

- `src/assets/exercises/seated-hip-circles.png` — new image (copied from upload).
- `src/data/exercises.ts` — add import and `image` field on the `hip-circles` entry.

## Out of scope

- Changes to dose, steps, tip, or name.
- Reordering exercises or touching other entries.
