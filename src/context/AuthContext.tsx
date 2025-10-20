'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

const mockUsers: Record<string, UPNDUser> = {
  'admin@upnd.zm': {
    id: '1',
    email: 'admin@upnd.zm',
    role: 'National Admin',
    name: 'Hakainde Hichilema',
    jurisdiction: 'National',
    level: 'National',
    isActive: true,
    partyPosition: 'National President'
  },
  'provincial@upnd.zm': {
    id: '2',
    email: 'provincial@upnd.zm',
    role: 'Provincial Admin',
    name: 'Cornelius Mweetwa',
    jurisdiction: 'Lusaka',
    level: 'Provincial',
    isActive: true,
    partyPosition: 'Provincial Chairperson'
  },
  'district@upnd.zm': {
    id: '3',
    email: 'district@upnd.zm',
    role: 'District Admin',
    name: 'Mutale Nalumango',
    jurisdiction: 'Lusaka District',
    level: 'District',
    isActive: true,
    partyPosition: 'District Chairperson'
  },
  'branch@upnd.zm': {
    id: '4',
    email: 'branch@upnd.zm',
    role: 'Branch Admin',
    name: 'Sylvia Masebo',
    jurisdiction: 'Kabwata Branch',
    level: 'Branch',
    isActive: true,
    partyPosition: 'Branch Chairperson'
  }
};

const permissions: Record<UserRole, string[]> = {
  'National Admin': [
    'view_all', 'approve_all', 'manage_users', 'generate_reports',
    'export_data', 'approve_members', 'system_settings', 'manage_disciplinary',
    'manage_events'
  ],
  'Provincial Admin': [
    'view_province', 'approve_members', 'manage_province_users',
    'generate_reports', 'export_data', 'manage_districts', 'manage_branches',
    'manage_officials', 'manage_events', 'view_performance', 'manage_disciplinary'
  ],
  'District Admin': [
    'view_district', 'approve_members', 'manage_district_users',
    'generate_reports', 'manage_constituencies', 'manage_events'
  ],
  'Constituency Admin': [
    'view_constituency', 'approve_members', 'manage_constituency_users',
    'generate_reports', 'manage_wards', 'manage_events'
  ],
  'Ward Admin': [
    'view_ward', 'approve_members', 'manage_ward_users',
    'generate_reports', 'manage_branches', 'manage_events'
  ],
  'Branch Admin': [
    'view_branch', 'approve_members', 'manage_branch_users',
    'generate_reports', 'manage_sections', 'manage_events'
  ],
  'Section Admin': [
    'view_section', 'review_applications', 'generate_reports'
  ],
  'Member': [
    'view_profile', 'update_profile'
  ]
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UPNDUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('upnd_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          localStorage.removeItem('upnd_user');
        }
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers[email];
    if (foundUser && password === 'upnd2024') {
      setUser(foundUser);
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('upnd_user', JSON.stringify(foundUser));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('upnd_user');
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      hasRole,
      hasPermission
    }}>
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
