export type CurrencyCode = "USD" | "EUR" | "GBP" | "LKR" | "AUD";

export const RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  LKR: 310,
  AUD: 1.52,
};
