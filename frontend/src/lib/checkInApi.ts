import { apiRequest } from "./apiClient";
import { attendeesApi, type Attendee } from "./attendeesApi";

/** Exact response shape returned by POST /check-in. */
export interface ScanResult {
  message: string;
  checkInId: string;
  scannedAt: string;
  attendee: {
    id: string;
    name: string;
    email: string;
  };
  event: {
    id: string;
    title: string;
    date: string;
    startsAt: string;
    endsAt: string | null;
  };
  hall: {
    id: string;
    name: string;
    address: string | null;
  } | null;
}

/**
 * The backend does not expose a separate check-in-history endpoint. The
 * attendee endpoint does expose each attendee's latest check-in timestamp,
 * which is enough to build the dashboard's current-event log.
 */
export interface CheckInLogEntry {
  id: string;
  scannedAt: string;
  attendee: Pick<Attendee, "id" | "name" | "email">;
}

async function listEventCheckIns(eventId: string): Promise<CheckInLogEntry[]> {
  const firstPage = await attendeesApi.list(eventId, { take: 100, skip: 0 });
  const attendees = [...firstPage.data];

  for (let skip = attendees.length; skip < firstPage.total; skip += 100) {
    const page = await attendeesApi.list(eventId, { take: 100, skip });
    attendees.push(...page.data);
  }

  return attendees
    .filter((attendee): attendee is Attendee & { checkIn: { scannedAt: string } } => attendee.checkIn !== null)
    .map((attendee) => ({
      id: attendee.id,
      scannedAt: attendee.checkIn.scannedAt,
      attendee: {
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
      },
    }))
    .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
}

export const checkInApi = {
  /** Sends the opaque QR token as the body required by the external API. */
  scanPass(qrToken: string): Promise<ScanResult> {
    return apiRequest<ScanResult>({
      url: "/check-in",
      method: "POST",
      data: { qrToken },
    });
  },

  /** See CheckInLogEntry: this is derived from the supported attendee API. */
  listEventCheckIns,
};
