import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Calendar, User, Sparkles } from "lucide-react";
import { ExerciseCard } from "@/components/ExerciseCard";
import { PhaseDivider } from "@/components/PhaseDivider";
import { SessionSummary } from "@/components/SessionSummary";
import { GuidedSession } from "@/components/GuidedSession";
import { GenerateWarmupSheet } from "@/components/GenerateWarmupSheet";
import { exercises, phaseColor, type Phase } from "@/data/exercises";
import { useCompletedExercises } from "@/hooks/useCompletedExercises";
import { useUserProfile } from "@/contexts/UserProfileContext";
import type { SessionRecord } from "@/hooks/useSessionStats";
import {
  activeDayMask,
  getFocusFor,
  getPriorityFor,
  personalizeDose,
} from "@/lib/personalize";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Today's Session — Don't Get Pickled" },
      {
        name: "description",
        content: "Your daily pickleball warm up routine. Stay loose, stay safe, stay on court.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [tab, setTab] = useState<"home" | "schedule" | "profile">("home");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [guidedOpen, setGuidedOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [customIds, setCustomIds] = useState<string[] | undefined>(undefined);
  const [recap, setRecap] = useState<SessionRecord | null>(null);
  const { completed, isComplete, toggle, reset } = useCompletedExercises();
  const { profile, hasProfile } = useUserProfile();
  const totalExercises = exercises.length;
  const completedCount = exercises.reduce((n, e) => (completed.has(e.id) ? n + 1 : n), 0);
  const allDone = completedCount === totalExercises && totalExercises > 0;
  const phases: Phase[] = ["Warm-Up", "Mobility", "Strength"];
  const ctaLabel = allDone
    ? "SESSION COMPLETE ✓"
    : completedCount > 0
      ? "RESUME SESSION"
      : "START SESSION";
  const dayMask = activeDayMask(profile.playFrequency);
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1e1e1e]">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
          <span className="font-display text-lg tracking-wider text-[#C8F135]">
            DON'T GET PICKLED
          </span>
          <div className="w-9 h-9 rounded-full bg-[#1e1e1e] flex items-center justify-center text-sm font-semibold text-[#C8F135] border border-[#C8F135]/40">
            P
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5">
        {/* Welcome */}
        <section className="pt-8 pb-4 anim-fade-in-up" style={{ animationDelay: "40ms" }}>
          <h1 className="font-display text-5xl leading-none tracking-wide text-white">
            READY TO PLAY?
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            Complete today's warm up before you hit the court.
          </p>
        </section>

        {/* Profile summary */}
        {hasProfile && (
          <section
            className="mt-2 rounded-2xl border border-[#1e1e1e] bg-[#111111] p-5 anim-fade-in-up hover-lift"
            style={{ animationDelay: "120ms" }}
          >
            <p className="text-[10px] uppercase tracking-widest text-[#C8F135] mb-3">
              Your Profile
            </p>
            <div className="grid grid-cols-2 gap-4">
              <ProfileStat label="AGE" value={profile.ageRange} />
              <ProfileStat label="FITNESS" value={profile.fitnessLevel} />
              <ProfileStat label="PLAYS" value={profile.playFrequency} />
              <ProfileStat label="TOP GOAL" value={profile.goals[0] ?? null} />
            </div>
          </section>
        )}

        {/* Weekly schedule */}
        {hasProfile && (
          <section
            className="mt-3 rounded-2xl border border-[#1e1e1e] bg-[#111111] p-4 anim-fade-in-up hover-lift"
            style={{ animationDelay: "200ms" }}
          >
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3">
              Your Week
            </p>
            <div className="flex items-center justify-between">
              {dayLabels.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span className="text-[11px] font-medium text-neutral-300">{d}</span>
                  <span
                    className="w-2 h-2 rounded-full transition-colors"
                    style={{ backgroundColor: dayMask[i] ? "#C8F135" : "#2a2a2a" }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Generate custom warm-up */}
        <section
          className="mt-2 rounded-2xl border border-[#C8F135]/40 bg-gradient-to-br from-[#1a1f0a] to-[#111111] p-5 anim-fade-in-up hover-lift"
          style={{ animationDelay: "280ms" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C8F135]/15 flex items-center justify-center shrink-0 anim-pulse-soft">
              <Sparkles className="w-5 h-5 text-[#C8F135]" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest text-[#C8F135]">
                On-Demand
              </p>
              <p className="mt-1 font-display text-lg tracking-wide text-white">
                GENERATE TODAY'S WARM-UP
              </p>
              <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                6 exercises tailored to your focus and recent sessions.
              </p>
            </div>
          </div>
          <button
            onClick={() => setGenerateOpen(true)}
            className="mt-4 w-full py-3 rounded-lg font-display text-sm tracking-wider bg-[#C8F135] text-black hover:brightness-110 transition flex items-center justify-center gap-2 hover-lift press"
          >
            <Sparkles className="w-4 h-4" />
            BUILD MY SESSION
          </button>
        </section>

        {/* Session tracker */}
        <section
          className="mt-2 rounded-2xl border border-[#1e1e1e] bg-[#111111] p-5 anim-fade-in-up"
          style={{ animationDelay: "360ms" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Today's Session
            </p>
            <p className="text-xs text-neutral-300 font-medium">
              {completedCount} of {totalExercises} complete
            </p>
          </div>
          <div className="mt-3 h-2 w-full bg-[#0a0a0a] rounded-full overflow-hidden relative">
            <div
              className={`h-full bg-[#C8F135] transition-all duration-500 ${completedCount > 0 && !allDone ? "shimmer-overlay" : ""}`}
              style={{ width: `${(completedCount / totalExercises) * 100}%` }}
            />
          </div>
          {completedCount > 0 && (
            <div className="mt-2 flex items-center justify-between anim-fade-in">
              <button
                onClick={reset}
                className="text-[11px] text-neutral-500 hover:text-[#C8F135] transition-colors underline underline-offset-2"
              >
                Reset today's progress
              </button>
              <button
                onClick={() => setSummaryOpen(true)}
                className="text-[11px] text-[#C8F135] hover:brightness-125 transition underline underline-offset-2"
              >
                View summary
              </button>
            </div>
          )}
          <button
            onClick={() => setGuidedOpen(true)}
            className="mt-5 w-full py-3 rounded-lg font-display text-base tracking-wider border-2 border-[#C8F135] text-[#C8F135] hover:bg-[#C8F135]/10 transition flex items-center justify-center gap-2 hover-lift press"
          >
            <span aria-hidden>▶</span> START GUIDED SESSION
          </button>
          <button
            onClick={() => setSummaryOpen(true)}
            className="mt-2 w-full py-3 rounded-lg font-display text-lg tracking-wider bg-[#C8F135] text-black hover:brightness-110 transition hover-lift press"
          >
            {ctaLabel}
          </button>
        </section>

        {/* Library */}
        {phases.map((phase) => {
          const items = exercises.filter((e) => e.phase === phase);
          return (
            <div key={phase}>
              <PhaseDivider phase={phase} />
              <div className="space-y-3">
                {items.map((ex) => (
                  <ExerciseCard
                    key={ex.id}
                    exercise={ex}
                    completed={isComplete(ex.id)}
                    onToggleComplete={toggle}
                    displayDose={personalizeDose(ex.dose, profile.fitnessLevel, ex.id)}
                    priority={getPriorityFor(ex.id, profile.injuries)}
                    focus={getFocusFor(ex.id, profile.goals)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Coming soon placeholders */}
        <PhaseDivider phase="Strength" label="MORE COMING SOON" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-dashed border-[#1e1e1e] bg-[#0f0f0f] p-4 aspect-square flex flex-col items-center justify-center text-center"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-display text-sm mb-2"
                style={{ backgroundColor: "#1a1a1a", color: phaseColor("Strength") }}
              >
                {i + 7}
              </div>
              <p className="text-[10px] text-neutral-500 leading-tight">
                Full exercise library coming soon
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/98 backdrop-blur border-t border-[#1e1e1e] z-30">
        <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-around">
          {[
            { id: "home" as const, icon: Home, label: "Home" },
            { id: "schedule" as const, icon: Calendar, label: "Schedule" },
            { id: "profile" as const, icon: User, label: "Profile" },
          ].map(({ id, icon: Icon, label }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="flex flex-col items-center gap-1 px-4 py-1 transition-colors"
                style={{ color: active ? "#C8F135" : "#737373" }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium tracking-wide">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <SessionSummary
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        completed={completed}
        onToggle={toggle}
        onReset={reset}
        recap={recap}
        onClearRecap={() => setRecap(null)}
      />

      <GuidedSession
        open={guidedOpen}
        onClose={() => {
          setGuidedOpen(false);
          setCustomIds(undefined);
        }}
        completed={completed}
        onToggle={toggle}
        onOpenSummary={() => setSummaryOpen(true)}
        onSessionComplete={(rec) => setRecap(rec)}
        exerciseIds={customIds}
      />

      <GenerateWarmupSheet
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        onStart={(ids) => {
          setCustomIds(ids);
          setGuidedOpen(true);
        }}
      />
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-[#C8F135] font-semibold">
        {label}
      </p>
      <p className="mt-1 text-sm text-white font-medium">{value ?? "—"}</p>
    </div>
  );
}
