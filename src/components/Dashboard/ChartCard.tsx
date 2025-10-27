import React, { useState, useEffect, useRef } from 'react';
import { Info, Download, ChevronDown } from 'lucide-react';
import { exportToCSV, exportToJSON, exportToHTML, exportToPDF } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  data: any;
  type: 'bar' | 'line';
  onDataPointClick?: (key: string, value: number) => void;
}

export function ChartCard({ title, data, type, onDataPointClick }: ChartCardProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = (key: string, event: React.MouseEvent) => {
    setHoveredItem(key);
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleDownload = (format: 'csv' | 'json' | 'html' | 'pdf') => {
    const filename = `${title.toLowerCase().replace(/\s+/g, '-')}-report`;
    
    if (type === 'bar' && typeof data === 'object' && !Array.isArray(data)) {
      // Handle bar chart data (object with key-value pairs)
      switch (format) {
        case 'csv':
          exportToCSV(data, filename);
          break;
        case 'json':
          exportToJSON(data, filename);
          break;
        case 'html':
          exportToHTML(data, title, filename);
          break;
        case 'pdf':
          exportToPDF(data, title, filename);
          break;
      }
    } else if (type === 'line' && Array.isArray(data)) {
      // Handle line chart data (array of objects)
      switch (format) {
        case 'csv':
          exportToCSV(data, filename);
          break;
        case 'json':
          exportToJSON(data, filename);
          break;
        case 'html':
          exportToHTML(data, title, filename);
          break;
        case 'pdf':
          exportToPDF(data, title, filename);
          break;
      }
    }
    
    setShowDownloadMenu(false);
  };

  if (type === 'bar' && typeof data === 'object' && !Array.isArray(data)) {
    const maxValue = Math.max(...Object.values(data) as number[]);
    const sortedEntries = Object.entries(data).sort(([, a], [, b]) => (b as number) - (a as number));

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-red hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-upnd-black">{title}</h3>
          <div className="flex items-center space-x-2">
            <button
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Information"
            >
              <Info className="w-4 h-4 text-gray-500" />
            </button>
            <div className="relative">
              <button
                className="p-1 hover:bg-gray-100 rounded transition-colors flex items-center space-x-1"
                title="Export data"
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              >
                <Download className="w-4 h-4 text-gray-500" />
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>
              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleDownload('csv')}
                    >
                      Download as CSV
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleDownload('json')}
                    >
                      Download as JSON
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleDownload('html')}
                    >
                      Download as HTML
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleDownload('pdf')}
                    >
                      Download as PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedEntries.map(([key, value]) => {
            const percentage = ((value as number) / maxValue) * 100;
            const isHovered = hoveredItem === key;

            return (
              <div
                key={key}
                className="flex items-center space-x-3 group"
                onMouseEnter={(e) => handleMouseEnter(key, e)}
                onMouseLeave={handleMouseLeave}
                onClick={() => onDataPointClick?.(key, value as number)}
              >
                <div className="w-24 text-sm font-medium text-gray-700 truncate" title={key}>
                  {key}
                </div>
                <div className="flex-1 relative">
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHovered
                          ? 'bg-gradient-to-r from-upnd-red-dark to-upnd-yellow-dark'
                          : 'bg-gradient-to-r from-upnd-red to-upnd-yellow'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  {isHovered && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-upnd-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                      {key}: {value} members ({percentage.toFixed(1)}%)
                    </div>
                  )}
                </div>
                <div className="text-sm font-semibold text-upnd-black w-12 text-right">
                  {value as number}
                </div>
                <div className="text-xs text-gray-500 w-12 text-right">
                  {percentage.toFixed(0)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === 'line' && Array.isArray(data)) {
    const maxValue = Math.max(...data.map(item => item.registrations));

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-yellow hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-upnd-black">{title}</h3>
          <div className="flex items-center space-x-2">
            <button
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Information"
            >
              <Info className="w-4 h-4 text-gray-500" />
            </button>
            <div className="relative">
              <button
                className="p-1 hover:bg-gray-100 rounded transition-colors flex items-center space-x-1"
                title="Export data"
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              >
                <Download className="w-4 h-4 text-gray-500" />
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>
              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleDownload('csv')}
                    >
                      Download as CSV
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleDownload('json')}
                    >
                      Download as JSON
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleDownload('html')}
                    >
                      Download as HTML
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleDownload('pdf')}
                    >
                      Download as PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="flex items-end justify-between space-x-2 h-48 px-2 overflow-x-auto">
            {data.map((item, index) => {
              const height = (item.registrations / maxValue) * 100;
              const isHovered = hoveredItem === item.month;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center group relative min-w-[60px] flex-shrink-0"
                  onMouseEnter={(e) => handleMouseEnter(item.month, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => onDataPointClick?.(item.month, item.registrations)}
                >
                  <div className="relative w-full flex items-end justify-center">
                    <div
                      className={`w-full rounded-t transition-all duration-500 cursor-pointer ${
                        isHovered
                          ? 'bg-gradient-to-t from-upnd-red to-upnd-red-light'
                          : 'bg-gradient-to-t from-upnd-yellow to-upnd-yellow-light'
                      }`}
                      style={{
                        height: `${height}%`,
                        minHeight: '12px'
                      }}
                    >
                      {isHovered && (
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-upnd-black text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-10">
                          {item.month}: {item.registrations} registrations
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs font-medium text-gray-700 mt-3">{item.month}</div>
                  <div className={`text-xs font-semibold mt-1 transition-colors ${
                    isHovered ? 'text-upnd-red' : 'text-gray-500'
                  }`}>
                    {item.registrations}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-200 mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-300">
      <h3 className="text-lg font-semibold text-upnd-black mb-4">{title}</h3>
      <p className="text-gray-500">No data available</p>
    </div>
  );
}