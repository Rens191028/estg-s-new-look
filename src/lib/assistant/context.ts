import { categories, products, type Category, type Product } from "../catalog";
import { evaluateSet } from "./compat";
import { KNOWLEDGE_FACTS, KNOWLEDGE_RULES } from "./knowledge";

const categoryWords: Record<Category, string[]> = {
  Zonnepanelen: ["paneel", "panelen", "zonnepaneel", "zonnepanelen", "pv", "wp"],
  Omvormers: ["omvormer", "omvormers", "inverter", "hybride", "string"],
  Energieopslag: ["batterij", "batterijen", "opslag", "accu", "kwh"],
  "EV-laders": ["lader", "laders", "laadpaal", "laadstation", "ev", "auto"],
  Montagemateriaal: ["montage", "rails", "dakhaak", "dakhaken", "bevestiging", "dak"],
  Klimaat: ["warmtepomp", "klimaat", "verwarmen", "koelen"],
};

const tokenize = (q: string) =>
  q
    .toLowerCase()
    .split(/[^a-z0-9ëïöüé-]+/)
    .filter((t) => t.length > 1);

/** Producten die relevant zijn voor de vraag; zonder treffer een kleine algemene selectie. */
export function relevantProducts(query: string, limit = 8): Product[] {
  const tokens = tokenize(query);
  const scored = products.map((p) => {
    let score = 0;
    const haystack = `${p.name} ${p.brand} ${p.category} ${p.sku}`.toLowerCase();
    for (const t of tokens) {
      if (haystack.includes(t)) score += 2;
      if (categoryWords[p.category].includes(t)) score += 3;
    }
    return { p, score };
  });
  const hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  return (hits.length ? hits.map((s) => s.p) : products).slice(0, limit);
}

export function catalogLines(list: Product[]) {
  return list
    .map(
      (p) =>
        `- ${p.id} | ${p.name} | ${p.brand} | ${p.category} | €${p.price} excl. btw | ${p.specs.map((s) => `${s.label}: ${s.value}`).join("; ")}`,
    )
    .join("\n");
}

/** Vaststaande compatibiliteitsuitkomsten voor de producten in de context (door code berekend). */
export function compatFacts(list: Product[]) {
  const items = list.map((p) => ({ id: p.id, quantity: 1 }));
  return evaluateSet(items)
    .filter((r) => r.rule !== "dimensionering")
    .map((r) => `- ${r.rule}: ${r.status}. ${r.reason}`);
}

export function buildSystemPrompt({
  source,
  list,
}: {
  source: "widget" | "advisor";
  list: Product[];
}) {
  const facts = compatFacts(list);
  return [
    `Je bent de ESTG-assistent (${source === "advisor" ? "productadviseur" : "chatwidget"}).`,
    "Feiten:\n" + KNOWLEDGE_FACTS.map((f) => `- ${f}`).join("\n"),
    "Regels:\n" + KNOWLEDGE_RULES.map((r) => `- ${r}`).join("\n"),
    `Categorieën: ${categories.join(", ")}.`,
    "Relevante catalogus (id | naam | merk | categorie | prijs | specs):\n" + catalogLines(list),
    "Geverifieerde compatibiliteitscontroles (door code vastgesteld):\n" +
      (facts.length ? facts.join("\n") : "- Geen controles beschikbaar voor deze selectie."),
  ].join("\n\n");
}
