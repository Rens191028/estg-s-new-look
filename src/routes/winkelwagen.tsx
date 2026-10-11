import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  Download,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/estg/page-intro";
import { useStore } from "@/components/estg/store";
import { CategoryIcon } from "@/components/estg/ui-bits";
import { CO2_FACTOR, estimateCo2Savings } from "@/lib/co2";
import { pageHead } from "@/lib/catalog";
import { groupByCategory, projectLines, projectWarnings, totalKwp } from "@/lib/project";
import { formatInt, formatKg, formatKwp } from "@/lib/format";

export const Route = createFileRoute("/winkelwagen")({
  head: () =>
    pageHead(
      "Mijn Project",
      "Stel je project samen, controleer of de set compleet is en bereid je aanvraag voor ESTG voor.",
    ),
  component: Cart,
});

function Cart() {
  const { items, update, projectName, setProjectName, count } = useStore();
  const lines = projectLines(items);
  const groups = groupByCategory(lines);
  const warnings = projectWarnings(lines);
  const kwp = totalKwp(lines);
  const co2 = kwp > 0 ? estimateCo2Savings(kwp) : null;

  const download = () => {
    const text =
      `ESTG — Productaanvraag: ${projectName}\n\n` +
      lines.map((l) => `${l.quantity} × ${l.product.name} (${l.product.brand})`).join("\n") +
      "\n\nVoorbeeldassortiment. Prijzen, specificaties en beschikbaarheid te bevestigen door ESTG. Geen bestelling geplaatst.";
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "ESTG-productaanvraag.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageIntro
        title="Mijn Project"
        description="Alle geselecteerde oplossingen voor jouw project op een rij."
      />
      <section className="container section" style={{ paddingBlock: 0 }}>
        {lines.length ? (
          <div className="project-layout">
            <div>
              <input
                className="project-name"
                aria-label="Projectnaam"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              {warnings.length > 0 && (
                <div className="compat-warn" role="status">
                  <AlertTriangle size={20} />
                  <ul>
                    {warnings.map((w) => (
                      <li key={w.id}>
                        {w.text}{" "}
                        <Link
                          className="text-link"
                          style={{ textDecoration: "underline" }}
                          to="/webshop"
                          search={{ category: w.category, q: "", brand: "" }}
                        >
                          Bekijk {w.category.toLowerCase()}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {groups.map((g) => (
                <div className="cart-group" key={g.category}>
                  <h3>{g.category}</h3>
                  {g.lines.map(({ product: p, quantity }) => (
                    <div className="cart-row" key={p.id}>
                      {p.image ? (
                        <img src={p.image} alt={p.name} width={72} height={72} />
                      ) : (
                        <span className="thumb">
                          <CategoryIcon category={p.category} size={28} />
                        </span>
                      )}
                      <div>
                        <Link to="/producten/$id" params={{ id: p.id }}>
                          <h3 style={{ color: "inherit", borderBottom: 0, padding: 0 }}>
                            {p.name}
                          </h3>
                        </Link>
                        <p>
                          {p.brand} · <span className="sku">{p.sku}</span>
                        </p>
                      </div>
                      <div className="quantity">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`${p.name} verminderen`}
                          onClick={() => update(p.id, quantity - 1)}
                        >
                          <Minus />
                        </Button>
                        <input
                          aria-label={`Aantal ${p.name}`}
                          type="number"
                          min={1}
                          max={999}
                          value={quantity}
                          onChange={(e) =>
                            update(p.id, Math.max(1, Math.min(999, Number(e.target.value) || 1)))
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`${p.name} verhogen`}
                          onClick={() => update(p.id, Math.min(999, quantity + 1))}
                        >
                          <Plus />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`${p.name} verwijderen`}
                        onClick={() => update(p.id, 0)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <aside className="summary-card" aria-label="Samenvatting">
              <h3>Samenvatting</h3>
              <dl>
                <div>
                  <dt>Producten</dt>
                  <dd>{formatInt(count)}</dd>
                </div>
                <div>
                  <dt>Regels</dt>
                  <dd>{formatInt(lines.length)}</dd>
                </div>
                {kwp > 0 && (
                  <div>
                    <dt>Paneelvermogen</dt>
                    <dd>{formatKwp(kwp)}</dd>
                  </div>
                )}
              </dl>
              {co2 && (
                <p className="co2-note">
                  <strong>~{formatKg(co2.kgCo2PerYear)} CO₂-besparing per jaar</strong> (indicatie,
                  op basis van de CO₂-emissiefactor voor elektriciteit van{" "}
                  <a href={co2.source} target="_blank" rel="noreferrer">
                    CO2emissiefactoren.nl
                  </a>
                  , {CO2_FACTOR.year}).
                </p>
              )}
              <p className="co2-note">Prijzen en beschikbaarheid bevestigt ESTG bij je aanvraag.</p>
              <Button asChild variant="accent" size="lg">
                <Link to="/contact">
                  Aanvraag bespreken <ArrowUpRight />
                </Link>
              </Button>
              <Button variant="outline" onClick={download}>
                <Download /> Download aanvraag
              </Button>
              <p className="co2-note">
                Er is geen bestelling geplaatst. Je selectie blijft alleen tijdens dit bezoek
                bewaard.
              </p>
            </aside>
          </div>
        ) : (
          <div className="empty-state">
            <ShoppingBag size={40} />
            <h2>Je project is nog leeg</h2>
            <p>Voeg producten toe om een project samen te stellen.</p>
            <Button asChild>
              <Link to="/webshop" search={{ q: "", category: "", brand: "" }}>
                Ontdek het assortiment <ArrowUpRight />
              </Link>
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
