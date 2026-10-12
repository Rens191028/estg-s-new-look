import {
  Check,
  ChevronDown,
  PackageCheck,
  ShoppingBag,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatEuro, formatEuroExact } from "@/lib/format";
import {
  CARRIER,
  currentStep,
  lineImage,
  statusLabel,
  trackingSteps,
  type Order,
  type StepKey,
} from "@/lib/orders";
import { PriceBreakdown } from "./ui-bits";

const icons: Record<StepKey, LucideIcon> = {
  received: ShoppingBag,
  processing: PackageCheck,
  shipped: Truck,
  delivered: Check,
};

const day = (d: Date) =>
  d.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
const time = (d: Date) => d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
const stamp = (d: Date) => `${day(d)}, ${time(d)}`;

/** Houdt "nu" bij, zodat de status vanzelf voortschrijdt terwijl de pagina openstaat. */
function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export function useOrderStatus(order: Order) {
  const now = useNow();
  const steps = trackingSteps(order);
  const idx = currentStep(steps, now);
  return { now, steps, idx, current: steps[idx]! };
}

export function StatusBadge({ order }: { order: Order }) {
  const { current } = useOrderStatus(order);
  const tone =
    current.key === "delivered" ? "success" : current.key === "shipped" ? "accent" : "info";
  return <Badge tone={tone}>{statusLabel[current.key]}</Badge>;
}

/** Fictieve DACHSER-tracker (geen echte koppeling): voortgangslijn die vult tot de huidige stap. */
export function DachserTracker({ order }: { order: Order }) {
  const { now, steps, idx } = useOrderStatus(order);
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 80);
    return () => clearTimeout(t);
  }, []);
  const delivery = steps[3]!.at;
  const pct = (idx / (steps.length - 1)) * 100;
  return (
    <section className="tracker" aria-label="Zending volgen">
      <header className="tracker-head">
        <div className="dachser-badge" title="Fictieve vervoerder, illustratief">
          <strong>{CARRIER.name}</strong>
          <span>{CARRIER.tagline}</span>
        </div>
        <dl>
          <div>
            <dt>Trackingnummer</dt>
            <dd className="tracker-number">{order.tracking_number}</dd>
          </div>
          <div>
            <dt>{idx === 3 ? "Bezorgd op" : "Verwachte levering"}</dt>
            <dd>{stamp(delivery)}</dd>
          </div>
        </dl>
      </header>
      <ol className="tracker-steps" style={{ ["--pct" as string]: `${pct}%` }}>
        <li className="tracker-line" aria-hidden>
          <span style={{ transform: `scaleX(${filled ? 1 : 0})` }} />
        </li>
        {steps.map((s, i) => {
          const Icon = icons[s.key];
          const state = i < idx ? "done" : i === idx ? "active" : "todo";
          const reached = now.getTime() >= s.at.getTime();
          return (
            <li key={s.key} className={`tracker-step is-${state}`}>
              <span className="tracker-dot">
                <Icon size={20} aria-hidden />
              </span>
              <strong>{s.label}</strong>
              <small>{reached ? stamp(s.at) : `Verwacht ${stamp(s.at)}`}</small>
            </li>
          );
        })}
      </ol>
      <p className="tracker-note">
        Fictieve tracking ter illustratie: er is geen koppeling met DACHSER of een echt
        trackingsysteem.
      </p>
    </section>
  );
}

/** Uitklapbare bestelling met totaalbedrag en status op het eerste niveau en details op het tweede. */
export function OrderCard({ order, defaultOpen = false }: { order: Order; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const placed = new Date(order.created_at);
  const count = order.lines.reduce((n, l) => n + l.quantity, 0);
  return (
    <article className={`order-card ${open ? "is-open" : ""}`} id={`order-${order.id}`}>
      <button
        type="button"
        className="order-summary"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="order-main">
          <strong>
            Bestelling van{" "}
            {placed.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
          </strong>
          <small>
            {order.reference ? `${order.reference} · ` : ""}
            {count} {count === 1 ? "product" : "producten"} · {order.tracking_number}
          </small>
        </span>
        <span className="order-meta">
          <StatusBadge order={order} />
          <strong className="order-total">{formatEuroExact(order.totals.total)}</strong>
          <ChevronDown size={18} className="chev" aria-hidden />
        </span>
      </button>
      {open && (
        <div className="order-details">
          <DachserTracker order={order} />
          <div className="order-lines">
            <h3>Producten</h3>
            {order.lines.map((l) => {
              const img = lineImage(l);
              return (
                <div className="order-line" key={l.product_id}>
                  {img ? (
                    <img src={img} alt={l.name} width={72} height={72} loading="lazy" />
                  ) : (
                    <span className="order-thumb" aria-hidden />
                  )}
                  <div>
                    <strong>
                      {l.quantity} × {l.name}
                    </strong>
                    <small>
                      {l.brand} · {l.sku}
                    </small>
                  </div>
                  <span className="order-line-price">
                    {formatEuro(l.unit_price * l.quantity)}
                    <small>{formatEuro(l.unit_price)} p/st</small>
                  </span>
                </div>
              );
            })}
          </div>
          <div className="order-totals">
            <h3>Prijsopbouw</h3>
            <PriceBreakdown subtotal={order.totals.subtotal} />
          </div>
        </div>
      )}
    </article>
  );
}
