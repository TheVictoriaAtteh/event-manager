import { useState } from "react";

import { AuthProvider } from "./context/AuthContext";
import { EventsProvider } from "./context/EventsContext";
import { ThemeProvider } from "./context/ThemeContext";

import { LandingPage } from "./Features/landing/LandingPage";
import { SignUpScreen } from "./Features/auth/SignUpScreen";
import { LoginScreen } from "./Features/auth/LoginScreen";
import { ForgotPasswordScreen } from "./Features/auth/ForgotPasswordScreen";
import type { UserRole } from "./Features/auth/types";

import Sidebar from "./components/Sidebar";

import SettingsScreen, {
  type SettingsSectionId,
} from "./Features/settings/SettingsScreen";

import { EventsDashboard } from "./Features/events/EventsDashboard";
import { EventDetailsScreen } from "./Features/events/EventDetailsScreen";
import { CreateEventScreen } from "./Features/events/CreateEventScreen";
import { AttendeesListScreen } from "./Features/events/AttendeesListScreen";

import { RoomsScreen } from "./Features/rooms/RoomsScreen";
import BoothsScreen from "./Features/booths/BoothsScreen";

import CheckInScreen from "./Features/check-in/CheckInScreen";
import CheckInLogScreen from "./Features/check-in/CheckInLogScreen";

import HelpScreen from "./Features/help/HelpScreen";

type Screen =
  | "landing"
  | "signup"
  | "login"
  | "forgot-password"
  | "dashboard"
  | "event-details"
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

/* ========================================================= */
/* SETTINGS NAVIGATION */
/* ========================================================= */

const SETTINGS_SCREEN_TO_SECTION: Partial <
  Record<Screen, SettingsSectionId>
> = {
  settings: "profile",
  "settings-profile": "profile",
  "settings-security": "security",
  "settings-notifications": "notifications",
  "settings-appearance": "appearance",
};

/* ========================================================= */
/* ADMIN-ONLY SCREENS */
/* ========================================================= */

const ADMIN_ONLY_SCREENS: Screen[] = [
  "attendees",
  "rooms",
  "add-room",
  "booths",
  "room-assignment",
  "check-in-log",
];

/* ========================================================= */
/* APP */
/* ========================================================= */

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");

  const [userRole, setUserRole] = useState<UserRole>("ATTENDEE");

  /*
   * Sidebar collapse state is now controlled by App.
   * This means the sidebar stays collapsed/expanded
   * when navigating between screens.
   */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /*
   * Create Event is a modal, not a separate screen.
   */
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  /* ========================================================= */
  /* ROLE-AWARE NAVIGATION */
  /* ========================================================= */

  const handleNavigate = (screen: Screen) => {
    /*
     * Prevent attendees from accessing admin-only screens.
     */
    if (userRole !== "ADMIN" && ADMIN_ONLY_SCREENS.includes(screen)) {
      setCurrentScreen("dashboard");
      return;
    }

    setCurrentScreen(screen);
  };

  /* ========================================================= */
  /* LOGOUT */
  /* ========================================================= */

  const handleLogout = () => {
    setUserRole("ATTENDEE");
    setShowCreateEvent(false);
    setSidebarCollapsed(false);
    setCurrentScreen("landing");
  };

  /* ========================================================= */
  /* AUTHENTICATED SCREENS */
  /* ========================================================= */

  const isAuthenticatedScreen =
    currentScreen !== "landing" &&
    currentScreen !== "signup" &&
    currentScreen !== "login" &&
    currentScreen !== "forgot-password";

  const isSettingsScreen = currentScreen in SETTINGS_SCREEN_TO_SECTION;

  return (
    <AuthProvider>
      <EventsProvider>
        <ThemeProvider>
          {/* ================================================= */}
          {/* PUBLIC / AUTH SCREENS */}
          {/* ================================================= */}

          {currentScreen === "landing" && (
            <LandingPage
              onSignIn={() => setCurrentScreen("login")}
              onCreateEvent={() => setCurrentScreen("signup")}
              onDoorStaff={() => setCurrentScreen("login")}
            />
          )}

          {currentScreen === "login" && (
            <LoginScreen
              onNavigateToSignUp={() => setCurrentScreen("signup")}
              onNavigateToForgotPassword={() =>
                setCurrentScreen("forgot-password")
              }
              onLoginSuccess={(role: UserRole) => {
                setUserRole(role);
                setCurrentScreen("dashboard");
              }}
            />
          )}

          {currentScreen === "signup" && (
            <SignUpScreen
              onNavigateToLogin={() => setCurrentScreen("login")}
              onSignUpSuccess={() => {
                setUserRole("ATTENDEE");
                setCurrentScreen("dashboard");
              }}
            />
          )}

          {currentScreen === "forgot-password" && (
            <ForgotPasswordScreen
              onNavigateToLogin={() => setCurrentScreen("login")}
            />
          )}

          {/* ================================================= */}
          {/* AUTHENTICATED APP */}
          {/* ================================================= */}

          {isAuthenticatedScreen && (
            <div className="h-screen flex bg-[var(--bg-page)] overflow-hidden">
              {/* ================================================= */}
              {/* GLOBAL SIDEBAR */}
              {/* ================================================= */}

              <Sidebar
                userRole={userRole}
                collapsed={sidebarCollapsed}
                onToggle={() =>
                  setSidebarCollapsed((previous) => !previous)
                }
                activeScreen={currentScreen}
                onNavigate={(screen: string) =>
                  handleNavigate(screen as Screen)
                }
                onLogout={handleLogout}
              />

              {/* ================================================= */}
              {/* MAIN CONTENT */}
              {/* ================================================= */}

              <main className="flex-1 min-w-0 h-full overflow-y-auto">
                {/* ================================================= */}
                {/* DASHBOARD */}
                {/* ================================================= */}

                {currentScreen === "dashboard" && (
                  <>
                    <EventsDashboard
                      userRole={userRole}
                      onCreateEvent={() => {
                        if (userRole === "ADMIN") {
                          setShowCreateEvent(true);
                        }
                      }}
                      onSelectEvent={(id: string) => {
                        console.log("Selected event:", id);
                        handleNavigate("event-details");
                      }}
                    />

                    {/* ================================================= */}
                    {/* CREATE EVENT MODAL */}
                    {/* ================================================= */}

                    {showCreateEvent && userRole === "ADMIN" && (
                      <CreateEventScreen
                        onBack={() => setShowCreateEvent(false)}
                        onSubmitSuccess={() => setShowCreateEvent(false)}
                      />
                    )}
                  </>
                )}

                {/* ================================================= */}
                {/* EVENT DETAILS */}
                {/* ================================================= */}

                {currentScreen === "event-details" && (
                  <EventDetailsScreen
                    onBack={() => handleNavigate("dashboard")}
                  />
                )}

                {/* ================================================= */}
                {/* ATTENDEES */}
                {/* ================================================= */}

                {currentScreen === "attendees" && userRole === "ADMIN" && (
                  <AttendeesListScreen
                    onBack={() => handleNavigate("dashboard")}
                  />
                )}

                {/* ================================================= */}
                {/* ROOMS */}
                {/* ================================================= */}

                {currentScreen === "rooms" && userRole === "ADMIN" && (
                  <RoomsScreen
                    onNavigate={(screen) => {
                      handleNavigate(screen as Screen);
                    }}
                    onAddRoom={() => {
                      handleNavigate("add-room");
                    }}
                  />
                )}

                {/* ================================================= */}
                {/* BOOTHS */}
                {/* ================================================= */}

                {currentScreen === "booths" && userRole === "ADMIN" && (
                  <BoothsScreen onBack={() => handleNavigate("dashboard")} />
                )}

                {/* ================================================= */}
                {/* CHECK-IN */}
                {/* ================================================= */}

                {currentScreen === "check-in" && (
                  <CheckInScreen onBack={() => handleNavigate("dashboard")} />
                )}

                {/* ================================================= */}
                {/* CHECK-IN LOG */}
                {/* ================================================= */}

                {currentScreen === "check-in-log" && userRole === "ADMIN" && (
                  <CheckInLogScreen
                    onBack={() => handleNavigate("dashboard")}
                  />
                )}

                {/* ================================================= */}
                {/* SETTINGS */}
                {/* ================================================= */}

                {isSettingsScreen && (
                  <SettingsScreen
                    key={currentScreen}
                    initialSection={
                      SETTINGS_SCREEN_TO_SECTION[currentScreen]
                    }
                    onBack={() => handleNavigate("dashboard")}
                    onLogout={handleLogout}
                  />
                )}

                {/* ================================================= */}
                {/* HELP */}
                {/* ================================================= */}

                {currentScreen === "help" && (
                  <HelpScreen onBack={() => handleNavigate("dashboard")} />
                )}
              </main>
            </div>
          )}
        </ThemeProvider>
      </EventsProvider>
    </AuthProvider>
  );
}