import React from 'react';

const STAT_CARDS = [
    { icon: 'pi-map',        label: 'Total Routes',     value: '6',   color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
    { icon: 'pi-map-marker', label: 'Total Locations',  value: '148', color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
    { icon: 'pi-box',        label: 'Vending Machines', value: '24',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
    { icon: 'pi-truck',      label: 'Active Deliveries',value: '12',  color: '#3b82f6', bg: 'rgba(59,130,246,0.1)'  },
];

const QUICK_LINKS = [
    { icon: 'pi-list',       label: 'Route List',    desc: 'View and manage delivery routes',       color: '#6366f1', page: 'Route List'    },
    { icon: 'pi-map-marker', label: 'All Locations', desc: 'Browse all vending machine locations',  color: '#10b981', page: 'All Locations' },
    { icon: 'pi-calendar',   label: 'Calendar',      desc: 'View scheduled deliveries',             color: '#f59e0b', page: 'Calendar'      },
    { icon: 'pi-users',      label: 'Rooster',       desc: 'Manage staff roster and shifts',        color: '#3b82f6', page: 'Rooster'       },
];

export default function HomePage({ darkMode, onNavigate }) {
    const textMain = darkMode ? '#e2e8f0' : '#1e293b';
    const textSub  = darkMode ? '#64748b' : '#64748b';
    const cardBg   = darkMode ? '#121c2e' : '#ffffff';
    const border   = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
    const cardShadow = darkMode ? 'none' : '0 1px 4px rgba(0,0,0,0.06)';

    return (
        <div style={{ width: '100%', maxWidth: '920px', margin: '0 auto' }}>

            {/* Hero */}
            <div style={{
                borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 45%, #3b82f6 100%)',
                padding: '2rem 2rem',
                position: 'relative',
            }}>
                <div style={{
                    position: 'absolute', top: '-50px', right: '-50px',
                    width: '200px', height: '200px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-40px', left: '60%',
                    width: '140px', height: '140px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)',
                    pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{
                        margin: '0 0 0.75rem', color: 'rgba(255,255,255,0.65)',
                        fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    }}>
                        Vending Management System
                    </p>
                    <h1 style={{ margin: '0 0 0.45rem', color: '#fff', fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.025em' }}>
                        Welcome back 👋
                    </h1>
                    <p style={{ margin: '0 0 1.4rem', color: 'rgba(255,255,255,0.68)', fontSize: '0.875rem', maxWidth: '380px', lineHeight: 1.65 }}>
                        Manage routes, vending machines, and locations — all in one place.
                    </p>
                    <button
                        onClick={() => onNavigate?.('Route List')}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.52rem 1.1rem', borderRadius: '8px',
                            background: 'rgba(255,255,255,0.16)',
                            border: '1px solid rgba(255,255,255,0.28)',
                            color: '#fff', fontSize: '0.82rem', fontWeight: 700,
                            cursor: 'pointer', transition: 'background 0.18s',
                            backdropFilter: 'blur(6px)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.24)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
                    >
                        <i className="pi pi-list" style={{ fontSize: '0.72rem' }} /> View Route List
                    </button>
                </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {STAT_CARDS.map(s => (
                    <div key={s.label} style={{
                        background: cardBg, borderRadius: '12px',
                        border: `1px solid ${border}`,
                        padding: '1.1rem 1.2rem',
                        boxShadow: cardShadow,
                        display: 'flex', alignItems: 'center', gap: '0.9rem',
                        transition: 'box-shadow 0.2s',
                    }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                            background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <i className={`pi ${s.icon}`} style={{ fontSize: '1rem', color: s.color }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: textMain, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.value}</div>
                            <div style={{ fontSize: '0.73rem', fontWeight: 500, color: textSub, marginTop: '3px' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick links */}
            <div style={{ marginBottom: '0.5rem' }}>
                <p style={{
                    margin: '0 0 0.75rem', fontSize: '0.65rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em', color: textSub,
                }}>Quick Access</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(196px, 1fr))', gap: '0.7rem' }}>
                    {QUICK_LINKS.map(q => (
                        <button
                            key={q.label}
                            onClick={() => onNavigate?.(q.page)}
                            style={{
                                background: cardBg, borderRadius: '12px',
                                border: `1px solid ${border}`,
                                padding: '1rem 1.1rem',
                                boxShadow: cardShadow,
                                display: 'flex', alignItems: 'flex-start', gap: '0.8rem',
                                cursor: 'pointer', textAlign: 'left',
                                transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = `0 6px 20px ${q.color}1e`;
                                e.currentTarget.style.borderColor = `${q.color}40`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = cardShadow;
                                e.currentTarget.style.borderColor = border;
                            }}
                        >
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
                                background: `${q.color}16`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <i className={`pi ${q.icon}`} style={{ fontSize: '0.95rem', color: q.color }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: textMain, marginBottom: '3px' }}>{q.label}</div>
                                <div style={{ fontSize: '0.73rem', color: textSub, lineHeight: 1.5 }}>{q.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}
