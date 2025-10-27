import React from 'react';
import { UserCheck, Users, FileText, Calendar, Settings, Download } from 'lucide-react';

interface QuickAction {
  icon: React.ElementType;
  label: string;
  count?: number;
  color: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-red">
      <h3 className="text-lg font-semibold text-upnd-black mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-upnd-red hover:bg-upnd-red/5 transition-all duration-200 group"
            >
              <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center group-hover:text-upnd-red">
                {action.label}
              </span>
              {action.count !== undefined && (
                <span className="text-xs text-upnd-red font-semibold mt-1">
                  {action.count} pending
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
