import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  Store,
  MapPin,
  Users,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

interface Booth {
  id: string;
  name: string;
  location: string;
  category: string;
  capacity: number;
  status: "Available" | "Occupied" | "Reserved";
}

interface BoothsScreenProps {
  onBack?: () => void;
  onLogout?: () => void;
}

const MOCK_BOOTHS: Booth[] = [
  {
    id: "1",
    name: "Booth A01",
    location: "Main Exhibition Hall",
    category: "Technology",
    capacity: 4,
    status: "Occupied",
  },
  {
    id: "2",
    name: "Booth A02",
    location: "Main Exhibition Hall",
    category: "Design",
    capacity: 3,
    status: "Available",
  },
  {
    id: "3",
    name: "Booth B01",
    location: "Innovation Wing",
    category: "Software",
    capacity: 5,
    status: "Reserved",
  },
  {
    id: "4",
    name: "Booth B02",
    location: "Innovation Wing",
    category: "Business",
    capacity: 4,
    status: "Available",
  },
  {
    id: "5",
    name: "Booth C01",
    location: "Conference Area",
    category: "Education",
    capacity: 6,
    status: "Occupied",
  },
  {
    id: "6",
    name: "Booth C02",
    location: "Conference Area",
    category: "Networking",
    capacity: 4,
    status: "Available",
  },
];

export const BoothsScreen: React.FC<BoothsScreenProps> = ({
  onBack,
  onLogout,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filteredBooths = MOCK_BOOTHS.filter(
    (booth) =>
      booth.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booth.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booth.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status: Booth["status"]) => {
    switch (status) {
      case "Available":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

      case "Occupied":
        return "bg-red-500/10 text-red-400 border-red-500/30";

      case "Reserved":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    }
  };

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

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* TOP BAR */}
        <header
          className="
            h-16
            shrink-0
            border-b
            border-emerald-900/30
            bg-[#090d0b]/95
            backdrop-blur-md
            px-6
            flex
            items-center
            justify-between
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="
                p-2
                rounded-lg
                text-gray-400
                hover:text-white
                hover:bg-emerald-950/50
                transition
              "
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-sm font-semibold text-white">
                Booths
              </h1>

              <p className="text-xs text-gray-500 mt-0.5">
                Manage event booths and exhibitors
              </p>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={onLogout}
            className="
              px-4
              py-2
              rounded-lg
              border
              border-emerald-500/40
              bg-emerald-500/10
              text-emerald-400
              text-xs
              font-semibold
              hover:bg-emerald-500/20
              hover:border-emerald-400/60
              transition
            "
          >
            Logout
          </button>
        </header>

        {/* MAIN */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* PAGE HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
              <div>
                <h2 className="text-2xl font-bold text-emerald-50">
                  Event Booths
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Create, assign and manage booths for your event.
                </p>
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-2.5
                  rounded-lg
                  bg-emerald-500
                  hover:bg-emerald-400
                  text-[#06100b]
                  text-sm
                  font-semibold
                  shadow-lg
                  shadow-emerald-900/20
                  transition
                "
              >
                <Plus className="w-4 h-4" />
                Add Booth
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
              <div
                className="
                  bg-[#121915]
                  border
                  border-emerald-900/30
                  rounded-xl
                  p-5
                "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">
                      Total Booths
                    </p>

                    <p className="text-2xl font-bold text-white mt-2">
                      {MOCK_BOOTHS.length}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10">
                    <Store className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
              </div>

              <div
                className="
                  bg-[#121915]
                  border
                  border-emerald-900/30
                  rounded-xl
                  p-5
                "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">
                      Available
                    </p>

                    <p className="text-2xl font-bold text-emerald-400 mt-2">
                      {
                        MOCK_BOOTHS.filter(
                          (booth) => booth.status === "Available"
                        ).length
                      }
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10">
                    <Store className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
              </div>

              <div
                className="
                  bg-[#121915]
                  border
                  border-emerald-900/30
                  rounded-xl
                  p-5
                "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">
                      Occupied
                    </p>

                    <p className="text-2xl font-bold text-white mt-2">
                      {
                        MOCK_BOOTHS.filter(
                          (booth) => booth.status === "Occupied"
                        ).length
                      }
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10">
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* ADD BOOTH FORM */}
            {showAddForm && (
              <div
                className="
                  bg-[#121915]
                  border
                  border-emerald-800/40
                  rounded-xl
                  p-6
                  mb-7
                "
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Add New Booth
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Enter the booth details below.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    placeholder="Booth name"
                    className="
                      w-full
                      px-4
                      py-2.5
                      bg-[#090d0b]
                      border
                      border-emerald-900/40
                      rounded-lg
                      text-sm
                      text-white
                      placeholder-gray-600
                      focus:outline-none
                      focus:border-emerald-500
                    "
                  />

                  <input
                    placeholder="Location"
                    className="
                      w-full
                      px-4
                      py-2.5
                      bg-[#090d0b]
                      border
                      border-emerald-900/40
                      rounded-lg
                      text-sm
                      text-white
                      placeholder-gray-600
                      focus:outline-none
                      focus:border-emerald-500
                    "
                  />

                  <input
                    placeholder="Category"
                    className="
                      w-full
                      px-4
                      py-2.5
                      bg-[#090d0b]
                      border
                      border-emerald-900/40
                      rounded-lg
                      text-sm
                      text-white
                      placeholder-gray-600
                      focus:outline-none
                      focus:border-emerald-500
                    "
                  />

                  <input
                    type="number"
                    placeholder="Capacity"
                    className="
                      w-full
                      px-4
                      py-2.5
                      bg-[#090d0b]
                      border
                      border-emerald-900/40
                      rounded-lg
                      text-sm
                      text-white
                      placeholder-gray-600
                      focus:outline-none
                      focus:border-emerald-500
                    "
                  />
                </div>

                <div className="flex justify-end mt-5">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="
                      px-5
                      py-2.5
                      bg-emerald-500
                      hover:bg-emerald-400
                      text-[#06100b]
                      rounded-lg
                      text-sm
                      font-semibold
                    "
                  >
                    Save Booth
                  </button>
                </div>
              </div>
            )}

            {/* SEARCH */}
            <div className="mb-5">
              <div className="relative max-w-md">
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search booths..."
                  className="
                    w-full
                    pl-10
                    pr-4
                    py-2.5
                    bg-[#121915]
                    border
                    border-emerald-900/40
                    rounded-lg
                    text-sm
                    text-white
                    placeholder-gray-600
                    focus:outline-none
                    focus:border-emerald-500
                  "
                />
              </div>
            </div>

            {/* BOOTHS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBooths.map((booth) => (
                <div
                  key={booth.id}
                  className="
                    bg-[#121915]
                    border
                    border-emerald-900/30
                    rounded-xl
                    p-5
                    hover:border-emerald-700/50
                    transition
                    relative
                  "
                >
                  {/* CARD HEADER */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          w-10
                          h-10
                          rounded-lg
                          bg-emerald-500/10
                          border
                          border-emerald-800/30
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Store className="w-5 h-5 text-emerald-400" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {booth.name}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          {booth.category}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === booth.id ? null : booth.id
                          )
                        }
                        className="
                          p-1.5
                          rounded-lg
                          text-gray-500
                          hover:text-white
                          hover:bg-emerald-950/40
                        "
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenu === booth.id && (
                        <div
                          className="
                            absolute
                            right-0
                            top-8
                            z-20
                            w-32
                            bg-[#121915]
                            border
                            border-emerald-900/40
                            rounded-lg
                            shadow-xl
                            overflow-hidden
                          "
                        >
                          <button
                            onClick={() => setOpenMenu(null)}
                            className="
                              w-full
                              px-3
                              py-2
                              flex
                              items-center
                              gap-2
                              text-xs
                              text-gray-300
                              hover:bg-emerald-950/40
                            "
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </button>

                          <button
                            onClick={() => setOpenMenu(null)}
                            className="
                              w-full
                              px-3
                              py-2
                              flex
                              items-center
                              gap-2
                              text-xs
                              text-red-400
                              hover:bg-red-950/30
                            "
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* STATUS */}
                  <div className="mt-5">
                    <span
                      className={`
                        inline-flex
                        px-2.5
                        py-1
                        rounded-full
                        border
                        text-[11px]
                        font-medium
                        ${getStatusClass(booth.status)}
                      `}
                    >
                      {booth.status}
                    </span>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-5 pt-4 border-t border-emerald-900/20 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span>{booth.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <span>Capacity: {booth.capacity} people</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* EMPTY STATE */}
            {filteredBooths.length === 0 && (
              <div
                className="
                  py-16
                  text-center
                  bg-[#121915]
                  border
                  border-emerald-900/30
                  rounded-xl
                "
              >
                <Store className="w-8 h-8 text-gray-600 mx-auto mb-3" />

                <h3 className="text-sm font-semibold text-gray-300">
                  No booths found
                </h3>

                <p className="text-xs text-gray-600 mt-1">
                  Try adjusting your search.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BoothsScreen;