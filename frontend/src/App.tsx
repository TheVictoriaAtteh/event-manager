import { useState } from "react";

import { EventsProvider } from "./context/EventsContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useAuth } from "./context/useAuth";

import { LandingPage } from "./Features/landing/LandingPage";
import { SignUpScreen } from "./Features/auth/SignUpScreen";
import { LoginScreen } from "./Features/auth/LoginScreen";
import { ForgotPasswordScreen } from "./Features/auth/ForgotPasswordScreen";
import { VerifyEmailScreen } from "./Features/auth/VerifyEmailScreen";
import { ResetPasswordScreen } from "./Features/auth/ResetPasswordScreen";
import type { UserRole } from "./Features/auth/types";

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
  | "verify-email"
  | "reset-password"
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

const SETTINGS_SCREEN_TO_SECTION: Partial<
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

/* ========================================================= */
/* URL-BASED ENTRY (Supabase email links)                    */
/* ========================================================= */

/*
 * The app has no router; deep links from Supabase emails are resolved once
 * at boot by inspecting the path. Vite's dev server (and any static host
 * with SPA fallback) serves index.html for these paths.
 */
const screenFromUrl = (): Screen => {
  const path = window.location.pathname.replace(/\/+$/, "");
  if (path === "/auth/verify") return "verify-email";
  if (path === "/auth/reset-password") return "reset-password";
  return "landing";
};

export default function App() {
  const { logout } = useAuth();

  const [currentScreen, setCurrentScreen] = useState<Screen>(screenFromUrl);
  const [userRole, setUserRole] = useState<UserRole>("ATTENDEE");

  /*
   * Create Event is a modal, not a separate screen.
   */
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  /* ======================================================= */
  /* ROLE-AWARE NAVIGATION */
  /* ======================================================= */

  const handleNavigate = (screen: Screen) => {
    /*
     * If an attendee tries to access an admin-only screen,
     * simply keep them on the dashboard.
     */
    if (userRole !== "ADMIN" && ADMIN_ONLY_SCREENS.includes(screen)) {
      setCurrentScreen("dashboard");
      return;
    }

    setCurrentScreen(screen);
  };

  /* ======================================================= */
  /* LOGOUT */
  /* ======================================================= */

  const handleLogout = () => {
    logout();
    setUserRole("ATTENDEE");
    setShowCreateEvent(false);
    setCurrentScreen("landing");
  };

  /*
   * Shared target for the email-link screens; cleans the deep-link path.
   */
  const goToLoginFromEmailLink = () => {
    window.history.replaceState({}, "", "/");
    setCurrentScreen("login");
  };

  /* ======================================================= */
  /* SETTINGS */
  /* ======================================================= */

  const isSettingsScreen = currentScreen in SETTINGS_SCREEN_TO_SECTION;

  return (
    <EventsProvider>
      <ThemeProvider>
          <>
            {/* ================================================= */}
            {/* LANDING */}
            {/* ================================================= */}

            {currentScreen === "landing" && (
              <LandingPage
                onSignIn={() => setCurrentScreen("login")}
                onCreateEvent={() => setCurrentScreen("signup")}
                onDoorStaff={() => setCurrentScreen("login")}
              />
            )}

            {/* ================================================= */}
            {/* LOGIN */}
            {/* ================================================= */}

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

            {/* ================================================= */}
            {/* SIGN UP */}
            {/* ================================================= */}

            {currentScreen === "signup" && (
              <SignUpScreen
                onNavigateToLogin={() => setCurrentScreen("login")}
                onSignUpSuccess={(role: UserRole) => {
                  /*
                   * Reached only when the account was confirmed
                   * immediately (email confirmation disabled).
                   */
                  setUserRole(role);
                  setCurrentScreen("dashboard");
                }}
              />
            )}

            {/* ================================================= */}
            {/* EMAIL VERIFICATION LINK (/auth/verify)            */}
            {/* ================================================= */}

            {currentScreen === "verify-email" && (
              <VerifyEmailScreen onNavigateToLogin={goToLoginFromEmailLink} />
            )}

            {/* ================================================= */}
            {/* PASSWORD RESET LINK (/auth/reset-password)        */}
            {/* ================================================= */}

            {currentScreen === "reset-password" && (
              <ResetPasswordScreen
                onNavigateToLogin={goToLoginFromEmailLink}
              />
            )}

            {/* ================================================= */}
            {/* FORGOT PASSWORD */}
            {/* ================================================= */}

            {currentScreen === "forgot-password" && (
              <ForgotPasswordScreen
                onNavigateToLogin={() => setCurrentScreen("login")}
              />
            )}

            {/* ================================================= */}
            {/* DASHBOARD */}
            {/* ================================================= */}

            {currentScreen === "dashboard" && (
              <>
                <EventsDashboard
                  userRole={userRole}
                  onLogout={handleLogout}
                  /*
                   * ADMIN ONLY:
                   * Create Event opens the modal.
                   */
                  onCreateEvent={() => {
                    if (userRole === "ADMIN") {
                      setShowCreateEvent(true);
                    }
                  }}
                  onSelectEvent={(id: string) => {
                    console.log("Selected event:", id);
                    handleNavigate("event-details");
                  }}
                  /*
                   * Kept for compatibility with
                   * your existing EventsDashboard.
                   */
                  onNavigateToAttendees={() => {
                    handleNavigate("attendees");
                  }}
                  /*
                   * All dashboard/sidebar navigation
                   * goes through the role-aware handler.
                   */
                  onNavigate={(screen: string) => {
                    handleNavigate(screen as Screen);
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
                onBack={() => setCurrentScreen("dashboard")}
              />
            )}

            {/* ================================================= */}
            {/* ATTENDEES - ADMIN ONLY */}
            {/* ================================================= */}

            {currentScreen === "attendees" && userRole === "ADMIN" && (
              <AttendeesListScreen
                onBack={() => setCurrentScreen("dashboard")}
              />
            )}

            {/* ================================================= */}
            {/* ROOMS - ADMIN ONLY */}
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
            {/* BOOTHS - ADMIN ONLY */}
            {/* ================================================= */}

            {currentScreen === "booths" && userRole === "ADMIN" && (
              <BoothsScreen
                onBack={() => setCurrentScreen("dashboard")}
              />
            )}

            {/* ================================================= */}
            {/* CHECK-IN */}
            {/* ================================================= */}

            {currentScreen === "check-in" && (
              <CheckInScreen
                onBack={() => setCurrentScreen("dashboard")}
              />
            )}

            {/* ================================================= */}
            {/* CHECK-IN LOG - ADMIN ONLY */}
            {/* ================================================= */}

            {currentScreen === "check-in-log" && userRole === "ADMIN" && (
              <CheckInLogScreen
                onBack={() => setCurrentScreen("dashboard")}
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
                onBack={() => setCurrentScreen("dashboard")}
                onLogout={handleLogout}
              />
            )}

            {/* ================================================= */}
            {/* HELP */}
            {/* ================================================= */}

            {currentScreen === "help" && (
              <HelpScreen
                onBack={() => setCurrentScreen("dashboard")}
              />
            )}
          </>
      </ThemeProvider>
    </EventsProvider>
  );
}