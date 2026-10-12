import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCompare } from "./compare";

/** Zwevende balk die verschijnt zodra minstens twee producten zijn geselecteerd. */
export function CompareBar() {
  const { ids, clear } = useCompare();
  const show = ids.length >= 2;
  // Bij verbergen blijft de balk even staan zodat de slide-down kan uitspelen.
  const [mounted, setMounted] = useState(show);
  const lastCount = useRef(ids.length);
  if (show) lastCount.current = ids.length;
  useEffect(() => {
    if (show) {
      setMounted(true);
      return undefined;
    }
    const t = setTimeout(() => setMounted(false), 260);
    return () => clearTimeout(t);
  }, [show]);
  if (!show && !mounted) return null;
  const n = lastCount.current;
  return (
    <div
      className={`compare-bar ${show ? "" : "compare-bar--out"}`}
      role="region"
      aria-label="Vergelijken"
      aria-hidden={!show}
    >
      <span>
        <strong>{n}</strong> producten geselecteerd
      </span>
      <button type="button" className="plain" onClick={clear}>
        Wissen
      </button>
      <Button asChild variant="accent" size="sm">
        <Link to="/vergelijken">
          Vergelijk ({n}) <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}
