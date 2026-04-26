## Audit Findings (375×812 mobile)

### Truncation issues found
1. **`ExerciseCard.tsx` line 114** — primary issue. Every exercise card uses `truncate` on the muscles list (`Shoulders · Deltoi…`, `Wrists · Forearms · El…`, `Hip Flexors · Pelvis…`, etc.). This hides important muscle-target info on every card on the landing page, dashboard, and onboarding preview.

2. **`ExerciseCard.tsx` lines 116–140** — the right-side meta column ("10 Each Wrist", "10 Each Direction", phase pill) shares a row with the title. When titles wrap to 2 lines (Wrist Circles & Flexion, Ankle Circles, Seated Hip Circles, etc.), the dose text gets squeezed against the title, looking cramped.

3. **`schedule.tsx` line 242** — preset preview pills truncate exercise names at `max-w-[80px]`. Acceptable as a preview, but easy to relax.

### Acceptable truncations (leaving as-is)
- `profile.tsx` display name & email — protects layout from very long emails; no info loss because email is shown elsewhere.
- `GuidedSession.tsx` "Next up" mini-preview — full name renders on the next step.
- `SessionSummary.tsx` `whitespace-nowrap` is inside a fixed-width metric, fine.

## Changes

**`src/components/ExerciseCard.tsx`**
1. Remove `truncate` on the muscles `<p>` (line 114). Replace with `break-words leading-snug` so long lists wrap to 2 lines instead of clipping.
2. Tighten the title/meta layout:
   - Reduce title from `text-lg` → `text-base` to give the right column more room (still bold via `font-display`).
   - Add `gap-2` on the right meta column wrapper and `text-right` on the dose so wrapped dose like "10 Each Direction" sits cleanly.
   - Add `max-w-[88px]` to the meta column so it never expands past a usable size, letting the title use the rest of the row.

**`src/routes/_authenticated/schedule.tsx`**
3. Bump preview-pill `max-w-[80px]` → `max-w-[110px]` so most preset names fit without `…`.

## Out of scope (no change needed)
- Auth, onboarding, dashboard hero, profile header, schedule cards, guided session screens — verified clean at 375×812.
