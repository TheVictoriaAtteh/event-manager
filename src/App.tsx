import { useState } from 'react';
import { SignUpScreen } from './Features/auth/SignUpScreen';
import { LoginScreen } from './Features/auth/LoginScreen';
import { ForgotPasswordScreen } from './Features/auth/ForgotPasswordScreen';
import { EventsDashboard } from './Features/events/EventsDashboard';
import { EventDetailsScreen } from './Features/events/EventDetailsScreen';
import { CreateEventScreen } from './Features/events/CreateEventScreen';

type Screen = 
  | 'signup' 
  | 'login' 
  | 'forgot-password' 
  | 'dashboard' 
  | 'event-details' 
  | 'create-event';

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
          onCreateEvent={() => setCurrentScreen('create-event')}
          onSelectEvent={(id: string) => {
            console.log('Selected event:', id);
            setCurrentScreen('event-details');
          }}
        />
      )}

      {currentScreen === 'event-details' && (
        <EventDetailsScreen
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'create-event' && (
        <CreateEventScreen
          onBack={() => setCurrentScreen('dashboard')}
          onSubmitSuccess={() => setCurrentScreen('dashboard')}
        />
      )}
    </main>
  );
}