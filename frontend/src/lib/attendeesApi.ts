import { apiFetch } from "./apiClient";

export interface AttendeePass {
  id: string;
  revokedAt: string | null;
}

export interface Attendee {
  id: string;
  eventId: string;
  name: string;
  email: string;
  passType: string;
  createdAt: string;
  updatedAt: string;
  /** Latest (most recently created) pass for this attendee. */
  pass: AttendeePass | null;
  /** Set when the latest pass has been checked in. */
  checkIn: { scannedAt: string } | null;
}

export interface AttendeeListResult {
  data: Attendee[];
  total: number;
}

export interface CreateAttendeeInput {
  name: string;
  email: string;
  passType?: string;
}

export interface UpdateAttendeeInput {
  name?: string;
  email?: string;
  passType?: string;
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
  passType?: string;
  take?: number;
  skip?: number;
}

function toQuery(params: ListAttendeesParams): string {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  if (params.passType) q.set("passType", params.passType);
  if (params.take !== undefined) q.set("take", String(params.take));
  if (params.skip !== undefined) q.set("skip", String(params.skip));
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const attendeesApi = {
  list(eventId: string, params: ListAttendeesParams = {}): Promise<AttendeeListResult> {
    return apiFetch<AttendeeListResult>(
      `/events/${eventId}/attendees${toQuery(params)}`,
    );
  },

  create(eventId: string, input: CreateAttendeeInput): Promise<Attendee> {
    return apiFetch<Attendee>(`/events/${eventId}/attendees`, {
      method: "POST",
      body: input,
    });
  },

  update(id: string, input: UpdateAttendeeInput): Promise<Attendee> {
    return apiFetch<Attendee>(`/attendees/${id}`, {
      method: "PATCH",
      body: input,
    });
  },

  remove(id: string): Promise<{ success: true }> {
    return apiFetch<{ success: true }>(`/attendees/${id}`, {
      method: "DELETE",
    });
  },

  importCsv(eventId: string, file: File): Promise<CsvImportResult> {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<CsvImportResult>(`/events/${eventId}/attendees/import`, {
      method: "POST",
      formData,
    });
  },
};