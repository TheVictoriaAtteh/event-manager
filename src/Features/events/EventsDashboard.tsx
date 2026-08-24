import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Tent,
  ScanLine,
  ClipboardList,
  CircleHelp,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  CalendarDays,
  CheckCircle2,
  X,
  UserPlus,
  ArrowUpRight,
  Plus,
} from "lucide-react";

import type { UserRole } from "../auth/types";

interface EventsDashboardProps {
  userRole: UserRole;
  onLogout: () => void;
  onCreateEvent: () => void;
  onSelectEvent: (id: string) => void;
  onNavigateToAttendees: () => void;
  onNavigate: (screen: string) => void;
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
  onLogout,
  onCreateEvent,
  onSelectEvent,
  onNavigateToAttendees,
  onNavigate,
}) => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [privateCode, setPrivateCode] = useState("");
  const [codeSuccessMsg, setCodeSuccessMsg] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "2",
      title: "UI/UX Design Workshop",
      category: "Workshop",
      date: "Sep 02, 2026",
      isPrivate: true,
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "3",
      title: "Developer Meetup & Networking",
      category: "Networking",
      date: "Sep 15, 2026",
      isPrivate: false,
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
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

  const navItemClass = `
    w-full
    flex
    items-center
    gap-2.5
    px-3
    py-2.5
    rounded-lg
    text-[var(--text-secondary)]
    font-medium
    hover:bg-[var(--hover-surface)]
    hover:text-[var(--text-primary)]
    transition-all
    text-[13px]
  `;

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)] flex relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-180px] right-[10%] w-[500px] h-[500px] bg-emerald-500/[0.035] rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================= */}
      {/* SIDEBAR */}
      {/* ========================================================= */}

      <aside
        className={`
          bg-[var(--bg-surface)]
          border-r border-[var(--border-default)]
          px-3
          py-4
          flex
          flex-col
          justify-between
          hidden md:flex
          z-20
          transition-all
          duration-300
          relative
          shrink-0
          ${isSidebarCollapsed ? "w-[72px]" : "w-[224px]"}
        `}
      >
        <div>
          {/* Brand / Collapse */}
          <div className="mb-6">
            <div
              className={`
                flex
                items-center
                mb-5
                ${
                  isSidebarCollapsed
                    ? "justify-center"
                    : "justify-between"
                }
              `}
            >
              <div
                className={`
                  flex
                  items-center
                  gap-2.5
                  ${isSidebarCollapsed ? "justify-center" : ""}
                `}
              >
                <div className="h-8 w-8 min-w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-emerald-950 font-extrabold text-base shadow-sm">
                  G
                </div>

                {!isSidebarCollapsed && (
                  <div className="whitespace-nowrap leading-tight">
                    <h1 className="font-bold text-[15px] text-[var(--text-heading)]">
                      Gatepass
                    </h1>

                    <span className="text-[10px] text-[var(--text-accent)] font-medium">
                      {isAdmin ? "Admin Console" : "Attendee Portal"}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() =>
                  setIsSidebarCollapsed(!isSidebarCollapsed)
                }
                className={`
                  p-1.5
                  rounded-md
                  text-[var(--text-secondary)]
                  hover:text-[var(--text-primary)]
                  hover:bg-[var(--hover-surface)]
                  transition-colors
                  border border-[var(--border-default)]
                  flex
                  items-center
                  justify-center
                  ${
                    isSidebarCollapsed
                      ? "absolute top-4 right-2"
                      : ""
                  }
                `}
                title={
                  isSidebarCollapsed
                    ? "Expand Sidebar"
                    : "Collapse Sidebar"
                }
                aria-label={
                  isSidebarCollapsed
                    ? "Expand Sidebar"
                    : "Collapse Sidebar"
                }
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen size={15} strokeWidth={2} />
                ) : (
                  <PanelLeftClose size={15} strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          {/* Main Navigation */}
          {!isSidebarCollapsed && (
            <p className="px-3 mb-2 text-[9px] uppercase tracking-[0.12em] font-bold text-[var(--text-muted)]">
              Main
            </p>
          )}

          <nav className="space-y-0.5">
            {/* Dashboard */}
            <button
              onClick={() => onNavigate("dashboard")}
              title={
                isSidebarCollapsed
                  ? "Events Dashboard"
                  : undefined
              }
              className={`
                w-full
                flex
                items-center
                gap-2.5
                px-3
                py-2.5
                rounded-lg
                bg-emerald-500
                text-emerald-950
                font-semibold
                shadow-sm
                shadow-emerald-500/10
                text-[13px]
                transition-all
                ${isSidebarCollapsed ? "justify-center" : ""}
              `}
            >
              <LayoutDashboard
                size={18}
                strokeWidth={2}
                className="min-w-[18px]"
              />

              {!isSidebarCollapsed && (
                <span className="whitespace-nowrap">
                  Events Dashboard
                </span>
              )}
            </button>

            {/* Admin Navigation */}
            {isAdmin && (
              <>
                {/* Attendees */}
                <button
                  onClick={onNavigateToAttendees}
                  title={
                    isSidebarCollapsed
                      ? "Attendees List"
                      : undefined
                  }
                  className={`${navItemClass} ${
                    isSidebarCollapsed ? "justify-center" : ""
                  }`}
                >
                  <Users
                    size={18}
                    strokeWidth={2}
                    className="min-w-[18px]"
                  />

                  {!isSidebarCollapsed && (
                    <span className="whitespace-nowrap">
                      Attendees List
                    </span>
                  )}
                </button>

                {/* Rooms */}
                <button
                  onClick={() => onNavigate("rooms")}
                  title={
                    isSidebarCollapsed ? "Rooms" : undefined
                  }
                  className={`${navItemClass} ${
                    isSidebarCollapsed ? "justify-center" : ""
                  }`}
                >
                  <Building2
                    size={18}
                    strokeWidth={2}
                    className="min-w-[18px]"
                  />

                  {!isSidebarCollapsed && (
                    <span className="whitespace-nowrap">
                      Rooms
                    </span>
                  )}
                </button>

                {/* Teams / Booths */}
                <button
                  onClick={() => onNavigate("booths")}
                  title={
                    isSidebarCollapsed
                      ? "Teams / Booths"
                      : undefined
                  }
                  className={`${navItemClass} ${
                    isSidebarCollapsed ? "justify-center" : ""
                  }`}
                >
                  <Tent
                    size={18}
                    strokeWidth={2}
                    className="min-w-[18px]"
                  />

                  {!isSidebarCollapsed && (
                    <span className="whitespace-nowrap">
                      Teams / Booths
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Check-In */}
            <button
              onClick={() => onNavigate("check-in")}
              title={
                isSidebarCollapsed ? "Check-In" : undefined
              }
              className={`${navItemClass} ${
                isSidebarCollapsed ? "justify-center" : ""
              }`}
            >
              <ScanLine
                size={18}
                strokeWidth={2}
                className="min-w-[18px]"
              />

              {!isSidebarCollapsed && (
                <span className="whitespace-nowrap">
                  Check-In
                </span>
              )}
            </button>
          </nav>

          {/* Management Navigation */}
          <div className="mt-6">
            {!isSidebarCollapsed && (
              <p className="px-3 mb-2 text-[9px] uppercase tracking-[0.12em] font-bold text-[var(--text-muted)]">
                Management
              </p>
            )}

            <nav className="space-y-0.5">
              {/* Check-In Log */}
              {isAdmin && (
                <button
                  onClick={() => onNavigate("check-in-log")}
                  title={
                    isSidebarCollapsed
                      ? "Check-In Log"
                      : undefined
                  }
                  className={`${navItemClass} ${
                    isSidebarCollapsed ? "justify-center" : ""
                  }`}
                >
                  <ClipboardList
                    size={18}
                    strokeWidth={2}
                    className="min-w-[18px]"
                  />

                  {!isSidebarCollapsed && (
                    <span className="whitespace-nowrap">
                      Check-In Log
                    </span>
                  )}
                </button>
              )}

              {/* Settings */}
              <button
                onClick={() => onNavigate("settings")}
                title={
                  isSidebarCollapsed ? "Settings" : undefined
                }
                className={`${navItemClass} ${
                  isSidebarCollapsed ? "justify-center" : ""
                }`}
              >
                <Settings
                  size={18}
                  strokeWidth={2}
                  className="min-w-[18px]"
                />

                {!isSidebarCollapsed && (
                  <span className="whitespace-nowrap">
                    Settings
                  </span>
                )}
              </button>

              {/* Help */}
              <button
                onClick={() => onNavigate("help")}
                title={isSidebarCollapsed ? "Help" : undefined}
                className={`${navItemClass} ${
                  isSidebarCollapsed ? "justify-center" : ""
                }`}
              >
                <CircleHelp
                  size={18}
                  strokeWidth={2}
                  className="min-w-[18px]"
                />

                {!isSidebarCollapsed && (
                  <span className="whitespace-nowrap">
                    Help
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={onLogout}
          title={isSidebarCollapsed ? "Sign Out" : undefined}
          className={`
            w-full
            flex
            items-center
            gap-2.5
            py-2.5
            px-3
            bg-[var(--bg-input)]
            border border-[var(--border-default)]
            hover:bg-[var(--hover-surface)]
            text-[var(--text-secondary)]
            hover:text-[var(--text-primary)]
            rounded-lg
            font-medium
            transition-all
            text-[13px]
            ${isSidebarCollapsed ? "justify-center" : ""}
          `}
        >
          <LogOut
            size={18}
            strokeWidth={2}
            className="min-w-[18px]"
          />

          {!isSidebarCollapsed && (
            <span className="whitespace-nowrap">
              Sign Out
            </span>
          )}
        </button>
      </aside>

      {/* ========================================================= */}
      {/* MAIN DASHBOARD */}
      {/* ========================================================= */}

      <main className="flex-1 min-w-0 overflow-y-auto relative z-10">
        <div className="max-w-[1500px] mx-auto px-5 py-5 lg:px-7 lg:py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-[25px] font-bold text-[var(--text-heading)] tracking-tight">
                {isAdmin ? "Events Overview" : "My Events"}
              </h2>

              <p className="text-[12px] text-[var(--text-secondary)] mt-1">
                {isAdmin
                  ? "Manage and organize your upcoming events"
                  : "View and manage the events you are registered for"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Attendee Action */}
              {isAttendee && (
                <button
                  onClick={() => setShowCodeModal(true)}
                  className="
                    px-3.5
                    py-2
                    bg-[var(--bg-surface)]
                    border border-[var(--border-default)]
                    hover:bg-[var(--hover-surface)]
                    text-[var(--text-accent)]
                    rounded-lg
                    font-semibold
                    transition-all
                    text-[12px]
                  "
                >
                  Join with Private Code
                </button>
              )}

              {/* Admin Action */}
              {isAdmin && (
                <button
                  onClick={onCreateEvent}
                  className="
                    px-3.5
                    py-2
                    bg-emerald-500
                    hover:bg-emerald-400
                    text-emerald-950
                    rounded-lg
                    font-bold
                    shadow-sm
                    shadow-emerald-500/10
                    transition-all
                    text-[12px]
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  <Plus size={15} strokeWidth={2.5} />
                  Create New Event
                </button>
              )}
            </div>
          </div>

          {/* ===================================================== */}
          {/* ANALYTICS */}
          {/* ===================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
            {/* Total Events */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] px-4 py-3.5 rounded-xl flex justify-between items-start">
              <div>
                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                  {isAdmin
                    ? "Total Events"
                    : "Registered Events"}
                </span>

                <div className="text-[24px] leading-none font-bold text-[var(--text-primary)] mt-2">
                  {isAdmin ? "12" : "4"}
                </div>

                <p className="text-[10px] text-[var(--text-secondary)] mt-1.5">
                  <span className="text-emerald-500 font-semibold">
                    +8.2%
                  </span>{" "}
                  from last month
                </p>
              </div>

              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-[var(--text-accent)]">
                <CalendarDays size={16} strokeWidth={2} />
              </div>
            </div>

            {/* Total Registered */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] px-4 py-3.5 rounded-xl flex justify-between items-start">
              <div>
                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                  {isAdmin
                    ? "Total Registered"
                    : "Upcoming Events"}
                </span>

                <div className="text-[24px] leading-none font-bold text-[var(--text-primary)] mt-2">
                  {isAdmin ? "275" : "2"}
                </div>

                <p className="text-[10px] text-[var(--text-secondary)] mt-1.5">
                  <span className="text-emerald-500 font-semibold">
                    +12.4%
                  </span>{" "}
                  from last month
                </p>
              </div>

              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-[var(--text-accent)]">
                <UserPlus size={16} strokeWidth={2} />
              </div>
            </div>

            {/* Active */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] px-4 py-3.5 rounded-xl flex justify-between items-start">
              <div>
                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                  {isAdmin
                    ? "Active Events"
                    : "Active Registrations"}
                </span>

                <div className="text-[24px] leading-none font-bold text-[var(--text-primary)] mt-2">
                  {isAdmin ? "3" : "1"}
                </div>

                <p className="text-[10px] text-[var(--text-secondary)] mt-1.5">
                  Currently active
                </p>
              </div>

              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-[var(--text-accent)]">
                <CheckCircle2 size={16} strokeWidth={2} />
              </div>
            </div>

            {/* Upcoming */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] px-4 py-3.5 rounded-xl flex justify-between items-start">
              <div>
                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                  Upcoming
                </span>

                <div className="text-[24px] leading-none font-bold text-[var(--text-primary)] mt-2">
                  {isAdmin ? "5" : "2"}
                </div>

                <p className="text-[10px] text-[var(--text-secondary)] mt-1.5">
                  Next 30 days
                </p>
              </div>

              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-[var(--text-accent)]">
                <ArrowUpRight size={16} strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* ===================================================== */}
          {/* EVENTS SECTION HEADER */}
          {/* ===================================================== */}

          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h3 className="text-[16px] font-bold text-[var(--text-heading)]">
                {isAdmin ? "Upcoming Events" : "Your Events"}
              </h3>

              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                {isAdmin
                  ? "Events currently being managed"
                  : "Events you are registered for"}
              </p>
            </div>

            <button
              onClick={() => onNavigate("dashboard")}
              className="text-[11px] font-semibold text-[var(--text-accent)] hover:underline"
            >
              View all
            </button>
          </div>

          {/* ===================================================== */}
          {/* EVENTS GRID */}
          {/* ===================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {mockEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event.id)}
                className="
                  group
                  bg-[var(--bg-surface)]
                  border border-[var(--border-default)]
                  rounded-xl
                  overflow-hidden
                  hover:border-emerald-500/40
                  hover:shadow-md
                  transition-all
                  cursor-pointer
                  flex
                  flex-col
                "
              >
                {/* Event Image */}
                <div className="h-36 relative overflow-hidden bg-[var(--bg-input)]">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-[1.03]
                      transition-transform
                      duration-300
                    "
                  />

                  {/* Category */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-[9px] rounded-md font-semibold shadow-sm">
                    {event.category}
                  </span>

                  {/* Private */}
                  {event.isPrivate && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-1 bg-amber-400/95 text-amber-950 text-[9px] rounded-md font-bold shadow-sm">
                      Private
                    </span>
                  )}
                </div>

                {/* Event Content */}
                <div className="px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-[14px] text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors truncate">
                        {event.title}
                      </h3>

                      <div className="flex items-center gap-1.5 mt-1.5">
                        <CalendarDays
                          size={11}
                          strokeWidth={2}
                          className="text-[var(--text-muted)]"
                        />

                        <p className="text-[10px] text-[var(--text-secondary)]">
                          {event.date}
                        </p>
                      </div>
                    </div>

                    <div className="h-7 w-7 min-w-7 rounded-md border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-emerald-500 group-hover:border-emerald-500/30 transition-colors">
                      <ArrowUpRight
                        size={13}
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[var(--border-default)] flex items-center justify-between">
                    <span className="text-[10px] text-[var(--text-secondary)]">
                      {isAdmin
                        ? "Manage event"
                        : "View event details"}
                    </span>

                    {isAttendee && (
                      <span className="text-[10px] text-[var(--text-accent)] font-bold">
                        Register
                      </span>
                    )}

                    {isAdmin && (
                      <span className="text-[10px] text-[var(--text-accent)] font-semibold">
                        View Details →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* PRIVATE EVENT REGISTRATION MODAL */}
      {/* ========================================================= */}

      {showCodeModal && (
        <div className="fixed inset-0 bg-[var(--overlay)] backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-5 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setShowCodeModal(false)}
              className="
                absolute
                top-3.5
                right-3.5
                h-7
                w-7
                rounded-md
                flex
                items-center
                justify-center
                text-[var(--text-secondary)]
                hover:text-[var(--text-primary)]
                hover:bg-[var(--hover-surface)]
                transition-colors
              "
              aria-label="Close modal"
            >
              <X size={16} strokeWidth={2} />
            </button>

            <div className="pr-8">
              <h3 className="text-[17px] font-bold text-[var(--text-heading)]">
                Enter Private Event Code
              </h3>

              <p className="text-[11px] text-[var(--text-secondary)] mt-1.5 mb-4 leading-relaxed">
                Enter the unique access code provided by the event
                admin to submit your registration request.
              </p>
            </div>

            {codeSuccessMsg ? (
              <div className="p-3.5 bg-[var(--badge-success-bg)] border border-emerald-500/40 text-[var(--badge-success-text)] rounded-lg text-[12px] font-medium">
                {codeSuccessMsg}
              </div>
            ) : (
              <form
                onSubmit={handlePrivateCodeSubmit}
                className="space-y-3"
              >
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
                    px-3.5
                    py-2.5
                    bg-[var(--bg-input)]
                    border border-[var(--border-default)]
                    rounded-lg
                    text-[var(--text-primary)]
                    placeholder-[var(--text-muted)]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-emerald-500/40
                    focus:border-emerald-500
                    text-[12px]
                    tracking-wider
                    uppercase
                    font-mono
                  "
                />

                <button
                  type="submit"
                  className="
                    w-full
                    py-2.5
                    bg-emerald-500
                    hover:bg-emerald-400
                    text-emerald-950
                    font-bold
                    rounded-lg
                    transition-all
                    text-[12px]
                    shadow-sm
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