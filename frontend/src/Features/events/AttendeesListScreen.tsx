import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  UserCheck, 
  UserX, 
  Clock, 
  Download, 
  Mail, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  status: 'Checked In' | 'Pending' | 'Cancelled';
  checkInTime?: string;
}

const MOCK_ATTENDEES: Attendee[] = [
  { id: '1', name: 'Sarah Jenkins', email: 'sarah.j@example.com', ticketType: 'VIP Pass', status: 'Checked In', checkInTime: '08:45 AM' },
  { id: '2', name: 'Alex Rivera', email: 'alex.r@example.com', ticketType: 'General Admission', status: 'Pending' },
  { id: '3', name: 'David Chen', email: 'd.chen@example.com', ticketType: 'Speaker', status: 'Checked In', checkInTime: '09:12 AM' },
  { id: '4', name: 'Emily Watson', email: 'emily.w@example.com', ticketType: 'General Admission', status: 'Pending' },
  { id: '5', name: 'Michael Brown', email: 'm.brown@example.com', ticketType: 'VIP Pass', status: 'Cancelled' },
];

interface AttendeesListScreenProps {
  onBack: () => void;
}

export const AttendeesListScreen: React.FC<AttendeesListScreenProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Checked In' | 'Pending'>('All');
  const [attendees, setAttendees] = useState<Attendee[]>(MOCK_ATTENDEES);

  const toggleCheckIn = (id: string) => {
    setAttendees((prev) =>
      prev.map((att) => {
        if (att.id === id) {
          const isCheckedIn = att.status === 'Checked In';
          return {
            ...att,
            status: isCheckedIn ? 'Pending' : 'Checked In',
            checkInTime: isCheckedIn ? undefined : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return att;
      })
    );
  };

  const filteredAttendees = attendees.filter((att) => {
    const matchesSearch = att.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          att.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || att.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-dot-grid min-h-screen text-white p-6 sm:p-10 font-sans space-y-6">
      {/* Navigation */}
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <button className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121915] border border-emerald-900/40 hover:border-emerald-700 text-xs text-emerald-400 rounded-xl transition-colors cursor-pointer">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto bg-[#121915] border border-emerald-900/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-emerald-50">Event Attendees</h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage registrations, track attendance, and verify attendee check-ins in real-time.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#090d0b] border border-emerald-900/40 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {(['All', 'Checked In', 'Pending'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  statusFilter === tab
                    ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-400'
                    : 'bg-[#090d0b] border border-emerald-900/30 text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Attendees Table */}
        <div className="overflow-x-auto rounded-xl border border-emerald-900/30 bg-[#090d0b]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-emerald-900/40 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-[#0d1310]">
                <th className="p-4">Attendee</th>
                <th className="p-4">Ticket Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Check-In Time</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/20 text-xs">
              {filteredAttendees.map((att) => (
                <tr key={att.id} className="hover:bg-emerald-950/20 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-emerald-50">{att.name}</div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-gray-500" />
                      {att.email}
                    </div>
                  </td>
                  <td className="p-4 text-gray-300 font-medium">{att.ticketType}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                        att.status === 'Checked In'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : att.status === 'Pending'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}
                    >
                      {att.status === 'Checked In' && <CheckCircle2 className="w-3 h-3" />}
                      {att.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {att.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                      {att.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{att.checkInTime || '--'}</td>
                  <td className="p-4 text-right">
                    {att.status !== 'Cancelled' && (
                      <button
                        onClick={() => toggleCheckIn(att.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          att.status === 'Checked In'
                            ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-emerald-950'
                        }`}
                      >
                        {att.status === 'Checked In' ? (
                          <>
                            <UserX className="w-3.5 h-3.5" /> Undo
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" /> Check In
                          </>
                        )}
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