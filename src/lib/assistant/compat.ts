import { findProduct, type Product } from "../catalog";

export type CompatStatus = "compatibel" | "niet-compatibel" | "onbekend";
export type CompatResult = { rule: string; status: CompatStatus; reason: string };

// Regels op basis van de (illustratieve) specs in de catalogus. Het zijn vuistregels; echte
// compatibiliteit (protocol, spanningsvenster per MPPT) vraagt productdata uit een verified bron.
export const MAX_DC_AC_RATIO = 1.3;
export const MIN_DC_AC_RATIO = 0.7;

const spec = (p: Product, label: string) => p.specs.find((s) => s.label === label)?.value;
const numberIn = (value: string | undefined) => {
  const m = value?.replace(",", ".").match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : undefined;
};

export function checkPhase(a: Product, b: Product): CompatResult {
  const pa = spec(a, "Fasen");
  const pb = spec(b, "Fasen");
  if (!pa || !pb)
    return {
      rule: "fase",
      status: "onbekend",
      reason: "Van minstens één product is het aantal fasen niet bekend.",
    };
  return pa === pb
    ? { rule: "fase", status: "compatibel", reason: `Beide producten zijn ${pa}.` }
    : {
        rule: "fase",
        status: "niet-compatibel",
        reason: `${a.name} is ${pa}, ${b.name} is ${pb}.`,
      };
}

export function checkInverterBattery(inverter: Product, battery: Product): CompatResult {
  if (spec(inverter, "Batterijaansluiting") !== "Ja")
    return {
      rule: "omvormer-batterij",
      status: "niet-compatibel",
      reason: `${inverter.name} heeft geen batterijaansluiting (geen hybride omvormer).`,
    };
  const cls = spec(battery, "Spanningsklasse");
  return {
    rule: "omvormer-batterij",
    status: "onbekend",
    reason: `${inverter.name} heeft een batterijaansluiting, maar of de ${cls ?? "onbekende"}-batterij ${battery.name} past (protocol, spanningsklasse) is niet vastgelegd. Controleer de datasheet.`,
  };
}

export function checkPanelInverterSizing(
  panel: Product,
  quantity: number,
  inverter: Product,
): CompatResult {
  const kwp = ((panel.powerWp ?? 0) * quantity) / 1000;
  const kw = numberIn(spec(inverter, "Vermogen"));
  if (!kwp || !kw)
    return {
      rule: "dimensionering",
      status: "onbekend",
      reason: "Paneel- of omvormervermogen is niet bekend.",
    };
  const ratio = kwp / kw;
  const text = `${quantity} × ${panel.powerWp} Wp = ${kwp.toFixed(2)} kWp op ${kw} kW omvormer (DC/AC ${ratio.toFixed(2)}).`;
  if (ratio > MAX_DC_AC_RATIO)
    return {
      rule: "dimensionering",
      status: "niet-compatibel",
      reason: `${text} Boven de vuistregel van ${MAX_DC_AC_RATIO}.`,
    };
  if (ratio < MIN_DC_AC_RATIO)
    return {
      rule: "dimensionering",
      status: "onbekend",
      reason: `${text} Omvormer is ruim overgedimensioneerd.`,
    };
  return { rule: "dimensionering", status: "compatibel", reason: text };
}

/** Controleert alle relevante combinaties binnen een set (id + aantal). */
export function evaluateSet(items: { id: string; quantity: number }[]): CompatResult[] {
  const lines = items.flatMap((i) => {
    const product = findProduct(i.id);
    return product ? [{ product, quantity: i.quantity }] : [];
  });
  const of = (c: Product["category"]) => lines.filter((l) => l.product.category === c);
  const results: CompatResult[] = [];
  for (const inv of of("Omvormers")) {
    for (const pan of of("Zonnepanelen"))
      results.push(checkPanelInverterSizing(pan.product, pan.quantity, inv.product));
    for (const bat of of("Energieopslag"))
      results.push(checkInverterBattery(inv.product, bat.product));
  }
  return results;
}
