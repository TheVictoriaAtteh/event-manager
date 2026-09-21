import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  MapPin,
  Search,
  UserCheck,
  Users,
} from "lucide-react";
import type { Event } from "../../api/interfaces/events";
import { attendeesApi, type Attendee } from "../../lib/attendeesApi";
import { eventsApi } from "../../lib/eventsApi";
import { ApiError } from "../../lib/apiClient";

interface EventDetailsScreenProps {
  eventId: string;
  onBack: () => void;
  onManageAttendees?: () => void;
}

export const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({
  eventId,
  onBack,
  onManageAttendees,
}) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!eventId) return;
    setIsLoading(true);
    setError("");
    try {
      const [eventResult, attendeesResult] = await Promise.all([
        eventsApi.get(eventId),
        attendeesApi.list(eventId, { take: 100 }),
      ]);
      setEvent(eventResult);
      setAttendees(attendeesResult.data);
      setTotal(attendeesResult.total);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load this event.");
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const filteredAttendees = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return attendees;
    return attendees.filter(
      (attendee) =>
        attendee.name.toLowerCase().includes(query) ||
        attendee.email.toLowerCase().includes(query),
    );
  }, [attendees, searchTerm]);

  const startTime = event ? new Date(event.startsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "";
  const endTime = event ? new Date(event.endsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "";

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)] p-6">
      <div className="max-w-[1500px] mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <button onClick={onBack} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-accent)] hover:bg-[var(--hover-surface)] font-medium transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </button>
          {onManageAttendees && event && (
            <button onClick={onManageAttendees} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-semibold transition-colors cursor-pointer shadow-lg shadow-emerald-500/10">
              <Users className="w-4 h-4" /> Manage Attendees
            </button>
          )}
        </div>

        {isLoading && <div className="py-24 flex flex-col items-center text-[var(--text-secondary)]"><Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />Loading event…</div>}
        {!isLoading && error && <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 flex gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}

        {!isLoading && !error && event && <>
          <section className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl overflow-hidden shadow-sm">
            {event.logoUrl && <img src={event.logoUrl} alt="" className="h-56 w-full object-cover" />}
            <div className="p-6 space-y-4">
              <div>
                {event.category && <span className="inline-flex px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[var(--text-accent)] text-[10px] font-semibold rounded-full uppercase tracking-wider">{event.category}</span>}
                <h1 className="text-2xl font-bold text-[var(--text-heading)] mt-2">{event.title}</h1>
                <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-3xl">{event.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--border-subtle)] text-sm">
                <div className="flex items-center gap-2.5 text-[var(--text-secondary)]"><Calendar className="w-4 h-4 text-[var(--text-accent)]" />{event.date}</div>
                <div className="flex items-center gap-2.5 text-[var(--text-secondary)]"><Clock className="w-4 h-4 text-[var(--text-accent)]" />{startTime} – {endTime}</div>
                <div className="flex items-center gap-2.5 text-[var(--text-secondary)]"><MapPin className="w-4 h-4 text-[var(--text-accent)]" />{event.location}</div>
              </div>
              <p className="text-xs text-[var(--text-muted)]">Capacity: {event.capacity}{event.hall ? ` · ${event.hall.name}` : ""}</p>
            </div>
          </section>

          <section className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-2"><Users className="w-5 h-5 text-[var(--text-accent)]" /><h2 className="text-base font-bold text-[var(--text-heading)]">Registered Attendees</h2><span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[var(--text-accent)] text-xs font-semibold rounded-md">{total}</span></div>
              <div className="relative w-full sm:w-64"><Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" /><input type="search" placeholder="Search name or email…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-8 pr-3 py-2 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500" /></div>
            </div>
            {filteredAttendees.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]"><th className="p-3">Attendee</th><th className="p-3">Pass</th><th className="p-3">Registered</th><th className="p-3">Status</th></tr></thead><tbody>{filteredAttendees.map((attendee) => <tr key={attendee.id} className="border-b border-[var(--border-subtle)] last:border-0"><td className="p-3"><p className="font-medium">{attendee.name}</p><p className="text-xs text-[var(--text-secondary)]">{attendee.email}</p></td><td className="p-3">{attendee.passType}</td><td className="p-3 text-xs text-[var(--text-secondary)]">{new Date(attendee.createdAt).toLocaleDateString()}</td><td className="p-3">{attendee.checkIn ? <span className="inline-flex items-center gap-1 text-emerald-500 text-xs font-semibold"><UserCheck className="w-3.5 h-3.5" />Checked in</span> : <span className="text-xs text-[var(--text-secondary)]">Registered</span>}</td></tr>)}</tbody></table></div> : <p className="py-10 text-center text-sm text-[var(--text-muted)]">No attendees match your search.</p>}
          </section>
        </>}
      </div>
    </div>
  );
};
