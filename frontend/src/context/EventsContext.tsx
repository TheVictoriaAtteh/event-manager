import React, { useState, useEffect, useCallback } from 'react';
import { EventsContext, type EventItem } from './EventsContextType';
import { eventsApi } from '../lib/eventsApi';
import type { Event } from '../api/interfaces/events';

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
    category: 'Event', // Backend doesn't have category, using generic label
    attendeesCount: event._count?.attendees ?? 0,
    maxCapacity: event.capacity,
    imageUrl: event.logoUrl ?? undefined,
    status: getEventStatus(event.startsAt, event.endsAt),
  };
}

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load events from the backend on mount.
   */
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const backendEvents = await eventsApi.list();
        setEvents(backendEvents.map(toEventItem));
      } catch (err) {
        console.error('Failed to load events:', err);
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    void loadEvents();
  }, []);

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
          logoUrl: eventData.imageUrl,
        };

        const newEvent = await eventsApi.create(createInput);
        setEvents((prev) => [toEventItem(newEvent), ...prev]);
      } catch (err) {
        console.error('Failed to create event:', err);
        throw err;
      }
    },
    [],
  );

  const deleteEvent = useCallback(async (id: string) => {
    try {
      await eventsApi.remove(id);
      setEvents((prev) => prev.filter((evt) => evt.id !== id));
    } catch (err) {
      console.error('Failed to delete event:', err);
      throw err;
    }
  }, []);

  return (
    <EventsContext.Provider value={{ events, addEvent, deleteEvent, isLoading, error }}>
      {children}
    </EventsContext.Provider>
  );
};