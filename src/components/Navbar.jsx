import React from 'react';
import { Button } from 'primereact/button';

export default function Navbar({ darkMode, onToggle, editMode, onToggleEditMode }) {
    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 9999,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            height: '64px',
            background: darkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: editMode
                ? '1px solid #6366f155'
                : darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: editMode ? '0 2px 16px rgba(99,102,241,0.18)' : '0 2px 16px rgba(0,0,0,0.07)',
            transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <i className="pi pi-box" style={{ color: '#fff', fontSize: '1rem' }} />
                </div>
                <span style={{
                    fontWeight: 700, fontSize: '1.1rem',
                    color: darkMode ? '#f1f5f9' : '#1e293b',
                    letterSpacing: '-0.02em'
                }}>
                    CardUI
                </span>
            </div>

            {/* Right controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Edit Mode toggle */}
                <button
                    onClick={onToggleEditMode}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.38rem 0.9rem', borderRadius: '8px',
                        fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: editMode ? '1.5px solid #6366f1' : `1.5px solid ${darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`,
                        background: editMode
                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                            : darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                        color: editMode ? '#fff' : darkMode ? '#94a3b8' : '#64748b',
                        boxShadow: editMode ? '0 2px 10px rgba(99,102,241,0.35)' : 'none',
                    }}
                >
                    <i className={`pi ${editMode ? 'pi-lock-open' : 'pi-lock'}`} style={{ fontSize: '0.75rem' }} />
                    {editMode ? 'Editing' : 'Edit Mode'}
                </button>

                {/* Dark mode toggle */}
                <Button
                    icon={darkMode ? 'pi pi-sun' : 'pi pi-moon'}
                    rounded
                    text
                    onClick={onToggle}
                    style={{
                        color: darkMode ? '#fbbf24' : '#6366f1',
                        fontSize: '1.2rem',
                        transition: 'color 0.3s',
                    }}
                />
            </div>
        </nav>
    );
}
