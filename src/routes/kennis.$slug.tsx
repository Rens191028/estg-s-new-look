import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Link as LinkIcon, Linkedin, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { articles } from "@/lib/articles";
import { pageHead } from "@/lib/catalog";
import { PageIntro } from "@/components/estg/page-intro";
import { ReadingProgress } from "@/components/estg/reading-progress";
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
function ShareRow({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  useEffect(() => setUrl(window.location.href), []);
  const enc = encodeURIComponent;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link gekopieerd");
    } catch {
      toast.error("Kopiëren is niet gelukt");
    }
  };
  return (
    <div className="share-row">
      <span>Deel dit artikel:</span>
      <Button asChild variant="outline" size="sm">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}
          target="_blank"
          rel="noreferrer"
        >
          <Linkedin /> LinkedIn
        </a>
      </Button>
      <Button asChild variant="outline" size="sm">
        <a href={`mailto:?subject=${enc(title)}&body=${enc(`${title}\n${url}`)}`}>
          <Mail /> E-mail
        </a>
      </Button>
      <Button variant="outline" size="sm" onClick={() => void copy()}>
        <LinkIcon /> Kopieer link
      </Button>
    </div>
  );
}

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
      <ReadingProgress targetSelector=".article-page" />
      <article className="container article-page">
        <Link to="/kennis" className="text-link mb-7">
          <ArrowLeft size={15} />
          Kennis & inspiratie
        </Link>
        <ShareRow title={a.title} />
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
