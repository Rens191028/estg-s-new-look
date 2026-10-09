import panel from "@/assets/solar-panel.jpg";
import inverter from "@/assets/inverter.jpg";
import battery from "@/assets/battery.jpg";
import charger from "@/assets/charger.jpg";
export const categories = [
  "Zonnepanelen",
  "Omvormers",
  "Energieopslag",
  "EV-laders",
  "Montagemateriaal",
  "Klimaat",
];
export const products = [
  {
    id: "all-black-zonnepaneel",
    name: "All Black zonnepaneel",
    brand: "JA Solar",
    category: "Zonnepanelen",
    image: panel,
    note: "Een strak paneel voor residentiële projecten.",
  },
  {
    id: "hybride-omvormer",
    name: "Hybride omvormer",
    brand: "Sungrow",
    category: "Omvormers",
    image: inverter,
    note: "Verbind zonne-energie met slimme energieopslag.",
  },
  {
    id: "modulaire-thuisbatterij",
    name: "Modulaire thuisbatterij",
    brand: "BYD",
    category: "Energieopslag",
    image: battery,
    note: "Flexibele energieopslag voor thuis.",
  },
  {
    id: "slimme-ev-lader",
    name: "Slimme EV-laadoplossing",
    brand: "Alfen",
    category: "EV-laders",
    image: charger,
    note: "Laadoplossingen voor thuis en op de werkplek.",
  },
  {
    id: "bifacial-zonnepaneel",
    name: "Bifacial zonnepaneel",
    brand: "Trina Solar",
    category: "Zonnepanelen",
    image: panel,
    note: "Zonnepanelen voor duurzame energieprojecten.",
  },
  {
    id: "string-omvormer",
    name: "String omvormer",
    brand: "Huawei",
    category: "Omvormers",
    image: inverter,
    note: "De schakel tussen je zonnepanelen en de installatie.",
  },
  {
    id: "batterijsysteem",
    name: "Batterijsysteem",
    brand: "Sungrow",
    category: "Energieopslag",
    image: battery,
    note: "Meer grip op opgewekte energie.",
  },
  {
    id: "laadstation",
    name: "Laadstation",
    brand: "Charge Amps",
    category: "EV-laders",
    image: charger,
    note: "Slim laden voor dagelijkse mobiliteit.",
  },
];
export type Product = (typeof products)[number];
export const brands = [
  "JA Solar",
  "Trina Solar",
  "Sungrow",
  "Huawei",
  "SolarEdge",
  "Enphase",
  "SMA",
  "Growatt",
  "BYD",
  "Alfen",
  "Charge Amps",
  "Daikin",
  "K2 Systems",
  "Sigenergy",
  "AIKO",
  "Enstall",
];
export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | ESTG` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | ESTG` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
