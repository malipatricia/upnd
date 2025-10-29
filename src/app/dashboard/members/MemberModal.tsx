import React, { useState } from 'react';
import { UPNDMember, MembershipStatus } from '../../types';
import { X, User, MapPin, Phone, Mail, Calendar, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { getButtonVisibility } from '@/lib/approval';
import { useSession } from 'next-auth/react';

interface MemberModalProps {
  member: UPNDMember;
  onClose: () => void;
  onUpdateStatus: (memberId: string, status: MembershipStatus) => void;
}

export function MemberModal({ member, onClose, onUpdateStatus }: MemberModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<MembershipStatus>(member.status);
  const [notes, setNotes] = useState('');
  const { data: session } = useSession();
  const user = session?.user;
  
  // Get button visibility based on user role and member status
  const userRole = user?.role || 'member';
  const buttonVisibility = getButtonVisibility({ role: userRole as any }, member.status);
  
  // Check if user can see Approve/Reject buttons (and is not admin)
  const canSeeApproveReject = (buttonVisibility.canApprove || buttonVisibility.canReject) && userRole !== 'admin';

  const statusOptions: { value: MembershipStatus; label: string; color: string }[] = [
    { value: 'Pending Section Review', label: 'Pending Section Review', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'Pending Branch Review', label: 'Pending Branch Review', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'Pending Ward Review', label: 'Pending Ward Review', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'Pending District Review', label: 'Pending District Review', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'Pending Provincial Review', label: 'Pending Provincial Review', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'Approved', label: 'Approved', color: 'text-green-600 bg-green-50' },
    { value: 'Rejected', label: 'Rejected', color: 'text-red-600 bg-red-50' },
    { value: 'Suspended', label: 'Suspended', color: 'text-orange-600 bg-orange-50' },
    { value: 'Expelled', label: 'Expelled', color: 'text-red-800 bg-red-100' }
  ];

  const handleStatusUpdate = () => {
    onUpdateStatus(member.id, selectedStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
              alt="UPND Logo"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h2 className="text-xl font-bold">UPND Member Details</h2>
              <p className="text-white/90 text-sm">Unity, Work, Progress</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Member Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-upnd-black">{member.fullName}</h3>
                  <p className="text-upnd-red font-medium">ID: {member.membershipId}</p>
                </div>
              </div>

              <div className="bg-upnd-red/5 border border-upnd-red/20 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3">Personal Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">NRC: {member.nrcNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">DOB: {member.dateOfBirth}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{member.phone}</span>
                  </div>
                  {member.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{member.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-upnd-yellow/5 border border-upnd-yellow/20 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3">UPND Commitment</h4>
                <div className="text-sm text-gray-700 font-medium italic">
                  "{member.partyCommitment}"
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-upnd-red" />
                  Administrative Jurisdiction
                </h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Province:</span> {member.jurisdiction.province}</div>
                  <div><span className="font-medium">District:</span> {member.jurisdiction.district}</div>
                  <div><span className="font-medium">Constituency:</span> {member.jurisdiction.constituency}</div>
                  <div><span className="font-medium">Ward:</span> {member.jurisdiction.ward}</div>
                  <div><span className="font-medium">Branch:</span> {member.jurisdiction.branch}</div>
                  <div><span className="font-medium">Section:</span> {member.jurisdiction.section}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3">Residential Address</h4>
                <p className="text-sm text-gray-700">{member.residentialAddress}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3">Registration Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Date:</span> {new Date(member.registrationDate).toLocaleDateString()}</div>
                  <div><span className="font-medium">Time:</span> {new Date(member.registrationDate).toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Endorsements */}
          {member.endorsements.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-upnd-black mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Member Endorsements
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {member.endorsements.map((endorsement, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="text-sm font-medium text-gray-800">{endorsement.endorserName}</div>
                    <div className="text-xs text-gray-600">ID: {endorsement.membershipId}</div>
                    <div className="text-xs text-gray-600">Date: {endorsement.endorsementDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Management - Only show if user can see Approve/Reject buttons */}
          {canSeeApproveReject && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-upnd-black mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-upnd-red" />
                Membership Status Management
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Status
                  </label>
                  <div className={`px-3 py-2 rounded-lg text-sm font-medium ${statusOptions.find(s => s.value === member.status)?.color}`}>
                    {member.status}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as MembershipStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Update Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                  placeholder="Add notes about this status change..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          
          <div className="flex space-x-3">
            {canSeeApproveReject && selectedStatus !== member.status && (
              <button
                onClick={handleStatusUpdate}
                className="px-6 py-2 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white rounded-lg hover:shadow-lg transition-all"
              >
                Update Status
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}