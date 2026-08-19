import React from "react";
import {
  Palette,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useTheme } from "../../context/useTheme";
import type { ThemePreference } from "../../context/theme-context";

const SettingsAppearance: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const options: {
    id: ThemePreference;
    label: string;
    blurb: string;
  }[] = [
    {
      id: "dark",
      label: "Dark",
      blurb: "Dark interface",
    },
    {
      id: "light",
      label: "Light",
      blurb: "Light interface",
    },
    {
      id: "system",
      label: "System",
      blurb: "Follow device settings",
    },
  ];

  return (
    <div className="p-6 bg-[var(--bg-surface)] text-[var(--text-primary)]">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-heading)]">
          Appearance
        </h2>

        <p className="text-sm text-[var(--text-secondary)] mt-1">
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
              bg-emerald-500/10
              border
              border-emerald-500/20
              flex
              items-center
              justify-center
            "
          >
            <Palette className="w-4 h-4 text-[var(--text-accent)]" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-heading)]">
              Theme
            </h3>

            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Select your preferred application theme.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {options.map((opt) => {
            const Icon =
              opt.id === "dark"
                ? Moon
                : opt.id === "light"
                ? Sun
                : Monitor;

            const isActive = theme === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                className={`
                  p-4
                  rounded-xl
                  border
                  text-left
                  transition
                  ${
                    isActive
                      ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/20"
                      : "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-emerald-300 hover:bg-[var(--hover-surface)]"
                  }
                `}
              >

                {/* PREVIEW */}
                <div
                  className={`
                    w-full
                    h-20
                    rounded-lg
                    mb-4
                    flex
                    items-center
                    justify-center
                    border
                    ${
                      opt.id === "dark"
                        ? "bg-[#121915] border-[#263b31]"
                        : opt.id === "light"
                        ? "bg-white border-gray-200"
                        : "bg-gradient-to-r from-white via-white to-[#121915] border-gray-200"
                    }
                  `}
                >
                  <Icon
                    className={`
                      w-6
                      h-6
                      ${
                        opt.id === "dark"
                          ? "text-emerald-400"
                          : opt.id === "light"
                          ? "text-emerald-600"
                          : "text-emerald-600"
                      }
                    `}
                  />
                </div>

                <h3 className="text-sm font-semibold text-[var(--text-heading)]">
                  {opt.label}
                </h3>

                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {opt.blurb}
                </p>

                {/* ACTIVE INDICATOR */}
                {isActive && (
                  <div className="flex items-center gap-1.5 mt-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-medium text-emerald-600">
                      Currently selected
                    </span>
                  </div>
                )}

              </button>
            );
          })}

        </div>

      </div>

    </div>
  );
};

export default SettingsAppearance;