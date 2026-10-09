import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Zap, Wrench, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Benefits } from "@/components/estg/shell";
import { ProductCard } from "@/components/estg/product-card";
import { categories, products, pageHead } from "@/lib/catalog";
import rooftop from "@/assets/solar-rooftop.jpg";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Leading in positive energy",
      "ESTG, jouw B2B-partner voor zonnepanelen, omvormers, energieopslag en EV-laders. Ontdek duurzame energieoplossingen voor professionals.",
    ),
  component: Index,
});
function Index() {
  return (
    <>
      <section className="hero">
        <img
          src={rooftop}
          alt="Zonnepanelen op een modern bedrijfsdak"
          width={1920}
          height={1024}
        />
        <div className="container hero-content">
          <div className="eyebrow">
            <Zap size={14} fill="currentColor" /> Leading in positive energy
          </div>
          <h1>
            Duurzame energie.
            <br />
            <span>Samen vooruit.</span>
          </h1>
          <p>
            Jij bouwt aan een duurzame toekomst.
            <br />
            Wij leveren de energie om verder te komen.
          </p>
          <div className="hero-actions">
            <Button asChild className="hero-cta">
              <Link to="/webshop" search={{ q: "", category: "", brand: "" }}>
                Ontdek ons assortiment <ArrowRight />
              </Link>
            </Button>
            <Link to="/over-estg">
              Dit is ESTG <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <span className="hero-note">
          <Zap size={13} /> Positive energy. Powerful partnerships.
        </span>
      </section>
      <Benefits />
      <section className="section container">
        <div className="section-heading">
          <div>
            <h2>Alles voor jouw energieproject</h2>
            <p>Van opwekken tot opslaan. Vind de juiste oplossing.</p>
          </div>
          <Link className="text-link" to="/webshop" search={{ q: "", category: "", brand: "" }}>
            Alle producten <ArrowRight size={16} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((category, i) => (
            <Link
              className="category-tile"
              key={category}
              to="/webshop"
              search={{ category, q: "", brand: "" }}
            >
              <div className="category-visual">
                {i < 4 ? (
                  <img
                    src={products[i]?.image}
                    alt={category}
                    width={816}
                    height={816}
                    loading="lazy"
                  />
                ) : i === 4 ? (
                  <Wrench />
                ) : (
                  <Wind />
                )}
              </div>
              <div className="category-label">
                {category}
                <ArrowUpRight size={15} />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="brand-strip">
        <div className="container brand-inner">
          <span>
            STERKE MERKEN.
            <br />
            STERKE PROJECTEN.
          </span>
          {["JA SOLAR", "SUNGROW", "SolarEdge", "enphase", "BYD"].map((b) => (
            <Link to="/merken" className="brand-wordmark" key={b}>
              {b}
            </Link>
          ))}
          <Link to="/merken" className="text-link">
            Alle merken <ArrowRight size={15} />
          </Link>
        </div>
      </section>
      <section className="section featured">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow muted mb-3">Een krachtige basis</div>
              <h2>Klaar voor jouw volgende project</h2>
              <p>Ontdek oplossingen van toonaangevende merken.</p>
            </div>
            <Link to="/webshop" search={{ q: "", category: "", brand: "" }} className="text-link">
              Bekijk assortiment <ArrowRight size={16} />
            </Link>
          </div>
          <div className="product-grid">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
      <section className="positive-band">
        <div className="container positive-inner">
          <div>
            <div className="eyebrow mb-4">Meer dan een groothandel</div>
            <h2>Jouw ambities. Onze energie.</h2>
            <p>
              De energietransitie vraagt om sterke partners. Met een breed assortiment en
              specialistische kennis helpen we jou vooruit.
            </p>
          </div>
          <Button asChild variant="secondary" size="lg">
            <Link to="/over-estg">
              Maak kennis met ESTG <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
