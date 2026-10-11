import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/estg/page-intro";
import { ProductCard } from "@/components/estg/product-card";
import { Reveal } from "@/components/estg/ui-bits";
import { catalogDisclaimer, categories, products, pageHead } from "@/lib/catalog";

export const Route = createFileRoute("/webshop")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s["q"] === "string" ? s["q"] : "",
    category: typeof s["category"] === "string" ? s["category"] : "",
    brand: typeof s["brand"] === "string" ? s["brand"] : "",
  }),
  head: () =>
    pageHead(
      "Webshop",
      "Ontdek het ESTG-assortiment voor professionals. Vind zonnepanelen, omvormers, batterijen en EV-laadoplossingen.",
    ),
  component: Shop,
});

function Shop() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/webshop" });
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const matches = (p: (typeof products)[number], skip?: "category" | "brand") =>
    (skip === "category" || !search.category || p.category === search.category) &&
    (skip === "brand" || !search.brand || p.brand === search.brand) &&
    (!search.q ||
      `${p.name} ${p.brand} ${p.category} ${p.sku}`.toLowerCase().includes(search.q.toLowerCase()));
  const filtered = products.filter((p) => matches(p));
  const shown =
    sort === "az"
      ? [...filtered].sort((a, b) => a.name.localeCompare(b.name))
      : sort === "brand"
        ? [...filtered].sort((a, b) => a.brand.localeCompare(b.brand))
        : sort === "new"
          ? [...filtered].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew))
          : filtered;
  const brandList = [...new Set(products.map((p) => p.brand))].sort();

  const set = (key: "category" | "brand", value: string) =>
    navigate({ search: { ...search, [key]: search[key] === value ? "" : value } });
  const reset = () => navigate({ search: { q: "", category: "", brand: "" } });
  const activeChips = [
    search.category && { key: "category" as const, label: search.category },
    search.brand && { key: "brand" as const, label: search.brand },
    search.q && { key: "q" as const, label: `“${search.q}”` },
  ].filter(Boolean) as { key: "category" | "brand" | "q"; label: string }[];

  return (
    <>
      <PageIntro
        title={search.category || "Ons assortiment"}
        description="De juiste producten voor jouw volgende energieproject. Alles bij één partner."
        trail={search.category ? [{ label: "Assortiment", to: "/webshop" }] : undefined}
      />
      <div className="container shop-layout">
        <aside className={`filters ${filtersOpen ? "open" : ""}`} aria-label="Filters">
          <div className="filter-group">
            <h3>Categorieën</h3>
            {categories.map((c) => (
              <label key={c}>
                <input
                  type="checkbox"
                  checked={search.category === c}
                  onChange={() => set("category", c)}
                />
                {c}
                <span className="count">
                  {products.filter((p) => p.category === c && matches(p, "category")).length}
                </span>
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>Merken</h3>
            {brandList.map((b) => (
              <label key={b}>
                <input
                  type="checkbox"
                  checked={search.brand === b}
                  onChange={() => set("brand", b)}
                />
                {b}
                <span className="count">
                  {products.filter((p) => p.brand === b && matches(p, "brand")).length}
                </span>
              </label>
            ))}
          </div>
          {activeChips.length > 0 && (
            <Button variant="ghost" size="sm" onClick={reset}>
              <X /> Wis alles
            </Button>
          )}
          <Button className="filter-done filter-open" onClick={() => setFiltersOpen(false)}>
            Toon {filtered.length} producten
          </Button>
        </aside>
        <div>
          {activeChips.length > 0 && (
            <div className="chips" aria-label="Actieve filters">
              {activeChips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className="chip"
                  aria-label={`Filter ${c.label} verwijderen`}
                  onClick={() => navigate({ search: { ...search, [c.key]: "" } })}
                >
                  {c.label} <X size={14} />
                </button>
              ))}
            </div>
          )}
          <div className="shop-toolbar">
            <span>
              {shown.length} producten {search.q && `voor “${search.q}”`}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                variant="outline"
                size="sm"
                className="filter-open"
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal /> Filteren
              </Button>
              <select
                aria-label="Sorteer producten"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="featured">Sorteer: relevantie</option>
                <option value="new">Nieuw eerst</option>
                <option value="az">Naam: A – Z</option>
                <option value="brand">Merk: A – Z</option>
              </select>
            </div>
          </div>
          {shown.length ? (
            <div className="product-grid">
              {shown.map((p, i) => (
                <Reveal key={p.id} delay={(i % 6) * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={32} />
              <h2>Geen producten gevonden</h2>
              <p>Probeer een andere zoekterm of verwijder een filter.</p>
              <Button onClick={reset}>Bekijk alle producten</Button>
            </div>
          )}
          <p className="sample-note">
            {catalogDisclaimer} Voor het volledige actuele assortiment: estg.eu.
          </p>
        </div>
      </div>
    </>
  );
}
