
# Show Full Exercise Image (No Cropping)

The image for Wrist Circles is being cropped because the container forces a fixed `aspect-video` ratio with `object-cover`. Switch the image (and video) rendering to preserve the asset's natural aspect ratio so the entire illustration is visible.

## Change

In `src/components/ExerciseCard.tsx`, inside the expanded content area:

- **Image branch**: replace `aspect-video w-full ... object-cover` with `w-full h-auto object-contain` on a neutral background. This lets tall/portrait illustrations render in full without cropping.
- **Video branch**: keep the video responsive but also drop the forced `aspect-video` crop — use `w-full h-auto` with `object-contain` and a dark background so letterboxing (if any) blends in.
- **Fallback states** (video error, no media): keep `aspect-video` since they're empty placeholders that need a defined height.

No changes to data, assets, or any other component.

## Files Touched

- `src/components/ExerciseCard.tsx` — image/video className updated to preserve full aspect ratio.

## Out of Scope

- Replacing the wrist-circles asset or any other illustration.
- Adding zoom/lightbox interactions.
