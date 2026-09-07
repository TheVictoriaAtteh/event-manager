import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  ClipboardList,
  Clock,
  User,
  CheckCircle,
  Download,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { checkInApi, type CheckInLogEntry } from "../../lib/checkInApi";
import { eventsApi } from "../../lib/eventsApi";
import type { Event } from "../../api/interfaces/events";

interface CheckInLogScreenProps {
  eventId?: string;
  onBack: () => void;
}

const CheckInLogScreen: React.FC<CheckInLogScreenProps> = ({
  eventId,
  onBack,
}) => {
  const [records, setRecords] = useState<CheckInLogEntry[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Determine active event
      let targetEventId = eventId;
      if (!targetEventId) {
        const events = await eventsApi.list();
        if (events.length > 0) {
          targetEventId = events[0].id;
          setCurrentEvent(events[0]);
        }
      } else {
        const ev = await eventsApi.get(targetEventId);
        setCurrentEvent(ev);
      }

      if (targetEventId) {
        const log = await checkInApi.getEventCheckIns(targetEventId);
        setRecords(log);
      } else {
        setRecords([]);
      }
    } catch (err: any) {
      console.error("Failed to load check-in log:", err);
      setError(err?.message || "Failed to load check-in records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [eventId]);

  const filteredRecords = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return records.filter(
      (record) =>
        record.attendee.name.toLowerCase().includes(search) ||
        record.attendee.email.toLowerCase().includes(search) ||
        record.attendee.passType.toLowerCase().includes(search) ||
        (record.scannedBy?.name &&
          record.scannedBy.name.toLowerCase().includes(search))
    );
  }, [records, searchTerm]);

  const totalCheckIns = records.length;
  const latestCheckIn = records.length > 0 ? records[0] : null;

  const exportCsvLog = () => {
    if (records.length === 0) return;

    const headers = ["CheckIn ID", "Attendee Name", "Attendee Email", "Pass Type", "Scanned At", "Scanned By"];
    const rows = records.map((r) => [
      r.id,
      `"${r.attendee.name.replace(/"/g, '""')}"`,
      `"${r.attendee.email.replace(/"/g, '""')}"`,
      `"${r.attendee.passType.replace(/"/g, '""')}"`,
      `"${new Date(r.scannedAt).toLocaleString()}"`,
      `"${r.scannedBy?.name ?? "System"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `check_in_log_${currentEvent?.title.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "event"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)] font-sans">
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* BACK BUTTON */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={onBack}
              className="
                inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                hover:bg-emerald-500/10 transition-colors cursor-pointer
              "
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>

            <button
              onClick={() => void loadData()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-default)] hover:bg-[var(--hover-surface)] transition-colors cursor-pointer text-[var(--text-secondary)]"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Log
            </button>
          </div>

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5 text-emerald-500" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                  Check-In Log
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  View and monitor real-time attendee entry activity.
                </p>
              </div>
            </div>

            {/* EXPORT */}
            <button
              onClick={exportCsvLog}
              disabled={records.length === 0}
              className="
                inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                bg-[var(--bg-surface)] border border-[var(--border-default)]
                text-[var(--text-secondary)] hover:text-emerald-500 hover:border-emerald-500/40
                text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <Download className="w-4 h-4" />
              Export Log (CSV)
            </button>
          </div>

          {/* EVENT BANNER */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 mb-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-semibold uppercase tracking-wider">
                  Admin Audit Log
                </span>

                <h2 className="text-lg font-bold text-[var(--text-primary)] mt-3">
                  {currentEvent?.title || "Event Log"}
                </h2>

                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {currentEvent?.date || "Event Date"}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Live database synced
              </div>
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* TOTAL CHECK-INS */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-2">
                    Total Verified Entry Check-Ins
                  </p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {isLoading ? "—" : totalCheckIns}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            </div>

            {/* LATEST CHECK-IN */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-2">
                    Latest Check-In Time
                  </p>
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    {isLoading
                      ? "—"
                      : latestCheckIn
                      ? new Date(latestCheckIn.scannedAt).toLocaleTimeString()
                      : "No check-ins yet"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          {/* LOG TABLE */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
            {/* TABLE HEADER */}
            <div className="p-6 border-b border-[var(--border-subtle)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                    Check-In Activity
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    A record of everyone who has passed door check-in.
                  </p>
                </div>

                {/* SEARCH */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search attendee, pass, or staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-lg text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* LOADING STATE */}
            {isLoading && (
              <div className="py-20 text-center flex items-center justify-center text-[var(--text-secondary)]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mr-3" />
                <span className="text-sm font-medium">Loading check-in log…</span>
              </div>
            )}

            {/* ERROR STATE */}
            {!isLoading && error && (
              <div className="p-6 m-6 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* TABLE */}
            {!isLoading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                      <th className="px-6 py-4 text-xs font-semibold">Attendee</th>
                      <th className="px-6 py-4 text-xs font-semibold">Pass Type</th>
                      <th className="px-6 py-4 text-xs font-semibold">Date & Time</th>
                      <th className="px-6 py-4 text-xs font-semibold">Scanned By</th>
                      <th className="px-6 py-4 text-xs font-semibold">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-[var(--border-subtle)] last:border-b-0 hover:bg-emerald-500/5 transition-colors"
                      >
                        {/* ATTENDEE */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[var(--text-primary)]">
                                {record.attendee.name}
                              </p>
                              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                {record.attendee.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* PASS TYPE */}
                        <td className="px-6 py-4 text-xs text-[var(--text-secondary)] font-medium">
                          <span className="px-2.5 py-1 rounded bg-[var(--bg-input)] border border-[var(--border-default)] font-semibold">
                            {record.attendee.passType}
                          </span>
                        </td>

                        {/* DATE & TIME */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col text-xs text-[var(--text-secondary)]">
                            <span className="font-semibold text-[var(--text-primary)]">
                              {new Date(record.scannedAt).toLocaleDateString()}
                            </span>
                            <span className="text-[var(--text-muted)] font-mono">
                              {new Date(record.scannedAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </td>

                        {/* SCANNED BY */}
                        <td className="px-6 py-4 text-xs text-[var(--text-secondary)]">
                          {record.scannedBy?.name || "Door Staff"}
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                            <CheckCircle className="w-3 h-3" />
                            Checked In
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* EMPTY STATE */}
            {!isLoading && !error && filteredRecords.length === 0 && (
              <div className="py-16 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  No check-in records found
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {records.length === 0
                    ? "No attendees have checked in for this event yet."
                    : "Try changing your search query."}
                </p>
              </div>
            )}
          </div>

          {/* ADMIN NOTICE */}
          <div className="flex items-center justify-center gap-2 mt-5 text-xs text-[var(--text-muted)]">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            This check-in log is visible to event administrators and organizers only.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInLogScreen;