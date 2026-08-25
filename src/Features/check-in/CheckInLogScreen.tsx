import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  ClipboardList,
  MapPin,
  Clock,
  User,
  CheckCircle,
  Download,
} from "lucide-react";

interface CheckInRecord {
  id: string;
  name: string;
  email: string;
  location: string;
  date: string;
  time: string;
  status: "Checked In";
}

interface CheckInLogScreenProps {
  onBack: () => void;
}

const MOCK_CHECK_INS: CheckInRecord[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    location: "Main Entrance",
    date: "Aug 24, 2026",
    time: "08:42 AM",
    status: "Checked In",
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    location: "Main Entrance",
    date: "Aug 24, 2026",
    time: "08:47 AM",
    status: "Checked In",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@example.com",
    location: "East Entrance",
    date: "Aug 24, 2026",
    time: "08:53 AM",
    status: "Checked In",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    location: "VIP Entrance",
    date: "Aug 24, 2026",
    time: "09:01 AM",
    status: "Checked In",
  },
  {
    id: "5",
    name: "Daniel Brown",
    email: "daniel.b@example.com",
    location: "Main Entrance",
    date: "Aug 24, 2026",
    time: "09:06 AM",
    status: "Checked In",
  },
  {
    id: "6",
    name: "Jessica Wilson",
    email: "jessica.w@example.com",
    location: "East Entrance",
    date: "Aug 24, 2026",
    time: "09:14 AM",
    status: "Checked In",
  },
];

const CheckInLogScreen: React.FC<CheckInLogScreenProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecords = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return MOCK_CHECK_INS.filter(
      (record) =>
        record.name.toLowerCase().includes(search) ||
        record.email.toLowerCase().includes(search) ||
        record.location.toLowerCase().includes(search)
    );
  }, [searchTerm]);

  const totalCheckIns = MOCK_CHECK_INS.length;

  const locations = new Set(
    MOCK_CHECK_INS.map((record) => record.location)
  ).size;

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)]">
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">

          {/* BACK BUTTON */}
          <div className="mb-8">
            <button
              onClick={onBack}
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-2
                rounded-lg
                text-sm
                font-medium
                text-[var(--text-secondary)]
                hover:text-[var(--text-primary)]
                hover:bg-emerald-500/10
                transition-colors
                cursor-pointer
              "
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8">

            <div className="flex items-center gap-3">

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-emerald-500/10
                  border
                  border-emerald-500/20
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <ClipboardList className="w-5 h-5 text-emerald-500" />
              </div>

              <div>
                <h1
                  className="
                    text-2xl
                    font-bold
                    text-[var(--text-primary)]
                  "
                >
                  Check-In Log
                </h1>

                <p
                  className="
                    text-sm
                    text-[var(--text-secondary)]
                    mt-1
                  "
                >
                  View and monitor attendee check-in activity.
                </p>
              </div>

            </div>

            {/* EXPORT */}
            <button
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-4
                py-2.5
                rounded-lg
                bg-[var(--bg-surface)]
                border
                border-[var(--border-default)]
                text-[var(--text-secondary)]
                hover:text-emerald-500
                hover:border-emerald-500/40
                text-sm
                font-medium
                transition-colors
                cursor-pointer
              "
            >
              <Download className="w-4 h-4" />
              Export Log
            </button>

          </div>

          {/* EVENT */}
          <div
            className="
              bg-[var(--bg-surface)]
              border
              border-[var(--border-subtle)]
              rounded-2xl
              p-6
              mb-5
              shadow-sm
            "
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>
                <span
                  className="
                    inline-flex
                    items-center
                    px-2.5
                    py-1
                    rounded-full
                    bg-emerald-500/10
                    border
                    border-emerald-500/20
                    text-emerald-500
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                  "
                >
                  Admin View
                </span>

                <h2
                  className="
                    text-lg
                    font-bold
                    text-[var(--text-primary)]
                    mt-3
                  "
                >
                  Tech Innovators Summit 2026
                </h2>

                <p
                  className="
                    text-xs
                    text-[var(--text-secondary)]
                    mt-1
                  "
                >
                  August 24, 2026
                </p>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-[var(--text-secondary)]
                "
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Check-in system active
              </div>

            </div>
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

            {/* TOTAL CHECK-INS */}
            <div
              className="
                bg-[var(--bg-surface)]
                border
                border-[var(--border-subtle)]
                rounded-xl
                p-5
              "
            >
              <div className="flex items-center justify-between">

                <div>
                  <p
                    className="
                      text-xs
                      text-[var(--text-muted)]
                      mb-2
                    "
                  >
                    Total Check-Ins
                  </p>

                  <p
                    className="
                      text-2xl
                      font-bold
                      text-[var(--text-primary)]
                    "
                  >
                    {totalCheckIns}
                  </p>
                </div>

                <div
                  className="
                    w-10
                    h-10
                    rounded-lg
                    bg-emerald-500/10
                    border
                    border-emerald-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <User className="w-5 h-5 text-emerald-500" />
                </div>

              </div>
            </div>

            {/* LOCATIONS */}
            <div
              className="
                bg-[var(--bg-surface)]
                border
                border-[var(--border-subtle)]
                rounded-xl
                p-5
              "
            >
              <div className="flex items-center justify-between">

                <div>
                  <p
                    className="
                      text-xs
                      text-[var(--text-muted)]
                      mb-2
                    "
                  >
                    Check-In Locations
                  </p>

                  <p
                    className="
                      text-2xl
                      font-bold
                      text-[var(--text-primary)]
                    "
                  >
                    {locations}
                  </p>
                </div>

                <div
                  className="
                    w-10
                    h-10
                    rounded-lg
                    bg-emerald-500/10
                    border
                    border-emerald-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <MapPin className="w-5 h-5 text-emerald-500" />
                </div>

              </div>
            </div>

            {/* LATEST */}
            <div
              className="
                bg-[var(--bg-surface)]
                border
                border-[var(--border-subtle)]
                rounded-xl
                p-5
              "
            >
              <div className="flex items-center justify-between">

                <div>
                  <p
                    className="
                      text-xs
                      text-[var(--text-muted)]
                      mb-2
                    "
                  >
                    Latest Check-In
                  </p>

                  <p
                    className="
                      text-lg
                      font-bold
                      text-[var(--text-primary)]
                    "
                  >
                    {MOCK_CHECK_INS[MOCK_CHECK_INS.length - 1].time}
                  </p>
                </div>

                <div
                  className="
                    w-10
                    h-10
                    rounded-lg
                    bg-emerald-500/10
                    border
                    border-emerald-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Clock className="w-5 h-5 text-emerald-500" />
                </div>

              </div>
            </div>

          </div>

          {/* LOG TABLE */}
          <div
            className="
              bg-[var(--bg-surface)]
              border
              border-[var(--border-subtle)]
              rounded-2xl
              overflow-hidden
              shadow-sm
            "
          >

            {/* TABLE HEADER */}
            <div
              className="
                p-6
                border-b
                border-[var(--border-subtle)]
              "
            >

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <h2
                    className="
                      text-sm
                      font-semibold
                      text-[var(--text-primary)]
                    "
                  >
                    Check-In Activity
                  </h2>

                  <p
                    className="
                      text-xs
                      text-[var(--text-muted)]
                      mt-1
                    "
                  >
                    A record of everyone who has checked in.
                  </p>
                </div>

                {/* SEARCH */}
                <div className="relative w-full sm:w-72">

                  <Search
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
                    type="text"
                    placeholder="Search attendee or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="
                      w-full
                      pl-9
                      pr-4
                      py-2.5
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

            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr
                    className="
                      border-b
                      border-[var(--border-subtle)]
                      text-[var(--text-muted)]
                    "
                  >
                    <th className="px-6 py-4 text-xs font-semibold">
                      Attendee
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold">
                      Location
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold">
                      Time
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="
                        border-b
                        border-[var(--border-subtle)]
                        last:border-b-0
                        hover:bg-emerald-500/5
                        transition-colors
                      "
                    >

                      {/* ATTENDEE */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

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
                              shrink-0
                            "
                          >
                            <User className="w-4 h-4 text-emerald-500" />
                          </div>

                          <div>
                            <p
                              className="
                                text-sm
                                font-medium
                                text-[var(--text-primary)]
                              "
                            >
                              {record.name}
                            </p>

                            <p
                              className="
                                text-xs
                                text-[var(--text-muted)]
                                mt-0.5
                              "
                            >
                              {record.email}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* LOCATION */}
                      <td className="px-6 py-4">

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-[var(--text-secondary)]
                          "
                        >
                          <MapPin className="w-4 h-4 text-emerald-500" />
                          {record.location}
                        </div>

                      </td>

                      {/* DATE */}
                      <td
                        className="
                          px-6
                          py-4
                          text-xs
                          text-[var(--text-secondary)]
                        "
                      >
                        {record.date}
                      </td>

                      {/* TIME */}
                      <td className="px-6 py-4">

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-[var(--text-secondary)]
                          "
                        >
                          <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                          {record.time}
                        </div>

                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">

                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            px-2.5
                            py-1
                            rounded-full
                            text-[10px]
                            font-semibold
                            bg-emerald-500/10
                            border
                            border-emerald-500/20
                            text-emerald-500
                          "
                        >
                          <CheckCircle className="w-3 h-3" />
                          {record.status}
                        </span>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

            {/* EMPTY STATE */}
            {filteredRecords.length === 0 && (
              <div className="py-16 text-center">

                <div
                  className="
                    w-12
                    h-12
                    mx-auto
                    mb-4
                    rounded-xl
                    bg-emerald-500/10
                    border
                    border-emerald-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <ClipboardList className="w-5 h-5 text-emerald-500" />
                </div>

                <h3
                  className="
                    text-sm
                    font-semibold
                    text-[var(--text-primary)]
                  "
                >
                  No check-ins found
                </h3>

                <p
                  className="
                    text-xs
                    text-[var(--text-muted)]
                    mt-1
                  "
                >
                  Try changing your search.
                </p>

              </div>
            )}

          </div>

          {/* ADMIN NOTICE */}
          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              mt-5
              text-xs
              text-[var(--text-muted)]
            "
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            This check-in log is visible to event administrators only.
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckInLogScreen;