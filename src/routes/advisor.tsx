import { useServerFn } from "@tanstack/react-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/estg/page-intro";
import { useStore } from "@/components/estg/store";
import { askAssistant } from "@/lib/assistant/chat.functions";
import { MAX_MESSAGE_LENGTH } from "@/lib/assistant/guards";
import type { AssistantResult } from "@/lib/assistant/types";
import { findProduct, pageHead } from "@/lib/catalog";
import { formatEuro } from "@/lib/format";

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

// De prijs komt uit de catalogus, nooit van het taalmodel.
function estimatedTotal(recs: { productId: string; quantity: number }[]) {
  return recs.reduce((sum, r) => sum + (findProduct(r.productId)?.price ?? 0) * r.quantity, 0);
}

function Advisor() {
  const ask = useServerFn(askAssistant);
  const { add } = useStore();
  const { vraag } = Route.useSearch();
  const [message, setMessage] = useState(vraag);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<AssistantResult | null>(null);
  const [added, setAdded] = useState(false);

  const submit = async () => {
    if (!message.trim() || busy) return;
    setBusy(true);
    setAdded(false);
    try {
      setResult(await ask({ data: { source: "advisor", message, history: [] } }));
    } catch {
      setResult({
        ok: false,
        code: "upstream",
        message: "Er ging iets mis. Probeer het zo opnieuw.",
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
              placeholder="Bijv. 20 zonnepanelen op een schuin dak, 3-fase aansluiting, met batterij"
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button type="submit" variant="accent" size="lg" disabled={busy || !message.trim()}>
            <Sparkles /> {busy ? "Even denken…" : "Vraag advies"}
          </Button>
        </form>

        {result && !result.ok && (
          <div className="confirmation" role="alert" style={{ marginTop: 24 }}>
            {result.message}
          </div>
        )}
        {result?.ok && (
          <div style={{ marginTop: 32 }}>
            <p style={{ fontSize: 17, lineHeight: "26px" }}>{result.reply}</p>
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
                <div className="cart-group">
                  {result.recommendations.map((r) => {
                    const p = findProduct(r.productId);
                    if (!p) return null;
                    return (
                      <div
                        className="cart-row"
                        key={r.productId}
                        style={{ gridTemplateColumns: "1fr auto" }}
                      >
                        <div>
                          <Link to="/producten/$id" params={{ id: p.id }}>
                            <h3 style={{ border: 0, padding: 0, color: "inherit" }}>
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
                      </div>
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
