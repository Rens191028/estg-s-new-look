// Bron: CO2emissiefactoren.nl, "Elektriciteit, grijs": de Nederlandse standaardlijst voor
// CO2-besparingsberekeningen (niet het CBS-cijfer voor "geproduceerde elektriciteit", dat
// een andere methodiek volgt en hier een te lage waarde geeft).
// Overgenomen uit het ESTG-implementatieplan (oktober 2026). NOG LIVE TE CONTROLEREN op
// https://www.co2emissiefactoren.nl/lijst-emissiefactoren/ vóór livegang, en jaarlijks te herhalen.
export const CO2_FACTOR = {
  year: 2026,
  kgCo2PerKwh: 0.556,
  source: "https://www.co2emissiefactoren.nl/lijst-emissiefactoren/",
} as const;

// Vuistregel voor de Nederlandse jaaropbrengst; later te vervangen door een adresgebaseerde waarde.
export const DEFAULT_YIELD_KWH_PER_KWP_PER_YEAR = 900;

export function estimateCo2Savings(
  totalKwp: number,
  { yieldKwhPerKwp = DEFAULT_YIELD_KWH_PER_KWP_PER_YEAR }: { yieldKwhPerKwp?: number } = {},
) {
  const kwhPerYear = totalKwp * yieldKwhPerKwp;
  const kgCo2PerYear = kwhPerYear * CO2_FACTOR.kgCo2PerKwh;
  return { kwhPerYear, kgCo2PerYear, factorYear: CO2_FACTOR.year, source: CO2_FACTOR.source };
}
