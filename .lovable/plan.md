

# Add Exercise Completion Tracking

Let users mark each exercise complete on the dashboard, with progress reflected in the session tracker and persisted across reloads.

## UX

**Per-card checkoff (primary interaction)**
- Add a circular check button on the left of each `ExerciseCard` header (replacing or beside the number badge).
  - Unchecked: hollow lime ring with the exercise number inside.
  - Checked: filled lime circle with a check icon, card title gets `line-through` + dimmed opacity, card border stays subtle.
- Tapping the circle toggles complete; it does NOT expand the card (stop event propagation). Tapping anywhere else still expands.

**Session tracker card**
- "X of 18 complete" updates live.
- Lime progress bar animates to the new percentage.
- "START SESSION" becomes "RESUME SESSION" once any exercise is complete, and "SESSION COMPLETE ✓" (disabled-look, full lime) when all real exercises are done.
- Add a small "Reset" text-button under the progress bar (only visible when completed > 0) to clear progress for the day.

**Placeholder cards (#7–18)**
- Stay non-interactive — no checkoff, since they're "coming soon". Progress denominator becomes the count of real exercises (6) rather than 18, so the bar can actually reach 100%. Tracker label updates to "X of 6 complete".

## State & Persistence

- New hook `src/hooks/useCompletedExercises.ts`:
  - Holds `Set<string>` of completed exercise IDs.
  - Persists to `localStorage` under key `dgp:completed:<YYYY-MM-DD>` so progress auto-resets each new day.
  - Exposes `{ completed, isComplete(id), toggle(id), reset() }`.
- Dashboard consumes the hook for the tracker; `ExerciseCard` accepts optional `completed` + `onToggle` props (omitted on the landing page so nothing changes there).

## Files Touched

- `src/hooks/useCompletedExercises.ts` — new hook (localStorage + daily reset).
- `src/components/ExerciseCard.tsx` — add optional check button, strikethrough styling when complete, prop-driven (no behavior change when props absent, so landing page stays read-only).
- `src/routes/dashboard.tsx` — wire hook into tracker, pass props to cards, add Reset button, dynamic CTA label, fix denominator to real exercise count.

## Out of Scope

- Server-side persistence or per-user accounts.
- Completing individual *steps* within an exercise.
- Streaks / weekly history (could be a follow-up).
- Making placeholder cards completable.

