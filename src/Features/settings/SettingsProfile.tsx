import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Save,
} from "lucide-react";

const SettingsProfile: React.FC = () => {
  const [name, setName] = useState("Event Manager");
  const [email, setEmail] = useState("admin@eventmanager.com");
  const [phone, setPhone] = useState("+234 800 000 0000");
  const [role, setRole] = useState("Administrator");

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          Profile
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Manage your personal information.
        </p>
      </div>

      {/* PROFILE PHOTO */}
      <div className="flex items-center gap-5 mb-8">

        <div
          className="
            w-20
            h-20
            rounded-full
            bg-emerald-900/50
            border
            border-emerald-700/40
            flex
            items-center
            justify-center
            text-emerald-300
            text-xl
            font-bold
            shrink-0
          "
        >
          EM
        </div>

        <div>
          <h3 className="text-base font-semibold text-white">
            Profile Photo
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            Your profile image will be visible throughout the system.
          </p>

          <button
            className="
              mt-3
              px-3
              py-1.5
              text-xs
              font-medium
              text-emerald-400
              border
              border-emerald-800/50
              rounded-lg
              hover:bg-emerald-950/40
              transition
            "
          >
            Change Photo
          </button>
        </div>

      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* NAME */}
        <div>
          <label className="block text-xs text-gray-400 mb-2">
            Full Name
          </label>

          <div className="relative">
            <User
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full
                pl-10
                pr-4
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
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-xs text-gray-400 mb-2">
            Email Address
          </label>

          <div className="relative">
            <Mail
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full
                pl-10
                pr-4
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
          </div>
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-xs text-gray-400 mb-2">
            Phone Number
          </label>

          <div className="relative">
            <Phone
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="
                w-full
                pl-10
                pr-4
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
          </div>
        </div>

        {/* ROLE */}
        <div>
          <label className="block text-xs text-gray-400 mb-2">
            Role
          </label>

          <div className="relative">
            <Briefcase
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
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="
                w-full
                pl-10
                pr-4
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
          </div>
        </div>

      </div>

      {/* SAVE */}
      <div className="flex justify-end mt-7 pt-5 border-t border-emerald-900/20">

        <button
          className="
            flex
            items-center
            gap-2
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
          <Save className="w-4 h-4" />
          Save Changes
        </button>

      </div>

    </div>
  );
};

export default SettingsProfile;