import { Link } from "@tanstack/react-router";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/catalog";
import { useCompare } from "./compare";
import { useStore } from "./store";
import { AvailabilityBadge, CategoryIcon } from "./ui-bits";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useStore();
  const compare = useCompare();
  const [added, setAdded] = useState(false);
  const selected = compare.has(product.id);
  const blocked = !selected && compare.isFull;
  return (
    <article className="product-card">
      <Link to="/producten/$id" params={{ id: product.id }} className="product-photo">
        {product.image ? (
          <img src={product.image} alt={product.name} width={816} height={816} loading="lazy" />
        ) : (
          <span className="icon-fallback">
            <CategoryIcon category={product.category} size={56} />
          </span>
        )}
        {product.isNew && (
          <span className="badge-slot">
            <Badge tone="accent">Nieuw</Badge>
          </span>
        )}
      </Link>
      <label
        className="compare-toggle"
        title={blocked ? "Je kunt maximaal 4 producten vergelijken" : undefined}
      >
        <input
          type="checkbox"
          checked={selected}
          disabled={blocked}
          onChange={() => compare.toggle(product.id)}
          aria-label={`${product.name} vergelijken`}
        />
        Vergelijk
      </label>
      <div className="product-info">
        <span className="brand">{product.brand}</span>
        <Link to="/producten/$id" params={{ id: product.id }}>
          <h3>{product.name}</h3>
        </Link>
        <span className="sku">{product.sku}</span>
        <div>
          <AvailabilityBadge />
        </div>
        <div className="product-bottom">
          <span className="muted" style={{ fontSize: 13 }}>
            Prijs via ESTG
          </span>
          <Button
            variant="default"
            size="sm"
            aria-label={`${product.name} toevoegen aan Mijn Project`}
            onClick={() => {
              add(product.id);
              setAdded(true);
              setTimeout(() => setAdded(false), 1800);
            }}
          >
            {added ? <Check /> : <Plus />}
            {added ? "Toegevoegd" : "Toevoegen"}
          </Button>
        </div>
      </div>
    </article>
  );
}
