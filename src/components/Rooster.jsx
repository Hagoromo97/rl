import React, { useState, useRef } from 'react';

/* ─── Data ─────────────────────────────────────────────── */
const STAFF = [
    { id:1, initials:'AF', name:'Ahmad Firdaus',   role:'Route Driver',       dept:'Driver',     color:'#6366f1' },
    { id:2, initials:'NA', name:'Nurul Asyiqin',   role:'Route Driver',       dept:'Driver',     color:'#ec4899' },
    { id:3, initials:'KA', name:'Khairul Azwan',   role:'Head Technician',    dept:'Technician', color:'#f59e0b' },
    { id:4, initials:'SR', name:'Siti Rohani',     role:'Office Admin',       dept:'Office',     color:'#10b981' },
    { id:5, initials:'MH', name:'Mohamad Hafiz',   role:'Route Driver',       dept:'Driver',     color:'#3b82f6' },
    { id:6, initials:'FH', name:'Faridah Harun',   role:'Field Technician',   dept:'Technician', color:'#a855f7' },
    { id:7, initials:'ZN', name:'Zulkifli Noor',   role:'Senior Driver',      dept:'Driver',     color:'#ef4444' },
    { id:8, initials:'AZ', name:'Amirah Zulkifly', role:'Operations Manager', dept:'Office',     color:'#0ea5e9' },
    { id:9, initials:'RI', name:'Roslan Ismail',   role:'Senior Driver',      dept:'Driver',     color:'#22c55e' },
];

/* Each shift: staffId, day 0=Mon…6=Sun, start/end hour (24h), label, type */
const SHIFTS = [
    { staffId:1, day:0, start:8,  end:17, label:'Route A',     type:'route'       },
    { staffId:1, day:1, start:8,  end:17, label:'Route A',     type:'route'       },
    { staffId:1, day:2, start:8,  end:13, label:'Route A',     type:'route'       },
    { staffId:1, day:3, start:8,  end:17, label:'Route A',     type:'route'       },
    { staffId:1, day:4, start:8,  end:17, label:'Route A',     type:'route'       },

    { staffId:2, day:0, start:9,  end:18, label:'Route B',     type:'route'       },
    { staffId:2, day:2, start:9,  end:18, label:'Route B',     type:'route'       },
    { staffId:2, day:4, start:9,  end:18, label:'Route B',     type:'route'       },
    { staffId:2, day:5, start:9,  end:14, label:'Route B',     type:'route'       },

    { staffId:3, day:1, start:8,  end:17, label:'Maintenance', type:'maintenance' },
    { staffId:3, day:2, start:8,  end:17, label:'Maintenance', type:'maintenance' },
    { staffId:3, day:4, start:8,  end:12, label:'Inspection',  type:'maintenance' },

    { staffId:4, day:0, start:8,  end:17, label:'Office',      type:'office'      },
    { staffId:4, day:1, start:8,  end:17, label:'Office',      type:'office'      },
    { staffId:4, day:2, start:8,  end:17, label:'Office',      type:'office'      },
    { staffId:4, day:3, start:8,  end:17, label:'Office',      type:'office'      },
    { staffId:4, day:4, start:8,  end:17, label:'Office',      type:'office'      },

    { staffId:5, day:0, start:7,  end:15, label:'Route D',     type:'route'       },
    { staffId:5, day:1, start:7,  end:15, label:'Route D',     type:'route'       },
    { staffId:5, day:3, start:7,  end:15, label:'Route D',     type:'route'       },
    { staffId:5, day:5, start:7,  end:12, label:'Route D',     type:'route'       },

    { staffId:6, day:0, start:0,  end:0,  label:'On Leave',    type:'leave'       },
    { staffId:6, day:1, start:0,  end:0,  label:'On Leave',    type:'leave'       },
    { staffId:6, day:2, start:0,  end:0,  label:'On Leave',    type:'leave'       },
    { staffId:6, day:3, start:0,  end:0,  label:'On Leave',    type:'leave'       },
    { staffId:6, day:4, start:0,  end:0,  label:'On Leave',    type:'leave'       },

    { staffId:7, day:0, start:8,  end:17, label:'Route F',     type:'route'       },
    { staffId:7, day:2, start:8,  end:17, label:'Route F',     type:'route'       },
    { staffId:7, day:4, start:8,  end:17, label:'Route F',     type:'route'       },
    { staffId:7, day:6, start:8,  end:13, label:'Route F',     type:'route'       },

    { staffId:8, day:0, start:9,  end:18, label:'Office',      type:'office'      },
    { staffId:8, day:1, start:9,  end:18, label:'Office',      type:'office'      },
    { staffId:8, day:2, start:9,  end:18, label:'Office',      type:'office'      },
    { staffId:8, day:3, start:9,  end:18, label:'Office',      type:'office'      },
    { staffId:8, day:4, start:9,  end:18, label:'Office',      type:'office'      },

    { staffId:9, day:1, start:6,  end:15, label:'Route B',     type:'route'       },
    { staffId:9, day:2, start:6,  end:15, label:'Route B',     type:'route'       },
    { staffId:9, day:3, start:6,  end:15, label:'Route B',     type:'route'       },
    { staffId:9, day:5, start:6,  end:12, label:'Route B',     type:'route'       },
];

const DAYS   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const TYPE_STYLE = {
    route:       { bg:'rgba(99,102,241,0.16)',  border:'#6366f1', text:'#6366f1' },
    maintenance: { bg:'rgba(245,158,11,0.16)',  border:'#f59e0b', text:'#b45309' },
    office:      { bg:'rgba(16,185,129,0.16)',  border:'#10b981', text:'#059669' },
    leave:       { bg:'rgba(100,116,139,0.10)', border:'#94a3b8', text:'#64748b' },
};

const DEPT_COLOR = { Driver:'#6366f1', Technician:'#f59e0b', Office:'#10b981' };

const ROUTE_DATA = [
    { code:'RTA', name:'Route A – Kuala Lumpur',  km:45 },
    { code:'RTB', name:'Route B – Petaling Jaya', km:32 },
    { code:'RTD', name:'Route D – Shah Alam',      km:28 },
    { code:'RTF', name:'Route F – Subang Jaya',   km:37 },
    { code:'RTC', name:'Route C – Cheras',         km:22 },
    { code:'RTE', name:'Route E – Klang',          km:51 },
];

/* ─── Helpers ─────────────────────────────────────────── */
function fmt(h){ return `${String(h).padStart(2,'0')}:00`; }

function getWeekDates(offset = 0) {
    const base = new Date(2026, 2, 2); // base: Mon 2 Mar 2026
    const mon  = new Date(base);
    mon.setDate(base.getDate() + offset * 7);
    return Array.from({length:7}, (_,i) => { const d = new Date(mon); d.setDate(mon.getDate()+i); return d; });
}

function navBtnStyle(darkMode){
    return {
        background:'transparent', border:'none', cursor:'pointer',
        padding:'0.3rem 0.6rem', borderRadius:'8px',
        color: darkMode ? '#94a3b8' : '#64748b',
        display:'flex', alignItems:'center', fontFamily:'inherit',
    };
}

/* ─── Main Component ──────────────────────────────────── */
export default function Rooster({ darkMode }) {
    const [weekOffset, setWeekOffset] = useState(0);
    const [viewMode,   setViewMode  ] = useState('Week');
    const [activeDay,  setActiveDay ] = useState(0);
    const [filterDept, setFilterDept] = useState('All');
    const [tooltip,      setTooltip     ] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settingsPage, setSettingsPage] = useState('menu');
    const [colCfg,       setColCfg      ] = useState(
        DAYS.map((d, i) => ({ dayIdx: i, label: d, visible: true }))
    );
    const [rowNums,      setRowNums     ] = useState({});
    const [sortingList,  setSortingList ] = useState([]);
    const headerScrollRef = useRef(null);

    /* ── Settings helpers ── */
    const goPage       = page => setSettingsPage(page);
    const closeSettings = () => { setSettingsOpen(false); setSettingsPage('menu'); };
    const toggleCol    = dayIdx => setColCfg(prev => prev.map(c => c.dayIdx === dayIdx ? { ...c, visible: !c.visible } : c));
    const moveCol      = (idx, dir) => setColCfg(prev => {
        const next = [...prev];
        const swap = idx + dir;
        if (swap < 0 || swap >= next.length) return prev;
        [next[idx], next[swap]] = [next[swap], next[idx]];
        return next;
    });
    const anyRowNum    = Object.values(rowNums).some(v => v);
    const saveRowCustomize = () => {
        const entries = Object.entries(rowNums)
            .filter(([, v]) => v)
            .map(([code, order]) => {
                const route = ROUTE_DATA.find(r => r.code === code);
                return { code, order: Number(order), name: route?.name || code, km: route?.km || 0 };
            })
            .sort((a, b) => a.order - b.order);
        setSortingList(entries);
        goPage('sorting');
    };

    const weekDates  = getWeekDates(weekOffset);
    const bg         = darkMode ? '#0f172a'  : '#f8fafc';
    const surface    = darkMode ? '#1e293b'  : '#ffffff';
    const border     = darkMode ? 'rgba(255,255,255,0.07)' : '#e2e8f0';
    const borderMd   = darkMode ? 'rgba(255,255,255,0.13)' : '#cbd5e1';
    const textMain   = darkMode ? '#f1f5f9'  : '#1e293b';
    const textSub    = darkMode ? '#94a3b8'  : '#64748b';
    const headerBg   = darkMode ? '#162032'  : '#f0f4ff';
    const hoverRow   = darkMode ? 'rgba(255,255,255,0.025)' : 'rgba(99,102,241,0.03)';

    const DAY_W   = 150;  // px per day column
    const ROW_H   = 54;
    const LABEL_W = 200;

    const visibleDays = viewMode === 'Day' ? [activeDay] : [0,1,2,3,4,5,6];
    const staffList   = STAFF.filter(s => filterDept === 'All' || s.dept === filterDept);

    /* index shifts by "staffId-day" */
    const shiftMap = {};
    SHIFTS.forEach(sh => {
        const k = `${sh.staffId}-${sh.day}`;
        (shiftMap[k] = shiftMap[k] || []).push(sh);
    });

    const totalActive = STAFF.filter(s => !SHIFTS.some(sh => sh.staffId === s.id && sh.type === 'leave')).length;

    return (
        <div style={{ width:'100%', maxWidth:'1200px', margin:'0 auto', fontFamily:'inherit' }}>
            <style>{`
                .fc-row:hover { background: ${hoverRow} !important; }
                .sh-block { transition: filter .15s, transform .15s; cursor: pointer; }
                .sh-block:hover { filter: brightness(1.12); transform: scaleY(1.05); z-index:10; }
                ::-webkit-scrollbar { height:6px; width:6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: ${darkMode ? 'rgba(255,255,255,0.15)' : '#cbd5e1'}; border-radius:99px; }
            `}</style>

            {/* ── HEADER BANNER ── */}
            <div style={{
                borderRadius:'20px',
                background:'linear-gradient(135deg,#3b82f6 0%,#6366f1 55%,#8b5cf6 100%)',
                padding:'1.75rem 2rem', marginBottom:'1.5rem',
                position:'relative', overflow:'hidden',
            }}>
                <div style={{ position:'absolute',top:'-50px',right:'-40px',width:'180px',height:'180px',borderRadius:'50%',background:'rgba(255,255,255,0.06)' }} />
                <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
                    <div>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.3rem' }}>
                            <i className="pi pi-users" style={{ color:'rgba(255,255,255,0.85)', fontSize:'1.1rem' }} />
                            <span style={{ color:'#fff', fontSize:'1.3rem', fontWeight:800 }}>Staff Roster</span>
                        </div>
                        <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.8rem' }}>
                            {weekDates[0].toLocaleDateString('en-MY',{day:'numeric',month:'short'})} –{' '}
                            {weekDates[6].toLocaleDateString('en-MY',{day:'numeric',month:'short',year:'numeric'})}
                        </div>
                    </div>
                    <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
                        {[
                            { icon:'pi-users',        val:STAFF.length,  lbl:'Staff'  },
                            { icon:'pi-check-circle', val:totalActive,   lbl:'Active' },
                            { icon:'pi-calendar',     val:SHIFTS.filter(s=>s.type!=='leave').length, lbl:'Shifts' },
                        ].map(c => (
                            <div key={c.lbl} style={{
                                display:'flex', alignItems:'center', gap:'6px',
                                background:'rgba(255,255,255,0.15)', backdropFilter:'blur(6px)',
                                borderRadius:'999px', padding:'5px 13px',
                                border:'1px solid rgba(255,255,255,0.2)',
                            }}>
                                <i className={`pi ${c.icon}`} style={{ color:'#fff', fontSize:'0.75rem' }} />
                                <span style={{ color:'#fff', fontSize:'0.78rem', fontWeight:700 }}>{c.val}</span>
                                <span style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.75rem' }}>{c.lbl}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── TOOLBAR ── */}
            <div style={{ display:'flex', alignItems:'center', gap:'0.65rem', marginBottom:'1rem', flexWrap:'wrap' }}>
                {/* Week nav */}
                <div style={{ display:'flex', alignItems:'center', gap:'2px', background:surface, border:`1px solid ${border}`, borderRadius:'12px', padding:'4px' }}>
                    <button onClick={() => setWeekOffset(w => w-1)} style={navBtnStyle(darkMode)}>
                        <i className="pi pi-chevron-left" style={{ fontSize:'0.75rem' }} />
                    </button>
                    <button onClick={() => setWeekOffset(0)} style={{ ...navBtnStyle(darkMode), fontSize:'0.75rem', fontWeight:700, padding:'0.3rem 0.7rem', color: weekOffset===0 ? '#6366f1' : '' }}>
                        Today
                    </button>
                    <button onClick={() => setWeekOffset(w => w+1)} style={navBtnStyle(darkMode)}>
                        <i className="pi pi-chevron-right" style={{ fontSize:'0.75rem' }} />
                    </button>
                </div>

                {/* View toggle */}
                <div style={{ display:'flex', background:surface, border:`1px solid ${border}`, borderRadius:'12px', padding:'4px', gap:'3px' }}>
                    {['Week','Day'].map(m => (
                        <button key={m} onClick={() => setViewMode(m)} style={{
                            padding:'0.3rem 0.85rem', borderRadius:'9px', border:'none', cursor:'pointer',
                            fontFamily:'inherit', fontSize:'0.78rem', fontWeight: viewMode===m ? 700 : 500,
                            background: viewMode===m ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                            color: viewMode===m ? '#fff' : textSub, transition:'all 0.18s',
                        }}>{m}</button>
                    ))}
                </div>

                {/* Day selector */}
                {viewMode === 'Day' && (
                    <div style={{ display:'flex', gap:'2px', background:surface, border:`1px solid ${border}`, borderRadius:'12px', padding:'4px' }}>
                        {DAYS.map((d,i) => (
                            <button key={d} onClick={() => setActiveDay(i)} style={{
                                padding:'0.3rem 0.6rem', borderRadius:'8px', border:'none', cursor:'pointer',
                                fontFamily:'inherit', fontSize:'0.75rem', fontWeight: activeDay===i ? 700 : 500,
                                background: activeDay===i ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                                color: activeDay===i ? '#fff' : textSub,
                            }}>{d}</button>
                        ))}
                    </div>
                )}

                {/* Dept filter — right side */}
                <div style={{ display:'flex', gap:'2px', background:surface, border:`1px solid ${border}`, borderRadius:'12px', padding:'4px', marginLeft:'auto' }}>
                    {['All','Driver','Technician','Office'].map(d => (
                        <button key={d} onClick={() => setFilterDept(d)} style={{
                            padding:'0.3rem 0.75rem', borderRadius:'9px', border:'none', cursor:'pointer',
                            fontFamily:'inherit', fontSize:'0.75rem', fontWeight: filterDept===d ? 700 : 500,
                            background: filterDept===d ? `${DEPT_COLOR[d] || '#6366f1'}22` : 'transparent',
                            color: filterDept===d ? (DEPT_COLOR[d] || '#6366f1') : textSub,
                            transition:'all 0.18s',
                        }}>{d}</button>
                    ))}
                </div>

            </div>

            {/* ── LEGEND ── */}
            <div style={{ display:'flex', gap:'0.85rem', marginBottom:'0.9rem', flexWrap:'wrap' }}>
                {Object.entries(TYPE_STYLE).map(([type, s]) => (
                    <div key={type} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                        <div style={{ width:'14px', height:'10px', borderRadius:'4px', background:s.bg, border:`1.5px solid ${s.border}` }} />
                        <span style={{ fontSize:'0.72rem', color:textSub, fontWeight:600, textTransform:'capitalize' }}>{type}</span>
                    </div>
                ))}
            </div>

            {/* ── TIMELINE TABLE ── */}
            <div style={{
                background:surface, borderRadius:'16px', border:`1px solid ${border}`,
                overflow:'hidden',
                boxShadow: darkMode ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)',
            }}>

                {/* Sticky column header row */}
                <div style={{ display:'flex', position:'sticky', top:0, zIndex:20, background:surface }}>
                    {/* Staff corner */}
                    <div style={{
                        width:LABEL_W, minWidth:LABEL_W,
                        borderBottom:`1.5px solid ${borderMd}`, borderRight:`1.5px solid ${borderMd}`,
                        padding:'0.55rem 0.9rem', background:headerBg,
                        display:'flex', alignItems:'center', gap:'6px',
                    }}>
                        <i className="pi pi-users" style={{ fontSize:'0.78rem', color:textSub }} />
                        <span style={{ fontSize:'0.72rem', fontWeight:700, color:textSub, textTransform:'uppercase', letterSpacing:'0.06em', flex:1 }}>
                            Staff ({staffList.length})
                        </span>
                        <button
                            onClick={() => setSettingsOpen(true)}
                            title="Table Settings"
                            style={{
                                width:'28px', height:'28px', borderRadius:'8px', border:'none',
                                background: darkMode ? 'rgba(99,102,241,0.18)' : 'rgba(99,102,241,0.1)',
                                color:'#6366f1', cursor:'pointer', flexShrink:0,
                                display:'flex', alignItems:'center', justifyContent:'center',
                                transition:'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = darkMode ? 'rgba(99,102,241,0.32)' : 'rgba(99,102,241,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = darkMode ? 'rgba(99,102,241,0.18)' : 'rgba(99,102,241,0.1)'}
                        >
                            <i className="pi pi-cog" style={{ fontSize:'0.78rem' }} />
                        </button>
                    </div>

                    {/* Scrollable day+hour headers (sync with body) */}
                    <div style={{ flex:1, overflow:'hidden' }} ref={headerScrollRef}>
                        <div style={{ display:'flex' }}>
                            {visibleDays.map(dayIdx => {
                                const date      = weekDates[dayIdx];
                                const isToday   = weekOffset===0 && dayIdx===0;
                                const isWeekend = dayIdx >= 5;
                                return (
                                    <div key={dayIdx} style={{
                                        minWidth: DAY_W, borderRight:`1px solid ${border}`,
                                        background: isWeekend ? (darkMode ? 'rgba(255,255,255,0.015)' : 'rgba(240,244,255,0.4)') : headerBg,
                                    }}>
                                        {/* Day column header */}
                                        <div style={{ padding:'0.5rem 0.75rem', borderBottom:`1.5px solid ${borderMd}`, display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' }}>
                                            <span style={{ fontSize:'0.72rem', fontWeight:800, color: isToday ? '#6366f1' : textSub, textTransform:'uppercase', letterSpacing:'0.05em' }}>{DAYS[dayIdx]}</span>
                                            <span style={{
                                                fontSize:'0.82rem', fontWeight:700,
                                                color: isToday ? '#fff' : textMain,
                                                background: isToday ? '#6366f1' : 'transparent',
                                                borderRadius: isToday ? '50%' : 0,
                                                width:'26px', height:'26px',
                                                display:'flex', alignItems:'center', justifyContent:'center',
                                            }}>
                                                {date.getDate()}
                                            </span>
                                            <span style={{ fontSize:'0.68rem', color: isToday ? '#6366f1' : textSub, fontWeight:500 }}>
                                                {date.toLocaleDateString('en-MY',{month:'short'})}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Body rows — horizontally scrollable */}
                <div style={{ overflowX:'auto' }}
                    onScroll={e => { if (headerScrollRef.current) headerScrollRef.current.scrollLeft = e.currentTarget.scrollLeft; }}
                >
                    {staffList.map((staff, ri) => (
                        <div key={staff.id} className="fc-row" style={{
                            display:'flex',
                            borderBottom: ri < staffList.length-1 ? `1px solid ${border}` : 'none',
                            minHeight: ROW_H, transition:'background 0.15s',
                        }}>
                            {/* Staff label — sticky left */}
                            <div style={{
                                width:LABEL_W, minWidth:LABEL_W,
                                borderRight:`1.5px solid ${borderMd}`,
                                padding:'0.45rem 0.75rem',
                                display:'flex', alignItems:'center', gap:'0.6rem',
                                background:surface, position:'sticky', left:0, zIndex:5,
                            }}>
                                <div style={{
                                    width:'32px', height:'32px', borderRadius:'50%', flexShrink:0,
                                    background:`linear-gradient(135deg,${staff.color},${staff.color}88)`,
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                    fontSize:'0.7rem', fontWeight:800, color:'#fff',
                                    boxShadow:`0 2px 6px ${staff.color}44`,
                                }}>{staff.initials}</div>
                                <div style={{ minWidth:0 }}>
                                    <div style={{ fontSize:'0.78rem', fontWeight:700, color:textMain, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{staff.name}</div>
                                    <div style={{ fontSize:'0.67rem', color:textSub, whiteSpace:'nowrap' }}>{staff.role}</div>
                                </div>
                            </div>

                            {/* Day cells */}
                            <div style={{ display:'flex', flex:1 }}>
                                {visibleDays.map(dayIdx => {
                                    const isWeekend = dayIdx >= 5;
                                    const dayShifts = shiftMap[`${staff.id}-${dayIdx}`] || [];
                                    const isLeave   = dayShifts.some(s => s.type === 'leave');
                                    return (
                                        <div key={dayIdx} style={{
                                            minWidth: DAY_W,
                                            borderRight:`1px solid ${border}`,
                                            display:'flex', flexDirection:'column',
                                            justifyContent:'center',
                                            padding:'5px 5px',
                                            gap:'3px',
                                            background: isWeekend ? (darkMode ? 'rgba(255,255,255,0.01)' : 'rgba(248,250,252,0.7)') : 'transparent',
                                        }}>
                                            {/* Leave bar */}
                                            {isLeave && (
                                                <div style={{
                                                    borderRadius:'7px',
                                                    background:TYPE_STYLE.leave.bg,
                                                    border:`1.5px dashed ${TYPE_STYLE.leave.border}`,
                                                    display:'flex', alignItems:'center',
                                                    padding:'5px 8px', gap:'5px',
                                                }}>
                                                    <i className="pi pi-moon" style={{ fontSize:'0.68rem', color:TYPE_STYLE.leave.text }} />
                                                    <span style={{ fontSize:'0.68rem', fontWeight:700, color:TYPE_STYLE.leave.text }}>On Leave</span>
                                                </div>
                                            )}

                                            {/* Shift pills */}
                                            {!isLeave && dayShifts.map((sh, si) => {
                                                const ts = TYPE_STYLE[sh.type] || TYPE_STYLE.route;
                                                return (
                                                    <div key={si} className="sh-block"
                                                        onMouseEnter={e => { const r=e.currentTarget.getBoundingClientRect(); setTooltip({x:r.left,y:r.top,sh,staff}); }}
                                                        onMouseLeave={() => setTooltip(null)}
                                                        style={{
                                                            borderRadius:'7px',
                                                            background:ts.bg, border:`1.5px solid ${ts.border}`,
                                                            display:'flex', alignItems:'center',
                                                            padding:'4px 7px', gap:'5px', overflow:'hidden',
                                                        }}
                                                    >
                                                        <div style={{ width:'3px', height:'16px', borderRadius:'99px', background:ts.border, flexShrink:0 }} />
                                                        <div style={{ minWidth:0 }}>
                                                            <div style={{ fontSize:'0.68rem', fontWeight:700, color:ts.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{sh.label}</div>
                                                            <div style={{ fontSize:'0.59rem', color:ts.text, opacity:0.75, whiteSpace:'nowrap' }}>{fmt(sh.start)}–{fmt(sh.end)}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Empty cell indicator */}
                                            {!isLeave && dayShifts.length === 0 && (
                                                <div style={{ height:'4px', borderRadius:'99px', background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── SETTINGS MODAL ── */}
            {settingsOpen && (
                <>
                    {/* Backdrop */}
                    <div onClick={closeSettings} style={{
                        position:'fixed', inset:0, zIndex:100,
                        background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)',
                    }} />
                    {/* Panel */}
                    <div style={{
                        position:'fixed', inset:0, zIndex:101,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        pointerEvents:'none',
                    }}>
                        <div style={{
                            pointerEvents:'all',
                            background:surface, borderRadius:'20px',
                            border:`1px solid ${border}`,
                            boxShadow:'0 24px 80px rgba(0,0,0,0.35)',
                            width:'min(95vw,900px)', maxHeight:'80vh',
                            display:'flex', flexDirection:'column',
                            overflow:'hidden',
                        }}>
                            <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
                                <div style={{
                                    display:'flex', width:'400%', flex:1,
                                    transition:'transform 0.3s cubic-bezier(.4,0,.2,1)',
                                    transform:`translateX(-${['menu','columns','rows','sorting'].indexOf(settingsPage) * 25}%)`,
                                }}>
                                    {/* ─── PAGE 0: MENU ─── */}
                                    <div style={{ width:'25%', display:'flex', flexDirection:'column' }}>
                                        {/* Header */}
                                        <div style={{
                                            padding:'1.2rem 1.4rem 1rem',
                                            borderBottom:`1px solid ${border}`,
                                            display:'flex', alignItems:'center', justifyContent:'space-between',
                                    }}>
                                        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                                            <div style={{
                                                width:'34px', height:'34px', borderRadius:'10px',
                                                background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                                display:'flex', alignItems:'center', justifyContent:'center',
                                            }}>
                                                <i className="pi pi-cog" style={{ color:'#fff', fontSize:'0.9rem' }} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize:'0.95rem', fontWeight:800, color:textMain }}>Settings</div>
                                                <div style={{ fontSize:'0.72rem', color:textSub }}>Customise your table view</div>
                                            </div>
                                        </div>
                                        <button onClick={closeSettings} style={{
                                            background:'transparent', border:'none', cursor:'pointer',
                                            width:'30px', height:'30px', borderRadius:'50%',
                                            display:'flex', alignItems:'center', justifyContent:'center',
                                            color:textSub,
                                        }}>
                                            <i className="pi pi-times" style={{ fontSize:'0.85rem' }} />
                                        </button>
                                    </div>

                                    {/* Menu items */}
                                    <div style={{ padding:'0.9rem 1rem', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                                        {[
                                            { key:'columns', icon:'pi-table',     iconColor:'#6366f1', label:'Column Customize',  desc:'Toggle & reorder table columns'      },
                                            { key:'rows',    icon:'pi-list',      iconColor:'#10b981', label:'Row Customize',     desc:'Set sorting order for rows'          },
                                            { key:'sorting', icon:'pi-sort-alt',  iconColor:'#f59e0b', label:'Sorting List',      desc:'View saved row sorting list'         },
                                        ].map(item => (
                                            <button
                                                key={item.key}
                                                onClick={() => goPage(item.key)}
                                                style={{
                                                    display:'flex', alignItems:'center', gap:'1rem',
                                                    padding:'0.85rem 1rem', borderRadius:'14px',
                                                    border:`1px solid ${border}`,
                                                    background: darkMode ? 'rgba(255,255,255,0.025)' : '#f8fafc',
                                                    cursor:'pointer', textAlign:'left', width:'100%',
                                                    transition:'all 0.16s',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor=item.iconColor; e.currentTarget.style.background=`${item.iconColor}12`; }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor=border; e.currentTarget.style.background= darkMode ? 'rgba(255,255,255,0.025)' : '#f8fafc'; }}
                                            >
                                                <div style={{
                                                    width:'40px', height:'40px', borderRadius:'12px',
                                                    background:`${item.iconColor}18`, flexShrink:0,
                                                    display:'flex', alignItems:'center', justifyContent:'center',
                                                }}>
                                                    <i className={`pi ${item.icon}`} style={{ fontSize:'1rem', color:item.iconColor }} />
                                                </div>
                                                <div style={{ flex:1 }}>
                                                    <div style={{ fontSize:'0.85rem', fontWeight:700, color:textMain }}>{item.label}</div>
                                                    <div style={{ fontSize:'0.72rem', color:textSub, marginTop:'2px' }}>{item.desc}</div>
                                                </div>
                                                <i className="pi pi-chevron-right" style={{ fontSize:'0.72rem', color:textSub }} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* ─── PAGE 1: COLUMN CUSTOMIZE ─── */}
                                <div style={{ width:'25%', display:'flex', flexDirection:'column' }}>
                                    {/* Header */}
                                    <div style={{
                                        padding:'1.2rem 1.4rem 1rem',
                                        borderBottom:`1px solid ${border}`,
                                        display:'flex', alignItems:'center', gap:'0.7rem',
                                    }}>
                                        <button onClick={() => goPage('menu')} style={{
                                            background:`rgba(99,102,241,0.12)`, border:'none', cursor:'pointer',
                                            width:'32px', height:'32px', borderRadius:'50%',
                                            display:'flex', alignItems:'center', justifyContent:'center',
                                            color:'#6366f1', flexShrink:0,
                                        }}>
                                            <i className="pi pi-chevron-left" style={{ fontSize:'0.8rem' }} />
                                        </button>
                                        <div>
                                            <div style={{ fontSize:'0.92rem', fontWeight:800, color:textMain }}>Column Customize</div>
                                            <div style={{ fontSize:'0.72rem', color:textSub }}>Toggle visibility &amp; reorder columns</div>
                                        </div>
                                    </div>

                                    {/* Column list */}
                                    <div style={{ flex:1, overflowY:'auto', padding:'0.75rem 1rem', display:'flex', flexDirection:'column', gap:'0.4rem', maxHeight:'55vh' }}>
                                        {colCfg.map((col, idx) => (
                                            <div key={col.dayIdx} style={{
                                                display:'flex', alignItems:'center', gap:'0.7rem',
                                                padding:'0.6rem 0.8rem', borderRadius:'11px',
                                                border:`1px solid ${col.visible ? 'rgba(99,102,241,0.35)' : border}`,
                                                background: col.visible
                                                    ? (darkMode ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.05)')
                                                    : (darkMode ? 'rgba(255,255,255,0.02)' : '#f8fafc'),
                                                transition:'all 0.16s',
                                            }}>
                                                {/* Checkbox */}
                                                <div
                                                    onClick={() => toggleCol(col.dayIdx)}
                                                    style={{
                                                        width:'18px', height:'18px', borderRadius:'5px', flexShrink:0,
                                                        border:`2px solid ${col.visible ? '#6366f1' : borderMd}`,
                                                        background: col.visible ? '#6366f1' : 'transparent',
                                                        cursor:'pointer',
                                                        display:'flex', alignItems:'center', justifyContent:'center',
                                                        transition:'all 0.16s',
                                                    }}
                                                >
                                                    {col.visible && <i className="pi pi-check" style={{ fontSize:'0.6rem', color:'#fff' }} />}
                                                </div>

                                                {/* Label */}
                                                <span style={{
                                                    flex:1, fontSize:'0.84rem', fontWeight:600,
                                                    color: col.visible ? textMain : textSub,
                                                }}>{ col.label } <span style={{ fontSize:'0.68rem', color:textSub }}>({DAYS[col.dayIdx]})</span></span>

                                                {/* Up / Down */}
                                                <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                                                    <button
                                                        onClick={() => moveCol(idx, -1)}
                                                        disabled={idx === 0}
                                                        style={{
                                                            width:'22px', height:'22px', borderRadius:'6px',
                                                            border:`1px solid ${border}`, background:'transparent',
                                                            cursor: idx === 0 ? 'default' : 'pointer',
                                                            display:'flex', alignItems:'center', justifyContent:'center',
                                                            color: idx === 0 ? border : textSub, padding:0,
                                                        }}
                                                    >
                                                        <i className="pi pi-chevron-up" style={{ fontSize:'0.58rem' }} />
                                                    </button>
                                                    <button
                                                        onClick={() => moveCol(idx, 1)}
                                                        disabled={idx === colCfg.length - 1}
                                                        style={{
                                                            width:'22px', height:'22px', borderRadius:'6px',
                                                            border:`1px solid ${border}`, background:'transparent',
                                                            cursor: idx === colCfg.length - 1 ? 'default' : 'pointer',
                                                            display:'flex', alignItems:'center', justifyContent:'center',
                                                            color: idx === colCfg.length - 1 ? border : textSub, padding:0,
                                                        }}
                                                    >
                                                        <i className="pi pi-chevron-down" style={{ fontSize:'0.58rem' }} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer hint */}
                                    <div style={{ padding:'0.7rem 1rem', borderTop:`1px solid ${border}`, fontSize:'0.72rem', color:textSub, textAlign:'center' }}>
                                        <i className="pi pi-info-circle" style={{ marginRight:'4px' }} />
                                        Changes apply immediately to the table
                                    </div>
                                </div>

                                {/* ─── PAGE 2: ROW CUSTOMIZE ─── */}
                                <div style={{ width:'25%', display:'flex', flexDirection:'column' }}>
                                    {/* Header */}
                                    <div style={{
                                        padding:'1.2rem 1.4rem 1rem',
                                        borderBottom:`1px solid ${border}`,
                                        display:'flex', alignItems:'center', gap:'0.7rem',
                                    }}>
                                        <button onClick={() => goPage('menu')} style={{
                                            background:`rgba(16,185,129,0.12)`, border:'none', cursor:'pointer',
                                            width:'32px', height:'32px', borderRadius:'50%',
                                            display:'flex', alignItems:'center', justifyContent:'center',
                                            color:'#10b981', flexShrink:0,
                                        }}>
                                            <i className="pi pi-chevron-left" style={{ fontSize:'0.8rem' }} />
                                        </button>
                                        <div>
                                            <div style={{ fontSize:'0.92rem', fontWeight:800, color:textMain }}>Row Customize</div>
                                            <div style={{ fontSize:'0.72rem', color:textSub }}>Enter sort order number for each route</div>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div style={{ flex:1, overflowY:'auto', maxHeight:'55vh' }}>
                                        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.8rem' }}>
                                            <thead>
                                                <tr style={{ background: darkMode ? 'rgba(255,255,255,0.04)' : '#f0f4ff' }}>
                                                    {['#', 'Code', 'Name', 'Km'].map(h => (
                                                        <th key={h} style={{
                                                            padding:'0.55rem 0.8rem', textAlign:'left',
                                                            fontSize:'0.68rem', fontWeight:700,
                                                            textTransform:'uppercase', letterSpacing:'0.05em',
                                                            color:textSub, borderBottom:`1.5px solid ${borderMd}`,
                                                            whiteSpace:'nowrap',
                                                        }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ROUTE_DATA.map((row, ri) => (
                                                    <tr key={row.code} style={{
                                                        borderBottom:`1px solid ${border}`,
                                                        background: ri % 2 === 0 ? 'transparent' : (darkMode ? 'rgba(255,255,255,0.015)' : 'rgba(248,250,252,0.6)'),
                                                    }}>
                                                        {/* Order input */}
                                                        <td style={{ padding:'0.45rem 0.6rem 0.45rem 0.8rem', width:'52px' }}>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={rowNums[row.code] || ''}
                                                                onChange={e => setRowNums(prev => ({ ...prev, [row.code]: e.target.value }))}
                                                                placeholder="–"
                                                                style={{
                                                                    width:'42px', padding:'0.3rem 0.4rem',
                                                                    borderRadius:'7px', textAlign:'center',
                                                                    border:`1.5px solid ${rowNums[row.code] ? '#10b981' : border}`,
                                                                    background: darkMode ? '#0f172a' : '#fff',
                                                                    color:textMain, fontSize:'0.8rem',
                                                                    outline:'none', fontFamily:'inherit',
                                                                }}
                                                            />
                                                        </td>
                                                        <td style={{ padding:'0.45rem 0.5rem', color:'#10b981', fontWeight:700 }}>{row.code}</td>
                                                        <td style={{ padding:'0.45rem 0.5rem', color:textMain }}>{row.name}</td>
                                                        <td style={{ padding:'0.45rem 0.8rem 0.45rem 0.5rem', color:textSub, whiteSpace:'nowrap' }}>{row.km} km</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Footer Save — visible only when any number filled */}
                                    <div style={{
                                        padding:'0.8rem 1rem',
                                        borderTop:`1px solid ${border}`,
                                        display:'flex', justifyContent:'flex-end', gap:'0.6rem',
                                        background: anyRowNum
                                            ? (darkMode ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.05)')
                                            : 'transparent',
                                        transition:'background 0.3s',
                                    }}>
                                        <button
                                            onClick={() => setRowNums({})}
                                            style={{
                                                padding:'0.45rem 1rem', borderRadius:'9px', border:`1px solid ${border}`,
                                                background:'transparent', color:textSub, cursor:'pointer',
                                                fontFamily:'inherit', fontSize:'0.8rem', fontWeight:600,
                                            }}
                                        >
                                            Clear
                                        </button>
                                        <button
                                            onClick={saveRowCustomize}
                                            disabled={!anyRowNum}
                                            style={{
                                                padding:'0.45rem 1.2rem', borderRadius:'9px', border:'none',
                                                background: anyRowNum ? 'linear-gradient(135deg,#10b981,#059669)' : border,
                                                color: anyRowNum ? '#fff' : textSub,
                                                cursor: anyRowNum ? 'pointer' : 'default',
                                                fontFamily:'inherit', fontSize:'0.8rem', fontWeight:700,
                                                display:'flex', alignItems:'center', gap:'5px',
                                                transition:'all 0.2s',
                                            }}
                                        >
                                            <i className="pi pi-save" style={{ fontSize:'0.78rem' }} />
                                            Save
                                        </button>
                                    </div>
                                </div>

                                {/* ─── PAGE 3: SORTING LIST ─── */}
                                <div style={{ width:'25%', display:'flex', flexDirection:'column' }}>
                                    {/* Header */}
                                    <div style={{
                                        padding:'1.2rem 1.4rem 1rem',
                                        borderBottom:`1px solid ${border}`,
                                        display:'flex', alignItems:'center', gap:'0.7rem',
                                    }}>
                                        <button onClick={() => goPage('menu')} style={{
                                            background:`rgba(245,158,11,0.12)`, border:'none', cursor:'pointer',
                                            width:'32px', height:'32px', borderRadius:'50%',
                                            display:'flex', alignItems:'center', justifyContent:'center',
                                            color:'#f59e0b', flexShrink:0,
                                        }}>
                                            <i className="pi pi-chevron-left" style={{ fontSize:'0.8rem' }} />
                                        </button>
                                        <div>
                                            <div style={{ fontSize:'0.92rem', fontWeight:800, color:textMain }}>Sorting List</div>
                                            <div style={{ fontSize:'0.72rem', color:textSub }}>Saved from Row Customize</div>
                                        </div>
                                    </div>

                                    {/* List */}
                                    <div style={{ flex:1, overflowY:'auto', maxHeight:'55vh', padding:'0.75rem 1rem' }}>
                                        {sortingList.length === 0 ? (
                                            <div style={{ textAlign:'center', padding:'3rem 1rem', color:textSub }}>
                                                <i className="pi pi-inbox" style={{ fontSize:'2rem', opacity:0.3, display:'block', marginBottom:'0.5rem' }} />
                                                <div style={{ fontSize:'0.82rem' }}>No saved sorting list yet.</div>
                                                <div style={{ fontSize:'0.74rem', marginTop:'4px', opacity:0.7 }}>Go to Row Customize to add one.</div>
                                            </div>
                                        ) : (
                                            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                                                {sortingList.map((item, i) => (
                                                    <div key={item.code} style={{
                                                        display:'flex', alignItems:'center', gap:'0.75rem',
                                                        padding:'0.65rem 0.9rem', borderRadius:'12px',
                                                        border:`1px solid ${border}`,
                                                        background: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                                    }}>
                                                        {/* Order badge */}
                                                        <div style={{
                                                            width:'32px', height:'32px', borderRadius:'50%',
                                                            background:'linear-gradient(135deg,#f59e0b,#d97706)',
                                                            display:'flex', alignItems:'center', justifyContent:'center',
                                                            fontSize:'0.78rem', fontWeight:800, color:'#fff', flexShrink:0,
                                                        }}>{item.order}</div>
                                                        <div style={{ flex:1, minWidth:0 }}>
                                                            <div style={{
                                                                fontSize:'0.82rem', fontWeight:700, color:textMain,
                                                                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                                                            }}>{item.name}</div>
                                                            <div style={{ fontSize:'0.7rem', color:textSub, marginTop:'1px' }}>
                                                                <span style={{ color:'#10b981', fontWeight:700 }}>{item.code}</span>
                                                                <span style={{ margin:'0 4px' }}>·</span>
                                                                {item.km} km
                                                            </div>
                                                        </div>
                                                        <span style={{
                                                            fontSize:'0.68rem', fontWeight:700, color:'#f59e0b',
                                                            background:'rgba(245,158,11,0.12)', padding:'2px 8px', borderRadius:'99px',
                                                        }}>#{i + 1}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div style={{ padding:'0.7rem 1rem', borderTop:`1px solid ${border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                        <span style={{ fontSize:'0.72rem', color:textSub }}>
                                            {sortingList.length} route{sortingList.length !== 1 ? 's' : ''} sorted
                                        </span>
                                        <button
                                            onClick={() => goPage('rows')}
                                            style={{
                                                padding:'0.38rem 0.9rem', borderRadius:'8px', border:`1px solid ${border}`,
                                                background:'transparent', color:textSub, cursor:'pointer',
                                                fontFamily:'inherit', fontSize:'0.75rem', fontWeight:600,
                                                display:'flex', alignItems:'center', gap:'4px',
                                            }}
                                        >
                                            <i className="pi pi-pencil" style={{ fontSize:'0.7rem' }} />
                                            Edit
                                        </button>
                                    </div>
                                </div>

                                </div>{/* /slider */}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── TOOLTIP ── */}
            {tooltip && (
                <div style={{
                    position:'fixed', left:tooltip.x+12, top:tooltip.y-8, zIndex:9999,
                    background:surface, border:`1px solid ${border}`, borderRadius:'12px',
                    padding:'0.8rem 1rem', boxShadow:'0 8px 32px rgba(0,0,0,0.2)',
                    minWidth:'170px', pointerEvents:'none',
                }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'6px' }}>
                        <div style={{
                            width:'26px', height:'26px', borderRadius:'50%',
                            background:`linear-gradient(135deg,${tooltip.staff.color},${tooltip.staff.color}88)`,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:'0.62rem', fontWeight:800, color:'#fff',
                        }}>{tooltip.staff.initials}</div>
                        <div>
                            <div style={{ fontSize:'0.78rem', fontWeight:700, color:textMain }}>{tooltip.staff.name}</div>
                            <div style={{ fontSize:'0.65rem', color:textSub }}>{tooltip.staff.role}</div>
                        </div>
                    </div>
                    <div style={{ height:'1px', background:border, margin:'4px 0 6px' }} />
                    {[
                        { icon:'pi-tag',   val:tooltip.sh.label },
                        { icon:'pi-clock', val:`${fmt(tooltip.sh.start)} – ${fmt(tooltip.sh.end)}` },
                        { icon:'pi-list',  val:tooltip.sh.type.charAt(0).toUpperCase()+tooltip.sh.type.slice(1) },
                    ].map(r => (
                        <div key={r.icon} style={{ display:'flex', alignItems:'center', gap:'5px', marginBottom:'3px' }}>
                            <i className={`pi ${r.icon}`} style={{ fontSize:'0.67rem', color:textSub }} />
                            <span style={{ fontSize:'0.74rem', color:textMain }}>{r.val}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
