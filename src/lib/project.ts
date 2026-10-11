import { categories, findProduct, type Category, type Product } from "./catalog";

export type ProjectItem = { id: string; quantity: number };
export type ProjectLine = { product: Product; quantity: number };

export function projectLines(items: ProjectItem[]): ProjectLine[] {
  return items.flatMap((item) => {
    const product = findProduct(item.id);
    return product ? [{ product, quantity: item.quantity }] : [];
  });
}

export function groupByCategory(lines: ProjectLine[]) {
  return categories
    .map((category) => ({ category, lines: lines.filter((l) => l.product.category === category) }))
    .filter((g) => g.lines.length > 0);
}

/** Totaal paneelvermogen in kWp, op basis van de panelen in het project. */
export function totalKwp(lines: ProjectLine[]) {
  const wp = lines.reduce((sum, l) => sum + (l.product.powerWp ?? 0) * l.quantity, 0);
  return wp / 1000;
}

export type ProjectWarning = { id: string; text: string; category: Category };

/** Eenvoudige controle op hoofdlijnen: de set bevat panelen zonder omvormer of montagemateriaal. */
export function projectWarnings(lines: ProjectLine[]): ProjectWarning[] {
  const has = (c: Category) => lines.some((l) => l.product.category === c);
  const warnings: ProjectWarning[] = [];
  if (has("Zonnepanelen") && !has("Omvormers")) {
    warnings.push({
      id: "geen-omvormer",
      text: "Je winkelmand bevat zonnepanelen maar nog geen omvormer.",
      category: "Omvormers",
    });
  }
  if (has("Zonnepanelen") && !has("Montagemateriaal")) {
    warnings.push({
      id: "geen-montage",
      text: "Je winkelmand bevat zonnepanelen maar nog geen montagemateriaal.",
      category: "Montagemateriaal",
    });
  }
  if (has("Energieopslag") && !has("Omvormers")) {
    warnings.push({
      id: "batterij-zonder-omvormer",
      text: "Een batterij heeft een compatibele omvormer nodig.",
      category: "Omvormers",
    });
  }
  return warnings;
}
