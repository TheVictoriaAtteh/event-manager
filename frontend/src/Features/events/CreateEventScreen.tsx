import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Upload,
} from "lucide-react";
import { useEvents } from "../../context/useEvents";

interface CreateEventScreenProps {
  onBack: () => void;
  onSubmitSuccess: () => void;
}

export const CreateEventScreen: React.FC<CreateEventScreenProps> = ({
  onBack,
  onSubmitSuccess,
}) => {
  const { addEvent } = useEvents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Conference");
  const [capacity, setCapacity] = useState("");
  const [banner, setBanner] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert file to Object URL if uploaded for immediate local preview
    const imageUrl = banner ? URL.createObjectURL(banner) : undefined;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Dispatch event to application context
      await addEvent({
        title,
        description,
        date,
        time,
        location,
        category,
        maxCapacity: capacity ? Number(capacity) : 100,
        imageUrl,
      });

      onSubmitSuccess();
    } catch (error) {
      console.error('Failed to create event:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(file);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        p-4
        bg-black/50
        backdrop-blur-sm
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onBack();
        }
      }}
    >
      {/* MODAL */}
      <div
        className="
          relative
          w-full
          max-w-3xl
          max-h-[92vh]
          overflow-y-auto
          bg-[var(--bg-surface)]
          border
          border-[var(--border-subtle)]
          rounded-2xl
          shadow-2xl
        "
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onBack}
          className="
            absolute
            top-5
            right-5
            w-8
            h-8
            rounded-lg
            flex
            items-center
            justify-center
            text-[var(--text-muted)]
            hover:text-[var(--text-primary)]
            hover:bg-[var(--hover-surface)]
            transition-colors
            cursor-pointer
          "
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="px-6 sm:px-8 pt-7 pb-5">
          <h1
            className="
              text-xl
              font-bold
              text-[var(--text-primary)]
            "
          >
            Create New Event
          </h1>

          <p
            className="
              text-xs
              text-[var(--text-secondary)]
              mt-1
              pr-10
            "
          >
            Fill in the details below to publish your upcoming event
            and manage registrations.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-[var(--border-subtle)]" />

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="px-6 sm:px-8 py-6 space-y-5"
        >
          {/* EVENT TITLE */}
          <div>
            <label
              className="
                block
                text-xs
                font-semibold
                text-[var(--text-secondary)]
                mb-1.5
              "
            >
              Event Title
            </label>

            <input
              type="text"
              required
              placeholder="e.g. Tech Innovators Summit 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
                w-full
                px-3.5
                py-2.5
                bg-[var(--bg-input)]
                border
                border-[var(--border-default)]
                rounded-xl
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

          {/* DESCRIPTION */}
          <div>
            <label
              className="
                block
                text-xs
                font-semibold
                text-[var(--text-secondary)]
                mb-1.5
              "
            >
              Description
            </label>

            <textarea
              rows={3}
              required
              placeholder="Describe your event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="
                w-full
                px-3.5
                py-2.5
                bg-[var(--bg-input)]
                border
                border-[var(--border-default)]
                rounded-xl
                text-sm
                text-[var(--text-primary)]
                placeholder:text-[var(--text-muted)]
                focus:outline-none
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-500/10
                resize-none
                transition-all
              "
            />
          </div>

          {/* DATE + TIME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* DATE */}
            <div>
              <label
                className="
                  block
                  text-xs
                  font-semibold
                  text-[var(--text-secondary)]
                  mb-1.5
                "
              >
                Date
              </label>

              <div className="relative">
                <Calendar
                  className="
                    w-4
                    h-4
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-[var(--text-muted)]
                    pointer-events-none
                  "
                />

                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="
                    w-full
                    pl-10
                    pr-3.5
                    py-2.5
                    bg-[var(--bg-input)]
                    border
                    border-[var(--border-default)]
                    rounded-xl
                    text-sm
                    text-[var(--text-primary)]
                    focus:outline-none
                    focus:border-emerald-500
                    focus:ring-2
                    focus:ring-emerald-500/10
                    transition-all
                  "
                />
              </div>
            </div>

            {/* TIME */}
            <div>
              <label
                className="
                  block
                  text-xs
                  font-semibold
                  text-[var(--text-secondary)]
                  mb-1.5
                "
              >
                Time
              </label>

              <div className="relative">
                <Clock
                  className="
                    w-4
                    h-4
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-[var(--text-muted)]
                    pointer-events-none
                  "
                />

                <input
                  type="text"
                  required
                  placeholder="e.g. 10:00 AM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="
                    w-full
                    pl-10
                    pr-3.5
                    py-2.5
                    bg-[var(--bg-input)]
                    border
                    border-[var(--border-default)]
                    rounded-xl
                    text-sm
                    text-[var(--text-primary)]
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

          {/* LOCATION + CATEGORY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* LOCATION */}
            <div>
              <label
                className="
                  block
                  text-xs
                  font-semibold
                  text-[var(--text-secondary)]
                  mb-1.5
                "
              >
                Location / Venue
              </label>

              <div className="relative">
                <MapPin
                  className="
                    w-4
                    h-4
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-[var(--text-muted)]
                    pointer-events-none
                  "
                />

                <input
                  type="text"
                  required
                  placeholder="Main Auditorium, Tech Hub"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="
                    w-full
                    pl-10
                    pr-3.5
                    py-2.5
                    bg-[var(--bg-input)]
                    border
                    border-[var(--border-default)]
                    rounded-xl
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

            {/* CATEGORY */}
            <div>
              <label
                className="
                  block
                  text-xs
                  font-semibold
                  text-[var(--text-secondary)]
                  mb-1.5
                "
              >
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="
                  w-full
                  px-3.5
                  py-2.5
                  bg-[var(--bg-input)]
                  border
                  border-[var(--border-default)]
                  rounded-xl
                  text-sm
                  text-[var(--text-primary)]
                  focus:outline-none
                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-500/10
                  transition-all
                "
              >
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Meetup">Meetup</option>
                <option value="Webinar">Webinar</option>
              </select>
            </div>
          </div>

          {/* CAPACITY */}
          <div>
            <label
              className="
                block
                text-xs
                font-semibold
                text-[var(--text-secondary)]
                mb-1.5
              "
            >
              Attendee Capacity
            </label>

            <input
              type="number"
              min="1"
              required
              placeholder="e.g. 200"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="
                w-full
                px-3.5
                py-2.5
                bg-[var(--bg-input)]
                border
                border-[var(--border-default)]
                rounded-xl
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

          {/* EVENT BANNER */}
          <div>
            <label
              className="
                block
                text-xs
                font-semibold
                text-[var(--text-secondary)]
                mb-1.5
              "
            >
              Event Banner Image
            </label>

            <label
              className="
                block
                border-2
                border-dashed
                border-[var(--border-default)]
                hover:border-emerald-500/50
                rounded-2xl
                p-6
                text-center
                bg-[var(--bg-input)]
                transition-colors
                cursor-pointer
              "
            >
              <input
                type="file"
                accept="image/png,image/jpeg,image/gif,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                className="
                  w-10
                  h-10
                  mx-auto
                  rounded-full
                  bg-emerald-500/10
                  border
                  border-emerald-500/20
                  flex
                  items-center
                  justify-center
                  text-emerald-500
                "
              >
                <Upload className="w-4 h-4" />
              </div>

              <p
                className="
                  text-xs
                  text-[var(--text-primary)]
                  font-medium
                  mt-2
                "
              >
                {banner
                  ? banner.name
                  : "Click to upload or drag and drop"}
              </p>

              <p
                className="
                  text-[10px]
                  text-[var(--text-muted)]
                  mt-1
                "
              >
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </label>
          </div>

          {/* ACTIONS */}
          <div
            className="
              flex
              items-center
              justify-end
              gap-3
              pt-5
              border-t
              border-[var(--border-subtle)]
            "
          >
            {submitError && (
              <p className="text-xs text-red-500 mr-auto">
                {submitError}
              </p>
            )}

            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="
                px-4
                py-2.5
                bg-[var(--bg-input)]
                hover:bg-[var(--hover-surface)]
                border
                border-[var(--border-default)]
                text-[var(--text-secondary)]
                hover:text-[var(--text-primary)]
                rounded-xl
                text-xs
                font-medium
                transition-colors
                cursor-pointer
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                px-5
                py-2.5
                bg-emerald-600
                hover:bg-emerald-500
                text-white
                font-semibold
                rounded-xl
                text-xs
                transition-colors
                cursor-pointer
                shadow-lg
                shadow-emerald-900/10
                disabled:opacity-50
                disabled:cursor-not-allowed
                flex
                items-center
                gap-2
              "
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating...
                </>
              ) : (
                'Publish Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};