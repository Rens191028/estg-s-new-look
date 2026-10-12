import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/estg/product-card";
import { flyToCart } from "@/components/estg/fly-to-cart";
import { useStore } from "@/components/estg/store";
import { CategoryIcon, CountUp, Price, Reveal } from "@/components/estg/ui-bits";
import { dealProducts, discountPercent, pageHead } from "@/lib/catalog";

export const Route = createFileRoute("/aanbiedingen")({
  head: () =>
    pageHead(
      "Aanbiedingen",
      "Scherp geprijsde producten voor professionals bij ESTG. Actuele aanbiedingen, door ESTG bevestigd bij bestelling.",
    ),
  component: Deals,
});

function Deals() {
  const { add } = useStore();
  const [top, ...rest] = dealProducts();

  return (
    <>
      <section className="deals-hero">
        <div className="deals-blob deals-blob--a" aria-hidden />
        <div className="deals-blob deals-blob--b" aria-hidden />
        <div className="container deals-hero-inner">
          <Reveal>
            <span className="eyebrow">Aanbiedingen</span>
            <h1>Scherp geprijsd, tijdelijk beschikbaar</h1>
            <p>
              Een selectie uit het assortiment met een voordeel ten opzichte van de gebruikelijke
              prijs. Zolang de voorraad strekt; actuele aanbiedingen bevestigt ESTG bij bestelling.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container section">
        {top && (
          <Reveal>
            <article className="top-deal">
              <Link to="/producten/$id" params={{ id: top.id }} className="top-deal-media">
                {top.image ? (
                  <img src={top.image} alt={top.name} width={816} height={816} />
                ) : (
                  <CategoryIcon category={top.category} size={96} />
                )}
              </Link>
              <div className="top-deal-body">
                <span className="top-deal-label">Topdeal</span>
                <div
                  className="top-deal-percent"
                  aria-label={`${discountPercent(top)} procent korting`}
                >
                  <CountUp to={discountPercent(top)} prefix="−" suffix="%" duration={1400} />
                </div>
                <span className="muted">{top.brand}</span>
                <h2>{top.name}</h2>
                <p className="muted">{top.note}</p>
                <Price product={top} size="detail" />
                <div className="hero-actions">
                  <Button
                    variant="accent"
                    size="lg"
                    onClick={(e) => {
                      flyToCart(e.currentTarget);
                      add(top.id);
                    }}
                  >
                    Toevoegen aan winkelmand
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/producten/$id" params={{ id: top.id }}>
                      Bekijk product <ArrowRight />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        )}

        <h2 style={{ margin: "56px 0 24px" }}>Alle aanbiedingen</h2>
        <div className="product-grid deals-grid">
          {rest.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <p className="sample-note">
          Voorbeeldprijzen, excl. btw. Zolang de voorraad strekt; ESTG bevestigt de actuele
          aanbieding en prijs bij je bestelling.
        </p>
      </section>
    </>
  );
}
