import React, { useState } from 'react';
import type { UserRole } from './types';

interface SignUpScreenProps {
  onNavigateToLogin?: () => void;
  onSignUpSuccess: (role: UserRole) => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onNavigateToLogin,
  onSignUpSuccess,
}) => {
  const [role, setRole] = useState<UserRole>('ATTENDEE');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUpSuccess(role);
  };

  return (
    <div className="min-h-screen bg-[#0B1914] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-dot-grid relative overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Logo & Header */}
        <div className="flex justify-center items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-[#0B1914] font-extrabold text-xl shadow-lg shadow-emerald-500/20">
            G
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Gatepass</span>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-white tracking-tight">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-emerald-200/60">
          Get started with seamless event management and instant digital passes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-[#12241D]/80 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl border border-emerald-800/40 sm:px-10">
          
          {/* Role Toggle Selector */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 mb-6 bg-[#08120E] rounded-xl border border-emerald-900/80">
            <button
              type="button"
              onClick={() => setRole('ATTENDEE')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                role === 'ATTENDEE'
                  ? 'bg-emerald-500 text-[#0B1914] shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-emerald-300/60 hover:text-white hover:bg-emerald-900/30'
              }`}
            >
              Attendee
            </button>
            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                role === 'ADMIN'
                  ? 'bg-emerald-500 text-[#0B1914] shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-emerald-300/60 hover:text-white hover:bg-emerald-900/30'
              }`}
            >
              Admin
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-emerald-200/80 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-[#08120E]/90 border border-emerald-800/60 rounded-xl text-white placeholder-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-emerald-200/80 uppercase tracking-wider mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'ADMIN' ? 'admin@gatepass.com' : 'attendee@example.com'}
                className="w-full px-4 py-3 bg-[#08120E]/90 border border-emerald-800/60 rounded-xl text-white placeholder-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-emerald-200/80 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#08120E]/90 border border-emerald-800/60 rounded-xl text-white placeholder-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-[#0B1914] font-bold rounded-xl shadow-lg shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 text-sm"
            >
              Create {role === 'ADMIN' ? 'Admin' : 'Attendee'} Account
            </button>
          </form>

          {onNavigateToLogin && (
            <div className="mt-6 text-center border-t border-emerald-800/40 pt-6">
              <p className="text-sm text-emerald-200/60">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};