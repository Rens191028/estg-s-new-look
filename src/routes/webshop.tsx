import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/estg/page-intro";
import { ProductCard } from "@/components/estg/product-card";
import { products, categories, pageHead } from "@/lib/catalog";
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
  const filtered = products.filter(
    (p) =>
      (!search.category || p.category === search.category) &&
      (!search.brand || p.brand === search.brand) &&
      (!search.q ||
        `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(search.q.toLowerCase())),
  );
  const shown =
    sort === "az"
      ? [...filtered].sort((a, b) => a.name.localeCompare(b.name))
      : sort === "brand"
        ? [...filtered].sort((a, b) => a.brand.localeCompare(b.brand))
        : filtered;
  const set = (key: "category" | "brand", value: string) =>
    navigate({ search: { ...search, [key]: search[key] === value ? "" : value } });
  return (
    <>
      <PageIntro
        title={search.category || "Ons assortiment"}
        description="De juiste producten voor jouw volgende energieproject. Alles bij één partner."
      />
      <div className="container shop-layout">
        <aside className="filters">
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
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>Merken</h3>
            {[...new Set(products.map((p) => p.brand))].sort().map((b) => (
              <label key={b}>
                <input
                  type="checkbox"
                  checked={search.brand === b}
                  onChange={() => set("brand", b)}
                />
                {b}
              </label>
            ))}
          </div>
          {(search.q || search.brand || search.category) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ search: { q: "", category: "", brand: "" } })}
            >
              <X />
              Wis filters
            </Button>
          )}
        </aside>
        <div>
          <div className="shop-toolbar">
            <span>
              {shown.length} producten {search.q && `voor “${search.q}”`}
            </span>
            <select
              aria-label="Sorteer producten"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Sorteer: aanbevolen</option>
              <option value="az">Naam: A – Z</option>
              <option value="brand">Merk: A – Z</option>
            </select>
          </div>
          {shown.length ? (
            <div className="product-grid">
              {shown.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={32} />
              <h2>Geen producten gevonden</h2>
              <p>Probeer een andere zoekterm of verwijder een filter.</p>
              <Button onClick={() => navigate({ search: { q: "", category: "", brand: "" } })}>
                Bekijk alle producten
              </Button>
            </div>
          )}
          <p className="sample-note">
            Voorbeeldassortiment · Productafbeeldingen zijn illustratief. Prijzen, uitvoeringen en
            beschikbaarheid zijn op aanvraag. Voor het volledige actuele assortiment: estg.eu.
          </p>
        </div>
      </div>
    </>
  );
}
