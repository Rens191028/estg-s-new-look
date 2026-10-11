import type { Product } from "./catalog";

export const MAX_COMPARE = 4;

/** Voeg een product toe aan de vergelijklijst; maximaal MAX_COMPARE, geen dubbelen. */
export function addToCompare(ids: string[], id: string) {
  if (ids.includes(id) || ids.length >= MAX_COMPARE) return ids;
  return [...ids, id];
}

/** Unie van alle specificatielabels die bij minstens één product voorkomen, in volgorde van eerste voorkomen. */
export function specLabels(products: Product[]) {
  const labels: string[] = [];
  for (const p of products) {
    for (const s of p.specs) if (!labels.includes(s.label)) labels.push(s.label);
  }
  return labels;
}

/** Waarde van een spec, of een streepje wanneer het product dat veld niet heeft. */
export function specValue(product: Product, label: string) {
  return product.specs.find((s) => s.label === label)?.value ?? "–";
}
