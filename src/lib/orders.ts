import type { Json } from "@/integrations/supabase/types";
import { findProduct } from "./catalog";
import type { OrderTotals } from "./pricing";

/** Een opgeslagen productregel; de foto komt bij het tonen uit de catalogus (product_id). */
export type OrderLine = {
  product_id: string;
  name: string;
  brand: string;
  sku: string;
  quantity: number;
  unit_price: number;
};

export type Order = {
  id: string;
  created_at: string;
  ship_date: string;
  reference: string | null;
  lines: OrderLine[];
  totals: OrderTotals;
  tracking_number: string;
};

export type OrderRow = {
  id: string;
  created_at: string;
  ship_date: string;
  reference: string | null;
  lines: Json;
  subtotal: number;
  shipping: number;
  vat: number;
  total: number;
  tracking_number: string;
};

export const CARRIER = { name: "DACHSER", tagline: "Intelligent Logistics" } as const;

/** Fictief DACHSER-trackingnummer (geen echt nummer), afgeleid van de bestelling zodat het stabiel blijft. */
export function trackingNumber(seed: string) {
  let h = 17;
  for (const c of seed) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  const digits = String(h).padStart(10, "0").slice(-10);
  return `DX-${digits.slice(0, 4)}-${digits.slice(4, 10)}`;
}

export function toOrder(r: OrderRow): Order {
  return {
    id: r.id,
    created_at: r.created_at,
    ship_date: r.ship_date,
    reference: r.reference,
    lines: (Array.isArray(r.lines) ? r.lines : []) as unknown as OrderLine[],
    totals: {
      subtotal: Number(r.subtotal),
      shipping: Number(r.shipping),
      vat: Number(r.vat),
      total: Number(r.total),
    },
    tracking_number: r.tracking_number,
  };
}

export const lineImage = (l: OrderLine) => findProduct(l.product_id)?.image;

export type StepKey = "received" | "processing" | "shipped" | "delivered";
export type TrackingStep = { key: StepKey; label: string; at: Date };

const HOUR = 3_600_000;

/**
 * Fictieve tijdlijn: ontvangen bij plaatsen, verwerking enkele uren later, onderweg bij DACHSER
 * ongeveer een dag later en bezorgd op de gewenste verzenddatum (rond 14:00).
 */
export function trackingSteps(o: Pick<Order, "created_at" | "ship_date">): TrackingStep[] {
  const placed = new Date(o.created_at);
  const delivered = new Date(`${o.ship_date}T14:00:00`);
  const processing = new Date(placed.getTime() + 3 * HOUR);
  const shippedBase = Math.max(processing.getTime() + 2 * HOUR, delivered.getTime() - 20 * HOUR);
  const shipped = new Date(Math.min(shippedBase, delivered.getTime() - HOUR));
  return [
    { key: "received", label: "Bestelling ontvangen", at: placed },
    { key: "processing", label: "In verwerking bij ESTG", at: processing },
    { key: "shipped", label: "Onderweg bij DACHSER", at: shipped },
    {
      key: "delivered",
      label: "Bezorgd",
      at: new Date(Math.max(delivered.getTime(), shipped.getTime() + HOUR)),
    },
  ];
}

/** Index van de huidige stap (0–3) op het gegeven moment. */
export function currentStep(steps: TrackingStep[], now: Date) {
  let idx = 0;
  steps.forEach((s, i) => {
    if (now.getTime() >= s.at.getTime()) idx = i;
  });
  return idx;
}

export const statusLabel: Record<StepKey, string> = {
  received: "Ontvangen",
  processing: "In verwerking",
  shipped: "Onderweg",
  delivered: "Bezorgd",
};
