import React, { useState } from 'react';
import { X, Download, FileText, Shield, CheckCircle } from 'lucide-react';

interface ExportModalProps {
  reportId: string;
  reportTitle: string;
  onClose: () => void;
}

export function ExportModal({ reportId, reportTitle, onClose }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf' | 'json'>('csv');
  const [dateRange, setDateRange] = useState<'all' | 'last30' | 'last90' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const exportFormats = [
    { value: 'csv', label: 'CSV', description: 'Comma-separated values for spreadsheet applications' },
    { value: 'excel', label: 'Excel', description: 'Microsoft Excel format with formatting' },
    { value: 'pdf', label: 'PDF', description: 'Formatted report document for printing' },
    { value: 'json', label: 'JSON', description: 'Structured data format for developers' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time', description: 'Export all available data' },
    { value: 'last30', label: 'Last 30 Days', description: 'Data from the past month' },
    { value: 'last90', label: 'Last 90 Days', description: 'Data from the past quarter' },
    { value: 'custom', label: 'Custom Range', description: 'Specify your own date range' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsExporting(false);
    setExportComplete(true);
  };

  const handleDownload = () => {
    // Simulate download
    const filename = `UPND_${reportId}_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
    const link = document.createElement('a');
    link.href = '#';
    link.download = filename;
    link.click();
  };

  if (exportComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-upnd-black mb-2">Export Complete!</h2>
            <p className="text-gray-600 mb-6">
              Your UPND report has been generated and is ready for download.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                <Download className="w-5 h-5" />
                <span>Download Report</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
              alt="UPND Logo"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h2 className="text-xl font-bold">Export UPND Report</h2>
              <p className="text-white/90 text-sm">Unity, Work, Progress - Data Export</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Information */}
          <div className="bg-upnd-red/5 border border-upnd-red/20 rounded-lg p-4">
            <h3 className="font-semibold text-upnd-black mb-2">Report Details</h3>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Title:</span> {reportTitle}</div>
              <div><span className="font-medium">Report ID:</span> {reportId}</div>
              <div><span className="font-medium">Generated:</span> {new Date().toLocaleString()}</div>
            </div>
          </div>

          {/* Export Format Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-upnd-black">Export Format</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exportFormats.map((format) => (
                <div
                  key={format.value}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    exportFormat === format.value
                      ? 'border-upnd-red bg-upnd-red/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setExportFormat(format.value as any)}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-upnd-red" />
                    <div>
                      <h4 className="font-semibold text-upnd-black">{format.label}</h4>
                      <p className="text-sm text-gray-600">{format.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-upnd-black">Date Range</h3>
            
            <div className="space-y-3">
              {dateRangeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    dateRange === option.value
                      ? 'border-upnd-yellow bg-upnd-yellow/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setDateRange(option.value as any)}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={dateRange === option.value}
                      onChange={() => setDateRange(option.value as any)}
                      className="w-4 h-4 text-upnd-yellow"
                    />
                    <div>
                      <h4 className="font-medium text-upnd-black">{option.label}</h4>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Export Options */}
          <div className="bg-upnd-yellow/10 border border-upnd-yellow/20 rounded-lg p-4">
            <h4 className="font-semibold text-upnd-black mb-2">Export Features</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• UPND official branding and headers</li>
              <li>• Complete data integrity and accuracy</li>
              <li>• Secure export with audit logging</li>
              <li>• Compatible with standard office applications</li>
              <li>• Includes Unity, Work, Progress metadata</li>
            </ul>
          </div>

          {isExporting && (
            <div className="text-center py-8">
              <div className="inline-flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-upnd-red"></div>
                <span className="text-lg font-medium text-upnd-black">Generating UPND report...</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">This may take a few moments</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isExporting && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleExport}
              disabled={dateRange === 'custom' && (!customStartDate || !customEndDate)}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              <span>Export Report</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}