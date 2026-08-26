import React from "react";
import type { UserRole } from "../Features/auth/types";

import {
  PanelLeftOpen,
  PanelLeftClose,
  LayoutDashboard,
  Users,
  Building2,
  Tent,
  ScanLine,
  ClipboardList,
  Settings,
  CircleHelp,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  userRole: UserRole;
  collapsed?: boolean;
  onToggle?: () => void;
  activeScreen?: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userRole,
  collapsed = false,
  onToggle,
  activeScreen = "dashboard",
  onNavigate,
  onLogout,
}) => {
  const isAdmin = userRole === "ADMIN";

  const navItemBaseClass = `
    w-full
    flex
    items-center
    gap-2.5
    px-3
    py-2.5
    rounded-lg
    font-medium
    text-[13px]
    transition-all
  `;

  const getNavItemClass = (isActive: boolean) => `
    ${navItemBaseClass}
    ${
      isActive
        ? "bg-emerald-500 text-emerald-950 shadow-sm shadow-emerald-500/10"
        : "text-[var(--text-secondary)] hover:bg-[var(--hover-surface)] hover:text-[var(--text-primary)]"
    }
  `;

  return (
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
        h-full
        overflow-y-auto
        ${collapsed ? "w-[72px]" : "w-[224px]"}
      `}
    >
      <div>
        {/* ===================================================== */}
        {/* BRAND / COLLAPSE */}
        {/* ===================================================== */}

        <div className="mb-6">
          <div
            className={`
              flex
              items-center
              mb-5
              ${collapsed ? "justify-center" : "justify-between"}
            `}
          >
            {/* BRAND */}

            <div
              className={`
                flex
                items-center
                gap-2.5
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <div className="h-8 w-8 min-w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-emerald-950 font-extrabold text-base shadow-sm">
                G
              </div>

              {!collapsed && (
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

            {/* COLLAPSE BUTTON */}

            <button
              onClick={onToggle}
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
                ${collapsed ? "absolute top-4 right-2" : ""}
              `}
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen size={15} strokeWidth={2} />
              ) : (
                <PanelLeftClose size={15} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* ===================================================== */}
        {/* MAIN NAVIGATION */}
        {/* ===================================================== */}

        {!collapsed && (
          <p className="px-3 mb-2 text-[9px] uppercase tracking-[0.12em] font-bold text-[var(--text-muted)]">
            Main
          </p>
        )}

        <nav className="space-y-0.5">
          {/* DASHBOARD */}

          <button
            onClick={() => onNavigate("dashboard")}
            title={collapsed ? "Events Dashboard" : undefined}
            className={`${getNavItemClass(activeScreen === "dashboard")} ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LayoutDashboard size={18} strokeWidth={2} className="min-w-[18px]" />
            {!collapsed && <span className="whitespace-nowrap">Events Dashboard</span>}
          </button>

          {/* ================================================= */}
          {/* ADMIN NAVIGATION */}
          {/* ================================================= */}

          {isAdmin && (
            <>
              {/* ATTENDEES */}

              <button
                onClick={() => onNavigate("attendees")}
                title={collapsed ? "Attendees List" : undefined}
                className={`${getNavItemClass(activeScreen === "attendees")} ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                <Users size={18} strokeWidth={2} className="min-w-[18px]" />
                {!collapsed && <span className="whitespace-nowrap">Attendees List</span>}
              </button>

              {/* ROOMS */}

              <button
                onClick={() => onNavigate("rooms")}
                title={collapsed ? "Rooms" : undefined}
                className={`${getNavItemClass(
                  activeScreen === "rooms" ||
                    activeScreen === "add-room" ||
                    activeScreen === "room-assignment"
                )} ${collapsed ? "justify-center" : ""}`}
              >
                <Building2 size={18} strokeWidth={2} className="min-w-[18px]" />
                {!collapsed && <span className="whitespace-nowrap">Rooms</span>}
              </button>

              {/* TEAMS / BOOTHS */}

              <button
                onClick={() => onNavigate("booths")}
                title={collapsed ? "Teams / Booths" : undefined}
                className={`${getNavItemClass(activeScreen === "booths")} ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                <Tent size={18} strokeWidth={2} className="min-w-[18px]" />
                {!collapsed && <span className="whitespace-nowrap">Teams / Booths</span>}
              </button>
            </>
          )}

          {/* CHECK-IN */}

          <button
            onClick={() => onNavigate("check-in")}
            title={collapsed ? "Check-In" : undefined}
            className={`${getNavItemClass(
              activeScreen === "check-in" || activeScreen === "manual-check-in"
            )} ${collapsed ? "justify-center" : ""}`}
          >
            <ScanLine size={18} strokeWidth={2} className="min-w-[18px]" />
            {!collapsed && <span className="whitespace-nowrap">Check-In</span>}
          </button>
        </nav>

        {/* ===================================================== */}
        {/* MANAGEMENT NAVIGATION */}
        {/* ===================================================== */}

        <div className="mt-6">
          {!collapsed && (
            <p className="px-3 mb-2 text-[9px] uppercase tracking-[0.12em] font-bold text-[var(--text-muted)]">
              Management
            </p>
          )}

          <nav className="space-y-0.5">
            {/* CHECK-IN LOG */}

            {isAdmin && (
              <button
                onClick={() => onNavigate("check-in-log")}
                title={collapsed ? "Check-In Log" : undefined}
                className={`${getNavItemClass(activeScreen === "check-in-log")} ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                <ClipboardList size={18} strokeWidth={2} className="min-w-[18px]" />
                {!collapsed && <span className="whitespace-nowrap">Check-In Log</span>}
              </button>
            )}

            {/* SETTINGS */}

            <button
              onClick={() => onNavigate("settings")}
              title={collapsed ? "Settings" : undefined}
              className={`${getNavItemClass(activeScreen.startsWith("settings"))} ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <Settings size={18} strokeWidth={2} className="min-w-[18px]" />
              {!collapsed && <span className="whitespace-nowrap">Settings</span>}
            </button>

            {/* HELP */}

            <button
              onClick={() => onNavigate("help")}
              title={collapsed ? "Help" : undefined}
              className={`${getNavItemClass(activeScreen === "help")} ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <CircleHelp size={18} strokeWidth={2} className="min-w-[18px]" />
              {!collapsed && <span className="whitespace-nowrap">Help</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* ===================================================== */}
      {/* SIGN OUT */}
      {/* ===================================================== */}

      <button
        onClick={onLogout}
        title={collapsed ? "Sign Out" : undefined}
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
          ${collapsed ? "justify-center" : ""}
        `}
      >
        <LogOut size={18} strokeWidth={2} className="min-w-[18px]" />
        {!collapsed && <span className="whitespace-nowrap">Sign Out</span>}
      </button>
    </aside>
  );
};

export default Sidebar;