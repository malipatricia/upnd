'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { UPNDUser, UserRole, OrganizationalLevel } from '../types';

interface AuthContextType {
  user: UPNDUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_ALIAS_MAP: Record<string, UserRole> = {
  admin: 'admin',
  administrator: 'admin',
  nationaladmin: 'nationaladmin',
  nationaladministrator: 'nationaladmin',
  nationalchairperson: 'nationaladmin',
  nationalchairman: 'nationaladmin',
  provinceadmin: 'provinceadmin',
  provincialadmin: 'provinceadmin',
  provinceadministrator: 'provinceadmin',
  provincialadministrator: 'provinceadmin',
  provincechairperson: 'provinceadmin',
  districtadmin: 'districtadmin',
  districtadministrator: 'districtadmin',
  districtchairperson: 'districtadmin',
  wardadmin: 'wardadmin',
  wardadministrator: 'wardadmin',
  wardchairperson: 'wardadmin',
  branchadmin: 'branchadmin',
  branchadministrator: 'branchadmin',
  branchchairperson: 'branchadmin',
  sectionadmin: 'sectionadmin',
  sectionadministrator: 'sectionadmin',
  sectionchairperson: 'sectionadmin',
  member: 'member',
};

const ROLE_LEVEL_MAP: Record<UserRole, OrganizationalLevel> = {
  admin: 'National',
  nationaladmin: 'National',
  provinceadmin: 'Provincial',
  districtadmin: 'District',
  wardadmin: 'Ward',
  branchadmin: 'Branch',
  sectionadmin: 'Section',
  member: 'Section',
};

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'view_all',
    'approve_all',
    'manage_users',
    'generate_reports',
    'export_data',
    'approve_members',
    'system_settings',
    'manage_disciplinary',
    'manage_events',
    'approve_section',
    'approve_branch',
    'approve_ward',
    'approve_district',
    'approve_province',
  ],
  nationaladmin: [
    'view_all',
    'approve_all',
    'manage_users',
    'generate_reports',
    'export_data',
    'approve_members',
    'system_settings',
    'manage_disciplinary',
    'manage_events',
    'approve_section',
    'approve_branch',
    'approve_ward',
    'approve_district',
    'approve_province',
  ],
  provinceadmin: [
    'view_province',
    'approve_members',
    'manage_province_users',
    'generate_reports',
    'export_data',
    'manage_districts',
    'manage_branches',
    'manage_officials',
    'manage_events',
    'view_performance',
    'manage_disciplinary',
    'approve_province',
  ],
  districtadmin: [
    'view_district',
    'approve_members',
    'manage_district_users',
    'generate_reports',
    'manage_constituencies',
    'manage_events',
    'approve_district',
  ],
  wardadmin: [
    'view_ward',
    'approve_members',
    'manage_ward_users',
    'generate_reports',
    'manage_branches',
    'manage_events',
    'approve_ward',
  ],
  branchadmin: [
    'view_branch',
    'approve_members',
    'manage_branch_users',
    'generate_reports',
    'manage_sections',
    'manage_events',
    'approve_branch',
  ],
  sectionadmin: [
    'view_section',
    'review_applications',
    'generate_reports',
    'approve_section',
  ],
  member: [
    'view_profile',
    'update_profile',
  ],
};

function normalizeRole(role?: string | null): UserRole {
  if (!role) return 'member';
  const sanitized = role.trim().toLowerCase().replace(/[^a-z]/g, '');
  return ROLE_ALIAS_MAP[sanitized] ?? 'member';
}

function deriveLevel(role: UserRole): OrganizationalLevel {
  return ROLE_LEVEL_MAP[role] ?? 'National';
}

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
      return;
    }

    if (session?.user) {
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

    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      return;
    }

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
