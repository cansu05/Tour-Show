import type {Tour} from '@/types/tour';
import {fetchActiveTours, fetchTourBySlug} from '@/services/firebase/tour.repository';

export async function getActiveTours(): Promise<Tour[]> {
  return fetchActiveTours();
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  return fetchTourBySlug(slug);
}

