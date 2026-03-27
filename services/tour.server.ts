import {cache} from 'react';
import {getActiveTours, getTourBySlug} from '@/services/tour.service';

export const getCachedActiveTours = cache(async () => getActiveTours());

export const getCachedTourBySlug = cache(async (slug: string) => getTourBySlug(slug));
