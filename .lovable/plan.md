## Remove "More Coming Soon" placeholder section

Remove the placeholder grid of 12 empty cards and its `PhaseDivider` from the dashboard. No other functionality changes.

### Change
**File:** `src/routes/dashboard.tsx`

Delete this block (after the Library `.map`):
- `<PhaseDivider phase="Strength" label="MORE COMING SOON" />`
- The `<div className="grid grid-cols-2 gap-3">` containing the 12 placeholder squares

That's the only edit needed.