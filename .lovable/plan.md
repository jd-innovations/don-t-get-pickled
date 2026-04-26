## Goal
Swap the brand logo asset for the new dark-background version and increase the rendered logo size by 50% across the app.

## Changes

**1. Asset swap** (already copied)
- `src/assets/dgp-logo.png` replaced with the new artwork (white "DON'T GET" + lime "PICKLED", green pickle mascot on transparent/dark background). All existing imports continue to work — no import paths change.

**2. Resize `src/components/BrandLogo.tsx`**
Bump every size by ~50% so the logo reads stronger in headers:
- `sm`: `h-7` → `h-10` (28px → 40px)
- `md`: `h-8` → `h-12` (32px → 48px)  ← used in all 5 app headers
- `lg`: `h-10` → `h-[3.75rem]` (40px → 60px)  ← used on the auth screen

Header containers (`py-4`, ~56px+) accommodate the new `md` (48px) without clipping. The `md` lockup width becomes ~216px wide on a 375px mobile screen, which still leaves room for the right-side avatar/profile button.

## Notes
- No other files need to change — every header already routes through `<BrandLogo />`.
- The new artwork has a transparent/dark background, matching the `#0a0a0a` headers cleanly.
