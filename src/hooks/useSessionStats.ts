import { useCallback, useEffect, useState } from "react";

export type SessionRecord = {
  date: string; // YYYY-MM-DD (local)
  completedAt: number; // epoch ms
  durationSec: number;
  exerciseIds: string[];
  totalReps: number;
  totalHoldSec: number;
};

const KEY = "dgp:sessions";

export function dateKey(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function readAll(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as SessionRecord[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeAll(arr: SessionRecord[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(arr));
    window.dispatchEvent(new Event("dgp:sessions:changed"));
  } catch {
    // ignore
  }
}

export function addSession(rec: SessionRecord) {
  const all = readAll();
  all.push(rec);
  writeAll(all);
}

export type Totals = {
  sessionsCount: number;
  exercisesDone: number;
  totalReps: number;
  totalHoldSec: number;
  totalDurationSec: number;
};

function aggregate(records: SessionRecord[]): Totals {
  return records.reduce<Totals>(
    (acc, r) => ({
      sessionsCount: acc.sessionsCount + 1,
      exercisesDone: acc.exercisesDone + r.exerciseIds.length,
      totalReps: acc.totalReps + r.totalReps,
      totalHoldSec: acc.totalHoldSec + r.totalHoldSec,
      totalDurationSec: acc.totalDurationSec + r.durationSec,
    }),
    {
      sessionsCount: 0,
      exercisesDone: 0,
      totalReps: 0,
      totalHoldSec: 0,
      totalDurationSec: 0,
    },
  );
}

// Returns last 7 days Mon→Sun ending today (or today's week, locale-agnostic: rolling 7-day window).
export type DayBucket = {
  date: string; // YYYY-MM-DD
  label: string; // single-letter day
  exercises: number;
  sessions: number;
};

function rolling7(records: SessionRecord[]): DayBucket[] {
  const labels = ["S", "M", "T", "W", "T", "F", "S"]; // Sun..Sat
  const buckets: DayBucket[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    const dayRecs = records.filter((r) => r.date === key);
    buckets.push({
      date: key,
      label: labels[d.getDay()],
      exercises: dayRecs.reduce((n, r) => n + r.exerciseIds.length, 0),
      sessions: dayRecs.length,
    });
  }
  return buckets;
}

function computeStreak(records: SessionRecord[]): number {
  if (records.length === 0) return 0;
  const days = new Set(records.map((r) => r.date));
  let streak = 0;
  const cur = new Date();
  // If today has none, allow starting from yesterday
  if (!days.has(dateKey(cur))) {
    cur.setDate(cur.getDate() - 1);
    if (!days.has(dateKey(cur))) return 0;
  }
  while (days.has(dateKey(cur))) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

export function useSessionStats() {
  const [records, setRecords] = useState<SessionRecord[]>([]);

  const refresh = useCallback(() => {
    setRecords(readAll());
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) refresh();
    };
    window.addEventListener("dgp:sessions:changed", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("dgp:sessions:changed", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const today = dateKey();
  const todayRecords = records.filter((r) => r.date === today);
  const last7Keys = new Set(rolling7(records).map((b) => b.date));
  const weekRecords = records.filter((r) => last7Keys.has(r.date));

  return {
    records,
    today: aggregate(todayRecords),
    week: aggregate(weekRecords),
    allTime: aggregate(records),
    weekBuckets: rolling7(records),
    streak: computeStreak(records),
    refresh,
  };
}

export function formatDuration(sec: number): string {
  if (sec < 60) return `${Math.round(sec)}s`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  if (m < 60) return s ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return mm ? `${h}h ${mm}m` : `${h}h`;
}
