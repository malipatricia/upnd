'use client'

import React, { useState } from 'react';
import { CardGenerationModal } from './CardGenerationModal';
import {
  CreditCard,
  Download,
  Search,
  Filter,
  Shield,
  Users,
  Printer,
  Plus,
  CheckCircle
} from 'lucide-react';
import { useMembers } from '@/hooks/useMembers';
import { useAuth } from '@/context/AuthContext';
import { UPNDMember } from '@/types';
import { MembershipCard } from './MembershipCard';

export default function MembershipCards() {
  const { members, loading } = useMembers();
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [cardTypeFilter, setCardTypeFilter] = useState<string>('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter approved members only
  const approvedMembers = members.filter(member => member.status === 'Approved');

  const filteredMembers = approvedMembers.filter(member => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.membershipId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For now, all cards are standard type - can be extended later
    return matchesSearch;
  });

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(m => m.id));
    }
  };

  const handleBulkGenerate = () => {
    if (selectedMembers.length > 0) {
      setShowGenerationModal(true);
    }
  };

  const handleSingleGenerate = (member: UPNDMember) => {
    setSuccessMessage(`Card generated successfully for ${member.fullName}`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handlePreview = (member: UPNDMember) => {
    console.log('Preview card for:', member.fullName);
  };

  const cardStats = {
    total: approvedMembers.length,
    generated: Math.floor(approvedMembers.length * 0.7), // Mock data
    pending: Math.floor(approvedMembers.length * 0.3),
    standard: approvedMembers.length,
    premium: 0,
    executive: 0
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <p className="text-green-700 font-medium">{successMessage}</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-upnd-black">UPND Membership Cards</h1>
          <p className="text-upnd-yellow font-medium">Unity, Work, Progress - Official Member Cards</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasPermission('generate_reports') && selectedMembers.length > 0 && (
            <button
              onClick={handleBulkGenerate}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Printer className="w-5 h-5" />
              <span>Generate Cards ({selectedMembers.length})</span>
            </button>
          )}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-upnd-red to-upnd-yellow px-4 py-2 rounded-lg">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
              alt="UPND Logo"
              className="w-6 h-6 object-contain"
            />
            <span className="text-white font-semibold">{approvedMembers.length} Eligible</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-red">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Total Eligible</h3>
              <p className="text-3xl font-bold text-upnd-red mt-2">{cardStats.total}</p>
            </div>
            <CreditCard className="w-8 h-8 text-upnd-red" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Cards Generated</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{cardStats.generated}</p>
            </div>
            <Printer className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-yellow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Pending Generation</h3>
              <p className="text-3xl font-bold text-upnd-yellow mt-2">{cardStats.pending}</p>
            </div>
            <Plus className="w-8 h-8 text-upnd-yellow" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Standard Cards</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{cardStats.standard}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
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
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent w-full md:w-64"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={cardTypeFilter}
                onChange={(e) => setCardTypeFilter(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent appearance-none w-full md:w-48"
              >
                <option value="all">All Card Types</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="executive">Executive</option>
              </select>
            </div>
          </div>

          {hasPermission('generate_reports') && (
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="selectAll"
                checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-upnd-red border-gray-300 rounded focus:ring-upnd-red"
              />
              <label htmlFor="selectAll" className="text-sm font-medium text-gray-700">
                Select all ({filteredMembers.length})
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Card Types Guide */}
      <div className="bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">UPND Membership Card Types</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Standard Card</h4>
            <p className="text-sm text-white/90">Regular UPND members with red background and party motto</p>
            <div className="mt-2 text-xs text-white/80">Features: Basic info, QR code, party logo</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Premium Card</h4>
            <p className="text-sm text-white/90">Special recognition with red and yellow accents</p>
            <div className="mt-2 text-xs text-white/80">Features: Enhanced design, special recognition</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Executive Card</h4>
            <p className="text-sm text-white/90">Leadership positions with dark red and gold details</p>
            <div className="mt-2 text-xs text-white/80">Features: Premium materials, leadership designation</div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="relative">
            {hasPermission('generate_reports') && (
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
              <MembershipCard
                member={member}
                onGenerate={handleSingleGenerate}
                onPreview={handlePreview}
              />
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No eligible members found</h3>
          <p className="text-gray-400">
            {approvedMembers.length === 0 
              ? 'No approved members available for card generation'
              : 'Try adjusting your search criteria'
            }
          </p>
        </div>
      )}

      {/* Card Generation Modal */}
      {showGenerationModal && (
        <CardGenerationModal
          selectedMembers={selectedMembers.map(id => members.find(m => m.id === id)!)}
          onClose={() => {
            setShowGenerationModal(false);
            setSelectedMembers([]);
          }}
        />
      )}
    </div>
  );
}