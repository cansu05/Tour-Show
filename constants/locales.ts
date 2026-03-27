export const LOCALES = ["de", "en", "tr", "ru", "fr", "sk", "cs"] as const;
export const DEFAULT_LOCALE = "de";

export type AppLocale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<AppLocale, string> = {
  de: "Deutsch",
  en: "English",
  tr: "Türkçe",
  ru: "Russkiy",
  fr: "Francais",
  sk: "Slovencina",
  cs: "Cestina",
};
