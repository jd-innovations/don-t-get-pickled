# Switch guided session timer from circular ring to linear bar

## Goal
Reclaim vertical space on mobile by replacing the 200×200 circular SVG ring in `GuidedSession.tsx` with a slim horizontal progress bar. The big numeric countdown / rep counter stays — only the ring chrome around it changes.

## What changes (visually)

Before: large circle (~200px tall) wrapping the seconds/reps number.

After: stacked, compact layout (~110px tall total):

```text
        45                       ← big countdown number (or "7/10 reps")
        SECONDS                  ← tiny label
   ━━━━━━━━━━━━━━━━━━━━━━━      ← thin horizontal bar (4–6px)
   Set 1/3 · Right Side          ← existing set/side line
```

- Bar fills left → right during `get-ready` (orange) and `active` (phase color).
- Bar drains right → left during `rest` (blue) — visually "unwinding" so the user sees rest time shrinking. This satisfies the "vice versa" direction request.
- Bar color matches the existing ring color logic (orange / phase / blue).
- Width: full content width (max-w-md container, with px-5 padding already applied).
- Height: ~5px, rounded ends, dark track `#1e1e1e`, animated fill.

## Technical changes

Single file: `src/components/GuidedSession.tsx`

1. **Remove** the SVG ring block (the `<svg>` with two `<circle>` elements and the absolute-positioned inner content overlay) and its `ringSize / stroke / radius / circ / dashOffset` constants.
2. **Replace** with a flex column:
   - Top: the countdown number / reps display (reuse existing JSX from inside the ring overlay).
   - Middle: a `<div>` track containing a fill `<div>` whose `width` is driven by progress.
   - Bottom: keep the existing `setSideLine` and "+1 rep" button untouched.
3. **Progress math**:
   - `fillPct = (1 - msRemaining / phaseTotalMs) * 100` for `get-ready` and `active` (fills L→R).
   - `fillPct = (msRemaining / phaseTotalMs) * 100` for `rest` (drains R→L — bar shrinks from right edge by anchoring fill to `right: 0`).
   - For the rest case, switch the fill element's positioning so it grows from the right side.
4. **Color**: reuse the existing ternary already used for the ring stroke (`#82a0e0` rest, `#f5a623` get-ready, otherwise `color`).
5. **Transition**: `transition: width 250ms linear` on the fill to match the existing 250ms tick.
6. Keep all other logic (beeps, pause, advance, rep counter, celebrate screen, header progress bar) unchanged.

## Out of scope
- No changes to header overall progress bar, controls, "next up" card, or session stats.
- No changes to `dashboard.tsx`, `GenerateWarmupSheet.tsx`, or any other file.
