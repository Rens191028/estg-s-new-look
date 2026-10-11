// Fictieve beschikbaarheid: er is nog geen voorraadbron. De uitkomst hangt vast aan het product-id,
// zodat die bij elke page-load hetzelfde blijft. Vervang dit door echte voorraaddata zodra die er is.
export type Availability = { tone: "success" | "warning"; label: string };

const VARIANTS: Availability[] = [
  { tone: "success", label: "Op voorraad — morgen in huis" },
  { tone: "success", label: "Op voorraad — binnen 2 werkdagen" },
  { tone: "warning", label: "Beperkte voorraad — levertijd 3–5 dagen" },
  { tone: "warning", label: "Levertijd 1–2 weken" },
];

function hash(id: string) {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

export function availabilityFor(productId: string): Availability {
  return VARIANTS[hash(productId) % VARIANTS.length]!;
}

/** Opeenvolgende statusregels tijdens het wachten op een AI-antwoord. */
export const ADVICE_STEPS = [
  "Verbruik analyseren…",
  "Passende producten zoeken…",
  "Compatibiliteit controleren…",
  "Advies samenstellen…",
] as const;
