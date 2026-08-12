import React, { useState } from "react";
import {
  Lock,
  ShieldCheck,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

interface SettingsSecurityProps {
  onBack?: () => void;
}

const SettingsSecurity: React.FC<SettingsSecurityProps> = ({
  onBack,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

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
              Security
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              Manage your password and account security.
            </p>
          </div>

        </div>

        <div className="space-y-5">

          {/* PASSWORD */}
          <div
            className="
              bg-[#121915]
              border
              border-emerald-900/30
              rounded-xl
              p-6
            "
          >

            <div className="flex items-center gap-3 mb-5">

              <ShieldCheck className="w-5 h-5 text-emerald-400" />

              <div>
                <h2 className="text-sm font-semibold">
                  Change Password
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Update your password regularly to keep your account secure.
                </p>
              </div>

            </div>

            <div className="max-w-md">

              <label className="block text-xs text-gray-400 mb-2">
                Current Password
              </label>

              <div className="relative mb-4">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

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
                    focus:outline-none
                    focus:border-emerald-500
                  "
                />

                <button
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
                  focus:outline-none
                  focus:border-emerald-500
                  mb-4
                "
              />

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
                  focus:outline-none
                  focus:border-emerald-500
                "
              />

              <button
                className="
                  mt-5
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

          {/* TWO FACTOR */}
          <div
            className="
              bg-[#121915]
              border
              border-emerald-900/30
              rounded-xl
              p-6
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h2 className="text-sm font-semibold">
                Two-Factor Authentication
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Add an extra layer of protection to your account.
              </p>

            </div>

            <button
              onClick={() => setTwoFactor(!twoFactor)}
              className={`
                w-11
                h-6
                rounded-full
                p-1
                transition
                ${twoFactor ? "bg-emerald-600" : "bg-gray-700"}
              `}
            >
              <div
                className={`
                  w-4
                  h-4
                  rounded-full
                  bg-white
                  transition-transform
                  ${twoFactor ? "translate-x-5" : "translate-x-0"}
                `}
              />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SettingsSecurity;