import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as QRCode from 'qrcode';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PassesService {
  constructor(private readonly prisma: PrismaService) {}

  private async findOwnedPass(passId: string, userId: string) {
    const pass = await this.prisma.pass.findUnique({
      where: { id: passId },
      include: {
        attendee: {
          include: {
            event: { include: { hall: true } },
          },
        },
        checkIn: true,
      },
    });

    if (!pass) {
      throw new NotFoundException('Pass not found');
    }
    if (pass.attendee.event.organizerId !== userId) {
      throw new ForbiddenException('You do not have access to this pass');
    }
    return pass;
  }

  /**
   * Returns the attendee's latest active pass. Passes are created when an
   * attendee is registered; this endpoint deliberately does not mint an
   * accidental duplicate every time a QR code is viewed.
   */
  async getAttendeePass(attendeeId: string, userId: string) {
    const attendee = await this.prisma.attendee.findUnique({
      where: { id: attendeeId },
      include: {
        event: { include: { hall: true } },
        passes: {
          where: { revokedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { checkIn: true },
        },
      },
    });
    if (!attendee) {
      throw new NotFoundException('Attendee not found');
    }
    if (attendee.event.organizerId !== userId) {
      throw new ForbiddenException('You do not have access to this attendee');
    }

    const pass = attendee.passes[0];
    if (!pass) {
      throw new NotFoundException('No active pass found for this attendee');
    }

    return {
      id: pass.id,
      qrToken: pass.qrToken,
      qrCode: await QRCode.toDataURL(pass.qrToken, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 1000,
      }),
      revokedAt: pass.revokedAt,
      checkedInAt: pass.checkIn?.scannedAt ?? null,
      attendee: {
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        passType: attendee.passType,
      },
      event: {
        id: attendee.event.id,
        title: attendee.event.title,
        date: attendee.event.date,
        startsAt: attendee.event.startsAt,
        endsAt: attendee.event.endsAt,
        location: attendee.event.location,
        hall: attendee.event.hall,
      },
    };
  }

  async verifyPass(passId: string, userId: string) {
    const pass = await this.findOwnedPass(passId, userId);
    return {
      valid: !pass.revokedAt,
      checkedInAt: pass.checkIn?.scannedAt ?? null,
      attendee: {
        id: pass.attendee.id,
        name: pass.attendee.name,
        email: pass.attendee.email,
        passType: pass.attendee.passType,
      },
      event: {
        id: pass.attendee.event.id,
        title: pass.attendee.event.title,
      },
    };
  }

  async getOwnedPassForPdf(passId: string, userId: string) {
    return this.findOwnedPass(passId, userId);
  }
}
