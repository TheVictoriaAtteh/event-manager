import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordScreenProps {
  onNavigateToLogin: () => void;
  onSendResetLink?: (email: string) => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onNavigateToLogin,
  onSendResetLink,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      if (onSendResetLink) onSendResetLink(email);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#090d0b] flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-sm bg-[#121915] border border-emerald-900/30 rounded-2xl p-6 shadow-2xl text-center">
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 text-emerald-400">
            <Mail className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-emerald-50">
            Forgot Password
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-[240px]">
            Forgot your password? Enter your email address and we'll send you a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-xs text-emerald-400">
              Reset link sent! Please check your inbox at <span className="font-semibold text-white">{email}</span>.
            </div>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#090d0b] border border-emerald-900/40 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-emerald-950 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={onNavigateToLogin}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-400 font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};