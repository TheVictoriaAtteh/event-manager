import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Upload } from 'lucide-react';

interface CreateEventScreenProps {
  onBack: () => void;
  onSubmitSuccess: () => void;
}

export const CreateEventScreen: React.FC<CreateEventScreenProps> = ({
  onBack,
  onSubmitSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Conference');
  const [capacity, setCapacity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Action logic for event creation
    onSubmitSuccess();
  };

  return (
    <div className="min-h-screen bg-[#090d0b] text-white p-6 space-y-6">
      {/* Top Navigation */}
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
      </div>

      {/* Main Form Container */}
      <div className="max-w-3xl mx-auto bg-[#121915] border border-emerald-900/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-emerald-50">Create New Event</h1>
          <p className="text-xs text-gray-400 mt-1">
            Fill in the details below to publish your upcoming event and manage registrations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Event Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tech Innovators Summit 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#090d0b] border border-emerald-900/40 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe your event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#090d0b] border border-emerald-900/40 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-[#090d0b] border border-emerald-900/40 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Time
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-[#090d0b] border border-emerald-900/40 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Location & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Location / Venue
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder="Main Auditorium, Tech Hub"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-[#090d0b] border border-emerald-900/40 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#090d0b] border border-emerald-900/40 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Meetup">Meetup</option>
                <option value="Webinar">Webinar</option>
              </select>
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Attendee Capacity
            </label>
            <input
              type="number"
              placeholder="e.g. 200"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#090d0b] border border-emerald-900/40 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* File Upload Drop Area */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Event Banner Image
            </label>
            <div className="border-2 border-dashed border-emerald-900/40 hover:border-emerald-500/50 rounded-2xl p-6 text-center bg-[#090d0b] transition-colors cursor-pointer space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Upload className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-300 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-[10px] text-gray-500">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-emerald-900/30">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 bg-[#090d0b] hover:bg-emerald-900/20 border border-emerald-900/40 text-xs text-gray-300 rounded-xl font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-950/40"
            >
              Publish Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};