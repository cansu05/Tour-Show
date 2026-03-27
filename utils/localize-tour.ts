import type {AppLocale} from '@/constants/locales';
import type {Tour, TourLocalizedContent} from '@/types/tour';
import {getTourPriceSummary} from '@/utils/tour-pricing';

function pickLocalizedContent(
  localized: Tour['localized'],
  locale: AppLocale
): TourLocalizedContent | undefined {
  if (!localized) return undefined;
  return localized[locale] || localized.en || localized.de || localized.tr;
}

export function localizeTour(tour: Tour, locale: AppLocale): Tour {
  const content = pickLocalizedContent(tour.localized, locale);
  const priceSummary = getTourPriceSummary(tour.pricing, tour.campaignPrice);

  return {
    ...tour,
    title: content?.title || tour.title,
    shortDescription: content?.shortDescription || tour.shortDescription,
    description: content?.description || tour.description,
    thingsToBring: content?.thingsToBring || tour.thingsToBring || [],
    importantNotes: content?.importantNotes || tour.importantNotes || [],
    priceText: tour.priceText || priceSummary.displayPriceText
  };
}

export function localizeTours(tours: Tour[], locale: AppLocale): Tour[] {
  return tours.map((tour) => localizeTour(tour, locale));
}
