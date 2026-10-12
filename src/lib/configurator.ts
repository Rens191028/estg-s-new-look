import { products, type Product } from "./catalog";
import { estimateCo2Savings } from "./co2";
import { evaluateSet, MAX_DC_AC_RATIO, type CompatResult } from "./assistant/compat";

export type RoofType = "schuin" | "plat";
export type ConsumptionClass = "klein" | "middel" | "groot";

/** Indicatief jaarverbruik per klasse, in kWh. */
export const CONSUMPTION: Record<ConsumptionClass, { label: string; hint: string; kwh: number }> = {
  klein: { label: "Klein bedrijf", hint: "Kantoor, winkel, kleine werkplaats", kwh: 15_000 },
  middel: { label: "Middelgroot bedrijf", hint: "Productie, magazijn, horeca", kwh: 50_000 },
  groot: { label: "Groot bedrijf", hint: "Industrie, logistiek, grote terreinen", kwh: 150_000 },
};

export const PANEL_AREA_M2 = 2; // indicatief dakoppervlak per paneel, incl. tussenruimte
const YIELD_KWH_PER_KWP = 900; // zelfde vuistregel als lib/co2.ts

export type ConfigInput = {
  roofArea: number; // m²
  roofType: RoofType;
  consumption: ConsumptionClass;
  battery: boolean;
  charger: boolean;
};

export type ConfigLine = { product: Product; quantity: number; reason: string };
export type ConfigResult = {
  lines: ConfigLine[];
  panelCount: number;
  kwp: number;
  total: number;
  co2KgPerYear: number;
  checks: CompatResult[];
  notes: string[];
};

const spec = (p: Product, label: string) => p.specs.find((s) => s.label === label)?.value;
const kwOf = (p: Product) =>
  Number(
    spec(p, "Vermogen")
      ?.replace(",", ".")
      .match(/\d+(\.\d+)?/)?.[0],
  );

/** Stelt een indicatieve set samen uit de voorbeeldcatalogus. Deterministisch en zonder taalmodel. */
export function buildConfiguration(input: ConfigInput): ConfigResult {
  const notes: string[] = [];
  const panels = products
    .filter((p) => p.category === "Zonnepanelen" && p.powerWp)
    .sort((a, b) => a.price / a.powerWp! - b.price / b.powerWp!);
  const panel = panels.find((p) => p.isBestseller) ?? panels[0]!;
  const wp = panel.powerWp!;

  const byRoof = Math.max(1, Math.floor(input.roofArea / PANEL_AREA_M2));
  const byUse = Math.max(
    1,
    Math.ceil(CONSUMPTION[input.consumption].kwh / (YIELD_KWH_PER_KWP * (wp / 1000))),
  );
  const panelCount = Math.min(byRoof, byUse);
  if (panelCount === byRoof && byRoof < byUse)
    notes.push(
      "Het dakoppervlak is hier de beperkende factor; het verbruik zou meer panelen toelaten.",
    );
  if (panelCount === byUse && byUse < byRoof)
    notes.push("Het aantal panelen is afgestemd op je verbruik; er is dakruimte over.");
  const kwp = (panelCount * wp) / 1000;

  const lines: ConfigLine[] = [
    {
      product: panel,
      quantity: panelCount,
      reason: `${panelCount} × ${wp} Wp = ${kwp.toFixed(1)} kWp, past bij dak en verbruik.`,
    },
  ];

  // Omvormer: kleinste (hybride bij batterij) die binnen de DC/AC-vuistregel blijft; anders meerdere.
  const inverters = products
    .filter((p) => p.category === "Omvormers" && Number.isFinite(kwOf(p)))
    .filter((p) => !input.battery || spec(p, "Batterijaansluiting") === "Ja")
    .sort((a, b) => kwOf(a) - kwOf(b));
  const fit = inverters.find((p) => kwp / kwOf(p) <= MAX_DC_AC_RATIO);
  const inverter = fit ?? inverters[inverters.length - 1];
  if (inverter) {
    const qty = fit ? 1 : Math.ceil(kwp / (MAX_DC_AC_RATIO * kwOf(inverter)));
    lines.push({
      product: inverter,
      quantity: qty,
      reason: `${qty} × ${kwOf(inverter)} kW voor ${kwp.toFixed(1)} kWp (DC/AC ${(kwp / (qty * kwOf(inverter))).toFixed(2)}).`,
    });
  }

  const mount = products.find(
    (p) =>
      p.category === "Montagemateriaal" &&
      spec(p, "Daktype") === (input.roofType === "schuin" ? "Schuin" : "Plat"),
  );
  if (mount) {
    const qty = Math.max(1, Math.ceil(panelCount / 10));
    lines.push({
      product: mount,
      quantity: qty,
      reason: `Indicatief 1 set per 10 panelen voor een ${input.roofType} dak.`,
    });
  }

  if (input.battery) {
    const battery =
      products.find((p) => p.category === "Energieopslag" && p.isBestseller) ??
      products.find((p) => p.category === "Energieopslag");
    if (battery)
      lines.push({
        product: battery,
        quantity: 1,
        reason: "Slaat overtollige zonne-energie op voor later gebruik.",
      });
  }
  if (input.charger) {
    const charger =
      products.find((p) => p.category === "EV-laders" && p.isBestseller) ??
      products.find((p) => p.category === "EV-laders");
    if (charger)
      lines.push({
        product: charger,
        quantity: 1,
        reason: "Laadoplossing voor je wagenpark of bezoekers.",
      });
  }

  const total = lines.reduce((s, l) => s + l.product.price * l.quantity, 0);
  const checks = evaluateSet(lines.map((l) => ({ id: l.product.id, quantity: l.quantity })));
  return {
    lines,
    panelCount,
    kwp,
    total,
    co2KgPerYear: estimateCo2Savings(kwp).kgCo2PerYear,
    checks,
    notes,
  };
}
