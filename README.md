# Event Manager Frontend

This repository contains **only the Event Manager web frontend**. The NestJS
backend lives in a separate repository and is not included, built, or started
from this project.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- TanStack React Query

## Configure the external API

The frontend requires the URL of the separately deployed API at build time.

```bash
cp frontend/.env.example frontend/.env
```

Set the value to your backend's public base URL (without a trailing slash):

```dotenv
VITE_API_URL=https://api.your-domain.com
```

The API must allow this frontend's origin through CORS. Never put backend
secrets in `VITE_*` variables: all Vite variables are visible in the browser.

## Run locally

```bash
npm ci --prefix frontend
npm run dev
```

The app runs on `http://localhost:3000`.

## Production build and checks

```bash
npm run build
npm run lint
```

The actual frontend source and its package manifest are in [`frontend/`](./frontend).
