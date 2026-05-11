/* ============================================================
   PLANNER · FRONTEND (client-facing kitchen planner)
   Tone: editorial, calm, paper. Premium curation.
   ============================================================ */

const pInk    = '#1a1815';
const pPaper  = '#fafaf7';
const pBg     = '#f0eee9';
const pMute   = 'rgba(26,24,21,0.55)';
const pLine   = 'rgba(26,24,21,0.09)';
const pAccent = '#c96442';

const pStyles = {
  shell:      { width:'100%', height:'100%', background:pBg, color:pInk, fontFamily:'"Inter Tight",-apple-system,system-ui,sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' },
  topbar:     { height:60, padding:'0 24px', background:pPaper, borderBottom:`1px solid ${pLine}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 },
  body:       { flex:1, display:'flex', minHeight:0 },
  panel:      { background:pPaper, borderRight:`1px solid ${pLine}`, display:'flex', flexDirection:'column' },
  pillBtn:    { padding:'8px 14px', borderRadius:8, fontSize:12, fontWeight:600, border:`1px solid ${pLine}`, background:'transparent', cursor:'pointer' },
  primaryBtn: { padding:'8px 14px', borderRadius:8, fontSize:12, fontWeight:600, background:pInk, color:pPaper, cursor:'pointer' },
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

/* ── 2D top-down kitchen plan (blank canvas, drag-and-drop) ── */
function KitchenPlan2D({ accent = pAccent, items = [], onDrop, onItemMove, onItemDelete }) {
  const { useState: useS, useRef } = React;
  const svgRef = useRef(null);
  const [drag, setDrag] = useS(null); // { id, startSX, startSY, origX, origY }

  const SVG_W = 480, SVG_H = 380;
  const PX = 48, PY = 44, PW = 390, PH = 292;
  const ROOM_W = 3800, ROOM_D = 2840;
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
    setDrag({ id: item.id, startSX: sx, startSY: sy, origX: item.x, origY: item.y });
  };

  const handleMouseMove = e => {
    if (!drag) return;
    const { sx, sy } = svgXY(e);
    const dx = (sx - drag.startSX) * ROOM_W / PW;
    const dy = (sy - drag.startSY) * ROOM_D / PH;
    onItemMove && onItemMove(drag.id, drag.origX + dx, drag.origY + dy);
  };

  const dimColor = pMute;
  return (
    <div style={{ width:'100%', height:'100%' }} onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
      <svg ref={svgRef} viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ width:'100%', height:'100%', display:'block', cursor: drag ? 'grabbing' : 'default' }}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDrag(null)}
        onMouseLeave={() => setDrag(null)}
      >
        <defs>
          <pattern id="grid"       width="20"  height="20"  patternUnits="userSpaceOnUse"><path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(26,24,21,0.06)" strokeWidth="1"/></pattern>
          <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M100 0 L0 0 0 100" fill="none" stroke="rgba(26,24,21,0.11)" strokeWidth="1"/></pattern>
        </defs>

        {/* Grid */}
        <rect x={PX} y={PY} width={PW} height={PH} fill="url(#grid)"/>
        <rect x={PX} y={PY} width={PW} height={PH} fill="url(#grid-major)"/>
        <rect x={PX} y={PY} width={PW} height={PH} fill="rgba(232,226,213,0.18)"/>

        {/* Room walls (L-shape default) */}
        <path d={`M${PX} ${PY+PH} L${PX} ${PY} L${PX+PW} ${PY}`}
          fill="none" stroke="#1a1815" strokeWidth="6" strokeLinejoin="round"/>
        <path d={`M${PX+PW} ${PY} L${PX+PW} ${PY+PH*0.37}`}
          fill="none" stroke="#1a1815" strokeWidth="6" strokeLinecap="round"/>
        <path d={`M${PX} ${PY+PH} L${PX+120} ${PY+PH}`}
          fill="none" stroke="#1a1815" strokeWidth="6" strokeLinecap="round"/>

        {/* Dimension lines */}
        <g fill={dimColor} fontSize="9" fontFamily="JetBrains Mono,monospace">
          <line x1={PX} y1={PY-8} x2={PX+PW} y2={PY-8} stroke={dimColor} strokeWidth="1"/>
          <line x1={PX} y1={PY-12} x2={PX} y2={PY-4} stroke={dimColor} strokeWidth="1"/>
          <line x1={PX+PW} y1={PY-12} x2={PX+PW} y2={PY-4} stroke={dimColor} strokeWidth="1"/>
          <text x={PX+PW/2} y={PY-14} textAnchor="middle">3,800 mm</text>
          <line x1={PX-8} y1={PY} x2={PX-8} y2={PY+PH} stroke={dimColor} strokeWidth="1"/>
          <line x1={PX-12} y1={PY} x2={PX-4} y2={PY} stroke={dimColor} strokeWidth="1"/>
          <line x1={PX-12} y1={PY+PH} x2={PX-4} y2={PY+PH} stroke={dimColor} strokeWidth="1"/>
          <text x={PX-20} y={PY+PH/2} textAnchor="middle" transform={`rotate(-90,${PX-20},${PY+PH/2})`}>2,840 mm</text>
        </g>

        {/* Empty state */}
        {items.length === 0 && (
          <g>
            <text x={PX+PW/2} y={PY+PH/2-8} fill="rgba(26,24,21,0.14)" fontSize="12" fontFamily="JetBrains Mono,monospace" textAnchor="middle">Drag items from catalog to place</text>
            <text x={PX+PW/2} y={PY+PH/2+10} fill="rgba(26,24,21,0.09)" fontSize="10" fontFamily="JetBrains Mono,monospace" textAnchor="middle">Scale 1:25 · drag to reposition</text>
          </g>
        )}

        {/* Placed items */}
        {items.map(item => {
          const sp = r2s(item.x, item.y);
          const sw = Math.max(8, r2sw(item.w));
          const sh = Math.max(6, r2sh(item.h));
          const isActive = drag?.id === item.id;
          return (
            <g key={item.id} onMouseDown={e => handleItemDown(e, item)}
              style={{ cursor: isActive ? 'grabbing' : 'grab' }}>
              <rect x={sp.x} y={sp.y} width={sw} height={sh}
                fill={item.color} fillOpacity={0.88}
                stroke={isActive ? accent : 'rgba(26,24,21,0.4)'}
                strokeWidth={isActive ? 2 : 1} rx={1}/>
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
              {/* delete ×  */}
              <text x={sp.x+sw-3} y={sp.y+7} fill={accent} fontSize={8} fontWeight="800"
                style={{ cursor:'pointer' }}
                onClick={e => { e.stopPropagation(); onItemDelete && onItemDelete(item.id); }}>×</text>
            </g>
          );
        })}

        {/* Scale label */}
        <text x={PX+PW} y={PY+PH+14} fill={dimColor} fontSize="9" fontFamily="JetBrains Mono,monospace" textAnchor="end">Scale 1:25</text>
      </svg>
    </div>
  );
}

/* ── Front elevation ───────────────────────────────────────── */
function KitchenElevation({ accent = pAccent }) {
  const cabFill = '#e8e2d5', cabStroke = '#a99a82', dimColor = pMute;
  return (
    <svg viewBox="0 0 480 340" style={{ width:'100%', height:'100%', display:'block' }}>
      <rect width="480" height="340" fill={pBg}/>
      <line x1="30" y1="300" x2="450" y2="300" stroke="#1a1815" strokeWidth="3"/>
      <line x1="30" y1="40" x2="450" y2="40" stroke="rgba(26,24,21,0.15)" strokeWidth="1" strokeDasharray="4 4"/>
      <rect x="30" y="40" width="420" height="260" fill="rgba(232,226,213,0.15)"/>
      <rect x="32" y="196" width="80" height="104" fill={cabFill} stroke={cabStroke} strokeWidth="1.5"/>
      <line x1="72" y1="196" x2="72" y2="300" stroke={cabStroke} strokeWidth="1"/>
      <rect x="114" y="196" width="100" height="104" fill={cabFill} stroke={cabStroke} strokeWidth="1.5"/>
      <rect x="124" y="208" width="80" height="44" fill="#d0c8b8" stroke={cabStroke} strokeWidth="1" rx="2"/>
      <circle cx="164" cy="230" r="4" fill="#a99a82"/>
      <rect x="216" y="196" width="84" height="104" fill={cabFill} stroke={cabStroke} strokeWidth="1.5"/>
      <rect x="226" y="208" width="64" height="44" fill="#1a1815" rx="2"/>
      <circle cx="242" cy="222" r="4" fill="#3a352e"/>
      <circle cx="264" cy="222" r="4" fill="#3a352e"/>
      <rect x="302" y="196" width="86" height="104" fill={cabFill} stroke={cabStroke} strokeWidth="1.5"/>
      <line x1="345" y1="196" x2="345" y2="300" stroke={cabStroke} strokeWidth="1"/>
      <rect x="390" y="40" width="58" height="260" fill={cabFill} stroke={accent} strokeWidth="2.5"/>
      <line x1="390" y1="144" x2="448" y2="144" stroke={cabStroke} strokeWidth="1"/>
      <line x1="390" y1="220" x2="448" y2="220" stroke={cabStroke} strokeWidth="1"/>
      <rect x="32" y="100" width="346" height="78" fill="rgba(232,226,213,0.6)" stroke={cabStroke} strokeWidth="1.5"/>
      <line x1="112" y1="100" x2="112" y2="178" stroke={cabStroke} strokeWidth="1"/>
      <line x1="196" y1="100" x2="196" y2="178" stroke={cabStroke} strokeWidth="1"/>
      <line x1="268" y1="100" x2="268" y2="178" stroke={cabStroke} strokeWidth="1"/>
      <text x="200" y="145" fill={dimColor} fontSize="9" fontFamily="JetBrains Mono,monospace" textAnchor="middle">WALL CABINETS · 720h</text>
      <rect x="32" y="188" width="418" height="8" fill="#c8c0b0" stroke={cabStroke} strokeWidth="1"/>
      <g fill={dimColor} fontSize="9" fontFamily="JetBrains Mono,monospace">
        <line x1="16" y1="40" x2="16" y2="300" stroke={dimColor} strokeWidth="1"/>
        <line x1="12" y1="40" x2="20" y2="40" stroke={dimColor} strokeWidth="1"/>
        <line x1="12" y1="300" x2="20" y2="300" stroke={dimColor} strokeWidth="1"/>
        <text x="8" y="170" textAnchor="middle" transform="rotate(-90,8,170)">2,400 mm</text>
        <line x1="32" y1="316" x2="448" y2="316" stroke={dimColor} strokeWidth="1"/>
        <line x1="32" y1="312" x2="32" y2="320" stroke={dimColor} strokeWidth="1"/>
        <line x1="448" y1="312" x2="448" y2="320" stroke={dimColor} strokeWidth="1"/>
        <text x="240" y="330" textAnchor="middle">3,800 mm · FRONT ELEVATION</text>
      </g>
    </svg>
  );
}

/* ── TRUE PERSPECTIVE 3D view ──────────────────────────────── */
function KitchenPlan3D({ accent = pAccent }) {
  const { useState: useS, useCallback: useCB, useMemo: useM, useRef } = React;
  const RW = 3800, RD = 2840, RH = 2400;
  const SVG_W = 620, SVG_H = 440;
  const m = Math.sqrt(RW * RW + RD * RD);
  const p = SVG_W * 0.65;
  const [yaw, setYaw]     = useS(-30);
  const [pitch, setPitch] = useS(38);
  const drag = useRef(null);

  const project = useCB((wx, wy, wz) => {
    const tx = wx - RW/2, ty = wy - RH*0.42, tz = wz - RD/2;
    const cy = Math.cos(yaw*Math.PI/180), sy = Math.sin(yaw*Math.PI/180);
    const cp = Math.cos(pitch*Math.PI/180), sp = Math.sin(pitch*Math.PI/180);
    const rx = tx*cy + tz*sy, rz = -tx*sy + tz*cy;
    const ry = ty*cp - rz*sp, depth = ty*sp + rz*cp + m;
    if (depth < 1) return { x: SVG_W/2, y: SVG_H/2, z: -1 };
    return { x: SVG_W/2 + rx*p/depth, y: SVG_H/2 - ry*p/depth, z: depth };
  }, [yaw, pitch]);

  const polys = useM(() => {
    const ps = [];
    const face = (pts3, fill, stroke='#00000018', sw=0.5) => ps.push({ pts3, fill, stroke, sw });
    face([[0,0,0],[RW,0,0],[RW,0,RD],[0,0,RD]], '#d8d3c8', '#c4bfb4');
    face([[0,0,0],[RW,0,0],[RW,RH,0],[0,RH,0]], '#edeae4', '#d8d3c8');
    face([[0,0,0],[0,0,RD],[0,RH,RD],[0,RH,0]], '#e8e4dc', '#d8d3c8');
    const cf = '#d8d0c0', cfd = '#c8c0b0', cft = '#e4ddd0';
    face([[0,720,0],[3200,720,0],[3200,720,600],[0,720,600]], cft,'#00000020',0.3);
    face([[0,0,0],[3200,0,0],[3200,720,0],[0,720,0]], cfd,'#00000020',0.3);
    face([[0,0,600],[3200,0,600],[3200,720,600],[0,720,600]], cf,'#00000030',0.5);
    face([[3200,0,0],[3200,0,600],[3200,720,600],[3200,720,0]], cf,'#00000030',0.5);
    face([[0,720,0],[600,720,0],[600,720,2200],[0,720,2200]], cft,'#00000020',0.3);
    face([[0,0,0],[0,0,2200],[600,0,2200],[600,0,0]], cfd,'#00000020',0.3);
    face([[0,0,2200],[0,720,2200],[600,720,2200],[600,0,2200]], cf,'#00000030',0.5);
    face([[600,0,0],[600,0,2200],[600,720,2200],[600,720,0]], cf,'#00000020',0.3);
    face([[0,728,0],[3200,728,0],[3200,728,640],[0,728,640]], '#c8c0b0','#b4ada0');
    face([[0,728,0],[640,728,0],[640,728,2200],[0,728,2200]], '#c8c0b0','#b4ada0');
    const wf = '#ccc6ba', wfd = '#bbb5a9';
    face([[200,2100,0],[2900,2100,0],[2900,2100,350],[200,2100,350]], wf,'#00000018',0.3);
    face([[200,1380,0],[2900,1380,0],[2900,2100,0],[200,2100,0]], wfd,'#00000018',0.3);
    face([[200,1380,350],[200,2100,350],[2900,2100,350],[2900,1380,350]], wf,'#00000025',0.4);
    const pf = '#cdb99a', pfl = '#bca88a', pfd = '#d4c4a8';
    face([[3200,0,0],[3800,0,0],[3800,2400,0],[3200,2400,0]], pfl,'#00000020',0.3);
    face([[3200,0,0],[3200,0,600],[3800,0,600],[3800,0,0]], pfd,'#00000020',0.3);
    face([[3800,0,0],[3800,0,600],[3800,2400,600],[3800,2400,0]], pf,'#00000030',0.4);
    face([[3200,0,600],[3800,0,600],[3800,2400,600],[3200,2400,600]], pf, accent+'22', 0.4);
    face([[3200,2400,0],[3800,2400,0],[3800,2400,600],[3200,2400,600]], pfd,'#00000025',0.3);
    face([[1200,900,1600],[2500,900,1600],[2500,900,2500],[1200,900,2500]], '#252018','#ffffff10',0.3);
    face([[1200,0,1600],[2500,0,1600],[2500,900,1600],[1200,900,1600]], '#201d19','#ffffff08',0.3);
    face([[1200,0,2500],[2500,0,2500],[2500,900,2500],[1200,900,2500]], '#1a1815','#ffffff08',0.3);
    face([[1200,0,1600],[1200,0,2500],[1200,900,2500],[1200,900,1600]], '#1a1815','#ffffff08',0.3);
    face([[2500,0,1600],[2500,0,2500],[2500,900,2500],[2500,900,1600]], '#1a1815','#ffffff08',0.3);
    return ps;
  }, [yaw, pitch, accent]);

  const projected = useM(() =>
    polys.map(poly => {
      const pts2 = poly.pts3.map(([wx,wy,wz]) => project(wx,wy,wz));
      const avgZ = pts2.reduce((s,p2) => s+p2.z,0)/pts2.length;
      const ptsStr = pts2.map(p2=>`${p2.x.toFixed(1)},${p2.y.toFixed(1)}`).join(' ');
      return { ...poly, avgZ, ptsStr };
    }).sort((a,b) => b.avgZ - a.avgZ)
  , [polys, project]);

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ width:'100%', height:'100%', display:'block', cursor:'grab', userSelect:'none' }}
      onMouseDown={e => { drag.current = { sx:e.clientX, sy:e.clientY, y0:yaw, p0:pitch }; }}
      onMouseMove={e => { if(!drag.current) return; setYaw(drag.current.y0+(e.clientX-drag.current.sx)*0.4); setPitch(Math.max(8,Math.min(70,drag.current.p0-(e.clientY-drag.current.sy)*0.25))); }}
      onMouseUp={() => { drag.current=null; }} onMouseLeave={() => { drag.current=null; }}>
      <rect width={SVG_W} height={SVG_H} fill={pBg}/>
      {projected.map((poly,i) => poly.avgZ > 0 && (
        <polygon key={i} points={poly.ptsStr} fill={poly.fill} stroke={poly.stroke} strokeWidth={poly.sw}/>
      ))}
      <text x={12} y={SVG_H-12} fill={pMute} fontSize="9" fontFamily="JetBrains Mono,monospace" style={{pointerEvents:'none'}}>
        3D PERSPECTIVE · drag to rotate
      </text>
    </svg>
  );
}

/* ── View toggle ───────────────────────────────────────────── */
function ViewToggle({ value, onChange }) {
  const opts = ['2D plan', 'Elevation', '3D walk'];
  return (
    <div style={{ display:'flex', background:'rgba(26,24,21,0.05)', borderRadius:8, padding:3 }}>
      {opts.map(o => {
        const active = value === o;
        return (
          <span key={o} onClick={() => onChange(o)} style={{
            padding:'6px 14px', fontSize:12, fontWeight:600, borderRadius:6, cursor:'pointer',
            background: active ? pPaper : 'transparent',
            color: active ? pInk : pMute,
            boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
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

/* ── Kitchen catalog data ──────────────────────────────────── */
const CATALOG_TABS = [
  { id:'cabinets',  label:'Cabinets',       icon:'▦' },
  { id:'appliances',label:'Appliances',     icon:'⊡' },
  { id:'dining',    label:'Dining',         icon:'⊞' },
  { id:'extras',    label:'Kitchen extras', icon:'⊟' },
  { id:'search',    label:'Search',         icon:'⌕' },
];

const CABINET_SECTIONS = [
  {
    title: 'Base cabinets',
    code: 'KBX-BC',
    items: [
      { name:'For corner',           variants:['600×600mm','900×900mm'],         price:'₹18–24k' },
      { name:'For sink',             variants:['800mm','1000mm'],                price:'₹12–16k' },
      { name:'For hob',              variants:['600mm','900mm'],                 price:'₹9–14k'  },
      { name:'With drawers',         variants:['400mm','600mm','800mm'],         price:'₹14–22k' },
      { name:'With door',            variants:['300mm','600mm','900mm'],         price:'₹8–18k'  },
      { name:'With door & drawer',   variants:['600mm','800mm'],                 price:'₹16–22k' },
      { name:'Pull-out pantry',      variants:['300mm','600mm'],                 price:'₹22–32k' },
      { name:'Wire basket unit',     variants:['400mm','600mm'],                 price:'₹6–10k'  },
      { name:'Open base',            variants:['600mm','900mm'],                 price:'₹7–12k'  },
      { name:'Filler & cover panel', variants:['50mm','100mm','200mm'],          price:'₹2–5k'   },
    ],
  },
  {
    title: 'Wall cabinets',
    code: 'KBX-WC',
    items: [
      { name:'With door',            variants:['400mm','600mm','800mm'],         price:'₹6–14k'  },
      { name:'With glass doors',     variants:['400mm','600mm'],                 price:'₹8–16k'  },
      { name:'Horizontal cabinet',   variants:['600mm','900mm','1200mm'],        price:'₹10–20k' },
      { name:'For corner',           variants:['600×600mm'],                     price:'₹12–18k' },
      { name:'For extractor hood',   variants:['600mm','900mm'],                 price:'₹8–14k'  },
      { name:'For microwave',        variants:['600mm'],                         price:'₹10–16k' },
      { name:'Open wall cabinet',    variants:['600mm','900mm'],                 price:'₹5–10k'  },
      { name:'Filler & cover panel', variants:['50mm','100mm'],                  price:'₹1–4k'   },
    ],
  },
  {
    title: 'High cabinets',
    code: 'KBX-HC',
    items: [
      { name:'For fridge & freezer', variants:['600mm','900mm'],                 price:'₹22–36k' },
      { name:'For oven',             variants:['600mm'],                         price:'₹18–28k' },
      { name:'For microwave & oven', variants:['600mm'],                         price:'₹24–34k' },
      { name:'Pantry pull-out',      variants:['300mm','600mm'],                 price:'₹28–42k' },
      { name:'With door & drawer',   variants:['600mm','900mm'],                 price:'₹20–30k' },
      { name:'Filler & cover panel', variants:['50mm','100mm'],                  price:'₹3–6k'   },
    ],
  },
];

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

/* ── Catalog panel ─────────────────────────────────────────── */
function CatalogPanel({ onAdd }) {
  const { useState: useS } = React;
  const [activeTab, setActiveTab]           = useS('cabinets');
  const [search, setSearch]                 = useS('');
  const [catalogView, setCatalogView]       = useS('grid');
  const [selectedVariants, setSelectedVariants] = useS({});

  const getSelVariant = (item) => {
    const name = typeof item === 'string' ? item : item.name;
    return selectedVariants[name] || (item.variants && item.variants[0]) || '';
  };
  const pickVariant = (name, v) => setSelectedVariants(s => ({ ...s, [name]: v }));

  let sections = [];
  if (activeTab === 'cabinets')   sections = CABINET_SECTIONS;
  if (activeTab === 'appliances') sections = APPLIANCE_SECTIONS;
  if (activeTab === 'dining')     sections = DINING_SECTIONS;
  if (activeTab === 'extras')     sections = EXTRAS_SECTIONS;

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
    <div style={{ ...pStyles.panel, width:300, flexShrink:0 }}>
      {/* Tab bar */}
      <div style={{ display:'flex', overflowX:'auto', borderBottom:`1px solid ${pLine}`, scrollbarWidth:'none', flexShrink:0 }}>
        {CATALOG_TABS.map(tab => {
          const active = tab.id === activeTab;
          return (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearch(''); }} style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:4,
              padding:'10px 10px', border:'none', background:'transparent', cursor:'pointer',
              borderBottom: active ? `2px solid ${pAccent}` : '2px solid transparent',
              color: active ? pAccent : pMute,
              fontSize:9, fontWeight:700, fontFamily:'JetBrains Mono,monospace',
              letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap', flexShrink:0,
            }}>
              <span style={{ fontSize:15 }}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search + view toggle */}
      <div style={{ padding:'8px 12px', borderBottom:`1px solid ${pLine}`, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', background:'rgba(26,24,21,0.04)', borderRadius:8, fontSize:12, color:pMute, marginBottom:8 }}>
          <span>⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${activeTab}…`}
            style={{ border:'none', background:'transparent', outline:'none', flex:1, fontSize:12, color:pInk, fontFamily:'"Inter Tight",sans-serif' }} />
          {search && <span onClick={() => setSearch('')} style={{ cursor:'pointer', fontSize:14, lineHeight:1 }}>×</span>}
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {[['grid','⊞ Grid'],['list','≡ List']].map(([v,l]) => (
            <button key={v} onClick={() => setCatalogView(v)} style={{
              flex:1, padding:'5px', border:`1px solid ${v===catalogView?pAccent:pLine}`,
              borderRadius:6, fontSize:10, fontWeight:700, cursor:'pointer',
              background: v===catalogView ? 'rgba(201,100,66,0.08)' : 'transparent',
              color: v===catalogView ? pAccent : pMute,
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'8px' }}>
        {allItems.length === 0 && (
          <div style={{ padding:'24px', fontSize:12, color:pMute, textAlign:'center' }}>No results for "{search}"</div>
        )}

        {catalogView === 'grid' ? (
          /* ── E-commerce grid ── */
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {allItems.map(({ item, idx }) => {
              const name = typeof item === 'string' ? item : item.name;
              const variants = typeof item === 'object' ? (item.variants || []) : [];
              const price = typeof item === 'object' ? (item.price || '') : '';
              const selV = getSelVariant(item);
              const dims = getDefaultDims(name);
              return (
                <div key={name} draggable
                  onDragStart={e => e.dataTransfer.setData('text/plain', JSON.stringify({ name, variant: selV, price, ...dims }))}
                  style={{
                  background:pPaper, border:`1px solid ${pLine}`, borderRadius:10, padding:'10px 8px',
                  display:'flex', flexDirection:'column', gap:6,
                  transition:'box-shadow 0.15s', cursor:'grab',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 4px 16px rgba(0,0,0,0.10)`; e.currentTarget.style.borderColor=pAccent; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor=pLine; }}
                >
                  <div style={{ display:'flex', justifyContent:'center', padding:'6px 0', background:'rgba(26,24,21,0.02)', borderRadius:8 }}>
                    <ProductIcon name={name} size={52} />
                  </div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:600, lineHeight:1.3 }}>{name}</div>
                    <StarRow seed={idx} />
                    {price && <div style={{ fontSize:9, color:pMute, fontFamily:'JetBrains Mono,monospace', marginTop:1 }}>{price}</div>}
                  </div>
                  {variants.length > 0 && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                      {variants.map(v => (
                        <span key={v} onClick={() => pickVariant(name, v)} style={{
                          padding:'2px 6px', borderRadius:4, fontSize:9, fontWeight:600, fontFamily:'JetBrains Mono,monospace', cursor:'pointer',
                          border:`1px solid ${v===selV ? pAccent : pLine}`,
                          background: v===selV ? 'rgba(201,100,66,0.08)' : 'transparent',
                          color: v===selV ? pAccent : pMute,
                        }}>{v}</span>
                      ))}
                    </div>
                  )}
                  <button onClick={() => onAdd && onAdd({ name, variant: selV, price })} style={{
                    padding:'6px', borderRadius:6, fontSize:10, fontWeight:700, border:'none',
                    background:pInk, color:pPaper, cursor:'pointer', marginTop:'auto',
                  }}>+ Add to room</button>
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
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(26,24,21,0.04)'; e.currentTarget.style.borderLeftColor=pAccent; }}
                      onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderLeftColor='transparent'; }}
                    >
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:36, height:36, borderRadius:6, background:'#ede8e0', border:`1px solid ${pLine}`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <ProductIcon name={name} size={30} />
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontWeight:500, fontSize:12, lineHeight:1.3 }}>{name}</div>
                          {price && <div style={{ fontSize:9, color:pMute, fontFamily:'JetBrains Mono,monospace' }}>{price}</div>}
                        </div>
                        <button onClick={() => onAdd && onAdd({ name, variant: selV, price })} style={{
                          padding:'4px 8px', borderRadius:5, fontSize:10, fontWeight:700, border:'none', background:pInk, color:pPaper, cursor:'pointer', flexShrink:0,
                        }}>+</button>
                      </div>
                      {variants.length > 0 && (
                        <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:6, paddingLeft:44 }}>
                          {variants.map(v => (
                            <span key={v} onClick={() => pickVariant(name, v)} style={{
                              padding:'2px 7px', borderRadius:4, fontSize:9, fontWeight:600, fontFamily:'JetBrains Mono,monospace', cursor:'pointer',
                              border:`1px solid ${v===selV ? pAccent : pLine}`,
                              background: v===selV ? 'rgba(201,100,66,0.08)' : 'transparent',
                              color: v===selV ? pAccent : pMute,
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

        {/* Finishes swatch (cabinets, no search) */}
        {activeTab === 'cabinets' && !search && (
          <div style={{ padding:'12px 8px', borderTop:`1px solid ${pLine}`, marginTop:8 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:pMute, fontFamily:'JetBrains Mono,monospace', marginBottom:8 }}>Finishes</div>
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
                  <div style={{ height:36, borderRadius:6, marginBottom:4, border:`1px solid ${pLine}`, backgroundImage:`linear-gradient(45deg,rgba(255,255,255,0.18) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.18) 50%,rgba(255,255,255,0.18) 75%,transparent 75%),linear-gradient(135deg,${sw.tone[0]},${sw.tone[1]})`, backgroundSize:'8px 8px,100% 100%' }}/>
                  <div style={{ fontSize:9, fontWeight:500, color:pInk }}>{sw.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
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
  const markup    = Math.round(subtotal * s.markup / 100);
  const gst       = Math.round((subtotal + markup) * s.gst / 100);
  const total     = subtotal + markup + gst;
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
function QuoteModal({ bom, subtotal, markup, gst, total, room, layout, finish, onSubmit, onClose }) {
  const { useState: useS } = React;
  const [name, setName]   = useS('');
  const [phone, setPhone] = useS('');
  const [city, setCity]   = useS('');
  const [notes, setNotes] = useS('');
  const fmt = n => '₹ ' + n.toLocaleString('en-IN');
  const ok  = name.trim().length > 0;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:pPaper, borderRadius:12, width:480, maxHeight:'88vh', overflow:'auto', boxShadow:'0 40px 120px rgba(0,0,0,0.35)' }}>
        <div style={{ padding:'24px 28px 0' }}>
          <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:pMute, fontWeight:700, marginBottom:4 }}>Request quote</div>
          <div style={{ ...pStyles.fraunces, fontSize:24, marginBottom:4 }}>Your kitchen · {layout}</div>
          <div style={{ fontSize:12, color:pMute }}>Room {room.W} × {room.D} × {room.H} mm · {finish}</div>
        </div>
        <div style={{ padding:'16px 28px', borderBottom:`1px solid ${pLine}` }}>
          {bom.map((b,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderTop:i ? `1px solid ${pLine}` : 'none', fontSize:12 }}>
              <span>{b.category} <span style={{ color:pMute, fontSize:10 }}>×{b.qty} {b.unit}</span></span>
              <span style={{ ...pStyles.mono, color:pMute }}>{fmt(b.amount)}</span>
            </div>
          ))}
          <div style={{ marginTop:6, paddingTop:8, borderTop:`1px solid ${pLine}` }}>
            {[['Studio margin', markup], ['GST (18%)', gst]].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:pMute, marginBottom:3 }}>
                <span>{l}</span><span style={pStyles.mono}>{fmt(v)}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, paddingTop:6, borderTop:`2px solid ${pInk}`, fontSize:14, fontWeight:700 }}>
              <span>Total estimate</span><span style={pStyles.mono}>{fmt(total)}</span>
            </div>
          </div>
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
                fontSize:13, fontFamily:'"Inter Tight",sans-serif', color:pInk, background:pBg, outline:'none', boxSizing:'border-box',
              }} />
            </div>
          ))}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:pMute, fontWeight:700, marginBottom:6 }}>Notes</div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Any special requirements…" style={{
              display:'block', width:'100%', padding:'10px 12px', border:`1px solid ${pLine}`, borderRadius:6,
              fontSize:13, fontFamily:'"Inter Tight",sans-serif', color:pInk, background:pBg, outline:'none', resize:'vertical', boxSizing:'border-box',
            }} />
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button disabled={!ok} onClick={() => ok && onSubmit({ customerName:name, customerPhone:phone, customerCity:city, notes })} style={{
              flex:1, ...pStyles.primaryBtn, padding:'13px', borderRadius:8, border:'none',
              opacity:ok?1:0.4, cursor:ok?'pointer':'not-allowed', fontSize:13,
            }}>Submit quote request →</button>
            <button onClick={onClose} style={{ ...pStyles.pillBtn, padding:'13px 16px', borderRadius:8, cursor:'pointer', fontSize:13 }}>Cancel</button>
          </div>
          <div style={{ fontSize:11, color:pMute, marginTop:10, textAlign:'center' }}>Studio designer will contact you within 24 hours.</div>
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
  const [roomItems, setRoomItems] = useS([]);
  const [placedItems, setPlacedItems] = useS([]);

  const handleDrop2D = (data) => {
    const id = `item-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    const color = getCabColor(data.name);
    setPlacedItems(prev => [...prev, { ...data, id, color }]);
    addToRoom({ name: data.name, variant: data.variant, price: data.price });
  };
  const handleItemMove2D = (id, x, y) => {
    setPlacedItems(prev => prev.map(it => it.id === id ? { ...it, x, y } : it));
  };
  const handleItemDelete2D = (id) => {
    setPlacedItems(prev => prev.filter(it => it.id !== id));
  };

  const addToRoom = (item) => {
    setRoomItems(prev => {
      const key = `${item.name}||${item.variant}`;
      const ex = prev.find(r => `${r.name}||${r.variant}` === key);
      if (ex) return prev.map(r => `${r.name}||${r.variant}` === key ? { ...r, qty: r.qty + 1 } : r);
      return [...prev, { ...item, qty: 1 }];
    });
  };
  const removeFromRoom = (name, variant) => {
    setRoomItems(prev => prev.filter(r => !(r.name === name && r.variant === variant)));
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

  const { bom, subtotal, markup, gst, total } = useM(
    () => computeBOM(roomW, roomD, layout, finish),
    [roomW, roomD, layout, finish]
  );

  const handleSave = () => {
    KreoStore.saveDraft({ room: { W:roomW, D:roomD, H:roomH, layout }, finish, hardware, ts: Date.now() });
    setSaveTs(new Date());
  };

  const handleSubmit = customerData => {
    const order = {
      id: KreoStore.nextOrderId(), ts: Date.now(), status: 'new',
      ...customerData,
      room: { W:roomW, D:roomD, H:roomH, layout },
      finish, hardware, roomItems, bom, subtotal, markup, gst, total,
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
        <QuoteModal bom={bom} subtotal={subtotal} markup={markup} gst={gst} total={total}
          room={{ W:roomW, D:roomD, H:roomH }} layout={layout} finish={finish}
          onSubmit={handleSubmit} onClose={() => setShowModal(false)} />
      )}

      {/* Top bar */}
      <div style={pStyles.topbar}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <KreoboxMark size={28} color={accent} />
          <KreoboxWordmark size={16} />
          <div style={{ width:1, height:22, background:pLine }}/>
          <div style={{ fontSize:13 }}>
            <span style={{ color:pMute }}>{layout} kitchen / </span>
            <span style={{ fontWeight:600 }}>{finish}</span>
          </div>
        </div>
        <ViewToggle value={view} onChange={setView} />
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:11, color:pMute, ...pStyles.mono }}>{saveLabel}</span>
          <button onClick={handleSave} style={{ ...pStyles.pillBtn, border:`1px solid ${pLine}`, cursor:'pointer', fontSize:12 }}>Save draft</button>
          <button onClick={() => setShowModal(true)} style={{ ...pStyles.primaryBtn, border:'none', cursor:'pointer', fontSize:12 }}>Request quote →</button>
          <a href="backend.html" style={{
            padding:'8px 14px', borderRadius:8, fontSize:12, fontWeight:600,
            background:'rgba(26,24,21,0.06)', border:`1px solid ${pLine}`,
            color:pMute, textDecoration:'none', display:'flex', alignItems:'center', gap:6,
          }}>Studio <span style={{ opacity:0.5 }}>→</span></a>
        </div>
      </div>

      <div style={pStyles.body}>
        {/* LEFT — Catalog */}
        <CatalogPanel onAdd={addToRoom} />

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
            <span>{view === '3D walk' ? 'Perspective' : view === 'Elevation' ? 'Front elevation' : 'Scale 1:25'}</span>
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
              width:'100%', maxWidth: view === '3D walk' ? 800 : 700,
              aspectRatio: view === '3D walk' ? '620 / 440' : '480 / 380',
              background: view === '3D walk' ? pBg : pPaper,
              borderRadius:12, border:`1px solid ${pLine}`,
              boxShadow:'0 30px 80px -30px rgba(0,0,0,0.18)', overflow:'hidden',
            }}>
              {view === '2D plan'   && <KitchenPlan2D accent={accent} items={placedItems} onDrop={handleDrop2D} onItemMove={handleItemMove2D} onItemDelete={handleItemDelete2D} />}
              {view === 'Elevation' && <KitchenElevation accent={accent} />}
              {view === '3D walk'   && <KitchenPlan3D accent={accent} />}
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

        {/* RIGHT — Cart + BOM + Actions */}
        <div style={{ ...pStyles.panel, width:300, borderLeft:`1px solid ${pLine}`, borderRight:'none' }}>
          {/* Room items (cart) */}
          <div style={{ padding:'14px 18px', borderBottom:`1px solid ${pLine}`, flexShrink:0 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:pMute, fontWeight:600 }}>
                Room items
              </div>
              {roomItems.length > 0 && (
                <span style={{ background:pAccent, color:'#fff', fontSize:9, fontWeight:700, padding:'1px 7px', borderRadius:999 }}>
                  {roomItems.reduce((s,r) => s+r.qty, 0)}
                </span>
              )}
            </div>
            {roomItems.length === 0 ? (
              <div style={{ fontSize:11, color:pMute, textAlign:'center', padding:'14px 0' }}>
                Add items from the catalog →
              </div>
            ) : (
              <div style={{ maxHeight:160, overflowY:'auto' }}>
                {roomItems.map(r => (
                  <div key={`${r.name}||${r.variant}`} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', borderTop:`1px solid ${pLine}`, fontSize:11 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:500, lineHeight:1.3 }}>{r.name}</div>
                      {r.variant && <div style={{ fontSize:10, color:pMute, fontFamily:'JetBrains Mono,monospace' }}>{r.variant}</div>}
                    </div>
                    <span style={{ fontSize:12, color:pMute, fontFamily:'JetBrains Mono,monospace' }}>×{r.qty}</span>
                    <span onClick={() => removeFromRoom(r.name, r.variant)} style={{ cursor:'pointer', color:pMute, fontSize:14, lineHeight:1 }}>×</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:'14px 20px' }}>
            <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:pMute, fontWeight:600, marginBottom:10 }}>Live cost estimate</div>
            {bom.map((b,i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderTop:i?`1px solid ${pLine}`:'none', fontSize:12 }}>
                <div>
                  <div style={{ fontWeight:500 }}>{b.category}</div>
                  <div style={{ fontSize:10, color:pMute, ...pStyles.mono }}>×{b.qty} {b.unit}</div>
                </div>
                <span style={{ ...pStyles.mono, color:pMute, fontSize:11, alignSelf:'center' }}>{fmt(b.amount)}</span>
              </div>
            ))}
            <div style={{ marginTop:8, paddingTop:8, borderTop:`1px solid ${pLine}` }}>
              {[['Studio margin', markup],['GST (18%)', gst]].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:pMute, marginBottom:3 }}>
                  <span>{l}</span><span style={pStyles.mono}>{fmt(v)}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop:`1px solid ${pLine}`, padding:'16px 20px', background:pPaper }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <span style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:pMute, fontWeight:600 }}>Total estimate</span>
              <span style={{ fontSize:11, color:pMute }}>incl. GST</span>
            </div>
            <div style={{ ...pStyles.fraunces, fontSize:30, marginTop:4 }}>{fmt(total)}</div>
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <button onClick={() => setShowModal(true)} style={{ flex:1, ...pStyles.primaryBtn, textAlign:'center', padding:'11px', borderRadius:8, border:'none', cursor:'pointer', fontSize:12 }}>Request quote →</button>
              <button onClick={handleSave} style={{ ...pStyles.pillBtn, padding:'11px 14px', borderRadius:8, cursor:'pointer', fontSize:12 }}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PlannerFrontend, KitchenPlan2D, KitchenPlan3D, KitchenElevation, KreoboxMark, KreoboxWordmark, KreoStore, computeBOM });
