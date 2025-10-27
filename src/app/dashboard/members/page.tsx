"use client"

import React, { useState } from 'react';
import { Search, Filter, Users, Shield } from 'lucide-react';
import { useMembers } from '@/hooks/useMembers';
import { UPNDMember } from '@/types';
import { MemberModal } from './MemberModal';
import { MemberCard } from './MemberCard';

export default function MembersList() {
  const { members, updateMemberStatus, loading } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<UPNDMember | null>(null);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.membershipId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.nrcNumber.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: members.length,
    approved: members.filter(m => m.status === 'Approved').length,
    pending: members.filter(m => m.status.includes('Pending')).length,
    rejected: members.filter(m => m.status === 'Rejected').length
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
          <h1 className="text-3xl font-bold text-upnd-black">UPND Members</h1>
          <p className="text-upnd-yellow font-medium">Unity, Work, Progress - Member Directory</p>
        </div>
        <div className="flex items-center space-x-3 bg-gradient-to-r from-upnd-red to-upnd-yellow px-4 py-2 rounded-lg">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
            alt="UPND Logo"
            className="w-6 h-6 object-contain"
          />
          <span className="text-white font-semibold">{members.length} Total Members</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search members..."
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
              <option value="all">All Members ({statusCounts.all})</option>
              <option value="Approved">Approved ({statusCounts.approved})</option>
              <option value="Pending Section Review">Pending Review ({statusCounts.pending})</option>
              <option value="Rejected">Rejected ({statusCounts.rejected})</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-upnd-red-light/10 border border-upnd-red-light/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-upnd-red">{statusCounts.all}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-upnd-yellow/10 border border-upnd-yellow/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-upnd-yellow">{statusCounts.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMembers.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onViewDetails={() => setSelectedMember(member)}
            onUpdateStatus={updateMemberStatus}
          />
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No members found</h3>
          <p className="text-gray-400">Try adjusting your search criteria</p>
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