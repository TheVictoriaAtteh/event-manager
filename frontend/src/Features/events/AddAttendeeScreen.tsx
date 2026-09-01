import React, { useState } from "react";
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";
import { attendeesApi } from "../../lib/attendeesApi";
import { ApiError } from "../../lib/apiClient";

interface AddAttendeeScreenProps {
  eventId: string;
  onBack: () => void;
  onDone: () => void;
}

export const AddAttendeeScreen: React.FC<AddAttendeeScreenProps> = ({
  eventId,
  onBack,
  onDone,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passType, setPassType] = useState("General");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await attendeesApi.create(eventId, { name, email, passType });
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add attendee.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20";

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)] font-sans p-6">
      <div className="max-w-xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Attendees
        </button>

        <h1 className="text-2xl font-bold text-[var(--text-heading)] mb-1">Add Attendee</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">A QR pass will be issued automatically.</p>

        {error && (
          <div className="mb-4 p-4 rounded-lg text-sm text-red-500 bg-red-500/10 border border-red-500/20">{error}</div>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Full name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Email address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane.doe@example.com" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Pass type</label>
            <input value={passType} onChange={(e) => setPassType(e.target.value)} placeholder="e.g. Guest, VIP, Speaker" className={inputClass} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border-subtle)]">
            <button type="button" onClick={onBack} className="px-4 py-2.5 bg-[var(--bg-input)] hover:bg-[var(--hover-surface)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg text-xs font-medium transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-900/10 disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? "Adding…" : "Add Attendee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAttendeeScreen;