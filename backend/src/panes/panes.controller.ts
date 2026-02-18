import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/auth.decorator';
import { PanesService } from './panes.service';
import type { FirebaseUser } from '../auth/auth.types';
import type {
  PaneResponse,
  UploadResponse,
  PaneListResponse,
} from './dto/pane-response.dto';

@Controller('panes')
export class PanesController {
  constructor(private readonly panesService: PanesService) {}

  // POST /panes/upload - Upload new HTML file (auth required)
  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: FirebaseUser,
  ): Promise<UploadResponse> {
    return this.panesService.upload(file, user.uid);
  }

  // GET /panes - List user's panes (auth required)
  @Get()
  @UseGuards(AuthGuard)
  async list(@CurrentUser() user: FirebaseUser): Promise<PaneListResponse> {
    return this.panesService.listByUser(user.uid);
  }

  // GET /panes/:id - Get pane metadata (public)
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<PaneResponse> {
    const pane = await this.panesService.getById(id);
    return {
      id: pane.id,
      originalName: pane.originalName,
      sizeBytes: pane.sizeBytes,
      createdAt: pane.createdAt.toDate().toISOString(),
      expiresAt: pane.expiresAt.toDate().toISOString(),
      viewCount: pane.viewCount,
      isPublic: pane.isPublic,
      shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/v/${pane.id}`,
    };
  }

  // GET /panes/:id/raw - Serve raw HTML content (public)
  @Get(':id/raw')
  async getRaw(@Param('id') id: string, @Res() res: any): Promise<void> {
    const { content, pane } = await this.panesService.getRawContent(id);

    // Security headers for sandboxed HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; " +
        "frame-ancestors 'self' http://localhost:* https://*.panes.dev",
    );
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${pane.originalName}"`,
    );

    res.send(content);
  }

  // DELETE /panes/:id - Delete pane (auth required, owner only)
  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: FirebaseUser,
  ): Promise<void> {
    await this.panesService.delete(id, user.uid);
  }
}
