import React, { useState } from "react";
import {
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

const SettingsSecurity: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const inputClass = `
    w-full
    pl-10
    pr-10
    py-2.5
    bg-[var(--bg-input)]
    border
    border-[var(--border-default)]
    rounded-lg
    text-sm
    text-[var(--text-primary)]
    placeholder-[var(--text-muted)]
    focus:outline-none
    focus:border-emerald-500
    focus:ring-1
    focus:ring-emerald-500/20
    transition
  `;

  const normalInputClass = `
    w-full
    px-4
    py-2.5
    bg-[var(--bg-input)]
    border
    border-[var(--border-default)]
    rounded-lg
    text-sm
    text-[var(--text-primary)]
    placeholder-[var(--text-muted)]
    focus:outline-none
    focus:border-emerald-500
    focus:ring-1
    focus:ring-emerald-500/20
    transition
  `;

  return (
    <div className="p-6 bg-[var(--bg-surface)] text-[var(--text-primary)]">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-heading)]">
          Security
        </h2>

        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage your password and account security.
        </p>
      </div>

      {/* CHANGE PASSWORD */}
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
            <ShieldCheck className="w-4 h-4 text-[var(--text-accent)]" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-heading)]">
              Change Password
            </h3>

            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Update your password regularly to keep your account secure.
            </p>
          </div>

        </div>

        <div className="max-w-md">

          {/* CURRENT PASSWORD */}
          <div className="mb-4">

            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
              Current Password
            </label>

            <div className="relative">

              <Lock
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  w-4
                  h-4
                  text-[var(--text-muted)]
                "
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
                className={inputClass}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[var(--text-muted)]
                  hover:text-[var(--text-primary)]
                  transition
                "
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>

            </div>

          </div>

          {/* NEW PASSWORD */}
          <div className="mb-4">

            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              className={normalInputClass}
            />

          </div>

          {/* CONFIRM PASSWORD */}
          <div>

            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
              Confirm New Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              className={normalInputClass}
            />

          </div>

          {/* UPDATE PASSWORD */}
          <div className="flex justify-end mt-5">

            <button
              type="button"
              className="
                px-5
                py-2.5
                bg-emerald-600
                hover:bg-emerald-500
                text-white
                font-semibold
                text-sm
                rounded-lg
                transition
                shadow-sm
                shadow-emerald-600/20
              "
            >
              Update Password
            </button>

          </div>

        </div>

      </div>

      {/* TWO FACTOR */}
      <div className="border-t border-[var(--border-subtle)] pt-6">

        <div className="flex items-center justify-between gap-6">

          <div>

            <h3 className="text-sm font-semibold text-[var(--text-heading)]">
              Two-Factor Authentication
            </h3>

            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Add an extra layer of protection to your account.
            </p>

          </div>

          {/* TOGGLE */}
          <button
            type="button"
            onClick={() => setTwoFactor(!twoFactor)}
            aria-pressed={twoFactor}
            className={`
              relative
              w-11
              h-6
              rounded-full
              transition-colors
              duration-200
              shrink-0
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500/30
              ${
                twoFactor
                  ? "bg-emerald-600"
                  : "bg-[var(--toggle-off)]"
              }
            `}
          >
            <span
              className={`
                absolute
                top-1
                left-1
                w-4
                h-4
                rounded-full
                bg-white
                shadow-sm
                transition-transform
                duration-200
                ${
                  twoFactor
                    ? "translate-x-5"
                    : "translate-x-0"
                }
              `}
            />
          </button>

        </div>

      </div>

    </div>
  );
};

export default SettingsSecurity;