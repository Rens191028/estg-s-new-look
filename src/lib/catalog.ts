import panel from "@/assets/solar-panel.jpg";
import inverter from "@/assets/inverter.jpg";
import battery from "@/assets/battery.jpg";
import charger from "@/assets/charger.jpg";
import rooftop from "@/assets/solar-rooftop.jpg";
import hpOutdoor from "@/assets/products/heatpump-outdoor.svg";
import hpIndoor from "@/assets/products/heatpump-indoor.svg";
import hpHybrid from "@/assets/products/heatpump-hybrid.svg";
import pvController from "@/assets/products/pv-controller.svg";
import stringInverter from "@/assets/products/string-inverter.svg";
import microDuo from "@/assets/products/microinverter-duo.svg";
import microMulti from "@/assets/products/microinverter-multi.svg";
import wallbox from "@/assets/products/wallbox.svg";
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
  /** Illustratieve voorbeeldprijs in hele euro's, excl. btw. Geen echte ESTG-prijs. */
  price: number;
  /** "Was"-prijs: staat die boven `price`, dan is het product in de aanbieding. */
  originalPrice?: number;
  image?: string | undefined;
  note: string;
  /** Nominaal vermogen in Wp, alleen voor zonnepanelen. */
  powerWp?: number;
  /** Illustratieve specificaties, ter indicatie. Worden bevestigd door ESTG. */
  specs: Spec[];
  isNew?: boolean;
  isBestseller?: boolean;
};
export const products: Product[] = [
  {
    id: "all-black-zonnepaneel",
    name: "All Black zonnepaneel",
    brand: "JA Solar",
    category: "Zonnepanelen",
    sku: "DEMO-PV-001",
    price: 139,
    isBestseller: true,
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
    price: 179,
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
    price: 2450,
    originalPrice: 2690,
    isBestseller: true,
    image: inverter,
    note: "Verbind zonne-energie met slimme energieopslag.",
    specs: [
      { label: "Type", value: "Hybride" },
      { label: "Fasen", value: "3-fase" },
      { label: "Vermogen", value: "10 kW" },
      { label: "Max. DC-ingangsvermogen", value: "15 kWp" },
      { label: "Batterijaansluiting", value: "Ja" },
    ],
  },
  {
    id: "string-omvormer",
    name: "String omvormer",
    brand: "Huawei",
    category: "Omvormers",
    sku: "DEMO-INV-002",
    price: 1890,
    originalPrice: 2090,
    image: inverter,
    note: "De schakel tussen je zonnepanelen en de installatie.",
    specs: [
      { label: "Type", value: "String" },
      { label: "Fasen", value: "3-fase" },
      { label: "Vermogen", value: "8 kW" },
      { label: "Max. DC-ingangsvermogen", value: "12 kWp" },
    ],
  },
  {
    id: "modulaire-thuisbatterij",
    name: "Modulaire thuisbatterij",
    brand: "BYD",
    category: "Energieopslag",
    sku: "DEMO-BAT-001",
    price: 4250,
    originalPrice: 4690,
    isBestseller: true,
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
    price: 4950,
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
    price: 799,
    originalPrice: 899,
    isBestseller: true,
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
    price: 1095,
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
    price: 189,
    originalPrice: 219,
    isBestseller: true,
    image: rooftop,
    note: "Rails en dakhaken voor montage op een schuin dak.",
    specs: [
      { label: "Daktype", value: "Schuin" },
      { label: "Materiaal", value: "Aluminium" },
      { label: "Panelen per set", value: "4" },
    ],
  },
  {
    id: "warmtepomp-lucht-water",
    name: "Lucht-water warmtepomp",
    brand: "Daikin",
    category: "Klimaat",
    sku: "DEMO-CLI-001",
    image: hpOutdoor,
    price: 3450,
    isBestseller: true,
    note: "Verwarmen en koelen met een rendabele warmtepomp.",
    specs: [
      { label: "Type", value: "Lucht-water" },
      { label: "Toepassing", value: "Verwarmen en koelen" },
    ],
  },
  // --- Zonnepanelen ---
  {
    id: "mono-perc-zonnepaneel",
    name: "Mono PERC zonnepaneel",
    brand: "JA Solar",
    category: "Zonnepanelen",
    sku: "DEMO-PV-003",
    price: 129,
    originalPrice: 149,
    image: panel,
    note: "Betrouwbaar paneel voor grootschalige dakprojecten.",
    powerWp: 405,
    specs: [
      { label: "Vermogen", value: "405 Wp" },
      { label: "Celtype", value: "Monokristallijn PERC" },
      { label: "Uitvoering", value: "Zilveren frame" },
      { label: "Afmetingen", value: "1722 × 1134 × 30 mm" },
    ],
  },
  {
    id: "high-power-zonnepaneel",
    name: "High Power zonnepaneel",
    brand: "Trina Solar",
    category: "Zonnepanelen",
    sku: "DEMO-PV-004",
    price: 219,
    image: panel,
    note: "Hoog rendement dankzij N-type TOPCon-celtechniek.",
    powerWp: 610,
    isNew: true,
    specs: [
      { label: "Vermogen", value: "610 Wp" },
      { label: "Celtype", value: "N-type TOPCon" },
      { label: "Afmetingen", value: "2384 × 1303 × 35 mm" },
    ],
  },
  {
    id: "back-contact-zonnepaneel",
    name: "Back-contact zonnepaneel",
    brand: "AIKO",
    category: "Zonnepanelen",
    sku: "DEMO-PV-005",
    price: 169,
    image: panel,
    note: "Geen zichtbare busbars voor een strak, uniform aanzien.",
    powerWp: 450,
    specs: [
      { label: "Vermogen", value: "450 Wp" },
      { label: "Celtype", value: "ABC back-contact" },
      { label: "Uitvoering", value: "All black" },
    ],
  },

  // --- Omvormers ---
  {
    id: "microomvormer",
    name: "Microomvormer",
    brand: "Enphase",
    category: "Omvormers",
    sku: "DEMO-INV-003",
    price: 139,
    image: inverter,
    note: "Per paneel omzetting, voor maximale opbrengst bij schaduw.",
    specs: [
      { label: "Type", value: "Micro-omvormer" },
      { label: "Koppeling", value: "AC, per paneel" },
      { label: "Max. ingangsvermogen", value: "480 W" },
    ],
  },
  {
    id: "string-omvormer-optimizers",
    name: "String omvormer met optimizers",
    brand: "SolarEdge",
    category: "Omvormers",
    sku: "DEMO-INV-004",
    price: 2290,
    image: inverter,
    note: "Paneel-niveau optimalisatie gecombineerd met een centrale omvormer.",
    specs: [
      { label: "Type", value: "String + optimizer" },
      { label: "Fasen", value: "1-fase" },
      { label: "Vermogen", value: "10 kW" },
      { label: "Max. DC-ingangsvermogen", value: "15 kWp" },
    ],
  },
  {
    id: "sunny-tripower-omvormer",
    name: "Sunny Tripower omvormer",
    brand: "SMA",
    category: "Omvormers",
    sku: "DEMO-INV-005",
    price: 3650,
    image: inverter,
    note: "Robuuste 3-fase omvormer voor grotere installaties.",
    specs: [
      { label: "Type", value: "String" },
      { label: "Fasen", value: "3-fase" },
      { label: "Vermogen", value: "15 kW" },
      { label: "Max. DC-ingangsvermogen", value: "22,5 kWp" },
    ],
  },
  {
    id: "hybride-omvormer-max",
    name: "Hybride omvormer MAX",
    brand: "Growatt",
    category: "Omvormers",
    sku: "DEMO-INV-006",
    price: 1950,
    image: inverter,
    note: "Batterij-ready hybride omvormer voor woning en kleinzakelijk.",
    isNew: true,
    specs: [
      { label: "Type", value: "Hybride" },
      { label: "Fasen", value: "1-fase" },
      { label: "Vermogen", value: "8 kW" },
      { label: "Max. DC-ingangsvermogen", value: "12 kWp" },
      { label: "Batterijaansluiting", value: "Ja" },
    ],
  },
  {
    id: "hybride-omvormer-compact",
    name: "Hybride omvormer compact",
    brand: "Huawei",
    category: "Omvormers",
    sku: "DEMO-INV-007",
    price: 1590,
    image: inverter,
    note: "Compacte hybride omvormer, uit te breiden met LUNA-batterijmodules.",
    specs: [
      { label: "Type", value: "Hybride" },
      { label: "Fasen", value: "1-fase" },
      { label: "Vermogen", value: "6 kW" },
      { label: "Max. DC-ingangsvermogen", value: "9 kWp" },
      { label: "Batterijaansluiting", value: "Ja" },
    ],
  },

  // --- Energieopslag ---
  {
    id: "resu-batterij",
    name: "RESU batterij",
    brand: "LG",
    category: "Energieopslag",
    sku: "DEMO-BAT-003",
    price: 3890,
    image: battery,
    note: "Compacte wandmontage-batterij voor woninginstallaties.",
    specs: [
      { label: "Capaciteit", value: "9,8 kWh" },
      { label: "Spanningsklasse", value: "LV" },
      { label: "Montage", value: "Wandmontage" },
    ],
  },
  {
    id: "sigenstor-batterijsysteem",
    name: "SigenStor batterijsysteem",
    brand: "Sigenergy",
    category: "Energieopslag",
    sku: "DEMO-BAT-004",
    price: 3590,
    image: battery,
    note: "Modulair batterijsysteem, uit te breiden in stappen.",
    isNew: true,
    specs: [
      { label: "Capaciteit", value: "8 kWh" },
      { label: "Spanningsklasse", value: "HV" },
      { label: "Uitbreidbaar", value: "Modulair" },
    ],
  },
  {
    id: "ark-batterijsysteem",
    name: "ARK batterijsysteem",
    brand: "Growatt",
    category: "Energieopslag",
    sku: "DEMO-BAT-005",
    price: 2190,
    image: battery,
    note: "Stapelbare batterijmodules voor flexibele capaciteit.",
    specs: [
      { label: "Capaciteit", value: "5,12 kWh per module" },
      { label: "Spanningsklasse", value: "LV" },
      { label: "Uitbreidbaar", value: "Stapelbaar" },
    ],
  },
  {
    id: "backup-batterijmodule",
    name: "Backup batterijmodule",
    brand: "BYD",
    category: "Energieopslag",
    sku: "DEMO-BAT-006",
    price: 1190,
    image: battery,
    note: "Uitbreidingsmodule voor bestaande BYD-batterijsystemen.",
    specs: [
      { label: "Capaciteit", value: "2,56 kWh" },
      { label: "Spanningsklasse", value: "HV" },
      { label: "Uitbreidbaar", value: "Ja, op bestaand systeem" },
    ],
  },

  // --- EV-laders ---
  {
    id: "slimme-laadpaal-denim",
    name: "Slimme laadpaal",
    brand: "denim",
    category: "EV-laders",
    sku: "DEMO-EV-003",
    price: 949,
    image: charger,
    note: "App-gestuurd laden met dynamische lastbalancering.",
    isNew: true,
    specs: [
      { label: "Vermogen", value: "22 kW" },
      { label: "Fasen", value: "3-fase" },
      { label: "Bediening", value: "App" },
    ],
  },
  {
    id: "thuislaadpunt",
    name: "Thuislaadpunt",
    brand: "Alfen",
    category: "EV-laders",
    sku: "DEMO-EV-004",
    price: 695,
    image: charger,
    note: "Compact laadpunt voor thuisgebruik, 1- of 3-fase.",
    specs: [
      { label: "Vermogen", value: "11 kW" },
      { label: "Fasen", value: "1-fase/3-fase" },
      { label: "Aansluiting", value: "Type 2" },
    ],
  },
  {
    id: "laadpaal-duo",
    name: "Laadpaal duo",
    brand: "Charge Amps",
    category: "EV-laders",
    sku: "DEMO-EV-005",
    price: 1895,
    image: charger,
    note: "Twee laadpunten in één paal, ideaal voor bedrijfsparkeerplaatsen.",
    specs: [
      { label: "Vermogen", value: "2 × 22 kW" },
      { label: "Fasen", value: "3-fase" },
      { label: "Aansluitingen", value: "2 × Type 2" },
    ],
  },

  // --- Montagemateriaal ---
  {
    id: "montagesysteem-plat-dak-enstall",
    name: "Montagesysteem plat dak",
    brand: "Enstall",
    category: "Montagemateriaal",
    sku: "DEMO-MNT-002",
    price: 219,
    image: rooftop,
    note: "Ballastsysteem voor montage op een plat dak, zonder doorboring.",
    specs: [
      { label: "Daktype", value: "Plat" },
      { label: "Materiaal", value: "Aluminium" },
      { label: "Bevestiging", value: "Ballast, geen doorboring" },
      { label: "Panelen per set", value: "6" },
    ],
  },
  {
    id: "montagesysteem-plat-dak-k2",
    name: "Montagesysteem plat dak",
    brand: "K2 Systems",
    category: "Montagemateriaal",
    sku: "DEMO-MNT-003",
    price: 249,
    image: rooftop,
    note: "Ballastsysteem voor platte daken, instelbare hellingshoek.",
    specs: [
      { label: "Daktype", value: "Plat" },
      { label: "Materiaal", value: "Aluminium" },
      { label: "Hellingshoek", value: "Instelbaar" },
      { label: "Panelen per set", value: "8" },
    ],
  },
  {
    id: "dakhaken-set",
    name: "Dakhaken set",
    brand: "K2 Systems",
    category: "Montagemateriaal",
    sku: "DEMO-MNT-004",
    price: 89,
    image: rooftop,
    note: "Universele dakhaken voor montage op een pannendak.",
    specs: [
      { label: "Daktype", value: "Schuin (pannen)" },
      { label: "Materiaal", value: "RVS" },
      { label: "Dakhaken per set", value: "20" },
      { label: "Panelen per set", value: "ca. 10 panelen (2 haken per paneel)" },
    ],
  },

  // --- Klimaat ---
  {
    id: "lucht-lucht-warmtepomp",
    name: "Lucht-lucht warmtepomp",
    brand: "Mitsubishi Heavy Industries",
    category: "Klimaat",
    sku: "DEMO-CLI-002",
    image: hpIndoor,
    price: 1650,
    note: "Split-unit voor verwarmen en koelen van een enkele ruimte.",
    specs: [
      { label: "Type", value: "Lucht-lucht (split)" },
      { label: "Toepassing", value: "Verwarmen en koelen" },
    ],
  },
  {
    id: "hybride-warmtepomp",
    name: "Hybride warmtepomp",
    brand: "Daikin",
    category: "Klimaat",
    sku: "DEMO-CLI-003",
    image: hpHybrid,
    price: 3950,
    note: "Combineert een lucht-water warmtepomp met de bestaande CV-ketel.",
    isNew: true,
    specs: [
      { label: "Type", value: "Lucht-water, hybride" },
      { label: "Toepassing", value: "Verwarmen, in combinatie met CV-ketel" },
    ],
  },
  {
    id: "pv-warmwaterregelaar",
    name: "PV-warmwaterregelaar",
    brand: "My-PV",
    category: "Klimaat",
    sku: "DEMO-CLI-004",
    image: pvController,
    price: 890,
    note: "Zet overschot aan zonnestroom om in warm water via de bestaande boiler.",
    specs: [
      { label: "Type", value: "PV-warmwaterregelaar" },
      { label: "Vermogen", value: "3 kW" },
      { label: "Toepassing", value: "Boileraansturing" },
    ],
  },
  {
    id: "lucht-lucht-warmtepomp-mitsubishi-electric",
    name: "Lucht-lucht warmtepomp",
    brand: "Mitsubishi Electric",
    category: "Klimaat",
    sku: "DEMO-CLI-005",
    image: hpOutdoor,
    price: 1590,
    note: "Split-unit voor verwarmen en koelen van een enkele ruimte.",
    specs: [
      { label: "Type", value: "Lucht-lucht (split)" },
      { label: "Toepassing", value: "Verwarmen en koelen" },
    ],
  },
  {
    id: "string-omvormer-abb",
    name: "String omvormer",
    brand: "ABB",
    category: "Omvormers",
    sku: "DEMO-INV-008",
    image: stringInverter,
    price: 2690,
    note: "Robuuste 3-fase omvormer voor middelgrote installaties.",
    specs: [
      { label: "Type", value: "String" },
      { label: "Fasen", value: "3-fase" },
      { label: "Vermogen", value: "12 kW" },
      { label: "Max. DC-ingangsvermogen", value: "18 kWp" },
    ],
  },
  {
    id: "microomvormer-duo-apsystems",
    name: "Microomvormer duo",
    brand: "APsystems",
    category: "Omvormers",
    sku: "DEMO-INV-009",
    image: microDuo,
    price: 159,
    isNew: true,
    note: "Eén micro-omvormer, aansturing voor twee panelen tegelijk.",
    specs: [
      { label: "Type", value: "Micro-omvormer" },
      { label: "Koppeling", value: "AC, per 2 panelen" },
      { label: "Max. ingangsvermogen", value: "880 W" },
    ],
  },
  {
    id: "hybride-warmtepomp-daikin-compact",
    name: "Hybride warmtepomp compact",
    brand: "Daikin",
    category: "Klimaat",
    sku: "DEMO-CLI-006",
    image: hpHybrid,
    price: 3290,
    note: "Compacte uitvoering voor combinatie met een bestaande CV-ketel.",
    specs: [
      { label: "Type", value: "Lucht-water, hybride" },
      { label: "Toepassing", value: "Verwarmen, in combinatie met CV-ketel" },
    ],
  },
  {
    id: "microomvormer-multi-hoymiles",
    name: "Microomvormer multi-paneel",
    brand: "Hoymiles",
    category: "Omvormers",
    sku: "DEMO-INV-010",
    image: microMulti,
    price: 219,
    isNew: true,
    note: "Eén micro-omvormer voor tot vier panelen, voor compacte installaties.",
    specs: [
      { label: "Type", value: "Micro-omvormer" },
      { label: "Koppeling", value: "AC, per 4 panelen" },
      { label: "Max. ingangsvermogen", value: "1.600 W" },
    ],
  },
  {
    id: "compacte-laadpaal-wallbox",
    name: "Compacte laadpaal",
    brand: "Wallbox",
    category: "EV-laders",
    sku: "DEMO-EV-006",
    image: wallbox,
    price: 749,
    note: "Compacte laadpaal met app-bediening, voor thuis en kleinzakelijk gebruik.",
    specs: [
      { label: "Vermogen", value: "22 kW" },
      { label: "Fasen", value: "3-fase" },
      { label: "Bediening", value: "App" },
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
  "Mitsubishi Heavy Industries",
  "denim",
  "LG",
  "My-PV",
  "Mitsubishi Electric",
  "ABB",
  "APsystems",
  "Hoymiles",
  "Wallbox",
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

const brandLogoSlug: Record<string, string> = {
  "JA Solar": "ja-solar",
  "Trina Solar": "trina-solar",
  Sungrow: "sungrow",
  Huawei: "huawei",
  SolarEdge: "solaredge",
  Enphase: "enphase",
  SMA: "sma",
  Growatt: "growatt",
  BYD: "byd",
  Alfen: "alfen",
  "Charge Amps": "charge-amps",
  Daikin: "daikin",
  "K2 Systems": "k2-systems",
  Sigenergy: "sigenergy",
  AIKO: "aiko",
  Enstall: "enstall",
  "Mitsubishi Heavy Industries": "mitsubishi-heavy-industries",
  denim: "denim",
  LG: "lg",
  "My-PV": "my-pv",
  "Mitsubishi Electric": "mitsubishi-electric",
  ABB: "abb",
  APsystems: "apsystems",
  Hoymiles: "hoymiles",
  Wallbox: "wallbox",
};

// Eager glob: een ontbrekend bestand geeft geen buildfout, alleen geen entry.
const brandLogoFiles = import.meta.glob<string>("/src/assets/brands/*.{svg,png}", {
  eager: true,
  query: "?url",
  import: "default",
});

/** Pad naar het merklogo, of null als er (nog) geen bestand is. */
export function brandLogo(brand: string): string | null {
  const slug = brandLogoSlug[brand];
  if (!slug) return null;
  return (
    brandLogoFiles[`/src/assets/brands/${slug}.svg`] ??
    brandLogoFiles[`/src/assets/brands/${slug}.png`] ??
    null
  );
}

/** Logo's met een gevuld vlak (bijv. SMA): als wit silhouet worden dat blokken, dus tonen we ze op een lichte tegel. */
export const solidBrandLogos = new Set(["SMA", "K2 Systems"]);

export function isDeal(p: Product) {
  return p.originalPrice !== undefined && p.originalPrice > p.price;
}
/** Kortingspercentage, afgerond op hele procenten. */
export function discountPercent(p: Product) {
  return isDeal(p) ? Math.round((1 - p.price / p.originalPrice!) * 100) : 0;
}
/** Producten in de aanbieding, grootste korting eerst. */
export function dealProducts() {
  return products.filter(isDeal).sort((a, b) => discountPercent(b) - discountPercent(a));
}
