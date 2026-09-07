# Event Manager — Second-Pass Verified Audit

> All findings are verified directly from source code.  
> No modifications were made during this audit.

---

## Feature Verification Summary

### Authentication

#### Email/password register
✅ **VERIFIED COMPLETE**
- `auth.controller.ts` → `POST /auth/register` → `auth.service.ts:register()`
- Delegates to `supabase.signUp()`. On email-verification-required flows, returns `{ emailVerificationRequired: true }` without a token. On instant-verify flows (Supabase dashboard confirmation disabled), issues a JWT immediately.
- Security confirmed: role is hardcoded to `UserRole.ATTENDEE` at line 110 of `auth.service.ts`. No client-supplied role is accepted.

#### Email/password login
✅ **VERIFIED COMPLETE**
- `POST /auth/login` → `auth.service.ts:login()`
- Validates credentials against Supabase, enforces `email_confirmed_at` (returns `403 EMAIL_NOT_VERIFIED` if unverified), syncs user via `syncUser()`, and issues a JWT.

#### Email verification
✅ **VERIFIED COMPLETE**
- Two separate flows handled: `POST /auth/verify-email` (OTP/token_hash/PKCE code) and `POST /auth/verify-session` (implicit flow access_token from URL hash).
- Frontend handles both in `App.tsx` by mapping `/auth/verify` and `/auth/reset-password` pathnames to the correct screen states on initial load.

#### Password reset
✅ **VERIFIED COMPLETE**
- `POST /auth/forgot-password` → sends Supabase recovery email pointing to `FRONTEND_URL/auth/reset-password`.
- `POST /auth/reset-password` → verifies OTP/code, then calls `supabase.updateUserPassword()`. Password is only stored in Supabase, never in the local DB.

#### Google OAuth
✅ **VERIFIED COMPLETE** (with one caveat — see Bugs section)
- `GET /auth/oauth/google` → returns a redirect URL from Supabase.
- Frontend (`LoginScreen.tsx:57-66`) calls `authApi.initiateGoogleOAuth()` and redirects the browser via `window.location.href = url`.
- Google redirects back to frontend. `OAuthCallbackScreen.tsx` reads the `?code=` param and calls `POST /auth/oauth/callback`.
- Backend calls `supabase.exchangeCodeForSession(code)`, syncs user (defaulting to ATTENDEE role), issues JWT.
- **Caveat**: The frontend OAuth callback redirect URL (Google's configured callback) must point to a frontend path that renders `OAuthCallbackScreen`. This depends entirely on how the Supabase OAuth callback URL is configured in the Google Cloud Console and Supabase dashboard. If misconfigured, the flow silently breaks. This cannot be verified from code alone.

#### Token/session handling
✅ **VERIFIED COMPLETE**
- JWT stored in `localStorage` under key `gatepass_tokens` (see `apiClient.ts:12`).
- `POST /auth/refresh` exchanges a Supabase refresh token for a new access token.
- `apiFetch` in `apiClient.ts` automatically intercepts `401 TOKEN_EXPIRED` and calls `refreshTokens()` once before retrying.
- `JwtStrategy` (`jwt.strategy.ts`) uses `ignoreExpiration: true` and manually checks `payload.exp * 1000 < Date.now()` to emit `TOKEN_EXPIRED` specifically. This is what triggers the frontend refresh loop.

#### Protected routes
✅ **VERIFIED COMPLETE**
- `JwtAuthGuard` is registered as a global `APP_GUARD` in `app.module.ts`.
- Every route is protected by default unless decorated with `@Public()`.
- `RolesGuard` is also global and checks the `user.role` from the JWT payload against `@Roles()` decorators.

---

### Event Creation — Date/Time Bug — VERIFIED CONFIRMED CRASH

❌ **VERIFIED BROKEN**

**Evidence from Node.js execution:**
```
RangeError: Invalid time value
    at Date.toISOString (<anonymous>)
```

**Trace:**

1. `CreateEventScreen.tsx` collects `date` (from `<input type="date">`, produces `YYYY-MM-DD` like `2026-08-24`) and `time` (from `<input type="text">`, user enters free text like `10:00 AM`).
2. `EventsContext.tsx:addEvent()` (line 81) does:
   ```ts
   startsAt: new Date(`${eventData.date}T${eventData.time}`).toISOString()
   // → new Date("2026-08-24T10:00 AM").toISOString()
   // → RangeError: Invalid time value
   ```
3. This crashes *before* any API request is made. Event creation always fails if the user types any 12-hour time format. A 24-hour format like `10:00` would accidentally work, but the placeholder says `e.g. 10:00 AM`, so users will type the wrong format.

**Additional issue — Second blocker:** Even if the date/time were valid, `EventsService.create()` requires the logged-in user to own an `Organization`. There is **no endpoint or UI to create an Organization**. A brand-new user account will always hit:
```
throw new BadRequestException('User does not own an organization');
```
This means **even after fixing the date bug, event creation is still completely blocked** for new users.

---

### Events CRUD

🟡 **VERIFIED PARTIAL**
- `GET /events`, `GET /events/:id`, `PATCH /events/:id`, `DELETE /events/:id` all exist and are wired.
- `POST /events` exists but is **blocked** for any user without a pre-existing Organization record.
- `EventsDashboard.tsx` (lines 56–103) renders a hardcoded `mockEvents` array. **The dashboard does not display real events from the backend.** `EventsContext` is used only by `CreateEventScreen`, not by `EventsDashboard`.
- **The main dashboard is displaying mock data, not real events.**

---

### Attendees

✅ **VERIFIED COMPLETE** (backend/API only; same Organization ownership caveat applies)
- Full CRUD: list (with search/passType filter/pagination), create, update (email change revokes + reissues pass in a DB transaction), delete.
- CSV bulk import with per-row error isolation.
- `AttendeesListScreen.tsx` uses `attendeesApi` (real backend calls, no mocks).
- Ownership check in `assertEventOwner()` confirms only the event organizer can access their attendees.

---

### Halls/Rooms

🟡 **VERIFIED PARTIAL**

**Backend — ✅ Complete**
- Full CRUD at `GET/POST /halls`, `GET/PATCH/DELETE /halls/:id`.
- `hallsApi.ts` exists and is fully typed and correct.
- `POST /halls` and `POST /events` share the same blocker: both require an Organization to exist.

**Frontend — ❌ Disconnected**
- `RoomsScreen.tsx` (lines 26–75) uses `MOCK_ROOMS` constant. No import of `hallsApi`. No `useEffect`. Zero backend calls.
- `hallsApi.ts` exists and is correct but is never imported by `RoomsScreen.tsx`.
- **Exactly what needs to change:** Replace `MOCK_ROOMS` with `useState<Hall[]>([])` + `useEffect` calling `hallsApi.list()`, and wire "Add Room" to `hallsApi.create()`.

---

### Check-In

🟡 **VERIFIED PARTIAL — No Backend Scan Endpoint**

**Prisma schema — ✅ Complete**
- `Pass` model: UUID pass ID, `attendeeId`, `revokedAt`, `checkIn` relation.
- `CheckIn` model: `passId @unique` (prevents double check-in at DB level), `scannedById`, `scannedAt`.
- Double-check-in prevention is enforced at the **database level** (unique constraint on `passId`).

**Backend — ❌ No check-in endpoint exists**
- Searched entire backend source for "check-in", "checkin", "scan". The only result was in `attendees.service.ts` where `checkIn` data is *read back* after finding an attendee's pass — it is never *written*.
- There is no `POST /check-in/:passId` or equivalent endpoint anywhere in the backend.

**Frontend — ❌ Fully mocked**
- `CheckInScreen.tsx`: generates a hardcoded URL `https://event-manager.app/check-in/tech-summit-2026?v=${qrVersion}`. No real pass ID. No API call.
- `CheckInLogScreen.tsx`: renders `MOCK_CHECK_INS` constant. No API call.
- No QR scanner (camera) component exists anywhere in the frontend.

**What is missing to make check-in work end-to-end:**
1. Backend: `POST /check-in/:passId` that creates a `CheckIn` record (with duplicate-prevention via the unique constraint).
2. Backend: `GET /check-in/log/:eventId` to list all check-ins for an event.
3. Frontend `CheckInScreen`: Replace the mock URL with the real `pass.id` from a selected attendee.
4. Frontend: A QR scanner component (e.g., `react-qr-reader`) for door staff to scan physical QR codes.
5. Frontend `CheckInLogScreen`: Replace `MOCK_CHECK_INS` with real API data.

---

### Image Uploads

❌ **VERIFIED BROKEN (Persistent)**

**Exact trace:**
1. `CreateEventScreen.tsx:38` — `const imageUrl = banner ? URL.createObjectURL(banner) : undefined;`
2. `URL.createObjectURL()` generates a browser-local `blob:http://localhost:3000/abc-xyz` URL.
3. This blob URL is passed to `addEvent({ ..., imageUrl })`.
4. `EventsContext.tsx:87` passes it as `logoUrl` to `eventsApi.create()`.
5. Backend `events.service.ts:65` saves it to the `events.logoUrl` column in the database.
6. The blob URL is valid only in the browser session that created it. On refresh, on another device, or for another user, the `img src` pointing to a blob URL will render a broken image.
7. There is no `File` module, no S3 integration, no upload endpoint anywhere in the backend. The `File` Prisma model exists but has no corresponding controller or service.

---

### Role-Based Access Control

🟡 **VERIFIED PARTIAL**

**Backend — ✅ Correctly enforced**
- `RolesGuard` reads `user.role` from the JWT payload (not from the request body — no client trust issue).
- The JWT is signed server-side with `JWT_SECRET`, so the role cannot be forged by a client.
- `@Roles(UserRole.ADMIN)` is applied to `POST /halls`, `POST /events/:eventId/attendees/import`.
- Events controller (`events.controller.ts`) has **no `@Roles` decorator** on write endpoints — any authenticated user can create/update/delete events (subject to the Organization constraint).

**Frontend — ⚠️ Misleading UI, no security impact**
- `LoginScreen.tsx:22` — `const [role, setRole] = useState<UserRole>("ATTENDEE")` with explicit comment: `"Visual only: the real role comes from the server after sign-in."`
- The ADMIN/ATTENDEE toggle only changes the email input placeholder (line 298-302). It has zero effect on what role the backend assigns.
- After login, `onLoginSuccess(user.role)` is called with the *server-returned* role — correct behavior.
- The toggle is **confusing UX but not a security vulnerability**.

---

### Booths/Teams
❌ **VERIFIED NOT IMPLEMENTED**
- `BoothsScreen.tsx` uses only `MOCK_BOOTHS`. No API calls.
- No backend controller, service, or Prisma model for booths. `backend/src` has no `booths` directory.

### Tasks
❌ **VERIFIED NOT IMPLEMENTED**
- `Task` model exists in `schema.prisma` (lines 247-268) with `TaskStatus` and `TaskPriority` enums.
- No backend controller or service for tasks found anywhere in `backend/src`.
- No frontend screen for tasks found.

### Notifications
❌ **VERIFIED NOT IMPLEMENTED**
- `Notification` model exists in `schema.prisma` (lines 274-290).
- No backend controller or service for notifications found.
- No frontend screen for notifications found.

---

## Backend — Dedicated Assessment

### Architecture
✅ **Good**
- Logical module separation: `auth`, `events`, `halls`, `attendees`, `users`, `common`.
- Controllers are thin — delegate all logic to services.
- Dependency injection used correctly throughout.
- Global guards registered correctly via `APP_GUARD`.
- `PrismaModule` is exported globally.

---

### API Endpoints — Complete Inventory

| Method | Route | Auth | Role | Purpose | Frontend Consumer | Status |
|--------|-------|------|------|---------|-------------------|--------|
| POST | `/auth/register` | Public | — | Register user | `authApi.register()` | ✅ |
| POST | `/auth/login` | Public | — | Email/password login | `authApi.login()` | ✅ |
| POST | `/auth/verify-email` | Public | — | Verify email (OTP/token_hash) | `authApi.verifyEmail()` | ✅ |
| POST | `/auth/verify-session` | Public | — | Verify email (implicit access_token) | `authApi.verifySession()` | ✅ |
| POST | `/auth/resend-verification` | Public | — | Resend verification email | `authApi.resendVerification()` | ✅ |
| POST | `/auth/forgot-password` | Public | — | Request password reset | `authApi.forgotPassword()` | ✅ |
| POST | `/auth/reset-password` | Public | — | Set new password | `authApi.resetPassword()` | ✅ |
| POST | `/auth/refresh` | Public | — | Refresh JWT | `apiClient.ts:refreshTokens()` | ✅ |
| GET | `/auth/oauth/google` | Public | — | Get Google OAuth URL | `authApi.initiateGoogleOAuth()` | ✅ |
| POST | `/auth/oauth/callback` | Public | — | Exchange OAuth code for JWT | `authApi.oauthCallback()` | ✅ |
| GET | `/auth/me` | JWT | — | Get current user profile | `authApi.me()` (unused) | ✅ |
| POST | `/events` | JWT | — | Create event | `eventsApi.create()` | ❌ Blocked (no Org) |
| GET | `/events` | JWT | — | List all events | `eventsApi.list()` | ✅ (Dashboard shows mocks) |
| GET | `/events/:id` | JWT | — | Get single event | `eventsApi.get()` | ✅ |
| PATCH | `/events/:id` | JWT | — | Update event | `eventsApi.update()` | ⚠️ No ownership check |
| DELETE | `/events/:id` | JWT | — | Delete event | `eventsApi.remove()` | ⚠️ No ownership check |
| PATCH | `/events/:id/hall` | JWT | — | Assign hall to event | `eventsApi.assignHall()` | ✅ |
| POST | `/halls` | JWT | ADMIN | Create hall | `hallsApi.create()` | ❌ Blocked (no Org) |
| GET | `/halls` | JWT | — | List all halls | `hallsApi.list()` | ✅ (never called by UI) |
| GET | `/halls/:id` | JWT | — | Get single hall | `hallsApi.get()` | ✅ (never called by UI) |
| PATCH | `/halls/:id` | JWT | ADMIN | Update hall | `hallsApi.update()` | ✅ (never called by UI) |
| DELETE | `/halls/:id` | JWT | ADMIN | Delete hall | `hallsApi.remove()` | ✅ (never called by UI) |
| POST | `/events/:eventId/attendees` | JWT | — | Add attendee | `attendeesApi.create()` | ✅ |
| GET | `/events/:eventId/attendees` | JWT | — | List attendees | `attendeesApi.list()` | ✅ |
| POST | `/events/:eventId/attendees/import` | JWT | ADMIN | CSV bulk import | `attendeesApi.importCsv()` | ✅ |
| GET | `/attendees/:id` | JWT | — | Get single attendee | unused | ✅ |
| PATCH | `/attendees/:id` | JWT | — | Update attendee | `attendeesApi.update()` | ✅ |
| DELETE | `/attendees/:id` | JWT | — | Remove attendee | `attendeesApi.remove()` | ✅ |

**Missing endpoints (frontend calls with no backend route):** None detected.

**Backend endpoints with no frontend consumer:**
- `GET /auth/me` — defined, but `authApi.me()` is never called in any component.
- `GET /halls`, `GET/PATCH/DELETE /halls/:id` — `hallsApi` exists but `RoomsScreen` never calls it.

---

### Database / Prisma

✅ **Good (schema)** / ⚠️ **Runtime issue**

**Schema is well-designed:**
- Correct relations, cascade rules, unique constraints.
- Double check-in prevention enforced at DB level (`passId @unique` on `CheckIn`).
- Soft-revoke pattern for passes via `revokedAt DateTime?`.

**Runtime issues:**
- `datasource db` in `schema.prisma` has no `url` field — the database URL comes from `prisma.config.ts` via a driver adapter. If this file or the `DATABASE_URL` env var is absent, the app silently fails to connect.
- No `migrations/` directory was found — only the schema exists. **Prisma migrations have not been confirmed as run.** The database may not match the schema.

---

### Authentication — Backend
✅ **Good**
- Supabase handles all password and credential storage.
- `syncUser()` upserts the local user safely.
- Error messages are intentionally generic on login failures (prevents account enumeration).
- JWT uses HS256 with `JWT_SECRET` from config — correctly validated in `JwtStrategy`.

---

### Authorization — Backend
🟡 **Needs Work**

- `RolesGuard` and `@Roles()` work correctly for ADMIN-only endpoints.
- **Issue:** The `EventsController` has no `@Roles` restriction on write endpoints. Any authenticated `ATTENDEE` user can call `PATCH /events/:id` or `DELETE /events/:id`. No ownership check is performed in `EventsService.update()` or `EventsService.remove()`.

---

### Validation — Backend
🟡 **Needs Work**

- `CreateEventDto` validates title, description, date (ISO), startsAt (ISO), endsAt (ISO), location, capacity (int).
- `hallId` field has only `@IsOptional()` — no type validator (`@IsString()` is missing).
- `EventsController` contains a dead exported class `createEventDto extends PartialType(CreateEventDto)` (line 10) that is never used anywhere.
- Validation pipe is configured with `whitelist: true, forbidNonWhitelisted: true` — correctly prevents unknown fields from reaching services.

---

### Error Handling — Backend
✅ **Good** / 🟡 **One issue**

- `AllExceptionsFilter` catches all unhandled exceptions globally.
- Prisma-specific errors (`P2002`, `P2025`, `P2003`) are mapped to appropriate HTTP status codes.
- Stack traces are logged server-side only — not returned to clients.
- **Issue:** In `EventsService.assignHall()` (line 133): `throw new Error('Hall not found')` instead of `throw new NotFoundException(...)`. This will be caught by the global filter and returned as `500 Internal Server Error` instead of `404 Not Found`.

---

### Security Assessment

| Check | Status | Note |
|-------|--------|------|
| Passwords stored in DB | ✅ Safe | Never — Supabase only |
| JWT secret hardcoded | ✅ Safe | Read from `JWT_SECRET` env var |
| Role from client trusted | ✅ Safe | Role comes from DB/JWT payload only |
| Missing auth on sensitive endpoints | ✅ Safe | All routes protected globally by default |
| Missing ownership check on event write endpoints | ⚠️ Risk | Any ATTENDEE can PATCH/DELETE any event |
| Blob URLs saved to DB | ❌ Broken | Correctness issue, not a security issue |
| CORS | ✅ Good | Reads `FRONTEND_URL` env var; no wildcard `*` |
| Input validation | 🟡 Partial | Missing `@IsString()` on `hallId` |
| Error details exposed to client | ✅ Safe | Stack traces never sent to client |

---

### Production Readiness

🟡 **Needs Work**

| Item | Status | Note |
|------|--------|------|
| `.env` files | ⚠️ Missing | No `.env` or `.env.example` in either project — relies entirely on Railway-injected env vars |
| CORS | ✅ | Reads from `FRONTEND_URL` env var |
| Frontend API URL | ✅ | Reads `VITE_API_URL`; falls back to `localhost:4000` |
| Prisma migrations | ⚠️ Unverified | No `migrations/` folder found; `prisma migrate deploy` script exists but may never have been run |
| `bullmq` / Redis | ❌ Unused | Dependency installed, never imported or used in any module |
| Production start script | ✅ | `node dist/main.js` — correct for Railway |
| `prebuild` script | ✅ | Runs `prisma:generate` before build |
| Hardcoded localhost | ✅ Acceptable | Only as fallback in `apiClient.ts` |

---

## What Is Already Done

| Feature | Evidence |
|---------|----------|
| Email/Password Auth (register, login, logout) | `auth.controller.ts`, `auth.service.ts`, `LoginScreen.tsx` |
| Email Verification (both flow types) | `auth.service.ts:verifyEmail()`, `auth.service.ts:verifySession()` |
| Password Reset | `auth.service.ts:forgotPassword()`, `auth.service.ts:resetPassword()` |
| Google OAuth | `auth.service.ts:handleOAuthCallback()`, `OAuthCallbackScreen.tsx` |
| JWT issue, refresh, and auto-refresh | `auth.service.ts:signToken()`, `apiClient.ts:apiFetch()` |
| Events API (list, get, update, delete) | `events.controller.ts`, `events.service.ts`, `eventsApi.ts` |
| Attendees CRUD + CSV import | `attendees.controller.ts`, `attendees.service.ts`, `AttendeesListScreen.tsx` |
| QR pass issuance (on attendee create/update) | `attendees.service.ts:issuePass()` |
| Halls backend API | `halls.controller.ts`, `halls.service.ts` |
| DB schema (all models) | `schema.prisma` |
| Global error handling | `all-exceptions.filter.ts` |
| CORS, validation pipe, global guards | `main.ts`, `app.module.ts` |

---

## What Is Actually Broken

| Issue | Severity | Location |
|-------|----------|----------|
| **Event creation crashes** — `"10:00 AM"` parsed as ISO produces `RangeError: Invalid time value` | 🔴 Critical | `EventsContext.tsx:81-83` |
| **Event creation blocked** — new users have no Organization, causing `400 Bad Request` | 🔴 Critical | `events.service.ts:11-18`; no Organization creation UI/API exists |
| **Dashboard shows mock events** — `EventsDashboard.tsx` uses hardcoded `mockEvents`, not `eventsApi.list()` | 🔴 Critical | `EventsDashboard.tsx:56-103` |
| **Image upload saves a blob URL** — `URL.createObjectURL()` result saved to DB, broken after session ends | 🟠 High | `CreateEventScreen.tsx:38`, `EventsContext.tsx:87` |
| **PATCH/DELETE events unprotected by role/ownership** — any ATTENDEE can modify/delete any event | 🟠 High | `events.controller.ts`, `events.service.ts` |
| **`assignHall` throws generic `Error`** — returns `500` instead of `404` when hall not found | 🟡 Medium | `events.service.ts:133` |
| **Dead class in events controller** — `createEventDto extends PartialType(CreateEventDto)` never used | 🟢 Low | `events.controller.ts:10` |
| **`bullmq`/Redis dependency installed but unused** | 🟢 Low | `backend/package.json` |
| **No `.env.example`** — local setup not documented | 🟢 Low | Project root |
| **No Prisma migrations folder** — DB may not be in sync with schema | 🟡 Medium | `backend/prisma/` |

---

## What Is Missing

| Feature | Notes |
|---------|-------|
| **Organization creation** | Required before events or halls can be created. No API, no UI. |
| **Check-in API** (`POST /check-in/:passId`) | DB schema and models exist; service/controller do not |
| **Check-in log API** (`GET /check-in/log/:eventId`) | Backend entirely missing |
| **QR scanner in frontend** | Camera-based scanning UI needed for door staff |
| **Real events on dashboard** | `EventsDashboard` must be wired to `eventsApi.list()` |
| **Rooms/Halls frontend wiring** | `RoomsScreen` must use `hallsApi` instead of mock data |
| **File upload infrastructure** | S3 or equivalent; backend `File` module; upload endpoint |
| **Tasks feature** | DB schema exists; no backend API, no frontend UI |
| **Notifications feature** | DB schema exists; no backend API, no frontend UI |
| **Booths/Teams feature** | No DB schema, no backend, no real frontend implementation |

---

## Recommended Implementation Order

> Fix breaking bugs first, then unlock blocked features, then add new ones.

### Phase 1 — Fix what's broken (unblock existing functionality)

1. **Fix date/time parsing in `EventsContext.tsx`** — Parse `"10:00 AM"` correctly before constructing the ISO string (convert to 24-hour format or use `<input type="time">`).
2. **Implement Organization auto-creation on first login** — After login/register, check if the user has an Organization; if not, create one automatically (or add a one-time setup screen). Without this, neither events nor halls can be created by any user.
3. **Wire `EventsDashboard.tsx` to real backend data** — Replace `mockEvents` array with real data from `eventsApi.list()` or the `useEvents()` context.

### Phase 2 — Fix authorization and correctness

4. **Add ownership checks to event PATCH and DELETE** — Confirm the requesting user is the event organizer before allowing writes.
5. **Fix `assignHall` error throw** — Replace `throw new Error('Hall not found')` with `throw new NotFoundException('Hall not found')`.
6. **Wire `RoomsScreen.tsx` to `hallsApi`** — Replace `MOCK_ROOMS` with real API data.

### Phase 3 — Implement the core missing feature (Check-In)

7. **Backend**: Add `POST /check-in/:passId` — validate pass exists and is not revoked, create `CheckIn` record.
8. **Backend**: Add `GET /events/:eventId/check-ins` — list check-ins for the event admin log view.
9. **Frontend**: Wire `CheckInScreen.tsx` to real pass IDs and API.
10. **Frontend**: Wire `CheckInLogScreen.tsx` to real check-in log API.
11. **Frontend**: Add a QR scanner component for door-staff use.

### Phase 4 — Image uploads

12. **Backend**: Implement file upload endpoint (Supabase Storage or S3) and a `File` module with controller/service.
13. **Frontend**: Replace `URL.createObjectURL()` with a real multipart upload request.

### Phase 5 — New features

14. Tasks module (backend controller/service + frontend UI)
15. Notifications module (backend controller/service + frontend UI)
16. Booths/Teams module (Prisma schema + backend + frontend)

---

*End of second-pass audit. No code was modified.*

