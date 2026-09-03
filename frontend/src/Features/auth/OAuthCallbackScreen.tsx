import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { authApi } from "../../lib/authApi";
import { useAuth } from "../../context/useAuth";
import type { UserRole } from "./types";
import type { User } from "../../context/AuthContextType";

interface OAuthCallbackScreenProps {
  onSuccess: (role: UserRole) => void;
  onError: () => void;
}

export const OAuthCallbackScreen: React.FC<OAuthCallbackScreenProps> = ({
  onSuccess,
  onError,
}) => {
  const { setUser } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract code from URL query parameters
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          setStatus("error");
          setErrorMessage("No authorization code received from Google");
          return;
        }

        // Exchange code for session via backend
        const result = await authApi.oauthCallback(code);
        
        setStatus("success");
        
        // Update auth context (similar to login)
        if (setUser) {
          const user: User = {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            avatarUrl: result.user.avatarUrl ?? undefined,
          };
          setUser(user);
        }

        // Redirect to dashboard after a brief success message
        setTimeout(() => {
          onSuccess(result.user.role);
        }, 1500);
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err?.message || "Authentication failed. Please try again.");
        setTimeout(() => {
          onError();
        }, 3000);
      }
    };

    void handleCallback();
  }, [onSuccess, onError, setUser]);

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)] flex flex-col justify-center p-6 font-sans">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-8 shadow-xl">
          {status === "loading" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-2">
                Signing you in...
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Please wait while we complete your authentication
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-2">
                Success!
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Redirecting you to your dashboard...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-2">
                Authentication Failed
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                {errorMessage}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Redirecting you back to login...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
