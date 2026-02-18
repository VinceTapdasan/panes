import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot(): { status: string; message: string } {
    return {
      status: 'ok',
      message: 'Panes API is running',
    };
  }

  // Health check endpoint (skip rate limiting)
  @Get('health')
  @SkipThrottle()
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
