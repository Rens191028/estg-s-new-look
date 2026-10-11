import { createFileRoute, Link } from "@tanstack/react-router";
import { Scale, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/estg/page-intro";
import { useCompare } from "@/components/estg/compare";
import { useStore } from "@/components/estg/store";
import { CategoryIcon } from "@/components/estg/ui-bits";
import { catalogDisclaimer, findProduct, pageHead, type Product } from "@/lib/catalog";
import { specLabels, specValue } from "@/lib/compare";
import { formatEuro } from "@/lib/format";

export const Route = createFileRoute("/vergelijken")({
  head: () =>
    pageHead(
      "Producten vergelijken",
      "Vergelijk tot vier producten naast elkaar in één specificatietabel.",
    ),
  component: Compare,
});

function Compare() {
  const { ids, remove, clear } = useCompare();
  const { add } = useStore();
  const selected = ids.flatMap((id) => findProduct(id) ?? []);
  const labels = specLabels(selected);

  return (
    <>
      <PageIntro
        title="Producten vergelijken"
        description="Alle specificaties van je selectie naast elkaar. Ontbrekende gegevens tonen een streepje."
      />
      <section className="container section">
        {selected.length === 0 ? (
          <div className="empty-state">
            <Scale size={40} />
            <h2>Nog niets om te vergelijken</h2>
            <p>Vink “Vergelijk” aan bij minstens twee producten.</p>
            <Button asChild>
              <Link to="/webshop" search={{ q: "", category: "", brand: "" }}>
                Naar het assortiment
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="compare-wrap">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th scope="col">
                      <Button variant="ghost" size="sm" onClick={clear}>
                        Alles wissen
                      </Button>
                    </th>
                    {selected.map((p) => (
                      <th scope="col" key={p.id}>
                        <ProductHead product={p} onRemove={() => remove(p.id)} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Prijs (excl. btw)</th>
                    {selected.map((p) => (
                      <td key={p.id}>{formatEuro(p.price)}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Artikelnummer</th>
                    {selected.map((p) => (
                      <td key={p.id}>{p.sku}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Categorie</th>
                    {selected.map((p) => (
                      <td key={p.id} style={{ fontFamily: "var(--font-sans)" }}>
                        {p.category}
                      </td>
                    ))}
                  </tr>
                  {labels.map((label) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      {selected.map((p) => {
                        const v = specValue(p, label);
                        return (
                          <td key={p.id} className={v === "–" ? "missing" : undefined}>
                            {v}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" />
                    {selected.map((p) => (
                      <td key={p.id}>
                        <Button size="sm" onClick={() => add(p.id)}>
                          Toevoegen
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            {selected.length < 2 && (
              <p className="sample-note">
                Kies minstens één extra product om te kunnen vergelijken.
              </p>
            )}
          </>
        )}
        <p className="sample-note">{catalogDisclaimer}</p>
      </section>
    </>
  );
}

function ProductHead({ product, onRemove }: { product: Product; onRemove: () => void }) {
  return (
    <div className="compare-head">
      {product.image ? (
        <img src={product.image} alt="" width={120} height={90} />
      ) : (
        <span
          className="thumb"
          style={{
            height: 90,
            display: "grid",
            placeItems: "center",
            background: "var(--surface-50)",
            borderRadius: 10,
          }}
        >
          <CategoryIcon category={product.category} size={36} />
        </span>
      )}
      <span className="muted" style={{ fontSize: 13 }}>
        {product.brand}
      </span>
      <Link to="/producten/$id" params={{ id: product.id }}>
        <strong>{product.name}</strong>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        aria-label={`${product.name} verwijderen`}
      >
        <X /> Verwijderen
      </Button>
    </div>
  );
}
