import { describe, expect, it } from "vitest";
import { brandLogo, brands, categories, findProduct, products } from "./catalog";
import { addToCompare, MAX_COMPARE, specLabels, specValue } from "./compare";
import { CO2_FACTOR, estimateCo2Savings } from "./co2";
import { groupByCategory, projectLines, projectWarnings, totalKwp } from "./project";

describe("CO2-indicatie", () => {
  it("rekent kWp om via opbrengst en emissiefactor", () => {
    const r = estimateCo2Savings(10);
    expect(r.kwhPerYear).toBe(9000);
    expect(r.kgCo2PerYear).toBeCloseTo(9000 * CO2_FACTOR.kgCo2PerKwh);
  });
  it("gebruikt een eigen opbrengst als die wordt meegegeven", () => {
    expect(estimateCo2Savings(2, { yieldKwhPerKwp: 1000 }).kwhPerYear).toBe(2000);
  });
});

describe("vergelijklijst", () => {
  it("begrenst op het maximum en voorkomt dubbelen", () => {
    let ids: string[] = [];
    for (const p of products) ids = addToCompare(ids, p.id);
    expect(ids).toHaveLength(MAX_COMPARE);
    expect(addToCompare(ids, ids[0]!)).toEqual(ids);
  });
  it("bouwt de unie van specs en toont een streepje bij ontbrekende velden", () => {
    const panel = findProduct("all-black-zonnepaneel")!;
    const inverter = findProduct("hybride-omvormer")!;
    const labels = specLabels([panel, inverter]);
    expect(labels).toContain("Celtype");
    expect(labels).toContain("Batterijaansluiting");
    expect(specValue(panel, "Batterijaansluiting")).toBe("–");
    expect(specValue(inverter, "Batterijaansluiting")).toBe("Ja");
  });
});

describe("Mijn Project", () => {
  const items = [
    { id: "all-black-zonnepaneel", quantity: 20 },
    { id: "bestaat-niet", quantity: 1 },
  ];
  it("negeert onbekende producten", () => {
    expect(projectLines(items)).toHaveLength(1);
  });
  it("telt paneelvermogen op in kWp", () => {
    expect(totalKwp(projectLines(items))).toBeCloseTo(8.6);
  });
  it("groepeert per categorie", () => {
    expect(groupByCategory(projectLines(items)).map((g) => g.category)).toEqual(["Zonnepanelen"]);
  });
  it("waarschuwt voor panelen zonder omvormer en montagemateriaal", () => {
    expect(projectWarnings(projectLines(items)).map((w) => w.id)).toEqual([
      "geen-omvormer",
      "geen-montage",
    ]);
  });
  it("waarschuwt niet wanneer de set compleet is", () => {
    const complete = [
      ...items,
      { id: "hybride-omvormer", quantity: 1 },
      { id: "montagesysteem-schuin-dak", quantity: 1 },
    ];
    expect(projectWarnings(projectLines(complete))).toEqual([]);
  });
});

describe("merklogo's", () => {
  it("geeft null voor een merk zonder logobestand of onbekend merk", () => {
    expect(brandLogo("Onbekend merk")).toBeNull();
    for (const b of brands) expect(["string", "object"]).toContain(typeof brandLogo(b));
  });
});

describe("demo-catalogus", () => {
  it("heeft 37 producten met unieke id's en artikelnummers", () => {
    expect(products).toHaveLength(37);
    expect(new Set(products.map((p) => p.id)).size).toBe(37);
    expect(new Set(products.map((p) => p.sku)).size).toBe(37);
  });
  it("heeft minstens drie producten per categorie", () => {
    for (const c of categories)
      expect(products.filter((p) => p.category === c).length).toBeGreaterThanOrEqual(3);
  });
  it("gebruikt alleen merken uit de merklijst", () => {
    for (const p of products) expect(brands).toContain(p.brand);
  });
});

describe("prijzen", () => {
  it("geeft elk product een positieve voorbeeldprijs", () => {
    for (const p of products) expect(p.price).toBeGreaterThan(0);
  });
  it("markeert precies één bestseller per categorie", () => {
    for (const c of categories)
      expect(products.filter((p) => p.category === c && p.isBestseller)).toHaveLength(1);
  });
});

describe("beschikbaarheid", () => {
  it("is deterministisch per product en geeft een toon en tekst", async () => {
    const { availabilityFor } = await import("./availability");
    for (const p of products) {
      const a = availabilityFor(p.id);
      expect(availabilityFor(p.id)).toEqual(a);
      expect(a.label.length).toBeGreaterThan(5);
    }
  });
  it("gebruikt meer dan één variant over de catalogus", async () => {
    const { availabilityFor } = await import("./availability");
    expect(new Set(products.map((p) => availabilityFor(p.id).label)).size).toBeGreaterThan(1);
  });
});

describe("configurator", () => {
  it("stelt een complete set samen met panelen, omvormer en montage", async () => {
    const { buildConfiguration } = await import("./configurator");
    const r = buildConfiguration({
      roofArea: 200,
      roofType: "schuin",
      consumption: "middel",
      battery: false,
      charger: false,
    });
    const cats = r.lines.map((l) => l.product.category);
    expect(cats).toEqual(expect.arrayContaining(["Zonnepanelen", "Omvormers", "Montagemateriaal"]));
    expect(r.kwp).toBeGreaterThan(0);
    expect(r.total).toBeGreaterThan(0);
  });
  it("begrenst panelen door het dakoppervlak", async () => {
    const { buildConfiguration, PANEL_AREA_M2 } = await import("./configurator");
    const r = buildConfiguration({
      roofArea: 20,
      roofType: "plat",
      consumption: "groot",
      battery: false,
      charger: false,
    });
    expect(r.panelCount).toBe(Math.floor(20 / PANEL_AREA_M2));
  });
  it("kiest een hybride omvormer als er een batterij bij komt en voegt laadpaal toe op verzoek", async () => {
    const { buildConfiguration } = await import("./configurator");
    const r = buildConfiguration({
      roofArea: 100,
      roofType: "schuin",
      consumption: "klein",
      battery: true,
      charger: true,
    });
    const inv = r.lines.find((l) => l.product.category === "Omvormers")!.product;
    expect(inv.specs.find((s) => s.label === "Batterijaansluiting")?.value).toBe("Ja");
    expect(r.lines.some((l) => l.product.category === "Energieopslag")).toBe(true);
    expect(r.lines.some((l) => l.product.category === "EV-laders")).toBe(true);
  });
});

describe("aanbiedingen", () => {
  it("heeft zes producten met een was-prijs boven de huidige prijs, grootste korting eerst", async () => {
    const { dealProducts, discountPercent, isDeal } = await import("./catalog");
    const deals = dealProducts();
    expect(deals).toHaveLength(6);
    for (const p of deals) expect(isDeal(p)).toBe(true);
    for (let i = 1; i < deals.length; i++)
      expect(discountPercent(deals[i - 1]!)).toBeGreaterThanOrEqual(discountPercent(deals[i]!));
    expect(discountPercent(deals[0]!)).toBe(14);
  });
  it("geeft de assistent de was-prijs mee voor aanbiedingen", async () => {
    const { catalogLines } = await import("./assistant/context");
    const { findProduct } = await import("./catalog");
    expect(catalogLines([findProduct("montagesysteem-schuin-dak")!])).toContain("was €219");
    expect(catalogLines([findProduct("laadstation")!])).not.toContain("was €");
  });
});

describe("prijsstaffels en certificeringen", () => {
  it("past de staffel toe op basis van het aantal", async () => {
    const { findProduct, unitPrice } = await import("./catalog");
    const p = findProduct("all-black-zonnepaneel")!;
    expect(p.priceTiers).toHaveLength(2);
    expect(unitPrice(p, 1)).toBe(p.price);
    expect(unitPrice(p, 9)).toBe(p.price);
    expect(unitPrice(p, 10)).toBe(p.priceTiers![0]!.price);
    expect(unitPrice(p, 25)).toBe(p.priceTiers![1]!.price);
    expect(p.priceTiers![1]!.price).toBeLessThan(p.priceTiers![0]!.price);
  });
  it("geeft geen staffel aan producten die niet in bulk worden gekocht", async () => {
    const { products, unitPrice } = await import("./catalog");
    const hp = products.find((x) => x.category === "Klimaat")!;
    expect(hp.priceTiers).toBeUndefined();
    expect(unitPrice(hp, 50)).toBe(hp.price);
  });
  it("vult certificeringen voor een deel van de producten", async () => {
    const { products } = await import("./catalog");
    const withCert = products.filter((x) => x.certifications?.length);
    expect(withCert.length).toBeGreaterThan(0);
    expect(withCert.length).toBeLessThan(products.length);
  });
});
