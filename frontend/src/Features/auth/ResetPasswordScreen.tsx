import React, { useState } from "react";
import { KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { authApi } from "../../lib/authApi";
import { ApiError } from "../../lib/apiClient";

interface ResetPasswordScreenProps {
  onNavigateToLogin: () => void;
}

/**
 * Builds a single parameter map from BOTH the query string and the URL hash.
 * Supabase's default (implicit) flow delivers the recovery credential in the
 * hash fragment, so reading only `window.location.search` drops it.
 */
function parseRouteParams(): URLSearchParams {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace(/^#/, "");
  if (hash) {
    new URLSearchParams(hash).forEach((value, key) => {
      if (!params.has(key)) params.set(key, value);
    });
  }
  return params;
}

/**
 * Handles the Supabase password-recovery redirect
 * (FRONTEND_URL/auth/reset-password). Submits the new password together
 * with the link credential to the backend, which updates the password in
 * Supabase Auth.
 */
export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  onNavigateToLogin,
}) => {
  const params = parseRouteParams();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({
        code: params.get("code") ?? undefined,
        tokenHash: params.get("token_hash") ?? undefined,
        token: params.get("token") ?? undefined,
        email: params.get("email") ?? undefined,
        newPassword: password,
      });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not reset your password. Request a new link.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
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
  `;

  return (
    <div
      className="
        bg-dot-grid
        min-h-screen
        text-[var(--text-primary)]
        flex
        items-center
        justify-center
        p-6
        font-sans
      "
    >
      <div className="w-full max-w-sm">
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
            Set a new password
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Choose a strong password you haven't used before
          </p>
        </div>

        <div
          className="
            bg-[var(--bg-surface)]
            border border-[var(--border-subtle)]
            rounded-2xl
            p-6 sm:p-8
            shadow-xl
          "
        >
          {done ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Your password has been updated. You can now sign in with your
                new password.
              </p>
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
            </div>
          ) : (
            <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>
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
                  New password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

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
                  Confirm new password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

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

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  flex items-center justify-center gap-2
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
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
