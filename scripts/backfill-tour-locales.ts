import {FieldValue} from 'firebase-admin/firestore';
import {adminDb} from '../lib/firebase/admin';
import {prepareSeedTour, tours} from './seed-tours';
import {commitInBatches} from './lib/firestore-batch';

async function main() {
  if (!adminDb) {
    throw new Error(
      'Firebase Admin SDK is not initialized. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.'
    );
  }

  const collectionRef = adminDb.collection('tours');
  await commitInBatches(adminDb, tours, (batch, tour) => {
    const preparedTour = prepareSeedTour(tour);

    batch.set(
      collectionRef.doc(String(preparedTour.slug)),
      {
        localized: preparedTour.localized || {},
        updatedAt: FieldValue.serverTimestamp()
      },
      {merge: true}
    );
  });
  console.log(`Synchronized localized content for ${tours.length} tours.`);
}

main().catch((error) => {
  console.error('Backfill failed', error);
  process.exit(1);
});
