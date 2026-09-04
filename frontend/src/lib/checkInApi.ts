import { apiFetch } from "./apiClient";

export interface ScanResult {
  success: boolean;
  message: string;
  checkIn: {
    id: string;
    scannedAt: string;
    attendee: {
      id: string;
      name: string;
      email: string;
      passType: string;
    };
    event: {
      id: string;
      title: string;
    };
    scannedBy: {
      id: string;
      name: string;
      email: string;
    } | null;
  };
}

export interface CheckInLogEntry {
  id: string;
  scannedAt: string;
  passId: string;
  attendee: {
    id: string;
    name: string;
    email: string;
    passType: string;
  };
  scannedBy: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export const checkInApi = {
  /**
   * Scans an attendee passId (UUID) to record check-in.
   */
  scanPass(passId: string): Promise<ScanResult> {
    return apiFetch<ScanResult>(`/check-in/${passId}`, {
      method: "POST",
    });
  },

  /**
   * Gets all check-in log entries for an event.
   */
  getEventCheckIns(eventId: string): Promise<CheckInLogEntry[]> {
    return apiFetch<CheckInLogEntry[]>(`/events/${eventId}/check-ins`);
  },
};

