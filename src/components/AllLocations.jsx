import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

export default function AllLocations({ darkMode, cards = [] }) {
    const textMain  = darkMode ? '#f1f5f9' : '#1e293b';
    const textSub   = darkMode ? '#94a3b8' : '#64748b';
    const bg        = darkMode ? '#1e293b' : '#ffffff';
    const pageBg    = darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc';
    const border    = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const headerBg  = darkMode ? '#0f172a' : '#f1f5f9';
    const rowHoverBg = darkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc';
    const frozenBg  = darkMode ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.06)';

    // ── Flatten all rows from all cards ────────────────────────────────────
    const allRows = useMemo(() => {
        const result = [];
        cards.forEach(card => {
            (card.rows || []).forEach(row => {
                result.push({
                    ...row,
                    route: card.title,
                    routeColor: card.markerColor,
                    uid: `${card.title}||${row.code}||${row.no}`,
                });
            });
        });
        const sorted = result.sort((a, b) => parseFloat(a.code) - parseFloat(b.code));
        return sorted.map((r, i) => ({ ...r, _globalNo: i + 1 }));
    }, [cards]);

    // ── Locked (frozen/pinned) rows ────────────────────────────────────────
    const [lockedRows, setLockedRows]   = useState([]);
    const [unlockedRows, setUnlockedRows] = useState(allRows);

    // Sync when cards data changes (e.g. after editing in Route List)
    useEffect(() => {
        const lockedUids = new Set(lockedRows.map(r => r.uid));
        setUnlockedRows(allRows.filter(r => !lockedUids.has(r.uid)));
        // Update locked row data in case values changed, drop rows that no longer exist
        setLockedRows(prev =>
            prev
                .map(lr => allRows.find(r => r.uid === lr.uid) || null)
                .filter(Boolean)
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allRows]);

    // ── Search ─────────────────────────────────────────────────────────────
    const [search, setSearch] = useState('');
    const [routeFilter, setRouteFilter] = useState('All');

    const routeOptions = useMemo(() => ['All', ...cards.map(c => c.title)], [cards]);

    const applyFilter = (rows) => {
        let result = rows;
        if (routeFilter !== 'All') result = result.filter(r => r.route === routeFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(r =>
                r.name?.toLowerCase().includes(q) ||
                r.code?.toLowerCase().includes(q) ||
                r.route?.toLowerCase().includes(q) ||
                r.delivery?.toLowerCase().includes(q)
            );
        }
        return result;
    };

    const filteredUnlocked = useMemo(() => applyFilter(unlockedRows), [unlockedRows, search, routeFilter]);
    const filteredLocked   = useMemo(() => applyFilter(lockedRows),   [lockedRows,   search, routeFilter]);

    // ── Lock / Unlock ──────────────────────────────────────────────────────
    const toggleLock = (rowData, isFrozen, indexInFiltered) => {
        if (isFrozen) {
            // Find actual index in lockedRows (not filtered)
            const realIdx = lockedRows.findIndex(r => r.uid === rowData.uid);
            const newLocked = lockedRows.filter((_, i) => i !== realIdx);
            const newUnlocked = [...unlockedRows, rowData].sort((a, b) => parseFloat(a.code) - parseFloat(b.code));
            setLockedRows(newLocked);
            setUnlockedRows(newUnlocked);
        } else {
            const realIdx = unlockedRows.findIndex(r => r.uid === rowData.uid);
            const newUnlocked = unlockedRows.filter((_, i) => i !== realIdx);
            const newLocked = [...lockedRows, rowData];
            setLockedRows(newLocked);
            setUnlockedRows(newUnlocked);
        }
    };

    // ── Columns ────────────────────────────────────────────────────────────
    const cols = [
        { key: 'no',       label: '#',        width: '52px',  align: 'center' },
        { key: 'code',     label: 'Code',      width: '80px',  align: 'center' },
        { key: 'name',     label: 'Name',      width: 'auto',  align: 'center' },
        { key: 'route',    label: 'Route',     width: '140px', align: 'center' },
        { key: 'delivery', label: 'Delivery',  width: '100px', align: 'center' },
        { key: 'km',       label: 'KM',        width: '70px',  align: 'center' },
        { key: '_lock',    label: '',          width: '52px',  align: 'center' },
    ];

    const deliveryColor = (d) => {
        if (!d) return textSub;
        const map = { Daily: '#22c55e', Weekday: '#3b82f6', 'Alt 1': '#f59e0b', 'Alt 2': '#f97316' };
        return map[d] || textSub;
    };

    const renderCellValue = (row, key) => {
        if (key === 'route') {
            return (
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '2px 8px', borderRadius: '20px',
                    background: row.routeColor ? `${row.routeColor}22` : 'transparent',
                    border: `1px solid ${row.routeColor ?? '#6366f1'}44`,
                    fontSize: '0.75rem', fontWeight: 600, color: row.routeColor ?? '#6366f1',
                    whiteSpace: 'nowrap', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: row.routeColor, flexShrink: 0 }} />
                    {row.route}
                </span>
            );
        }
        if (key === 'delivery') {
            return (
                <span style={{
                    fontSize: '0.75rem', fontWeight: 600, color: deliveryColor(row.delivery),
                    background: `${deliveryColor(row.delivery)}18`, borderRadius: '20px',
                    padding: '2px 8px',
                }}>
                    {row.delivery}
                </span>
            );
        }
        if (key === 'km') return <span style={{ fontWeight: 600, color: textSub }}>{row.km}</span>;
        if (key === 'no') return <span style={{ fontWeight: 700, color: textSub, fontSize: '0.78rem' }}>{row._globalNo}</span>;
        if (key === 'code') return <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.82rem', color: '#6366f1' }}>{row.code}</span>;
        return row[key] ?? '—';
    };

    const renderRow = (row, isFrozen, idx, stickyTop) => (
        <tr
            key={row.uid + (isFrozen ? '-f' : '-u')}
            ref={isFrozen ? el => { pinnedRowRefs.current[idx] = el; } : undefined}
            style={{
                background: isFrozen ? frozenBg : 'transparent',
                borderBottom: `1px solid ${border}`,
                transition: 'background 0.15s',
                ...(isFrozen && stickyTop !== undefined ? {
                    position: 'sticky',
                    top: stickyTop,
                    zIndex: 9 - idx,
                    boxShadow: `0 2px 8px rgba(0,0,0,${darkMode ? '0.35' : '0.10'})`,
                } : {}),
            }}
            onMouseEnter={e => { if (!isFrozen) e.currentTarget.style.background = rowHoverBg; }}
            onMouseLeave={e => { if (!isFrozen) e.currentTarget.style.background = 'transparent'; }}
        >
            {cols.map(col => (
                <td key={col.key} style={{
                    padding: '0.55rem 0.75rem',
                    textAlign: col.align,
                    width: col.width === 'auto' ? undefined : col.width,
                    fontSize: '0.84rem',
                    color: textMain,
                    whiteSpace: 'nowrap',
                }}>
                    {col.key === '_lock' ? (
                        <button
                            title={isFrozen ? 'Unpin row' : lockedRows.length >= 5 ? 'Max 5 pinned' : 'Pin row'}
                            disabled={!isFrozen && lockedRows.length >= 5}
                            onClick={() => toggleLock(row, isFrozen, idx)}
                            style={{
                                width: 28, height: 28, borderRadius: 7,
                                border: isFrozen
                                    ? '1px solid #6366f155'
                                    : `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                                background: isFrozen
                                    ? 'rgba(99,102,241,0.15)'
                                    : (darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc'),
                                cursor: lockedRows.length >= 5 && !isFrozen ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                opacity: lockedRows.length >= 5 && !isFrozen ? 0.4 : 1,
                                transition: 'all 0.15s',
                            }}
                        >
                            <i className={`pi ${isFrozen ? 'pi-lock' : 'pi-lock-open'}`}
                               style={{ fontSize: '0.7rem', color: isFrozen ? '#6366f1' : textSub }} />
                        </button>
                    ) : renderCellValue(row, col.key)}
                </td>
            ))}
        </tr>
    );

    const totalCount = allRows.length;
    const shownCount = filteredLocked.length + filteredUnlocked.length;

    // ── Measure header + pinned row heights for sticky top calculation ──────
    const headerRowRef = useRef(null);
    const pinnedRowRefs = useRef([]);
    const [stickyTops, setStickyTops] = useState([]);

    useLayoutEffect(() => {
        const headerH = headerRowRef.current?.getBoundingClientRect().height ?? 38;
        const tops = [];
        let cumulative = headerH;
        filteredLocked.forEach((_, i) => {
            tops.push(cumulative);
            const rowH = pinnedRowRefs.current[i]?.getBoundingClientRect().height ?? 40;
            cumulative += rowH;
        });
        setStickyTops(tops);
    }, [filteredLocked.length, filteredLocked]);

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', width: '100%', padding: '0 1.5rem', boxSizing: 'border-box' }}>

            {/* ── Header ── */}
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: textMain, margin: 0, letterSpacing: '-0.03em' }}>
                    All Locations
                </h1>
                <p style={{ fontSize: '0.84rem', color: textSub, margin: '4px 0 0' }}>
                    Aggregated from all route cards · {totalCount} location{totalCount !== 1 ? 's' : ''}
                </p>
            </div>

            {/* ── Toolbar ── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap',
                marginBottom: '1rem',
            }}>
                {/* Search */}
                <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
                    <i className="pi pi-search" style={{
                        position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)',
                        fontSize: '0.78rem', color: textSub, pointerEvents: 'none',
                    }} />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search name, code, route…"
                        style={{
                            width: '100%', padding: '0.48rem 0.75rem 0.48rem 2rem',
                            borderRadius: 9, border: `1px solid ${border}`,
                            background: bg, color: textMain, fontSize: '0.83rem',
                            outline: 'none', boxSizing: 'border-box',
                        }}
                    />
                    {search && (
                        <button onClick={() => setSearch('')} style={{
                            position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer', color: textSub,
                            display: 'flex', padding: 2,
                        }}>
                            <i className="pi pi-times" style={{ fontSize: '0.7rem' }} />
                        </button>
                    )}
                </div>

                {/* Route filter */}
                <select
                    value={routeFilter}
                    onChange={e => setRouteFilter(e.target.value)}
                    style={{
                        padding: '0.48rem 0.75rem', borderRadius: 9,
                        border: `1px solid ${border}`, background: bg,
                        color: textMain, fontSize: '0.83rem', cursor: 'pointer', outline: 'none',
                    }}
                >
                    {routeOptions.map(r => <option key={r}>{r}</option>)}
                </select>

                {/* Stats chips */}
                {lockedRows.length > 0 && (
                    <span style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '0.3rem 0.7rem', borderRadius: 20,
                        background: 'rgba(99,102,241,0.12)',
                        border: '1px solid rgba(99,102,241,0.25)',
                        fontSize: '0.76rem', fontWeight: 700, color: '#6366f1',
                    }}>
                        <i className="pi pi-lock" style={{ fontSize: '0.65rem' }} />
                        {lockedRows.length} pinned
                        <button
                            onClick={() => {
                                setUnlockedRows(prev => [...prev, ...lockedRows].sort((a, b) => {
                                    if (a.route < b.route) return -1;
                                    if (a.route > b.route) return 1;
                                    return a.no - b.no;
                                }));
                                setLockedRows([]);
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', fontSize: '0.7rem', padding: '0 2px', marginLeft: 2 }}
                        >
                            <i className="pi pi-times" />
                        </button>
                    </span>
                )}
            </div>

            {/* ── Table card ── */}
            {totalCount === 0 ? (
                <div style={{
                    background: bg, borderRadius: 16, border: `1px solid ${border}`,
                    padding: '3rem', textAlign: 'center',
                }}>
                    <i className="pi pi-map-marker" style={{ fontSize: '2.5rem', color: darkMode ? '#334155' : '#cbd5e1', marginBottom: '0.75rem', display: 'block' }} />
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: textMain, marginBottom: 4 }}>No locations yet</div>
                    <div style={{ fontSize: '0.82rem', color: textSub }}>Add stops to your routes in the Route List.</div>
                </div>
            ) : (
                <div style={{
                    background: bg, borderRadius: 16, border: `1px solid ${border}`,
                    overflow: 'hidden',
                    boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.25)' : '0 4px 20px rgba(0,0,0,0.06)',
                }}>
                    {/* Scrollable table */}
                    <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 520 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                            {/* Column header — sticky top: 0 */}
                            <thead>
                                <tr ref={headerRowRef} style={{ background: headerBg, position: 'sticky', top: 0, zIndex: 12 }}>
                                    {cols.map(col => (
                                        <th key={col.key} style={{
                                            padding: '0.65rem 0.75rem', textAlign: col.align,
                                            width: col.width === 'auto' ? undefined : col.width,
                                            fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                                            letterSpacing: '0.07em', color: textSub,
                                            borderBottom: `2px solid ${border}`,
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {/* Pinned rows — sticky, stacked below header */}
                                {filteredLocked.map((row, idx) =>
                                    renderRow(row, true, idx, stickyTops[idx] ?? (38 + idx * 40))
                                )}

                                {/* Separator */}
                                {filteredLocked.length > 0 && filteredUnlocked.length > 0 && (
                                    <tr style={{
                                        position: 'sticky',
                                        top: (stickyTops[filteredLocked.length - 1] ?? (38 + (filteredLocked.length - 1) * 40)) + 40,
                                        zIndex: 8,
                                    }}>
                                        <td colSpan={cols.length} style={{ padding: 0 }}>
                                            <div style={{
                                                height: 3,
                                                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                                                opacity: 0.45,
                                            }} />
                                        </td>
                                    </tr>
                                )}

                                {/* Normal rows */}
                                {filteredUnlocked.length === 0 && filteredLocked.length === 0 ? (
                                    <tr>
                                        <td colSpan={cols.length} style={{ padding: '2.5rem', textAlign: 'center', color: textSub, fontSize: '0.84rem' }}>
                                            <i className="pi pi-search" style={{ fontSize: '1.5rem', display: 'block', marginBottom: 8, opacity: 0.4 }} />
                                            No results for "{search}"
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUnlocked.map((row, idx) => renderRow(row, false, idx))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: '0.6rem 1rem',
                        borderTop: `1px solid ${border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: headerBg,
                    }}>
                        <span style={{ fontSize: '0.75rem', color: textSub }}>
                            {shownCount} of {totalCount} location{totalCount !== 1 ? 's' : ''}
                            {routeFilter !== 'All' && ` · ${routeFilter}`}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: textSub }}>
                            {lockedRows.length > 0 && `${lockedRows.length} pinned · `}
                            {cards.length} route{cards.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
