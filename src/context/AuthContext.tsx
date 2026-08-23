import React, { useState } from 'react';
import type { UserRole } from '../Features/auth/types';
import { AuthContext, type User } from './AuthContextType';

const STORAGE_KEY = 'gatepass_mock_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('Failed to parse saved user session:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return null;
  });

  const [isLoading] = useState<boolean>(false);

  const saveSession = (userData: User) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const login = (email: string, role: UserRole, name?: string) => {
    const mockUser: User = {
      id: `usr_${Date.now()}`,
      name: name || (role === 'ADMIN' ? 'Admin User' : 'Attendee User'),
      email,
      role,
    };
    saveSession(mockUser);
  };

  const loginWithGoogle = (role: UserRole) => {
    const mockGoogleUser: User = {
      id: `usr_g_${Date.now()}`,
      name: role === 'ADMIN' ? 'Google Admin' : 'Google Attendee',
      email: role === 'ADMIN' ? 'admin.google@gatepass.com' : 'user.google@gmail.com',
      role,
    };
    saveSession(mockGoogleUser);
  };

  const signUp = (email: string, name: string, role: UserRole) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role,
    };
    saveSession(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      saveSession(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        signUp,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};