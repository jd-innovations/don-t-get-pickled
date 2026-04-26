import type { UserProfile } from "@/contexts/UserProfileContext";
import type { SessionRecord } from "@/hooks/useSessionStats";
import {
  generateWarmupPlan,
  type FocusTag,
  type WarmupPlan,
} from "@/lib/generateWarmup";

export interface Preset {
  id: string;
  name: string;
  blurb: string;
  focus: FocusTag;
  size: number;
  durationMin: number;
}

export const PRESETS: Preset[] = [
  {
    id: "quick-reset",
    name: "Quick Reset",
    blurb: "Light mobility for busy days.",
    focus: "Recovery",
    size: 4,
    durationMin: 3,
  },
  {
    id: "full-tuneup",
    name: "Full Tune-Up",
    blurb: "Balanced full-body warm-up.",
    focus: "Full Body",
    size: 6,
    durationMin: 6,
  },
  {
    id: "power-prep",
    name: "Power Prep",
    blurb: "Prime your engine for competitive play.",
    focus: "Power",
    size: 6,
    durationMin: 7,
  },
  {
    id: "recovery-flow",
    name: "Recovery Flow",
    blurb: "Gentle release for sore or post-play days.",
    focus: "Recovery",
    size: 5,
    durationMin: 5,
  },
];

export function buildPresetPlan(
  preset: Preset,
  profile: UserProfile,
  recentSessions: SessionRecord[],
): WarmupPlan {
  // Use a stable seed per preset so the same user sees the same plan across renders.
  const seed = hashString(preset.id);
  return generateWarmupPlan({
    profile,
    focus: preset.focus,
    recentSessions,
    seed,
    size: preset.size,
  });
}

/**
 * Pick today's preset deterministically based on the date and play frequency.
 * Weekends → Full Tune-Up, mid-week competitive days → Power Prep,
 * Monday/Friday → Quick Reset, rest days → Recovery Flow.
 */
export function pickTodaysPreset(date: Date = new Date()): Preset {
  const day = date.getDay(); // 0 = Sun, 6 = Sat
  let id: string;
  if (day === 0 || day === 6) id = "full-tuneup";
  else if (day === 2 || day === 4) id = "power-prep";
  else if (day === 1 || day === 5) id = "quick-reset";
  else id = "recovery-flow";
  return PRESETS.find((p) => p.id === id) ?? PRESETS[1];
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
