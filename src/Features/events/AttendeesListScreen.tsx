import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  UserCheck,
  UserX,
  Clock,
  Download,
  Mail,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  status: "Checked In" | "Pending" | "Cancelled";
  checkInTime?: string;
}

const MOCK_ATTENDEES: Attendee[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    ticketType: "VIP Pass",
    status: "Checked In",
    checkInTime: "08:45 AM",
  },
  {
    id: "2",
    name: "Alex Rivera",
    email: "alex.r@example.com",
    ticketType: "General Admission",
    status: "Pending",
  },
  {
    id: "3",
    name: "David Chen",
    email: "d.chen@example.com",
    ticketType: "Speaker",
    status: "Checked In",
    checkInTime: "09:12 AM",
  },
  {
    id: "4",
    name: "Emily Watson",
    email: "emily.w@example.com",
    ticketType: "General Admission",
    status: "Pending",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "m.brown@example.com",
    ticketType: "VIP Pass",
    status: "Cancelled",
  },
];

interface AttendeesListScreenProps {
  onBack: () => void;
}

export const AttendeesListScreen: React.FC<AttendeesListScreenProps> = ({
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "All" | "Checked In" | "Pending"
  >("All");

  const [attendees, setAttendees] =
    useState<Attendee[]>(MOCK_ATTENDEES);

  const toggleCheckIn = (id: string) => {
    setAttendees((prev) =>
      prev.map((attendee) => {
        if (attendee.id !== id) {
          return attendee;
        }

        const isCheckedIn = attendee.status === "Checked In";

        return {
          ...attendee,
          status: isCheckedIn ? "Pending" : "Checked In",
          checkInTime: isCheckedIn
            ? undefined
            : new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
        };
      })
    );
  };

  const filteredAttendees = attendees.filter((attendee) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      attendee.name.toLowerCase().includes(search) ||
      attendee.email.toLowerCase().includes(search);

    const matchesFilter =
      statusFilter === "All" ||
      attendee.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)] font-sans">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 py-8">

        {/* TOP ACTIONS */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="
              flex items-center gap-2
              text-sm
              text-[var(--text-secondary)]
              hover:text-[var(--text-primary)]
              transition-colors
              cursor-pointer
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <button
            className="
              flex items-center gap-2
              px-4 py-2.5
              rounded-lg
              bg-[var(--bg-surface)]
              border border-[var(--border-default)]
              hover:border-emerald-500/40
              hover:bg-[var(--bg-input)]
              text-emerald-500
              text-sm
              font-semibold
              transition-all
              cursor-pointer
            "
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* MAIN PANEL */}
        <div
          className="
            bg-[var(--bg-surface)]
            border border-[var(--border-default)]
            rounded-2xl
            overflow-hidden
            shadow-sm
          "
        >

          {/* HEADER */}
          <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6">
            <div className="flex items-start gap-4">

              <div
                className="
                  w-10 h-10
                  rounded-xl
                  bg-emerald-500/10
                  border border-emerald-500/20
                  flex items-center justify-center
                  text-emerald-500
                  shrink-0
                "
              >
                <UserCheck className="w-5 h-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                  Event Attendees
                </h1>

                <p className="text-sm text-[var(--text-secondary)] mt-1.5">
                  Manage registrations, track attendance, and verify
                  attendee check-ins in real-time.
                </p>
              </div>

            </div>
          </div>

          {/* SEARCH + FILTERS */}
          <div
            className="
              px-6 sm:px-10 pb-7
              flex flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-4
            "
          >

            {/* SEARCH */}
            <div className="relative w-full lg:w-[420px]">
              <Search
                className="
                  absolute left-3.5 top-1/2
                  -translate-y-1/2
                  w-4 h-4
                  text-[var(--text-muted)]
                "
              />

              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full
                  pl-10 pr-4 py-2.5
                  bg-[var(--bg-input)]
                  border border-[var(--border-default)]
                  rounded-lg
                  text-sm
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

            {/* FILTER BUTTONS */}
            <div className="flex items-center gap-2 flex-wrap">

              {(["All", "Checked In", "Pending"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`
                      px-4 py-2
                      rounded-lg
                      text-xs
                      font-medium
                      border
                      transition-all
                      cursor-pointer

                      ${
                        statusFilter === tab
                          ? `
                            bg-emerald-500/10
                            border-emerald-500/30
                            text-emerald-500
                          `
                          : `
                            bg-[var(--bg-input)]
                            border-[var(--border-default)]
                            text-[var(--text-secondary)]
                            hover:text-[var(--text-primary)]
                            hover:border-emerald-500/30
                          `
                      }
                    `}
                  >
                    {tab}
                  </button>
                )
              )}

            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-[var(--border-subtle)]" />

          {/* ATTENDEE TABLE */}
          <div className="px-6 sm:px-10 py-8">

            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Registered Attendees
                </h2>

                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {filteredAttendees.length}{" "}
                  {filteredAttendees.length === 1
                    ? "attendee"
                    : "attendees"}{" "}
                  shown
                </p>
              </div>
            </div>

            {/* TABLE */}
            <div
              className="
                overflow-x-auto
                rounded-xl
                border border-[var(--border-subtle)]
                bg-[var(--bg-input)]
              "
            >
              <table className="w-full text-left border-collapse">

                {/* TABLE HEADER */}
                <thead>
                  <tr
                    className="
                      border-b
                      border-[var(--border-subtle)]
                      text-[11px]
                      font-semibold
                      text-[var(--text-secondary)]
                      uppercase
                      tracking-wider
                      bg-[var(--bg-surface)]
                    "
                  >
                    <th className="p-4">
                      Attendee
                    </th>

                    <th className="p-4">
                      Ticket Type
                    </th>

                    <th className="p-4">
                      Status
                    </th>

                    <th className="p-4">
                      Check-In Time
                    </th>

                    <th className="p-4 text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody
                  className="
                    divide-y
                    divide-[var(--border-subtle)]
                    text-sm
                  "
                >
                  {filteredAttendees.map((attendee) => (
                    <tr
                      key={attendee.id}
                      className="
                        hover:bg-emerald-500/5
                        transition-colors
                      "
                    >

                      {/* ATTENDEE */}
                      <td className="p-4">
                        <div className="font-semibold text-[var(--text-primary)]">
                          {attendee.name}
                        </div>

                        <div
                          className="
                            text-xs
                            text-[var(--text-secondary)]
                            flex
                            items-center
                            gap-1.5
                            mt-1
                          "
                        >
                          <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />

                          {attendee.email}
                        </div>
                      </td>

                      {/* TICKET */}
                      <td className="p-4">
                        <span className="text-[var(--text-secondary)] font-medium">
                          {attendee.ticketType}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="p-4">
                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            px-3
                            py-1
                            rounded-full
                            text-[11px]
                            font-semibold
                            border

                            ${
                              attendee.status === "Checked In"
                                ? `
                                  bg-emerald-500/10
                                  border-emerald-500/20
                                  text-emerald-500
                                `
                                : attendee.status === "Pending"
                                ? `
                                  bg-amber-500/10
                                  border-amber-500/20
                                  text-amber-500
                                `
                                : `
                                  bg-rose-500/10
                                  border-rose-500/20
                                  text-rose-500
                                `
                            }
                          `}
                        >
                          {attendee.status === "Checked In" && (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}

                          {attendee.status === "Pending" && (
                            <Clock className="w-3.5 h-3.5" />
                          )}

                          {attendee.status === "Cancelled" && (
                            <XCircle className="w-3.5 h-3.5" />
                          )}

                          {attendee.status}
                        </span>
                      </td>

                      {/* CHECK-IN TIME */}
                      <td className="p-4">
                        <span className="text-[var(--text-secondary)]">
                          {attendee.checkInTime || "--"}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="p-4 text-right">
                        {attendee.status !== "Cancelled" && (
                          <button
                            onClick={() =>
                              toggleCheckIn(attendee.id)
                            }
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              px-3
                              py-1.5
                              rounded-lg
                              text-xs
                              font-semibold
                              transition-all
                              cursor-pointer

                              ${
                                attendee.status === "Checked In"
                                  ? `
                                    bg-rose-500/10
                                    border
                                    border-rose-500/20
                                    text-rose-500
                                    hover:bg-rose-500/20
                                  `
                                  : `
                                    bg-emerald-500
                                    hover:bg-emerald-400
                                    text-emerald-950
                                  `
                              }
                            `}
                          >
                            {attendee.status === "Checked In" ? (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                Undo
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                Check In
                              </>
                            )}
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
              <div className="py-16 text-center">

                <div
                  className="
                    w-12 h-12
                    mx-auto
                    mb-4
                    rounded-xl
                    bg-emerald-500/10
                    border border-emerald-500/20
                    flex items-center justify-center
                  "
                >
                  <UserCheck className="w-5 h-5 text-emerald-500" />
                </div>

                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  No attendees found
                </h3>

                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Try changing your search or filter.
                </p>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};