import { apiRequest } from "./apiClient";

/** The API deliberately does not return a QR token from attendee management. */
export interface AttendeePass {
  id: string;
  revokedAt: string | null;
}

export interface Attendee {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  /** The latest pass, if one has been issued for this attendee. */
  pass: AttendeePass | null;
  /** Set when the attendee's latest pass has been checked in. */
  checkIn: { scannedAt: string } | null;
}

export interface AttendeeListResult {
  data: Attendee[];
  total: number;
}

/** POST /events/:eventId/attendees accepts only these two fields. */
export interface CreateAttendeeInput {
  name: string;
  email: string;
}

export interface UpdateAttendeeInput {
  name?: string;
  email?: string;
}

export interface CsvImportResult {
  totalRows: number;
  created: number;
  duplicates: number;
  errors: { rowNumber: number; message: string }[];
  message: string;
}

export interface ListAttendeesParams {
  search?: string;
  take?: number;
  skip?: number;
}

function toQuery(params: ListAttendeesParams): string {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  if (params.take !== undefined) q.set("take", String(params.take));
  if (params.skip !== undefined) q.set("skip", String(params.skip));
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const attendeesApi = {
  list(eventId: string, params: ListAttendeesParams = {}): Promise<AttendeeListResult> {
    return apiRequest<AttendeeListResult>({
      url: `/events/${eventId}/attendees${toQuery(params)}`,
      method: "GET",
    });
  },

  create(eventId: string, input: CreateAttendeeInput): Promise<Attendee> {
    return apiRequest<Attendee>({ url: `/events/${eventId}/attendees`, method: "POST", data: input });
  },

  update(id: string, input: UpdateAttendeeInput): Promise<Attendee> {
    return apiRequest<Attendee>({ url: `/attendees/${id}`, method: "PATCH", data: input });
  },

  remove(id: string): Promise<void> {
    return apiRequest<void>({ url: `/attendees/${id}`, method: "DELETE" });
  },

  importCsv(eventId: string, file: File): Promise<CsvImportResult> {
    const formData = new FormData();
    formData.append("file", file);
    return apiRequest<CsvImportResult>({
      url: `/events/${eventId}/attendees/import`,
      method: "POST",
      data: formData,
      // Axios adds the multipart boundary for a FormData body.
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
