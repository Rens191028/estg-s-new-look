import type * as React from "react";
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

export type Profile = {
  full_name: string | null;
  company_name: string | null;
  email: string | null;
  vat_number: string | null;
};

type SignUpInput = { fullName: string; companyName: string; email: string; password: string };
type Auth = {
  user: User | null;
  profile: Profile | null;
  /** true zolang de sessie nog wordt opgehaald (eerste render na hydratie). */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (input: SignUpInput) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  saveProfile: (
    patch: Partial<Pick<Profile, "full_name" | "company_name" | "vat_number">>,
  ) => Promise<{ error: string | null }>;
};

const g = globalThis as unknown as { __estgAuthContext?: React.Context<Auth | null> };
const Context = (g.__estgAuthContext ??= createContext<Auth | null>(null));

const dutchError = (message: string) => {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "E-mailadres of wachtwoord klopt niet.";
  if (m.includes("already registered")) return "Er bestaat al een account met dit e-mailadres.";
  if (m.includes("password")) return "Kies een sterker wachtwoord (minimaal 8 tekens).";
  if (m.includes("email")) return "Controleer je e-mailadres.";
  return "Er ging iets mis. Probeer het opnieuw.";
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const user = session?.user ?? null;

  // Sessiestatus live bijhouden, zodat header en pagina's direct meebewegen bij in- en uitloggen.
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const userId = user?.id;
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }
    let active = true;
    supabase
      .from("profiles")
      .select("full_name, company_name, email, vat_number")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (active)
          setProfile(
            data ?? {
              full_name: null,
              company_name: null,
              email: user?.email ?? null,
              vat_number: null,
            },
          );
      });
    return () => {
      active = false;
    };
  }, [userId, user?.email]);

  const signIn = useCallback<Auth["signIn"]>(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? dutchError(error.message) : null };
  }, []);

  const signUp = useCallback<Auth["signUp"]>(async ({ fullName, companyName, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, company_name: companyName } },
    });
    if (error) return { error: dutchError(error.message), needsConfirmation: false };
    // Het profiel wordt door een databasetrigger aangemaakt; zonder sessie wacht de gebruiker op de bevestigingsmail.
    return { error: null, needsConfirmation: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const saveProfile = useCallback<Auth["saveProfile"]>(
    async (patch) => {
      if (!userId) return { error: "Je bent niet ingelogd." };
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, email: user?.email ?? null, ...patch });
      if (error) return { error: "Opslaan is niet gelukt. Probeer het opnieuw." };
      setProfile((p) => ({
        full_name: null,
        company_name: null,
        email: user?.email ?? null,
        vat_number: null,
        ...p,
        ...patch,
      }));
      return { error: null };
    },
    [userId, user?.email],
  );

  const value = useMemo<Auth>(
    () => ({ user, profile, loading, signIn, signUp, signOut, saveProfile }),
    [user, profile, loading, signIn, signUp, signOut, saveProfile],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAuth() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("AuthProvider required");
  return ctx;
}

export const firstName = (profile: Profile | null) =>
  profile?.full_name?.trim().split(/\s+/)[0] || "Account";
