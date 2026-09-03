/**
 * Typed wrappers around the backend authentication endpoints.
 * Contract: backend/AUTH_INTEGRATION.md
 */

import { apiFetch, saveTokens } from "./apiClient";
import type { UserRole } from "../Features/auth/types";

export interface AuthUser {
  id: string;
  supabaseUserId: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegisterResult {
  message: string;
  emailVerificationRequired: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: AuthUser;
}

export interface LoginResult {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  user: AuthUser;
}

export interface VerifyEmailInput {
  code?: string;
  tokenHash?: string;
  token?: string;
  email?: string;
  type?: "signup" | "invite" | "email_change";
}

export interface VerifyEmailResult {
  verified: boolean;
  message: string;
  user?: AuthUser;
}

export interface MessageResult {
  message: string;
}

export const authApi = {
  register(input: RegisterInput): Promise<RegisterResult> {
    return apiFetch<RegisterResult>("/auth/register", {
      method: "POST",
      body: input,
      auth: false,
    });
  },

  login(email: string, password: string): Promise<LoginResult> {
    return apiFetch<LoginResult>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }).then((result) => {
      saveTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresAt: Date.now() + result.expiresIn * 1000,
      });
      return result;
    });
  },

  verifyEmail(input: VerifyEmailInput): Promise<VerifyEmailResult> {
    return apiFetch<VerifyEmailResult>("/auth/verify-email", {
      method: "POST",
      body: input,
      auth: false,
    });
  },

  verifySession(accessToken: string, refreshToken: string): Promise<LoginResult> {
    return apiFetch<LoginResult>("/auth/verify-session", {
      method: "POST",
      body: { accessToken, refreshToken },
      auth: false,
    }).then((result) => {
      saveTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresAt: Date.now() + result.expiresIn * 1000,
      });
      return result;
    });
  },

  resendVerification(email: string): Promise<MessageResult> {
    return apiFetch<MessageResult>("/auth/resend-verification", {
      method: "POST",
      body: { email },
      auth: false,
    });
  },

  forgotPassword(email: string): Promise<MessageResult> {
    return apiFetch<MessageResult>("/auth/forgot-password", {
      method: "POST",
      body: { email },
      auth: false,
    });
  },

  resetPassword(input: VerifyEmailInput & { newPassword: string }): Promise<MessageResult> {
    return apiFetch<MessageResult>("/auth/reset-password", {
      method: "POST",
      body: input,
      auth: false,
    });
  },

  me(): Promise<AuthUser> {
    return apiFetch<AuthUser>("/auth/me");
  },

  refresh(refreshToken: string): Promise<LoginResult> {
    return apiFetch<LoginResult>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
      auth: false,
    }).then((result) => {
      saveTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresAt: Date.now() + result.expiresIn * 1000,
      });
      return result;
    });
  },

  /**
   * Initiate Google OAuth sign-in.
   * Returns the Google authorization URL to redirect to.
   */
  async initiateGoogleOAuth(): Promise<{ url: string }> {
    return apiFetch<{ url: string }>("/auth/oauth/google", {
      method: "GET",
      auth: false,
    });
  },

  /**
   * Handle OAuth callback after Google redirects back.
   * Exchanges the authorization code for a session.
   */
  oauthCallback(code: string): Promise<LoginResult> {
    return apiFetch<LoginResult>("/auth/oauth/callback", {
      method: "POST",
      body: { code },
      auth: false,
    }).then((result) => {
      saveTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresAt: Date.now() + result.expiresIn * 1000,
      });
      return result;
    });
  },
};
