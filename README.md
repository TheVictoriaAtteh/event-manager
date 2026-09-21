# Event Manager

Event Manager is a full-stack application for creating events, managing rooms
and attendees, issuing QR passes, and recording door check-ins.

- **Frontend:** React, TypeScript, Vite, React Query
- **API:** NestJS, Prisma, PostgreSQL, Supabase Auth and Storage

## Project layout

```text
frontend/   React application
backend/    NestJS API and Prisma schema/migrations
```

## Local development

### 1. Configure services

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Populate `backend/.env` with a PostgreSQL `DATABASE_URL` and your Supabase
project settings. Create a public Supabase Storage bucket named `event-images`
for event banners.

### 2. Install dependencies and migrate

```bash
npm ci
npm ci --prefix frontend
npm ci --prefix backend
npm run prisma:migrate --prefix backend
```

### 3. Run the API and frontend

In separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

The frontend is available at `http://localhost:3000`; Vite proxies `/api` to
the API at `http://localhost:4000`, so browser code does not call localhost
directly. Swagger is available at `http://localhost:4000/api/docs`.

## Checks

```bash
npm run build
npm run lint
npm test
```

`prisma generate` can run without a configured database. A real
`DATABASE_URL` is still required to run the API or apply migrations.
