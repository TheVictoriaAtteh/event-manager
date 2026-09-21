import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  private assertValidSchedule(startsAt: string, endsAt: string): void {
    const start = new Date(startsAt);
    const end = new Date(endsAt);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException('Event start and end times must be valid ISO dates');
    }
    if (end <= start) {
      throw new BadRequestException('Event end time must be after its start time');
    }
  }

  private async assertHallAvailable(
    hallId: string,
    organizerId: string,
    startsAt: string,
    endsAt: string,
    excludingEventId?: string,
  ): Promise<void> {
    const hall = await this.prisma.hall.findFirst({
      where: { id: hallId, organizerId },
      select: { id: true },
    });
    if (!hall) {
      throw new NotFoundException('Hall not found');
    }

    const conflictingEvent = await this.prisma.event.findFirst({
      where: {
        hallId,
        ...(excludingEventId ? { id: { not: excludingEventId } } : {}),
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt },
      },
      select: { id: true },
    });
    if (conflictingEvent) {
      throw new BadRequestException('This hall is already booked for this time');
    }
  }

  async create(dto: CreateEventDto, organizerId: string) {
    this.assertValidSchedule(dto.startsAt, dto.endsAt);

    if (dto.hallId) {
      await this.assertHallAvailable(
        dto.hallId,
        organizerId,
        dto.startsAt,
        dto.endsAt,
      );
    }

    return this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        date: dto.date,
        startsAt: dto.startsAt,
        endsAt: dto.endsAt,
        location: dto.location,
        capacity: dto.capacity,
        category: dto.category,
        logoUrl: dto.logoUrl,
        brandColor: dto.brandColor,
        organizerId,
        hallId: dto.hallId ?? null,
      },
      include: { organizer: true, hall: true, _count: { select: { attendees: true } } },
    });
  }

  async findAll(organizerId: string) {
    return this.prisma.event.findMany({
      where: { organizerId },
      orderBy: { startsAt: 'asc' },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        hall: true,
        _count: { select: { attendees: true } },
      },
    });
  }

  async findOne(id: string, organizerId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        hall: true,
        _count: { select: { attendees: true } },
      },
    });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('You do not have access to this event');
    }
    return event;
  }

  async update(id: string, dto: UpdateEventDto, organizerId: string) {
    const current = await this.findOne(id, organizerId);
    const startsAt = dto.startsAt ?? current.startsAt;
    const endsAt = dto.endsAt ?? current.endsAt;
    const hallId = dto.hallId === undefined ? current.hallId : dto.hallId;

    this.assertValidSchedule(startsAt, endsAt);
    if (hallId) {
      await this.assertHallAvailable(hallId, organizerId, startsAt, endsAt, id);
    }

    return this.prisma.event.update({
      where: { id },
      data: dto,
      include: { organizer: true, hall: true, _count: { select: { attendees: true } } },
    });
  }

  async remove(id: string, organizerId: string) {
    await this.findOne(id, organizerId);
    return this.prisma.event.delete({ where: { id } });
  }

  async assignHall(eventId: string, hallId: string, organizerId: string) {
    const event = await this.findOne(eventId, organizerId);
    await this.assertHallAvailable(hallId, organizerId, event.startsAt, event.endsAt, eventId);

    return this.prisma.event.update({
      where: { id: eventId },
      data: { hallId },
      include: { organizer: true, hall: true, _count: { select: { attendees: true } } },
    });
  }
}
