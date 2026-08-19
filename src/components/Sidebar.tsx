import React, { useState } from "react";
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
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  activeScreen?: string;
  onNavigate?: (screen: string) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggle,
  activeScreen = "dashboard",
  onNavigate,
  onLogout,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(
    activeScreen.startsWith("settings")
  );

  const menuItems = [
    { id: "dashboard", label: "Events Dashboard", icon: CalendarDays },
    { id: "attendees", label: "Attendees List", icon: Users },
    { id: "rooms", label: "Rooms", icon: Building2 },
    { id: "booths", label: "Teams / Booths", icon: Tent },
    { id: "check-in", label: "Check-In", icon: ScanLine },
    { id: "check-in-log", label: "Check-In Log", icon: ClipboardList },
  ];

  const settingsItems = [
    { id: "settings-profile", label: "Profile" },
    { id: "settings-security", label: "Security" },
    { id: "settings-notifications", label: "Notifications" },
    { id: "settings-appearance", label: "Appearance" },
  ];

  const settingsIsActive = activeScreen.startsWith("settings");

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
      {/* ==================== BRAND ==================== */}
      <div className="px-6 pt-7 pb-5">
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5 text-[var(--text-accent)]" />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold text-[var(--text-heading)]">
                Event Manager
              </h1>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Admin Console
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ==================== COLLAPSE BUTTON ==================== */}
      <div className={`px-4 pb-4 ${collapsed ? "px-3" : ""}`}>
        <button
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="
            w-full flex items-center justify-center py-2 rounded-lg
            text-[var(--text-muted)]
            hover:text-[var(--text-accent)]
            hover:bg-[var(--hover-surface)]
            transition-colors
          "
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* ==================== MAIN NAVIGATION ==================== */}
      <nav className="px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              title={collapsed ? item.label : undefined}
              className={`
                w-full flex items-center
                ${collapsed ? "justify-center" : "gap-3"}
                px-3 py-2.5 rounded-lg text-left transition-colors
                ${
                  isActive
                    ? "bg-[var(--nav-active-bg)] border border-[var(--nav-active-border)] text-[var(--nav-active-text)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-surface)]"
                }
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="text-xs font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* ==================== SPACER ==================== */}
      <div className="flex-1" />

      {/* ==================== HELP ==================== */}
      <nav className="px-4 pb-2">
        <button
          onClick={() => onNavigate?.("help")}
          title={collapsed ? "Help" : undefined}
          className={`
            w-full flex items-center
            ${collapsed ? "justify-center" : "gap-3"}
            px-3 py-2.5 rounded-lg text-left transition-colors
            ${
              activeScreen === "help"
                ? "bg-[var(--nav-active-bg)] border border-[var(--nav-active-border)] text-[var(--nav-active-text)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-surface)]"
            }
          `}
        >
          <CircleHelp className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-xs font-medium">Help</span>}
        </button>

        {/* ==================== SETTINGS ==================== */}
        <div className="mt-1">
          <button
            onClick={() => {
              if (collapsed) {
                onNavigate?.("settings-profile");
              } else {
                setSettingsOpen(!settingsOpen);
              }
            }}
            title={collapsed ? "Settings" : undefined}
            className={`
              w-full flex items-center
              ${collapsed ? "justify-center" : "gap-3"}
              px-3 py-2.5 rounded-lg text-left transition-colors
              ${
                settingsIsActive
                  ? "bg-[var(--nav-active-bg)] border border-[var(--nav-active-border)] text-[var(--nav-active-text)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-surface)]"
              }
            `}
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="text-xs font-medium flex-1">Settings</span>
                {settingsOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </>
            )}
          </button>

          {/* ==================== SETTINGS DROPDOWN ==================== */}
          {!collapsed && settingsOpen && (
            <div className="ml-8 mt-1 pl-3 border-l border-[var(--border-default)] space-y-1">
              {settingsItems.map((item) => {
                const isActive = activeScreen === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate?.(item.id)}
                    className={`
                      w-full text-left px-3 py-2 rounded-md text-xs transition-colors
                      ${
                        isActive
                          ? "text-[var(--nav-active-text)] bg-[var(--nav-active-bg)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-surface)]"
                      }
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* ==================== SIGN OUT ==================== */}
      <div className="border-t border-[var(--border-subtle)] px-4 py-4">
        <button
          onClick={onLogout}
          title={collapsed ? "Sign Out" : undefined}
          className={`
            w-full flex items-center
            ${collapsed ? "justify-center" : "gap-3"}
            px-3 py-2.5 rounded-lg
            text-[var(--text-secondary)]
            hover:text-[var(--text-primary)]
            hover:bg-[var(--hover-surface)]
            transition-colors text-left
          `}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-xs font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;