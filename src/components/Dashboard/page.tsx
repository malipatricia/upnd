'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMembers } from '../../hooks/useMembers';
import { useDisciplinary } from '../../hooks/useDisciplinary';
import { useAuth } from '../../context/AuthContext';
import { ChartCard } from './ChartCard';
import {
  Users,
  Clock,
  CheckCircle,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Award,
  Calendar,
  FileText,
  Settings
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { DateRangeFilter } from '@/app/dashboard/DateRangeFilter';
import { NotificationPanel } from '@/app/dashboard/NotificationPanel';
import { ApprovalFunnel } from '@/app/dashboard/ApprovalFunnel';
import { ExportDashboard } from '@/app/dashboard/ExportDashboard';
import { QuickActions } from '@/app/dashboard/QuickActions';
import { RecentActivity } from '@/app/dashboard/RecentActivity';
import { StatsCard } from '@/app/dashboard/StatsCard';

export default function Dashboard() {
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const {data: session} = useSession()
  const [selectedDateRange, setSelectedDateRange] = useState('last30');
  const [dateRange, setDateRange] = useState<{startDate?: Date, endDate?: Date}>({});

  // Convert selected date range to actual Date objects
  const getDateRangeFromSelection = (rangeValue: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (rangeValue) {
      case 'today':
        return {
          startDate: today,
          endDate: now
        };
      case 'last7':
        return {
          startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          endDate: now
        };
      case 'last30':
        return {
          startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
          endDate: now
        };
      case 'last90':
        return {
          startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
          endDate: now
        };
      case 'last180':
        return {
          startDate: new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000),
          endDate: now
        };
      case 'thisYear':
        return {
          startDate: new Date(now.getFullYear(), 0, 1),
          endDate: now
        };
      case 'allTime':
        return {
          startDate: new Date(2020, 0, 1),
          endDate: now
        };
      default:
        return {
          startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
          endDate: now
        };
    }
  };

  // Update date range when selection changes
  React.useEffect(() => {
    setDateRange(getDateRangeFromSelection(selectedDateRange));
  }, [selectedDateRange]);

  const { members, statistics, loading } = useMembers(dateRange.startDate, dateRange.endDate);
  const { cases } = useDisciplinary(dateRange.startDate, dateRange.endDate);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'urgent' as const,
      title: 'Pending Approvals',
      message: `${statistics?.pendingApplications || 0} applications awaiting your review`,
      time: '5 min ago',
      read: false,
      action: {
        label: 'Review Now',
        onClick: () => console.log('Navigate to approvals')
      }
    },
    {
      id: '2',
      type: 'success' as const,
      title: 'New Members Approved',
      message: '15 members successfully approved today',
      time: '1 hour ago',
      read: false
    },
    {
      id: '3',
      type: 'info' as const,
      title: 'System Update',
      message: 'Dashboard analytics have been refreshed',
      time: '2 hours ago',
      read: true
    }
  ]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalDisciplinaryCases = cases?.length || 0;
  const activeCases = cases?.filter(c => c.status === 'Active').length || 0;

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const funnelStages = [
    {
      name: 'Applied',
      count: statistics?.totalMembers || 0,
      percentage: 100,
      color: 'bg-blue-500'
    },
    {
      name: 'Section Review',
      count: statistics?.statusDistribution['Pending Section Review'] || 0,
      percentage: ((statistics?.statusDistribution['Pending Section Review'] || 0) / (statistics?.totalMembers || 1)) * 100,
      color: 'bg-upnd-yellow'
    },
    {
      name: 'Branch Review',
      count: statistics?.statusDistribution['Pending Branch Review'] || 0,
      percentage: ((statistics?.statusDistribution['Pending Branch Review'] || 0) / (statistics?.totalMembers || 1)) * 100,
      color: 'bg-orange-500'
    },
    {
      name: 'Ward Review',
      count: statistics?.statusDistribution['Pending Ward Review'] || 0,
      percentage: ((statistics?.statusDistribution['Pending Ward Review'] || 0) / (statistics?.totalMembers || 1)) * 100,
      color: 'bg-upnd-yellow'
    },
    {
      name: 'District Review',
      count: statistics?.statusDistribution['Pending District Review'] || 0,
      percentage: ((statistics?.statusDistribution['Pending District Review'] || 0) / (statistics?.totalMembers || 1)) * 100,
      color: 'bg-orange-500'
    },
    {
      name: 'Approved',
      count: statistics?.approvedMembers || 0,
      percentage: ((statistics?.approvedMembers || 0) / (statistics?.totalMembers || 1)) * 100,
      color: 'bg-green-500'
    }
  ];

  const quickActions = [
    {
      icon: UserCheck,
      label: 'Approve Members',
      count: statistics?.pendingApplications,
      color: 'bg-gradient-to-r from-upnd-red to-upnd-red-dark',
      onClick: () => {
        // Scroll to members section or show members management
        const membersSection = document.getElementById('members-section');
        if (membersSection) {
          membersSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      icon: Users,
      label: 'View All Members',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      onClick: () => {
        // Scroll to members section
        const membersSection = document.getElementById('members-section');
        if (membersSection) {
          membersSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      icon: Calendar,
      label: 'Manage Events',
      color: 'bg-gradient-to-r from-upnd-yellow to-upnd-yellow-dark',
      onClick: () => {
        // Scroll to events section
        const eventsSection = document.getElementById('events-section');
        if (eventsSection) {
          eventsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      icon: FileText,
      label: 'Generate Reports',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      onClick: () => {
        // Scroll to reports section
        const reportsSection = document.getElementById('reports-section');
        if (reportsSection) {
          reportsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      icon: AlertTriangle,
      label: 'Disciplinary Cases',
      count: activeCases,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      onClick: () => {
        // Scroll to disciplinary section
        const disciplinarySection = document.getElementById('disciplinary-section');
        if (disciplinarySection) {
          disciplinarySection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      icon: Settings,
      label: 'System Settings',
      color: 'bg-gradient-to-r from-gray-500 to-gray-600',
      onClick: () => {
        // Scroll to settings section
        const settingsSection = document.getElementById('settings-section');
        if (settingsSection) {
          settingsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  ];
  const session_user = session?.user
  console.log(session_user)

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-upnd-black">
            Welcome back, {user?.name || 'Admin'}
          </h1>
          <p className="text-upnd-yellow font-medium">Unity, Work, Progress - Membership Overview</p>
        </div>
        <div className="flex items-center space-x-3">
          <DateRangeFilter
            onRangeChange={(range: { value: React.SetStateAction<string>; startDate: any; endDate: any; }) => {
              setSelectedDateRange(range.value);
              setDateRange({
                startDate: range.startDate,
                endDate: range.endDate
              });
            }}
            selectedRange={selectedDateRange}
          />
          <NotificationPanel
            notifications={notifications}
            onDismiss={handleDismissNotification}
            onMarkAllRead={handleMarkAllRead}
          />
          <ExportDashboard statistics={statistics!} members={members} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Members"
          value={statistics?.totalMembers || 0}
          icon={Users}
          color="bg-gradient-to-r from-upnd-red to-upnd-red-dark"
          trendValue={statistics?.totalMembers || 0}
          previousValue={130}
          onClick={() => {
            const membersSection = document.getElementById('members-section');
            if (membersSection) {
              membersSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
        <StatsCard
          title="Pending Applications"
          value={statistics?.pendingApplications || 0}
          icon={Clock}
          color="bg-gradient-to-r from-upnd-yellow to-upnd-yellow-dark"
          trendValue={statistics?.pendingApplications || 0}
          previousValue={35}
          onClick={() => {
            const membersSection = document.getElementById('members-section');
            if (membersSection) {
              membersSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
        <StatsCard
          title="Approved Members"
          value={statistics?.approvedMembers || 0}
          icon={CheckCircle}
          color="bg-gradient-to-r from-green-500 to-green-600"
          trendValue={statistics?.approvedMembers || 0}
          previousValue={70}
          onClick={() => {
            const membersSection = document.getElementById('members-section');
            if (membersSection) {
              membersSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
        <StatsCard
          title="Active Cases"
          value={activeCases}
          icon={AlertTriangle}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          trend={activeCases > 0 ? `${activeCases} pending` : 'All resolved'}
          onClick={() => {
            const disciplinarySection = document.getElementById('disciplinary-section');
            if (disciplinarySection) {
              disciplinarySection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      </div>

      <QuickActions actions={quickActions} />

      <div id="reports-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Provincial Distribution"
          data={statistics?.provincialDistribution || {}}
          type="bar"
          onDataPointClick={(province, count) => console.log(`View ${province}: ${count} members`)}
        />
        <ChartCard
          title="Monthly Registration Trends"
          data={statistics?.monthlyTrends || []}
          type="line"
          onDataPointClick={(month, count) => console.log(`View ${month}: ${count} registrations`)}
        />
      </div>

      <div id="disciplinary-section">
        <ApprovalFunnel stages={funnelStages} totalApplications={statistics?.totalMembers || 0} />
      </div>

      {/* Events Section */}
      <div id="events-section" className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-yellow">
        <h3 className="text-lg font-semibold text-upnd-black mb-4">Upcoming Events</h3>
        <p className="text-gray-600">Event management functionality will be available here.</p>
      </div>

      {/* Settings Section */}
      <div id="settings-section" className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-500">
        <h3 className="text-lg font-semibold text-upnd-black mb-4">System Settings</h3>
        <p className="text-gray-600">System configuration and settings will be available here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-red hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Membership Growth</h3>
              <p className="text-3xl font-bold text-upnd-red mt-2">
                +{(((statistics?.totalMembers || 0) - 130) / 130 * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">vs last period</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-upnd-red to-upnd-red-dark rounded-full flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-yellow hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Approval Rate</h3>
              <p className="text-3xl font-bold text-upnd-yellow mt-2">
                {((statistics?.approvedMembers || 0) / (statistics?.totalMembers || 1) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Applications approved</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-upnd-yellow to-upnd-yellow-dark rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Active Provinces</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {Object.keys(statistics?.provincialDistribution || {}).length}
              </p>
              <p className="text-sm text-gray-600">of 10 provinces</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <Award className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div id="members-section">
        <RecentActivity members={members} />
      </div>

      {/* UPND Values Section */}
      <div className="bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-xl p-8 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Unity</h3>
              <p className="text-white/90 text-sm">Bringing together all Zambians regardless of background</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Work</h3>
              <p className="text-white/90 text-sm">Promoting hard work and sustainable development</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Progress</h3>
              <p className="text-white/90 text-sm">Advancing progressive policies for transformation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}