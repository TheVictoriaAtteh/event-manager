/**
 * API client for Event management endpoints.
 * Connects to the NestJS backend /events routes.
 */

import { apiRequest } from "./apiClient";
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
    return apiRequest<Event[]>({ url: "/events", method: "GET" });
  },

  /**
   * Get a single event by ID with full details.
   */
  get(id: string): Promise<Event> {
    return apiRequest<Event>({ url: `/events/${id}`, method: "GET" });
  },

  /**
   * Create a new event.
   */
  create(input: CreateEventInput): Promise<Event> {
    return apiRequest<Event>({ url: "/events", method: "POST", data: input });
  },

  /**
   * Update an existing event.
   */
  update(id: string, input: UpdateEventInput): Promise<Event> {
    return apiRequest<Event>({ url: `/events/${id}`, method: "PATCH", data: input });
  },

  /**
   * Delete an event.
   */
  remove(id: string): Promise<Event> {
    return apiRequest<Event>({ url: `/events/${id}`, method: "DELETE" });
  },

  /**
   * Assign or update the hall for an event.
   */
  assignHall(id: string, input: AssignHallInput): Promise<Event> {
    return apiRequest<Event>({ url: `/events/${id}/hall`, method: "PATCH", data: input });
  },
};
