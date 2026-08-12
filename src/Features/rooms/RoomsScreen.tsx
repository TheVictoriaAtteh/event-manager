import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Plus,
  Search,
  MapPin,
  Users,
  DoorOpen,
  MoreVertical,
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  status: "Available" | "Occupied";
}

const MOCK_ROOMS: Room[] = [
  {
    id: "1",
    name: "Main Auditorium",
    location: "Tech Hub - Ground Floor",
    capacity: 500,
    status: "Available",
  },
  {
    id: "2",
    name: "Conference Room A",
    location: "Tech Hub - 1st Floor",
    capacity: 120,
    status: "Occupied",
  },
  {
    id: "3",
    name: "Conference Room B",
    location: "Tech Hub - 1st Floor",
    capacity: 80,
    status: "Available",
  },
  {
    id: "4",
    name: "Design Studio",
    location: "Innovation Wing",
    capacity: 60,
    status: "Available",
  },
  {
    id: "5",
    name: "Rooftop Lounge",
    location: "Tech Hub - Rooftop",
    capacity: 150,
    status: "Occupied",
  },
  {
    id: "6",
    name: "Workshop Hall",
    location: "Innovation Wing - Ground Floor",
    capacity: 200,
    status: "Available",
  },
];

interface RoomsScreenProps {
  onNavigate?: (screen: string) => void;
  onLogout?: () => void;
  onAddRoom?: () => void;
}

export const RoomsScreen: React.FC<RoomsScreenProps> = ({
  onNavigate,
  onLogout,
  onAddRoom,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const filteredRooms = MOCK_ROOMS.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#090d0b] text-white">

      {/* SIDEBAR */}
      <aside>
      <Sidebar
  collapsed={collapsed}
  onToggle={() => setCollapsed(!collapsed)}
  activeScreen="rooms"
  onNavigate={onNavigate}
  onLogout={onLogout}
/>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOP HEADER */}
        <header className="h-16 border-b border-emerald-900/30 bg-[#0d1310] px-6 flex items-center justify-between gap-4">

          {/* Search */}
          <div className="relative flex-1 max-w-xl">

            <Search
              className="
                w-4
                h-4
                absolute
                left-3
                top-1/2
                -translate-y-1/2
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
                pl-9
                pr-4
                py-2
                bg-[#090d0b]
                border
                border-emerald-900/40
                rounded-lg
                text-sm
                text-white
                placeholder-gray-500
                focus:outline-none
                focus:border-emerald-500
              "
            />

          </div>

          {/* Profile */}
          <div
            className="
              w-10
              h-10
              rounded-full
              bg-emerald-800/40
              border
              border-emerald-600/40
              flex
              items-center
              justify-center
              text-sm
              font-bold
              text-emerald-300
            "
          >
            BB
          </div>

        </header>

        {/* CONTENT */}
        <main className="p-6 flex-1 overflow-y-auto space-y-7">

          {/* TITLE */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>

              <h1 className="text-2xl font-bold text-emerald-50">
                Rooms
              </h1>

              <p className="text-sm text-gray-400 mt-1">
                Manage event rooms and venue spaces
              </p>

            </div>

            <button
              onClick={onAddRoom}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-5
                py-2.5
                bg-emerald-600
                hover:bg-emerald-500
                text-emerald-950
                font-semibold
                rounded-lg
                text-sm
                transition-colors
                shadow-lg
                shadow-emerald-900/20
              "
            >
              <Plus className="w-4 h-4" />
              Add Room
            </button>

          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div
              className="
                p-5
                bg-[#121915]
                border
                border-emerald-900/30
                rounded-xl
              "
            >
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-400">
                  Total Rooms
                </span>

                <DoorOpen className="w-5 h-5 text-emerald-400" />

              </div>

              <p className="text-3xl font-bold text-emerald-50 mt-3">
                {MOCK_ROOMS.length}
              </p>

            </div>

            <div
              className="
                p-5
                bg-[#121915]
                border
                border-emerald-900/30
                rounded-xl
              "
            >
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-400">
                  Available
                </span>

                <DoorOpen className="w-5 h-5 text-emerald-400" />

              </div>

              <p className="text-3xl font-bold text-emerald-50 mt-3">
                {
                  MOCK_ROOMS.filter(
                    (room) => room.status === "Available"
                  ).length
                }
              </p>

            </div>

            <div
              className="
                p-5
                bg-[#121915]
                border
                border-emerald-900/30
                rounded-xl
              "
            >
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-400">
                  Occupied
                </span>

                <Users className="w-5 h-5 text-emerald-400" />

              </div>

              <p className="text-3xl font-bold text-emerald-50 mt-3">
                {
                  MOCK_ROOMS.filter(
                    (room) => room.status === "Occupied"
                  ).length
                }
              </p>

            </div>

          </div>

          {/* ROOM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {filteredRooms.map((room) => (

              <div
                key={room.id}
                className="
                  bg-[#121915]
                  border
                  border-emerald-900/30
                  hover:border-emerald-600/50
                  rounded-xl
                  p-5
                  transition-all
                  hover:-translate-y-0.5
                  shadow-lg
                "
              >

                {/* CARD HEADER */}
                <div className="flex items-start justify-between">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-lg
                      bg-emerald-950/60
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <DoorOpen className="w-5 h-5 text-emerald-400" />
                  </div>

                  <button
                    className="
                      p-2
                      text-gray-500
                      hover:text-white
                      hover:bg-emerald-950/40
                      rounded-lg
                    "
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                </div>

                {/* ROOM NAME */}
                <h2 className="text-base font-semibold text-emerald-50 mt-4">
                  {room.name}
                </h2>

                {/* LOCATION */}
                <div className="flex items-center gap-2 mt-2">

                  <MapPin className="w-4 h-4 text-gray-500 shrink-0" />

                  <span className="text-xs text-gray-400 truncate">
                    {room.location}
                  </span>

                </div>

                {/* CAPACITY */}
                <div className="flex items-center gap-2 mt-3">

                  <Users className="w-4 h-4 text-gray-500" />

                  <span className="text-xs text-gray-400">
                    Capacity: {room.capacity}
                  </span>

                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-emerald-900/20">

                  <span
                    className={`
                      px-2.5
                      py-1
                      rounded-full
                      text-[11px]
                      font-medium
                      ${
                        room.status === "Available"
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                          : "bg-yellow-950/40 text-yellow-400 border border-yellow-800/30"
                      }
                    `}
                  >
                    {room.status}
                  </span>

                  <button
                    onClick={() => onNavigate?.("room-assignment")}
                    className="
                      text-xs
                      text-emerald-400
                      hover:text-emerald-300
                      font-medium
                    "
                  >
                    Manage
                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* EMPTY STATE */}
          {filteredRooms.length === 0 && (
            <div
              className="
                bg-[#121915]
                border
                border-emerald-900/30
                rounded-xl
                p-12
                text-center
              "
            >
              <DoorOpen className="w-8 h-8 text-gray-600 mx-auto" />

              <p className="text-sm text-gray-400 mt-3">
                No rooms found.
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};