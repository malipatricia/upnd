import React, { useState, useEffect } from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  trend?: string;
  trendValue?: number;
  previousValue?: number;
  onClick?: () => void;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendValue,
  previousValue,
  onClick
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const duration = 1000;
    const steps = 50;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const calculatedTrend = trendValue !== undefined && previousValue !== undefined
    ? ((trendValue - previousValue) / previousValue) * 100
    : null;

  const getTrendIcon = () => {
    if (calculatedTrend === null || calculatedTrend === 0) {
      return <Minus className="w-3 h-3" />;
    }
    return calculatedTrend > 0
      ? <TrendingUp className="w-3 h-3" />
      : <TrendingDown className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (calculatedTrend === null || calculatedTrend === 0) return 'text-gray-500';
    return calculatedTrend > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 border-l-4 border-upnd-red transform ${
        onClick ? 'cursor-pointer hover:scale-105 hover:shadow-2xl' : 'hover:shadow-xl'
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-upnd-black">
            {displayValue.toLocaleString()}
          </p>

          {(trend || calculatedTrend !== null) && (
            <div className="flex items-center space-x-1 mt-2">
              <span className={`flex items-center space-x-1 text-sm font-medium ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>
                  {calculatedTrend !== null
                    ? `${calculatedTrend > 0 ? '+' : ''}${calculatedTrend.toFixed(1)}%`
                    : trend
                  }
                </span>
              </span>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color} transition-transform duration-300 ${
          isHovered ? 'scale-110 rotate-6' : ''
        }`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
}