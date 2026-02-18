import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './auth.decorator';
import { AuthService } from './auth.service';
import type { FirebaseUser, AuthUserResponse } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // GET /auth/me - Return current authenticated user info
  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() user: FirebaseUser): AuthUserResponse {
    return this.authService.getUserInfo(user);
  }
}
