
# Don't Get Pickled — Pickleball Warm Up App

A mobile-first, fully dark-themed web app with 3 screens connected by local state. No backend — all data and flow handled in React.

## Design System
- **Background:** `#0a0a0a` · **Surface:** `#111111` · **Border:** `#1e1e1e`
- **Accent:** Lime `#C8F135` · **Phase colors:** Warm-Up `#f5a623`, Mobility `#82a0e0`, Strength `#C8F135`
- **Fonts:** Bebas Neue (headings), DM Sans (body) — loaded via Google Fonts
- Mobile-first, optimized for 390px width

## Routes
- `/` — Landing (Screen 1)
- `/onboarding` — Registration + 6-step questionnaire (Screen 2)
- `/dashboard` — Today's session (Screen 3)

Each route gets its own `head()` metadata for SEO.

## Screen 1 — Landing
- **Header:** "DON'T GET PICKLED" wordmark (lime, Bebas Neue) · "Sign In" link right
- **Hero:** Eyebrow "Free Warm Up Guide" → headline → subtext
- **6 Exercise cards** grouped under colored phase dividers (Warm-Up, Mobility, Strength)
  - Tap to expand: border turns lime, reveals illustration placeholder, 4 staggered instruction steps, and a tip with lime left border
  - All 6 exercises seeded with the exact copy provided (Arm Circles, Wrist Circles, Torso Twist, Hip Circles, Knee Extensions, Heel Raises)
- **Sticky bottom CTA bar** with lime top border → "UNLOCK FREE GUIDE" button → `/onboarding`

## Screen 2 — Registration + Intake
- **Top bar:** Brand left · "Skip for now" right (jumps to `/dashboard`)
- **Mock registration:** Email + password fields (dark, lime focus ring) → "CREATE ACCOUNT" advances to questionnaire (no real auth)
- **6-step questionnaire** with animated progress bar + 6 dots
  - Slide-in/out transitions (right→left)
  - Next disabled until valid selection
  - Steps 1–4: single-select option cards (with descriptions where specified)
  - Step 5: multi-select tags, **red** when selected, "None" clears others
  - Step 6: multi-select up to 3, **lime** when selected
- **Completion screen:** 🥒 · "YOU WON'T GET PICKLED" · reward card with code `PICKLED10` · "VIEW MY PLAN" → `/dashboard`

Selections stored in local React state (lifted to a context or passed via navigation state) so the dashboard can reference them later.

## Screen 3 — Dashboard
- **Top bar:** Brand left · avatar circle right
- **Welcome:** "READY TO PLAY?" + subtext
- **Session tracker card:** "TODAY'S SESSION" · "0 of 18 complete" · lime progress bar · "START SESSION" button
- **18 exercise cards** in 4 phase sections (colored dividers): the 6 real exercises from Screen 1, plus placeholder cards for #7–18 with "Full exercise library coming soon"
- **Bottom nav:** Home · Schedule · Profile (icons, lime active state)

## Shared Pieces
- `exercises.ts` — typed data array for all 6 exercises (reused on Screen 1 and Screen 3)
- `ExerciseCard` component — handles expand/collapse animation and staggered steps
- `PhaseDivider` component — colored bar with phase name
- Tailwind theme tokens updated in `src/styles.css` to register the brand colors and fonts so utilities like `bg-background`, `text-accent`, `font-display` work everywhere

## Out of Scope
- Real authentication, persistence, or backend
- Actual exercise illustrations (gray placeholder rectangles only)
- Schedule and Profile bottom-nav destinations (visual tab only)
