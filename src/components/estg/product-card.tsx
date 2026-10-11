import { Link } from "@tanstack/react-router";
import { Check, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/catalog";
import { formatEuro } from "@/lib/format";
import { useCompare } from "./compare";
import { useFavorites } from "./favorites";
import { useStore } from "./store";
import { AvailabilityBadge, CategoryIcon } from "./ui-bits";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useStore();
  const compare = useCompare();
  const favorites = useFavorites();
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
        {(product.isNew || product.isBestseller) && (
          <span className="badge-slot">
            {product.isNew && <Badge tone="accent">Nieuw</Badge>}
            {product.isBestseller && <Badge tone="info">Bestseller</Badge>}
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
      <button
        type="button"
        className="fav-toggle"
        aria-pressed={favorites.has(product.id)}
        aria-label={`${product.name} ${favorites.has(product.id) ? "uit favorieten halen" : "aan favorieten toevoegen"}`}
        onClick={() => void favorites.toggle(product.id)}
      >
        <Heart size={17} />
      </button>
      <div className="product-info">
        <span className="brand">{product.brand}</span>
        <Link to="/producten/$id" params={{ id: product.id }}>
          <h3>{product.name}</h3>
        </Link>
        <span className="sku">{product.sku}</span>
        <div>
          <AvailabilityBadge productId={product.id} />
        </div>
        <div className="product-bottom">
          <span className="card-price">
            {formatEuro(product.price)} <small>excl. btw</small>
          </span>
          <Button
            variant="default"
            size="sm"
            aria-label={`${product.name} toevoegen aan winkelmand`}
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
