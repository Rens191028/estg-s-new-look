import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  Handshake,
  MapPin,
  MessageCircle,
  Phone,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/estg/page-intro";
import { Reveal } from "@/components/estg/ui-bits";
import { pageHead } from "@/lib/catalog";
import { COMPANY, COMPANY_ADDRESS, MAP_EMBED_URL, MAP_LINK_URL } from "@/lib/company";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead(
      "Contact",
      `Neem contact op met ESTG voor jouw duurzame energieproject. Vind ons in Elst of bel ${COMPANY.phone}.`,
    ),
  component: Contact,
});

const CATEGORIES: { id: string; label: string; hint: string; icon: LucideIcon }[] = [
  {
    id: "technisch",
    label: "Technische vraag",
    hint: "Compatibiliteit, dimensionering",
    icon: Wrench,
  },
  {
    id: "levering",
    label: "Bestelling & levering",
    hint: "Status, retour, transport",
    icon: Truck,
  },
  { id: "partner", label: "Partnerschap", hint: "Samenwerken met ESTG", icon: Handshake },
  { id: "overig", label: "Overig", hint: "Iets anders", icon: MessageCircle },
];

/** Eigen, rustige illustratie in de huisstijl: een supportgesprek met een ticket. */
function SupportIllustration() {
  return (
    <svg
      viewBox="0 0 480 300"
      role="img"
      aria-label="Illustratie van een supportgesprek"
      className="support-art"
    >
      <rect width="480" height="300" rx="24" fill="#E6E9F0" />
      <circle cx="400" cy="50" r="90" fill="#FDF3CF" />
      <rect x="40" y="48" width="230" height="86" rx="18" fill="#FFFFFF" />
      <rect x="62" y="72" width="150" height="10" rx="5" fill="#DCE3EC" />
      <rect x="62" y="94" width="110" height="10" rx="5" fill="#DCE3EC" />
      <path d="M70 134 52 158l36-14z" fill="#FFFFFF" />
      <rect x="170" y="150" width="270" height="92" rx="18" fill="#00183D" />
      <rect x="194" y="176" width="170" height="10" rx="5" fill="#8C97A8" />
      <rect x="194" y="198" width="120" height="10" rx="5" fill="#8C97A8" />
      <path d="M420 242l16 22-38-14z" fill="#00183D" />
      <path
        d="M332 170l-22 36h18l-10 28 34-44h-20l12-20z"
        fill="#F3CE11"
        transform="translate(66 -2) scale(0.7)"
      />
      <circle cx="72" cy="228" r="26" fill="#FFFFFF" />
      <path
        d="M60 232v-6a12 12 0 0 1 24 0v6"
        fill="none"
        stroke="#00183D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="56" y="230" width="8" height="12" rx="3" fill="#00183D" />
      <rect x="80" y="230" width="8" height="12" rx="3" fill="#00183D" />
    </svg>
  );
}

function Contact() {
  const [category, setCategory] = useState(CATEGORIES[0]!.id);
  const [ticket, setTicket] = useState<{
    ref: string;
    category: string;
    message: string;
    name: string;
  } | null>(null);
  const chosen = CATEGORIES.find((c) => c.id === category)!;

  return (
    <>
      <PageIntro
        title="Hoe kunnen we jou verder helpen?"
        description="Een productvraag, een nieuw project of kennismaken? We denken graag met je mee."
      />
      <section className="container contact-hero">
        <Reveal>
          <SupportIllustration />
        </Reveal>
      </section>
      <div className="container content-grid">
        <Reveal>
          <div>
            <span className="eyebrow muted">Persoonlijk contact</span>
            <h2>
              Jouw vraag.
              <br />
              Onze aandacht.
            </h2>
            <p className="flex items-center gap-3">
              <Phone size={18} />
              <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
            </p>
            <p className="flex items-center gap-3">
              <Clock size={18} />
              <span>{COMPANY.hours}</span>
            </p>
            <p className="flex items-start gap-3">
              <MapPin size={18} />
              <span>
                {COMPANY.street}
                <br />
                {COMPANY.city}
                <br />
                Nederland
              </span>
            </p>
            <div className="map-embed">
              <iframe
                title={`Kaart: ${COMPANY_ADDRESS}`}
                src={MAP_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a className="text-link" href={MAP_LINK_URL} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="contact-panel">
            {ticket ? (
              <div className="ticket-card" role="status">
                <CheckCircle2 size={36} />
                <h3>Ticket aangemaakt</h3>
                <p className="ticket-ref">{ticket.ref}</p>
                <dl>
                  <div>
                    <dt>Categorie</dt>
                    <dd>{ticket.category}</dd>
                  </div>
                  <div>
                    <dt>Naam</dt>
                    <dd>{ticket.name}</dd>
                  </div>
                  <div>
                    <dt>Bericht</dt>
                    <dd>{ticket.message}</dd>
                  </div>
                </dl>
                <p className="sample-note" style={{ padding: 0 }}>
                  Dit is een voorbeeld: er is niets verzonden of opgeslagen. Bel voor een echte
                  vraag <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>.
                </p>
                <Button variant="outline" onClick={() => setTicket(null)}>
                  Nieuw ticket
                </Button>
              </div>
            ) : (
              <>
                <h3>Maak een ticket aan</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    setTicket({
                      ref: `ESTG-${Math.floor(10000 + Math.random() * 90000)}`,
                      category: chosen.label,
                      name: String(f.get("name") ?? ""),
                      message: String(f.get("message") ?? ""),
                    });
                  }}
                >
                  <fieldset className="category-picker">
                    <legend>Waar gaat je vraag over?</legend>
                    {CATEGORIES.map((c) => (
                      <label key={c.id} className={category === c.id ? "selected" : ""}>
                        <input
                          type="radio"
                          name="category"
                          value={c.id}
                          checked={category === c.id}
                          onChange={() => setCategory(c.id)}
                        />
                        <c.icon size={20} aria-hidden />
                        <span>
                          <strong>{c.label}</strong>
                          <small>{c.hint}</small>
                        </span>
                      </label>
                    ))}
                  </fieldset>
                  <div className="field">
                    <label htmlFor="name">Naam</label>
                    <input id="name" name="name" required placeholder="Jouw naam" />
                  </div>
                  <div className="field">
                    <label htmlFor="company">Bedrijfsnaam</label>
                    <input id="company" name="company" required placeholder="Jouw bedrijf" />
                  </div>
                  <div className="field">
                    <label htmlFor="email">E-mailadres</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="naam@bedrijf.nl"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="message">Omschrijf je vraag of probleem</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Hoe meer details, hoe sneller we je kunnen helpen"
                    />
                  </div>
                  <Button type="submit" variant="accent" size="lg">
                    Ticket aanmaken
                  </Button>
                </form>
                <p className="sample-note">
                  Dit formulier is nog niet aangesloten op ESTG. Er worden geen berichten verzonden
                  of gegevens opgeslagen.
                </p>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </>
  );
}
