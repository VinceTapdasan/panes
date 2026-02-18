import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CleanupService } from './cleanup.service';
import type { CleanupResult } from './cleanup.service';

@Controller('panes/cleanup')
export class CleanupController {
  constructor(
    private readonly cleanupService: CleanupService,
    private readonly config: ConfigService,
  ) {}

  // POST /panes/cleanup - Trigger cleanup of expired panes
  // Protected by API key (for Cloud Scheduler / cron)
  @Post()
  @HttpCode(HttpStatus.OK)
  async triggerCleanup(
    @Headers('x-cleanup-key') cleanupKey: string,
  ): Promise<CleanupResult> {
    const expectedKey = this.config.get<string>('CLEANUP_API_KEY');

    // If CLEANUP_API_KEY is set, require it
    if (expectedKey && cleanupKey !== expectedKey) {
      throw new UnauthorizedException('Invalid cleanup key');
    }

    return this.cleanupService.cleanupExpired();
  }
}
