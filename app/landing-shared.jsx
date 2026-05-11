/* ============================================================
   KREOBOX · Landing page · shared chrome & primitives
   Used by catalog / workshop / showroom variants.
   ============================================================ */

const lInk    = '#1a1815';
const lPaper  = '#fafaf7';
const lBg     = '#f0eee9';
const lMute   = 'rgba(26,24,21,0.55)';
const lSoft   = 'rgba(26,24,21,0.72)';
const lLine   = 'rgba(26,24,21,0.10)';
const lLine2  = 'rgba(26,24,21,0.18)';
const lAccent = '#c96442';

const lBlue   = '#5b8def';
const lOrange = '#c96442';
const lPurple = '#7c5cff';
const lGreen  = '#1f8a5b';
const lWood   = '#a99a82';
const lWoodFill = '#e8e2d5';

const lMono = { fontFamily: 'JetBrains Mono, monospace' };
const lFr   = { fontFamily: '"Fraunces", Georgia, serif' };
const lSans = { fontFamily: '"Inter Tight", -apple-system, sans-serif' };

/* ── KreoMark — box/crate logo mark ──────────────────────── */
function KreoMark({ size = 22, ink = lAccent }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M10 32 H90 V90 Q90 97 83 97 H17 Q10 97 10 90 Z
           M24 46 H76 V82 H24 Z"
        fill={ink} />
      <rect x="11" y="10" width="80" height="17" rx="3"
        transform="rotate(-7 51 18)"
        fill={ink} fillOpacity="0.72" />
    </svg>
  );
}

/* ── Eyebrow ──────────────────────────────────────────────── */
function Eyebrow({ children, color, style }) {
  return (
    <div style={{
      ...lMono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
      color: color || lMute, fontWeight: 700, ...style,
    }}>{children}</div>
  );
}

/* ── Nav ──────────────────────────────────────────────────── */
function LandingNav({ variant = 'catalog', tablet = false }) {
  const items = ['Catalogue', 'Studio', 'Materials', 'Contractors', 'Showrooms'];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: tablet ? '18px 28px' : '22px 48px',
      borderBottom: `1px solid ${lLine}`, background: lBg,
      position: 'sticky', top: 0, zIndex: 5,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <KreoMark size={tablet ? 20 : 22} />
        <div style={{ ...lFr, fontSize: tablet ? 18 : 20, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Kreobox</div>
        <div style={{ ...lMono, fontSize: 10, color: lMute, marginLeft: 8, paddingLeft: 12, borderLeft: `1px solid ${lLine}` }}>
          {variant === 'catalog' ? 'Catalogue No. 02 · Spring \u201926' : variant === 'workshop' ? 'studio · v2.6' : 'showroom · in residence'}
        </div>
      </div>
      {!tablet && (
        <div style={{ display: 'flex', gap: 26, ...lSans, fontSize: 13, color: lSoft }}>
          {items.map(i => (
            <span key={i} style={{ cursor: 'pointer' }}>{i}</span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: tablet ? 10 : 14 }}>
        <span style={{ ...lSans, fontSize: 13, color: lSoft, cursor: 'pointer' }}>Sign in</span>
        <a href="planner.html" style={{
          textDecoration: 'none', color: lPaper, background: lInk,
          ...lSans, fontWeight: 600, fontSize: 13,
          padding: '9px 16px', borderRadius: 2, display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          Open the Planner
          <span style={{ ...lMono, fontSize: 10, opacity: 0.7 }}>↗</span>
        </a>
      </div>
    </div>
  );
}

/* ── Audience toggle ─────────────────────────────────────── */
function AudienceToggle({ value = 'contractor', onChange, style = {}, dense = false }) {
  const opts = [
    { id: 'contractor', label: 'Contractor' },
    { id: 'studio',     label: 'Studio' },
    { id: 'customer',   label: 'Homeowner' },
  ];
  return (
    <div style={{
      display: 'inline-flex', border: `1px solid ${lLine2}`, borderRadius: 2,
      background: lPaper, ...style,
    }}>
      {opts.map(o => {
        const active = o.id === value;
        return (
          <div key={o.id} onClick={() => onChange && onChange(o.id)} style={{
            ...lMono, fontSize: dense ? 10 : 11, letterSpacing: '0.05em',
            padding: dense ? '5px 10px' : '7px 14px', cursor: 'pointer',
            background: active ? lInk : 'transparent',
            color: active ? lPaper : lSoft,
          }}>
            {o.label.toLowerCase()}
          </div>
        );
      })}
    </div>
  );
}

/* ── Tiny module-key chip ─────────────────────────────────── */
function KeyChip({ c, label, dense }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...lMono, fontSize: dense ? 9 : 10, color: lMute }}>
      <span style={{
        width: 9, height: 9, background: c + '55', border: `1px solid ${c}`, display: 'inline-block',
      }}></span>
      {label}
    </span>
  );
}

/* ── MiniPlate — tiny SVG blueprint per family ──────────── */
function MiniPlate({ family, w = 200, h = 140, imagery = 'blueprint' }) {
  if (imagery === 'photoreal') return <PhotoSlot family={family} w={w} h={h} />;
  if (imagery === 'perspective') return <PerspectiveSlot family={family} w={w} h={h} />;
  return <BlueprintPlate family={family} w={w} h={h} />;
}

function BlueprintPlate({ family, w, h }) {
  const id = 'mg-' + Math.random().toString(36).slice(2, 7);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: 'block', background: lPaper }}>
      <defs>
        <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M12 0 L0 0 0 12" fill="none" stroke="rgba(26,24,21,0.07)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="8" y="8" width={w - 16} height={h - 16} fill={`url(#${id})`} />
      {family === 'wardrobe' && (
        <g>
          <rect x={w*0.18} y={h*0.18} width={w*0.64} height={h*0.62} fill="none" stroke={lInk} strokeWidth="1.6" />
          <line x1={w*0.5} y1={h*0.18} x2={w*0.5} y2={h*0.8} stroke={lInk} strokeWidth="1" />
          <rect x={w*0.2} y={h*0.22} width={w*0.28} height={h*0.32} fill="rgba(91,141,239,0.18)" stroke={lBlue} strokeWidth="1" />
          <line x1={w*0.22} y1={h*0.27} x2={w*0.46} y2={h*0.27} stroke={lBlue} />
          <rect x={w*0.52} y={h*0.22} width={w*0.28} height={h*0.32} fill="rgba(91,141,239,0.18)" stroke={lBlue} strokeWidth="1" />
          <line x1={w*0.54} y1={h*0.27} x2={w*0.78} y2={h*0.27} stroke={lBlue} />
          <rect x={w*0.2} y={h*0.56} width={w*0.28} height={h*0.1} fill="rgba(201,100,66,0.22)" stroke={lOrange} />
          <rect x={w*0.2} y={h*0.68} width={w*0.28} height={h*0.1} fill="rgba(201,100,66,0.22)" stroke={lOrange} />
          <rect x={w*0.52} y={h*0.56} width={w*0.28} height={h*0.22} fill={lWoodFill} stroke={lWood} />
          <line x1={w*0.18} y1={h*0.82} x2={w*0.82} y2={h*0.82} stroke={lInk} strokeWidth="2" />
        </g>
      )}
      {family === 'cabinet' && (
        <g>
          {/* base run with appliance */}
          <rect x={w*0.1} y={h*0.45} width={w*0.8} height={h*0.32} fill="none" stroke={lInk} strokeWidth="1.6" />
          <rect x={w*0.12} y={h*0.47} width={w*0.18} height={h*0.28} fill={lWoodFill} stroke={lWood} />
          <rect x={w*0.31} y={h*0.47} width={w*0.18} height={h*0.08} fill="rgba(201,100,66,0.22)" stroke={lOrange} />
          <rect x={w*0.31} y={h*0.56} width={w*0.18} height={h*0.19} fill={lWoodFill} stroke={lWood} />
          <rect x={w*0.5} y={h*0.47} width={w*0.18} height={h*0.28} fill="rgba(31,138,91,0.22)" stroke={lGreen} />
          <rect x={w*0.69} y={h*0.47} width={w*0.2} height={h*0.28} fill={lWoodFill} stroke={lWood} />
          {/* wall cabs */}
          <rect x={w*0.1} y={h*0.18} width={w*0.36} height={h*0.18} fill="rgba(91,141,239,0.18)" stroke={lBlue} strokeWidth="1.4" />
          <rect x={w*0.54} y={h*0.18} width={w*0.36} height={h*0.18} fill="rgba(91,141,239,0.18)" stroke={lBlue} strokeWidth="1.4" />
          <line x1={w*0.08} y1={h*0.79} x2={w*0.92} y2={h*0.79} stroke={lInk} strokeWidth="2" />
        </g>
      )}
      {family === 'desk' && (
        <g>
          {/* top-down + elevation hint of a desk */}
          <rect x={w*0.15} y={h*0.35} width={w*0.7} height={h*0.08} fill={lWoodFill} stroke={lInk} strokeWidth="1.6" />
          <rect x={w*0.18} y={h*0.43} width={w*0.22} height={h*0.32} fill="none" stroke={lInk} strokeWidth="1.4" />
          <rect x={w*0.18} y={h*0.45} width={w*0.22} height={h*0.07} fill="rgba(201,100,66,0.22)" stroke={lOrange} />
          <rect x={w*0.18} y={h*0.53} width={w*0.22} height={h*0.1} fill="rgba(201,100,66,0.22)" stroke={lOrange} />
          <rect x={w*0.18} y={h*0.64} width={w*0.22} height={h*0.11} fill={lWoodFill} stroke={lWood} />
          {/* monitor + chair hint */}
          <rect x={w*0.55} y={h*0.18} width={w*0.18} height={h*0.13} fill="rgba(26,24,21,0.08)" stroke={lInk} strokeWidth="1.2" />
          <line x1={w*0.64} y1={h*0.31} x2={w*0.64} y2={h*0.35} stroke={lInk} />
          <line x1={w*0.4} y1={h*0.43} x2={w*0.4} y2={h*0.85} stroke={lInk} strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1={w*0.15} y1={h*0.86} x2={w*0.85} y2={h*0.86} stroke={lInk} strokeWidth="2" />
        </g>
      )}
      {family === 'storage' && (
        <g>
          {/* library shelf */}
          <rect x={w*0.15} y={h*0.15} width={w*0.7} height={h*0.65} fill="none" stroke={lInk} strokeWidth="1.6" />
          {[0,1,2,3].map(i => (
            <line key={i} x1={w*0.15} y1={h*0.15 + (h*0.65/4)*(i+1)} x2={w*0.85} y2={h*0.15 + (h*0.65/4)*(i+1)} stroke={lInk} strokeWidth="1" />
          ))}
          {/* books / boxes */}
          {[0,1,2,3].map(row => (
            <g key={row}>
              <rect x={w*0.17 + (row%2)*4} y={h*0.16 + (h*0.65/4)*row + 2} width={w*0.08} height={h*0.65/4 - 4} fill="rgba(91,141,239,0.2)" stroke={lBlue} />
              <rect x={w*0.27} y={h*0.16 + (h*0.65/4)*row + 4} width={w*0.06} height={h*0.65/4 - 6} fill={lWoodFill} stroke={lWood} />
              <rect x={w*0.36} y={h*0.16 + (h*0.65/4)*row + 3} width={w*0.1} height={h*0.65/4 - 5} fill="rgba(124,92,255,0.22)" stroke={lPurple} />
              <rect x={w*0.5} y={h*0.16 + (h*0.65/4)*row + 5} width={w*0.07} height={h*0.65/4 - 7} fill={lWoodFill} stroke={lWood} />
              <rect x={w*0.6} y={h*0.16 + (h*0.65/4)*row + 2} width={w*0.13} height={h*0.65/4 - 4} fill="rgba(201,100,66,0.22)" stroke={lOrange} />
              <rect x={w*0.76} y={h*0.16 + (h*0.65/4)*row + 4} width={w*0.07} height={h*0.65/4 - 6} fill={lWoodFill} stroke={lWood} />
            </g>
          ))}
          <line x1={w*0.13} y1={h*0.82} x2={w*0.87} y2={h*0.82} stroke={lInk} strokeWidth="2" />
        </g>
      )}
    </svg>
  );
}

function PhotoSlot({ family, w, h }) {
  // Striped placeholder w/ monospace explainer; user can replace with image
  const labels = { wardrobe: 'wardrobe shot', cabinet: 'kitchen shot', desk: 'desk shot', storage: 'storage shot' };
  return (
    <div style={{
      width: w, height: h, background: lPaper,
      backgroundImage: `repeating-linear-gradient(135deg, ${lLine} 0 1px, transparent 1px 12px)`,
      border: `1px solid ${lLine}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...lMono, fontSize: 10, color: lMute, letterSpacing: '0.1em',
    }}>
      [ {labels[family]} ]
    </div>
  );
}

function PerspectiveSlot({ family, w, h }) {
  // axonometric hint: 30deg box with the family hint
  const id = 'pg-' + Math.random().toString(36).slice(2, 7);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ background: lPaper, display: 'block' }}>
      <defs>
        <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M12 0 L0 0 0 12" fill="none" stroke="rgba(26,24,21,0.05)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={w} height={h} fill={`url(#${id})`} />
      {/* axonometric box */}
      <polygon points={`${w*0.2},${h*0.7} ${w*0.55},${h*0.85} ${w*0.85},${h*0.65} ${w*0.5},${h*0.5}`} fill={lWoodFill} stroke={lInk} strokeWidth="1.4" />
      <polygon points={`${w*0.5},${h*0.5} ${w*0.85},${h*0.65} ${w*0.85},${h*0.3} ${w*0.5},${h*0.15}`} fill={lPaper} stroke={lInk} strokeWidth="1.4" />
      <polygon points={`${w*0.5},${h*0.5} ${w*0.5},${h*0.15} ${w*0.2},${h*0.35} ${w*0.2},${h*0.7}`} fill="rgba(91,141,239,0.18)" stroke={lInk} strokeWidth="1.4" />
      <text x={w*0.5} y={h*0.92} textAnchor="middle" fill={lMute} {...lMono} fontSize="9">3/4 perspective · {family}</text>
    </svg>
  );
}

/* ── SwatchGrid — materials & finishes ──────────────────── */
const MATERIALS = [
  { name: 'Bali oak',       sub: 'veneer · 0.6mm',   color: '#c9ad7a', stripe: '#a8895a' },
  { name: 'Linen white',    sub: 'matte laminate',   color: '#e8e2d5', stripe: '#cabe9f' },
  { name: 'Smoke ash',      sub: 'open-pore',        color: '#7d756a', stripe: '#5b554c' },
  { name: 'Ink',            sub: 'high-gloss',       color: '#1a1815', stripe: '#1a1815' },
  { name: 'Sienna',         sub: 'powdercoat',       color: '#c96442', stripe: '#a04e30' },
  { name: 'Sea sage',       sub: 'matte lacquer',    color: '#9caf9a', stripe: '#6d8a6b' },
  { name: 'Brass',          sub: 'hardware',         color: '#b89656', stripe: '#8a6f3a' },
  { name: 'Studio glass',   sub: 'fluted · 6mm',     color: '#cfd6da', stripe: '#9aa7ad' },
];

function Swatch({ m, size = 80, dense = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{
        width: size, height: size, background: m.color,
        backgroundImage: `linear-gradient(135deg, ${m.color} 0 50%, ${m.stripe} 50% 100%)`,
        border: `1px solid ${lLine}`, borderRadius: 2,
      }}></div>
      <div style={{ ...lSans, fontSize: dense ? 11 : 12, color: lInk }}>{m.name}</div>
      <div style={{ ...lMono, fontSize: 9, color: lMute, marginTop: -3 }}>{m.sub}</div>
    </div>
  );
}

/* ── PlannerPeek — mini illustrated planner window ────── */
function PlannerPeek({ tone = 'paper', width = 720, height = 420 }) {
  // tone: 'paper' (calm) or 'cad' (workshop)
  const dark = tone === 'cad';
  const bg = dark ? '#16140f' : lPaper;
  const ink = dark ? '#f0eee9' : lInk;
  const mute = dark ? 'rgba(240,238,233,0.5)' : lMute;
  const line = dark ? 'rgba(240,238,233,0.12)' : lLine;
  return (
    <div style={{
      width, height, background: bg, color: ink,
      border: `1px solid ${line}`, borderRadius: 4, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      boxShadow: dark ? '0 30px 60px -30px rgba(0,0,0,0.5)' : '0 30px 60px -30px rgba(26,24,21,0.25)',
    }}>
      {/* titlebar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px', borderBottom: `1px solid ${line}`,
        ...lMono, fontSize: 10, color: mute,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: line }}></span>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: line }}></span>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: line }}></span>
        </div>
        <div>kreobox.studio / planner / kitchen-001</div>
        <div>units · mm</div>
      </div>
      {/* toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '6px 14px', borderBottom: `1px solid ${line}`, ...lMono, fontSize: 10, color: mute }}>
        <span style={{ color: ink, fontWeight: 700 }}>plan</span>
        <span>elev</span>
        <span>3d</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <span>grid 25</span>
          <span>scale 1:50</span>
        </span>
      </div>
      {/* canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <svg viewBox="0 0 720 320" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <defs>
            <pattern id={dark ? 'cad-g' : 'paper-g'} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0 L0 0 0 20" fill="none" stroke={dark ? 'rgba(240,238,233,0.07)' : 'rgba(26,24,21,0.05)'} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="720" height="320" fill={`url(#${dark ? 'cad-g' : 'paper-g'})`} />
          {/* walls */}
          <polyline points="80,260 80,80 560,80 560,260" fill="none" stroke={ink} strokeWidth="2.5" />
          {/* base run */}
          <rect x="80" y="200" width="320" height="60" fill={dark ? 'rgba(240,238,233,0.08)' : lWoodFill} stroke={ink} strokeWidth="1.4" />
          <rect x="80" y="200" width="80" height="60" fill="rgba(201,100,66,0.22)" stroke={lOrange} />
          <rect x="160" y="200" width="80" height="60" fill="rgba(31,138,91,0.22)" stroke={lGreen} />
          <rect x="240" y="200" width="80" height="60" fill={dark ? 'rgba(240,238,233,0.08)' : lWoodFill} stroke={ink} />
          <rect x="320" y="200" width="80" height="60" fill="rgba(201,100,66,0.22)" stroke={lOrange} />
          {/* wall cabs */}
          <rect x="80" y="80" width="320" height="36" fill="rgba(91,141,239,0.18)" stroke={lBlue} strokeWidth="1.3" />
          <line x1="160" y1="80" x2="160" y2="116" stroke={lBlue} />
          <line x1="240" y1="80" x2="240" y2="116" stroke={lBlue} />
          <line x1="320" y1="80" x2="320" y2="116" stroke={lBlue} />
          {/* island */}
          <rect x="440" y="180" width="100" height="60" fill={dark ? 'rgba(240,238,233,0.08)' : lWoodFill} stroke={ink} strokeWidth="1.4" />
          {/* dim */}
          <line x1="80" y1="290" x2="400" y2="290" stroke={mute} />
          <line x1="80" y1="285" x2="80" y2="295" stroke={mute} />
          <line x1="400" y1="285" x2="400" y2="295" stroke={mute} />
          <text x="240" y="304" fill={mute} {...lMono} fontSize="9" textAnchor="middle">3200 mm</text>
          {/* selection */}
          <rect x="160" y="200" width="80" height="60" fill="none" stroke={lAccent} strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx="200" cy="230" r="3" fill={lAccent} />
          <text x="220" y="234" fill={lAccent} {...lMono} fontSize="10">CB-04 · sink base 800</text>
        </svg>
        {/* right panel */}
        <div style={{
          position: 'absolute', top: 12, right: 12, width: 180, padding: 12,
          background: dark ? 'rgba(255,255,255,0.04)' : lPaper,
          border: `1px solid ${line}`, borderRadius: 3,
          ...lMono, fontSize: 10, color: mute, lineHeight: 1.6,
        }}>
          <div style={{ color: ink, fontWeight: 700, marginBottom: 6 }}>Sink base · CB-04</div>
          <div>w 800 · d 600 · h 720</div>
          <div>finish · linen white</div>
          <div>hinge · soft-close ×2</div>
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${line}`, color: dark ? '#d1c8b5' : lInk }}>
            ₹ 18,400 <span style={{ color: mute }}>· qty 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── FAQ data + accordion ────────────────────────────────── */
const FAQS_CONTRACTOR = [
  { q: 'Do you sell to independent contractors directly?', a: 'Yes. Register as a Kreobox partner contractor and you unlock 18–24% margin on listed prices, design-it-yourself access to Studio, and a single point of contact at the factory.' },
  { q: 'What’s the lead time on a single wardrobe?', a: 'Pre-cut module kits are stocked at city depots and dispatched within 48–72 hours of order confirmation. Site installation completes in 48 hours from kit delivery.' },
  { q: 'Can I quote a client from the planner directly?', a: 'Yes. Studio exports a contractor-tagged quote sheet, a customer-facing PDF without the cost breakdown, and the cut-list for fabrication, all from the same plan.' },
  { q: 'What happens if a panel is damaged on site?', a: 'Open a replacement ticket from Studio with the SKU and panel ID. A single panel re-cut ships in 48–72 hours and you pay material-only.' },
  { q: 'Are the finishes BIFMA / E1 certified?', a: 'All carcass panels are E1 rated. Hardware is BIFMA-approved Hettich / Hafele. Material certificates print with every order.' },
  { q: 'Do you do installation, or do I?', a: 'Both. Self-install with the printed plan + cut-list, or schedule a Kreobox installer per site at 6% of order value.' },
];

function FAQList({ items = FAQS_CONTRACTOR, openIndex = 0, tone = 'paper', columns = 1 }) {
  const dark = tone === 'cad';
  const ink = dark ? '#f0eee9' : lInk;
  const mute = dark ? 'rgba(240,238,233,0.55)' : lMute;
  const line = dark ? 'rgba(240,238,233,0.12)' : lLine2;
  const cols = columns === 2 ? 'repeat(2, 1fr)' : '1fr';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '0 48px' }}>
      {items.map((it, i) => {
        const open = i === openIndex;
        return (
          <div key={i} style={{ borderTop: `1px solid ${line}`, padding: '20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
              <div style={{ ...lFr, fontSize: 19, color: ink, letterSpacing: '-0.01em' }}>
                <span style={{ ...lMono, fontSize: 10, color: mute, marginRight: 12, letterSpacing: '0.1em' }}>
                  Q.{String(i + 1).padStart(2, '0')}
                </span>
                {it.q}
              </div>
              <span style={{ ...lMono, fontSize: 14, color: mute }}>{open ? '\u2212' : '+'}</span>
            </div>
            {open && (
              <div style={{ ...lSans, fontSize: 14, color: mute, lineHeight: 1.6, marginTop: 10, maxWidth: 560 }}>
                {it.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── DIY mode card ──────────────────────────────────────── */
const DIY_MODES = [
  {
    n: '01',
    h: 'Together, in-room',
    s: 'Contractor opens Studio on a tablet at the site. Walls measured live, modules dragged in front of the client. Plan and price land in the same gesture.',
    ill: 'tablet',
  },
  {
    n: '02',
    h: 'Solo, then send',
    s: 'Contractor designs alone the night before, exports a clean render and a quote sheet. Client signs in their browser, no app to install.',
    ill: 'render',
  },
  {
    n: '03',
    h: 'Client self-designs',
    s: 'Homeowner explores in the public Studio. When they\u2019re ready, they assign the plan to a registered contractor who quotes and builds.',
    ill: 'self',
  },
];

function ModeIllustration({ kind, dark }) {
  const ink = dark ? '#f0eee9' : lInk;
  const mute = dark ? 'rgba(240,238,233,0.5)' : lMute;
  const line = dark ? 'rgba(240,238,233,0.12)' : lLine;
  if (kind === 'tablet') {
    return (
      <svg viewBox="0 0 240 140" width="100%" style={{ display: 'block' }}>
        <rect x="40" y="20" width="160" height="100" rx="6" fill="none" stroke={ink} strokeWidth="1.4" />
        <rect x="46" y="26" width="148" height="88" fill={dark ? 'rgba(240,238,233,0.04)' : lBg} />
        <polyline points="56,100 56,40 180,40 180,100" fill="none" stroke={ink} strokeWidth="1.4" />
        <rect x="56" y="80" width="60" height="20" fill="rgba(201,100,66,0.22)" stroke={lOrange} />
        <rect x="116" y="80" width="60" height="20" fill="rgba(31,138,91,0.22)" stroke={lGreen} />
        <line x1="120" y1="20" x2="120" y2="14" stroke={ink} />
        <circle cx="120" cy="12" r="2" fill={ink} />
        <text x="120" y="134" textAnchor="middle" fill={mute} {...lMono} fontSize="9">contractor · client · site</text>
      </svg>
    );
  }
  if (kind === 'render') {
    return (
      <svg viewBox="0 0 240 140" width="100%" style={{ display: 'block' }}>
        <rect x="20" y="22" width="130" height="90" rx="3" fill={dark ? 'rgba(240,238,233,0.04)' : lPaper} stroke={ink} strokeWidth="1.2" />
        <rect x="28" y="30" width="50" height="60" fill={lWoodFill} stroke={lWood} />
        <rect x="82" y="30" width="60" height="20" fill="rgba(91,141,239,0.18)" stroke={lBlue} />
        <rect x="82" y="54" width="60" height="36" fill="rgba(201,100,66,0.22)" stroke={lOrange} />
        <path d="M150 78 L185 78 L185 96 M175 88 L185 96 L175 104" fill="none" stroke={ink} strokeWidth="1.3" />
        <rect x="180" y="60" width="48" height="64" rx="2" fill={dark ? 'rgba(240,238,233,0.06)' : lBg} stroke={ink} strokeWidth="1.2" />
        <line x1="186" y1="72" x2="222" y2="72" stroke={mute} />
        <line x1="186" y1="80" x2="218" y2="80" stroke={mute} />
        <line x1="186" y1="88" x2="222" y2="88" stroke={mute} />
        <line x1="186" y1="96" x2="210" y2="96" stroke={mute} />
        <text x="124" y="134" textAnchor="middle" fill={mute} {...lMono} fontSize="9">render → e-mail · sign</text>
      </svg>
    );
  }
  // self
  return (
    <svg viewBox="0 0 240 140" width="100%" style={{ display: 'block' }}>
      <rect x="36" y="24" width="100" height="80" rx="2" fill="none" stroke={ink} strokeWidth="1.3" />
      <circle cx="86" cy="64" r="14" fill="none" stroke={ink} strokeWidth="1.2" />
      <line x1="78" y1="58" x2="94" y2="58" stroke={ink} />
      <line x1="78" y1="64" x2="90" y2="64" stroke={ink} />
      <line x1="78" y1="70" x2="94" y2="70" stroke={ink} />
      <line x1="136" y1="64" x2="170" y2="64" stroke={ink} strokeDasharray="3 3" />
      <polygon points="170,64 164,60 164,68" fill={ink} />
      <rect x="172" y="36" width="50" height="56" rx="2" fill={dark ? 'rgba(240,238,233,0.06)' : lBg} stroke={ink} strokeWidth="1.2" />
      <circle cx="197" cy="58" r="6" fill="none" stroke={lAccent} strokeWidth="1.3" />
      <text x="197" y="80" textAnchor="middle" fill={mute} {...lMono} fontSize="8">contractor</text>
      <text x="120" y="134" textAnchor="middle" fill={mute} {...lMono} fontSize="9">homeowner → contractor</text>
    </svg>
  );
}

/* ── Pricing strip (optional, tweakable) ────────────────── */
function PricingStrip({ dark = false }) {
  const ink = dark ? '#f0eee9' : lInk;
  const mute = dark ? 'rgba(240,238,233,0.55)' : lMute;
  const line = dark ? 'rgba(240,238,233,0.12)' : lLine;
  const rows = [
    { tier: 'Stockist', orders: '\u2264 6 / yr',     margin: '18 %', net: '\u20b9 4.2 L starter' },
    { tier: 'Partner',  orders: '6 \u2013 30 / yr',  margin: '22 %', net: '\u20b9 9.8 L recommended' },
    { tier: 'Studio',   orders: '30+ / yr',         margin: '24 % + co-marketing', net: 'on application' },
  ];
  return (
    <div style={{
      background: dark ? '#16140f' : lPaper, color: ink,
      border: `1px solid ${line}`, borderRadius: 4,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ ...lFr, fontSize: 22 }}>Contractor margin · 2026 plan</div>
        <div style={{ ...lMono, fontSize: 10, color: mute }}>excl. GST · revised quarterly</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', ...lMono, fontSize: 11 }}>
        <div style={{ padding: '10px 20px', color: mute, borderBottom: `1px solid ${line}` }}>tier</div>
        <div style={{ padding: '10px 20px', color: mute, borderBottom: `1px solid ${line}` }}>annual orders</div>
        <div style={{ padding: '10px 20px', color: mute, borderBottom: `1px solid ${line}` }}>margin</div>
        <div style={{ padding: '10px 20px', color: mute, borderBottom: `1px solid ${line}` }}>opening order</div>
        {rows.map((r, i) => (
          <React.Fragment key={i}>
            <div style={{ padding: '12px 20px', color: ink, fontWeight: 700, borderBottom: i < rows.length - 1 ? `1px solid ${line}` : 'none' }}>{r.tier}</div>
            <div style={{ padding: '12px 20px', color: ink, borderBottom: i < rows.length - 1 ? `1px solid ${line}` : 'none' }}>{r.orders}</div>
            <div style={{ padding: '12px 20px', color: lAccent, borderBottom: i < rows.length - 1 ? `1px solid ${line}` : 'none' }}>{r.margin}</div>
            <div style={{ padding: '12px 20px', color: ink, borderBottom: i < rows.length - 1 ? `1px solid ${line}` : 'none' }}>{r.net}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ── Footer CTA ─────────────────────────────────────────── */
function LandingFooter({ tablet = false, variant = 'catalog' }) {
  return (
    <div style={{ borderTop: `1px solid ${lLine}`, background: lBg, padding: tablet ? '56px 28px 36px' : '88px 64px 48px' }}>
      <div style={{ display: 'flex', flexDirection: tablet ? 'column' : 'row', gap: tablet ? 28 : 64, alignItems: tablet ? 'flex-start' : 'flex-end', justifyContent: 'space-between', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ maxWidth: 640 }}>
          <Eyebrow>open studio</Eyebrow>
          <div style={{ ...lFr, fontSize: tablet ? 44 : 64, lineHeight: 0.98, letterSpacing: '-0.02em', marginTop: 12 }}>
            Plan the room.<br/>
            <span style={{ fontStyle: 'italic', color: lAccent }}>Quote in the same gesture.</span>
          </div>
          <p style={{ ...lSans, fontSize: 15, color: lSoft, lineHeight: 1.6, maxWidth: 520, marginTop: 18 }}>
            Studio opens in the browser. No download, no licence, no upsell.
            The planner is the second page — the catalogue you\u2019re on is the first.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <a href="planner.html" style={{
            ...lSans, textDecoration: 'none', background: lInk, color: lPaper,
            padding: '16px 24px', borderRadius: 2, fontWeight: 600, fontSize: 15,
            display: 'inline-flex', alignItems: 'center', gap: 10,
          }}>
            Open the Planner <span style={{ ...lMono, fontSize: 11, opacity: 0.7 }}>\u2197</span>
          </a>
          <a href="#" style={{
            ...lSans, textDecoration: 'none', background: 'transparent', color: lInk,
            border: `1px solid ${lLine2}`, padding: '15px 22px', borderRadius: 2, fontSize: 15,
          }}>Become a partner contractor</a>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: tablet ? 40 : 72, ...lMono, fontSize: 10, color: lMute, borderTop: `1px solid ${lLine}`, paddingTop: 20 }}>
        <span>© Kreobox Furniture LLP · Bangalore · 2026</span>
        <span>panel furniture · planned to the mm</span>
      </div>
    </div>
  );
}

/* ── Export to window so other Babel files can use them ── */
Object.assign(window, {
  KreoMark, Eyebrow, LandingNav, AudienceToggle, KeyChip,
  MiniPlate, BlueprintPlate, PhotoSlot, PerspectiveSlot,
  Swatch, MATERIALS, PlannerPeek, FAQList, FAQS_CONTRACTOR,
  DIY_MODES, ModeIllustration, PricingStrip, LandingFooter,
  // colors / fonts for the per-direction files
  lInk, lPaper, lBg, lMute, lSoft, lLine, lLine2, lAccent,
  lBlue, lOrange, lPurple, lGreen, lWood, lWoodFill, lMono, lFr, lSans,
});
