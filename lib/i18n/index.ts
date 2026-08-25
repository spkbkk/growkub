import { en } from "./en";
import { th } from "./th";
import { Dictionary, Locale } from "./types";

export * from "./types";

const dictionaries: Record<Locale, Dictionary> = {
  th,
  en,
};

export function getDictionary(locale: string = "th"): Dictionary {
  const normalizedLocale: Locale = locale === "en" ? "en" : "th";
  return dictionaries[normalizedLocale] || dictionaries.th;
}

export const defaultLocale: Locale = "th";
export const locales: Locale[] = ["th", "en"];

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
