import rooftop from "@/assets/solar-rooftop.jpg";
import battery from "@/assets/battery.jpg";
import charger from "@/assets/charger.jpg";
export type Article = {
  slug: string;
  title: string;
  category: string;
  image?: string | undefined;
  intro: string;
  sections: [string, string][];
};
export const articles: Article[] = [
  {
    slug: "energieopslag",
    title: "Energieopslag: de volgende stap in jouw project",
    category: "ENERGIEOPSLAG",
    image: battery,
    intro:
      "Opgewekte energie benutten wanneer je die nodig hebt. Wat neem je mee bij de keuze voor een batterijsysteem?",
    sections: [
      [
        "Begin bij het energieprofiel",
        "Breng het verbruik en de opwekking van de installatie in kaart. Een passend batterijsysteem sluit aan op het dagelijkse energieprofiel en de doelen van de gebruiker.",
      ],
      [
        "Denk in complete systemen",
        "Controleer de compatibiliteit van batterij, omvormer en energiemanagementsysteem. Kijk ook naar de mogelijkheden om de opslag later uit te breiden.",
      ],
      [
        "Plan de installatie zorgvuldig",
        "Houd rekening met de beschikbare ruimte, installatievoorschriften en toepasselijke veiligheidsnormen. Raadpleeg altijd de actuele documentatie van de fabrikant.",
      ],
    ],
  },
  {
    slug: "zonne-energie",
    title: "Een sterke basis voor jouw zonne-energieproject",
    category: "ZONNE-ENERGIE",
    image: rooftop,
    intro:
      "Een goede installatie begint met de juiste combinatie van zonnepanelen, omvormers en montagemateriaal.",
    sections: [
      [
        "Bekijk het complete dak",
        "Oriëntatie, daktype, schaduw en beschikbare ruimte bepalen de mogelijkheden. Maak een ontwerp dat past bij de locatie en het verwachte verbruik.",
      ],
      [
        "Kies componenten die samenwerken",
        "Stem panelen, omvormers en montagemateriaal op elkaar af. Controleer elektrische grenzen en montagevoorschriften aan de hand van de fabrikantdocumentatie.",
      ],
      [
        "Blijf vooruitdenken",
        "Toekomstige energieopslag of elektrisch laden kan invloed hebben op je ontwerp. Bespreek uitbreidingsplannen voordat de installatie wordt gerealiseerd.",
      ],
    ],
  },
  {
    slug: "slim-laden",
    title: "Slim laden begint bij de juiste oplossing",
    category: "EV-LADEN",
    image: charger,
    intro:
      "Van een laadpunt thuis tot laadoplossingen op het werk. Zo kijk je verder dan alleen de laadpaal.",
    sections: [
      [
        "De locatie bepaalt de keuze",
        "Kijk naar de aansluiting, de gebruikers en het beschikbare vermogen. Een laadpunt thuis stelt andere eisen dan een laadplein voor meerdere voertuigen.",
      ],
      [
        "Verdeel het vermogen slim",
        "Load balancing kan helpen om het beschikbare vermogen te verdelen. Laat de aansluiting en het ontwerp beoordelen door een gekwalificeerde installateur.",
      ],
      [
        "Verbind laden met zonne-energie",
        "Onderzoek de mogelijkheden voor koppeling met zonnepanelen en energiemanagement. Compatibiliteit en configuratie verschillen per product en fabrikant.",
      ],
    ],
  },
  {
    slug: "batterij-dimensioneren",
    title: "Thuisbatterij dimensioneren op basis van energieverbruik",
    category: "ENERGIEOPSLAG",
    image: battery,
    intro:
      "Een te kleine batterij laat zonne-energie onbenut; een te grote verhoogt de kosten zonder evenredig meer rendement. Zo bepaal je de juiste capaciteit.",
    sections: [
      [
        "Welke informatie heb je nodig?",
        "Het dagelijkse en jaarlijkse stroomverbruik, de grootte van het zonnepaneelsysteem, de momenten waarop stroom wordt gebruikt, en toekomstig verbruik zoals een elektrische auto, warmtepomp of airco.",
      ],
      [
        "Veelgemaakte fouten",
        "Alleen naar het jaarverbruik kijken, het dagelijkse gebruikspatroon negeren, het zonnepaneelsysteem buiten beschouwing laten, en toekomstige elektrificatie over het hoofd zien.",
      ],
      [
        "De juiste batterij kiezen met ESTG",
        "ESTG werkt met merken als Growatt, Sigenergy, Enphase, SolarEdge, Huawei en APsystems. Selectiecriteria: capaciteit, compatibiliteit met de omvormer, uitbreidingsmogelijkheden en technische ondersteuning.",
      ],
    ],
  },
  {
    slug: "airco-zonnepanelen-batterijen",
    title: "Slim koelen: airco, zonnepanelen en batterijen",
    category: "KLIMAAT",
    intro:
      "Een airco combineren met zonnepanelen en een batterij is een duurzame, kostenefficiënte manier om te koelen en een kans voor installateurs om dit als compleet systeem aan te bieden.",
    sections: [
      [
        "Hoe solar en airco samenwerken",
        "De piekproductie van zonnepanelen valt vaak samen met de middaguren, wanneer een airco het hardst werkt. Zo draait de koeling grotendeels op eigen zonne-energie en daalt de belasting van het net.",
      ],
      [
        "De rol van de batterij",
        "Batterijen slaan overtollige zonne-energie op voor de avond en bewolkte dagen en vangen de stroompieken van de airco op. Met een energiemanagementsysteem wordt dit automatisch geoptimaliseerd, en bij stroomuitval blijft de airco werken.",
      ],
      [
        "Tips voor installateurs",
        "Communiceer naast de financiële besparing ook de duurzaamheid en energieonafhankelijkheid. Een onderhoudscontract en monitoring verlengen de levensduur en helpen storingen snel op te sporen.",
      ],
    ],
  },
  {
    slug: "eu-batterijverordening",
    title: "Wat de EU-batterijverordening betekent voor jouw werk",
    category: "REGELGEVING",
    intro:
      "De EU-batterijverordening (2023/1542) gaat verder dan een nieuw label: elk opslagsysteem boven 2 kWh krijgt een digitaal paspoort. Dit verandert het werk van een installateur.",
    sections: [
      [
        "Wat is het batterijpaspoort?",
        "Een digitale identiteitskaart via een QR-code op de batterijbehuizing. Installateurs krijgen hiermee toegang tot de status, onderhouds- en veiligheidsgeschiedenis en reparatie-instructies van de batterij.",
      ],
      [
        "De tijdlijn om in de gaten te houden",
        "Februari 2026: fabrikanten moeten de CO₂-voetafdruk opgeven. Augustus 2026: nieuwe labels met levensduur, capaciteit en chemische samenstelling worden verplicht. Februari 2027: het volledige digitale paspoort via QR-code wordt verplicht voor nieuwe systemen.",
      ],
      [
        "Wat dit oplevert",
        "Recht op reparatie: losse modules vervangen in plaats van een heel systeem afschrijven. Een transparante status van de batterij verhoogt bovendien de restwaarde bij doorverkoop of tweede leven.",
      ],
    ],
  },
];
