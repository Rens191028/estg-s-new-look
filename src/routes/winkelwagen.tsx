import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/components/estg/auth";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Download,
  Printer,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/estg/page-intro";
import { useStore } from "@/components/estg/store";
import { CategoryIcon, PriceBreakdown, shippingNote } from "@/components/estg/ui-bits";
import { CO2_FACTOR, estimateCo2Savings } from "@/lib/co2";
import { pageHead } from "@/lib/catalog";
import { COMPANY, COMPANY_ADDRESS } from "@/lib/company";
import { orderTotals } from "@/lib/pricing";
import { groupByCategory, projectLines, projectWarnings, totalKwp } from "@/lib/project";
import { formatEuro, formatEuroExact, formatInt, formatKg, formatKwp } from "@/lib/format";

export const Route = createFileRoute("/winkelwagen")({
  head: () =>
    pageHead(
      "Winkelmand",
      "Stel je selectie samen, controleer of de set compleet is en bestel direct bij ESTG.",
    ),
  component: Cart,
});

function Cart() {
  const { items, update, projectName, setProjectName, count, subtotal } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const order = () =>
    user
      ? navigate({ to: "/bestellen" })
      : navigate({ to: "/inloggen", search: { reason: "bestellen", returnTo: "/bestellen" } });
  const [printedAt, setPrintedAt] = useState("");
  const lines = projectLines(items);
  const groups = groupByCategory(lines);
  const warnings = projectWarnings(lines);
  const kwp = totalKwp(lines);
  const co2 = kwp > 0 ? estimateCo2Savings(kwp) : null;

  const totals = orderTotals(subtotal);
  const download = () => {
    const text =
      `ESTG — Selectie\n${COMPANY_ADDRESS} · ${COMPANY.phone}\n${new Date().toLocaleDateString("nl-NL")}\n${projectName ? `Project/klantreferentie: ${projectName}\n` : ""}\n` +
      lines
        .map(
          (l) =>
            `${l.quantity} × ${l.product.name} (${l.product.brand}, ${l.product.sku}) — ${formatEuro(l.product.price)} p/st, ${formatEuro(l.product.price * l.quantity)}`,
        )
        .join("\n") +
      `\n\nSubtotaal (excl. btw): ${formatEuroExact(totals.subtotal)}` +
      `\nVerzending (excl. btw): ${formatEuroExact(totals.shipping)}` +
      `\nBtw (21%): ${formatEuroExact(totals.vat)}` +
      `\nTotaal (incl. btw en verzending): ${formatEuroExact(totals.total)}` +
      "\n\nVoorbeeldprijzen, excl. btw. Definitieve prijs, specificaties en beschikbaarheid bevestigt ESTG. Geen bestelling geplaatst.";
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "ESTG-selectie.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageIntro title="Winkelmand" description="Alle geselecteerde oplossingen op een rij." />
      <section className="container section" style={{ paddingBlock: 0 }}>
        {lines.length ? (
          <div className="project-layout">
            <div>
              <input
                className="project-name"
                aria-label="Projectnaam / klantreferentie (optioneel)"
                placeholder="Projectnaam / klantreferentie, bijv. Project Jansen – Dakrenovatie"
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
                        <p className="cart-price">
                          {formatEuro(p.price)} p/st ·{" "}
                          <strong>{formatEuro(p.price * quantity)}</strong>
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
              <PriceBreakdown subtotal={subtotal} />
              <dl className="project-facts">
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
              <p className="co2-note">{shippingNote}</p>
              <Button variant="accent" size="lg" onClick={order}>
                Bestellen <ArrowUpRight />
              </Button>
              <Button variant="outline" onClick={download}>
                <Download /> Download selectie
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPrintedAt(new Date().toLocaleDateString("nl-NL"));
                  setTimeout(() => window.print(), 80);
                }}
              >
                <Printer /> Print overzicht
              </Button>
              <p className="co2-note">
                Bestellen vraagt om een account. Er wordt geen echte betaling verwerkt; je selectie
                blijft alleen tijdens dit bezoek bewaard.
              </p>
            </aside>
          </div>
        ) : (
          <div className="empty-state cart-empty">
            <span className="cart-empty-icon">
              <ShoppingBag size={44} strokeWidth={1.4} />
            </span>
            <h2>Je winkelmand is nog leeg</h2>
            <p>
              Voeg producten toe en bestel ze direct bij ESTG. Begin bijvoorbeeld bij onze
              bestsellers.
            </p>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <Button asChild variant="accent">
                <Link to="/" hash="bestsellers">
                  Bekijk bestsellers <ArrowUpRight />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/webshop" search={{ q: "", category: "", brand: "" }}>
                  Naar het assortiment
                </Link>
              </Button>
            </div>
          </div>
        )}
      </section>
      {lines.length > 0 && (
        <div className="print-sheet" aria-hidden>
          <header className="print-head">
            <img className="print-logo" src="/brand/estg-logo.png" alt="ESTG" />
            <address>
              <strong>ESTG · European Sustainable Technology Group</strong>
              {COMPANY.street}, {COMPANY.city}
              <br />
              {COMPANY.phone}
            </address>
          </header>
          <div className="print-title">
            <div>
              <h1>Selectie</h1>
              <p>Datum: {printedAt}</p>
            </div>
            {projectName && (
              <div className="print-ref">
                <span>Project / klantreferentie</span>
                <strong>{projectName}</strong>
              </div>
            )}
          </div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Merk</th>
                <th>Artikelnr.</th>
                <th className="num">Aantal</th>
                <th className="num">Prijs p/st</th>
                <th className="num">Subtotaal</th>
              </tr>
            </thead>
            <tbody>
              {lines.map(({ product: p, quantity }) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.brand}</td>
                  <td>{p.sku}</td>
                  <td className="num">{quantity}</td>
                  <td className="num">{formatEuro(p.price)}</td>
                  <td className="num">{formatEuro(p.price * quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <dl className="print-breakdown">
            <div>
              <dt>Subtotaal (excl. btw)</dt>
              <dd>{formatEuroExact(totals.subtotal)}</dd>
            </div>
            <div>
              <dt>Verzending (excl. btw)</dt>
              <dd>{formatEuroExact(totals.shipping)}</dd>
            </div>
            <div>
              <dt>Btw (21%)</dt>
              <dd>{formatEuroExact(totals.vat)}</dd>
            </div>
            <div className="total">
              <dt>Totaal (incl. btw en verzending)</dt>
              <dd>{formatEuroExact(totals.total)}</dd>
            </div>
          </dl>
          <footer className="print-foot">
            <p>
              Voorbeeldassortiment: prijzen, specificaties en beschikbaarheid zijn illustratief en
              worden bevestigd door ESTG. Er is geen bestelling geplaatst.
            </p>
            <p>
              Vragen? ESTG · {COMPANY.street}, {COMPANY.city} · {COMPANY.phone} · {COMPANY.hours}
            </p>
          </footer>
        </div>
      )}
    </>
  );
}
