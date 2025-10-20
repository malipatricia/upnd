import React, { useState } from 'react';
import { UPNDMember } from '../../types';
import { Clock, CheckCircle, User, Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface RecentActivityProps {
  members: UPNDMember[];
}

export function RecentActivity({ members }: RecentActivityProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const filteredMembers = members.filter(member => {
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.membershipId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedMembers = filteredMembers
    .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());

  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const recentMembers = sortedMembers.slice(startIndex, startIndex + itemsPerPage);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-upnd-yellow" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-upnd-yellow bg-upnd-yellow/10 border-upnd-yellow/20';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-red">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-upnd-black">Recent UPND Member Activity</h2>
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedMembers.length)} of {sortedMembers.length}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-upnd-red focus:outline-none transition-colors"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-upnd-red focus:outline-none transition-colors"
          >
            <option value="all">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending Section Review">Pending Section</option>
            <option value="Pending Branch Review">Pending Branch</option>
            <option value="Pending Ward Review">Pending Ward</option>
            <option value="Pending District Review">Pending District</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {recentMembers.map((member) => (
          <div key={member.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-upnd-red-light rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-upnd-black">{member.fullName}</h3>
                <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getStatusColor(member.status)}`}>
                  {member.status}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span>ID: {member.membershipId}</span>
                <span>{member.jurisdiction.province} Province</span>
                <span>{new Date(member.registrationDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getStatusIcon(member.status)}
            </div>
          </div>
        ))}
      </div>
      
      {recentMembers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No members found</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-upnd-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                    currentPage === pageNum
                      ? 'bg-upnd-red text-white'
                      : 'border-2 border-gray-200 hover:border-upnd-red'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-upnd-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="text-sm font-medium">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}