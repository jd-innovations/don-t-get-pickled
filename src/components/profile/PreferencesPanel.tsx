import { Link } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import type { UserProfile } from "@/contexts/UserProfileContext";

interface Props {
  profile: UserProfile;
  onReset: () => void;
}

export function PreferencesPanel({ profile, onReset }: Props) {
  return (
    <section
      className="rounded-2xl border border-[#1e1e1e] bg-[#111111] p-5 anim-fade-in-up"
      style={{ animationDelay: "360ms" }}
    >
      <p className="text-[10px] uppercase tracking-widest text-[#C8F135] mb-3">
        Profile &amp; Preferences
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Row label="AGE" value={profile.ageRange} />
        <Row label="FITNESS" value={profile.fitnessLevel} />
        <Row label="PLAYS" value={profile.playFrequency} />
        <Row label="GENDER" value={profile.gender} />
      </div>

      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
          Goals
        </p>
        <Tags items={profile.goals} />
      </div>

      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
          Injuries / sensitivities
        </p>
        <Tags items={profile.injuries} empty="None reported" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link
          to="/onboarding"
          className="py-2.5 rounded-lg text-xs font-medium border border-[#1e1e1e] bg-[#0a0a0a] text-neutral-200 hover:border-[#C8F135]/40 hover:text-[#C8F135] transition flex items-center justify-center gap-2 hover-lift press"
        >
          <Pencil className="w-3.5 h-3.5" /> EDIT PROFILE
        </Link>
        <button
          onClick={onReset}
          className="py-2.5 rounded-lg text-xs font-medium border border-red-500/20 bg-red-500/5 text-red-300 hover:bg-red-500/10 transition flex items-center justify-center gap-2 press"
        >
          <Trash2 className="w-3.5 h-3.5" /> RESET PROFILE
        </button>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-[#C8F135] font-semibold">
        {label}
      </p>
      <p className="mt-1 text-sm text-white font-medium">{value ?? "—"}</p>
    </div>
  );
}

function Tags({ items, empty }: { items: string[]; empty?: string }) {
  if (items.length === 0) {
    return (
      <p className="text-xs text-neutral-500 italic">{empty ?? "Not set"}</p>
    );
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span
          key={t}
          className="px-2.5 py-1 rounded-full text-[11px] bg-[#0a0a0a] border border-[#1e1e1e] text-neutral-300"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
