import { useState } from 'react';
import { SignUpScreen } from './Features/auth/SignUpScreen';
import { LoginScreen } from './Features/auth/LoginScreen';
import { ForgotPasswordScreen } from './Features/auth/ForgotPasswordScreen';

type Screen = 'signup' | 'login' | 'forgot-password' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  return (
    <main>
      {currentScreen === 'login' && (
        <LoginScreen
          onNavigateToSignUp={() => setCurrentScreen('signup')}
          onNavigateToForgotPassword={() => setCurrentScreen('forgot-password')}
          onLoginSuccess={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'signup' && (
        <SignUpScreen
          onNavigateToLogin={() => setCurrentScreen('login')}
          onSignUpSuccess={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'forgot-password' && (
        <ForgotPasswordScreen
          onNavigateToLogin={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'dashboard' && (
        <div className="min-h-screen bg-[#090d0b] text-white flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-bold text-emerald-400 mb-2">Welcome to Event Management System</h1>
          <p className="text-sm text-gray-400 mb-6">You have successfully authenticated!</p>
          <button
            onClick={() => setCurrentScreen('login')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-semibold rounded-lg text-xs cursor-pointer transition-colors"
          >
            Log Out
          </button>
        </div>
      )}
    </main>
  );
}