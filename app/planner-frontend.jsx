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
  const p = SVG_W * 0.65;
  const [yaw, setYaw]     = useS(-30);
  const [pitch, setPitch] = useS(18);
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
      ? sec.items.filter(it => {
          const n = typeof it === 'string' ? it : it.name;
          return n.toLowerCase().includes(search.toLowerCase());
        })
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
            {sec.items.map(item => {
              const name = typeof item === 'string' ? item : item.name;
              const variants = typeof item === 'object' && item.variants ? item.variants : [];
              const price = typeof item === 'object' && item.price ? item.price : '';
              return (
                <div key={name} style={{ padding:'8px 20px 10px', borderLeft:'2px solid transparent', transition:'background 0.1s', cursor:'default' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(26,24,21,0.04)'; e.currentTarget.style.borderLeftColor=pAccent; }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderLeftColor='transparent'; }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{
                      width:34, height:34, borderRadius:6, background:'#e8e2d5',
                      border:`1px solid ${pLine}`, flexShrink:0,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:14, color:pMute,
                    }}>▦</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:500, fontSize:13, lineHeight:1.3 }}>{name}</div>
                      {price && <div style={{ fontSize:10, color:pMute, fontFamily:'JetBrains Mono,monospace', marginTop:1 }}>{price}</div>}
                    </div>
                  </div>
                  {variants.length > 0 && (
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:7, paddingLeft:44 }}>
                      {variants.map(v => (
                        <span key={v} onClick={e => { e.stopPropagation(); }}
                          style={{
                            padding:'3px 8px', borderRadius:4, fontSize:10, fontWeight:600,
                            fontFamily:'JetBrains Mono,monospace', cursor:'pointer',
                            border:`1px solid ${pLine}`, background:'rgba(26,24,21,0.04)',
                            color:pMute, transition:'all 0.1s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor=pAccent; e.currentTarget.style.color=pAccent; e.currentTarget.style.background='rgba(201,100,66,0.06)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor=pLine; e.currentTarget.style.color=pMute; e.currentTarget.style.background='rgba(26,24,21,0.04)'; }}
                        >{v}</span>
                      ))}
                      <span style={{
                        padding:'3px 8px', borderRadius:4, fontSize:10, fontWeight:700,
                        cursor:'pointer', border:`1px solid ${pLine}`,
                        background:pAccent, color:'#fff',
                      }}>+ Add</span>
                    </div>
                  )}
                </div>
              );
            })}
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
      finish, hardware, bom, subtotal, markup, gst, total,
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
        </div>
      </div>

      <div style={pStyles.body}>
        {/* LEFT — Catalog */}
        <CatalogPanel />

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

        {/* RIGHT — BOM + Actions */}
        <div style={{ ...pStyles.panel, width:300, borderLeft:`1px solid ${pLine}`, borderRight:'none' }}>
          <div style={{ padding:'20px 20px 14px', borderBottom:`1px solid ${pLine}` }}>
            <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:pMute, fontWeight:600 }}>Selected item</div>
            <div style={{ ...pStyles.fraunces, fontSize:20, marginTop:4 }}>Pantry pull-out</div>
            <div style={{ fontSize:11, color:pMute, ...pStyles.mono, marginTop:2 }}>KBX-HC-PP · 600 × 2400 × 600 mm</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:14 }}>
              {[['Width','600 mm'],['Height','2,400 mm'],['Finish', finish],['Hardware', hardware]].map(([k,v]) => (
                <div key={k}>
                  <div style={{ fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:pMute, fontWeight:600 }}>{k}</div>
                  <div style={{ fontSize:13, fontWeight:600, marginTop:2 }}>{v}</div>
                </div>
              ))}
            </div>
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
