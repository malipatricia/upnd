import React, { useState } from 'react';
import { X, AlertTriangle, Shield } from 'lucide-react';
import { violationTypes } from '../../../data/zambia';
import { DisciplinaryCase } from '../../../types';

interface NewCaseModalProps {
  onClose: () => void;
  onCreateCase: (caseData: Partial<DisciplinaryCase>) => DisciplinaryCase;
}

export function NewCaseModal({ onClose, onCreateCase }: NewCaseModalProps) {
  const [formData, setFormData] = useState({
    memberName: '',
    memberId: '',
    violationType: '',
    description: '',
    severity: 'Medium' as 'Low' | 'Medium' | 'High',
    dateIncident: '',
    reportingOfficer: '',
    assignedOfficer: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.memberName.trim()) newErrors.memberName = 'Member name is required';
    if (!formData.memberId.trim()) newErrors.memberId = 'Member ID is required';
    if (!formData.violationType) newErrors.violationType = 'Violation type is required';
    if (!formData.description.trim()) newErrors.description = 'Case description is required';
    if (!formData.reportingOfficer.trim()) newErrors.reportingOfficer = 'Reporting officer is required';

    if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newCase = onCreateCase(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
              alt="UPND Logo"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h2 className="text-xl font-bold">New UPND Disciplinary Case</h2>
              <p className="text-white/90 text-sm">Unity, Work, Progress - Report Violation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Member Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-upnd-black border-b border-gray-200 pb-2">
              Member Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Member Name *
                </label>
                <input
                  type="text"
                  value={formData.memberName}
                  onChange={(e) => handleInputChange('memberName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.memberName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Full name of the member"
                />
                {errors.memberName && (
                  <p className="text-red-500 text-sm mt-1">{errors.memberName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Member ID *
                </label>
                <input
                  type="text"
                  value={formData.memberId}
                  onChange={(e) => handleInputChange('memberId', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.memberId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="UPND membership ID"
                />
                {errors.memberId && (
                  <p className="text-red-500 text-sm mt-1">{errors.memberId}</p>
                )}
              </div>
            </div>
          </div>

          {/* Violation Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-upnd-black border-b border-gray-200 pb-2">
              Violation Details
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Violation Type *
                </label>
                <select
                  value={formData.violationType}
                  onChange={(e) => handleInputChange('violationType', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.violationType ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select violation type</option>
                  {violationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.violationType && (
                  <p className="text-red-500 text-sm mt-1">{errors.violationType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Severity Level *
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => handleInputChange('severity', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-upnd-black mb-2">
                Incident Date
              </label>
              <input
                type="date"
                value={formData.dateIncident}
                onChange={(e) => handleInputChange('dateIncident', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-upnd-black mb-2">
                Case Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Provide detailed description of the violation and circumstances..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                {formData.description.length}/500 characters (minimum 20 required)
              </p>
            </div>
          </div>

          {/* Officer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-upnd-black border-b border-gray-200 pb-2">
              Officer Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Reporting Officer *
                </label>
                <input
                  type="text"
                  value={formData.reportingOfficer}
                  onChange={(e) => handleInputChange('reportingOfficer', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.reportingOfficer ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Name of reporting officer"
                />
                {errors.reportingOfficer && (
                  <p className="text-red-500 text-sm mt-1">{errors.reportingOfficer}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Assigned Officer (Optional)
                </label>
                <input
                  type="text"
                  value={formData.assignedOfficer}
                  onChange={(e) => handleInputChange('assignedOfficer', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                  placeholder="Officer assigned to investigate"
                />
              </div>
            </div>
          </div>

          {/* UPND Guidelines */}
          <div className="bg-upnd-yellow/10 border border-upnd-yellow/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-upnd-yellow" />
              <h4 className="font-semibold text-upnd-black">UPND Disciplinary Guidelines</h4>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• All cases must be reported within 30 days of the incident</li>
              <li>• Provide accurate and complete information</li>
              <li>• Maintain confidentiality during investigation</li>
              <li>• Follow Unity, Work, Progress principles in all proceedings</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Create Disciplinary Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}