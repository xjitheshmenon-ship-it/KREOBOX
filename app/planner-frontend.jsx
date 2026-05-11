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

/* ── 2D top-down kitchen plan ──────────────────────────────── */
function KitchenPlan2D({ accent = pAccent }) {
  const wallStroke = '#1a1815', cabFill = '#e8e2d5', cabStroke = '#a99a82', dimColor = pMute;
  return (
    <svg viewBox="0 0 480 380" style={{ width:'100%', height:'100%', display:'block' }}>
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(26,24,21,0.06)" strokeWidth="1"/>
        </pattern>
        <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M100 0 L0 0 0 100" fill="none" stroke="rgba(26,24,21,0.12)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect x="40" y="40" width="400" height="300" fill="url(#grid)"/>
      <rect x="40" y="40" width="400" height="300" fill="url(#grid-major)"/>
      <path d="M40 340 L40 40 L440 40" fill="none" stroke={wallStroke} strokeWidth="6" strokeLinejoin="round"/>
      <path d="M440 40 L440 140" fill="none" stroke={wallStroke} strokeWidth="6" strokeLinecap="round"/>
      <path d="M40 340 L160 340" fill="none" stroke={wallStroke} strokeWidth="6" strokeLinecap="round"/>
      <rect x="44" y="44" width="392" height="292" fill="rgba(232,226,213,0.25)"/>
      <g>
        <rect x="48" y="48" width="380" height="40" fill="rgba(201,100,66,0.05)" stroke={cabStroke} strokeWidth="1" strokeDasharray="3 3"/>
        <text x="238" y="73" fill={dimColor} fontSize="10" fontFamily="JetBrains Mono,monospace" textAnchor="middle">WALL CABINETS — 3.8m</text>
      </g>
      <g>
        <rect x="48" y="92" width="100" height="60" fill={cabFill} stroke={cabStroke} strokeWidth="2"/>
        <line x1="98" y1="92" x2="98" y2="152" stroke={cabStroke} strokeWidth="1"/>
        <text x="98" y="128" fill={pInk} fontSize="9" fontFamily="JetBrains Mono,monospace" textAnchor="middle" opacity="0.55">DRAWER · 1000</text>
      </g>
      <g>
        <rect x="148" y="92" width="120" height="60" fill={cabFill} stroke={cabStroke} strokeWidth="2"/>
        <rect x="160" y="100" width="96" height="44" fill="#d9d2c3" stroke={cabStroke} strokeWidth="1" rx="3"/>
        <circle cx="208" cy="122" r="3" fill={cabStroke}/>
        <text x="208" y="170" fill={pInk} fontSize="9" fontFamily="JetBrains Mono,monospace" textAnchor="middle" opacity="0.55">SINK · 1200</text>
      </g>
      <g>
        <rect x="268" y="92" width="100" height="60" fill={cabFill} stroke={cabStroke} strokeWidth="2"/>
        <rect x="278" y="100" width="80" height="44" fill="#1a1815" rx="2"/>
        <circle cx="294" cy="115" r="5" fill="#3a352e"/>
        <circle cx="320" cy="115" r="5" fill="#3a352e"/>
        <circle cx="294" cy="135" r="5" fill="#3a352e"/>
        <circle cx="320" cy="135" r="5" fill="#3a352e"/>
        <text x="318" y="170" fill={pInk} fontSize="9" fontFamily="JetBrains Mono,monospace" textAnchor="middle" opacity="0.55">HOB · 900</text>
      </g>
      <g>
        <rect x="368" y="92" width="60" height="60" fill={cabFill} stroke={accent} strokeWidth="3"/>
        <line x1="368" y1="122" x2="428" y2="122" stroke={accent} strokeWidth="1"/>
        <text x="398" y="128" fill={pInk} fontSize="9" fontFamily="JetBrains Mono,monospace" textAnchor="middle" opacity="0.7">TALL · 600</text>
      </g>
      <g>
        <rect x="48" y="152" width="60" height="100" fill={cabFill} stroke={cabStroke} strokeWidth="2"/>
        <text x="78" y="208" fill={pInk} fontSize="9" fontFamily="JetBrains Mono,monospace" textAnchor="middle" opacity="0.55">FRIDGE</text>
        <rect x="48" y="252" width="60" height="80" fill={cabFill} stroke={cabStroke} strokeWidth="2"/>
        <text x="78" y="298" fill={pInk} fontSize="9" fontFamily="JetBrains Mono,monospace" textAnchor="middle" opacity="0.55">DRAWER</text>
      </g>
      <g>
        <rect x="180" y="220" width="220" height="80" fill="#0e0d0b" stroke="#0e0d0b" strokeWidth="2" rx="2"/>
        <rect x="190" y="230" width="200" height="60" fill="#1f1c19" rx="1"/>
        <text x="290" y="265" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="JetBrains Mono,monospace" textAnchor="middle">ISLAND · 2.2m × 0.8m</text>
        <text x="290" y="280" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="JetBrains Mono,monospace" textAnchor="middle">QUARTZ · BREAKFAST BAR</text>
      </g>
      <g fill={dimColor} fontSize="10" fontFamily="JetBrains Mono,monospace">
        <line x1="48" y1="32" x2="428" y2="32" stroke={dimColor} strokeWidth="1"/>
        <line x1="48" y1="28" x2="48" y2="36" stroke={dimColor} strokeWidth="1"/>
        <line x1="428" y1="28" x2="428" y2="36" stroke={dimColor} strokeWidth="1"/>
        <text x="238" y="24" textAnchor="middle">3,800 mm</text>
        <line x1="32" y1="48" x2="32" y2="332" stroke={dimColor} strokeWidth="1"/>
        <line x1="28" y1="48" x2="36" y2="48" stroke={dimColor} strokeWidth="1"/>
        <line x1="28" y1="332" x2="36" y2="332" stroke={dimColor} strokeWidth="1"/>
        <text x="20" y="190" textAnchor="middle" transform="rotate(-90,20,190)">2,840 mm</text>
      </g>
      <g>
        <line x1="398" y1="92" x2="398" y2="62" stroke={accent} strokeWidth="1" strokeDasharray="3 2"/>
        <rect x="346" y="42" width="100" height="20" fill={pPaper} stroke={accent} strokeWidth="1" rx="3"/>
        <text x="396" y="55" fill={accent} fontSize="10" fontFamily="JetBrains Mono,monospace" textAnchor="middle" fontWeight="600">PANTRY 600 × 2400</text>
      </g>
    </svg>
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
  const p = SVG_W * 0.25;
  const [yaw, setYaw]     = useS(-30);
  const [pitch, setPitch] = useS(30);
  const drag = useRef(null);

  const project = useCB((wx, wy, wz) => {
    const tx = wx - RW/2, ty = wy - RH*0.3, tz = wz - RD/2;
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
      'For corner','For sink','For hob','For hob & oven','For dishwasher',
      'With drawers','With door','With door & drawer','With pull-out',
      'With wire basket','Open cabinets','Other','Filler pieces & cover panels',
    ],
  },
  {
    title: 'Wall cabinets',
    code: 'KBX-WC',
    items: [
      'With door','With glass doors','Horizontal cabinets','For corner',
      'For extractor hood','For microwave oven','For dish drainer',
      'Top cabinets','Open cabinets','Other','Filler pieces & cover panels',
    ],
  },
  {
    title: 'High cabinets',
    code: 'KBX-HC',
    items: [
      'For fridge & freezer','For oven','For microwave oven','For combi oven',
      'For oven & microwave oven','For oven & combi oven',
      'For microwave / combi oven','For microwave / combi / steam oven',
      'With door & drawer','With door','With cleaning interior',
      'High cabinets with pullout','Filler pieces & cover panels',
    ],
  },
];

const APPLIANCE_SECTIONS = [
  {
    title: 'Integrated in cabinet',
    code: 'KBX-AI',
    items: [
      'Fridge & freezer','Hob','Oven','Hob & oven','Microwave oven',
      'Combi oven','Oven & microwave oven','Oven & combi oven',
      'Microwave / combi oven','Microwave / combi / steam oven',
      'Choose your hood','Dishwasher',
    ],
  },
  {
    title: 'Freestanding',
    code: 'KBX-AF',
    items: [
      'Fridge & freezer','Hob','Choose your hood','Use your own',
    ],
  },
];

const DINING_SECTIONS = [
  {
    title: 'Tables',
    code: 'KBX-DT',
    items: ['Dining tables','Extendable tables','Bar tables','Corner benches'],
  },
  {
    title: 'Seating',
    code: 'KBX-DS',
    items: ['Dining chairs','Bar stools','Benches','Chair pads'],
  },
];

const EXTRAS_SECTIONS = [
  {
    title: 'Organisation',
    code: 'KBX-OR',
    items: [
      'Drawer organisers','Pull-out shelves','Waste sorting',
      'Spice racks','Knife blocks','Hooks & rails',
    ],
  },
  {
    title: 'Lighting',
    code: 'KBX-LT',
    items: ['Under-cabinet lighting','Ceiling spotlights','Pendant lights','LED strips'],
  },
  {
    title: 'Worktops & sinks',
    code: 'KBX-WS',
    items: ['Quartz worktops','Laminate worktops','Stainless sinks','Composite sinks','Taps'],
  },
];

/* ── Catalog panel ─────────────────────────────────────────── */
function CatalogPanel() {
  const { useState: useS } = React;
  const [activeTab, setActiveTab] = useS('cabinets');
  const [search, setSearch]       = useS('');

  let sections = [];
  if (activeTab === 'cabinets')   sections = CABINET_SECTIONS;
  if (activeTab === 'appliances') sections = APPLIANCE_SECTIONS;
  if (activeTab === 'dining')     sections = DINING_SECTIONS;
  if (activeTab === 'extras')     sections = EXTRAS_SECTIONS;

  const filtered = sections.map(sec => ({
    ...sec,
    items: search
      ? sec.items.filter(it => it.toLowerCase().includes(search.toLowerCase()))
      : sec.items,
  })).filter(sec => sec.items.length > 0);

  return (
    <div style={{ ...pStyles.panel, width:300, flexShrink:0 }}>
      {/* Tab bar */}
      <div style={{
        display:'flex', overflowX:'auto', borderBottom:`1px solid ${pLine}`,
        scrollbarWidth:'none', flexShrink:0,
      }}>
        {CATALOG_TABS.map(tab => {
          const active = tab.id === activeTab;
          return (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearch(''); }} style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:4,
              padding:'10px 12px', border:'none', background:'transparent', cursor:'pointer',
              borderBottom: active ? `2px solid ${pAccent}` : '2px solid transparent',
              color: active ? pAccent : pMute,
              fontSize:9, fontWeight:700, fontFamily:'JetBrains Mono,monospace',
              letterSpacing:'0.08em', textTransform:'uppercase', whiteSpace:'nowrap',
              flexShrink:0,
            }}>
              <span style={{ fontSize:16 }}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search */}
      {activeTab !== 'search' ? (
        <div style={{ padding:'10px 14px', borderBottom:`1px solid ${pLine}`, flexShrink:0 }}>
          <div style={{
            display:'flex', alignItems:'center', gap:8, padding:'8px 12px',
            background:'rgba(26,24,21,0.04)', borderRadius:8, fontSize:12, color:pMute,
          }}>
            <span>⌕</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}…`}
              style={{ border:'none', background:'transparent', outline:'none', flex:1, fontSize:12, color:pInk, fontFamily:'"Inter Tight",sans-serif' }}
            />
            {search && (
              <span onClick={() => setSearch('')} style={{ cursor:'pointer', fontSize:14, lineHeight:1 }}>×</span>
            )}
          </div>
        </div>
      ) : (
        <div style={{ padding:'10px 14px', borderBottom:`1px solid ${pLine}`, flexShrink:0 }}>
          <div style={{
            display:'flex', alignItems:'center', gap:8, padding:'8px 12px',
            background:'rgba(26,24,21,0.04)', borderRadius:8, fontSize:12, color:pMute,
          }}>
            <span>⌕</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search all 1,240 items…"
              style={{ border:'none', background:'transparent', outline:'none', flex:1, fontSize:12, color:pInk, fontFamily:'"Inter Tight",sans-serif' }}
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Sections + items */}
      <div style={{ flex:1, overflowY:'auto', padding:'6px 0' }}>
        {filtered.length === 0 && (
          <div style={{ padding:'24px 20px', fontSize:12, color:pMute, textAlign:'center' }}>
            No results for "{search}"
          </div>
        )}
        {filtered.map(sec => (
          <div key={sec.title} style={{ marginBottom:4 }}>
            <div style={{
              padding:'10px 20px 6px',
              fontSize:10, fontWeight:700, letterSpacing:'0.18em',
              textTransform:'uppercase', color:pMute,
              fontFamily:'JetBrains Mono,monospace',
            }}>
              {sec.title}
              <span style={{ marginLeft:8, fontSize:9, opacity:0.7 }}>{sec.code}</span>
            </div>
            {sec.items.map(item => (
              <div key={item} style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'9px 20px', cursor:'grab', fontSize:13,
                borderLeft:'2px solid transparent',
                transition:'background 0.1s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(26,24,21,0.04)'; e.currentTarget.style.borderLeftColor=pAccent; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderLeftColor='transparent'; }}
              >
                <div style={{
                  width:36, height:36, borderRadius:6, background:'#e8e2d5',
                  border:`1px solid ${pLine}`, flexShrink:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:8, fontFamily:'JetBrains Mono,monospace', color:pMute,
                }}>▦</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:500, lineHeight:1.3 }}>{item}</div>
                </div>
                <span style={{ fontSize:12, color:pMute, flexShrink:0 }}>+</span>
              </div>
            ))}
          </div>
        ))}

        {/* Finishes section (always shown at bottom of cabinets) */}
        {activeTab === 'cabinets' && !search && (
          <div style={{ padding:'14px 20px', borderTop:`1px solid ${pLine}`, marginTop:8 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:pMute, fontFamily:'JetBrains Mono,monospace', marginBottom:10 }}>
              Finishes
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {[
                { tone:['#d4ccbe','#b8a995'], label:'Bali oak' },
                { tone:['#3a352e','#1a1815'], label:'Espresso' },
                { tone:['#fafaf7','#dcd8d0'], label:'Bone matte' },
                { tone:['#c8bfa8','#b0a68e'], label:'Sand grey' },
                { tone:['#b8b0a0','#a09880'], label:'Linen white' },
                { tone:['#8c7660','#6e5c48'], label:'Smoked teak' },
              ].map(sw => (
                <div key={sw.label}>
                  <div style={{
                    height:44, borderRadius:6, marginBottom:5, border:`1px solid ${pLine}`,
                    backgroundImage:`linear-gradient(45deg,rgba(255,255,255,0.18) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.18) 50%,rgba(255,255,255,0.18) 75%,transparent 75%),linear-gradient(135deg,${sw.tone[0]},${sw.tone[1]})`,
                    backgroundSize:'10px 10px,100% 100%', cursor:'pointer',
                  }}/>
                  <div style={{ fontSize:10, fontWeight:500, color:pInk }}>{sw.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── FRONTEND PLANNER (client) ─────────────────────────────── */
function PlannerFrontend({ accent = pAccent }) {
  const { useState: useS } = React;
  const [view, setView] = useS('2D plan');

  return (
    <div style={pStyles.shell}>
      {/* Top bar */}
      <div style={pStyles.topbar}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <KreoboxMark size={28} color={accent} />
          <KreoboxWordmark size={16} />
          <div style={{ width:1, height:22, background:pLine }}/>
          <div style={{ fontSize:13 }}>
            <span style={{ color:pMute }}>Whitefield · 3BHK / </span>
            <span style={{ fontWeight:600 }}>Kitchen plan</span>
          </div>
        </div>
        <ViewToggle value={view} onChange={setView} />
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:11, color:pMute, ...pStyles.mono }}>Saved · 2 min ago</span>
          <span style={pStyles.pillBtn}>Share</span>
          <span style={pStyles.primaryBtn}>Send to Reema →</span>
        </div>
      </div>

      <div style={pStyles.body}>
        {/* LEFT — Catalog */}
        <CatalogPanel />

        {/* CENTER — Viewport */}
        <div style={{ flex:1, position:'relative', background:pBg, display:'flex', flexDirection:'column', minWidth:0 }}>
          <div style={{
            position:'absolute', top:16, left:16, zIndex:2,
            background:pPaper, border:`1px solid ${pLine}`, borderRadius:8,
            padding:'6px 10px', display:'flex', gap:8, alignItems:'center',
            fontSize:11, ...pStyles.mono, color:pMute,
          }}>
            <span>L-shape · 3.8 × 2.84 m</span>
            <span style={{ width:1, height:12, background:pLine }}/>
            <span>{view === '3D walk' ? 'Perspective view' : view === 'Elevation' ? 'Front elevation' : 'Scale 1:25'}</span>
          </div>
          {view !== '3D walk' && (
            <div style={{ position:'absolute', top:16, right:16, zIndex:2, display:'flex', flexDirection:'column', gap:6 }}>
              {['＋','−','⌖','↺'].map(s => (
                <span key={s} style={{ width:32, height:32, borderRadius:8, background:pPaper, border:`1px solid ${pLine}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:600, cursor:'pointer' }}>{s}</span>
              ))}
            </div>
          )}
          <div style={{ flex:1, padding:24, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{
              width:'100%', maxWidth: view === '3D walk' ? 800 : 700,
              aspectRatio: view === '3D walk' ? '620 / 440' : '480 / 380',
              background: view === '3D walk' ? pBg : pPaper,
              borderRadius:12, border:`1px solid ${pLine}`,
              boxShadow:'0 30px 80px -30px rgba(0,0,0,0.18)', overflow:'hidden',
            }}>
              {view === '2D plan'   && <KitchenPlan2D accent={accent} />}
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

        {/* RIGHT — Selected / BOM */}
        <div style={{ ...pStyles.panel, width:300, borderLeft:`1px solid ${pLine}`, borderRight:'none' }}>
          <div style={{ padding:'20px 20px 14px', borderBottom:`1px solid ${pLine}` }}>
            <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:pMute, fontWeight:600 }}>Selected</div>
            <div style={{ ...pStyles.fraunces, fontSize:22, marginTop:4, letterSpacing:'-0.01em' }}>Pantry pull-out</div>
            <div style={{ fontSize:11, color:pMute, ...pStyles.mono, marginTop:4 }}>KBX-HC-PP · 600 × 2400 × 600 mm</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
              {[['Width','600 mm'],['Height','2,400 mm'],['Finish','Bali oak'],['Hardware','Push-to-open']].map(([k,v]) => (
                <div key={k}>
                  <div style={{ fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:pMute, fontWeight:600 }}>{k}</div>
                  <div style={{ fontSize:13, fontWeight:600, marginTop:2 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:16, padding:'10px 12px', background:'rgba(26,24,21,0.04)', borderRadius:8 }}>
              <div style={{ fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:pMute, fontWeight:600 }}>Provenance</div>
              <div style={{ fontSize:12, marginTop:4, lineHeight:1.4 }}>Carcass HDF, FSC-certified. Laminate by Greenlam, Hosur. 7-year warranty.</div>
            </div>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'14px 20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:pMute, fontWeight:600 }}>Live cost · 14 items</div>
              <span style={{ fontSize:11, color:accent, fontWeight:600, cursor:'pointer' }}>Full BOM →</span>
            </div>
            {[
              { n:'Base cabinets · 4',    a:'₹ 1,12,400' },
              { n:'High cabinets · 2',    a:'₹ 1,02,800' },
              { n:'Wall cabinets · 5',    a:'₹ 86,500'   },
              { n:'Quartz worktop · 5.4 m',a:'₹ 1,89,000'},
              { n:'Appliances',           a:'₹ 58,400'   },
              { n:'Hardware & lighting',  a:'₹ 47,200'   },
            ].map((b,i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderTop: i ? `1px solid ${pLine}` : 'none', fontSize:12 }}>
                <span>{b.n}</span>
                <span style={{ ...pStyles.mono, color:pMute }}>{b.a}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${pLine}`, padding:'16px 20px', background:pPaper }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <span style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:pMute, fontWeight:600 }}>Total estimate</span>
              <span style={{ fontSize:11, color:pMute }}>incl. install</span>
            </div>
            <div style={{ ...pStyles.fraunces, fontSize:32, marginTop:4 }}>₹ 5,96,300</div>
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <span style={{ flex:1, ...pStyles.primaryBtn, textAlign:'center', padding:'11px', borderRadius:8 }}>Request quote</span>
              <span style={{ ...pStyles.pillBtn, padding:'11px 14px' }}>Save</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PlannerFrontend, KitchenPlan2D, KitchenPlan3D, KitchenElevation, KreoboxMark, KreoboxWordmark });
