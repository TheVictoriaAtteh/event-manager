import { apiRequest } from "./apiClient";

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

  remove(id: string): Promise<{ success: true }> {
    return apiRequest<{ success: true }>({ url: `/attendees/${id}`, method: "DELETE" });
  },

  importCsv(eventId: string, file: File): Promise<CsvImportResult> {
    const formData = new FormData();
    formData.append("file", file);
    return apiRequest<CsvImportResult>({
      url: `/events/${eventId}/attendees/import`,
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};