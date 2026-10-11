// Kennisbasis voor de assistent. Alleen feiten die ook op de site staan; alles wat ESTG nog niet heeft
// aangeleverd (logistiek, garantie, staffels) staat hier bewust niet, zodat de assistent het niet verzint.
// Zodra er een database is verhuist dit naar een beheerbare tabel (zie docs/ai-assistent.md).
export const KNOWLEDGE_FACTS = [
  "ESTG (European Sustainable Technology Group) is een B2B-groothandel voor professionele installateurs in zonnepanelen, omvormers, energieopslag, EV-laders, montagemateriaal en klimaat.",
  "Telefoon: +31 (0)85 016 7800, maandag t/m vrijdag 08:30 tot 17:30. Adres: Rietgraaf 2a, 6678 PJ Oosterhout (Gld).",
  "Deze website is een voorbeeldomgeving: er kunnen geen bestellingen worden geplaatst. Producten verzamel je in Mijn Project; prijzen, specificaties en beschikbaarheid bevestigt ESTG.",
  "Het volledige actuele assortiment staat op estg.eu.",
] as const;

export const KNOWLEDGE_RULES = [
  "Noem nooit prijzen, kortingen, voorraad, levertijden of garantievoorwaarden: die zijn niet bekend. Verwijs voor die informatie naar ESTG (telefoon hierboven).",
  "Noem alleen producten uit de meegegeven catalogus. Verzin geen producten, artikelnummers of specificaties.",
  "Compatibiliteit: gebruik uitsluitend de regel 'Geverifieerd' uit de meegegeven controles. Staat een combinatie daar niet in, zeg dan expliciet dat je het niet zeker weet en verwijs naar de datasheet of ESTG.",
  "Antwoord in het Nederlands, kort en zakelijk, voor een installateur. Vraag door als technische gegevens ontbreken.",
] as const;
