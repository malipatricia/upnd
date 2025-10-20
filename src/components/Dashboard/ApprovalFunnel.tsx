import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface ApprovalFunnelProps {
  stages: FunnelStage[];
  totalApplications: number;
}

export function ApprovalFunnel({ stages, totalApplications }: ApprovalFunnelProps) {
  const getStageIcon = (stageName: string) => {
    if (stageName.toLowerCase().includes('approved')) {
      return <CheckCircle className="w-4 h-4" />;
    }
    if (stageName.toLowerCase().includes('pending')) {
      return <Clock className="w-4 h-4" />;
    }
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-yellow">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-upnd-black">Approval Funnel</h3>
        <p className="text-sm text-gray-600">Member application progress through approval stages</p>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const maxWidth = 100;
          const minWidth = 20;
          const width = Math.max(minWidth, (stage.count / totalApplications) * maxWidth);

          return (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`${stage.color}`}>
                    {getStageIcon(stage.name)}
                  </span>
                  <span className="text-sm font-medium text-gray-700">{stage.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold text-upnd-black">
                    {stage.count}
                  </span>
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {stage.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${stage.color} bg-opacity-20 transition-all duration-700 ease-out flex items-center justify-end pr-3 group-hover:bg-opacity-30`}
                    style={{ width: `${width}%` }}
                  >
                    <span className="text-xs font-medium text-upnd-black opacity-0 group-hover:opacity-100 transition-opacity">
                      {stage.count} members
                    </span>
                  </div>
                </div>

                {index < stages.length - 1 && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                    <div className="w-0.5 h-4 bg-gray-300"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Conversion Rate (Applied → Approved)</span>
          <span className="font-semibold text-green-600">
            {((stages.find(s => s.name.toLowerCase().includes('approved'))?.count || 0) / totalApplications * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
