/** Fictieve prijsopbouw voor winkelmand en bestelling (voorbeeldwaarden, geen echte ESTG-tarieven). */
export const SHIPPING_EX_VAT = 75;
export const VAT_RATE = 0.21;

export type OrderTotals = {
  subtotal: number;
  shipping: number;
  vat: number;
  total: number;
};

const cents = (n: number) => Math.round(n * 100) / 100;

/** Subtotaal + vast verzendbedrag; btw wordt berekend over beide. Een lege selectie kost niets. */
export function orderTotals(subtotal: number): OrderTotals {
  const shipping = subtotal > 0 ? SHIPPING_EX_VAT : 0;
  const base = subtotal + shipping;
  const vat = cents(base * VAT_RATE);
  return { subtotal, shipping, vat, total: cents(base + vat) };
}
