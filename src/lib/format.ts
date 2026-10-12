const nl = (options: Intl.NumberFormatOptions) => new Intl.NumberFormat("nl-NL", options);

export const formatInt = (n: number) => nl({ maximumFractionDigits: 0 }).format(n);
export const formatKwp = (kwp: number) => `${nl({ maximumFractionDigits: 2 }).format(kwp)} kWp`;
export const formatKg = (kg: number) => `${formatInt(Math.round(kg))} kg`;

export const formatEuro = (n: number) =>
  nl({ style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

/** Bedrag met centen, voor de prijsopbouw (btw en totaal) waar afronden op hele euro's afwijkt. */
export const formatEuroExact = (n: number) =>
  nl({
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
