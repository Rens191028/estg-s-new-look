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
import { addToCompare, MAX_COMPARE } from "@/lib/compare";

const STORAGE_KEY = "estg_compare_list";

type Compare = {
  ids: string[];
  isFull: boolean;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const g = globalThis as unknown as { __estgCompareContext?: React.Context<Compare | null> };
const Context = (g.__estgCompareContext ??= createContext<Compare | null>(null));

function readStored(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string").slice(0, MAX_COMPARE)
      : [];
  } catch {
    return [];
  }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  // Pas na hydratie lezen, zodat server en client dezelfde eerste render hebben.
  useEffect(() => {
    setIds(readStored());
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* opslag niet beschikbaar: de lijst blijft in het geheugen */
    }
  }, [ids, ready]);

  const toggle = useCallback(
    (id: string) =>
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : addToCompare(prev, id))),
    [],
  );
  const remove = useCallback((id: string) => setIds((prev) => prev.filter((x) => x !== id)), []);
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo<Compare>(
    () => ({
      ids,
      isFull: ids.length >= MAX_COMPARE,
      has: (id) => ids.includes(id),
      toggle,
      remove,
      clear,
    }),
    [ids, toggle, remove, clear],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useCompare() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("CompareProvider required");
  return ctx;
}
