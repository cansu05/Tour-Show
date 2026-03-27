import type {Firestore, WriteBatch} from 'firebase-admin/firestore';

export const FIRESTORE_BATCH_LIMIT = 500;

export async function commitInBatches<T>(
  db: Firestore,
  items: T[],
  apply: (batch: WriteBatch, item: T, index: number) => void
) {
  for (let start = 0; start < items.length; start += FIRESTORE_BATCH_LIMIT) {
    const batch = db.batch();
    const slice = items.slice(start, start + FIRESTORE_BATCH_LIMIT);

    slice.forEach((item, offset) => {
      apply(batch, item, start + offset);
    });

    await batch.commit();
  }
}
