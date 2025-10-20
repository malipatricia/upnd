import React from 'react';
import { UPNDMember, MembershipStatus } from '../../types';
import { User, MapPin, Phone, Mail, Calendar, Eye, CheckCircle, XCircle, Clock, GraduationCap, Briefcase, Award, Users as UsersIcon } from 'lucide-react';

interface MemberCardProps {
  member: UPNDMember;
  onViewDetails: () => void;
  onUpdateStatus: (memberId: string, status: MembershipStatus) => void;
}

export function MemberCard({ member, onViewDetails, onUpdateStatus }: MemberCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Suspended':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Expelled':
        return 'text-red-800 bg-red-100 border-red-300';
      default:
        return 'text-upnd-yellow bg-upnd-yellow/10 border-upnd-yellow/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
      case 'Expelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border-l-4 border-upnd-red">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-upnd-black">{member.fullName}</h3>
            <p className="text-sm text-gray-600">ID: {member.membershipId}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium border rounded-full ${getStatusColor(member.status)}`}>
          {getStatusIcon(member.status)}
          <span>{member.status}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>NRC: {member.nrcNumber}</span>
        </div>
        {member.gender && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <UsersIcon className="w-4 h-4" />
            <span>{member.gender}</span>
          </div>
        )}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{member.phone}</span>
        </div>
        {member.email && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{member.email}</span>
          </div>
        )}
        {member.education && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <GraduationCap className="w-4 h-4" />
            <span>{member.education}</span>
          </div>
        )}
        {member.occupation && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4" />
            <span>{member.occupation}</span>
          </div>
        )}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{member.jurisdiction.province} Province, {member.jurisdiction.district}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Registered: {new Date(member.registrationDate).toLocaleDateString()}</span>
        </div>
        {member.membershipLevel && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Award className="w-4 h-4" />
            <span>{member.membershipLevel}</span>
          </div>
        )}
        {member.skills && member.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {member.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                {skill}
              </span>
            ))}
            {member.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-200">
                +{member.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="bg-upnd-yellow/10 border border-upnd-yellow/20 rounded-lg p-3 mb-4">
        <div className="text-xs font-semibold text-upnd-red mb-1">UPND Commitment</div>
        <div className="text-sm font-medium text-upnd-black">{member.partyCommitment}</div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onViewDetails}
          className="flex items-center space-x-2 px-4 py-2 bg-upnd-red text-white rounded-lg hover:bg-upnd-red-dark transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>

        {member.status !== 'Approved' && member.status !== 'Rejected' && (
          <div className="flex space-x-2">
            <button
              onClick={() => onUpdateStatus(member.id, 'Approved')}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Approve
            </button>
            <button
              onClick={() => onUpdateStatus(member.id, 'Rejected')}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}