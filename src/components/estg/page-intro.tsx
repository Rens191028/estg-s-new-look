import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
export function PageIntro({ title, description }: { title: string; description: string }) {
  return (
    <section className="page-intro">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={12} />
          <span>{title}</span>
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
