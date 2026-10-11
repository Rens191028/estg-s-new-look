import panel from "@/assets/solar-panel.jpg";
import inverter from "@/assets/inverter.jpg";
import battery from "@/assets/battery.jpg";
import charger from "@/assets/charger.jpg";
import rooftop from "@/assets/solar-rooftop.jpg";
export const categories = [
  "Zonnepanelen",
  "Omvormers",
  "Energieopslag",
  "EV-laders",
  "Montagemateriaal",
  "Klimaat",
] as const;
export type Category = (typeof categories)[number];
export type Spec = { label: string; value: string };
export type Product = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  /** Illustratief artikelnummer, geen echt ESTG-SKU. */
  sku: string;
  image?: string | undefined;
  note: string;
  /** Nominaal vermogen in Wp, alleen voor zonnepanelen. */
  powerWp?: number;
  /** Illustratieve specificaties, ter indicatie. Worden bevestigd door ESTG. */
  specs: Spec[];
  isNew?: boolean;
};
export const products: Product[] = [
  {
    id: "all-black-zonnepaneel",
    name: "All Black zonnepaneel",
    brand: "JA Solar",
    category: "Zonnepanelen",
    sku: "DEMO-PV-001",
    image: panel,
    note: "Een strak paneel voor residentiële projecten.",
    powerWp: 430,
    isNew: true,
    specs: [
      { label: "Vermogen", value: "430 Wp" },
      { label: "Celtype", value: "Monokristallijn" },
      { label: "Uitvoering", value: "Full black" },
      { label: "Afmetingen", value: "1722 × 1134 × 30 mm" },
    ],
  },
  {
    id: "bifacial-zonnepaneel",
    name: "Bifacial zonnepaneel",
    brand: "Trina Solar",
    category: "Zonnepanelen",
    sku: "DEMO-PV-002",
    image: panel,
    note: "Zonnepanelen voor duurzame energieprojecten.",
    powerWp: 580,
    specs: [
      { label: "Vermogen", value: "580 Wp" },
      { label: "Celtype", value: "Monokristallijn, bifacial" },
      { label: "Afmetingen", value: "2278 × 1134 × 30 mm" },
    ],
  },
  {
    id: "hybride-omvormer",
    name: "Hybride omvormer",
    brand: "Sungrow",
    category: "Omvormers",
    sku: "DEMO-INV-001",
    image: inverter,
    note: "Verbind zonne-energie met slimme energieopslag.",
    specs: [
      { label: "Type", value: "Hybride" },
      { label: "Fasen", value: "3-fase" },
      { label: "Vermogen", value: "10 kW" },
      { label: "Batterijaansluiting", value: "Ja" },
    ],
  },
  {
    id: "string-omvormer",
    name: "String omvormer",
    brand: "Huawei",
    category: "Omvormers",
    sku: "DEMO-INV-002",
    image: inverter,
    note: "De schakel tussen je zonnepanelen en de installatie.",
    specs: [
      { label: "Type", value: "String" },
      { label: "Fasen", value: "3-fase" },
      { label: "Vermogen", value: "8 kW" },
    ],
  },
  {
    id: "modulaire-thuisbatterij",
    name: "Modulaire thuisbatterij",
    brand: "BYD",
    category: "Energieopslag",
    sku: "DEMO-BAT-001",
    image: battery,
    note: "Flexibele energieopslag voor thuis.",
    isNew: true,
    specs: [
      { label: "Capaciteit", value: "10,2 kWh" },
      { label: "Spanningsklasse", value: "HV" },
      { label: "Uitbreidbaar", value: "Modulair" },
    ],
  },
  {
    id: "batterijsysteem",
    name: "Batterijsysteem",
    brand: "Sungrow",
    category: "Energieopslag",
    sku: "DEMO-BAT-002",
    image: battery,
    note: "Meer grip op opgewekte energie.",
    specs: [
      { label: "Capaciteit", value: "12,8 kWh" },
      { label: "Spanningsklasse", value: "HV" },
    ],
  },
  {
    id: "slimme-ev-lader",
    name: "Slimme EV-laadoplossing",
    brand: "Alfen",
    category: "EV-laders",
    sku: "DEMO-EV-001",
    image: charger,
    note: "Laadoplossingen voor thuis en op de werkplek.",
    specs: [
      { label: "Vermogen", value: "11 kW" },
      { label: "Fasen", value: "3-fase" },
      { label: "Aansluiting", value: "Type 2" },
    ],
  },
  {
    id: "laadstation",
    name: "Laadstation",
    brand: "Charge Amps",
    category: "EV-laders",
    sku: "DEMO-EV-002",
    image: charger,
    note: "Slim laden voor dagelijkse mobiliteit.",
    specs: [
      { label: "Vermogen", value: "22 kW" },
      { label: "Fasen", value: "3-fase" },
    ],
  },
  {
    id: "montagesysteem-schuin-dak",
    name: "Montagesysteem schuin dak",
    brand: "K2 Systems",
    category: "Montagemateriaal",
    sku: "DEMO-MNT-001",
    image: rooftop,
    note: "Rails en dakhaken voor montage op een schuin dak.",
    specs: [
      { label: "Daktype", value: "Schuin" },
      { label: "Materiaal", value: "Aluminium" },
    ],
  },
  {
    id: "warmtepomp-lucht-water",
    name: "Lucht-water warmtepomp",
    brand: "Daikin",
    category: "Klimaat",
    sku: "DEMO-CLI-001",
    note: "Verwarmen en koelen met een rendabele warmtepomp.",
    specs: [
      { label: "Type", value: "Lucht-water" },
      { label: "Toepassing", value: "Verwarmen en koelen" },
    ],
  },
];
export const catalogDisclaimer =
  "Voorbeeldassortiment. Afbeeldingen, artikelnummers en specificaties zijn illustratief; prijzen en beschikbaarheid bevestigt ESTG.";
export function findProduct(id: string) {
  return products.find((p) => p.id === id);
}
/** Categoriekoppeling op hoofdlijnen, totdat technische compatibiliteitsdata beschikbaar is. */
const compatibleCategories: Record<Category, Category[]> = {
  Zonnepanelen: ["Omvormers", "Montagemateriaal"],
  Omvormers: ["Zonnepanelen", "Energieopslag"],
  Energieopslag: ["Omvormers"],
  "EV-laders": [],
  Montagemateriaal: ["Zonnepanelen"],
  Klimaat: [],
};
export function compatibleProducts(product: Product) {
  const wanted = compatibleCategories[product.category];
  return products.filter((p) => p.id !== product.id && wanted.includes(p.category));
}
export function similarProducts(product: Product) {
  return products.filter((p) => p.id !== product.id && p.category === product.category);
}
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
