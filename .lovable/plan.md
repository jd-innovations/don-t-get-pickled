
# Session Summary Screen

Add a per-session summary view that lists every exercise grouped by phase (Warm-Up / Mobility / Strength), showing which are done and which are still pending, plus an overall progress bar and headline stats.

## Trigger

The existing `START SESSION / RESUME SESSION / SESSION COMPLETE ✓` button in the dashboard's Today's Session card currently does nothing. We'll wire it to open the summary as a full-screen overlay (modal sheet). Also add a small `View Summary` text link next to "Reset today's progress" so users can open it any time.

## Layout (full-screen overlay, mobile-first, max-w-md)

```
┌─────────────────────────────────────────┐
│  ✕                              SESSION │
│                                         │
│  TODAY'S SESSION                        │
│  4 of 6 complete · 67%                  │
│  ████████████████░░░░░░░  (lime fill)   │
│                                         │
│  ── WARM-UP ──────────────              │
│  ✓  1  Arm Circles                      │
│  ○  2  Wrist Circles & Flexion          │
│                                         │
│  ── MOBILITY ─────────────              │
│  ✓  3  Seated Torso Twist               │
│  ✓  4  Seated Hip Circles               │
│                                         │
│  ── STRENGTH ─────────────              │
│  ○  5  Seated Hamstring Reach           │
│  ✓  6  Heel Raises                      │
│                                         │
│  [  CLOSE  ]                            │
│  Reset today's progress                 │
└─────────────────────────────────────────┘
```

- Each row: status circle (filled lime ✓ when done, hollow grey when not), exercise number in phase color, name. Tapping a row toggles completion (same `toggle(id)` from `useCompletedExercises`) so the summary doubles as a quick check-off list.
- Phase header reuses the existing `PhaseDivider` style (colored label + rule) for visual consistency.
- Per-phase mini-count next to the phase label: e.g. `WARM-UP — 1/2`.
- Headline progress bar matches the dashboard's existing one (h-2, lime fill, dark track).
- Overlay: fixed inset-0, `bg-[#0a0a0a]`, scrollable, with sticky top bar containing the close ✕.

## State & data

- No new storage. Reads from `useCompletedExercises` and the static `exercises` array — same source of truth as the dashboard, so toggles stay in sync.
- Open/close is local component state (`useState<boolean>`) on the dashboard route. Lock body scroll while open via a small effect.

## Files Touched

- `src/components/SessionSummary.tsx` — new component. Props: `open: boolean`, `onClose: () => void`, `completed: Set<string>`, `onToggle: (id: string) => void`, `onReset: () => void`. Pure presentation; no data fetching.
- `src/routes/dashboard.tsx` — add `summaryOpen` state; wire the START/RESUME/COMPLETE button + a new "View summary" link to open it; render `<SessionSummary />`.

## Out of scope

- Persisting historical sessions (no streaks, no calendar history yet — today only, matching current `dgp:completed:YYYY-MM-DD` storage).
- Sharing / export.
- Animations beyond a simple fade/slide-in (kept minimal to match existing aesthetic).
- Changing the header checkbox or the Mark Done button inside `ExerciseCard`.
