'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarProvider, 
  SidebarHeader,
  SidebarFooter,
  useSidebar
} from '@/components/ui/sidebar';
import { Home, Users, Settings, UserCheck, Calendar, CreditCard, AlertTriangle, BarChart3, MessageSquare, Map, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { signOut, useSession } from 'next-auth/react';
import { Separator } from '../ui/separator';

  const navItems = [
    {
      url: '/dashboard/profile',
      title: 'Dashboard',
      icon: Home,
      permission: 'view_all'
    },
    {
      url: '/dashboard/members',
      title: 'Members',
      icon: Users,
      permission: 'view_all'
    },
    {
      url: '/dashboard/approval',
      title: 'Member Approval',
      icon: UserCheck,
      permission: 'approve_members'
    },
    {
      url: '/dashboard/events',
      title: 'Events',
      icon: Calendar,
      permission: 'manage_events'
    },
    {
      url: '/dashboard/geomapping',
      title: 'Geo Mapping',
      icon: Map,
      permission: 'view_all'
    },
    {
      url: '/dashboard/communications',
      title: 'Communications',
      icon: MessageSquare,
      permission: 'manage_events'
    },
    {
      url: '/dashboard/disciplinary',
      title: 'Disciplinary Cases',
      icon: AlertTriangle,
      permission: 'manage_disciplinary'
    },
    {
      url: '/dashboard/membershipcards',
      title: 'Membership Cards',
      icon: CreditCard,
      permission: 'generate_reports'
    },
    {
      url: '/dashboard/reports',
      title: 'Reports & Analytics',
      icon: BarChart3,
      permission: 'generate_reports'
    },
    {
      url: '/dashboard/settings',
      title: 'Settings',
      icon: Settings,
      permission: 'system_settings'
    }
  ];

export default function AppSidebar() {
  const { data: session } = useSession(); 
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar(); // Hook to control mobile sidebar

  const handleNavigation = (url: string) => {
    router.push(url);
    setOpenMobile(false); // Close sidebar on mobile after navigation
  };

  return (
      <Sidebar className="h-screen flex flex-col border-r bg-white w-56 md:w-64">
        <SidebarHeader>
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
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
            <SidebarMenu className="space-y-3">
              {navItems.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() => handleNavigation(item.url)}
                        className={`flex items-center w-[95%] py-5 px-4 space-x-3 rounded-lg transition-all duration-200
                          ${isActive 
                            ? 'bg-upnd-red text-white font-semibold shadow-md' 
                            : 'text-gray-700 hover:text-upnd-red hover:bg-gray-100'}`}
                      >
                        {item.icon && <item.icon className="w-5 h-5 flex-shrink-0" />}
                        <span className="text-sm">{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="flex flex-col items-center py-4 px-4"> 
          <div className="w-full mt-4 p-4 bg-gradient-to-r from-upnd-red-light to-upnd-yellow-light rounded-lg mb-4">
            <h3 className="text-sm font-semibold text-white mb-2">Current Role</h3>
            <p className="text-xs text-white/90">{user?.role}</p>
            <p className="text-xs text-white/80">{user?.constituency}</p>
          </div>
          <Button 
            onClick={() => signOut({ redirect: false }).then(() => { window.location.href = '/'; })} 
            variant="ghost" 
            size="sm" 
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          > 
            <LogOut className="w-4 h-4 mr-2"/> 
            Log Out 
          </Button> 
        </SidebarFooter>
      </Sidebar>
  );
}
