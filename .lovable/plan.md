
# Tap Image to Open Fullscreen with Pinch-Zoom

Add a fullscreen lightbox to exercise illustrations. Tapping the image (or video poster) inside an expanded `ExerciseCard` opens a modal that fills the viewport, supports native pinch-to-zoom, and closes on tap of a close button or backdrop.

## Behavior

- Tap image → fullscreen overlay opens with the image centered on a black background.
- Pinch to zoom and pan the image (native browser gesture, enabled via a dedicated `<meta name="viewport">` swap while open OR via a `touch-action: pinch-zoom` wrapper — see technical note).
- Close via: top-right close button (X), tap on backdrop, or pressing Escape on desktop.
- Body scroll is locked while the lightbox is open.
- Only applies to the still `image` branch. Videos already have native fullscreen via the existing `controls` attribute, so no change there.

## Implementation

1. **New component** `src/components/ImageLightbox.tsx`
   - Props: `src: string`, `alt: string`, `open: boolean`, `onClose: () => void`.
   - Renders via React portal into `document.body` so it escapes the card's stacking context.
   - Fixed `inset-0 z-[100] bg-black/95` overlay, flex-centered image at `max-w-full max-h-full object-contain`.
   - Wrapper div uses `touch-action: pinch-zoom` and `overflow: auto` so two-finger pinch zooms the image and the user can pan the zoomed result. This is the cleanest mobile-Safari-compatible approach and needs no extra deps.
   - Close button (lucide `X`) pinned top-right with safe-area padding.
   - Listens for `Escape` key; locks `document.body.style.overflow` while open.

2. **Wire into `ExerciseCard.tsx`**
   - Add `lightboxOpen` state.
   - Wrap the `<img>` in a `<button type="button" onClick={() => setLightboxOpen(true)}>` with `aria-label="View full image"` and `cursor-zoom-in`.
   - Render `<ImageLightbox src={exercise.image} alt={exercise.name} open={lightboxOpen} onClose={() => setLightboxOpen(false)} />` at the end of the card.
   - Video and fallback branches unchanged.

## Technical Note

`touch-action: pinch-zoom` on a scrollable container is the standard, dependency-free way to enable native pinch zoom on a single element inside an app where the page-level viewport disables user scaling. It works on iOS Safari 14+ and Chrome Android. No external lib (e.g. react-zoom-pan-pinch) is needed for this scope.

## Files Touched

- `src/components/ImageLightbox.tsx` — new portal-based fullscreen viewer.
- `src/components/ExerciseCard.tsx` — make image clickable, mount the lightbox.

## Out of Scope

- Lightbox for videos (native fullscreen via existing `controls` covers this).
- Swiping between exercise images.
- Double-tap-to-zoom shortcut (pinch is sufficient).
