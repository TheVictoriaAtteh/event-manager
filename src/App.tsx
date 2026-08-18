import { useState } from "react";

import { LandingPage } from "./Features/landing/LandingPage";
import { SignUpScreen } from "./Features/auth/SignUpScreen";
import { LoginScreen } from "./Features/auth/LoginScreen";
import { ForgotPasswordScreen } from "./Features/auth/ForgotPasswordScreen";
import type { UserRole } from "./Features/auth/types";

import SettingsScreen from "./Features/settings/SettingsScreen";
import { EventsDashboard } from "./Features/events/EventsDashboard";
import { EventDetailsScreen } from "./Features/events/EventDetailsScreen";
import { CreateEventScreen } from "./Features/events/CreateEventScreen";
import { AttendeesListScreen } from "./Features/events/AttendeesListScreen";
import { RoomsScreen } from "./Features/rooms/RoomsScreen";

type Screen =
  | "landing"
  | "signup"
  | "login"
  | "forgot-password"
  | "dashboard"
  | "event-details"
  | "create-event"
  | "attendees"
  | "add-attendee"
  | "upload-attendees"
  | "pass-preview"
  | "rooms"
  | "add-room"
  | "booths"
  | "room-assignment"
  | "check-in"
  | "manual-check-in"
  | "check-in-log"
  | "settings"
  | "settings-profile"
  | "settings-security"
  | "settings-notifications"
  | "settings-appearance"
  | "help";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
  const [userRole, setUserRole] = useState<UserRole>("ATTENDEE");

  const handleLogout = () => {
    setUserRole("ATTENDEE");
    setCurrentScreen("landing");
  };

  return (
    <>
      {/* LANDING */}
      {currentScreen === "landing" && (
        <LandingPage
          onSignIn={() => setCurrentScreen("login")}
          onCreateEvent={() => setCurrentScreen("signup")}
          onDoorStaff={() => setCurrentScreen("login")}
        />
      )}

      {/* LOGIN */}
      {currentScreen === "login" && (
        <LoginScreen
          onNavigateToSignUp={() => setCurrentScreen("signup")}
          onNavigateToForgotPassword={() => setCurrentScreen("forgot-password")}
          onLoginSuccess={(role: UserRole) => {
            setUserRole(role);
            setCurrentScreen("dashboard");
          }}
        />
      )}

      {/* SIGN UP */}
      {currentScreen === "signup" && (
        <SignUpScreen
          onNavigateToLogin={() => setCurrentScreen("login")}
          onSignUpSuccess={() => setCurrentScreen("dashboard")}
        />
      )}

      {/* FORGOT PASSWORD */}
      {currentScreen === "forgot-password" && (
        <ForgotPasswordScreen
          onNavigateToLogin={() => setCurrentScreen("login")}
        />
      )}

      {/* DASHBOARD */}
      {currentScreen === "dashboard" && (
        <EventsDashboard
          userRole={userRole}
          onLogout={handleLogout}
          onCreateEvent={() => setCurrentScreen("create-event")}
          onSelectEvent={(id: string) => {
            console.log("Selected event:", id);
            setCurrentScreen("event-details");
          }}
          onNavigateToAttendees={() => setCurrentScreen("attendees")}
          onNavigate={(screen: string) => {
            setCurrentScreen(screen as Screen);
          }}
        />
      )}

      {/* EVENT DETAILS */}
      {currentScreen === "event-details" && (
        <EventDetailsScreen
          onBack={() => setCurrentScreen("dashboard")}
        />
      )}

      {/* CREATE EVENT */}
      {currentScreen === "create-event" && (
        <CreateEventScreen
          onBack={() => setCurrentScreen("dashboard")}
          onSubmitSuccess={() => setCurrentScreen("dashboard")}
        />
      )}

      {/* ATTENDEES */}
      {currentScreen === "attendees" && (
        <AttendeesListScreen
          onBack={() => setCurrentScreen("dashboard")}
        />
      )}

      {/* ROOMS */}
      {currentScreen === "rooms" && (
        <RoomsScreen
          onNavigate={(screen) => {
            setCurrentScreen(screen as Screen);
          }}
          onAddRoom={() => {
            setCurrentScreen("add-room");
          }}
        />
      )}

      {/* SETTINGS */}
      {currentScreen === "settings" && (
        <SettingsScreen
          onBack={() => setCurrentScreen("dashboard")}
        />
      )}
    </>
  );
}