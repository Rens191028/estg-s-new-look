import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronRight, Heart, Minus, Plus, Scale, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductCard } from "@/components/estg/product-card";
import { formatEuro } from "@/lib/format";
import { googleRating } from "@/lib/reviews";
import { useCompare } from "@/components/estg/compare";
import { useFavorites } from "@/components/estg/favorites";
import { useStore } from "@/components/estg/store";
import { AvailabilityBadge, CategoryIcon, Reveal, Skeleton } from "@/components/estg/ui-bits";
import {
  brandLogo,
  catalogDisclaimer,
  compatibleProducts,
  findProduct,
  pageHead,
  similarProducts,
} from "@/lib/catalog";

export const Route = createFileRoute("/producten/$id")({
  head: ({ params }) =>
    pageHead(
      findProduct(params.id)?.name || "Product niet gevonden",
      "Bekijk deze duurzame energieoplossing bij ESTG en voeg deze toe aan je winkelmand.",
    ),
  pendingComponent: ProductSkeleton,
  component: Product,
});

function ProductSkeleton() {
  return (
    <div className="container" aria-busy="true">
      <div className="detail-grid">
        <Skeleton style={{ height: 520, borderRadius: 24 }} />
        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <Skeleton style={{ height: 20, width: "40%" }} />
          <Skeleton style={{ height: 40, width: "80%" }} />
          <Skeleton style={{ height: 16, width: "30%" }} />
          <Skeleton style={{ height: 70 }} />
          <Skeleton style={{ height: 96, borderRadius: 16 }} />
          <Skeleton style={{ height: 48, width: "60%" }} />
        </div>
      </div>
    </div>
  );
}

function Product() {
  const { id } = Route.useParams();
  const p = findProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sticky, setSticky] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);
  const { add } = useStore();
  const compare = useCompare();
  const favorites = useFavorites();

  // Compacte balk zodra de hoofd-CTA uit beeld scrolt.
  useEffect(() => {
    const el = buyRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) =>
      setSticky(!!e && !e.isIntersecting && e.boundingClientRect.top < 0),
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  if (!p)
    return (
      <div className="container empty-state">
        <h1>Product niet gevonden</h1>
        <Button asChild>
          <Link to="/webshop" search={{ q: "", category: "", brand: "" }}>
            Terug naar het assortiment
          </Link>
        </Button>
      </div>
    );

  const logo = brandLogo(p.brand);
  const compatible = compatibleProducts(p);
  const similar = similarProducts(p);
  const onAdd = () => {
    add(p.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };
  const inCompare = compare.has(p.id);

  return (
    <div>
      <div className={`sticky-buy ${sticky ? "visible" : ""}`} aria-hidden={!sticky}>
        <div className="container sticky-buy-inner">
          <strong>{p.name}</strong>
          <Button variant="accent" size="sm" tabIndex={sticky ? 0 : -1} onClick={onAdd}>
            {added ? <Check /> : <ShoppingBag />}
            {added ? "Toegevoegd" : "Toevoegen aan winkelmand"}
          </Button>
        </div>
      </div>
      <div className="container">
        <nav
          className="breadcrumb mt-7"
          aria-label="Kruimelpad"
          style={{ marginTop: 24, marginBottom: 0 }}
        >
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/webshop" search={{ category: p.category, q: "", brand: "" }}>
            {p.category}
          </Link>
          <ChevronRight size={14} />
          <Link to="/webshop" search={{ brand: p.brand, q: "", category: "" }}>
            {p.brand}
          </Link>
          <ChevronRight size={14} />
          <span aria-current="page">{p.name}</span>
        </nav>
        <div className="detail-grid">
          <div className="gallery">
            {p.image ? (
              <img src={p.image} alt={p.name} width={816} height={816} />
            ) : (
              <span className="muted">
                <CategoryIcon category={p.category} size={96} />
              </span>
            )}
          </div>
          <div className="detail-info">
            <div className="brandline">
              {logo ? (
                <img src={logo} alt={p.brand} className="brandline-logo" />
              ) : (
                <span className="muted" style={{ fontWeight: 600 }}>
                  {p.brand}
                </span>
              )}
              {p.isNew && <Badge tone="accent">Nieuw</Badge>}
              {p.isBestseller && <Badge tone="info">Bestseller</Badge>}
              <AvailabilityBadge productId={p.id} />
            </div>
            <h1>{p.name}</h1>
            <span className="sku">{p.sku}</span>
            <p>{p.note}</p>
            <div className="price-box">
              <strong className="price">
                {formatEuro(p.price)} <small>excl. btw</small>
              </strong>
              <span>Voorbeeldprijs, definitieve prijs bevestigt ESTG.</span>
            </div>
            <a className="rating-line" href={googleRating.url} target="_blank" rel="noreferrer">
              <span className="stars" aria-hidden>
                <Star size={15} fill="currentColor" />
              </span>
              <strong>{String(googleRating.average).replace(".", ",")} ★</strong> gebaseerd op{" "}
              {googleRating.count} Google-reviews van ESTG
            </a>
            <div className="detail-buy" ref={buyRef}>
              <div className="quantity">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Aantal verminderen"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus />
                </Button>
                <input
                  aria-label="Aantal"
                  type="number"
                  min={1}
                  max={999}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Math.min(999, Number(e.target.value) || 1)))
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Aantal verhogen"
                  onClick={() => setQuantity(Math.min(999, quantity + 1))}
                >
                  <Plus />
                </Button>
              </div>
              <Button variant="accent" size="lg" onClick={onAdd}>
                {added ? <Check /> : <ShoppingBag />}
                {added ? "Toegevoegd aan winkelmand" : "Toevoegen aan winkelmand"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => compare.toggle(p.id)}
                disabled={!inCompare && compare.isFull}
                aria-pressed={inCompare}
              >
                <Scale /> {inCompare ? "In vergelijking" : "Vergelijk"}
              </Button>
              <button
                type="button"
                className="fav-toggle fav-toggle--inline"
                aria-pressed={favorites.has(p.id)}
                aria-label={
                  favorites.has(p.id) ? "Uit favorieten halen" : "Aan favorieten toevoegen"
                }
                onClick={() => void favorites.toggle(p.id)}
              >
                <Heart size={20} />
              </button>
            </div>
            {added && (
              <Link className="text-link" to="/winkelwagen">
                Bekijk winkelmand →
              </Link>
            )}
            <p className="sample-note" style={{ padding: 0 }}>
              {catalogDisclaimer}
            </p>
          </div>
        </div>

        <div className="accordion-wrap">
          <Accordion type="multiple" defaultValue={["specs"]}>
            <AccordionItem value="specs">
              <AccordionTrigger className="text-base font-semibold">Specificaties</AccordionTrigger>
              <AccordionContent>
                <table className="spec-table">
                  <tbody>
                    <tr>
                      <th scope="row">Merk</th>
                      <td>{p.brand}</td>
                    </tr>
                    <tr>
                      <th scope="row">Categorie</th>
                      <td>{p.category}</td>
                    </tr>
                    {p.specs.map((s) => (
                      <tr key={s.label}>
                        <th scope="row">{s.label}</th>
                        <td>{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="docs">
              <AccordionTrigger className="text-base font-semibold">Documentatie</AccordionTrigger>
              <AccordionContent>
                <p className="muted">
                  Datasheets en handleidingen zijn nog niet aangesloten op deze voorbeeldwebsite. Op
                  estg.eu vind je de actuele documentatie per product.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="desc">
              <AccordionTrigger className="text-base font-semibold">
                Uitgebreide beschrijving
              </AccordionTrigger>
              <AccordionContent>
                <p className="muted">{p.note}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {compatible.length > 0 && (
          <section style={{ paddingBottom: 56 }}>
            <h2 style={{ marginBottom: 8 }}>Past bij dit product</h2>
            <p className="muted" style={{ marginBottom: 24 }}>
              Producten uit aanvullende categorieën. Controleer de exacte compatibiliteit met ESTG.
            </p>
            <div className="product-grid">
              {compatible.slice(0, 4).map((c, i) => (
                <Reveal key={c.id} delay={i * 70}>
                  <ProductCard product={c} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
        {similar.length > 0 && (
          <section style={{ paddingBottom: 72 }}>
            <h2 style={{ marginBottom: 24 }}>Vergelijk met vergelijkbare producten</h2>
            <div className="product-grid">
              {similar.slice(0, 3).map((c) => (
                <ProductCard key={c.id} product={c} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
