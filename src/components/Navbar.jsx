import React from 'react';

export default function Navbar({ darkMode, editMode, activePage, onOpenSidebar }) {
    const textMuted = darkMode ? '#475569' : '#94a3b8';
    const textMain  = darkMode ? '#e2e8f0' : '#1e293b';
    const borderCol = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 9999,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.25rem',
            height: '60px',
            background: darkMode ? 'rgba(12,17,32,0.85)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderBottom: editMode
                ? '1px solid rgba(99,102,241,0.35)'
                : `1px solid ${borderCol}`,
            boxShadow: editMode
                ? '0 1px 0 rgba(99,102,241,0.12), 0 2px 12px rgba(99,102,241,0.08)'
                : darkMode
                    ? '0 1px 0 rgba(255,255,255,0.04)'
                    : '0 1px 0 rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.03)',
            transition: 'border-color 0.25s, box-shadow 0.25s, background 0.35s',
        }}>
            {/* Left: hamburger + divider + breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                    onClick={onOpenSidebar}
                    aria-label="Open sidebar"
                    style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: '4px',
                        transition: 'background 0.18s', flexShrink: 0, padding: 0,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    {[18, 18, 13].map((w, i) => (
                        <span key={i} style={{
                            display: 'block', width: `${w}px`, height: '1.5px',
                            borderRadius: '2px', background: textMuted,
                        }} />
                    ))}
                </button>

                <div style={{ width: '1px', height: '18px', background: borderCol, flexShrink: 0 }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 500, color: textMuted }}>Home</span>
                    {activePage && activePage !== 'Home' && (
                        <>
                            <i className="pi pi-chevron-right" style={{ fontSize: '0.5rem', color: darkMode ? '#2d3f5e' : '#d1d9e6' }} />
                            <span style={{ fontSize: '0.81rem', fontWeight: 700, color: textMain }}>{activePage}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Right */}
            {editMode ? (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.32rem',
                    padding: '0.28rem 0.65rem', borderRadius: '20px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                    fontSize: '0.69rem', fontWeight: 700, color: '#fff',
                    letterSpacing: '0.04em',
                    boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
                }}>
                    <i className="pi pi-pencil" style={{ fontSize: '0.6rem' }} />
                    Editing
                </div>
            ) : (
                <div style={{ width: '32px' }} />
            )}
        </nav>
    );
}
