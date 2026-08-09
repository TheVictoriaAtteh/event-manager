import React, { useState } from 'react';
import { Calendar, Eye, EyeOff } from 'lucide-react';

export interface LoginFormData {
  email: string;
  password: string;
}

interface LoginScreenProps {
  onLoginSuccess?: () => void;
  onNavigateToSignUp?: () => void;
  onNavigateToForgotPassword?: () => void;
  onGoogleLogin?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  onGoogleLogin,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (onLoginSuccess) onLoginSuccess();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#090d0b] flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-sm bg-[#121915] border border-emerald-900/30 rounded-2xl p-6 shadow-2xl">
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-emerald-50">
            Event Management System
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Welcome back! Please log in to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Email address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-[#090d0b] border border-emerald-900/40 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs text-gray-400">Password</label>
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 pr-9 bg-[#090d0b] border border-emerald-900/40 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-emerald-950 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-emerald-900/40 w-full" />
          <span className="bg-[#121915] px-2 text-[10px] text-gray-500 uppercase font-medium">
            or
          </span>
        </div>

        <button
          type="button"
          onClick={onGoogleLogin}
          className="w-full py-2 bg-[#090d0b] hover:bg-emerald-950/40 border border-emerald-900/40 rounded-lg text-xs font-medium flex items-center justify-center gap-2 text-gray-200 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
            />
          </svg>
          Log in with Google
        </button>

        {/* Footer Navigation */}
        <div className="mt-5 text-center text-xs text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={onNavigateToSignUp}
            type="button"
            className="text-emerald-400 hover:underline font-medium cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};