import { useState } from 'react';
import { SignUpScreen } from './Features/auth/SignUpScreen';
import { LoginScreen } from './Features/auth/LoginScreen';
import { ForgotPasswordScreen } from './Features/auth/ForgotPasswordScreen';
import { EventsDashboard } from './Features/events/EventsDashboard';

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
        <EventsDashboard
          onLogout={() => setCurrentScreen('login')}
          onCreateEvent={() => console.log('Open Create Event Modal')}
          onSelectEvent={(id: string) => console.log('Selected event:', id)}
        />
      )}
    </main>
  );
}