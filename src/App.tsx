import { useState } from 'react';
import { LandingPage } from './Features/landing/LandingPage';
import { SignUpScreen } from './Features/auth/SignUpScreen';
import { LoginScreen } from './Features/auth/LoginScreen';
import { ForgotPasswordScreen } from './Features/auth/ForgotPasswordScreen';
import { EventsDashboard } from './Features/events/EventsDashboard';
import { EventDetailsScreen } from './Features/events/EventDetailsScreen';
import { CreateEventScreen } from './Features/events/CreateEventScreen';
import { AttendeesListScreen } from './Features/events/AttendeesListScreen';

type Screen = 
  | 'landing'
  | 'signup' 
  | 'login' 
  | 'forgot-password' 
  | 'dashboard' 
  | 'event-details' 
  | 'create-event'
  | 'attendees';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');

  return (
    <main>
      {currentScreen === 'landing' && (
        <LandingPage
          onSignIn={() => setCurrentScreen('login')}
          onCreateEvent={() => setCurrentScreen('signup')}
          onDoorStaff={() => setCurrentScreen('login')}
        />
      )}

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
          onLogout={() => setCurrentScreen('landing')}
          onCreateEvent={() => setCurrentScreen('create-event')}
          onSelectEvent={(id: string) => {
            console.log('Selected event:', id);
            setCurrentScreen('event-details');
          }}
          onNavigateToAttendees={() => setCurrentScreen('attendees')}
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

      {currentScreen === 'attendees' && (
        <AttendeesListScreen
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
    </main>
  );
}