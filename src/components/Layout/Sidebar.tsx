'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Users,
  UserCheck,
  FileText,
  Download,
  CreditCard,
  Shield,
  AlertTriangle,
  Settings,
  BarChart3,
  Calendar,
  Map,
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const { user, hasPermission } = useAuth();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      permission: 'view_all'
    },
    {
      id: 'members',
      label: 'Members',
      icon: Users,
      permission: 'view_all'
    },
    {
      id: 'approval',
      label: 'Member Approval',
      icon: UserCheck,
      permission: 'approve_members'
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
      permission: 'manage_events'
    },
    {
      id: 'geomapping',
      label: 'Geo Mapping',
      icon: Map,
      permission: 'view_all'
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: MessageSquare,
      permission: 'manage_events'
    },
    {
      id: 'disciplinary',
      label: 'Disciplinary Cases',
      icon: AlertTriangle,
      permission: 'manage_disciplinary'
    },
    {
      id: 'membership-cards',
      label: 'Membership Cards',
      icon: CreditCard,
      permission: 'generate_reports'
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      permission: 'generate_reports'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      permission: 'system_settings'
    }
  ];

  const filteredNavigation = navigationItems.filter(item =>
    hasPermission(item.permission)
  );

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
            alt="UPND Logo"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h2 className="text-lg font-bold text-upnd-black">UPND Portal</h2>
            <p className="text-xs text-upnd-yellow font-medium">Admin Dashboard</p>
          </div>
        </div>

        <nav className="space-y-2">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={
                  `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-upnd-red text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-upnd-red'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-gradient-to-r from-upnd-red-light to-upnd-yellow-light rounded-lg">
          <h3 className="text-sm font-semibold text-white mb-2">Current Role</h3>
          <p className="text-xs text-white/90">{user?.role}</p>
          <p className="text-xs text-white/80">{user?.jurisdiction}</p>
        </div>
      </div>
    </aside>
  );
}
