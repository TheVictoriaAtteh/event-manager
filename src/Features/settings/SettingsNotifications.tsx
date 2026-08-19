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
        cursor-pointer
        ${
          enabled
            ? "bg-emerald-600"
            : "bg-gray-300"
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
    <section
      className="
        bg-[var(--bg-surface)]
        border border-[var(--border-subtle)]
        rounded-xl
        overflow-hidden
        shadow-sm
      "
    >
      {/* HEADER */}
      <div
        className="
          p-6
          border-b border-[var(--border-subtle)]
        "
      >
        <div className="flex items-center gap-3">

          <div
            className="
              w-10 h-10
              rounded-lg
              bg-emerald-500/10
              border border-emerald-500/20
              flex items-center justify-center
              shrink-0
            "
          >
            <Bell
              className="
                w-5 h-5
                text-[var(--text-accent)]
              "
            />
          </div>

          <div>
            <h2
              className="
                text-base
                font-semibold
                text-[var(--text-heading)]
              "
            >
              Notifications
            </h2>

            <p
              className="
                text-xs
                text-[var(--text-muted)]
                mt-1
              "
            >
              Choose which notifications you want to receive.
            </p>
          </div>

        </div>
      </div>

      {/* NOTIFICATION OPTIONS */}
      <div className="divide-y divide-[var(--border-subtle)]">

        {/* EMAIL */}
        <div
          className="
            p-5
            flex
            items-center
            justify-between
            gap-6
            hover:bg-[var(--hover-surface)]
            transition-colors
          "
        >
          <div className="flex items-center gap-4">

            <div
              className="
                w-9 h-9
                rounded-lg
                bg-emerald-500/10
                border border-emerald-500/10
                flex items-center justify-center
                shrink-0
              "
            >
              <Mail
                className="
                  w-4 h-4
                  text-[var(--text-accent)]
                "
              />
            </div>

            <div>
              <h3
                className="
                  text-sm
                  font-medium
                  text-[var(--text-primary)]
                "
              >
                Email Notifications
              </h3>

              <p
                className="
                  text-xs
                  text-[var(--text-muted)]
                  mt-1
                "
              >
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
        <div
          className="
            p-5
            flex
            items-center
            justify-between
            gap-6
            hover:bg-[var(--hover-surface)]
            transition-colors
          "
        >
          <div className="flex items-center gap-4">

            <div
              className="
                w-9 h-9
                rounded-lg
                bg-emerald-500/10
                border border-emerald-500/10
                flex items-center justify-center
                shrink-0
              "
            >
              <CalendarDays
                className="
                  w-4 h-4
                  text-[var(--text-accent)]
                "
              />
            </div>

            <div>
              <h3
                className="
                  text-sm
                  font-medium
                  text-[var(--text-primary)]
                "
              >
                Event Reminders
              </h3>

              <p
                className="
                  text-xs
                  text-[var(--text-muted)]
                  mt-1
                "
              >
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
        <div
          className="
            p-5
            flex
            items-center
            justify-between
            gap-6
            hover:bg-[var(--hover-surface)]
            transition-colors
          "
        >
          <div className="flex items-center gap-4">

            <div
              className="
                w-9 h-9
                rounded-lg
                bg-emerald-500/10
                border border-emerald-500/10
                flex items-center justify-center
                shrink-0
              "
            >
              <Users
                className="
                  w-4 h-4
                  text-[var(--text-accent)]
                "
              />
            </div>

            <div>
              <h3
                className="
                  text-sm
                  font-medium
                  text-[var(--text-primary)]
                "
              >
                Attendee Updates
              </h3>

              <p
                className="
                  text-xs
                  text-[var(--text-muted)]
                  mt-1
                "
              >
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
        <div
          className="
            p-5
            flex
            items-center
            justify-between
            gap-6
            hover:bg-[var(--hover-surface)]
            transition-colors
          "
        >
          <div className="flex items-center gap-4">

            <div
              className="
                w-9 h-9
                rounded-lg
                bg-emerald-500/10
                border border-emerald-500/10
                flex items-center justify-center
                shrink-0
              "
            >
              <Bell
                className="
                  w-4 h-4
                  text-[var(--text-accent)]
                "
              />
            </div>

            <div>
              <h3
                className="
                  text-sm
                  font-medium
                  text-[var(--text-primary)]
                "
              >
                System Notifications
              </h3>

              <p
                className="
                  text-xs
                  text-[var(--text-muted)]
                  mt-1
                "
              >
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