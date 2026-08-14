import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Tone = "Formal" | "Friendly" | "Persuasive" | "Empathetic";

export type Profile = {
  id: string;
  display_name: string;
  preferred_tone: Tone;
  dark_mode: boolean;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  updateProfile: (patch: Partial<Omit<Profile, "id">>) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (!next) setProfile(null);
      setLoading(false);
    });
    void supabase.auth.getSession().then(({ data: { session: current } }) => {
      setSession(current);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, preferred_tone, dark_mode")
        .eq("id", userId)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        setProfile(data as Profile);
      } else {
        const { data: created } = await supabase
          .from("profiles")
          .insert({ id: userId })
          .select("id, display_name, preferred_tone, dark_mode")
          .maybeSingle();
        if (!cancelled && created) setProfile(created as Profile);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", Boolean(profile?.dark_mode));
  }, [profile?.dark_mode]);

  const updateProfile = useCallback(
    async (patch: Partial<Omit<Profile, "id">>) => {
      if (!userId) return;
      setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
      await supabase.from("profiles").update(patch).eq("id", userId);
    },
    [userId],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
    document.documentElement.classList.remove("dark");
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      updateProfile,
      signOut,
    }),
    [session, profile, loading, updateProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
