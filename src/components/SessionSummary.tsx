import { useEffect } from "react";
import { X, Check } from "lucide-react";
import { exercises, phaseColor, type Phase } from "@/data/exercises";

interface Props {
  open: boolean;
  onClose: () => void;
  completed: Set<string>;
  onToggle: (id: string) => void;
  onReset: () => void;
}

const phases: Phase[] = ["Warm-Up", "Mobility", "Strength"];

export function SessionSummary({ open, onClose, completed, onToggle, onReset }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
        <section className="pt-8 pb-6">
          <h1 className="font-display text-4xl leading-none tracking-wide">TODAY'S SESSION</h1>
          <p className="mt-3 text-sm text-neutral-300">
            <span className="text-white font-semibold">{doneCount}</span> of {total} complete ·{" "}
            <span className="text-[#C8F135] font-semibold">{pct}%</span>
          </p>
          <div className="mt-4 h-2 w-full bg-[#111111] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C8F135] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </section>

        {/* Phase groups */}
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

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg font-display text-lg tracking-wider bg-[#C8F135] text-black hover:brightness-110 transition"
          >
            CLOSE
          </button>
          {doneCount > 0 && (
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
