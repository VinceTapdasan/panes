import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PanesController } from './panes.controller';
import { PanesService } from './panes.service';
import { CleanupController } from './cleanup.controller';
import { CleanupService } from './cleanup.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
    }),
  ],
  controllers: [PanesController, CleanupController],
  providers: [PanesService, CleanupService],
  exports: [PanesService, CleanupService],
})
export class PanesModule {}
