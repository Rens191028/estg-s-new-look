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
import { supabase } from "@/integrations/supabase/client";
import { toOrder, trackingNumber, type Order, type OrderLine, type OrderRow } from "@/lib/orders";
import type { OrderTotals } from "@/lib/pricing";
import { useAuth } from "./auth";

export type NewOrder = {
  lines: OrderLine[];
  totals: OrderTotals;
  shipDate: string;
  reference: string;
  contact: { name: string; company: string; email: string };
};

type Orders = {
  orders: Order[];
  loading: boolean;
  /** Slaat de (fictieve) bestelling op; geeft de opgeslagen bestelling terug of een foutmelding. */
  place: (input: NewOrder) => Promise<{
    order: Order | null;
    error: string | null;
    /** true als de database niet bereikbaar was en de bestelling alleen in deze browser is bewaard. */
    local: boolean;
  }>;
};

const g = globalThis as unknown as { __estgOrdersContext?: React.Context<Orders | null> };
const Context = (g.__estgOrdersContext ??= createContext<Orders | null>(null));

const localKey = (userId: string) => `estg_orders_local_${userId}`;
function readLocal(userId: string): Order[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(localKey(userId)) ?? "[]");
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}
function writeLocal(userId: string, orders: Order[]) {
  try {
    localStorage.setItem(localKey(userId), JSON.stringify(orders.slice(0, 50)));
  } catch {
    /* opslag niet beschikbaar */
  }
}
const byNewest = (a: Order, b: Order) => b.created_at.localeCompare(a.created_at);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const edits = useRef(0);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      return;
    }
    let active = true;
    const seen = edits.current;
    setLoading(true);
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!active) return;
        if (edits.current === seen) {
          const remote = ((data ?? []) as OrderRow[]).map(toOrder);
          setOrders([...remote, ...readLocal(userId)].sort(byNewest));
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const place = useCallback<Orders["place"]>(
    async (input) => {
      if (!userId) return { order: null, error: "Niet ingelogd.", local: false };
      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          ship_date: input.shipDate,
          reference: input.reference.trim() || null,
          contact: input.contact,
          lines: input.lines as unknown as never,
          subtotal: input.totals.subtotal,
          shipping: input.totals.shipping,
          vat: input.totals.vat,
          total: input.totals.total,
          tracking_number: trackingNumber(`${userId}-${Date.now()}`),
        })
        .select("*")
        .single();
      edits.current += 1;
      if (error || !data) {
        // Database niet bereikbaar of tabel nog niet aangemaakt: bewaar de bestelling in deze browser,
        // zodat de bestelling zichtbaar blijft in het account. De echte fout gaat naar de melding.
        console.error("Bestelling opslaan in database mislukt:", error);
        const created = new Date().toISOString().slice(0, 19);
        const order: Order = {
          id: `local-${crypto.randomUUID()}`,
          created_at: created,
          ship_date: input.shipDate,
          reference: input.reference.trim() || null,
          lines: input.lines,
          totals: input.totals,
          tracking_number: trackingNumber(`${userId}-${created}`),
        };
        writeLocal(userId, [order, ...readLocal(userId)]);
        setOrders((prev) => [order, ...prev]);
        return { order, error: error?.message ?? "Opslaan mislukt.", local: true };
      }
      const order = toOrder(data as OrderRow);
      setOrders((prev) => [order, ...prev]);
      return { order, error: null, local: false };
    },
    [userId],
  );

  const value = useMemo(() => ({ orders, loading, place }), [orders, loading, place]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useOrders() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("OrdersProvider required");
  return ctx;
}
