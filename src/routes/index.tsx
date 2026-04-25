import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ExerciseCard } from "@/components/ExerciseCard";
import { PhaseDivider } from "@/components/PhaseDivider";
import { exercises, type Phase } from "@/data/exercises";
import { useUserProfile } from "@/contexts/UserProfileContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Don't Get Pickled — Free Pickleball Warm Up Guide" },
      {
        name: "description",
        content:
          "6 chair-based warm up moves for pickleball players 40+. Prevent injury and play longer.",
      },
      { property: "og:title", content: "Don't Get Pickled — Free Warm Up Guide" },
      {
        property: "og:description",
        content: "Chair-based warm up moves for pickleball players 40+.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const phases: Phase[] = ["Warm-Up", "Mobility", "Strength"];
  const { hasProfile } = useUserProfile();
  const ctaRef = useRef<HTMLDivElement>(null);

  const scrollToCta = () => {
    ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1e1e1e]">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
          <span className="font-display text-xl tracking-wider text-[#C8F135]">
            DON'T GET PICKLED
          </span>
          <button className="text-sm text-neutral-400 hover:text-white transition-colors">
            Sign In
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5">
        {/* Hero */}
        <section className="pt-8 pb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C8F135] font-semibold mb-3">
            {hasProfile ? "Your Full Guide" : "Free Warm Up Guide"}
          </p>
          <h1 className="font-display text-6xl leading-[0.95] tracking-wide text-white">
            DON'T GET
            <br />
            PICKLED
          </h1>
          <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
            {hasProfile
              ? "All 18 chair-based moves unlocked — tap any move to activate"
              : "6 free chair-based moves for pickleball players 40+ — unlock 12 more with your free profile"}
          </p>
        </section>

        {/* Exercises */}
        <section>
          {phases.map((phase) => {
            const items = exercises.filter((e) => e.phase === phase);
            const phaseNum = phases.indexOf(phase) + 1;
            return (
              <div key={phase}>
                <PhaseDivider phase={phase} label={`PHASE ${phaseNum} · ${phase.toUpperCase()}`} />
                <div className="space-y-3">
                  {items.map((ex) => (
                    <ExerciseCard
                      key={ex.id}
                      exercise={ex}
                      locked={!hasProfile && !ex.isFree}
                      onLockedClick={scrollToCta}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Sticky CTA */}
      <div
        ref={ctaRef}
        className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/98 backdrop-blur z-30"
        style={{ borderTop: "1px solid #C8F135" }}
      >
        <div className="max-w-md mx-auto px-5 py-4">
          <p className="text-xs text-neutral-300 text-center mb-2">
            {hasProfile
              ? "Start your personalized session"
              : "Want all 18 exercises + your personalized schedule?"}
          </p>
          <Link
            to={hasProfile ? "/dashboard" : "/onboarding"}
            className="block w-full text-center py-3 rounded-lg font-display text-lg tracking-wider bg-[#C8F135] text-black hover:brightness-110 transition"
          >
            {hasProfile ? "GO TO DASHBOARD" : "UNLOCK FREE GUIDE"}
          </Link>
        </div>
      </div>
    </div>
  );
}
