import { useNavigate, useLocation, useParams, Navigate, Route, Routes } from "react-router-dom";
import { EventsProvider } from "./context/EventsContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useAuth } from "./context/useAuth";
import { LandingPage } from "./Features/landing/LandingPage";
import { SignUpScreen } from "./Features/auth/SignUpScreen";
import { LoginScreen } from "./Features/auth/LoginScreen";
import { ForgotPasswordScreen } from "./Features/auth/ForgotPasswordScreen";
import { VerifyEmailScreen } from "./Features/auth/VerifyEmailScreen";
import { ResetPasswordScreen } from "./Features/auth/ResetPasswordScreen";
import { OAuthCallbackScreen } from "./Features/auth/OAuthCallbackScreen";
import SettingsScreen, { type SettingsSectionId } from "./Features/settings/SettingsScreen";
import { EventsDashboard } from "./Features/events/EventsDashboard";
import { EventDetailsScreen } from "./Features/events/EventDetailsScreen";
import { CreateEventScreen } from "./Features/events/CreateEventScreen";
import { AttendeesListScreen } from "./Features/events/AttendeesListScreen";
import AddAttendeeScreen from "./Features/events/AddAttendeeScreen";
import UploadAttendeesScreen from "./Features/events/UploadAttendeesScreen";
import { RoomsScreen } from "./Features/rooms/RoomsScreen";
import { AddRoomModal } from "./Features/rooms/AddRoomModal";
import BoothsScreen from "./Features/booths/BoothsScreen";
import CheckInScreen from "./Features/check-in/CheckInScreen";
import CheckInLogScreen from "./Features/check-in/CheckInLogScreen";
import HelpScreen from "./Features/help/HelpScreen";
import { RouteModal } from "./components/RouteModal";

const settingsSections: Record<string, SettingsSectionId> = {
  settings: "profile", profile: "profile", security: "security", notifications: "notifications", appearance: "appearance",
};
const screenPaths: Record<string, string> = {
  dashboard: "/app", "event-details": "/app/events", attendees: "/app/events", "add-attendee": "/app/events", "upload-attendees": "/app/events",
  rooms: "/app/rooms", "add-room": "/app/rooms/new", booths: "/app/booths", "room-assignment": "/app/rooms", "check-in": "/app/check-in", "check-in-log": "/app/check-in/log",
  settings: "/app/settings", "settings-profile": "/app/settings/profile", "settings-security": "/app/settings/security", "settings-notifications": "/app/settings/notifications", "settings-appearance": "/app/settings/appearance", help: "/app/help",
};

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user?.role === "ADMIN" ? <>{children}</> : <Navigate to="/app" replace />;
}
function DashboardRoute() {
  const navigate = useNavigate(); const { user, logout } = useAuth();
  return <EventsDashboard userRole={user?.role ?? "ADMIN"} onLogout={() => { logout(); navigate("/", { replace: true }); }} onCreateEvent={() => navigate("/app/events/new")} onSelectEvent={(id) => navigate(`/app/events/${id}`)} onNavigateToAttendees={() => navigate("/app/events")} onNavigate={(screen) => navigate(screenPaths[screen] ?? "/app")} />;
}
function EventDetailsRoute() { const { eventId = "" } = useParams(); const navigate = useNavigate(); return <EventDetailsScreen eventId={eventId} onBack={() => navigate("/app")} onManageAttendees={() => navigate(`/app/events/${eventId}/attendees`)} />; }
function AttendeesRoute() { const { eventId = "" } = useParams(); const navigate = useNavigate(); return <AttendeesListScreen eventId={eventId} onBack={() => navigate("/app")} onAddAttendee={() => navigate(`/app/events/${eventId}/attendees/add`)} onUploadAttendees={() => navigate(`/app/events/${eventId}/attendees/upload`)} />; }
function AddAttendeeRoute() { const { eventId = "" } = useParams(); const navigate = useNavigate(); const parentPath = `/app/events/${eventId}/attendees`; return <><AttendeesRoute /><RouteModal label="Add attendee" onClose={() => navigate(parentPath)}><AddAttendeeScreen eventId={eventId} onBack={() => navigate(parentPath)} onDone={() => navigate(parentPath)} /></RouteModal></>; }
function UploadAttendeesRoute() { const { eventId = "" } = useParams(); const navigate = useNavigate(); const parentPath = `/app/events/${eventId}/attendees`; return <><AttendeesRoute /><RouteModal label="Upload attendees" onClose={() => navigate(parentPath)}><UploadAttendeesScreen eventId={eventId} onBack={() => navigate(parentPath)} onDone={() => navigate(parentPath)} /></RouteModal></>; }
function CheckInLogRoute() { const navigate = useNavigate(); return <><DashboardRoute /><RouteModal label="Check-in log" onClose={() => navigate("/app")}><CheckInLogScreen onBack={() => navigate("/app")} /></RouteModal></>; }
function BoothsRoute() { const navigate = useNavigate(); return <><DashboardRoute /><RouteModal label="Teams and booths" onClose={() => navigate("/app")}><BoothsScreen onBack={() => navigate("/app")} /></RouteModal></>; }
function SettingsRoute() { const navigate = useNavigate(); const { logout } = useAuth(); const { section = "settings" } = useParams(); return <SettingsScreen initialSection={settingsSections[section] ?? "profile"} onBack={() => navigate("/app")} onLogout={() => { logout(); navigate("/", { replace: true }); }} />; }

function AppRoutes() {
  const navigate = useNavigate();
  return <Routes>
    <Route index element={<DashboardRoute />} />
    {/* These action routes intentionally render over their parent route. */}
    <Route path="events/new" element={<><DashboardRoute /><CreateEventScreen onBack={() => navigate("/app")} onSubmitSuccess={() => navigate("/app")} /></>} />
    <Route path="events/:eventId" element={<EventDetailsRoute />} />
    <Route path="events/:eventId/attendees" element={<AdminRoute><AttendeesRoute /></AdminRoute>} />
    <Route path="events/:eventId/attendees/add" element={<AdminRoute><AddAttendeeRoute /></AdminRoute>} />
    <Route path="events/:eventId/attendees/upload" element={<AdminRoute><UploadAttendeesRoute /></AdminRoute>} />
    <Route path="rooms" element={<AdminRoute><RoomsScreen onNavigate={(screen) => navigate(screenPaths[screen] ?? "/app/rooms")} onAddRoom={() => navigate("/app/rooms/new")} /></AdminRoute>} />
    <Route path="rooms/new" element={<AdminRoute><><RoomsScreen onNavigate={(screen) => navigate(screenPaths[screen] ?? "/app/rooms")} onAddRoom={() => navigate("/app/rooms/new")} /><AddRoomModal onClose={() => navigate("/app/rooms")} /></></AdminRoute>} />
    <Route path="booths" element={<AdminRoute><BoothsRoute /></AdminRoute>} />
    <Route path="check-in" element={<CheckInScreen onBack={() => navigate("/app")} />} />
    <Route path="check-in/log" element={<AdminRoute><CheckInLogRoute /></AdminRoute>} />
    <Route path="settings/:section?" element={<SettingsRoute />} />
    <Route path="help" element={<HelpScreen onBack={() => navigate("/app")} />} />
    <Route path="*" element={<Navigate to="/app" replace />} />
  </Routes>;
}
function AuthRoutes() {
  const navigate = useNavigate(); const goToLogin = () => navigate("/login");
  return <Routes>
    <Route path="/" element={<LandingPage onSignIn={goToLogin} onCreateEvent={() => navigate("/signup")} onDoorStaff={goToLogin} />} />
    <Route path="/login" element={<LoginScreen onNavigateToSignUp={() => navigate("/signup")} onNavigateToForgotPassword={() => navigate("/forgot-password")} onLoginSuccess={() => navigate("/app", { replace: true })} />} />
    <Route path="/signup" element={<SignUpScreen onNavigateToLogin={goToLogin} onSignUpSuccess={() => navigate("/app", { replace: true })} />} />
    <Route path="/forgot-password" element={<ForgotPasswordScreen onNavigateToLogin={goToLogin} />} />
    <Route path="/auth/verify" element={<VerifyEmailScreen onNavigateToLogin={goToLogin} />} />
    <Route path="/auth/reset-password" element={<ResetPasswordScreen onNavigateToLogin={goToLogin} />} />
    <Route path="/auth/callback" element={<OAuthCallbackScreen onSuccess={() => navigate("/app", { replace: true })} onError={goToLogin} />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
export default function App() {
  const location = useLocation(); const { user, isLoading } = useAuth(); const isAppRoute = location.pathname === "/app" || location.pathname.startsWith("/app/");
  if (isLoading) return null;
  return <EventsProvider><ThemeProvider>{isAppRoute ? (user ? <Routes><Route path="/app/*" element={<AppRoutes />} /></Routes> : <Navigate to="/login" replace />) : <AuthRoutes />}</ThemeProvider></EventsProvider>;
}
