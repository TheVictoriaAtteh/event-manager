import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PassPdfService {
  constructor(private readonly prisma: PrismaService) {}

  async generatePassPdf(passId: string, userId: string): Promise<Buffer> {
    const pass = await this.prisma.pass.findUnique({
      where: { id: passId },
      include: {
        attendee: {
          include: {
            event: { include: { hall: true } },
          },
        },
      },
    });

    if (!pass) {
      throw new NotFoundException('Pass not found');
    }
    if (pass.attendee.event.organizerId !== userId) {
      throw new ForbiddenException('You do not have access to this pass');
    }

    const qrDataUrl = await QRCode.toDataURL(pass.qrToken, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 1000,
    });
    const qrImage = Buffer.from(
      qrDataUrl.replace(/^data:image\/png;base64,/, ''),
      'base64',
    );

    const doc = new PDFDocument({ size: 'A4', margin: 48 });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    return new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const { attendee, qrToken } = pass;
      const { event } = attendee;
      doc.fontSize(24).text(event.title, { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(13).text(`Event date: ${event.date}`, { align: 'center' });
      doc.text(`Location: ${event.location}`, { align: 'center' });
      doc.moveDown(1.5);
      doc.fontSize(18).text(attendee.name, { align: 'center' });
      doc.fontSize(12).text(`${attendee.passType} pass`, { align: 'center' });
      doc.moveDown(1);
      doc.image(qrImage, (doc.page.width - 260) / 2, doc.y, {
        width: 260,
        height: 260,
      });
      doc.moveDown(21);
      doc.fontSize(8).fillColor('#555555').text(qrToken, { align: 'center' });
      doc.end();
    });
  }
}
