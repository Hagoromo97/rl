import React, { useState } from 'react';
import AdvancedDemo from './components/AdvancedDemo';
import Navbar from './components/Navbar';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
      transition: 'background 0.4s',
    }}>
      <Navbar darkMode={darkMode} onToggle={() => setDarkMode(d => !d)} editMode={editMode} onToggleEditMode={() => setEditMode(e => !e)} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', flexWrap: 'wrap' }}>
        <AdvancedDemo darkMode={darkMode} editMode={editMode} />
      </div>
    </div>
  );
}
