/**
 * TypeScript interfaces for Event-related API responses.
 * Based on backend Prisma schema and NestJS controllers.
 */

export interface EventOrganizer {
  id: string;
  name: string;
  email: string;
}

export interface EventHall {
  id: string;
  name: string;
  address: string | null;
  description: string | null;
  capacity: number;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startsAt: string;
  endsAt: string;
  location: string;
  logoUrl: string | null;
  brandColor: string | null;
  capacity: number;
  organizerId: string;
  organizationId: string;
  hallId: string | null;
  createdAt: string;
  updatedAt: string;
  organizer?: EventOrganizer;
  hall?: EventHall | null;
  _count?: {
    attendees: number;
  };
}

export interface CreateEventInput {
  title: string;
  description: string;
  date: string;
  startsAt: string;
  endsAt: string;
  location: string;
  logoUrl?: string;
  brandColor?: string;
  capacity: number;
  hallId?: string;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  date?: string;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  logoUrl?: string;
  brandColor?: string;
  capacity?: number;
}

export interface AssignHallInput {
  hallId: string;
}
