import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  MoreVertical,
  Users,
  MapPin,
  Building2,
  Loader2,
  AlertCircle,
  X,
  Trash2,
  Edit3,
} from "lucide-react";
import { hallsApi } from "../../lib/hallsApi";
import type { Hall } from "../../api/interfaces/halls";

interface RoomsScreenProps {
  onNavigate?: (screen: string) => void;
  onAddRoom?: () => void;
}

export const RoomsScreen: React.FC<RoomsScreenProps> = ({
  onNavigate,
  onAddRoom,
}) => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All Rooms");

  // Modal states for Create / Edit / Delete
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Form input state
  const [formName, setFormName] = useState("");
  const [formCapacity, setFormCapacity] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch halls from backend
  const loadHalls = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await hallsApi.list();
      setHalls(data);
    } catch (err) {
      console.error("Failed to fetch halls:", err);
      setError(err instanceof Error ? err.message : "Failed to load rooms");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadHalls();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormName("");
    setFormCapacity("");
    setFormAddress("");
    setFormDescription("");
    setFormError("");
    setEditingHall(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    if (onAddRoom) {
      onAddRoom();
    }
    setShowAddModal(true);
  };

  const handleOpenEditModal = (hall: Hall) => {
    setActiveMenuId(null);
    setEditingHall(hall);
    setFormName(hall.name);
    setFormCapacity(String(hall.capacity));
    setFormAddress(hall.address ?? "");
    setFormDescription(hall.description ?? "");
    setFormError("");
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const capacityNum = parseInt(formCapacity, 10);
    if (!formName.trim()) {
      setFormError("Room name is required.");
      return;
    }
    if (isNaN(capacityNum) || capacityNum <= 0) {
      setFormError("Capacity must be a positive number.");
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingHall) {
        // Update existing hall
        const updated = await hallsApi.update(editingHall.id, {
          name: formName.trim(),
          capacity: capacityNum,
          address: formAddress.trim() || undefined,
          description: formDescription.trim() || undefined,
        });
        setHalls((prev) =>
          prev.map((h) => (h.id === editingHall.id ? updated : h))
        );
        setEditingHall(null);
      } else {
        // Create new hall
        const created = await hallsApi.create({
          name: formName.trim(),
          capacity: capacityNum,
          address: formAddress.trim() || undefined,
          description: formDescription.trim() || undefined,
        });
        setHalls((prev) => [created, ...prev]);
        setShowAddModal(false);
      }
      resetForm();
    } catch (err) {
      console.error("Failed to save hall:", err);
      setFormError(err instanceof Error ? err.message : "Could not save room.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHall = async (id: string) => {
    setActiveMenuId(null);
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await hallsApi.remove(id);
      setHalls((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error("Failed to delete hall:", err);
      alert(err instanceof Error ? err.message : "Failed to delete room");
    }
  };

  const roomTypes = ["All Rooms", "Available", "Assigned"];

  const filteredRooms = useMemo(() => {
    return halls.filter((hall) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        hall.name.toLowerCase().includes(search) ||
        (hall.address && hall.address.toLowerCase().includes(search)) ||
        (hall.description && hall.description.toLowerCase().includes(search));

      const isAssigned = (hall._count?.events ?? 0) > 0;
      const status = isAssigned ? "Assigned" : "Available";

      const matchesFilter =
        filter === "All Rooms" || status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [halls, searchTerm, filter]);

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
            onClick={handleOpenAddModal}
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
                  Rooms & Halls
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
                placeholder="Search rooms by name, location, or description..."
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
              {roomTypes.map((type) => (
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

          {/* ROOMS BODY */}
          <div className="px-6 sm:px-10 py-8">
            {/* LOADING STATE */}
            {isLoading && (
              <div className="flex items-center justify-center py-20 text-[var(--text-secondary)]">
                <Loader2 className="w-8 h-8 animate-spin mr-3 text-emerald-500" />
                <span className="text-sm font-medium">Loading rooms…</span>
              </div>
            )}

            {/* ERROR STATE */}
            {!isLoading && error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 my-6">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ROOMS CONTENT */}
            {!isLoading && !error && (
              <>
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
                {filteredRooms.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredRooms.map((hall) => {
                      const isAssigned = (hall._count?.events ?? 0) > 0;
                      const status = isAssigned ? "Assigned" : "Available";

                      return (
                        <div
                          key={hall.id}
                          className="
                            bg-[var(--bg-input)]
                            border border-[var(--border-subtle)]
                            rounded-xl
                            p-5
                            hover:border-emerald-500/30
                            hover:shadow-sm
                            transition-all
                            relative
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
                                  {hall.name}
                                </h3>

                                <p className="text-xs text-[var(--text-muted)] mt-1">
                                  {hall.address || "Venue Hall"}
                                </p>
                              </div>
                            </div>

                            {/* ACTIONS MENU */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setActiveMenuId(
                                    activeMenuId === hall.id ? null : hall.id
                                  )
                                }
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

                              {activeMenuId === hall.id && (
                                <div className="absolute right-0 top-8 z-20 w-36 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-xl py-1 text-xs">
                                  <button
                                    onClick={() => handleOpenEditModal(hall)}
                                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-[var(--text-primary)] hover:bg-[var(--hover-surface)] cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" /> Edit Room
                                  </button>
                                  <button
                                    onClick={() => handleDeleteHall(hall.id)}
                                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-red-400 hover:bg-red-500/10 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* DIVIDER */}
                          <div className="border-t border-[var(--border-subtle)] my-5" />

                          {/* DETAILS */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                <Users className="w-4 h-4 text-emerald-500" />
                                Capacity
                              </div>

                              <span className="text-sm text-[var(--text-primary)] font-semibold">
                                {hall.capacity}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] shrink-0">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                Description
                              </div>

                              <span className="text-xs text-[var(--text-secondary)] text-right truncate max-w-[180px]">
                                {hall.description || "N/A"}
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
                                  status === "Available"
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
                              {status}
                            </span>

                            <button
                              onClick={() => handleOpenEditModal(hall)}
                              className="text-xs text-[var(--text-secondary)] hover:text-emerald-500 transition-colors cursor-pointer"
                            >
                              Edit Details →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* EMPTY STATE */}
                {filteredRooms.length === 0 && (
                  <div className="py-16 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-emerald-500" />
                    </div>

                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      No rooms found
                    </h3>

                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {halls.length === 0
                        ? "Click 'Add Room' above to create your first event hall."
                        : "Try changing your search query or filter."}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* CREATE / EDIT ROOM MODAL */}
      {(showAddModal || editingHall) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingHall(null);
                resetForm();
              }}
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">
              {editingHall ? "Edit Room" : "Add New Room"}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-6">
              {editingHall
                ? "Update room capacity and venue details."
                : "Create a new event space for your organization."}
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                  Room / Hall Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Ballroom"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                  Capacity (Max Persons) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 250"
                  value={formCapacity}
                  onChange={(e) => setFormCapacity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                  Address / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1st Floor, West Wing"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                  Description / Best For
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Keynote presentations, exhibitions, large workshops"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingHall(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingHall ? "Update Room" : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};