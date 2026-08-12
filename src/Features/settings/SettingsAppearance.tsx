import React, { useState } from "react";
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  ArrowLeft,
} from "lucide-react";

interface SettingsAppearanceProps {
  onBack?: () => void;
}

const SettingsAppearance: React.FC<SettingsAppearanceProps> = ({
  onBack,
}) => {
  const [theme, setTheme] = useState("dark");

  return (
    <div className="min-h-screen bg-[#090d0b] text-white p-6">

      <div className="max-w-4xl">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">

          <button
            onClick={onBack}
            className="
              p-2
              rounded-lg
              text-gray-400
              hover:text-white
              hover:bg-emerald-950/40
              transition
            "
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-emerald-50">
              Appearance
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              Customize how Event Manager looks.
            </p>
          </div>

        </div>

        {/* THEME */}
        <div
          className="
            bg-[#121915]
            border
            border-emerald-900/30
            rounded-xl
            p-6
          "
        >

          <div className="flex items-center gap-3 mb-6">

            <Palette className="w-5 h-5 text-emerald-400" />

            <div>
              <h2 className="text-sm font-semibold">
                Theme
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Select your preferred application theme.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* DARK */}
            <button
              onClick={() => setTheme("dark")}
              className={`
                p-4
                rounded-xl
                border
                text-left
                transition
                ${
                  theme === "dark"
                    ? "border-emerald-500 bg-emerald-950/40"
                    : "border-emerald-900/30 bg-[#090d0b] hover:border-emerald-800"
                }
              `}
            >

              <div className="w-full h-20 rounded-lg bg-[#090d0b] border border-emerald-900/40 mb-4 flex items-center justify-center">
                <Moon className="w-6 h-6 text-emerald-400" />
              </div>

              <h3 className="text-sm font-semibold">
                Dark
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Dark interface
              </p>

            </button>

            {/* LIGHT */}
            <button
              onClick={() => setTheme("light")}
              className={`
                p-4
                rounded-xl
                border
                text-left
                transition
                ${
                  theme === "light"
                    ? "border-emerald-500 bg-emerald-950/40"
                    : "border-emerald-900/30 bg-[#090d0b] hover:border-emerald-800"
                }
              `}
            >

              <div className="w-full h-20 rounded-lg bg-gray-100 border border-gray-300 mb-4 flex items-center justify-center">
                <Sun className="w-6 h-6 text-gray-700" />
              </div>

              <h3 className="text-sm font-semibold">
                Light
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Light interface
              </p>

            </button>

            {/* SYSTEM */}
            <button
              onClick={() => setTheme("system")}
              className={`
                p-4
                rounded-xl
                border
                text-left
                transition
                ${
                  theme === "system"
                    ? "border-emerald-500 bg-emerald-950/40"
                    : "border-emerald-900/30 bg-[#090d0b] hover:border-emerald-800"
                }
              `}
            >

              <div className="w-full h-20 rounded-lg bg-gradient-to-r from-gray-100 to-[#090d0b] border border-gray-600 mb-4 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-emerald-400" />
              </div>

              <h3 className="text-sm font-semibold">
                System
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Follow device settings
              </p>

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SettingsAppearance;