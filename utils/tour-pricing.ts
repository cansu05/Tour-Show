import type {TourPricing} from '@/types/tour';

type TourPriceSummary = {
  currency: string;
  minAdultPrice?: number;
  minChildPrice?: number;
  displayPriceText?: string;
};

function collectPrices(pricing: TourPricing | undefined, key: 'adultPrice' | 'childPrice') {
  return Object.values(pricing?.byRegion || {})
    .map((region) => region[key])
    .filter((price): price is number => typeof price === 'number');
}

export function getTourPriceSummary(pricing: TourPricing | undefined, campaignPrice?: number | null): TourPriceSummary {
  const currency = pricing?.currency || 'EUR';
  const adultPrices = collectPrices(pricing, 'adultPrice');
  const childPrices = collectPrices(pricing, 'childPrice');
  const minAdultPrice = adultPrices.length ? Math.min(...adultPrices) : undefined;
  const minChildPrice = childPrices.length ? Math.min(...childPrices) : undefined;

  return {
    currency,
    minAdultPrice,
    minChildPrice,
    displayPriceText:
      typeof campaignPrice === 'number'
        ? `${campaignPrice} ${currency}`
        : typeof minAdultPrice === 'number'
          ? `${minAdultPrice} ${currency}`
          : undefined
  };
}
