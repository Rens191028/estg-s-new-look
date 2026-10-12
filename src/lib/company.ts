// Contactgegevens van ESTG, op één plek zodat contactpagina, footer en assistent gelijk blijven.
export const COMPANY = {
  phone: "+31 (0)85 016 7800",
  phoneHref: "tel:+31850167800",
  hours: "maandag t/m vrijdag, 08:30 – 17:30",
  street: "Nieuwe Aamsestraat 84A",
  city: "6662 NK Elst",
} as const;

export const COMPANY_ADDRESS = `${COMPANY.street}, ${COMPANY.city}`;

/** Publieke Google Maps-embed op basis van het adres; geen API-sleutel nodig. */
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(COMPANY_ADDRESS)}&output=embed`;
export const MAP_LINK_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_ADDRESS)}`;
