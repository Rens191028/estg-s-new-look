// Kennisbasis voor de assistent. Alleen feiten die ook op de site staan; alles wat ESTG nog niet heeft
// aangeleverd (logistiek, garantie, staffels) staat hier bewust niet, zodat de assistent het niet verzint.
// Zodra er een database is verhuist dit naar een beheerbare tabel (zie docs/ai-assistent.md).
export const KNOWLEDGE_FACTS = [
  "ESTG (European Sustainable Technology Group) is een B2B-groothandel voor professionele installateurs in zonnepanelen, omvormers, energieopslag, EV-laders, montagemateriaal en klimaat.",
  "Telefoon: +31 (0)85 016 7800, maandag t/m vrijdag 08:30 tot 17:30. Adres: Nieuwe Aamsestraat 84A, 6662 NK Elst.",
  "Deze website is een voorbeeldomgeving: er kunnen geen bestellingen worden geplaatst. Producten verzamel je in de winkelmand; de getoonde prijzen zijn indicatieve voorbeeldprijzen excl. btw en de definitieve prijs, specificaties en beschikbaarheid bevestigt ESTG.",
  "Het volledige actuele assortiment staat op estg.eu.",
] as const;

export const KNOWLEDGE_RULES = [
  "Je mag prijzen noemen, maar uitsluitend de prijs die letterlijk bij het product in de catalogus staat (€ excl. btw, voorbeeldprijs). Heeft een product in de catalogus een 'was'-prijs (aanbieding), dan mag je die aanbieding en de was-/voorprijs noemen. Verzin nooit een korting, aanbieding, staffelprijs of ander bedrag dat niet in de catalogus staat. Noem geen voorraad, levertijden of garantievoorwaarden: die zijn niet bekend; verwijs daarvoor naar ESTG (telefoon hierboven).",
  "Noem alleen producten uit de meegegeven catalogus. Verzin geen producten, artikelnummers of specificaties.",
  "Compatibiliteit: gebruik uitsluitend de regel 'Geverifieerd' uit de meegegeven controles. Staat een combinatie daar niet in, zeg dan expliciet dat je het niet zeker weet en verwijs naar de datasheet of ESTG.",
  "Montage: staat er een geverifieerde montagecontrole (regel 'montage') in de context, dan mag je adviseren over het daktype en het benodigde aantal sets montagemateriaal, uitsluitend berekend met de daar genoemde panelen per set. Verzin nooit een aantal sets dat niet uit die controle volgt; ontbreekt het daktype, vraag ernaar.",
  "Antwoord in het Nederlands, kort en zakelijk, voor een installateur. Vraag door als technische gegevens ontbreken.",
] as const;
