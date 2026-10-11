import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function PageIntro({
  title,
  description,
  trail,
}: {
  title: string;
  description: string;
  /** Extra kruimelpad-stappen tussen Home en de huidige pagina. */
  trail?: { label: string; to: "/webshop" | "/merken" | "/kennis" }[] | undefined;
}) {
  return (
    <section className="page-intro">
      <div className="container">
        <nav className="breadcrumb" aria-label="Kruimelpad">
          <Link to="/">Home</Link>
          {trail?.map((t) => (
            <span key={t.label} style={{ display: "contents" }}>
              <ChevronRight size={14} />
              {t.to === "/webshop" ? (
                <Link to="/webshop" search={{ q: "", category: "", brand: "" }}>
                  {t.label}
                </Link>
              ) : (
                <Link to={t.to}>{t.label}</Link>
              )}
            </span>
          ))}
          <ChevronRight size={14} />
          <span aria-current="page">{title}</span>
        </nav>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
