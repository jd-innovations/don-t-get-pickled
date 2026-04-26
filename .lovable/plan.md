## Add "Brought to you by Pickleball Grip Doctor" section to home screen

Add a clear sponsor/brand attribution section near the bottom of the landing page (`src/routes/index.tsx`), just above the sticky CTA.

### What the user will see

Between the last exercise phase and the sticky "UNLOCK FREE GUIDE" CTA:

1. A **subtle divider** — a thin lime-accent horizontal line with the small label "BROUGHT TO YOU BY" centered on it (matching the existing `PhaseDivider` aesthetic of the app).
2. A **brand card** with:
  - The Pickleball Grip Doctor logo (white/lime on dark, fits the existing palette perfectly)
  - Short tagline below: "Helping pickleball players grip better, play longer, stay injury-free."
  - A small "Learn more →" link styled as a subtle story-link (placeholder `#` href for now — user can supply actual URL later).
3. Card uses the same `rounded-2xl border border-[#1e1e1e] bg-[#111111]` treatment as other cards, with a soft fade-in animation on scroll.

### Technical details

- **Add logo asset**: Copy `user-uploads://PGD.png` to `src/assets/pgd-logo.png` and import it as an ES6 module in `index.tsx` (per project asset guidelines).
- **Edit `src/routes/index.tsx**`: Add a new `<section>` after the exercises map and before the sticky CTA `<div>`. Reuse existing motion classes (`anim-fade-in-up`, `hover-lift`) and the lime accent (`#C8F135`) for visual consistency.
- **No new components needed** — the section is small enough to inline. No route, data, or dependency changes.
- Bottom padding on `<main>` already accounts for the sticky CTA, so no layout adjustments needed.
- Add link to the logo to open [https://pickleballgripdoctor.com/](https://pickleballgripdoctor.com/) in new tab.

### Out of scope

- Adding the same section to `/dashboard` (user said "home screen" only — landing page).
- Linking to a real Pickleball Grip Doctor URL (user can provide later).