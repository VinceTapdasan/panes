import {
  Injectable,
  BadRequestException,
  NotFoundException,
  GoneException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from '../firebase/firebase.service';
import { Timestamp } from 'firebase-admin/firestore';
import { nanoid } from 'nanoid';
import type { Pane, PaneDocument } from './entities/pane.entity';
import type {
  PaneResponse,
  UploadResponse,
  PaneListResponse,
} from './dto/pane-response.dto';

const COLLECTION = 'panes';
const STORAGE_PREFIX = 'panes';

@Injectable()
export class PanesService {
  private readonly ttlHours: number;
  private readonly maxSizeBytes: number;
  private readonly frontendUrl: string;

  constructor(
    private readonly firebase: FirebaseService,
    private readonly config: ConfigService,
  ) {
    this.ttlHours = this.config.get<number>('PANE_TTL_HOURS') || 72;
    this.maxSizeBytes =
      (this.config.get<number>('PANE_MAX_SIZE_MB') || 5) * 1024 * 1024;
    this.frontendUrl =
      this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  }

  // Validate uploaded file
  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const ext = file.originalname.toLowerCase().split('.').pop();
    if (!['html', 'htm'].includes(ext || '')) {
      throw new BadRequestException('Only .html files are allowed');
    }

    if (file.size > this.maxSizeBytes) {
      throw new BadRequestException(
        `File size exceeds ${this.maxSizeBytes / 1024 / 1024}MB limit`,
      );
    }

    // Check content type
    if (file.mimetype !== 'text/html') {
      throw new BadRequestException(
        'Invalid file type. Only text/html allowed',
      );
    }
  }

  // Generate unique short ID
  private async generateUniqueId(): Promise<string> {
    const firestore = this.firebase.firestore;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const id = nanoid(8);
      const doc = await firestore.collection(COLLECTION).doc(id).get();
      if (!doc.exists) {
        return id;
      }
      attempts++;
    }

    // Fallback to longer ID if collisions persist
    return nanoid(12);
  }

  // Upload a new pane
  async upload(
    file: Express.Multer.File,
    userId: string,
  ): Promise<UploadResponse> {
    this.validateFile(file);

    const firestore = this.firebase.firestore;
    const storage = this.firebase.storage;

    const id = await this.generateUniqueId();
    const storagePath = `${STORAGE_PREFIX}/${id}.html`;

    // Upload to Firebase Storage
    const bucket = storage.bucket();
    const fileRef = bucket.file(storagePath);

    await fileRef.save(file.buffer, {
      metadata: {
        contentType: 'text/html',
        metadata: {
          originalName: file.originalname,
        },
      },
    });

    // Calculate expiration
    const now = Timestamp.now();
    const expiresAt = Timestamp.fromMillis(
      now.toMillis() + this.ttlHours * 60 * 60 * 1000,
    );

    // Create Firestore document
    const paneDoc: PaneDocument = {
      userId,
      originalName: file.originalname,
      storagePath,
      sizeBytes: file.size,
      mimeType: 'text/html',
      createdAt: now,
      expiresAt,
      viewCount: 0,
      isPublic: true,
    };

    await firestore.collection(COLLECTION).doc(id).set(paneDoc);

    return {
      id,
      shareUrl: `${this.frontendUrl}/v/${id}`,
      expiresAt: expiresAt.toDate().toISOString(),
    };
  }

  // Get pane by ID (check expiration)
  async getById(id: string): Promise<Pane> {
    const firestore = this.firebase.firestore;
    const doc = await firestore.collection(COLLECTION).doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException('Pane not found');
    }

    const data = doc.data() as PaneDocument;
    const pane: Pane = { id: doc.id, ...data };

    // Check if expired
    if (pane.expiresAt.toMillis() < Date.now()) {
      // Lazy cleanup - delete expired pane
      await this.delete(id, pane.userId, true);
      throw new GoneException('Pane has expired');
    }

    return pane;
  }

  // Get raw HTML content
  async getRawContent(id: string): Promise<{ content: Buffer; pane: Pane }> {
    const pane = await this.getById(id);

    // Increment view count (fire-and-forget)
    this.incrementViewCount(id).catch(() => {});

    // Fetch from Storage
    const storage = this.firebase.storage;
    const bucket = storage.bucket();
    const fileRef = bucket.file(pane.storagePath);

    const [content] = await fileRef.download();

    return { content, pane };
  }

  // Increment view count
  private async incrementViewCount(id: string): Promise<void> {
    const firestore = this.firebase.firestore;
    await firestore
      .collection(COLLECTION)
      .doc(id)
      .update({
        viewCount: (
          await import('firebase-admin/firestore')
        ).FieldValue.increment(1),
      });
  }

  // List user's panes
  async listByUser(userId: string): Promise<PaneListResponse> {
    const firestore = this.firebase.firestore;
    const now = Timestamp.now();

    const snapshot = await firestore
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .where('expiresAt', '>', now)
      .orderBy('expiresAt')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const panes: PaneResponse[] = snapshot.docs.map((doc) => {
      const data = doc.data() as PaneDocument;
      return this.toPaneResponse(doc.id, data);
    });

    return { panes, total: panes.length };
  }

  // Delete pane (owner only, or system cleanup)
  async delete(
    id: string,
    userId: string,
    isSystemCleanup = false,
  ): Promise<void> {
    const firestore = this.firebase.firestore;
    const storage = this.firebase.storage;

    const doc = await firestore.collection(COLLECTION).doc(id).get();

    if (!doc.exists) {
      if (isSystemCleanup) return;
      throw new NotFoundException('Pane not found');
    }

    const data = doc.data() as PaneDocument;

    // Check ownership (skip for system cleanup)
    if (!isSystemCleanup && data.userId !== userId) {
      throw new ForbiddenException('Not authorized to delete this pane');
    }

    // Delete from Storage
    const bucket = storage.bucket();
    const fileRef = bucket.file(data.storagePath);
    await fileRef.delete().catch(() => {});

    // Delete from Firestore
    await firestore.collection(COLLECTION).doc(id).delete();
  }

  // Transform to response DTO
  private toPaneResponse(id: string, data: PaneDocument): PaneResponse {
    return {
      id,
      originalName: data.originalName,
      sizeBytes: data.sizeBytes,
      createdAt: data.createdAt.toDate().toISOString(),
      expiresAt: data.expiresAt.toDate().toISOString(),
      viewCount: data.viewCount,
      isPublic: data.isPublic,
      shareUrl: `${this.frontendUrl}/v/${id}`,
    };
  }
}
