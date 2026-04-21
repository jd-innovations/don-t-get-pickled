import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface UserProfile {
  gender: string | null;
  ageRange: string | null;
  fitnessLevel: string | null;
  playFrequency: string | null;
  injuries: string[];
  goals: string[];
}

const EMPTY: UserProfile = {
  gender: null,
  ageRange: null,
  fitnessLevel: null,
  playFrequency: null,
  injuries: [],
  goals: [],
};

const STORAGE_KEY = "dgp:profile";

interface ContextShape {
  profile: UserProfile;
  hasProfile: boolean;
  setProfile: (partial: Partial<UserProfile>) => void;
  clearProfile: () => void;
}

const UserProfileContext = createContext<ContextShape | null>(null);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(EMPTY);
  const [hasProfile, setHasProfile] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<UserProfile>;
        setProfileState({ ...EMPTY, ...parsed });
        setHasProfile(true);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const setProfile = (partial: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...partial };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    setHasProfile(true);
  };

  const clearProfile = () => {
    setProfileState(EMPTY);
    setHasProfile(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <UserProfileContext.Provider
      value={{ profile, hasProfile: hydrated && hasProfile, setProfile, clearProfile }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
}
