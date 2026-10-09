import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/estg/page-intro";
import { articles } from "@/lib/articles";
import { pageHead } from "@/lib/catalog";
export const Route = createFileRoute("/kennis/")({
  head: () =>
    pageHead(
      "Kennis & inspiratie",
      "Lees over zonne-energie, energieopslag en slim laden. Inspiratie voor jouw volgende duurzame energieproject.",
    ),
  component: Knowledge,
});
function Knowledge() {
  return (
    <>
      <PageIntro
        title="Kennis die je verder brengt."
        description="Nieuwe inzichten, slimme oplossingen en inspiratie voor jouw volgende project."
      />
      <section className="container section">
        <div className="article-grid">
          {articles.map((a) => (
            <article className="article-card" key={a.slug}>
              <Link to="/kennis/$slug" params={{ slug: a.slug }}>
                <img src={a.image} alt={a.title} width={816} height={816} loading="lazy" />
              </Link>
              <div>
                <span className="eyebrow muted">{a.category}</span>
                <h2>
                  <Link to="/kennis/$slug" params={{ slug: a.slug }}>
                    {a.title}
                  </Link>
                </h2>
                <p>{a.intro}</p>
                <Link className="text-link" to="/kennis/$slug" params={{ slug: a.slug }}>
                  Lees verder <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
