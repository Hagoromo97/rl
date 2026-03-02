import React, { useState } from 'react';

const STAFF = [
  {
    id: 1,
    name: 'Ahmad Razif',
    role: 'Driver',
    dept: 'Delivery',
    phone: '012-3456789',
    email: 'razif@vm.my',
    shift: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    routes: ['Route A', 'Route B'],
    status: 'Active',
    avatar: 'AR',
    color: '#6366f1',
  },
  {
    id: 2,
    name: 'Siti Nora',
    role: 'Technician',
    dept: 'Maintenance',
    phone: '013-9876543',
    email: 'nora@vm.my',
    shift: ['Mon', 'Wed', 'Fri'],
    routes: ['Route C'],
    status: 'Active',
    avatar: 'SN',
    color: '#10b981',
  },
  {
    id: 3,
    name: 'Hafiz Kamal',
    role: 'Driver',
    dept: 'Delivery',
    phone: '011-2233445',
    email: 'hafiz@vm.my',
    shift: ['Tue', 'Thu', 'Sat'],
    routes: ['Route D', 'Route E'],
    status: 'Active',
    avatar: 'HK',
    color: '#f59e0b',
  },
  {
    id: 4,
    name: 'Nurul Ain',
    role: 'Supervisor',
    dept: 'Operations',
    phone: '019-5544332',
    email: 'ain@vm.my',
    shift: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    routes: ['All Routes'],
    status: 'Active',
    avatar: 'NA',
    color: '#3b82f6',
  },
  {
    id: 5,
    name: 'Reza Hamdan',
    role: 'Technician',
    dept: 'Maintenance',
    phone: '017-6677889',
    email: 'reza@vm.my',
    shift: ['Tue', 'Thu'],
    routes: ['Route F'],
    status: 'On Leave',
    avatar: 'RH',
    color: '#8b5cf6',
  },
  {
    id: 6,
    name: 'Farah Liyana',
    role: 'Admin',
    dept: 'Operations',
    phone: '016-3344556',
    email: 'farah@vm.my',
    shift: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    routes: ['-'],
    status: 'Active',
    avatar: 'FL',
    color: '#ec4899',
  },
  {
    id: 7,
    name: 'Zulkifli Omar',
    role: 'Driver',
    dept: 'Delivery',
    phone: '018-7788990',
    email: 'zul@vm.my',
    shift: ['Mon', 'Wed', 'Sat'],
    routes: ['Route B', 'Route C'],
    status: 'Active',
    avatar: 'ZO',
    color: '#14b8a6',
  },
  {
    id: 8,
    name: 'Melissa Chan',
    role: 'Admin',
    dept: 'Operations',
    phone: '012-9988776',
    email: 'melissa@vm.my',
    shift: ['Mon', 'Tue', 'Wed', 'Thu'],
    routes: ['-'],
    status: 'Active',
    avatar: 'MC',
    color: '#f43f5e',
  },
];

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEPT_COLORS = {
  Delivery: { bg: 'rgba(99,102,241,0.12)', text: '#6366f1' },
  Maintenance: { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  Operations: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
};

const STATUS_COLORS = {
  Active: { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  'On Leave': { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  Inactive: { bg: 'rgba(100,116,139,0.12)', text: '#64748b' },
};

export default function Roster({ darkMode }) {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterRole, setFilterRole] = useState('All');
  const [flipped, setFlipped] = useState(null);

  const textMain = darkMode ? '#f1f5f9' : '#1e293b';
  const textSub  = darkMode ? '#94a3b8' : '#64748b';
  const cardBg   = darkMode ? '#1e293b' : '#ffffff';
  const border   = darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const inputBg  = darkMode ? '#0f172a' : '#f8fafc';

  const depts = ['All', ...Array.from(new Set(STAFF.map(s => s.dept)))];
  const roles = ['All', ...Array.from(new Set(STAFF.map(s => s.role)))];

  const filtered = STAFF.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase());
    const matchDept  = filterDept === 'All' || s.dept === filterDept;
    const matchRole  = filterRole === 'All' || s.role === filterRole;
    return matchSearch && matchDept && matchRole;
  });

  const totalActive  = STAFF.filter(s => s.status === 'Active').length;
  const totalLeave   = STAFF.filter(s => s.status === 'On Leave').length;
  const totalDrivers = STAFF.filter(s => s.role === 'Driver').length;

  return (
    <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 60%, #8b5cf6 100%)',
        padding: '2.2rem 2.5rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:'-50px', right:'-50px', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
        <div style={{ position:'absolute', bottom:'-70px', right:'140px', width:'160px', height:'160px', borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.8rem' }}>
            <div style={{ width:'38px', height:'38px', borderRadius:'11px', background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <i className="pi pi-users" style={{ color:'#fff', fontSize:'1rem' }} />
            </div>
            <span style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.07em' }}>STAFF MANAGEMENT</span>
          </div>
          <h1 style={{ margin:'0 0 0.4rem', color:'#fff', fontSize:'1.8rem', fontWeight:800 }}>Staff Roster</h1>
          <p style={{ margin:0, color:'rgba(255,255,255,0.7)', fontSize:'0.87rem' }}>
            Manage your team members, shifts and assignments.
          </p>

          {/* Summary pills */}
          <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.5rem', flexWrap:'wrap' }}>
            {[
              { label: 'Total Staff',  value: STAFF.length,  icon: 'pi-users'        },
              { label: 'Active',       value: totalActive,   icon: 'pi-check-circle'  },
              { label: 'On Leave',     value: totalLeave,    icon: 'pi-clock'         },
              { label: 'Drivers',      value: totalDrivers,  icon: 'pi-truck'         },
            ].map(p => (
              <div key={p.label} style={{
                display:'flex', alignItems:'center', gap:'0.5rem',
                background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)',
                padding:'0.45rem 1rem', borderRadius:'40px',
                border:'1px solid rgba(255,255,255,0.2)',
              }}>
                <i className={`pi ${p.icon}`} style={{ color:'#fff', fontSize:'0.78rem' }} />
                <span style={{ color:'#fff', fontSize:'0.8rem', fontWeight:700 }}>{p.value}</span>
                <span style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.78rem' }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display:'flex', gap:'0.75rem', marginBottom:'1.75rem', flexWrap:'wrap', alignItems:'center',
      }}>
        {/* Search */}
        <div style={{ position:'relative', flex:'1', minWidth:'180px' }}>
          <i className="pi pi-search" style={{
            position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)',
            color: textSub, fontSize:'0.82rem',
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or role..."
            style={{
              width:'100%', boxSizing:'border-box',
              padding:'0.55rem 0.75rem 0.55rem 2.2rem',
              borderRadius:'10px',
              border:`1px solid ${border}`,
              background: inputBg,
              color: textMain,
              fontSize:'0.84rem',
              outline:'none',
            }}
          />
        </div>

        {/* Dept filter */}
        <select
          value={filterDept}
          onChange={e => setFilterDept(e.target.value)}
          style={{
            padding:'0.55rem 0.9rem', borderRadius:'10px',
            border:`1px solid ${border}`, background: inputBg,
            color: textMain, fontSize:'0.84rem', cursor:'pointer', outline:'none',
          }}
        >
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>

        {/* Role filter */}
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          style={{
            padding:'0.55rem 0.9rem', borderRadius:'10px',
            border:`1px solid ${border}`, background: inputBg,
            color: textMain, fontSize:'0.84rem', cursor:'pointer', outline:'none',
          }}
        >
          {roles.map(r => <option key={r}>{r}</option>)}
        </select>

        <span style={{ fontSize:'0.8rem', color: textSub, whiteSpace:'nowrap' }}>
          {filtered.length} member{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Cards grid */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))',
        gap:'1.25rem',
        marginBottom:'2rem',
      }}>
        {filtered.map(staff => {
          const isFlipped = flipped === staff.id;
          const dept = DEPT_COLORS[staff.dept] || { bg:'rgba(99,102,241,0.1)', text:'#6366f1' };
          const stat = STATUS_COLORS[staff.status] || STATUS_COLORS.Active;

          return (
            <div
              key={staff.id}
              onClick={() => setFlipped(isFlipped ? null : staff.id)}
              style={{
                cursor: 'pointer',
                perspective: '1000px',
                height: '290px',
              }}
            >
              <div style={{
                position:'relative', width:'100%', height:'100%',
                transition:'transform 0.55s cubic-bezier(.4,0,.2,1)',
                transformStyle:'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}>

                {/* ---- FRONT ---- */}
                <div style={{
                  position:'absolute', inset:0,
                  backfaceVisibility:'hidden',
                  WebkitBackfaceVisibility:'hidden',
                  borderRadius:'18px',
                  background: cardBg,
                  border:`1px solid ${border}`,
                  boxShadow: darkMode ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(0,0,0,0.07)',
                  overflow:'hidden',
                  display:'flex', flexDirection:'column',
                }}>
                  {/* Top color banner */}
                  <div style={{
                    height:'80px',
                    background: `linear-gradient(135deg, ${staff.color}cc, ${staff.color}88)`,
                    position:'relative',
                    flexShrink: 0,
                  }}>
                    {/* Decorative circles */}
                    <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'90px', height:'90px', borderRadius:'50%', background:'rgba(255,255,255,0.1)' }} />
                    <div style={{ position:'absolute', bottom:'-30px', left:'20px', width:'70px', height:'70px', borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} />

                    {/* Status badge */}
                    <div style={{
                      position:'absolute', top:'10px', right:'12px',
                      padding:'3px 10px', borderRadius:'20px',
                      background: stat.bg, border:`1px solid ${stat.text}44`,
                      fontSize:'0.68rem', fontWeight:700, color: stat.text,
                    }}>
                      {staff.status}
                    </div>
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width:'64px', height:'64px', borderRadius:'50%',
                    background: `linear-gradient(135deg, ${staff.color}, ${staff.color}99)`,
                    border:`3px solid ${cardBg}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'1.2rem', fontWeight:800, color:'#fff',
                    position:'absolute', top:'48px', left:'50%', transform:'translateX(-50%)',
                    boxShadow:`0 4px 16px ${staff.color}55`,
                    zIndex: 2,
                  }}>
                    {staff.avatar}
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2.5rem 1.25rem 1.25rem', paddingTop:'2.8rem' }}>
                    <div style={{ fontSize:'1rem', fontWeight:800, color: textMain, textAlign:'center', marginBottom:'4px' }}>
                      {staff.name}
                    </div>
                    <div style={{ fontSize:'0.78rem', fontWeight:600, color: staff.color, marginBottom:'10px' }}>
                      {staff.role}
                    </div>

                    {/* Dept badge */}
                    <div style={{
                      padding:'3px 12px', borderRadius:'20px',
                      background: dept.bg, color: dept.text,
                      fontSize:'0.7rem', fontWeight:700, marginBottom:'14px',
                    }}>
                      {staff.dept}
                    </div>

                    {/* Shift dots */}
                    <div style={{ display:'flex', gap:'4px', alignItems:'center' }}>
                      {ALL_DAYS.map(day => {
                        const on = staff.shift.includes(day);
                        return (
                          <div key={day} style={{ textAlign:'center' }}>
                            <div style={{
                              width:'28px', height:'28px', borderRadius:'8px',
                              background: on ? `${staff.color}22` : (darkMode ? 'rgba(255,255,255,0.04)' : '#f1f5f9'),
                              border: on ? `1.5px solid ${staff.color}66` : `1.5px solid ${border}`,
                              display:'flex', alignItems:'center', justifyContent:'center',
                              fontSize:'0.58rem', fontWeight:700,
                              color: on ? staff.color : textSub,
                            }}>
                              {day[0]}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Flip hint */}
                  <div style={{
                    textAlign:'center', padding:'0 0 0.7rem',
                    fontSize:'0.65rem', color: textSub, opacity:0.6,
                  }}>
                    <i className="pi pi-sync" style={{ fontSize:'0.6rem', marginRight:'3px' }} />
                    Tap for details
                  </div>
                </div>

                {/* ---- BACK ---- */}
                <div style={{
                  position:'absolute', inset:0,
                  backfaceVisibility:'hidden',
                  WebkitBackfaceVisibility:'hidden',
                  transform:'rotateY(180deg)',
                  borderRadius:'18px',
                  background: cardBg,
                  border:`1px solid ${border}`,
                  boxShadow: darkMode ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(0,0,0,0.07)',
                  overflow:'hidden',
                  display:'flex', flexDirection:'column',
                }}>
                  {/* Top accent */}
                  <div style={{
                    height:'6px',
                    background:`linear-gradient(90deg, ${staff.color}, ${staff.color}66)`,
                    flexShrink:0,
                  }} />

                  <div style={{ flex:1, padding:'1.25rem', display:'flex', flexDirection:'column', gap:'0.85rem', overflowY:'auto' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                      <div style={{
                        width:'40px', height:'40px', borderRadius:'50%',
                        background:`linear-gradient(135deg, ${staff.color}, ${staff.color}88)`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'0.85rem', fontWeight:800, color:'#fff', flexShrink:0,
                      }}>{staff.avatar}</div>
                      <div>
                        <div style={{ fontSize:'0.9rem', fontWeight:800, color: textMain }}>{staff.name}</div>
                        <div style={{ fontSize:'0.74rem', color: staff.color, fontWeight:600 }}>{staff.role} · {staff.dept}</div>
                      </div>
                    </div>

                    <div style={{ height:'1px', background: border }} />

                    {/* Contact */}
                    <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                      {[
                        { icon:'pi-phone', val: staff.phone },
                        { icon:'pi-envelope', val: staff.email },
                      ].map(c => (
                        <div key={c.icon} style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                          <div style={{
                            width:'28px', height:'28px', borderRadius:'8px',
                            background:`${staff.color}18`,
                            display:'flex', alignItems:'center', justifyContent:'center',
                          }}>
                            <i className={`pi ${c.icon}`} style={{ fontSize:'0.72rem', color: staff.color }} />
                          </div>
                          <span style={{ fontSize:'0.78rem', color: textMain }}>{c.val}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ height:'1px', background: border }} />

                    {/* Routes */}
                    <div>
                      <div style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color: textSub, marginBottom:'6px' }}>
                        Assigned Routes
                      </div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
                        {staff.routes.map(r => (
                          <span key={r} style={{
                            padding:'3px 10px', borderRadius:'20px',
                            background:`${staff.color}18`, color: staff.color,
                            fontSize:'0.72rem', fontWeight:700,
                          }}>
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Shift schedule */}
                    <div>
                      <div style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color: textSub, marginBottom:'6px' }}>
                        Work Days
                      </div>
                      <div style={{ display:'flex', gap:'4px' }}>
                        {ALL_DAYS.map(day => {
                          const on = staff.shift.includes(day);
                          return (
                            <div key={day} style={{
                              flex:1, padding:'4px 0', borderRadius:'6px', textAlign:'center',
                              background: on ? `${staff.color}22` : (darkMode ? 'rgba(255,255,255,0.04)' : '#f1f5f9'),
                              fontSize:'0.6rem', fontWeight:700,
                              color: on ? staff.color : textSub,
                              border: on ? `1px solid ${staff.color}44` : `1px solid ${border}`,
                            }}>
                              {day[0]}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign:'center', padding:'0 0 0.7rem', fontSize:'0.65rem', color: textSub, opacity:0.6 }}>
                    <i className="pi pi-sync" style={{ fontSize:'0.6rem', marginRight:'3px' }} />
                    Tap to flip back
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'4rem 0', color: textSub }}>
          <i className="pi pi-users" style={{ fontSize:'2rem', opacity:0.3, display:'block', marginBottom:'0.75rem' }} />
          <div style={{ fontSize:'0.88rem' }}>No staff members found.</div>
        </div>
      )}

    </div>
  );
}
