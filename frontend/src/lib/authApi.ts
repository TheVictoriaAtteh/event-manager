/** Typed wrappers around the separately deployed API's auth endpoints. */

import { apiFetch, apiRequest, saveTokens } from "./apiClient";
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
  /** The current backend accepts the ADMIN role only. */
  role: UserRole;
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

function saveSession(result: LoginResult): LoginResult {
  saveTokens({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresAt: Date.now() + result.expiresIn * 1000,
  });
  return result;
}

export const authApi = {
  register(input: RegisterInput): Promise<RegisterResult> {
    return apiRequest<RegisterResult>({
      url: "/auth/register",
      method: "POST",
      data: input,
    });
  },

  login(email: string, password: string): Promise<LoginResult> {
    return apiRequest<LoginResult>({
      url: "/auth/login",
      method: "POST",
      data: { email, password },
    }).then(saveSession);
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
    }).then(saveSession);
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
    }).then(saveSession);
  },

  /** Returns the Google authorization URL supplied by the external API. */
  initiateGoogleOAuth(): Promise<{ url: string }> {
    return apiFetch<{ url: string }>("/auth/oauth/google", {
      method: "GET",
      auth: false,
    });
  },

  oauthCallback(code: string): Promise<LoginResult> {
    return apiFetch<LoginResult>("/auth/oauth/callback", {
      method: "POST",
      body: { code },
      auth: false,
    }).then(saveSession);
  },
};
