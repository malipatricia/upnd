import React, { useState } from 'react';
import { UPNDEvent } from '../../types';
import { X, Calendar, MapPin, Users, Clock, Shield } from 'lucide-react';

interface EventModalProps {
  event: UPNDEvent;
  onClose: () => void;
  onUpdateEvent: (eventId: string, updates: Partial<UPNDEvent>) => void;
}

export function EventModal({ event, onClose, onUpdateEvent }: EventModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(event.status);
  const [actualAttendees, setActualAttendees] = useState(event.actualAttendees || '');

  const statusOptions = [
    { value: 'Planned', label: 'Planned', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'Active', label: 'Active', color: 'text-blue-600 bg-blue-50' },
    { value: 'Completed', label: 'Completed', color: 'text-green-600 bg-green-50' },
    { value: 'Cancelled', label: 'Cancelled', color: 'text-red-600 bg-red-50' }
  ];

  const handleStatusUpdate = () => {
    const updates: Partial<UPNDEvent> = { 
      status: selectedStatus as UPNDEvent['status']
    };
    
    if (actualAttendees && !isNaN(Number(actualAttendees))) {
      updates.actualAttendees = Number(actualAttendees);
    }
    
    onUpdateEvent(event.id, updates);
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
              <h2 className="text-xl font-bold">UPND Event Details</h2>
              <p className="text-white/90 text-sm">Unity, Work, Progress - Event Management</p>
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
          {/* Event Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-upnd-black">{event.eventName}</h3>
                  <p className="text-upnd-red font-medium">{event.eventType}</p>
                </div>
              </div>

              <div className="bg-upnd-red/5 border border-upnd-red/20 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3">Event Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Date: {new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                  {event.eventTime && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Time: {event.eventTime}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Location: {event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      Expected: {event.expectedAttendees || 'Not specified'}
                    </span>
                  </div>
                  {event.actualAttendees && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Actual: {event.actualAttendees}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-upnd-yellow/10 border border-upnd-yellow/20 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3">UPND Organizer</h4>
                <div className="text-sm text-gray-700 font-medium">
                  {event.organizer}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`px-3 py-2 text-sm font-medium rounded-lg ${statusOptions.find(s => s.value === event.status)?.color}`}>
                Current Status: {event.status}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3">Location Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Venue:</span> {event.location}</div>
                  {event.province && <div><span className="font-medium">Province:</span> {event.province}</div>}
                  {event.district && <div><span className="font-medium">District:</span> {event.district}</div>}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-upnd-black mb-3">Event Description</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Event Management */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-upnd-black mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-upnd-red" />
              Event Status Management
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Attendees
                </label>
                <input
                  type="number"
                  value={actualAttendees}
                  onChange={(e) => setActualAttendees(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                  placeholder="Enter actual attendance"
                />
              </div>
            </div>
          </div>

          {/* UPND Event Guidelines */}
          <div className="bg-upnd-yellow/10 border border-upnd-yellow/20 rounded-lg p-4">
            <h4 className="font-semibold text-upnd-black mb-2">UPND Event Guidelines</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• All UPND events must promote Unity, Work, and Progress values</li>
              <li>• Ensure inclusive participation from all community members</li>
              <li>• Maintain accurate attendance records for reporting</li>
              <li>• Follow UPND branding and messaging guidelines</li>
              <li>• Report event outcomes to provincial leadership</li>
            </ul>
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
            {(selectedStatus !== event.status || (actualAttendees && Number(actualAttendees) !== event.actualAttendees)) && (
              <button
                onClick={handleStatusUpdate}
                className="px-6 py-2 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white rounded-lg hover:shadow-lg transition-all"
              >
                Update Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}