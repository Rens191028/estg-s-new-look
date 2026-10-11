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
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";

type Favorites = {
  ids: string[];
  has: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
};

const g = globalThis as unknown as { __estgFavContext?: React.Context<Favorites | null> };
const Context = (g.__estgFavContext ??= createContext<Favorites | null>(null));

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
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
      .from("favorites")
      .select("product_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (active && edits.current === seen) setIds((data ?? []).map((r) => r.product_id));
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const toggle = useCallback(
    async (productId: string) => {
      if (!userId) {
        toast("Log in om favorieten op te slaan", {
          action: { label: "Inloggen", onClick: () => navigate({ to: "/inloggen" }) },
        });
        return;
      }
      edits.current += 1;
      const had = ids.includes(productId);
      setIds((prev) => (had ? prev.filter((x) => x !== productId) : [productId, ...prev]));
      const { error } = had
        ? await supabase
            .from("favorites")
            .delete()
            .eq("user_id", userId)
            .eq("product_id", productId)
        : await supabase.from("favorites").insert({ user_id: userId, product_id: productId });
      if (error) {
        setIds((prev) => (had ? [productId, ...prev] : prev.filter((x) => x !== productId)));
        toast.error("Opslaan is niet gelukt. Probeer het opnieuw.");
      }
    },
    [userId, ids, navigate],
  );

  const value = useMemo<Favorites>(
    () => ({ ids, has: (id) => ids.includes(id), toggle }),
    [ids, toggle],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useFavorites() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("FavoritesProvider required");
  return ctx;
}
