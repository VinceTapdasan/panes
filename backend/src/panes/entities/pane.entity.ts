import { Timestamp } from 'firebase-admin/firestore';

export interface Pane {
  id: string;
  userId: string;
  originalName: string;
  storagePath: string;
  sizeBytes: number;
  mimeType: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  viewCount: number;
  isPublic: boolean;
}

export interface PaneDocument extends Omit<Pane, 'id'> {}
