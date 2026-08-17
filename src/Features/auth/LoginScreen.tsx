import React, { useState } from 'react';
import type { UserRole } from './types';

interface LoginScreenProps {
  onNavigateToSignUp?: () => void;
  onNavigateToForgotPassword?: () => void;
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  onLoginSuccess,
}) => {
  const [role, setRole] = useState<UserRole>('ATTENDEE');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(role);
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-dot-grid relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo & Header */}
        <div className="flex justify-center items-center gap-2 mb-2">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-emerald-950 font-bold text-xl shadow-lg shadow-emerald-500/20">
            EMS
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Event Management</span>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-emerald-200/70">
          Sign in to access your events and passes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-emerald-900/40 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-2xl sm:px-10 border border-emerald-800/50">
          
          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1.5 mb-6 bg-emerald-950/80 rounded-xl border border-emerald-800/60">
            <button
              type="button"
              onClick={() => setRole('ATTENDEE')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                role === 'ATTENDEE'
                  ? 'bg-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/20'
                  : 'text-emerald-300/70 hover:text-white hover:bg-emerald-900/50'
              }`}
            >
              Attendee
            </button>
            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                role === 'ADMIN'
                  ? 'bg-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/20'
                  : 'text-emerald-300/70 hover:text-white hover:bg-emerald-900/50'
              }`}
            >
              Admin
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-emerald-200 uppercase tracking-wider mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'ADMIN' ? 'admin@gatepass.com' : 'attendee@example.com'}
                className="w-full px-4 py-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-white placeholder-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-emerald-200 uppercase tracking-wider">
                  Password
                </label>
                {onNavigateToForgotPassword && (
                  <button
                    type="button"
                    onClick={onNavigateToForgotPassword}
                    className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-white placeholder-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-emerald-900 transition-all duration-200 text-sm"
            >
              Sign In as {role === 'ADMIN' ? 'Admin' : 'Attendee'}
            </button>
          </form>

          {onNavigateToSignUp && (
            <div className="mt-6 text-center border-t border-emerald-800/60 pt-6">
              <p className="text-sm text-emerald-200/70">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onNavigateToSignUp}
                  className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Create an account
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};