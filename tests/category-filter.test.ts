import {describe, expect, it} from 'vitest';
import {filterToursByCategory} from '@/utils/category-filter';
import type {Tour} from '@/types/tour';

const tours: Tour[] = [
  {
    id: '1',
    title: 'A',
    slug: 'a',
    keywords: [],
    categories: ['aile'],
    shortDescription: '',
    description: '',
    thingsToBring: [],
    importantNotes: [],
    hasTransfer: false,
    hasMeal: false,
    pricing: {currency: 'EUR', byRegion: {}},
    coverImage: 'x',
    gallery: [],
    isActive: true,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: '2',
    title: 'B',
    slug: 'b',
    keywords: [],
    categories: ['macera'],
    shortDescription: '',
    description: '',
    thingsToBring: [],
    importantNotes: [],
    hasTransfer: false,
    hasMeal: false,
    pricing: {currency: 'EUR', byRegion: {}},
    coverImage: 'x',
    gallery: [],
    isActive: true,
    createdAt: '',
    updatedAt: ''
  }
];

describe('filterToursByCategory', () => {
  it('returns all when category is null', () => {
    expect(filterToursByCategory(tours, null)).toHaveLength(2);
  });

  it('filters by category', () => {
    expect(filterToursByCategory(tours, 'aile')).toHaveLength(1);
  });
});
