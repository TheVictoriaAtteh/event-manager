import React, { useCallback, useEffect, useState } from 'react';
import { authApi, type AuthUser } from '../lib/authApi';
import { clearTokens, getTokens, saveTokens } from '../lib/apiClient';
import { AuthContext, type SignUpInput, type SignUpResult, type User } from './AuthContextType';

const LEGACY_STORAGE_KEY = 'gatepass_mock_user';

const toUser = (u: AuthUser): User => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  avatarUrl: u.avatarUrl ?? undefined,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /*
   * Restore the session on boot: if a token pair exists, validate it
   * against the backend. Invalid/expired-with-no-refresh → logged out.
   */
  useEffect(() => {
    // Remove leftovers from the old mock auth implementation.
    localStorage.removeItem(LEGACY_STORAGE_KEY);

    const bootstrap = async () => {
      if (!getTokens()) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await authApi.me();
        setUser(toUser(me));
      } catch {
        clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    void bootstrap();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const result = await authApi.login(email, password);
    const next = toUser(result.user);
    setUser(next);
    return next;
  }, []);

  const signUp = useCallback(async (input: SignUpInput): Promise<SignUpResult> => {
    const result = await authApi.register(input);

    // Email confirmation disabled on the project → the backend returned a
    // session immediately; store it and treat the user as signed in.
    if (!result.emailVerificationRequired && result.accessToken && result.user) {
      saveTokens({
        accessToken: result.accessToken,
        refreshToken: '',
        expiresAt: Date.now() + 24 * 3600 * 1000,
      });
      const next = toUser(result.user);
      setUser(next);
      return { emailVerificationRequired: false, user: next };
    }

    return { emailVerificationRequired: true };
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
