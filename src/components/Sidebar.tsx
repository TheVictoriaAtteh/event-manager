import React from "react";
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
  const menuItems = [
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
      id: "teams",
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

  const bottomItems = [
    {
      id: "help",
      label: "Help",
      icon: CircleHelp,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`
        h-screen
        bg-[#090d0b]
        border-r border-emerald-900/30
        flex flex-col
        shrink-0
        transition-all duration-200
        ${collapsed ? "w-20" : "w-[250px]"}
      `}
    >
      {/* ==================== BRAND ==================== */}
      <div className="px-6 pt-7 pb-5">
        <div
          className={`
            flex items-center
            ${collapsed ? "justify-center" : "gap-3"}
          `}
        >
          {/* Logo */}
          <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-700/40 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5 text-emerald-400" />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold text-white">
                Event Manager
              </h1>

              <p className="text-[11px] text-gray-500 mt-0.5">
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
            w-full
            flex
            items-center
            justify-center
            py-2
            rounded-lg
            text-gray-500
            hover:text-emerald-400
            hover:bg-emerald-950/30
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
                w-full
                flex
                items-center
                ${collapsed ? "justify-center" : "gap-3"}
                px-3
                py-2.5
                rounded-lg
                text-left
                transition-colors

                ${
                  isActive
                    ? "bg-emerald-950/70 border border-emerald-800/50 text-emerald-400"
                    : "text-gray-400 hover:text-white hover:bg-emerald-950/30"
                }
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />

              {!collapsed && (
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ==================== SPACER ==================== */}
      <div className="flex-1" />

      {/* ==================== HELP + SETTINGS ==================== */}
      <nav className="px-4 pb-2 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              title={collapsed ? item.label : undefined}
              className={`
                w-full
                flex
                items-center
                ${collapsed ? "justify-center" : "gap-3"}
                px-3
                py-2.5
                rounded-lg
                text-left
                transition-colors

                ${
                  isActive
                    ? "bg-emerald-950/70 border border-emerald-800/50 text-emerald-400"
                    : "text-gray-400 hover:text-white hover:bg-emerald-950/30"
                }
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />

              {!collapsed && (
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ==================== SIGN OUT ==================== */}
      <div className="border-t border-emerald-900/20 px-4 py-4">
        <button
          onClick={onLogout}
          title={collapsed ? "Sign Out" : undefined}
          className={`
            w-full
            flex
            items-center
            ${collapsed ? "justify-center" : "gap-3"}
            px-3
            py-2.5
            rounded-lg
            text-gray-400
            hover:text-white
            hover:bg-emerald-950/30
            transition-colors
            text-left
          `}
        >
          <LogOut className="w-4 h-4 shrink-0" />

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