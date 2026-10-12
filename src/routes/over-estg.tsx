import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/estg/page-intro";
import { Benefits } from "@/components/estg/shell";
import { CountUp, Reveal } from "@/components/estg/ui-bits";
import { pageHead } from "@/lib/catalog";
import rooftop from "@/assets/solar-rooftop.jpg";

export const Route = createFileRoute("/over-estg")({
  head: () =>
    pageHead(
      "Over ESTG",
      "ESTG is jouw Europese B2B-partner in duurzame energie. Samen met professionele installateurs bouwen we aan de energietransitie.",
    ),
  component: About,
});

// Cijfers van ESTG (bron: estg.eu, aangeleverd door ESTG).
const STATS = [
  { to: 15, suffix: "+", label: "jaar ervaring" },
  { to: 38, suffix: "", label: "Europese landen beleverd" },
  { to: 50, suffix: "+", label: "toonaangevende merken" },
  { to: 3000, suffix: "+", label: "producten, zonne- en EV-gerelateerd" },
];

function About() {
  return (
    <>
      <PageIntro
        title="Samen brengen we energie in beweging."
        description="Wij zijn ESTG. European Sustainable Technology Group. Jouw partner in duurzame energie."
      />
      <section className="container section">
        <Reveal>
          <div className="split">
            <div>
              <span className="eyebrow muted">Hoe het begon</span>
              <h2>Van een vlucht naar Sydney tot een Europese groothandel</h2>
              <p>
                In 2008 las oprichter Klaas Galama tijdens een vlucht naar Sydney{" "}
                <em>The Permanent Oil Crisis</em> van Willem Middelkoop. Het boek introduceerde hem
                bij piekolie en de energiecrisis en zette hem aan het denken. Hij besloot bij te
                dragen aan een duurzamere wereld en koos voor de groeiende zonne-energiesector.
              </p>
              <p>
                Om de lastige toeleveringsketen vanuit het Verre Oosten te verbeteren, startte hij
                een inkoopcollectief. De eerste klanten waren projectontwikkelaars in Italië,
                Duitsland, Spanje en het Verenigd Koninkrijk. Dat collectief groeide uit tot ESTG,
                European Sustainable Technology Group. Vanaf 2010 ging de groei zo snel dat het
                bedrijf in korte tijd vijf keer verhuisde.
              </p>
            </div>
            <img
              src={rooftop}
              alt="Een bedrijfspand met zonnepanelen"
              width={1920}
              height={1024}
              loading="lazy"
            />
          </div>
        </Reveal>
      </section>

      <section className="mission">
        <div className="container">
          <Reveal>
            <figure>
              <Quote size={36} aria-hidden />
              <blockquote>
                “We aim to ignite more than one million professionals in their sustainable mission.”
              </blockquote>
              <figcaption>
                ESTG wil de energietransitie landsgrensoverschrijdend maken en is meer dan een
                eenmalige leverancier: een partner voor de lange termijn.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <h2 style={{ marginBottom: 32 }}>ESTG in cijfers</h2>
        </Reveal>
        <div className="about-stats">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="about-stat">
                <strong>
                  <CountUp to={s.to} suffix={s.suffix} />
                </strong>
                <span>{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <div style={{ marginTop: 40 }}>
          <Button asChild>
            <Link to="/contact">
              Laten we samenwerken <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>
      <Benefits />
    </>
  );
}
