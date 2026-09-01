# API Usage Guide

## Events API (`eventsApi`)

Manages event creation, updates, and retrieval.

**Available Methods:**
- `list()` - Get all events with organizer, hall, and attendee count
- `get(id)` - Get a single event by ID
- `create(input)` - Create a new event
- `update(id, input)` - Update an existing event
- `remove(id)` - Delete an event
- `assignHall(id, input)` - Assign or update the hall for an event

**Example:**

```typescript
import { eventsApi } from '@/lib/eventsApi';
import type { CreateEventInput } from '@/api/interfaces/events';

// Create an event
const newEvent: CreateEventInput = {
  title: 'Tech Summit 2026',
  description: 'Annual technology conference',
  date: '2026-09-15',
  startsAt: '2026-09-15T10:00:00Z',
  endsAt: '2026-09-15T18:00:00Z',
  location: 'Main Auditorium',
  capacity: 300,
};

const event = await eventsApi.create(newEvent);
const events = await eventsApi.list();
await eventsApi.update(event.id, { capacity: 350 });
await eventsApi.assignHall(event.id, { hallId: 'hall-uuid' });
await eventsApi.remove(event.id);
```

## Halls API (`hallsApi`)

Manages venue/hall information.

**Example:**

```typescript
import { hallsApi } from '@/lib/hallsApi';

const newHall = {
  name: 'Grand Conference Hall',
  address: '123 Main Street, City',
  capacity: 500,
};

const hall = await hallsApi.create(newHall);
const halls = await hallsApi.list();
```

## Attendees API (`attendeesApi`)

Manages event attendees and CSV imports.

**Example:**

```typescript
import { attendeesApi } from '@/lib/attendeesApi';

const result = await attendeesApi.list('event-uuid', {
  search: 'john',
  take: 50,
});

await attendeesApi.create('event-uuid', {
  name: 'John Doe',
  email: 'john@example.com',
  passType: 'VIP',
});
```

## Context Integration

### EventsContext

```typescript
import { useEvents } from '@/context/useEvents';

function MyComponent() {
  const { events, isLoading, error, addEvent, deleteEvent } = useEvents();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  );
}
```

## Error Handling

```typescript
import { ApiError } from '@/lib/apiClient';

try {
  await eventsApi.create(newEvent);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.status}:`, error.message);
  }
}
```
