import React, { useState } from "react";
import { ArrowLeft, LogOut, User, Lock, Bell, Palette } from "lucide-react";

import SettingsProfile from "./SettingsProfile";
import SettingsSecurity from "./SettingsSecurity";
import SettingsNotifications from "./SettingsNotifications";
import SettingsAppearance from "./SettingsAppearance";

export type SettingsSectionId =
  | "profile"
  | "security"
  | "notifications"
  | "appearance";

interface SettingsScreenProps {
  onBack?: () => void;
  onLogout?: () => void;
  initialSection?: SettingsSectionId;
}

const SETTINGS_NAV: {
  id: SettingsSectionId;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export default function SettingsScreen({
  onBack,
  onLogout,
  initialSection = "profile",
}: SettingsScreenProps) {
  const [activeSection, setActiveSection] =
    useState<SettingsSectionId>(initialSection);

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)]">
      <main className="max-w-5xl mx-auto px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <button
            onClick={onLogout}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-emerald-600 hover:bg-emerald-500
              text-emerald-950 text-sm font-semibold
              transition-colors shadow-lg shadow-emerald-900/20
            "
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-emerald-500">Settings</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage your account and application preferences.
          </p>
        </div>

        <div className="flex gap-6 items-start">
          <aside
            className="
              w-[220px] shrink-0
              bg-[var(--bg-surface)]
              border border-[var(--border-subtle)]
              rounded-xl
              p-2
            "
          >
            <nav className="space-y-1">
              {SETTINGS_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`
                      w-full flex items-center gap-3
                      px-3 py-2.5 rounded-lg text-left
                      transition-colors text-sm font-medium
                      ${
                        isActive
                          ? "bg-emerald-950/70 border border-emerald-800/50 text-emerald-400"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-emerald-950/20 border border-transparent"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <section
            className="
              flex-1
              bg-[var(--bg-surface)]
              border border-[var(--border-subtle)]
              rounded-xl
              overflow-hidden
            "
          >
            {activeSection === "profile" && <SettingsProfile />}
            {activeSection === "security" && <SettingsSecurity />}
            {activeSection === "notifications" && <SettingsNotifications />}
            {activeSection === "appearance" && <SettingsAppearance />}
          </section>
        </div>

        <div className="h-10" />
      </main>
    </div>
  );
}