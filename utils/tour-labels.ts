import type {AppLocale} from '@/constants/locales';

const CATEGORY_LABELS: Record<string, Record<AppLocale, string>> = {
  'city-tour': {de: 'Stadttour', en: 'City Tour', tr: 'Şehir Turu', ru: 'Gorodskoy tur', fr: 'Visite de la ville', sk: 'Mestsky vylet', cs: 'Prohlidka mesta'},
  aquarium: {de: 'Aquarium', en: 'Aquarium', tr: 'Akvaryum', ru: 'Akvarium', fr: 'Aquarium', sk: 'Akvarium', cs: 'Akvárium'},
  'daily-tour': {de: 'Tagestour', en: 'Daily Tour', tr: 'Günlük Tur', ru: 'Dnevnoy tur', fr: 'Excursion de jour', sk: 'Denný vylet', cs: 'Jednodenni vylet'},
  'evening-tour': {de: 'Abendtour', en: 'Evening Tour', tr: 'Akşam Turu', ru: 'Vecherniy tur', fr: 'Visite du soir', sk: 'Vecerny vylet', cs: 'Vecerni vylet'},
  adventure: {de: 'Abenteuer', en: 'Adventure', tr: 'Macera', ru: 'Priklyuchenie', fr: 'Aventure', sk: 'Dobrodruzstvo', cs: 'Dobrodruzstvi'},
  nature: {de: 'Natur', en: 'Nature', tr: 'Doğa', ru: 'Priroda', fr: 'Nature', sk: 'Priroda', cs: 'Priroda'},
  safari: {de: 'Safari', en: 'Safari', tr: 'Safari', ru: 'Safari', fr: 'Safari', sk: 'Safari', cs: 'Safari'},
  sandland: {de: 'Sandland', en: 'Sandland', tr: 'Sandland', ru: 'Sandland', fr: 'Sandland', sk: 'Sandland', cs: 'Sandland'}
};

const REGION_LABELS: Record<string, Record<AppLocale, string>> = {
  kemer: {de: 'Kemer', en: 'Kemer', tr: 'Kemer', ru: 'Kemer', fr: 'Kemer', sk: 'Kemer', cs: 'Kemer'},
  antalyaBelek: {de: 'Antalya / Belek', en: 'Antalya / Belek', tr: 'Antalya / Belek', ru: 'Antalya / Belek', fr: 'Antalya / Belek', sk: 'Antalya / Belek', cs: 'Antalya / Belek'},
  sideManavgat: {de: 'Side / Manavgat', en: 'Side / Manavgat', tr: 'Side / Manavgat', ru: 'Side / Manavgat', fr: 'Side / Manavgat', sk: 'Side / Manavgat', cs: 'Side / Manavgat'},
  alanya: {de: 'Alanya', en: 'Alanya', tr: 'Alanya', ru: 'Alanya', fr: 'Alanya', sk: 'Alanya', cs: 'Alanya'}
};

const DAY_LABELS: Record<string, Record<AppLocale, string>> = {
  monday: {de: 'Montag', en: 'Monday', tr: 'Pazartesi', ru: 'Ponedelnik', fr: 'Lundi', sk: 'Pondelok', cs: 'Pondeli'},
  tuesday: {de: 'Dienstag', en: 'Tuesday', tr: 'Salı', ru: 'Vtornik', fr: 'Mardi', sk: 'Utorok', cs: 'Utery'},
  wednesday: {de: 'Mittwoch', en: 'Wednesday', tr: 'Çarşamba', ru: 'Sreda', fr: 'Mercredi', sk: 'Streda', cs: 'Streda'},
  thursday: {de: 'Donnerstag', en: 'Thursday', tr: 'Perşembe', ru: 'Chetverg', fr: 'Jeudi', sk: 'Stvrtok', cs: 'Ctvrtek'},
  friday: {de: 'Freitag', en: 'Friday', tr: 'Cuma', ru: 'Pyatnitsa', fr: 'Vendredi', sk: 'Piatok', cs: 'Patek'},
  saturday: {de: 'Samstag', en: 'Saturday', tr: 'Cumartesi', ru: 'Subbota', fr: 'Samedi', sk: 'Sobota', cs: 'Sobota'},
  sunday: {de: 'Sonntag', en: 'Sunday', tr: 'Pazar', ru: 'Voskresenye', fr: 'Dimanche', sk: 'Nedela', cs: 'Nedele'}
};

function toTitleCase(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatCategoryLabel(category: string, locale: AppLocale) {
  return CATEGORY_LABELS[category]?.[locale] || toTitleCase(category.replace(/[-_]+/g, ' '));
}

export function formatRegionLabel(region: string, locale: AppLocale) {
  return REGION_LABELS[region]?.[locale] || region;
}

export function formatDayLabel(day: string, locale: AppLocale) {
  return DAY_LABELS[day]?.[locale] || day;
}
