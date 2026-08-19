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
              mb-7
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