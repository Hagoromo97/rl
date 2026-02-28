import React, { useState, useRef, useEffect, useCallback } from 'react';
import QrScanner from 'qr-scanner';
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// ── Per-card datasets ────────────────────────────────────────────────────────
const cardDatasets = [
    {
        title: 'Advanced Card',
        subTitle: 'New York, USA',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores.',
        tags: ['Design', 'React', 'PrimeReact'],
        date: '2026-02-27T08:15:00',
        markerColor: '#3b82f6',
        routeColor: 'rgba(59,130,246,0.7)',
        bbox: { minLon: -74.03, minLat: 40.69, maxLon: -73.93, maxLat: 40.81 },
        iframeSrc: 'https://www.openstreetmap.org/export/embed.html?bbox=-74.03%2C40.69%2C-73.93%2C40.81&layer=mapnik',
        rows: [
            { no: 1, code: 'A001', name: 'Times Square',       delivery: 'Daily',   km: 5.2,  latitude: 40.7580, longitude: -73.9855 },
            { no: 2, code: 'A002', name: 'Financial District', delivery: 'Weekday', km: 8.1,  latitude: 40.7075, longitude: -74.0113 },
            { no: 3, code: 'A003', name: 'Central Park',       delivery: 'Alt 1',   km: 12.3, latitude: 40.7851, longitude: -73.9683 },
            { no: 4, code: 'A004', name: 'East Village',       delivery: 'Alt 2',   km: 15.7, latitude: 40.7264, longitude: -73.9813 },
            { no: 5, code: 'A005', name: "Hell's Kitchen",     delivery: 'Daily',   km: 7.4,  latitude: 40.7640, longitude: -74.0005 },
        ],
    },
    {
        title: 'Nature Card',
        subTitle: 'Paris, France',
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.',
        tags: ['Nature', 'Photo', 'Travel'],
        date: '2026-02-27T11:42:00',
        markerColor: '#f97316',
        routeColor: 'rgba(249,115,22,0.7)',
        bbox: { minLon: 2.26, minLat: 48.82, maxLon: 2.39, maxLat: 48.90 },
        iframeSrc: 'https://www.openstreetmap.org/export/embed.html?bbox=2.26%2C48.82%2C2.39%2C48.90&layer=mapnik',
        rows: [
            { no: 1, code: 'B001', name: 'Eiffel Tower',   delivery: 'Daily',   km: 3.5, latitude: 48.8584, longitude: 2.2945 },
            { no: 2, code: 'B002', name: 'Louvre Museum',  delivery: 'Weekday', km: 6.2, latitude: 48.8606, longitude: 2.3376 },
            { no: 3, code: 'B003', name: 'Notre-Dame',     delivery: 'Alt 1',   km: 4.8, latitude: 48.8530, longitude: 2.3499 },
            { no: 4, code: 'B004', name: 'Montmartre',     delivery: 'Alt 2',   km: 9.1, latitude: 48.8867, longitude: 2.3431 },
            { no: 5, code: 'B005', name: 'Champs-Élysées', delivery: 'Daily',   km: 5.3, latitude: 48.8698, longitude: 2.3078 },
        ],
    },
    {
        title: 'City Card',
        subTitle: 'Tokyo, Japan',
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
        tags: ['City', 'Urban', 'Modern'],
        date: '2026-02-27T14:05:00',
        markerColor: '#22c55e',
        routeColor: 'rgba(34,197,94,0.7)',
        bbox: { minLon: 139.67, minLat: 35.64, maxLon: 139.80, maxLat: 35.72 },
        iframeSrc: 'https://www.openstreetmap.org/export/embed.html?bbox=139.67%2C35.64%2C139.80%2C35.72&layer=mapnik',
        rows: [
            { no: 1, code: 'C001', name: 'Shinjuku',  delivery: 'Daily',   km: 7.2,  latitude: 35.6938, longitude: 139.7036 },
            { no: 2, code: 'C002', name: 'Shibuya',   delivery: 'Weekday', km: 5.8,  latitude: 35.6580, longitude: 139.7016 },
            { no: 3, code: 'C003', name: 'Akihabara', delivery: 'Alt 1',   km: 9.3,  latitude: 35.7023, longitude: 139.7745 },
            { no: 4, code: 'C004', name: 'Harajuku',  delivery: 'Alt 2',   km: 6.5,  latitude: 35.6702, longitude: 139.7026 },
            { no: 5, code: 'C005', name: 'Ginza',     delivery: 'Daily',   km: 11.2, latitude: 35.6717, longitude: 139.7656 },
        ],
    },
];

// ── MapWithMarkers — react-leaflet ───────────────────────────────────────────
function MapWithMarkers({ rows, markerColor, routeColor, height = 180 }) {
    if (!rows || rows.length === 0) {
        return (
            <div style={{
                width: '100%', height, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            }}>
                <i className="pi pi-map" style={{ fontSize: '2rem', color: '#cbd5e1' }} />
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>No stops yet</span>
            </div>
        );
    }
    const center = [
        rows.reduce((s, r) => s + r.latitude, 0) / rows.length,
        rows.reduce((s, r) => s + r.longitude, 0) / rows.length,
    ];
    const positions = rows.map(r => [r.latitude, r.longitude]);

    return (
        <MapContainer
            center={center}
            zoom={12}
            style={{ width: '100%', height }}
            scrollWheelZoom={false}
            zoomControl={false}
            attributionControl={false}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline positions={positions} color={routeColor} weight={2} dashArray="5 4" />
            {rows.map((r, i) => (
                <CircleMarker
                    key={r.no}
                    center={[r.latitude, r.longitude]}
                    radius={8}
                    pathOptions={{ color: '#fff', weight: 2, fillColor: markerColor, fillOpacity: 1 }}
                >
                    <Popup>{i + 1}. {r.name}</Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
}

// ── isDeliveryActive ─────────────────────────────────────────────────────────
function isDeliveryActive(delivery, date = new Date()) {
    const day     = date.getDay();   // 0=Sun … 6=Sat
    const dateNum = date.getDate();  // 1-31
    switch (delivery) {
        case 'Daily':   return true;
        case 'Alt 1':   return dateNum % 2 !== 0;   // odd dates
        case 'Alt 2':   return dateNum % 2 === 0;   // even dates
        case 'Weekday': return day >= 0 && day <= 4; // Sun(0)–Thu(4)
        default:        return true;
    }
}

// ── RowInfoPanel ─────────────────────────────────────────────────────────────
function RowInfoPanel({ open, onOpenChange, row, darkMode, markerColor, onSave, editMode }) {
    const [drafts, setDrafts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    // QR Code state
    const [qrCodeImageUrl, setQrCodeImageUrl] = useState('');
    const [qrCodeDestUrl, setQrCodeDestUrl] = useState('');
    const [qrTab, setQrTab] = useState('url'); // 'url' | 'media'
    const [showQrEdit, setShowQrEdit] = useState(false);
    const [qrDecodeStatus, setQrDecodeStatus] = useState('idle'); // 'idle'|'loading'|'ok'|'fail'
    const [pendingUrl, setPendingUrl] = useState(null);
    const qrFileRef = useRef(null);

    // Avatar state
    const [avatarImages, setAvatarImages] = useState([]);
    const [avatarSelected, setAvatarSelected] = useState('');
    const [showAvatarEdit, setShowAvatarEdit] = useState(false);
    const [avatarTab, setAvatarTab] = useState('url'); // 'url' | 'upload'
    const [avatarUrlInput, setAvatarUrlInput] = useState('');
    const avatarFileRef = useRef(null);

    useEffect(() => {
        if (open && row) {
            setDrafts(row.descriptions ?? []);
            setIsEditing(false);
            setQrCodeImageUrl(row.qrCodeImageUrl ?? '');
            setQrCodeDestUrl(row.qrCodeDestUrl ?? '');
            setShowQrEdit(false);
            setQrDecodeStatus('idle');
            const imgs = row.avatarImages ?? (row.avatarImageUrl ? [row.avatarImageUrl] : []);
            setAvatarImages(imgs);
            setAvatarSelected(row.avatarImageUrl ?? imgs[0] ?? '');
            setShowAvatarEdit(false);
            setAvatarUrlInput('');
        }
    }, [open, row]);

    if (!row) return null;

    const gmapsUrl = `https://maps.google.com/?q=${row.latitude},${row.longitude}`;
    const wazeUrl  = `https://waze.com/ul?ll=${row.latitude},${row.longitude}&navigate=yes`;
    const hasCoords = row.latitude !== 0 && row.longitude !== 0;

    const DELIVERY_STYLES = {
        Daily:    { bg: '#dcfce7', color: '#15803d', border: '#86efac' },
        Weekday:  { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
        'Alt 1':  { bg: '#ffedd5', color: '#c2410c', border: '#fdba74' },
        'Alt 2':  { bg: '#f3e8ff', color: '#7e22ce', border: '#d8b4fe' },
    };
    const ds = DELIVERY_STYLES[row.delivery] ?? { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' };
    const initials = row.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    const inp = (extra = {}) => ({
        width: '100%', padding: '0.38rem 0.65rem', borderRadius: '7px',
        border: `1.5px solid ${darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`,
        fontSize: '0.78rem', fontWeight: 600,
        color: darkMode ? '#f1f5f9' : '#1e293b',
        background: darkMode ? '#1e293b' : '#fff',
        outline: 'none', boxSizing: 'border-box',
        ...extra,
    });

    const sectionLabel = (txt) => (
        <span style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: darkMode ? '#64748b' : '#94a3b8' }}>{txt}</span>
    );

    const handleSave = () => {
        onSave?.({
            ...row,
            descriptions: drafts.filter(d => d.key.trim() !== ''),
            qrCodeImageUrl,
            qrCodeDestUrl,
            avatarImageUrl: avatarSelected,
            avatarImages,
        });
        setIsEditing(false);
        setShowQrEdit(false);
        setShowAvatarEdit(false);
    };

    // ── QR decode from uploaded image
    const handleQrFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setQrDecodeStatus('loading');
        setQrCodeImageUrl(URL.createObjectURL(file));
        try {
            const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
            const decoded = result?.data ?? '';
            setQrDecodeStatus('ok');
            if (decoded.startsWith('http')) setQrCodeDestUrl(decoded);
        } catch {
            setQrDecodeStatus('fail');
        }
        if (qrFileRef.current) qrFileRef.current.value = '';
    };

    // ── Avatar upload
    const handleAvatarFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setAvatarImages(prev => [...prev, url]);
        setAvatarSelected(url);
        if (avatarFileRef.current) avatarFileRef.current.value = '';
    };

    const handleOpenUrl = (url) => {
        if (!url) return;
        setPendingUrl(url);
    };

    const tabBtn = (key, label, active, setActive) => (
        <button key={key} onClick={() => setActive(key)} style={{
            flex: 1, padding: '0.32rem 0', fontSize: '0.73rem', fontWeight: 700, cursor: 'pointer',
            border: 'none', borderBottom: active === key ? `2px solid ${markerColor}` : '2px solid transparent',
            background: 'none', color: active === key ? markerColor : (darkMode ? '#64748b' : '#94a3b8'),
            transition: 'all 0.15s',
        }}>{label}</button>
    );

    return (
        <>
        {/* ── Confirm external URL dialog ── */}
        {pendingUrl && (
            <Dialog
                baseZIndex={30000}
                visible={!!pendingUrl}
                onHide={() => setPendingUrl(null)}
                header={null}
                headerStyle={{ display: 'none' }}
                style={{ width: '320px', borderRadius: '14px', overflow: 'hidden' }}
                contentStyle={{ padding: '1.5rem 1.25rem 1rem', background: darkMode ? '#1e293b' : '#fff' }}
                modal dismissableMask closable={false}
                footer={null}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="pi pi-external-link" style={{ fontSize: '1.2rem', color: '#f59e0b' }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: '4px' }}>Open external link?</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', wordBreak: 'break-all' }}>{pendingUrl}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.25rem' }}>
                        <button onClick={() => setPendingUrl(null)} style={{
                            flex: 1, padding: '0.45rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                            background: 'transparent', color: darkMode ? '#94a3b8' : '#64748b',
                            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                        }}>Cancel</button>
                        <button onClick={() => { window.open(pendingUrl, '_blank'); setPendingUrl(null); }} style={{
                            flex: 1, padding: '0.45rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                            background: markerColor, color: '#fff', border: 'none',
                        }}>Open</button>
                    </div>
                </div>
            </Dialog>
        )}

        <Dialog
            baseZIndex={20000}
            header={null}
            visible={open}
            onHide={() => onOpenChange(false)}
            style={{ width: '380px', padding: 0, borderRadius: '16px', overflow: 'hidden' }}
            contentStyle={{ padding: 0, background: darkMode ? '#0f172a' : '#f8fafc' }}
            headerStyle={{ display: 'none' }}
            modal closable={false} dismissableMask
            maskStyle={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.38)' }}
            footer={(isEditing || showQrEdit || showAvatarEdit) ? (
                <div style={{
                    padding: '0.65rem 1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem',
                    background: darkMode ? '#1e293b' : '#fff',
                    borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : '#e2e8f0'}`,
                }}>
                    <button onClick={() => { setDrafts(row.descriptions ?? []); setIsEditing(false); setShowQrEdit(false); setShowAvatarEdit(false); }} style={{
                        padding: '0.38rem 1rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                        background: 'transparent', color: darkMode ? '#94a3b8' : '#64748b',
                        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                    }}>Cancel</button>
                    <button onClick={handleSave} style={{
                        padding: '0.38rem 1rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                        background: markerColor, color: '#fff', border: 'none',
                        display: 'flex', alignItems: 'center', gap: '4px',
                    }}><i className="pi pi-check" style={{ fontSize: '0.7rem' }} /> Save</button>
                </div>
            ) : null}
            footerStyle={{ padding: 0 }}
        >
            {/* ── Header ── */}
            <div style={{
                padding: '1rem 1.1rem 0.85rem',
                background: darkMode ? '#1e293b' : '#fff',
                borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                display: 'flex', alignItems: 'center', gap: '0.85rem',
            }}>
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    {avatarSelected ? (
                        <img
                            src={avatarSelected}
                            alt="avatar"
                            onClick={() => editMode && setShowAvatarEdit(true)}
                            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', cursor: editMode ? 'pointer' : 'default', boxShadow: `0 2px 10px ${markerColor}55`, border: `2px solid ${markerColor}` }}
                        />
                    ) : (
                        <div
                            onClick={() => editMode && setShowAvatarEdit(true)}
                            style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, ${markerColor}, ${markerColor}bb)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.95rem', boxShadow: `0 2px 10px ${markerColor}55`, cursor: editMode ? 'pointer' : 'default' }}
                        >{initials}</div>
                    )}
                    {editMode && (
                        <div onClick={() => setShowAvatarEdit(true)} style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', borderRadius: '50%', background: markerColor, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                            <i className="pi pi-camera" style={{ fontSize: '0.5rem', color: '#fff' }} />
                        </div>
                    )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.2, color: darkMode ? '#f1f5f9' : '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '4px', flexWrap: 'wrap' }}>
                        <span style={{ padding: '1px 8px', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 700, background: darkMode ? `${markerColor}22` : ds.bg, color: darkMode ? markerColor : ds.color, border: `1px solid ${darkMode ? markerColor + '44' : ds.border}` }}>{row.delivery}</span>
                        <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 600, color: darkMode ? '#64748b' : '#94a3b8', background: darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9', padding: '1px 7px', borderRadius: '5px' }}>{row.code}</span>
                    </div>
                </div>
                <button onClick={() => onOpenChange(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, color: darkMode ? '#64748b' : '#94a3b8', fontSize: '0.95rem', padding: '5px', borderRadius: '6px' }}
                    onMouseEnter={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.07)' : '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                ><i className="pi pi-times" /></button>
            </div>

            {/* ── Body ── */}
            <div style={{ padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '68vh', overflowY: 'auto' }}>

                {/* ── Avatar Edit Panel ── */}
                {showAvatarEdit && editMode && (
                    <div style={{ borderRadius: '10px', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, overflow: 'hidden', background: darkMode ? '#1e293b' : '#fff' }}>
                        <div style={{ padding: '0.55rem 0.85rem', background: darkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc', borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : '#f1f5f9'}`, display: 'flex', gap: 0 }}>
                            {tabBtn('url', 'URL', avatarTab, setAvatarTab)}
                            {tabBtn('upload', 'Upload', avatarTab, setAvatarTab)}
                        </div>
                        <div style={{ padding: '0.75rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {avatarTab === 'url' ? (
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    <input value={avatarUrlInput} onChange={e => setAvatarUrlInput(e.target.value)} placeholder="https://..." style={{ ...inp(), flex: 1 }} />
                                    <button onClick={() => { if (avatarUrlInput.trim()) { setAvatarImages(p => [...p, avatarUrlInput.trim()]); setAvatarSelected(avatarUrlInput.trim()); setAvatarUrlInput(''); } }} style={{ padding: '0.38rem 0.75rem', borderRadius: '7px', background: markerColor, color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>Add</button>
                                </div>
                            ) : (
                                <div onClick={() => avatarFileRef.current?.click()} style={{ border: `2px dashed ${darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`, borderRadius: '8px', padding: '1rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = markerColor}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}>
                                    <i className="pi pi-image" style={{ fontSize: '1.3rem', color: '#94a3b8' }} />
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>Click to upload photo</div>
                                    <input ref={avatarFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarFileChange} />
                                </div>
                            )}
                            {/* Gallery thumbnails */}
                            {avatarImages.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                    {avatarImages.map((img, i) => (
                                        <div key={i} style={{ position: 'relative' }}>
                                            <img src={img} alt="" onClick={() => setAvatarSelected(img)} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', cursor: 'pointer', border: `2px solid ${avatarSelected === img ? markerColor : 'transparent'}`, transition: 'border-color 0.15s' }} />
                                            <button onClick={() => { const next = avatarImages.filter((_, j) => j !== i); setAvatarImages(next); if (avatarSelected === img) setAvatarSelected(next[0] ?? ''); }} style={{ position: 'absolute', top: '-5px', right: '-5px', width: '14px', height: '14px', borderRadius: '50%', background: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <i className="pi pi-times" style={{ fontSize: '0.45rem', color: '#fff' }} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Information ── */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        {sectionLabel('Information')}
                        {!isEditing && editMode && (
                            <button onClick={() => setIsEditing(true)} style={{ fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', color: markerColor, background: 'none', border: 'none', padding: '2px 8px', borderRadius: '5px' }}
                                onMouseEnter={e => e.currentTarget.style.background = `${markerColor}18`}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            >Edit</button>
                        )}
                    </div>
                    {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {drafts.map((d, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                    <input value={d.key} onChange={e => setDrafts(p => p.map((x, j) => j === i ? { ...x, key: e.target.value } : x))} placeholder="Key" style={{ ...inp(), width: '90px', flex: 'none' }} />
                                    <input value={d.value} onChange={e => setDrafts(p => p.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} placeholder="Value" style={{ ...inp(), flex: 1 }} />
                                    <button onClick={() => setDrafts(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: '4px', borderRadius: '5px', flexShrink: 0 }}><i className="pi pi-trash" style={{ fontSize: '0.72rem' }} /></button>
                                </div>
                            ))}
                            <button onClick={() => setDrafts(p => [...p, { key: '', value: '' }])} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', marginTop: '2px', fontSize: '0.72rem', fontWeight: 600, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <i className="pi pi-plus" style={{ fontSize: '0.62rem' }} /> Add field
                            </button>
                        </div>
                    ) : (
                        <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : '#e2e8f0'}`, background: darkMode ? '#1e293b' : '#fff' }}>
                            {drafts.length > 0 ? drafts.map((d, i) => (
                                <div key={i} style={{ display: 'flex', borderBottom: i < drafts.length - 1 ? `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` : 'none' }}>
                                    <span style={{ width: '90px', flexShrink: 0, padding: '0.5rem 0.75rem', fontSize: '0.69rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: darkMode ? '#64748b' : '#94a3b8', background: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.key}</span>
                                    <span style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: darkMode ? '#cbd5e1' : '#334155' }}>{d.value}</span>
                                </div>
                            )) : (
                                <p style={{ textAlign: 'center', margin: 0, padding: '1.1rem', color: darkMode ? '#475569' : '#94a3b8', fontSize: '0.78rem' }}>No information added</p>
                            )}
                        </div>
                    )}
                </div>

                {/* ── QR Code ── */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        {sectionLabel('QR Code')}
                        {editMode && (
                            <button onClick={() => setShowQrEdit(p => !p)} style={{ fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', color: showQrEdit ? '#ef4444' : markerColor, background: 'none', border: 'none', padding: '2px 8px', borderRadius: '5px' }}
                                onMouseEnter={e => e.currentTarget.style.background = showQrEdit ? '#fee2e2' : `${markerColor}18`}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            >{showQrEdit ? 'Close' : 'Edit'}</button>
                        )}
                    </div>

                    {/* QR Image preview */}
                    {qrCodeImageUrl ? (
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: showQrEdit ? '0.75rem' : 0 }}>
                            <img src={qrCodeImageUrl} alt="QR" onClick={() => qrCodeDestUrl && handleOpenUrl(qrCodeDestUrl)} style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '10px', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, cursor: qrCodeDestUrl ? 'pointer' : 'default', display: 'block' }} />
                            {qrCodeDestUrl && (
                                <div style={{ position: 'absolute', inset: 0, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0)', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.25)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
                                    onClick={() => handleOpenUrl(qrCodeDestUrl)}>
                                    <i className="pi pi-external-link" style={{ color: '#fff', fontSize: '1.2rem', opacity: 0, transition: 'opacity 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                    />
                                </div>
                            )}
                            {editMode && showQrEdit && (
                                <button onClick={() => { setQrCodeImageUrl(''); setQrDecodeStatus('idle'); }} style={{ position: 'absolute', top: '-7px', right: '-7px', width: '18px', height: '18px', borderRadius: '50%', background: '#ef4444', border: '2px solid #fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="pi pi-times" style={{ fontSize: '0.5rem', color: '#fff' }} />
                                </button>
                            )}
                        </div>
                    ) : (
                        !showQrEdit && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.85rem', borderRadius: '8px', background: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px dashed ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}` }}>
                                <i className="pi pi-qrcode" style={{ fontSize: '1.2rem', color: '#94a3b8' }} />
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No QR code added</span>
                            </div>
                        )
                    )}

                    {/* QR Decode status */}
                    {qrDecodeStatus === 'ok' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#22c55e', marginTop: '0.3rem' }}>
                            <i className="pi pi-check-circle" /> QR decoded — URL filled automatically
                        </div>
                    )}
                    {qrDecodeStatus === 'fail' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#f87171', marginTop: '0.3rem' }}>
                            <i className="pi pi-times-circle" /> Could not decode QR — enter URL manually
                        </div>
                    )}
                    {qrDecodeStatus === 'loading' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                            <i className="pi pi-spin pi-spinner" /> Scanning QR code…
                        </div>
                    )}

                    {/* QR Edit Panel */}
                    {showQrEdit && editMode && (
                        <div style={{ borderRadius: '10px', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, overflow: 'hidden', background: darkMode ? '#1e293b' : '#fff', marginTop: qrCodeImageUrl ? '0.75rem' : '0' }}>
                            {/* Tabs */}
                            <div style={{ display: 'flex', borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : '#f1f5f9'}`, background: darkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}>
                                {tabBtn('url', 'Image URL', qrTab, setQrTab)}
                                {tabBtn('media', 'Upload / Scan', qrTab, setQrTab)}
                            </div>
                            <div style={{ padding: '0.75rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {qrTab === 'url' ? (
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        <input value={qrCodeImageUrl} onChange={e => setQrCodeImageUrl(e.target.value)} placeholder="https://example.com/qr.png" style={{ ...inp(), flex: 1 }} />
                                        {qrCodeImageUrl && (
                                            <button onClick={async () => {
                                                if (!qrCodeImageUrl.trim()) return;
                                                setQrDecodeStatus('loading');
                                                try {
                                                    const result = await QrScanner.scanImage(qrCodeImageUrl, { returnDetailedScanResult: true });
                                                    if (result?.data?.startsWith('http')) setQrCodeDestUrl(result.data);
                                                    setQrDecodeStatus('ok');
                                                } catch { setQrDecodeStatus('fail'); }
                                            }} style={{ padding: '0.38rem 0.6rem', borderRadius: '7px', background: darkMode ? 'rgba(255,255,255,0.08)' : '#f1f5f9', color: darkMode ? '#94a3b8' : '#64748b', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>Scan</button>
                                        )}
                                    </div>
                                ) : (
                                    <div onClick={() => { setQrDecodeStatus('idle'); qrFileRef.current?.click(); }} style={{ border: `2px dashed ${darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`, borderRadius: '8px', padding: '1rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = markerColor}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}>
                                        <i className="pi pi-upload" style={{ fontSize: '1.2rem', color: '#94a3b8' }} />
                                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>Upload QR image — auto decode</div>
                                        <input ref={qrFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleQrFileChange} />
                                    </div>
                                )}
                                {/* Destination URL */}
                                <div>
                                    <div style={{ fontSize: '0.67rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Destination URL</div>
                                    <input value={qrCodeDestUrl} onChange={e => setQrCodeDestUrl(e.target.value)} placeholder="https://..." style={inp()} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Destination URL display (view mode) */}
                    {!showQrEdit && qrCodeDestUrl && (
                        <button onClick={() => handleOpenUrl(qrCodeDestUrl)} style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 600, color: markerColor, background: 'none', border: 'none', cursor: 'pointer', padding: '0', maxWidth: '100%' }}>
                            <i className="pi pi-link" style={{ fontSize: '0.68rem' }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{qrCodeDestUrl}</span>
                        </button>
                    )}
                </div>

                {/* ── Navigation ── */}
                {hasCoords && (
                    <div>
                        {sectionLabel('Open With')}
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Google Maps', bg: '#ea4335', icon: 'pi-map-marker', url: gmapsUrl },
                                { label: 'Waze',        bg: '#33ccff', icon: 'pi-directions',  url: wazeUrl  },
                            ].map(btn => (
                                <button key={btn.label} onClick={() => handleOpenUrl(btn.url)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem 0.75rem', borderRadius: '10px', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: btn.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', transition: 'transform 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                        <i className={`pi ${btn.icon}`} style={{ color: '#fff', fontSize: '1rem' }} />
                                    </div>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: darkMode ? '#94a3b8' : '#64748b' }}>{btn.label}</span>
                                </button>
                            ))}

                            {/* FamilyMart Refill Service */}
                            <button onClick={() => handleOpenUrl('https://erefill.speedparcel.com.my/')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem 0.75rem', borderRadius: '10px', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #16a34a, #15803d)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', transition: 'transform 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                    <i className="pi pi-refresh" style={{ color: '#fff', fontSize: '1rem' }} />
                                </div>
                                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: darkMode ? '#94a3b8' : '#64748b', textAlign: 'center', lineHeight: 1.2 }}>Refill<br/>Service</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Dialog>
        </>
    );
}

// ── CardItem ─────────────────────────────────────────────────────────────────
function CardItem({ title, subTitle, description, tags, date, darkMode, editMode, markerColor: initialMarkerColor, routeColor, rows, index }) {
    const [markerColor, setMarkerColor] = useState(initialMarkerColor);
    const [tableRows, setTableRows] = useState(() => rows.map(r => ({ ...r, descriptions: r.descriptions ?? [] })));
    const [dialogVisible, setDialogVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('map');
    const [selectedRows, setSelectedRows] = useState([]);
    const [showChangelog, setShowChangelog] = useState(false);
    const [showEditPanel, setShowEditPanel] = useState(false);
    const [editPanelSnapshot, setEditPanelSnapshot] = useState(null);
    const [changelog, setChangelog] = useState(() => [{ date: new Date(date), names: rows.map(r => r.name) }]);
    const [addingRow, setAddingRow] = useState(null);
    const [infoRow, setInfoRow] = useState(null);
    const shiftOp = useRef(null);
    const codeOp = useRef(null);
    const titleOp = useRef(null);
    const cellOp = useRef(null);
    const [editingCell, setEditingCell] = useState(null); // { rowNo, field, value }
    const [, code] = subTitle.split(', ');
    const [editShift, setEditShift] = useState('AM');
    const [editCode, setEditCode] = useState(code);
    const [editTitle, setEditTitle] = useState(title);
    const [editDescription, setEditDescription] = useState(description);
    const [lastModified, setLastModified] = useState(new Date(date));
    const [editTags, setEditTags] = useState(tags);
    const [confirmDeleteTag, setConfirmDeleteTag] = useState(null);
    const [newTagInput, setNewTagInput] = useState('');
    const [editingTagIdx, setEditingTagIdx] = useState(null);
    const [editingTagValue, setEditingTagValue] = useState('');
    const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
    const [deliveryModalRowNo, setDeliveryModalRowNo] = useState(null);

    const [, setTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setTick(t => t + 1), 30000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (!editMode && showEditPanel) setShowEditPanel(false);
    }, [editMode]);

    const timeAgo = (d) => {
        const now = new Date();
        const diffMs = now - d;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr  = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr  / 24);
        if (diffSec < 60)  return 'Just now';
        if (diffMin < 60)  return `${diffMin} min ago`;
        if (diffHr  < 24)  return diffHr  === 1 ? '1 hour ago'  : `${diffHr} hours ago`;
        if (diffDay < 30)  return diffDay === 1 ? '1 day ago'   : `${diffDay} days ago`;
        const pad = n => String(n).padStart(2, '0');
        return `Last ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(-2)}`;
    };

    const popoverChip = (value, setValue, type, opRef, options = null) => (
        <>
            <span
                onClick={e => opRef.current.toggle(e)}
                style={{
                    cursor: 'pointer',
                    borderRadius: '4px',
                    padding: '1px 5px',
                    fontWeight: 700,
                    fontSize: 'inherit',
                    letterSpacing: 'inherit',
                    color: '#94a3b8',
                    transition: 'background 0.15s, color 0.15s',
                    userSelect: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = markerColor; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
            >{value}</span>
            <OverlayPanel ref={opRef} style={{ minWidth: '200px', padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
                <div style={{ padding: '0.75rem 1rem 0.6rem', background: markerColor, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '26px', height: '26px', borderRadius: '7px',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                        <i className={options ? 'pi pi-sun' : 'pi pi-map-marker'} style={{ color: '#fff', fontSize: '0.75rem' }} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Edit {type}
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: '0.85rem 1rem 1rem' }}>
                    {options ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => { setValue(opt); }}
                                    style={{
                                        flex: 1,
                                        padding: '0.55rem 0',
                                        borderRadius: '8px',
                                        border: `2px solid ${value === opt ? markerColor : (darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0')}`,
                                        background: value === opt ? markerColor : (darkMode ? '#1e293b' : '#f8fafc'),
                                        color: value === opt ? '#fff' : (darkMode ? '#94a3b8' : '#64748b'),
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s',
                                        letterSpacing: '0.04em',
                                    }}
                                >{opt}</button>
                            ))}
                        </div>
                    ) : (
                        <input
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            placeholder={`Enter ${type}...`}
                            style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '8px',
                                border: `1.5px solid ${markerColor}55`,
                                fontSize: '0.84rem',
                                fontWeight: 600,
                                color: darkMode ? '#f1f5f9' : '#1e293b',
                                background: darkMode ? '#1e293b' : '#f8fafc',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.15s',
                            }}
                            onFocus={e => e.target.style.borderColor = markerColor}
                            onBlur={e => e.target.style.borderColor = `${markerColor}55`}
                            autoFocus
                        />
                    )}
                    <button
                        onClick={() => { opRef.current.hide(); setLastModified(new Date()); }}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                            background: markerColor, color: '#fff', border: 'none',
                            borderRadius: '8px', padding: '0.5rem 0',
                            fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                            letterSpacing: '0.02em', transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        <i className="pi pi-check" style={{ fontSize: '0.72rem' }} /> Simpan
                    </button>
                </div>
            </OverlayPanel>
        </>
    );

    const btnBase = {
        flex: 1, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
        padding: '0.45rem 0', justifyContent: 'center',
    };

    const tabBtn = (key, icon, label) => (
        <button
            onClick={() => setActiveTab(key)}
            style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.4rem 1rem', borderRadius: '8px',
                fontSize: '0.78rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeTab === key ? markerColor : (darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                color: activeTab === key ? '#fff' : (darkMode ? '#94a3b8' : '#64748b'),
                boxShadow: activeTab === key ? `0 2px 8px ${routeColor}` : 'none',
            }}
        >
            <i className={`pi ${icon}`} style={{ fontSize: '0.72rem' }} /> {label}
        </button>
    );

    const cellFieldMeta = {
        code:      { label: 'Code',      icon: 'pi-tag',          type: 'text' },
        name:      { label: 'Name',      icon: 'pi-map-marker',   type: 'text' },
        delivery:  { label: 'Delivery',  icon: 'pi-truck',        type: 'delivery' },
        km:        { label: 'Km',        icon: 'pi-sort-alt',     type: 'number' },
        latitude:  { label: 'Latitude',  icon: 'pi-compass',      type: 'number' },
        longitude: { label: 'Longitude', icon: 'pi-compass',      type: 'number' },
    };

    const handleCellClick = (e, rowNo, field, currentVal) => {
        if (!editMode) return;
        e.stopPropagation();
        if (field === 'delivery') {
            setDeliveryModalRowNo(rowNo);
            setDeliveryModalOpen(true);
            return;
        }
        setEditingCell({ rowNo, field, value: String(currentVal) });
        cellOp.current.show(e);
    };

    const handleCellSave = () => {
        if (!editingCell) return;
        const { rowNo, field, value } = editingCell;
        setTableRows(prev => prev.map(r => {
            if (r.no !== rowNo) return r;
            const parsed = (field === 'km' || field === 'latitude' || field === 'longitude')
                ? parseFloat(value) || 0
                : value;
            return { ...r, [field]: parsed };
        }));
        setLastModified(new Date());
        cellOp.current.hide();
        setEditingCell(null);
    };

    const fmtChangelogDate = (d) => {
        const pad = n => String(n).padStart(2, '0');
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(-2)}`;
    };

    const handleAddRow = () => {
        if (!addingRow || !addingRow.name.trim()) return;
        const newNo = tableRows.length > 0 ? Math.max(...tableRows.map(r => r.no)) + 1 : 1;
        const newRow = {
            no: newNo,
            code: addingRow.code.trim() || `X${String(newNo).padStart(3, '0')}`,
            name: addingRow.name.trim(),
            delivery: addingRow.delivery || 'Standard',
            km: parseFloat(addingRow.km) || 0,
            latitude: parseFloat(addingRow.latitude) || 0,
            longitude: parseFloat(addingRow.longitude) || 0,
            descriptions: [],
        };
        setTableRows(prev => [...prev, newRow]);
        setChangelog(prev => [...prev, { date: new Date(), names: [newRow.name] }]);
        setLastModified(new Date());
        setAddingRow(null);
    };

    const handleSaveRowInfo = (updatedRow) => {
        setTableRows(prev => prev.map(r => r.no === updatedRow.no ? updatedRow : r));
        setInfoRow(updatedRow);
        setLastModified(new Date());
    };

    const footer = (
        <div style={{
            display: 'flex', gap: '0.5rem', paddingTop: '0.75rem',
            borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#f1f5f9'}`
        }}>
            {editMode && (
            <button
                onClick={() => {
                    setEditPanelSnapshot({ title: editTitle, description: editDescription, code: editCode, shift: editShift, color: markerColor, tags: [...editTags] });
                    setShowEditPanel(true);
                }}
                style={{
                    ...btnBase, background: darkMode ? `${markerColor}22` : `${markerColor}18`,
                    color: markerColor, border: `1px solid ${markerColor}55`,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem',
                }}
            >
                <i className="pi pi-pencil" style={{ fontSize: '0.75rem' }} /> Edit
            </button>
            )}
            <button
                onClick={() => setShowChangelog(true)}
                style={{
                    ...btnBase, background: darkMode ? `${markerColor}22` : `${markerColor}18`,
                    color: markerColor, border: `1px solid ${markerColor}55`,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem',
            }}>
                <i className="pi pi-info-circle" style={{ fontSize: '0.75rem' }} /> Info
            </button>
            <button style={{
                ...btnBase, background: darkMode ? `${markerColor}22` : `${markerColor}18`,
                color: markerColor, border: `1px solid ${markerColor}55`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem',
            }} onClick={() => { setActiveTab('table'); setDialogVisible(true); }}>
                <i className="pi pi-eye" style={{ fontSize: '0.75rem' }} /> View
            </button>
        </div>
    );

    return (
        <div
            className="card-item"
            style={{
                width: '340px', height: '520px', borderRadius: '16px', overflow: 'hidden',
                boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.10)',
                border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f1f5f9',
                background: darkMode ? '#1e293b' : '#ffffff',
                transition: 'background 0.4s, box-shadow 0.3s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                position: 'relative', zIndex: 1,
                contain: 'paint',
                animationDelay: `${(index ?? 0) * 0.09}s`,
            }}
        >
        {/* Sliding wrapper */}
        <div style={{
            display: 'flex', width: '1020px', height: '100%',
            transform: showEditPanel ? 'translateX(-680px)' : showChangelog ? 'translateX(-340px)' : 'translateX(0)',
            transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)',
        }}>
        {/* ── Panel 1: original card ── */}
        <div style={{ width: '340px', flexShrink: 0, display: 'flex', flexDirection: 'column', height: '520px' }}>
            {/* Mini-map with markers */}
            <div style={{ position: 'relative', flexShrink: 0, overflow: 'hidden', height: 180 }}>
                {!showChangelog && !showEditPanel && <MapWithMarkers rows={tableRows} markerColor={markerColor} routeColor={routeColor} height={180} />}
                {/* Stops badge */}
                <div style={{
                    position: 'absolute', bottom: '8px', right: '8px',
                    background: markerColor, borderRadius: '999px',
                    padding: '2px 8px', fontSize: '0.65rem', fontWeight: 700, color: '#fff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    zIndex: 500,
                }}>
                    <i className="pi pi-map-marker" style={{ fontSize: '0.6rem' }} />
                    {tableRows.length} stops
                </div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: '1rem 1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem', overflow: 'hidden' }}>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b' }}>
                        {editTitle}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px', color: '#94a3b8', justifyContent: 'center' }}>
                        <span>{editCode}</span>
                        <span style={{ margin: '0 2px', color: darkMode ? '#475569' : '#cbd5e1' }}>,</span>
                        <span>{editShift}</span>
                    </p>
                </div>

                {/* Divider */}
                <div style={{
                    height: '1px',
                    background: darkMode
                        ? 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)'
                        : 'linear-gradient(to right, transparent, rgba(0,0,0,0.07), transparent)',
                    margin: '0 -0.25rem',
                }} />

                {/* Mini stop list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.22rem' }}>
                    {tableRows.slice(0, 3).map((r, i) => (
                        <div key={r.no} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.74rem', color: darkMode ? '#94a3b8' : '#64748b' }}>
                            <span style={{
                                width: '16px', height: '16px', borderRadius: '50%',
                                background: markerColor, color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.58rem', fontWeight: 700, flexShrink: 0,
                            }}>{i + 1}</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{r.name}</span>
                            <span style={{ color: markerColor, fontWeight: 600 }}>{r.km}km</span>
                        </div>
                    ))}
                    {tableRows.length > 3 && (
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8', paddingLeft: '22px' }}>+{tableRows.length - 3} more stops</span>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {editTags.map(tag => (
                        <span key={tag} style={{
                            background: darkMode ? `${markerColor}22` : `${markerColor}18`,
                            color: markerColor, fontSize: '0.72rem', fontWeight: 600,
                            padding: '2px 10px', borderRadius: '999px',
                            border: `1px solid ${markerColor}44`,
                        }}>{tag}</span>
                    ))}
                </div>


            </div>

            {/* Footer */}
            <div style={{ padding: '0.75rem 1.25rem 1.25rem' }}>{footer}</div>
        </div>{/* end Panel 1 */}

        {/* ── Panel 2: Changelog ── */}
        <div style={{
            width: '340px', flexShrink: 0, height: '520px',
            display: 'flex', flexDirection: 'column',
            background: darkMode ? '#0f172a' : '#f8fafc',
        }}>
            {/* Changelog header */}
            <div style={{
                padding: '1rem 1.25rem 0.75rem',
                background: darkMode ? '#1e293b' : '#ffffff',
                borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : '#e2e8f0'}`,
                display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0,
            }}>
                <div style={{
                    width: '30px', height: '30px', borderRadius: '8px',
                    background: `linear-gradient(135deg, #06b6d4, #0891b2)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    <i className="pi pi-history" style={{ color: '#fff', fontSize: '0.75rem' }} />
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: darkMode ? '#f1f5f9' : '#1e293b', lineHeight: 1.2 }}>Changelog</div>
                    <div style={{ fontSize: '0.67rem', color: '#94a3b8', fontWeight: 500 }}>{editTitle}</div>
                </div>
                <span style={{
                    marginLeft: 'auto', fontSize: '0.68rem', fontWeight: 700,
                    background: '#06b6d422', color: '#06b6d4',
                    border: '1px solid #06b6d444', borderRadius: '999px', padding: '2px 8px',
                }}>{changelog.length} entries</span>
            </div>

            {/* Changelog list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[...changelog].reverse().map((entry, i) => {
                    const isInit = i === changelog.length - 1;
                    const nameList = entry.names.length === 1
                        ? entry.names[0]
                        : entry.names.slice(0, -1).join(', ') + ' and ' + entry.names[entry.names.length - 1];
                    return (
                        <div key={i} style={{
                            display: 'flex', gap: '0.6rem',
                            paddingBottom: '0.6rem',
                            borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}`,
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '50%',
                                    background: isInit ? `${markerColor}22` : '#06b6d422',
                                    border: `2px solid ${isInit ? markerColor : '#06b6d4'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className={`pi ${isInit ? 'pi-flag' : 'pi-plus'}`} style={{ fontSize: '0.55rem', color: isInit ? markerColor : '#06b6d4' }} />
                                </div>
                                {i < changelog.length - 1 && (
                                    <div style={{ width: '2px', flex: 1, minHeight: '12px', background: darkMode ? 'rgba(255,255,255,0.07)' : '#e2e8f0', borderRadius: '1px' }} />
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', marginBottom: '2px' }}>
                                    {fmtChangelogDate(entry.date)}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: darkMode ? '#cbd5e1' : '#334155', fontWeight: 500, lineHeight: 1.4 }}>
                                    {isInit
                                        ? <><span style={{ fontWeight: 700, color: markerColor }}>Route created</span> with {entry.names.length} location{entry.names.length > 1 ? 's' : ''}: <span style={{ fontStyle: 'italic' }}>{nameList}</span></>
                                        : <>Added {entry.names.length} location{entry.names.length > 1 ? 's' : ''}: <span style={{ fontWeight: 700, color: '#06b6d4' }}>{nameList}</span></>
                                    }
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Updated timestamp */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                    paddingTop: '0.25rem',
                    fontSize: '0.68rem', color: darkMode ? '#475569' : '#94a3b8', fontWeight: 500,
                }}>
                    <i className="pi pi-clock" style={{ fontSize: '0.62rem' }} />
                    <span>Updated {timeAgo(lastModified)}</span>
                </div>
            </div>

            {/* Back button */}
            <div style={{
                padding: '0.75rem 1.25rem 1.25rem',
                borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : '#e2e8f0'}`,
                background: darkMode ? '#1e293b' : '#ffffff',
                flexShrink: 0,
            }}>
                <button
                    onClick={() => setShowChangelog(false)}
                    style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        padding: '0.5rem 0', borderRadius: '8px',
                        background: darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                        color: darkMode ? '#94a3b8' : '#64748b',
                        border: darkMode ? '1px solid rgba(255,255,255,0.09)' : '1px solid #e2e8f0',
                        fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'; }}
                >
                    <i className="pi pi-arrow-left" style={{ fontSize: '0.72rem' }} /> Back
                </button>
            </div>
        </div>{/* end Panel 2 */}

        {/* ── Panel 3: Edit Card ── */}
        <div style={{
            width: '340px', flexShrink: 0, height: '520px',
            display: 'flex', flexDirection: 'column',
            background: darkMode ? '#0f172a' : '#f8fafc',
        }}>
            {/* Header */}
            <div style={{
                padding: '1rem 1.25rem 0.75rem',
                background: darkMode ? '#1e293b' : '#ffffff',
                borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : '#e2e8f0'}`,
                display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0,
            }}>
                <div style={{
                    width: '30px', height: '30px', borderRadius: '8px',
                    background: `linear-gradient(135deg, ${markerColor}, ${markerColor}bb)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    <i className="pi pi-pencil" style={{ color: '#fff', fontSize: '0.75rem' }} />
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: darkMode ? '#f1f5f9' : '#1e293b', lineHeight: 1.2 }}>Edit Card</div>
                    <div style={{ fontSize: '0.67rem', color: '#94a3b8', fontWeight: 500 }}>Route · Code · Shift · Color · Badges</div>
                </div>
            </div>

            {/* Form */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Route */}
                <div>
                    <label style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: darkMode ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.4rem' }}>
                        <i className="pi pi-map-marker" style={{ fontSize: '0.65rem' }} /> Route
                    </label>
                    <input
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        placeholder="Route name..."
                        style={{
                            width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px',
                            border: `1.5px solid ${darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`,
                            fontSize: '0.84rem', fontWeight: 600,
                            color: darkMode ? '#f1f5f9' : '#1e293b',
                            background: darkMode ? '#1e293b' : '#fff',
                            outline: 'none', boxSizing: 'border-box',
                        }}
                        onFocus={e => e.target.style.borderColor = markerColor}
                        onBlur={e => e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}
                    />
                </div>

                {/* Code */}
                <div>
                    <label style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: darkMode ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.4rem' }}>
                        <i className="pi pi-tag" style={{ fontSize: '0.65rem' }} /> Code
                    </label>
                    <input
                        value={editCode}
                        onChange={e => setEditCode(e.target.value)}
                        placeholder="Route code..."
                        style={{
                            width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px',
                            border: `1.5px solid ${darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`,
                            fontSize: '0.84rem', fontWeight: 600,
                            color: darkMode ? '#f1f5f9' : '#1e293b',
                            background: darkMode ? '#1e293b' : '#fff',
                            outline: 'none', boxSizing: 'border-box',
                        }}
                        onFocus={e => e.target.style.borderColor = markerColor}
                        onBlur={e => e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}
                    />
                </div>

                {/* Shift */}
                <div>
                    <label style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: darkMode ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.4rem' }}>
                        <i className="pi pi-sun" style={{ fontSize: '0.65rem' }} /> Shift
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['AM', 'PM'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => setEditShift(opt)}
                                style={{
                                    flex: 1, padding: '0.55rem 0', borderRadius: '8px',
                                    border: `2px solid ${editShift === opt ? markerColor : (darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0')}`,
                                    background: editShift === opt ? markerColor : (darkMode ? '#1e293b' : '#f8fafc'),
                                    color: editShift === opt ? '#fff' : (darkMode ? '#94a3b8' : '#64748b'),
                                    fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                                }}
                            >{opt}</button>
                        ))}
                    </div>
                </div>

                {/* Color */}
                <div>
                    <label style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: darkMode ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.4rem' }}>
                        <i className="pi pi-palette" style={{ fontSize: '0.65rem' }} /> Color
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '46px', height: '46px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0,
                            border: `2px solid ${markerColor}66`,
                            boxShadow: `0 2px 8px ${markerColor}44`, cursor: 'pointer',
                        }}>
                            <input
                                type="color"
                                value={markerColor}
                                onChange={e => setMarkerColor(e.target.value)}
                                style={{ width: '62px', height: '62px', border: 'none', padding: 0, cursor: 'pointer', margin: '-8px 0 0 -8px' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b', fontFamily: 'monospace' }}>{markerColor.toUpperCase()}</div>
                            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Click swatch to pick</div>
                        </div>
                    </div>
                    {/* Preset swatches */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
                        {['#6366f1', '#3b82f6', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#14b8a6'].map(c => (
                            <div
                                key={c}
                                onClick={() => setMarkerColor(c)}
                                style={{
                                    width: '22px', height: '22px', borderRadius: '6px', background: c, cursor: 'pointer',
                                    border: `2.5px solid ${markerColor === c ? '#fff' : 'transparent'}`,
                                    boxShadow: markerColor === c ? `0 0 0 2px ${c}` : '0 1px 3px rgba(0,0,0,0.15)',
                                    transition: 'all 0.15s',
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Badges ── */}
                <div>
                    <label style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: darkMode ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.55rem' }}>
                        <i className="pi pi-tags" style={{ fontSize: '0.65rem' }} /> Badges
                    </label>

                    {/* existing badges */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: editTags.length ? '0.5rem' : 0 }}>
                        {editTags.map((tag, i) => (
                            <div key={i}>
                                {confirmDeleteTag === i ? (
                                    /* ── delete confirmation ── */
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        background: darkMode ? 'rgba(239,68,68,0.12)' : '#fef2f2',
                                        border: `1px solid ${darkMode ? 'rgba(239,68,68,0.3)' : '#fecaca'}`,
                                        borderRadius: '8px', padding: '0.35rem 0.55rem',
                                    }}>
                                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '0.7rem', color: '#ef4444', flexShrink: 0 }} />
                                        <span style={{ flex: 1, fontSize: '0.72rem', fontWeight: 600, color: darkMode ? '#fca5a5' : '#b91c1c' }}>Delete "{tag}"?</span>
                                        <button onClick={() => { setEditTags(prev => prev.filter((_, j) => j !== i)); setConfirmDeleteTag(null); }}
                                            style={{ background: '#ef4444', border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer', padding: '2px 9px', fontSize: '0.7rem', fontWeight: 700 }}>Yes</button>
                                        <button onClick={() => setConfirmDeleteTag(null)}
                                            style={{ background: 'transparent', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.15)' : '#e2e8f0'}`, borderRadius: '5px', color: darkMode ? '#94a3b8' : '#64748b', cursor: 'pointer', padding: '2px 9px', fontSize: '0.7rem', fontWeight: 600 }}>No</button>
                                    </div>
                                ) : editingTagIdx === i ? (
                                    /* ── inline edit ── */
                                    <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                                        <input
                                            autoFocus
                                            value={editingTagValue}
                                            onChange={e => setEditingTagValue(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') { if (editingTagValue.trim()) { setEditTags(prev => prev.map((t, j) => j === i ? editingTagValue.trim() : t)); } setEditingTagIdx(null); }
                                                if (e.key === 'Escape') setEditingTagIdx(null);
                                            }}
                                            style={{
                                                flex: 1, padding: '0.3rem 0.55rem', borderRadius: '7px',
                                                border: `1.5px solid ${markerColor}`,
                                                fontSize: '0.78rem', fontWeight: 600,
                                                color: darkMode ? '#f1f5f9' : '#1e293b',
                                                background: darkMode ? '#1e293b' : '#fff',
                                                outline: 'none', boxSizing: 'border-box',
                                            }}
                                        />
                                        <button onClick={() => { if (editingTagValue.trim()) setEditTags(prev => prev.map((t, j) => j === i ? editingTagValue.trim() : t)); setEditingTagIdx(null); }}
                                            style={{ background: markerColor, border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', padding: '0.3rem 0.6rem', fontSize: '0.72rem', fontWeight: 700 }}>
                                            <i className="pi pi-check" style={{ fontSize: '0.65rem' }} /></button>
                                        <button onClick={() => setEditingTagIdx(null)}
                                            style={{ background: 'transparent', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.15)' : '#e2e8f0'}`, borderRadius: '6px', color: darkMode ? '#94a3b8' : '#64748b', cursor: 'pointer', padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}>
                                            <i className="pi pi-times" style={{ fontSize: '0.65rem' }} /></button>
                                    </div>
                                ) : (
                                    /* ── display row ── */
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <span style={{
                                            flex: 1,
                                            background: darkMode ? `${markerColor}22` : `${markerColor}16`,
                                            color: markerColor, fontSize: '0.72rem', fontWeight: 600,
                                            padding: '3px 10px', borderRadius: '999px',
                                            border: `1px solid ${markerColor}44`,
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        }}>{tag}</span>
                                        <button
                                            onClick={() => { setEditingTagIdx(i); setEditingTagValue(tag); setConfirmDeleteTag(null); }}
                                            title="Edit badge"
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#64748b' : '#94a3b8', padding: '3px 5px', borderRadius: '5px', lineHeight: 1 }}
                                            onMouseEnter={e => { e.currentTarget.style.background = `${markerColor}22`; e.currentTarget.style.color = markerColor; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = darkMode ? '#64748b' : '#94a3b8'; }}
                                        ><i className="pi pi-pencil" style={{ fontSize: '0.6rem' }} /></button>
                                        <button
                                            onClick={() => { setConfirmDeleteTag(i); setEditingTagIdx(null); }}
                                            title="Delete badge"
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#64748b' : '#94a3b8', padding: '3px 5px', borderRadius: '5px', lineHeight: 1 }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#ef4444'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = darkMode ? '#64748b' : '#94a3b8'; }}
                                        ><i className="pi pi-trash" style={{ fontSize: '0.6rem' }} /></button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* add new badge */}
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <input
                            value={newTagInput}
                            onChange={e => setNewTagInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && newTagInput.trim()) {
                                    setEditTags(prev => [...prev, newTagInput.trim()]);
                                    setNewTagInput('');
                                }
                            }}
                            placeholder="New badge..."
                            style={{
                                flex: 1, padding: '0.38rem 0.65rem', borderRadius: '8px',
                                border: `1.5px solid ${darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`,
                                fontSize: '0.78rem', fontWeight: 600,
                                color: darkMode ? '#f1f5f9' : '#1e293b',
                                background: darkMode ? '#1e293b' : '#fff',
                                outline: 'none', boxSizing: 'border-box',
                            }}
                            onFocus={e => e.target.style.borderColor = markerColor}
                            onBlur={e => e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}
                        />
                        <button
                            onClick={() => { if (newTagInput.trim()) { setEditTags(prev => [...prev, newTagInput.trim()]); setNewTagInput(''); } }}
                            style={{
                                background: newTagInput.trim() ? markerColor : (darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                                color: newTagInput.trim() ? '#fff' : (darkMode ? '#475569' : '#94a3b8'),
                                border: 'none', borderRadius: '8px', cursor: newTagInput.trim() ? 'pointer' : 'default',
                                padding: '0.38rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, transition: 'all 0.15s',
                                display: 'flex', alignItems: 'center', gap: '4px',
                            }}
                        ><i className="pi pi-plus" style={{ fontSize: '0.65rem' }} /> Add</button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                padding: '0.75rem 1.25rem 1.25rem',
                borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : '#e2e8f0'}`,
                background: darkMode ? '#1e293b' : '#ffffff',
                flexShrink: 0, display: 'flex', gap: '0.5rem',
            }}>
                <button
                    onClick={() => {
                        if (editPanelSnapshot) {
                            setEditTitle(editPanelSnapshot.title);
                            setEditDescription(editPanelSnapshot.description ?? '');
                            setEditCode(editPanelSnapshot.code);
                            setEditShift(editPanelSnapshot.shift);
                            setMarkerColor(editPanelSnapshot.color);
                            setEditTags(editPanelSnapshot.tags ?? []);
                        }
                        setNewTagInput('');
                        setEditingTagIdx(null);
                        setConfirmDeleteTag(null);
                        setShowEditPanel(false);
                    }}
                    style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        padding: '0.5rem 0', borderRadius: '8px',
                        background: darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                        color: darkMode ? '#94a3b8' : '#64748b',
                        border: darkMode ? '1px solid rgba(255,255,255,0.09)' : '1px solid #e2e8f0',
                        fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'; }}
                ><i className="pi pi-times" style={{ fontSize: '0.72rem' }} /> Cancel</button>
                <button
                    onClick={() => { setLastModified(new Date()); setNewTagInput(''); setEditingTagIdx(null); setConfirmDeleteTag(null); setShowEditPanel(false); }}
                    style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        padding: '0.5rem 0', borderRadius: '8px',
                        background: markerColor, color: '#fff', border: 'none',
                        fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                ><i className="pi pi-check" style={{ fontSize: '0.72rem' }} /> Save</button>
            </div>
        </div>{/* end Panel 3 */}

        </div>{/* end sliding wrapper */}

            {/* ── View Dialog ── */}
            <Dialog
                baseZIndex={10000}
                header={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{
                            width: '38px', height: '38px', borderRadius: '10px',
                            background: `linear-gradient(135deg, ${markerColor}, ${markerColor}bb)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            boxShadow: `0 2px 8px ${markerColor}55`,
                        }}>
                            <i className="pi pi-map-marker" style={{ color: '#fff', fontSize: '0.9rem' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <div style={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.2, color: darkMode ? '#f1f5f9' : '#1e293b' }}>
                                {editTitle}
                            </div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '2px', color: darkMode ? '#64748b' : '#94a3b8' }}>
                                <span>{editCode}</span>
                                <span style={{ color: darkMode ? '#475569' : '#cbd5e1' }}>,</span>
                                <span>{editShift}</span>
                            </div>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                            <button
                                onClick={() => setActiveTab(prev => prev === 'table' ? 'map' : 'table')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    padding: '0.45rem 1.1rem', borderRadius: '8px',
                                    fontSize: '0.78rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                                    background: markerColor, color: '#fff',
                                    letterSpacing: '0.01em', transition: 'opacity 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                {activeTab === 'table' ? 'Table' : 'Map'}
                                <i className="pi pi-chevron-right" style={{ fontSize: '0.6rem', opacity: 0.85 }} />
                            </button>
                        </div>
                    </div>
                }
                visible={dialogVisible}
                style={{ width: '80vw', borderRadius: '16px', overflow: 'hidden' }}
                maximizable modal dismissableMask closable={false}
                maskStyle={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.35)' }}
                headerStyle={{
                    background: darkMode ? '#1e293b' : '#ffffff',
                    borderBottom: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
                    padding: '1.1rem 1.5rem',
                }}
                contentStyle={{
                    height: activeTab === 'map' ? '480px' : '380px',
                    padding: activeTab === 'map' ? '0' : '1.25rem 1.5rem',
                    background: darkMode ? '#0f172a' : '#f8fafc',
                    overflow: activeTab === 'map' ? 'hidden' : 'auto',
                }}
                footerStyle={{
                    background: darkMode ? '#1e293b' : '#ffffff',
                    borderTop: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
                    padding: 0,
                }}
                onHide={() => setDialogVisible(false)}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.5rem', background: darkMode ? '#1e293b' : '#ffffff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                fontSize: '0.72rem', fontWeight: 600,
                                color: markerColor,
                                background: darkMode ? `${markerColor}22` : `${markerColor}14`,
                                border: `1px solid ${markerColor}44`,
                                borderRadius: '6px', padding: '0.25rem 0.65rem',
                            }}>
                                <i className="pi pi-list" style={{ fontSize: '0.65rem' }} />
                                {tableRows.length} records
                            </span>
                            {selectedRows.length > 0 && (
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                    background: darkMode ? `${markerColor}30` : `${markerColor}18`,
                                    color: markerColor, border: `1px solid ${markerColor}44`,
                                    fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '6px',
                                }}>
                                    <i className="pi pi-check-square" style={{ fontSize: '0.65rem' }} />
                                    {selectedRows.length} selected
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {selectedRows.length > 0 && (
                                <button onClick={() => setSelectedRows([])}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                                        background: darkMode ? 'rgba(239,68,68,0.15)' : '#fef2f2',
                                        color: '#ef4444',
                                        border: `1px solid ${darkMode ? 'rgba(239,68,68,0.3)' : '#fecaca'}`,
                                        borderRadius: '8px', padding: '0.4rem 0.9rem', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = darkMode ? 'rgba(239,68,68,0.25)' : '#fee2e2'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = darkMode ? 'rgba(239,68,68,0.15)' : '#fef2f2'; }}
                                >
                                    <i className="pi pi-times" style={{ fontSize: '0.7rem' }} /> Clear
                                </button>
                            )}
                        </div>
                    </div>
                }
            >
                {/* MAP TAB — default */}
                {activeTab === 'map' && (
                    <MapWithMarkers rows={tableRows} markerColor={markerColor} routeColor={routeColor} height="100%" />
                )}

                {/* TABLE TAB */}
                {activeTab === 'table' && (
                    <div style={{ overflowX: 'auto', height: '100%' }}>
                        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '50rem' }}>
                            <thead>
                                <tr style={{ background: darkMode ? '#1e293b' : '#f1f5f9', position: 'sticky', top: 0, zIndex: 10 }}>
                                    {(editMode ? ['', 'No', 'Code', 'Name', 'Delivery', 'Km', 'Latitude', 'Longitude', 'Action'] : ['No', 'Code', 'Name', 'Delivery', 'Km', 'Latitude', 'Longitude', 'Action']).map((h, i) => (
                                        <th key={i} style={{
                                            padding: '0.65rem 1rem', textAlign: 'center',
                                            fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
                                            letterSpacing: '0.07em', color: darkMode ? '#94a3b8' : '#64748b',
                                            border: 'none', whiteSpace: 'nowrap',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.map((row, idx) => {
                                    const checked = selectedRows.includes(row.no);
                                    const isOdd = idx % 2 !== 0;
                                    return (
                                        <tr key={row.no}
                                            style={{
                                                background: checked
                                                    ? (darkMode ? `${markerColor}28` : `${markerColor}14`)
                                                    : isOdd ? (darkMode ? '#162032' : '#f8fafc') : (darkMode ? '#0f172a' : '#ffffff'),
                                                transition: 'background 0.15s',
                                                cursor: editMode ? 'pointer' : 'default',
                                            }}
                                            onClick={editMode ? () => setSelectedRows(prev =>
                                                prev.includes(row.no) ? prev.filter(n => n !== row.no) : [...prev, row.no]
                                            ) : undefined}
                                        >
                                            {editMode && (
                                            <td style={{ padding: '0.55rem 1rem', textAlign: 'center', border: 'none' }}>
                                                <input type="checkbox" checked={checked} onChange={() => {}}
                                                    style={{ accentColor: markerColor, width: '14px', height: '14px', cursor: 'pointer' }} />
                                            </td>
                                            )}
                                            <td style={{ padding: '0.55rem 1rem', textAlign: 'center', border: 'none' }}>
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                    width: '20px', height: '20px', borderRadius: '50%',
                                                    background: markerColor, color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                                                }}>{row.no}</span>
                                            </td>
                                            {['code', 'name', 'delivery', 'km', 'latitude', 'longitude'].map(field => {
                                                const isDeliveryField = field === 'delivery';
                                                const active = isDeliveryField ? isDeliveryActive(row.delivery) : false;
                                                return (
                                                <td key={field} style={{
                                                    padding: '0.55rem 0.75rem', textAlign: 'center', fontSize: '0.82rem',
                                                    color: darkMode ? '#cbd5e1' : '#334155', border: 'none', whiteSpace: 'nowrap',
                                                    cursor: editMode ? 'pointer' : 'default', position: 'relative',
                                                }}
                                                    onClick={e => handleCellClick(e, row.no, field, row[field])}
                                                >
                                                    {isDeliveryField ? (
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                            borderRadius: '5px', padding: '2px 6px',
                                                            transition: 'background 0.15s',
                                                        }}
                                                            onMouseEnter={e => { if (editMode) e.currentTarget.style.background = `${markerColor}22`; }}
                                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                        >
                                                            {row.delivery}
                                                            {editMode && <i className="pi pi-pencil" style={{ fontSize: '0.55rem', opacity: 0.4 }} />}
                                                        </span>
                                                    ) : (
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                            borderRadius: '5px', padding: '2px 6px',
                                                            transition: 'background 0.15s',
                                                        }}
                                                            onMouseEnter={e => { if (editMode) e.currentTarget.style.background = `${markerColor}22`; }}
                                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                        >
                                                            {row[field]}
                                                            {editMode && <i className="pi pi-pencil" style={{ fontSize: '0.55rem', opacity: 0.4 }} />}
                                                        </span>
                                                    )}
                                                </td>
                                                );
                                            })}
                                            <td style={{ padding: '0.55rem 1rem', textAlign: 'center', border: 'none' }}>
                                                <button
                                                    onClick={e => { e.stopPropagation(); setInfoRow(row); }}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: markerColor, fontSize: '1rem', padding: '0.2rem 0.4rem', borderRadius: '6px' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = `${markerColor}20`}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                                >
                                                    <i className="pi pi-info-circle" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {/* ── Add Location last row ── */}
                                {editMode && addingRow ? (
                                    <tr style={{ background: darkMode ? `#06b6d418` : `#ecfeff` }}>
                                        <td style={{ padding: '0.45rem 0.5rem', textAlign: 'center', border: 'none' }}></td>
                                        <td style={{ padding: '0.45rem 0.5rem', textAlign: 'center', border: 'none', fontSize: '0.75rem', color: '#94a3b8' }}>—</td>
                                        {[['code','Code',80],['name','Name *',130],['delivery','Delivery',90],['km','Km',60],['latitude','Lat',90],['longitude','Lng',90]].map(([field, ph, w]) => (
                                            <td key={field} style={{ padding: '0.3rem 0.4rem', border: 'none' }}>
                                                {field === 'delivery' ? (
                                                    <select
                                                        value={addingRow[field]}
                                                        onChange={e => setAddingRow(prev => ({ ...prev, [field]: e.target.value }))}
                                                        style={{
                                                            width: `${w}px`, padding: '0.3rem 0.5rem', borderRadius: '6px',
                                                            border: '1.5px solid #06b6d466',
                                                            fontSize: '0.78rem', fontWeight: 600,
                                                            color: darkMode ? '#f1f5f9' : '#1e293b',
                                                            background: darkMode ? '#1e293b' : '#fff',
                                                            outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
                                                        }}
                                                    >
                                                        <option value="Daily">Daily</option>
                                                        <option value="Weekday">Weekday</option>
                                                        <option value="Alt 1">Alt 1</option>
                                                        <option value="Alt 2">Alt 2</option>
                                                    </select>
                                                ) : (
                                                    <input
                                                        autoFocus={field === 'code'}
                                                        value={addingRow[field]}
                                                        onChange={e => setAddingRow(prev => ({ ...prev, [field]: e.target.value }))}
                                                        placeholder={ph}
                                                        style={{
                                                            width: `${w}px`, padding: '0.3rem 0.5rem', borderRadius: '6px',
                                                            border: `1.5px solid ${field === 'name' && !addingRow.name.trim() ? '#f87171' : '#06b6d466'}`,
                                                            fontSize: '0.78rem', fontWeight: 600,
                                                            color: darkMode ? '#f1f5f9' : '#1e293b',
                                                            background: darkMode ? '#1e293b' : '#fff',
                                                            outline: 'none', boxSizing: 'border-box',
                                                        }}
                                                    />
                                                )}
                                            </td>
                                        ))}
                                        <td style={{ padding: '0.45rem 0.5rem', textAlign: 'center', border: 'none' }}>
                                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                                <button onClick={handleAddRow}
                                                    style={{ background: '#06b6d4', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', padding: '0.25rem 0.55rem', fontSize: '0.75rem', fontWeight: 700 }}
                                                ><i className="pi pi-check" /></button>
                                                <button onClick={() => setAddingRow(null)}
                                                    style={{ background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                ><i className="pi pi-times" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : editMode ? (
                                    <tr
                                        onClick={() => setAddingRow({ code: '', name: '', delivery: 'Daily', km: '', latitude: '', longitude: '' })}
                                        style={{ cursor: 'pointer', transition: 'background 0.15s', background: darkMode ? 'rgba(34,197,94,0.1)' : '#f0fdf4' }}
                                        onMouseEnter={e => e.currentTarget.style.background = darkMode ? 'rgba(34,197,94,0.18)' : '#dcfce7'}
                                        onMouseLeave={e => e.currentTarget.style.background = darkMode ? 'rgba(34,197,94,0.1)' : '#f0fdf4'}
                                    >
                                        <td colSpan={9} style={{ padding: '0.55rem 1rem', border: 'none', textAlign: 'center' }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                                fontSize: '0.75rem', fontWeight: 700,
                                                color: darkMode ? '#4ade80' : '#16a34a',
                                            }}>
                                                <i className="pi pi-plus" style={{ fontSize: '0.65rem' }} /> Add Location
                                            </span>
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                )}
            </Dialog>

            {/* ── Delivery Modal ── */}
            {(() => {
                const DELIVERY_OPTIONS = [
                    { value: 'Daily',   label: 'Daily',   desc: 'Delivery every day',              dotColor: '#22c55e' },
                    { value: 'Weekday', label: 'Weekday', desc: 'Delivery Sunday – Thursday only', dotColor: '#3b82f6' },
                    { value: 'Alt 1',   label: 'Alt 1',   desc: 'Delivery on odd dates only',      dotColor: '#f97316' },
                    { value: 'Alt 2',   label: 'Alt 2',   desc: 'Delivery on even dates only',     dotColor: '#a855f7' },
                ];
                const deliveryRow = tableRows.find(r => r.no === deliveryModalRowNo);
                return (
                    <Dialog
                        baseZIndex={20000}
                        header={null}
                        visible={deliveryModalOpen}
                        onHide={() => { setDeliveryModalOpen(false); setDeliveryModalRowNo(null); }}
                        style={{ width: '340px', padding: 0, borderRadius: '16px', overflow: 'hidden' }}
                        contentStyle={{ padding: 0, background: darkMode ? '#0f172a' : '#f8fafc' }}
                        headerStyle={{ display: 'none' }}
                        modal closable={false} dismissableMask
                        maskStyle={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.38)' }}
                        footer={null}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '0.9rem 1.1rem 0.75rem',
                            background: darkMode ? '#1e293b' : '#fff',
                            borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                                <div style={{
                                    width: '26px', height: '26px', borderRadius: '7px',
                                    background: markerColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className="pi pi-truck" style={{ color: '#fff', fontSize: '0.75rem' }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b' }}>Delivery Type</div>
                                    {deliveryRow && (
                                        <div style={{ fontSize: '0.68rem', color: darkMode ? '#64748b' : '#94a3b8', fontWeight: 600 }}>
                                            {deliveryRow.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => { setDeliveryModalOpen(false); setDeliveryModalRowNo(null); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#64748b' : '#94a3b8', padding: '4px', borderRadius: '6px', fontSize: '0.9rem' }}
                                onMouseEnter={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.07)' : '#f1f5f9'}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            ><i className="pi pi-times" /></button>
                        </div>

                        {/* Options */}
                        <div style={{ padding: '0.9rem 1.1rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {DELIVERY_OPTIONS.map(opt => {
                                const isSelected = deliveryRow?.delivery === opt.value;
                                const isActive   = isDeliveryActive(opt.value);
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            setTableRows(prev => prev.map(r =>
                                                r.no === deliveryModalRowNo ? { ...r, delivery: opt.value } : r
                                            ));
                                            setLastModified(new Date());
                                        }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            padding: '0.65rem 0.85rem', borderRadius: '10px', cursor: 'pointer',
                                            border: isSelected
                                                ? `2px solid ${markerColor}`
                                                : `1.5px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                                            background: isSelected
                                                ? (darkMode ? `${markerColor}1a` : `${markerColor}0d`)
                                                : (darkMode ? 'rgba(255,255,255,0.03)' : '#fff'),
                                            transition: 'all 0.15s', textAlign: 'left', width: '100%',
                                        }}
                                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = `${markerColor}66`; }}
                                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'; }}
                                    >
                                        {/* Dot */}
                                        <span style={{
                                            width: '10px', height: '10px', borderRadius: '50%',
                                            background: opt.dotColor, flexShrink: 0,
                                            boxShadow: `0 0 0 3px ${opt.dotColor}30`,
                                        }} />
                                        {/* Label + desc */}
                                        <span style={{ flex: 1 }}>
                                            <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b' }}>{opt.label}</span>
                                            <span style={{ display: 'block', fontSize: '0.68rem', color: darkMode ? '#64748b' : '#94a3b8', marginTop: '1px' }}>{opt.desc}</span>
                                        </span>
                                        {/* ON/OFF badge */}
                                        <span style={{
                                            fontSize: '0.6rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px',
                                            background: isActive ? '#dcfce7' : '#fee2e2',
                                            color: isActive ? '#15803d' : '#dc2626',
                                            flexShrink: 0,
                                        }}>{isActive ? 'ON' : 'OFF'}</span>
                                        {/* Check */}
                                        {isSelected && (
                                            <i className="pi pi-check" style={{ color: markerColor, fontSize: '0.75rem', flexShrink: 0 }} />
                                        )}
                                    </button>
                                );
                            })}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
                                <button
                                    onClick={() => { setDeliveryModalOpen(false); setDeliveryModalRowNo(null); }}
                                    style={{
                                        padding: '0.38rem 1.1rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                                        background: 'transparent', color: darkMode ? '#94a3b8' : '#64748b',
                                        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                                    }}
                                >Close</button>
                            </div>
                        </div>
                    </Dialog>
                );
            })()}

            {/* ── Row Info Panel ── */}
            <RowInfoPanel
                open={!!infoRow}
                onOpenChange={(o) => { if (!o) setInfoRow(null); }}
                row={infoRow}
                darkMode={darkMode}
                markerColor={markerColor}
                onSave={handleSaveRowInfo}
                editMode={editMode}
            />

            {/* ── Shared cell-edit OverlayPanel ── */}
            <OverlayPanel
                ref={cellOp}
                style={{ minWidth: '230px', padding: 0, overflow: 'hidden', borderRadius: '12px' }}
                onHide={() => setEditingCell(null)}
            >
                {editingCell && (() => {
                    const meta = cellFieldMeta[editingCell.field];
                    return (
                        <>
                            <div style={{
                                padding: '0.7rem 1rem 0.55rem', background: markerColor,
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                            }}>
                                <div style={{
                                    width: '26px', height: '26px', borderRadius: '7px',
                                    background: 'rgba(255,255,255,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <i className={`pi ${meta.icon}`} style={{ color: '#fff', fontSize: '0.72rem' }} />
                                </div>
                                <span style={{ fontSize: '0.71rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    Edit {meta.label}
                                </span>
                            </div>
                            <div style={{ padding: '0.85rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                {meta.type === 'select' ? (
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        {meta.options.map(opt => (
                                            <button key={opt}
                                                onClick={() => setEditingCell(prev => ({ ...prev, value: opt }))}
                                                style={{
                                                    flex: 1, padding: '0.5rem 0', borderRadius: '8px', cursor: 'pointer',
                                                    border: `2px solid ${editingCell.value === opt ? markerColor : (darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0')}`,
                                                    background: editingCell.value === opt ? markerColor : (darkMode ? '#1e293b' : '#f8fafc'),
                                                    color: editingCell.value === opt ? '#fff' : (darkMode ? '#94a3b8' : '#64748b'),
                                                    fontSize: '0.78rem', fontWeight: 700, transition: 'all 0.15s',
                                                }}
                                            >{opt}</button>
                                        ))}
                                    </div>
                                ) : (
                                    <input
                                        type={meta.type === 'number' ? 'number' : 'text'}
                                        value={editingCell.value}
                                        onChange={e => setEditingCell(prev => ({ ...prev, value: e.target.value }))}
                                        placeholder={`Enter ${meta.label}...`}
                                        autoFocus
                                        style={{
                                            width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px',
                                            border: `1.5px solid ${markerColor}55`, fontSize: '0.84rem', fontWeight: 600,
                                            color: darkMode ? '#f1f5f9' : '#1e293b',
                                            background: darkMode ? '#1e293b' : '#f8fafc',
                                            outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
                                        }}
                                        onFocus={e => e.target.style.borderColor = markerColor}
                                        onBlur={e => e.target.style.borderColor = `${markerColor}55`}
                                        onKeyDown={e => e.key === 'Enter' && handleCellSave()}
                                    />
                                )}
                                <button
                                    onClick={handleCellSave}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                        background: markerColor, color: '#fff', border: 'none',
                                        borderRadius: '8px', padding: '0.5rem 0',
                                        fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                                        letterSpacing: '0.02em', transition: 'opacity 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    <i className="pi pi-check" style={{ fontSize: '0.72rem' }} /> Save
                                </button>
                            </div>
                        </>
                    );
                })()}
            </OverlayPanel>
        </div>
    );
}

// ── AddRouteCard ─────────────────────────────────────────────────────────────
function AddRouteCard({ darkMode, onAdd }) {
    const [open, setOpen] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [form, setForm] = useState({ title: '', city: '', country: '', color: '#6366f1' });
    const [errors, setErrors] = useState({});
    const [newTagInput, setNewTagInput] = useState('');
    const [formTags, setFormTags] = useState([]);

    const PRESET_COLORS = ['#6366f1','#3b82f6','#0ea5e9','#10b981','#f59e0b','#ef4444','#ec4899','#8b5cf6','#f97316','#14b8a6'];

    const field = (key) => ({
        value: form[key],
        onChange: e => setForm(p => ({ ...p, [key]: e.target.value })),
    });

    const inputStyle = (hasErr) => ({
        width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', boxSizing: 'border-box',
        border: `1.5px solid ${hasErr ? '#f87171' : darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`,
        fontSize: '0.84rem', fontWeight: 600,
        color: darkMode ? '#f1f5f9' : '#1e293b',
        background: darkMode ? '#1e293b' : '#fff',
        outline: 'none', transition: 'border-color 0.15s',
    });

    const handleSubmit = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = true;
        if (!form.city.trim())  errs.city  = true;
        if (Object.keys(errs).length) { setErrors(errs); return; }

        const subTitle = `${form.city.trim()}${form.country.trim() ? ', ' + form.country.trim() : ''}`;
        const now = new Date().toISOString();
        onAdd({
            title: form.title.trim(),
            subTitle,
            description: '',
            tags: formTags,
            date: now,
            markerColor: form.color,
            routeColor: form.color + 'b3',
            bbox: { minLon: 0, minLat: 0, maxLon: 0, maxLat: 0 },
            iframeSrc: '',
            rows: [],
        });
        setOpen(false);
        setForm({ title: '', city: '', country: '', color: '#6366f1' });
        setErrors({});
        setNewTagInput('');
        setFormTags([]);
    };

    return (
        <>
            {/* ── Dashed card ── */}
            <div
                className="add-card-enter card-item"
                onClick={() => setOpen(true)}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                style={{
                    width: '340px', height: '520px', borderRadius: '16px',
                    border: `2.5px dashed ${hovering ? form.color : (darkMode ? 'rgba(255,255,255,0.18)' : '#cbd5e1')}`,
                    background: hovering
                        ? (darkMode ? `${form.color}0d` : `${form.color}08`)
                        : (darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)'),
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '1.1rem', cursor: 'pointer',
                    transition: 'border-color 0.25s, background 0.25s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
                }}
            >
                {/* Plus circle */}
                <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: hovering ? form.color : (darkMode ? 'rgba(255,255,255,0.07)' : '#f1f5f9'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: hovering ? `0 8px 28px ${form.color}55` : 'none',
                    transition: 'background 0.25s, box-shadow 0.25s',
                }}>
                    <i className="pi pi-plus" style={{
                        fontSize: '1.7rem',
                        color: hovering ? '#fff' : (darkMode ? '#475569' : '#94a3b8'),
                        transition: 'color 0.25s',
                    }} />
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '0.95rem', fontWeight: 700,
                        color: hovering ? form.color : (darkMode ? '#475569' : '#94a3b8'),
                        transition: 'color 0.25s',
                    }}>Add New Route</div>
                    <div style={{
                        fontSize: '0.72rem', fontWeight: 500, marginTop: '4px',
                        color: darkMode ? '#334155' : '#cbd5e1',
                    }}>Click to create a route</div>
                </div>
            </div>

            {/* ── Creation Dialog ── */}
            <Dialog
                baseZIndex={20000}
                header={null}
                visible={open}
                onHide={() => { setOpen(false); setErrors({}); setNewTagInput(''); setFormTags([]); }}
                style={{ width: '390px', padding: 0, borderRadius: '16px', overflow: 'hidden' }}
                contentStyle={{ padding: 0, background: darkMode ? '#0f172a' : '#f8fafc' }}
                headerStyle={{ display: 'none' }}
                modal closable={false} dismissableMask
                maskStyle={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.38)' }}
                footer={null}
            >
                {/* Header */}
                <div style={{
                    padding: '1.1rem 1.25rem 0.9rem',
                    background: darkMode ? '#1e293b' : '#ffffff',
                    borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                    <div style={{
                        width: '38px', height: '38px', borderRadius: '10px',
                        background: `linear-gradient(135deg, ${form.color}, ${form.color}bb)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        boxShadow: `0 2px 10px ${form.color}55`, transition: 'background 0.2s, box-shadow 0.2s',
                    }}>
                        <i className="pi pi-map-marker" style={{ color: '#fff', fontSize: '0.9rem' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: darkMode ? '#f1f5f9' : '#1e293b' }}>New Route</div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 500 }}>Fill in the details below</div>
                    </div>
                    <button onClick={() => { setOpen(false); setErrors({}); setNewTagInput(''); setFormTags([]); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#64748b' : '#94a3b8', padding: '5px', borderRadius: '6px' }}
                        onMouseEnter={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.07)' : '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    ><i className="pi pi-times" style={{ fontSize: '0.9rem' }} /></button>
                </div>

                {/* Body */}
                <div style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

                    {/* Route Name */}
                    <div>
                        <label style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: darkMode ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.35rem' }}>
                            <i className="pi pi-map-marker" style={{ fontSize: '0.62rem' }} /> Route Name *
                        </label>
                        <input {...field('title')} placeholder="e.g. Morning Express" autoFocus
                            style={inputStyle(errors.title)}
                            onFocus={e => { e.target.style.borderColor = form.color; setErrors(p => ({...p, title: false})); }}
                            onBlur={e => e.target.style.borderColor = errors.title ? '#f87171' : (darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0')}
                        />
                        {errors.title && <span style={{ fontSize: '0.68rem', color: '#f87171', marginTop: '3px', display: 'block' }}>Route name is required</span>}
                    </div>

                    {/* City + Country */}
                    <div>
                        <label style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: darkMode ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.35rem' }}>
                            <i className="pi pi-building" style={{ fontSize: '0.62rem' }} /> City / Country *
                        </label>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <input {...field('city')} placeholder="City *"
                                style={{ ...inputStyle(errors.city), flex: 1 }}
                                onFocus={e => { e.target.style.borderColor = form.color; setErrors(p => ({...p, city: false})); }}
                                onBlur={e => e.target.style.borderColor = errors.city ? '#f87171' : (darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0')}
                            />
                            <input {...field('country')} placeholder="Country"
                                style={{ ...inputStyle(false), flex: 1 }}
                                onFocus={e => e.target.style.borderColor = form.color}
                                onBlur={e => e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}
                            />
                        </div>
                        {errors.city && <span style={{ fontSize: '0.68rem', color: '#f87171', marginTop: '3px', display: 'block' }}>City is required</span>}
                    </div>

                    {/* Badges (optional) */}
                    <div>
                        <label style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: darkMode ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.35rem' }}>
                            <i className="pi pi-tags" style={{ fontSize: '0.62rem' }} /> Badges <span style={{ textTransform: 'none', fontWeight: 500, fontSize: '0.62rem', color: darkMode ? '#475569' : '#cbd5e1', marginLeft: '3px' }}>(optional)</span>
                        </label>
                        {/* existing tags */}
                        {formTags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.4rem' }}>
                                {formTags.map((tag, i) => (
                                    <span key={i} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                        background: darkMode ? `${form.color}22` : `${form.color}16`,
                                        color: form.color, fontSize: '0.72rem', fontWeight: 600,
                                        padding: '2px 8px 2px 10px', borderRadius: '999px',
                                        border: `1px solid ${form.color}44`,
                                    }}>
                                        {tag}
                                        <button onClick={() => setFormTags(p => p.filter((_, j) => j !== i))}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: form.color, padding: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}>
                                            <i className="pi pi-times" style={{ fontSize: '0.55rem' }} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                            <input
                                value={newTagInput}
                                onChange={e => setNewTagInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && newTagInput.trim()) {
                                        setFormTags(p => [...p, newTagInput.trim()]);
                                        setNewTagInput('');
                                    }
                                }}
                                placeholder="Type badge & press Enter..."
                                style={{ ...inputStyle(false), flex: 1 }}
                                onFocus={e => e.target.style.borderColor = form.color}
                                onBlur={e => e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}
                            />
                            <button
                                onClick={() => { if (newTagInput.trim()) { setFormTags(p => [...p, newTagInput.trim()]); setNewTagInput(''); } }}
                                style={{
                                    background: newTagInput.trim() ? form.color : (darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                                    color: newTagInput.trim() ? '#fff' : (darkMode ? '#475569' : '#94a3b8'),
                                    border: 'none', borderRadius: '8px', cursor: newTagInput.trim() ? 'pointer' : 'default',
                                    padding: '0 0.75rem', fontSize: '0.75rem', fontWeight: 700, transition: 'all 0.15s',
                                    display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap',
                                }}
                            ><i className="pi pi-plus" style={{ fontSize: '0.65rem' }} /> Add</button>
                        </div>
                    </div>

                    {/* Color */}
                    <div>
                        <label style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: darkMode ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.45rem' }}>
                            <i className="pi pi-palette" style={{ fontSize: '0.62rem' }} /> Color
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, border: `2px solid ${form.color}66`, boxShadow: `0 2px 8px ${form.color}44`, cursor: 'pointer' }}>
                                <input type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                                    style={{ width: '55px', height: '55px', border: 'none', padding: 0, cursor: 'pointer', margin: '-7px 0 0 -7px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', flex: 1 }}>
                                {PRESET_COLORS.map(c => (
                                    <div key={c} onClick={() => setForm(p => ({ ...p, color: c }))}
                                        style={{
                                            width: '22px', height: '22px', borderRadius: '6px', background: c, cursor: 'pointer',
                                            border: `2.5px solid ${form.color === c ? '#fff' : 'transparent'}`,
                                            boxShadow: form.color === c ? `0 0 0 2px ${c}` : '0 1px 3px rgba(0,0,0,0.15)',
                                            transition: 'all 0.15s',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '0.75rem 1.25rem 1.1rem', display: 'flex', gap: '0.5rem',
                    background: darkMode ? '#1e293b' : '#ffffff',
                    borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : '#e2e8f0'}`,
                }}>
                    <button onClick={() => { setOpen(false); setErrors({}); setNewTagInput(''); setFormTags([]); }}
                        style={{
                            flex: 1, padding: '0.5rem 0', borderRadius: '8px',
                            background: 'transparent', color: darkMode ? '#94a3b8' : '#64748b',
                            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    ><i className="pi pi-times" style={{ fontSize: '0.72rem' }} /> Cancel</button>
                    <button onClick={handleSubmit}
                        style={{
                            flex: 1, padding: '0.5rem 0', borderRadius: '8px',
                            background: form.color, color: '#fff', border: 'none',
                            fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                            transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    ><i className="pi pi-plus" style={{ fontSize: '0.72rem' }} /> Create Route</button>
                </div>
            </Dialog>
        </>
    );
}

// ── Export ───────────────────────────────────────────────────────────────────
export default function AdvancedDemo({ darkMode, editMode }) {
    const [cards, setCards] = useState(cardDatasets);

    const handleAddCard = (newCard) => {
        setCards(prev => [...prev, newCard]);
    };

    return (
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'stretch' }}>
            {cards.map((card, i) => (
                <CardItem key={i} {...card} darkMode={darkMode} editMode={editMode} index={i} />
            ))}
            {editMode && <AddRouteCard darkMode={darkMode} onAdd={handleAddCard} />}
        </div>
    );
}
