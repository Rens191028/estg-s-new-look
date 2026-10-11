import { describe, expect, it } from "vitest";
import { findProduct } from "../catalog";
import { checkInverterBattery, checkPanelInverterSizing, checkPhase, evaluateSet } from "./compat";
import { buildSystemPrompt, relevantProducts } from "./context";
import { clampMessage, createRateLimiter, MAX_MESSAGE_LENGTH } from "./guards";

const p = (id: string) => findProduct(id)!;

describe("compatibiliteitsregels", () => {
  it("keurt een string-omvormer af voor een batterij", () => {
    const r = checkInverterBattery(p("string-omvormer"), p("modulaire-thuisbatterij"));
    expect(r.status).toBe("niet-compatibel");
  });
  it("zegt 'onbekend' bij een hybride omvormer, want protocol is niet vastgelegd", () => {
    const r = checkInverterBattery(p("hybride-omvormer"), p("modulaire-thuisbatterij"));
    expect(r.status).toBe("onbekend");
  });
  it("controleert dimensionering op DC/AC-verhouding", () => {
    expect(
      checkPanelInverterSizing(p("all-black-zonnepaneel"), 20, p("hybride-omvormer")).status,
    ).toBe("compatibel");
    expect(
      checkPanelInverterSizing(p("all-black-zonnepaneel"), 40, p("string-omvormer")).status,
    ).toBe("niet-compatibel");
  });
  it("vergelijkt fasen en meldt onbekend bij ontbrekende data", () => {
    expect(checkPhase(p("hybride-omvormer"), p("slimme-ev-lader")).status).toBe("compatibel");
    expect(checkPhase(p("hybride-omvormer"), p("modulaire-thuisbatterij")).status).toBe("onbekend");
  });
  it("evalueert een complete set", () => {
    const results = evaluateSet([
      { id: "all-black-zonnepaneel", quantity: 20 },
      { id: "hybride-omvormer", quantity: 1 },
      { id: "modulaire-thuisbatterij", quantity: 1 },
    ]);
    expect(results.map((r) => r.rule).sort()).toEqual(["dimensionering", "omvormer-batterij"]);
  });
});

describe("catalogusfilter en prompt", () => {
  it("geeft producten uit de juiste categorie bij een vraag", () => {
    expect(relevantProducts("welke batterij past er?")[0]?.category).toBe("Energieopslag");
  });
  it("valt terug op een algemene selectie zonder treffer", () => {
    expect(relevantProducts("xyzzy").length).toBeGreaterThan(0);
  });
  it("neemt geen prijzen of onbekende producten op in de prompt", () => {
    const prompt = buildSystemPrompt({ source: "widget", list: relevantProducts("omvormer") });
    expect(prompt).toContain("Geverifieerde compatibiliteitscontroles");
    expect(prompt).toContain("Noem nooit prijzen");
  });
});

describe("guards", () => {
  it("begrenst de berichtlengte", () => {
    expect(clampMessage("a".repeat(5000))).toHaveLength(MAX_MESSAGE_LENGTH);
  });
  it("blokkeert na de limiet en laat daarna weer toe", () => {
    let t = 0;
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => t });
    expect(limiter.check("a").ok).toBe(true);
    expect(limiter.check("a").ok).toBe(true);
    expect(limiter.check("a").ok).toBe(false);
    expect(limiter.check("b").ok).toBe(true);
    t = 1500;
    expect(limiter.check("a").ok).toBe(true);
  });
});
