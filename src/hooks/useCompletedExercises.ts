import { useCallback, useEffect, useState } from "react";

const todayKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `dgp:completed:${y}-${m}-${day}`;
};

export function useCompletedExercises() {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(todayKey());
      if (raw) setCompleted(new Set(JSON.parse(raw) as string[]));
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((next: Set<string>) => {
    try {
      window.localStorage.setItem(todayKey(), JSON.stringify(Array.from(next)));
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(
    (id: string) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const isComplete = useCallback((id: string) => completed.has(id), [completed]);

  const reset = useCallback(() => {
    setCompleted(new Set());
    try {
      window.localStorage.removeItem(todayKey());
    } catch {
      // ignore
    }
  }, []);

  return { completed, isComplete, toggle, reset };
}
