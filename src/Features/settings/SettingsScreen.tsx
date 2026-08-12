import React, { useState } from "react";


import Sidebar from "../../components/Sidebar";

import SettingsProfile from "./SettingsProfile";
import SettingsSecurity from "./SettingsSecurity";
import SettingsNotifications from "./SettingsNotifications";
import SettingsAppearance from "./SettingsAppearance";
interface SettingsScreenProps {
  onNavigate?: (screen: string) => void;
  onLogout?: () => void;
}

export default function SettingsScreen({
  onNavigate,
  onLogout,
}: SettingsScreenProps) {
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
      <main className="flex-1 min-w-0 overflow-y-auto">

        {/* HEADER */}
        <header className="h-16 border-b border-emerald-900/30 bg-[#0d1310] px-6 flex items-center">
          <div>
            <h1 className="text-sm font-semibold text-white">
              Settings
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Manage your account and application preferences
            </p>
          </div>
        </header>

        {/* SETTINGS */}
        <div className="p-6 max-w-5xl space-y-6">

          <SettingsProfile />

          <SettingsSecurity />

          <SettingsNotifications />

          <SettingsAppearance />

        </div>

      </main>
    </div>
  );
}
