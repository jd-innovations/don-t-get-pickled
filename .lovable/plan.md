# Add "Shoulder Rolls" Exercise

Add a new exercise entry for **Shoulder Rolls** using the uploaded illustration, following the exact pattern used by existing exercises.

## What's added

### 1. Asset
- Save uploaded image to `src/assets/exercises/shoulder-rolls.png`.

### 2. Data wiring (`src/data/exercises.ts`)
- Add `import shoulderRollsImage from "@/assets/exercises/shoulder-rolls.png";`
- Insert a new exercise entry with id `shoulder-rolls` (already referenced in `personalize.ts` for Shoulder injury + Shoulder Health goal mappings, so badges will light up automatically).

Proposed entry:
```ts
{
  id: "shoulder-rolls",
  number: 9,
  name: "Shoulder Rolls",
  muscles: "Shoulders · Upper Traps · Neck",
  dose: "10 Each Direction",
  phase: "Warm-Up",
  shortBenefit: "Releases shoulder tension and primes the upper body for a free swing",
  steps: [
    "Sit tall with feet flat, arms hanging relaxed at your sides.",
    "Lift your shoulders up, roll them back, and lower down — 10 slow reps.",
    "Reverse direction: roll forward, up, back, and down for 10 more.",
    "Move smooth and steady, breathing deep to release tension.",
  ],
  tip: "Loose shoulders restore your full swing arc and help prevent the neck and rotator-cuff strain that builds up from grip and screen time.",
  image: shoulderRollsImage,
}
```

### 3. Placement & numbering
- Append as exercise **#9** at the end of the `exercises` array (keeping existing numbering stable for 1–8).

## Files Touched
- `src/assets/exercises/shoulder-rolls.png` — new image (copied from upload).
- `src/data/exercises.ts` — new import + new exercise entry.

## Out of scope
- Reordering existing exercises or renumbering.
- Changes to `personalize.ts` (shoulder-rolls is already mapped there).
- Changes to `SessionSummary`, `GuidedSession`, or stats logic (auto-picks up new exercise).
