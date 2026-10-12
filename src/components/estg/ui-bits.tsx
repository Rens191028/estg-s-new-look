import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BatteryCharging,
  CircuitBoard,
  PlugZap,
  Sun,
  Thermometer,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { availabilityFor } from "@/lib/availability";
import { discountPercent, isDeal, type Category, type Product } from "@/lib/catalog";
import { formatEuro, formatEuroExact } from "@/lib/format";
import { orderTotals, SHIPPING_EX_VAT, VAT_RATE } from "@/lib/pricing";

// Tijdelijke iconen uit lucide totdat de eigen ESTG-iconenset per categorie bestaat.
const categoryIcons: Record<Category, LucideIcon> = {
  Zonnepanelen: Sun,
  Omvormers: CircuitBoard,
  Energieopslag: BatteryCharging,
  "EV-laders": PlugZap,
  Montagemateriaal: Wrench,
  Klimaat: Thermometer,
};

export function CategoryIcon({ category, size = 24 }: { category: Category; size?: number }) {
  const Icon = categoryIcons[category];
  return <Icon size={size} strokeWidth={1.6} aria-hidden />;
}

/**
 * Beschikbaarheidsindicatie. Er is nog geen voorraadbron: de tekst is een vast, fictief patroon per
 * product (zie lib/availability.ts) en dus illustratief.
 */
export function AvailabilityBadge({ productId }: { productId: string }) {
  const a = availabilityFor(productId);
  return (
    <Badge
      tone={a.tone}
      title="Illustratieve beschikbaarheid; ESTG bevestigt de actuele levertijd."
    >
      {a.label}
    </Badge>
  );
}

/** Grijs blok in de vorm van de uiteindelijke content, voor rustig laden. */
export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={`skeleton ${className}`.trim()} style={style} aria-hidden />;
}

/** Roteert door statusregels zolang `active` waar is (bijv. tijdens een trage AI-aanroep). */
export function useLoadingStep(active: boolean, steps: readonly string[], intervalMs = 3500) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) {
      setI(0);
      return;
    }
    const t = setInterval(() => setI((n) => Math.min(n + 1, steps.length - 1)), intervalMs);
    return () => clearInterval(t);
  }, [active, steps.length, intervalMs]);
  return steps[i] ?? steps[0] ?? "";
}

/** Laat inhoud zachtjes verschijnen zodra die in beeld komt. Zonder JavaScript blijft alles zichtbaar. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      el.getBoundingClientRect().top < window.innerHeight
    ) {
      setState("shown");
      return;
    }
    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = state === "idle" ? "" : state === "shown" ? "reveal in" : "reveal";
  return (
    <div
      ref={ref}
      className={`${cls} ${className}`.trim()}
      style={delay ? ({ "--delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

/** Telt van 0 naar `to` zodra het element in beeld komt. Zonder animatie bij 'reduced motion'. */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1200,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    setValue(0);
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {new Intl.NumberFormat("nl-NL").format(value)}
      {suffix}
    </span>
  );
}

/** Prijsweergave met was-prijs (doorgestreept) en kortingsbadge wanneer het product in de aanbieding is. */
export function Price({ product, size = "card" }: { product: Product; size?: "card" | "detail" }) {
  const deal = isDeal(product);
  return (
    <span className={`price-line price-line--${size}`}>
      {deal && (
        <s className="price-was" aria-label={`Was ${formatEuro(product.originalPrice!)}`}>
          {formatEuro(product.originalPrice!)}
        </s>
      )}
      <span className={deal ? "price-now deal" : "price-now"}>{formatEuro(product.price)}</span>
      <small>excl. btw</small>
      {deal && <span className="deal-badge">−{discountPercent(product)}%</span>}
    </span>
  );
}

/** Certificeringen als chips, met een duidelijke disclaimer dat dit illustratieve voorbeelddata is. */
export function Certifications({ items }: { items: string[] | undefined }) {
  if (!items?.length) return null;
  return (
    <div className="cert-box">
      <h3>Certificeringen</h3>
      <ul>
        {items.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <p className="cert-note">
        Illustratieve voorbeelddata, geen geverifieerde claim. De daadwerkelijke certificering per
        product bevestigt ESTG.
      </p>
    </div>
  );
}

/** Gegroepeerde prijsopbouw: subtotaal → verzending → btw → totaal (fictieve voorbeeldwaarden). */
export function PriceBreakdown({ subtotal }: { subtotal: number }) {
  const t = orderTotals(subtotal);
  return (
    <dl className="price-breakdown">
      <div>
        <dt>Subtotaal (excl. btw)</dt>
        <dd>{formatEuroExact(t.subtotal)}</dd>
      </div>
      <div>
        <dt>Verzending (excl. btw)</dt>
        <dd>{formatEuroExact(t.shipping)}</dd>
      </div>
      <div>
        <dt>Btw ({Math.round(VAT_RATE * 100)}%)</dt>
        <dd>{formatEuroExact(t.vat)}</dd>
      </div>
      <div className="total">
        <dt>Totaal (incl. btw en verzending)</dt>
        <dd>{formatEuroExact(t.total)}</dd>
      </div>
    </dl>
  );
}

export const shippingNote = `Voorbeeldprijzen. Verzending is een vast fictief bedrag van ${formatEuro(SHIPPING_EX_VAT)} excl. btw; definitieve verzendkosten bevestigt ESTG.`;
