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
  place: (input: NewOrder) => Promise<{ order: Order | null; error: string | null }>;
};

const g = globalThis as unknown as { __estgOrdersContext?: React.Context<Orders | null> };
const Context = (g.__estgOrdersContext ??= createContext<Orders | null>(null));

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
        if (edits.current === seen) setOrders(((data ?? []) as OrderRow[]).map(toOrder));
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const place = useCallback<Orders["place"]>(
    async (input) => {
      if (!userId) return { order: null, error: "Niet ingelogd." };
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
      if (error || !data) return { order: null, error: error?.message ?? "Opslaan mislukt." };
      const order = toOrder(data as OrderRow);
      edits.current += 1;
      setOrders((prev) => [order, ...prev]);
      return { order, error: null };
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
