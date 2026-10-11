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
  it("heeft 30 producten met unieke id's en artikelnummers", () => {
    expect(products).toHaveLength(30);
    expect(new Set(products.map((p) => p.id)).size).toBe(30);
    expect(new Set(products.map((p) => p.sku)).size).toBe(30);
  });
  it("heeft minstens drie producten per categorie", () => {
    for (const c of categories)
      expect(products.filter((p) => p.category === c).length).toBeGreaterThanOrEqual(3);
  });
  it("gebruikt alleen merken uit de merklijst", () => {
    for (const p of products) expect(brands).toContain(p.brand);
  });
});
