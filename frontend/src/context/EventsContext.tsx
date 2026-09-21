import React, { useCallback } from 'react';
import { EventsContext, type CreateEventFormData, type EventItem } from './EventsContextType';
import type { Event } from '../api/interfaces/events';
import { useCreateEventMutation, useDeleteEventMutation, useEventsQuery } from '../lib/apiQueries';

function eventDateTime(date: string, time: string): Date | null {
  const value = new Date(`${date}T${time}`);
  return Number.isNaN(value.getTime()) ? null : value;
}

/** The backend stores event time separately from its calendar date. */
function getEventStatus(date: string, startsAt: string, endsAt: string | null): EventItem['status'] {
  const start = eventDateTime(date, startsAt);
  if (!start) return 'UPCOMING';
  if (new Date() < start) return 'UPCOMING';

  if (!endsAt) return 'ONGOING';
  const end = eventDateTime(date, endsAt);
  if (!end) return 'ONGOING';
  // A closing time after midnight belongs to the following calendar day.
  if (end <= start) end.setDate(end.getDate() + 1);
  return new Date() <= end ? 'ONGOING' : 'COMPLETED';
}

function addTwoHours(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return time;
  const totalMinutes = Math.min(hours * 60 + minutes + 120, 23 * 60 + 59);
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
}

/** Transform the API event shape to the dashboard's presentation model. */
function toEventItem(event: Event): EventItem {
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    time: event.startsAt,
    location: event.hall?.address || event.hall?.name || 'Venue to be confirmed',
    description: event.description,
    // Category is not accepted by the backend's event DTO. Keep this as a
    // presentation label instead of sending an unsupported request field.
    category: 'Event',
    attendeesCount: event._count?.attendees ?? 0,
    maxCapacity: event.hall?.capacity ?? 0,
    imageUrl: event.logoUrl ?? undefined,
    status: getEventStatus(event.date, event.startsAt, event.endsAt),
  };
}

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const eventsQuery = useEventsQuery();
  const createEventMutation = useCreateEventMutation();
  const deleteEventMutation = useDeleteEventMutation();
  const events = (eventsQuery.data ?? []).map(toEventItem);

  const addEvent = useCallback(
    async (eventData: CreateEventFormData) => {
      if (!eventData.time) {
        throw new Error('Please select a valid start time.');
      }

      try {
        await createEventMutation.mutateAsync({
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          startsAt: eventData.time,
          endsAt: addTwoHours(eventData.time),
          logoUrl: eventData.imageUrl,
          // The current creation modal collects a venue and capacity. Map
          // these to the API's supported inline hall object rather than the
          // old, unsupported location/capacity event fields.
          ...(eventData.hallId
            ? { hallId: eventData.hallId }
            : eventData.location.trim() && {
                hall: {
                  name: eventData.location.trim(),
                  address: eventData.location.trim(),
                  capacity: Math.max(1, Math.round(eventData.maxCapacity || 1)),
                },
              }),
        });
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
