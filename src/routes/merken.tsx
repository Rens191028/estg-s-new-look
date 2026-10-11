import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/estg/page-intro";
import { brandLogo, brands, pageHead } from "@/lib/catalog";
export const Route = createFileRoute("/merken")({
  head: () =>
    pageHead(
      "Onze merken",
      "Ontdek toonaangevende duurzame energiemerken bij ESTG, van Sungrow en BYD tot JA Solar en SolarEdge.",
    ),
  component: Brands,
});
function Brands() {
  return (
    <>
      <PageIntro
        title="Sterke merken. Sterke projecten."
        description="Kwaliteit begint bij de juiste partners. Ontdek de merken achter jouw duurzame energieproject."
      />
      <section className="container section">
        <div className="brand-grid">
          {brands.map((b) => {
            const logo = brandLogo(b);
            return (
              <Link
                to="/webshop"
                search={{ brand: b, q: "", category: "" }}
                key={b}
                className="brand-card"
                aria-label={b}
              >
                {logo ? (
                  <img src={logo} alt="" className="brand-card-logo" loading="lazy" />
                ) : (
                  <span>{b}</span>
                )}
                <ArrowUpRight size={17} />
              </Link>
            );
          })}
        </div>
        <p className="sample-note">
          Deze selectie laat een deel van de merken bij ESTG zien. Niet alle merken zijn opgenomen
          in het voorbeeldassortiment.
        </p>
      </section>
    </>
  );
}
