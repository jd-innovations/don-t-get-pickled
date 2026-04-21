

# Add Illustration to Arm Circles Exercise

Replace the gray "Illustration coming soon" placeholder in the Arm Circles card with the uploaded image. Build the change so future exercises can drop in their own illustrations the same way.

## Steps

1. **Save the asset** — copy `user-uploads://IMG_4955.png` to `src/assets/exercises/arm-circles.png` so Vite bundles and optimizes it.

2. **Extend the data model** (`src/data/exercises.ts`)
   - Add an optional `image?: string` field to the `Exercise` interface.
   - Import the new asset and attach it to the `arm-circles` entry only. Other exercises remain unchanged (placeholder still shows for them).

3. **Render the image** (`src/components/ExerciseCard.tsx`)
   - In the expanded section, if `exercise.image` exists, render an `<img>` filling the existing `aspect-video` container (`object-cover`, rounded, alt = exercise name).
   - If no image, keep the current "Illustration coming soon" placeholder so #2–#6 are unaffected.

## Files Touched

- `src/assets/exercises/arm-circles.png` — new (copied from upload)
- `src/data/exercises.ts` — add `image` field + import for arm circles
- `src/components/ExerciseCard.tsx` — conditionally render image vs. placeholder

## Out of Scope

- Illustrations for the other 5 exercises (will follow the same pattern when assets are provided).
- Lightbox / zoom interaction on the image.

