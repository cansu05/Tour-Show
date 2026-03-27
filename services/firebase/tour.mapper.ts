import type {Tour, TourDocument, TourLocalizedContent} from '@/types/tour';
import {getTourPriceSummary} from '@/utils/tour-pricing';

const PLACEHOLDER_IMAGE = '/images/aquarium/aquarium-cover.webp';

function toIsoString(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object' && value !== null && '_seconds' in value) {
    const seconds = Number((value as {_seconds: number})._seconds);
    if (!Number.isNaN(seconds)) return new Date(seconds * 1000).toISOString();
  }
  return new Date().toISOString();
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
}

function inferImages(slug: string) {
  if (slug === 'aquarium-antalya' || slug === 'aquarium-antalya-evening') {
    return {
      coverImage: '/images/aquarium/aquarium-cover.webp',
      gallery: [
        '/images/aquarium/aquarium-1.webp',
        '/images/aquarium/aquarium-2.webp',
        '/images/aquarium/aquarium-3.webp',
        '/images/aquarium/aquarium-4.webp',
        '/images/aquarium/aquarium-5.webp',
        '/images/aquarium/aquarium-6.webp',
        '/images/aquarium/aquarium-7.webp',
        '/images/aquarium/aquarium-8.webp',
        '/images/kuyumcu.webp'
      ]
    };
  }

  return {
    coverImage: PLACEHOLDER_IMAGE,
    gallery: []
  };
}

function pickBaseContent(localized: Tour['localized']): TourLocalizedContent | undefined {
  if (!localized) return undefined;
  return localized.de || localized.en || localized.tr;
}

export function mapTourDocument(raw: TourDocument, idFallback: string): Tour | null {
  if (!raw.slug) return null;

  const fallbackContent = pickBaseContent(raw.localized);
  const inferredImages = inferImages(raw.slug);
  const title = fallbackContent?.title || raw.title || raw.slug;
  const shortDescription = fallbackContent?.shortDescription || raw.shortDescription || '';
  const priceSummary = getTourPriceSummary(raw.pricing, raw.campaignPrice);

  return {
    id: raw.id ?? idFallback,
    slug: raw.slug,
    isActive: Boolean(raw.isActive),
    categories: stringArray(raw.categories),
    hasTransfer: Boolean(raw.hasTransfer),
    hasMeal: Boolean(raw.hasMeal),
    campaignPrice: typeof raw.campaignPrice === 'number' ? raw.campaignPrice : undefined,
    pricing: raw.pricing || {currency: 'EUR', byRegion: {}},
    participantRules: raw.participantRules,
    coverImage: raw.coverImage || inferredImages.coverImage,
    gallery: stringArray(raw.gallery).length ? stringArray(raw.gallery) : inferredImages.gallery,
    videoUrl: typeof raw.videoUrl === 'string' ? raw.videoUrl : undefined,
    localized: raw.localized,
    title,
    shortDescription,
    description: fallbackContent?.description || raw.description,
    thingsToBring: fallbackContent?.thingsToBring || stringArray(raw.thingsToBring),
    importantNotes: fallbackContent?.importantNotes || stringArray(raw.importantNotes),
    priceText: raw.priceText || priceSummary.displayPriceText,
    keywords: stringArray(raw.keywords),
    createdAt: toIsoString(raw.createdAt),
    updatedAt: toIsoString(raw.updatedAt)
  };
}
