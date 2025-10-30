'use client';

import * as React from 'react';
import useSWR from 'swr';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import {
  Home, Users, Settings, UserCheck, Calendar,
  CreditCard, AlertTriangle, BarChart3, MessageSquare, Map, LogOut
} from 'lucide-react';
import { Button } from '../ui/button';
import { signOut, useSession } from 'next-auth/react';
import { fetcher } from '@/services/fetcher';


// 🔹 All your menu items with required permissions
const navItems = [
  { url: '/dashboard/profile', title: 'Dashboard', icon: Home, permission: 'view_all' },
  { url: '/dashboard/members', title: 'Members', icon: Users, permission: 'view_all' },
  { url: '/dashboard/approval', title: 'Member Approval', icon: UserCheck, permission: 'approve_members' },
  { url: '/dashboard/events', title: 'Events', icon: Calendar, permission: 'manage_events' },
  { url: '/dashboard/geomapping', title: 'Geo Mapping', icon: Map, permission: 'view_all' },
  { url: '/dashboard/communications', title: 'Communications', icon: MessageSquare, permission: 'manage_events' },
  { url: '/dashboard/disciplinary', title: 'Disciplinary Cases', icon: AlertTriangle, permission: 'manage_disciplinary' },
  { url: '/dashboard/membershipcards', title: 'Membership Cards', icon: CreditCard, permission: 'generate_reports' },
  { url: '/dashboard/reports', title: 'Reports & Analytics', icon: BarChart3, permission: 'generate_reports' },
  { url: '/dashboard/settings', title: 'Settings', icon: Settings, permission: 'system_settings' },
];


export default function AppSidebar() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();
  const role = user?.role

  // 🔹 Use SWR to fetch permissions dynamically based on role
  const { data, error, isLoading } = useSWR(
    user?.role ? `/api/permissions/${role}` : null,
    fetcher
  );

  const hasPermission = (data?: string) => {
    if (!data) return true;
    return data.includes(data);
  };

  return (
    <Sidebar className="h-screen flex flex-col border-r bg-white">
      {/* Header */}
      <SidebarHeader className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
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
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="flex-1 overflow-y-auto px-4 py-2">
        {isLoading ? (
          <p className="text-sm text-gray-500 p-4">Loading menu...</p>
        ) : error ? (
          <p className="text-sm text-red-500 p-4">Error loading permissions</p>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-500 text-xs uppercase mb-2 tracking-wide">
              Main Menu
            </SidebarGroupLabel>

            <SidebarMenu className="space-y-2">
              {navItems.map((item) => {
                if (!hasPermission(item.permission)) return null;
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() => router.push(item.url)}
                        className={`flex items-center w-full !p-4 rounded-lg transition-colors space-x-3
                          ${isActive
                            ? 'bg-upnd-red text-white font-semibold'
                            : 'text-gray-700 hover:text-upnd-red hover:bg-gray-100'}`}
                      >
                        {item.icon && <item.icon className="w-5 h-5 shrink-0" />}
                        <span className="truncate">{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-gray-200 p-4 space-y-3">
        <div className="p-3 bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-lg w-full text-white shadow-md">
          <h3 className="text-sm font-semibold mb-1">Current Role</h3>
          <p className="text-xs text-white/90">{user?.role || 'Member'}</p>
          {user?.constituency && (
            <p className="text-xs text-white/80">{user.constituency}</p>
          )}
        </div>

        <Button
          onClick={() => signOut({ redirect: false }).then(() => { window.location.href = '/'; })}
          variant="ghost"
          size="sm"
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
