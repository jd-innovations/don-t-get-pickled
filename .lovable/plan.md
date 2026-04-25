## Add Exercise #16: Seated Balance Hold

Append a new exercise to the library using the uploaded illustration.

### Files
- **New**: `src/assets/exercises/seated-balance-hold.png` (copied from upload)
- **Edit**: `src/data/exercises.ts` — add image import + new entry

### Entry
```ts
{
  id: "seated-balance-hold",
  number: 16,
  name: "Seated Balance Hold",
  muscles: "Core · Hip Flexors · Stabilizers",
  dose: "3×15s Each Leg",
  phase: "Strength",
  shortBenefit: "Better balance, stronger game",
  steps: [
    "Sit tall with chest up and core tight.",
    "Lift one foot off the ground and find your balance.",
    "Hold the position — breathe and stay in control.",
    "Lower with control and switch legs. Repeat for 3 holds each side.",
  ],
  tip: "Builds the seated core stability that translates to stronger split-steps, lunges, and quick pivots on court.",
  image: seatedBalanceHoldImage,
}
```

No changes needed to `personalize.ts` (no existing mapping for this id; it will simply show without extra badges, consistent with other recent additions).
