"use client"

import React, { useState } from 'react';
import { ReportCard } from './ReportCard';
import { ExportModal } from './ExportModal';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Users, 
  MapPin, 
  Calendar,
  Shield,
  TrendingUp,
  AlertTriangle,
  PieChart
} from 'lucide-react';
import { useMembers } from '@/hooks/useMembers';
import { useDisciplinary } from '@/hooks/useDisciplinary';
import { useAuth } from '@/context/AuthContext';

export default function Reports() {
  const { members, statistics, loading } = useMembers();
  const { cases } = useDisciplinary();
  const { user, hasPermission } = useAuth();
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>('');

  const reportCategories = [
    {
      title: 'Membership Reports',
      icon: Users,
      color: 'bg-upnd-red',
      reports: [
        {
          id: 'membership-overview',
          title: 'UPND Membership Overview',
          description: 'Complete overview of all UPND members across Zambia',
          icon: Users,
          data: {
            totalRecords: members.length,
            lastUpdated: new Date().toLocaleDateString()
          }
        },
        {
          id: 'membership-growth',
          title: 'Membership Growth Analysis',
          description: 'Track UPND membership growth trends over time',
          icon: TrendingUp,
          data: {
            totalRecords: statistics?.monthlyTrends?.length || 0,
            lastUpdated: new Date().toLocaleDateString()
          }
        },
        {
          id: 'pending-applications',
          title: 'Pending Applications Report',
          description: 'All pending UPND membership applications requiring review',
          icon: Calendar,
          data: {
            totalRecords: statistics?.pendingApplications || 0,
            lastUpdated: new Date().toLocaleDateString()
          }
        }
      ]
    },
    {
      title: 'Geographic Reports',
      icon: MapPin,
      color: 'bg-upnd-yellow',
      reports: [
        {
          id: 'provincial-distribution',
          title: 'Provincial Distribution',
          description: 'UPND membership distribution across all 10 provinces',
          icon: MapPin,
          data: {
            totalRecords: Object.keys(statistics?.provincialDistribution || {}).length,
            lastUpdated: new Date().toLocaleDateString()
          }
        },
        {
          id: 'district-analysis',
          title: 'District-Level Analysis',
          description: 'Detailed breakdown by districts within provinces',
          icon: BarChart3,
          data: {
            totalRecords: members.length,
            lastUpdated: new Date().toLocaleDateString()
          }
        },
        {
          id: 'constituency-mapping',
          title: 'Constituency Mapping',
          description: 'UPND presence across all 156 constituencies',
          icon: PieChart,
          data: {
            totalRecords: new Set(members.map(m => m.jurisdiction.constituency)).size,
            lastUpdated: new Date().toLocaleDateString()
          }
        }
      ]
    },
    {
      title: 'Administrative Reports',
      icon: Shield,
      color: 'bg-green-600',
      reports: [
        {
          id: 'approval-workflow',
          title: 'Approval Workflow Report',
          description: 'Status of applications in the UPND approval process',
          icon: Shield,
          data: {
            totalRecords: members.filter(m => m.status.includes('Pending')).length,
            lastUpdated: new Date().toLocaleDateString()
          }
        },
        {
          id: 'user-activity',
          title: 'Admin User Activity',
          description: 'Activity report for UPND administrative users',
          icon: Users,
          data: {
            totalRecords: 1, // Mock data
            lastUpdated: new Date().toLocaleDateString()
          }
        },
        {
          id: 'system-performance',
          title: 'System Performance Report',
          description: 'Platform performance and usage statistics',
          icon: TrendingUp,
          data: {
            totalRecords: 1, // Mock data
            lastUpdated: new Date().toLocaleDateString()
          }
        }
      ]
    },
    {
      title: 'Disciplinary Reports',
      icon: AlertTriangle,
      color: 'bg-orange-600',
      reports: [
        {
          id: 'disciplinary-overview',
          title: 'Disciplinary Cases Overview',
          description: 'Summary of all UPND disciplinary cases and resolutions',
          icon: AlertTriangle,
          data: {
            totalRecords: cases.length,
            lastUpdated: new Date().toLocaleDateString()
          }
        },
        {
          id: 'violation-analysis',
          title: 'Violation Type Analysis',
          description: 'Breakdown of violation types and frequency',
          icon: BarChart3,
          data: {
            totalRecords: cases.length,
            lastUpdated: new Date().toLocaleDateString()
          }
        },
        {
          id: 'case-resolution',
          title: 'Case Resolution Report',
          description: 'Status and resolution timeline for disciplinary cases',
          icon: FileText,
          data: {
            totalRecords: cases.filter(c => c.status === 'Resolved').length,
            lastUpdated: new Date().toLocaleDateString()
          }
        }
      ]
    }
  ];

  const handleExportReport = (reportId: string) => {
    setSelectedReport(reportId);
    setShowExportModal(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-upnd-black">UPND Reports & Analytics</h1>
          <p className="text-upnd-yellow font-medium">Unity, Work, Progress - Data-Driven Insights</p>
        </div>
        <div className="flex items-center space-x-3 bg-gradient-to-r from-upnd-red to-upnd-yellow px-4 py-2 rounded-lg">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
            alt="UPND Logo"
            className="w-6 h-6 object-contain"
          />
          <span className="text-white font-semibold">Analytics Dashboard</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-red">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Total Reports</h3>
              <p className="text-3xl font-bold text-upnd-red mt-2">
                {reportCategories.reduce((acc, cat) => acc + cat.reports.length, 0)}
              </p>
            </div>
            <FileText className="w-8 h-8 text-upnd-red" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-yellow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Data Points</h3>
              <p className="text-3xl font-bold text-upnd-yellow mt-2">{members.length.toLocaleString()}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-upnd-yellow" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Provinces Covered</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">10</p>
            </div>
            <MapPin className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Export Formats</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">4</p>
            </div>
            <Download className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* UPND Analytics Overview */}
      <div className="bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">UPND Data Analytics</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Unity</h4>
            <p className="text-sm text-white/90">Comprehensive data across all regions and demographics</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Work</h4>
            <p className="text-sm text-white/90">Actionable insights for strategic planning and operations</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Progress</h4>
            <p className="text-sm text-white/90">Track growth and measure success across all metrics</p>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      {reportCategories.map((category, categoryIndex) => {
        const IconComponent = category.icon;
        return (
          <div key={categoryIndex} className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-upnd-black">{category.title}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onExport={() => handleExportReport(report.id)}
                  canExport={hasPermission('export_data')}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          reportId={selectedReport}
          reportTitle={reportCategories
            .flatMap(cat => cat.reports)
            .find(r => r.id === selectedReport)?.title || ''}
          onClose={() => {
            setShowExportModal(false);
            setSelectedReport('');
          }}
        />
      )}
    </div>
  );
}