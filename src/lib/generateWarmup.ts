import { exercises, type Exercise, type Phase } from "@/data/exercises";
import type { UserProfile } from "@/contexts/UserProfileContext";
import type { SessionRecord } from "@/hooks/useSessionStats";
import { GOAL_TO_EXERCISES, INJURY_TO_EXERCISES } from "@/lib/personalize";

export type FocusTag =
  | "Shoulders"
  | "Hips"
  | "Legs"
  | "Full Body"
  | "Recovery"
  | "Power";

export const FOCUS_TAGS: FocusTag[] = [
  "Shoulders",
  "Hips",
  "Legs",
  "Full Body",
  "Recovery",
  "Power",
];

// Curated exercise sets per focus tag (reuses ids from exercises.ts).
const FOCUS_TO_EXERCISES: Record<FocusTag, string[]> = {
  Shoulders: [
    "arm-circles",
    "shoulder-rolls",
    "reach-back-opener",
    "paddle-swing",
    "neck-side-stretch",
  ],
  Hips: [
    "hip-circles",
    "figure-four",
    "torso-twist",
    "pelvic-tilts",
    "hamstring-reach",
  ],
  Legs: [
    "chair-stand",
    "heel-raises",
    "seated-knee-extensions",
    "seated-march",
    "ankle-circles",
  ],
  "Full Body": [], // neutral — relies on balance + freshness
  Recovery: [
    "neck-side-stretch",
    "wrist-prayer",
    "hamstring-reach",
    "figure-four",
    "shoulder-rolls",
    "pelvic-tilts",
  ],
  Power: [
    "chair-stand",
    "paddle-swing",
    "torso-twist",
    "heel-raises",
    "seated-knee-extensions",
  ],
};

const TARGET_PER_PHASE: Record<Phase, number> = {
  "Warm-Up": 2,
  Mobility: 2,
  Strength: 2,
};
const TOTAL = 6;

export interface ScoredPick {
  exercise: Exercise;
  score: number;
  reasons: string[];
}

interface GenerateInput {
  profile: UserProfile;
  focus: FocusTag;
  recentSessions: SessionRecord[];
  seed?: number;
  size?: number;
}

function scoreExercise(
  ex: Exercise,
  { profile, focus, recentSessions, seed = 0 }: GenerateInput,
): ScoredPick {
  let score = 0;
  const reasons: string[] = [];

  // Focus match (+5)
  if (FOCUS_TO_EXERCISES[focus]?.includes(ex.id)) {
    score += 5;
    reasons.push(`Focus: ${focus}`);
  }

  // Injury priority (+3)
  for (const injury of profile.injuries) {
    if (INJURY_TO_EXERCISES[injury]?.includes(ex.id)) {
      score += 3;
      reasons.push(`Protects ${injury}`);
      break;
    }
  }

  // Goals (+2)
  for (const goal of profile.goals) {
    if (GOAL_TO_EXERCISES[goal]?.includes(ex.id)) {
      score += 2;
      reasons.push(`Goal: ${goal}`);
      break;
    }
  }

  // Freshness penalty: count appearances in last 5 sessions
  const recent = recentSessions.slice(-5);
  const appearances = recent.reduce(
    (n, r) => n + (r.exerciseIds.includes(ex.id) ? 1 : 0),
    0,
  );
  if (appearances > 0) {
    score -= appearances;
    reasons.push(`Recent (${appearances}×) — rotated down`);
  }

  // Jitter for regenerate variety (deterministic per seed+id)
  const jitter = pseudoRandom(`${seed}:${ex.id}`) * 0.9;
  score += jitter;

  return { exercise: ex, score, reasons };
}

function pseudoRandom(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

export interface WarmupPlan {
  focus: FocusTag;
  picks: ScoredPick[]; // ordered by phase
  generatedAt: number;
}

export function generateWarmupPlan(input: GenerateInput): WarmupPlan {
  const scored = exercises.map((ex) => scoreExercise(ex, input));

  const byPhase: Record<Phase, ScoredPick[]> = {
    "Warm-Up": [],
    Mobility: [],
    Strength: [],
  };
  for (const s of scored) byPhase[s.exercise.phase].push(s);
  for (const phase of Object.keys(byPhase) as Phase[]) {
    byPhase[phase].sort((a, b) => b.score - a.score);
  }

  const picks: ScoredPick[] = [];
  const used = new Set<string>();

  // Take target per phase
  for (const phase of ["Warm-Up", "Mobility", "Strength"] as Phase[]) {
    const want = TARGET_PER_PHASE[phase];
    for (const s of byPhase[phase]) {
      if (picks.filter((p) => p.exercise.phase === phase).length >= want) break;
      picks.push(s);
      used.add(s.exercise.id);
    }
  }

  // Fill any shortfall (e.g. if a phase is short) from overall top scores
  if (picks.length < TOTAL) {
    const rest = scored
      .filter((s) => !used.has(s.exercise.id))
      .sort((a, b) => b.score - a.score);
    for (const s of rest) {
      if (picks.length >= TOTAL) break;
      picks.push(s);
      used.add(s.exercise.id);
    }
  }

  // Trim if somehow over (shouldn't happen but safe)
  picks.length = Math.min(picks.length, TOTAL);

  // Order by phase progression: Warm-Up → Mobility → Strength
  const phaseOrder: Record<Phase, number> = {
    "Warm-Up": 0,
    Mobility: 1,
    Strength: 2,
  };
  picks.sort(
    (a, b) => phaseOrder[a.exercise.phase] - phaseOrder[b.exercise.phase],
  );

  return {
    focus: input.focus,
    picks,
    generatedAt: Date.now(),
  };
}
