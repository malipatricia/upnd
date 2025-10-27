import React, { useState } from 'react';
import { DisciplinaryCase } from '../../../types';
import { X, AlertTriangle, User, Calendar, FileText, Shield } from 'lucide-react';

interface DisciplinaryModalProps {
  case: DisciplinaryCase;
  onClose: () => void;
  onUpdateCase: (caseId: string, updates: Partial<DisciplinaryCase>) => void;
}

export function DisciplinaryModal({ case: disciplinaryCase, onClose, onUpdateCase }: DisciplinaryModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(disciplinaryCase.status);
  const [notes, setNotes] = useState('');

  const statusOptions = [
    { value: 'Active', label: 'Active', color: 'text-orange-600 bg-orange-50' },
    { value: 'Under Review', label: 'Under Review', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'Resolved', label: 'Resolved', color: 'text-green-600 bg-green-50' },
    { value: 'Appealed', label: 'Appealed', color: 'text-red-600 bg-red-50' }
  ];

  const handleStatusUpdate = () => {
    onUpdateCase(disciplinaryCase.id, { 
      status: selectedStatus as DisciplinaryCase['status'],
      notes: [...(disciplinaryCase.notes || []), {
        id: Date.now().toString(),
        note: notes,
        noteDate: new Date().toISOString(),
        author: 'Current User'
      }]
    });
    onClose();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
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
              <h2 className="text-xl font-bold">UPND Disciplinary Case</h2>
              <p className="text-white/90 text-sm">Unity, Work, Progress - Case Management</p>
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
          {/* Case Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-upnd-black">{disciplinaryCase.caseNumber}</h3>
                  <p className="text-upnd-red font-medium">{disciplinaryCase.memberName}</p>
                </div>
              </div>

              <div className="bg-upnd-red/5 border border-upnd-red/20 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3">Case Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Member ID: {disciplinaryCase.memberId}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Violation: {disciplinaryCase.violationType}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Reported: {new Date(disciplinaryCase.dateReported).toLocaleDateString()}</span>
                  </div>
                  {disciplinaryCase.dateIncident && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Incident: {new Date(disciplinaryCase.dateIncident).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3">Officers</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Reporting Officer:</span> {disciplinaryCase.reportingOfficer}</div>
                  {disciplinaryCase.assignedOfficer && (
                    <div><span className="font-medium">Assigned Officer:</span> {disciplinaryCase.assignedOfficer}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-3">
                <div className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium border rounded-lg ${getSeverityColor(disciplinaryCase.severity)}`}>
                  <AlertTriangle className="w-4 h-4" />
                  <span>{disciplinaryCase.severity} Severity</span>
                </div>
                <div className={`px-3 py-2 text-sm font-medium rounded-lg ${statusOptions.find(s => s.value === disciplinaryCase.status)?.color}`}>
                  {disciplinaryCase.status}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3">Case Description</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{disciplinaryCase.description}</p>
              </div>

              {disciplinaryCase.actions && disciplinaryCase.actions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-upnd-black mb-3">Actions Taken</h4>
                  <div className="space-y-2">
                    {disciplinaryCase.actions.map((action, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium text-gray-800">{action.action}</div>
                        <div className="text-gray-600">
                          {action.officer} - {new Date(action.actionDate).toLocaleDateString()}
                        </div>
                        {action.notes && <div className="text-gray-500 italic">{action.notes}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {disciplinaryCase.evidence && disciplinaryCase.evidence.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-upnd-black mb-3">Evidence</h4>
                  <div className="space-y-2">
                    {disciplinaryCase.evidence.map((evidence, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium text-gray-800">{evidence.type}: {evidence.description}</div>
                        <div className="text-gray-600">
                          Uploaded by {evidence.uploadedBy} on {new Date(evidence.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Case Notes */}
          {disciplinaryCase.notes && disciplinaryCase.notes.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-upnd-black mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-upnd-yellow" />
                Case Notes
              </h4>
              <div className="space-y-3">
                {disciplinaryCase.notes.map((note, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-yellow-200">
                    <div className="text-sm text-gray-700">{note.note}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {note.author} - {new Date(note.noteDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Management */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-upnd-black mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-upnd-red" />
              Case Status Management
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Case Note
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                placeholder="Add notes about this case update..."
              />
            </div>
          </div>
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
            {(selectedStatus !== disciplinaryCase.status || notes.trim()) && (
              <button
                onClick={handleStatusUpdate}
                className="px-6 py-2 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white rounded-lg hover:shadow-lg transition-all"
              >
                Update Case
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}