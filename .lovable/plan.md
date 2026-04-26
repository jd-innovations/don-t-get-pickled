## Goal

Make the app feel more modern and polished by adding tasteful entrance animations, smooth state transitions, and micro-interactions. No functionality, copy, layout, or routing changes.

## What will improve

1. **Global animation utilities** (`src/styles.css`)
   - Add reusable keyframes + utility classes: `fade-in-up`, `fade-in`, `scale-in`, `slide-in-right`, `slide-in-left`, `shimmer`, `pulse-glow`.
   - Add a `.hover-lift` utility (subtle translateY + shadow on hover) and `.press` (active:scale-95) for buttons.
   - Add a `motion-safe` wrapper so all animations respect `prefers-reduced-motion`.
   - Add a soft accent glow variable for the lime CTA (`--shadow-lime`).

2. **Landing page (`src/routes/index.tsx`)**
   - Hero title: staggered `fade-in-up` for eyebrow → H1 (per-line) → subtext.
   - Phase sections: each phase divider + its cards fade-in-up with small stagger as they mount.
   - Sticky CTA: gentle pulse-glow on the lime border and `hover-lift` + `press` on the button.
   - Header sign-in: animated underline on hover (story-link style).

3. **Dashboard (`src/routes/dashboard.tsx`)**
   - "READY TO PLAY?" hero + profile/week/generate cards: staggered fade-in-up on mount.
   - Generate Warm-Up card: subtle gradient shimmer behind the Sparkles icon; icon gets a slow pulse.
   - Progress bar fill: keep width transition, add a moving shimmer overlay while > 0% and < 100%.
   - Bottom nav: active tab icon scales + lime glow on switch; inactive→active uses smooth color/scale transition.
   - Primary CTAs: `hover-lift`, `press`, and focus ring in lime.

4. **Onboarding (`src/routes/onboarding.tsx`)**
   - Replace inline `<style>` keyframes with shared utilities; keep forward/back slide direction logic.
   - OptionCard: add `hover-lift`, `press`, and a smooth selected-state border glow (lime ring fade-in).
   - Chip buttons (injuries/goals): scale-in on select, smooth color transition, subtle bounce on tap.
   - Progress bar: add shimmer while animating; step dots scale up when reached.
   - "Done" stage: staggered reveal (emoji bounce-in → title → gift card scale-in → CTA fade-in-up).

5. **ExerciseCard (`src/components/ExerciseCard.tsx`)**
   - Card: `hover-lift` (very subtle on mobile-safe transform), animated lime border glow when `open`.
   - Chevron: keep rotation, add ease-spring timing.
   - Phase badge / dose: tiny fade when card mounts.
   - Completion checkbox: scale + check-draw animation when toggled to complete.
   - Locked card: subtle pulse on the Lock icon to hint interactivity.
   - Keep existing step stagger; share keyframe via global utility instead of inline style block.

6. **PhaseDivider (`src/components/PhaseDivider.tsx`)**
   - Animate the horizontal line growing from 0 → 100% width on mount (300ms ease-out).
   - Label fades in alongside.

7. **GuidedSession + GenerateWarmupSheet + SessionSummary**
   - Add fade/scale-in for sheet content children (header → bar → controls) using existing Radix open state + small CSS delays.
   - Phase color transitions on the linear timer bar already exist — add a soft glow under the bar matching `barColor`.
   - "+1 rep" and Next/Prev buttons get `press` + `hover-lift`.

## Technical notes

- Pure CSS + Tailwind utility classes via `src/styles.css`. No new npm dependencies.
- All animations gated behind `@media (prefers-reduced-motion: no-preference)` so accessibility is preserved.
- Stagger implemented via inline `style={{ animationDelay: ... }}` on existing elements — no structural JSX changes.
- No route, prop, state, or data changes. Behavior, copy, and layout remain identical.

## Files to edit

- `src/styles.css` — add keyframes, utilities, reduced-motion guard
- `src/routes/index.tsx` — apply entrance + hover utilities
- `src/routes/dashboard.tsx` — apply entrance, nav, CTA, progress shimmer utilities
- `src/routes/onboarding.tsx` — replace inline keyframes, polish chips/cards/done stage
- `src/components/ExerciseCard.tsx` — border glow, check animation, hover-lift
- `src/components/PhaseDivider.tsx` — animated line
- `src/components/GuidedSession.tsx` — control micro-interactions, bar glow
- `src/components/GenerateWarmupSheet.tsx` — staggered content reveal
- `src/components/SessionSummary.tsx` — staggered content reveal
