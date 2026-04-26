import { Flame, Activity, Clock, Repeat } from "lucide-react";
import { formatDuration } from "@/hooks/useSessionStats";

interface DayBucket {
  date: string;
  label: string;
  exercises: number;
  sessions: number;
}

interface Totals {
  sessionsCount: number;
  exercisesDone: number;
  totalReps: number;
  totalHoldSec: number;
  totalDurationSec: number;
}

interface Props {
  streak: number;
  allTime: Totals;
  weekBuckets: DayBucket[];
}

export function StatsPanel({ streak, allTime, weekBuckets }: Props) {
  const maxEx = Math.max(1, ...weekBuckets.map((b) => b.exercises));
  const totalMin = Math.round(allTime.totalDurationSec / 60);

  return (
    <section
      className="rounded-2xl border border-[#1e1e1e] bg-[#111111] p-5 anim-fade-in-up"
      style={{ animationDelay: "120ms" }}
    >
      <p className="text-[10px] uppercase tracking-widest text-[#C8F135] mb-3">
        Stats &amp; Progress
      </p>

      {/* Streak */}
      <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-[#1a1f0a] to-[#0a0a0a] border border-[#C8F135]/20 p-4">
        <div className="w-12 h-12 rounded-full bg-[#C8F135]/15 flex items-center justify-center anim-pulse-soft">
          <Flame className="w-6 h-6 text-[#C8F135]" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400">
            Current streak
          </p>
          <p className="font-display text-3xl tracking-wide text-white leading-none">
            {streak} {streak === 1 ? "DAY" : "DAYS"}
          </p>
        </div>
      </div>

      {/* Totals */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat
          icon={<Activity className="w-4 h-4" />}
          label="Sessions"
          value={String(allTime.sessionsCount)}
        />
        <Stat
          icon={<Clock className="w-4 h-4" />}
          label="Total time"
          value={totalMin >= 1 ? `${totalMin}m` : formatDuration(allTime.totalDurationSec)}
        />
        <Stat
          icon={<Repeat className="w-4 h-4" />}
          label="Reps"
          value={String(allTime.totalReps)}
        />
        <Stat
          icon={<Clock className="w-4 h-4" />}
          label="Hold time"
          value={formatDuration(allTime.totalHoldSec)}
        />
      </div>

      {/* Weekly chart */}
      <div className="mt-5">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3">
          Last 7 days
        </p>
        <div className="flex items-end justify-between gap-1 h-24">
          {weekBuckets.map((b, i) => {
            const h = (b.exercises / maxEx) * 100;
            const active = b.exercises > 0;
            return (
              <div
                key={b.date}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <div className="flex-1 w-full flex items-end">
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${Math.max(h, active ? 8 : 2)}%`,
                      backgroundColor: active ? "#C8F135" : "#1e1e1e",
                      animation: `dgp-grow-up 0.4s var(--ease-soft) ${i * 40}ms both`,
                      transformOrigin: "bottom",
                    }}
                  />
                </div>
                <span className="text-[10px] text-neutral-500">{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#1e1e1e] bg-[#0a0a0a] p-3">
      <div className="flex items-center gap-1.5 text-neutral-400">
        {icon}
        <span className="text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <p className="mt-1 font-display text-xl tracking-wide text-white">
        {value}
      </p>
    </div>
  );
}
