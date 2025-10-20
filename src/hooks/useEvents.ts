import { useState, useEffect } from 'react';
import { UPNDEvent } from '../types';

// Mock data for UPND events
const generateMockEvents = (): UPNDEvent[] => {
  const events: UPNDEvent[] = [];
  const eventTypes = ['Rally', 'Meeting', 'Training', 'Conference', 'Workshop', 'Campaign'];
  const provinces = ['Lusaka', 'Copperbelt', 'Central', 'Eastern', 'Southern', 'Western', 'Northern', 'Luapula', 'North-Western', 'Muchinga'];
  const statuses: UPNDEvent['status'][] = ['Planned', 'Active', 'Completed', 'Cancelled'];
  
  for (let i = 1; i <= 20; i++) {
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 60) - 30); // Events within ±30 days
    
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    
    events.push({
      id: `event-${i}`,
      eventName: `UPND ${eventTypes[Math.floor(Math.random() * eventTypes.length)]} ${i}`,
      eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      description: `Important UPND event focusing on Unity, Work, Progress principles and community engagement in ${province} Province.`,
      eventDate: eventDate.toISOString().split('T')[0],
      eventTime: `${Math.floor(Math.random() * 12) + 8}:00`,
      location: `${province} Community Center, ${province} Province`,
      province,
      district: 'Sample District',
      organizer: `UPND ${province} Branch`,
      expectedAttendees: Math.floor(Math.random() * 500) + 50,
      actualAttendees: eventDate < new Date() ? Math.floor(Math.random() * 400) + 30 : undefined,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  
  return events.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
};

export function useEvents() {
  const [events, setEvents] = useState<UPNDEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockEvents = generateMockEvents();
      setEvents(mockEvents);
      setLoading(false);
    }, 800);
  }, []);

  const addEvent = (eventData: Partial<UPNDEvent>) => {
    const newEvent: UPNDEvent = {
      id: `event-${Date.now()}`,
      eventName: eventData.eventName || '',
      eventType: eventData.eventType || '',
      description: eventData.description || '',
      eventDate: eventData.eventDate || new Date().toISOString().split('T')[0],
      eventTime: eventData.eventTime,
      location: eventData.location || '',
      province: eventData.province,
      district: eventData.district,
      organizer: eventData.organizer || '',
      expectedAttendees: eventData.expectedAttendees,
      actualAttendees: eventData.actualAttendees,
      status: 'Planned'
    };
    
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  };

  const updateEvent = (eventId: string, updates: Partial<UPNDEvent>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? { ...event, ...updates }
          : event
      )
    );
  };

  const getEventById = (id: string): UPNDEvent | undefined => {
    return events.find(event => event.id === id);
  };

  const getUpcomingEvents = (): UPNDEvent[] => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.eventDate >= today && event.status !== 'Cancelled');
  };

  const getEventsByProvince = (province: string): UPNDEvent[] => {
    return events.filter(event => event.province === province);
  };

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    getEventById,
    getUpcomingEvents,
    getEventsByProvince
  };
}