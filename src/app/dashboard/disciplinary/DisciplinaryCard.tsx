import React from 'react';
import { DisciplinaryCase } from '../../types';
import { 
  AlertTriangle, 
  Clock, 
  User, 
  Calendar, 
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface DisciplinaryCardProps {
  case: DisciplinaryCase;
  onViewDetails: () => void;
  onUpdateCase: (caseId: string, updates: Partial<DisciplinaryCase>) => void;
}

export function DisciplinaryCard({ case: disciplinaryCase, onViewDetails, onUpdateCase }: DisciplinaryCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Under Review':
        return 'text-upnd-yellow bg-upnd-yellow/10 border-upnd-yellow/20';
      case 'Resolved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Appealed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Appealed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const daysSinceReported = Math.floor(
    (new Date().getTime() - new Date(disciplinaryCase.dateReported).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border-l-4 border-upnd-red">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-upnd-black">{disciplinaryCase.caseNumber}</h3>
            <p className="text-sm text-gray-600">{disciplinaryCase.memberName}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium border rounded-full ${getSeverityColor(disciplinaryCase.severity)}`}>
            <AlertTriangle className="w-3 h-3" />
            <span>{disciplinaryCase.severity}</span>
          </div>
          <div className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium border rounded-full ${getStatusColor(disciplinaryCase.status)}`}>
            {getStatusIcon(disciplinaryCase.status)}
            <span>{disciplinaryCase.status}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>Member ID: {disciplinaryCase.memberId}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <AlertTriangle className="w-4 h-4" />
          <span>Violation: {disciplinaryCase.violationType}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Reported: {new Date(disciplinaryCase.dateReported).toLocaleDateString()}</span>
          <span className="text-xs text-gray-500">({daysSinceReported} days ago)</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>Officer: {disciplinaryCase.reportingOfficer}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <h4 className="text-sm font-semibold text-upnd-black mb-2">Case Description</h4>
        <p className="text-sm text-gray-700 line-clamp-3">{disciplinaryCase.description}</p>
      </div>

      {disciplinaryCase.assignedOfficer && (
        <div className="bg-upnd-yellow/10 border border-upnd-yellow/20 rounded-lg p-3 mb-4">
          <div className="text-xs font-semibold text-upnd-red mb-1">Assigned Officer</div>
          <div className="text-sm font-medium text-upnd-black">{disciplinaryCase.assignedOfficer}</div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={onViewDetails}
          className="flex items-center space-x-2 px-4 py-2 bg-upnd-red text-white rounded-lg hover:bg-upnd-red-dark transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>

        {disciplinaryCase.status === 'Active' && (
          <div className="flex space-x-2">
            <button
              onClick={() => onUpdateCase(disciplinaryCase.id, { status: 'Under Review' })}
              className="px-3 py-2 bg-upnd-yellow text-white rounded-lg hover:bg-upnd-yellow-dark transition-colors text-sm"
            >
              Review
            </button>
            <button
              onClick={() => onUpdateCase(disciplinaryCase.id, { status: 'Resolved' })}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Resolve
            </button>
          </div>
        )}
      </div>

      {daysSinceReported > 14 && disciplinaryCase.status !== 'Resolved' && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600 font-medium">
            ⚠️ Case has been open for {daysSinceReported} days - requires attention
          </p>
        </div>
      )}
    </div>
  );
}