import React, { useState } from "react";
import type { UserRole } from "./types";
import { UserPlus, Loader2, MailCheck } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { ApiError } from "../../lib/apiClient";

interface SignUpScreenProps {
  onNavigateToLogin?: () => void;
  onSignUpSuccess: (role: UserRole) => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onNavigateToLogin,
  onSignUpSuccess,
}) => {
  const { signUp } = useAuth();

  const [role, setRole] = useState<UserRole>("ATTENDEE");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationPending, setVerificationPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signUp({ name: fullName, email, password, role });
      if (result.emailVerificationRequired) {
        // Supabase sent the confirmation email; the user must verify
        // before signing in.
        setVerificationPending(true);
      } else {
        onSignUpSuccess(result.user?.role ?? role);
      }
    } catch (err) {
      if (err instanceof ApiError && err.code === "EMAIL_ALREADY_EXISTS") {
        setError("An account with this email already exists. Try signing in.");
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Could not create your account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
            Create an account
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-[var(--text-secondary)]
              max-w-sm
              mx-auto
            "
          >
            Get started with seamless event management and instant digital
            passes
          </p>

        </div>

        {/* SIGN UP CARD */}
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
          {verificationPending ? (
            /* CHECK YOUR INBOX (email verification required) */
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <MailCheck className="w-10 h-10 text-emerald-600" />
              </div>

              <h2
                className="
                  text-xl
                  font-extrabold
                  tracking-tight
                  text-[var(--text-heading)]
                  mb-2
                "
              >
                Check your inbox
              </h2>

              <p className="text-sm text-[var(--text-secondary)] mb-6">
                We sent a verification link to{" "}
                <span className="font-semibold text-[var(--text-primary)]">
                  {email}
                </span>
                . Click it to activate your account, then sign in.
              </p>

              {onNavigateToLogin && (
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="
                    w-full
                    py-3 px-4
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
                  Go to sign in
                </button>
              )}
            </div>
          ) : (
          <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>

            {/* FULL NAME */}
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
                Full Name
              </label>

              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
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

            {/* EMAIL */}
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

            {/* PASSWORD */}
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
                Password
              </label>

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

            {/* ERRORS */}
            {error && (
              <div
                className="
                  text-sm
                  text-red-500
                  bg-red-500/10
                  border border-red-500/20
                  rounded-lg
                  px-4 py-3
                "
              >
                {error}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
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
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {loading
                ? "Creating account…"
                : `Create ${role === "ADMIN" ? "Admin" : "Attendee"} Account`}
            </button>

          </form>
          )}

          {/* LOGIN */}
          {onNavigateToLogin && (
            <div
              className="
                mt-7
                pt-6
                border-t border-[var(--border-subtle)]
                text-center
              "
            >
              <p className="text-sm text-[var(--text-secondary)]">

                Already have an account?{" "}

                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="
                    font-semibold
                    text-[var(--text-accent)]
                    hover:underline
                    transition-colors
                    cursor-pointer
                  "
                >
                  Sign in
                </button>

              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};