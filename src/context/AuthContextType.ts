import { createContext } from 'react';
import type { UserRole } from '../Features/auth/types';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: UserRole, name?: string) => void;
  loginWithGoogle: (role: UserRole) => void;
  signUp: (email: string, name: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);