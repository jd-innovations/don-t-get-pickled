import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LogOut, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useCloudSessions } from "@/hooks/useCloudSessions";
import { deriveAchievements } from "@/lib/achievements";
import { StatsPanel } from "@/components/profile/StatsPanel";
import { AchievementsGrid } from "@/components/profile/AchievementsGrid";
import { HistoryLog } from "@/components/profile/HistoryLog";
import { PreferencesPanel } from "@/components/profile/PreferencesPanel";
import { Home, Calendar, User } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Don't Get Pickled" },
      {
        name: "description",
        content:
          "Track your streak, achievements, and session history.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, signOut } = useAuth();
  const { profile, clearProfile } = useUserProfile();
  const { records, loading, streak, allTime, weekBuckets, migrated } =
    useCloudSessions();
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (migrated && migrated > 0) {
      setToast(`Synced ${migrated} past ${migrated === 1 ? "session" : "sessions"} to your account.`);
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [migrated]);

  const achievements = useMemo(() => deriveAchievements(records), [records]);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/dashboard" });
  };

  const handleResetProfile = () => {
    if (confirm("Reset your profile? You'll be taken through onboarding again.")) {
      clearProfile();
      navigate({ to: "/onboarding" });
    }
  };

  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Player";
  const initial = (displayName[0] || "P").toUpperCase();
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1e1e1e]">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
          <BrandLogo />
          <button
            onClick={handleSignOut}
            className="w-9 h-9 rounded-full bg-[#1e1e1e] flex items-center justify-center text-neutral-300 hover:text-[#C8F135] transition press"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 space-y-3">
        {/* Welcome header */}
        <section className="pt-8 pb-2 anim-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C8F135] to-[#7fa024] flex items-center justify-center text-3xl font-display text-black anim-scale-in">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-3xl leading-none tracking-wide text-white truncate">
                {displayName.toUpperCase()}
              </h1>
              <p className="mt-2 text-xs text-neutral-400 truncate">
                {user?.email}
              </p>
              {memberSince && (
                <p className="mt-0.5 text-[10px] uppercase tracking-widest text-neutral-600">
                  Member since {memberSince}
                </p>
              )}
            </div>
          </div>
        </section>

        {toast && (
          <div className="rounded-xl border border-[#C8F135]/30 bg-[#C8F135]/10 px-4 py-3 text-xs text-[#C8F135] flex items-center gap-2 anim-fade-in">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            {toast}
          </div>
        )}

        {loading ? (
          <div className="py-16 flex flex-col items-center gap-3 text-neutral-500">
            <Loader2 className="w-6 h-6 animate-spin text-[#C8F135]" />
            <p className="text-xs">Loading your stats…</p>
          </div>
        ) : (
          <>
            <StatsPanel
              streak={streak}
              allTime={allTime}
              weekBuckets={weekBuckets}
            />
            <AchievementsGrid achievements={achievements} />
            <HistoryLog records={records} />
            <PreferencesPanel
              profile={profile}
              onReset={handleResetProfile}
            />
          </>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/98 backdrop-blur border-t border-[#1e1e1e] z-30">
        <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-around">
          <NavTab to="/dashboard" icon={<Home className="w-5 h-5" />} label="Home" />
          <NavTab to="/dashboard" icon={<Calendar className="w-5 h-5" />} label="Schedule" />
          <NavTab
            to="/profile"
            icon={<User className="w-5 h-5" />}
            label="Profile"
            active
          />
        </div>
      </nav>
    </div>
  );
}

function NavTab({
  to,
  icon,
  label,
  active,
}: {
  to: "/dashboard" | "/profile";
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-1 px-4 py-1 press"
      style={{
        color: active ? "#C8F135" : "#737373",
        transition:
          "color 0.25s var(--ease-soft), transform 0.25s var(--ease-spring)",
        transform: active ? "scale(1.08)" : "scale(1)",
        filter: active ? "drop-shadow(0 0 8px rgba(200,241,53,0.4))" : "none",
      }}
    >
      {icon}
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </Link>
  );
}
