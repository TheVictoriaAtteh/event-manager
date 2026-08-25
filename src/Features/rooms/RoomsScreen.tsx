import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  MoreVertical,
  Users,
  MapPin,
  Building2,
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  bestFor: string;
  status: "Available" | "Assigned";
}

interface RoomsScreenProps {
  onNavigate?: (screen: string) => void;
  onAddRoom?: () => void;
}

const MOCK_ROOMS: Room[] = [
  {
    id: "1",
    name: "Main Hall",
    type: "Hall",
    capacity: 500,
    bestFor: "Large Events",
    status: "Available",
  },
  {
    id: "2",
    name: "Meeting Room A",
    type: "Meeting",
    capacity: 30,
    bestFor: "Meetings, Presentations",
    status: "Available",
  },
  {
    id: "3",
    name: "Open Floor",
    type: "Open Space",
    capacity: 200,
    bestFor: "Exhibitions, Networking",
    status: "Assigned",
  },
  {
    id: "4",
    name: "Workshop Room 1",
    type: "Workshop",
    capacity: 25,
    bestFor: "Hands-on Workshops",
    status: "Available",
  },
  {
    id: "5",
    name: "Conference Room B",
    type: "Conference",
    capacity: 60,
    bestFor: "Business Meetings",
    status: "Available",
  },
  {
    id: "6",
    name: "Rooftop Lounge",
    type: "Lounge",
    capacity: 100,
    bestFor: "Networking Events",
    status: "Assigned",
  },
];

export const RoomsScreen: React.FC<RoomsScreenProps> = ({
  onNavigate,
  onAddRoom,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All Rooms");

  const roomTypes = [
    "All Rooms",
    "Hall",
    "Meeting",
    "Open Space",
    "Workshop",
    "Conference",
    "Lounge",
  ];

  const filteredRooms = useMemo(() => {
    return MOCK_ROOMS.filter((room) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        room.name.toLowerCase().includes(search) ||
        room.type.toLowerCase().includes(search) ||
        room.bestFor.toLowerCase().includes(search);

      const matchesFilter =
        filter === "All Rooms" || room.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filter]);

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)] font-sans">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 py-8">

        {/* TOP ACTIONS */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate?.("dashboard")}
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
            onClick={onAddRoom}
            className="
              flex items-center gap-2
              px-4 py-2.5
              rounded-lg
              bg-emerald-500
              hover:bg-emerald-400
              text-emerald-950
              text-sm
              font-semibold
              transition-colors
              cursor-pointer
              shadow-lg
              shadow-emerald-500/10
            "
          >
            <Plus className="w-4 h-4" />
            Add Room
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
                <Building2 className="w-5 h-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                  Rooms
                </h1>

                <p className="text-sm text-[var(--text-secondary)] mt-1.5">
                  Manage event spaces, room capacities, and assignments.
                </p>
              </div>
            </div>
          </div>

          {/* SEARCH + FILTER */}
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
                placeholder="Search rooms..."
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

            {/* FILTERS */}
            <div className="flex items-center gap-2 flex-wrap">
              {roomTypes.slice(0, 4).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`
                    px-4 py-2
                    rounded-lg
                    text-xs
                    font-medium
                    border
                    transition-all
                    cursor-pointer

                    ${
                      filter === type
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
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-[var(--border-subtle)]" />

          {/* ROOMS */}
          <div className="px-6 sm:px-10 py-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Event Spaces
                </h2>

                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {filteredRooms.length}{" "}
                  {filteredRooms.length === 1 ? "room" : "rooms"} available
                </p>
              </div>
            </div>

            {/* ROOM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="
                    bg-[var(--bg-input)]
                    border border-[var(--border-subtle)]
                    rounded-xl
                    p-5
                    hover:border-emerald-500/30
                    hover:shadow-sm
                    transition-all
                  "
                >
                  {/* CARD HEADER */}
                  <div className="flex items-start justify-between">
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
                        <Building2 className="w-5 h-5 text-emerald-500" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                          {room.name}
                        </h3>

                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {room.type}
                        </p>
                      </div>
                    </div>

                    <button
                      className="
                        p-1.5
                        rounded-lg
                        text-[var(--text-muted)]
                        hover:text-[var(--text-primary)]
                        hover:bg-[var(--bg-surface)]
                        transition-colors
                        cursor-pointer
                      "
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* DIVIDER */}
                  <div className="border-t border-[var(--border-subtle)] my-5" />

                  {/* DETAILS */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className="
                          flex items-center gap-2
                          text-xs
                          text-[var(--text-secondary)]
                        "
                      >
                        <Users className="w-4 h-4 text-emerald-500" />
                        Capacity
                      </div>

                      <span
                        className="
                          text-sm
                          text-[var(--text-primary)]
                          font-semibold
                        "
                      >
                        {room.capacity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div
                        className="
                          flex items-center gap-2
                          text-xs
                          text-[var(--text-secondary)]
                          shrink-0
                        "
                      >
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        Best For
                      </div>

                      <span
                        className="
                          text-xs
                          text-[var(--text-secondary)]
                          text-right
                          max-w-[180px]
                        "
                      >
                        {room.bestFor}
                      </span>
                    </div>
                  </div>

                  {/* CARD FOOTER */}
                  <div className="mt-5 flex items-center justify-between">
                    <span
                      className={`
                        inline-flex
                        items-center
                        px-3 py-1
                        rounded-full
                        text-[11px]
                        font-medium
                        border

                        ${
                          room.status === "Available"
                            ? `
                              bg-emerald-500/10
                              border-emerald-500/20
                              text-emerald-500
                            `
                            : `
                              bg-amber-500/10
                              border-amber-500/20
                              text-amber-500
                            `
                        }
                      `}
                    >
                      {room.status}
                    </span>

                    <button
                      className="
                        text-xs
                        text-[var(--text-secondary)]
                        hover:text-emerald-500
                        transition-colors
                        cursor-pointer
                      "
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* EMPTY STATE */}
            {filteredRooms.length === 0 && (
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
                  <Building2 className="w-5 h-5 text-emerald-500" />
                </div>

                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  No rooms found
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