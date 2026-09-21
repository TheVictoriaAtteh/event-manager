import React, { useCallback } from 'react';
import { EventsContext, type EventItem } from './EventsContextType';
import type { Event } from '../api/interfaces/events';
import { useCreateEventMutation, useDeleteEventMutation, useEventsQuery } from '../lib/apiQueries';

/**
 * Compute event status based on start and end times.
 */
function getEventStatus(startsAt: string, endsAt: string): 'UPCOMING' | 'ONGOING' | 'COMPLETED' {
  const now = new Date();
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  if (now < start) return 'UPCOMING';
  if (now >= start && now <= end) return 'ONGOING';
  return 'COMPLETED';
}

/**
 * Transform backend Event to frontend EventItem.
 */
function toEventItem(event: Event): EventItem {
  // Extract time from startsAt ISO string (e.g., "2026-09-15T10:00:00Z" -> "10:00 AM")
  const startDate = new Date(event.startsAt);
  const timeString = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return {
    id: event.id,
    title: event.title,
    date: event.date,
    time: timeString,
          location: event.location,
          description: event.description,
          category: event.category ?? 'Event',
    attendeesCount: event._count?.attendees ?? 0,
    maxCapacity: event.capacity,
    imageUrl: event.logoUrl ?? undefined,
    status: getEventStatus(event.startsAt, event.endsAt),
  };
}

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const eventsQuery = useEventsQuery();
  const createEventMutation = useCreateEventMutation();
  const deleteEventMutation = useDeleteEventMutation();
  const events = (eventsQuery.data ?? []).map(toEventItem);

  const addEvent = useCallback(
    async (eventData: Omit<EventItem, 'id' | 'attendeesCount' | 'status'>) => {
      try {
        // eventData.time comes from <input type="time"> → always "HH:mm" (24-hour).
        // Combine with date to form a valid local datetime string.
        const startDateTime = new Date(`${eventData.date}T${eventData.time}`);

        if (isNaN(startDateTime.getTime())) {
          throw new Error(
            'Invalid date or time value. Please pick a date and select a time.',
          );
        }

        const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // +2 hours

        const createInput = {
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          startsAt: startDateTime.toISOString(),
          endsAt: endDateTime.toISOString(),
          location: eventData.location,
          capacity: eventData.maxCapacity,
          category: eventData.category,
          logoUrl: eventData.imageUrl,
        };

        await createEventMutation.mutateAsync(createInput);
      } catch (err) {
        console.error('Failed to create event:', err);
        throw err;
      }
    },
    [createEventMutation],
  );

  const deleteEvent = useCallback(async (id: string) => {
    try {
      await deleteEventMutation.mutateAsync(id);
    } catch (err) {
      console.error('Failed to delete event:', err);
      throw err;
    }
  }, [deleteEventMutation]);

  return (
    <EventsContext.Provider value={{ events, addEvent, deleteEvent, isLoading: eventsQuery.isLoading, error: eventsQuery.error instanceof Error ? eventsQuery.error.message : null }}>
      {children}
    </EventsContext.Provider>
  );
};