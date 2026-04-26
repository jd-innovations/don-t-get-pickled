import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Calendar, Home, User, Play, Sparkles, Clock, Layers } from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useCloudSessions } from "@/hooks/useCloudSessions";
import { PRESETS, buildPresetPlan, pickTodaysPreset, type Preset } from "@/lib/presets";
import { phaseColor } from "@/data/exercises";

const PENDING_KEY = "dgp:pendingSession";

export const Route = createFileRoute("/_authenticated/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule — Don't Get Pickled" },
      {
        name: "description",
        content:
          "Pre-built warm-up presets tailored to your profile. Tap to start.",
      },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const { records } = useCloudSessions();

  const todaysPreset = useMemo(() => pickTodaysPreset(), []);
  const otherPresets = useMemo(
    () => PRESETS.filter((p) => p.id !== todaysPreset.id),
    [todaysPreset.id],
  );

  const startPreset = (preset: Preset) => {
    const plan = buildPresetPlan(preset, profile, records);
    const ids = plan.picks.map((p) => p.exercise.id);
    try {
      sessionStorage.setItem(
        PENDING_KEY,
        JSON.stringify({ ids, presetId: preset.id, at: Date.now() }),
      );
    } catch {
      // ignore
    }
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1e1e1e]">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
          <span className="font-display text-lg tracking-wider text-[#C8F135]">
            DON'T GET PICKLED
          </span>
          <div className="w-9 h-9 rounded-full bg-[#1e1e1e] flex items-center justify-center text-[#C8F135] border border-[#C8F135]/40">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5">
        <section className="pt-8 pb-2 anim-fade-in-up" style={{ animationDelay: "40ms" }}>
          <h1 className="font-display text-5xl leading-none tracking-wide text-white">
            SCHEDULE
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            Ready-made warm-ups, picked for you. Tap one and go.
          </p>
        </section>

        {/* Today's pick */}
        <PresetHero
          preset={todaysPreset}
          onStart={() => startPreset(todaysPreset)}
          plan={buildPresetPlan(todaysPreset, profile, records)}
        />

        {/* All presets */}
        <p
          className="mt-6 mb-3 text-[10px] uppercase tracking-widest text-neutral-400 anim-fade-in-up"
          style={{ animationDelay: "240ms" }}
        >
          All Presets
        </p>
        <div className="space-y-3">
          {otherPresets.map((preset, idx) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              plan={buildPresetPlan(preset, profile, records)}
              onStart={() => startPreset(preset)}
              delay={300 + idx * 70}
            />
          ))}
        </div>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/98 backdrop-blur border-t border-[#1e1e1e] z-30">
        <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-around">
          {[
            { id: "home", icon: Home, label: "Home", to: "/dashboard" as const },
            { id: "schedule", icon: Calendar, label: "Schedule", to: "/schedule" as const },
            { id: "profile", icon: User, label: "Profile", to: "/profile" as const },
          ].map(({ id, icon: Icon, label, to }) => {
            const active = id === "schedule";
            return (
              <button
                key={id}
                onClick={() => navigate({ to })}
                className="flex flex-col items-center gap-1 px-4 py-1 press"
                style={{
                  color: active ? "#C8F135" : "#737373",
                  transition: "color 0.25s var(--ease-soft), transform 0.25s var(--ease-spring)",
                  transform: active ? "scale(1.08)" : "scale(1)",
                  filter: active ? "drop-shadow(0 0 8px rgba(200,241,53,0.4))" : "none",
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium tracking-wide">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

interface CardProps {
  preset: Preset;
  plan: ReturnType<typeof buildPresetPlan>;
  onStart: () => void;
}

function PresetHero({ preset, plan, onStart }: CardProps) {
  return (
    <section
      className="mt-4 rounded-2xl border border-[#C8F135]/40 bg-gradient-to-br from-[#1a1f0a] to-[#111111] p-5 anim-fade-in-up hover-lift"
      style={{ animationDelay: "120ms" }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#C8F135]/15 flex items-center justify-center shrink-0 anim-pulse-soft">
          <Sparkles className="w-5 h-5 text-[#C8F135]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-[#C8F135]">
            Today's Pick
          </p>
          <p className="mt-1 font-display text-xl tracking-wide text-white">
            {preset.name.toUpperCase()}
          </p>
          <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
            {preset.blurb}
          </p>
        </div>
      </div>

      <PresetMeta preset={preset} />
      <PreviewRow plan={plan} />

      <button
        onClick={onStart}
        className="mt-4 w-full py-3 rounded-lg font-display text-base tracking-wider bg-[#C8F135] text-black hover:brightness-110 transition flex items-center justify-center gap-2 hover-lift press"
      >
        <Play className="w-4 h-4" />
        START NOW
      </button>
    </section>
  );
}

function PresetCard({
  preset,
  plan,
  onStart,
  delay,
}: CardProps & { delay: number }) {
  return (
    <article
      className="rounded-2xl border border-[#1e1e1e] bg-[#111111] p-4 anim-fade-in-up hover-lift"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-base tracking-wide text-white">
            {preset.name.toUpperCase()}
          </p>
          <p className="mt-0.5 text-[11px] text-neutral-400 leading-relaxed">
            {preset.blurb}
          </p>
        </div>
        <span className="px-2 py-1 rounded-full text-[10px] font-medium tracking-wide bg-[#0a0a0a] text-[#C8F135] border border-[#C8F135]/30 shrink-0">
          {preset.focus}
        </span>
      </div>

      <PresetMeta preset={preset} />
      <PreviewRow plan={plan} />

      <button
        onClick={onStart}
        className="mt-3 w-full py-2.5 rounded-lg font-display text-sm tracking-wider border-2 border-[#C8F135] text-[#C8F135] hover:bg-[#C8F135]/10 transition flex items-center justify-center gap-2 press"
      >
        <Play className="w-4 h-4" />
        START
      </button>
    </article>
  );
}

function PresetMeta({ preset }: { preset: Preset }) {
  return (
    <div className="mt-3 flex items-center gap-4 text-[11px] text-neutral-400">
      <span className="inline-flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5" />
        {preset.size} exercises
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        ~{preset.durationMin} min
      </span>
    </div>
  );
}

function PreviewRow({ plan }: { plan: ReturnType<typeof buildPresetPlan> }) {
  return (
    <div className="mt-3 flex items-center gap-2 overflow-hidden">
      {plan.picks.slice(0, 4).map((p) => (
        <div
          key={p.exercise.id}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0a0a0a] border border-[#1e1e1e] min-w-0"
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: phaseColor(p.exercise.phase) }}
          />
          <span className="text-[10px] text-neutral-300 truncate max-w-[110px]">
            {p.exercise.name}
          </span>
        </div>
      ))}
      {plan.picks.length > 4 && (
        <span className="text-[10px] text-neutral-500 shrink-0">
          +{plan.picks.length - 4}
        </span>
      )}
    </div>
  );
}
