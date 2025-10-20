import React, { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../context/AuthContext';
import { EventCard } from './EventCard';
import { EventModal } from './EventModal';
import { NewEventModal } from './NewEventModal';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Shield,
  MapPin,
  Users,
  Clock
} from 'lucide-react';
import { UPNDEvent } from '../../types';

export function EventsManagement() {
  const { events, addEvent, updateEvent, loading } = useEvents();
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<UPNDEvent | null>(null);
  const [showNewEventModal, setShowNewEventModal] = useState(false);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesProvince = provinceFilter === 'all' || event.province === provinceFilter;
    
    return matchesSearch && matchesStatus && matchesProvince;
  });

  const eventStats = {
    total: events.length,
    planned: events.filter(e => e.status === 'Planned').length,
    active: events.filter(e => e.status === 'Active').length,
    completed: events.filter(e => e.status === 'Completed').length,
    upcoming: events.filter(e => {
      const today = new Date().toISOString().split('T')[0];
      return e.eventDate >= today && e.status !== 'Cancelled';
    }).length
  };

  const provinces = Array.from(new Set(events.map(e => e.province).filter(Boolean)));

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
          <h1 className="text-3xl font-bold text-upnd-black">UPND Events Management</h1>
          <p className="text-upnd-yellow font-medium">Unity, Work, Progress - Event Coordination</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasPermission('manage_events') && (
            <button
              onClick={() => setShowNewEventModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>New Event</span>
            </button>
          )}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-upnd-red to-upnd-yellow px-4 py-2 rounded-lg">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
              alt="UPND Logo"
              className="w-6 h-6 object-contain"
            />
            <span className="text-white font-semibold">{events.length} Total Events</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-red">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Total Events</h3>
              <p className="text-3xl font-bold text-upnd-red mt-2">{eventStats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-upnd-red" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-upnd-yellow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Upcoming</h3>
              <p className="text-3xl font-bold text-upnd-yellow mt-2">{eventStats.upcoming}</p>
            </div>
            <Clock className="w-8 h-8 text-upnd-yellow" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Completed</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{eventStats.completed}</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-upnd-black">Provinces</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{provinces.length}</p>
            </div>
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
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
              <option value="all">All Statuses</option>
              <option value="Planned">Planned</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent appearance-none"
            >
              <option value="all">All Provinces</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* UPND Event Guidelines */}
      <div className="bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">UPND Event Principles</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Unity</h4>
            <p className="text-sm text-white/90">Bringing together all Zambians through inclusive events</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Work</h4>
            <p className="text-sm text-white/90">Productive events that advance party objectives and community development</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Progress</h4>
            <p className="text-sm text-white/90">Progressive events that promote democratic participation and social advancement</p>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onViewDetails={() => setSelectedEvent(event)}
            onUpdateEvent={updateEvent}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No events found</h3>
          <p className="text-gray-400">
            {events.length === 0 
              ? 'No UPND events have been scheduled yet'
              : 'Try adjusting your search criteria'
            }
          </p>
        </div>
      )}

      {/* Modals */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdateEvent={updateEvent}
        />
      )}

      {showNewEventModal && (
        <NewEventModal
          onClose={() => setShowNewEventModal(false)}
          onCreateEvent={addEvent}
        />
      )}
    </div>
  );
}