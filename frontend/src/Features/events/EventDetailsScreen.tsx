import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Attendee {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  status: "Confirmed" | "Checked In" | "Cancelled";
}

const MOCK_ATTENDEES: Attendee[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    registeredAt: "Aug 10, 2026",
    status: "Checked In",
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    registeredAt: "Aug 11, 2026",
    status: "Confirmed",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@example.com",
    registeredAt: "Aug 12, 2026",
    status: "Confirmed",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    registeredAt: "Aug 14, 2026",
    status: "Cancelled",
  },
];

interface EventDetailsScreenProps {
  /** Selected event; consumed once this screen is wired to the API. */
  eventId?: string;
  onBack: () => void;
  /** Opens the attendee management screen for this event. */
  onManageAttendees?: () => void;
}

export const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({
  onBack,
  onManageAttendees,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [attendees, setAttendees] = useState<Attendee[]>(MOCK_ATTENDEES);

  const filteredAttendees = attendees.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCheckIn = (id: string) => {
    setAttendees((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.status === "Checked In" ? "Confirmed" : "Checked In";

          return {
            ...item,
            status: nextStatus,
          };
        }

        return item;
      })
    );
  };

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)] p-6">
      <div className="max-w-[1500px] mx-auto space-y-6">

        {/* TOP HEADER */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="
              inline-flex
              items-center
              gap-2
              px-3
              py-2
              rounded-lg
              text-xs
              text-[var(--text-secondary)]
              hover:text-[var(--text-accent)]
              hover:bg-[var(--hover-surface)]
              font-medium
              transition-colors
              cursor-pointer
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>
          {onManageAttendees && (
            <button
              onClick={onManageAttendees}
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-lg
                bg-emerald-500
                hover:bg-emerald-400
                text-emerald-950
                text-xs
                font-semibold
                transition-colors
                cursor-pointer
                shadow-lg
                shadow-emerald-500/10
              "
            >
              <Users className="w-4 h-4" />
              Manage Attendees
            </button>
          )}
        </div>

        {/* EVENT HEADER BANNER */}
        <div
          className="
            bg-[var(--bg-surface)]
            border
            border-[var(--border-default)]
            rounded-2xl
            p-6
            shadow-sm
            space-y-4
          "
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span
                className="
                  inline-flex
                  px-2.5
                  py-0.5
                  bg-emerald-500/10
                  border
                  border-emerald-500/20
                  text-[var(--text-accent)]
                  text-[10px]
                  font-semibold
                  rounded-full
                  uppercase
                  tracking-wider
                "
              >
                Conference
              </span>

              <h1
                className="
                  text-2xl
                  font-bold
                  text-[var(--text-heading)]
                  mt-2
                "
              >
                Tech Innovators Summit 2026
              </h1>

              <p
                className="
                  text-xs
                  text-[var(--text-secondary)]
                  mt-1
                  max-w-2xl
                "
              >
                Join industry leaders discussing AI trends, modern Web
                Development, and future software architecture.
              </p>
            </div>
          </div>

          {/* EVENT INFORMATION */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-3
              gap-4
              pt-4
              border-t
              border-[var(--border-subtle)]
              text-xs
            "
          >
            <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
              <Calendar className="w-4 h-4 text-[var(--text-accent)]" />
              <span>Aug 24, 2026</span>
            </div>

            <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
              <Clock className="w-4 h-4 text-[var(--text-accent)]" />
              <span>09:00 AM - 05:00 PM</span>
            </div>

            <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
              <MapPin className="w-4 h-4 text-[var(--text-accent)]" />
              <span>Main Auditorium, Tech Hub</span>
            </div>
          </div>
        </div>

        {/* ATTENDEES SECTION */}
        <div
          className="
            bg-[var(--bg-surface)]
            border
            border-[var(--border-default)]
            rounded-2xl
            p-6
            shadow-sm
            space-y-4
          "
        >
          {/* SECTION HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--text-accent)]" />

              <h2 className="text-base font-bold text-[var(--text-heading)]">
                Registered Attendees
              </h2>

              <span
                className="
                  px-2
                  py-0.5
                  bg-emerald-500/10
                  border
                  border-emerald-500/20
                  text-[var(--text-accent)]
                  text-xs
                  font-semibold
                  rounded-md
                "
              >
                {attendees.length}
              </span>
            </div>

            {/* SEARCH */}
            <div className="relative w-full sm:w-64">
              <Search
                className="
                  w-3.5
                  h-3.5
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-[var(--text-muted)]
                "
              />

              <input
                type="text"
                placeholder="Search attendee name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full
                  pl-8
                  pr-3
                  py-1.5
                  bg-[var(--bg-input)]
                  border
                  border-[var(--border-default)]
                  rounded-lg
                  text-xs
                  text-[var(--text-primary)]
                  placeholder:text-[var(--text-muted)]
                  focus:outline-none
                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-500/10
                  transition-all
                "
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr
                  className="
                    border-b
                    border-[var(--border-subtle)]
                    text-[var(--text-secondary)]
                  "
                >
                  <th className="py-3 px-3 font-semibold">
                    Attendee
                  </th>

                  <th className="py-3 px-3 font-semibold">
                    Registered Date
                  </th>

                  <th className="py-3 px-3 font-semibold">
                    Status
                  </th>

                  <th className="py-3 px-3 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody
                className="
                  divide-y
                  divide-[var(--border-subtle)]
                "
              >
                {filteredAttendees.map((a) => (
                  <tr
                    key={a.id}
                    className="
                      hover:bg-emerald-500/5
                      transition-colors
                    "
                  >
                    {/* ATTENDEE */}
                    <td className="py-3 px-3">
                      <p className="font-medium text-[var(--text-primary)]">
                        {a.name}
                      </p>

                      <p
                        className="
                          text-[11px]
                          text-[var(--text-secondary)]
                          flex
                          items-center
                          gap-1
                          mt-0.5
                        "
                      >
                        <Mail className="w-3 h-3 text-[var(--text-muted)]" />
                        {a.email}
                      </p>
                    </td>

                    {/* REGISTERED DATE */}
                    <td className="py-3 px-3 text-[var(--text-secondary)]">
                      {a.registeredAt}
                    </td>

                    {/* STATUS */}
                    <td className="py-3 px-3">
                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1
                          px-2
                          py-0.5
                          rounded-full
                          text-[10px]
                          font-semibold
                          ${
                            a.status === "Checked In"
                              ? `
                                bg-emerald-500/10
                                text-emerald-600
                                dark:text-emerald-400
                                border
                                border-emerald-500/30
                              `
                              : a.status === "Confirmed"
                              ? `
                                bg-blue-500/10
                                text-blue-600
                                dark:text-blue-400
                                border
                                border-blue-500/30
                              `
                              : `
                                bg-red-500/10
                                text-red-600
                                dark:text-red-400
                                border
                                border-red-500/30
                              `
                          }
                        `}
                      >
                        {a.status === "Checked In" && (
                          <CheckCircle className="w-3 h-3" />
                        )}

                        {a.status === "Cancelled" && (
                          <XCircle className="w-3 h-3" />
                        )}

                        {a.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="py-3 px-3 text-right">
                      {a.status !== "Cancelled" && (
                        <button
                          onClick={() => toggleCheckIn(a.id)}
                          className="
                            px-2.5
                            py-1
                            bg-[var(--bg-input)]
                            hover:bg-emerald-500/10
                            border
                            border-[var(--border-default)]
                            rounded-md
                            text-[11px]
                            text-[var(--text-accent)]
                            font-medium
                            transition-colors
                            cursor-pointer
                          "
                        >
                          {a.status === "Checked In"
                            ? "Undo Check-In"
                            : "Check In"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EMPTY STATE */}
          {filteredAttendees.length === 0 && (
            <div className="py-12 text-center">
              <Users
                className="
                  w-8
                  h-8
                  text-[var(--text-muted)]
                  mx-auto
                  mb-3
                "
              />

              <h3
                className="
                  text-sm
                  font-semibold
                  text-[var(--text-primary)]
                "
              >
                No attendees found
              </h3>

              <p
                className="
                  text-xs
                  text-[var(--text-muted)]
                  mt-1
                "
              >
                Try adjusting your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};