import React from 'react';
import { QrCode, Scan, Users, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onSignIn: () => void;
  onCreateEvent: () => void;
  onDoorStaff: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSignIn,
  onCreateEvent,
  onDoorStaff,
}) => {
  return (
    <div className="min-h-screen bg-[#0d110e] text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden font-sans">
      {/* Background Dot Grid Effect */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#34d399 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Navigation */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="text-lg font-bold tracking-wide text-emerald-50">
          Gatepass
        </div>
        <button
          onClick={onSignIn}
          className="px-4 py-1.5 bg-[#161f1a] hover:bg-[#1e2b24] border border-emerald-900/40 text-xs font-medium text-emerald-300 rounded-md transition-colors cursor-pointer"
        >
          Sign in
        </button>
      </header>

      {/* Hero Content Section */}
      <main className="relative z-10 max-w-6xl w-full mx-auto my-auto py-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500/80">
              PLAN · PASSES · CHECK-IN
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-emerald-50 leading-[1.1]">
              Passes at the door, <br />
              <span className="text-emerald-400">not paperwork.</span>
            </h1>

            <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
              Gatepass turns an attendee list into secure, branded QR passes and gives your door staff a scanner that answers one question fast: let them in, or not.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onCreateEvent}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-semibold rounded-lg text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-950/50"
              >
                Create an event
              </button>
              <button
                onClick={onDoorStaff}
                className="px-5 py-2.5 bg-[#141c18] hover:bg-[#1a2520] border border-emerald-900/40 text-xs font-semibold text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                I'm door staff
              </button>
            </div>
          </div>

          {/* Right Column: Pass Card Preview */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-[#121815] border border-emerald-900/30 rounded-2xl overflow-hidden shadow-2xl">
              {/* Event Name Header */}
              <div className="bg-[#0f2e1f] px-5 py-4 border-b border-emerald-800/30">
                <h3 className="font-bold text-emerald-200 text-sm tracking-wide">
                  Lagos Builders Summit
                </h3>
              </div>

              {/* Ticket Details */}
              <div className="p-5 space-y-5">
                <div>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Attendee</p>
                  <p className="text-lg font-bold text-emerald-50 mt-0.5">Ada Nwosu</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">When</p>
                    <p className="text-gray-300 font-medium mt-0.5">Sat 12 Sep · 10:00</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Ticket</p>
                    <p className="text-gray-300 font-medium mt-0.5">General</p>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="pt-4 border-t border-dashed border-emerald-900/40 flex items-center justify-between">
                  <div className="p-2.5 bg-[#0a0e0c] border border-emerald-900/40 rounded-xl text-emerald-400">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-gray-500">A47F91C2E0B4 · v1</p>
                    <p className="text-[11px] text-emerald-400/80 font-medium mt-0.5">Scan at the door</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
          <div className="bg-[#121815] border border-emerald-900/30 rounded-xl p-5 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <QrCode className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-emerald-50">Branded passes</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Every attendee gets a pass carrying your logo and brand colour, with a non-sequential QR code. Download as PNG or PDF.
            </p>
          </div>

          <div className="bg-[#121815] border border-emerald-900/30 rounded-xl p-5 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Scan className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-emerald-50">Door scanner</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Camera scanning with unmistakable Valid, Already used and Not found states — plus manual name search when a phone dies.
            </p>
          </div>

          <div className="bg-[#121815] border border-emerald-900/30 rounded-xl p-5 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-emerald-50">Attendee lists</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Add people one by one or import a CSV with fault-tolerant, line-by-line error reporting.
            </p>
          </div>

          <div className="bg-[#121815] border border-emerald-900/30 rounded-xl p-5 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-emerald-50">Revocable codes</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Regenerating a pass invalidates the previous QR code instantly, so a leaked screenshot stops working.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="relative z-10 text-center text-[11px] text-gray-500 py-4">
        Gatepass — free events, no payment processing, no printers required.
      </footer>
    </div>
  );
};