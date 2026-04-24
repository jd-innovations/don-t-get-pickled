
# Guided Session Mode

Add a full-screen, step-by-step guided mode that walks the user through every exercise in order, with a countdown timer sized to each exercise's dose, and clear "next up" progression. Existing dashboard list view stays untouched as the default; guided mode is opt-in.

## Entry point

- New **"▶ Start Guided Session"** button placed at the top of the Today's Session card in `dashboard.tsx`, just above the existing START/RESUME button. Secondary style so it doesn't compete with the primary CTA, but visually prominent.
- Clicking it opens the new `<GuidedSession />` overlay (full-screen Sheet from the bottom on mobile, centered Dialog on desktop — reuse `Sheet` component already in `ui/`).

## Component: `src/components/GuidedSession.tsx`

Full-screen overlay with three states per exercise: **Get Ready (3s)** → **Active (timer)** → **Done (auto-advance)**.

### Layout (top → bottom)
1. **Header bar**: phase badge (colored dot + name), exercise counter (`3 / 8`), close ✕.
2. **Overall progress bar**: thin bar showing `(currentIndex + activeProgress) / total`.
3. **Exercise image** (if present) — large, centered, rounded.
4. **Exercise name** + muscles line.
5. **Big circular countdown ring** (SVG) in the center showing seconds remaining; number large in the middle. For rep-based exercises with no natural duration, ring shows the current rep count instead (e.g. `4 / 10`) and a tap-advance "+1 rep" button.
6. **Current step text** — shows the active step from `exercise.steps`, advances proportionally with the timer (steps split evenly across duration).
7. **Controls row**: ⏸ Pause/▶ Resume · ⏭ Skip · ✓ Mark Done & Next.
8. **"Next up" preview strip** at the bottom: small thumbnail + name of the next exercise, or "Last one — finish strong 💪".

### Timing logic — dose parser

A small helper `parseDose(dose: string)` in the same file returns one of:
- `{ kind: "hold", seconds: number, sides?: number }` — e.g. `"3×10s Holds"` → 3 rounds × 10s, `"2×15s Each Leg"` → 2 rounds × 15s × 2 sides.
- `{ kind: "reps", reps: number, sets?: number, perSide?: boolean }` — e.g. `"3×15 Reps"` → 3 sets × 15 reps, `"10 Each Direction"` → 10 reps × 2 sides, `"10 Each Side"` → 10 reps × 2 sides, `"10 Each Wrist"` → 10 reps × 2 sides, `"8 Each Direction"` → 8 reps × 2 sides.

Regex-based, falls back to `{ kind: "reps", reps: 10 }` if it can't parse.

For reps mode, default tempo is **2 seconds per rep** so the timer can still drive a smooth ring and step progression; user can tap "+1 rep" to advance manually if they're faster, or just let it run.

For multi-set / multi-side exercises, the ring shows current set/side label below the number (e.g. `Set 2 / 3`, `Right Leg`, `Counter-Clockwise`) and auto-cycles through sets with a 5-second rest between sets.

### State machine (single `useState` + `useEffect` interval)

```
phase: "get-ready" | "active" | "rest" | "done"
currentExerciseIdx, currentSetIdx, currentSideIdx
secondsRemaining
isPaused
```

- Tick every 250ms with `setInterval`; clears on pause, unmount, and phase transitions.
- "Get Ready" plays a 3-2-1 countdown before each exercise.
- "Rest" plays a 5s rest between sets (skippable).
- On `Active → 0`: advance to next set/side, or next exercise after a 1s "Done!" flash.
- On final exercise complete: switch to a celebration screen ("🎉 Session complete!") with two buttons — "View summary" (opens existing `SessionSummary`) and "Close".

### Marking done

When an exercise finishes all sets/sides naturally OR the user hits ✓, write to the same `dgp:completed:YYYY-MM-DD` localStorage key via the existing `useCompletedExercises` hook. So guided mode and list mode stay in sync — close guided mode and the dashboard checkboxes are already filled.

### Audio cue (lightweight)

A short beep on each transition (Get Ready 3-2-1, Active end, Set complete) using a tiny inline `AudioContext` oscillator — no asset files. Mute toggle 🔊/🔇 in the header bar; preference persisted in `localStorage` as `dgp:guided:muted`.

### Accessibility

- `aria-live="polite"` on the step text and countdown.
- Spacebar = pause/resume, → = skip, ✓ key = mark done.
- Respects `prefers-reduced-motion` (no ring spin animation, just numeric countdown).

## Files Touched

- `src/components/GuidedSession.tsx` — new file (entire feature).
- `src/routes/dashboard.tsx` — add `guidedOpen` state + new button + `<GuidedSession>` render.

## Out of scope

- Editing per-exercise tempo/duration (uses dose-derived defaults).
- Voice coaching / TTS.
- Background music.
- Persisting which set/side you were on if you close mid-session (closing = aborts; reopening starts fresh from the first incomplete exercise).
- Changes to `ExerciseCard`, `SessionSummary`, or the dose strings in `exercises.ts`.
