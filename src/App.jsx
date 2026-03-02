import React, { useState } from 'react';
import AdvancedDemo, { cardDatasets } from './components/AdvancedDemo';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import AllLocations from './components/AllLocations';
import Rooster from './components/Rooster';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('Home');
  const [hasChanges, setHasChanges] = useState(false);
  const [exitPending, setExitPending] = useState(false);
  const [allCards, setAllCards] = useState(cardDatasets);

  const handleToggleEditMode = () => {
    if (editMode) {
      if (hasChanges) {
        setExitPending(true);
      } else {
        setEditMode(false);
      }
    } else {
      setEditMode(true);
    }
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    // Exit edit mode when navigating away from Route List
    if (page !== 'Route List' && editMode) {
      if (hasChanges) {
        setExitPending(true);
      } else {
        setEditMode(false);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode ? '#0c1120' : '#f4f6fb',
      transition: 'background 0.35s ease',
    }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        editMode={editMode}
        onToggleEditMode={handleToggleEditMode}
        activeItem={activePage}
        onNavigate={handleNavigate}
      />
      <Navbar
        darkMode={darkMode}
        editMode={editMode}
        activePage={activePage}
        onOpenSidebar={() => setSidebarOpen(true)}
      />

      <div style={{ padding: '1.75rem 1.25rem 2.5rem', maxWidth: '100%' }}>

        {activePage === 'Home' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <HomePage darkMode={darkMode} onNavigate={handleNavigate} />
          </div>
        )}

        {activePage === 'Route List' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <AdvancedDemo
              darkMode={darkMode}
              editMode={editMode}
              onResumeEditMode={() => setEditMode(true)}
              onHasChanges={setHasChanges}
              exitPending={exitPending}
              onCardsChange={setAllCards}
              onExitDecision={(decision) => {
                if (decision === 'exit') { setEditMode(false); setHasChanges(false); }
                setExitPending(false);
              }}
            />
          </div>
        )}

        {activePage === 'All Locations' && (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <AllLocations darkMode={darkMode} cards={allCards} />
          </div>
        )}

        {activePage === 'Rooster' && (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Rooster darkMode={darkMode} />
          </div>
        )}

        {!['Home', 'Route List', 'All Locations', 'Rooster'].includes(activePage) && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '0.85rem' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              border: darkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="pi pi-wrench" style={{ fontSize: '1.25rem', color: darkMode ? '#334155' : '#94a3b8' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: darkMode ? '#e2e8f0' : '#1e293b', marginBottom: '4px' }}>{activePage}</div>
              <div style={{ fontSize: '0.8rem', color: darkMode ? '#475569' : '#94a3b8' }}>This page is under construction.</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
