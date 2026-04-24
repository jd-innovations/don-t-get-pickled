
# Add "Done" Button Inside Expanded Exercise Cards

Add a prominent "Mark Done" button at the bottom of each expanded `ExerciseCard` so users can complete an exercise without scrolling back to the small numbered checkbox in the header. It uses the existing completion state — no new storage.

## Behavior

- When a card is expanded, a full-width button appears below the Tip block.
- If the exercise is **not complete**: button reads `MARK DONE`, lime background (`#C8F135`), black text. Tapping it marks the exercise complete.
- If the exercise **is complete**: button reads `✓ COMPLETED — TAP TO UNDO`, dark background with lime border and lime text. Tapping it unmarks.
- After marking done, the card stays expanded (user controls collapse via the header chevron) so they can re-read steps if needed.
- Hidden entirely on the read-only library view (when `onToggleComplete` is not provided), matching how the header checkbox already behaves.

## Visual

```text
┌─ expanded card ─────────────────┐
│ [video / image]                 │
│ short benefit                   │
│ 1. step…                        │
│ 2. step…                        │
│ ┃ Tip: …                        │
│ ┌─────────────────────────────┐ │
│ │       MARK DONE             │ │  ← new
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## Files Touched

- `src/components/ExerciseCard.tsx` — add the button at the end of the expanded content block, wired to the existing `onToggleComplete(exercise.id)` and `completed` props. No new state, no new props, no changes to `useCompletedExercises` or `Dashboard`.

## Out of Scope

- Per-step checkboxes (the request is per-exercise, matching today's tracking model).
- Auto-collapse on completion.
- New animations, toasts, or haptics.
- Changes to the existing header checkbox (kept for at-a-glance toggling from the collapsed list).
