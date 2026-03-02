import React, { useEffect, useState, useCallback, memo } from 'react';

const NAV_ITEMS = [
    { icon: 'pi-home',       label: 'Home'            },
    { icon: 'pi-box',        label: 'Vending Machine', submenu: [
        { icon: 'pi-list',       label: 'Route List'    },
        { icon: 'pi-map-marker', label: 'All Locations' },
    ]},
    { icon: 'pi-calendar',   label: 'Full Calendar', submenu: [
        { icon: 'pi-calendar',   label: 'Calendar' },
        { icon: 'pi-users',      label: 'Rooster'  },
    ]},
    { icon: 'pi-cog',        label: 'Settings'        },
];

// Memoised so parent style changes don't re-render every nav button
const NavButton = memo(function NavButton({ item, isActive, isSubmenuActive, isExpanded, darkMode, hoverBg, activeBg, textMain, textSub, onClickMain, children }) {
    const active = isActive || isSubmenuActive;
    return (
        <div>
            <button
                onClick={onClickMain}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.7rem',
                    padding: '0.55rem 0.8rem', borderRadius: '9px',
                    background: active ? activeBg : 'transparent',
                    border: 'none', cursor: 'pointer',
                    color: active ? '#6366f1' : textMain,
                    fontWeight: active ? 650 : 500,
                    fontSize: '0.855rem',
                    transition: 'background 0.15s, color 0.15s',
                    marginBottom: '1px', textAlign: 'left',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = hoverBg; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
                <div style={{
                    width: '30px', height: '30px', borderRadius: '7px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: active
                        ? 'linear-gradient(135deg, #6366f1, #7c3aed)'
                        : (darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                    transition: 'background 0.15s',
                }}>
                    <i className={`pi ${item.icon}`} style={{ fontSize: '0.8rem', color: active ? '#fff' : textSub }} />
                </div>
                <span style={{ flex: 1, letterSpacing: '-0.01em' }}>{item.label}</span>
                {item.submenu && (
                    <i className="pi pi-chevron-right sidebar-chevron"
                        data-open={String(!!isExpanded)}
                        style={{ fontSize: '0.55rem', color: textSub, opacity: 0.7 }} />
                )}
            </button>
            {children}
        </div>
    );
});

export default function Sidebar({ open, onClose, darkMode, onToggleDark, editMode, onToggleEditMode, activeItem, onNavigate }) {
    // Accordion: only one submenu open at a time (null = all closed)
    const [openItem, setOpenItem] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const toggleExpand = useCallback((label) => {
        setOpenItem(prev => (prev === label ? null : label));
    }, []);

    // Auto-open parent when a child route is active
    useEffect(() => {
        NAV_ITEMS.forEach(item => {
            if (item.submenu?.some(s => s.label === activeItem)) {
                setOpenItem(prev => (prev === item.label ? prev : item.label));
            }
        });
    }, [activeItem]);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    const bg       = darkMode ? '#0d1424' : '#ffffff';
    const border   = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
    const textMain = darkMode ? '#e2e8f0' : '#1e293b';
    const textSub  = darkMode ? '#4a5e78' : '#94a3b8';
    const hoverBg  = darkMode ? 'rgba(255,255,255,0.055)' : 'rgba(0,0,0,0.04)';
    const activeBg = darkMode ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)';

    return (
        <>
            {/* ── Backdrop: opacity only — no blur (blur transition causes lag) ── */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, zIndex: 10000,
                    background: 'rgba(0,0,0,0.45)',
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? 'auto' : 'none',
                    transition: mounted ? 'opacity 0.25s ease' : 'none',
                }}
            />

            {/* ── Drawer ── */}
            <aside style={{
                position: 'fixed', top: 0, left: 0,
                height: '100dvh', width: '265px', zIndex: 10001,
                display: 'flex', flexDirection: 'column',
                background: bg,
                borderRight: `1px solid ${border}`,
                boxShadow: '6px 0 40px rgba(0,0,0,0.16)',
                transform: open ? 'translate3d(0,0,0)' : 'translate3d(-265px,0,0)',
                transition: mounted ? 'transform 0.28s cubic-bezier(0.4,0,0.2,1)' : 'none',
                willChange: 'transform',
                contain: 'layout style',
            }}>

                {/* Header */}
                <div style={{
                    height: '60px', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '0 1rem',
                    borderBottom: `1px solid ${border}`, flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '9px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <i className="pi pi-box" style={{ color: '#fff', fontSize: '0.85rem' }} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: textMain, letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                                Data Brutal
                            </div>
                            <div style={{ fontSize: '0.63rem', color: textSub, fontWeight: 500, marginTop: '1px' }}>Delivery Management</div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: '28px', height: '28px', borderRadius: '7px', border: 'none',
                            background: 'transparent',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: textSub, flexShrink: 0, transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <i className="pi pi-times" style={{ fontSize: '0.7rem' }} />
                    </button>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0.6rem 0.5rem', overscrollBehavior: 'contain' }}>
                    <p style={{
                        fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.1em', color: textSub,
                        padding: '0 0.5rem 0.5rem', margin: 0, opacity: 0.75,
                    }}>Navigation</p>

                    {NAV_ITEMS.map((item) => {
                        const isActive        = activeItem === item.label;
                        const hasSubmenu      = !!item.submenu?.length;
                        const isExpanded      = openItem === item.label;
                        const isSubmenuActive = hasSubmenu && item.submenu.some(s => s.label === activeItem);

                        return (
                            <NavButton
                                key={item.label}
                                item={item}
                                isActive={isActive}
                                isSubmenuActive={isSubmenuActive}
                                isExpanded={isExpanded}
                                darkMode={darkMode}
                                hoverBg={hoverBg}
                                activeBg={activeBg}
                                textMain={textMain}
                                textSub={textSub}
                                onClickMain={() => {
                                    if (hasSubmenu) toggleExpand(item.label);
                                    else { onNavigate?.(item.label); onClose(); }
                                }}
                            >
                                {hasSubmenu && (
                                    <div className="sidebar-submenu" data-open={String(isExpanded)}>
                                        <div className="sidebar-submenu-inner">
                                            <div className="sidebar-submenu-list">
                                                {item.submenu.map(sub => {
                                                    const isSubActive = activeItem === sub.label;
                                                    return (
                                                        <button
                                                            key={sub.label}
                                                            onClick={() => { onNavigate?.(sub.label); onClose(); }}
                                                            style={{
                                                                width: '100%', display: 'flex', alignItems: 'center', gap: '0.55rem',
                                                                padding: '0.42rem 0.7rem', borderRadius: '7px',
                                                                background: isSubActive ? activeBg : 'transparent',
                                                                border: 'none', cursor: 'pointer',
                                                                color: isSubActive ? '#6366f1' : textMain,
                                                                fontWeight: isSubActive ? 650 : 450,
                                                                fontSize: '0.815rem',
                                                                transition: 'background 0.15s, color 0.15s',
                                                                textAlign: 'left',
                                                            }}
                                                            onMouseEnter={e => { if (!isSubActive) e.currentTarget.style.background = hoverBg; }}
                                                            onMouseLeave={e => { if (!isSubActive) e.currentTarget.style.background = 'transparent'; }}
                                                        >
                                                            <i className={`pi ${sub.icon}`} style={{ fontSize: '0.65rem', color: isSubActive ? '#6366f1' : textSub, flexShrink: 0 }} />
                                                            {sub.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </NavButton>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div style={{
                    padding: '0.75rem', borderTop: `1px solid ${border}`,
                    flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem',
                }}>
                    <p style={{
                        fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.1em', color: textSub, margin: '0 0 0.2rem 0.3rem',
                        opacity: 0.75,
                    }}>Preferences</p>

                    {/* Dark Mode */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.5rem 0.8rem', borderRadius: '9px',
                        background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
                        border: `1px solid ${border}`,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className={`pi ${darkMode ? 'pi-sun' : 'pi-moon'}`}
                                style={{ fontSize: '0.8rem', color: darkMode ? '#fbbf24' : '#6366f1' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textMain }}>
                                {darkMode ? 'Light Mode' : 'Dark Mode'}
                            </span>
                        </div>
                        <button
                            onClick={onToggleDark}
                            aria-label="Toggle dark mode"
                            style={{
                                width: '38px', height: '22px', borderRadius: '11px', border: 'none',
                                backgroundColor: darkMode ? '#6366f1' : '#e2e8f0',
                                cursor: 'pointer', position: 'relative', flexShrink: 0,
                                transition: 'background-color 0.22s',
                            }}
                        >
                            <span style={{
                                position: 'absolute', top: '3px',
                                left: darkMode ? '19px' : '3px',
                                width: '16px', height: '16px', borderRadius: '50%',
                                background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.22)',
                                transition: 'left 0.22s cubic-bezier(0.4,0,0.2,1)',
                            }} />
                        </button>
                    </div>

                    {/* Edit Mode */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.5rem 0.8rem', borderRadius: '9px',
                        background: editMode
                            ? (darkMode ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.06)')
                            : (darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)'),
                        border: `1px solid ${editMode ? 'rgba(99,102,241,0.28)' : border}`,
                        transition: 'background 0.2s, border-color 0.2s',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className={`pi ${editMode ? 'pi-pencil' : 'pi-lock'}`}
                                style={{ fontSize: '0.8rem', color: editMode ? '#6366f1' : textSub }} />
                            <div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: editMode ? '#6366f1' : textMain }}>Edit Mode</div>
                                {editMode && <div style={{ fontSize: '0.65rem', color: '#6366f1', opacity: 0.65, marginTop: '1px' }}>Changes are live</div>}
                            </div>
                        </div>
                        <button
                            onClick={onToggleEditMode}
                            aria-label="Toggle edit mode"
                            style={{
                                width: '38px', height: '22px', borderRadius: '11px', border: 'none',
                                backgroundColor: editMode ? '#6366f1' : (darkMode ? '#1e2d42' : '#e2e8f0'),
                                cursor: 'pointer', position: 'relative', flexShrink: 0,
                                transition: 'background-color 0.22s',
                            }}
                        >
                            <span style={{
                                position: 'absolute', top: '3px',
                                left: editMode ? '19px' : '3px',
                                width: '16px', height: '16px', borderRadius: '50%',
                                background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.22)',
                                transition: 'left 0.22s cubic-bezier(0.4,0,0.2,1)',
                            }} />
                        </button>
                    </div>

                    {/* User card */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                        padding: '0.5rem 0.7rem', borderRadius: '9px',
                        background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        border: `1px solid ${border}`, marginTop: '0.05rem',
                    }}>
                        <div style={{
                            width: '30px', height: '30px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <i className="pi pi-user" style={{ color: '#fff', fontSize: '0.75rem' }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain }}>User</div>
                            <div style={{ fontSize: '0.65rem', color: textSub }}>v1.0.0</div>
                        </div>
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
                            <span style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: 600 }}>Online</span>
                        </div>
                    </div>
                </div>

            </aside>
        </>
    );
}

