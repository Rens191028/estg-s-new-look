import { createContext, useContext, useState, type ReactNode } from 'react';
type Item = { id: string; quantity: number };
type Store = { items: Item[]; add: (id: string, quantity?: number) => void; update: (id: string, quantity: number) => void };
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const add = (id: string, quantity = 1) => setItems(prev => { const old = prev.find(x => x.id === id); return old ? prev.map(x => x.id === id ? { ...x, quantity: x.quantity + quantity } : x) : [...prev, { id, quantity }]; });
  const update = (id: string, quantity: number) => setItems(prev => quantity <= 0 ? prev.filter(x => x.id !== id) : prev.map(x => x.id === id ? { ...x, quantity } : x));
  return <Context.Provider value={{ items, add, update }}>{children}</Context.Provider>;
}
export function useStore() { const store = useContext(Context); if (!store) throw new Error('StoreProvider required'); return store; }
