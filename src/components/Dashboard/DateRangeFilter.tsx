import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateRange {
  label: string;
  value: string;
  startDate: Date;
  endDate: Date;
}

interface DateRangeFilterProps {
  onRangeChange: (range: DateRange) => void;
  selectedRange?: string;
}

export function DateRangeFilter({ onRangeChange, selectedRange = 'last30' }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getDateRanges = (): DateRange[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return [
      {
        label: 'Today',
        value: 'today',
        startDate: today,
        endDate: now
      },
      {
        label: 'Last 7 days',
        value: 'last7',
        startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        endDate: now
      },
      {
        label: 'Last 30 days',
        value: 'last30',
        startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        endDate: now
      },
      {
        label: 'Last 3 months',
        value: 'last90',
        startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
        endDate: now
      },
      {
        label: 'Last 6 months',
        value: 'last180',
        startDate: new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000),
        endDate: now
      },
      {
        label: 'This year',
        value: 'thisYear',
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: now
      },
      {
        label: 'All time',
        value: 'allTime',
        startDate: new Date(2020, 0, 1),
        endDate: now
      }
    ];
  };

  const ranges = getDateRanges();
  const currentRange = ranges.find(r => r.value === selectedRange) || ranges[2];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-upnd-red transition-colors"
      >
        <Calendar className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{currentRange.label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 border border-gray-200 overflow-hidden">
            {ranges.map((range) => (
              <button
                key={range.value}
                onClick={() => {
                  onRangeChange(range);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                  range.value === selectedRange
                    ? 'bg-upnd-red/10 text-upnd-red font-semibold'
                    : 'text-gray-700'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
