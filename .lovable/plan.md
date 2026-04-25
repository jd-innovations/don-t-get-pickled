# Add "Wrist Prayer Stretch" Exercise

Add a new exercise entry for **Wrist Prayer Stretch** using the uploaded illustration, following the existing pattern.

## What's added

### 1. Asset
- Save uploaded image to `src/assets/exercises/wrist-prayer-stretch.png`.

### 2. Data wiring (`src/data/exercises.ts`)
- Add `import wristPrayerStretchImage from "@/assets/exercises/wrist-prayer-stretch.png";`
- Append a new exercise entry as #11 in the Mobility phase.

Proposed entry:
```ts
{
  id: "wrist-prayer",
  number: 11,
  name: "Wrist Prayer Stretch",
  muscles: "Wrists · Forearms · Elbow Tendons",
  dose: "3×15s Holds",
  phase: "Mobility",
  shortBenefit: "The final defense against pickleball elbow",
  steps: [
    "Press your palms together at chest height, elbows bent and out wide.",
    "Gently lower your hands toward your lap, keeping palms pressed together.",
    "Feel the stretch through your wrists and forearms. Hold ~15 seconds.",
    "Breathe deep, release, and repeat for 3 holds.",
  ],
  tip: "Lengthens the forearm flexors that grip the paddle all game — your final defense against pickleball elbow and wrist strain.",
  image: wristPrayerStretchImage,
}
```

Note: `wrist-prayer` is already mapped in `personalize.ts` under "Recovery Speed" goal, so the focus badge will automatically light up.

## Files Touched
- `src/assets/exercises/wrist-prayer-stretch.png` — new image (copied from upload).
- `src/data/exercises.ts` — new import + new exercise entry.

## Out of scope
- Reordering existing exercises or renumbering 1–10.
- Changes to `personalize.ts` (already mapped).
