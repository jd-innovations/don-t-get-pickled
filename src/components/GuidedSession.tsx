import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, Pause, Play, SkipForward, Check, Volume2, VolumeX, Plus } from "lucide-react";
import { exercises as allExercises, phaseColor, type Exercise } from "@/data/exercises";
import { addSession, dateKey, type SessionRecord } from "@/hooks/useSessionStats";

interface Props {
  open: boolean;
  onClose: () => void;
  completed: Set<string>;
  onToggle: (id: string) => void;
  onOpenSummary: () => void;
  onSessionComplete?: (rec: SessionRecord) => void;
  /** Optional subset of exercise IDs (in order) to run. Defaults to full library. */
  exerciseIds?: string[];
}

type ParsedDose =
  | { kind: "hold"; seconds: number; sets: number; sides: number }
  | { kind: "reps"; reps: number; sets: number; sides: number };

// ---------- Dose parser ----------
function parseDose(dose: string): ParsedDose {
  const d = dose.trim();
  const sides = /each (leg|side|wrist|direction|arm|hand)/i.test(d) ? 2 : 1;

  // "3×10s Holds" or "2×15s Each Leg"
  const holdMulti = d.match(/(\d+)\s*[×x]\s*(\d+)\s*s/i);
  if (holdMulti) {
    return {
      kind: "hold",
      sets: parseInt(holdMulti[1], 10),
      seconds: parseInt(holdMulti[2], 10),
      sides,
    };
  }
  // "15s" alone
  const holdSingle = d.match(/^(\d+)\s*s/i);
  if (holdSingle) {
    return { kind: "hold", sets: 1, seconds: parseInt(holdSingle[1], 10), sides };
  }

  // "3×15 Reps" or "3×10 Reps"
  const repsMulti = d.match(/(\d+)\s*[×x]\s*(\d+)/);
  if (repsMulti) {
    return {
      kind: "reps",
      sets: parseInt(repsMulti[1], 10),
      reps: parseInt(repsMulti[2], 10),
      sides,
    };
  }

  // "10 Each Direction" / "10 Each Side" / "8 Each Direction"
  const repsSingle = d.match(/(\d+)/);
  if (repsSingle) {
    return { kind: "reps", sets: 1, reps: parseInt(repsSingle[1], 10), sides };
  }

  return { kind: "reps", sets: 1, reps: 10, sides: 1 };
}

const REP_TEMPO_S = 2; // seconds per rep
const REST_S = 5;
const GET_READY_S = 3;

function sideLabel(idx: number, total: number, kind: "hold" | "reps"): string | null {
  if (total <= 1) return null;
  if (total === 2) return idx === 0 ? "Right Side" : "Left Side";
  return `Side ${idx + 1} / ${total}`;
}

// ---------- Audio beep ----------
function useBeeper(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  return useCallback(
    (freq = 660, duration = 0.12) => {
      if (muted) return;
      try {
        if (!ctxRef.current) {
          const Ctx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          ctxRef.current = new Ctx();
        }
        const ctx = ctxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration + 0.02);
      } catch {
        // ignore
      }
    },
    [muted],
  );
}

type Phase = "get-ready" | "active" | "rest" | "done-flash" | "celebrate";

export function GuidedSession({ open, onClose, completed, onToggle, onOpenSummary, onSessionComplete, exerciseIds }: Props) {
  // Active exercise list — either a custom subset or the full library
  const exercises = useMemo<Exercise[]>(() => {
    if (!exerciseIds || exerciseIds.length === 0) return allExercises;
    const map = new Map(allExercises.map((e) => [e.id, e]));
    return exerciseIds.map((id) => map.get(id)).filter((e): e is Exercise => Boolean(e));
  }, [exerciseIds]);

  // Find first incomplete exercise on open
  const startIdx = useMemo(() => {
    if (!open) return 0;
    const i = exercises.findIndex((e) => !completed.has(e.id));
    return i === -1 ? 0 : i;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const [exIdx, setExIdx] = useState(startIdx);
  const [setIdx, setSetIdx] = useState(0);
  const [sideIdx, setSideIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("get-ready");
  const [msRemaining, setMsRemaining] = useState(GET_READY_S * 1000);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("dgp:guided:muted") === "1";
  });
  const [repCount, setRepCount] = useState(0);

  const beep = useBeeper(muted);
  const lastBeepedSecond = useRef<number>(-1);

  // ----- Session stats tracking -----
  const sessionStartMsRef = useRef<number>(0);
  const pauseStartedAtRef = useRef<number | null>(null);
  const pausedAccumMsRef = useRef<number>(0);
  const completedInSessionRef = useRef<Set<string>>(new Set());
  const repsAccumRef = useRef<number>(0);
  const holdAccumRef = useRef<number>(0);
  const sessionWrittenRef = useRef<boolean>(false);

  // Reset on open
  useEffect(() => {
    if (!open) return;
    setExIdx(startIdx);
    setSetIdx(0);
    setSideIdx(0);
    setPhase("get-ready");
    setMsRemaining(GET_READY_S * 1000);
    setPaused(false);
    setRepCount(0);
    lastBeepedSecond.current = -1;
    sessionStartMsRef.current = Date.now();
    pauseStartedAtRef.current = null;
    pausedAccumMsRef.current = 0;
    completedInSessionRef.current = new Set();
    repsAccumRef.current = 0;
    holdAccumRef.current = 0;
    sessionWrittenRef.current = false;
  }, [open, startIdx]);

  // Track pause time
  useEffect(() => {
    if (!open) return;
    if (paused) {
      pauseStartedAtRef.current = Date.now();
    } else if (pauseStartedAtRef.current != null) {
      pausedAccumMsRef.current += Date.now() - pauseStartedAtRef.current;
      pauseStartedAtRef.current = null;
    }
  }, [paused, open]);

  // Lock scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Persist mute pref
  useEffect(() => {
    try {
      window.localStorage.setItem("dgp:guided:muted", muted ? "1" : "0");
    } catch {
      // ignore
    }
  }, [muted]);

  const current: Exercise | undefined = exercises[exIdx];
  const parsed = useMemo(
    () => (current ? parseDose(current.dose) : null),
    [current],
  );

  const activeDurationS = useMemo(() => {
    if (!parsed) return 10;
    return parsed.kind === "hold" ? parsed.seconds : parsed.reps * REP_TEMPO_S;
  }, [parsed]);

  // Advance helpers
  const advanceFromActive = useCallback(() => {
    if (!parsed) return;
    const totalSets = parsed.sets;
    const totalSides = parsed.sides;

    // next side?
    if (sideIdx + 1 < totalSides) {
      setSideIdx((s) => s + 1);
      setRepCount(0);
      setPhase("get-ready");
      setMsRemaining(GET_READY_S * 1000);
      return;
    }
    // next set?
    if (setIdx + 1 < totalSets) {
      setSideIdx(0);
      setSetIdx((s) => s + 1);
      setRepCount(0);
      setPhase("rest");
      setMsRemaining(REST_S * 1000);
      return;
    }
    // exercise done — accrue stats
    if (current) {
      if (!completedInSessionRef.current.has(current.id)) {
        completedInSessionRef.current.add(current.id);
        if (parsed.kind === "hold") {
          holdAccumRef.current += parsed.seconds * parsed.sets * parsed.sides;
        } else {
          repsAccumRef.current += parsed.reps * parsed.sets * parsed.sides;
        }
      }
      if (!completed.has(current.id)) onToggle(current.id);
    }
    setPhase("done-flash");
    setMsRemaining(900);
  }, [parsed, sideIdx, setIdx, current, completed, onToggle]);

  const writeSessionIfNeeded = useCallback(() => {
    if (sessionWrittenRef.current) return;
    if (completedInSessionRef.current.size === 0) return;
    sessionWrittenRef.current = true;
    const now = Date.now();
    const pausedNow =
      pauseStartedAtRef.current != null ? now - pauseStartedAtRef.current : 0;
    const durationMs =
      now - sessionStartMsRef.current - pausedAccumMsRef.current - pausedNow;
    const rec: SessionRecord = {
      date: dateKey(),
      completedAt: now,
      durationSec: Math.max(0, Math.round(durationMs / 1000)),
      exerciseIds: Array.from(completedInSessionRef.current),
      totalReps: repsAccumRef.current,
      totalHoldSec: holdAccumRef.current,
    };
    addSession(rec);
    onSessionComplete?.(rec);
  }, [onSessionComplete]);

  const goNextExercise = useCallback(() => {
    const next = exIdx + 1;
    if (next >= exercises.length) {
      writeSessionIfNeeded();
      setPhase("celebrate");
      return;
    }
    setExIdx(next);
    setSetIdx(0);
    setSideIdx(0);
    setRepCount(0);
    setPhase("get-ready");
    setMsRemaining(GET_READY_S * 1000);
    lastBeepedSecond.current = -1;
  }, [exIdx, writeSessionIfNeeded]);

  const handleClose = useCallback(() => {
    writeSessionIfNeeded();
    onClose();
  }, [writeSessionIfNeeded, onClose]);

  // Tick
  useEffect(() => {
    if (!open) return;
    if (paused) return;
    if (phase === "celebrate") return;
    const id = window.setInterval(() => {
      setMsRemaining((ms) => Math.max(0, ms - 250));
    }, 250);
    return () => window.clearInterval(id);
  }, [open, paused, phase]);

  // React to msRemaining hitting 0
  useEffect(() => {
    if (!open) return;
    if (msRemaining > 0) return;

    if (phase === "get-ready") {
      beep(880, 0.18);
      setPhase("active");
      setMsRemaining(activeDurationS * 1000);
      lastBeepedSecond.current = -1;
    } else if (phase === "active") {
      beep(523, 0.25);
      advanceFromActive();
    } else if (phase === "rest") {
      setPhase("get-ready");
      setMsRemaining(GET_READY_S * 1000);
    } else if (phase === "done-flash") {
      goNextExercise();
    }
  }, [msRemaining, phase, open, beep, activeDurationS, advanceFromActive, goNextExercise]);

  // Countdown beeps for last 3 seconds of get-ready and active
  useEffect(() => {
    if (paused || !open) return;
    if (phase !== "get-ready" && phase !== "active") return;
    const sec = Math.ceil(msRemaining / 1000);
    if (sec <= 3 && sec > 0 && sec !== lastBeepedSecond.current) {
      lastBeepedSecond.current = sec;
      beep(phase === "get-ready" ? 440 : 660, 0.08);
    }
  }, [msRemaining, phase, paused, open, beep]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setPaused((p) => !p);
      } else if (e.code === "ArrowRight") {
        skipExercise();
      } else if (e.code === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const skipExercise = useCallback(() => {
    goNextExercise();
  }, [goNextExercise]);

  const markDoneAndNext = useCallback(() => {
    if (current && parsed && !completedInSessionRef.current.has(current.id)) {
      completedInSessionRef.current.add(current.id);
      if (parsed.kind === "hold") {
        holdAccumRef.current += parsed.seconds * parsed.sets * parsed.sides;
      } else {
        repsAccumRef.current += parsed.reps * parsed.sets * parsed.sides;
      }
    }
    if (current && !completed.has(current.id)) onToggle(current.id);
    goNextExercise();
  }, [current, parsed, completed, onToggle, goNextExercise]);

  if (!open || !current || !parsed) return null;

  const totalEx = exercises.length;
  const next = exercises[exIdx + 1];
  const color = phaseColor(current.phase);

  // Progress
  const phaseTotalMs =
    phase === "get-ready"
      ? GET_READY_S * 1000
      : phase === "rest"
        ? REST_S * 1000
        : phase === "active"
          ? activeDurationS * 1000
          : 1;
  const phaseProgress = phase === "active" ? 1 - msRemaining / phaseTotalMs : 0;
  const overallPct = ((exIdx + phaseProgress) / totalEx) * 100;

  // Linear bar values
  const barColor =
    phase === "rest"
      ? "#82a0e0"
      : phase === "get-ready"
        ? "#f5a623"
        : color;
  // Rest drains R→L (bar shrinks from right). Others fill L→R.
  const remainingPct = (msRemaining / phaseTotalMs) * 100;
  const elapsedPct = 100 - remainingPct;
  const barFillPct =
    phase === "rest" ? remainingPct : phase === "active" || phase === "get-ready" ? elapsedPct : 0;
  const barAnchorRight = phase === "rest";

  const secondsDisplay = Math.ceil(msRemaining / 1000);

  // Step text - split steps across active duration
  const stepText = (() => {
    if (phase === "get-ready") return "Get ready…";
    if (phase === "rest") return "Rest — breathe";
    if (phase === "done-flash") return "Done! ✓";
    const stepIdx = Math.min(
      current.steps.length - 1,
      Math.floor(phaseProgress * current.steps.length),
    );
    return current.steps[stepIdx];
  })();

  const setSideLine = (() => {
    const parts: string[] = [];
    if (parsed.sets > 1) parts.push(`Set ${setIdx + 1} / ${parsed.sets}`);
    const sl = sideLabel(sideIdx, parsed.sides, parsed.kind);
    if (sl) parts.push(sl);
    return parts.join(" · ");
  })();

  // Celebrate screen
  if (phase === "celebrate") {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 animate-in fade-in duration-300">
        <div className="text-7xl mb-6">🎉</div>
        <h2 className="font-display text-4xl tracking-wider text-[#C8F135] text-center">
          SESSION COMPLETE
        </h2>
        <p className="mt-3 text-sm text-neutral-300 text-center">
          You showed up. That's the win.
        </p>
        <div className="mt-10 w-full max-w-xs space-y-3">
          <button
            onClick={() => {
              handleClose();
              onOpenSummary();
            }}
            className="w-full py-3 rounded-lg font-display text-lg tracking-wider bg-[#C8F135] text-black hover:brightness-110 transition"
          >
            VIEW SUMMARY
          </button>
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-lg font-display text-sm tracking-wider border border-[#1e1e1e] text-neutral-300 hover:border-[#C8F135]/40 transition"
          >
            CLOSE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] text-white overflow-y-auto animate-in fade-in duration-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1e1e1e]">
        <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color }}
              aria-hidden
            />
            <span
              className="font-display text-xs tracking-widest"
              style={{ color }}
            >
              {current.phase.toUpperCase()}
            </span>
            <span className="text-xs text-neutral-500 ml-2">
              {exIdx + 1} / {totalEx}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Unmute" : "Mute"}
              className="w-9 h-9 rounded-full bg-[#1e1e1e] flex items-center justify-center text-neutral-300 hover:text-[#C8F135] transition"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleClose}
              aria-label="Close guided session"
              className="w-9 h-9 rounded-full bg-[#1e1e1e] flex items-center justify-center text-neutral-300 hover:text-[#C8F135] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Overall progress */}
        <div className="h-[3px] w-full bg-[#0a0a0a]">
          <div
            className="h-full bg-[#C8F135] transition-all duration-300"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 pb-32">
        {/* Image */}
        {current.image && (
          <div className="mt-5 rounded-2xl overflow-hidden bg-[#111111] border border-[#1e1e1e]">
            <img
              src={current.image}
              alt={current.name}
              className="w-full h-44 object-contain"
            />
          </div>
        )}

        {/* Name */}
        <div className="mt-5 text-center">
          <h2 className="font-display text-2xl tracking-wide leading-tight">
            {current.name.toUpperCase()}
          </h2>
          <p className="mt-1 text-xs text-neutral-400">{current.muscles}</p>
        </div>

        {/* Countdown + linear bar */}
        <div className="mt-6 flex flex-col items-center w-full">
          <div
            className="flex flex-col items-center justify-center"
            aria-live="polite"
          >
            {parsed.kind === "reps" && phase === "active" ? (
              <>
                <span className="font-display text-5xl tracking-wider leading-none">
                  {repCount}
                  <span className="text-2xl text-neutral-500">/{parsed.reps}</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                  reps
                </span>
              </>
            ) : (
              <>
                <span className="font-display text-6xl tracking-wider leading-none">
                  {secondsDisplay}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                  {phase === "get-ready"
                    ? "get ready"
                    : phase === "rest"
                      ? "rest"
                      : phase === "done-flash"
                        ? "done"
                        : parsed.kind === "hold"
                          ? "hold"
                          : "seconds"}
                </span>
              </>
            )}
          </div>

          {/* Linear progress bar */}
          <div className="mt-4 relative h-[5px] w-full max-w-xs rounded-full bg-[#1e1e1e] overflow-hidden">
            <div
              className="absolute top-0 bottom-0 rounded-full"
              style={{
                width: `${barFillPct}%`,
                backgroundColor: barColor,
                left: barAnchorRight ? "auto" : 0,
                right: barAnchorRight ? 0 : "auto",
                transition: "width 250ms linear, background-color 350ms var(--ease-soft), box-shadow 350ms var(--ease-soft)",
                boxShadow: `0 0 12px 1px ${barColor}66`,
              }}
            />
          </div>

          {setSideLine && (
            <p className="mt-3 text-xs uppercase tracking-widest text-neutral-400">
              {setSideLine}
            </p>
          )}

          {/* +1 rep button */}
          {parsed.kind === "reps" && phase === "active" && (
            <button
              onClick={() => {
                setRepCount((r) => {
                  const next = r + 1;
                  if (next >= parsed.reps) {
                    setMsRemaining(0);
                    return parsed.reps;
                  }
                  return next;
                });
                beep(720, 0.05);
              }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e1e1e] hover:bg-[#2a2a2a] text-sm font-medium transition"
            >
              <Plus className="w-4 h-4" /> Count rep
            </button>
          )}
        </div>

        {/* Step text */}
        <p
          className="mt-6 text-center text-sm text-neutral-200 leading-relaxed min-h-[3.5rem]"
          aria-live="polite"
        >
          {stepText}
        </p>

        {/* Controls */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            onClick={() => setPaused((p) => !p)}
            className="flex flex-col items-center gap-1 py-3 rounded-xl border border-[#1e1e1e] bg-[#111111] hover:border-[#C8F135]/40 transition"
          >
            {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            <span className="text-[10px] uppercase tracking-widest text-neutral-400">
              {paused ? "Resume" : "Pause"}
            </span>
          </button>
          <button
            onClick={skipExercise}
            className="flex flex-col items-center gap-1 py-3 rounded-xl border border-[#1e1e1e] bg-[#111111] hover:border-[#C8F135]/40 transition"
          >
            <SkipForward className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-widest text-neutral-400">
              Skip
            </span>
          </button>
          <button
            onClick={markDoneAndNext}
            className="flex flex-col items-center gap-1 py-3 rounded-xl bg-[#C8F135] text-black hover:brightness-110 transition"
          >
            <Check className="w-5 h-5" strokeWidth={3} />
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              Done · Next
            </span>
          </button>
        </div>

        {/* Next up */}
        <div className="mt-6 rounded-xl border border-[#1e1e1e] bg-[#111111] p-3 flex items-center gap-3">
          {next?.image ? (
            <img
              src={next.image}
              alt=""
              className="w-12 h-12 rounded-lg object-contain bg-[#0a0a0a]"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center font-display text-base"
              style={{
                backgroundColor: "#0a0a0a",
                color: next ? phaseColor(next.phase) : "#C8F135",
              }}
            >
              {next?.number ?? "✓"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">
              {next ? "Next up" : "Final exercise"}
            </p>
            <p className="text-sm font-medium truncate">
              {next ? next.name : "Last one — finish strong 💪"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
