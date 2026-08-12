import React from "react";
import { ArrowLeft, LogOut } from "lucide-react";

import SettingsProfile from "./SettingsProfile";
import SettingsSecurity from "./SettingsSecurity";
import SettingsNotifications from "./SettingsNotifications";
import SettingsAppearance from "./SettingsAppearance";

interface SettingsScreenProps {
  onBack?: () => void;
  onLogout?: () => void;
}

export default function SettingsScreen({
  onBack,
  onLogout,
}: SettingsScreenProps) {
  return (
    <div className="min-h-screen bg-[#090d0b] text-white relative overflow-hidden">

      {/* POLKA DOT BACKGROUND */}
      <div
        className="
          fixed
          inset-0
          pointer-events-none
          opacity-50
        "
        style={{
          backgroundImage:
  "radial-gradient(circle, rgba(16, 185, 129, 0.45) 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* MAIN CONTENT */}
      <div className="relative z-10 min-h-screen">

        <main className="max-w-5xl mx-auto px-6 py-8">

          {/* TOP BAR */}
          <div className="flex items-center justify-between mb-8">

            {/* BACK TO DASHBOARD */}
            <button
              onClick={onBack}
              className="
                flex
                items-center
                gap-2
                text-sm
                text-gray-400
                hover:text-white
                transition
              "
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>

            {/* LOGOUT */}
            <button
              onClick={onLogout}
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-lg
                bg-emerald-600
                hover:bg-emerald-500
                text-emerald-950
                text-sm
                font-semibold
                transition-colors
                shadow-lg
                shadow-emerald-900/20
              "
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>

          </div>

          {/* SETTINGS HEADER */}
          <div className="mb-8">

            <h1 className="text-2xl font-bold text-emerald-50">
              Settings
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              Manage your account and application preferences.
            </p>

          </div>

          {/* SETTINGS CARD */}
          <div
            className="
              bg-[#121915]
              border
              border-emerald-900/30
              rounded-xl
              overflow-hidden
            "
          >

            {/* PROFILE */}
            <SettingsProfile />

            {/* DIVIDER */}
            <div className="border-t border-emerald-900/30" />

            {/* SECURITY */}
            <SettingsSecurity />

            {/* DIVIDER */}
            <div className="border-t border-emerald-900/30" />

            {/* NOTIFICATIONS */}
            <SettingsNotifications />

            {/* DIVIDER */}
            <div className="border-t border-emerald-900/30" />

            {/* APPEARANCE */}
            <SettingsAppearance />

          </div>

          {/* BOTTOM SPACE */}
          <div className="h-10" />

        </main>

      </div>
    </div>
  );
}