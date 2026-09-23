
import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  Building2,
  PlusCircle,
  Upload,
  MapPin,
  Users,
} from "lucide-react";
import { useCreateEventMutation, useHallsQuery } from "../../lib/apiQueries";
import { uploadImage } from "../../lib/uploadsApi";

interface CreateEventScreenProps {
  onBack: () => void;
  onSubmitSuccess: () => void;
}

export const CreateEventScreen: React.FC<CreateEventScreenProps> = ({
  onBack,
  onSubmitSuccess,
}) => {
  const createEventMutation = useCreateEventMutation();
  const { data: halls = [], isLoading: isLoadingHalls } = useHallsQuery();

  // Basic event form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  // Venue strategy state: 'existing' | 'new' | 'later'
  const [venueStrategy, setVenueStrategy] = useState<"existing" | "new" | "later">("new");
  const [selectedHallId, setSelectedHallId] = useState("");

  // Inline new hall fields
  const [hallName, setHallName] = useState("");
  const [hallAddress, setHallAddress] = useState("");
  const [hallCapacity, setHallCapacity] = useState("");
  const [hallDescription, setHallDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    let logoUrl: string | undefined;

    // Step 1: Upload banner image if provided
    if (banner) {
      setIsUploading(true);
      try {
        const { url } = await uploadImage(banner);
        logoUrl = url;
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "Failed to upload banner image");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    // Step 2: Build venue payload based on user's choice
    let venuePayload = {};
    if (venueStrategy === "existing" && selectedHallId) {
      venuePayload = { hallId: selectedHallId };
    } else if (venueStrategy === "new") {
      venuePayload = {
        hall: {
          name: hallName,
          address: hallAddress,
          capacity: Number(hallCapacity) || 100,
          description: hallDescription || undefined,
        },
      };
    }
    // If 'later', no hall or hallId properties are sent.

    setIsSubmitting(true);
    createEventMutation.mutate(
      {
        title,
        description,
        date,
        startsAt: time, // or combined ISO string depending on your backend expectation
        logoUrl,
        ...venuePayload,
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          onSubmitSuccess();
        },
        onError: (error) => {
          setIsSubmitting(false);
          setSubmitError(error instanceof Error ? error.message : "Failed to create event");
        },
      }
    );
  };

  const selectedHallDetails = halls.find((h) => h.id === selectedHallId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onBack();
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl">
        
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onBack}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-surface)] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="px-6 sm:px-8 pt-7 pb-5">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Create New Event</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1 pr-10">
            Fill in the details below to publish your upcoming event and assign a venue hall.
          </p>
        </div>

        <div className="border-t border-[var(--border-subtle)]" />

        {/* FORM */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-5">
          
          {/* TITLE */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tech Innovators Summit 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Description *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe what attendees can expect..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 resize-none transition-all"
            />
          </div>

          {/* DATE + TIME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Date *</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Start Time *</label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* VENUE STRATEGY SECTION */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
              Venue / Hall Assignment
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setVenueStrategy("new")}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                  venueStrategy === "new"
                    ? "border-emerald-500 bg-emerald-500/10 text-[var(--text-primary)]"
                    : "border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--hover-surface)]"
                }`}
              >
                <PlusCircle className="w-4 h-4 mb-1 text-emerald-500" />
                Create New Hall
              </button>

              <button
                type="button"
                onClick={() => setVenueStrategy("existing")}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                  venueStrategy === "existing"
                    ? "border-emerald-500 bg-emerald-500/10 text-[var(--text-primary)]"
                    : "border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--hover-surface)]"
                }`}
              >
                <Building2 className="w-4 h-4 mb-1 text-emerald-500" />
                Existing Hall
              </button>

              <button
                type="button"
                onClick={() => setVenueStrategy("later")}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                  venueStrategy === "later"
                    ? "border-emerald-500 bg-emerald-500/10 text-[var(--text-primary)]"
                    : "border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--hover-surface)]"
                }`}
              >
                <Clock className="w-4 h-4 mb-1 text-emerald-500" />
                Add Later
              </button>
            </div>

            {/* CONDITIONAL VENUE INPUTS */}
            {venueStrategy === "new" && (
              <div className="space-y-3 p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">Hall Name *</label>
                    <input
                      type="text"
                      required={venueStrategy === "new"}
                      placeholder="e.g. Main Auditorium"
                      value={hallName}
                      onChange={(e) => setHallName(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">Capacity *</label>
                    <input
                      type="number"
                      min="1"
                      required={venueStrategy === "new"}
                      placeholder="e.g. 500"
                      value={hallCapacity}
                      onChange={(e) => setHallCapacity(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Campus North Wing"
                    value={hallAddress}
                    onChange={(e) => setHallAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">Hall Description</label>
                  <textarea
                    rows={2}
                    placeholder="Add a short description for this hall..."
                    value={hallDescription}
                    onChange={(e) => setHallDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>
            )}

            {venueStrategy === "existing" && (
              <div className="space-y-3 p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)]">
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">Select Hall *</label>
                <select
                  value={selectedHallId}
                  onChange={(e) => setSelectedHallId(e.target.value)}
                  required={venueStrategy === "existing"}
                  disabled={isLoadingHalls}
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {isLoadingHalls ? "Loading halls..." : "-- Choose an existing hall --"}
                  </option>
                  {halls.map((hall) => (
                    <option key={hall.id} value={hall.id}>
                      {hall.name} (Capacity: {hall.capacity})
                    </option>
                  ))}
                </select>

                {selectedHallDetails && (
                  <div className="text-[11px] text-[var(--text-secondary)] flex items-center gap-2 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{selectedHallDetails.address || "No address specified"}</span>
                    <Users className="w-3.5 h-3.5 text-emerald-500 ml-2" />
                    <span>Capacity: {selectedHallDetails.capacity}</span>
                  </div>
                )}
              </div>
            )}

            {venueStrategy === "later" && (
              <p className="text-xs text-[var(--text-muted)] italic px-1">
                You can assign a venue hall to this event later from the event details page.
              </p>
            )}
          </div>

          {/* EVENT BANNER UPLOAD */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Event Banner Image
            </label>
            <label className="block border-2 border-dashed border-[var(--border-default)] hover:border-emerald-500/50 rounded-2xl overflow-hidden bg-[var(--bg-input)] transition-colors cursor-pointer">
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />

              {bannerPreview ? (
                <div className="relative w-full h-32">
                  <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white font-medium">Click to change</p>
                  </div>
                </div>
              ) : (
                <div className="p-5 text-center">
                  <Upload className="w-5 h-5 mx-auto text-emerald-500 mb-2" />
                  <p className="text-xs text-[var(--text-primary)] font-medium">Click to upload banner</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
            {submitError && <p className="text-xs text-red-500 mr-auto">{submitError}</p>}

            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting || isUploading}
              className="px-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-secondary)] rounded-xl text-xs font-medium hover:bg-[var(--hover-surface)] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {isUploading ? "Uploading..." : isSubmitting ? "Publishing..." : "Publish Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};