import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    const projectId = this.config.get<string>('FIREBASE_PROJECT_ID');

    if (!projectId) {
      console.warn('Firebase not configured — skipping initialization');
      return;
    }

    this.app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail: this.config.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: this.config
          .get<string>('FIREBASE_PRIVATE_KEY')
          ?.replace(/\\n/g, '\n'),
      }),
      storageBucket: this.config.get<string>('FIREBASE_STORAGE_BUCKET'),
    });

    console.log(`Firebase initialized for project: ${projectId}`);
  }

  get firestore() {
    return this.app?.firestore();
  }

  get storage() {
    return this.app?.storage();
  }

  get auth() {
    return this.app?.auth();
  }
}
