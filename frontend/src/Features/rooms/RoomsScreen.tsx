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

  const filteredRooms = useMemo(() => {
    return MOCK_ROOMS.filter((room) => {
      const matchesSearch =
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.bestFor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "All Rooms" || room.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filter]);

  const roomTypes = [
    "All Rooms",
    "Hall",
    "Meeting",
    "Open Space",
    "Workshop",
    "Conference",
    "Lounge",
  ];

  return (
    <div
      className="min-h-screen bg-[#090d0b] text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(16,185,129,0.35) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <div className="max-w-[1500px] mx-auto px-6 py-8">

        {/* TOP ACTIONS */}
        <div className="flex items-center justify-between mb-8">

          <button
            onClick={() => onNavigate?.("dashboard")}
            className="
              flex items-center gap-2
              text-sm text-gray-400
              hover:text-white
              transition-colors
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
              rounded-xl
              border border-emerald-600/40
              bg-[#0b1712]
              text-emerald-400
              text-sm font-medium
              hover:bg-emerald-900/30
              hover:border-emerald-500
              transition-all
            "
          >
            <Plus className="w-4 h-4" />
            Add Room
          </button>

        </div>

        {/* MAIN PANEL */}
        <div
          className="
            bg-[#121915]
            border border-emerald-900/40
            rounded-2xl
            overflow-hidden
          "
        >

          {/* HEADER */}
          <div className="px-10 pt-10 pb-6">

            <h1 className="text-2xl font-bold text-emerald-50">
              Rooms
            </h1>

            <p className="text-sm text-gray-400 mt-2">
              Manage event spaces, room capacities, and assignments.
            </p>

          </div>

          {/* SEARCH + FILTER */}
          <div
            className="
              px-10 pb-7
              flex flex-col md:flex-row
              md:items-center
              md:justify-between
              gap-4
            "
          >

            <div className="relative w-full md:w-[420px]">

              <Search
                className="
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  w-4 h-4
                  text-gray-500
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
                  bg-[#090d0b]
                  border border-emerald-900/40
                  rounded-xl
                  text-sm text-white
                  placeholder-gray-500
                  focus:outline-none
                  focus:border-emerald-500
                "
              />

            </div>

            <div className="flex items-center gap-2 flex-wrap">

              {roomTypes.slice(0, 4).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`
                    px-4 py-2
                    rounded-xl
                    text-xs font-medium
                    border
                    transition-all
                    ${
                      filter === type
                        ? "bg-emerald-900/40 border-emerald-600/60 text-emerald-400"
                        : "bg-[#090d0b] border-emerald-900/30 text-gray-400 hover:text-white hover:border-emerald-800"
                    }
                  `}
                >
                  {type}
                </button>
              ))}

            </div>

          </div>

          {/* ROOMS */}
          <div className="px-10 pb-10">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="
                    bg-[#090d0b]
                    border border-emerald-900/30
                    rounded-xl
                    p-5
                    hover:border-emerald-700/60
                    transition-all
                  "
                >

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-3">

                      <div
                        className="
                          w-10 h-10
                          rounded-lg
                          bg-emerald-900/30
                          border border-emerald-800/40
                          flex items-center justify-center
                        "
                      >
                        <Building2 className="w-5 h-5 text-emerald-400" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {room.name}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          {room.type}
                        </p>
                      </div>

                    </div>

                    <button
                      className="
                        p-1.5
                        rounded-lg
                        text-gray-500
                        hover:text-white
                        hover:bg-emerald-950/50
                      "
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                  </div>

                  <div className="border-t border-emerald-900/20 my-5" />

                  <div className="space-y-3">

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Users className="w-4 h-4 text-emerald-500" />
                        Capacity
                      </div>

                      <span className="text-sm text-gray-200 font-medium">
                        {room.capacity}
                      </span>

                    </div>

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        Best For
                      </div>

                      <span className="text-xs text-gray-300 text-right max-w-[180px]">
                        {room.bestFor}
                      </span>

                    </div>

                  </div>

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
                            ? "bg-emerald-950/50 border-emerald-700/40 text-emerald-400"
                            : "bg-yellow-950/40 border-yellow-700/40 text-yellow-400"
                        }
                      `}
                    >
                      {room.status}
                    </span>

                    <button
                      className="
                        text-xs
                        text-gray-500
                        hover:text-emerald-400
                      "
                    >
                      View Details
                    </button>

                  </div>

                </div>
              ))}

            </div>

            {filteredRooms.length === 0 && (
              <div className="py-16 text-center">

                <Building2 className="w-10 h-10 mx-auto text-gray-600 mb-3" />

                <h3 className="text-sm font-medium text-gray-300">
                  No rooms found
                </h3>

                <p className="text-xs text-gray-500 mt-1">
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