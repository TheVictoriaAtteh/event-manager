import React, { useState } from "react";
import {
  Palette,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

const SettingsAppearance: React.FC = () => {
  const [theme, setTheme] = useState("dark");

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          Appearance
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Customize how Event Manager looks.
        </p>
      </div>

      {/* THEME */}
      <div className="mb-8">

        <div className="flex items-center gap-3 mb-6">

          <div
            className="
              w-9
              h-9
              rounded-lg
              bg-emerald-950/40
              border
              border-emerald-900/40
              flex
              items-center
              justify-center
            "
          >
            <Palette className="w-4 h-4 text-emerald-400" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Theme
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Select your preferred application theme.
            </p>
          </div>

        </div>

        {/* THEME OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* DARK */}
          <button
            type="button"
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
                  : "border-emerald-900/30 bg-[#121915] hover:border-emerald-800"
              }
            `}
          >
            <div
              className="
                w-full
                h-20
                rounded-lg
                bg-[#090d0b]
                border
                border-emerald-900/40
                mb-4
                flex
                items-center
                justify-center
              "
            >
              <Moon className="w-6 h-6 text-emerald-400" />
            </div>

            <h3 className="text-sm font-semibold text-white">
              Dark
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Dark interface
            </p>
          </button>

          {/* LIGHT */}
          <button
            type="button"
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
                  : "border-emerald-900/30 bg-[#121915] hover:border-emerald-800"
              }
            `}
          >
            <div
              className="
                w-full
                h-20
                rounded-lg
                bg-gray-100
                border
                border-gray-300
                mb-4
                flex
                items-center
                justify-center
              "
            >
              <Sun className="w-6 h-6 text-gray-700" />
            </div>

            <h3 className="text-sm font-semibold text-white">
              Light
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Light interface
            </p>
          </button>

          {/* SYSTEM */}
          <button
            type="button"
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
                  : "border-emerald-900/30 bg-[#121915] hover:border-emerald-800"
              }
            `}
          >
            <div
              className="
                w-full
                h-20
                rounded-lg
                bg-gradient-to-r
                from-gray-100
                to-[#090d0b]
                border
                border-gray-600
                mb-4
                flex
                items-center
                justify-center
              "
            >
              <Monitor className="w-6 h-6 text-emerald-400" />
            </div>

            <h3 className="text-sm font-semibold text-white">
              System
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Follow device settings
            </p>
          </button>

        </div>

      </div>

    </div>
  );
};

export default SettingsAppearance;