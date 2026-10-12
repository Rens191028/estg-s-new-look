import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Headphones,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Benefits } from "@/components/estg/shell";
import { ProductCard } from "@/components/estg/product-card";
import { CategoryIcon, CountUp, Reveal } from "@/components/estg/ui-bits";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { googleRating, reviews } from "@/lib/reviews";
import { categories, findProduct, products, pageHead } from "@/lib/catalog";
import { CO2_FACTOR, estimateCo2Savings } from "@/lib/co2";
import { formatEuro, formatInt, formatKwp } from "@/lib/format";
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

// Bedrijfscijfers van ESTG (bron: estg.eu, aangeleverd door ESTG).
const COMPANY_STATS = [
  { to: 38, suffix: "", label: "landen in Europa beleverd" },
  { to: 50, suffix: "+", label: "toonaangevende A-merken" },
  { to: 15, suffix: "+", label: "jaar ervaring" },
];

function Stats() {
  const example = estimateCo2Savings(10);
  return (
    <section className="stats" aria-label="ESTG in cijfers">
      <div className="container stats-grid">
        {COMPANY_STATS.map((s) => (
          <div className="stat" key={s.label}>
            <strong>
              <CountUp to={s.to} suffix={s.suffix} />
            </strong>
            <span>{s.label}</span>
          </div>
        ))}
        <div className="stat">
          <strong>
            <CountUp to={Math.round(example.kgCo2PerYear / 100) * 100} prefix="~" suffix=" kg" />
          </strong>
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

const ADVISOR_QUESTIONS = [
  "20 zonnepanelen + batterij voor noodstroom",
  "Een batterij die past bij mijn Huawei-omvormer",
  "Laadpaal voor een bedrijfsparkeerplaats, 3-fase",
];

function AdvisorBand() {
  return (
    <section className="advisor-band">
      <div className="container advisor-inner">
        <div>
          <h2>Niet zeker welke set je nodig hebt?</h2>
          <p className="muted">Vraag het onze AI-adviseur.</p>
        </div>
        <div className="chips">
          {ADVISOR_QUESTIONS.map((q) => (
            <Link key={q} to="/advisor" search={{ vraag: q }} className="chip chip-link">
              <Sparkles size={14} /> {q}
            </Link>
          ))}
        </div>
        <Button asChild variant="outline">
          <Link to="/configurator">Liever klikken? Stel een systeem samen</Link>
        </Button>
      </div>
    </section>
  );
}

function Impact() {
  // Rekenvoorbeeld, geen gerealiseerd resultaat: 1 MWp aan zonnepanelen met dezelfde formule als lib/co2.ts.
  const example = estimateCo2Savings(1000);
  const panels = Math.round(1_000_000 / (findProduct("all-black-zonnepaneel")?.powerWp ?? 430));
  return (
    <section className="impact">
      <div className="container impact-inner">
        <Reveal>
          <div>
            <h2>Wat zonne-energie samen oplevert</h2>
            <p>
              Een rekenvoorbeeld: <strong>1 MWp</strong> aan zonnepanelen (ongeveer{" "}
              {formatInt(panels)} panelen van 430 Wp) bespaart elk jaar:
            </p>
          </div>
        </Reveal>
        <Reveal delay={90}>
          <div className="impact-figure">
            <strong>
              <CountUp to={Math.round(example.kgCo2PerYear / 1000)} prefix="~" suffix=" ton" />
            </strong>
            <span>CO₂ per jaar (indicatie)</span>
            <small>
              Rekenvoorbeeld, geen gerealiseerd ESTG-resultaat. Op basis van{" "}
              <a href={CO2_FACTOR.source} target="_blank" rel="noreferrer">
                CO2emissiefactoren.nl
              </a>
              .
            </small>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="section container">
      <Reveal>
        <div className="section-heading">
          <div>
            <h2>
              {String(googleRating.average).replace(".", ",")} ★ op basis van {googleRating.count}{" "}
              Google-reviews
            </h2>
            <p>Dit zeggen klanten over ESTG.</p>
          </div>
          <a className="text-link" href={googleRating.url} target="_blank" rel="noreferrer">
            Bekijk alle reviews op Google <ArrowUpRight size={16} />
          </a>
        </div>
      </Reveal>
      <div className="review-grid">
        {reviews.map((r, i) => (
          <Reveal key={i} delay={i * 70}>
            <figure className="review-card">
              <div className="stars" role="img" aria-label={`${r.rating} van 5 sterren`}>
                {Array.from({ length: r.rating }, (_, k) => (
                  <Star key={k} size={16} fill="currentColor" />
                ))}
              </div>
              <blockquote>“{r.quote}”</blockquote>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FeaturedProject() {
  const panel = findProduct("all-black-zonnepaneel");
  const kwp = ((panel?.powerWp ?? 0) * 120) / 1000;
  const co2 = estimateCo2Savings(kwp);
  return (
    <section className="section container">
      <Reveal>
        <div className="split">
          <img
            src={rooftop}
            alt="Bedrijfsdak met zonnepanelen"
            width={1920}
            height={1024}
            loading="lazy"
          />
          <div>
            <span className="badge-note">Voorbeeldproject, ter illustratie</span>
            <h2>Bedrijfsdak vol potentieel</h2>
            <p>Logistiek bedrijf, Gelderland</p>
            <ul className="usp-list">
              <li>
                <Check size={18} /> 120 × All Black zonnepaneel (JA Solar, 430 Wp) ={" "}
                {formatKwp(kwp)}
              </li>
              <li>
                <Check size={18} /> Sungrow hybride omvormers en 2 × modulaire thuisbatterij (BYD,
                10,2 kWh)
              </li>
              <li>
                <Check size={18} /> ~{formatInt(Math.round(co2.kgCo2PerYear))} kg CO₂-besparing per
                jaar (indicatie)
              </li>
            </ul>
            <Button asChild variant="outline">
              <Link to="/advisor" search={{ vraag: "" }}>
                Stel zelf een set samen <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const WHY = [
  {
    icon: Truck,
    title: "Europese distributie",
    text: "Eén partner voor je hele project, met levering in heel Europa en een assortiment dat uit eigen voorraad en vaste leveranciers komt.",
  },
  {
    icon: ShieldCheck,
    title: "Toonaangevende A-merken",
    text: "Panelen, omvormers, opslag en laadoplossingen van merken waar installateurs en eindklanten op vertrouwen.",
  },
  {
    icon: Headphones,
    title: "Expertise voor jouw project",
    text: "Een team dat meedenkt over compatibiliteit en dimensionering, en dat je bereikbaar ondersteunt voor én na de levering.",
  },
  {
    icon: Zap,
    title: "Exclusief voor professionals",
    text: "Zakelijke prijzen en service die zijn afgestemd op installateurs, niet op consumenten.",
  },
];

function WhyEstg() {
  return (
    <section className="section alt-section">
      <div className="container">
        <Reveal>
          <div className="section-heading">
            <div>
              <h2>Waarom ESTG</h2>
              <p>Wat je van ons mag verwachten.</p>
            </div>
            <Link className="text-link" to="/over-estg">
              Meer over ESTG <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
        <div className="why-grid">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 90}>
              <article className="why-card">
                <span className="icon-wrap">
                  <w.icon size={24} strokeWidth={1.6} aria-hidden />
                </span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQ = [
  {
    q: "Kan ik op deze website al bestellen?",
    a: "Nee, dit is een voorbeeldomgeving. Verzamel producten in je winkelmand en klik op \"Bestellen\" om je bestelling met een gewenste verzenddatum door te geven. Er wordt geen echte betaling verwerkt: ESTG neemt contact met je op om betaling en levering af te ronden.",
  },
  {
    q: "Zijn de getoonde prijzen definitief?",
    a: "Nee, het zijn indicatieve voorbeeldprijzen excl. btw. ESTG bevestigt de definitieve prijs.",
  },
  {
    q: "Hoe bepaal ik de juiste batterijcapaciteit?",
    a: "Kijk naar het dagelijkse en jaarlijkse verbruik, de grootte van het zonnepaneelsysteem en toekomstig verbruik zoals een auto of warmtepomp.",
    slug: "batterij-dimensioneren",
  },
  {
    q: "Kan ik airco combineren met zonnepanelen en een batterij?",
    a: "Ja. De piekproductie van zonnepanelen valt vaak samen met de uren waarop een airco het hardst werkt; een batterij vangt de stroompieken op.",
    slug: "airco-zonnepanelen-batterijen",
  },
  {
    q: "Wat verandert er met de nieuwe EU-batterijverordening?",
    a: "Opslagsystemen boven 2 kWh krijgen een digitaal batterijpaspoort via een QR-code, met onder meer de status, het onderhoud en reparatie-instructies.",
    slug: "eu-batterijverordening",
  },
  {
    q: "Hoe werkt de AI-adviseur?",
    a: "De adviseur beantwoordt vragen en stelt sets samen uit de voorbeeldcatalogus. Hij noemt nooit een product of prijs die niet in de catalogus staat.",
  },
];

function Faq() {
  return (
    <section className="section container" style={{ maxWidth: 860 }}>
      <Reveal>
        <h2 style={{ marginBottom: 24 }}>Veelgestelde vragen</h2>
        <Accordion type="single" collapsible>
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-base font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent>
                <p className="muted" style={{ margin: 0 }}>
                  {f.a}
                  {f.slug && (
                    <>
                      {" "}
                      <Link
                        className="text-link"
                        style={{ textDecoration: "underline" }}
                        to="/kennis/$slug"
                        params={{ slug: f.slug }}
                      >
                        Lees het artikel
                      </Link>
                    </>
                  )}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
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
              <span className="hero-ai">
                <span className="new-pill">
                  <i aria-hidden /> Nieuw
                </span>
                <Button asChild size="lg" variant="outline">
                  <Link to="/advisor" search={{ vraag: "" }}>
                    AI-adviseur
                  </Link>
                </Button>
              </span>
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
      <AdvisorBand />

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

      <section className="section container" id="bestsellers">
        <Reveal>
          <div className="section-heading">
            <div>
              <h2>Veelgekozen door installateurs</h2>
              <p>Dit kiezen professionals het vaakst bij ESTG.</p>
            </div>
          </div>
        </Reveal>
        <div className="product-grid bestsellers">
          {products
            .filter((p) => p.isBestseller)
            .map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProductCard product={p} />
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
            <img
              className="contain"
              src={battery}
              alt="Thuisbatterij"
              width={816}
              height={816}
              loading="lazy"
            />
          </div>
        </Reveal>
        <Reveal>
          <div className="split reverse">
            <div>
              <h2>Stel je selectie samen</h2>
              <p>
                Verzamel producten in je winkelmand, controleer of de set compleet is en bestel direct
                of download je selectie om met ESTG te bespreken.
              </p>
              <Button asChild>
                <Link to="/winkelwagen">
                  Naar winkelmand <ArrowRight />
                </Link>
              </Button>
            </div>
            <img
              className="contain"
              src={charger}
              alt="Laadoplossing"
              width={816}
              height={816}
              loading="lazy"
            />
          </div>
        </Reveal>
      </section>

      <FeaturedProject />
      <Reviews />
      <Impact />
      <WhyEstg />
      <Faq />

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
