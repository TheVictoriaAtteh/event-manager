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

export interface EventsContextType {
  events: EventItem[];
  isLoading: boolean;
  error: string | null;
  addEvent: (eventData: Omit<EventItem, 'id' | 'attendeesCount' | 'status'>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const EventsContext = createContext<EventsContextType | undefined>(undefined);