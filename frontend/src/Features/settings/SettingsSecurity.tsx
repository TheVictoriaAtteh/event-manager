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

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          Security
        </h2>

        <p className="text-sm text-gray-400 mt-1">
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
              bg-emerald-950/40
              border
              border-emerald-900/40
              flex
              items-center
              justify-center
            "
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Change Password
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Update your password regularly to keep your account secure.
            </p>
          </div>

        </div>

        <div className="max-w-md">

          {/* CURRENT PASSWORD */}
          <div className="mb-4">

            <label className="block text-xs text-gray-400 mb-2">
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
                  text-gray-500
                "
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
                className="
                  w-full
                  pl-10
                  pr-10
                  py-2.5
                  bg-[#090d0b]
                  border
                  border-emerald-900/40
                  rounded-lg
                  text-sm
                  text-white
                  placeholder-gray-600
                  focus:outline-none
                  focus:border-emerald-500
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-white
                "
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

            <label className="block text-xs text-gray-400 mb-2">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              className="
                w-full
                px-4
                py-2.5
                bg-[#090d0b]
                border
                border-emerald-900/40
                rounded-lg
                text-sm
                text-white
                placeholder-gray-600
                focus:outline-none
                focus:border-emerald-500
              "
            />

          </div>

          {/* CONFIRM PASSWORD */}
          <div>

            <label className="block text-xs text-gray-400 mb-2">
              Confirm New Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              className="
                w-full
                px-4
                py-2.5
                bg-[#090d0b]
                border
                border-emerald-900/40
                rounded-lg
                text-sm
                text-white
                placeholder-gray-600
                focus:outline-none
                focus:border-emerald-500
              "
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
                text-emerald-950
                font-semibold
                text-sm
                rounded-lg
                transition
              "
            >
              Update Password
            </button>

          </div>

        </div>

      </div>

      {/* TWO FACTOR */}
      <div
        className="
          border-t
          border-emerald-900/20
          pt-6
        "
      >

        <div className="flex items-center justify-between">

          <div>

            <h3 className="text-sm font-semibold text-white">
              Two-Factor Authentication
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Add an extra layer of protection to your account.
            </p>

          </div>

          {/* TOGGLE */}
          <button
            type="button"
            onClick={() => setTwoFactor(!twoFactor)}
            className={`
              relative
              w-11
              h-6
              rounded-full
              transition-colors
              shrink-0
              ${
                twoFactor
                  ? "bg-emerald-600"
                  : "bg-gray-700"
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
                transition-transform
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