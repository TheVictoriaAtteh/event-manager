import React, { useState } from 'react';
import { EventsContext, type EventItem } from './EventsContextType';

const STORAGE_KEY = 'gatepass_mock_events';

const INITIAL_MOCK_EVENTS: EventItem[] = [
  {
    id: 'evt_1',
    title: 'Tech Summit 2026',
    date: '2026-09-15',
    time: '10:00 AM',
    location: 'Main Auditorium',
    description: 'Annual flagship technology and software convention.',
    category: 'Conference',
    attendeesCount: 142,
    maxCapacity: 300,
    status: 'UPCOMING',
  },
  {
    id: 'evt_2',
    title: 'Design Workshop',
    date: '2026-09-20',
    time: '02:00 PM',
    location: 'Room 204',
    description: 'Interactive UI/UX design masterclass with live demo.',
    category: 'Workshop',
    attendeesCount: 45,
    maxCapacity: 50,
    status: 'UPCOMING',
  },
];

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved events:', e);
      }
    }
    return INITIAL_MOCK_EVENTS;
  });

  const saveEvents = (updatedEvents: EventItem[]) => {
    setEvents(updatedEvents);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
  };

  const addEvent = (eventData: Omit<EventItem, 'id' | 'attendeesCount' | 'status'>) => {
    const newEvent: EventItem = {
      ...eventData,
      id: `evt_${Date.now()}`,
      attendeesCount: 0,
      status: 'UPCOMING',
    };
    saveEvents([newEvent, ...events]);
  };

  const deleteEvent = (id: string) => {
    saveEvents(events.filter((evt) => evt.id !== id));
  };

  return (
    <EventsContext.Provider value={{ events, addEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
};