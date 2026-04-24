
# Guided Session Summary + Weekly & All-Time Stats

Extend the existing `SessionSummary` so that after a guided session (and any time the user opens it) they see meaningful aggregate stats: today's totals, this week, and all-time — plus a per-session summary card right after a guided run.

## What gets added

### 1. New stats tracked

A small persistence layer in `src/hooks/useSessionStats.ts`:
- localStorage key `dgp:sessions` → array of session records:
  ```ts
  type SessionRecord = {
    date: string;          // YYYY-MM-DD
    completedAt: number;   // epoch ms
    durationSec: number;   // active + rest time, excludes pause
    exerciseIds: string[]; // those marked done in this session
    totalReps: number;     // sum of reps across rep-based exercises completed
    totalHoldSec: number;  // sum of seconds across hold-based exercises completed
  };
  ```
- Helpers: `addSession(record)`, `getAll()`, `getWeek()` (last 7 days incl. today), `getAllTimeTotals()`, `getTodayTotals()`.
- Derived totals: `sessionsCount`, `exercisesDone`, `totalReps`, `totalHoldSec`, `totalDurationSec`.

### 2. Guided session writes a record on completion

In `GuidedSession.tsx`:
- Track `sessionStartMs` on first tick after open, `pausedMs` accumulator, and per-exercise completion (with parsed dose → reps and hold seconds).
- On reaching `phase === "celebrate"` (or when user closes after at least one exercise done), call `addSession(...)` once. Guard with a ref so it only writes once per session.
- Reps/holds estimation uses the same `parseDose` already in the file: `reps = sets * reps * sides`, `holdSec = sets * seconds * sides`.

### 3. Updated `SessionSummary` view

Restructure into three tabs (using existing `ui/tabs.tsx`): **Today · This Week · All Time**.

- **Today tab**: keeps current behavior (per-phase checklist, today's progress bar, reset button) and adds a top stat strip:
  - Time (today's session durations summed) · Exercises done · Reps · Hold seconds.
- **This Week tab**: stat strip + a simple 7-day bar (Mon–Sun) showing exercises done per day, plus session count.
- **All Time tab**: stat strip + total sessions, total time (formatted `Xh Ym`), total reps, total hold time, current streak (consecutive days with ≥1 session ending today or yesterday).

Stat strip is a 2x2 grid of cards reusing the existing dark card styling — no new design tokens.

### 4. Post-session "Session recap" card

After guided celebration, when user taps **VIEW SUMMARY**, the summary opens on the **Today** tab with a dismissible recap banner at the top showing just-completed session: duration, exercises, reps, holds. State passed via a new optional `recap?: SessionRecord` prop on `SessionSummary`, set from `dashboard.tsx` when guided completion fires.

## Files Touched

- `src/hooks/useSessionStats.ts` — new (persistence + aggregation helpers + React hook returning live stats).
- `src/components/GuidedSession.tsx` — track duration & dose totals; call `addSession` once on completion; pass recap up via new `onSessionComplete?: (rec) => void` prop.
- `src/components/SessionSummary.tsx` — add Tabs (Today/Week/All-Time), stat strip cards, weekly bar, optional recap banner.
- `src/routes/dashboard.tsx` — hold latest `recap` state, pass into `<SessionSummary recap={recap} />`, wire `onSessionComplete` from `<GuidedSession />`.

## Out of scope

- Backend persistence / cross-device sync (localStorage only for now).
- Editing past sessions or manual time entry.
- Charts beyond the simple 7-day bar (no chart library added).
- Streak notifications, goals, or badges.
- Changes to `ExerciseCard` or the dose strings in `exercises.ts`.
