'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import Dashboard from '../Dashboard/page';
import { MembersList } from '../Members/MembersList';
import { MemberApproval } from '../Members/MemberApproval';
import { EventsManagement } from '../Events/EventsManagement';
import { GeoMapping } from '../GeoMapping/GeoMapping';
import { Communications } from '../Communications/Communications';
import { DisciplinaryManagement } from '../Disciplinary/DisciplinaryManagement';
import { MembershipCards } from '../MembershipCards/MembershipCards';
import { Reports } from '../Reports/Reports';
import { Settings } from '../Settings/Settings';

export function AuthenticatedLayout() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'members':
        return <MembersList />;
      case 'approval':
        return <MemberApproval />;
      case 'events':
        return <EventsManagement />;
      case 'geomapping':
        return <GeoMapping />;
      case 'communications':
        return <Communications />;
      case 'disciplinary':
        return <DisciplinaryManagement />;
      case 'membership-cards':
        return <MembershipCards />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
