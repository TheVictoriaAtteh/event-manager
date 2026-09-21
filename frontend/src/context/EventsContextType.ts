import { createContext } from 'react';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  attendeesCount: number;
  maxCapacity: number;
  imageUrl?: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

export type CreateEventFormData = Omit<EventItem, 'id' | 'attendeesCount' | 'status' | 'category'> & {
  /** Select an existing hall instead of creating a venue with the event. */
  hallId?: string;
};

export interface EventsContextType {
  events: EventItem[];
  isLoading: boolean;
  error: string | null;
  /** Category is display-only; the external event API does not accept it. */
  addEvent: (eventData: CreateEventFormData) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const EventsContext = createContext<EventsContextType | undefined>(undefined);