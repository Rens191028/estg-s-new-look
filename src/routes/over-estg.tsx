import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/estg/page-intro";
import { Benefits } from "@/components/estg/shell";
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
function About() {
  return (
    <>
      <PageIntro
        title="Samen brengen we energie in beweging."
        description="Wij zijn ESTG. European Sustainable Technology Group. Jouw partner in duurzame energie."
      />
      <div className="container content-grid">
        <div>
          <span className="eyebrow muted">Leading in positive energy</span>
          <h2>
            Meer dan producten.
            <br />
            Een partner die vooruitdenkt.
          </h2>
          <p>
            De energietransitie maken we samen. ESTG verbindt professionele installateurs met
            duurzame energieoplossingen van toonaangevende merken.
          </p>
          <p>
            Van zonnepanelen en omvormers tot energieopslag, laadoplossingen en klimaatbeheersing:
            bij ons komt het samen. Een breed assortiment, specialistische kennis en Europese
            distributie vormen de basis voor jouw volgende project.
          </p>
          <Button asChild>
            <Link to="/contact">
              Laten we samenwerken <ArrowUpRight />
            </Link>
          </Button>
        </div>
        <img
          src={rooftop}
          className="content-image"
          alt="Een bedrijfspand met zonnepanelen"
          width={1920}
          height={1024}
          loading="lazy"
        />
      </div>
      <Benefits />
    </>
  );
}
