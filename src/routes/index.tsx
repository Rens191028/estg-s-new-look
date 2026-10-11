import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Benefits } from "@/components/estg/shell";
import { ProductCard } from "@/components/estg/product-card";
import { CategoryIcon, Reveal } from "@/components/estg/ui-bits";
import { brands, categories, products, pageHead } from "@/lib/catalog";
import { CO2_FACTOR, estimateCo2Savings } from "@/lib/co2";
import { formatInt } from "@/lib/format";
import rooftop from "@/assets/solar-rooftop.jpg";
import inverter from "@/assets/inverter.jpg";
import battery from "@/assets/battery.jpg";
import charger from "@/assets/charger.jpg";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Leading in positive energy",
      "ESTG, jouw B2B-partner voor zonnepanelen, omvormers, energieopslag en EV-laders. Ontdek duurzame energieoplossingen voor professionals.",
    ),
  component: Index,
});

const allProducts = { q: "", category: "", brand: "" };

// Alleen cijfers die uit de catalogus of een berekening komen; echte bedrijfscijfers zijn nog niet aangeleverd.
function Stats() {
  const example = estimateCo2Savings(10);
  return (
    <section className="stats" aria-label="ESTG in cijfers">
      <div className="container stats-grid">
        <div className="stat">
          <strong>{brands.length}+</strong>
          <span>A-merken in het assortiment</span>
        </div>
        <div className="stat">
          <strong>{categories.length}</strong>
          <span>productcategorieën, van opwekken tot opslaan</span>
        </div>
        <div className="stat">
          <strong>~{formatInt(Math.round(example.kgCo2PerYear / 100) * 100)} kg</strong>
          <span>CO₂-besparing per jaar bij een systeem van 10 kWp</span>
          <small>
            Indicatie, op basis van{" "}
            <a href={CO2_FACTOR.source} target="_blank" rel="noreferrer">
              CO2emissiefactoren.nl
            </a>
          </small>
        </div>
      </div>
    </section>
  );
}

function Index() {
  const featured = [...products].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew)).slice(0, 4);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>
              Duurzame energie. <span>Samen vooruit.</span>
            </h1>
            <p className="lead">
              Jij bouwt aan een duurzame toekomst. Wij leveren de producten en de kennis om verder
              te komen: van zonnepanelen tot energieopslag en laadoplossingen.
            </p>
            <div className="hero-actions">
              <Button asChild size="lg">
                <Link to="/webshop" search={allProducts}>
                  Bekijk assortiment <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Persoonlijk advies</Link>
              </Button>
            </div>
          </div>
          <div className="bento" aria-hidden="false">
            <div className="b-main">
              <img
                src={rooftop}
                alt="Zonnepanelen op een modern bedrijfsdak"
                width={1920}
                height={1024}
              />
            </div>
            <div className="b-side">
              <img src={inverter} alt="Omvormer" width={816} height={816} />
            </div>
            <div className="b-tile b-wide">
              <strong>Leading in positive energy</strong>
              <span>Europese distributie voor professionele installateurs.</span>
            </div>
          </div>
        </div>
      </section>
      <Benefits />
      <Stats />

      <section className="section container">
        <Reveal>
          <div className="section-heading">
            <div>
              <h2>Alles voor jouw energieproject</h2>
              <p>Van opwekken tot opslaan. Vind de juiste oplossing.</p>
            </div>
            <Link className="text-link" to="/webshop" search={allProducts}>
              Alle producten <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
        <div className="category-grid">
          {categories.map((category, i) => (
            <Reveal key={category} delay={i * 60}>
              <Link className="category-tile" to="/webshop" search={{ category, q: "", brand: "" }}>
                <span className="icon-wrap">
                  <CategoryIcon category={category} size={26} />
                </span>
                <span className="category-label">
                  <span>
                    {category}
                    <br />
                    <span className="category-count">
                      {products.filter((p) => p.category === category).length} producten
                    </span>
                  </span>
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section alt-section">
        <div className="container">
          <Reveal>
            <div className="section-heading">
              <div>
                <h2>Klaar voor jouw volgende project</h2>
                <p>Ontdek oplossingen van toonaangevende merken.</p>
              </div>
              <Link to="/webshop" search={allProducts} className="text-link">
                Bekijk assortiment <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
          <div className="product-grid">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <div className="split">
            <div>
              <h2>Een compleet assortiment, bij één partner</h2>
              <p>
                Panelen, omvormers, opslag, laadoplossingen en montagemateriaal: bij ESTG komt het
                samen, zodat jij niet bij meerdere leveranciers hoeft te zoeken.
              </p>
              <ul className="usp-list">
                {[
                  "Groot assortiment van toonaangevende A-merken",
                  "Europese distributie",
                  "Specialistische kennis voor jouw project",
                ].map((t) => (
                  <li key={t}>
                    <Check size={18} /> {t}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline">
                <Link to="/merken">
                  Onze merken <ArrowUpRight />
                </Link>
              </Button>
            </div>
            <img src={battery} alt="Thuisbatterij" width={816} height={816} loading="lazy" />
          </div>
        </Reveal>
        <Reveal>
          <div className="split reverse">
            <div>
              <h2>Stel je project samen</h2>
              <p>
                Verzamel producten in Mijn Project, controleer of de set compleet is en download je
                selectie om met ESTG te bespreken.
              </p>
              <Button asChild>
                <Link to="/winkelwagen">
                  Naar Mijn Project <ArrowRight />
                </Link>
              </Button>
            </div>
            <img src={charger} alt="Laadoplossing" width={816} height={816} loading="lazy" />
          </div>
        </Reveal>
      </section>

      <section className="cta-dark">
        <div className="container cta-inner">
          <div>
            <h2>Jouw ambities. Onze energie.</h2>
            <p>
              De energietransitie vraagt om sterke partners. Met een breed assortiment en
              specialistische kennis helpen we jou vooruit.
            </p>
          </div>
          <Button asChild variant="accent" size="lg">
            <Link to="/contact">
              Neem contact op <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
