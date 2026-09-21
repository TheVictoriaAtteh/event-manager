import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ClipboardList, Clock, User, CheckCircle, Download, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { checkInApi, type CheckInLogEntry } from "../../lib/checkInApi";
import { ApiError } from "../../lib/apiClient";
import { eventsApi } from "../../lib/eventsApi";
import type { Event } from "../../api/interfaces/events";

interface CheckInLogScreenProps {
  eventId?: string;
  onBack: () => void;
}

const CheckInLogScreen: React.FC<CheckInLogScreenProps> = ({ eventId, onBack }) => {
  const [records, setRecords] = useState<CheckInLogEntry[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      let targetEvent: Event | undefined;

      if (eventId) {
        targetEvent = await eventsApi.get(eventId);
      } else {
        targetEvent = (await eventsApi.list())[0];
      }

      setCurrentEvent(targetEvent ?? null);
      setRecords(targetEvent ? await checkInApi.listEventCheckIns(targetEvent.id) : []);
    } catch (err) {
      console.error("Failed to load check-in activity:", err);
      setError(err instanceof ApiError || err instanceof Error ? err.message : "Failed to load check-in activity.");
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => { void Promise.resolve().then(loadData); }, [loadData]);

  const filteredRecords = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return search ? records.filter((record) => record.attendee.name.toLowerCase().includes(search) || record.attendee.email.toLowerCase().includes(search)) : records;
  }, [records, searchTerm]);

  const latestCheckIn = records[0] ?? null;

  const exportCsvLog = () => {
    if (!records.length) return;
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = records.map((record) => [escape(record.attendee.name), escape(record.attendee.email), escape(new Date(record.scannedAt).toLocaleString())]);
    const csv = ["Attendee Name,Attendee Email,Checked In At", ...rows.map((row) => row.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `check_in_log_${(currentEvent?.title || "event").replace(/[^a-z0-9]/gi, "_").toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)] font-sans">
      <div className="min-h-screen p-6"><div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <button onClick={onBack} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-emerald-500/10 transition-colors cursor-pointer"><ArrowLeft className="w-4 h-4" />Back to Dashboard</button>
          <button onClick={() => void loadData()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-default)] hover:bg-[var(--hover-surface)] transition-colors cursor-pointer text-[var(--text-secondary)]"><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8">
          <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0"><ClipboardList className="w-5 h-5 text-emerald-500" /></div><div><h1 className="text-2xl font-bold text-[var(--text-primary)]">Check-In Log</h1><p className="text-sm text-[var(--text-secondary)] mt-1">Monitor attendee entry activity for the selected event.</p></div></div>
          <button onClick={exportCsvLog} disabled={!records.length} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-emerald-500 hover:border-emerald-500/40 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"><Download className="w-4 h-4" />Export CSV</button>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 mb-5 shadow-sm">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-semibold uppercase tracking-wider">Admin activity</span>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mt-3">{currentEvent?.title || "No event selected"}</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{currentEvent?.date || "Create an event to begin recording check-ins."}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5"><div className="flex items-center justify-between"><div><p className="text-xs text-[var(--text-muted)] mb-2">Total Checked In</p><p className="text-2xl font-bold text-[var(--text-primary)]">{isLoading ? "—" : records.length}</p></div><div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><User className="w-5 h-5 text-emerald-500" /></div></div></div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5"><div className="flex items-center justify-between"><div><p className="text-xs text-[var(--text-muted)] mb-2">Latest Check-In</p><p className="text-lg font-bold text-[var(--text-primary)]">{isLoading ? "—" : latestCheckIn ? new Date(latestCheckIn.scannedAt).toLocaleTimeString() : "No check-ins yet"}</p></div><div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><Clock className="w-5 h-5 text-emerald-500" /></div></div></div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[var(--border-subtle)]"><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h2 className="text-sm font-semibold text-[var(--text-primary)]">Check-In Activity</h2><p className="text-xs text-[var(--text-muted)] mt-1">Attendees whose active pass has been checked in.</p></div><div className="relative w-full sm:w-72"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" /><input type="search" placeholder="Search attendee or email…" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-lg text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-emerald-500" /></div></div></div>
          {isLoading && <div className="py-20 text-center flex items-center justify-center text-[var(--text-secondary)]"><Loader2 className="w-8 h-8 animate-spin text-emerald-500 mr-3" /><span className="text-sm font-medium">Loading check-in activity…</span></div>}
          {!isLoading && error && <div className="p-6 m-6 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
          {!isLoading && !error && filteredRecords.length > 0 && <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]"><th className="px-6 py-4 text-xs font-semibold">Attendee</th><th className="px-6 py-4 text-xs font-semibold">Date & Time</th><th className="px-6 py-4 text-xs font-semibold">Status</th></tr></thead><tbody>{filteredRecords.map((record) => <tr key={record.id} className="border-b border-[var(--border-subtle)] last:border-b-0 hover:bg-emerald-500/5 transition-colors"><td className="px-6 py-4"><p className="text-sm font-medium text-[var(--text-primary)]">{record.attendee.name}</p><p className="text-xs text-[var(--text-muted)] mt-0.5">{record.attendee.email}</p></td><td className="px-6 py-4"><div className="flex flex-col text-xs text-[var(--text-secondary)]"><span className="font-semibold text-[var(--text-primary)]">{new Date(record.scannedAt).toLocaleDateString()}</span><span className="text-[var(--text-muted)] font-mono">{new Date(record.scannedAt).toLocaleTimeString()}</span></div></td><td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"><CheckCircle className="w-3 h-3" />Checked In</span></td></tr>)}</tbody></table></div>}
          {!isLoading && !error && filteredRecords.length === 0 && <div className="py-16 text-center"><ClipboardList className="w-5 h-5 text-emerald-500 mx-auto mb-3" /><h3 className="text-sm font-semibold text-[var(--text-primary)]">No check-in records found</h3><p className="text-xs text-[var(--text-muted)] mt-1">{records.length ? "Try changing your search query." : "No attendees have checked in for this event yet."}</p></div>}
        </div>
        <p className="mt-5 text-center text-xs text-[var(--text-muted)]">This view is generated from the current attendee check-in status provided by the backend.</p>
      </div></div>
    </div>
  );
};

export default CheckInLogScreen;
