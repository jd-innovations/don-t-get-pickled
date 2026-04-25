# Add "Neck Side Stretch" Exercise

Add a new exercise entry for **Neck Side Stretch** using the uploaded illustration.

## What's added

### 1. Asset
- Save uploaded image to `src/assets/exercises/neck-side-stretch.png`.

### 2. Data wiring (`src/data/exercises.ts`)
- Add `import neckSideStretchImage from "@/assets/exercises/neck-side-stretch.png";`
- Append a new exercise entry as #15 in the Mobility phase.

Proposed entry:
```ts
{
  id: "neck-side-stretch",
  number: 15,
  name: "Neck Side Stretch",
  muscles: "Neck · Upper Traps · Shoulders",
  dose: "2×15s Each Side",
  phase: "Mobility",
  shortBenefit: "Loosen up, stay focused, play better",
  steps: [
    "Sit tall with back straight and shoulders relaxed.",
    "Use one hand to gently guide your head toward that shoulder.",
    "Hold ~15 seconds, breathing deep and letting tension release.",
    "Return to center and switch sides. Repeat for 2 holds each side.",
  ],
  tip: "Releases the neck and upper-trap tension that builds up from screen time and tracking the ball — better mobility, sharper focus, smoother turns on court.",
  image: neckSideStretchImage,
}
```

Note: `neck-side-stretch` is already mapped in `personalize.ts` ("Neck" injury, "Injury Prevention" + "Recovery Speed" goals), so badges will automatically light up.

## Files Touched
- `src/assets/exercises/neck-side-stretch.png` — new image (copied from upload).
- `src/data/exercises.ts` — new import + new exercise entry.

## Out of scope
- Reordering or renumbering existing exercises.
- Changes to `personalize.ts` (already mapped).
