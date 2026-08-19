import React, { useMemo, useState } from "react";
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

  const filteredBooths = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return MOCK_BOOTHS.filter(
      (booth) =>
        booth.name.toLowerCase().includes(search) ||
        booth.location.toLowerCase().includes(search) ||
        booth.team.toLowerCase().includes(search)
    );
  }, [searchTerm]);

  const totalBooths = MOCK_BOOTHS.length;

  const occupiedBooths = MOCK_BOOTHS.filter(
    (booth) => booth.status === "Occupied"
  ).length;

  const availableBooths = MOCK_BOOTHS.filter(
    (booth) => booth.status === "Available"
  ).length;

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)] font-sans">
      <div className="relative z-10 min-h-screen p-6 sm:p-8">
        <div className="max-w-6xl mx-auto">

          {/* ==================== TOP BAR ==================== */}
          <div className="flex items-center justify-between mb-8">
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
                hover:bg-[var(--hover-surface)]
                transition-colors
                cursor-pointer
              "
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>

            <button
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-4
                py-2.5
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
              Add Booth
            </button>
          </div>

          {/* ==================== MAIN PANEL ==================== */}
          <div
            className="
              bg-[var(--bg-surface)]
              border
              border-[var(--border-default)]
              rounded-2xl
              overflow-hidden
              shadow-sm
            "
          >

            {/* ==================== HEADER ==================== */}
            <div className="px-6 sm:px-8 pt-8 pb-6">
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
                  <Tent className="w-5 h-5 text-[var(--text-accent)]" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    Teams / Booths
                  </h1>

                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Manage event teams and their assigned booths.
                  </p>
                </div>

              </div>
            </div>

            {/* ==================== SEARCH ==================== */}
            <div className="px-6 sm:px-8 pb-7">
              <div className="relative w-full max-w-xl">

                <Search
                  className="
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    w-4
                    h-4
                    text-[var(--text-muted)]
                  "
                />

                <input
                  type="text"
                  placeholder="Search booths or teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full
                    pl-10
                    pr-4
                    py-2.5
                    bg-[var(--bg-input)]
                    border
                    border-[var(--border-default)]
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
            </div>

            {/* ==================== DIVIDER ==================== */}
            <div className="border-t border-[var(--border-subtle)]" />

            {/* ==================== STATS ==================== */}
            <div className="px-6 sm:px-8 py-7">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* TOTAL */}
                <div
                  className="
                    bg-[var(--bg-input)]
                    border
                    border-[var(--border-subtle)]
                    rounded-xl
                    p-5
                  "
                >
                  <p className="text-xs text-[var(--text-secondary)] mb-2">
                    Total Booths
                  </p>

                  <p className="text-3xl font-bold text-[var(--text-primary)]">
                    {totalBooths}
                  </p>
                </div>

                {/* OCCUPIED */}
                <div
                  className="
                    bg-[var(--bg-input)]
                    border
                    border-[var(--border-subtle)]
                    rounded-xl
                    p-5
                  "
                >
                  <p className="text-xs text-[var(--text-secondary)] mb-2">
                    Occupied
                  </p>

                  <p className="text-3xl font-bold text-[var(--text-accent)]">
                    {occupiedBooths}
                  </p>
                </div>

                {/* AVAILABLE */}
                <div
                  className="
                    bg-[var(--bg-input)]
                    border
                    border-[var(--border-subtle)]
                    rounded-xl
                    p-5
                  "
                >
                  <p className="text-xs text-[var(--text-secondary)] mb-2">
                    Available
                  </p>

                  <p className="text-3xl font-bold text-[var(--text-primary)]">
                    {availableBooths}
                  </p>
                </div>

              </div>
            </div>

            {/* ==================== BOOTHS SECTION ==================== */}
            <div className="px-6 sm:px-8 pb-8">

              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                    Event Booths
                  </h2>

                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {filteredBooths.length}{" "}
                    {filteredBooths.length === 1
                      ? "booth"
                      : "booths"}{" "}
                    found
                  </p>
                </div>
              </div>

              {/* ==================== BOOTH CARDS ==================== */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                {filteredBooths.map((booth) => (
                  <div
                    key={booth.id}
                    className="
                      bg-[var(--bg-input)]
                      border
                      border-[var(--border-subtle)]
                      hover:border-emerald-500/30
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
                            bg-emerald-500/10
                            border
                            border-emerald-500/20
                            flex
                            items-center
                            justify-center
                            shrink-0
                          "
                        >
                          <Tent
                            className="
                              w-5
                              h-5
                              text-[var(--text-accent)]
                            "
                          />
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                            {booth.name}
                          </h3>

                          <p className="text-xs text-[var(--text-muted)] mt-1">
                            {booth.team}
                          </p>
                        </div>

                      </div>

                      {/* STATUS */}
                      <span
                        className={`
                          px-2.5
                          py-1
                          rounded-full
                          text-[11px]
                          font-medium
                          border
                          ${
                            booth.status === "Occupied"
                              ? `
                                bg-emerald-500/10
                                border-emerald-500/20
                                text-[var(--text-accent)]
                              `
                              : `
                                bg-[var(--bg-surface)]
                                border-[var(--border-default)]
                                text-[var(--text-secondary)]
                              `
                          }
                        `}
                      >
                        {booth.status}
                      </span>

                    </div>

                    {/* LOCATION */}
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-[var(--text-secondary)]
                        mb-3
                      "
                    >
                      <MapPin
                        className="
                          w-4
                          h-4
                          text-[var(--text-accent)]
                        "
                      />

                      {booth.location}
                    </div>

                    {/* MEMBERS */}
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-[var(--text-secondary)]
                      "
                    >
                      <Users
                        className="
                          w-4
                          h-4
                          text-[var(--text-accent)]
                        "
                      />

                      {booth.members === 0
                        ? "No team assigned"
                        : `${booth.members} team members`}
                    </div>

                    {/* CARD FOOTER */}
                    <div
                      className="
                        mt-5
                        pt-4
                        border-t
                        border-[var(--border-subtle)]
                      "
                    >
                      <button
                        className="
                          w-full
                          py-2
                          rounded-lg
                          border
                          border-[var(--border-default)]
                          text-xs
                          font-medium
                          text-[var(--text-secondary)]
                          hover:text-[var(--text-accent)]
                          hover:bg-emerald-500/5
                          hover:border-emerald-500/30
                          transition-colors
                          cursor-pointer
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
                    bg-[var(--bg-input)]
                    border
                    border-[var(--border-subtle)]
                    rounded-xl
                  "
                >
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
                    <Tent
                      className="
                        w-5
                        h-5
                        text-[var(--text-accent)]
                      "
                    />
                  </div>

                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    No booths found
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Try adjusting your search.
                  </p>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BoothsScreen;