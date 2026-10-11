import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "./compare";

/** Zwevende balk die verschijnt zodra minstens twee producten zijn geselecteerd. */
export function CompareBar() {
  const { ids, clear } = useCompare();
  if (ids.length < 2) return null;
  return (
    <div className="compare-bar" role="region" aria-label="Vergelijken">
      <span>
        <strong>{ids.length}</strong> producten geselecteerd
      </span>
      <button type="button" className="plain" onClick={clear}>
        Wissen
      </button>
      <Button asChild variant="accent" size="sm">
        <Link to="/vergelijken">
          Vergelijk ({ids.length}) <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}
