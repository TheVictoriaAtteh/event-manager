import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Search, UserCheck, Trash2, UserPlus, Upload, Users, Loader2 } from "lucide-react";
import { attendeesApi, type Attendee } from "../../lib/attendeesApi";
import { ApiError } from "../../lib/apiClient";

interface AttendeesListScreenProps {
  eventId: string;
  onBack: () => void;
  onAddAttendee: () => void;
  onUploadAttendees: () => void;
}

export const AttendeesListScreen: React.FC<AttendeesListScreenProps> = ({
  eventId,
  onBack,
  onAddAttendee,
  onUploadAttendees,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [passTypeFilter, setPassTypeFilter] = useState("");
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const load = useCallback(
    async (search?: string, passType?: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await attendeesApi.list(eventId, {
          search: search || undefined,
          passType: passType || undefined,
          take: 100,
        });
        setAttendees(res.data);
        setTotal(res.total);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Could not load attendees.");
      } finally {
        setLoading(false);
      }
    },
    [eventId],
  );

  // Debounced search so we don't hammer the API on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => void load(searchTerm.trim() || undefined, passTypeFilter || undefined), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, passTypeFilter, load]);

  const handleRemove = async (id: string, name: string) => {
    if (!window.confirm(`Remove ${name} and their pass?`)) return;
    setRemovingId(id);
    setError("");
    try {
      await attendeesApi.remove(id);
      setAttendees((prev) => prev.filter((a) => a.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not remove attendee.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)] font-sans">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <button onClick={onUploadAttendees} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-default)] text-sm font-medium text-[var(--text-primary)] hover:border-emerald-500/50 hover:text-[var(--text-accent)] transition-all cursor-pointer">
              <Upload className="w-4 h-4" /> Upload CSV
            </button>
            <button onClick={onAddAttendee} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-sm font-semibold transition-colors cursor-pointer shadow-lg shadow-emerald-500/10">
              <UserPlus className="w-4 h-4" /> Add Attendee
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-heading)]">Attendees</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {total} attendee{total === 1 ? "" : "s"} registered for this event.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name or email…" className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20" />
          </div>
          <input value={passTypeFilter} onChange={(e) => setPassTypeFilter(e.target.value)} placeholder="Filter by pass type (e.g. VIP)…" className="sm:w-64 px-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20" />
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-lg text-sm text-red-500 bg-red-500/10 border border-red-500/20">{error}</div>
        )}

        <div className="overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  <th className="p-4">Attendee</th>
                  <th className="p-4">Pass Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
{!loading &&
                  attendees.map((a) => (
                    <tr key={a.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--hover-surface)]">
                      <td className="p-4">
                        <div className="font-medium text-[var(--text-primary)]">{a.name}</div>
                        <div className="text-xs text-[var(--text-secondary)]">{a.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">{a.passType}</span>
                      </td>
                      <td className="p-4">
                        {a.checkIn ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-500/10 border border-sky-500/20 text-sky-500">
                            <UserCheck className="w-3.5 h-3.5" /> Checked In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">Registered</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => void handleRemove(a.id, a.name)} disabled={removingId === a.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer disabled:opacity-60">
                          <Trash2 className="w-3.5 h-3.5" /> {removingId === a.id ? "Removing…" : "Remove"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {loading && (
            <div className="py-16 flex flex-col items-center gap-3 text-[var(--text-secondary)]">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="text-sm">Loading attendees…</p>
            </div>
          )}

          {!loading && !error && attendees.length === 0 && (
            <div className="py-16 text-center">
              <Users className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">No attendees found</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">Add attendees manually or upload a CSV to get started.</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button onClick={onAddAttendee} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-sm font-semibold cursor-pointer">
                  <UserPlus className="w-4 h-4" /> Add Attendee
                </button>
                <button onClick={onUploadAttendees} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-default)] text-sm font-medium cursor-pointer">
                  <Upload className="w-4 h-4" /> Upload CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeesListScreen;