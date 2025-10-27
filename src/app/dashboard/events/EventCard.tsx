import React from 'react';
import { UPNDEvent } from '../../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface EventCardProps {
  event: UPNDEvent;
  onViewDetails: () => void;
  onUpdateEvent: (eventId: string, updates: Partial<UPNDEvent>) => void;
}

export function EventCard({ event, onViewDetails, onUpdateEvent }: EventCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Active':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-upnd-yellow bg-upnd-yellow/10 border-upnd-yellow/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'Active':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const isUpcoming = new Date(event.eventDate) >= new Date();
  const daysTillEvent = Math.ceil((new Date(event.eventDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border-l-4 border-upnd-red">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-upnd-black">{event.eventName}</h3>
            <p className="text-sm text-gray-600">{event.eventType}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium border rounded-full ${getStatusColor(event.status)}`}>
          {getStatusIcon(event.status)}
          <span>{event.status}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date(event.eventDate).toLocaleDateString()}</span>
          {event.eventTime && (
            <>
              <Clock className="w-4 h-4 ml-2" />
              <span>{event.eventTime}</span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>
            {event.actualAttendees 
              ? `${event.actualAttendees} attended` 
              : `${event.expectedAttendees || 0} expected`
            }
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-700 line-clamp-2">{event.description}</p>
      </div>

      <div className="bg-upnd-yellow/10 border border-upnd-yellow/20 rounded-lg p-3 mb-4">
        <div className="text-xs font-semibold text-upnd-red mb-1">Organizer</div>
        <div className="text-sm font-medium text-upnd-black">{event.organizer}</div>
      </div>

      {isUpcoming && daysTillEvent <= 7 && daysTillEvent > 0 && (
        <div className="mb-4 p-2 bg-upnd-red/10 border border-upnd-red/20 rounded-lg">
          <p className="text-xs text-upnd-red font-medium">
            📅 Upcoming in {daysTillEvent} day{daysTillEvent !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={onViewDetails}
          className="flex items-center space-x-2 px-4 py-2 bg-upnd-red text-white rounded-lg hover:bg-upnd-red-dark transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>

        {event.status === 'Planned' && (
          <div className="flex space-x-2">
            <button
              onClick={() => onUpdateEvent(event.id, { status: 'Active' })}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Start
            </button>
            <button
              onClick={() => onUpdateEvent(event.id, { status: 'Cancelled' })}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        )}

        {event.status === 'Active' && (
          <button
            onClick={() => onUpdateEvent(event.id, { status: 'Completed' })}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Complete
          </button>
        )}
      </div>
    </div>
  );
}