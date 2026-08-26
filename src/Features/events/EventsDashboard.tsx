import React, { useState } from "react";
import type { UserRole } from "../auth/types";

interface EventsDashboardProps {
  userRole: UserRole;
  onCreateEvent: () => void;
  onSelectEvent: (id: string) => void;
}

interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  isPrivate: boolean;
  image: string;
}

export const EventsDashboard: React.FC<EventsDashboardProps> = ({
  userRole,
  onCreateEvent,
  onSelectEvent,
}) => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [privateCode, setPrivateCode] = useState("");
  const [codeSuccessMsg, setCodeSuccessMsg] = useState("");

  const isAdmin = userRole === "ADMIN";
  const isAttendee = userRole === "ATTENDEE";

  const mockEvents: EventItem[] = [
    {
      id: "1",
      title: "Tech Innovation Summit 2026",
      category: "Conference",
      date: "Aug 24, 2026",
      isPrivate: false,
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60",
    },
    {
      id: "2",
      title: "UI/UX Design Workshop",
      category: "Workshop",
      date: "Sep 02, 2026",
      isPrivate: true,
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=60",
    },
    {
      id: "3",
      title: "Developer Meetup & Networking",
      category: "Networking",
      date: "Sep 15, 2026",
      isPrivate: false,
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=60",
    },
  ];

  const handlePrivateCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (privateCode.trim()) {
      setCodeSuccessMsg(
        "Registration request submitted! Awaiting admin approval."
      );

      setTimeout(() => {
        setPrivateCode("");
        setCodeSuccessMsg("");
        setShowCodeModal(false);
      }, 2000);
    }
  };

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)] flex relative overflow-hidden">
      {/* ========================================================= */}
      {/* BACKGROUND AMBIENT GLOW */}
      {/* ========================================================= */}

      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================= */}
      {/* MAIN DASHBOARD CONTENT */}
      {/* ========================================================= */}

      <main className="flex-1 p-8 overflow-y-auto relative z-10">
        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-[var(--text-heading)] tracking-tight">
              {isAdmin ? "Events Overview" : "My Events"}
            </h2>

            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {isAdmin
                ? "Manage and organize upcoming platforms & gatherings"
                : "View and manage the events you are registered for"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* ================================================= */}
            {/* ATTENDEE ACTION */}
            {/* ================================================= */}

            {isAttendee && (
              <button
                onClick={() => setShowCodeModal(true)}
                className="
                  px-4
                  py-2.5
                  bg-[var(--bg-surface)]
                  border border-[var(--border-default)]
                  hover:bg-[var(--hover-surface)]
                  text-[var(--text-accent)]
                  rounded-xl
                  font-semibold
                  transition-all
                  text-sm
                "
              >
                Join with Private Code
              </button>
            )}

            {/* ================================================= */}
            {/* ADMIN ACTION */}
            {/* ================================================= */}

            {isAdmin && (
              <button
                onClick={onCreateEvent}
                className="
                  px-5
                  py-2.5
                  bg-emerald-500
                  hover:bg-emerald-400
                  text-emerald-950
                  rounded-xl
                  font-bold
                  shadow-lg
                  shadow-emerald-500/20
                  transition-all
                  text-sm
                "
              >
                + Create New Event
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* ANALYTICS */}
        {/* ========================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* TOTAL EVENTS */}

          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 rounded-2xl flex justify-between items-center">
            <div>
              <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                {isAdmin ? "Total Events" : "Registered Events"}
              </span>

              <div className="text-3xl font-extrabold text-[var(--text-primary)] mt-1">
                {isAdmin ? "12" : "4"}
              </div>
            </div>

            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[var(--text-accent)]">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* REGISTERED */}

          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 rounded-2xl flex justify-between items-center">
            <div>
              <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                {isAdmin ? "Total Registered" : "Upcoming Events"}
              </span>

              <div className="text-3xl font-extrabold text-[var(--text-primary)] mt-1">
                {isAdmin ? "275" : "2"}
              </div>
            </div>

            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[var(--text-accent)]">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>

          {/* ACTIVE */}

          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 rounded-2xl flex justify-between items-center">
            <div>
              <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                {isAdmin ? "Active Events" : "Active Registrations"}
              </span>

              <div className="text-3xl font-extrabold text-[var(--text-primary)] mt-1">
                {isAdmin ? "3" : "1"}
              </div>
            </div>

            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[var(--text-accent)]">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* EVENTS GRID */}
        {/* ========================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event.id)}
              className="
                group
                bg-[var(--bg-surface)]
                border border-[var(--border-default)]
                rounded-2xl
                overflow-hidden
                hover:border-emerald-500/50
                transition-all
                cursor-pointer
                flex
                flex-col
              "
            >
              {/* EVENT IMAGE */}

              <div className="h-48 relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <span className="absolute top-3 left-3 px-3 py-1 bg-[var(--bg-input)]/90 backdrop-blur-md border border-[var(--border-default)] text-[var(--text-accent)] text-xs rounded-full font-medium">
                  {event.category}
                </span>

                {event.isPrivate && (
                  <span className="absolute top-3 right-3 px-3 py-1 bg-amber-500/90 text-amber-950 text-xs rounded-full font-bold">
                    Private
                  </span>
                )}
              </div>

              {/* EVENT DETAILS */}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {event.date}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--border-default)] flex justify-between items-center text-xs text-[var(--text-accent)] font-medium">
                  <span>View Details →</span>

                  {isAttendee && (
                    <span className="text-[var(--text-accent)] font-bold">
                      Register
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ========================================================= */}
      {/* PRIVATE EVENT REGISTRATION MODAL */}
      {/* ========================================================= */}

      {showCodeModal && (
        <div className="fixed inset-0 bg-[var(--overlay)] backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            {/* CLOSE */}

            <button
              onClick={() => setShowCodeModal(false)}
              className="
                absolute
                top-4
                right-4
                text-[var(--text-secondary)]
                hover:text-[var(--text-primary)]
                transition-colors
              "
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-[var(--text-heading)] mb-2">
              Enter Private Event Code
            </h3>

            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Enter the unique access code provided by the event admin to
              submit your registration request.
            </p>

            {/* SUCCESS */}

            {codeSuccessMsg ? (
              <div className="p-4 bg-[var(--badge-success-bg)] border border-emerald-500/40 text-[var(--badge-success-text)] rounded-xl text-sm font-medium">
                {codeSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handlePrivateCodeSubmit} className="space-y-4">
                <input
                  type="text"
                  required
                  value={privateCode}
                  onChange={(e) =>
                    setPrivateCode(e.target.value.toUpperCase())
                  }
                  placeholder="e.g. GATE-2026"
                  className="
                    w-full
                    px-4
                    py-3
                    bg-[var(--bg-input)]
                    border border-[var(--border-default)]
                    rounded-xl
                    text-[var(--text-primary)]
                    placeholder-[var(--text-muted)]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-emerald-500
                    text-sm
                    tracking-wider
                    uppercase
                    font-mono
                  "
                />

                <button
                  type="submit"
                  className="
                    w-full
                    py-3
                    bg-emerald-500
                    hover:bg-emerald-400
                    text-emerald-950
                    font-bold
                    rounded-xl
                    transition-all
                    text-sm
                    shadow-lg
                    shadow-emerald-500/20
                  "
                >
                  Submit Registration Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};