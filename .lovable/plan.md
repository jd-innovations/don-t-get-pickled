# Add "Seated Knee Extensions" Exercise

Add a new exercise entry for **Seated Knee Extensions** using the uploaded illustration.

## Note on ID

The existing exercise #5 already uses id `knee-extensions` (now repurposed as the "Seated Hamstring Reach" entry). To avoid collision, this new exercise will use id `seated-knee-extensions`.

## What's added

### 1. Asset
- Save uploaded image to `src/assets/exercises/seated-knee-extensions.png`.

### 2. Data wiring (`src/data/exercises.ts`)
- Add `import seatedKneeExtensionsImage from "@/assets/exercises/seated-knee-extensions.png";`
- Append a new exercise entry as #14 in the Strength phase.

Proposed entry:
```ts
{
  id: "seated-knee-extensions",
  number: 14,
  name: "Seated Knee Extensions",
  muscles: "Quads · Knees · Hip Flexors",
  dose: "3×10 Each Leg",
  phase: "Strength",
  shortBenefit: "Strong quads, quicker steps, better plays",
  steps: [
    "Sit tall with back straight, core engaged, hands on the sides of the chair.",
    "Straighten one leg until fully extended. Squeeze your quad at the top.",
    "Hold for a moment — keep the leg straight and strong.",
    "Lower with control. Repeat with the other leg, keeping it smooth.",
  ],
  tip: "Builds the quad strength that protects your knees and powers every push-off, lunge, and stop on court.",
  image: seatedKneeExtensionsImage,
}
```

## Files Touched
- `src/assets/exercises/seated-knee-extensions.png` — new image (copied from upload).
- `src/data/exercises.ts` — new import + new exercise entry.

## Out of scope
- Renaming/renumbering existing entries.
- Changes to `personalize.ts`.
