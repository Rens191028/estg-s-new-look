import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { articles } from "@/lib/articles";
import { pageHead } from "@/lib/catalog";
import { PageIntro } from "@/components/estg/page-intro";
export const Route = createFileRoute("/kennis/$slug")({
  head: ({ params }) => {
    const a = articles.find((x) => x.slug === params.slug);
    return pageHead(
      a?.title || "Artikel niet gevonden",
      a?.intro || "Dit artikel is niet beschikbaar.",
    );
  },
  component: Article,
});
function Article() {
  const { slug } = Route.useParams();
  const a = articles.find((x) => x.slug === slug);
  if (!a)
    return (
      <section className="container empty-state">
        <h1>Artikel niet gevonden</h1>
        <Link to="/kennis" className="text-link">
          Terug naar kennis & inspiratie
        </Link>
      </section>
    );
  return (
    <>
      <PageIntro title={a.title} description={a.intro} />
      <article className="container article-page">
        <Link to="/kennis" className="text-link mb-7">
          <ArrowLeft size={15} />
          Kennis & inspiratie
        </Link>
        {a.image && (
          <img className="content-image" src={a.image} alt={a.title} width={816} height={816} />
        )}
        {a.sections.map(([title, body]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
        <p className="sample-note">
          Algemene redactionele introductie voor deze vernieuwde website. Geen vervanging voor
          productspecifiek technisch advies.
        </p>
      </article>
    </>
  );
}
