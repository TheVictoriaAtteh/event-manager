import React, { useState } from "react";
import type { UserRole } from "./types";
import { LogIn } from "lucide-react";

interface LoginScreenProps {
  onNavigateToSignUp?: () => void;
  onNavigateToForgotPassword?: () => void;
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  onLoginSuccess,
}) => {
  const [role, setRole] = useState<UserRole>("ATTENDEE");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(role);
  };

  const handleGoogleSignIn = () => {
    // Trigger Google OAuth flow here
    onLoginSuccess(role);
  };

  return (
    <div
      className="
        bg-dot-grid
        min-h-screen
        text-[var(--text-primary)]
        flex
        flex-col
        justify-center
        p-6
        font-sans
      "
    >
      <div className="w-full max-w-md mx-auto">
        {/* BRAND */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div
              className="
                h-10 w-10
                rounded-xl
                bg-emerald-600
                flex items-center justify-center
                text-white
                font-extrabold
                text-lg
                shadow-lg
                shadow-emerald-900/10
              "
            >
              G
            </div>

            <span
              className="
                text-2xl
                font-bold
                text-[var(--text-heading)]
                tracking-tight
              "
            >
              Gatepass
            </span>
          </div>

          <h1
            className="
              text-3xl
              font-extrabold
              tracking-tight
              text-[var(--text-heading)]
            "
          >
            Welcome back
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-[var(--text-secondary)]
            "
          >
            Sign in to access your events and passes
          </p>
        </div>

        {/* LOGIN CARD */}
        <div
          className="
            bg-[var(--bg-surface)]
            border border-[var(--border-subtle)]
            rounded-2xl
            p-6 sm:p-8
            shadow-xl
          "
        >
          {/* ROLE SWITCHER */}
          <div
            className="
              grid grid-cols-2
              gap-1.5
              p-1.5
              mb-6
              bg-[var(--bg-input)]
              rounded-xl
              border border-[var(--border-default)]
            "
          >
            <button
              type="button"
              onClick={() => setRole("ATTENDEE")}
              className={`
                py-2.5
                text-xs
                font-semibold
                rounded-lg
                transition-all
                cursor-pointer
                ${
                  role === "ATTENDEE"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-surface)]"
                }
              `}
            >
              Attendee
            </button>

            <button
              type="button"
              onClick={() => setRole("ADMIN")}
              className={`
                py-2.5
                text-xs
                font-semibold
                rounded-lg
                transition-all
                cursor-pointer
                ${
                  role === "ADMIN"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-surface)]"
                }
              `}
            >
              Admin
            </button>
          </div>

          {/* GOOGLE SIGN-IN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="
              w-full
              flex items-center justify-center gap-3
              py-3 px-4
              bg-[var(--bg-input)]
              border border-[var(--border-default)]
              hover:border-emerald-500/50
              hover:bg-[var(--hover-surface)]
              text-[var(--text-primary)]
              font-medium
              rounded-lg
              transition-all
              text-sm
              cursor-pointer
              shadow-sm
            "
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* DIVIDER */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-subtle)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--bg-surface)] px-3 text-[var(--text-muted)] font-medium">
                Or continue with email
              </span>
            </div>
          </div>

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                className="
                  block
                  text-xs
                  font-semibold
                  text-[var(--text-secondary)]
                  uppercase
                  tracking-wider
                  mb-2
                "
              >
                Email address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  role === "ADMIN"
                    ? "admin@gatepass.com"
                    : "attendee@example.com"
                }
                className="
                  w-full
                  px-4 py-3
                  bg-[var(--bg-input)]
                  border border-[var(--border-default)]
                  rounded-lg
                  text-sm
                  text-[var(--text-primary)]
                  placeholder:text-[var(--text-muted)]
                  focus:outline-none
                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-500/10
                  transition-all
                "
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="
                    block
                    text-xs
                    font-semibold
                    text-[var(--text-secondary)]
                    uppercase
                    tracking-wider
                  "
                >
                  Password
                </label>

                {onNavigateToForgotPassword && (
                  <button
                    type="button"
                    onClick={onNavigateToForgotPassword}
                    className="
                      text-xs
                      font-medium
                      text-[var(--text-accent)]
                      hover:underline
                      transition-colors
                      cursor-pointer
                    "
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full
                  px-4 py-3
                  bg-[var(--bg-input)]
                  border border-[var(--border-default)]
                  rounded-lg
                  text-sm
                  text-[var(--text-primary)]
                  placeholder:text-[var(--text-muted)]
                  focus:outline-none
                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-500/10
                  transition-all
                "
              />
            </div>

            <button
              type="submit"
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                py-3
                px-4
                bg-emerald-600
                hover:bg-emerald-500
                text-white
                font-semibold
                rounded-lg
                shadow-lg
                shadow-emerald-900/10
                transition-colors
                cursor-pointer
                text-sm
              "
            >
              <LogIn className="w-4 h-4" />
              Sign In as {role === "ADMIN" ? "Admin" : "Attendee"}
            </button>
          </form>

          {/* SIGN UP */}
          {onNavigateToSignUp && (
            <div
              className="
                mt-7
                pt-6
                border-t border-[var(--border-subtle)]
                text-center
              "
            >
              <p className="text-sm text-[var(--text-secondary)]">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onNavigateToSignUp}
                  className="
                    font-semibold
                    text-[var(--text-accent)]
                    hover:underline
                    transition-colors
                    cursor-pointer
                  "
                >
                  Create an account
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
