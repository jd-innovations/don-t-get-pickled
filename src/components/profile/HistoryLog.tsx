import { useMemo, useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import { exercises } from "@/data/exercises";
import { formatDuration, type SessionRecord } from "@/hooks/useSessionStats";

interface Props {
  records: SessionRecord[];
}

const PAGE = 10;

export function HistoryLog({ records }: Props) {
  const [shown, setShown] = useState(PAGE);
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...records].sort((a, b) => b.completedAt - a.completedAt),
    [records],
  );
  const exMap = useMemo(() => new Map(exercises.map((e) => [e.id, e])), []);

  if (sorted.length === 0) {
    return (
      <section
        className="rounded-2xl border border-[#1e1e1e] bg-[#111111] p-5 anim-fade-in-up"
        style={{ animationDelay: "280ms" }}
      >
        <p className="text-[10px] uppercase tracking-widest text-[#C8F135] mb-3">
          History
        </p>
        <div className="py-8 text-center">
          <Calendar className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
          <p className="text-sm text-neutral-400">No sessions yet</p>
          <p className="text-xs text-neutral-600 mt-1">
            Complete a session to see it here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="rounded-2xl border border-[#1e1e1e] bg-[#111111] p-5 anim-fade-in-up"
      style={{ animationDelay: "280ms" }}
    >
      <p className="text-[10px] uppercase tracking-widest text-[#C8F135] mb-3">
        History · {sorted.length} {sorted.length === 1 ? "session" : "sessions"}
      </p>

      <ul className="space-y-2">
        {sorted.slice(0, shown).map((r, i) => {
          const id = `${r.completedAt}-${i}`;
          const open = openId === id;
          const d = new Date(r.completedAt);
          const dateLabel = d.toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          const timeLabel = d.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
          });
          return (
            <li
              key={id}
              className="rounded-xl border border-[#1e1e1e] bg-[#0a0a0a] overflow-hidden"
            >
              <button
                onClick={() => setOpenId(open ? null : id)}
                className="w-full px-3 py-3 flex items-center gap-3 text-left hover:bg-[#111111] transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{dateLabel}</p>
                  <p className="text-[11px] text-neutral-500">
                    {timeLabel} · {r.exerciseIds.length} exercises ·{" "}
                    {formatDuration(r.durationSec)}
                  </p>
                </div>
                <ChevronDown
                  className="w-4 h-4 text-neutral-500 transition-transform"
                  style={{ transform: open ? "rotate(180deg)" : "none" }}
                />
              </button>
              {open && (
                <div className="px-3 pb-3 pt-1 border-t border-[#1e1e1e] anim-fade-in">
                  <div className="grid grid-cols-3 gap-2 mt-2 mb-3">
                    <Mini label="Reps" value={String(r.totalReps)} />
                    <Mini label="Hold" value={formatDuration(r.totalHoldSec)} />
                    <Mini
                      label="Time"
                      value={formatDuration(r.durationSec)}
                    />
                  </div>
                  <ul className="space-y-1">
                    {r.exerciseIds.map((eid) => {
                      const ex = exMap.get(eid);
                      return (
                        <li
                          key={eid}
                          className="text-xs text-neutral-300 flex items-center gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#C8F135]" />
                          {ex?.name ?? eid}
                          {ex && (
                            <span className="text-neutral-600">
                              · {ex.phase}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {shown < sorted.length && (
        <button
          onClick={() => setShown((s) => s + PAGE)}
          className="mt-3 w-full py-2 rounded-lg text-xs font-medium text-neutral-300 border border-[#1e1e1e] hover:border-[#C8F135]/40 hover:text-[#C8F135] transition press"
        >
          Show {Math.min(PAGE, sorted.length - shown)} more
        </button>
      )}
    </section>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#111111] border border-[#1e1e1e] p-2">
      <p className="text-[9px] uppercase tracking-widest text-neutral-500">
        {label}
      </p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}
