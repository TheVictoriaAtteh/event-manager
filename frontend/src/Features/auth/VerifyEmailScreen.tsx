import React, { useEffect, useRef, useState } from "react";
import { MailCheck, Loader2, XCircle, Mail } from "lucide-react";
import { authApi } from "../../lib/authApi";
import { ApiError } from "../../lib/apiClient";

interface VerifyEmailScreenProps {
  onNavigateToLogin: () => void;
}

type Status = "verifying" | "success" | "error";

/**
 * Builds a single parameter map from BOTH the query string and the URL hash.
 * Supabase's default (implicit) flow delivers the confirmation credential in
 * the hash fragment (e.g. `/auth/verify#token_hash=…` or
 * `#access_token=…&refresh_token=…&type=signup`), so reading only
 * `window.location.search` drops it and produces a false
 * "Provide one of: code, tokenHash or token" error.
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
 * Handles the Supabase email-confirmation redirect (FRONTEND_URL/auth/verify).
 * Forwards the link credential (code / token_hash / legacy token) to the
 * backend, which verifies it against Supabase Auth. When the implicit-flow
 * link already carries a Supabase session (`access_token`), that token is
 * relayed to POST /auth/verify-session instead.
 */
export const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  onNavigateToLogin,
}) => {
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent">("idle");
  const attempted = useRef(false);

  const params = parseRouteParams();
  const email = params.get("email") ?? "";

  useEffect(() => {
    // Guard against React StrictMode double-invoking effects.
    if (attempted.current) return;
    attempted.current = true;

    const verify = async () => {
      try {
        const accessToken = params.get("access_token");
        if (accessToken) {
          await authApi.verifySession(
            accessToken,
            params.get("refresh_token") ?? "",
          );
        } else {
          await authApi.verifyEmail({
            code: params.get("code") ?? undefined,
            tokenHash: params.get("token_hash") ?? undefined,
            token: params.get("token") ?? undefined,
            email: email || undefined,
            type: "signup",
          });
        }
        setStatus("success");
      } catch (err) {
        setErrorMessage(
          err instanceof ApiError
            ? err.message
            : "Verification failed. Please try again.",
        );
        setStatus("error");
      }
    };
    void verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResend = async () => {
    if (!email) return;
    setResendState("sending");
    try {
      await authApi.resendVerification(email);
      setResendState("sent");
    } catch {
      setResendState("sent");
    }
  };

  const icon =
    status === "verifying" ? (
      <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
    ) : status === "success" ? (
      <MailCheck className="w-10 h-10 text-emerald-600" />
    ) : (
      <XCircle className="w-10 h-10 text-red-500" />
    );

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
        </div>

        <div
          className="
            bg-[var(--bg-surface)]
            border border-[var(--border-subtle)]
            rounded-2xl
            p-8
            shadow-xl
            text-center
          "
        >
          <div className="flex justify-center mb-4">{icon}</div>

          <h1
            className="
              text-xl
              font-extrabold
              tracking-tight
              text-[var(--text-heading)]
              mb-2
            "
          >
            {status === "verifying" && "Verifying your email…"}
            {status === "success" && "Email verified!"}
            {status === "error" && "Verification failed"}
          </h1>

          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {status === "verifying" &&
              "Hold on — confirming your account with the link you received."}
            {status === "success" &&
              "Your account is confirmed. You can now sign in with your email and password."}
            {status === "error" &&
              (errorMessage ||
                "This verification link is invalid or has expired.")}
          </p>

          {status === "error" && email && (
            <button
              type="button"
              onClick={() => void handleResend()}
              disabled={resendState !== "idle"}
              className="
                w-full
                flex items-center justify-center gap-2
                py-3 px-4
                mb-3
                bg-[var(--bg-input)]
                border border-[var(--border-default)]
                hover:border-emerald-500/50
                text-[var(--text-primary)]
                font-medium
                rounded-lg
                transition-all
                text-sm
                cursor-pointer
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              <Mail className="w-4 h-4" />
              {resendState === "sent"
                ? "New link sent (if the account exists)"
                : resendState === "sending"
                  ? "Sending…"
                  : "Resend verification email"}
            </button>
          )}

          <button
            type="button"
            onClick={onNavigateToLogin}
            disabled={status === "verifying"}
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
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            Go to sign in
          </button>
        </div>
      </div>
    </div>
  );
};
