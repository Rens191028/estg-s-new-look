import rooftop from "@/assets/solar-rooftop.jpg";
import battery from "@/assets/battery-wide.jpg";
import charger from "@/assets/charger-wide.jpg";
import inverterPhoto from "@/assets/inverter-wide.jpg";
import panelPhoto from "@/assets/solar-panel-wide.jpg";
import acOutdoor from "@/assets/products/heatpump-outdoor-wide.svg";
import hybridUnit from "@/assets/products/heatpump-hybrid-wide.svg";
import stringUnit from "@/assets/products/string-inverter-wide.svg";
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
    image: acOutdoor,
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
    image: inverterPhoto,
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
  {
    slug: "zonnepanelen-orientatie",
    title: "Zonnepanelen en oriëntatie: wat levert het meeste op?",
    category: "ZONNE-ENERGIE",
    image: panelPhoto,
    intro:
      "Zuid is de klassieker, maar niet altijd de beste keuze. Oost-west en platte daken verdienen een eerlijke vergelijking, zeker met een veranderend verbruikspatroon.",
    sections: [
      [
        "Zuid, oost-west of iets ertussenin",
        "Een zuidopstelling levert per paneel de hoogste jaaropbrengst, maar concentreert die rond het middaguur. Een oost-westopstelling verspreidt de opbrengst over de dag en past vaak beter bij een verbruik in de ochtend en avond. Op een plat dak kunnen meer panelen per vierkante meter worden geplaatst.",
      ],
      [
        "Kijk verder dan de opbrengst per paneel",
        "Eigen verbruik, netcongestie en terugleververgoedingen bepalen steeds vaker wat een systeem werkelijk oplevert. Vergelijk daarom opstellingen op basis van het verwachte verbruiksprofiel, niet alleen op kWh per paneel.",
      ],
      [
        "Schaduw, helling en omvormerkeuze",
        "Gedeeltelijke schaduw en verschillende dakvlakken vragen om een omvormer met meerdere MPP-trackers of om optimizers en microomvormers. Laat het ontwerp altijd toetsen aan de actuele fabrikantdocumentatie.",
      ],
    ],
  },
  {
    slug: "string-versus-microomvormers",
    title: "Het verschil tussen string- en microomvormers",
    category: "OMVORMERS",
    image: stringUnit,
    intro:
      "Eén centrale omvormer voor alle panelen, of een kleine omvormer per paneel of paar? Beide hebben hun plek; de juiste keuze hangt af van het dak en de wensen van de klant.",
    sections: [
      [
        "String-omvormers: centraal en efficiënt",
        "Eén omvormer verwerkt de stroom van meerdere panelen die in serie zijn geschakeld. Dit is een bewezen en kostenefficiënte oplossing voor daken zonder veel schaduw en met een uniforme oriëntatie, en de omvormer is eenvoudig te bereiken voor onderhoud.",
      ],
      [
        "Microomvormers: per paneel optimaliseren",
        "Elk paneel of paneelpaar krijgt een eigen omvormer, zodat schaduw of vervuiling op één paneel de rest niet afremt. Dat maakt ze geschikt voor complexe daken, uitbreidingen in stappen en gedetailleerde monitoring per paneel.",
      ],
      [
        "Zo maak je de keuze",
        "Bekijk dakvlakken, schaduw, uitbreidingsplannen en de gewenste monitoring. Houd ook rekening met een eventuele thuisbatterij: controleer de compatibiliteit voordat je het systeem vastlegt.",
      ],
    ],
  },
  {
    slug: "warmtepompen-lucht-lucht-hybride",
    title: "Warmtepompen: wat is lucht-lucht en wat is hybride?",
    category: "KLIMAAT",
    image: hybridUnit,
    intro:
      "Warmtepompen zijn er in meerdere vormen. Het verschil tussen een lucht-luchtwarmtepomp en een hybride systeem bepaalt waar ze zich het beste voor lenen.",
    sections: [
      [
        "Lucht-luchtwarmtepomp",
        "Een buitenunit onttrekt warmte aan de buitenlucht en geeft die via een binnenunit direct af aan de ruimte. Het systeem kan zowel verwarmen als koelen en is relatief snel te installeren, maar verwarmt meestal één ruimte of een beperkt aantal ruimtes.",
      ],
      [
        "Hybride warmtepomp",
        "Een hybride systeem combineert een warmtepomp met een bestaande cv-ketel. De warmtepomp neemt het grootste deel van de verwarming over en de ketel springt bij op koude dagen. Dat maakt het een vlotte stap voor woningen die nog niet volledig geschikt zijn voor een all-electric oplossing.",
      ],
      [
        "Combineren met zonne-energie",
        "Een warmtepomp draait het voordeligst op eigen opgewekte stroom. Bespreek met de klant het verbruiksprofiel en eventuele opslag, en laat het ontwerp beoordelen door een gekwalificeerde installateur.",
      ],
    ],
  },
  {
    slug: "montagesystemen-plat-schuin-dak",
    title: "Montagesystemen: plat dak versus schuin dak",
    category: "MONTAGE",
    image: rooftop,
    intro:
      "Het montagesysteem bepaalt de veiligheid, de montagetijd en de opbrengst van de installatie. Op een plat en een schuin dak gelden andere uitgangspunten.",
    sections: [
      [
        "Schuin dak: haken, rails en dakbedekking",
        "Bij een schuin dak worden panelen met dakhaken en rails op de draagconstructie bevestigd. Controleer de dakbedekking, de afstand tussen de gordingen of spanten en de waterdichtheid van elke doorvoer.",
      ],
      [
        "Plat dak: ballast, hoek en windbelasting",
        "Platte daken gebruiken vaak opstellingen in een lichte hoek, vastgehouden door ballast of een combinatie met bevestigingspunten. Draagvermogen van het dak en windbelasting zijn hier de bepalende factoren.",
      ],
      [
        "Documentatie en voorschriften",
        "Werk altijd volgens de actuele montagehandleiding van de fabrikant en de toepasselijke normen. ESTG denkt graag mee over de juiste combinatie van panelen en montagemateriaal.",
      ],
    ],
  },
  {
    slug: "eerste-thuisbatterij",
    title: "Je eerste thuisbatterij: waar let je op?",
    category: "ENERGIEOPSLAG",
    image: battery,
    intro:
      "Een thuisbatterij vergroot het eigen verbruik van zonne-energie, maar niet elk systeem past bij elke woning. Dit zijn de punten die je als installateur samen met de klant doorloopt.",
    sections: [
      [
        "Capaciteit en vermogen",
        "Capaciteit (kWh) bepaalt hoeveel energie kan worden opgeslagen, het vermogen (kW) hoeveel er tegelijk kan worden geleverd. Beide moeten passen bij het verbruikspatroon en de aansluiting.",
      ],
      [
        "Compatibiliteit met omvormer en energiemanagement",
        "Controleer of de batterij samenwerkt met de aanwezige of geplande omvormer en of er een geschikt energiemanagementsysteem beschikbaar is. Zo voorkom je verrassingen tijdens de installatie.",
      ],
      [
        "Plaatsing, veiligheid en toekomst",
        "Kijk naar de beschikbare ruimte, ventilatie, installatievoorschriften en uitbreidingsmogelijkheden. Houd rekening met de EU-batterijverordening en raadpleeg altijd de actuele documentatie van de fabrikant.",
      ],
    ],
  },
];
