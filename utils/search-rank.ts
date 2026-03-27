import type {Tour} from '@/types/tour';
import type {SearchResult} from '@/types/search';
import {isCloseMatch} from '@/utils/fuzzy';
import {normalizeTurkishText} from '@/utils/normalize';

const GENERIC_SEARCH_TOKENS = new Set([
  'tur',
  'turu',
  'turlar',
  'turlari',
  'gezi',
  'gezisi',
  'gezileri'
]);

type PreparedTourSearch = {
  title: string;
  normalizedTitle: string;
  normalizedDescription: string;
  normalizedKeywords: string[];
  normalizedCategories: string[];
  searchableText: string;
};

const searchIndex = new WeakMap<Tour, PreparedTourSearch>();

function splitSearchTokens(value: string) {
  return value
    .split(/[^a-z0-9]+/g)
    .map((part) => part.trim())
    .filter(Boolean);
}

function getPreparedTourSearch(tour: Tour): PreparedTourSearch {
  const cached = searchIndex.get(tour);
  if (cached) return cached;

  const prepared = {
    title: tour.title,
    normalizedTitle: normalizeTurkishText(tour.title),
    normalizedDescription: normalizeTurkishText(tour.shortDescription || ''),
    normalizedKeywords: tour.keywords.map((keyword) => normalizeTurkishText(keyword)),
    normalizedCategories: tour.categories.map((category) => normalizeTurkishText(category)),
    searchableText: ''
  };

  prepared.searchableText = [
    prepared.normalizedTitle,
    prepared.normalizedDescription,
    ...prepared.normalizedKeywords,
    ...prepared.normalizedCategories
  ].join(' ');

  searchIndex.set(tour, prepared);
  return prepared;
}

export function scoreTourAgainstSearch(tour: Tour, term: string): SearchResult | null {
  const raw = term.trim();
  if (!raw) return {score: 1, reason: 'normalizedTitle'};

  const normalizedTerm = normalizeTurkishText(raw);
  const {title, normalizedTitle, normalizedDescription, normalizedKeywords, normalizedCategories, searchableText} =
    getPreparedTourSearch(tour);

  if (title.toLocaleLowerCase('tr') === raw.toLocaleLowerCase('tr')) {
    return {score: 100, reason: 'exactTitle'};
  }

  if (normalizedTitle.includes(normalizedTerm)) {
    return {score: 85, reason: 'normalizedTitle'};
  }

  const keywordHit = [normalizedDescription, ...normalizedKeywords, ...normalizedCategories].some((value) => value.includes(normalizedTerm));

  if (keywordHit) {
    return {score: 70, reason: 'keyword'};
  }

  const significantTokens = splitSearchTokens(normalizedTerm).filter(
    (token) => token.length > 1 && !GENERIC_SEARCH_TOKENS.has(token)
  );

  if (significantTokens.length > 0 && significantTokens.every((token) => searchableText.includes(token))) {
    return {score: 68, reason: 'keyword'};
  }

  if (isCloseMatch(normalizedTitle, normalizedTerm)) {
    return {score: 50, reason: 'fuzzy'};
  }

  return null;
}

export function sortToursAlphabetical(tours: Tour[], locale: string = 'tr'): Tour[] {
  const collator = new Intl.Collator(locale);
  return [...tours].sort((a, b) => collator.compare(a.title, b.title));
}
