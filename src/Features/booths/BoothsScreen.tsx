import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  Tent,
  Users,
  MapPin,
} from "lucide-react";

interface Booth {
  id: string;
  name: string;
  location: string;
  team: string;
  members: number;
  status: "Available" | "Occupied";
}

interface BoothsScreenProps {
  onBack?: () => void;
}

const MOCK_BOOTHS: Booth[] = [
  {
    id: "1",
    name: "Booth A1",
    location: "Exhibition Hall A",
    team: "Tech Solutions",
    members: 5,
    status: "Occupied",
  },
  {
    id: "2",
    name: "Booth A2",
    location: "Exhibition Hall A",
    team: "Creative Hub",
    members: 3,
    status: "Occupied",
  },
  {
    id: "3",
    name: "Booth B1",
    location: "Exhibition Hall B",
    team: "Available",
    members: 0,
    status: "Available",
  },
  {
    id: "4",
    name: "Booth B2",
    location: "Exhibition Hall B",
    team: "Digital Works",
    members: 4,
    status: "Occupied",
  },
];

const BoothsScreen: React.FC<BoothsScreenProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooths = MOCK_BOOTHS.filter(
    (booth) =>
      booth.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booth.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booth.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-dot-grid min-h-screen text-white">
      {/* POLKA DOT BACKGROUND */}
      {/* <div
        className="
          absolute
          inset-0
          pointer-events-none
          opacity-30
        "
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(16,185,129,0.22) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      /> */}

      {/* ==================== CONTENT ==================== */}
      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">

          {/* ==================== TOP BAR ==================== */}
          <div className="flex items-center mb-8">
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
                text-gray-400
                hover:text-emerald-400
                hover:bg-emerald-950/40
                transition-colors
              "
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>

          {/* ==================== HEADER ==================== */}
          <div className="mb-7">
            <div className="flex items-center gap-3">

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-emerald-950/70
                  border
                  border-emerald-700/40
                  flex
                  items-center
                  justify-center
                "
              >
                <Tent className="w-5 h-5 text-emerald-400" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-emerald-50">
                  Teams / Booths
                </h1>

                <p className="text-sm text-gray-400 mt-1">
                  Manage event teams and their assigned booths.
                </p>
              </div>

            </div>
          </div>

          {/* ==================== SEARCH + ADD ==================== */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between mb-6">

            <div className="relative flex-1 max-w-xl">
              <Search
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
                type="text"
                placeholder="Search booths or teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full
                  pl-9
                  pr-4
                  py-2.5
                  bg-[#121915]
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

            <button
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-4
                py-2.5
                bg-emerald-600
                hover:bg-emerald-500
                text-emerald-950
                font-semibold
                rounded-lg
                text-sm
                transition-colors
              "
            >
              <Plus className="w-4 h-4" />
              Add Booth
            </button>

          </div>

          {/* ==================== STATS ==================== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">

            {/* TOTAL */}
            <div
              className="
                bg-[#121915]
                border
                border-emerald-900/30
                rounded-xl
                p-5
              "
            >
              <p className="text-xs text-gray-500 mb-2">
                Total Booths
              </p>

              <p className="text-3xl font-bold text-emerald-50">
                {MOCK_BOOTHS.length}
              </p>
            </div>

            {/* OCCUPIED */}
            <div
              className="
                bg-[#121915]
                border
                border-emerald-900/30
                rounded-xl
                p-5
              "
            >
              <p className="text-xs text-gray-500 mb-2">
                Occupied
              </p>

              <p className="text-3xl font-bold text-emerald-400">
                {
                  MOCK_BOOTHS.filter(
                    (booth) => booth.status === "Occupied"
                  ).length
                }
              </p>
            </div>

            {/* AVAILABLE */}
            <div
              className="
                bg-[#121915]
                border
                border-emerald-900/30
                rounded-xl
                p-5
              "
            >
              <p className="text-xs text-gray-500 mb-2">
                Available
              </p>

              <p className="text-3xl font-bold text-emerald-50">
                {
                  MOCK_BOOTHS.filter(
                    (booth) => booth.status === "Available"
                  ).length
                }
              </p>
            </div>

          </div>

          {/* ==================== BOOTH CARDS ==================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {filteredBooths.map((booth) => (
              <div
                key={booth.id}
                className="
                  bg-[#121915]
                  border
                  border-emerald-900/30
                  hover:border-emerald-600/50
                  rounded-xl
                  p-5
                  transition-all
                "
              >

                {/* CARD HEADER */}
                <div className="flex items-start justify-between mb-5">

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        w-10
                        h-10
                        rounded-lg
                        bg-emerald-950/70
                        border
                        border-emerald-800/40
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Tent className="w-5 h-5 text-emerald-400" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {booth.name}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {booth.team}
                      </p>
                    </div>

                  </div>

                  <span
                    className={`
                      px-2.5
                      py-1
                      rounded-full
                      text-[11px]
                      font-medium
                      ${
                        booth.status === "Occupied"
                          ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/40"
                          : "bg-gray-800/60 text-gray-400 border border-gray-700/40"
                      }
                    `}
                  >
                    {booth.status}
                  </span>

                </div>

                {/* LOCATION */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  {booth.location}
                </div>

                {/* MEMBERS */}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Users className="w-4 h-4 text-emerald-500" />

                  {booth.members === 0
                    ? "No team assigned"
                    : `${booth.members} team members`}
                </div>

                {/* CARD FOOTER */}
                <div className="mt-5 pt-4 border-t border-emerald-900/20">

                  <button
                    className="
                      w-full
                      py-2
                      rounded-lg
                      border
                      border-emerald-800/40
                      text-xs
                      font-medium
                      text-emerald-400
                      hover:bg-emerald-950/40
                      transition-colors
                    "
                  >
                    Manage Booth
                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* ==================== EMPTY STATE ==================== */}
          {filteredBooths.length === 0 && (
            <div
              className="
                text-center
                py-16
                bg-[#121915]
                border
                border-emerald-900/30
                rounded-xl
              "
            >
              <Tent className="w-8 h-8 text-gray-600 mx-auto mb-3" />

              <h3 className="text-sm font-semibold text-gray-300">
                No booths found
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Try adjusting your search.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BoothsScreen;