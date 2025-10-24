'use client'

import React, { useState } from 'react';
import { useMembers } from '../../hooks/useMembers';
import { useDisciplinary } from '../../hooks/useDisciplinary';
import { useAuth } from '../../context/AuthContext';
import { StatsCard } from './StatsCard';
import { ChartCard } from './ChartCard';
import { RecentActivity } from './RecentActivity';
import { ApprovalFunnel } from './ApprovalFunnel';
import { QuickActions } from './QuickActions';
import { NotificationPanel } from './NotificationPanel';
import { DateRangeFilter } from './DateRangeFilter';
import { ExportDashboard } from './ExportDashboard';
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

export default function Dashboard() {
  const { members, statistics, loading } = useMembers();
  const { cases } = useDisciplinary();
  const { user, hasPermission } = useAuth();
  const {data: session} = useSession()
  const [selectedDateRange, setSelectedDateRange] = useState('last30');
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
      onClick: () => console.log('Navigate to approvals')
    },
    {
      icon: Users,
      label: 'View All Members',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      onClick: () => console.log('Navigate to members')
    },
    {
      icon: Calendar,
      label: 'Manage Events',
      color: 'bg-gradient-to-r from-upnd-yellow to-upnd-yellow-dark',
      onClick: () => console.log('Navigate to events')
    },
    {
      icon: FileText,
      label: 'Generate Reports',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      onClick: () => console.log('Navigate to reports')
    },
    {
      icon: AlertTriangle,
      label: 'Disciplinary Cases',
      count: activeCases,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      onClick: () => console.log('Navigate to disciplinary')
    },
    {
      icon: Settings,
      label: 'System Settings',
      color: 'bg-gradient-to-r from-gray-500 to-gray-600',
      onClick: () => console.log('Navigate to settings')
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
            onRangeChange={(range) => setSelectedDateRange(range.value)}
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
          onClick={() => console.log('View all members')}
        />
        <StatsCard
          title="Pending Applications"
          value={statistics?.pendingApplications || 0}
          icon={Clock}
          color="bg-gradient-to-r from-upnd-yellow to-upnd-yellow-dark"
          trendValue={statistics?.pendingApplications || 0}
          previousValue={35}
          onClick={() => console.log('View pending')}
        />
        <StatsCard
          title="Approved Members"
          value={statistics?.approvedMembers || 0}
          icon={CheckCircle}
          color="bg-gradient-to-r from-green-500 to-green-600"
          trendValue={statistics?.approvedMembers || 0}
          previousValue={70}
          onClick={() => console.log('View approved')}
        />
        <StatsCard
          title="Active Cases"
          value={activeCases}
          icon={AlertTriangle}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          trend={activeCases > 0 ? `${activeCases} pending` : 'All resolved'}
          onClick={() => console.log('View cases')}
        />
      </div>

      <QuickActions actions={quickActions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      <ApprovalFunnel stages={funnelStages} totalApplications={statistics?.totalMembers || 0} />

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
      <RecentActivity members={members} />

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