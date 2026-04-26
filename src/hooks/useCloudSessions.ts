import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  dateKey,
  formatDuration,
  type SessionRecord,
} from "@/hooks/useSessionStats";

const MIGRATION_KEY = "dgp:sessions:migrated";

interface DbSession {
  id: string;
  date: string;
  completed_at: string;
  duration_sec: number;
  exercise_ids: string[];
  total_reps: number;
  total_hold_sec: number;
}

function dbToRecord(r: DbSession): SessionRecord {
  return {
    date: r.date,
    completedAt: new Date(r.completed_at).getTime(),
    durationSec: r.duration_sec,
    exerciseIds: r.exercise_ids,
    totalReps: r.total_reps,
    totalHoldSec: r.total_hold_sec,
  };
}

function aggregate(records: SessionRecord[]) {
  return records.reduce(
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

function rolling7(records: SessionRecord[]) {
  const labels = ["S", "M", "T", "W", "T", "F", "S"];
  const buckets = [];
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
  const cur = new Date();
  if (!days.has(dateKey(cur))) {
    cur.setDate(cur.getDate() - 1);
    if (!days.has(dateKey(cur))) return 0;
  }
  let streak = 0;
  while (days.has(dateKey(cur))) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

export function useCloudSessions() {
  const { user } = useAuth();
  const [records, setRecords] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrated, setMigrated] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });
    if (!error && data) {
      setRecords(data.map(dbToRecord));
    }
    setLoading(false);
  }, [user]);

  // One-time migration of localStorage sessions
  useEffect(() => {
    if (!user) return;
    if (typeof window === "undefined") return;
    const flagKey = `${MIGRATION_KEY}:${user.id}`;
    if (window.localStorage.getItem(flagKey)) {
      refresh();
      return;
    }
    (async () => {
      try {
        const raw = window.localStorage.getItem("dgp:sessions");
        const arr = raw ? (JSON.parse(raw) as SessionRecord[]) : [];
        if (Array.isArray(arr) && arr.length > 0) {
          const { count } = await supabase
            .from("sessions")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id);
          if ((count ?? 0) === 0) {
            const rows = arr.map((r) => ({
              user_id: user.id,
              date: r.date,
              completed_at: new Date(r.completedAt).toISOString(),
              duration_sec: r.durationSec,
              exercise_ids: r.exerciseIds,
              total_reps: r.totalReps,
              total_hold_sec: r.totalHoldSec,
            }));
            const { error } = await supabase.from("sessions").insert(rows);
            if (!error) setMigrated(rows.length);
          }
        }
      } catch {
        // ignore
      }
      window.localStorage.setItem(flagKey, "1");
      await refresh();
    })();
  }, [user, refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    records,
    loading,
    migrated,
    today: aggregate(records.filter((r) => r.date === dateKey())),
    allTime: aggregate(records),
    weekBuckets: rolling7(records),
    streak: computeStreak(records),
    refresh,
  };
}

export { formatDuration };

/** Insert a session for the authenticated user. No-op if signed out. */
export async function insertCloudSession(
  userId: string,
  rec: SessionRecord,
): Promise<void> {
  await supabase.from("sessions").insert({
    user_id: userId,
    date: rec.date,
    completed_at: new Date(rec.completedAt).toISOString(),
    duration_sec: rec.durationSec,
    exercise_ids: rec.exerciseIds,
    total_reps: rec.totalReps,
    total_hold_sec: rec.totalHoldSec,
  });
}
