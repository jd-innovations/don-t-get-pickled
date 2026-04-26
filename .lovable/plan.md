## Goal
Replace the text-based "DON'T GET PICKLED" wordmark in every header with the uploaded logo image (pickle mascot + "DON'T GET PICKLED / WARM UP APP" lockup), sized to fit the existing ~56px-tall header bars consistently.

## Where the logo appears
Six routes render the wordmark in their sticky header:
- `src/routes/index.tsx` (landing) — `font-display text-xl`
- `src/routes/dashboard.tsx` — `font-display text-lg`
- `src/routes/_authenticated/profile.tsx` — `font-display text-lg`
- `src/routes/_authenticated/schedule.tsx` — `font-display text-lg`
- `src/routes/onboarding.tsx` — `font-display text-lg`
- `src/routes/auth.tsx` — centered link, `font-display text-lg`

## Changes

**1. Add the asset**
- Copy `user-uploads://dontgetpickled.png` → `src/assets/dgp-logo.png`.
- Create a small reusable `src/components/BrandLogo.tsx` that imports the asset and renders `<img>` with consistent sizing (`h-8 w-auto` ≈ 32px tall, fits the existing 56px headers with breathing room) and `alt="Don't Get Pickled — Warm Up App"`.
- Accept an optional `className` prop and an optional `size` prop (`sm` = h-7, `md` = h-8 default, `lg` = h-10) for the centered auth screen.

**2. Wire into all 6 headers**
- Replace each `<span class="font-display ...">DON'T GET PICKLED</span>` with `<BrandLogo />` (or `<BrandLogo size="lg" />` on the auth page where it's the only hero element).
- Keep the surrounding header containers unchanged; the image's aspect ratio (~4.5:1) means an `h-8` logo is ~144px wide, which fits comfortably with the right-side actions in the 375px mobile viewport.

## Notes
- The image already contains the wordmark, so no accompanying text is needed.
- Header heights (`py-4`) stay the same — no layout shift.
- The logo is a PNG with a white-ish background mascot; on the dark `#0a0a0a` headers it shows as intended (transparent background per the upload preview).
