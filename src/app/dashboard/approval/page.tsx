"use client"

import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter, 
  Search, 
  Shield,
  Users,
  AlertTriangle
} from 'lucide-react';
import { useMembers } from '@/hooks/useMembers';
import { useAuth } from '@/context/AuthContext';
import { MembershipStatus, UPNDMember } from '@/types';
import { MemberCard } from '../members/MemberCard';
import { MemberModal } from '../members/MemberModal';

export default function MemberApproval() {
  const { members, updateMemberStatus, bulkApprove, loading } = useMembers();
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedMember, setSelectedMember] = useState<UPNDMember | null>(null);

  // Filter members based on user's jurisdiction and permissions
  const getFilteredMembers = () => {
    let filteredMembers = members;

    // Filter by jurisdiction based on user role
    if (user?.level !== 'National') {
      filteredMembers = members.filter(member => {
        switch (user?.level) {
          case 'Provincial':
            return member.jurisdiction.province === user.jurisdiction;
          case 'District':
            return member.jurisdiction.district === user.jurisdiction;
          case 'Branch':
            return member.jurisdiction.branch === user.jurisdiction;
          case 'Section':
            return member.jurisdiction.section === user.jurisdiction;
          default:
            return true;
        }
      });
    }

    // Filter by search term
    if (searchTerm) {
      filteredMembers = filteredMembers.filter(member =>
        member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.membershipId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.nrcNumber.includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter === 'pending') {
      filteredMembers = filteredMembers.filter(member => 
        member.status.includes('Pending')
      );
    } else if (statusFilter !== 'all') {
      filteredMembers = filteredMembers.filter(member => 
        member.status === statusFilter
      );
    }

    return filteredMembers;
  };

  const filteredMembers = getFilteredMembers();
  const pendingMembers = filteredMembers.filter(m => m.status.includes('Pending'));

  const handleBulkApprove = () => {
    if (selectedMembers.length > 0) {
      bulkApprove(selectedMembers);
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === pendingMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(pendingMembers.map(m => m.id));
    }
  };

  const getApprovalLevel = (status: MembershipStatus): string => {
    switch (status) {
      case 'Pending Section Review': return 'Section Level';
      case 'Pending Branch Review': return 'Branch Level';
      case 'Pending Ward Review': return 'Ward Level';
      case 'Pending District Review': return 'District Level';
      case 'Pending Provincial Review': return 'Provincial Level';
      default: return 'Final Review';
    }
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
          <h1 className="text-3xl font-bold text-upnd-black">UPND Member Approval</h1>
          <p className="text-upnd-yellow font-medium">Unity, Work, Progress - Review & Approve Applications</p>
        </div>
        <div className="flex items-center space-x-3 bg-gradient-to-r from-upnd-red to-upnd-yellow px-4 py-2 rounded-lg">
          <Shield className="w-5 h-5 text-white" />
          <span className="text-white font-semibold">{pendingMembers.length} Pending</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-yellow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Pending Review</h3>
              <p className="text-3xl font-bold text-upnd-yellow mt-2">{pendingMembers.length}</p>
            </div>
            <Clock className="w-8 h-8 text-upnd-yellow" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Approved Today</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {members.filter(m => 
                  m.status === 'Approved' && 
                  new Date(m.registrationDate).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Requires Attention</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {pendingMembers.filter(m => {
                  const daysSinceRegistration = Math.floor(
                    (new Date().getTime() - new Date(m.registrationDate).getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return daysSinceRegistration > 7;
                }).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-red">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Your Jurisdiction</h3>
              <p className="text-lg font-bold text-upnd-red mt-2">{user?.jurisdiction}</p>
              <p className="text-sm text-gray-600">{user?.level} Level</p>
            </div>
            <Users className="w-8 h-8 text-upnd-red" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent w-full md:w-64"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent appearance-none w-full md:w-48"
              >
                <option value="pending">Pending Review</option>
                <option value="all">All Applications</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {selectedMembers.length > 0 && hasPermission('approve_members') && (
            <div className="flex space-x-3">
              <button
                onClick={handleBulkApprove}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve Selected ({selectedMembers.length})</span>
              </button>
              <button
                onClick={() => setSelectedMembers([])}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {pendingMembers.length > 0 && hasPermission('approve_members') && (
          <div className="mt-4 flex items-center space-x-3">
            <input
              type="checkbox"
              id="selectAll"
              checked={selectedMembers.length === pendingMembers.length}
              onChange={handleSelectAll}
              className="w-4 h-4 text-upnd-red border-gray-300 rounded focus:ring-upnd-red"
            />
            <label htmlFor="selectAll" className="text-sm font-medium text-gray-700">
              Select all pending applications
            </label>
          </div>
        )}
      </div>

      {/* Approval Workflow Guide */}
      <div className="bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">UPND Approval Process</h3>
        <div className="grid md:grid-cols-6 gap-4 text-center">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-sm font-semibold">Step 1</div>
            <div className="text-xs mt-1">Section Review</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-sm font-semibold">Step 2</div>
            <div className="text-xs mt-1">Branch Review</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-sm font-semibold">Step 3</div>
            <div className="text-xs mt-1">Ward Review</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-sm font-semibold">Step 4</div>
            <div className="text-xs mt-1">District Review</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-sm font-semibold">Step 5</div>
            <div className="text-xs mt-1">Provincial Review</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-sm font-semibold">Step 6</div>
            <div className="text-xs mt-1">Final Approval</div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="relative">
            {hasPermission('approve_members') && member.status.includes('Pending') && (
              <div className="absolute top-4 left-4 z-10">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member.id)}
                  onChange={() => handleSelectMember(member.id)}
                  className="w-5 h-5 text-upnd-red border-gray-300 rounded focus:ring-upnd-red"
                />
              </div>
            )}
            <div className="pl-8">
              <MemberCard
                member={member}
                onViewDetails={() => setSelectedMember(member)}
                onUpdateStatus={updateMemberStatus}
              />
              <div className="mt-2 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-upnd-yellow/10 text-upnd-yellow border border-upnd-yellow/20">
                  {getApprovalLevel(member.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No applications found</h3>
          <p className="text-gray-400">
            {statusFilter === 'pending' 
              ? 'All applications in your jurisdiction have been processed'
              : 'Try adjusting your search criteria'
            }
          </p>
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onUpdateStatus={updateMemberStatus}
        />
      )}
    </div>
  );
}