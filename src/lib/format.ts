const nl = (options: Intl.NumberFormatOptions) => new Intl.NumberFormat("nl-NL", options);

export const formatInt = (n: number) => nl({ maximumFractionDigits: 0 }).format(n);
export const formatKwp = (kwp: number) => `${nl({ maximumFractionDigits: 2 }).format(kwp)} kWp`;
export const formatKg = (kg: number) => `${formatInt(Math.round(kg))} kg`;
