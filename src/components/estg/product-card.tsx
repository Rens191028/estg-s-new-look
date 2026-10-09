import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStore } from "./store";
import type { Product } from "@/lib/catalog";
export function ProductCard({ product }: { product: Product }) {
  const { add } = useStore();
  const [added, setAdded] = useState(false);
  return (
    <article className="product-card">
      <Link to="/producten/$id" params={{ id: product.id }} className="product-photo">
        <img src={product.image} alt={product.name} width={816} height={816} loading="lazy" />
        <ArrowUpRight className="photo-arrow" size={18} />
      </Link>
      <div className="product-info">
        <span className="eyebrow muted">{product.brand}</span>
        <Link to="/producten/$id" params={{ id: product.id }}>
          <h3>{product.name}</h3>
        </Link>
        <p>{product.category}</p>
        <div className="product-bottom">
          <span>Prijs op aanvraag</span>
          <Button
            variant="secondary"
            size="icon"
            aria-label={`${product.name} toevoegen`}
            title="Toevoegen aan aanvraag"
            onClick={() => {
              add(product.id);
              setAdded(true);
              setTimeout(() => setAdded(false), 1800);
            }}
          >
            {added ? <Check /> : <Plus />}
          </Button>
        </div>
      </div>
    </article>
  );
}
