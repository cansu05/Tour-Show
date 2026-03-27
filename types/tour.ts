import type {AppLocale} from '@/constants/locales';

export type TourRegionPricing = {
  adultPrice?: number | null;
  childPrice?: number | null;
  availableDays?: string[];
};

export type TourPricing = {
  currency?: string;
  byRegion?: Record<string, TourRegionPricing>;
};

export type TourParticipantRules = {
  freeChildMinAge?: number | null;
  freeChildMaxAge?: number | null;
  childMinAge?: number | null;
  childMaxAge?: number | null;
};

export type TourLocalizedContent = {
  title: string;
  shortDescription: string;
  description?: string;
  thingsToBring?: string[];
  importantNotes?: string[];
};

export type Tour = {
  id: string;
  slug: string;
  isActive: boolean;
  categories: string[];
  hasTransfer: boolean;
  hasMeal: boolean;
  campaignPrice?: number | null;
  pricing: TourPricing;
  participantRules?: TourParticipantRules;
  coverImage: string;
  gallery: string[];
  videoUrl?: string;
  localized?: Partial<Record<AppLocale, TourLocalizedContent>>;
  title: string;
  shortDescription: string;
  description?: string;
  thingsToBring: string[];
  importantNotes: string[];
  priceText?: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
};

export type TourDocument = Partial<Omit<Tour, 'id'>> & {
  id?: string;
};
