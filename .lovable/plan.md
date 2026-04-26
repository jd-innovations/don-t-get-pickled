# Increase Brand Logo Size by 25%

Scale every `BrandLogo` size variant up by 25% in `src/components/BrandLogo.tsx`. No other files need changing — every usage already goes through this component, so headers across the app pick up the new size automatically.

## Change

| Variant | Current | New (×1.25) |
|---------|---------|-------------|
| `sm`    | 40px (`h-10`)            | 50px (`h-[3.125rem]`)   |
| `md`    | 48px (`h-12`)            | 60px (`h-[3.75rem]`)    |
| `lg`    | 60px (`h-[3.75rem]`)     | 75px (`h-[4.6875rem]`)  |

Update `sizeMap` in `src/components/BrandLogo.tsx` accordingly. Width stays `w-auto` so aspect ratio is preserved.

## Verification

- Dashboard, profile, schedule, onboarding headers: logo visibly larger, header still aligned.
- Auth page (`lg` variant): logo larger but card still fits within mobile viewport.
