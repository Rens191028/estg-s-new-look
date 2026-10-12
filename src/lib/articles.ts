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
  /** Tekst per sectie: alinea's gescheiden door een lege regel; regels die met "- " beginnen vormen een opsomming. */
  sections: [string, string][];
};
export const articles: Article[] = [
  {
    slug: "energieopslag",
    title: "Energieopslag: de volgende stap in jouw project",
    category: "ENERGIEOPSLAG",
    image: battery,
    intro: "Opgewekte energie benutten wanneer je die nodig hebt. Wat neem je mee bij de keuze voor een batterijsysteem?",
    sections: [
      ["Begin bij het energieprofiel", "Een batterijsysteem is pas rendabel als het past bij het moment waarop energie wordt opgewekt en verbruikt. Breng daarom eerst het verbruik in kaart, bij voorkeur op basis van kwartier- of uurwaarden uit de slimme meter in plaats van alleen het jaarverbruik.\n\nLet op drie dingen:\n\n- Het dagpatroon: verbruik in de ochtend en avond levert meer op voor opslag dan verbruik rond het middaguur.\n- Het seizoenspatroon: in de zomer is er overschot, in de winter vaak een tekort. Een batterij verschuift energie binnen een dag, niet tussen seizoenen.\n- Pieken: grote verbruikers zoals een warmtepomp, laadpaal of airco bepalen het benodigde vermogen (kW), niet alleen de capaciteit (kWh)."],
      ["Denk in complete systemen", "Een batterij werkt nooit los. De omvormer, het energiemanagementsysteem, de meter en eventuele laadpalen of warmtepompen moeten samenwerken. Controleer daarom vooraf of de batterij compatibel is met de aanwezige of geplande omvormer, en of de communicatie (bijvoorbeeld via CAN-bus of Modbus) door beide partijen wordt ondersteund.\n\nEen koppeling op gelijkstroom (DC) is vaak efficiënter bij nieuwbouw, omdat er minder omzettingen zijn. Een koppeling op wisselstroom (AC) is juist handig om een batterij achteraf toe te voegen aan een bestaande installatie."],
      ["Kies voor uitbreidbaarheid", "Verbruik verandert: een elektrische auto, warmtepomp of uitbreiding van het pand verhoogt de vraag. Een modulair systeem waarbij je later extra batterijmodules toevoegt, voorkomt dat je een te grote batterij koopt voor een situatie die nog niet bestaat.\n\nVraag bij de fabrikant na hoeveel modules maximaal parallel kunnen en of nieuwe modules mogen worden gemengd met oudere."],
      ["Plan de installatie zorgvuldig", "Houd rekening met de beschikbare ruimte, ventilatie, omgevingstemperatuur en bereikbaarheid voor onderhoud. Een batterij die in een te warme of vochtige ruimte staat, verliest sneller capaciteit.\n\nWerk altijd volgens de actuele installatievoorschriften van de fabrikant en de geldende normen en veiligheidseisen. Laat de aansluiting beoordelen door een gekwalificeerd installateur en controleer of de netbeheerder tijdig is geïnformeerd."],
      ["Waar ESTG je bij helpt", "ESTG denkt mee over de juiste combinatie van batterij, omvormer en energiemanagement. Gebruik de AI-adviseur voor een eerste set, of neem contact op voor een compleet voorstel op maat."],
    ],
  },
  {
    slug: "zonne-energie",
    title: "Een sterke basis voor jouw zonne-energieproject",
    category: "ZONNE-ENERGIE",
    image: rooftop,
    intro: "Een goede installatie begint met de juiste combinatie van zonnepanelen, omvormers en montagemateriaal.",
    sections: [
      ["Bekijk het complete dak", "Een goed ontwerp begint met het dak zelf. Oriëntatie, hellingshoek, schaduw van schoorstenen, bomen of nabijgelegen gebouwen en de beschikbare ruimte bepalen hoeveel opbrengst mogelijk is. Meet het dak op, noteer obstakels en controleer de draagkracht van de constructie.\n\nVergeet de dakbedekking niet: een oud dak dat binnen enkele jaren vervangen moet worden, is een ongunstig moment voor een nieuwe installatie."],
      ["Kies componenten die samenwerken", "Panelen, omvormer en montagemateriaal moeten elektrisch en mechanisch bij elkaar passen. Let op:\n\n- De spanningsgrenzen van de omvormer in relatie tot de seriële paneelstring, ook bij lage temperaturen waarbij de spanning hoger is.\n- De maximale ingangsstroom per MPP-tracker ten opzichte van de paneelstroom.\n- De verhouding tussen paneelvermogen en omvormervermogen (DC/AC-ratio), die meestal licht boven 1 ligt.\n- De toelaatbare belasting van het montagesysteem bij sneeuw en wind.\n\nControleer deze grenzen steeds aan de hand van de actuele fabrikantdocumentatie."],
      ["Maak de installatie toekomstbestendig", "Toekomstige energieopslag, een elektrische auto of een warmtepomp kan invloed hebben op het ontwerp. Kies een omvormer die later een batterij kan aansturen, laat ruimte in de meterkast en plan kabeltracés zo dat uitbreiding geen breekwerk betekent."],
      ["Van ontwerp tot oplevering", "Een heldere opleverlijst voorkomt discussie: leg vermogen, componenten, serienummers en foto's van de installatie vast, en neem de monitoring samen met de klant door. Zo weet de eindgebruiker meteen hoe hij de opbrengst kan volgen en wat hij moet doen bij een storing."],
      ["Praktijkvoorbeeld", "Een bedrijfspand met een plat dak en een jaarverbruik van enkele tientallen duizenden kWh kiest voor een oost-westopstelling met een string-omvormer met twee MPP-trackers. Door het ontwerp af te stemmen op het verbruik overdag wordt een groot deel van de opbrengst direct gebruikt. Bij de oplevering zijn monitoring en een uitbreidingsoptie voor opslag al voorbereid.\n\nDe les: begin bij het verbruik en het dak, en kies daarna pas de componenten."],
    ],
  },
  {
    slug: "slim-laden",
    title: "Slim laden begint bij de juiste oplossing",
    category: "EV-LADEN",
    image: charger,
    intro: "Van een laadpunt thuis tot laadoplossingen op het werk. Zo kijk je verder dan alleen de laadpaal.",
    sections: [
      ["De locatie bepaalt de keuze", "Een laadpunt thuis stelt andere eisen dan een laadplein voor meerdere voertuigen. Kijk naar de aansluiting (1-fase of 3-fase), het beschikbare vermogen, de gebruikers en de manier van afrekenen.\n\nVoor zakelijke locaties spelen daarnaast vragen als: moeten bezoekers kunnen laden, wordt er doorbelast aan werknemers, en welke vorm van identificatie (pas, app of plug-and-charge) is gewenst?"],
      ["Verdeel het vermogen slim", "Load balancing voorkomt dat de hoofdzekering overbelast raakt wanneer meerdere laadpunten of grote verbruikers tegelijk aanstaan. Er zijn grofweg drie niveaus:\n\n- Statisch: een vast maximaal vermogen per laadpunt of groep.\n- Dynamisch: het vermogen volgt het actuele totaalverbruik van het gebouw, gemeten via een externe meter.\n- Slim met energiemanagement: laden wordt afgestemd op zonne-opwek, tarieven of netcongestie.\n\nLaat de aansluiting en het ontwerp beoordelen door een gekwalificeerde installateur."],
      ["Verbind laden met zonne-energie", "Laden op eigen opgewekte stroom verhoogt het eigen verbruik en verlaagt de energiekosten. Onderzoek of de laadpaal rechtstreeks met de omvormer of het energiemanagementsysteem kan communiceren. Compatibiliteit en configuratie verschillen per product en fabrikant."],
      ["Veelgemaakte fouten", "- Alleen naar de prijs van de laadpaal kijken en niet naar de installatiekosten (kabelweg, groepenkast, zwaardere aansluiting).\n- Geen rekening houden met uitbreiding: begin je met twee punten, plan dan de infrastructuur voor meer.\n- Het wifi- of mobiele bereik op de laadlocatie niet controleren, terwijl het laadpunt hiervan afhankelijk is voor afrekenen en monitoring."],
      ["Praktijkvoorbeeld", "Een kantoor met twaalf parkeerplaatsen en een aansluiting die al grotendeels wordt gebruikt, plaatst zes laadpunten met dynamische load balancing. De laadpunten delen het resterende vermogen en schuiven mee met het gebouwverbruik. Zo is geen zwaardere aansluiting nodig en kunnen later extra laadpunten aan hetzelfde systeem worden gekoppeld.\n\nControleer vooraf bij de netbeheerder wat de beschikbare ruimte op de aansluiting is."],
    ],
  },
  {
    slug: "batterij-dimensioneren",
    title: "Thuisbatterij dimensioneren op basis van energieverbruik",
    category: "ENERGIEOPSLAG",
    image: battery,
    intro: "Een te kleine batterij laat zonne-energie onbenut; een te grote verhoogt de kosten zonder evenredig meer rendement. Zo bepaal je de juiste capaciteit.",
    sections: [
      ["Welke informatie heb je nodig?", "Voor een goede dimensionering heb je gegevens nodig over zowel het verbruik als de opwek:\n\n- Het dagelijkse en jaarlijkse stroomverbruik, bij voorkeur als kwartierwaarden uit de slimme meter.\n- De grootte en oriëntatie van het zonnepaneelsysteem.\n- De momenten waarop stroom wordt gebruikt, bijvoorbeeld thuiswerken, koken, wassen.\n- Toekomstig verbruik zoals een elektrische auto, warmtepomp of airco."],
      ["Een praktisch stappenplan", "1. Bepaal het gemiddelde dagverbruik buiten de uren van zonopwek (avond, nacht, vroege ochtend). Dat is het deel dat een batterij kan afdekken.\n2. Bepaal het gemiddelde overschot overdag in de maanden waarin de batterij het meest wordt gebruikt.\n3. Neem de kleinste van deze twee waarden als startpunt voor de bruikbare capaciteit.\n4. Controleer of het vermogen (kW) van batterij en omvormer genoeg is voor de pieken in het verbruik.\n5. Houd rekening met de bruikbare capaciteit: dat is vrijwel nooit gelijk aan de nominale capaciteit."],
      ["Veelgemaakte fouten", "Een te kleine batterij laat zonne-energie onbenut; een te grote verhoogt de kosten zonder evenredig meer rendement, omdat de batterij in de winter nauwelijks wordt volgeladen.\n\nVaak voorkomende fouten zijn: alleen naar het jaarverbruik kijken, het dagelijkse gebruikspatroon negeren, het zonnepaneelsysteem buiten beschouwing laten en toekomstige elektrificatie over het hoofd zien."],
      ["De juiste batterij kiezen met ESTG", "ESTG werkt met merken als Growatt, Sigenergy, Enphase, SolarEdge, Huawei en APsystems. Selectiecriteria: capaciteit, vermogen, compatibiliteit met de omvormer, uitbreidingsmogelijkheden en technische ondersteuning."],
      ["Rekenvoorbeeld", "Een huishouden verbruikt na zonsondergang gemiddeld 9 kWh per dag en heeft in de zomer een overschot van circa 12 kWh. De kleinste van beide waarden (9 kWh) is het startpunt. Rekening houdend met een bruikbare capaciteit van ongeveer negentig procent van de nominale waarde is een batterij van circa 10 kWh een logisch uitgangspunt.\n\nDit is een illustratieve berekening; gebruik altijd de werkelijke meetgegevens van de klant."],
    ],
  },
  {
    slug: "airco-zonnepanelen-batterijen",
    title: "Slim koelen: airco, zonnepanelen en batterijen",
    category: "KLIMAAT",
    image: acOutdoor,
    intro: "Een airco combineren met zonnepanelen en een batterij is een duurzame, kostenefficiënte manier om te koelen en een kans voor installateurs om dit als compleet systeem aan te bieden.",
    sections: [
      ["Hoe solar en airco samenwerken", "De piekproductie van zonnepanelen valt vaak samen met de middaguren, wanneer een airco het hardst werkt. Zo draait de koeling grotendeels op eigen zonne-energie en daalt de belasting van het net.\n\nModerne inverter-airco's moduleren hun vermogen. Daardoor sluiten ze goed aan op de wisselende opbrengst van zonnepanelen, zeker in combinatie met een slimme aansturing."],
      ["De rol van de batterij", "Batterijen slaan overtollige zonne-energie op voor de avond en bewolkte dagen en vangen de stroompieken van de airco op. Met een energiemanagementsysteem wordt dit automatisch geoptimaliseerd, en bij stroomuitval blijft de airco werken wanneer het systeem noodstroom ondersteunt."],
      ["Tips voor installateurs", "- Communiceer naast de financiële besparing ook het comfort, de duurzaamheid en de energieonafhankelijkheid.\n- Controleer de aansluiting en de groepenverdeling: een airco is een flinke continue belasting.\n- Stem de dimensionering van panelen en batterij af op het koelvermogen, zeker bij meerdere units.\n- Bied een onderhoudscontract en monitoring aan; dat verlengt de levensduur en helpt storingen snel op te sporen."],
      ["Een kans voor een compleet systeem", "Klanten die al zonnepanelen hebben, vragen steeds vaker om koeling. Door airco, zonnepanelen en opslag als één geheel te presenteren, onderscheid je je van installateurs die losse producten leveren."],
      ["Praktijkvoorbeeld", "Een woning met zonnepanelen en een batterij voegt een multi-split-airco toe. Door de aansturing van de airco te koppelen aan het energiemanagementsysteem wordt voorgekoeld op momenten dat er zonne-overschot is. Op warme avonden levert de batterij de rest, zodat de woning nauwelijks stroom van het net nodig heeft.\n\nDit soort integratie maakt het aanbod voor de klant duidelijk waardevoller."],
    ],
  },
  {
    slug: "eu-batterijverordening",
    title: "Wat de EU-batterijverordening betekent voor jouw werk",
    category: "REGELGEVING",
    image: inverterPhoto,
    intro: "De EU-batterijverordening (2023/1542) gaat verder dan een nieuw label: elk opslagsysteem boven 2 kWh krijgt een digitaal paspoort. Dit verandert het werk van een installateur.",
    sections: [
      ["Wat is het batterijpaspoort?", "Een digitale identiteitskaart via een QR-code op de batterijbehuizing. Installateurs krijgen hiermee toegang tot de status, onderhouds- en veiligheidsgeschiedenis en reparatie-instructies van de batterij. Het paspoort geldt voor industriële batterijen en voor elektrisch-voertuigbatterijen boven een bepaalde capaciteit, waaronder grotere opslagsystemen."],
      ["De tijdlijn om in de gaten te houden", "- Februari 2026: fabrikanten moeten de CO₂-voetafdruk opgeven.\n- Augustus 2026: nieuwe labels met levensduur, capaciteit en chemische samenstelling worden verplicht.\n- Februari 2027: het volledige digitale paspoort via QR-code wordt verplicht voor nieuwe systemen.\n\nControleer de actuele data en reikwijdte bij de fabrikant en in de officiële regelgeving; de overgangsregels kunnen per productcategorie verschillen."],
      ["Wat dit betekent voor de installateur", "- Je moet kunnen aantonen dat het geleverde systeem aan de eisen voldoet.\n- Je kunt klanten beter informeren over levensduur en prestaties.\n- Bij vervanging of reparatie heb je sneller de juiste informatie beschikbaar."],
      ["Wat dit oplevert", "Recht op reparatie: losse modules vervangen in plaats van een heel systeem afschrijven. Een transparante status van de batterij verhoogt bovendien de restwaarde bij doorverkoop of tweede leven, en maakt het eenvoudiger om verantwoord te recyclen."],
      ["Zo bereid je je voor", "- Vraag bij je leveranciers naar hun plannen voor het batterijpaspoort en de labels.\n- Neem het paspoort op in je opleverdocumentatie zodra het beschikbaar is.\n- Informeer klanten over de herkomst en het onderhoud van hun batterij.\n- Houd de officiële publicaties en de updates van ESTG in de gaten voor wijzigingen in de regelgeving."],
    ],
  },
  {
    slug: "zonnepanelen-orientatie",
    title: "Zonnepanelen en oriëntatie: wat levert het meeste op?",
    category: "ZONNE-ENERGIE",
    image: panelPhoto,
    intro: "Zuid is de klassieker, maar niet altijd de beste keuze. Oost-west en platte daken verdienen een eerlijke vergelijking, zeker met een veranderend verbruikspatroon.",
    sections: [
      ["Zuid, oost-west of iets ertussenin", "Een zuidopstelling levert per paneel de hoogste jaaropbrengst, maar concentreert die rond het middaguur. Een oost-westopstelling verspreidt de opbrengst over de dag: ochtend op de oostkant, middag en avond op de westkant. Dat past vaak beter bij een verbruik in de ochtend en avond en maakt het net minder piekerig.\n\nOp een plat dak kunnen met oost-west bovendien meer panelen per vierkante meter worden geplaatst, omdat er minder onderlinge schaduw is bij een lage opstelhoek."],
      ["Kijk verder dan de opbrengst per paneel", "Eigen verbruik, netcongestie en terugleververgoedingen bepalen steeds vaker wat een systeem werkelijk oplevert. Met het aflopen van de salderingsregeling wordt een hoog eigen verbruik belangrijker dan een maximale jaaropbrengst.\n\nVergelijk opstellingen daarom op basis van het verwachte verbruiksprofiel van de klant:\n\n- Wie overdag thuis is, profiteert van zuid.\n- Wie vooral ’s ochtends en ’s avonds verbruikt, kan beter oost-west overwegen.\n- Wie een batterij plaatst, kan overschot opvangen en is minder gevoelig voor het tijdstip van opwek."],
      ["Schaduw, helling en omvormerkeuze", "Gedeeltelijke schaduw en verschillende dakvlakken vragen om een omvormer met meerdere MPP-trackers of om optimizers en microomvormers, zodat elk dakvlak of paneel zijn eigen werkpunt krijgt. Bij een steile helling wordt de opbrengst in de winter relatief hoger; bij een vlakke helling in de zomer.\n\nLaat het ontwerp altijd toetsen aan de actuele fabrikantdocumentatie."],
      ["Een korte checklist voor de adviseur", "1. Meet oriëntatie en helling van alle bruikbare dakvlakken.\n2. Inventariseer schaduwbronnen op verschillende momenten van de dag en het jaar.\n3. Vraag naar het dagpatroon van het verbruik en toekomstige plannen.\n4. Vergelijk minimaal twee opstellingen op opbrengst én eigen verbruik.\n5. Leg de keuze en de verwachtingen schriftelijk vast."],
    ],
  },
  {
    slug: "string-versus-microomvormers",
    title: "Het verschil tussen string- en microomvormers",
    category: "OMVORMERS",
    image: stringUnit,
    intro: "Eén centrale omvormer voor alle panelen, of een kleine omvormer per paneel of paar? Beide hebben hun plek; de juiste keuze hangt af van het dak en de wensen van de klant.",
    sections: [
      ["String-omvormers: centraal en efficiënt", "Eén omvormer verwerkt de stroom van meerdere panelen die in serie zijn geschakeld. Dit is een bewezen en kostenefficiënte oplossing voor daken zonder veel schaduw en met een uniforme oriëntatie. De omvormer hangt op één plek, is eenvoudig te bereiken voor onderhoud en heeft een lage prijs per kW.\n\nDe keerzijde: de zwakste schakel in een string bepaalt de prestaties. Schaduw of vervuiling op één paneel kan de opbrengst van de hele string verlagen, tenzij er optimizers worden toegepast."],
      ["Microomvormers: per paneel optimaliseren", "Elk paneel of paneelpaar krijgt een eigen omvormer, zodat schaduw of vervuiling op één paneel de rest niet afremt. Dat maakt ze geschikt voor complexe daken met meerdere oriëntaties, voor uitbreidingen in stappen en voor gedetailleerde monitoring per paneel.\n\nOmdat de omvorming op het dak plaatsvindt, loopt er wisselstroom (AC) in plaats van hoogspanning gelijkstroom (DC) door de kabels, wat voor sommige klanten een veiligheidsvoordeel is. Daar staat tegenover dat elektronica op het dak lastiger bereikbaar is bij een storing."],
      ["Vergelijking in het kort", "- Kosten: string meestal voordeliger per kW, micro duurder maar flexibeler.\n- Schaduw en complexe daken: micro of string met optimizers.\n- Monitoring: micro geeft standaard data per paneel.\n- Onderhoud: string centraal, micro verspreid over het dak.\n- Uitbreiding: micro is eenvoudig stapsgewijs uit te breiden."],
      ["Zo maak je de keuze", "Bekijk dakvlakken, schaduw, uitbreidingsplannen en de gewenste monitoring. Houd ook rekening met een eventuele thuisbatterij: controleer de compatibiliteit en of een hybride omvormer of een AC-gekoppelde batterij de beste route is voordat je het systeem vastlegt."],
    ],
  },
  {
    slug: "warmtepompen-lucht-lucht-hybride",
    title: "Warmtepompen: wat is lucht-lucht en wat is hybride?",
    category: "KLIMAAT",
    image: hybridUnit,
    intro: "Warmtepompen zijn er in meerdere vormen. Het verschil tussen een lucht-luchtwarmtepomp en een hybride systeem bepaalt waar ze zich het beste voor lenen.",
    sections: [
      ["Lucht-luchtwarmtepomp", "Een buitenunit onttrekt warmte aan de buitenlucht en geeft die via een binnenunit direct af aan de ruimte. Het systeem kan zowel verwarmen als koelen en is relatief snel en voordelig te installeren. Het verwarmt meestal één ruimte of een beperkt aantal ruimtes, bijvoorbeeld een woonkamer of kantoor, en is daarom vaak een aanvulling op bestaande verwarming."],
      ["Hybride warmtepomp", "Een hybride systeem combineert een warmtepomp met een bestaande cv-ketel. De warmtepomp neemt het grootste deel van de verwarming over en de ketel springt bij op koude dagen. Dat maakt het een vlotte stap voor woningen die nog niet volledig geschikt zijn voor een all-electric oplossing, bijvoorbeeld door radiatoren met een hoge aanvoertemperatuur."],
      ["Waar let je op bij het advies?", "- De isolatiegraad van het pand en de warmtevraag.\n- De aanvoertemperatuur van het afgiftesysteem (radiatoren of vloerverwarming).\n- Geluid en plaatsing van de buitenunit, ook ten opzichte van buren.\n- De elektrische aansluiting en de capaciteit van de groepenkast.\n- Subsidie- en regelgeving, die regelmatig wijzigt."],
      ["Combineren met zonne-energie", "Een warmtepomp draait het voordeligst op eigen opgewekte stroom. Bespreek met de klant het verbruiksprofiel en eventuele opslag, en laat het ontwerp beoordelen door een gekwalificeerde installateur. Een slimme regeling die het warmtepompverbruik verschuift naar de uren met zonne-opwek, verhoogt het eigen verbruik verder."],
      ["Hoe presenteer je dit aan de klant?", "Leg uit wat de klant mag verwachten qua comfort, energieverbruik en onderhoud. Vergelijk de opties aan de hand van concrete scenario's, zoals een goed geïsoleerde nieuwbouwwoning versus een oudere woning met radiatoren. Maak duidelijk dat de werkelijke besparing afhangt van gedrag, isolatie en energieprijzen."],
    ],
  },
  {
    slug: "montagesystemen-plat-schuin-dak",
    title: "Montagesystemen: plat dak versus schuin dak",
    category: "MONTAGE",
    image: rooftop,
    intro: "Het montagesysteem bepaalt de veiligheid, de montagetijd en de opbrengst van de installatie. Op een plat en een schuin dak gelden andere uitgangspunten.",
    sections: [
      ["Schuin dak: haken, rails en dakbedekking", "Bij een schuin dak worden panelen met dakhaken en rails op de draagconstructie bevestigd. Controleer de dakbedekking (pannen, golfplaten, bitumen), de afstand tussen de gordingen of spanten en de waterdichtheid van elke doorvoer. De haken moeten in het hout of de constructie worden geborgd, niet alleen in de dakbedekking.\n\nLet op de benodigde rand- en hoekzones: aan de randen van het dak is de windbelasting hoger, waardoor extra bevestigingspunten nodig kunnen zijn."],
      ["Plat dak: ballast, hoek en windbelasting", "Platte daken gebruiken vaak opstellingen in een lichte hoek, vastgehouden door ballast of een combinatie met bevestigingspunten. Draagvermogen van het dak en windbelasting zijn hier de bepalende factoren. Een berekening op locatie, met de gebouwhoogte en de windzone, voorkomt zowel overbelasting als te zware constructies.\n\nOpstellingen oost-west plaatsen meer panelen per dakoppervlak, maar vragen om extra aandacht voor onderlinge afstand en onderhoudspaden."],
      ["Checklist voor de voorbereiding", "- Draagvermogen en staat van het dak gecontroleerd.\n- Dakbedekking en garantievoorwaarden meegenomen.\n- Windzone, gebouwhoogte en sneeuwbelasting bepaald.\n- Obstakels, dakranden en onderhoudspaden in het ontwerp.\n- Kabeltracé en aarding van het montagesysteem geregeld."],
      ["Documentatie en voorschriften", "Werk altijd volgens de actuele montagehandleiding van de fabrikant en de toepasselijke normen. ESTG denkt graag mee over de juiste combinatie van panelen en montagemateriaal, en kan aangeven welke documentatie je nodig hebt voor een veilige en goedgekeurde installatie."],
      ["Veelgemaakte fouten", "- De dakconstructie niet laten beoordelen voordat ballast wordt aangebracht.\n- Randzones en hoekzones met extra windbelasting niet apart ontwerpen.\n- Doorvoeren niet goed afdichten, waardoor lekkages ontstaan.\n- Vergeten dat panelen schoongemaakt en gecontroleerd moeten kunnen worden."],
    ],
  },
  {
    slug: "eerste-thuisbatterij",
    title: "Je eerste thuisbatterij: waar let je op?",
    category: "ENERGIEOPSLAG",
    image: battery,
    intro: "Een thuisbatterij vergroot het eigen verbruik van zonne-energie, maar niet elk systeem past bij elke woning. Dit zijn de punten die je als installateur samen met de klant doorloopt.",
    sections: [
      ["Capaciteit en vermogen", "Capaciteit (kWh) bepaalt hoeveel energie kan worden opgeslagen, het vermogen (kW) hoeveel er tegelijk kan worden geleverd. Beide moeten passen bij het verbruikspatroon en de aansluiting. Een batterij met veel capaciteit maar weinig vermogen kan een piekverbruik, zoals koken of een laadpaal, niet volledig afdekken."],
      ["Compatibiliteit met omvormer en energiemanagement", "Controleer of de batterij samenwerkt met de aanwezige of geplande omvormer en of er een geschikt energiemanagementsysteem beschikbaar is. Zo voorkom je verrassingen tijdens de installatie. Vraag ook of de batterij noodstroom of eilandbedrijf ondersteunt als de klant dat wil."],
      ["Plaatsing, veiligheid en toekomst", "Kijk naar de beschikbare ruimte, ventilatie, installatievoorschriften en uitbreidingsmogelijkheden. Houd rekening met de EU-batterijverordening en raadpleeg altijd de actuele documentatie van de fabrikant."],
      ["Vragen om met de klant door te lopen", "- Wat wil de klant bereiken: besparen, onafhankelijker worden, noodstroom?\n- Wanneer wordt de meeste stroom verbruikt?\n- Zijn er plannen voor een elektrische auto of warmtepomp?\n- Hoe wordt de installatie gemonitord en wie doet het onderhoud?\n- Welke garantie en welke verwachte levensduur geldt voor de batterij?"],
      ["Wat kost de installatie in tijd?", "Reken op een voorbereiding waarin het verbruik wordt geanalyseerd, gevolgd door één tot twee dagen installatie, afhankelijk van de complexiteit van de meterkast en het aantal modules. Plan bij een bestaand systeem ruimte in voor het updaten van firmware en het instellen van de gewenste laadstrategie.\n\nLeg bij de oplevering vast hoe de klant de batterijstatus kan bekijken en wat hij bij een storing moet doen."],
    ],
  },
];
