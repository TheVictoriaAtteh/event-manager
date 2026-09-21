import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { PassPdfService } from './pass-pdf.services';
import { PassesController } from './passes.controller';
import { PassesService } from './passes.services';

@Module({
  imports: [PrismaModule],
  controllers: [PassesController],
  providers: [PassesService, PassPdfService],
  exports: [PassesService, PassPdfService],
})
export class PassesModule {}
