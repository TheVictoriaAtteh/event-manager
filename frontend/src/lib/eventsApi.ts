/**
 * API client for Event management endpoints.
 * Connects to the NestJS backend /events routes.
 */

import { apiFetch } from "./apiClient";
import type {
  Event,
  CreateEventInput,
  UpdateEventInput,
  AssignHallInput,
} from "../api/interfaces/events";

export const eventsApi = {
  /**
   * Get all events with organizer, hall, and attendee count.
   */
  list(): Promise<Event[]> {
    return apiFetch<Event[]>("/events");
  },

  /**
   * Get a single event by ID with full details.
   */
  get(id: string): Promise<Event> {
    return apiFetch<Event>(`/events/${id}`);
  },

  /**
   * Create a new event.
   */
  create(input: CreateEventInput): Promise<Event> {
    return apiFetch<Event>("/events", {
      method: "POST",
      body: input,
    });
  },

  /**
   * Update an existing event.
   */
  update(id: string, input: UpdateEventInput): Promise<Event> {
    return apiFetch<Event>(`/events/${id}`, {
      method: "PATCH",
      body: input,
    });
  },

  /**
   * Delete an event.
   */
  remove(id: string): Promise<Event> {
    return apiFetch<Event>(`/events/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Assign or update the hall for an event.
   */
  assignHall(id: string, input: AssignHallInput): Promise<Event> {
    return apiFetch<Event>(`/events/${id}/hall`, {
      method: "PATCH",
      body: input,
    });
  },
};
