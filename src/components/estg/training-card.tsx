import { Link } from "@tanstack/react-router";
import { CalendarDays, Check, Infinity as InfinityIcon, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { brandLogo } from "@/lib/catalog";
import { bookedSeats, type Training } from "@/lib/trainings";
import { useAuth } from "./auth";
import { useTrainings } from "./trainings";

const formatDay = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/** Inschrijfstatus: niet ingelogd, ingelogd, of ingeschreven (met bevestiging bij uitschrijven). */
export function TrainingAction({ training }: { training: Training }) {
  const { user, loading } = useAuth();
  const { has, enroll, unenroll } = useTrainings();
  const [confirming, setConfirming] = useState(false);
  const enrolled = has(training.id);
  const full = training.capacity !== undefined && bookedSeats(training, false) >= training.capacity;

  if (loading) return <span className="training-action-placeholder" aria-hidden />;
  if (!user)
    return (
      <Button asChild variant="outline" className="training-cta">
        <Link to="/inloggen" search={{ reason: "trainingen", returnTo: "/trainingen" }}>
          Inloggen om je aan te melden
        </Link>
      </Button>
    );
  if (!enrolled)
    return (
      <Button
        variant="accent"
        className="training-cta"
        disabled={full}
        onClick={() => void enroll(training.id)}
      >
        {full ? "Volgeboekt" : "Inschrijven"}
      </Button>
    );
  return (
    <div className="training-enrolled">
      <Badge tone="success" role="status">
        <Check size={14} aria-hidden /> U bent ingeschreven
      </Badge>
      {confirming ? (
        <span className="training-confirm" role="group" aria-label="Uitschrijven bevestigen">
          Weet je het zeker?
          <button
            type="button"
            className="training-link danger"
            onClick={() => {
              setConfirming(false);
              void unenroll(training.id);
            }}
          >
            Ja, uitschrijven
          </button>
          <button type="button" className="training-link" onClick={() => setConfirming(false)}>
            Annuleren
          </button>
        </span>
      ) : (
        <button type="button" className="training-link" onClick={() => setConfirming(true)}>
          Uitschrijven
        </button>
      )}
    </div>
  );
}

export function TrainingCard({ training }: { training: Training }) {
  const { has } = useTrainings();
  const logo = brandLogo(training.brand);
  const practice = training.kind === "praktijk";
  const booked = practice ? bookedSeats(training, has(training.id)) : 0;
  return (
    <article className="training-card">
      <div className="training-media">
        <img src={training.image} alt="" width={1650} height={1000} loading="lazy" />
        <Badge tone={practice ? "accent" : "info"} className="training-type">
          {practice ? "Praktijktraining" : "E-learning"}
        </Badge>
      </div>
      <div className="training-body">
        <div className="training-brand">
          {logo ? (
            <img src={logo} alt={training.brand} />
          ) : (
            <span className="training-brand-text">{training.brand}</span>
          )}
        </div>
        <h3>{training.title}</h3>
        <p>{training.description}</p>
        <ul className="training-meta">
          {practice && training.date ? (
            <>
              <li>
                <CalendarDays size={15} aria-hidden /> {formatDay(training.date)}
              </li>
              <li>
                <MapPin size={15} aria-hidden /> Op locatie, hands-on
              </li>
              <li>
                <Users size={15} aria-hidden /> {booked} van de {training.capacity} plekken bezet
              </li>
            </>
          ) : (
            <li>
              <InfinityIcon size={15} aria-hidden /> Doorlopend beschikbaar, online in eigen tempo
            </li>
          )}
        </ul>
        {practice && training.capacity ? (
          <div
            className="seat-meter"
            role="img"
            aria-label={`${booked} van de ${training.capacity} plekken bezet`}
          >
            <span style={{ width: `${(booked / training.capacity) * 100}%` }} />
          </div>
        ) : null}
        <TrainingAction training={training} />
      </div>
    </article>
  );
}
