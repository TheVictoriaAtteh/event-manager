/**
 * Minimal API client for the Event Manager backend (NestJS, port 4000).
 *
 * - Base URL from VITE_API_URL (falls back to the local backend).
 * - Stores JWT pair in localStorage under `gatepass_tokens`.
 * - Automatically refreshes once when the access token expires.
 */

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";

const TOKENS_KEY = "gatepass_tokens";

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;

  constructor(status: number, code: string | undefined, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/* ------------------------------------------------------------------ */
/* Token storage                                                       */
/* ------------------------------------------------------------------ */

export function getTokens(): StoredTokens | null {
  try {
    const raw = localStorage.getItem(TOKENS_KEY);
    return raw ? (JSON.parse(raw) as StoredTokens) : null;
  } catch {
    localStorage.removeItem(TOKENS_KEY);
    return null;
  }
}

export function saveTokens(tokens: StoredTokens): void {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

export function clearTokens(): void {
  localStorage.removeItem(TOKENS_KEY);
}

/* ------------------------------------------------------------------ */
/* Core fetch wrapper                                                  */
/* ------------------------------------------------------------------ */

interface ApiFetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Attach the Bearer token (default true). */
  auth?: boolean;
}

async function parseError(res: Response): Promise<ApiError> {
  let code: string | undefined;
  let message = `Request failed (${res.status})`;
  try {
    const data = (await res.json()) as {
      code?: string;
      message?: string | string[];
    };
    code = data.code;
    if (Array.isArray(data.message)) {
      message = data.message.join("; ");
    } else if (typeof data.message === "string") {
      message = data.message;
    }
  } catch {
    /* non-JSON error body */
  }
  return new ApiError(res.status, code, message);
}

/**
 * Calls the backend and returns the parsed JSON body.
 * On `401 TOKEN_EXPIRED` it transparently refreshes once and retries.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const doFetch = (): Promise<Response> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (auth) {
      const tokens = getTokens();
      if (tokens?.accessToken) {
        headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
    }
    return fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  };

  let res = await doFetch();

  if (res.status === 401 && auth) {
    const err = await parseError(res.clone());
    if (err.code === "TOKEN_EXPIRED" && getTokens()?.refreshToken) {
      try {
        await refreshTokens();
        res = await doFetch();
      } catch {
        throw err;
      }
    } else {
      throw err;
    }
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  // 204 / empty bodies
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/* ------------------------------------------------------------------ */
/* Token refresh                                                       */
/* ------------------------------------------------------------------ */

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function refreshTokens(): Promise<StoredTokens> {
  const current = getTokens();
  if (!current?.refreshToken) {
    throw new ApiError(401, "INVALID_REFRESH_TOKEN", "No refresh token");
  }

  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: current.refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    throw await parseError(res);
  }

  const data = (await res.json()) as RefreshResponse;
  const next: StoredTokens = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt: Date.now() + data.expiresIn * 1000,
  };
  saveTokens(next);
  return next;
}
