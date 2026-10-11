import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/estg/page-intro";
import { useStore } from "@/components/estg/store";
import { requestAdvice, type AdviceResult } from "@/lib/assistant/client";
import { MAX_MESSAGE_LENGTH } from "@/lib/assistant/guards";
import { findProduct, pageHead } from "@/lib/catalog";
import { formatEuro } from "@/lib/format";
import { CategoryIcon, useLoadingStep } from "@/components/estg/ui-bits";
import { ADVICE_STEPS } from "@/lib/availability";

export const Route = createFileRoute("/advisor")({
  validateSearch: (s: Record<string, unknown>) => ({
    vraag: typeof s["vraag"] === "string" ? s["vraag"].slice(0, MAX_MESSAGE_LENGTH) : "",
  }),
  head: () =>
    pageHead(
      "AI-adviseur",
      "Beschrijf je project en ontvang een productadvies uit het ESTG-assortiment.",
    ),
  component: Advisor,
});

type Result = ({ ok: true } & AdviceResult) | { ok: false; message: string };

// De prijs komt uit de catalogus, nooit van het taalmodel.
function estimatedTotal(recs: { productId: string; quantity: number }[]) {
  return recs.reduce((sum, r) => sum + (findProduct(r.productId)?.price ?? 0) * r.quantity, 0);
}

function Advisor() {
  const { add } = useStore();
  const { vraag } = Route.useSearch();
  const [message, setMessage] = useState(vraag);
  const [requirements, setRequirements] = useState("");
  const [busy, setBusy] = useState(false);
  const step = useLoadingStep(busy, ADVICE_STEPS, 3500);
  const [result, setResult] = useState<Result | null>(null);
  const [added, setAdded] = useState(false);

  const submit = async () => {
    if (!message.trim() || busy) return;
    setBusy(true);
    setAdded(false);
    try {
      const full = requirements.trim()
        ? `${message.trim()}\n\nInstallatie-eisen: ${requirements.trim()}`
        : message.trim();
      setResult({ ok: true, ...(await requestAdvice(full)) });
    } catch (e) {
      setResult({
        ok: false,
        message: e instanceof Error ? e.message : "Er ging iets mis. Bel 085 016 7800.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageIntro
        title="AI-adviseur"
        description="Beschrijf je project, bijvoorbeeld het aantal panelen en of je een batterij wilt. Je krijgt een advies uit het voorbeeldassortiment."
      />
      <section className="container section" style={{ maxWidth: 860 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <div className="field">
            <label htmlFor="project">Projectomschrijving</label>
            <textarea
              id="project"
              rows={4}
              maxLength={MAX_MESSAGE_LENGTH}
              value={message}
              placeholder="Bijv. 20 zonnepanelen op een schuin dak, met batterij"
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="eisen">Installatie-eisen (optioneel)</label>
            <textarea
              id="eisen"
              rows={2}
              maxLength={500}
              value={requirements}
              placeholder="Bijv. 3-fase aansluiting, noodstroom gewenst, oost-west dak"
              onChange={(e) => setRequirements(e.target.value)}
            />
          </div>
          <Button type="submit" variant="accent" size="lg" disabled={busy || !message.trim()}>
            <Sparkles /> {busy ? "Even geduld…" : "Vraag advies"}
          </Button>
        </form>

        {busy && (
          <div className="advice-loading" role="status" aria-live="polite">
            <span className="loading-dots" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            {step}
          </div>
        )}
        {result && !result.ok && (
          <div className="confirmation" role="alert" style={{ marginTop: 24 }}>
            {result.message}
          </div>
        )}
        {result?.ok && (
          <div style={{ marginTop: 32 }}>
            <p className="advice-summary">{result.reply}</p>
            {result.warnings.length > 0 && (
              <div className="compat-warn" role="status">
                <AlertTriangle size={20} />
                <ul>
                  {result.warnings.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.recommendations.length > 0 && (
              <>
                <div className="advice-grid">
                  {result.recommendations.map((r) => {
                    const p = findProduct(r.productId);
                    if (!p) return null;
                    return (
                      <article className="advice-card" key={r.productId}>
                        <Link to="/producten/$id" params={{ id: p.id }} className="advice-thumb">
                          {p.image ? (
                            <img src={p.image} alt={p.name} width={96} height={96} />
                          ) : (
                            <CategoryIcon category={p.category} size={36} />
                          )}
                        </Link>
                        <div>
                          <Link to="/producten/$id" params={{ id: p.id }}>
                            <h3>
                              {r.quantity} × {p.name}
                            </h3>
                          </Link>
                          <p>
                            {p.brand} · <span className="sku">{p.sku}</span>
                          </p>
                          <p>{r.reason}</p>
                        </div>
                        <strong className="line-price">
                          {formatEuro(p.price * r.quantity)}
                          <small>{formatEuro(p.price)} p/st</small>
                        </strong>
                      </article>
                    );
                  })}
                </div>
                <p className="advisor-total">
                  Geschat totaal (excl. btw):{" "}
                  <strong>{formatEuro(estimatedTotal(result.recommendations))}</strong>
                  <small>Voorbeeldprijzen, definitieve prijs bevestigt ESTG.</small>
                </p>
                <Button
                  onClick={() => {
                    for (const r of result.recommendations) add(r.productId, r.quantity);
                    setAdded(true);
                  }}
                >
                  {added ? <Check /> : null}
                  {added ? "Toegevoegd aan winkelmand" : "Alles toevoegen aan winkelmand"}
                </Button>
              </>
            )}
          </div>
        )}
        <p className="sample-note">
          Het advies is indicatief en komt uit het voorbeeldassortiment. Prijzen, beschikbaarheid en
          exacte compatibiliteit bevestigt ESTG.
        </p>
      </section>
    </>
  );
}
