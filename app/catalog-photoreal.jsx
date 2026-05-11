/* ============================================================
   KREOBOX · Photoreal 3/4 renders · 20 SKUs
   SVG with realistic gradients, AO, contact shadows, materials
   ============================================================ */

const phInk = '#1a1815';
const phPaper = '#fafaf7';
const phBg = '#eeeae2';
const phMute = 'rgba(26,24,21,0.55)';
const phLine = 'rgba(26,24,21,0.10)';
const phMono = { fontFamily: 'JetBrains Mono, monospace' };
const phFr = { fontFamily: '"Fraunces", Georgia, serif' };

/* projection */
const PRX = 0.42, PRY = -0.55;

/* ── shared SVG defs (gradients & filters) ──────────────────── */
function PhotoDefs() {
  return (
    <defs>
      {/* warm walnut */}
      <linearGradient id="ph-walnut" x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0" stopColor="#5a3a22" />
        <stop offset="0.5" stopColor="#7a4f30" />
        <stop offset="1" stopColor="#3d2615" />
      </linearGradient>
      <linearGradient id="ph-walnut-side" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0" stopColor="#3a2415" />
        <stop offset="1" stopColor="#5a3a22" />
      </linearGradient>
      <linearGradient id="ph-walnut-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8a5d3c" />
        <stop offset="1" stopColor="#5a3a22" />
      </linearGradient>
      {/* oak / bali oak */}
      <linearGradient id="ph-oak" x1="0" y1="0" x2="1" y2="0.4">
        <stop offset="0" stopColor="#c89968" />
        <stop offset="0.5" stopColor="#d8ad7a" />
        <stop offset="1" stopColor="#9c7448" />
      </linearGradient>
      <linearGradient id="ph-oak-side" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor="#9c7448" />
        <stop offset="1" stopColor="#c89968" />
      </linearGradient>
      <linearGradient id="ph-oak-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e6c498" />
        <stop offset="1" stopColor="#b88858" />
      </linearGradient>
      {/* matte cream / linen white */}
      <linearGradient id="ph-cream" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stopColor="#f5efe1" />
        <stop offset="1" stopColor="#d8ceb8" />
      </linearGradient>
      <linearGradient id="ph-cream-side" x1="0" y1="0" x2="0.3" y2="0.7">
        <stop offset="0" stopColor="#c8bea8" />
        <stop offset="1" stopColor="#a89e88" />
      </linearGradient>
      <linearGradient id="ph-cream-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fcf6e8" />
        <stop offset="1" stopColor="#c8bea8" />
      </linearGradient>
      {/* pebble grey matte */}
      <linearGradient id="ph-grey" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stopColor="#9a958a" />
        <stop offset="1" stopColor="#6a655c" />
      </linearGradient>
      <linearGradient id="ph-grey-side" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0" stopColor="#5a554c" />
        <stop offset="1" stopColor="#7a756a" />
      </linearGradient>
      <linearGradient id="ph-grey-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#aaa595" />
        <stop offset="1" stopColor="#7a756a" />
      </linearGradient>
      {/* smoked walnut dark */}
      <linearGradient id="ph-smoke" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor="#3a2e22" />
        <stop offset="1" stopColor="#1f1812" />
      </linearGradient>
      <linearGradient id="ph-smoke-side" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0" stopColor="#1a140e" />
        <stop offset="1" stopColor="#2c2218" />
      </linearGradient>
      <linearGradient id="ph-smoke-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a3a2c" />
        <stop offset="1" stopColor="#231a12" />
      </linearGradient>
      {/* interior — recessed shadow */}
      <linearGradient id="ph-interior" x1="0" y1="0" x2="0.3" y2="0.9">
        <stop offset="0" stopColor="#3a2e22" stopOpacity="0.95" />
        <stop offset="1" stopColor="#5a4a36" stopOpacity="0.85" />
      </linearGradient>
      <radialGradient id="ph-interior-rad" cx="0.5" cy="0.4" r="0.7">
        <stop offset="0" stopColor="#7a634a" />
        <stop offset="1" stopColor="#231a12" />
      </radialGradient>
      {/* mirror / glass */}
      <linearGradient id="ph-mirror" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stopColor="#c8d4e2" />
        <stop offset="0.4" stopColor="#9eb1c8" />
        <stop offset="0.7" stopColor="#dde6f0" />
        <stop offset="1" stopColor="#7d92ad" />
      </linearGradient>
      <linearGradient id="ph-glass" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0" stopColor="rgba(220,232,242,0.65)" />
        <stop offset="1" stopColor="rgba(150,170,190,0.45)" />
      </linearGradient>
      {/* metal — brushed steel */}
      <linearGradient id="ph-steel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d4d0c8" />
        <stop offset="0.5" stopColor="#8a857c" />
        <stop offset="1" stopColor="#bcb6ab" />
      </linearGradient>
      {/* brass */}
      <linearGradient id="ph-brass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d4a85a" />
        <stop offset="0.5" stopColor="#8a6a30" />
        <stop offset="1" stopColor="#b88e44" />
      </linearGradient>
      {/* quartz countertop */}
      <linearGradient id="ph-quartz" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0" stopColor="#f0ece4" />
        <stop offset="1" stopColor="#c8c2b6" />
      </linearGradient>
      {/* floor — warm */}
      <linearGradient id="ph-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d8cdb6" />
        <stop offset="1" stopColor="#b8a890" />
      </linearGradient>
      <radialGradient id="ph-spotlight" cx="0.5" cy="0.3" r="0.7">
        <stop offset="0" stopColor="rgba(255,245,220,0.4)" />
        <stop offset="1" stopColor="rgba(255,245,220,0)" />
      </radialGradient>
      {/* contact shadow */}
      <radialGradient id="ph-contact" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="rgba(20,15,10,0.55)" />
        <stop offset="0.6" stopColor="rgba(20,15,10,0.2)" />
        <stop offset="1" stopColor="rgba(20,15,10,0)" />
      </radialGradient>
      {/* fabric — chair */}
      <linearGradient id="ph-fabric" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stopColor="#3a4858" />
        <stop offset="1" stopColor="#1c2632" />
      </linearGradient>
      {/* stainless appliance */}
      <linearGradient id="ph-appliance" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0" stopColor="#cac6bc" />
        <stop offset="0.5" stopColor="#8c887e" />
        <stop offset="1" stopColor="#a8a49a" />
      </linearGradient>
      {/* book spine random gradients via patterns */}
      <pattern id="ph-grain-walnut" width="80" height="6" patternUnits="userSpaceOnUse">
        <rect width="80" height="6" fill="url(#ph-walnut)" />
        <path d="M0 3 Q20 1 40 3 T80 3" stroke="#3a2515" strokeWidth="0.4" fill="none" opacity="0.5" />
      </pattern>
      <pattern id="ph-grain-oak" width="80" height="6" patternUnits="userSpaceOnUse">
        <rect width="80" height="6" fill="url(#ph-oak)" />
        <path d="M0 3 Q20 1 40 3 T80 3" stroke="#7a5430" strokeWidth="0.3" fill="none" opacity="0.5" />
      </pattern>
      <pattern id="ph-grain-smoke" width="80" height="6" patternUnits="userSpaceOnUse">
        <rect width="80" height="6" fill="url(#ph-smoke)" />
        <path d="M0 3 Q20 1 40 3 T80 3" stroke="#0a0604" strokeWidth="0.3" fill="none" opacity="0.5" />
      </pattern>
      {/* Bali oak special */}
      <linearGradient id="ph-bali" x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0" stopColor="#a8835a" />
        <stop offset="0.5" stopColor="#c2a075" />
        <stop offset="1" stopColor="#7e5e3a" />
      </linearGradient>
      <pattern id="ph-grain-bali" width="80" height="8" patternUnits="userSpaceOnUse">
        <rect width="80" height="8" fill="url(#ph-bali)" />
        <path d="M0 4 Q20 2 40 4 T80 4" stroke="#5e4528" strokeWidth="0.4" fill="none" opacity="0.6" />
        <path d="M0 6 Q15 5 30 6 T60 6 T80 6" stroke="#3a2818" strokeWidth="0.25" fill="none" opacity="0.4" />
      </pattern>
      <filter id="ph-soft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.4" />
      </filter>
      <filter id="ph-blur4" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>
  );
}

/* ── card chrome with photo backdrop ─────────────────────────── */
function PhCard({ code, title, sub, children }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: phPaper,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 18px 10px', borderBottom: `1px solid ${phLine}`,
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ ...phMono, fontSize: 10, letterSpacing: '0.18em', color: phMute, fontWeight: 700 }}>{code}</div>
          <div style={{ ...phFr, fontSize: 22, marginTop: 3, letterSpacing: '-0.01em', lineHeight: 1.05 }}>{title}</div>
        </div>
        <div style={{ ...phMono, fontSize: 10, color: phMute }}>3/4 · photoreal</div>
      </div>
      <div style={{ flex: 1, position: 'relative', background: phBg }}>
        <svg viewBox="0 0 620 380" style={{ width: '100%', height: '100%', display: 'block' }}>
          <PhotoDefs />
          {/* environment: floor + back wall + spotlight */}
          <rect x="0" y="0" width="620" height="200" fill="#e2dccf" />
          <rect x="0" y="200" width="620" height="180" fill="url(#ph-floor)" />
          <ellipse cx="310" cy="200" rx="320" ry="60" fill="rgba(0,0,0,0.06)" />
          <rect x="0" y="0" width="620" height="380" fill="url(#ph-spotlight)" />
          {children}
        </svg>
      </div>
      <div style={{
        padding: '10px 18px', borderTop: `1px solid ${phLine}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        ...phMono, fontSize: 10, color: phMute,
      }}>
        <span>{sub}</span>
        <span style={{ color: phInk, fontWeight: 700 }}>kreobox.in</span>
      </div>
    </div>
  );
}

/* ── primitives ─────────────────────────────────────────────── */
function ContactShadow({ cx, cy, rx, ry = 12 }) {
  return (
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#ph-contact)" />
  );
}

/* a 3D box with material faces (front/top/right side) */
function Box3D({ x, y, w, h, d, mat = 'cream' }) {
  const dx = d * PRX, dy = d * PRY;
  const fronts = {
    cream: 'url(#ph-cream)', oak: 'url(#ph-grain-oak)', walnut: 'url(#ph-grain-walnut)',
    smoke: 'url(#ph-grain-smoke)', grey: 'url(#ph-grey)', bali: 'url(#ph-grain-bali)',
    steel: 'url(#ph-steel)', appliance: 'url(#ph-appliance)',
  };
  const tops = {
    cream: 'url(#ph-cream-top)', oak: 'url(#ph-oak-top)', walnut: 'url(#ph-walnut-top)',
    smoke: 'url(#ph-smoke-top)', grey: 'url(#ph-grey-top)', bali: 'url(#ph-oak-top)',
    steel: '#d4d0c8', appliance: '#bcb6ab',
  };
  const sides = {
    cream: 'url(#ph-cream-side)', oak: 'url(#ph-oak-side)', walnut: 'url(#ph-walnut-side)',
    smoke: 'url(#ph-smoke-side)', grey: 'url(#ph-grey-side)', bali: 'url(#ph-oak-side)',
    steel: '#8a857c', appliance: '#7a756c',
  };
  return (
    <g>
      {/* top */}
      <path d={`M ${x} ${y} L ${x + dx} ${y + dy} L ${x + w + dx} ${y + dy} L ${x + w} ${y} Z`}
        fill={tops[mat]} />
      {/* side */}
      <path d={`M ${x + w} ${y} L ${x + w + dx} ${y + dy} L ${x + w + dx} ${y + h + dy} L ${x + w} ${y + h} Z`}
        fill={sides[mat]} />
      {/* front */}
      <rect x={x} y={y} width={w} height={h} fill={fronts[mat]} />
    </g>
  );
}

/* interior recess (open door reveals this) */
function Interior3D({ x, y, w, h, d }) {
  const dx = d * PRX, dy = d * PRY;
  return (
    <g>
      {/* back */}
      <rect x={x + dx} y={y + dy} width={w} height={h} fill="url(#ph-interior-rad)" />
      {/* left wall */}
      <path d={`M ${x} ${y} L ${x + dx} ${y + dy} L ${x + dx} ${y + dy + h} L ${x} ${y + h} Z`}
        fill="url(#ph-interior)" />
      {/* floor */}
      <path d={`M ${x} ${y + h} L ${x + dx} ${y + dy + h} L ${x + dx + w} ${y + dy + h} L ${x + w} ${y + h} Z`}
        fill="#2a2018" />
      {/* ceiling shadow */}
      <path d={`M ${x} ${y} L ${x + dx} ${y + dy} L ${x + dx + w} ${y + dy} L ${x + w} ${y} Z`}
        fill="#1a120c" opacity="0.7" />
    </g>
  );
}

function Shelf({ x, y, w, d, mat = 'oak' }) {
  const dx = d * PRX, dy = d * PRY;
  const tops = { oak: 'url(#ph-oak-top)', walnut: 'url(#ph-walnut-top)', cream: 'url(#ph-cream-top)' };
  return (
    <g>
      <path d={`M ${x} ${y} L ${x + dx} ${y + dy} L ${x + w + dx} ${y + dy} L ${x + w} ${y} Z`}
        fill={tops[mat]} />
      <rect x={x} y={y} width={w} height="3" fill="#8a755a" />
    </g>
  );
}

function Rod({ x, y, w }) {
  return (
    <g>
      <rect x={x} y={y - 1} width={w} height="3" fill="url(#ph-steel)" />
      <rect x={x} y={y + 1.5} width={w} height="0.7" fill="rgba(0,0,0,0.5)" />
    </g>
  );
}

function Hanger({ x, y, color = '#5a4030' }) {
  return (
    <g>
      <ellipse cx={x} cy={y + 12} rx="10" ry="2" fill={color} opacity="0.8" />
      <rect x={x - 9} y={y + 4} width="18" height="14" fill={color} opacity="0.85" rx="1" />
      <path d={`M ${x} ${y} q 0 -3 2 -4`} fill="none" stroke="#888" strokeWidth="0.6" />
    </g>
  );
}

/* a clothes garment hanging in a wardrobe bay */
function Garment({ x, y, color, w = 24, h = 56 }) {
  return (
    <g>
      {/* shoulders */}
      <path d={`M ${x - w / 2} ${y} Q ${x} ${y - 4} ${x + w / 2} ${y} L ${x + w / 2 - 3} ${y + h} Q ${x} ${y + h + 3} ${x - w / 2 + 3} ${y + h} Z`}
        fill={color} />
      {/* fold shadow */}
      <path d={`M ${x - 2} ${y + 4} L ${x - 2} ${y + h - 4}`} stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" />
    </g>
  );
}

function ClosedDoorPh({ x, y, w, h, mat = 'cream', handleSide = 'right' }) {
  const fills = {
    cream: 'url(#ph-cream)', oak: 'url(#ph-grain-oak)', walnut: 'url(#ph-grain-walnut)',
    smoke: 'url(#ph-grain-smoke)', grey: 'url(#ph-grey)', bali: 'url(#ph-grain-bali)',
  };
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fills[mat]} />
      {/* recessed inset */}
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} fill="none"
        stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
      {/* highlight */}
      <rect x={x + 1} y={y + 6} width="1.5" height={h - 12} fill="rgba(255,255,255,0.35)" />
      {/* handle */}
      <rect x={handleSide === 'right' ? x + w - 12 : x + 7} y={y + h / 2 - 22}
        width="5" height="44" rx="2" fill="url(#ph-steel)" />
      <rect x={handleSide === 'right' ? x + w - 12 : x + 7} y={y + h / 2 - 22}
        width="5" height="44" rx="2" fill="rgba(0,0,0,0.25)" />
      <rect x={handleSide === 'right' ? x + w - 11 : x + 8} y={y + h / 2 - 22}
        width="1" height="44" fill="rgba(255,255,255,0.5)" />
    </g>
  );
}

function OpenDoorPh({ x, y, h, dWide = 70, dy = -10, hinge = 'left', mat = 'cream' }) {
  const fills = { cream: '#e6dec8', oak: '#c89968', walnut: '#5a3a22', bali: '#a8835a', smoke: '#3a2e22', grey: '#9a958a' };
  const sign = hinge === 'left' ? -1 : 1;
  const tipX = x + sign * dWide;
  const tipY = y + dy;
  return (
    <g>
      <path d={`M ${x} ${y} L ${tipX} ${tipY} L ${tipX} ${tipY + h} L ${x} ${y + h} Z`}
        fill={fills[mat]} />
      {/* shadow on inside face */}
      <path d={`M ${x} ${y} L ${tipX} ${tipY} L ${tipX} ${tipY + h} L ${x} ${y + h} Z`}
        fill="rgba(0,0,0,0.18)" />
      {/* drop shadow on cabinet face */}
      <path d={`M ${x} ${y + 6} L ${tipX} ${tipY + 6} L ${tipX} ${tipY + h + 4} L ${x} ${y + h + 4} Z`}
        fill="rgba(0,0,0,0.15)" filter="url(#ph-soft)" />
      {/* hinge */}
      {[0.18, 0.5, 0.82].map((p, i) => (
        <circle key={i} cx={x} cy={y + h * p} r="1.8" fill="#3a342a" />
      ))}
      {/* handle */}
      <rect x={tipX - sign * 12} y={tipY + h / 2 - 18} width="4" height="36" rx="1.5" fill="url(#ph-steel)" />
    </g>
  );
}

function DrawerPh({ x, y, w, h, mat = 'cream' }) {
  const fills = { cream: 'url(#ph-cream)', oak: 'url(#ph-grain-oak)', walnut: 'url(#ph-grain-walnut)', smoke: 'url(#ph-grain-smoke)', grey: 'url(#ph-grey)', bali: 'url(#ph-grain-bali)' };
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fills[mat]} />
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} fill="none"
        stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
      {/* gap shadow above */}
      <rect x={x} y={y} width={w} height="1" fill="rgba(0,0,0,0.4)" />
      <rect x={x + w / 2 - 22} y={y + h / 2 - 2} width="44" height="3" rx="1" fill="url(#ph-steel)" />
    </g>
  );
}

/* ============================================================
   WARDROBES (5)
   ============================================================ */

function PR_W_Compact() {
  const x0 = 130, y0 = 80, bayW = 170, h = 230, d = 80;
  return (
    <PhCard code="KBX-WD-01 · 2 BAY · 1800w" title="Compact Hanger"
      sub="Cream lacquer doors · soft-close drawers · left bay revealed">
      <ContactShadow cx={x0 + bayW + d * PRX / 2} cy={y0 + h + 14} rx={bayW + 30} ry="11" />
      {/* carcass */}
      <Box3D x={x0} y={y0} w={bayW * 2} h={h} d={d} mat="cream" />
      {/* interior left bay */}
      <Interior3D x={x0 + 4} y={y0 + 4} w={bayW - 8} h={h - 8} d={d - 8} />
      <Shelf x={x0 + 6} y={y0 + 24} w={bayW - 12} d={d - 8} mat="oak" />
      <Rod x={x0 + 14} y={y0 + 50} w={bayW - 28} />
      {/* garments */}
      {[
        { x: 25, c: '#3a4858' }, { x: 52, c: '#7a5840' }, { x: 80, c: '#3a3a44' },
        { x: 108, c: '#5a3a30' }, { x: 134, c: '#2a2a32' },
      ].map((g, i) => <Garment key={i} x={x0 + g.x} y={y0 + 56} color={g.c} h={70} />)}
      {/* drawers below */}
      {[0, 1, 2].map(i => (
        <DrawerPh key={i} x={x0 + 6} y={y0 + 144 + i * 28} w={bayW - 12} h="26" mat="cream" />
      ))}
      {/* RIGHT bay closed (2 doors) */}
      <ClosedDoorPh x={x0 + bayW + 4} y={y0 + 4} w={bayW / 2 - 4} h={h - 8} mat="cream" handleSide="right" />
      <ClosedDoorPh x={x0 + 1.5 * bayW} y={y0 + 4} w={bayW / 2 - 4} h={h - 8} mat="cream" handleSide="left" />
      {/* OPEN door of left bay swung right */}
      <OpenDoorPh x={x0 + bayW - 4} y={y0 + 6} h={h - 12} dWide={62} dy={-12} hinge="right" mat="cream" />
      {/* plinth */}
      <rect x={x0 + 4} y={y0 + h} width={bayW * 2 - 8} height="6" fill="#7a756a" />
    </PhCard>
  );
}

function PR_W_DoubleHang() {
  const x0 = 70, y0 = 60, bayW = 145, h = 260, d = 76;
  return (
    <PhCard code="KBX-WD-02 · 3 BAY · 2710w" title="Double-Hang Trio"
      sub="Bali oak doors · centre bay open · interior steel rods">
      <ContactShadow cx={x0 + 1.5 * bayW + d * PRX / 2} cy={y0 + h + 14} rx={bayW * 1.6 + 40} ry="11" />
      <Box3D x={x0} y={y0} w={bayW * 3} h={h} d={d} mat="bali" />
      {/* left closed */}
      <ClosedDoorPh x={x0 + 4} y={y0 + 4} w={bayW / 2 - 4} h={h - 8} mat="bali" handleSide="right" />
      <ClosedDoorPh x={x0 + bayW / 2} y={y0 + 4} w={bayW / 2 - 4} h={h - 8} mat="bali" handleSide="left" />
      {/* centre open */}
      <Interior3D x={x0 + bayW + 4} y={y0 + 4} w={bayW - 8} h={h - 8} d={d - 8} />
      <Shelf x={x0 + bayW + 8} y={y0 + 22} w={bayW - 16} d={d - 10} mat="oak" />
      <Rod x={x0 + bayW + 14} y={y0 + 44} w={bayW - 28} />
      {[
        { x: 18, c: '#4a3838' }, { x: 42, c: '#6a5840' }, { x: 66, c: '#3a4858' },
        { x: 90, c: '#5a4830' }, { x: 114, c: '#2a3038' },
      ].map((g, i) => <Garment key={i} x={x0 + bayW + g.x} y={y0 + 50} color={g.c} h={62} />)}
      <Shelf x={x0 + bayW + 8} y={y0 + 130} w={bayW - 16} d={d - 10} mat="oak" />
      <Rod x={x0 + bayW + 14} y={y0 + 148} w={bayW - 28} />
      {[
        { x: 18, c: '#4a4448' }, { x: 42, c: '#7a6850' }, { x: 66, c: '#3a4848' },
        { x: 90, c: '#6a5040' }, { x: 114, c: '#3a3238' },
      ].map((g, i) => <Garment key={i} x={x0 + bayW + g.x} y={y0 + 154} color={g.c} h={50} />)}
      <Shelf x={x0 + bayW + 8} y={y0 + 220} w={bayW - 16} d={d - 10} mat="oak" />
      {/* open doors swung */}
      <OpenDoorPh x={x0 + bayW + 4} y={y0 + 6} h={h - 12} dWide={-52} dy={10} hinge="right" mat="bali" />
      <OpenDoorPh x={x0 + 2 * bayW - 4} y={y0 + 6} h={h - 12} dWide={52} dy={-10} hinge="left" mat="bali" />
      {/* right closed */}
      <ClosedDoorPh x={x0 + 2 * bayW + 4} y={y0 + 4} w={bayW / 2 - 4} h={h - 8} mat="bali" handleSide="right" />
      <ClosedDoorPh x={x0 + 2.5 * bayW} y={y0 + 4} w={bayW / 2 - 4} h={h - 8} mat="bali" handleSide="left" />
      <rect x={x0 + 4} y={y0 + h} width={bayW * 3 - 8} height="6" fill="#3a2615" />
    </PhCard>
  );
}

function PR_W_Walkin() {
  const x0 = 50, y0 = 60, bayW = 110, h = 260, d = 70;
  return (
    <PhCard code="KBX-WD-03 · 4 BAY · 3600w" title="Walk-In Suite"
      sub="Smoked walnut · open module · shoes · hang · double · drawers">
      <ContactShadow cx={x0 + 2 * bayW + d * PRX / 2} cy={y0 + h + 14} rx={2 * bayW + 50} ry="12" />
      <Box3D x={x0} y={y0} w={bayW * 4} h={h} d={d} mat="smoke" />
      {[0, 1, 2, 3].map(i => (
        <Interior3D key={i} x={x0 + i * bayW + 4} y={y0 + 4} w={bayW - 8} h={h - 8} d={d - 8} />
      ))}
      {/* bay 0 — shoes */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <g key={'sh' + i}>
          <Shelf x={x0 + 6} y={y0 + 16 + i * 38} w={bayW - 12} d={d - 8} mat="oak" />
          {/* shoe pair */}
          <ellipse cx={x0 + bayW / 2 - 14} cy={y0 + 32 + i * 38} rx="14" ry="5" fill="#2a2018" opacity="0.85" />
          <ellipse cx={x0 + bayW / 2 + 14} cy={y0 + 32 + i * 38} rx="14" ry="5" fill="#2a2018" opacity="0.85" />
          <ellipse cx={x0 + bayW / 2 - 14} cy={y0 + 28 + i * 38} rx="10" ry="3" fill={['#4a3a28', '#6a5040', '#3a3030', '#5a3a22', '#4a4040', '#7a5840'][i]} />
          <ellipse cx={x0 + bayW / 2 + 14} cy={y0 + 28 + i * 38} rx="10" ry="3" fill={['#4a3a28', '#6a5040', '#3a3030', '#5a3a22', '#4a4040', '#7a5840'][i]} />
        </g>
      ))}
      {/* bay 1 — long hang */}
      <Shelf x={x0 + bayW + 6} y={y0 + 16} w={bayW - 12} d={d - 8} mat="oak" />
      <Rod x={x0 + bayW + 12} y={y0 + 32} w={bayW - 24} />
      {[0, 1, 2, 3].map(i => (
        <Garment key={i} x={x0 + bayW + 18 + i * 22} y={y0 + 38}
          color={['#3a4858', '#7a5840', '#4a3a30', '#2a2a32'][i]} h={130} w={20} />
      ))}
      {[0, 1, 2].map(i => (
        <DrawerPh key={'d' + i} x={x0 + bayW + 8} y={y0 + 180 + i * 22} w={bayW - 16} h="20" mat="smoke" />
      ))}
      {/* bay 2 — double hang */}
      <Rod x={x0 + 2 * bayW + 12} y={y0 + 28} w={bayW - 24} />
      {[0, 1, 2].map(i => (
        <Garment key={i} x={x0 + 2 * bayW + 22 + i * 24} y={y0 + 34}
          color={['#5a3a30', '#3a3848', '#6a5040'][i]} h={70} w={20} />
      ))}
      <Shelf x={x0 + 2 * bayW + 6} y={y0 + 116} w={bayW - 12} d={d - 8} mat="oak" />
      <Rod x={x0 + 2 * bayW + 12} y={y0 + 132} w={bayW - 24} />
      {[0, 1, 2].map(i => (
        <Garment key={i} x={x0 + 2 * bayW + 22 + i * 24} y={y0 + 138}
          color={['#3a4848', '#5a4838', '#3a3038'][i]} h={70} w={20} />
      ))}
      {/* bay 3 — drawers + baskets */}
      <Shelf x={x0 + 3 * bayW + 6} y={y0 + 14} w={bayW - 12} d={d - 8} mat="oak" />
      {/* baskets */}
      {[0, 1].map(i => (
        <g key={'b' + i}>
          <rect x={x0 + 3 * bayW + 12} y={y0 + 22 + i * 44} width={bayW - 24} height={38}
            fill="rgba(180,150,110,0.5)" stroke="#7a5840" strokeWidth="0.6" />
          {Array.from({ length: 7 }).map((_, k) => (
            <line key={k} x1={x0 + 3 * bayW + 14 + k * (bayW - 28) / 7} y1={y0 + 24 + i * 44}
              x2={x0 + 3 * bayW + 14 + k * (bayW - 28) / 7} y2={y0 + 58 + i * 44}
              stroke="#5a3a22" strokeWidth="0.4" opacity="0.6" />
          ))}
        </g>
      ))}
      {[0, 1, 2, 3].map(i => (
        <DrawerPh key={'dx' + i} x={x0 + 3 * bayW + 6} y={y0 + 116 + i * 32} w={bayW - 12} h="30" mat="smoke" />
      ))}
      <rect x={x0 + 4} y={y0 + h} width={bayW * 4 - 8} height="6" fill="#0a0604" />
    </PhCard>
  );
}

function PR_W_Sliding() {
  const x0 = 90, y0 = 50, w = 440, h = 280, d = 92;
  return (
    <PhCard code="KBX-WD-04 · 3 SLIDE · 2400w" title="Sliding · Mirror"
      sub="Linen white frosted side panels · centre mirror slid open · interior visible">
      <ContactShadow cx={x0 + w / 2 + d * PRX / 2} cy={y0 + h + 14} rx={w / 2 + 50} ry="12" />
      <Box3D x={x0} y={y0} w={w} h={h} d={d} mat="cream" />
      {/* tracks */}
      <rect x={x0 - 2} y={y0 - 3} width={w + 4} height="5" fill="url(#ph-steel)" />
      <rect x={x0 - 2} y={y0 + h - 2} width={w + 4} height="5" fill="url(#ph-steel)" />
      {/* left frosted */}
      <rect x={x0 + 4} y={y0 + 4} width={w / 3 - 8} height={h - 8} fill="url(#ph-glass)" />
      <rect x={x0 + 4} y={y0 + 4} width={w / 3 - 8} height={h - 8} fill="rgba(245,239,225,0.5)" />
      {/* interior gap revealed at right of centre */}
      <Interior3D x={x0 + w / 3 + w * 0.18} y={y0 + 4} w={w / 3 - 16} h={h - 8} d={d - 10} />
      <Rod x={x0 + w / 3 + w * 0.2} y={y0 + 40} w={w / 3 - 22} />
      {[0, 1, 2, 3].map(i => (
        <Garment key={i} x={x0 + w / 3 + w * 0.18 + 16 + i * 22} y={y0 + 46}
          color={['#3a4858', '#5a3a28', '#3a3038', '#6a5040'][i]} h={120} w={20} />
      ))}
      <Shelf x={x0 + w / 3 + w * 0.18 + 4} y={y0 + 200} w={w / 3 - 20} d={d - 12} mat="oak" />
      {/* mirror panel slid leftward */}
      <rect x={x0 + w / 3 - 30} y={y0 + 4} width={w / 3} height={h - 8} fill="url(#ph-mirror)" />
      {/* mirror reflections — abstracted env */}
      <rect x={x0 + w / 3 - 26} y={y0 + 8} width={w / 3 - 8} height={(h - 8) * 0.4} fill="rgba(220,232,242,0.5)" />
      <rect x={x0 + w / 3 - 26} y={y0 + 8 + (h - 8) * 0.4} width={w / 3 - 8} height={(h - 8) * 0.6} fill="rgba(120,140,165,0.4)" />
      {/* streaks */}
      {Array.from({ length: 8 }).map((_, k) => (
        <line key={k} x1={x0 + w / 3 - 26} y1={y0 + 30 + k * 30} x2={x0 + w / 3 - 26 + w / 3 - 8} y2={y0 + 30 + k * 30 - 100}
          stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
      ))}
      <rect x={x0 + w / 3 - 30} y={y0 + 4} width="2" height={h - 8} fill="rgba(255,255,255,0.6)" />
      {/* right frosted */}
      <rect x={x0 + 2 * w / 3 + 4} y={y0 + 4} width={w / 3 - 8} height={h - 8} fill="url(#ph-glass)" />
      <rect x={x0 + 2 * w / 3 + 4} y={y0 + 4} width={w / 3 - 8} height={h - 8} fill="rgba(245,239,225,0.5)" />
      {/* recessed handles */}
      <rect x={x0 + w / 3 - 2} y={y0 + h / 2 - 26} width="3" height="52" fill="url(#ph-steel)" />
      <rect x={x0 + 2 * w / 3 - 16} y={y0 + h / 2 - 26} width="3" height="52" fill="url(#ph-steel)" />
      <rect x={x0 + 4} y={y0 + h} width={w - 8} height="6" fill="#7a756a" />
    </PhCard>
  );
}

function PR_W_Corner() {
  const x0 = 50, y0 = 60, h = 250, d = 75, wA = 280;
  return (
    <PhCard code="KBX-WD-05 · L-CORNER · 2400+1500w" title="Corner Loft"
      sub="Bleached oak · L-config · long run + perpendicular return into corner">
      <ContactShadow cx={x0 + wA / 2 + 60} cy={y0 + h + 14} rx={wA / 2 + 100} ry="13" />
      {/* RUN B (right, receding) */}
      {(() => {
        const wB = 170;
        const bx = x0 + wA, by = y0;
        const recX = wB * 0.85, recY = -wB * 0.15;
        return (
          <g>
            <path d={`M ${bx} ${by} L ${bx + recX} ${by + recY} L ${bx + recX + d * PRX} ${by + recY + d * PRY} L ${bx + d * PRX} ${by + d * PRY} Z`}
              fill="url(#ph-oak-top)" />
            <path d={`M ${bx} ${by} L ${bx + recX} ${by + recY} L ${bx + recX} ${by + recY + h} L ${bx} ${by + h} Z`}
              fill="url(#ph-grain-oak)" />
            {/* darker because angled away */}
            <path d={`M ${bx} ${by} L ${bx + recX} ${by + recY} L ${bx + recX} ${by + recY + h} L ${bx} ${by + h} Z`}
              fill="rgba(0,0,0,0.18)" />
            {[0, 1, 2].map(i => {
              const t1 = i / 3, t2 = (i + 1) / 3;
              return (
                <path key={i} d={`M ${bx + recX * t1 + 4} ${by + recY * t1 + 6} L ${bx + recX * t2 - 2} ${by + recY * t2 + 6} L ${bx + recX * t2 - 2} ${by + recY * t2 + h - 6} L ${bx + recX * t1 + 4} ${by + recY * t1 + h - 6} Z`}
                  fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
              );
            })}
            {[0.16, 0.5, 0.83].map((p, i) => (
              <rect key={i} x={bx + recX * p - 2} y={by + recY * p + h / 2 - 18} width="4" height="36"
                fill="url(#ph-steel)" />
            ))}
            <path d={`M ${bx} ${by + h} L ${bx + recX} ${by + recY + h} L ${bx + recX} ${by + recY + h + 6} L ${bx} ${by + h + 6} Z`}
              fill="#5a4028" />
          </g>
        );
      })()}
      {/* corner post */}
      <rect x={x0 + wA - 8} y={y0} width="12" height={h} fill="url(#ph-grain-walnut)" />
      {/* RUN A */}
      <Box3D x={x0} y={y0} w={wA} h={h} d={d} mat="oak" />
      <ClosedDoorPh x={x0 + 4} y={y0 + 4} w={wA / 3 - 8} h={h - 8} mat="oak" handleSide="right" />
      <Interior3D x={x0 + wA / 3 + 4} y={y0 + 4} w={wA / 3 - 8} h={h - 8} d={d - 8} />
      <Shelf x={x0 + wA / 3 + 8} y={y0 + 24} w={wA / 3 - 16} d={d - 10} mat="walnut" />
      <Rod x={x0 + wA / 3 + 14} y={y0 + 46} w={wA / 3 - 28} />
      {[0, 1, 2, 3].map(i => (
        <Garment key={i} x={x0 + wA / 3 + 24 + i * 18} y={y0 + 52}
          color={['#3a3848', '#6a4838', '#5a3a30', '#3a3030'][i]} h={70} w={16} />
      ))}
      <Shelf x={x0 + wA / 3 + 8} y={y0 + 130} w={wA / 3 - 16} d={d - 10} mat="walnut" />
      {[0, 1, 2].map(i => (
        <DrawerPh key={i} x={x0 + wA / 3 + 8} y={y0 + 152 + i * 26} w={wA / 3 - 16} h="24" mat="oak" />
      ))}
      <OpenDoorPh x={x0 + 2 * wA / 3 - 4} y={y0 + 6} h={h - 12} dWide={50} dy={-10} hinge="left" mat="oak" />
      <ClosedDoorPh x={x0 + 2 * wA / 3 + 4} y={y0 + 4} w={wA / 3 - 8} h={h - 8} mat="oak" handleSide="left" />
      <rect x={x0 + 4} y={y0 + h} width={wA - 8} height="6" fill="#7a5430" />
    </PhCard>
  );
}

/* ============================================================
   MODULAR CABINETS (5)
   ============================================================ */

function PR_C_BaseRun() {
  const x0 = 50, y0 = 130, w = 530, h = 170, d = 80;
  return (
    <PhCard code="KBX-CB-01 · BASE · 3000w" title="Base Run · Kitchen"
      sub="Quartz top · pebble grey doors · drawers · sink · DW · pull-out bin">
      <ContactShadow cx={x0 + w / 2 + d * PRX / 2} cy={y0 + h + 16} rx={w / 2 + 40} ry="12" />
      {/* quartz counter */}
      <Box3D x={x0 - 6} y={y0 - 14} w={w + 12} h="14" d={d} mat="cream" />
      <rect x={x0 - 6} y={y0 - 14} width={w + 12} height="14" fill="url(#ph-quartz)" />
      <path d={`M ${x0 - 6} ${y0 - 14} L ${x0 - 6 + d * PRX} ${y0 - 14 + d * PRY} L ${x0 + w + 6 + d * PRX} ${y0 - 14 + d * PRY} L ${x0 + w + 6} ${y0 - 14} Z`}
        fill="url(#ph-quartz)" />
      {/* speckles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <circle key={i} cx={x0 + (i * 17.5) % (w + 12) - 6} cy={y0 - 14 + (i * 3) % 14}
          r="0.5" fill="#888578" opacity="0.6" />
      ))}
      {/* base carcass */}
      <Box3D x={x0} y={y0} w={w} h={h} d={d} mat="grey" />
      {/* modules: drawers (2x90), sink (180), DW (100), trash (80) — scaled to 530 */}
      {/* drawers stack 1 */}
      {[0, 1, 2].map(i => (
        <DrawerPh key={'a' + i} x={x0 + 6} y={y0 + 6 + i * 53} w="80" h="51" mat="grey" />
      ))}
      {[0, 1, 2].map(i => (
        <DrawerPh key={'b' + i} x={x0 + 96} y={y0 + 6 + i * 53} w="80" h="51" mat="grey" />
      ))}
      {/* sink module (under-mount visible) */}
      <ClosedDoorPh x={x0 + 186} y={y0 + 76} w="80" h="86" mat="grey" handleSide="right" />
      <ClosedDoorPh x={x0 + 274} y={y0 + 76} w="80" h="86" mat="grey" handleSide="left" />
      {/* sink top — cut into counter */}
      <rect x={x0 + 196} y={y0 - 8} width="148" height="6" fill="rgba(0,0,0,0.4)" />
      <rect x={x0 + 196} y={y0 - 8} width="148" height="6" fill="url(#ph-steel)" opacity="0.7" />
      {/* faucet */}
      <rect x={x0 + 264} y={y0 - 30} width="3" height="22" fill="url(#ph-steel)" />
      <path d={`M ${x0 + 264} ${y0 - 30} q 8 -4 16 0 v6`} fill="none" stroke="url(#ph-steel)" strokeWidth="3" />
      {/* DW */}
      <rect x={x0 + 364} y={y0 + 6} width="76" height={h - 12} fill="url(#ph-appliance)" />
      <rect x={x0 + 372} y={y0 + 14} width="60" height="14" rx="2" fill="rgba(0,0,0,0.4)" />
      {/* control panel */}
      <rect x={x0 + 372} y={y0 + 16} width="60" height="3" fill="#1a1a1a" />
      <circle cx={x0 + 376} cy={y0 + 22} r="1" fill="#5b8def" />
      <circle cx={x0 + 380} cy={y0 + 22} r="1" fill="#1f8a5b" />
      <rect x={x0 + 372} y={y0 + h - 24} width="60" height="6" rx="1" fill="rgba(0,0,0,0.3)" />
      {/* trash pull */}
      <ClosedDoorPh x={x0 + 446} y={y0 + 6} w="78" h={h - 12} mat="grey" handleSide="right" />
      {/* toe-kick */}
      <rect x={x0 + 4} y={y0 + h} width={w - 8} height="14" fill="#3a352c" />
      <rect x={x0 + 4} y={y0 + h} width={w - 8} height="2" fill="rgba(0,0,0,0.6)" />
    </PhCard>
  );
}

function PR_C_Pantry() {
  const x0 = 230, y0 = 50, w = 170, h = 280, d = 90;
  return (
    <PhCard code="KBX-CB-02 · TALL · 600w" title="Pantry Column"
      sub="Linen white doors · 5-tier wire pull-out half-extended">
      <ContactShadow cx={x0 + w / 2 + d * PRX / 2} cy={y0 + h + 14} rx={w / 2 + 40} ry="11" />
      <Box3D x={x0} y={y0} w={w} h={h} d={d} mat="cream" />
      {/* left door closed */}
      <ClosedDoorPh x={x0 + 4} y={y0 + 4} w={w / 2 - 4} h={h - 8} mat="cream" handleSide="right" />
      {/* right door swung open */}
      <Interior3D x={x0 + w / 2} y={y0 + 4} w={w / 2 - 4} h={h - 8} d={d - 10} />
      {/* wire pull-out tiers */}
      {[0, 1, 2, 3, 4].map(i => (
        <g key={i}>
          {/* tier base */}
          <rect x={x0 + w / 2 + 6} y={y0 + 14 + i * 52} width={w / 2 - 16} height="42"
            fill="rgba(40,30,20,0.6)" />
          {/* wire mesh */}
          {Array.from({ length: 5 }).map((_, k) => (
            <line key={k} x1={x0 + w / 2 + 8 + k * 14} y1={y0 + 14 + i * 52}
              x2={x0 + w / 2 + 8 + k * 14} y2={y0 + 56 + i * 52}
              stroke="url(#ph-steel)" strokeWidth="0.7" />
          ))}
          <line x1={x0 + w / 2 + 6} y1={y0 + 18 + i * 52} x2={x0 + w / 2 + w / 2 - 10} y2={y0 + 18 + i * 52}
            stroke="url(#ph-steel)" strokeWidth="0.5" />
          <line x1={x0 + w / 2 + 6} y1={y0 + 50 + i * 52} x2={x0 + w / 2 + w / 2 - 10} y2={y0 + 50 + i * 52}
            stroke="url(#ph-steel)" strokeWidth="0.5" />
          {/* contents — bottles, jars */}
          <rect x={x0 + w / 2 + 14} y={y0 + 22 + i * 52} width="8" height="30"
            fill={['#7a5840', '#5a3a30', '#4a4848', '#6a5050', '#3a4858'][i]} rx="1" />
          <rect x={x0 + w / 2 + 26} y={y0 + 26 + i * 52} width="10" height="26"
            fill={['#5a3a28', '#7a6048', '#3a4040', '#7a5040', '#4a4858'][i]} rx="1" />
          <rect x={x0 + w / 2 + 42} y={y0 + 24 + i * 52} width="12" height="28"
            fill={['#3a3a48', '#4a3a30', '#6a5848', '#3a3030', '#5a4040'][i]} rx="1" />
          <circle cx={x0 + w / 2 + 64} cy={y0 + 38 + i * 52} r="6" fill={['#7a5848', '#5a4040', '#6a5040', '#3a4858', '#4a3838'][i]} />
        </g>
      ))}
      <OpenDoorPh x={x0 + w - 4} y={y0 + 6} h={h - 12} dWide={50} dy={-10} hinge="right" mat="cream" />
      <rect x={x0 + 4} y={y0 + h} width={w - 8} height="6" fill="#7a756a" />
    </PhCard>
  );
}

function PR_C_Wall() {
  const x0 = 60, y0 = 90, w = 500, h = 130, d = 50;
  return (
    <PhCard code="KBX-CB-03 · WALL · 2400w" title="Overhead Wall Run"
      sub="Pebble grey · 4 lift-up doors · under-cabinet LED · counter beneath">
      <ContactShadow cx={x0 + w / 2 + d * PRX / 2} cy={y0 + 280} rx={w / 2 + 30} ry="9" />
      <Box3D x={x0} y={y0} w={w} h={h} d={d} mat="grey" />
      {[0, 1, 2, 3].map(i => {
        const dw = w / 4, dx = x0 + i * dw;
        return (
          <g key={i}>
            {i === 1 ? (
              <g>
                {/* lift-up partially open */}
                <path d={`M ${dx + 4} ${y0 + 4} L ${dx + dw - 4} ${y0 + 4} L ${dx + dw - 4} ${y0 + 30} L ${dx + 4} ${y0 + 30} Z`}
                  fill="url(#ph-grey)" />
                <path d={`M ${dx + 4} ${y0 + 30} L ${dx + dw - 4} ${y0 + 30} L ${dx + dw - 4} ${y0 + 38} L ${dx + 4} ${y0 + 38} Z`}
                  fill="rgba(0,0,0,0.5)" />
                {/* interior glimpse */}
                <rect x={dx + 6} y={y0 + 38} width={dw - 12} height={h - 60} fill="url(#ph-interior-rad)" />
                <Shelf x={dx + 8} y={y0 + 70} w={dw - 16} d={d - 8} mat="oak" />
                {/* dishes */}
                <ellipse cx={dx + dw / 2} cy={y0 + 68} rx="14" ry="3" fill="#e8e3d3" stroke="#9a958a" strokeWidth="0.5" />
                <ellipse cx={dx + dw / 2} cy={y0 + 64} rx="14" ry="3" fill="#e8e3d3" stroke="#9a958a" strokeWidth="0.5" />
              </g>
            ) : (
              <ClosedDoorPh x={dx + 4} y={y0 + 4} w={dw - 8} h={h - 8} mat="grey" handleSide="right" />
            )}
            {/* lift handle bottom */}
            {i !== 1 && (
              <rect x={dx + dw / 2 - 16} y={y0 + h - 16} width="32" height="3" rx="1" fill="url(#ph-steel)" />
            )}
          </g>
        );
      })}
      {/* LED strip + glow */}
      <rect x={x0} y={y0 + h} width={w} height="3" fill="#fff5d8" />
      <ellipse cx={x0 + w / 2} cy={y0 + h + 30} rx={w / 2} ry="20" fill="rgba(255,235,180,0.25)" filter="url(#ph-blur4)" />
      {/* counter */}
      <rect x={x0 - 14} y={y0 + h + 60} width={w + 28} height="12" fill="url(#ph-quartz)" />
      <path d={`M ${x0 - 14} ${y0 + h + 60} L ${x0 - 14 + d * PRX} ${y0 + h + 60 + d * PRY * 0.3} L ${x0 + w + 14 + d * PRX} ${y0 + h + 60 + d * PRY * 0.3} L ${x0 + w + 14} ${y0 + h + 60} Z`}
        fill="rgba(255,255,255,0.4)" />
    </PhCard>
  );
}

function PR_C_Island() {
  const x0 = 90, y0 = 130, w = 450, h = 170, d = 90;
  return (
    <PhCard code="KBX-CB-04 · ISLAND · 1800w" title="Island · Seat-Side"
      sub="Walnut base · stone overhang · 4-burner cooktop · 3 stools">
      <ContactShadow cx={x0 + w / 2 + d * PRX / 2} cy={y0 + h + 16} rx={w / 2 + 80} ry="14" />
      {/* counter overhang */}
      <Box3D x={x0 - 8} y={y0 - 14} w={w + 96} h="14" d={d} mat="cream" />
      <rect x={x0 - 8} y={y0 - 14} width={w + 96} height="14" fill="url(#ph-quartz)" />
      <path d={`M ${x0 - 8} ${y0 - 14} L ${x0 - 8 + d * PRX} ${y0 - 14 + d * PRY} L ${x0 + w + 88 + d * PRX} ${y0 - 14 + d * PRY} L ${x0 + w + 88} ${y0 - 14} Z`}
        fill="url(#ph-quartz)" />
      {/* base */}
      <Box3D x={x0} y={y0} w={w} h={h} d={d} mat="walnut" />
      {/* drawers + cooktop module + open shelves */}
      {[0, 1, 2].map(i => (
        <DrawerPh key={i} x={x0 + 6} y={y0 + 6 + i * 53} w="130" h="51" mat="walnut" />
      ))}
      {/* cooktop module */}
      <rect x={x0 + 144} y={y0 + 6} width="170" height={h - 12} fill="url(#ph-grain-walnut)" />
      {/* cooktop on counter */}
      <rect x={x0 + 154} y={y0 - 8} width="150" height="4" fill="#0a0604" />
      {[0, 1, 2, 3].map(i => (
        <g key={'c' + i}>
          <circle cx={x0 + 174 + i * 38} cy={y0 - 6} r="8" fill="#1a1410" />
          <circle cx={x0 + 174 + i * 38} cy={y0 - 6} r="6" fill="#3a2a18" />
          <circle cx={x0 + 174 + i * 38} cy={y0 - 6} r="2" fill="#c96442" />
        </g>
      ))}
      {/* duct void on front */}
      <rect x={x0 + 150} y={y0 + 6} width="158" height="50" fill="rgba(0,0,0,0.35)" />
      <text x={x0 + 229} y={y0 + 100} fill="rgba(255,255,255,0.3)" fontSize="9" {...phMono} textAnchor="middle">DUCT</text>
      {/* open shelves */}
      <Shelf x={x0 + 322} y={y0 + 26} w="120" d={d - 12} mat="walnut" />
      <Shelf x={x0 + 322} y={y0 + 80} w="120" d={d - 12} mat="walnut" />
      <Shelf x={x0 + 322} y={y0 + 134} w="120" d={d - 12} mat="walnut" />
      {/* objects on shelves */}
      <rect x={x0 + 332} y={y0 + 4} width="14" height="22" fill="#5a3a30" />
      <rect x={x0 + 350} y={y0 + 8} width="10" height="18" fill="#3a4858" />
      <ellipse cx={x0 + 380} cy={y0 + 22} rx="12" ry="4" fill="#c96442" />
      <rect x={x0 + 332} y={y0 + 56} width="40" height="22" rx="2" fill="#e8dec8" />
      <ellipse cx={x0 + 400} cy={y0 + 76} rx="14" ry="4" fill="#1a1410" />
      {/* toe */}
      <rect x={x0 + 4} y={y0 + h} width={w - 8} height="14" fill="#0a0604" />
      {/* stools beyond overhang */}
      {[0, 1, 2].map(i => (
        <g key={'s' + i}>
          <ellipse cx={x0 + w + 18 + i * 36} cy={y0 + 60} rx="14" ry="5" fill="rgba(0,0,0,0.3)" />
          <ellipse cx={x0 + w + 18 + i * 36} cy={y0 + 56} rx="14" ry="5" fill="url(#ph-walnut-top)" />
          <rect x={x0 + w + 16 + i * 36} y={y0 + 56} width="4" height="60" fill="url(#ph-steel)" />
          <ellipse cx={x0 + w + 18 + i * 36} cy={y0 + 116} rx="10" ry="3" fill="#3a342a" />
        </g>
      ))}
    </PhCard>
  );
}

function PR_C_Corner() {
  const x0 = 80, y0 = 130, h = 170, d = 80;
  const wA = 230, wB = 170;
  return (
    <PhCard code="KBX-CB-05 · L-CORNER · 1500+1200" title="L-Cabinet · Magic Corner"
      sub="Pebble grey · oven + microwave column · integrated fridge · magic-corner pull">
      <ContactShadow cx={x0 + (wA + wB) / 2} cy={y0 + h + 16} rx={(wA + wB) / 2 + 50} ry="13" />
      {/* counter */}
      <Box3D x={x0 - 6} y={y0 - 14} w={wA + wB + 32} h="14" d={d} mat="cream" />
      <rect x={x0 - 6} y={y0 - 14} width={wA + wB + 32} height="14" fill="url(#ph-quartz)" />
      <path d={`M ${x0 - 6} ${y0 - 14} L ${x0 - 6 + d * PRX} ${y0 - 14 + d * PRY} L ${x0 + wA + wB + 26 + d * PRX} ${y0 - 14 + d * PRY} L ${x0 + wA + wB + 26} ${y0 - 14} Z`}
        fill="url(#ph-quartz)" />
      {/* run A */}
      <Box3D x={x0} y={y0} w={wA} h={h} d={d} mat="grey" />
      {/* drawers */}
      {[0, 1, 2].map(j => (
        <DrawerPh key={'a' + j} x={x0 + 6} y={y0 + 6 + j * 53} w="68" h="51" mat="grey" />
      ))}
      {[0, 1, 2].map(j => (
        <DrawerPh key={'b' + j} x={x0 + 80} y={y0 + 6 + j * 53} w="68" h="51" mat="grey" />
      ))}
      {/* magic corner door swung */}
      <ClosedDoorPh x={x0 + 154} y={y0 + 6} w="70" h={h - 12} mat="grey" handleSide="left" />
      {/* corner extension hint */}
      <rect x={x0 + wA - 4} y={y0} width="8" height={h} fill="#3a352c" />
      {/* run B (oven + fridge stack — taller, but truncated to h here for context) */}
      <Box3D x={x0 + wA + 4} y={y0 - 80} w={wB} h={h + 80} d={d} mat="smoke" />
      {/* oven column */}
      <rect x={x0 + wA + 8} y={y0 - 76} width={wB / 2 - 8} height={h + 72} fill="url(#ph-appliance)" />
      <rect x={x0 + wA + 14} y={y0 - 70} width={wB / 2 - 20} height="50" rx="2" fill="#0a0604" />
      <rect x={x0 + wA + 18} y={y0 - 66} width={wB / 2 - 28} height="36" rx="1" fill="#1a1410" />
      <rect x={x0 + wA + 18} y={y0 - 66} width={wB / 2 - 28} height="36" rx="1" fill="rgba(255,180,80,0.18)" />
      <rect x={x0 + wA + 14} y={y0 - 14} width={wB / 2 - 20} height="50" rx="2" fill="#0a0604" />
      <rect x={x0 + wA + 18} y={y0 - 10} width={wB / 2 - 28} height="36" rx="1" fill="#1a1410" />
      <rect x={x0 + wA + 14} y={y0 + 44} width={wB / 2 - 20} height={h - 50} rx="2" fill="url(#ph-grey)" />
      <rect x={x0 + wA + wB / 2 - 14} y={y0 + 44 + (h - 50) / 2 - 2} width="8" height="3" fill="url(#ph-steel)" />
      {/* fridge column */}
      <rect x={x0 + wA + wB / 2 + 4} y={y0 - 76} width={wB / 2 - 8} height={h + 72} fill="url(#ph-appliance)" />
      <rect x={x0 + wA + wB / 2 + 4} y={y0 - 76} width={wB / 2 - 8} height={(h + 72) * 0.6} fill="url(#ph-appliance)" />
      <line x1={x0 + wA + wB / 2 + 4} y1={y0 - 76 + (h + 72) * 0.6} x2={x0 + wA + wB - 4} y2={y0 - 76 + (h + 72) * 0.6} stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
      <rect x={x0 + wA + wB - 14} y={y0 - 60} width="3" height="40" fill="url(#ph-steel)" />
      <rect x={x0 + wA + wB - 14} y={y0 + 24} width="3" height="60" fill="url(#ph-steel)" />
      {/* toe */}
      <rect x={x0 + 4} y={y0 + h} width={wA + wB - 4} height="14" fill="#1a1410" />
    </PhCard>
  );
}

/* ============================================================
   OFFICER DESKS (5)
   ============================================================ */

function PR_D_Linear() {
  const x0 = 90, y0 = 100, w = 440, dpL = 90, dpW = 130;
  return (
    <PhCard code="KBX-DS-01 · LINEAR · 1800×900" title="Linear Executive"
      sub="25mm walnut top · 2 fixed pedestals · cable cutout · ergo chair">
      <ContactShadow cx={x0 + w / 2 + 20} cy={y0 + 220} rx={w / 2 + 50} ry="14" />
      {/* legs / pedestals */}
      <Box3D x={x0 + 14} y={y0 + 14} w={dpW} h="180" d={dpL} mat="walnut" />
      {[0, 1, 2].map(i => (
        <DrawerPh key={i} x={x0 + 18} y={y0 + 20 + i * 56} w={dpW - 8} h="52" mat="walnut" />
      ))}
      <Box3D x={x0 + w - dpW - 14} y={y0 + 14} w={dpW} h="180" d={dpL} mat="walnut" />
      {[0, 1].map(i => (
        <DrawerPh key={'r' + i} x={x0 + w - dpW - 10} y={y0 + 20 + i * 36} w={dpW - 8} h="32" mat="walnut" />
      ))}
      {/* file drawer (taller) */}
      <DrawerPh x={x0 + w - dpW - 10} y={y0 + 92} w={dpW - 8} h="100" mat="walnut" />
      {/* desk top — thick slab */}
      <Box3D x={x0} y={y0} w={w} h="14" d={dpL + 30} mat="walnut" />
      <rect x={x0} y={y0} width={w} height="14" fill="url(#ph-grain-walnut)" />
      {/* grain on top */}
      <path d={`M ${x0} ${y0} L ${x0 + (dpL + 30) * PRX} ${y0 + (dpL + 30) * PRY} L ${x0 + w + (dpL + 30) * PRX} ${y0 + (dpL + 30) * PRY} L ${x0 + w} ${y0} Z`}
        fill="url(#ph-walnut-top)" />
      {/* cable grommet */}
      <ellipse cx={x0 + w / 2 + 15} cy={y0 + 18 * PRY} rx="10" ry="4" fill="#0a0604" />
      <ellipse cx={x0 + w / 2 + 15} cy={y0 + 18 * PRY} rx="8" ry="3" fill="url(#ph-steel)" />
      <circle cx={x0 + w / 2 + 14} cy={y0 + 18 * PRY - 1} r="2" fill="#0a0604" />
      {/* monitor */}
      <rect x={x0 + w / 2 - 70} y={y0 - 80} width="140" height="78" rx="3" fill="#0a0604" />
      <rect x={x0 + w / 2 - 66} y={y0 - 76} width="132" height="62" fill="#1a2a3a" />
      <rect x={x0 + w / 2 - 66} y={y0 - 76} width="132" height="62" fill="rgba(91,141,239,0.25)" />
      <rect x={x0 + w / 2 - 4} y={y0 - 4} width="8" height="6" fill="#1a1410" />
      <rect x={x0 + w / 2 - 16} y={y0 + 2} width="32" height="3" rx="1" fill="#1a1410" />
      {/* chair */}
      <ellipse cx={x0 + w / 2 + 30} cy={y0 + 250} rx="28" ry="10" fill="rgba(0,0,0,0.3)" />
      <rect x={x0 + w / 2 + 8} y={y0 + 200} width="44" height="36" rx="6" fill="url(#ph-fabric)" />
      <rect x={x0 + w / 2 + 16} y={y0 + 130} width="28" height="74" rx="8" fill="url(#ph-fabric)" />
      <rect x={x0 + w / 2 + 28} y={y0 + 232} width="4" height="20" fill="#1a1410" />
      {[0, 1, 2, 3, 4].map(i => {
        const ang = (i - 2) * 0.6;
        return (
          <g key={i}>
            <rect x={x0 + w / 2 + 30 - 1} y={y0 + 250} width="2" height="20"
              fill="url(#ph-steel)" transform={`rotate(${ang * 30} ${x0 + w / 2 + 30} ${y0 + 250})`} />
            <circle cx={x0 + w / 2 + 30 + Math.sin(ang) * 22} cy={y0 + 268 + Math.cos(ang) * 4} r="2.5" fill="#1a1410" />
          </g>
        );
      })}
    </PhCard>
  );
}

function PR_D_LShape() {
  const x0 = 70, y0 = 100;
  return (
    <PhCard code="KBX-DS-02 · L-SHAPE · 1800+1500" title="L-Shape Manager"
      sub="Walnut top · main + return · pedestal + lateral file">
      <ContactShadow cx={x0 + 240} cy={y0 + 230} rx="280" ry="15" />
      {/* return pedestal (right side) */}
      <Box3D x={x0 + 360} y={y0 + 14} w="120" h="180" d="80" mat="walnut" />
      <DrawerPh x={x0 + 364} y={y0 + 18} w="112" h="80" mat="walnut" />
      <DrawerPh x={x0 + 364} y={y0 + 102} w="112" h="88" mat="walnut" />
      {/* return top */}
      <Box3D x={x0 + 350} y={y0} w="140" h="14" d="100" mat="walnut" />
      <rect x={x0 + 350} y={y0} width="140" height="14" fill="url(#ph-grain-walnut)" />
      {/* main pedestal */}
      <Box3D x={x0 + 14} y={y0 + 14} w="120" h="180" d="90" mat="walnut" />
      {[0, 1, 2].map(i => (
        <DrawerPh key={i} x={x0 + 18} y={y0 + 20 + i * 56} w="112" h="52" mat="walnut" />
      ))}
      {/* main top */}
      <Box3D x={x0} y={y0} w="380" h="14" d="100" mat="walnut" />
      <rect x={x0} y={y0} width="380" height="14" fill="url(#ph-grain-walnut)" />
      {/* corner overlap shadow */}
      <rect x={x0 + 350} y={y0 + 14} width="30" height="20" fill="rgba(0,0,0,0.3)" />
      {/* monitor */}
      <rect x={x0 + 200} y={y0 - 76} width="120" height="68" rx="3" fill="#0a0604" />
      <rect x={x0 + 204} y={y0 - 72} width="112" height="52" fill="rgba(91,141,239,0.3)" />
      <rect x={x0 + 256} y={y0 - 8} width="8" height="6" fill="#1a1410" />
      {/* desk lamp */}
      <rect x={x0 + 40} y={y0 - 20} width="14" height="6" fill="url(#ph-brass)" />
      <rect x={x0 + 45} y={y0 - 60} width="3" height="40" fill="url(#ph-brass)" />
      <path d={`M ${x0 + 47} ${y0 - 60} q 12 -8 22 0 v6 q -12 -2 -22 -2 z`} fill="url(#ph-brass)" />
      {/* keyboard */}
      <rect x={x0 + 220} y={y0 - 6} width="80" height="6" rx="1" fill="#0a0604" />
      {/* pen + book */}
      <rect x={x0 + 110} y={y0 - 6} width="40" height="3" fill="#7a5840" />
      <rect x={x0 + 70} y={y0 - 14} width="32" height="20" fill="#3a4858" />
      {/* chair */}
      <ellipse cx={x0 + 270} cy={y0 + 250} rx="30" ry="10" fill="rgba(0,0,0,0.3)" />
      <rect x={x0 + 246} y={y0 + 200} width="48" height="36" rx="6" fill="url(#ph-fabric)" />
      <rect x={x0 + 254} y={y0 + 130} width="32" height="74" rx="8" fill="url(#ph-fabric)" />
      <rect x={x0 + 268} y={y0 + 232} width="4" height="20" fill="#1a1410" />
    </PhCard>
  );
}

function PR_D_SitStand() {
  const x0 = 110, y0 = 90, w = 380;
  return (
    <PhCard code="KBX-DS-03 · SIT-STAND · 1600×800" title="Height-Adjustable"
      sub="Bamboo top · 3-stage motor · in standing preset">
      <ContactShadow cx={x0 + w / 2 + 20} cy={y0 + 220} rx={w / 2 + 30} ry="12" />
      {/* legs (telescoping) */}
      <rect x={x0 + 30} y={y0 + 14} width="20" height="180" fill="url(#ph-steel)" />
      <rect x={x0 + 32} y={y0 + 14} width="2" height="180" fill="rgba(255,255,255,0.5)" />
      <rect x={x0 + 30} y={y0 + 14} width="20" height="60" fill="url(#ph-steel)" opacity="0.7" />
      <line x1={x0 + 30} y1={y0 + 76} x2={x0 + 50} y2={y0 + 76} stroke="rgba(0,0,0,0.5)" strokeWidth="0.6" />
      <line x1={x0 + 30} y1={y0 + 130} x2={x0 + 50} y2={y0 + 130} stroke="rgba(0,0,0,0.5)" strokeWidth="0.6" />
      <rect x={x0 + w - 50} y={y0 + 14} width="20" height="180" fill="url(#ph-steel)" />
      <rect x={x0 + w - 48} y={y0 + 14} width="2" height="180" fill="rgba(255,255,255,0.5)" />
      <line x1={x0 + w - 50} y1={y0 + 76} x2={x0 + w - 30} y2={y0 + 76} stroke="rgba(0,0,0,0.5)" strokeWidth="0.6" />
      <line x1={x0 + w - 50} y1={y0 + 130} x2={x0 + w - 30} y2={y0 + 130} stroke="rgba(0,0,0,0.5)" strokeWidth="0.6" />
      {/* feet */}
      <rect x={x0 + 14} y={y0 + 194} width="56" height="6" fill="#1a1410" />
      <rect x={x0 + w - 70} y={y0 + 194} width="56" height="6" fill="#1a1410" />
      {/* top */}
      <Box3D x={x0} y={y0} w={w} h="14" d="80" mat="oak" />
      <rect x={x0} y={y0} width={w} height="14" fill="url(#ph-grain-oak)" />
      {/* preset pad */}
      <rect x={x0 + w / 2 - 30} y={y0 + 18} width="60" height="14" rx="2" fill="#0a0604" />
      {[0, 1, 2, 3].map(i => (
        <circle key={i} cx={x0 + w / 2 - 21 + i * 14} cy={y0 + 25} r="2.5" fill={i === 1 ? '#c96442' : '#3a342a'} />
      ))}
      {/* monitor + laptop */}
      <rect x={x0 + w / 2 - 70} y={y0 - 76} width="140" height="76" rx="3" fill="#0a0604" />
      <rect x={x0 + w / 2 - 66} y={y0 - 72} width="132" height="60" fill="rgba(91,141,239,0.25)" />
      <rect x={x0 + w / 2 - 4} y={y0 - 2} width="8" height="6" fill="#1a1410" />
      <rect x={x0 + 80} y={y0 - 10} width="60" height="6" fill="#1a1410" />
      <rect x={x0 + 82} y={y0 - 28} width="56" height="20" fill="rgba(91,141,239,0.2)" />
      <rect x={x0 + 80} y={y0 - 30} width="60" height="2" fill="#3a342a" />
    </PhCard>
  );
}

function PR_D_Bench() {
  const x0 = 60, y0 = 130, w = 500;
  return (
    <PhCard code="KBX-DS-04 · BENCH · 4-PERSON" title="Bench · 4 Seats"
      sub="Shared run · 4 stations · centre power spine · 4 mobile pedestals">
      <ContactShadow cx={x0 + w / 2 + 20} cy={y0 + 220} rx={w / 2 + 60} ry="14" />
      {/* legs (3) */}
      {[0, 1, 2].map(i => (
        <rect key={i} x={x0 + 14 + i * (w - 32) / 2} y={y0 + 12} width="14" height="160"
          fill="url(#ph-steel)" />
      ))}
      {/* feet */}
      {[0, 1, 2].map(i => (
        <rect key={i} x={x0 + 6 + i * (w - 32) / 2} y={y0 + 170} width="34" height="6" fill="#1a1410" />
      ))}
      {/* bench top */}
      <Box3D x={x0} y={y0} w={w} h="14" d="100" mat="oak" />
      <rect x={x0} y={y0} width={w} height="14" fill="url(#ph-grain-oak)" />
      {/* power spine raised */}
      <rect x={x0 + 4} y={y0 + 4} width={w - 8} height="6" fill="rgba(0,0,0,0.4)" />
      <rect x={x0 + 4} y={y0 + 4} width={w - 8} height="2" fill="rgba(0,0,0,0.6)" />
      {/* mobile pedestals under */}
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <rect x={x0 + 30 + i * (w - 100) / 3} y={y0 + 80} width="60" height="80" fill="url(#ph-grey)" />
          <rect x={x0 + 32 + i * (w - 100) / 3} y={y0 + 100} width="56" height="3" fill="rgba(0,0,0,0.5)" />
          <rect x={x0 + 32 + i * (w - 100) / 3} y={y0 + 130} width="56" height="3" fill="rgba(0,0,0,0.5)" />
          {[0, 1].map(k => (
            <circle key={k} cx={x0 + 38 + i * (w - 100) / 3 + k * 48} cy={y0 + 165} r="4" fill="#1a1410" />
          ))}
        </g>
      ))}
      {/* monitors x2 visible */}
      {[0, 1].map(i => (
        <g key={i}>
          <rect x={x0 + 60 + i * 220} y={y0 - 70} width="100" height="60" rx="2" fill="#0a0604" />
          <rect x={x0 + 64 + i * 220} y={y0 - 66} width="92" height="46" fill="rgba(91,141,239,0.25)" />
        </g>
      ))}
      {/* divider screen */}
      <rect x={x0 + 4} y={y0 - 40} width={w - 8} height="40" fill="url(#ph-fabric)" opacity="0.8" />
      <rect x={x0 + 4} y={y0 - 40} width={w - 8} height="2" fill="rgba(255,255,255,0.2)" />
    </PhCard>
  );
}

function PR_D_Reception() {
  const x0 = 90, y0 = 90, w = 460;
  return (
    <PhCard code="KBX-DS-05 · RECEPTION · curved" title="Reception · Console"
      sub="Walnut fluted front · raised transaction shelf · Kreobox brand panel">
      <ContactShadow cx={x0 + w / 2 + 20} cy={y0 + 240} rx={w / 2 + 40} ry="13" />
      {/* base */}
      <path d={`M ${x0} ${y0 + 30} Q ${x0 + w / 2} ${y0 + 6} ${x0 + w} ${y0 + 30} L ${x0 + w} ${y0 + 200} L ${x0} ${y0 + 200} Z`}
        fill="url(#ph-grain-walnut)" />
      {/* fluted lines */}
      {Array.from({ length: 14 }).map((_, i) => {
        const t = i / 13;
        const cx = x0 + t * w;
        const cy = y0 + 30 + Math.sin(Math.PI * t) * -24 + 24 * Math.sin(Math.PI * t);
        const yy = y0 + 30 - Math.sin(Math.PI * t) * 24;
        return (
          <line key={i} x1={cx} y1={yy + 30} x2={cx} y2={y0 + 200}
            stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
        );
      })}
      {/* highlight per flute */}
      {Array.from({ length: 14 }).map((_, i) => {
        const t = i / 13 + 0.02;
        const cx = x0 + t * w;
        const yy = y0 + 30 - Math.sin(Math.PI * t) * 24;
        return (
          <line key={i} x1={cx} y1={yy + 32} x2={cx} y2={y0 + 200}
            stroke="rgba(255,235,200,0.18)" strokeWidth="1" />
        );
      })}
      {/* top transaction shelf */}
      <path d={`M ${x0 - 4} ${y0 + 30} Q ${x0 + w / 2} ${y0 + 6} ${x0 + w + 4} ${y0 + 30} L ${x0 + w + 4} ${y0 + 42} Q ${x0 + w / 2} ${y0 + 18} ${x0 - 4} ${y0 + 42} Z`}
        fill="url(#ph-quartz)" />
      {/* brand plate */}
      <rect x={x0 + w / 2 - 80} y={y0 + 100} width="160" height="60" fill="#c96442" />
      <text x={x0 + w / 2} y={y0 + 138} fill="#fcf6e8" fontSize="20" fontWeight="700"
        fontFamily='"Fraunces", Georgia, serif' textAnchor="middle" letterSpacing="0.2em">KREOBOX</text>
      {/* base shadow band */}
      <rect x={x0} y={y0 + 195} width={w} height="6" fill="rgba(0,0,0,0.5)" />
    </PhCard>
  );
}

/* ============================================================
   STORAGE / SHELVES (5)
   ============================================================ */

function PR_S_Library() {
  const x0 = 110, y0 = 50, w = 400, h = 290, d = 60;
  return (
    <PhCard code="KBX-ST-01 · LIBRARY · 2400h" title="Open Library Shelf"
      sub="Walnut · 6 shelves · books and objects · solid back · floor-anchored">
      <ContactShadow cx={x0 + w / 2 + 14} cy={y0 + h + 14} rx={w / 2 + 30} ry="11" />
      {/* outer carcass */}
      <Box3D x={x0} y={y0} w={w} h={h} d={d} mat="walnut" />
      {/* interior back */}
      <rect x={x0 + 4} y={y0 + 4} width={w - 8} height={h - 8} fill="url(#ph-interior)" />
      {/* shelves + books */}
      {[0, 1, 2, 3, 4, 5].map(row => {
        const sy = y0 + 4 + (row + 1) * (h - 8) / 6 - 4;
        return (
          <g key={row}>
            <Shelf x={x0 + 4} y={sy} w={w - 8} d={d - 8} mat="walnut" />
            {/* books */}
            {Array.from({ length: 11 + (row % 2) }).map((_, i) => {
              const colors = ['#7a3a28', '#3a4858', '#5a3a30', '#2a3848', '#7a5840', '#3a3038',
                '#6a5040', '#1a2a3a', '#4a4848', '#5a4030', '#3a4040'];
              const heights = [38, 32, 36, 30, 40, 34, 32, 38, 36, 30, 38, 34];
              const wB = (w - 16) / (11 + (row % 2));
              return (
                <g key={i}>
                  <rect x={x0 + 8 + i * wB} y={sy - heights[i % heights.length]}
                    width={wB - 1} height={heights[i % heights.length]}
                    fill={colors[(i + row * 3) % colors.length]} />
                  <rect x={x0 + 9 + i * wB} y={sy - heights[i % heights.length]}
                    width="0.6" height={heights[i % heights.length]}
                    fill="rgba(255,255,255,0.3)" />
                </g>
              );
            })}
          </g>
        );
      })}
      {/* highlight on top of carcass */}
      <rect x={x0} y={y0} width={w} height="2" fill="rgba(255,255,255,0.2)" />
    </PhCard>
  );
}

function PR_S_Credenza() {
  const x0 = 70, y0 = 170, w = 480, h = 130, d = 80;
  return (
    <PhCard code="KBX-ST-02 · CREDENZA · 1800w" title="Low Credenza"
      sub="Walnut · brass legs · 2 doors + 4 drawers · vase + lamp on top">
      <ContactShadow cx={x0 + w / 2 + 14} cy={y0 + h + 28} rx={w / 2 + 30} ry="10" />
      {/* objects on top */}
      <ellipse cx={x0 + 70} cy={y0 - 6} rx="22" ry="6" fill="#c96442" />
      <ellipse cx={x0 + 70} cy={y0 - 36} rx="14" ry="6" fill="#c96442" />
      <rect x={x0 + 56} y={y0 - 36} width="28" height="32" fill="#c96442" />
      <rect x={x0 + 70} y={y0 - 38} width="2" height="34" fill="rgba(255,255,255,0.4)" />
      <rect x={x0 + 130} y={y0 - 30} width="50" height="28" fill="#7a5840" />
      <rect x={x0 + 130} y={y0 - 30} width="50" height="3" fill="#5a3a28" />
      <rect x={x0 + 220} y={y0 - 26} width="80" height="22" fill="#3a4858" />
      {/* lamp */}
      <rect x={x0 + 384} y={y0 - 60} width="40" height="56" fill="none" stroke="url(#ph-brass)" strokeWidth="2" />
      <ellipse cx={x0 + 404} cy={y0 - 60} rx="22" ry="4" fill="url(#ph-brass)" />
      <path d={`M ${x0 + 384} ${y0 - 60} L ${x0 + 396} ${y0 - 12} L ${x0 + 412} ${y0 - 12} L ${x0 + 424} ${y0 - 60} Z`}
        fill="url(#ph-cream)" opacity="0.8" />
      <rect x={x0 + 402} y={y0 - 12} width="4" height="6" fill="url(#ph-brass)" />
      {/* carcass */}
      <Box3D x={x0} y={y0} w={w} h={h} d={d} mat="walnut" />
      {/* 2 doors left */}
      <ClosedDoorPh x={x0 + 4} y={y0 + 4} w="116" h={h - 8} mat="walnut" handleSide="right" />
      <ClosedDoorPh x={x0 + 124} y={y0 + 4} w="116" h={h - 8} mat="walnut" handleSide="left" />
      {/* 4 drawers right */}
      {[0, 1, 2, 3].map(i => (
        <DrawerPh key={i} x={x0 + 244} y={y0 + 4 + i * 30.5} w={w - 248} h="29" mat="walnut" />
      ))}
      {/* brass legs */}
      <rect x={x0 + 4} y={y0 + h} width="10" height="20" fill="url(#ph-brass)" />
      <rect x={x0 + w - 14} y={y0 + h} width="10" height="20" fill="url(#ph-brass)" />
      <rect x={x0 + 4} y={y0 + h + 18} width="10" height="2" fill="#3a2615" />
      <rect x={x0 + w - 14} y={y0 + h + 18} width="10" height="2" fill="#3a2615" />
    </PhCard>
  );
}

function PR_S_Lockers() {
  const x0 = 70, y0 = 50, bayW = 80, h = 290, d = 60, gap = 4;
  const colors = [
    { m: 'cream', acc: '#5b8def' }, { m: 'oak', acc: '#c96442' }, { m: 'cream', acc: '#7c5cff' },
    { m: 'oak', acc: '#1f8a5b' }, { m: 'cream', acc: '#5b8def' }, { m: 'oak', acc: '#c96442' },
  ];
  return (
    <PhCard code="KBX-ST-03 · LOCKER · 6-PERSON" title="Locker Bank · 6"
      sub="Mixed cream + oak doors · RFID lock · personal nameplate · vent slots">
      <ContactShadow cx={x0 + 3 * (bayW + gap)} cy={y0 + h + 14} rx="280" ry="12" />
      <Box3D x={x0} y={y0} w={6 * bayW + 5 * gap} h={h} d={d} mat="cream" />
      {colors.map((c, i) => {
        const x = x0 + i * (bayW + gap) + gap / 2;
        return (
          <g key={i}>
            <ClosedDoorPh x={x + 3} y={y0 + 4} w={bayW - 6} h={h - 8} mat={c.m} handleSide="right" />
            {/* RFID pad */}
            <rect x={x + bayW / 2 - 11} y={y0 + 30} width="22" height="14" rx="2" fill="#0a0604" />
            <circle cx={x + bayW / 2} cy={y0 + 37} r="3" fill={c.acc} />
            {/* vent */}
            {[0, 1, 2, 3].map(k => (
              <rect key={k} x={x + bayW / 2 - 14} y={y0 + 70 + k * 5} width="28" height="2" fill="rgba(0,0,0,0.4)" />
            ))}
            {/* nameplate */}
            <rect x={x + bayW / 2 - 22} y={y0 + 110} width="44" height="14" fill="url(#ph-cream)" stroke={c.acc} strokeWidth="0.6" />
            <text x={x + bayW / 2} y={y0 + 120} fill="#1a1815" fontSize="8" {...phMono} textAnchor="middle">USR-{(i + 1).toString().padStart(2, '0')}</text>
            {/* number */}
            <text x={x + bayW / 2} y={y0 + h - 26} fill={c.acc} fontSize="22" {...phFr} textAnchor="middle" fontWeight="500">{i + 1}</text>
          </g>
        );
      })}
      <rect x={x0 + 4} y={y0 + h} width={6 * bayW + 5 * gap - 8} height="6" fill="#3a352c" />
    </PhCard>
  );
}

function PR_S_CubeGrid() {
  const x0 = 100, y0 = 50, n = 5, m = 5, cell = 56, d = 50;
  return (
    <PhCard code="KBX-ST-04 · CUBE · 5×5" title="Modular Cube Grid"
      sub="Oak frame · mixed inserts · door / drawer / open / plant / box">
      <ContactShadow cx={x0 + n * cell / 2 + 12} cy={y0 + m * cell + 14} rx={n * cell / 2 + 30} ry="11" />
      <Box3D x={x0} y={y0} w={n * cell} h={m * cell} d={d} mat="oak" />
      {/* dark interior shadow behind everything */}
      <rect x={x0 + 4} y={y0 + 4} width={n * cell - 8} height={m * cell - 8} fill="#3a2818" />
      {/* dividers */}
      {[1, 2, 3, 4].map(i => (
        <rect key={'v' + i} x={x0 + i * cell - 1} y={y0 + 4} width="3" height={m * cell - 8} fill="url(#ph-grain-oak)" />
      ))}
      {[1, 2, 3, 4].map(i => (
        <rect key={'h' + i} x={x0 + 4} y={y0 + i * cell - 1} width={n * cell - 8} height="3" fill="url(#ph-grain-oak)" />
      ))}
      {/* contents per cube */}
      {Array.from({ length: m }).map((_, r) =>
        Array.from({ length: n }).map((_, c) => {
          const kind = (r * 7 + c * 3) % 6;
          const cx = x0 + c * cell + 2, cy = y0 + r * cell + 2;
          const cs = cell - 4;
          if (kind === 1) {
            // door
            return (
              <g key={`${r}-${c}`}>
                <ClosedDoorPh x={cx} y={cy} w={cs} h={cs} mat="cream" handleSide="right" />
              </g>
            );
          } else if (kind === 2) {
            // drawer
            return <DrawerPh key={`${r}-${c}`} x={cx} y={cy + cs / 4} w={cs} h={cs / 2} mat="cream" />;
          } else if (kind === 3) {
            // plant
            return (
              <g key={`${r}-${c}`}>
                <rect x={cx} y={cy} width={cs} height={cs} fill="rgba(40,30,20,0.7)" />
                <rect x={cx + cs / 2 - 10} y={cy + cs - 18} width="20" height="14" fill="#7a5840" />
                <ellipse cx={cx + cs / 2 - 6} cy={cy + cs - 24} rx="6" ry="10" fill="#3a5a3a" />
                <ellipse cx={cx + cs / 2 + 4} cy={cy + cs - 28} rx="5" ry="12" fill="#4a6a4a" />
                <ellipse cx={cx + cs / 2 + 8} cy={cy + cs - 22} rx="4" ry="10" fill="#3a5a3a" />
              </g>
            );
          } else if (kind === 4) {
            // box
            return (
              <g key={`${r}-${c}`}>
                <rect x={cx} y={cy} width={cs} height={cs} fill="rgba(40,30,20,0.7)" />
                <rect x={cx + 4} y={cy + cs - 28} width={cs - 8} height="24" fill="#a89478" />
                <rect x={cx + 4} y={cy + cs - 28} width={cs - 8} height="3" fill="#7a6450" />
              </g>
            );
          } else {
            // open or shelf
            return (
              <g key={`${r}-${c}`}>
                <rect x={cx} y={cy} width={cs} height={cs} fill="url(#ph-interior-rad)" />
                {/* random object */}
                {(r + c) % 3 === 0 && <rect x={cx + 6} y={cy + cs - 28} width={cs - 12} height="24" fill={['#7a3a28', '#3a4858', '#5a3a30'][(r + c) % 3]} />}
              </g>
            );
          }
        })
      )}
    </PhCard>
  );
}

function PR_S_FilingTower() {
  const x0 = 220, y0 = 50, w = 180, h = 280, d = 80;
  return (
    <PhCard code="KBX-ST-05 · FILING · 600w" title="Filing Tower"
      sub="Smoked walnut · 4 deep drawers · A4 + foolscap · suspension rails · 3rd open">
      <ContactShadow cx={x0 + w / 2 + 14} cy={y0 + h + 14} rx={w / 2 + 30} ry="11" />
      <Box3D x={x0} y={y0} w={w} h={h} d={d} mat="smoke" />
      {/* drawers — 3rd one open */}
      {[0, 1, 2, 3].map(i => {
        const isOpen = i === 2;
        return (
          <g key={i}>
            {!isOpen ? (
              <DrawerPh x={x0 + 4} y={y0 + 4 + i * 68} w={w - 8} h="66" mat="smoke" />
            ) : (
              <g>
                {/* drawer pulled forward — visible side wall + top */}
                <Interior3D x={x0 + 4} y={y0 + 4 + i * 68} w={w - 8} h="66" d={d - 8} />
                {/* drawer body sticking out */}
                <rect x={x0 - 30} y={y0 + 8 + i * 68} width={w} height="58" fill="url(#ph-grain-smoke)" />
                <rect x={x0 - 30} y={y0 + 8 + i * 68} width={w} height="2" fill="rgba(255,255,255,0.2)" />
                <rect x={x0 - 30} y={y0 + 8 + i * 68 + 56} width={w} height="2" fill="rgba(0,0,0,0.6)" />
                {/* hanging files */}
                {Array.from({ length: 14 }).map((_, k) => (
                  <rect key={k} x={x0 - 24 + k * (w - 12) / 14} y={y0 + 12 + i * 68}
                    width="8" height="50"
                    fill={['#a89478', '#9a8466', '#b8a48a', '#9a8466', '#a89478'][k % 5]} />
                ))}
                {Array.from({ length: 14 }).map((_, k) => (
                  <rect key={'tab' + k} x={x0 - 24 + k * (w - 12) / 14} y={y0 + 6 + i * 68}
                    width="8" height="6" fill="#5a4838" />
                ))}
                {/* label tag */}
                <rect x={x0 - 18} y={y0 + 38 + i * 68} width="40" height="14" fill="#fcf6e8" stroke="#7a3a28" />
                <text x={x0 + 2} y={y0 + 48 + i * 68} fill="#3a2818" fontSize="8" {...phMono} textAnchor="middle">M–S</text>
              </g>
            )}
            {/* handle on closed */}
            {!isOpen && <rect x={x0 + w / 2 - 22} y={y0 + 4 + i * 68 + 30} width="44" height="3" rx="1" fill="url(#ph-steel)" />}
            {/* closed drawer label */}
            {!isOpen && <rect x={x0 + 14} y={y0 + 14 + i * 68} width="38" height="14" fill="rgba(252,246,232,0.85)" stroke="#7a3a28" strokeWidth="0.6" />}
            {!isOpen && <text x={x0 + 33} y={y0 + 24 + i * 68} fill="#3a2818" fontSize="8" {...phMono} textAnchor="middle">{['A–F', 'G–L', 'M–S', 'T–Z'][i]}</text>}
          </g>
        );
      })}
      <rect x={x0 + 4} y={y0 + h} width={w - 8} height="6" fill="#0a0604" />
    </PhCard>
  );
}

Object.assign(window, {
  PR_W_Compact, PR_W_DoubleHang, PR_W_Walkin, PR_W_Sliding, PR_W_Corner,
  PR_C_BaseRun, PR_C_Pantry, PR_C_Wall, PR_C_Island, PR_C_Corner,
  PR_D_Linear, PR_D_LShape, PR_D_SitStand, PR_D_Bench, PR_D_Reception,
  PR_S_Library, PR_S_Credenza, PR_S_Lockers, PR_S_CubeGrid, PR_S_FilingTower,
});
