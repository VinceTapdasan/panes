import { DecodedIdToken } from 'firebase-admin/auth';

// Decoded token from Firebase Auth
export type FirebaseUser = DecodedIdToken;

// User info returned from /auth/me
export interface AuthUserResponse {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
  emailVerified: boolean;
  provider: string;
}
