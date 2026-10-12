import type * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";

type Enrollments = {
  ids: string[];
  has: (trainingId: string) => boolean;
  enroll: (trainingId: string) => Promise<void>;
  unenroll: (trainingId: string) => Promise<void>;
};

const g = globalThis as unknown as { __estgTrainingContext?: React.Context<Enrollments | null> };
const Context = (g.__estgTrainingContext ??= createContext<Enrollments | null>(null));

/** Inschrijvingen per gebruikersaccount (tabel training_enrollments), illustratief: geen echt inschrijfsysteem. */
export function TrainingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const userId = user?.id;
  // Telt wijzigingen door de gebruiker, zodat een trage eerste fetch die niet meer overschrijft.
  const edits = useRef(0);

  useEffect(() => {
    if (!userId) {
      setIds([]);
      return;
    }
    let active = true;
    const seen = edits.current;
    supabase
      .from("training_enrollments")
      .select("training_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (active && edits.current === seen) setIds((data ?? []).map((r) => r.training_id));
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const change = useCallback(
    async (trainingId: string, add: boolean) => {
      if (!userId) return;
      edits.current += 1;
      setIds((prev) => (add ? [trainingId, ...prev] : prev.filter((x) => x !== trainingId)));
      const { error } = add
        ? await supabase
            .from("training_enrollments")
            .insert({ user_id: userId, training_id: trainingId })
        : await supabase
            .from("training_enrollments")
            .delete()
            .eq("user_id", userId)
            .eq("training_id", trainingId);
      if (error) {
        setIds((prev) => (add ? prev.filter((x) => x !== trainingId) : [trainingId, ...prev]));
        toast.error("Opslaan is niet gelukt. Probeer het opnieuw.");
      }
    },
    [userId],
  );

  const value = useMemo<Enrollments>(
    () => ({
      ids,
      has: (id) => ids.includes(id),
      enroll: (id) => change(id, true),
      unenroll: (id) => change(id, false),
    }),
    [ids, change],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useTrainings() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("TrainingsProvider required");
  return ctx;
}
