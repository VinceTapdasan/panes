import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FirebaseUser } from './auth.types';

// Extract the authenticated user from the request
// Usage: @CurrentUser() user: FirebaseUser
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): FirebaseUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
