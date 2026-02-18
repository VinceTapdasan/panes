import { Injectable } from '@nestjs/common';
import type { FirebaseUser, AuthUserResponse } from './auth.types';

@Injectable()
export class AuthService {
  // Transform decoded token to a clean user response
  getUserInfo(user: FirebaseUser): AuthUserResponse {
    // Determine auth provider (google.com, password, etc.)
    const provider = user.firebase?.sign_in_provider || 'unknown';

    return {
      uid: user.uid,
      email: user.email || null,
      displayName: user.name || null,
      photoUrl: user.picture || null,
      emailVerified: user.email_verified || false,
      provider,
    };
  }
}
