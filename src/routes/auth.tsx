import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";
import { BrandLogo } from "@/components/BrandLogo";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : "/profile",
  }),
  head: () => ({
    meta: [
      { title: "Sign In — Don't Get Pickled" },
      {
        name: "description",
        content: "Sign in to sync your sessions across devices.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, loading } = useAuth();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: redirect as "/profile" });
    }
  }, [user, loading, redirect, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${redirect}`,
            data: displayName ? { display_name: displayName } : undefined,
          },
        });
        if (err) throw err;
        setInfo(
          "Check your email to confirm your account, then sign in.",
        );
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        throw result.error;
      }
      if (result.redirected) {
        return;
      }
      navigate({ to: redirect as "/profile" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <Link
          to="/dashboard"
          className="flex justify-center mb-8"
          aria-label="Don't Get Pickled — Home"
        >
          <BrandLogo size="lg" />
        </Link>

        <div className="rounded-2xl border border-[#1e1e1e] bg-[#111111] p-6 anim-fade-in-up">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#C8F135]" />
            <p className="text-[10px] uppercase tracking-widest text-[#C8F135]">
              {mode === "signup" ? "Create account" : "Welcome back"}
            </p>
          </div>
          <h1 className="font-display text-3xl tracking-wide">
            {mode === "signup" ? "JOIN THE COURT" : "SIGN IN"}
          </h1>
          <p className="mt-2 text-xs text-neutral-400">
            Sync your sessions, profile, and progress across devices.
          </p>

          <button
            onClick={handleGoogle}
            disabled={busy}
            className="mt-5 w-full py-2.5 rounded-lg text-sm font-medium border border-[#1e1e1e] bg-[#0a0a0a] text-neutral-200 hover:border-[#C8F135]/40 transition disabled:opacity-50 flex items-center justify-center gap-2 hover-lift press"
          >
            <GoogleMark /> Continue with Google
          </button>

          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#1e1e1e]" />
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">
              or
            </span>
            <div className="flex-1 h-px bg-[#1e1e1e]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <Field
                label="Display name"
                type="text"
                value={displayName}
                onChange={setDisplayName}
                placeholder="Optional"
              />
            )}
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              required
              autoComplete="email"
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            {info && (
              <p className="text-xs text-[#C8F135] bg-[#C8F135]/10 border border-[#C8F135]/20 rounded-md px-3 py-2">
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-lg font-display text-sm tracking-wider bg-[#C8F135] text-black hover:brightness-110 transition disabled:opacity-50 hover-lift press"
            >
              {busy
                ? "..."
                : mode === "signup"
                  ? "CREATE ACCOUNT"
                  : "SIGN IN"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setError(null);
              setInfo(null);
            }}
            className="mt-4 w-full text-xs text-neutral-400 hover:text-[#C8F135] transition"
          >
            {mode === "signup"
              ? "Already have an account? Sign in"
              : "New here? Create an account"}
          </button>
        </div>

        <Link
          to="/dashboard"
          className="block mt-4 text-center text-[11px] text-neutral-500 hover:text-neutral-300 transition"
        >
          Continue without an account
        </Link>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-neutral-400">
        {label}
      </span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-[#0a0a0a] border border-[#1e1e1e] px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C8F135]/50 transition"
      />
    </label>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 16.3 3 9.6 7.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.9 26.8 37 24 37c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 40.6 16.2 45 24 45z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.1 5.3l6.2 5.2C40.9 36.6 45 31 45 24c0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}
