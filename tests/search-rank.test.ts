import {describe, expect, it} from 'vitest';
import {scoreTourAgainstSearch} from '@/utils/search-rank';
import type {Tour} from '@/types/tour';

const sample: Tour = {
  id: '1',
  title: 'Pamukkale',
  slug: 'pamukkale',
  keywords: ['traverten', 'hierapolis'],
  categories: ['doğa'],
  shortDescription: 'x',
  description: '',
  thingsToBring: [],
  importantNotes: [],
  hasTransfer: true,
  hasMeal: false,
  pricing: {currency: 'EUR', byRegion: {}},
  coverImage: 'x',
  gallery: [],
  isActive: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

describe('scoreTourAgainstSearch', () => {
  it('prioritizes exact title match', () => {
    expect(scoreTourAgainstSearch(sample, 'Pamukkale')?.reason).toBe('exactTitle');
  });

  it('matches keywords', () => {
    expect(scoreTourAgainstSearch(sample, 'traver')?.reason).toBe('keyword');
  });

  it('matches category terms inside multi-word tour queries', () => {
    expect(scoreTourAgainstSearch(sample, 'doğa turları')?.reason).toBe('keyword');
  });
});

