import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
 
  LayoutGrid, 
  List as ListIcon,
  LogOut,
  Bell,
  CheckCircle2
} from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  attendeesCount: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  image: string;
}

const MOCK_EVENTS: EventItem[] = [
  {
    id: '1',
    title: 'Tech Innovators Summit 2026',
    category: 'Conference',
    date: 'Aug 24, 2026',
    time: '09:00 AM',
    location: 'Main Auditorium, Tech Hub',
    attendeesCount: 142,
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=600&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    title: 'UI/UX Design Workshop',
    category: 'Workshop',
    date: 'Sep 02, 2026',
    time: '02:00 PM',
    location: 'Design Studio B',
    attendeesCount: 45,
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    title: 'Annual Developer Meetup',
    category: 'Networking',
    date: 'Sep 15, 2026',
    time: '05:30 PM',
    location: 'Rooftop Lounge',
    attendeesCount: 88,
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=60',
  },
];

interface EventsDashboardProps {
  onLogout: () => void;
  onCreateEvent?: () => void;
  onSelectEvent?: (eventId: string) => void;
  onNavigateToAttendees?: () => void;
}

export const EventsDashboard: React.FC<EventsDashboardProps> = ({
  onLogout,
  onCreateEvent,
  onSelectEvent,
  onNavigateToAttendees,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredEvents = MOCK_EVENTS.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#090d0b] text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-emerald-900/30 bg-[#0d1310] flex-col justify-between hidden md:flex">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-emerald-50">Event Manager</h2>
              <p className="text-[10px] text-gray-500">Admin Console</p>
            </div>
          </div>

          <nav className="space-y-1">
  <button className="w-full flex items-center gap-3 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium cursor-pointer">
    <Calendar className="w-4 h-4" />
    Events Dashboard
  </button>

  <button
    onClick={onNavigateToAttendees}
    className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-emerald-950/30 rounded-lg text-xs font-medium transition-colors cursor-pointer"
  >
    <Users className="w-4 h-4" />
    Attendees List
  </button>
</nav>
        </div>

        <div className="p-4 border-t border-emerald-900/30">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-emerald-900/30 bg-[#0d1310]/50 px-6 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search events, locations, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-[#090d0b] border border-emerald-900/40 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-emerald-950/40 relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-emerald-800/40 border border-emerald-600/40 flex items-center justify-center text-xs font-bold text-emerald-300">
              BB
            </div>
          </div>
        </header>

        {/* Dashboard Viewport */}
        <main className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Top Bar with Title & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-emerald-50">Events Overview</h1>
              <p className="text-xs text-gray-400">Manage and organize upcoming platforms & gatherings</p>
            </div>
            <button
              onClick={onCreateEvent}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-semibold rounded-lg text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-900/20"
            >
              <Plus className="w-4 h-4" />
              Create New Event
            </button>
          </div>

          {/* Key Metrics Quick Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#121915] border border-emerald-900/30 rounded-xl">
              <div className="flex justify-between items-center text-gray-400 mb-2">
                <span className="text-xs font-medium">Total Events</span>
                <Calendar className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-50">12</p>
            </div>
            <div className="p-4 bg-[#121915] border border-emerald-900/30 rounded-xl">
              <div className="flex justify-between items-center text-gray-400 mb-2">
                <span className="text-xs font-medium">Total Registered</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-50">275</p>
            </div>
            <div className="p-4 bg-[#121915] border border-emerald-900/30 rounded-xl">
              <div className="flex justify-between items-center text-gray-400 mb-2">
                <span className="text-xs font-medium">Active Events</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-50">3</p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121915] border border-emerald-900/40 rounded-lg text-xs text-gray-300 hover:border-emerald-700">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                Filter
              </button>
            </div>

            <div className="flex items-center gap-1 bg-[#121915] border border-emerald-900/40 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-emerald-600/20 text-emerald-400' : 'text-gray-400'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-emerald-600/20 text-emerald-400' : 'text-gray-400'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Events Grid / List Display */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => onSelectEvent?.(event.id)}
                className="bg-[#121915] border border-emerald-900/30 hover:border-emerald-600/50 rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 shadow-lg group"
              >
                <div className="h-36 overflow-hidden relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-semibold">
                    {event.category}
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm text-emerald-50 group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-900/20 text-gray-400">
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 text-emerald-400 font-medium">
                      <Users className="w-3.5 h-3.5" />
                      <span>{event.attendeesCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};