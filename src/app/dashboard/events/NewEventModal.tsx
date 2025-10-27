import React, { useState } from 'react';
import { X, Calendar, Shield } from 'lucide-react';
import { UPNDEvent } from '@/types';
import { zambianProvinces } from '@/data/zambia';

interface NewEventModalProps {
  onClose: () => void;
  onCreateEvent: (eventData: Partial<UPNDEvent>) => UPNDEvent;
}

export function NewEventModal({ onClose, onCreateEvent }: NewEventModalProps) {
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    description: '',
    eventDate: '',
    eventTime: '',
    location: '',
    province: '',
    district: '',
    organizer: '',
    expectedAttendees: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const eventTypes = [
    'Rally', 'Meeting', 'Training', 'Conference', 'Workshop', 
    'Campaign', 'Fundraiser', 'Community Outreach', 'Youth Event', 'Women Event'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required';
    if (!formData.eventType) newErrors.eventType = 'Event type is required';
    if (!formData.description.trim()) newErrors.description = 'Event description is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.location.trim()) newErrors.location = 'Event location is required';
    if (!formData.organizer.trim()) newErrors.organizer = 'Organizer is required';

    // Date validation
    if (formData.eventDate) {
      const eventDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        newErrors.eventDate = 'Event date cannot be in the past';
      }
    }

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

    const eventData = {
      ...formData,
      expectedAttendees: formData.expectedAttendees ? parseInt(formData.expectedAttendees) : undefined
    };

    onCreateEvent(eventData);
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
              <h2 className="text-xl font-bold">New UPND Event</h2>
              <p className="text-white/90 text-sm">Unity, Work, Progress - Create Event</p>
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
          {/* Event Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-upnd-black border-b border-gray-200 pb-2">
              Event Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => handleInputChange('eventName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.eventName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter UPND event name"
                />
                {errors.eventName && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Event Type *
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) => handleInputChange('eventType', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.eventType ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select event type</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.eventType && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventType}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-upnd-black mb-2">
                Event Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Describe the UPND event, its objectives, and expected outcomes..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                {formData.description.length}/500 characters (minimum 20 required)
              </p>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-upnd-black border-b border-gray-200 pb-2">
              Date and Time
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange('eventDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.eventDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.eventDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Event Time (Optional)
                </label>
                <input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => handleInputChange('eventTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-upnd-black border-b border-gray-200 pb-2">
              Location Details
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-upnd-black mb-2">
                Event Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                  errors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter venue name and address"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Province (Optional)
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                >
                  <option value="">Select province</option>
                  {zambianProvinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  District (Optional)
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                  placeholder="Enter district name"
                />
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-upnd-black border-b border-gray-200 pb-2">
              Organization Details
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Organizer *
                </label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => handleInputChange('organizer', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all ${
                    errors.organizer ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="UPND branch or official name"
                />
                {errors.organizer && (
                  <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-upnd-black mb-2">
                  Expected Attendees (Optional)
                </label>
                <input
                  type="number"
                  value={formData.expectedAttendees}
                  onChange={(e) => handleInputChange('expectedAttendees', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
                  placeholder="Estimated attendance"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* UPND Guidelines */}
          <div className="bg-upnd-yellow/10 border border-upnd-yellow/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-upnd-yellow" />
              <h4 className="font-semibold text-upnd-black">UPND Event Guidelines</h4>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• All UPND events must promote Unity, Work, and Progress values</li>
              <li>• Ensure events are inclusive and accessible to all community members</li>
              <li>• Follow UPND branding and messaging guidelines</li>
              <li>• Coordinate with local UPND leadership before scheduling</li>
              <li>• Maintain accurate records for reporting purposes</li>
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
              Create UPND Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}