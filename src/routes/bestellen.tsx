import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { PageIntro } from "@/components/estg/page-intro";
import { PriceBreakdown, shippingNote } from "@/components/estg/ui-bits";
import { useOrders } from "@/components/estg/orders";
import { orderTotals } from "@/lib/pricing";
import { useStore } from "@/components/estg/store";
import { useAuth } from "@/components/estg/auth";
import { pageHead } from "@/lib/catalog";
import { groupByCategory, projectLines } from "@/lib/project";
import { formatEuro } from "@/lib/format";

export const Route = createFileRoute("/bestellen")({
  head: () =>
    pageHead(
      "Bestellen",
      "Controleer je bestelling, vul je gegevens in en kies een gewenste verzenddatum bij ESTG.",
    ),
  component: Order,
});

const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

/** Vroegst mogelijke verzenddatum: 2 werkdagen na vandaag. */
function earliestDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  let added = 0;
  while (added < 2) {
    d.setDate(d.getDate() + 1);
    if (!isWeekend(d)) added++;
  }
  return d;
}

const formatDate = (d: Date) =>
  d.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

function Order() {
  const { user, profile, loading } = useAuth();
  const { items, subtotal, projectName } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", company: "", email: "" });
  const [prefilled, setPrefilled] = useState(false);
  const [minDate] = useState(earliestDate);
  const [date, setDate] = useState<Date | undefined>();
  const [dateError, setDateError] = useState(false);
  const [done, setDone] = useState<null | (typeof form & { date: Date; subtotal: number; reference: string; orderId: string | null; saveNote: string | null })>(null);
  const [placing, setPlacing] = useState(false);
  const { place } = useOrders();

  useEffect(() => {
    if (!loading && !user)
      navigate({ to: "/inloggen", search: { reason: "bestellen", returnTo: "/bestellen" }, replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile && !prefilled) {
      setForm({
        name: profile.full_name ?? "",
        company: profile.company_name ?? "",
        email: profile.email ?? user?.email ?? "",
      });
      setPrefilled(true);
    }
  }, [profile, prefilled, user?.email]);

  if (loading || !user) return <PageIntro title="Bestellen" description="Even geduld…" />;

  const lines = projectLines(items);
  const groups = groupByCategory(lines);

  if (done)
    return (
      <>
        <PageIntro title="Bestelling ontvangen" description="Bedankt voor je bestelling." />
        <section className="container section" style={{ paddingBlock: 0, maxWidth: 720 }}>
          <div className="ticket-card" role="status">
            <CheckCircle2 size={36} />
            <h3>Bestelling doorgegeven</h3>
            <dl>
              {done.reference && <div><dt>Projectnaam / klantreferentie</dt><dd>{done.reference}</dd></div>}
              <div><dt>Gewenste verzenddatum</dt><dd>{formatDate(done.date)}</dd></div>
              <div><dt>Naam</dt><dd>{done.name}</dd></div>
              <div><dt>Bedrijfsnaam</dt><dd>{done.company}</dd></div>
              <div><dt>E-mailadres</dt><dd>{done.email}</dd></div>
            </dl>
            <PriceBreakdown subtotal={done.subtotal} />
            <p className="sample-note" style={{ padding: 0 }}>
              Dit is een voorbeeldomgeving — er wordt geen echte betaling verwerkt. ESTG neemt
              contact met je op om de betaling en levering verder af te ronden.
            </p>
            {done.saveNote && (
              <p className="form-note" role="status">
                Je bestelling is opgeslagen in deze browser, omdat de bestellingen-database nog niet
                bereikbaar is. Je vindt hem onder Account → Bestellingen.
                <small className="save-error">Technische melding: {done.saveNote}</small>
              </p>
            )}
            {done.orderId && (
              <Button asChild variant="accent">
                <Link to="/account" search={{ tab: "bestellingen", order: done.orderId }}>
                  Bekijk je bestelling
                </Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link to="/winkelwagen">Terug naar winkelmand</Link>
            </Button>
          </div>
        </section>
      </>
    );

  if (!lines.length)
    return (
      <>
        <PageIntro title="Bestellen" description="Je winkelmand is nog leeg." />
        <section className="container section" style={{ paddingBlock: 0 }}>
          <Button asChild variant="accent">
            <Link to="/webshop" search={{ q: "", category: "", brand: "" }}>
              Naar het assortiment <ArrowUpRight />
            </Link>
          </Button>
        </section>
      </>
    );

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <PageIntro title="Bestellen" description="Controleer je bestelling en vul je gegevens in." />
      <section className="container section" style={{ paddingBlock: 0 }}>
        <form
          className="project-layout"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!date) return setDateError(true);
            if (placing) return;
            setPlacing(true);
            const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            const { order, error, local } = await place({
              lines: lines.map((l) => ({
                product_id: l.product.id,
                name: l.product.name,
                brand: l.product.brand,
                sku: l.product.sku,
                quantity: l.quantity,
                unit_price: l.product.price,
              })),
              totals: orderTotals(subtotal),
              shipDate: iso,
              reference: projectName,
              contact: form,
            });
            setPlacing(false);
            setDone({ ...form, date, subtotal, reference: projectName, orderId: order?.id ?? null, saveNote: local ? (error ?? "Opslaan mislukt.") : null });
            window.scrollTo({ top: 0 });
          }}
        >
          <div>
            <h2 style={{ marginBottom: 16 }}>Overzicht{projectName ? `: ${projectName}` : ""}</h2>
            {groups.map((g) => (
              <div className="cart-group" key={g.category}>
                <h3>{g.category}</h3>
                {g.lines.map(({ product: p, quantity }) => (
                  <div className="cart-row" key={p.id} style={{ gridTemplateColumns: "1fr auto" }}>
                    <div>
                      <h3 style={{ borderBottom: 0, padding: 0 }}>{quantity} × {p.name}</h3>
                      <p>{p.brand} · <span className="sku">{p.sku}</span> · {formatEuro(p.price)} p/st</p>
                    </div>
                    <strong>{formatEuro(p.price * quantity)}</strong>
                  </div>
                ))}
              </div>
            ))}
            <h2 style={{ margin: "32px 0 16px" }}>Gegevens</h2>
            <div className="field">
              <label htmlFor="o-name">Naam</label>
              <input id="o-name" required autoComplete="name" value={form.name} onChange={set("name")} />
            </div>
            <div className="field">
              <label htmlFor="o-company">Bedrijfsnaam</label>
              <input id="o-company" required autoComplete="organization" value={form.company} onChange={set("company")} />
            </div>
            <div className="field">
              <label htmlFor="o-email">E-mailadres</label>
              <input id="o-email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} />
            </div>
            <h2 style={{ margin: "32px 0 8px" }}>Gewenste verzenddatum</h2>
            <p className="co2-note">Vroegst mogelijk: {formatDate(minDate)} (binnen 2 werkdagen, geen weekenden).</p>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setDateError(false);
              }}
              disabled={[{ before: minDate }, isWeekend]}
              startMonth={minDate}
              defaultMonth={minDate}
              className="rounded-md border"
            />
            {dateError && (
              <div className="form-error" role="alert" style={{ marginTop: 12 }}>
                Kies een verzenddatum.
              </div>
            )}
          </div>
          <aside className="summary-card" aria-label="Samenvatting">
            <h3>Samenvatting</h3>
            <PriceBreakdown subtotal={subtotal} />
            <dl className="project-facts">
              {projectName && <div><dt>Referentie</dt><dd>{projectName}</dd></div>}
              <div><dt>Verzenddatum</dt><dd>{date ? date.toLocaleDateString("nl-NL") : "—"}</dd></div>
            </dl>
            <p className="co2-note">{shippingNote} Er wordt geen echte betaling verwerkt.</p>
            <Button type="submit" variant="accent" size="lg" disabled={placing}>
              {placing ? "Bestelling plaatsen…" : "Doorgaan naar betaling"} <ArrowUpRight />
            </Button>
          </aside>
        </form>
      </section>
    </>
  );
}
