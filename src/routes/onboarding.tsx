import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { BrandLogo } from "@/components/BrandLogo";

type EditFrom = "/dashboard" | "/profile";

export const Route = createFileRoute("/onboarding")({
  validateSearch: (s: Record<string, unknown>) => {
    const edit = s.edit === 1 || s.edit === "1" || s.edit === true;
    const fromRaw = typeof s.from === "string" ? s.from : "/dashboard";
    const from: EditFrom = fromRaw === "/profile" ? "/profile" : "/dashboard";
    return { edit, from };
  },
  head: ({ match }) => {
    const isEdit = (match.search as { edit?: boolean } | undefined)?.edit;
    return {
      meta: [
        {
          title: isEdit
            ? "Edit Your Profile — Don't Get Pickled"
            : "Create Your Profile — Don't Get Pickled",
        },
        {
          name: "description",
          content: isEdit
            ? "Update your personalized pickleball warm up plan."
            : "Build your personalized pickleball warm up plan in 6 quick steps.",
        },
      ],
    };
  },
  component: Onboarding,
});

type Stage = "questions" | "done";

const sexOptions = ["Male", "Female", "Prefer Not to Say"];
const ageOptions = [
  { label: "21–35", desc: "Young adult" },
  { label: "36–49", desc: "Prime years" },
  { label: "50–64", desc: "Stay strong & mobile" },
  { label: "65+", desc: "Play smart, play long" },
];
const fitnessOptions = [
  { label: "Beginner", desc: "Just getting started" },
  { label: "Moderate", desc: "Active a few times a week" },
  { label: "Active", desc: "Workout regularly" },
  { label: "Athlete", desc: "Train with intent" },
];
const frequencyOptions = [
  { label: "Once a Week", desc: "Casual play" },
  { label: "2–3 Times a Week", desc: "Regular player" },
  { label: "4–5 Times a Week", desc: "Serious player" },
  { label: "Daily / Competing", desc: "Tournament ready" },
];
const injuryOptions = [
  "Elbow/Wrist",
  "Shoulder",
  "Lower Back",
  "Hip",
  "Knee",
  "Ankle/Achilles",
  "Neck",
  "Hamstring",
  "None",
];
const goalOptions = [
  "Mobility & Flexibility",
  "Core Strength",
  "Balance & Stability",
  "Shoulder Health",
  "Leg Power",
  "Injury Prevention",
  "Shot Power",
  "Endurance on Court",
  "Recovery Speed",
  "Overall Fitness",
];

function Onboarding() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { profile, hasProfile, setProfile } = useUserProfile();
  const isEdit = search.edit || hasProfile;

  const [stage, setStage] = useState<Stage>("questions");
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const [sex, setSex] = useState<string | null>(profile.gender);
  const [age, setAge] = useState<string | null>(profile.ageRange);
  const [fitness, setFitness] = useState<string | null>(profile.fitnessLevel);
  const [frequency, setFrequency] = useState<string | null>(profile.playFrequency);
  const [injuries, setInjuries] = useState<string[]>(profile.injuries);
  const [goals, setGoals] = useState<string[]>(profile.goals);

  const totalSteps = 6;

  const canProceed = () => {
    switch (step) {
      case 0:
        return !!sex;
      case 1:
        return !!age;
      case 2:
        return !!fitness;
      case 3:
        return !!frequency;
      case 4:
        return injuries.length > 0;
      case 5:
        return goals.length > 0;
      default:
        return false;
    }
  };

  const next = () => {
    setDirection("forward");
    if (step === totalSteps - 1) {
      setProfile({
        gender: sex,
        ageRange: age,
        fitnessLevel: fitness,
        playFrequency: frequency,
        injuries,
        goals,
      });
      if (isEdit) {
        navigate({ to: search.from });
      } else {
        setStage("done");
      }
    } else {
      setStep(step + 1);
    }
  };

  const back = () => {
    setDirection("back");
    if (step === 0) {
      navigate({ to: isEdit ? search.from : "/dashboard" });
    } else {
      setStep(step - 1);
    }
  };

  const toggleInjury = (val: string) => {
    if (val === "None") {
      setInjuries(["None"]);
      return;
    }
    setInjuries((prev) => {
      const without = prev.filter((p) => p !== "None");
      return without.includes(val) ? without.filter((p) => p !== val) : [...without, val];
    });
  };

  const toggleGoal = (val: string) => {
    setGoals((prev) => {
      if (prev.includes(val)) return prev.filter((p) => p !== val);
      if (prev.length >= 3) return prev;
      return [...prev, val];
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1e1e1e]">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
          <BrandLogo />
          {isEdit ? (
            <Link
              to={search.from}
              className="text-sm text-neutral-400 hover:text-white"
            >
              Cancel
            </Link>
          ) : (
            <Link to="/dashboard" className="text-sm text-neutral-400 hover:text-white">
              Skip for now
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 py-8">
        {stage === "questions" && (
          <div>
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={back}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  ← Back
                </button>
                <span className="text-xs text-neutral-500">
                  {step + 1} of {totalSteps}
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#1e1e1e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C8F135] transition-all duration-500 shimmer-overlay"
                  style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-3">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: i <= step ? "#C8F135" : "#2a2a2a",
                      transition: "background-color 0.3s var(--ease-soft), transform 0.3s var(--ease-spring)",
                      transform: i <= step ? "scale(1.25)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </div>

            <div
              key={step}
              className={direction === "forward" ? "anim-slide-in-right" : "anim-slide-in-left"}
            >
              {step === 0 && (
                <Question title="WHAT'S YOUR BIOLOGICAL SEX?">
                  <div className="grid grid-cols-2 gap-3">
                    {sexOptions.slice(0, 2).map((opt) => (
                      <OptionCard
                        key={opt}
                        label={opt}
                        selected={sex === opt}
                        onClick={() => setSex(opt)}
                      />
                    ))}
                  </div>
                  <div className="mt-3">
                    <OptionCard
                      label="Prefer Not to Say"
                      selected={sex === "Prefer Not to Say"}
                      onClick={() => setSex("Prefer Not to Say")}
                    />
                  </div>
                </Question>
              )}

              {step === 1 && (
                <Question title="HOW OLD ARE YOU?">
                  <div className="space-y-3">
                    {ageOptions.map((opt) => (
                      <OptionCard
                        key={opt.label}
                        label={opt.label}
                        desc={opt.desc}
                        selected={age === opt.label}
                        onClick={() => setAge(opt.label)}
                      />
                    ))}
                  </div>
                </Question>
              )}

              {step === 2 && (
                <Question title="WHAT'S YOUR FITNESS LEVEL?">
                  <div className="space-y-3">
                    {fitnessOptions.map((opt) => (
                      <OptionCard
                        key={opt.label}
                        label={opt.label}
                        desc={opt.desc}
                        selected={fitness === opt.label}
                        onClick={() => setFitness(opt.label)}
                      />
                    ))}
                  </div>
                </Question>
              )}

              {step === 3 && (
                <Question title="HOW OFTEN DO YOU PLAY?">
                  <div className="space-y-3">
                    {frequencyOptions.map((opt) => (
                      <OptionCard
                        key={opt.label}
                        label={opt.label}
                        desc={opt.desc}
                        selected={frequency === opt.label}
                        onClick={() => setFrequency(opt.label)}
                      />
                    ))}
                  </div>
                </Question>
              )}

              {step === 4 && (
                <Question title="ANY CURRENT INJURIES OR PAIN?" subtitle="Select all that apply">
                  <div className="flex flex-wrap gap-2">
                    {injuryOptions.map((opt) => {
                      const selected = injuries.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleInjury(opt)}
                          className="px-4 py-2 rounded-full text-sm font-medium border press hover-lift"
                          style={{
                            borderColor: selected ? "#ef4444" : "#1e1e1e",
                            backgroundColor: selected ? "#ef4444" : "#111111",
                            color: selected ? "white" : "#d4d4d4",
                            transition: "background-color 0.25s var(--ease-soft), border-color 0.25s var(--ease-soft), color 0.25s var(--ease-soft), transform 0.25s var(--ease-spring)",
                            transform: selected ? "scale(1.05)" : "scale(1)",
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </Question>
              )}

              {step === 5 && (
                <Question
                  title="WHAT WOULD YOU LIKE TO IMPROVE?"
                  subtitle={`Pick up to 3 (${goals.length}/3)`}
                >
                  <div className="flex flex-wrap gap-2">
                    {goalOptions.map((opt) => {
                      const selected = goals.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleGoal(opt)}
                          className="px-4 py-2 rounded-full text-sm font-medium border press hover-lift"
                          style={{
                            borderColor: selected ? "#C8F135" : "#1e1e1e",
                            backgroundColor: selected ? "#C8F135" : "#111111",
                            color: selected ? "black" : "#d4d4d4",
                            transition: "background-color 0.25s var(--ease-soft), border-color 0.25s var(--ease-soft), color 0.25s var(--ease-soft), transform 0.25s var(--ease-spring)",
                            transform: selected ? "scale(1.05)" : "scale(1)",
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </Question>
              )}
            </div>

            <button
              onClick={next}
              disabled={!canProceed()}
              className="mt-8 w-full py-3 rounded-lg font-display text-lg tracking-wider bg-[#C8F135] text-black disabled:opacity-30 disabled:cursor-not-allowed transition hover-lift press"
            >
              {step === totalSteps - 1 ? (isEdit ? "SAVE CHANGES" : "FINISH") : "NEXT"}
            </button>
          </div>
        )}

        {stage === "done" && (
          <div className="text-center py-8">
            <div className="text-7xl mb-6 anim-bounce-in">🥒</div>
            <h2
              className="font-display text-4xl tracking-wide text-white anim-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              YOU WON'T GET PICKLED
            </h2>
            <p
              className="mt-3 text-sm text-neutral-400 anim-fade-in-up"
              style={{ animationDelay: "320ms" }}
            >
              Your personalized warm up plan is ready. Here's your welcome gift.
            </p>

            <div
              className="mt-8 rounded-xl border border-[#C8F135]/40 bg-[#111111] p-6 anim-scale-in anim-pulse-glow"
              style={{ animationDelay: "440ms" }}
            >
              <p className="text-xs uppercase tracking-widest text-[#C8F135] mb-2">
                Welcome Gift
              </p>
              <p className="font-display text-3xl tracking-wide text-white">
                $10 GRIP DOCTOR CREDIT
              </p>
              <div className="mt-4 px-4 py-3 rounded-lg bg-[#0a0a0a] border border-dashed border-[#C8F135]/50">
                <p className="text-xs text-neutral-400 mb-1">Your code</p>
                <p className="font-mono font-bold tracking-widest text-[#C8F135]">
                  PICKLED10
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="mt-8 w-full py-3 rounded-lg font-display text-lg tracking-wider bg-[#C8F135] text-black hover:brightness-110 transition hover-lift press anim-fade-in-up"
              style={{ animationDelay: "640ms" }}
            >
              VIEW MY PLAN
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function Question({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-3xl tracking-wide text-white leading-tight">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-neutral-400">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function OptionCard({
  label,
  desc,
  selected,
  onClick,
}: {
  label: string;
  desc?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border bg-[#111111] hover-lift press"
      style={{
        borderColor: selected ? "#C8F135" : "#1e1e1e",
        backgroundColor: selected ? "rgba(200, 241, 53, 0.08)" : "#111111",
        boxShadow: selected ? "var(--shadow-lime)" : undefined,
        transition: "border-color 0.25s var(--ease-soft), background-color 0.25s var(--ease-soft), box-shadow 0.25s var(--ease-soft), transform 0.25s var(--ease-soft)",
      }}
    >
      <div
        className="font-display text-xl tracking-wide"
        style={{ color: selected ? "#C8F135" : "white" }}
      >
        {label}
      </div>
      {desc && <div className="text-xs text-neutral-400 mt-0.5">{desc}</div>}
    </button>
  );
}
