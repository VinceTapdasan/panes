import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Timestamp } from 'firebase-admin/firestore';
import type { PaneDocument } from './entities/pane.entity';

const COLLECTION = 'panes';
const BATCH_SIZE = 100;

export interface CleanupResult {
  deleted: number;
  errors: number;
  durationMs: number;
}

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private readonly firebase: FirebaseService) {}

  // Run cleanup of expired panes
  async cleanupExpired(): Promise<CleanupResult> {
    const startTime = Date.now();
    let deleted = 0;
    let errors = 0;

    const firestore = this.firebase.firestore;
    const storage = this.firebase.storage;
    const bucket = storage.bucket();
    const now = Timestamp.now();

    this.logger.log('Starting cleanup of expired panes...');

    // Query expired panes in batches
    let hasMore = true;

    while (hasMore) {
      const snapshot = await firestore
        .collection(COLLECTION)
        .where('expiresAt', '<=', now)
        .limit(BATCH_SIZE)
        .get();

      if (snapshot.empty) {
        hasMore = false;
        break;
      }

      // Process each expired pane
      const deletePromises = snapshot.docs.map(async (doc) => {
        try {
          const data = doc.data() as PaneDocument;

          // Delete from Storage
          const fileRef = bucket.file(data.storagePath);
          await fileRef.delete().catch(() => {
            // File might already be deleted, ignore
          });

          // Delete from Firestore
          await doc.ref.delete();

          deleted++;
          this.logger.debug(`Deleted expired pane: ${doc.id}`);
        } catch (error) {
          errors++;
          this.logger.error(`Failed to delete pane ${doc.id}:`, error);
        }
      });

      await Promise.all(deletePromises);

      // If we got fewer than BATCH_SIZE, we're done
      if (snapshot.size < BATCH_SIZE) {
        hasMore = false;
      }
    }

    const durationMs = Date.now() - startTime;

    this.logger.log(
      `Cleanup complete: ${deleted} deleted, ${errors} errors, ${durationMs}ms`,
    );

    return { deleted, errors, durationMs };
  }
}
