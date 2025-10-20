import React, { useState } from 'react';
import { useDisciplinary } from '../../hooks/useDisciplinary';
import { useAuth } from '../../context/AuthContext';
import { DisciplinaryCard } from './DisciplinaryCard';
import { DisciplinaryModal } from './DisciplinaryModal';
import { NewCaseModal } from './NewCaseModal';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Shield,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { DisciplinaryCase } from '../../types';

export function DisciplinaryManagement() {
  const { cases, addCase, updateCase, loading } = useDisciplinary();
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<DisciplinaryCase | null>(null);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.violationType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || case_.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || case_.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const caseStats = {
    total: cases.length,
    active: cases.filter(c => c.status === 'Active').length,
    underReview: cases.filter(c => c.status === 'Under Review').length,
    resolved: cases.filter(c => c.status === 'Resolved').length,
    appealed: cases.filter(c => c.status === 'Appealed').length,
    high: cases.filter(c => c.severity === 'High').length,
    medium: cases.filter(c => c.severity === 'Medium').length,
    low: cases.filter(c => c.severity === 'Low').length
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-upnd-black">UPND Disciplinary Management</h1>
          <p className="text-upnd-yellow font-medium">Unity, Work, Progress - Maintain Party Standards</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasPermission('manage_disciplinary') && (
            <button
              onClick={() => setShowNewCaseModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>New Case</span>
            </button>
          )}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-upnd-red to-upnd-yellow px-4 py-2 rounded-lg">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
              alt="UPND Logo"
              className="w-6 h-6 object-contain"
            />
            <span className="text-white font-semibold">{cases.length} Total Cases</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Active Cases</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">{caseStats.active}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-yellow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Under Review</h3>
              <p className="text-3xl font-bold text-upnd-yellow mt-2">{caseStats.underReview}</p>
            </div>
            <Clock className="w-8 h-8 text-upnd-yellow" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Resolved</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{caseStats.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">High Priority</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">{caseStats.high}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Appealed">Appealed</option>
            </select>
          </div>

          <div className="relative">
            <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent appearance-none"
            >
              <option value="all">All Severities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* UPND Disciplinary Guidelines */}
      <div className="bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">UPND Disciplinary Principles</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Unity</h4>
            <p className="text-sm text-white/90">Maintaining party unity and cohesion through fair disciplinary processes</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Work</h4>
            <p className="text-sm text-white/90">Ensuring all members contribute positively to party objectives</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Progress</h4>
            <p className="text-sm text-white/90">Progressive discipline that promotes growth and improvement</p>
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCases.map((case_) => (
          <DisciplinaryCard
            key={case_.id}
            case={case_}
            onViewDetails={() => setSelectedCase(case_)}
            onUpdateCase={updateCase}
          />
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No disciplinary cases found</h3>
          <p className="text-gray-400">
            {cases.length === 0 
              ? 'No disciplinary cases have been reported yet'
              : 'Try adjusting your search criteria'
            }
          </p>
        </div>
      )}

      {/* Modals */}
      {selectedCase && (
        <DisciplinaryModal
          case={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdateCase={updateCase}
        />
      )}

      {showNewCaseModal && (
        <NewCaseModal
          onClose={() => setShowNewCaseModal(false)}
          onCreateCase={addCase}
        />
      )}
    </div>
  );
}