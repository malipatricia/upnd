import React from 'react';
import { LucideIcon, Download, Eye, Calendar } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  data: {
    totalRecords: number;
    lastUpdated: string;
  };
}

interface ReportCardProps {
  report: Report;
  onExport: () => void;
  canExport: boolean;
}

export function ReportCard({ report, onExport, canExport }: ReportCardProps) {
  const IconComponent = report.icon;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border-l-4 border-upnd-red">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-full flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-upnd-black">{report.title}</h3>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{report.description}</p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Total Records:</span>
          <span className="font-semibold text-upnd-black">{report.data.totalRecords.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Last Updated:</span>
          <span className="font-medium text-gray-700">{report.data.lastUpdated}</span>
        </div>
      </div>

      <div className="bg-upnd-yellow/10 border border-upnd-yellow/20 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-upnd-yellow" />
          <span className="text-sm font-medium text-upnd-black">UPND Official Report</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">Unity, Work, Progress - Data Analytics</p>
      </div>

      <div className="flex space-x-2">
        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-upnd-red text-white rounded-lg hover:bg-upnd-red-dark transition-colors text-sm font-medium">
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </button>
        
        {canExport && (
          <button
            onClick={onExport}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-upnd-yellow text-white rounded-lg hover:bg-upnd-yellow-dark transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500 text-center">
        Report ID: {report.id}
      </div>
    </div>
  );
}