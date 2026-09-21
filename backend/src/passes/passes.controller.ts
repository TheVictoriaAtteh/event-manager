import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser, type RequestUser } from '../common/decorators/current-user.decorator';
import { VerifyPassDto } from './dto/verify-passes.dto';
import { PassPdfService } from './pass-pdf.services';
import { PassesService } from './passes.services';

@ApiTags('passes')
@ApiBearerAuth()
@Controller('passes')
export class PassesController {
  constructor(
    private readonly passesService: PassesService,
    private readonly passPdfService: PassPdfService,
  ) {}

  @Get('attendee/:attendeeId')
  getAttendeePass(
    @Param('attendeeId') attendeeId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.passesService.getAttendeePass(attendeeId, user.id);
  }

  @Post('verify')
  verifyPass(@Body() dto: VerifyPassDto, @CurrentUser() user: RequestUser) {
    return this.passesService.verifyPass(dto.passId, user.id);
  }

  @Get(':id/pdf')
  async downloadPassPdf(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Res() response: Response,
  ): Promise<void> {
    const pdf = await this.passPdfService.generatePassPdf(id, user.id);
    response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="event-pass-${id}.pdf"`,
      'Content-Length': String(pdf.length),
    });
    response.end(pdf);
  }
}
