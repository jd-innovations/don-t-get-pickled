# Add "Ankle Circles" Exercise

Add a new exercise entry for **Ankle Circles** using the uploaded illustration.

## What's added

### 1. Asset
- Save uploaded image to `src/assets/exercises/ankle-circles.png`.

### 2. Data wiring (`src/data/exercises.ts`)
- Add `import ankleCirclesImage from "@/assets/exercises/ankle-circles.png";`
- Append a new exercise entry as #12 in the Warm-Up phase.

Proposed entry:
```ts
{
  id: "ankle-circles",
  number: 12,
  name: "Ankle Circles",
  muscles: "Ankles · Calves · Achilles",
  dose: "10 Each Direction",
  phase: "Warm-Up",
  shortBenefit: "Mobile ankles, quicker you",
  steps: [
    "Lift one foot slightly off the ground and extend your leg.",
    "Rotate your ankle in a smooth circle — keep your knee steady.",
    "After 10 circles, reverse the direction for 10 more.",
    "Switch to the other foot and repeat. Keep movements controlled and consistent.",
  ],
  tip: "Mobile ankles support better footwork, reduce sprain risk, and keep you light on your feet for quick lateral moves.",
  image: ankleCirclesImage,
}
```

Note: `ankle-circles` is already mapped in `personalize.ts` ("Ankle/Achilles" injury + "Injury Prevention" goal), so badges will automatically light up.

## Files Touched
- `src/assets/exercises/ankle-circles.png` — new image (copied from upload).
- `src/data/exercises.ts` — new import + new exercise entry.

## Out of scope
- Reordering or renumbering existing exercises.
- Changes to `personalize.ts` (already mapped).
