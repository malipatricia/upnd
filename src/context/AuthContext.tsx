'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { deriveLevel, normalizeRole, ROLE_PERMISSIONS } from '@/lib/roles';
import { UPNDUser, UserRole } from '../types';

interface AuthContextType {
  user: UPNDUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredUser(): UPNDUser | null {
  if (typeof window === 'undefined') return null;
  const storedUser = localStorage.getItem('upnd_user');
  if (!storedUser) return null;

  try {
    const parsed = JSON.parse(storedUser);
    const normalizedRole = normalizeRole(parsed?.role);
    return {
      id: parsed?.id ?? '',
      email: parsed?.email ?? '',
      role: normalizedRole,
      name: parsed?.name ?? '',
      jurisdiction: parsed?.jurisdiction ?? 'National',
      level: deriveLevel(normalizedRole),
      isActive: parsed?.isActive ?? true,
      partyPosition: parsed?.partyPosition,
    };
  } catch (error) {
    console.error('Failed to parse stored user data:', error);
    localStorage.removeItem('upnd_user');
    return null;
  }
}

function saveUserToStorage(user: UPNDUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('upnd_user', JSON.stringify(user));
}

function clearStoredUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('upnd_user');
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UPNDUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (status === 'loading') {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      return;
    }

    if (status === 'authenticated' && session?.user) {
      const normalizedRole = normalizeRole(session.user.role);
      const normalizedUser: UPNDUser = {
        id: session.user.id ?? '',
        email: session.user.email ?? '',
        role: normalizedRole,
        name: session.user.name ?? '',
        jurisdiction: session.user.constituency ?? 'National',
        level: deriveLevel(normalizedRole),
        isActive: true,
        partyPosition: (session.user as any).partyPosition,
      };

      setUser(normalizedUser);
      setIsAuthenticated(true);
      saveUserToStorage(normalizedUser);
      return;
    }

    clearStoredUser();
    setUser(null);
    setIsAuthenticated(false);
  }, [session, status]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      return false;
    }

    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearStoredUser();
    void signOut({ callbackUrl: '/admin', redirect: true });
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user?.role) return false;
    return user.role === role;
  };

  const hasPermission = (permission: string): boolean => {
    if (session?.user?.permissions?.length) {
      return session.user.permissions.includes(permission);
    }

    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
