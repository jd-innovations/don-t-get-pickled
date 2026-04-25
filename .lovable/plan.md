# Add "Paddle-Swing Simulation" Exercise

Add a new exercise entry for **Paddle-Swing Simulation** using the uploaded illustration.

## What's added

### 1. Asset
- Save uploaded image to `src/assets/exercises/paddle-swing-simulation.png`.

### 2. Data wiring (`src/data/exercises.ts`)
- Add `import paddleSwingImage from "@/assets/exercises/paddle-swing-simulation.png";`
- Append a new exercise entry as #13 in the Mobility phase.

Proposed entry:
```ts
{
  id: "paddle-swing",
  number: 13,
  name: "Paddle-Swing Simulation",
  muscles: "Shoulders · Core · Forearms",
  dose: "10 Each Side",
  phase: "Mobility",
  shortBenefit: "Practice the swing, perfect the game",
  steps: [
    "Sit tall with core engaged — feet flat, chest up, shoulders back.",
    "Rotate your torso and draw the paddle (or hand) back as if loading a shot.",
    "Swing forward smoothly, rotating through your core. Keep movement controlled.",
    "Return to ready position. Repeat on both sides to build rhythm and timing.",
  ],
  tip: "Grooves the exact swing pattern your shoulders, core, and hands need on court — better mechanics, better control, fewer injuries.",
  image: paddleSwingImage,
}
```

Note: `paddle-swing` is already mapped in `personalize.ts` under "Shot Power" goal, so the focus badge will automatically light up.

## Files Touched
- `src/assets/exercises/paddle-swing-simulation.png` — new image (copied from upload).
- `src/data/exercises.ts` — new import + new exercise entry.

## Out of scope
- Reordering or renumbering existing exercises.
- Changes to `personalize.ts` (already mapped).
