import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { exercises, phaseColor, type Phase } from "@/data/exercises";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useSessionStats,
  formatDuration,
  type SessionRecord,
  type Totals,
} from "@/hooks/useSessionStats";

interface Props {
  open: boolean;
  onClose: () => void;
  completed: Set<string>;
  onToggle: (id: string) => void;
  onReset: () => void;
  recap?: SessionRecord | null;
  onClearRecap?: () => void;
}

const phases: Phase[] = ["Warm-Up", "Mobility", "Strength"];

export function SessionSummary({
  open,
  onClose,
  completed,
  onToggle,
  onReset,
  recap,
  onClearRecap,
}: Props) {
  const stats = useSessionStats();
  const [tab, setTab] = useState<string>("today");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open && recap) setTab("today");
  }, [open, recap]);

  if (!open) return null;

  const total = exercises.length;
  const doneCount = exercises.reduce((n, e) => (completed.has(e.id) ? n + 1 : n), 0);
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] text-white overflow-y-auto animate-in fade-in duration-200">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1e1e1e]">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            aria-label="Close summary"
            className="w-9 h-9 rounded-full bg-[#1e1e1e] flex items-center justify-center text-neutral-300 hover:text-[#C8F135] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="font-display text-sm tracking-widest text-[#C8F135]">SESSION</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 pb-12">
        {/* Headline */}
        <section className="pt-6 pb-4 anim-fade-in-up" style={{ animationDelay: "40ms" }}>
          <h1 className="font-display text-4xl leading-none tracking-wide">YOUR PROGRESS</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Track today, this week, and lifetime totals.
          </p>
        </section>

        {/* Recap banner */}
        {recap && (
          <div className="mb-5 rounded-2xl border border-[#C8F135]/40 bg-[#C8F135]/5 p-4 relative">
            <button
              onClick={onClearRecap}
              aria-label="Dismiss recap"
              className="absolute top-2 right-2 w-7 h-7 rounded-full hover:bg-[#1e1e1e] flex items-center justify-center text-neutral-400 hover:text-[#C8F135] transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] uppercase tracking-widest text-[#C8F135] font-semibold">
              Just completed 🎉
            </p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              <RecapStat label="Time" value={formatDuration(recap.durationSec)} />
              <RecapStat label="Done" value={String(recap.exerciseIds.length)} />
              <RecapStat label="Reps" value={String(recap.totalReps)} />
              <RecapStat label="Hold" value={formatDuration(recap.totalHoldSec)} />
            </div>
          </div>
        )}

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#111111] border border-[#1e1e1e] h-10">
            <TabsTrigger
              value="today"
              className="data-[state=active]:bg-[#C8F135] data-[state=active]:text-black text-neutral-300 font-display tracking-wider text-xs"
            >
              TODAY
            </TabsTrigger>
            <TabsTrigger
              value="week"
              className="data-[state=active]:bg-[#C8F135] data-[state=active]:text-black text-neutral-300 font-display tracking-wider text-xs"
            >
              WEEK
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-[#C8F135] data-[state=active]:text-black text-neutral-300 font-display tracking-wider text-xs"
            >
              ALL TIME
            </TabsTrigger>
          </TabsList>

          {/* TODAY */}
          <TabsContent value="today" className="mt-4">
            <StatStrip totals={stats.today} />

            {/* Today's checklist */}
            <section className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-widest text-neutral-400">
                  Today's Session
                </p>
                <p className="text-xs text-neutral-300 font-medium">
                  <span className="text-white font-semibold">{doneCount}</span> of {total} ·{" "}
                  <span className="text-[#C8F135] font-semibold">{pct}%</span>
                </p>
              </div>
              <div className="h-2 w-full bg-[#111111] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C8F135] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </section>

            {phases.map((phase) => {
              const items = exercises.filter((e) => e.phase === phase);
              const phaseDone = items.reduce((n, e) => (completed.has(e.id) ? n + 1 : n), 0);
              const color = phaseColor(phase);
              return (
                <section key={phase} className="mt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="font-display text-lg tracking-wider whitespace-nowrap"
                      style={{ color }}
                    >
                      {phase.toUpperCase()} — {phaseDone}/{items.length}
                    </span>
                    <div
                      className="flex-1 h-[2px] rounded-full"
                      style={{ backgroundColor: color, opacity: 0.5 }}
                    />
                  </div>
                  <ul className="space-y-2">
                    {items.map((ex) => {
                      const done = completed.has(ex.id);
                      return (
                        <li key={ex.id}>
                          <button
                            onClick={() => onToggle(ex.id)}
                            className="w-full flex items-center gap-3 rounded-xl border border-[#1e1e1e] bg-[#111111] hover:border-[#C8F135]/40 transition-colors px-4 py-3 text-left"
                          >
                            <span
                              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                              style={{
                                backgroundColor: done ? "#C8F135" : "transparent",
                                border: done ? "none" : "2px solid #2a2a2a",
                              }}
                              aria-hidden
                            >
                              {done && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                            </span>
                            <span
                              className="font-display text-base w-6 text-center"
                              style={{ color }}
                            >
                              {ex.number}
                            </span>
                            <span
                              className={`text-sm flex-1 ${
                                done ? "text-neutral-500 line-through" : "text-white"
                              }`}
                            >
                              {ex.name}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </TabsContent>

          {/* WEEK */}
          <TabsContent value="week" className="mt-4">
            <StatStrip totals={stats.week} />
            <section className="mt-6 rounded-2xl border border-[#1e1e1e] bg-[#111111] p-5">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-4">
                Last 7 Days
              </p>
              <WeeklyBar buckets={stats.weekBuckets} />
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                    Sessions
                  </p>
                  <p className="font-display text-2xl text-[#C8F135] mt-1">
                    {stats.week.sessionsCount}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                    Active Days
                  </p>
                  <p className="font-display text-2xl text-[#C8F135] mt-1">
                    {stats.weekBuckets.filter((b) => b.sessions > 0).length}
                  </p>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* ALL TIME */}
          <TabsContent value="all" className="mt-4">
            <StatStrip totals={stats.allTime} />
            <section className="mt-6 rounded-2xl border border-[#1e1e1e] bg-[#111111] p-5 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                  Sessions
                </p>
                <p className="font-display text-3xl text-[#C8F135] mt-1">
                  {stats.allTime.sessionsCount}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                  Current Streak
                </p>
                <p className="font-display text-3xl text-[#C8F135] mt-1">
                  {stats.streak}
                  <span className="text-sm text-neutral-500 ml-1">
                    day{stats.streak === 1 ? "" : "s"}
                  </span>
                </p>
              </div>
            </section>
            {stats.allTime.sessionsCount === 0 && (
              <p className="mt-6 text-center text-sm text-neutral-500">
                No sessions logged yet. Start a guided session to begin tracking.
              </p>
            )}
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg font-display text-lg tracking-wider bg-[#C8F135] text-black hover:brightness-110 transition"
          >
            CLOSE
          </button>
          {tab === "today" && doneCount > 0 && (
            <button
              onClick={onReset}
              className="w-full text-xs text-neutral-500 hover:text-[#C8F135] transition-colors underline underline-offset-2"
            >
              Reset today's progress
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function StatStrip({ totals }: { totals: Totals }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard label="Time" value={formatDuration(totals.totalDurationSec)} />
      <StatCard label="Exercises" value={String(totals.exercisesDone)} />
      <StatCard label="Reps" value={String(totals.totalReps)} />
      <StatCard label="Hold Time" value={formatDuration(totals.totalHoldSec)} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#1e1e1e] bg-[#111111] p-4">
      <p className="text-[10px] uppercase tracking-widest text-neutral-500">{label}</p>
      <p className="font-display text-2xl text-[#C8F135] mt-1">{value}</p>
    </div>
  );
}

function RecapStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-widest text-neutral-400">{label}</p>
      <p className="font-display text-base text-white mt-0.5">{value}</p>
    </div>
  );
}

function WeeklyBar({ buckets }: { buckets: { date: string; label: string; exercises: number; sessions: number }[] }) {
  const max = Math.max(1, ...buckets.map((b) => b.exercises));
  return (
    <div className="flex items-end justify-between gap-2 h-28">
      {buckets.map((b, i) => {
        const h = b.exercises === 0 ? 4 : Math.max(8, (b.exercises / max) * 100);
        const active = b.exercises > 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="flex-1 w-full flex items-end">
              <div
                className="w-full rounded-md transition-all"
                style={{
                  height: `${h}%`,
                  backgroundColor: active ? "#C8F135" : "#1e1e1e",
                  minHeight: 4,
                }}
                title={`${b.exercises} exercise${b.exercises === 1 ? "" : "s"}`}
              />
            </div>
            <span className="text-[10px] text-neutral-400 font-medium">{b.label}</span>
          </div>
        );
      })}
    </div>
  );
}
