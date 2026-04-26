import { Lock } from "lucide-react";
import type { Achievement } from "@/lib/achievements";

interface Props {
  achievements: Achievement[];
}

export function AchievementsGrid({ achievements }: Props) {
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <section
      className="rounded-2xl border border-[#1e1e1e] bg-[#111111] p-5 anim-fade-in-up"
      style={{ animationDelay: "200ms" }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-widest text-[#C8F135]">
          Achievements
        </p>
        <p className="text-[11px] text-neutral-400">
          {unlocked} / {achievements.length} unlocked
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {achievements.map((a, i) => {
          const Icon = a.icon;
          return (
            <div
              key={a.id}
              className={`rounded-xl border p-3 anim-fade-in-up ${
                a.unlocked
                  ? "border-[#C8F135]/40 bg-gradient-to-br from-[#1a1f0a] to-[#111111]"
                  : "border-[#1e1e1e] bg-[#0a0a0a] opacity-70"
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    a.unlocked
                      ? "bg-[#C8F135]/15 text-[#C8F135]"
                      : "bg-[#1e1e1e] text-neutral-500"
                  }`}
                >
                  {a.unlocked ? (
                    <Icon className="w-4 h-4" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </div>
              </div>
              <p
                className={`mt-2 font-display text-sm tracking-wide ${
                  a.unlocked ? "text-white" : "text-neutral-400"
                }`}
              >
                {a.label}
              </p>
              <p className="mt-0.5 text-[10px] text-neutral-500 leading-snug">
                {a.description}
              </p>
              <div className="mt-2 h-1 w-full bg-[#0a0a0a] rounded-full overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${a.progress * 100}%`,
                    backgroundColor: a.unlocked ? "#C8F135" : "#3a3a3a",
                  }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-neutral-500">
                {a.progressText}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
