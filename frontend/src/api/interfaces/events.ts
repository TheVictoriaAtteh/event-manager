/** Typed contracts for the external Event Manager API's /events routes. */

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
  organizerId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * `date` is an ISO calendar date while `startsAt` and `endsAt` are time
 * strings (for example, "10:00") in the current backend API.
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startsAt: string;
  endsAt: string | null;
  logoUrl: string | null;
  brandColor: string | null;
  organizerId: string;
  hallId: string | null;
  publicRegistrationToken?: string;
  registrationLink?: string;
  createdAt: string;
  updatedAt: string;
  organizer?: EventOrganizer;
  hall?: EventHall | null;
  _count?: {
    attendees: number;
  };
}

export interface CreateHallInlineInput {
  name: string;
  address: string;
  capacity: number;
  description?: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  date: string;
  startsAt: string;
  endsAt?: string;
  logoUrl?: string;
  brandColor?: string;
  hallId?: string;
  hall?: CreateHallInlineInput;
}

export type UpdateEventInput = Partial<CreateEventInput>;

export interface AssignHallInput {
  hallId: string;
}
