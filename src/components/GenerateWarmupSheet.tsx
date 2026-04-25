import { useCallback, useState } from "react";
import { X, Sparkles, RefreshCw, Play } from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useSessionStats } from "@/hooks/useSessionStats";
import {
  FOCUS_TAGS,
  generateWarmupPlan,
  type FocusTag,
  type WarmupPlan,
} from "@/lib/generateWarmup";
import { phaseColor } from "@/data/exercises";
import { useServerFn } from "@tanstack/react-start";
import { generateWarmupNote } from "@/utils/warmup.functions";

interface Props {
  open: boolean;
  onClose: () => void;
  onStart: (exerciseIds: string[]) => void;
}

export function GenerateWarmupSheet({ open, onClose, onStart }: Props) {
  const { profile } = useUserProfile();
  const { records } = useSessionStats();
  const [focus, setFocus] = useState<FocusTag>("Full Body");
  const [plan, setPlan] = useState<WarmupPlan | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [noteError, setNoteError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState(0);

  const fetchNote = useServerFn(generateWarmupNote);

  const generate = useCallback(
    async (nextSeed: number) => {
      setLoading(true);
      setNote(null);
      setNoteError(null);
      const next = generateWarmupPlan({
        profile,
        focus,
        recentSessions: records,
        seed: nextSeed,
      });
      setPlan(next);
      try {
        const res = await fetchNote({
          data: {
            focus,
            fitnessLevel: profile.fitnessLevel,
            injuries: profile.injuries,
            goals: profile.goals,
            picks: next.picks.map((p) => ({
              name: p.exercise.name,
              phase: p.exercise.phase,
              reasons: p.reasons,
            })),
          },
        });
        setNote(res.note);
        setNoteError(res.error);
      } catch (err) {
        console.error(err);
        setNote("Tailored to your focus today — move steady and breathe.");
        setNoteError("Coaching note unavailable.");
      } finally {
        setLoading(false);
      }
    },
    [profile, focus, records, fetchNote],
  );

  const handleClose = () => {
    setPlan(null);
    setNote(null);
    setNoteError(null);
    setSeed(0);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[92vh] overflow-y-auto bg-[#0a0a0a] border-t border-[#1e1e1e] sm:border sm:rounded-2xl sm:my-6 text-white">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1e1e1e]">
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C8F135]" />
              <span className="font-display text-sm tracking-widest text-[#C8F135]">
                GENERATE WARM-UP
              </span>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close"
              className="w-9 h-9 rounded-full bg-[#1e1e1e] flex items-center justify-center text-neutral-300 hover:text-[#C8F135] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="px-5 py-5 space-y-5">
          {/* Focus chips */}
          <section>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3">
              What's your focus today?
            </p>
            <div className="flex flex-wrap gap-2">
              {FOCUS_TAGS.map((tag) => {
                const active = focus === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setFocus(tag)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition border"
                    style={{
                      backgroundColor: active ? "#C8F135" : "#111111",
                      color: active ? "#0a0a0a" : "#e5e5e5",
                      borderColor: active ? "#C8F135" : "#1e1e1e",
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Generate button */}
          {!plan && (
            <button
              onClick={() => {
                const s = seed + 1;
                setSeed(s);
                generate(s);
              }}
              disabled={loading}
              className="w-full py-3 rounded-lg font-display text-base tracking-wider bg-[#C8F135] text-black hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? "GENERATING…" : "GENERATE 6 EXERCISES"}
            </button>
          )}

          {/* Plan */}
          {plan && (
            <>
              <section className="rounded-2xl border border-[#1e1e1e] bg-[#111111] p-4">
                <p className="text-[10px] uppercase tracking-widest text-[#C8F135] mb-2">
                  Coach's note
                </p>
                {loading && !note ? (
                  <p className="text-sm text-neutral-500 italic">
                    Writing your coaching note…
                  </p>
                ) : (
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    {note}
                  </p>
                )}
                {noteError && (
                  <p className="mt-2 text-[11px] text-amber-400/80">
                    {noteError}
                  </p>
                )}
              </section>

              <section className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                  Your 6 exercises
                </p>
                {plan.picks.map((p, idx) => {
                  const ex = p.exercise;
                  return (
                    <div
                      key={ex.id}
                      className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-3 flex items-center gap-3"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-display text-sm shrink-0"
                        style={{
                          backgroundColor: "#0a0a0a",
                          color: phaseColor(ex.phase),
                        }}
                      >
                        {idx + 1}
                      </div>
                      {ex.image && (
                        <img
                          src={ex.image}
                          alt=""
                          className="w-12 h-12 rounded-lg object-contain bg-[#0a0a0a] shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {ex.name}
                        </p>
                        <p className="text-[11px] text-neutral-400 truncate">
                          {ex.phase} · {ex.dose}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </section>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => {
                    const s = seed + 1;
                    setSeed(s);
                    generate(s);
                  }}
                  disabled={loading}
                  className="py-3 rounded-lg font-display text-sm tracking-wider border border-[#1e1e1e] bg-[#111111] text-neutral-200 hover:border-[#C8F135]/40 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  REGENERATE
                </button>
                <button
                  onClick={() => {
                    onStart(plan.picks.map((p) => p.exercise.id));
                    handleClose();
                  }}
                  className="py-3 rounded-lg font-display text-sm tracking-wider bg-[#C8F135] text-black hover:brightness-110 transition flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  START
                </button>
              </div>
            </>
          )}

          <p className="text-[10px] text-neutral-600 text-center pt-2">
            Sign-in coming soon — your sessions will sync across devices.
          </p>
        </div>
      </div>
    </div>
  );
}
