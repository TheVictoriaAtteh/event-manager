import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search, 
  Mail, 
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Attendee {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  status: 'Confirmed' | 'Checked In' | 'Cancelled';
}

const MOCK_ATTENDEES: Attendee[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex.j@example.com', registeredAt: 'Aug 10, 2026', status: 'Checked In' },
  { id: '2', name: 'Sarah Williams', email: 'sarah.w@example.com', registeredAt: 'Aug 11, 2026', status: 'Confirmed' },
  { id: '3', name: 'Michael Chen', email: 'm.chen@example.com', registeredAt: 'Aug 12, 2026', status: 'Confirmed' },
  { id: '4', name: 'Emily Davis', email: 'emily.d@example.com', registeredAt: 'Aug 14, 2026', status: 'Cancelled' },
];

interface EventDetailsScreenProps {
  onBack: () => void;
}

export const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [attendees, setAttendees] = useState<Attendee[]>(MOCK_ATTENDEES);

  const filteredAttendees = attendees.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCheckIn = (id: string) => {
    setAttendees((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'Checked In' ? 'Confirmed' : 'Checked In';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#090d0b] text-white p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
      </div>

      {/* Event Header Banner */}
      <div className="bg-[#121915] border border-emerald-900/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold rounded-full uppercase tracking-wider">
              Conference
            </span>
            <h1 className="text-2xl font-bold text-emerald-50 mt-2">
              Tech Innovators Summit 2026
            </h1>
            <p className="text-xs text-gray-400 mt-1 max-w-2xl">
              Join industry leaders discussing AI trends, modern Web Development, and future software architecture.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-emerald-900/30 text-xs">
          <div className="flex items-center gap-2.5 text-gray-300">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Aug 24, 2026</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-300">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>09:00 AM - 05:00 PM</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-300">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Main Auditorium, Tech Hub</span>
          </div>
        </div>
      </div>

      {/* Attendees Section */}
      <div className="bg-[#121915] border border-emerald-900/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-emerald-50">Registered Attendees</h2>
            <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-800/40 text-emerald-400 text-xs font-semibold rounded-md">
              {attendees.length}
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search attendee name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#090d0b] border border-emerald-900/40 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-emerald-900/40 text-gray-400">
                <th className="py-3 px-3 font-semibold">Attendee</th>
                <th className="py-3 px-3 font-semibold">Registered Date</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/20">
              {filteredAttendees.map((a) => (
                <tr key={a.id} className="hover:bg-emerald-950/20 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-medium text-emerald-50">{a.name}</p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-gray-500" /> {a.email}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-gray-400">{a.registeredAt}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        a.status === 'Checked In'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : a.status === 'Confirmed'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {a.status === 'Checked In' && <CheckCircle className="w-3 h-3" />}
                      {a.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {a.status !== 'Cancelled' && (
                      <button
                        onClick={() => toggleCheckIn(a.id)}
                        className="px-2.5 py-1 bg-[#090d0b] hover:bg-emerald-900/40 border border-emerald-900/50 rounded-md text-[11px] text-emerald-400 font-medium transition-colors cursor-pointer"
                      >
                        {a.status === 'Checked In' ? 'Undo Check-In' : 'Check In'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};