'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { zambianProvinces, provincialDistricts } from '../../data/zambia';
import { useMembers } from '../../hooks/useMembers';
import { Jurisdiction, Endorsement } from '../../types';

export function RegistrationForm() {
  const router = useRouter();
  const { addMember } = useMembers();
  
  const [formData, setFormData] = useState({
    fullName: '',
    nrcNumber: '',
    dateOfBirth: '',
    residentialAddress: '',
    phone: '',
    email: '',
    jurisdiction: {
      province: '',
      district: '',
      constituency: '',
      ward: '',
      branch: '',
      section: ''
    } as Jurisdiction,
    endorsements: [
      { endorserName: '', membershipId: '', endorsementDate: '' },
      { endorserName: '', membershipId: '', endorsementDate: '' }
    ] as Endorsement[],
    acceptConstitution: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('jurisdiction.')) {
      const jurisdictionField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        jurisdiction: {
          ...prev.jurisdiction,
          [jurisdictionField]: value,
          // Reset dependent fields when parent changes
          ...(jurisdictionField === 'province' ? { district: '' } : {})
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEndorsementChange = (index: number, field: keyof Endorsement, value: string) => {
    setFormData(prev => ({
      ...prev,
      endorsements: prev.endorsements.map((endorsement, i) => 
        i === index 
          ? { 
              ...endorsement, 
              [field]: value,
              ...(field === 'endorserName' && value ? { endorsementDate: new Date().toISOString().split('T')[0] } : {})
            }
          : endorsement
      )
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.nrcNumber.trim()) newErrors.nrcNumber = 'NRC number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.residentialAddress.trim()) newErrors.residentialAddress = 'Residential address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    // Age validation
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) newErrors.dateOfBirth = 'You must be at least 18 years old to join UPND';
    }

    // NRC validation
    const nrcPattern = /^\d{6}\/\d{2}\/\d$/;
    if (formData.nrcNumber && !nrcPattern.test(formData.nrcNumber)) {
      newErrors.nrcNumber = 'Invalid NRC format. Should be XXXXXX/XX/X';
    }

    // Phone validation
    const phonePattern = /^\+260[0-9]{9}$|^[0-9]{10}$/;
    if (formData.phone && !phonePattern.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Zambian phone number';
    }

    // Jurisdiction validation
    if (!formData.jurisdiction.province) newErrors.province = 'Province is required';
    if (!formData.jurisdiction.district) newErrors.district = 'District is required';
    if (!formData.jurisdiction.constituency) newErrors.constituency = 'Constituency is required';
    if (!formData.jurisdiction.ward) newErrors.ward = 'Ward is required';
    if (!formData.jurisdiction.branch) newErrors.branch = 'Branch is required';
    if (!formData.jurisdiction.section) newErrors.section = 'Section is required';

    // Constitution acceptance
    if (!formData.acceptConstitution) newErrors.acceptConstitution = 'You must accept the UPND Constitution to proceed';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const member = addMember({
        ...formData,
        endorsements: formData.endorsements.filter(e => e.endorserName.trim())
      });
      
      // Store registration data for success page
      localStorage.setItem('upnd_registration_data', JSON.stringify({
        fullName: formData.fullName,
        membershipId: member.membershipId,
        registrationDate: new Date().toISOString()
      }));
      
      router.push('/success');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableDistricts = formData.jurisdiction.province 
    ? provincialDistricts[formData.jurisdiction.province] || []
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-upnd-red transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
                alt="UPND Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-upnd-black">UPND Membership Registration</h1>
                <p className="text-sm text-upnd-yellow font-medium">Unity, Work, Progress</p>
              </div>
            </div>
          </div>
          
          <div className="bg-upnd-red-light/10 border border-upnd-red-light/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-upnd-red" />
              <span className="font-semibold text-upnd-black">FREE Membership Registration</span>
            </div>
            <p className="text-sm text-gray-600">
              Join the United Party for National Development at no cost. Your commitment to Unity, Work, and Progress is all that's required.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-upnd-black mb-6 border-b border-gray-200 pb-3">
              Personal Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name as on NRC"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  NRC Number *
                </label>
                <input
                  type="text"
                  value={formData.nrcNumber}
                  onChange={(e) => handleInputChange('nrcNumber', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.nrcNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="XXXXXX/XX/X"
                />
                {errors.nrcNumber && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.nrcNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.dateOfBirth ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="+260 XXX XXX XXX"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Residential Address *
                </label>
                <textarea
                  value={formData.residentialAddress}
                  onChange={(e) => handleInputChange('residentialAddress', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.residentialAddress ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full residential address"
                />
                {errors.residentialAddress && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.residentialAddress}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Jurisdiction Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-upnd-black mb-6 border-b border-gray-200 pb-3">
              Administrative Jurisdiction
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Province *
                </label>
                <select
                  value={formData.jurisdiction.province}
                  onChange={(e) => handleInputChange('jurisdiction.province', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.province ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Province</option>
                  {zambianProvinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
                {errors.province && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.province}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  District *
                </label>
                <select
                  value={formData.jurisdiction.district}
                  onChange={(e) => handleInputChange('jurisdiction.district', e.target.value)}
                  disabled={!formData.jurisdiction.province}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.district ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${!formData.jurisdiction.province ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select District</option>
                  {availableDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.district}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Constituency *
                </label>
                <input
                  type="text"
                  value={formData.jurisdiction.constituency}
                  onChange={(e) => handleInputChange('jurisdiction.constituency', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.constituency ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your constituency"
                />
                {errors.constituency && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.constituency}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Ward *
                </label>
                <input
                  type="text"
                  value={formData.jurisdiction.ward}
                  onChange={(e) => handleInputChange('jurisdiction.ward', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.ward ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your ward"
                />
                {errors.ward && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.ward}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Branch *
                </label>
                <input
                  type="text"
                  value={formData.jurisdiction.branch}
                  onChange={(e) => handleInputChange('jurisdiction.branch', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.branch ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your branch name"
                />
                {errors.branch && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.branch}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Section *
                </label>
                <input
                  type="text"
                  value={formData.jurisdiction.section}
                  onChange={(e) => handleInputChange('jurisdiction.section', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.section ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your section name"
                />
                {errors.section && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.section}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Member Endorsements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-upnd-black mb-4">
              Member Endorsements (Optional)
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              If you know existing UPND members who can endorse your application, please provide their details below.
            </p>
            
            <div className="space-y-6">
              {formData.endorsements.map((endorsement, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-upnd-black mb-3">
                    Endorser {index + 1}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endorser Name
                      </label>
                      <input
                        type="text"
                        value={endorsement.endorserName}
                        onChange={(e) => handleEndorsementChange(index, 'endorserName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                        placeholder="Full name of endorser"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Membership ID
                      </label>
                      <input
                        type="text"
                        value={endorsement.membershipId}
                        onChange={(e) => handleEndorsementChange(index, 'membershipId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                        placeholder="UPND membership ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endorsement Date
                      </label>
                      <input
                        type="date"
                        value={endorsement.endorsementDate}
                        onChange={(e) => handleEndorsementChange(index, 'endorsementDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Constitution Acceptance */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-upnd-black mb-6 border-b border-gray-200 pb-3">
              UPND Constitution & Commitment
            </h2>
            
            <div className="bg-upnd-yellow/10 border border-upnd-yellow/20 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-upnd-black mb-3">Our Core Values</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-upnd-red mb-2">Unity</h4>
                  <p className="text-gray-600">Bringing together all Zambians regardless of tribe, region, or background</p>
                </div>
                <div>
                  <h4 className="font-semibold text-upnd-red mb-2">Work</h4>
                  <p className="text-gray-600">Promoting hard work, entrepreneurship, and sustainable development</p>
                </div>
                <div>
                  <h4 className="font-semibold text-upnd-red mb-2">Progress</h4>
                  <p className="text-gray-600">Advancing progressive policies for social and economic transformation</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="acceptConstitution"
                checked={formData.acceptConstitution}
                onChange={(e) => handleInputChange('acceptConstitution', e.target.checked.toString())}
                className="mt-1 w-5 h-5 text-upnd-red border-gray-300 rounded focus:ring-upnd-red focus:ring-2"
              />
              <div className="flex-1">
                <label htmlFor="acceptConstitution" className="text-sm font-medium text-upnd-black cursor-pointer">
                  I hereby accept the UPND Constitution and commit myself to the principles of Unity, Work, and Progress. 
                  I pledge to uphold the values and objectives of the United Party for National Development. *
                </label>
                {errors.acceptConstitution && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.acceptConstitution}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-upnd-red to-upnd-yellow text-white hover:shadow-xl transform hover:-translate-y-1'
              }`}
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit UPND Membership Application'}
            </button>
            
            {errors.submit && (
              <p className="text-red-500 text-sm mt-4 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.submit}
              </p>
            )}
            
            <p className="text-gray-600 text-sm mt-4">
              By submitting this form, you agree to join the UPND movement for Unity, Work, and Progress
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}