# Frontend API Integration

This directory contains TypeScript interfaces and API client functions for interacting with the Event Manager backend.

## Directory Structure

```
frontend/src/
├── api/
│   ├── interfaces/
│   │   ├── common.ts      # Generic API response structures
│   │   ├── events.ts      # Event-related interfaces
│   │   ├── halls.ts       # Hall (venue) interfaces
│   │   ├── dashboard.ts   # Dashboard data interfaces (legacy)
│   │   └── index.ts       # Central export point
│   └── index.ts
└── lib/
    ├── apiClient.ts       # Core HTTP client with JWT auth
    ├── authApi.ts         # Authentication endpoints
    ├── attendeesApi.ts    # Attendee management endpoints
    ├── eventsApi.ts       # Event management endpoints
    ├── hallsApi.ts        # Hall/venue management endpoints
    └── index.ts           # Central export point
```

## Usage

### Import API Clients

```typescript
// Import individual API modules
import { eventsApi } from '@/lib/eventsApi';
import { hallsApi } from '@/lib/hallsApi';
import { attendeesApi } from '@/lib/attendeesApi';
import { authApi } from '@/lib/authApi';

// Or import from central index
import { eventsApi, hallsApi } from '@/lib';
```

### Import TypeScript Interfaces

```typescript
// Import specific interfaces
import type { Event, CreateEventInput } from '@/api/interfaces/events';
import type { Hall, CreateHallInput } from '@/api/interfaces/halls';

// Or import from central index
import type { Event, Hall } from '@/api';
```
