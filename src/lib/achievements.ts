import { Flame, Trophy, Star, Award, Target, Zap, Crown, Medal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { exercises } from "@/data/exercises";
import type { SessionRecord } from "@/hooks/useSessionStats";

export interface Achievement {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  unlocked: boolean;
  progress: number; // 0..1
  progressText: string;
  unlockedAt?: number;
}

function streakFromRecords(records: SessionRecord[]): number {
  if (records.length === 0) return 0;
  const days = new Set(records.map((r) => r.date));
  const today = new Date();
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  let streak = 0;
  const cur = new Date(today);
  if (!days.has(fmt(cur))) {
    cur.setDate(cur.getDate() - 1);
    if (!days.has(fmt(cur))) return 0;
  }
  while (days.has(fmt(cur))) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

export function deriveAchievements(records: SessionRecord[]): Achievement[] {
  const sessionsCount = records.length;
  const streak = streakFromRecords(records);
  const phaseMap = new Map(exercises.map((e) => [e.id, e.phase]));
  const seenPhases = new Set<string>();
  records.forEach((r) =>
    r.exerciseIds.forEach((id) => {
      const p = phaseMap.get(id);
      if (p) seenPhases.add(p);
    }),
  );

  const earliestForCount = (n: number): number | undefined => {
    if (records.length < n) return undefined;
    const sorted = [...records].sort((a, b) => a.completedAt - b.completedAt);
    return sorted[n - 1]?.completedAt;
  };

  const list: Achievement[] = [
    {
      id: "first-session",
      label: "First Session",
      description: "Complete your very first warm-up.",
      icon: Star,
      unlocked: sessionsCount >= 1,
      progress: Math.min(1, sessionsCount / 1),
      progressText: sessionsCount >= 1 ? "Earned" : "0 / 1",
      unlockedAt: earliestForCount(1),
    },
    {
      id: "streak-3",
      label: "3-Day Streak",
      description: "Train 3 days in a row.",
      icon: Flame,
      unlocked: streak >= 3,
      progress: Math.min(1, streak / 3),
      progressText: `${Math.min(streak, 3)} / 3 days`,
    },
    {
      id: "streak-7",
      label: "7-Day Streak",
      description: "A full week of warm-ups.",
      icon: Flame,
      unlocked: streak >= 7,
      progress: Math.min(1, streak / 7),
      progressText: `${Math.min(streak, 7)} / 7 days`,
    },
    {
      id: "streak-30",
      label: "30-Day Streak",
      description: "A month of consistency.",
      icon: Crown,
      unlocked: streak >= 30,
      progress: Math.min(1, streak / 30),
      progressText: `${Math.min(streak, 30)} / 30 days`,
    },
    {
      id: "sessions-10",
      label: "10 Sessions",
      description: "Complete 10 sessions.",
      icon: Medal,
      unlocked: sessionsCount >= 10,
      progress: Math.min(1, sessionsCount / 10),
      progressText: `${Math.min(sessionsCount, 10)} / 10`,
      unlockedAt: earliestForCount(10),
    },
    {
      id: "sessions-50",
      label: "50 Sessions",
      description: "Halfway to a hundred.",
      icon: Award,
      unlocked: sessionsCount >= 50,
      progress: Math.min(1, sessionsCount / 50),
      progressText: `${Math.min(sessionsCount, 50)} / 50`,
      unlockedAt: earliestForCount(50),
    },
    {
      id: "sessions-100",
      label: "Century",
      description: "100 sessions completed.",
      icon: Trophy,
      unlocked: sessionsCount >= 100,
      progress: Math.min(1, sessionsCount / 100),
      progressText: `${Math.min(sessionsCount, 100)} / 100`,
      unlockedAt: earliestForCount(100),
    },
    {
      id: "all-phases",
      label: "Well-Rounded",
      description: "Try Warm-Up, Mobility, and Strength.",
      icon: Target,
      unlocked: seenPhases.size >= 3,
      progress: Math.min(1, seenPhases.size / 3),
      progressText: `${Math.min(seenPhases.size, 3)} / 3 phases`,
    },
  ];

  return list;
}

export const _streakFromRecords = streakFromRecords;
export { Zap }; // re-export for convenience
