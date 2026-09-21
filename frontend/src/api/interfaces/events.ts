/** Typed contracts for the Events API. */

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
  category: string | null;
  capacity: number;
  organizerId: string;
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
  capacity: number;
  category?: string;
  logoUrl?: string;
  brandColor?: string;
  hallId?: string;
}

export type UpdateEventInput = Partial<CreateEventInput>;

export interface AssignHallInput {
  hallId: string;
}
