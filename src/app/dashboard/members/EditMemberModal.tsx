"use client";

import React, { useState, useEffect } from 'react';
import { UPNDMember, MembershipStatus } from '../../types';
import { X, User, MapPin, Phone, Mail, Calendar, CheckCircle, AlertCircle, Edit2, Save } from 'lucide-react';
import { zambianProvinces, provincialDistricts } from '../../../data/zambia';
import { useSession } from 'next-auth/react';

interface EditMemberModalProps {
  member: UPNDMember;
  onClose: () => void;
  onUpdateStatus: (memberId: string, status: MembershipStatus) => void;
  onUpdateMember?: (memberId: string, updatedData: Partial<UPNDMember>) => Promise<void>;
}

export function EditMemberModal({ member, onClose, onUpdateStatus, onUpdateMember }: EditMemberModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<MembershipStatus>(member.status);
  const [notes, setNotes] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: session } = useSession();
  const user = session?.user;

  const [currentMember, setCurrentMember] = useState(member);

  const [editedMember, setEditedMember] = useState({
    fullName: member.fullName,
    nrcNumber: member.nrcNumber,
    dateOfBirth: member.dateOfBirth,
    phone: member.phone,
    email: member.email || '',
    residentialAddress: member.residentialAddress,
    province: member.jurisdiction.province,
    district: member.jurisdiction.district,
    constituency: member.jurisdiction.constituency,
    ward: member.jurisdiction.ward,
    branch: member.jurisdiction.branch,
    section: member.jurisdiction.section,
    partyCommitment: member.partyCommitment
  });

  const [availableDistricts, setAvailableDistricts] = useState<string[]>(
    provincialDistricts[member.jurisdiction.province] || []
  );

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (editedMember.province) {
      const districts = provincialDistricts[editedMember.province] || [];
      setAvailableDistricts(districts);
      if (!districts.includes(editedMember.district)) {
        setEditedMember(prev => ({ ...prev, district: districts[0] || '' }));
      }
    }
  }, [editedMember.province]);

  const statusOptions: { value: MembershipStatus; label: string; color: string }[] = [
    { value: 'Pending Section Review', label: 'Pending Section Review', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'Pending Branch Review', label: 'Pending Branch Review', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'Pending Ward Review', label: 'Pending Ward Review', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'Pending District Review', label: 'Pending District Review', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'Approved', label: 'Approved', color: 'text-green-600 bg-green-50' },
    { value: 'Rejected', label: 'Rejected', color: 'text-red-600 bg-red-50' },
    { value: 'Suspended', label: 'Suspended', color: 'text-orange-600 bg-orange-50' },
    { value: 'Expelled', label: 'Expelled', color: 'text-red-800 bg-red-100' }
  ];

  const handleStatusUpdate = () => {
    onUpdateStatus(member.id, selectedStatus);
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editedMember.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!editedMember.nrcNumber.trim()) newErrors.nrcNumber = 'NRC number is required';
    if (!editedMember.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!editedMember.residentialAddress.trim()) newErrors.residentialAddress = 'Residential address is required';
    if (!editedMember.phone.trim()) newErrors.phone = 'Phone number is required';

    if (editedMember.dateOfBirth) {
      const birthDate = new Date(editedMember.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) newErrors.dateOfBirth = 'Member must be at least 18 years old';
    }

    const nrcPattern = /^\d{6}\/\d{2}\/\d$/;
    if (editedMember.nrcNumber && !nrcPattern.test(editedMember.nrcNumber)) {
      newErrors.nrcNumber = 'Invalid NRC format. Should be XXXXXX/XX/X';
    }

    const phonePattern = /^\+260[0-9]{9}$|^[0-9]{10}$/;
    if (editedMember.phone && !phonePattern.test(editedMember.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Zambian phone number';
    }

    if (!editedMember.province) newErrors.province = 'Province is required';
    if (!editedMember.district) newErrors.district = 'District is required';
    if (!editedMember.constituency) newErrors.constituency = 'Constituency is required';
    if (!editedMember.ward) newErrors.ward = 'Ward is required';
    if (!editedMember.branch) newErrors.branch = 'Branch is required';
    if (!editedMember.section) newErrors.section = 'Section is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!onUpdateMember) return;

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateMember(member.id, {
        fullName: editedMember.fullName,
        nrcNumber: editedMember.nrcNumber,
        dateOfBirth: editedMember.dateOfBirth,
        phone: editedMember.phone,
        email: editedMember.email,
        residentialAddress: editedMember.residentialAddress,
        jurisdiction: {
          province: editedMember.province,
          district: editedMember.district,
          constituency: editedMember.constituency,
          ward: editedMember.ward,
          branch: editedMember.branch,
          section: editedMember.section
        },
        partyCommitment: editedMember.partyCommitment
      });

      setCurrentMember({
        ...currentMember,
        fullName: editedMember.fullName,
        nrcNumber: editedMember.nrcNumber,
        dateOfBirth: editedMember.dateOfBirth,
        phone: editedMember.phone,
        email: editedMember.email,
        residentialAddress: editedMember.residentialAddress,
        jurisdiction: {
          province: editedMember.province,
          district: editedMember.district,
          constituency: editedMember.constituency,
          ward: editedMember.ward,
          branch: editedMember.branch,
          section: editedMember.section
        },
        partyCommitment: editedMember.partyCommitment
      });

      setIsEditMode(false);
      setErrors({});
    } catch (error) {
      console.error('Error updating member:', error);
      setErrors({ submit: 'Failed to update member. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedMember({
      fullName: currentMember.fullName,
      nrcNumber: currentMember.nrcNumber,
      dateOfBirth: currentMember.dateOfBirth,
      phone: currentMember.phone,
      email: currentMember.email || '',
      residentialAddress: currentMember.residentialAddress,
      province: currentMember.jurisdiction.province,
      district: currentMember.jurisdiction.district,
      constituency: currentMember.jurisdiction.constituency,
      ward: currentMember.jurisdiction.ward,
      branch: currentMember.jurisdiction.branch,
      section: currentMember.jurisdiction.section,
      partyCommitment: currentMember.partyCommitment
    });
    setIsEditMode(false);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
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
          <div className="flex items-center space-x-2">
            {!isEditMode && isAdmin && onUpdateMember && (
              <button
                onClick={() => setIsEditMode(true)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                title="Edit Member Details"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 text-red-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  {isEditMode ? (
                    <div>
                      <input
                        type="text"
                        value={editedMember.fullName}
                        onChange={(e) => {
                          setEditedMember({...editedMember, fullName: e.target.value});
                          if (errors.fullName) setErrors({...errors, fullName: ''});
                        }}
                        className={`text-2xl font-bold text-upnd-black border-b-2 ${errors.fullName ? 'border-red-500' : 'border-upnd-red'} focus:outline-none w-full`}
                      />
                      {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                    </div>
                  ) : (
                    <h3 className="text-2xl font-bold text-upnd-black">{currentMember.fullName}</h3>
                  )}
                  <p className="text-upnd-red font-medium">ID: {currentMember.membershipId}</p>
                </div>
              </div>

              <div className="bg-upnd-red/5 border border-upnd-red/20 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3">Personal Information</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    {isEditMode ? (
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">NRC</label>
                        <input
                          type="text"
                          value={editedMember.nrcNumber}
                          onChange={(e) => {
                            setEditedMember({...editedMember, nrcNumber: e.target.value});
                            if (errors.nrcNumber) setErrors({...errors, nrcNumber: ''});
                          }}
                          placeholder="XXXXXX/XX/X"
                          className={`w-full border-b ${errors.nrcNumber ? 'border-red-500' : 'border-gray-300'} focus:border-upnd-red focus:outline-none`}
                        />
                        {errors.nrcNumber && <p className="text-xs text-red-600 mt-1">{errors.nrcNumber}</p>}
                      </div>
                    ) : (
                      <span className="text-gray-700">NRC: {currentMember.nrcNumber}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    {isEditMode ? (
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Date of Birth</label>
                        <input
                          type="date"
                          value={editedMember.dateOfBirth}
                          onChange={(e) => {
                            setEditedMember({...editedMember, dateOfBirth: e.target.value});
                            if (errors.dateOfBirth) setErrors({...errors, dateOfBirth: ''});
                          }}
                          className={`w-full border-b ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} focus:border-upnd-red focus:outline-none`}
                        />
                        {errors.dateOfBirth && <p className="text-xs text-red-600 mt-1">{errors.dateOfBirth}</p>}
                      </div>
                    ) : (
                      <span className="text-gray-700">DOB: {currentMember.dateOfBirth}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    {isEditMode ? (
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Phone</label>
                        <input
                          type="tel"
                          value={editedMember.phone}
                          onChange={(e) => {
                            setEditedMember({...editedMember, phone: e.target.value});
                            if (errors.phone) setErrors({...errors, phone: ''});
                          }}
                          placeholder="+260XXXXXXXXX or 09XXXXXXXX"
                          className={`w-full border-b ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:border-upnd-red focus:outline-none`}
                        />
                        {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                      </div>
                    ) : (
                      <span className="text-gray-700">{currentMember.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    {isEditMode ? (
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Email (Optional)</label>
                        <input
                          type="email"
                          value={editedMember.email}
                          onChange={(e) => setEditedMember({...editedMember, email: e.target.value})}
                          className="w-full border-b border-gray-300 focus:border-upnd-red focus:outline-none"
                        />
                      </div>
                    ) : (
                      currentMember.email && <span className="text-gray-700">{currentMember.email}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-upnd-yellow/5 border border-upnd-yellow/20 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3">UPND Commitment</h4>
                {isEditMode ? (
                  <input
                    type="text"
                    value={editedMember.partyCommitment}
                    onChange={(e) => setEditedMember({...editedMember, partyCommitment: e.target.value})}
                    className="w-full text-sm border-b border-gray-300 focus:border-upnd-red focus:outline-none italic"
                  />
                ) : (
                  <div className="text-sm text-gray-700 font-medium italic">
                    "{currentMember.partyCommitment}"
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-upnd-red" />
                  Administrative Jurisdiction
                </h4>
                <div className="space-y-3 text-sm">
                  {isEditMode ? (
                    <>
                      <div>
                        <label className="text-xs text-gray-500">Province *</label>
                        <select
                          value={editedMember.province}
                          onChange={(e) => {
                            setEditedMember({...editedMember, province: e.target.value});
                            if (errors.province) setErrors({...errors, province: ''});
                          }}
                          className={`w-full border ${errors.province ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1 focus:border-upnd-red focus:outline-none`}
                        >
                          <option value="">Select Province</option>
                          {zambianProvinces.map(province => (
                            <option key={province} value={province}>
                              {province}
                            </option>
                          ))}
                        </select>
                        {errors.province && <p className="text-xs text-red-600 mt-1">{errors.province}</p>}
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">District *</label>
                        <select
                          value={editedMember.district}
                          onChange={(e) => {
                            setEditedMember({...editedMember, district: e.target.value});
                            if (errors.district) setErrors({...errors, district: ''});
                          }}
                          className={`w-full border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1 focus:border-upnd-red focus:outline-none`}
                          disabled={!editedMember.province}
                        >
                          <option value="">Select District</option>
                          {availableDistricts.map(district => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                        {errors.district && <p className="text-xs text-red-600 mt-1">{errors.district}</p>}
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Constituency *</label>
                        <input
                          type="text"
                          value={editedMember.constituency}
                          onChange={(e) => {
                            setEditedMember({...editedMember, constituency: e.target.value});
                            if (errors.constituency) setErrors({...errors, constituency: ''});
                          }}
                          className={`w-full border-b ${errors.constituency ? 'border-red-500' : 'border-gray-300'} focus:border-upnd-red focus:outline-none`}
                        />
                        {errors.constituency && <p className="text-xs text-red-600 mt-1">{errors.constituency}</p>}
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Ward *</label>
                        <input
                          type="text"
                          value={editedMember.ward}
                          onChange={(e) => {
                            setEditedMember({...editedMember, ward: e.target.value});
                            if (errors.ward) setErrors({...errors, ward: ''});
                          }}
                          className={`w-full border-b ${errors.ward ? 'border-red-500' : 'border-gray-300'} focus:border-upnd-red focus:outline-none`}
                        />
                        {errors.ward && <p className="text-xs text-red-600 mt-1">{errors.ward}</p>}
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Branch *</label>
                        <input
                          type="text"
                          value={editedMember.branch}
                          onChange={(e) => {
                            setEditedMember({...editedMember, branch: e.target.value});
                            if (errors.branch) setErrors({...errors, branch: ''});
                          }}
                          className={`w-full border-b ${errors.branch ? 'border-red-500' : 'border-gray-300'} focus:border-upnd-red focus:outline-none`}
                        />
                        {errors.branch && <p className="text-xs text-red-600 mt-1">{errors.branch}</p>}
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Section *</label>
                        <input
                          type="text"
                          value={editedMember.section}
                          onChange={(e) => {
                            setEditedMember({...editedMember, section: e.target.value});
                            if (errors.section) setErrors({...errors, section: ''});
                          }}
                          className={`w-full border-b ${errors.section ? 'border-red-500' : 'border-gray-300'} focus:border-upnd-red focus:outline-none`}
                        />
                        {errors.section && <p className="text-xs text-red-600 mt-1">{errors.section}</p>}
                      </div>
                    </>
                  ) : (
                    <>
                      <div><span className="font-medium">Province:</span> {currentMember.jurisdiction.province}</div>
                      <div><span className="font-medium">District:</span> {currentMember.jurisdiction.district}</div>
                      <div><span className="font-medium">Constituency:</span> {currentMember.jurisdiction.constituency}</div>
                      <div><span className="font-medium">Ward:</span> {currentMember.jurisdiction.ward}</div>
                      <div><span className="font-medium">Branch:</span> {currentMember.jurisdiction.branch}</div>
                      <div><span className="font-medium">Section:</span> {currentMember.jurisdiction.section}</div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3">Residential Address</h4>
                {isEditMode ? (
                  <div>
                    <textarea
                      value={editedMember.residentialAddress}
                      onChange={(e) => {
                        setEditedMember({...editedMember, residentialAddress: e.target.value});
                        if (errors.residentialAddress) setErrors({...errors, residentialAddress: ''});
                      }}
                      rows={3}
                      className={`w-full text-sm border ${errors.residentialAddress ? 'border-red-500' : 'border-gray-300'} rounded p-2 focus:border-upnd-red focus:outline-none`}
                    />
                    {errors.residentialAddress && <p className="text-xs text-red-600 mt-1">{errors.residentialAddress}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">{currentMember.residentialAddress}</p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3">Registration Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Date:</span> {new Date(currentMember.registrationDate).toLocaleDateString()}</div>
                  <div><span className="font-medium">Time:</span> {new Date(currentMember.registrationDate).toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          </div>

          {currentMember.endorsements.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-upnd-black mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Member Endorsements
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {currentMember.endorsements.map((endorsement, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="text-sm font-medium text-gray-800">{endorsement.endorserName}</div>
                    <div className="text-xs text-gray-600">ID: {endorsement.membershipId}</div>
                    <div className="text-xs text-gray-600">Date: {endorsement.endorsementDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isEditMode && isAdmin && (
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
                  <div className={`px-3 py-2 rounded-lg text-sm font-medium ${statusOptions.find(s => s.value === currentMember.status)?.color}`}>
                    {currentMember.status}
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

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={isEditMode ? handleCancelEdit : onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isEditMode ? 'Cancel' : 'Close'}
          </button>

          <div className="flex space-x-3">
            {isEditMode ? (
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            ) : (
              isAdmin && selectedStatus !== currentMember.status && (
                <button
                  onClick={handleStatusUpdate}
                  className="px-6 py-2 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Update Status
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}