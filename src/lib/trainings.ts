import rooftop from "@/assets/solar-rooftop.jpg";
import panel from "@/assets/solar-panel-wide.jpg";
import battery from "@/assets/battery-wide.jpg";
import inverterPhoto from "@/assets/inverter-wide.jpg";
import charger from "@/assets/charger-wide.jpg";
import wallboxUnit from "@/assets/products/wallbox-wide.svg";
import stringUnit from "@/assets/products/string-inverter-wide.svg";
import microUnit from "@/assets/products/microinverter-multi-wide.svg";

export type TrainingKind = "praktijk" | "elearning";

export type Training = {
  id: string;
  title: string;
  /** Merknaam voor het logo; zonder logo-asset valt de kaart terug op een tekstbadge. */
  brand: string;
  kind: TrainingKind;
  description: string;
  image: string;
  /** Alleen praktijktrainingen: datum (ISO), maximum aantal plekken en fictief aantal reeds bezette plekken. */
  date?: string;
  capacity?: number;
  baseBooked?: number;
};

/**
 * Trainingsaanbod, overgenomen van de ESTG-website (estg.eu, met toestemming van de klant).
 * Plekken en bezetting zijn illustratief: er is geen koppeling met een echt inschrijfsysteem.
 */
export const trainings: Training[] = [
  {
    id: "sigenergy-technisch-oktober",
    title: "Technische Sigenergy-training",
    brand: "Sigenergy",
    kind: "praktijk",
    description:
      "Technische verdieping voor installateurs: installatie, inbedrijfstelling en configuratie van Sigenergy-systemen, met hands-on apparatuur op locatie.",
    image: rooftop,
    date: "2026-10-22",
    capacity: 20,
    baseBooked: 13,
  },
  {
    id: "sigenergy-commercieel-november",
    title: "Commerciële Sigenergy-training",
    brand: "Sigenergy",
    kind: "praktijk",
    description:
      "Verkoop- en adviesgerichte sessie: positioneer Sigenergy-oplossingen richting jouw klanten en vertaal techniek naar een sterk aanbod.",
    image: battery,
    date: "2026-11-19",
    capacity: 20,
    baseBooked: 8,
  },
  {
    id: "sigenergy-technisch-december",
    title: "Technische Sigenergy-training",
    brand: "Sigenergy",
    kind: "praktijk",
    description:
      "Tweede sessie van de technische training voor installateurs, met dezelfde inhoud en praktijkopstellingen als de eerdere sessie.",
    image: panel,
    date: "2026-12-10",
    capacity: 20,
    baseBooked: 4,
  },
  {
    id: "esdec-academy",
    title: "ESDEC Academy",
    brand: "ESDEC",
    kind: "elearning",
    description:
      "Alles over montagesystemen voor zonnepanelen. Doorloop de modules en word een echte “Solar Hero”.",
    image: rooftop,
  },
  {
    id: "enphase-university",
    title: "Enphase University",
    brand: "Enphase",
    kind: "elearning",
    description:
      "Online leerpaden over Enphase-systemen, inclusief certificering voor de IQ Battery 5P.",
    image: microUnit,
  },
  {
    id: "sma-solar-academy",
    title: "SMA Solar Academy",
    brand: "SMA",
    kind: "elearning",
    description: "E-learning over alle SMA-oplossingen, van omvormers tot energiemanagement.",
    image: inverterPhoto,
  },
  {
    id: "edge-academy",
    title: "EDGE Academy (SolarEdge)",
    brand: "SolarEdge",
    kind: "elearning",
    description: "Leer alles over SolarEdge-producten en -installaties in je eigen tempo.",
    image: stringUnit,
  },
  {
    id: "wallbox-academy",
    title: "Wallbox Academy",
    brand: "Wallbox",
    kind: "elearning",
    description: "Laadoplossingen en energieoplossingen van Wallbox, van installatie tot gebruik.",
    image: wallboxUnit,
  },
  {
    id: "staubli-customer-academy",
    title: "Stäubli Customer Academy",
    brand: "Stäubli",
    kind: "elearning",
    description: "Leer veilig werken met PV-installaties en de juiste connectoren.",
    image: charger,
  },
];

export const practiceTrainings = trainings.filter((t) => t.kind === "praktijk");
export const academies = trainings.filter((t) => t.kind === "elearning");
export const findTraining = (id: string) => trainings.find((t) => t.id === id);

/** Fictieve bezetting: het basisaantal plus de eigen inschrijving (puur illustratief). */
export function bookedSeats(t: Training, enrolled: boolean) {
  return Math.min(t.capacity ?? 0, (t.baseBooked ?? 0) + (enrolled ? 1 : 0));
}

export const trainingFaq = [
  {
    q: "Zijn de trainingen gratis?",
    a: "De meeste ESTG-webinars, e-learnings en praktijktrainingen zijn gratis voor professionele installateurs.",
  },
  {
    q: "Krijg ik een certificaat?",
    a: "Sommige merk-academies geven na het behalen van een toets een fabrikantencertificaat.",
  },
  {
    q: "Kan ik een webinar terugkijken?",
    a: "Een webinar is meestal achteraf terug te kijken.",
  },
  {
    q: "Wat als ik niet bij een praktijktraining kan zijn?",
    a: "Meld je dan tijdig af. Er zijn namelijk al kosten gemaakt voor de training.",
  },
  {
    q: "Wat is het verschil tussen een webinar, e-learning en praktijktraining?",
    a: "Webinars en e-learnings zijn online, live of on-demand. Een praktijktraining is hands-on op locatie, met apparatuur zoals thuisbatterijen, omvormers en laadpalen.",
  },
];
