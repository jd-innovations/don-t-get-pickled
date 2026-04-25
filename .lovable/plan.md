## Add Exercise #18: Pelvic Tilts

Append a new exercise to the library using the uploaded illustration.

### Files
- **New**: `src/assets/exercises/pelvic-tilts.png` (copied from upload)
- **Edit**: `src/data/exercises.ts` — add image import + new entry

### Entry
```ts
{
  id: "pelvic-tilts",
  number: 18,
  name: "Pelvic Tilts",
  muscles: "Core · Lower Back · Hip Flexors",
  dose: "2×10 Reps",
  phase: "Strength",
  shortBenefit: "Strong core. Better game.",
  steps: [
    "Sit tall with feet flat, hands resting on thighs.",
    "Tilt back: gently arch your lower back.",
    "Tilt forward: round your lower back slightly, engaging the core.",
    "Move smoothly between the two — control the tilt, breathe steady.",
  ],
  tip: "Relieves lower back tension and builds the deep core control that powers stable, straight shots and protects your spine on every rotation.",
  image: pelvicTiltsImage,
}
```

No changes needed to `personalize.ts` — the `pelvic-tilts` id is already mapped to Lower Back injury and Core Strength / Injury Prevention goals, so badges will auto-apply.
