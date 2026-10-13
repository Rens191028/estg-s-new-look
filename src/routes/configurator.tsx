import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/estg/page-intro";
import { useStore } from "@/components/estg/store";
import { CategoryIcon } from "@/components/estg/ui-bits";
import { CO2_FACTOR } from "@/lib/co2";
import { pageHead } from "@/lib/catalog";
import {
  buildConfiguration,
  CONSUMPTION,
  describeConfiguration,
  PANEL_AREA_M2,
  type ConsumptionClass,
  type RoofType,
} from "@/lib/configurator";
import { formatEuro, formatInt, formatKwp } from "@/lib/format";

export const Route = createFileRoute("/configurator")({
  head: () =>
    pageHead(
      "Systeem samenstellen",
      "Stel in drie stappen een indicatieve zonne-energieset samen: dak, verbruik en extra wensen.",
    ),
  component: Configurator,
});

const STEPS = ["Dak", "Verbruik", "Extra's", "Resultaat"] as const;

function Configurator() {
  const { add } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [roofArea, setRoofArea] = useState(200);
  const [roofType, setRoofType] = useState<RoofType>("schuin");
  const [consumption, setConsumption] = useState<ConsumptionClass>("middel");
  const [battery, setBattery] = useState(false);
  const [charger, setCharger] = useState(false);

  const result = useMemo(
    () => buildConfiguration({ roofArea, roofType, consumption, battery, charger }),
    [roofArea, roofType, consumption, battery, charger],
  );
  const warnings = result.checks.filter((c) => c.status === "niet-compatibel");

  return (
    <>
      <PageIntro
        title="Systeem samenstellen"
        description="Liever klikken dan typen? Beantwoord een paar vragen en ontvang een indicatieve set uit het voorbeeldassortiment."
      />
      <section className="container section" style={{ maxWidth: 860 }}>
        <ol className="wizard-steps" aria-label="Voortgang">
          {STEPS.map((s, i) => (
            <li
              key={s}
              className={i === step ? "current" : i < step ? "done" : ""}
              aria-current={i === step ? "step" : undefined}
            >
              <span>{i < step ? <Check size={14} /> : i + 1}</span>
              {s}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="wizard-panel">
            <h2>Hoe groot is het dak?</h2>
            <div className="field">
              <label htmlFor="area">Beschikbaar dakoppervlak (m²)</label>
              <input
                id="area"
                type="range"
                min={20}
                max={2000}
                step={10}
                value={roofArea}
                onChange={(e) => setRoofArea(Number(e.target.value))}
              />
              <p className="wizard-value">
                {formatInt(roofArea)} m²{" "}
                <small>
                  ≈ {formatInt(Math.floor(roofArea / PANEL_AREA_M2))} panelen (indicatief)
                </small>
              </p>
            </div>
            <fieldset className="category-picker">
              <legend>Type dak</legend>
              {(["schuin", "plat"] as const).map((t) => (
                <label key={t} className={roofType === t ? "selected" : ""}>
                  <input
                    type="radio"
                    name="roof"
                    checked={roofType === t}
                    onChange={() => setRoofType(t)}
                  />
                  <span>
                    <strong>{t === "schuin" ? "Schuin dak" : "Plat dak"}</strong>
                    <small>
                      {t === "schuin" ? "Rails en dakhaken" : "Ballast, geen doorboring"}
                    </small>
                  </span>
                </label>
              ))}
            </fieldset>
          </div>
        )}

        {step === 1 && (
          <div className="wizard-panel">
            <h2>Hoeveel stroom verbruik je per jaar?</h2>
            <fieldset className="category-picker single">
              <legend>Kies de klasse die het best past</legend>
              {(Object.keys(CONSUMPTION) as ConsumptionClass[]).map((c) => (
                <label key={c} className={consumption === c ? "selected" : ""}>
                  <input
                    type="radio"
                    name="use"
                    checked={consumption === c}
                    onChange={() => setConsumption(c)}
                  />
                  <span>
                    <strong>
                      {CONSUMPTION[c].label} · ±{formatInt(CONSUMPTION[c].kwh)} kWh
                    </strong>
                    <small>{CONSUMPTION[c].hint}</small>
                  </span>
                </label>
              ))}
            </fieldset>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-panel">
            <h2>Extra wensen</h2>
            <fieldset className="category-picker single">
              <legend>Optioneel</legend>
              <label className={battery ? "selected" : ""}>
                <input
                  type="checkbox"
                  checked={battery}
                  onChange={(e) => setBattery(e.target.checked)}
                />
                <span>
                  <strong>Batterij voor opslag</strong>
                  <small>Gebruik zonne-energie ook ’s avonds (vraagt een hybride omvormer)</small>
                </span>
              </label>
              <label className={charger ? "selected" : ""}>
                <input
                  type="checkbox"
                  checked={charger}
                  onChange={(e) => setCharger(e.target.checked)}
                />
                <span>
                  <strong>Laadpaal voor elektrische auto’s</strong>
                  <small>Laad op eigen opgewekte energie</small>
                </span>
              </label>
            </fieldset>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-panel">
            <h2>Jouw indicatieve set</h2>
            <p className="advice-summary" style={{ fontSize: 22, lineHeight: "28px" }}>
              {formatKwp(result.kwp)} aan panelen, ongeveer {formatEuro(result.total)} excl. btw.
            </p>
            {result.notes.map((n) => (
              <p key={n} className="muted" style={{ margin: "0 0 8px" }}>
                {n}
              </p>
            ))}
            {warnings.length > 0 && (
              <div className="compat-warn" role="status">
                <AlertTriangle size={20} />
                <ul>
                  {warnings.map((w) => (
                    <li key={w.reason}>{w.reason}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="advice-grid">
              {result.lines.map((l) => (
                <article className="advice-card" key={l.product.id}>
                  <Link to="/producten/$id" params={{ id: l.product.id }} className="advice-thumb">
                    {l.product.image ? (
                      <img src={l.product.image} alt={l.product.name} width={96} height={96} />
                    ) : (
                      <CategoryIcon category={l.product.category} size={36} />
                    )}
                  </Link>
                  <div>
                    <h3>
                      {l.quantity} × {l.product.name}
                    </h3>
                    <p>
                      {l.product.brand} · <span className="sku">{l.product.sku}</span>
                    </p>
                    <p>{l.reason}</p>
                  </div>
                  <strong className="line-price">
                    {formatEuro(l.product.price * l.quantity)}
                    <small>{formatEuro(l.product.price)} p/st</small>
                  </strong>
                </article>
              ))}
            </div>
            <p className="co2-note">
              ~{formatInt(Math.round(result.co2KgPerYear))} kg CO₂-besparing per jaar (indicatie, op
              basis van{" "}
              <a href={CO2_FACTOR.source} target="_blank" rel="noreferrer">
                CO2emissiefactoren.nl
              </a>
              ).
            </p>
            <div className="hero-actions">
              <Button
                variant="accent"
                size="lg"
                onClick={() => {
                  for (const l of result.lines) add(l.product.id, l.quantity);
                  navigate({ to: "/winkelwagen" });
                }}
              >
                Toevoegen en naar winkelmand <ArrowRight />
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link
                  to="/advisor"
                  search={{
                    vraag: describeConfiguration(
                      { roofArea, roofType, consumption, battery, charger },
                      result,
                    ),
                  }}
                >
                  Verfijn met de AI-adviseur
                </Link>
              </Button>
            </div>
            <p className="sample-note">
              Indicatieve set uit het voorbeeldassortiment, op basis van vuistregels.
              Voorbeeldprijzen excl. btw; exacte dimensionering en compatibiliteit bevestigt ESTG.
            </p>
          </div>
        )}

        <div className="wizard-nav">
          <Button
            variant="ghost"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            <ArrowLeft /> Terug
          </Button>
          {step < 3 && (
            <Button onClick={() => setStep((s) => Math.min(3, s + 1))}>
              {step === 2 ? "Toon resultaat" : "Volgende"} <ArrowRight />
            </Button>
          )}
        </div>
      </section>
    </>
  );
}
