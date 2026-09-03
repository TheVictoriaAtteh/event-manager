import { createContext } from 'react';
import type { UserRole } from '../Features/auth/types';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface SignUpResult {
  /** True when the user must confirm their email before signing in. */
  emailVerificationRequired: boolean;
  /** Present when the account was confirmed immediately. */
  user?: User;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Signs in with email + password; resolves with the server-side user. */
  login: (email: string, password: string) => Promise<User>;
  /** Registers via the backend (Supabase Auth sends the verification email). */
  signUp: (input: SignUpInput) => Promise<SignUpResult>;
  /** Clears the local session (JWTs are stateless). */
  logout: () => void;
  /** Directly sets the user (used for OAuth callbacks). */
  setUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
