# External API usage guide

This frontend targets the separately deployed `event-manager-backend` API. Set an absolute `VITE_API_URL` in `frontend/.env`; do not put any API or Supabase secrets in the frontend.

## Events

`eventsApi` calls authenticated `/events` routes. The current API stores the calendar date separately from times, so send `date` as `YYYY-MM-DD` and `startsAt` / `endsAt` as time strings such as `10:00` and `18:00`.

```ts
import { eventsApi } from '@/lib/eventsApi';

const event = await eventsApi.create({
  title: 'Tech Summit 2026',
  description: 'Annual technology conference',
  date: '2026-10-25',
  startsAt: '10:00',
  endsAt: '18:00',
  hall: {
    name: 'Grand Conference Hall',
    address: 'Central Area, Abuja',
    capacity: 500,
  },
});

await eventsApi.assignHall(event.id, { hallId: 'hall-uuid' });
await eventsApi.update(event.id, { brandColor: '#1E40AF' });
```

Event requests must not send legacy `location`, `capacity`, or `category` fields. A venue is represented by an existing `hallId` or an inline `hall` object.

## Halls

`hallsApi` manages authenticated `/halls` routes.

```ts
const hall = await hallsApi.create({
  name: 'Grand Conference Hall',
  address: 'Central Area, Abuja',
  capacity: 500,
});
```

## Attendees and check-in

The attendee API accepts only a name and email. It issues a pass automatically and intentionally does **not** expose the QR token in attendee responses.

```ts
await attendeesApi.create('event-uuid', {
  name: 'John Doe',
  email: 'john@example.com',
});
```

CSV files should include `Name,Email`. The current API does not support attendee pass types.

Check an attendee in with the token contained in their QR code:

```ts
await checkInApi.scanPass(qrToken); // POST /check-in with { qrToken }
```

There is no standalone check-in-history endpoint. The frontend's log is derived from each attendee's `checkIn.scannedAt` status returned by `/events/:eventId/attendees`.

## Errors

```ts
import { ApiError } from '@/lib/apiClient';

try {
  await eventsApi.create(input);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API error ${error.status}:`, error.message);
  }
}
```
