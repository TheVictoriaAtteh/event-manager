import React, { useState } from "react";
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
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================= */}
      {/* SIDEBAR */}
      {/* ========================================================= */}

      <aside
        className={`
          bg-[var(--bg-surface)]
          border-r border-[var(--border-default)]
          p-4
          flex flex-col
          justify-between
          hidden md:flex
          z-20
          transition-all duration-300
          relative
          ${isSidebarCollapsed ? "w-20" : "w-64"}
        `}
      >
        <div className="space-y-6">
          {/* Brand / Collapse */}
          <div className="flex flex-col gap-3">
            <div
              className={`flex items-center ${
                isSidebarCollapsed ? "justify-center" : "justify-end"
              }`}
            >
              <button
                onClick={() =>
                  setIsSidebarCollapsed(!isSidebarCollapsed)
                }
                className="
                  p-1.5
                  rounded-lg
                  text-[var(--text-secondary)]
                  hover:text-[var(--text-primary)]
                  hover:bg-[var(--hover-surface)]
                  transition-colors
                  border border-[var(--border-default)]
                "
                title={
                  isSidebarCollapsed
                    ? "Expand Sidebar"
                    : "Collapse Sidebar"
                }
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isSidebarCollapsed ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Brand */}
            <div
              className={`flex items-center gap-3 ${
                isSidebarCollapsed ? "justify-center" : "px-1"
              }`}
            >
              <div className="h-10 w-10 min-w-[2.5rem] rounded-xl bg-emerald-500 flex items-center justify-center text-emerald-950 font-extrabold text-xl shadow-lg shadow-emerald-500/20">
                G
              </div>

              {!isSidebarCollapsed && (
                <div className="whitespace-nowrap">
                  <h1 className="font-bold text-lg text-[var(--text-heading)] leading-none">
                    Gatepass
                  </h1>

                  <span className="text-xs text-[var(--text-accent)] font-medium">
                    {isAdmin ? "Admin Console" : "Attendee Portal"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* NAVIGATION */}
          {/* ========================================================= */}

          <nav className="space-y-1.5 pt-2">
            {/* Dashboard - BOTH ROLES */}
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
                gap-3
                px-3.5
                py-3
                rounded-xl
                bg-emerald-500
                text-emerald-950
                font-bold
                shadow-md
                shadow-emerald-500/10
                text-sm
                transition-all
                ${isSidebarCollapsed ? "justify-center" : ""}
              `}
            >
              <svg
                className="w-5 h-5 min-w-[1.25rem]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>

              {!isSidebarCollapsed && (
                <span className="whitespace-nowrap">
                  Events Dashboard
                </span>
              )}
            </button>

            {/* ===================================================== */}
            {/* ADMIN-ONLY NAVIGATION */}
            {/* ===================================================== */}

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
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3.5
                    py-3
                    rounded-xl
                    text-[var(--text-secondary)]
                    font-medium
                    hover:bg-[var(--hover-surface)]
                    hover:text-[var(--text-primary)]
                    transition-all
                    text-sm
                    ${isSidebarCollapsed ? "justify-center" : ""}
                  `}
                >
                  <svg
                    className="w-5 h-5 min-w-[1.25rem]"
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
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3.5
                    py-3
                    rounded-xl
                    text-[var(--text-secondary)]
                    font-medium
                    hover:bg-[var(--hover-surface)]
                    hover:text-[var(--text-primary)]
                    transition-all
                    text-sm
                    ${isSidebarCollapsed ? "justify-center" : ""}
                  `}
                >
                  <svg
                    className="w-5 h-5 min-w-[1.25rem]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>

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
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3.5
                    py-3
                    rounded-xl
                    text-[var(--text-secondary)]
                    font-medium
                    hover:bg-[var(--hover-surface)]
                    hover:text-[var(--text-primary)]
                    transition-all
                    text-sm
                    ${isSidebarCollapsed ? "justify-center" : ""}
                  `}
                >
                  <svg
                    className="w-5 h-5 min-w-[1.25rem]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>

                  {!isSidebarCollapsed && (
                    <span className="whitespace-nowrap">
                      Teams / Booths
                    </span>
                  )}
                </button>
              </>
            )}

            {/* ===================================================== */}
            {/* CHECK-IN - BOTH ROLES */}
            {/* ===================================================== */}

            <button
              onClick={() => onNavigate("check-in")}
              title={
                isSidebarCollapsed ? "Check-In" : undefined
              }
              className={`
                w-full
                flex
                items-center
                gap-3
                px-3.5
                py-3
                rounded-xl
                text-[var(--text-secondary)]
                font-medium
                hover:bg-[var(--hover-surface)]
                hover:text-[var(--text-primary)]
                transition-all
                text-sm
                ${isSidebarCollapsed ? "justify-center" : ""}
              `}
            >
              <svg
                className="w-5 h-5 min-w-[1.25rem]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>

              {!isSidebarCollapsed && (
                <span className="whitespace-nowrap">
                  Check-In
                </span>
              )}
            </button>

            {/* ===================================================== */}
            {/* CHECK-IN LOG - ADMIN ONLY */}
            {/* ===================================================== */}

            {isAdmin && (
              <button
                onClick={() => onNavigate("check-in-log")}
                title={
                  isSidebarCollapsed
                    ? "Check-In Log"
                    : undefined
                }
                className={`
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3.5
                  py-3
                  rounded-xl
                  text-[var(--text-secondary)]
                  font-medium
                  hover:bg-[var(--hover-surface)]
                  hover:text-[var(--text-primary)]
                  transition-all
                  text-sm
                  ${isSidebarCollapsed ? "justify-center" : ""}
                `}
              >
                <svg
                  className="w-5 h-5 min-w-[1.25rem]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012 2h2a2 2 0 012-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>

                {!isSidebarCollapsed && (
                  <span className="whitespace-nowrap">
                    Check-In Log
                  </span>
                )}
              </button>
            )}

            {/* ===================================================== */}
            {/* HELP - BOTH ROLES */}
            {/* ===================================================== */}

            <button
              onClick={() => onNavigate("help")}
              title={isSidebarCollapsed ? "Help" : undefined}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-3.5
                py-3
                rounded-xl
                text-[var(--text-secondary)]
                font-medium
                hover:bg-[var(--hover-surface)]
                hover:text-[var(--text-primary)]
                transition-all
                text-sm
                ${isSidebarCollapsed ? "justify-center" : ""}
              `}
            >
              <svg
                className="w-5 h-5 min-w-[1.25rem]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              {!isSidebarCollapsed && (
                <span className="whitespace-nowrap">
                  Help
                </span>
              )}
            </button>

            {/* ===================================================== */}
            {/* SETTINGS - BOTH ROLES */}
            {/* ===================================================== */}

            <button
              onClick={() => onNavigate("settings")}
              title={
                isSidebarCollapsed ? "Settings" : undefined
              }
              className={`
                w-full
                flex
                items-center
                gap-3
                px-3.5
                py-3
                rounded-xl
                text-[var(--text-secondary)]
                font-medium
                hover:bg-[var(--hover-surface)]
                hover:text-[var(--text-primary)]
                transition-all
                text-sm
                ${isSidebarCollapsed ? "justify-center" : ""}
              `}
            >
              <svg
                className="w-5 h-5 min-w-[1.25rem]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-.2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-.94 1.543.826 3.31-.2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              {!isSidebarCollapsed && (
                <span className="whitespace-nowrap">
                  Settings
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* ========================================================= */}
        {/* SIGN OUT */}
        {/* ========================================================= */}

        <button
          onClick={onLogout}
          title={isSidebarCollapsed ? "Sign Out" : undefined}
          className={`
            w-full
            flex
            items-center
            gap-3
            py-3
            px-3.5
            bg-[var(--bg-input)]
            border border-[var(--border-default)]
            hover:bg-[var(--hover-surface)]
            text-[var(--text-secondary)]
            rounded-xl
            font-medium
            transition-all
            text-sm
            mt-6
            ${isSidebarCollapsed ? "justify-center" : ""}
          `}
        >
          <svg
            className="w-5 h-5 min-w-[1.25rem]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>

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

      <main className="flex-1 p-8 overflow-y-auto relative z-10">
        {/* Header */}
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
            {/* ATTENDEE ACTION */}
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

            {/* ADMIN ACTION */}
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
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

            {codeSuccessMsg ? (
              <div className="p-4 bg-[var(--badge-success-bg)] border border-emerald-500/40 text-[var(--badge-success-text)] rounded-xl text-sm font-medium">
                {codeSuccessMsg}
              </div>
            ) : (
              <form
                onSubmit={handlePrivateCodeSubmit}
                className="space-y-4"
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