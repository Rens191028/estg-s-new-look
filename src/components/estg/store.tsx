import type * as React from "react";
import { createContext, useContext, useState, type ReactNode } from "react";

type Item = { id: string; quantity: number };
type Store = {
  items: Item[];
  projectName: string;
  count: number;
  add: (id: string, quantity?: number) => void;
  update: (id: string, quantity: number) => void;
  setProjectName: (name: string) => void;
};
// Keep one context instance across hot reloads so provider and consumers always match.
const g = globalThis as unknown as { __estgStoreContext?: React.Context<Store | null> };
const Context = (g.__estgStoreContext ??= createContext<Store | null>(null));
export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [projectName, setProjectName] = useState("");
  const add = (id: string, quantity = 1) =>
    setItems((prev) => {
      const old = prev.find((x) => x.id === id);
      return old
        ? prev.map((x) => (x.id === id ? { ...x, quantity: x.quantity + quantity } : x))
        : [...prev, { id, quantity }];
    });
  const update = (id: string, quantity: number) =>
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((x) => x.id !== id)
        : prev.map((x) => (x.id === id ? { ...x, quantity } : x)),
    );
  const count = items.reduce((a, x) => a + x.quantity, 0);
  return (
    <Context.Provider value={{ items, projectName, count, add, update, setProjectName }}>
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const store = useContext(Context);
  if (!store) throw new Error("StoreProvider required");
  return store;
}
