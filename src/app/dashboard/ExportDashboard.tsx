import React, { useState } from 'react';
import { Download, FileText, X } from 'lucide-react';
import { Statistics, UPNDMember } from '../../types';

interface ExportDashboardProps {
  statistics: Statistics;
  members: UPNDMember[];
}

export function ExportDashboard({ statistics, members }: ExportDashboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'pdf'>('csv');

  const exportToCSV = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Members', statistics.totalMembers.toString()],
      ['Pending Applications', statistics.pendingApplications.toString()],
      ['Approved Members', statistics.approvedMembers.toString()],
      ['Rejected Applications', statistics.rejectedApplications.toString()],
      ['Suspended Members', statistics.suspendedMembers.toString()],
      ['', ''],
      ['Provincial Distribution', ''],
      ...Object.entries(statistics.provincialDistribution).map(([province, count]) => [province, count.toString()]),
      ['', ''],
      ['Monthly Trends', ''],
      ...statistics.monthlyTrends.map(trend => [trend.month, trend.registrations.toString()])
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    downloadFile(csvContent, 'upnd-dashboard-report.csv', 'text/csv');
  };

  const exportToJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      statistics,
      summary: {
        totalMembers: statistics.totalMembers,
        pendingApplications: statistics.pendingApplications,
        approvedMembers: statistics.approvedMembers,
        rejectedApplications: statistics.rejectedApplications,
        suspendedMembers: statistics.suspendedMembers
      },
      provincialDistribution: statistics.provincialDistribution,
      monthlyTrends: statistics.monthlyTrends,
      statusDistribution: statistics.statusDistribution
    };

    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'upnd-dashboard-report.json', 'application/json');
  };

  const exportToPDF = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>UPND Dashboard Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #DC2626; }
          h2 { color: #F59E0B; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #DC2626; color: white; }
          .metric { font-size: 24px; font-weight: bold; color: #DC2626; }
          .label { color: #666; }
        </style>
      </head>
      <body>
        <h1>UPND Membership Dashboard Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>

        <h2>Key Metrics</h2>
        <table>
          <tr><td class="label">Total Members</td><td class="metric">${statistics.totalMembers}</td></tr>
          <tr><td class="label">Pending Applications</td><td class="metric">${statistics.pendingApplications}</td></tr>
          <tr><td class="label">Approved Members</td><td class="metric">${statistics.approvedMembers}</td></tr>
          <tr><td class="label">Rejected Applications</td><td class="metric">${statistics.rejectedApplications}</td></tr>
          <tr><td class="label">Suspended Members</td><td class="metric">${statistics.suspendedMembers}</td></tr>
        </table>

        <h2>Provincial Distribution</h2>
        <table>
          <thead>
            <tr><th>Province</th><th>Members</th></tr>
          </thead>
          <tbody>
            ${Object.entries(statistics.provincialDistribution)
              .map(([province, count]) => `<tr><td>${province}</td><td>${count}</td></tr>`)
              .join('')}
          </tbody>
        </table>

        <h2>Monthly Registration Trends</h2>
        <table>
          <thead>
            <tr><th>Month</th><th>Registrations</th></tr>
          </thead>
          <tbody>
            ${statistics.monthlyTrends
              .map(trend => `<tr><td>${trend.month}</td><td>${trend.registrations}</td></tr>`)
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    downloadFile(htmlContent, 'upnd-dashboard-report.html', 'text/html');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const handleExport = () => {
    switch (selectedFormat) {
      case 'csv':
        exportToCSV();
        break;
      case 'json':
        exportToJSON();
        break;
      case 'pdf':
        exportToPDF();
        break;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white rounded-lg hover:shadow-lg transition-all duration-200"
      >
        <Download className="w-5 h-5" />
        <span className="font-medium">Export Report</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-upnd-black">Export Dashboard Report</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Export Format
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedFormat('csv')}
                      className={`w-full flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                        selectedFormat === 'csv'
                          ? 'border-upnd-red bg-upnd-red/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <FileText className={`w-5 h-5 ${selectedFormat === 'csv' ? 'text-upnd-red' : 'text-gray-600'}`} />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">CSV File</div>
                        <div className="text-xs text-gray-500">Compatible with Excel and spreadsheets</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedFormat('json')}
                      className={`w-full flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                        selectedFormat === 'json'
                          ? 'border-upnd-red bg-upnd-red/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <FileText className={`w-5 h-5 ${selectedFormat === 'json' ? 'text-upnd-red' : 'text-gray-600'}`} />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">JSON File</div>
                        <div className="text-xs text-gray-500">Structured data for developers</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedFormat('pdf')}
                      className={`w-full flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                        selectedFormat === 'pdf'
                          ? 'border-upnd-red bg-upnd-red/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <FileText className={`w-5 h-5 ${selectedFormat === 'pdf' ? 'text-upnd-red' : 'text-gray-600'}`} />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">HTML Report</div>
                        <div className="text-xs text-gray-500">Printable formatted report</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-upnd-yellow/10 border border-upnd-yellow/30 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    This report includes all dashboard statistics, provincial distribution, and monthly trends.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
