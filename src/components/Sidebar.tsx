import React, { useState } from "react";
import type { UserRole } from "../Features/auth/types";
import {
  CalendarDays,
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
  ChevronDown,
} from "lucide-react";

interface SidebarProps {
  userRole: UserRole;
  collapsed?: boolean;
  onToggle?: () => void;
  activeScreen?: string;
  onNavigate?: (screen: string) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  userRole,
  collapsed = false,
  onToggle,
  activeScreen = "dashboard",
  onNavigate,
  onLogout,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(
    activeScreen.startsWith("settings")
  );

  /*
   * ADMIN MENU
   */
  const adminMenuItems = [
    {
      id: "dashboard",
      label: "Events Dashboard",
      icon: CalendarDays,
    },
    {
      id: "attendees",
      label: "Attendees List",
      icon: Users,
    },
    {
      id: "rooms",
      label: "Rooms",
      icon: Building2,
    },
    {
      id: "booths",
      label: "Teams / Booths",
      icon: Tent,
    },
    {
      id: "check-in",
      label: "Check-In",
      icon: ScanLine,
    },
    {
      id: "check-in-log",
      label: "Check-In Log",
      icon: ClipboardList,
    },
  ];

  /*
   * ATTENDEE MENU
   */
  const attendeeMenuItems = [
    {
      id: "dashboard",
      label: "My Events",
      icon: CalendarDays,
    },
    {
      id: "check-in",
      label: "Check-In",
      icon: ScanLine,
    },
  ];

  const menuItems =
    userRole === "ADMIN"
      ? adminMenuItems
      : attendeeMenuItems;

  /*
   * SETTINGS
   */
  const settingsItems = [
    {
      id: "settings-profile",
      label: "Profile",
    },
    {
      id: "settings-security",
      label: "Security",
    },
    {
      id: "settings-notifications",
      label: "Notifications",
    },
    {
      id: "settings-appearance",
      label: "Appearance",
    },
  ];

  const settingsIsActive =
    activeScreen.startsWith("settings");

  return (
    <aside
      className={`
        h-screen
        bg-[var(--bg-input)]
        border-r border-[var(--border-subtle)]
        flex flex-col
        shrink-0
        transition-all duration-200
        ${collapsed ? "w-20" : "w-[250px]"}
      `}
    >
      {/* ================================================= */}
      {/* BRAND */}
      {/* ================================================= */}

      <div className="px-6 pt-7 pb-5">
        <div
          className={`flex items-center ${
            collapsed
              ? "justify-center"
              : "gap-3"
          }`}
        >
          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-[var(--bg-surface)]
              border
              border-[var(--border-default)]
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <CalendarDays
              className="w-5 h-5 text-[var(--text-accent)]"
              strokeWidth={1.8}
            />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold text-[var(--text-heading)]">
                Event Manager
              </h1>

              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                {userRole === "ADMIN"
                  ? "Admin Console"
                  : "Attendee Portal"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* COLLAPSE */}
      {/* ================================================= */}

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={onToggle}
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className="
            w-full
            h-9
            flex
            items-center
            justify-center
            rounded-lg
            text-[var(--text-muted)]
            hover:text-[var(--text-accent)]
            hover:bg-[var(--hover-surface)]
            transition-colors
          "
        >
          {collapsed ? (
            <PanelLeftOpen
              className="w-4 h-4"
              strokeWidth={1.8}
            />
          ) : (
            <PanelLeftClose
              className="w-4 h-4"
              strokeWidth={1.8}
            />
          )}
        </button>
      </div>

      {/* ================================================= */}
      {/* MAIN NAVIGATION */}
      {/* ================================================= */}

      <nav className="px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeScreen === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onNavigate?.(item.id)
              }
              title={
                collapsed
                  ? item.label
                  : undefined
              }
              className={`
                w-full
                h-10
                flex
                items-center
                ${
                  collapsed
                    ? "justify-center"
                    : "gap-3"
                }
                px-3
                rounded-lg
                text-left
                transition-colors

                ${
                  isActive
                    ? "bg-[var(--nav-active-bg)] border border-[var(--nav-active-border)] text-[var(--nav-active-text)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-surface)]"
                }
              `}
            >
              <Icon
                className="w-4 h-4 shrink-0"
                strokeWidth={1.8}
              />

              {!collapsed && (
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ================================================= */}
      {/* SPACER */}
      {/* ================================================= */}

      <div className="flex-1" />

      {/* ================================================= */}
      {/* HELP */}
      {/* ================================================= */}

      <div className="px-4 pb-2">
        <button
          type="button"
          onClick={() =>
            onNavigate?.("help")
          }
          title={
            collapsed
              ? "Help"
              : undefined
          }
          className={`
            w-full
            h-10
            flex
            items-center
            ${
              collapsed
                ? "justify-center"
                : "gap-3"
            }
            px-3
            rounded-lg
            text-left
            transition-colors

            ${
              activeScreen === "help"
                ? "bg-[var(--nav-active-bg)] border border-[var(--nav-active-border)] text-[var(--nav-active-text)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-surface)]"
            }
          `}
        >
          <CircleHelp
            className="w-4 h-4 shrink-0"
            strokeWidth={1.8}
          />

          {!collapsed && (
            <span className="text-xs font-medium">
              Help
            </span>
          )}
        </button>
      </div>

      {/* ================================================= */}
      {/* SETTINGS */}
      {/* ================================================= */}

      <div className="px-4 pb-2">
        <button
          type="button"
          onClick={() => {
            if (collapsed) {
              onNavigate?.(
                "settings-profile"
              );
            } else {
              setSettingsOpen(
                (previous) => !previous
              );
            }
          }}
          title={
            collapsed
              ? "Settings"
              : undefined
          }
          className={`
            w-full
            h-10
            flex
            items-center
            ${
              collapsed
                ? "justify-center"
                : ""
            }
            px-3
            rounded-lg
            text-left
            transition-colors

            ${
              settingsIsActive
                ? "bg-[var(--nav-active-bg)] border border-[var(--nav-active-border)] text-[var(--nav-active-text)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-surface)]"
            }
          `}
        >
          {/* SETTINGS ICON */}

          <Settings
            className="w-4 h-4 shrink-0"
            strokeWidth={1.8}
          />

          {/* SETTINGS LABEL */}

          {!collapsed && (
            <span className="text-xs font-medium ml-3">
              Settings
            </span>
          )}

          {/* DROPDOWN ARROW */}

          {!collapsed && (
            <ChevronDown
              className={`
                w-4 h-4
                ml-auto
                shrink-0
                transition-transform
                duration-200
                ${
                  settingsOpen
                    ? "rotate-180"
                    : ""
                }
              `}
              strokeWidth={1.8}
            />
          )}
        </button>

        {/* ================================================= */}
        {/* SETTINGS OPTIONS */}
        {/* ================================================= */}

        {!collapsed &&
          settingsOpen && (
            <div
              className="
                ml-5
                mt-1
                pl-4
                border-l
                border-[var(--border-default)]
                space-y-1
              "
            >
              {settingsItems.map(
                (item) => {
                  const isActive =
                    activeScreen ===
                    item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        onNavigate?.(
                          item.id
                        )
                      }
                      className={`
                        w-full
                        h-8
                        px-3
                        rounded-md
                        text-left
                        text-xs
                        transition-colors

                        ${
                          isActive
                            ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)]"
                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-surface)]"
                        }
                      `}
                    >
                      {item.label}
                    </button>
                  );
                }
              )}
            </div>
          )}
      </div>

      {/* ================================================= */}
      {/* SIGN OUT */}
      {/* ================================================= */}

      <div
        className="
          border-t
          border-[var(--border-subtle)]
          px-4
          py-4
        "
      >
        <button
          type="button"
          onClick={onLogout}
          title={
            collapsed
              ? "Sign Out"
              : undefined
          }
          className={`
            w-full
            h-10
            flex
            items-center
            ${
              collapsed
                ? "justify-center"
                : "gap-3"
            }
            px-3
            rounded-lg
            text-[var(--text-secondary)]
            hover:text-[var(--text-primary)]
            hover:bg-[var(--hover-surface)]
            transition-colors
            text-left
          `}
        >
          <LogOut
            className="w-4 h-4 shrink-0"
            strokeWidth={1.8}
          />

          {!collapsed && (
            <span className="text-xs font-medium">
              Sign Out
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;