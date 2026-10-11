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
import type { Category } from "@/lib/catalog";

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
 * Voorraadstatus. Er is nog geen gekoppelde voorraadbron, dus tonen we geen gok maar een
 * neutrale badge. Zodra voorraad beschikbaar is komt hier success/warning/danger.
 */
export function AvailabilityBadge() {
  return <Badge tone="info">Beschikbaarheid via ESTG</Badge>;
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
