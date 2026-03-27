import {adminDb} from '@/lib/firebase/admin';
import type {Tour} from '@/types/tour';
import {mapTourDocument} from '@/services/firebase/tour.mapper';
import {TourDataAccessError} from '@/services/firebase/tour.errors';

function ensureAdminDb() {
  if (!adminDb) {
    throw new TourDataAccessError('Firebase Admin SDK is not configured.');
  }

  return adminDb.collection('tours');
}

export async function fetchActiveTours(): Promise<Tour[]> {
  const tourCollection = ensureAdminDb();

  try {
    const snapshot = await tourCollection.where('isActive', '==', true).get();

    return snapshot.docs
      .map((doc) => mapTourDocument({id: doc.id, ...(doc.data() as Record<string, unknown>)}, doc.id))
      .filter((tour): tour is Tour => Boolean(tour));
  } catch (error) {
    throw new TourDataAccessError('Failed to fetch active tours.', {cause: error});
  }
}

export async function fetchTourBySlug(slug: string): Promise<Tour | null> {
  const tourCollection = ensureAdminDb();

  try {
    const directSnapshot = await tourCollection.doc(slug).get();

    if (directSnapshot.exists) {
      const raw: Record<string, unknown> & {id: string} = {
        id: directSnapshot.id,
        ...(directSnapshot.data() as Record<string, unknown>)
      };
      if (raw.isActive !== true) return null;

      return mapTourDocument(raw, directSnapshot.id);
    }

    const fallbackSnapshot = await tourCollection.where('slug', '==', slug).where('isActive', '==', true).limit(1).get();
    const first = fallbackSnapshot.docs[0];
    if (!first) return null;

    const raw: Record<string, unknown> & {id: string} = {id: first.id, ...(first.data() as Record<string, unknown>)};
    return mapTourDocument(raw, first.id);
  } catch (error) {
    throw new TourDataAccessError(`Failed to fetch tour by slug: ${slug}`, {cause: error});
  }
}
