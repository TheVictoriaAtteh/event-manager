import { useState } from "react";
import { Bell, Mail, CalendarDays, Users } from "lucide-react";

interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={enabled}
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
          enabled
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
          shadow-sm
          transition-transform
          duration-200
          ${
            enabled
              ? "translate-x-5"
              : "translate-x-0"
          }
        `}
      />
    </button>
  );
}

export default function SettingsNotifications() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [attendeeUpdates, setAttendeeUpdates] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState(true);

  return (
    <section className="bg-[#121915] border border-emerald-900/30 rounded-xl overflow-hidden">

      {/* HEADER */}
      <div className="p-6 border-b border-emerald-900/20">
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-lg bg-emerald-950/60 flex items-center justify-center">
            <Bell className="w-5 h-5 text-emerald-400" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-white">
              Notifications
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Choose which notifications you want to receive.
            </p>
          </div>

        </div>
      </div>

      {/* NOTIFICATION OPTIONS */}
      <div className="divide-y divide-emerald-900/20">

        {/* EMAIL */}
        <div className="p-5 flex items-center justify-between gap-6">

          <div className="flex items-center gap-4">

            <div className="w-9 h-9 rounded-lg bg-emerald-950/40 flex items-center justify-center">
              <Mail className="w-4 h-4 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-200">
                Email Notifications
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Receive important updates and announcements by email.
              </p>
            </div>

          </div>

          <Toggle
            enabled={emailNotifications}
            onChange={() =>
              setEmailNotifications(!emailNotifications)
            }
          />

        </div>

        {/* EVENT REMINDERS */}
        <div className="p-5 flex items-center justify-between gap-6">

          <div className="flex items-center gap-4">

            <div className="w-9 h-9 rounded-lg bg-emerald-950/40 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-200">
                Event Reminders
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Get reminders about upcoming events.
              </p>
            </div>

          </div>

          <Toggle
            enabled={eventReminders}
            onChange={() =>
              setEventReminders(!eventReminders)
            }
          />

        </div>

        {/* ATTENDEE UPDATES */}
        <div className="p-5 flex items-center justify-between gap-6">

          <div className="flex items-center gap-4">

            <div className="w-9 h-9 rounded-lg bg-emerald-950/40 flex items-center justify-center">
              <Users className="w-4 h-4 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-200">
                Attendee Updates
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Get notified when attendee information changes.
              </p>
            </div>

          </div>

          <Toggle
            enabled={attendeeUpdates}
            onChange={() =>
              setAttendeeUpdates(!attendeeUpdates)
            }
          />

        </div>

        {/* SYSTEM NOTIFICATIONS */}
        <div className="p-5 flex items-center justify-between gap-6">

          <div className="flex items-center gap-4">

            <div className="w-9 h-9 rounded-lg bg-emerald-950/40 flex items-center justify-center">
              <Bell className="w-4 h-4 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-200">
                System Notifications
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Receive important system and security notifications.
              </p>
            </div>

          </div>

          <Toggle
            enabled={systemNotifications}
            onChange={() =>
              setSystemNotifications(!systemNotifications)
            }
          />

        </div>

      </div>

    </section>
  );
}