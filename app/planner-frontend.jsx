/* ============================================================
   PLANNER · FRONTEND (client-facing kitchen planner)
   Audience: interior contractors. Execution engine — every module = real SKU, BOQ auto-generated.
   ============================================================ */

const pInk      = '#16140f';
const pPaper    = '#f5f3ed';
const pPaper2   = '#fbf9f3';
const pWarm     = '#f0ece2';
const pBg       = '#ece9e2';
const pInkSoft  = '#4a463d';
const pMute     = 'rgba(22,20,15,0.55)';
const pMute2    = 'rgba(22,20,15,0.35)';
const pLine     = 'rgba(22,20,15,0.08)';
const pLine2    = 'rgba(22,20,15,0.16)';
const pAccent   = '#c96442';
const pSienna   = '#c96442';
const pSienna2  = '#e0795a';
const pSiennaSoft = 'rgba(201,100,66,0.08)';
const pGreen    = '#4ea25a';

const pStyles = {
  shell:      { width:'100%', height:'100%', background:pBg, color:pInk, fontFamily:'"Geist",-apple-system,system-ui,sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' },
  topbar:     { height:60, padding:'0 24px', background:pPaper, borderBottom:`1px solid ${pLine}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 },
  body:       { flex:1, display:'flex', minHeight:0 },
  panel:      { background:pPaper, borderRight:`1px solid ${pLine}`, display:'flex', flexDirection:'column' },
  pillBtn:    { padding:'8px 14px', borderRadius:100, fontSize:13, fontWeight:500, border:`1px solid ${pLine2}`, background:'transparent', cursor:'pointer', color:pInk },
  primaryBtn: { padding:'8px 14px', borderRadius:100, fontSize:13, fontWeight:600, background:pInk, color:pPaper, cursor:'pointer' },
  fraunces:   { fontFamily:'"Fraunces",Georgia,serif' },
  mono:       { fontFamily:'JetBrains Mono,monospace' },
};

/* ── Actual Kreobox logo mark ────────────────────────────────
   Box/crate with open lid — matches the brand mark.          */
function KreoboxMark({ size = 26, color = pAccent }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* open box body with inner cutout (evenodd) */}
      <path fillRule="evenodd" clipRule="evenodd"
        d="M10 32 H90 V90 Q90 97 83 97 H17 Q10 97 10 90 Z
           M24 46 H76 V82 H24 Z"
        fill={color} />
      {/* tilted lid / panel */}
      <rect x="11" y="10" width="80" height="17" rx="3"
        transform="rotate(-7 51 18)"
        fill={color} fillOpacity="0.72" />
    </svg>
  );
}

function KreoboxWordmark({ size = 18, color = pInk }) {
  return (
    <span style={{
      fontFamily: '"Fraunces", "Cormorant Garamond", Georgia, serif',
      fontSize: size, fontWeight: 500, letterSpacing: '0.18em',
      textTransform: 'uppercase', color,
    }}>Kreobox</span>
  );
}

/* ── Item Modify Panel ─────────────────────────────────────── */
const DOOR_FINISHES = [
  { name:'Bali Oak',       color:'#c8b89a' },
  { name:'Bone Matte',     color:'#e8e4dc' },
  { name:'Espresso',       color:'#2e2822' },
  { name:'Sand Grey',      color:'#b8af9e' },
  { name:'Graphite',       color:'#424250' },
  { name:'Nat. Walnut',    color:'#a07850' },
  { name:'Sage Green',     color:'#7a9e7e' },
];
const HANDLE_TYPES = ['Push-to-open', 'Bar handle', 'Cup pull', 'T-bar', 'Recessed'];
const WORKTOP_TYPES = ['Quartz White', 'Quartz Calacatta', 'Laminate Oak', 'Laminate Concrete', 'Solid Walnut'];

function ItemModifyPanel({ item, onUpdate, onDuplicate, onDelete, onClose }) {
  const { useState: useS } = React;
  const isBase = item.name && item.name.toLowerCase().includes('base');
  const dims = item.w && item.h ? `${Math.round(item.w)}×600×${Math.round(item.h)} mm` : '';
  const code = 'KBX-' + item.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,5);

  const SECTIONS = [
    { label:'Door finish', key:'doorFinish', options: DOOR_FINISHES.map(d => d.name) },
    { label:'Handle', key:'handle', options: HANDLE_TYPES },
    ...(isBase ? [{ label:'Worktop', key:'worktop', options: WORKTOP_TYPES }] : []),
  ];

  const iconBtn = (label, icon, onClick, danger) => (
    <button onClick={onClick} style={{
      display:'flex', flexDirection:'column', alignItems:'center', gap:4,
      padding:'8px 10px', border:`1px solid ${danger ? '#e05050' : pLine}`,
      borderRadius:8, background:'transparent', cursor:'pointer',
      color: danger ? '#e05050' : pMute, fontSize:9, fontWeight:700,
      fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.06em',
    }}>
      <span style={{ fontSize:16 }}>{icon}</span>
      {label}
    </button>
  );

  return (
    <div style={{
      position:'absolute', top:0, right:0, bottom:0, width:260, zIndex:20,
      background:pPaper, borderLeft:`1px solid ${pLine}`,
      display:'flex', flexDirection:'column', overflowY:'auto',
      boxShadow:'-8px 0 32px rgba(0,0,0,0.08)',
    }}>
      {/* Header */}
      <div style={{ padding:'14px 16px', borderBottom:`1px solid ${pLine}`, flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontSize:9, fontFamily:'JetBrains Mono,monospace', fontWeight:700, letterSpacing:'0.16em', color:pMute, marginBottom:3 }}>{code}</div>
            <div style={{ fontFamily:'Fraunces,serif', fontSize:15, fontWeight:400, lineHeight:1.25, color:pInk }}>{item.name}</div>
            {item.variant && <div style={{ fontSize:10, color:pMute, marginTop:3 }}>{item.variant}</div>}
            {dims && <div style={{ fontSize:9, fontFamily:'JetBrains Mono,monospace', color:pMute, marginTop:2 }}>{dims}</div>}
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:pMute, fontSize:18, lineHeight:1, padding:0 }}>×</button>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding:'12px 16px', borderBottom:`1px solid ${pLine}`, display:'flex', gap:6, flexWrap:'wrap', flexShrink:0 }}>
        {iconBtn('Duplicate', '⧉', onDuplicate)}
        {iconBtn('Remove', '🗑', onDelete, true)}
      </div>

      {/* Customisation sections */}
      <div style={{ padding:'12px 16px', display:'flex', flexDirection:'column', gap:16 }}>
        {SECTIONS.map(sec => (
          <div key={sec.key}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:pMute, fontFamily:'JetBrains Mono,monospace', marginBottom:8 }}>
              {sec.label}
            </div>
            {sec.key === 'doorFinish' ? (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {DOOR_FINISHES.map(df => (
                  <div key={df.name} onClick={() => onUpdate({ doorFinish: df.name })}
                    title={df.name}
                    style={{
                      width:28, height:28, borderRadius:6, background:df.color, cursor:'pointer',
                      border: item.doorFinish === df.name ? `2px solid ${pAccent}` : `2px solid transparent`,
                      boxShadow: item.doorFinish === df.name ? `0 0 0 1px ${pAccent}` : 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                    }} />
                ))}
              </div>
            ) : (
              <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                {sec.options.map(opt => (
                  <button key={opt} onClick={() => onUpdate({ [sec.key]: opt })} style={{
                    padding:'4px 8px', borderRadius:5, fontSize:10, fontWeight:600, cursor:'pointer',
                    border: `1px solid ${item[sec.key] === opt ? pAccent : pLine}`,
                    background: item[sec.key] === opt ? 'rgba(201,100,66,0.08)' : 'transparent',
                    color: item[sec.key] === opt ? pAccent : pMute,
                  }}>{opt}</button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Price */}
      {item.price && (
        <div style={{ marginTop:'auto', padding:'14px 16px', borderTop:`1px solid ${pLine}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:11, color:pMute }}>Unit price</span>
          <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:13, fontWeight:700, color:pInk }}>{item.price}</span>
        </div>
      )}
    </div>
  );
}

/* ── 2D top-down kitchen plan (blank canvas, drag-and-drop) ── */
function KitchenPlan2D({ accent = pAccent, roomType = 'kitchen', items = [], roomElements = [], onDrop, onItemMove, onItemDelete, onItemSelect, selectedItemId, roomW: ROOM_W = 3800, roomD: ROOM_D = 2840 }) {
  const { useState: useS, useRef } = React;
  const svgRef = useRef(null);
  const [drag, setDrag] = useS(null); // { id, startSX, startSY, origX, origY, moved }

  const SVG_W = 480, SVG_H = 380;
  const PX = 48, PY = 44, PW = 390, PH = 292;
  const r2s  = (rx, ry) => ({ x: PX + rx * PW / ROOM_W, y: PY + ry * PH / ROOM_D });
  const r2sw = w => w * PW / ROOM_W;
  const r2sh = h => h * PH / ROOM_D;
  const svgXY = e => {
    const r = svgRef.current.getBoundingClientRect();
    return { sx: (e.clientX - r.left) * SVG_W / r.width, sy: (e.clientY - r.top) * SVG_H / r.height };
  };

  const handleDrop = e => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const r = svgRef.current.getBoundingClientRect();
      const sx = (e.clientX - r.left) * SVG_W / r.width;
      const sy = (e.clientY - r.top) * SVG_H / r.height;
      const roomX = (sx - PX) * ROOM_W / PW;
      const roomY = (sy - PY) * ROOM_D / PH;
      onDrop && onDrop({ ...data, x: roomX, y: roomY });
    } catch {}
  };

  const handleItemDown = (e, item) => {
    e.stopPropagation();
    const { sx, sy } = svgXY(e);
    setDrag({ id: item.id, startSX: sx, startSY: sy, origX: item.x, origY: item.y, moved: false });
  };

  const handleMouseMove = e => {
    if (!drag) return;
    const { sx, sy } = svgXY(e);
    const dx = (sx - drag.startSX) * ROOM_W / PW;
    const dy = (sy - drag.startSY) * ROOM_D / PH;
    if (Math.abs(sx - drag.startSX) > 3 || Math.abs(sy - drag.startSY) > 3) {
      setDrag(d => ({ ...d, moved: true }));
      onItemMove && onItemMove(drag.id, drag.origX + dx, drag.origY + dy);
    }
  };

  const handleMouseUp = (e) => {
    if (drag && !drag.moved) {
      onItemSelect && onItemSelect(drag.id === selectedItemId ? null : drag.id);
    }
    setDrag(null);
  };

  const dimColor = pMute;
  return (
    <div style={{ width:'100%', height:'100%' }}>
      <svg ref={svgRef} viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ width:'100%', height:'100%', display:'block', cursor: drag ? 'grabbing' : 'default' }}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setDrag(null)}
        onClick={() => onItemSelect && onItemSelect(null)}
      >
        <defs>
          <pattern id="grid"       width="20"  height="20"  patternUnits="userSpaceOnUse"><path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(26,24,21,0.06)" strokeWidth="1"/></pattern>
          <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M100 0 L0 0 0 100" fill="none" stroke="rgba(26,24,21,0.11)" strokeWidth="1"/></pattern>
        </defs>

        {/* Grid */}
        <rect x={PX} y={PY} width={PW} height={PH} fill="url(#grid)"/>
        <rect x={PX} y={PY} width={PW} height={PH} fill="url(#grid-major)"/>
        <rect x={PX} y={PY} width={PW} height={PH} fill="rgba(232,226,213,0.18)"/>

        {/* Room walls */}
        {roomType === 'kitchen' && <>
          <path d={`M${PX} ${PY+PH} L${PX} ${PY} L${PX+PW} ${PY}`}
            fill="none" stroke="#1a1815" strokeWidth="6" strokeLinejoin="round"/>
          <path d={`M${PX+PW} ${PY} L${PX+PW} ${PY+PH*0.37}`}
            fill="none" stroke="#1a1815" strokeWidth="6" strokeLinecap="round"/>
          <path d={`M${PX} ${PY+PH} L${PX+120} ${PY+PH}`}
            fill="none" stroke="#1a1815" strokeWidth="6" strokeLinecap="round"/>
        </>}
        {roomType === 'wardrobe' && <>
          {/* Full bedroom rectangle */}
          <rect x={PX} y={PY} width={PW} height={PH} fill="none" stroke="#1a1815" strokeWidth="6" strokeLinejoin="round"/>
          {/* Wardrobe wall zone on top (dashed) */}
          <line x1={PX} y1={PY+PH*0.22} x2={PX+PW} y2={PY+PH*0.22} stroke={pMute} strokeWidth="1.5" strokeDasharray="6 4"/>
          {/* Hanging rail symbols */}
          {[0.1,0.35,0.6,0.85].map(rx => (
            <circle key={rx} cx={PX+PW*rx} cy={PY+PH*0.11} r="5" fill="none" stroke={pMute} strokeWidth="1.5"/>
          ))}
          <text x={PX+PW/2} y={PY+PH*0.17} textAnchor="middle" fill={pMute} fontSize="8" fontFamily="JetBrains Mono,monospace">WARDROBE ZONE</text>
          {/* Door swing on right wall */}
          <path d={`M${PX+PW} ${PY+PH*0.65} Q${PX+PW-40} ${PY+PH*0.65} ${PX+PW-40} ${PY+PH*0.88}`}
            fill="rgba(201,100,66,0.08)" stroke={pAccent} strokeWidth="1" strokeDasharray="4 3"/>
        </>}
        {roomType === 'office' && <>
          {/* Full office rectangle */}
          <rect x={PX} y={PY} width={PW} height={PH} fill="none" stroke="#1a1815" strokeWidth="6" strokeLinejoin="round"/>
          {/* Desk zone indicator */}
          <line x1={PX} y1={PY+PH*0.45} x2={PX+PW} y2={PY+PH*0.45} stroke={pMute} strokeWidth="1" strokeDasharray="8 4"/>
          <text x={PX+PW/2} y={PY+PH*0.36} textAnchor="middle" fill={pMute} fontSize="8" fontFamily="JetBrains Mono,monospace">DESK ZONE</text>
          <text x={PX+PW/2} y={PY+PH*0.72} textAnchor="middle" fill={pMute} fontSize="8" fontFamily="JetBrains Mono,monospace">MEETING / LOUNGE</text>
          {/* Door opening */}
          <line x1={PX} y1={PY+PH*0.78} x2={PX} y2={PY+PH} stroke="#fafaf7" strokeWidth="7"/>
          <path d={`M${PX} ${PY+PH*0.78} Q${PX+44} ${PY+PH*0.78} ${PX+44} ${PY+PH}`}
            fill="rgba(201,100,66,0.08)" stroke={pAccent} strokeWidth="1" strokeDasharray="4 3"/>
        </>}

        {/* Dimension lines */}
        <g fill={dimColor} fontSize="9" fontFamily="JetBrains Mono,monospace">
          <line x1={PX} y1={PY-8} x2={PX+PW} y2={PY-8} stroke={dimColor} strokeWidth="1"/>
          <line x1={PX} y1={PY-12} x2={PX} y2={PY-4} stroke={dimColor} strokeWidth="1"/>
          <line x1={PX+PW} y1={PY-12} x2={PX+PW} y2={PY-4} stroke={dimColor} strokeWidth="1"/>
          <text x={PX+PW/2} y={PY-14} textAnchor="middle">{ROOM_W.toLocaleString('en-IN')} mm</text>
          <line x1={PX-8} y1={PY} x2={PX-8} y2={PY+PH} stroke={dimColor} strokeWidth="1"/>
          <line x1={PX-12} y1={PY} x2={PX-4} y2={PY} stroke={dimColor} strokeWidth="1"/>
          <line x1={PX-12} y1={PY+PH} x2={PX-4} y2={PY+PH} stroke={dimColor} strokeWidth="1"/>
          <text x={PX-20} y={PY+PH/2} textAnchor="middle" transform={`rotate(-90,${PX-20},${PY+PH/2})`}>{ROOM_D.toLocaleString('en-IN')} mm</text>
        </g>

        {/* Empty state */}
        {items.length === 0 && (
          <g>
            <text x={PX+PW/2} y={PY+PH/2+16} fill="rgba(26,24,21,0.13)" fontSize="12" fontFamily="JetBrains Mono,monospace" textAnchor="middle">
              {roomType === 'wardrobe' ? 'Drag wardrobes & fittings to place' : roomType === 'office' ? 'Drag desks & storage to place' : 'Drag items from catalog to place'}
            </text>
            <text x={PX+PW/2} y={PY+PH/2+32} fill="rgba(26,24,21,0.08)" fontSize="10" fontFamily="JetBrains Mono,monospace" textAnchor="middle">Scale 1:25 · drag to reposition</text>
          </g>
        )}

        {/* Placed items */}
        {items.map(item => {
          const sp = r2s(item.x, item.y);
          const sw = Math.max(8, r2sw(item.w));
          const sh = Math.max(6, r2sh(item.h));
          const isActive = drag?.id === item.id;
          const isSelected = selectedItemId === item.id;
          return (
            <g key={item.id} onMouseDown={e => handleItemDown(e, item)}
              style={{ cursor: isActive ? 'grabbing' : 'grab' }}>
              {isSelected && <rect x={sp.x-2} y={sp.y-2} width={sw+4} height={sh+4} fill="none" stroke={accent} strokeWidth={2} rx={3} strokeDasharray="4 2" />}
              <rect x={sp.x} y={sp.y} width={sw} height={sh}
                fill={item.color} fillOpacity={isSelected ? 1 : 0.88}
                stroke={isActive ? accent : isSelected ? accent : 'rgba(26,24,21,0.4)'}
                strokeWidth={isActive || isSelected ? 2 : 1} rx={1}/>
              {sw > 18 && sh > 10 && (
                <>
                  <line x1={sp.x+sw*0.2} y1={sp.y+sh/2} x2={sp.x+sw*0.8} y2={sp.y+sh/2}
                    stroke="rgba(255,255,255,0.35)" strokeWidth="0.8"/>
                  <line x1={sp.x+sw/2} y1={sp.y+sh*0.2} x2={sp.x+sw/2} y2={sp.y+sh*0.8}
                    stroke="rgba(255,255,255,0.35)" strokeWidth="0.8"/>
                  <text x={sp.x+sw/2} y={sp.y+sh/2+3}
                    fill="rgba(255,255,255,0.9)" fontSize={Math.min(8,sw*0.13)}
                    fontFamily="JetBrains Mono,monospace" textAnchor="middle"
                    style={{ pointerEvents:'none', userSelect:'none' }}>
                    {item.name.split(' ').slice(0,2).join(' ')}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Room elements overlay */}
        {roomElements.map(el => {
          const sp = r2s(el.x, el.y);
          const sw = r2sw(el.w || 800), sh = r2sh(60);
          if (el.type === 'door') return (
            <g key={el.id}>
              <rect x={sp.x} y={sp.y-sh/2} width={sw} height={sh} fill="#fff" stroke="#333" strokeWidth="2"/>
              <path d={`M${sp.x} ${sp.y} A${sw} ${sw} 0 0 1 ${sp.x+sw} ${sp.y-sw}`} fill="none" stroke="#333" strokeWidth="1" strokeDasharray="3 2"/>
            </g>
          );
          if (el.type === 'window') return (
            <g key={el.id}>
              <rect x={sp.x} y={sp.y-sh/2} width={sw} height={sh} fill="#bde" stroke="#36a" strokeWidth="2"/>
              <line x1={sp.x+sw*0.33} y1={sp.y-sh/2} x2={sp.x+sw*0.33} y2={sp.y+sh/2} stroke="#36a" strokeWidth="1"/>
              <line x1={sp.x+sw*0.66} y1={sp.y-sh/2} x2={sp.x+sw*0.66} y2={sp.y+sh/2} stroke="#36a" strokeWidth="1"/>
            </g>
          );
          if (el.type === 'pillar') return (
            <g key={el.id}>
              <rect x={sp.x-8} y={sp.y-8} width={16} height={16} fill="#888" stroke="#444" strokeWidth="1.5"/>
              <line x1={sp.x-8} y1={sp.y-8} x2={sp.x+8} y2={sp.y+8} stroke="#444" strokeWidth="1"/>
              <line x1={sp.x+8} y1={sp.y-8} x2={sp.x-8} y2={sp.y+8} stroke="#444" strokeWidth="1"/>
            </g>
          );
          if (el.type === 'electrical') return (
            <g key={el.id}>
              <circle cx={sp.x} cy={sp.y} r={8} fill="#fff9c4" stroke="#e6b800" strokeWidth="2"/>
              <text x={sp.x} y={sp.y+3} textAnchor="middle" fontSize="8" fontWeight="700" fill="#b38600" style={{pointerEvents:'none'}}>⚡</text>
            </g>
          );
          if (el.type === 'ventilation') return (
            <g key={el.id}>
              <circle cx={sp.x} cy={sp.y} r={9} fill="#e8f5e9" stroke="#388e3c" strokeWidth="2"/>
              <line x1={sp.x-6} y1={sp.y} x2={sp.x+6} y2={sp.y} stroke="#388e3c" strokeWidth="1.5"/>
              <line x1={sp.x} y1={sp.y-6} x2={sp.x} y2={sp.y+6} stroke="#388e3c" strokeWidth="1.5"/>
              <circle cx={sp.x} cy={sp.y} r={3} fill="#388e3c"/>
            </g>
          );
          return null;
        })}

        {/* Scale label */}
        <text x={PX+PW} y={PY+PH+14} fill={dimColor} fontSize="9" fontFamily="JetBrains Mono,monospace" textAnchor="end">Scale 1:25</text>
      </svg>
    </div>
  );
}

/* ── Front elevation — driven by placed items ──────────────── */
function KitchenElevation({ accent = pAccent, items = [], roomW = 3800, roomH = 2400 }) {
  const cabFill = '#e8e2d5', cabStroke = '#a99a82', dimColor = pMute;
  const SVG_W = 480, SVG_H = 340;
  const L = 30, R = SVG_W - 30, B = 300, T = 40;
  const availW = R - L;
  const availH = B - T;
  // scale: room mm → svg px
  const scaleX = availW / roomW;
  const scaleH = availH / roomH;

  // Filter items that are cabinets/storage (not appliances on floor)
  const cabItems = items.filter(it => {
    const n = it.name.toLowerCase();
    return n.includes('cabinet') || n.includes('wardrobe') || n.includes('pantry') || n.includes('frame') || n.includes('desk') || n.includes('shelf');
  });

  // Sort by x position for elevation rendering
  const sorted = [...cabItems].sort((a, b) => a.x - b.x);

  // If no placed items show placeholder message
  if (items.length === 0) {
    return (
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width:'100%', height:'100%', display:'block' }}>
        <rect width={SVG_W} height={SVG_H} fill={pBg}/>
        <line x1={L} y1={B} x2={R} y2={B} stroke="#1a1815" strokeWidth="3"/>
        <line x1={L} y1={T} x2={R} y2={T} stroke="rgba(26,24,21,0.12)" strokeWidth="1" strokeDasharray="4 4"/>
        <text x={SVG_W/2} y={SVG_H/2 - 8} fill="rgba(26,24,21,0.18)" fontSize="12" fontFamily="JetBrains Mono,monospace" textAnchor="middle">
          Drag items to 2D plan to see elevation
        </text>
        <text x={SVG_W/2} y={SVG_H/2 + 10} fill="rgba(26,24,21,0.1)" fontSize="10" fontFamily="JetBrains Mono,monospace" textAnchor="middle">
          FRONT ELEVATION · {(roomW/1000).toFixed(1)} m
        </text>
        <g fill={dimColor} fontSize="9" fontFamily="JetBrains Mono,monospace">
          <line x1={L} y1={B+16} x2={R} y2={B+16} stroke={dimColor} strokeWidth="1"/>
          <line x1={L} y1={B+12} x2={L} y2={B+20} stroke={dimColor} strokeWidth="1"/>
          <line x1={R} y1={B+12} x2={R} y2={B+20} stroke={dimColor} strokeWidth="1"/>
          <text x={SVG_W/2} y={B+30} textAnchor="middle">{(roomW/1000).toFixed(1)*1000} mm · FRONT ELEVATION</text>
        </g>
      </svg>
    );
  }

  // Draw each placed item as a cabinet elevation block
  const BASE_CAB_H = 870; // mm (base cabinet standard height incl worktop)
  const WALL_CAB_Y = 1380; // mm from floor (wall cabinet bottom)
  const WALL_CAB_H = 720;

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width:'100%', height:'100%', display:'block' }}>
      <rect width={SVG_W} height={SVG_H} fill={pBg}/>
      <line x1={L} y1={T} x2={R} y2={T} stroke="rgba(26,24,21,0.1)" strokeWidth="1" strokeDasharray="4 4"/>
      <rect x={L} y={T} width={availW} height={availH} fill="rgba(232,226,213,0.12)"/>

      {/* Render placed items as elevation blocks */}
      {sorted.map((item, i) => {
        const n = item.name.toLowerCase();
        const isWall = n.includes('wall') || n.includes('floating');
        const isHigh = n.includes('high') || n.includes('pantry high') || n.includes('wardrobe') || n.includes('frame');
        const itemW = Math.max(20, item.w * scaleX);
        const svgX = L + item.x * scaleX;

        let cabH, svgY, fill;
        if (isHigh) {
          cabH = availH; svgY = T; fill = cabFill;
        } else if (isWall) {
          cabH = WALL_CAB_H * scaleH; svgY = B - BASE_CAB_H * scaleH - cabH - 4; fill = 'rgba(232,226,213,0.7)';
        } else {
          cabH = BASE_CAB_H * scaleH; svgY = B - cabH; fill = cabFill;
        }

        const isAppliance = n.includes('hob') || n.includes('oven') || n.includes('sink') || n.includes('dishwasher') || n.includes('fridge');
        const appFill = n.includes('hob') || n.includes('oven') ? '#2a2520' : n.includes('sink') ? '#a0b8c8' : n.includes('fridge') ? '#b8c8b0' : cabFill;

        return (
          <g key={item.id}>
            <rect x={svgX} y={svgY} width={itemW} height={cabH}
              fill={isAppliance ? appFill : fill} stroke={cabStroke} strokeWidth="1.2" rx="1"/>
            {!isAppliance && itemW > 24 && <line x1={svgX+itemW/2} y1={svgY+cabH*0.1} x2={svgX+itemW/2} y2={svgY+cabH*0.9} stroke={cabStroke} strokeWidth="0.7" strokeDasharray="2 2"/>}
            {itemW > 18 && <circle cx={svgX+itemW*0.3} cy={svgY+cabH*0.5} r="2.5" fill={cabStroke}/>}
            {itemW > 40 && (
              <text x={svgX+itemW/2} y={svgY+cabH+12} fill={pMute} fontSize="7" fontFamily="JetBrains Mono,monospace" textAnchor="middle"
                style={{ pointerEvents:'none' }}>
                {item.name.split(' ').slice(0,2).join(' ')}
              </text>
            )}
          </g>
        );
      })}

      {/* Worktop line */}
      {items.length > 0 && (
        <rect x={L} y={B - BASE_CAB_H * scaleH} width={availW} height={8} fill="#c8c0b0" stroke={cabStroke} strokeWidth="0.8"/>
      )}

      {/* Floor line */}
      <line x1={L} y1={B} x2={R} y2={B} stroke="#1a1815" strokeWidth="3"/>

      {/* Dimension lines */}
      <g fill={dimColor} fontSize="9" fontFamily="JetBrains Mono,monospace">
        <line x1={L-14} y1={T} x2={L-14} y2={B} stroke={dimColor} strokeWidth="1"/>
        <line x1={L-18} y1={T} x2={L-10} y2={T} stroke={dimColor} strokeWidth="1"/>
        <line x1={L-18} y1={B} x2={L-10} y2={B} stroke={dimColor} strokeWidth="1"/>
        <text x={L-22} y={(T+B)/2+3} textAnchor="middle" transform={`rotate(-90,${L-22},${(T+B)/2})`}>{roomH} mm</text>
        <line x1={L} y1={B+16} x2={R} y2={B+16} stroke={dimColor} strokeWidth="1"/>
        <line x1={L} y1={B+12} x2={L} y2={B+20} stroke={dimColor} strokeWidth="1"/>
        <line x1={R} y1={B+12} x2={R} y2={B+20} stroke={dimColor} strokeWidth="1"/>
        <text x={SVG_W/2} y={B+30} textAnchor="middle">{roomW} mm · FRONT ELEVATION</text>
      </g>
    </svg>
  );
}

/* ── Item price estimator ──────────────────────────────────── */
function estimateItemPrice(priceStr) {
  if (!priceStr) return 0;
  const m = priceStr.match(/₹\s*([\d.]+)\s*[–\-]\s*([\d.]+)\s*([kLM])?/i);
  if (!m) return 0;
  const mult = m[3] === 'L' ? 100000 : m[3] === 'M' ? 1000000 : 1000;
  return Math.round((parseFloat(m[1]) + parseFloat(m[2])) / 2 * mult);
}

/* ── TRUE PERSPECTIVE 3D view — driven by placed items ──────── */
function KitchenPlan3D({ accent = pAccent, items = [], roomW: RW = 3800, roomD: RD = 2840, roomH: RH = 2400, onMoveItem }) {
  const { useState: useS, useCallback: useCB, useMemo: useM, useRef } = React;
  const SVG_W = 620, SVG_H = 440;
  const denom = Math.sqrt(RW * RW + RD * RD);
  const focalP = SVG_W * 0.65;
  const [yaw, setYaw]       = useS(-35);
  const [pitch, setPitch]   = useS(-45);
  const [selIdx, setSelIdx] = useS(null);
  const [zoom, setZoom]     = useS(1);
  const [zoomCtr, setZoomCtr] = useS({ x: SVG_W/2, y: SVG_H/2 });
  const drag = useRef(null);
  const svgRef = useRef(null);

  const project = useCB((wx, wy, wz) => {
    const tx = wx - RW/2, ty = wy - RH*0.42, tz = wz - RD/2;
    const cy = Math.cos(yaw*Math.PI/180), sy = Math.sin(yaw*Math.PI/180);
    const cp = Math.cos(pitch*Math.PI/180), sp = Math.sin(pitch*Math.PI/180);
    const rx = tx*cy + tz*sy, rz = -tx*sy + tz*cy;
    const ry = ty*cp - rz*sp, depth = ty*sp + rz*cp + denom;
    if (depth < 1) return { x: SVG_W/2, y: SVG_H/2, z: -1 };
    return { x: SVG_W/2 + rx*focalP/depth, y: SVG_H/2 - ry*focalP/depth, z: depth };
  }, [yaw, pitch, RW, RD, RH]);

  /* item dimensions helper */
  const itemDims = (item) => {
    const n = item.name.toLowerCase();
    const isWall = (n.includes('wall') && n.includes('cabinet')) || n.includes('floating') || n.includes('wall shelf');
    const isHigh = n.includes('high cabinet') || n.includes('pantry high') || n.includes('wardrobe') || n.includes('frame');
    const bx = Math.max(0, item.x), bz = Math.max(0, item.y);
    const bw = Math.max(150, item.w || 600), bd = Math.max(100, item.h || 580);
    const by0 = isWall ? 1380 : 0;
    const by1 = isHigh ? 2200 : isWall ? 2100 : 870;
    return { bx, bz, bw, bd, by0, by1 };
  };

  /* item projected center for zoom focus */
  const itemCenter2D = (item) => {
    const { bx, bz, bw, bd, by0, by1 } = itemDims(item);
    return project(bx + bw/2, (by0+by1)/2, bz + bd/2);
  };

  /* room shell polys (floor + walls) */
  const shellPolys = useM(() => {
    const ps = [];
    const face = (pts3, fill, stroke='#00000018', sw=0.5) => ps.push({ pts3, fill, stroke, sw, itemIdx: null });
    face([[0,0,0],[RW,0,0],[RW,0,RD],[0,0,RD]], '#d8d3c8', '#c4bfb4');
    face([[0,0,0],[RW,0,0],[RW,RH,0],[0,RH,0]], '#edeae4', '#d8d3c8');
    face([[0,0,0],[0,0,RD],[0,RH,RD],[0,RH,0]], '#e8e4dc', '#d8d3c8');
    if (items.length === 0) {
      const cf = 'rgba(200,192,176,0.35)';
      face([[0,0,0],[2400,0,0],[2400,870,0],[0,870,0]], cf, '#00000010', 0.3);
      face([[0,870,0],[2400,870,0],[2400,870,580],[0,870,580]], cf, '#00000010', 0.3);
    }
    return ps;
  }, [items.length, RW, RD, RH]);

  /* item polys grouped by index */
  const allItemPolys = useM(() =>
    items.map((item, idx) => {
      const { bx, bz, bw, bd, by0, by1 } = itemDims(item);
      const fc = item.color || '#c8c0b0';
      const sel = idx === selIdx;
      const hi = sel ? '#fff' : '#00000022';
      const sw = sel ? 2 : 1.2;
      return [
        { pts3:[[bx,by0,bz+bd],[bx+bw,by0,bz+bd],[bx+bw,by1,bz+bd],[bx,by1,bz+bd]], fill:fc, stroke:hi, sw, itemIdx:idx },
        { pts3:[[bx,by0,bz],[bx+bw,by0,bz],[bx+bw,by1,bz],[bx,by1,bz]],               fill:fc, stroke:'#00000015', sw:0.5, itemIdx:idx },
        { pts3:[[bx,by1,bz],[bx+bw,by1,bz],[bx+bw,by1,bz+bd],[bx,by1,bz+bd]],          fill:fc, stroke:'#00000012', sw:0.4, itemIdx:idx },
        { pts3:[[bx+bw,by0,bz],[bx+bw,by0,bz+bd],[bx+bw,by1,bz+bd],[bx+bw,by1,bz]],   fill:fc, stroke:'#00000030', sw:0.5, itemIdx:idx },
        { pts3:[[bx,by0,bz],[bx,by0,bz+bd],[bx,by1,bz+bd],[bx,by1,bz]],                fill:fc, stroke:'#00000028', sw:0.5, itemIdx:idx },
      ];
    })
  , [items, selIdx]);

  /* project + sort all polys together for painter's algorithm */
  const projected = useM(() => {
    const all = [...shellPolys, ...allItemPolys.flat()].map(poly => {
      const pts2 = poly.pts3.map(([wx,wy,wz]) => project(wx,wy,wz));
      const avgZ = pts2.reduce((s,p2) => s+p2.z, 0) / pts2.length;
      const ptsStr = pts2.map(p2 => `${p2.x.toFixed(1)},${p2.y.toFixed(1)}`).join(' ');
      return { ...poly, avgZ, ptsStr };
    });
    return all.sort((a,b) => b.avgZ - a.avgZ);
  }, [shellPolys, allItemPolys, project]);

  /* zoom SVG transform: center view on selected item */
  const gTransform = selIdx !== null
    ? `translate(${(SVG_W/2 - zoomCtr.x * zoom).toFixed(1)} ${(SVG_H/2 - zoomCtr.y * zoom).toFixed(1)}) scale(${zoom})`
    : '';

  /* mouse handlers */
  const onDown = (e, clickedItemIdx = null) => {
    e.stopPropagation();
    if (clickedItemIdx !== null) {
      const item = items[clickedItemIdx];
      const c2 = itemCenter2D(item);
      setSelIdx(clickedItemIdx);
      setZoomCtr({ x: c2.x, y: c2.y });
      setZoom(2);
      drag.current = { type: 'move', idx: clickedItemIdx, ox: item.x, oy: item.y, depth: c2.z };
    } else {
      if (selIdx !== null) { setSelIdx(null); setZoom(1); drag.current = null; return; }
      drag.current = { type: 'rotate', sx: e.clientX, sy: e.clientY, y0: yaw, p0: pitch };
    }
  };

  const onMove = (e) => {
    if (!drag.current) return;
    if (drag.current.type === 'rotate') {
      setYaw(drag.current.y0 + (e.clientX - drag.current.sx) * 0.4);
      setPitch(Math.max(-80, Math.min(80, drag.current.p0 - (e.clientY - drag.current.sy) * 0.25)));
    } else if (drag.current.type === 'move' && onMoveItem) {
      const rect = svgRef.current ? svgRef.current.getBoundingClientRect() : { width: SVG_W, height: SVG_H };
      const svgScale = SVG_W / rect.width;
      const dmx = e.movementX * svgScale / zoom;
      const dmy = e.movementY * svgScale / zoom;
      const cy_ = Math.cos(yaw * Math.PI/180), sy_ = Math.sin(yaw * Math.PI/180);
      const sp  = Math.sin(pitch * Math.PI/180);
      const depth = Math.max(1, drag.current.depth);
      const perspScale = depth / focalP;
      const drx = dmx * perspScale;
      const drz = Math.abs(sp) > 0.15 ? (dmy * perspScale / sp) : 0;
      const dwx = drx * cy_ - drz * sy_;
      const dwz = drx * sy_ + drz * cy_;
      const newX = drag.current.ox + dwx;
      const newY = drag.current.oy + dwz;
      drag.current.ox = newX;
      drag.current.oy = newY;
      onMoveItem(drag.current.idx, { x: newX, y: newY });
      /* keep zoom centered on updated item position */
      const item = items[drag.current.idx];
      if (item) {
        const c2 = project(newX + (item.w||600)/2, (itemDims(item).by0+itemDims(item).by1)/2, newY + (item.h||580)/2);
        setZoomCtr({ x: c2.x, y: c2.y });
      }
    }
  };

  const onUp = () => { drag.current = null; };

  const confirmMove = (e) => {
    e.stopPropagation();
    setSelIdx(null);
    setZoom(1);
  };

  return (
    <div style={{ position:'relative', width:'100%', height:'100%' }}>
      <svg ref={svgRef} viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ width:'100%', height:'100%', display:'block', userSelect:'none',
          cursor: selIdx !== null ? 'move' : 'grab' }}
        onMouseDown={e => onDown(e, null)}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}>
        <rect width={SVG_W} height={SVG_H} fill={pBg} />
        <g transform={gTransform}>
          {projected.map((poly, i) => poly.avgZ > 0 && (
            <polygon key={i} points={poly.ptsStr} fill={poly.fill} stroke={poly.stroke} strokeWidth={poly.sw}
              style={{ cursor: poly.itemIdx !== null ? 'move' : 'default' }}
              onMouseDown={poly.itemIdx !== null ? e => onDown(e, poly.itemIdx) : undefined} />
          ))}
        </g>
        <text x={12} y={SVG_H-12} fill={pMute} fontSize="9" fontFamily="JetBrains Mono,monospace" style={{ pointerEvents:'none' }}>
          {selIdx !== null ? `3D · drag to move · click ✓ to confirm` : '3D PERSPECTIVE · drag to rotate · click item to select'}
        </text>
      </svg>

      {/* Confirm button when item selected */}
      {selIdx !== null && (
        <button onMouseDown={confirmMove}
          style={{ position:'absolute', top:12, right:12, padding:'7px 16px', borderRadius:8,
            background:'#1a1815', color:'#fff', border:'1px solid rgba(255,255,255,0.15)',
            fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
          ✓ Done
        </button>
      )}
    </div>
  );
}

/* ── Room Setup View ───────────────────────────────────────── */
function RoomSetupView({ roomW = 3800, roomD = 2840, elements = [], onAdd, onRemove, onMove }) {
  const { useState: useS, useRef } = React;
  const [tool, setTool] = useS('door');
  const [dragState, setDragState] = useS(null); // { id, startMx, startMy, startElX, startElY }
  const [hoverId, setHoverId] = useS(null);
  const svgRef = useRef(null);

  const TOOLS = [
    { id: 'door',        label: 'Door',        color: '#c96442', icon: 'D' },
    { id: 'window',      label: 'Window',      color: '#5b8def', icon: 'W' },
    { id: 'pillar',      label: 'Pillar',      color: '#888',    icon: 'P' },
    { id: 'electrical',  label: 'Electrical',  color: '#f0c040', icon: 'E' },
    { id: 'ventilation', label: 'Ventilation', color: '#4cba85', icon: 'V' },
  ];

  const PAD = 40, VW = 560, VH = 400;
  const scaleX = (VW - PAD * 2) / roomW;
  const scaleY = (VH - PAD * 2) / roomD;
  const sc = Math.min(scaleX, scaleY);
  const ox = (VW - roomW * sc) / 2;
  const oy = (VH - roomD * sc) / 2;

  const svgCoords = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    return {
      mx: (e.clientX - rect.left) / rect.width * VW,
      my: (e.clientY - rect.top)  / rect.height * VH,
    };
  };

  const handleSvgMouseDown = (e) => {
    if (e.button !== 0) return;
    const { mx, my } = svgCoords(e);
    const rx = (mx - ox) / sc;
    const ry = (my - oy) / sc;
    if (rx < 0 || ry < 0 || rx > roomW || ry > roomD) return;
    const newEl = { id: `el-${Date.now()}`, type: tool, x: rx, y: ry, w: tool === 'window' ? 800 : tool === 'door' ? 700 : 300, d: tool === 'pillar' ? 300 : 200 };
    onAdd && onAdd(newEl);
  };

  const handleElMouseDown = (e, el) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    const { mx, my } = svgCoords(e);
    setDragState({ id: el.id, startMx: mx, startMy: my, startElX: el.x, startElY: el.y });
  };

  const handleMouseMove = (e) => {
    if (!dragState) return;
    const { mx, my } = svgCoords(e);
    const dx = (mx - dragState.startMx) / sc;
    const dy = (my - dragState.startMy) / sc;
    const newX = Math.max(0, Math.min(roomW, dragState.startElX + dx));
    const newY = Math.max(0, Math.min(roomD, dragState.startElY + dy));
    onMove && onMove(dragState.id, newX, newY);
  };

  const handleMouseUp = () => setDragState(null);

  const renderEl = (el) => {
    const x = ox + el.x * sc, y = oy + el.y * sc;
    const w = el.w * sc, d = (el.d || 200) * sc;
    const isHovered = hoverId === el.id;
    const isDragging = dragState?.id === el.id;
    const baseProps = {
      key: el.id,
      style: { cursor: isDragging ? 'grabbing' : 'grab' },
      onMouseDown: e => handleElMouseDown(e, el),
      onMouseEnter: () => setHoverId(el.id),
      onMouseLeave: () => setHoverId(null),
    };
    const deleteBtn = isHovered && (
      <g onClick={e => { e.stopPropagation(); onRemove && onRemove(el.id); }} style={{ cursor:'pointer' }}>
        <circle cx={x + w/2} cy={y - d/2 - 8} r={8} fill="#e05050" />
        <text x={x + w/2} y={y - d/2 - 4} textAnchor="middle" fontSize={10} fill="#fff" style={{ pointerEvents:'none' }}>×</text>
      </g>
    );

    if (el.type === 'door') {
      const r = el.w * sc;
      return (
        <g {...baseProps}>
          <rect x={x} y={y - d/2} width={w} height={d} fill={isHovered ? 'rgba(201,100,66,0.25)' : 'rgba(201,100,66,0.15)'} stroke="#c96442" strokeWidth={isDragging ? 2 : 1.5} />
          <path d={`M ${x} ${y} A ${r*0.6} ${r*0.6} 0 0 1 ${x + r*0.6} ${y}`} fill="none" stroke="#c96442" strokeWidth={1} strokeDasharray="3 2" style={{ pointerEvents:'none' }} />
          <text x={x + w/2} y={y + 4} textAnchor="middle" fontSize={8} fill="#c96442" fontFamily="JetBrains Mono,monospace" style={{ pointerEvents:'none' }}>DOOR</text>
          {deleteBtn}
        </g>
      );
    }
    if (el.type === 'window') {
      return (
        <g {...baseProps}>
          <rect x={x} y={y - d/2} width={w} height={d} fill={isHovered ? 'rgba(91,141,239,0.28)' : 'rgba(91,141,239,0.18)'} stroke="#5b8def" strokeWidth={isDragging ? 2 : 1.5} />
          <line x1={x + w/3} y1={y - d/2} x2={x + w/3} y2={y + d/2} stroke="#5b8def" strokeWidth={1} style={{ pointerEvents:'none' }} />
          <line x1={x + 2*w/3} y1={y - d/2} x2={x + 2*w/3} y2={y + d/2} stroke="#5b8def" strokeWidth={1} style={{ pointerEvents:'none' }} />
          <text x={x + w/2} y={y + 4} textAnchor="middle" fontSize={8} fill="#5b8def" fontFamily="JetBrains Mono,monospace" style={{ pointerEvents:'none' }}>WIN</text>
          {deleteBtn}
        </g>
      );
    }
    if (el.type === 'pillar') {
      return (
        <g {...baseProps}>
          <rect x={x - w/2} y={y - d/2} width={w} height={d} fill={isHovered ? 'rgba(136,136,136,0.4)' : 'rgba(136,136,136,0.25)'} stroke="#888" strokeWidth={isDragging ? 2 : 1.5} />
          <line x1={x - w/2} y1={y - d/2} x2={x + w/2} y2={y + d/2} stroke="#888" strokeWidth={1} style={{ pointerEvents:'none' }} />
          <line x1={x + w/2} y1={y - d/2} x2={x - w/2} y2={y + d/2} stroke="#888" strokeWidth={1} style={{ pointerEvents:'none' }} />
          {isHovered && <circle cx={x + w/2} cy={y - d/2 - 8} r={8} fill="#e05050" onClick={e => { e.stopPropagation(); onRemove && onRemove(el.id); }} style={{ cursor:'pointer' }} />}
          {isHovered && <text x={x + w/2} y={y - d/2 - 4} textAnchor="middle" fontSize={10} fill="#fff" onClick={e => { e.stopPropagation(); onRemove && onRemove(el.id); }} style={{ cursor:'pointer', pointerEvents:'all' }}>×</text>}
        </g>
      );
    }
    if (el.type === 'electrical') {
      return (
        <g {...baseProps}>
          <circle cx={x} cy={y} r={10} fill={isHovered ? 'rgba(240,192,64,0.35)' : 'rgba(240,192,64,0.2)'} stroke="#f0c040" strokeWidth={isDragging ? 2 : 1.5} />
          <text x={x} y={y+4} textAnchor="middle" fontSize={10} fill="#f0c040" style={{ pointerEvents:'none' }}>E</text>
          {isHovered && <circle cx={x+10} cy={y-10} r={7} fill="#e05050" onClick={e => { e.stopPropagation(); onRemove && onRemove(el.id); }} style={{ cursor:'pointer' }} />}
          {isHovered && <text x={x+10} y={y-6} textAnchor="middle" fontSize={9} fill="#fff" onClick={e => { e.stopPropagation(); onRemove && onRemove(el.id); }} style={{ cursor:'pointer', pointerEvents:'all' }}>×</text>}
        </g>
      );
    }
    if (el.type === 'ventilation') {
      return (
        <g {...baseProps}>
          <circle cx={x} cy={y} r={10} fill={isHovered ? 'rgba(76,186,133,0.35)' : 'rgba(76,186,133,0.2)'} stroke="#4cba85" strokeWidth={isDragging ? 2 : 1.5} />
          <line x1={x-8} y1={y} x2={x+8} y2={y} stroke="#4cba85" strokeWidth={1} style={{ pointerEvents:'none' }} />
          <line x1={x} y1={y-8} x2={x} y2={y+8} stroke="#4cba85" strokeWidth={1} style={{ pointerEvents:'none' }} />
          <circle cx={x} cy={y} r={2} fill="#4cba85" style={{ pointerEvents:'none' }} />
          {isHovered && <circle cx={x+10} cy={y-10} r={7} fill="#e05050" onClick={e => { e.stopPropagation(); onRemove && onRemove(el.id); }} style={{ cursor:'pointer' }} />}
          {isHovered && <text x={x+10} y={y-6} textAnchor="middle" fontSize={9} fill="#fff" onClick={e => { e.stopPropagation(); onRemove && onRemove(el.id); }} style={{ cursor:'pointer', pointerEvents:'all' }}>×</text>}
        </g>
      );
    }
    return null;
  };

  return (
    <div style={{ display:'flex', height:'100%', background:pPaper }}>
      {/* Toolbar */}
      <div style={{ width:160, borderRight:`1px solid ${pLine}`, padding:'16px 12px', display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', color:pMute, fontWeight:700, marginBottom:4 }}>Place elements</div>
        {TOOLS.map(t => (
          <button key={t.id} onClick={() => setTool(t.id)} style={{
            padding:'8px 12px', borderRadius:8, border:`1.5px solid ${tool === t.id ? t.color : pLine}`,
            background: tool === t.id ? `${t.color}18` : 'transparent',
            color: tool === t.id ? t.color : pMute,
            fontSize:12, fontWeight:600, cursor:'pointer', textAlign:'left',
            display:'flex', alignItems:'center', gap:8,
          }}>
            <span style={{ width:22, height:22, borderRadius:5, background:`${t.color}22`, border:`1px solid ${t.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:t.color }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
        <div style={{ marginTop:'auto', fontSize:10, color:pMute, lineHeight:1.5 }}>
          Click floor to place.<br/>Drag to reposition.<br/>Hover + × to delete.
        </div>
        {elements.length > 0 && (
          <button onClick={() => elements.forEach(el => onRemove && onRemove(el.id))} style={{
            padding:'7px', borderRadius:6, border:`1px solid ${pLine}`, background:'transparent',
            color:pMute, fontSize:11, cursor:'pointer',
          }}>Clear all</button>
        )}
      </div>

      {/* SVG canvas */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
        <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`}
          style={{ width:'100%', height:'100%', display:'block', cursor: dragState ? 'grabbing' : 'crosshair', maxWidth:560, userSelect:'none' }}
          onMouseDown={handleSvgMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}>
          <rect width={VW} height={VH} fill={pPaper} />
          {/* Room outline */}
          <rect x={ox} y={oy} width={roomW*sc} height={roomD*sc} fill="rgba(26,24,21,0.03)" stroke={pInk} strokeWidth={2} />
          {/* Grid */}
          {Array.from({length: Math.floor(roomW/500)+1}, (_,i) => (
            <line key={`gx${i}`} x1={ox+i*500*sc} y1={oy} x2={ox+i*500*sc} y2={oy+roomD*sc} stroke={pLine} strokeWidth={0.5} />
          ))}
          {Array.from({length: Math.floor(roomD/500)+1}, (_,i) => (
            <line key={`gy${i}`} x1={ox} y1={oy+i*500*sc} x2={ox+roomW*sc} y2={oy+i*500*sc} stroke={pLine} strokeWidth={0.5} />
          ))}
          {/* Dimension labels */}
          <text x={ox + roomW*sc/2} y={oy + roomD*sc + 18} textAnchor="middle" fontSize={10} fill={pMute} fontFamily="JetBrains Mono,monospace">{(roomW/1000).toFixed(2)} m</text>
          <text x={ox - 14} y={oy + roomD*sc/2} textAnchor="middle" fontSize={10} fill={pMute} fontFamily="JetBrains Mono,monospace" transform={`rotate(-90,${ox-14},${oy+roomD*sc/2})`}>{(roomD/1000).toFixed(2)} m</text>
          {/* Room elements */}
          {elements.map(renderEl)}
          {/* Active tool hint */}
          <text x={VW-8} y={VH-8} textAnchor="end" fontSize={9} fill={pMute} fontFamily="JetBrains Mono,monospace">
            {`Tool: ${tool.toUpperCase()} · click to place · drag to move`}
          </text>
        </svg>
      </div>
    </div>
  );
}

/* ── View toggle ───────────────────────────────────────────── */
function ViewToggle({ value, onChange }) {
  const opts = ['Room setup', '2D plan', 'Elevation', '3D walk'];
  return (
    <div style={{ display:'inline-flex', gap:3, padding:3, background:pPaper, border:`1px solid ${pLine}`, borderRadius:100 }}>
      {opts.map(o => {
        const active = value === o;
        return (
          <span key={o} onClick={() => onChange(o)} style={{
            padding:'6px 14px', fontSize:12, fontWeight:500, borderRadius:100, cursor:'pointer',
            background: active ? pInk : 'transparent',
            color: active ? pPaper : pMute,
          }}>{o}</span>
        );
      })}
    </div>
  );
}

/* ── Product icon SVG ──────────────────────────────────────── */
function ProductIcon({ name = '', size = 52 }) {
  const n = name.toLowerCase();
  const cf = '#d8d0c0', cs = '#a99a82', sw = 1.5;
  const mk = (body) => <svg width={size} height={size} viewBox="0 0 56 56">{body}</svg>;

  if (n.includes('corner'))
    return mk(<><rect x="4" y="24" width="22" height="28" fill={cf} stroke={cs} strokeWidth={sw} rx="1"/><rect x="24" y="4" width="28" height="24" fill={cf} stroke={cs} strokeWidth={sw} rx="1"/><line x1="4" y1="36" x2="26" y2="36" stroke={cs} strokeWidth="1"/><line x1="38" y1="4" x2="38" y2="28" stroke={cs} strokeWidth="1"/></>);

  if (n.includes('sink'))
    return mk(<><rect x="4" y="16" width="48" height="32" fill={cf} stroke={cs} strokeWidth={sw} rx="1"/><ellipse cx="28" cy="32" rx="14" ry="10" fill="#c8c2b0" stroke={cs} strokeWidth="1"/><circle cx="28" cy="20" r="2" fill={cs}/></>);

  if (n.includes('hob') || n.includes('burner') || n.includes('gas'))
    return mk(<><rect x="4" y="16" width="48" height="32" fill="#2a2520" stroke={cs} strokeWidth={sw} rx="2"/><circle cx="18" cy="26" r="6" fill="none" stroke="#555" strokeWidth="2"/><circle cx="38" cy="26" r="6" fill="none" stroke="#555" strokeWidth="2"/><circle cx="18" cy="40" r="5" fill="none" stroke="#555" strokeWidth="2"/><circle cx="38" cy="40" r="5" fill="none" stroke="#555" strokeWidth="2"/></>);

  if (n.includes('drawer'))
    return mk(<><rect x="4" y="10" width="48" height="38" fill={cf} stroke={cs} strokeWidth={sw} rx="1"/><line x1="4" y1="22" x2="52" y2="22" stroke={cs} strokeWidth="1"/><line x1="4" y1="34" x2="52" y2="34" stroke={cs} strokeWidth="1"/><circle cx="28" cy="16" r="2" fill={cs}/><circle cx="28" cy="28" r="2" fill={cs}/><circle cx="28" cy="40" r="2" fill={cs}/></>);

  if (n.includes('pantry') || n.includes('pull-out'))
    return mk(<><rect x="12" y="4" width="32" height="48" fill={cf} stroke={cs} strokeWidth={sw} rx="1"/><line x1="12" y1="18" x2="44" y2="18" stroke={cs} strokeWidth="1"/><line x1="12" y1="32" x2="44" y2="32" stroke={cs} strokeWidth="1"/><line x1="12" y1="42" x2="44" y2="42" stroke={cs} strokeWidth="1"/><circle cx="24" cy="25" r="2" fill={cs}/></>);

  if (n.includes('fridge') || n.includes('freezer'))
    return mk(<><rect x="10" y="4" width="36" height="48" fill={cf} stroke={cs} strokeWidth={sw} rx="2"/><line x1="10" y1="22" x2="46" y2="22" stroke={cs} strokeWidth="1.5"/><line x1="16" y1="12" x2="16" y2="20" stroke={cs} strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="28" x2="16" y2="46" stroke={cs} strokeWidth="2" strokeLinecap="round"/></>);

  if (n.includes('oven') || n.includes('microwave') || n.includes('combi') || n.includes('steam'))
    return mk(<><rect x="6" y="12" width="44" height="34" fill="#2a2520" stroke={cs} strokeWidth={sw} rx="2"/><rect x="10" y="16" width="30" height="24" fill="#1a1815" stroke="rgba(255,255,255,0.1)" strokeWidth="1" rx="1"/><circle cx="46" cy="22" r="3" fill="#555"/><circle cx="46" cy="34" r="3" fill="#555"/></>);

  if (n.includes('hood') || n.includes('extractor'))
    return mk(<><polygon points="6,18 50,18 42,46 14,46" fill={cf} stroke={cs} strokeWidth={sw}/><rect x="18" y="6" width="20" height="14" fill={cf} stroke={cs} strokeWidth={sw} rx="1"/><line x1="6" y1="26" x2="50" y2="26" stroke={cs} strokeWidth="1"/></>);

  if (n.includes('dishwasher'))
    return mk(<><rect x="6" y="8" width="44" height="42" fill={cf} stroke={cs} strokeWidth={sw} rx="2"/><line x1="6" y1="20" x2="50" y2="20" stroke={cs} strokeWidth="1"/><circle cx="28" cy="14" r="3" fill="#5b8def" fillOpacity="0.6"/><rect x="12" y="26" width="32" height="18" fill="none" stroke={cs} strokeWidth="1" rx="1"/></>);

  if (n.includes('pendant') || n.includes('ceiling') || n.includes('spot') || n.includes('led') || n.includes('strip'))
    return mk(<><line x1="28" y1="4" x2="28" y2="16" stroke={cs} strokeWidth="2"/><polygon points="16,16 40,16 36,38 20,38" fill={cf} stroke={cs} strokeWidth={sw}/><circle cx="28" cy="28" r="6" fill="#ffd080" fillOpacity="0.7"/></>);

  if (n.includes('worktop') || n.includes('quartz') || n.includes('laminate'))
    return mk(<><rect x="2" y="18" width="52" height="10" fill={cf} stroke={cs} strokeWidth={sw} rx="2"/><rect x="4" y="28" width="48" height="20" fill="#e0d8c8" stroke={cs} strokeWidth="1" rx="1"/></>);

  if (n.includes('sink') || n.includes('tap'))
    return mk(<><rect x="8" y="16" width="40" height="28" fill={cf} stroke={cs} strokeWidth={sw} rx="1"/><ellipse cx="28" cy="30" rx="12" ry="8" fill="#c0bab0" stroke={cs} strokeWidth="1"/><line x1="28" y1="14" x2="28" y2="20" stroke={cs} strokeWidth="3" strokeLinecap="round"/></>);

  if (n.includes('stool') || n.includes('chair'))
    return mk(<><rect x="12" y="22" width="32" height="8" fill={cf} stroke={cs} strokeWidth={sw} rx="2"/><line x1="16" y1="30" x2="14" y2="52" stroke={cs} strokeWidth="2.5" strokeLinecap="round"/><line x1="40" y1="30" x2="42" y2="52" stroke={cs} strokeWidth="2.5" strokeLinecap="round"/><line x1="14" y1="42" x2="42" y2="42" stroke={cs} strokeWidth="1.5"/></>);

  if (n.includes('bench'))
    return mk(<><rect x="4" y="22" width="48" height="8" fill={cf} stroke={cs} strokeWidth={sw} rx="2"/><line x1="10" y1="30" x2="10" y2="50" stroke={cs} strokeWidth="2.5" strokeLinecap="round"/><line x1="46" y1="30" x2="46" y2="50" stroke={cs} strokeWidth="2.5" strokeLinecap="round"/><line x1="10" y1="42" x2="46" y2="42" stroke={cs} strokeWidth="1.5"/></>);

  if (n.includes('table'))
    return mk(<><rect x="4" y="22" width="48" height="8" fill={cf} stroke={cs} strokeWidth={sw} rx="2"/><line x1="10" y1="30" x2="10" y2="50" stroke={cs} strokeWidth="2.5" strokeLinecap="round"/><line x1="46" y1="30" x2="46" y2="50" stroke={cs} strokeWidth="2.5" strokeLinecap="round"/></>);

  if (n.includes('rail') || n.includes('hook'))
    return mk(<><line x1="4" y1="18" x2="52" y2="18" stroke={cs} strokeWidth="3" strokeLinecap="round"/><line x1="14" y1="18" x2="14" y2="38" stroke={cs} strokeWidth="2"/><line x1="28" y1="18" x2="28" y2="34" stroke={cs} strokeWidth="2"/><line x1="42" y1="18" x2="42" y2="42" stroke={cs} strokeWidth="2"/></>);

  if (n.includes('waste') || n.includes('organiser') || n.includes('basket'))
    return mk(<><rect x="10" y="14" width="36" height="36" fill={cf} stroke={cs} strokeWidth={sw} rx="2"/><line x1="10" y1="26" x2="46" y2="26" stroke={cs} strokeWidth="1"/><line x1="28" y1="14" x2="28" y2="50" stroke={cs} strokeWidth="1" strokeDasharray="3 2"/></>);

  if (n.includes('glass'))
    return mk(<><rect x="4" y="8" width="48" height="40" fill={cf} stroke={cs} strokeWidth={sw} rx="1"/><rect x="8" y="12" width="18" height="32" fill="rgba(91,141,239,0.15)" stroke={cs} strokeWidth="1" rx="1"/><rect x="30" y="12" width="18" height="32" fill="rgba(91,141,239,0.15)" stroke={cs} strokeWidth="1" rx="1"/></>);

  // default cabinet with door
  return mk(<><rect x="4" y="8" width="48" height="40" fill={cf} stroke={cs} strokeWidth={sw} rx="1"/><line x1="28" y1="8" x2="28" y2="48" stroke={cs} strokeWidth="1"/><circle cx="20" cy="28" r="2" fill={cs}/><circle cx="36" cy="28" r="2" fill={cs}/></>);
}

function starRating(seed) {
  const vals = [4.5, 4.8, 4.2, 4.7, 4.4, 4.9, 4.3, 4.6, 4.1, 4.7];
  const r = vals[seed % vals.length];
  return { full: Math.floor(r), half: r % 1 >= 0.5, empty: Math.floor(5 - r), value: r };
}

function StarRow({ seed = 0 }) {
  const { full, half, empty, value } = starRating(seed);
  const star = (t, i) => <span key={t+i} style={{ color: t==='e' ? 'rgba(26,24,21,0.2)' : '#f59e0b', fontSize:10 }}>{t==='f'?'★':t==='h'?'⯨':'☆'}</span>;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:1 }}>
      {Array(full).fill('f').map(star)}{half?star('h','h'):[]}
      {Array(empty).fill('e').map(star)}
      <span style={{ fontSize:10, color:'rgba(26,24,21,0.45)', marginLeft:3 }}>{value}</span>
    </span>
  );
}

/* ── Item placement helpers ────────────────────────────────── */
function getDefaultDims(name) {
  const n = name.toLowerCase();
  if (n.includes('island'))                      return { w:1200, h:800 };
  if (n.includes('fridge') || n.includes('freezer')) return { w:600, h:650 };
  if (n.includes('dishwasher'))                  return { w:600, h:600 };
  if (n.includes('corner'))                      return { w:900, h:900 };
  if (n.includes('hob') || n.includes('sink'))   return { w:900, h:600 };
  if (n.includes('hood') || n.includes('extractor')) return { w:900, h:300 };
  if (n.includes('table'))                       return { w:1200, h:900 };
  if (n.includes('bench'))                       return { w:1400, h:400 };
  if (n.includes('stool') || n.includes('chair')) return { w:500, h:500 };
  if (n.includes('worktop') || n.includes('quartz') || n.includes('laminate')) return { w:1800, h:600 };
  return { w:600, h:600 };
}

function getCabColor(name) {
  const n = name.toLowerCase();
  if (n.includes('hob') || n.includes('oven') || n.includes('micro')) return '#2a2520';
  if (n.includes('sink') || n.includes('tap'))   return '#8cb8d0';
  if (n.includes('fridge') || n.includes('freezer')) return '#a8c8a0';
  if (n.includes('dishwasher'))                  return '#8898b8';
  if (n.includes('table') || n.includes('island'))   return '#3a352e';
  if (n.includes('stool') || n.includes('chair') || n.includes('bench')) return '#c8a870';
  if (n.includes('worktop') || n.includes('quartz')) return '#b8b0a0';
  if (n.includes('hood') || n.includes('extractor')) return '#706860';
  if (n.includes('light') || n.includes('led'))  return '#d8d040';
  return '#c8c0b0';
}

/* ── Catalog tabs per room type ────────────────────────────── */
const CATALOG_TABS_BY_ROOM = {
  kitchen:  [
    { id:'base',       label:'Base',        icon:'▬' },
    { id:'wall',       label:'Wall',        icon:'▭' },
    { id:'high',       label:'High',        icon:'▮' },
    { id:'fronts',     label:'Fronts',      icon:'▱' },
    { id:'appliances', label:'Appliances',  icon:'⊡' },
    { id:'dining',     label:'Dining',      icon:'⊞' },
    { id:'extras',     label:'Extras',      icon:'⊟' },
  ],
  wardrobe: [
    { id:'wardrobe',   label:'Wardrobe',    icon:'⊠' },
  ],
  office:   [
    { id:'office',     label:'Desks',       icon:'⊟' },
  ],
};

/* ── Kitchen preset layouts ────────────────────────────────── */
const KITCHEN_PRESETS = [
  { name:'Straight 3 m kitchen',        variants:['Small (2.4m)','Standard (3m)','Large (3.6m)'], price:'₹2.8–4.5L',  desc:'Single wall · ideal for compact apartments' },
  { name:'L-shape kitchen',             variants:['3.8×2.8m','4.2×3m','5×3.5m'],                 price:'₹4–7.5L',    desc:'Two walls · most popular layout, good work triangle' },
  { name:'U-shape kitchen',             variants:['3×4m','4×4m','4×5m'],                          price:'₹6–11L',     desc:'Three walls · maximum storage and counter space' },
  { name:'Island kitchen',              variants:['4×4m + 1.2m island','5×4m + 1.5m island'],     price:'₹8–16L',     desc:'Open plan · island adds seating and prep space' },
  { name:'Galley / parallel kitchen',   variants:['2.4m+2.4m','3m+3m'],                           price:'₹5–9L',      desc:'Two parallel walls · efficient for high-traffic cooking' },
  { name:'Peninsula kitchen',           variants:['4×3m + peninsula'],                             price:'₹6.5–12L',   desc:'L-shape with attached peninsula · semi-open concept' },
];

const BASE_SECTIONS = [
  {
    title: 'Base cabinets · METOD frame',
    code: 'KBX-BC',
    items: [
      { name:'Base corner cabinet',       variants:['600×600mm','900×900mm'],         price:'₹18–26k' },
      { name:'Base cabinet for sink',     variants:['600mm','800mm','1000mm'],        price:'₹12–18k' },
      { name:'Base cabinet for hob',      variants:['600mm','900mm'],                 price:'₹9–15k'  },
      { name:'Base cabinet with drawers', variants:['400mm','600mm','800mm'],         price:'₹15–24k' },
      { name:'Base cabinet with door',    variants:['300mm','400mm','600mm','900mm'], price:'₹8–20k'  },
      { name:'Base cabinet door+drawer',  variants:['600mm','800mm'],                 price:'₹16–24k' },
      { name:'Pull-out pantry unit',      variants:['300mm','600mm'],                 price:'₹24–36k' },
      { name:'Wire basket pull-out',      variants:['400mm','600mm'],                 price:'₹6–12k'  },
      { name:'Open base unit',            variants:['600mm','900mm'],                 price:'₹7–14k'  },
      { name:'Filler & end panel',        variants:['50mm','100mm','200mm'],          price:'₹2–6k'   },
    ],
  },
];

const WALL_SECTIONS = [
  {
    title: 'Wall cabinets · METOD frame',
    code: 'KBX-WC',
    items: [
      { name:'Wall cabinet with door',    variants:['300mm','400mm','600mm','800mm'], price:'₹6–15k'  },
      { name:'Wall cabinet glass doors',  variants:['400mm','600mm'],                 price:'₹9–18k'  },
      { name:'Horizontal wall cabinet',   variants:['600mm','900mm','1200mm'],        price:'₹10–22k' },
      { name:'Corner wall cabinet',       variants:['600×600mm'],                     price:'₹12–20k' },
      { name:'Cabinet for extractor',     variants:['600mm','900mm'],                 price:'₹8–16k'  },
      { name:'Cabinet for microwave',     variants:['600mm'],                         price:'₹10–18k' },
      { name:'Open wall shelf unit',      variants:['600mm','900mm','1200mm'],        price:'₹5–12k'  },
      { name:'Filler & end panel',        variants:['50mm','100mm'],                  price:'₹1–5k'   },
    ],
  },
];

const HIGH_SECTIONS = [
  {
    title: 'High cabinets · METOD frame',
    code: 'KBX-HC',
    items: [
      { name:'High cabinet for fridge',   variants:['600mm','900mm'],                 price:'₹24–40k' },
      { name:'High cabinet for oven',     variants:['600mm'],                         price:'₹18–30k' },
      { name:'High cabinet microwave+oven',variants:['600mm'],                        price:'₹26–38k' },
      { name:'Pantry high cabinet',       variants:['300mm','600mm'],                 price:'₹28–45k' },
      { name:'High cabinet door+drawer',  variants:['600mm','900mm'],                 price:'₹22–32k' },
      { name:'Filler & end panel',        variants:['50mm','100mm'],                  price:'₹3–7k'   },
    ],
  },
];

const DOOR_SECTIONS = [
  {
    title: 'Door fronts',
    code: 'KBX-DF',
    items: [
      { name:'Matte white door front',    variants:['300mm','400mm','600mm','900mm'], price:'₹2–8k'   },
      { name:'Wood-effect door front',    variants:['400mm','600mm','800mm'],         price:'₹4–12k'  },
      { name:'Anthracite grey door',      variants:['300mm','600mm','900mm'],         price:'₹3–10k'  },
      { name:'Sage green door front',     variants:['400mm','600mm'],                 price:'₹4–11k'  },
      { name:'Solid walnut door front',   variants:['400mm','600mm'],                 price:'₹8–20k'  },
      { name:'Dark grey glass door',      variants:['400mm','600mm'],                 price:'₹6–16k'  },
      { name:'White shaker door',         variants:['300mm','400mm','600mm'],         price:'₹3–9k'   },
    ],
  },
];

const CABINET_SECTIONS = [...BASE_SECTIONS, ...WALL_SECTIONS, ...HIGH_SECTIONS, ...DOOR_SECTIONS];

const APPLIANCE_SECTIONS = [
  {
    title: 'Integrated in cabinet',
    code: 'KBX-AI',
    items: [
      { name:'Fridge & freezer',       variants:['250L','350L','450L'],          price:'₹35–75k' },
      { name:'Induction hob',          variants:['2 zone','4 zone'],             price:'₹12–28k' },
      { name:'Gas hob',                variants:['3 burner','4 burner'],         price:'₹8–20k'  },
      { name:'Built-in oven',          variants:['60L','90L'],                   price:'₹22–55k' },
      { name:'Microwave oven',         variants:['20L','28L','34L'],             price:'₹8–22k'  },
      { name:'Steam / combi oven',     variants:['45L','60L'],                   price:'₹45–90k' },
      { name:'Extractor hood',         variants:['60cm','90cm'],                 price:'₹12–45k' },
      { name:'Dishwasher',             variants:['6 place','13 place'],          price:'₹22–55k' },
    ],
  },
  {
    title: 'Freestanding',
    code: 'KBX-AF',
    items: [
      { name:'Fridge / side-by-side',  variants:['500L','600L'],                 price:'₹45–90k' },
      { name:'Gas range',              variants:['4 burner','5 burner'],         price:'₹25–55k' },
      { name:'Island hood',            variants:['90cm','120cm'],                price:'₹30–65k' },
    ],
  },
];

const DINING_SECTIONS = [
  {
    title: 'Tables',
    code: 'KBX-DT',
    items: [
      { name:'Dining table',           variants:['4 seat','6 seat','8 seat'],    price:'₹18–60k' },
      { name:'Extendable table',       variants:['4→6 seat','6→8 seat'],         price:'₹25–75k' },
      { name:'Breakfast bar',          variants:['2 seat','4 seat'],             price:'₹12–35k' },
    ],
  },
  {
    title: 'Seating',
    code: 'KBX-DS',
    items: [
      { name:'Dining chair',           variants:['Fabric','Leather','Cane'],     price:'₹4–18k'  },
      { name:'Bar stool',              variants:['65cm','75cm'],                 price:'₹5–16k'  },
      { name:'Bench',                  variants:['120cm','160cm','200cm'],       price:'₹8–22k'  },
    ],
  },
];

const EXTRAS_SECTIONS = [
  {
    title: 'Organisation',
    code: 'KBX-OR',
    items: [
      { name:'Drawer organiser',       variants:['400mm','600mm'],               price:'₹2–6k'   },
      { name:'Pull-out shelf',         variants:['300mm','450mm','600mm'],       price:'₹3–8k'   },
      { name:'Waste sorting unit',     variants:['20L','30L dual'],              price:'₹4–10k'  },
      { name:'Spice rack pull-out',    variants:['150mm','200mm'],               price:'₹3–7k'   },
      { name:'Knife block',            variants:['In-drawer','Wall-mount'],      price:'₹2–5k'   },
      { name:'Rail system',            variants:['60cm','90cm','120cm'],         price:'₹2–6k'   },
    ],
  },
  {
    title: 'Lighting',
    code: 'KBX-LT',
    items: [
      { name:'Under-cabinet LED',      variants:['500mm','1000mm','1500mm'],     price:'₹3–9k'   },
      { name:'Ceiling spotlight',      variants:['3-light','5-light'],           price:'₹5–14k'  },
      { name:'Pendant light',          variants:['Single','Twin','Triple'],      price:'₹6–20k'  },
      { name:'LED strip',              variants:['1m','5m kit'],                 price:'₹1–4k'   },
    ],
  },
  {
    title: 'Worktops & sinks',
    code: 'KBX-WS',
    items: [
      { name:'Quartz worktop',         variants:['20mm','30mm thick'],           price:'₹850–1400/sqft' },
      { name:'Laminate worktop',       variants:['25mm','38mm thick'],           price:'₹350–650/sqft'  },
      { name:'Stainless sink',         variants:['Single bowl','Double bowl'],   price:'₹4–12k'  },
      { name:'Composite sink',         variants:['Single','1.5 bowl'],           price:'₹6–18k'  },
      { name:'Kitchen tap',            variants:['Single lever','Pull-out'],     price:'₹4–14k'  },
    ],
  },
];

/* ── Office desk catalog (plywood / solid wood only) ───────── */
const DESK_SECTIONS = [
  {
    title: 'Writing & study desks',
    code: 'KBX-OD',
    items: [
      { name:'Solid pine writing desk',       variants:['100×50cm','120×60cm','140×60cm'],  price:'₹12–18k',  material:'Solid pine' },
      { name:'Birch plywood desk',            variants:['100×50cm','120×60cm','140×65cm'],  price:'₹16–26k',  material:'Birch plywood' },
      { name:'Bamboo-top desk',               variants:['100×50cm','120×60cm','160×70cm'],  price:'₹14–22k',  material:'Bamboo + steel frame' },
      { name:'Oak veneer writing desk',       variants:['120×60cm','140×65cm','160×70cm'],  price:'₹18–32k',  material:'Oak veneer + plywood core' },
      { name:'Walnut veneer desk',            variants:['120×60cm','140×65cm'],             price:'₹22–38k',  material:'Walnut veneer + plywood' },
      { name:'Solid mango wood desk',         variants:['110×55cm','130×65cm'],             price:'₹16–28k',  material:'Solid mango wood' },
    ],
  },
  {
    title: 'L-shape & corner desks',
    code: 'KBX-OL',
    items: [
      { name:'L-shape solid wood corner desk',  variants:['150×100cm','180×120cm','200×140cm'], price:'₹28–52k', material:'Solid pine + plywood' },
      { name:'Corner desk with shelf',          variants:['160×110cm','200×130cm'],              price:'₹32–50k', material:'Birch plywood' },
      { name:'L-shape oak veneer desk',         variants:['180×120cm','200×140cm'],              price:'₹38–65k', material:'Oak veneer + plywood' },
    ],
  },
  {
    title: 'Standing & sit-stand',
    code: 'KBX-OS',
    items: [
      { name:'Sit-stand solid wood top',      variants:['120×60cm','140×60cm','160×80cm'],  price:'₹36–62k',  material:'Solid wood top + steel frame' },
      { name:'Height-adj bamboo desk',        variants:['120×60cm','160×80cm'],             price:'₹30–50k',  material:'Bamboo + steel frame' },
      { name:'Sit-stand oak veneer',          variants:['120×60cm','140×60cm'],             price:'₹42–70k',  material:'Oak veneer + plywood' },
      { name:'Fixed-height standing desk',    variants:['90cm H','100cm H','110cm H'],      price:'₹18–32k',  material:'Solid pine + steel' },
    ],
  },
  {
    title: 'Wall-mounted & floating',
    code: 'KBX-OW',
    items: [
      { name:'Floating solid pine wall desk', variants:['80×30cm','100×40cm','120×40cm'],  price:'₹8–18k',   material:'Solid pine' },
      { name:'Fold-down plywood wall desk',   variants:['80×40cm','100×50cm'],             price:'₹10–20k',  material:'Plywood + hinge hardware' },
      { name:'Solid oak floating shelf-desk', variants:['100×35cm','140×40cm'],            price:'₹14–26k',  material:'Solid oak' },
    ],
  },
  {
    title: 'Storage & add-ons',
    code: 'KBX-OA',
    items: [
      { name:'Drawer unit on castors',        variants:['3 drawer','5 drawer'],            price:'₹8–18k',   material:'Solid pine / plywood' },
      { name:'Desktop shelf organiser',       variants:['60cm','80cm','100cm'],            price:'₹3–8k',    material:'Solid pine' },
      { name:'Under-desk shelf',              variants:['60cm','90cm'],                    price:'₹4–9k',    material:'Plywood' },
      { name:'Solid wood monitor stand',      variants:['40cm','60cm'],                    price:'₹3–8k',    material:'Solid wood' },
      { name:'Desktop hutch / riser',         variants:['60cm','90cm','120cm'],            price:'₹6–14k',   material:'Birch plywood' },
    ],
  },
];

/* ── Wardrobe catalog ──────────────────────────────────────── */
const WARDROBE_PRESETS = [
  { name:'2-door hinged wardrobe',      variants:['100×58×200cm','150×58×200cm','200×58×200cm'], price:'₹22–48k',  desc:'Classic hinged · suits most bedrooms' },
  { name:'3-door hinged wardrobe',      variants:['150×58×200cm','200×58×200cm','250×58×236cm'], price:'₹32–62k',  desc:'Extra capacity · centre mirror option' },
  { name:'2-door sliding wardrobe',     variants:['150×65×200cm','200×65×200cm','250×65×200cm'], price:'₹38–75k',  desc:'Space-saving sliding · no door swing' },
  { name:'Mirrored sliding wardrobe',   variants:['150×65×200cm','200×65×200cm','240×65×200cm'], price:'₹48–85k',  desc:'Full-length mirrors · brightens room' },
  { name:'Corner wardrobe',             variants:['225×225cm footprint×200cm H'],                price:'₹58–95k',  desc:'Corner layout · maximises awkward spaces' },
  { name:'Open wardrobe system',        variants:['100cm wide','150cm wide','200cm wide'],        price:'₹14–32k',  desc:'No doors · Scandinavian open concept' },
  { name:'4-door hinged wardrobe',      variants:['200×58×200cm','250×58×236cm'],                price:'₹45–80k',  desc:'Full wall coverage · large families' },
];

const WARDROBE_SECTIONS = [
  {
    title: 'Frames & structures',
    code: 'KBX-WF',
    items: [
      { name:'Wardrobe frame 35 cm depth',  variants:['50cm W','75cm W','100cm W'],   price:'₹6–14k'  },
      { name:'Wardrobe frame 58 cm depth',  variants:['50cm W','75cm W','100cm W'],   price:'₹8–18k'  },
      { name:'Corner connector frame',      variants:['Universal'],                   price:'₹4–8k'   },
    ],
  },
  {
    title: 'Door fronts',
    code: 'KBX-WD',
    items: [
      { name:'White matte hinged door',     variants:['50×195cm','75×195cm','100×195cm'], price:'₹4–12k'  },
      { name:'Dark grey hinged door',       variants:['50×195cm','75×195cm','100×195cm'], price:'₹4–12k'  },
      { name:'Full-length mirror door',     variants:['50×195cm','75×195cm'],             price:'₹6–16k'  },
      { name:'Frosted glass hinged door',   variants:['50×195cm','75×195cm'],             price:'₹8–18k'  },
      { name:'Woven rattan front door',     variants:['50×195cm','75×195cm'],             price:'₹7–16k'  },
      { name:'Wood-effect sliding door',    variants:['75cm','100cm','120cm'],            price:'₹10–22k' },
      { name:'Mirror sliding door',         variants:['75cm','100cm','120cm'],            price:'₹12–26k' },
    ],
  },
  {
    title: 'Interior fittings',
    code: 'KBX-WI',
    items: [
      { name:'Adjustable shelf',            variants:['50cm','75cm','100cm'],             price:'₹1–4k'   },
      { name:'Trouser hanger',              variants:['50cm','75cm'],                     price:'₹2–5k'   },
      { name:'Pull-out trouser rack',       variants:['50cm'],                            price:'₹4–9k'   },
      { name:'Drawer insert',               variants:['50cm','75cm'],                     price:'₹3–7k'   },
      { name:'Shoe shelf (3 pairs)',        variants:['50cm'],                            price:'₹2–5k'   },
      { name:'Pull-out clothes rail',       variants:['50cm','75cm'],                     price:'₹3–8k'   },
      { name:'Fixed clothes rail',          variants:['50cm','75cm','100cm'],             price:'₹1–3k'   },
      { name:'Jewellery tray',              variants:['50cm'],                            price:'₹3–6k'   },
      { name:'Interior LED strip',          variants:['40cm','80cm','120cm'],             price:'₹2–6k'   },
      { name:'Mirror with hooks (inside)',  variants:['37×150cm'],                        price:'₹5–12k'  },
    ],
  },
  {
    title: 'Walk-in wardrobe',
    code: 'KBX-WW',
    items: [
      { name:'Walk-in starter kit 2 m²',   variants:['Open','With curtain'],             price:'₹55–80k'  },
      { name:'Walk-in system 4 m²',        variants:['3-wall layout','U-shape'],         price:'₹90–145k' },
      { name:'Walk-in system 6 m²',        variants:['Full U-shape','Island included'],  price:'₹140–220k'},
      { name:'Dressing island',            variants:['80×50cm','120×60cm'],              price:'₹18–35k'  },
    ],
  },
];

/* ── Room size presets per room type ───────────────────────── */
const ROOM_SIZES = {
  kitchen: [
    { label:'2.4×2.4m', W:2400, D:2400, layout:'Straight' },
    { label:'3×2.8m',   W:3000, D:2840, layout:'L-shape'  },
    { label:'3.8×2.8m', W:3800, D:2840, layout:'L-shape'  },
    { label:'4×3m',     W:4000, D:3000, layout:'U-shape'  },
    { label:'5×4m',     W:5000, D:4000, layout:'Island'   },
  ],
  wardrobe: [
    { label:'1.0m wide',  W:1000, D:600,  layout:'2-door'  },
    { label:'1.5m wide',  W:1500, D:600,  layout:'3-door'  },
    { label:'2.0m wide',  W:2000, D:600,  layout:'4-door'  },
    { label:'2.5m wide',  W:2500, D:650,  layout:'Sliding' },
    { label:'Walk-in 4m²',W:2000, D:2000, layout:'Walk-in' },
  ],
  office: [
    { label:'3×3m',  W:3000, D:3000, layout:'Open' },
    { label:'4×3m',  W:4000, D:3000, layout:'Open' },
    { label:'4×4m',  W:4000, D:4000, layout:'Open' },
    { label:'5×4m',  W:5000, D:4000, layout:'Open' },
  ],
};

/* ── Catalog panel ─────────────────────────────────────────── */
function CatalogPanel({ onAdd, activeTab, onTabChange, onSizePreset, roomW, roomD, roomType = 'kitchen' }) {
  const { useState: useS } = React;
  const setActiveTab = t => { onTabChange && onTabChange(t); };
  const catalogTabs = CATALOG_TABS_BY_ROOM[roomType] || CATALOG_TABS_BY_ROOM.kitchen;
  // Auto-correct activeTab if it doesn't belong to current room type
  const validActiveTab = catalogTabs.find(t => t.id === activeTab) ? activeTab : catalogTabs[0]?.id;
  const [search, setSearch]                 = useS('');
  const [catalogView, setCatalogView]       = useS('grid');
  const [selectedVariants, setSelectedVariants] = useS({});

  const getSelVariant = (item) => {
    const name = typeof item === 'string' ? item : item.name;
    return selectedVariants[name] || (item.variants && item.variants[0]) || '';
  };
  const pickVariant = (name, v) => setSelectedVariants(s => ({ ...s, [name]: v }));

  const tab = validActiveTab;
  let sections = [];
  if (tab === 'base')       sections = BASE_SECTIONS;
  if (tab === 'wall')       sections = WALL_SECTIONS;
  if (tab === 'high')       sections = HIGH_SECTIONS;
  if (tab === 'fronts')     sections = DOOR_SECTIONS;
  if (tab === 'cabinets')   sections = CABINET_SECTIONS;
  if (tab === 'appliances') sections = APPLIANCE_SECTIONS;
  if (tab === 'dining')     sections = DINING_SECTIONS;
  if (tab === 'extras')     sections = EXTRAS_SECTIONS;
  if (tab === 'office')     sections = DESK_SECTIONS;
  if (tab === 'wardrobe')   sections = WARDROBE_SECTIONS;

  // Determine which room type's sizes to show
  const sizeRoomType = roomType;
  const roomSizes = ROOM_SIZES[sizeRoomType] || [];
  const currentSizeLabel = roomSizes.find(s => s.W === roomW && s.D === roomD)?.label || null;

  const filtered = sections.map(sec => ({
    ...sec,
    items: search
      ? sec.items.filter(it => {
          const n = typeof it === 'string' ? it : it.name;
          return n.toLowerCase().includes(search.toLowerCase());
        })
      : sec.items,
  })).filter(sec => sec.items.length > 0);

  const allItems = filtered.flatMap((sec, si) => sec.items.map((item, ii) => ({ item, idx: si * 20 + ii })));

  return (
    <div style={{ background:pPaper, borderRight:`1px solid ${pLine}`, width:320, flexShrink:0, display:'flex', flexDirection:'column', overflowY:'auto' }}>
      {/* Library header */}
      <div style={{ padding:'20px 22px 16px', flexShrink:0 }}>
        <h2 style={{ fontFamily:'"Fraunces",Georgia,serif', fontWeight:400, fontSize:26, lineHeight:1.05, letterSpacing:'-0.02em', margin:'0 0 4px' }}>
          Pick your <span style={{ fontStyle:'italic', color:pSienna }}>modules.</span>
        </h2>
        <p style={{ fontSize:13, color:pMute, margin:0 }}>Drag any module into the room. Adjust later.</p>
      </div>

      {/* Pill search bar */}
      <div style={{ margin:'0 22px 0', padding:'10px 14px', borderRadius:100, background:pWarm, border:`1px solid ${pLine}`, display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
        <span style={{ color:pMute, fontSize:14 }}>⌕</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${roomType}…`}
          style={{ border:'none', background:'transparent', outline:'none', flex:1, fontSize:13, color:pInk, fontFamily:'"Geist",sans-serif' }} />
        {search && <span onClick={() => setSearch('')} style={{ cursor:'pointer', fontSize:14, lineHeight:1, color:pMute }}>×</span>}
        <kbd style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, padding:'2px 6px', borderRadius:4, background:pPaper, border:`1px solid ${pLine2}`, color:pMute }}>⌘K</kbd>
      </div>

      {/* Category tab pills */}
      <div style={{ display:'flex', gap:4, padding:'14px 22px 4px', overflowX:'auto', scrollbarWidth:'none', flexShrink:0 }}>
        {catalogTabs.map(tab => {
          const active = tab.id === validActiveTab;
          return (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearch(''); }} style={{
              padding:'6px 12px', borderRadius:100, fontSize:12, fontWeight:500, cursor:'pointer', whiteSpace:'nowrap',
              border:'none', background: active ? pInk : 'transparent',
              color: active ? pPaper : pMute,
              transition:'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.background=pWarm; e.currentTarget.style.color=pInk; } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=pMute; } }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* View toggle + Room size selector */}
      <div style={{ padding:'8px 22px', borderBottom:`1px solid ${pLine}`, flexShrink:0 }}>
        <div style={{ display:'flex', gap:4, marginBottom: (!search && roomSizes.length > 0) ? 10 : 0 }}>
          {[['grid','Grid'],['list','List']].map(([v,l]) => (
            <button key={v} onClick={() => setCatalogView(v)} style={{
              padding:'5px 12px', border:`1px solid ${v===catalogView?pSienna:pLine}`,
              borderRadius:100, fontSize:11, fontWeight:500, cursor:'pointer',
              background: v===catalogView ? pSiennaSoft : 'transparent',
              color: v===catalogView ? pSienna : pMute,
            }}>{l}</button>
          ))}
        </div>
        {!search && roomSizes.length > 0 && (
          <div>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:pMute, fontFamily:'JetBrains Mono,monospace', marginBottom:6 }}>Room size</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
              {roomSizes.map(rs => {
                const active = currentSizeLabel === rs.label;
                return (
                  <span key={rs.label} onClick={() => onSizePreset && onSizePreset(rs)} style={{
                    padding:'4px 10px', borderRadius:100, fontSize:10, fontWeight:500,
                    fontFamily:'JetBrains Mono,monospace', cursor:'pointer',
                    border:`1px solid ${active ? pSienna : pLine}`,
                    background: active ? pSiennaSoft : 'rgba(22,20,15,0.03)',
                    color: active ? pSienna : pMute,
                  }}>{rs.label}</span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 22px 24px' }}>

        {allItems.length === 0 && (
          <div style={{ padding:'24px', fontSize:12, color:pMute, textAlign:'center' }}>No results for "{search}"</div>
        )}

        {catalogView === 'grid' ? (
          /* ── Reference-style cards: 2-col thumbnail + info ── */
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {allItems.map(({ item, idx }) => {
              const name = typeof item === 'string' ? item : item.name;
              const variants = typeof item === 'object' ? (item.variants || []) : [];
              const price = typeof item === 'object' ? (item.price || '') : '';
              const material = typeof item === 'object' ? (item.material || '') : '';
              const selV = getSelVariant(item);
              const dims = getDefaultDims(name);
              const sku = 'KBX-' + name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,5);
              return (
                <div key={name} draggable
                  onDragStart={e => e.dataTransfer.setData('text/plain', JSON.stringify({ name, variant: selV, price, ...dims }))}
                  style={{
                    background:pPaper2, border:`1px solid ${pLine}`, borderRadius:12, padding:12,
                    display:'grid', gridTemplateColumns:'70px 1fr', gap:14, alignItems:'center',
                    cursor:'grab', transition:'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.borderColor=pSienna; e.currentTarget.style.boxShadow='0 6px 16px -8px rgba(22,20,15,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor=pLine; e.currentTarget.style.boxShadow='none'; }}
                >
                  {/* Thumbnail */}
                  <div style={{ aspectRatio:1, borderRadius:8, background:pWarm, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <ProductIcon name={name} size={52} />
                  </div>
                  {/* Info */}
                  <div style={{ minWidth:0 }}>
                    <h4 style={{ fontFamily:'"Fraunces",Georgia,serif', fontSize:15, lineHeight:1.15, letterSpacing:'-0.01em', margin:'0 0 3px' }}>{name}</h4>
                    {(selV || material) && <p style={{ fontSize:12, color:pMute, margin:'0 0 6px' }}>{selV || material}</p>}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                      <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:pMute, letterSpacing:'0.1em' }}>{sku}</span>
                      {price && <span style={{ fontFamily:'"Fraunces",Georgia,serif', fontSize:14, color:pSienna, fontWeight:500 }}>{price}</span>}
                    </div>
                    {variants.length > 0 && (
                      <div style={{ display:'flex', flexWrap:'wrap', gap:3, marginTop:6 }}>
                        {variants.slice(0,3).map(v => (
                          <span key={v} onClick={e => { e.stopPropagation(); pickVariant(name, v); }} style={{
                            padding:'2px 7px', borderRadius:100, fontSize:9, fontWeight:500, fontFamily:'JetBrains Mono,monospace', cursor:'pointer',
                            border:`1px solid ${v===selV ? pSienna : pLine}`,
                            background: v===selV ? pSiennaSoft : 'transparent',
                            color: v===selV ? pSienna : pMute,
                          }}>{v}</span>
                        ))}
                      </div>
                    )}
                    <button onClick={e => { e.stopPropagation(); onAdd && onAdd({ name, variant: selV, price }); }} style={{
                      marginTop:8, padding:'5px 10px', borderRadius:100, fontSize:10, fontWeight:600, border:'none',
                      background:pInk, color:pPaper, cursor:'pointer',
                    }}>+ Add</button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── List view ── */
          <div>
            {filtered.map(sec => (
              <div key={sec.title} style={{ marginBottom:4 }}>
                <div style={{ padding:'10px 8px 6px', fontSize:10, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:pMute, fontFamily:'JetBrains Mono,monospace' }}>
                  {sec.title} <span style={{ marginLeft:6, fontSize:9, opacity:0.7 }}>{sec.code}</span>
                </div>
                {sec.items.map((item, idx) => {
                  const name = typeof item === 'string' ? item : item.name;
                  const variants = typeof item === 'object' ? (item.variants || []) : [];
                  const price = typeof item === 'object' ? (item.price || '') : '';
                  const selV = getSelVariant(item);
                  const dims2 = getDefaultDims(name);
                  return (
                    <div key={name} draggable
                      onDragStart={e => e.dataTransfer.setData('text/plain', JSON.stringify({ name, variant: selV, price, ...dims2 }))}
                      style={{ padding:'8px 8px 10px', borderLeft:'2px solid transparent', borderRadius:6, transition:'background 0.1s', cursor:'grab' }}
                      onMouseEnter={e => { e.currentTarget.style.background=pWarm; e.currentTarget.style.borderLeftColor=pSienna; }}
                      onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderLeftColor='transparent'; }}
                    >
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:44, height:44, borderRadius:8, background:pWarm, border:`1px solid ${pLine}`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <ProductIcon name={name} size={32} />
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontFamily:'"Fraunces",Georgia,serif', fontSize:14, lineHeight:1.2, letterSpacing:'-0.01em' }}>{name}</div>
                          {price && <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:pSienna, fontWeight:500, marginTop:2 }}>{price}</div>}
                        </div>
                        <button onClick={() => onAdd && onAdd({ name, variant: selV, price })} style={{
                          padding:'5px 10px', borderRadius:100, fontSize:10, fontWeight:600, border:'none', background:pInk, color:pPaper, cursor:'pointer', flexShrink:0,
                        }}>+</button>
                      </div>
                      {variants.length > 0 && (
                        <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:6, paddingLeft:54 }}>
                          {variants.map(v => (
                            <span key={v} onClick={() => pickVariant(name, v)} style={{
                              padding:'2px 8px', borderRadius:100, fontSize:9, fontWeight:500, fontFamily:'JetBrains Mono,monospace', cursor:'pointer',
                              border:`1px solid ${v===selV ? pSienna : pLine}`,
                              background: v===selV ? pSiennaSoft : 'transparent',
                              color: v===selV ? pSienna : pMute,
                            }}>{v}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Finishes swatch (kitchen cabinets only) */}
        {tab === 'cabinets' && !search && (
          <div style={{ paddingTop:12, borderTop:`1px solid ${pLine}`, marginTop:8 }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:pMute, fontFamily:'JetBrains Mono,monospace', marginBottom:8 }}>Finishes</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6 }}>
              {[
                { tone:['#d4ccbe','#b8a995'], label:'Bali oak' },
                { tone:['#3a352e','#1a1815'], label:'Espresso' },
                { tone:['#fafaf7','#dcd8d0'], label:'Bone matte' },
                { tone:['#c8bfa8','#b0a68e'], label:'Sand grey' },
                { tone:['#b8b0a0','#a09880'], label:'Linen white' },
                { tone:['#8c7660','#6e5c48'], label:'Smoked teak' },
              ].map(sw => (
                <div key={sw.label} style={{ cursor:'pointer' }}>
                  <div style={{ height:36, borderRadius:8, marginBottom:4, border:`1px solid ${pLine}`, backgroundImage:`linear-gradient(135deg,${sw.tone[0]},${sw.tone[1]})` }}/>
                  <div style={{ fontSize:9, fontWeight:500, color:pInk }}>{sw.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom module CTA */}
        <button style={{ marginTop:16, width:'100%', padding:14, borderRadius:12, background:pSiennaSoft, border:`1px dashed ${pSienna}`, display:'flex', alignItems:'center', gap:12, textAlign:'left', cursor:'pointer' }}>
          <span style={{ fontSize:18, color:pSienna, flexShrink:0 }}>+</span>
          <div>
            <p style={{ fontSize:13, fontWeight:500, color:pInk, margin:0, lineHeight:1.3 }}>Need something custom?</p>
            <p style={{ fontSize:11, color:pMute, margin:'2px 0 0' }}>Talk to a Studio designer.</p>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ─── SHARED STORE (localStorage) ─────────────────────────── */
const KreoStore = (() => {
  const fire = () => window.dispatchEvent(new Event('kreobox-update'));
  return {
    getOrders() { try { return JSON.parse(localStorage.getItem('kreobox_orders') || '[]'); } catch { return []; } },
    saveOrders(o) { localStorage.setItem('kreobox_orders', JSON.stringify(o)); fire(); },
    addOrder(o) { const orders = this.getOrders(); orders.unshift(o); this.saveOrders(orders); },
    updateOrder(id, patch) { this.saveOrders(this.getOrders().map(o => o.id === id ? { ...o, ...patch } : o)); },

    getJobs() { try { return JSON.parse(localStorage.getItem('kreobox_jobs') || '[]'); } catch { return []; } },
    saveJobs(j) { localStorage.setItem('kreobox_jobs', JSON.stringify(j)); fire(); },
    addJob(j) { const jobs = this.getJobs(); jobs.unshift(j); this.saveJobs(jobs); },
    updateJob(id, patch) { this.saveJobs(this.getJobs().map(j => j.id === id ? { ...j, ...patch } : j)); },

    getSettings() {
      const D = { cabinetRate: 22000, worktopRate: 35000, applianceFlat: 58400, hardwareRate: 8, markup: 18, gst: 18, leadTimeDays: 21, finishes: ['Bali Oak', 'Alpine White', 'Graphite Grey', 'Natural Walnut', 'Ivory Sand', 'Smoked Teak'] };
      try { return { ...D, ...JSON.parse(localStorage.getItem('kreobox_settings') || '{}') }; } catch { return D; }
    },
    saveSettings(s) { localStorage.setItem('kreobox_settings', JSON.stringify(s)); fire(); },

    getDraft() { try { return JSON.parse(localStorage.getItem('kreobox_draft') || 'null'); } catch { return null; } },
    saveDraft(d) { localStorage.setItem('kreobox_draft', JSON.stringify(d)); },

    nextOrderId() {
      const d = new Date();
      return `KBX-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(this.getOrders().length+1).padStart(3,'0')}`;
    },
    nextJobId() {
      const d = new Date();
      return `FAB-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(this.getJobs().length+1).padStart(3,'0')}`;
    },
  };
})();

/* ─── BOM COMPUTATION ──────────────────────────────────────── */
function computeBOM(roomW, roomD, layout, finish) {
  const s = KreoStore.getSettings();
  const W = roomW / 1000, D = roomD / 1000;
  let wallRun = W + D;
  if (layout === 'U-shape') wallRun = W + 2 * D;
  if (layout === 'Straight') wallRun = W;
  const baseCount = Math.max(2, Math.round(wallRun * 0.7 / 0.6));
  const wallCount = Math.max(2, Math.round(wallRun * 0.7 / 0.6));
  const highCount = layout === 'U-shape' ? 2 : 1;
  const worktopM  = parseFloat((wallRun * 0.9).toFixed(1));
  const baseCabs  = baseCount * Math.round(s.cabinetRate * 0.6);
  const wallCabs  = wallCount * Math.round(s.cabinetRate * 0.6 * 0.8);
  const highCabs  = highCount * Math.round(s.cabinetRate * 0.6 * 1.1);
  const worktop   = Math.round(worktopM * s.worktopRate);
  const appliances = s.applianceFlat;
  const hardware  = Math.round((baseCabs + wallCabs + highCabs) * s.hardwareRate / 100);
  const subtotal  = baseCabs + wallCabs + highCabs + worktop + appliances + hardware;
  const gst       = Math.round(subtotal * s.gst / 100);
  const total     = subtotal + gst;
  const markup    = 0;
  return {
    bom: [
      { category: 'Base cabinets',     qty: baseCount,  unit: 'units', unitPrice: Math.round(s.cabinetRate * 0.6),       amount: baseCabs },
      { category: 'Wall cabinets',     qty: wallCount,  unit: 'units', unitPrice: Math.round(s.cabinetRate * 0.6 * 0.8), amount: wallCabs },
      { category: 'High cabinets',     qty: highCount,  unit: 'units', unitPrice: Math.round(s.cabinetRate * 0.6 * 1.1), amount: highCabs },
      { category: `${finish} worktop`, qty: worktopM,   unit: 'm',     unitPrice: s.worktopRate,                          amount: worktop },
      { category: 'Appliances',        qty: 1,          unit: 'set',   unitPrice: appliances,                             amount: appliances },
      { category: 'Hardware & lighting', qty: 1,        unit: 'set',   unitPrice: hardware,                               amount: hardware },
    ],
    subtotal, markup, gst, total,
  };
}

/* ─── QUOTE MODAL ──────────────────────────────────────────── */
function QuoteModal({ bom, roomType = 'kitchen', room, layout, finish, onSubmit, onClose }) {
  const { useState: useS } = React;
  const [name, setName]     = useS('');
  const [phone, setPhone]   = useS('');
  const [city, setCity]     = useS('');
  const [notes, setNotes]   = useS('');
  const [payOpt, setPayOpt] = useS('visit');
  const fmt = n => '₹ ' + n.toLocaleString('en-IN');
  const ok  = name.trim().length > 0;

  // Always derive from bom line items — no separate subtotal/markup/gst props
  const bomSubtotal = bom.reduce((sum, b) => sum + b.amount, 0);
  const bomGst      = Math.round(bomSubtotal * 0.18);
  const bomTotal    = bomSubtotal + bomGst;

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:pPaper, borderRadius:12, width:480, maxHeight:'88vh', overflow:'auto', boxShadow:'0 40px 120px rgba(0,0,0,0.35)' }}>
        <div style={{ padding:'24px 28px 0' }}>
          <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:pMute, fontWeight:700, marginBottom:4 }}>Submit BOQ to Studio</div>
          <div style={{ ...pStyles.fraunces, fontSize:24, marginBottom:4 }}>Your {roomType} · {layout || 'custom'}</div>
          <div style={{ fontSize:12, color:pMute }}>Room {room.W} × {room.D} × {room.H} mm · {finish}</div>
        </div>
        <div style={{ padding:'16px 28px', borderBottom:`1px solid ${pLine}` }}>
          {bom.length === 0 ? (
            <div style={{ fontSize:12, color:pMute, padding:'12px 0', textAlign:'center' }}>
              No items placed yet — drag items from the catalog to generate a live BOQ.
            </div>
          ) : bom.map((b,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderTop:i ? `1px solid ${pLine}` : 'none', fontSize:12 }}>
              <span>{b.category} <span style={{ color:pMute, fontSize:10 }}>×{b.qty} {b.unit}</span></span>
              <span style={{ ...pStyles.mono }}>{fmt(b.amount)}</span>
            </div>
          ))}
          {bom.length > 0 && (
            <div style={{ marginTop:6, paddingTop:8, borderTop:`1px solid ${pLine}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:pMute, marginBottom:3 }}>
                <span>GST (18%)</span><span style={pStyles.mono}>{fmt(bomGst)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, paddingTop:6, borderTop:`2px solid ${pInk}`, fontSize:14, fontWeight:700 }}>
                <span>Total estimate</span><span style={pStyles.mono}>{fmt(bomTotal)}</span>
              </div>
            </div>
          )}
        </div>
        <div style={{ padding:'20px 28px' }}>
          {[
            { label:'Your name *', val:name, set:setName, ph:'e.g. Priya Sharma', type:'text' },
            { label:'Phone (optional)', val:phone, set:setPhone, ph:'+91 98765 43210', type:'tel' },
            { label:'City (for delivery routing)', val:city, set:setCity, ph:'e.g. Mumbai', type:'text' },
          ].map(({ label, val, set, ph, type }) => (
            <div key={label} style={{ marginBottom:12 }}>
              <div style={{ fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:pMute, fontWeight:700, marginBottom:6 }}>{label}</div>
              <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph} style={{
                display:'block', width:'100%', padding:'10px 12px', border:`1px solid ${pLine}`, borderRadius:6,
                fontSize:13, fontFamily:'"Geist",sans-serif', color:pInk, background:pBg, outline:'none', boxSizing:'border-box',
              }} />
            </div>
          ))}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:pMute, fontWeight:700, marginBottom:6 }}>Notes</div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Any special requirements…" style={{
              display:'block', width:'100%', padding:'10px 12px', border:`1px solid ${pLine}`, borderRadius:6,
              fontSize:13, fontFamily:'"Geist",sans-serif', color:pInk, background:pBg, outline:'none', resize:'vertical', boxSizing:'border-box',
            }} />
          </div>
          {/* Confirmation options */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:pMute, fontWeight:700, marginBottom:10 }}>How would you like to proceed?</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>

              {/* Option 1 — Designer visit */}
              <label style={{ cursor:'pointer' }}>
                <input type="radio" name="payopt" value="visit" checked={payOpt==='visit'} onChange={() => setPayOpt('visit')} style={{ display:'none' }} />
                <div style={{ padding:'14px 16px', border:`2px solid ${payOpt==='visit' ? '#c96442' : pLine}`, borderRadius:8, background: payOpt==='visit' ? 'rgba(201,100,66,0.04)' : '#fafaf7', transition:'all 0.15s' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:pInk }}>Book a designer site visit</div>
                      <div style={{ fontSize:11, color:pMute, marginTop:2 }}>Our designer visits your premises · ₹999 refundable on order confirmation</div>
                    </div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#c96442', marginLeft:12, flexShrink:0 }}>₹ 999</div>
                  </div>
                  {payOpt === 'visit' && (
                    <div style={{ display:'flex', flexDirection:'column', gap:5, marginTop:8, paddingTop:8, borderTop:`1px solid ${pLine}` }}>
                      {['Pay online (UPI / Card / Net banking)', 'Pay on visit (cash / UPI)'].map((opt, i) => (
                        <label key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:pInk, cursor:'pointer' }}>
                          <input type="radio" name="paymode" defaultChecked={i===0} style={{ accentColor:'#c96442' }} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </label>

              {/* Option 2 — 70% advance */}
              <label style={{ cursor:'pointer' }}>
                <input type="radio" name="payopt" value="advance" checked={payOpt==='advance'} onChange={() => setPayOpt('advance')} style={{ display:'none' }} />
                <div style={{ padding:'14px 16px', border:`2px solid ${payOpt==='advance' ? '#c96442' : pLine}`, borderRadius:8, background: payOpt==='advance' ? 'rgba(201,100,66,0.04)' : '#fafaf7', transition:'all 0.15s' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:pInk }}>Pay 70% advance &amp; confirm order</div>
                      <div style={{ fontSize:11, color:pMute, marginTop:2 }}>Skip site visit · We verify &amp; dispatch your BOQ to the fabrication team</div>
                    </div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#c96442', marginLeft:12, flexShrink:0 }}>70% of {total ? '₹ '+Number(total).toLocaleString('en-IN') : 'total'}</div>
                  </div>
                </div>
              </label>

            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button disabled={!ok} onClick={() => ok && onSubmit({ customerName:name, customerPhone:phone, customerCity:city, notes, payOpt })} style={{
              flex:1, ...pStyles.primaryBtn, padding:'13px', borderRadius:8, border:'none',
              opacity:ok?1:0.4, cursor:ok?'pointer':'not-allowed', fontSize:13,
            }}>{payOpt==='visit' ? 'Confirm & Book Designer →' : 'Confirm & Pay Advance →'}</button>
            <button onClick={onClose} style={{ ...pStyles.pillBtn, padding:'13px 16px', borderRadius:8, cursor:'pointer', fontSize:13 }}>Cancel</button>
          </div>
          <div style={{ fontSize:11, color:pMute, marginTop:10, textAlign:'center' }}>
            {payOpt==='visit' ? 'Our designer will visit your premises within 24–48 hours of booking.' : 'Our team will verify your BOQ and confirm dispatch within 24–48 hours.'}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SUCCESS VIEW ─────────────────────────────────────────── */
function SuccessView({ order, onReset }) {
  const fmt = n => '₹ ' + n.toLocaleString('en-IN');
  return (
    <div style={{ ...pStyles.shell, alignItems:'center', justifyContent:'center' }}>
      <div style={{ maxWidth:420, textAlign:'center', padding:'0 24px' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(76,186,133,0.12)', border:'2px solid #4cba85', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 24px' }}>✓</div>
        <div style={{ ...pStyles.fraunces, fontSize:28, marginBottom:8 }}>Quote submitted</div>
        <div style={{ ...pStyles.mono, fontSize:12, color:pAccent, marginBottom:16 }}>{order.id}</div>
        <div style={{ fontSize:14, color:pMute, lineHeight:1.6, marginBottom:24 }}>
          Your kitchen design has been sent to the studio. <strong>{order.customerName}</strong>, we'll be in touch within 24 hours.
        </div>
        <div style={{ background:pPaper, borderRadius:8, padding:'16px 20px', marginBottom:24, textAlign:'left' }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
            <span style={{ color:pMute }}>Estimate</span>
            <span style={{ ...pStyles.mono, fontWeight:700 }}>{fmt(order.total)}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
            <span style={{ color:pMute }}>Layout · Finish</span>
            <span>{order.room.layout} · {order.finish}</span>
          </div>
        </div>
        <button onClick={onReset} style={{ ...pStyles.pillBtn, padding:'11px 22px', borderRadius:8, border:`1px solid ${pLine}`, cursor:'pointer', fontSize:13 }}>Plan another kitchen</button>
      </div>
    </div>
  );
}

/* ── FRONTEND PLANNER (client) ─────────────────────────────── */
function PlannerFrontend({ accent = pAccent }) {
  const { useState: useS, useEffect: useE, useMemo: useM } = React;
  const [view, setView]       = useS('2D plan');
  const [roomW, setRoomW]     = useS(3800);
  const [roomD, setRoomD]     = useS(2840);
  const [roomH, setRoomH]     = useS(2400);
  const [layout, setLayout]   = useS('L-shape');
  const [finish, setFinish]   = useS('Bali Oak');
  const [hardware, setHardware] = useS('Push-to-open');
  const [showModal, setShowModal] = useS(false);
  const [submitted, setSubmitted] = useS(null);
  const [saveTs, setSaveTs]   = useS(null);
  const [editDim, setEditDim] = useS(false);
  const [roomType, setRoomType] = useS('kitchen'); // 'kitchen' | 'wardrobe' | 'office'
  const [catalogTab, setCatalogTab] = useS('base');
  const [placedItems, setPlacedItems] = useS([]);
  const [roomElements, setRoomElements] = useS([]);
  const [selectedItemId, setSelectedItemId] = useS(null);

  const handleItemUpdate = (id, updates) => {
    setPlacedItems(prev => prev.map(it => it.id === id ? { ...it, ...updates } : it));
  };
  const handleItemDuplicate = (id) => {
    const src = placedItems.find(it => it.id === id);
    if (!src) return;
    const newId = `item-${Date.now()}-dup`;
    setPlacedItems(prev => [...prev, { ...src, id: newId, x: src.x + 200, y: src.y + 100 }]);
    setSelectedItemId(newId);
  };

  // roomItems is always derived from placedItems — single source of truth
  const roomItems = useM(() => {
    const map = {};
    placedItems.forEach(item => {
      const key = `${item.name}||${item.variant}`;
      if (!map[key]) map[key] = { name: item.name, variant: item.variant, price: item.price, qty: 0 };
      map[key].qty++;
    });
    return Object.values(map);
  }, [placedItems]);

  const handleRoomType = type => {
    setRoomType(type);
    setPlacedItems([]);
    if (type === 'kitchen')  setCatalogTab('base');
    if (type === 'wardrobe') setCatalogTab('wardrobe');
    if (type === 'office')   setCatalogTab('office');
  };

  const handleDrop2D = (data) => {
    const id = `item-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    setPlacedItems(prev => [...prev, { ...data, id, color: getCabColor(data.name) }]);
  };
  const handleItemMove2D = (id, x, y) => {
    setPlacedItems(prev => prev.map(it => it.id === id ? { ...it, x, y } : it));
  };
  const handleItemDelete2D = (id) => {
    setPlacedItems(prev => prev.filter(it => it.id !== id));
  };

  // "Add to room" button in catalog: places item at a staggered default position on canvas
  const addToCanvas = (itemData) => {
    const id = `item-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    const { w, h } = getDefaultDims(itemData.name);
    const offset = placedItems.length * 150;
    const x = 200 + (offset % Math.max(1, roomW - 600));
    const y = 200 + Math.floor(offset / Math.max(1, roomW - 600)) * 300;
    setPlacedItems(prev => [...prev, { ...itemData, id, color: getCabColor(itemData.name), w, h, x, y }]);
  };

  // Remove all instances of this item from canvas
  const removeFromCanvas = (name, variant) => {
    setPlacedItems(prev => prev.filter(it => !(it.name === name && it.variant === variant)));
  };

  useE(() => {
    const draft = KreoStore.getDraft();
    if (draft && draft.room) {
      setRoomW(draft.room.W || 3800); setRoomD(draft.room.D || 2840); setRoomH(draft.room.H || 2400);
      setLayout(draft.room.layout || 'L-shape');
      if (draft.finish)   setFinish(draft.finish);
      if (draft.hardware) setHardware(draft.hardware);
    }
  }, []);

  // Real-time BOQ: always derived from what's actually placed on the canvas.
  // Falls back to room-dimension estimate for kitchen when canvas is empty.
  const { bom, liveSubtotal, liveGst, liveTotal } = useM(() => {
    if (roomItems.length > 0) {
      const liveBom = roomItems.map(r => {
        const unitPrice = estimateItemPrice(r.price);
        return { category: r.name, qty: r.qty, unit: 'units', unitPrice, amount: unitPrice * r.qty };
      });
      const sub = liveBom.reduce((s, b) => s + b.amount, 0);
      const gstAmt = Math.round(sub * 0.18);
      return { bom: liveBom, liveSubtotal: sub, liveGst: gstAmt, liveTotal: sub + gstAmt };
    }
    // No items placed — use dimension-based estimate only for kitchen
    if (roomType === 'kitchen') {
      const { bom: kb, subtotal: ks, gst: kg, total: kt } = computeBOM(roomW, roomD, layout, finish);
      return { bom: kb, liveSubtotal: ks, liveGst: kg, liveTotal: kt };
    }
    return { bom: [], liveSubtotal: 0, liveGst: 0, liveTotal: 0 };
  }, [roomItems, roomType, roomW, roomD, layout, finish]);

  const handleSave = () => {
    KreoStore.saveDraft({ room: { W:roomW, D:roomD, H:roomH, layout }, finish, hardware, ts: Date.now() });
    setSaveTs(new Date());
  };

  const handleSubmit = customerData => {
    const order = {
      id: KreoStore.nextOrderId(), ts: Date.now(), status: 'new',
      ...customerData,
      room: { W:roomW, D:roomD, H:roomH, layout },
      finish, hardware, roomItems, bom, subtotal: liveSubtotal, gst: liveGst, total: liveTotal,
    };
    KreoStore.addOrder(order);
    setSubmitted(order);
  };

  const fmt = n => '₹ ' + n.toLocaleString('en-IN');
  const saveLabel = saveTs
    ? `Saved · ${saveTs.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}`
    : 'Unsaved draft';
  const settings = KreoStore.getSettings();

  if (submitted) return <SuccessView order={submitted} onReset={() => setSubmitted(null)} />;

  return (
    <div style={pStyles.shell}>
      {showModal && (
        <QuoteModal bom={bom} roomType={roomType}
          room={{ W:roomW, D:roomD, H:roomH }} layout={layout} finish={finish}
          onSubmit={handleSubmit} onClose={() => setShowModal(false)} />
      )}

      {/* Top bar */}
      <div style={pStyles.topbar}>
        {/* LEFT: brand + project name */}
        <div style={{ display:'flex', alignItems:'center', gap:18, minWidth:0 }}>
          {/* Brand breadcrumb */}
          <div style={{ display:'flex', alignItems:'center', gap:10, paddingRight:18, borderRight:`1px solid ${pLine}`, flexShrink:0 }}>
            <KreoboxMark size={24} color={pSienna} />
            <span style={{ fontFamily:'"Fraunces",serif', fontWeight:400, fontSize:16, letterSpacing:'0.06em', textTransform:'uppercase', color:pInk }}>Kreobox</span>
            <span style={{ color:pMute2, fontSize:14 }}>/</span>
            <span style={{ fontFamily:'"Fraunces",serif', fontStyle:'italic', fontWeight:500, fontSize:17, color:pSienna, letterSpacing:'-0.01em' }}>Planner</span>
          </div>
          {/* Project name */}
          <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
            {/* Room type selector (compact pills) */}
            <div style={{ display:'flex', gap:4 }}>
              {[['kitchen','Kitchen'],['wardrobe','Wardrobe'],['office','Office']].map(([t,l]) => (
                <button key={t} onClick={() => handleRoomType(t)} style={{
                  padding:'5px 10px', borderRadius:100, fontSize:11, fontWeight:500, cursor:'pointer',
                  border:`1px solid ${t===roomType ? pSienna : 'transparent'}`,
                  background: t===roomType ? pSiennaSoft : 'transparent',
                  color: t===roomType ? pSienna : pMute,
                }}>{l}</button>
              ))}
            </div>
            <span style={{ color:pMute2, fontSize:14 }}>/</span>
            <input
              defaultValue={roomType === 'kitchen' ? `${layout} kitchen` : roomType === 'wardrobe' ? 'Bedroom wardrobe' : 'Office plan'}
              style={{
                fontSize:14, fontWeight:500, padding:'5px 8px', borderRadius:6,
                border:'1px solid transparent', background:'transparent', color:pInk, outline:'none',
                minWidth:140, maxWidth:240,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = pWarm; e.currentTarget.style.borderColor = pLine; }}
              onMouseLeave={e => { if (document.activeElement !== e.currentTarget) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; } }}
              onFocus={e => { e.currentTarget.style.background = pWarm; e.currentTarget.style.borderColor = pLine; }}
              onBlur={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
            />
          </div>
        </div>
        {/* CENTER: save state */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:7, fontFamily:'JetBrains Mono,monospace', fontSize:10, color:pGreen, letterSpacing:'0.14em', textTransform:'uppercase' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:pGreen, display:'inline-block' }} />
            {saveLabel}
          </span>
        </div>
        {/* RIGHT: actions */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <ViewToggle value={view} onChange={setView} />
          <button onClick={handleSave} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 14px', borderRadius:100, fontSize:13, fontWeight:500, color:pInk, border:'1px solid transparent', background:'transparent', cursor:'pointer' }}>↩ Undo</button>
          <button style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 14px', borderRadius:100, fontSize:13, fontWeight:500, color:pInk, border:'1px solid transparent', background:'transparent', cursor:'pointer' }}>⤴ Share</button>
          <button onClick={() => setShowModal(true)} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 14px', borderRadius:100, fontSize:13, fontWeight:500, color:pInk, border:`1px solid ${pLine2}`, background:'transparent', cursor:'pointer' }}>⊡ Render in 3D</button>
        </div>
      </div>

      {/* Step progress strip */}
      {(() => {
        const STEPS = ['Room', 'Modules', 'Materials', 'Hardware', 'Review & order'];
        // Determine active step based on view and roomItems
        const activeStep = view === 'Room setup' ? 0 : roomItems.length > 0 ? 1 : 1;
        return (
          <div style={{ height:56, display:'flex', alignItems:'center', justifyContent:'center', background:pWarm, borderBottom:`1px solid ${pLine}`, flexShrink:0 }}>
            {STEPS.map((label, i) => {
              const isDone   = i < activeStep;
              const isActive = i === activeStep;
              return (
                <React.Fragment key={label}>
                  {i > 0 && (
                    <div style={{ width:36, height:1, background: isDone ? pGreen : pLine2, opacity: isDone ? 0.4 : 1, margin:'0 4px' }} />
                  )}
                  <div style={{
                    display:'flex', alignItems:'center', gap:10, padding:'8px 14px', borderRadius:100, cursor:'pointer',
                    background: isActive ? pInk : 'transparent',
                  }}>
                    <span style={{
                      width:22, height:22, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                      fontFamily:'JetBrains Mono,monospace', fontSize:11, fontWeight:700,
                      background: isDone ? pGreen : isActive ? pSienna : 'rgba(22,20,15,0.06)',
                      color: isDone || isActive ? pPaper : pMute,
                    }}>
                      {isDone ? '✓' : i + 1}
                    </span>
                    <span style={{
                      fontSize:14, fontWeight: isActive ? 600 : 500,
                      color: isActive ? pPaper : isDone ? pInk : pMute,
                    }}>{label}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        );
      })()}

      <div style={pStyles.body}>
        {/* LEFT — Catalog */}
        <CatalogPanel onAdd={addToCanvas} activeTab={catalogTab} onTabChange={setCatalogTab}
          roomType={roomType} roomW={roomW} roomD={roomD}
          onSizePreset={rs => { setRoomW(rs.W); setRoomD(rs.D); if (rs.layout) setLayout(rs.layout); setPlacedItems([]); }} />

        {/* CENTER — Viewport */}
        <div style={{ flex:1, position:'relative', background:pBg, display:'flex', flexDirection:'column', minWidth:0 }}>
          {/* Info / dimensions chip */}
          <div style={{
            position:'absolute', top:16, left:16, zIndex:editDim?11:2,
            background:pPaper, border:`1px solid ${pLine}`, borderRadius:8,
            padding:'6px 10px', display:'flex', gap:8, alignItems:'center',
            fontSize:11, ...pStyles.mono, color:pMute,
          }}>
            <span style={{ cursor:'pointer', color:pAccent, fontWeight:600 }} onClick={() => setEditDim(!editDim)}>
              {layout} · {(roomW/1000).toFixed(2)} × {(roomD/1000).toFixed(2)} m ✎
            </span>
            <span style={{ width:1, height:12, background:pLine }}/>
            <span>{view === '3D walk' ? 'Perspective' : view === 'Elevation' ? 'Front elevation' : view === 'Room setup' ? `${roomElements.length} elements placed` : 'Scale 1:25'}</span>
          </div>

          {/* Dimension editor popover */}
          {editDim && (
            <div style={{
              position:'absolute', top:52, left:16, zIndex:10,
              background:pPaper, border:`1px solid ${pLine}`, borderRadius:10, padding:'16px 18px',
              boxShadow:'0 8px 32px rgba(0,0,0,0.14)', display:'flex', flexDirection:'column', gap:12, minWidth:280,
            }}>
              <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:pMute, fontWeight:700 }}>Room dimensions (mm)</div>
              {[['Width', roomW, setRoomW], ['Depth', roomD, setRoomD], ['Height', roomH, setRoomH]].map(([label, val, setter]) => (
                <div key={label} style={{ display:'grid', gridTemplateColumns:'60px 1fr', gap:10, alignItems:'center' }}>
                  <span style={{ fontSize:11, color:pMute }}>{label}</span>
                  <input type="number" value={val} step={50} onChange={e => setter(Math.max(1200, Number(e.target.value)))} style={{
                    padding:'7px 10px', border:`1px solid ${pLine}`, borderRadius:6, fontSize:12,
                    fontFamily:'JetBrains Mono,monospace', color:pInk, background:pBg, outline:'none',
                  }} />
                </div>
              ))}
              <div>
                <div style={{ fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:pMute, fontWeight:700, marginBottom:8 }}>Layout</div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {['L-shape','U-shape','Straight','Island'].map(l => (
                    <button key={l} onClick={() => setLayout(l)} style={{
                      padding:'5px 10px', borderRadius:6, cursor:'pointer', fontWeight:600, fontSize:11,
                      border:`1px solid ${l === layout ? pAccent : pLine}`,
                      background: l === layout ? 'rgba(201,100,66,0.08)' : 'transparent',
                      color: l === layout ? pAccent : pMute,
                    }}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:pMute, fontWeight:700, marginBottom:8 }}>Finish</div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {(settings.finishes || ['Bali Oak','Alpine White','Graphite Grey','Natural Walnut']).map(f => (
                    <button key={f} onClick={() => setFinish(f)} style={{
                      padding:'5px 10px', borderRadius:6, cursor:'pointer', fontWeight:600, fontSize:11,
                      border:`1px solid ${f === finish ? pAccent : pLine}`,
                      background: f === finish ? 'rgba(201,100,66,0.08)' : 'transparent',
                      color: f === finish ? pAccent : pMute,
                    }}>{f}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => setEditDim(false)} style={{ ...pStyles.primaryBtn, padding:'9px', border:'none', borderRadius:8, cursor:'pointer', fontSize:12 }}>Apply ✓</button>
            </div>
          )}

          {view !== '3D walk' && (
            <div style={{ position:'absolute', top:16, right:16, zIndex:2, display:'flex', flexDirection:'column', gap:6 }}>
              {['＋','−','⌖','↺'].map(s => (
                <span key={s} style={{ width:32, height:32, borderRadius:8, background:pPaper, border:`1px solid ${pLine}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:600, cursor:'pointer' }}>{s}</span>
              ))}
            </div>
          )}
          <div style={{ flex:1, padding:24, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={() => setEditDim(false)}>
            <div style={{
              width:'100%', maxWidth: view === '3D walk' ? 800 : view === '2D plan' && selectedItemId ? 960 : 700,
              aspectRatio: view === '3D walk' ? '620 / 440' : view === 'Room setup' ? '560 / 400' : '480 / 380',
              background: view === '3D walk' ? pBg : pPaper,
              borderRadius:12, border:`1px solid ${pLine}`,
              boxShadow:'0 30px 80px -30px rgba(0,0,0,0.18)', overflow:'hidden',
              position:'relative',
            }}>
              {view === 'Room setup' && <RoomSetupView roomW={roomW} roomD={roomD} elements={roomElements} onAdd={el => setRoomElements(prev => [...prev, el])} onRemove={id => setRoomElements(prev => prev.filter(e => e.id !== id))} onMove={(id, x, y) => setRoomElements(prev => prev.map(e => e.id === id ? { ...e, x, y } : e))} />}
              {view === '2D plan'    && <KitchenPlan2D accent={accent} roomType={roomType} items={placedItems} roomElements={roomElements} onDrop={handleDrop2D} onItemMove={handleItemMove2D} onItemDelete={handleItemDelete2D} onItemSelect={setSelectedItemId} selectedItemId={selectedItemId} roomW={roomW} roomD={roomD} />}
              {view === '2D plan' && selectedItemId && (() => {
                const item = placedItems.find(it => it.id === selectedItemId);
                return item ? (
                  <ItemModifyPanel
                    item={item}
                    onUpdate={u => handleItemUpdate(selectedItemId, u)}
                    onDuplicate={() => handleItemDuplicate(selectedItemId)}
                    onDelete={() => { handleItemDelete2D(selectedItemId); setSelectedItemId(null); }}
                    onClose={() => setSelectedItemId(null)}
                  />
                ) : null;
              })()}
              {view === 'Elevation'  && <KitchenElevation accent={accent} items={placedItems} roomW={roomW} roomH={roomH} />}
              {view === '3D walk'    && <KitchenPlan3D accent={accent} items={placedItems} roomW={roomW} roomD={roomD} roomH={roomH} onMoveItem={(idx, pos) => setPlacedItems(prev => prev.map((it, i) => i === idx ? { ...it, x: pos.x, y: pos.y } : it))} />}
            </div>
          </div>

          {/* AI assist strip */}
          <div style={{ margin:'0 24px 16px', background:'#0e0d0b', color:pPaper, borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${accent},#d97042)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700 }}>K</div>
            <div style={{ flex:1, fontSize:13 }}>
              <span style={{ color:'rgba(255,255,255,0.55)' }}>Kreobox · </span>
              Your sink-to-hob distance is <span style={{ color:accent, fontWeight:600 }}>1.2 m</span> — comfortable working triangle. Consider a 600 mm drawer between them for utensils.
            </div>
            <span style={{ padding:'7px 12px', borderRadius:6, background:'rgba(255,255,255,0.08)', fontSize:12, fontWeight:600, cursor:'pointer' }}>Apply</span>
            <span style={{ padding:'7px 12px', borderRadius:6, fontSize:12, color:'rgba(255,255,255,0.55)', cursor:'pointer' }}>Dismiss</span>
          </div>
        </div>

        {/* RIGHT — Properties / Cart + BOM panel */}
        <div style={{ background:pPaper, borderLeft:`1px solid ${pLine}`, width:320, flexShrink:0, display:'flex', flexDirection:'column', overflowY:'auto' }}>
          {/* Panel eyebrow + heading */}
          <div style={{ padding:'20px 22px 0', flexShrink:0 }}>
            <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:pSienna, letterSpacing:'0.16em', textTransform:'uppercase', fontWeight:600, marginBottom:4 }}>
              {roomType === 'kitchen' ? 'Kitchen · ' + layout : roomType === 'wardrobe' ? 'Wardrobe plan' : 'Office plan'}
            </div>
            <h3 style={{ fontFamily:'"Fraunces",Georgia,serif', fontWeight:400, fontSize:26, lineHeight:1.05, letterSpacing:'-0.02em', margin:'0 0 6px' }}>
              {roomItems.length > 0 ? `${roomItems.reduce((s,r) => s+r.qty,0)} modules` : 'Your plan'}
            </h3>
            <p style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:pMute, letterSpacing:'0.14em', textTransform:'uppercase', margin:'0 0 16px' }}>
              {(roomW/1000).toFixed(1)}M × {(roomD/1000).toFixed(1)}M × {(roomH/1000).toFixed(1)}M · {finish}
            </p>
          </div>

          {/* Dimension chips */}
          <div style={{ margin:'0 22px 18px' }}>
            <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:pMute, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:10 }}>Dimensions</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6 }}>
              {[['Width', roomW, 'mm'], ['Depth', roomD, 'mm'], ['Height', roomH, 'mm']].map(([l, v]) => (
                <div key={l} style={{ padding:'8px 10px', borderRadius:8, background:pWarm, border:`1px solid ${pLine}`, textAlign:'center' }}>
                  <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:9, color:pMute, letterSpacing:'0.14em', textTransform:'uppercase' }}>{l}</div>
                  <div style={{ fontFamily:'"Fraunces",serif', fontSize:16, lineHeight:1, letterSpacing:'-0.01em', marginTop:4 }}>
                    {Math.round(v/100)/10}<span style={{ fontSize:10, color:pMute, marginLeft:2 }}>m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Room items list */}
          <div style={{ padding:'0 22px', flexShrink:0 }}>
            <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:pMute, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span>In room</span>
              {roomItems.length > 0 && (
                <span style={{ background:pSienna, color:pPaper, fontSize:9, fontWeight:700, padding:'1px 7px', borderRadius:999 }}>
                  {roomItems.reduce((s,r) => s+r.qty, 0)}
                </span>
              )}
            </div>
            {roomItems.length === 0 ? (
              <div style={{ fontSize:11, color:pMute, textAlign:'center', padding:'14px 0', fontFamily:'JetBrains Mono,monospace' }}>
                Drag items from catalog →
              </div>
            ) : (
              <div style={{ maxHeight:140, overflowY:'auto', marginBottom:16 }}>
                {roomItems.map(r => (
                  <div key={`${r.name}||${r.variant}`} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderTop:`1px solid ${pLine}`, fontSize:11 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:500, lineHeight:1.3 }}>{r.name}</div>
                      {r.variant && <div style={{ fontSize:10, color:pMute, fontFamily:'JetBrains Mono,monospace' }}>{r.variant}</div>}
                    </div>
                    <span style={{ fontSize:11, color:pMute, fontFamily:'JetBrains Mono,monospace' }}>×{r.qty}</span>
                    <span onClick={() => removeFromCanvas(r.name, r.variant)} style={{ cursor:'pointer', color:pMute, fontSize:14, lineHeight:1 }}>×</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Finish swatch block */}
          <div style={{ margin:'0 22px 18px' }}>
            <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:pMute, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:10 }}>Finish</div>
            <button style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'10px', borderRadius:10, background:pWarm, border:`1px solid ${pLine}`, cursor:'pointer', transition:'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor=pSienna}
              onMouseLeave={e => e.currentTarget.style.borderColor=pLine}
            >
              <div style={{ width:48, height:48, borderRadius:8, flexShrink:0, border:`2px solid ${pPaper}`, boxShadow:`0 0 0 1px ${pLine2}`, background:'linear-gradient(135deg,#c8b89a,#7a5a3a)' }} />
              <div style={{ flex:1, minWidth:0, textAlign:'left' }}>
                <div style={{ fontSize:13, fontWeight:500, color:pInk }}>{finish}</div>
                <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:pMute, letterSpacing:'0.1em', marginTop:2 }}>LAMINATE · IN STOCK</div>
              </div>
              <span style={{ color:pMute, fontSize:12 }}>→</span>
            </button>
          </div>

          {/* Live BOQ */}
          <div style={{ flex:1, overflowY:'auto', padding:'0 22px 24px' }}>
            <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:pMute, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:10 }}>Live BOQ</div>
            {bom.length === 0 ? (
              <div style={{ fontSize:11, color:pMute, textAlign:'center', padding:'12px 0' }}>
                Drag items to canvas to see cost
              </div>
            ) : bom.map((b, i) => (
              <div key={`${b.category}-${i}`} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderTop:i?`1px solid ${pLine}`:'none', fontSize:12 }}>
                <div>
                  <div style={{ fontWeight:500 }}>{b.category}</div>
                  <div style={{ fontSize:10, color:pMute, fontFamily:'JetBrains Mono,monospace' }}>×{b.qty} {b.unit}</div>
                </div>
                <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, alignSelf:'center' }}>{b.amount > 0 ? fmt(b.amount) : '—'}</span>
              </div>
            ))}
            {bom.length > 0 && (
              <div style={{ marginTop:8, paddingTop:8, borderTop:`1px solid ${pLine}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:pMute, marginBottom:3 }}>
                  <span>GST (18%)</span><span style={{ fontFamily:'JetBrains Mono,monospace' }}>{fmt(liveGst)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ height:76, background:pInk, color:pPaper, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:28 }}>
          {[
            { l:'In room', v:`${roomItems.reduce((s,r) => s+r.qty,0) || 0} modules` },
            { l:'Laminate', v:finish },
            { l:'Install', v:'Est. 21 days' },
            { l:'Ships from', v:'Studio BLR' },
          ].map((m, i) => (
            <React.Fragment key={m.l}>
              {i > 0 && <div style={{ width:1, height:32, background:'rgba(245,243,237,0.14)' }} />}
              <div style={{ display:'flex', flexDirection:'column' }}>
                <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'rgba(245,243,237,0.55)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:2 }}>{m.l}</span>
                <span style={{ fontFamily:'"Fraunces",Georgia,serif', fontSize:18, letterSpacing:'-0.01em' }}>{m.v}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:18 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
            <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'rgba(245,243,237,0.55)', letterSpacing:'0.14em', textTransform:'uppercase' }}>All-in total</span>
            <span style={{ fontFamily:'"Fraunces",Georgia,serif', fontSize:32, letterSpacing:'-0.02em', lineHeight:1, color:pPaper, marginTop:2 }}>{liveTotal > 0 ? fmt(liveTotal) : '—'}</span>
          </div>
          <button onClick={() => setShowModal(true)} style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'14px 22px', borderRadius:100, background:pSienna, color:pPaper, fontSize:14, fontWeight:600, border:`1px solid ${pSienna}`, cursor:'pointer' }}>
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PlannerFrontend, KitchenPlan2D, KitchenPlan3D, KitchenElevation, KreoboxMark, KreoboxWordmark, KreoStore, computeBOM });
