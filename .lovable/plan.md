## Goal

Add the Pickleball Grip Doctor logo to the **Welcome Gift** card on the onboarding success screen, sized at ~60% of the landing page logo, and link it to https://pickleballgripdoctor.com/.

## Changes

### `src/routes/onboarding.tsx`
- Import the existing `pgdLogo` asset (`@/assets/pgd-logo.png`) — already used on the landing page.
- Inside the Welcome Gift card (the `mt-8 rounded-xl border-[#C8F135]/40` block), add the PGD logo at the top wrapped in an external link to `https://pickleballgripdoctor.com/` (`target="_blank"`, `rel="noopener noreferrer"`).
- Logo sizing: landing uses `max-h-20` (80px). 60% → `max-h-12` (~48px), `w-auto` to preserve aspect ratio.
- Add a small "Shop now at pickleballgripdoctor.com →" text link at the bottom of the card so the discount code clearly leads back to the store.

## Technical Notes

- No new dependencies, no DB or route changes. Single-file edit.
- Logo asset already exists at `src/assets/pgd-logo.png`.

## Files Edited

- `src/routes/onboarding.tsx`
