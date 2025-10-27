import { DateRangeFilter } from "@/app/dashboard/DateRangeFilter";
import { ExportDashboard } from "@/app/dashboard/ExportDashboard";
import { NotificationPanel } from "@/app/dashboard/NotificationPanel";
import { useAuth } from "@/context/AuthContext";
import { useMembers } from "@/hooks/useMembers";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Header(){
  const [selectedDateRange, setSelectedDateRange] = useState('last30');
    const { members, statistics, loading } = useMembers();
        const { data: session } = useSession(); 
        const user = session?.user;
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

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

    return <div>
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
      </div></div>
}