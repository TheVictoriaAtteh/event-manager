import React, { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Palette,
  ChevronRight,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";

interface SettingsScreenProps {
  onNavigate?: (screen: string) => void;
  onLogout?: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigate,
  onLogout,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#090d0b] text-white">

      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        activeScreen="settings"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* HEADER */}
        <header className="h-16 border-b border-emerald-900/30 bg-[#0d1310] px-6 flex items-center">
          <div>
            <h1 className="text-sm font-semibold text-white">
              Settings
            </h1>

            <p className="text-xs text-gray-500 mt-0.5">
              Manage your account and application preferences
            </p>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* PAGE TITLE */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-emerald-50">
              Settings
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Configure your Event Manager experience.
            </p>
          </div>

          {/* SETTINGS CARDS */}
          <div className="max-w-4xl space-y-4">

            {/* PROFILE */}
            <button
              onClick={() => onNavigate?.("settings-profile")}
              className="
                w-full
                flex
                items-center
                justify-between
                p-5
                bg-[#121915]
                border
                border-emerald-900/30
                hover:border-emerald-700/60
                rounded-xl
                transition-all
                text-left
                group
              "
            >
              <div className="flex items-center gap-4">

                <div
                  className="
                    w-11
                    h-11
                    rounded-lg
                    bg-emerald-950/60
                    border
                    border-emerald-800/40
                    flex
                    items-center
                    justify-center
                  "
                >
                  <User className="w-5 h-5 text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Profile
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Manage your personal information and profile
                  </p>
                </div>

              </div>

              <ChevronRight
                className="
                  w-5
                  h-5
                  text-gray-600
                  group-hover:text-emerald-400
                  transition-colors
                "
              />
            </button>

            {/* SECURITY */}
            <button
              onClick={() => onNavigate?.("settings-security")}
              className="
                w-full
                flex
                items-center
                justify-between
                p-5
                bg-[#121915]
                border
                border-emerald-900/30
                hover:border-emerald-700/60
                rounded-xl
                transition-all
                text-left
                group
              "
            >
              <div className="flex items-center gap-4">

                <div
                  className="
                    w-11
                    h-11
                    rounded-lg
                    bg-emerald-950/60
                    border
                    border-emerald-800/40
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Security
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Manage your password and account security
                  </p>
                </div>

              </div>

              <ChevronRight
                className="
                  w-5
                  h-5
                  text-gray-600
                  group-hover:text-emerald-400
                  transition-colors
                "
              />
            </button>

            {/* NOTIFICATIONS */}
            <button
              onClick={() => onNavigate?.("settings-notifications")}
              className="
                w-full
                flex
                items-center
                justify-between
                p-5
                bg-[#121915]
                border
                border-emerald-900/30
                hover:border-emerald-700/60
                rounded-xl
                transition-all
                text-left
                group
              "
            >
              <div className="flex items-center gap-4">

                <div
                  className="
                    w-11
                    h-11
                    rounded-lg
                    bg-emerald-950/60
                    border
                    border-emerald-800/40
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Bell className="w-5 h-5 text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Notifications
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Choose how and when you receive notifications
                  </p>
                </div>

              </div>

              <ChevronRight
                className="
                  w-5
                  h-5
                  text-gray-600
                  group-hover:text-emerald-400
                  transition-colors
                "
              />
            </button>

            {/* APPEARANCE */}
            <button
              onClick={() => onNavigate?.("settings-appearance")}
              className="
                w-full
                flex
                items-center
                justify-between
                p-5
                bg-[#121915]
                border
                border-emerald-900/30
                hover:border-emerald-700/60
                rounded-xl
                transition-all
                text-left
                group
              "
            >
              <div className="flex items-center gap-4">

                <div
                  className="
                    w-11
                    h-11
                    rounded-lg
                    bg-emerald-950/60
                    border
                    border-emerald-800/40
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Palette className="w-5 h-5 text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Appearance
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Customize the appearance of the application
                  </p>
                </div>

              </div>

              <ChevronRight
                className="
                  w-5
                  h-5
                  text-gray-600
                  group-hover:text-emerald-400
                  transition-colors
                "
              />
            </button>

          </div>

        </main>
      </div>
    </div>
  );
};

export default SettingsScreen;