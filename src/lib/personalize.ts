// Personalization logic — dose adjustments + injury/goal -> exercise mappings.

export type FitnessLevel = "Beginner" | "Moderate" | "Active" | "Athlete" | string;

const ACTIVE_PUSH_IDS = new Set(["seated-knee-extensions", "heel-raises"]);

/**
 * Adjusts the displayed dose string for a given exercise based on fitness level.
 * - Beginner: scale leading numbers by 0.7 + "Take it easy"
 * - Moderate: unchanged
 * - Active: append "Push it" on key strength exercises
 * - Athlete: append "Challenge variation" on every card
 */
export function personalizeDose(
  dose: string,
  fitnessLevel: FitnessLevel | null,
  exerciseId: string,
): string {
  if (!fitnessLevel) return dose;

  switch (fitnessLevel) {
    case "Beginner": {
      const scaled = dose.replace(/\d+/g, (m) => String(Math.max(1, Math.round(parseInt(m, 10) * 0.7))));
      return `${scaled} · Take it easy`;
    }
    case "Active":
      return ACTIVE_PUSH_IDS.has(exerciseId) ? `${dose} · Push it` : dose;
    case "Athlete":
      return `${dose} · Challenge variation`;
    case "Moderate":
    default:
      return dose;
  }
}

// Injury label (from onboarding) -> exercise ids that should get a PRIORITY badge.
export const INJURY_TO_EXERCISES: Record<string, string[]> = {
  "Elbow/Wrist": ["wrist-circles"],
  Shoulder: ["arm-circles", "shoulder-rolls"],
  "Lower Back": ["pelvic-tilts", "hip-circles"],
  Hip: ["figure-four", "hip-circles"],
  Knee: ["seated-knee-extensions"],
  "Ankle/Achilles": ["ankle-circles", "heel-raises"],
  Neck: ["neck-side-stretch"],
  Hamstring: ["hamstring-reach"],
};

// Goal label -> exercise ids that should get a FOCUS badge.
export const GOAL_TO_EXERCISES: Record<string, string[]> = {
  "Mobility & Flexibility": ["hip-circles", "figure-four", "torso-twist", "hamstring-reach"],
  "Shoulder Health": ["arm-circles", "shoulder-rolls", "reach-back-opener"],
  "Injury Prevention": ["wrist-circles", "pelvic-tilts", "ankle-circles", "neck-side-stretch"],
  "Leg Power": ["chair-stand", "seated-knee-extensions", "heel-raises"],
  "Core Strength": ["torso-twist", "pelvic-tilts", "seated-balance-hold"],
  "Balance & Stability": ["seated-balance-hold", "chair-stand", "seated-march"],
  "Shot Power": ["paddle-swing", "torso-twist", "arm-circles"],
  Endurance: ["seated-march", "chair-stand", "heel-raises"],
  "Endurance on Court": ["seated-march", "chair-stand", "heel-raises"],
  "Recovery Speed": ["hamstring-reach", "neck-side-stretch", "wrist-prayer", "figure-four"],
  "Overall Fitness": [],
};

export function getPriorityFor(exerciseId: string, injuries: string[]): boolean {
  return injuries.some((inj) => INJURY_TO_EXERCISES[inj]?.includes(exerciseId));
}

export function getFocusFor(exerciseId: string, goals: string[]): boolean {
  return goals.some((goal) => GOAL_TO_EXERCISES[goal]?.includes(exerciseId));
}

// Number of active warm-up days per week.
export function activeDaysFromFrequency(frequency: string | null): number {
  switch (frequency) {
    case "Once a Week":
      return 2;
    case "2–3 Times a Week":
      return 3;
    case "4–5 Times a Week":
      return 5;
    case "Daily / Competing":
      return 6;
    default:
      return 0;
  }
}

/**
 * Returns boolean[7] (Mon..Sun) marking which days are active.
 * Active days are spaced as evenly as possible starting Monday.
 */
export function activeDayMask(frequency: string | null): boolean[] {
  const count = activeDaysFromFrequency(frequency);
  const mask = new Array(7).fill(false) as boolean[];
  if (count <= 0) return mask;
  if (count >= 7) return mask.map(() => true);
  // Even spacing
  for (let i = 0; i < count; i++) {
    const idx = Math.round((i * 7) / count) % 7;
    mask[idx] = true;
  }
  // Ensure exactly `count` true (rounding can collide); fill from start if short
  let actual = mask.filter(Boolean).length;
  for (let i = 0; i < 7 && actual < count; i++) {
    if (!mask[i]) {
      mask[i] = true;
      actual++;
    }
  }
  return mask;
}
