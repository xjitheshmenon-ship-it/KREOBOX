/* ============================================================
   KREOBOX · 3/4 perspective renders — wardrobes
   Cabinet-projection, doors swung open, interior visible.
   Same colour key as elevation panels but warmer + shaded.
   ============================================================ */

const pInk    = '#1a1815';
const pPaper  = '#fafaf7';
const pBg     = '#f0eee9';
const pMute   = 'rgba(26,24,21,0.55)';
const pLine   = 'rgba(26,24,21,0.10)';
const pAccent = '#c96442';

/* warm material palette (matches reference) */
const carcassFront = '#ece6d6';     // warm cream
const carcassTop   = '#d8d2c2';     // shadow side
const carcassDeep  = '#b8b09c';     // deep side
const interior     = '#cfc3a8';     // inner back
const interiorDark = '#b3a684';     // inner shadow
const doorFace     = '#d4cab8';     // door face
const doorEdge     = '#bfb39d';     // door edge
const oakFace      = '#d4ad77';
const oakGrain     = '#b88f5b';
const shelfTop     = '#dbcdac';
const shelfShade   = '#a99479';
const rodSilver    = '#9a9183';
const basketWire   = 'rgba(255,255,255,0.85)';

const pMonoFont = { fontFamily: 'JetBrains Mono, monospace' };
const pFrFont   = { fontFamily: '"Fraunces", Georgia, serif' };

/* projection — cabinet-ish, depth recedes upper-right */
const PX = 0.42;     // d*PX horizontal
const PY = -0.55;    // d*PY vertical (negative = up)

/* ── card chrome (matches the elevation cards) ───────────────── */
function PerspCard({ code, title, sub, children, bg = pBg }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: pPaper,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 18px 10px', borderBottom: `1px solid ${pLine}`,
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ ...pMonoFont, fontSize: 10, letterSpacing: '0.18em', color: pMute, fontWeight: 700 }}>{code}</div>
          <div style={{ ...pFrFont, fontSize: 22, marginTop: 3, letterSpacing: '-0.01em', lineHeight: 1.05 }}>{title}</div>
        </div>
        <div style={{ ...pMonoFont, fontSize: 10, color: pMute }}>3/4 view · render</div>
      </div>
      <div style={{ flex: 1, position: 'relative', background: bg }}>
        <svg viewBox="0 0 620 380" style={{ width: '100%', height: '100%', display: 'block' }}>
          {children}
        </svg>
      </div>
      <div style={{
        padding: '10px 18px', borderTop: `1px solid ${pLine}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        ...pMonoFont, fontSize: 10, color: pMute,
      }}>
        <span>{sub}</span>
        <span style={{ color: pInk, fontWeight: 700 }}>kreobox.in</span>
      </div>
    </div>
  );
}

/* ── floor shadow ellipse ─────────────────────────────────────── */
function FloorShadow({ cx, cy, rx, ry = 8 }) {
  return (
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
      fill="rgba(26,24,21,0.18)" filter="blur(2px)" />
  );
}

/* ── BAY: a single carcass column rendered in 3D ──────────────
   Each bay is a closed rectangular tube. We draw only the
   visible faces: top (parallelogram), front (rect), right side
   (parallelogram). The interior modules render on top of the front.
   ───────────────────────────────────────────────────────────── */
function Carcass3D({ x, y, w, h, d, oak = false }) {
  const dx = d * PX, dy = d * PY;
  // top face
  const topPath = `M ${x} ${y} L ${x + dx} ${y + dy} L ${x + w + dx} ${y + dy} L ${x + w} ${y} Z`;
  // right side face
  const sidePath = `M ${x + w} ${y} L ${x + w + dx} ${y + dy} L ${x + w + dx} ${y + h + dy} L ${x + w} ${y + h} Z`;
  return (
    <g>
      <path d={topPath} fill={oak ? oakFace : carcassTop} stroke={pInk} strokeWidth="0.8" strokeOpacity="0.4" />
      <path d={sidePath} fill={oak ? oakFace : carcassDeep} stroke={pInk} strokeWidth="0.8" strokeOpacity="0.4" />
      {/* oak grain hatch */}
      {oak && Array.from({ length: 7 }).map((_, i) => (
        <line key={i}
          x1={x + w + dx * (i + 1) / 8} y1={y + dy * (i + 1) / 8}
          x2={x + w + dx * (i + 1) / 8} y2={y + h + dy * (i + 1) / 8}
          stroke={oakGrain} strokeWidth="0.6" opacity="0.6" />
      ))}
    </g>
  );
}

/* ── interior back wall + side wall (when bay is open) ───────── */
function BayInterior({ x, y, w, h, d }) {
  const dx = d * PX, dy = d * PY;
  // back wall (offset by dx,dy)
  const backX = x + dx, backY = y + dy;
  // left interior side (parallelogram)
  const leftSidePath = `M ${x} ${y} L ${backX} ${backY} L ${backX} ${backY + h} L ${x} ${y + h} Z`;
  return (
    <g>
      <path d={leftSidePath} fill={interiorDark} />
      <rect x={backX} y={backY} width={w} height={h} fill={interior} />
      {/* bottom interior */}
      <path d={`M ${x} ${y + h} L ${backX} ${backY + h} L ${backX + w} ${backY + h} L ${x + w} ${y + h} Z`}
        fill={interiorDark} opacity="0.7" />
      {/* faint vertical hinge edge on the left */}
      <line x1={x} y1={y} x2={x} y2={y + h} stroke={pInk} strokeWidth="0.6" opacity="0.4" />
    </g>
  );
}

/* ── shelf inside an open bay ─────────────────────────────────── */
function Shelf3D({ x, y, w, d, t = 4 }) {
  const dx = d * PX, dy = d * PY;
  return (
    <g>
      <path d={`M ${x} ${y} L ${x + dx} ${y + dy} L ${x + w + dx} ${y + dy} L ${x + w} ${y} Z`}
        fill={shelfTop} stroke={pInk} strokeWidth="0.4" strokeOpacity="0.3" />
      <rect x={x} y={y} width={w} height={t} fill={shelfShade} />
    </g>
  );
}

/* ── hanging rod ─────────────────────────────────────────────── */
function Rod3D({ x, y, w, d }) {
  const dx = d * PX * 0.5, dy = d * PY * 0.5;
  return (
    <g>
      <line x1={x} y1={y} x2={x + w} y2={y} stroke={rodSilver} strokeWidth="2.5" />
      <line x1={x + 4} y1={y - 6} x2={x + 4 + dx * 0.4} y2={y - 6 + dy * 0.4} stroke={rodSilver} strokeWidth="1" />
      <line x1={x + w - 4} y1={y - 6} x2={x + w - 4 + dx * 0.4} y2={y - 6 + dy * 0.4} stroke={rodSilver} strokeWidth="1" />
      {/* hangers */}
      {[0.15, 0.35, 0.55, 0.7, 0.88].map((p, i) => {
        const hx = x + w * p;
        return (
          <g key={i}>
            <path d={`M ${hx} ${y} q -1 4 -7 6 q 16 4 16 14 q 0 6 -10 8 q -10 -2 -10 -8 q 0 -10 16 -14 q -6 -2 -7 -6`}
              fill="none" stroke={pInk} strokeOpacity="0.5" strokeWidth="0.7" />
          </g>
        );
      })}
    </g>
  );
}

/* ── wire basket ─────────────────────────────────────────────── */
function Basket3D({ x, y, w, h, d }) {
  const dx = d * PX, dy = d * PY;
  return (
    <g>
      {/* basket body — front + top wireframe */}
      <path d={`M ${x} ${y + h} L ${x + dx * 0.7} ${y + h + dy * 0.7} L ${x + w + dx * 0.7} ${y + h + dy * 0.7} L ${x + w} ${y + h} Z`}
        fill="rgba(255,255,255,0.7)" stroke={shelfShade} strokeWidth="0.6" />
      <path d={`M ${x} ${y} L ${x + dx * 0.7} ${y + dy * 0.7} L ${x + w + dx * 0.7} ${y + dy * 0.7} L ${x + w} ${y} Z`}
        fill="none" stroke={shelfShade} strokeWidth="0.7" />
      <rect x={x} y={y} width={w} height={h} fill="rgba(255,255,255,0.6)" stroke={shelfShade} strokeWidth="0.7" />
      {/* mesh */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={'v' + i} x1={x + (i + 1) * w / 9} y1={y} x2={x + (i + 1) * w / 9} y2={y + h}
          stroke={shelfShade} strokeWidth="0.5" opacity="0.7" />
      ))}
      {Array.from({ length: 3 }).map((_, i) => (
        <line key={'h' + i} x1={x} y1={y + (i + 1) * h / 4} x2={x + w} y2={y + (i + 1) * h / 4}
          stroke={shelfShade} strokeWidth="0.5" opacity="0.7" />
      ))}
    </g>
  );
}

/* ── closed door (front face, with hinges + handle) ──────────── */
function ClosedDoor({ x, y, w, h, hinge = 'left', handleSide = 'right', face = doorFace, edge = doorEdge }) {
  const inset = 4;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={face} />
      <rect x={x + inset} y={y + inset} width={w - 2 * inset} height={h - 2 * inset}
        fill="none" stroke={edge} strokeWidth="0.6" opacity="0.6" />
      {/* subtle vertical highlight */}
      <rect x={x + 2} y={y + 8} width="2" height={h - 16} fill="rgba(255,255,255,0.45)" />
      {/* hinge dots */}
      {hinge && [0.18, 0.5, 0.82].map((p, i) => (
        <circle key={i} cx={hinge === 'left' ? x + 4 : x + w - 4} cy={y + h * p} r="2"
          fill="#7a7466" />
      ))}
      {/* handle */}
      <rect x={handleSide === 'right' ? x + w - 14 : x + 8} y={y + h / 2 - 18}
        width="6" height="36" rx="2" fill={pInk} opacity="0.55" />
    </g>
  );
}

/* ── opened door (foreshortened parallelogram) ───────────────── */
function OpenDoor({ x, y, h, dWide = 70, dy = -10, hinge = 'left' }) {
  // hinged at (x,y); swings forward-left
  // dWide = horizontal projection length, dy = top vertical drift
  const sign = hinge === 'left' ? -1 : 1;
  const tipX = x + sign * dWide;
  const tipY = y + dy;
  const path = `M ${x} ${y} L ${tipX} ${tipY} L ${tipX} ${tipY + h} L ${x} ${y + h} Z`;
  return (
    <g>
      <path d={path} fill={doorFace} stroke={pInk} strokeOpacity="0.35" strokeWidth="0.8" />
      {/* inside of door (slightly darker face nearer viewer) */}
      <path d={`M ${x} ${y} L ${x + sign * dWide * 0.04} ${y + dy * 0.04} L ${x + sign * dWide * 0.04} ${y + h + dy * 0.04} L ${x} ${y + h} Z`}
        fill={doorEdge} opacity="0.6" />
      {/* hinges */}
      {[0.18, 0.5, 0.82].map((p, i) => (
        <circle key={i} cx={x} cy={y + h * p} r="2" fill="#5b554a" />
      ))}
      {/* handle near far edge */}
      <rect x={tipX - sign * 14} y={tipY + h / 2 - 16} width="6" height="32" rx="2" fill={pInk} opacity="0.55" />
    </g>
  );
}

/* ── drawer face ────────────────────────────────────────────── */
function DrawerFace({ x, y, w, h }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={doorFace} stroke={doorEdge} strokeWidth="0.5" />
      <rect x={x + w / 2 - 18} y={y + h / 2 - 2} width="36" height="4" rx="1" fill={pInk} opacity="0.4" />
    </g>
  );
}

/* ============================================================
   1 — KBX-WD-01 · Compact Hanger (1800w · 2 bays · L open)
   ============================================================ */
function P_W_Compact() {
  const x0 = 110, y0 = 70, bayW = 180, h = 250, d = 88;
  const dx = d * PX, dy = d * PY;
  return (
    <PerspCard code="KBX-WD-01 · 2 BAY · 1800w" title="Compact Hanger"
      sub="Bali oak edges · cream doors · left door open · lower drawer stack visible">
      {/* shadow */}
      <FloorShadow cx={x0 + bayW + dx / 2} cy={y0 + h + 16} rx={bayW + 30} ry="9" />
      {/* TOP face spans both bays */}
      <Carcass3D x={x0} y={y0} w={bayW * 2} h={h} d={d} />
      {/* INTERIOR of left bay (open) */}
      <BayInterior x={x0 + 6} y={y0 + 6} w={bayW - 12} h={h - 12} d={d - 8} />
      {/* top shelf */}
      <Shelf3D x={x0 + 8} y={y0 + 38} w={bayW - 16} d={d - 10} />
      {/* hang rod */}
      <Rod3D x={x0 + 14} y={y0 + 56} w={bayW - 28} d={d - 10} />
      {/* drawer stack at base */}
      {[0, 1, 2, 3].map(i => (
        <DrawerFace key={i} x={x0 + 10} y={y0 + 130 + i * 28} w={bayW - 20} h={26} />
      ))}
      {/* RIGHT bay closed */}
      <ClosedDoor x={x0 + bayW + 4} y={y0 + 4} w={bayW / 2 - 4} h={h - 8} hinge="left" handleSide="right" />
      <ClosedDoor x={x0 + 1.5 * bayW} y={y0 + 4} w={bayW / 2 - 4} h={h - 8} hinge="right" handleSide="left" />
      {/* OPEN door of bay 1 — hinged at right, swung out to the right */}
      <OpenDoor x={x0 + bayW - 4} y={y0 + 6} h={h - 12} dWide={70} dy={-12} hinge="right" />
      {/* base plinth */}
      <rect x={x0 + 4} y={y0 + h} width={bayW * 2 - 8} height="6" fill={carcassDeep} />
      {/* dim */}
      <text x={x0 + bayW} y={y0 + h + 30} fill={pMute} fontSize="10" {...pMonoFont} textAnchor="middle">1800 × 2200 × 600</text>
    </PerspCard>
  );
}

/* ============================================================
   2 — KBX-WD-02 · Double-Hang Trio (3 bays · centre open)
   ============================================================ */
function P_W_DoubleHang() {
  const x0 = 70, y0 = 60, bayW = 150, h = 270, d = 80;
  return (
    <PerspCard code="KBX-WD-02 · 3 BAY · 2710w" title="Double-Hang Trio"
      sub="Centre bay open · double hang · left + right closed flush">
      <FloorShadow cx={x0 + 1.5 * bayW + d * PX / 2} cy={y0 + h + 14} rx={bayW * 1.6 + 40} ry="10" />
      {/* unified top */}
      <Carcass3D x={x0} y={y0} w={bayW * 3} h={h} d={d} />
      {/* close left bay */}
      <ClosedDoor x={x0 + 4} y={y0 + 4} w={bayW / 2 - 4} h={h - 8} hinge="left" handleSide="right" />
      <ClosedDoor x={x0 + bayW / 2} y={y0 + 4} w={bayW / 2 - 4} h={h - 8} hinge="right" handleSide="left" />
      {/* open centre */}
      <BayInterior x={x0 + bayW + 6} y={y0 + 6} w={bayW - 12} h={h - 12} d={d - 6} />
      <Shelf3D x={x0 + bayW + 8} y={y0 + 28} w={bayW - 16} d={d - 8} />
      <Rod3D x={x0 + bayW + 14} y={y0 + 50} w={bayW - 28} d={d - 8} />
      <Shelf3D x={x0 + bayW + 8} y={y0 + 130} w={bayW - 16} d={d - 8} />
      <Rod3D x={x0 + bayW + 14} y={y0 + 152} w={bayW - 28} d={d - 8} />
      <Shelf3D x={x0 + bayW + 8} y={y0 + 230} w={bayW - 16} d={d - 8} />
      {/* open doors of centre swung out to either side */}
      <OpenDoor x={x0 + bayW + 4} y={y0 + 6} h={h - 12} dWide={-58} dy={10} hinge="right" />
      <OpenDoor x={x0 + 2 * bayW - 4} y={y0 + 6} h={h - 12} dWide={58} dy={-10} hinge="left" />
      {/* close right bay */}
      <ClosedDoor x={x0 + 2 * bayW + 4} y={y0 + 4} w={bayW / 2 - 4} h={h - 8} hinge="left" handleSide="right" />
      <ClosedDoor x={x0 + 2.5 * bayW} y={y0 + 4} w={bayW / 2 - 4} h={h - 8} hinge="right" handleSide="left" />
      <rect x={x0 + 4} y={y0 + h} width={bayW * 3 - 8} height="6" fill={carcassDeep} />
      <text x={x0 + 1.5 * bayW} y={y0 + h + 30} fill={pMute} fontSize="10" {...pMonoFont} textAnchor="middle">2710 × 2400 × 600</text>
    </PerspCard>
  );
}

/* ============================================================
   3 — KBX-WD-03 · Walk-In Suite (4 bays · all open · oak end)
   ============================================================ */
function P_W_Walkin() {
  const x0 = 60, y0 = 60, bayW = 110, h = 260, d = 70;
  return (
    <PerspCard code="KBX-WD-03 · 4 BAY · 3600w" title="Walk-In Suite"
      sub="Open module · shoes / hang / double-hang / drawers · oak end-cap on right">
      <FloorShadow cx={x0 + 2 * bayW + d * PX / 2} cy={y0 + h + 14} rx={2 * bayW + 50} ry="10" />
      <Carcass3D x={x0} y={y0} w={bayW * 4} h={h} d={d} />
      {/* draw interiors for all bays */}
      {[0, 1, 2, 3].map(i => (
        <BayInterior key={'in' + i} x={x0 + i * bayW + 4} y={y0 + 4} w={bayW - 8} h={h - 8} d={d - 6} />
      ))}
      {/* bay 0 — shoe shelves */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <Shelf3D key={'sh' + i} x={x0 + 8} y={y0 + 18 + i * 38} w={bayW - 16} d={d - 8} />
      ))}
      {/* bay 1 — long hang */}
      <Shelf3D x={x0 + bayW + 8} y={y0 + 18} w={bayW - 16} d={d - 8} />
      <Rod3D x={x0 + bayW + 14} y={y0 + 36} w={bayW - 28} d={d - 8} />
      {[0, 1, 2].map(i => (
        <DrawerFace key={'d' + i} x={x0 + bayW + 12} y={y0 + 200 + i * 18} w={bayW - 24} h="16" />
      ))}
      {/* bay 2 — double hang */}
      <Rod3D x={x0 + 2 * bayW + 14} y={y0 + 30} w={bayW - 28} d={d - 8} />
      <Shelf3D x={x0 + 2 * bayW + 8} y={y0 + 116} w={bayW - 16} d={d - 8} />
      <Rod3D x={x0 + 2 * bayW + 14} y={y0 + 134} w={bayW - 28} d={d - 8} />
      {/* bay 3 — baskets + drawers */}
      <Basket3D x={x0 + 3 * bayW + 12} y={y0 + 16} w={bayW - 24} h="42" d={d - 10} />
      <Basket3D x={x0 + 3 * bayW + 12} y={y0 + 64} w={bayW - 24} h="42" d={d - 10} />
      {[0, 1, 2, 3].map(i => (
        <DrawerFace key={'d3' + i} x={x0 + 3 * bayW + 10} y={y0 + 116 + i * 32} w={bayW - 20} h="30" />
      ))}
      {/* oak end cap */}
      <Carcass3D x={x0 + 4 * bayW} y={y0} w="14" h={h} d={d} oak />
      <rect x={x0 + 4 * bayW} y={y0} width="14" height={h} fill={oakFace} />
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={'g' + i} x1={x0 + 4 * bayW + 1 + i * 2} y1={y0 + 4} x2={x0 + 4 * bayW + 1 + i * 2} y2={y0 + h - 4}
          stroke={oakGrain} strokeWidth="0.5" opacity="0.55" />
      ))}
      <rect x={x0 + 4} y={y0 + h} width={bayW * 4 + 14 - 8} height="6" fill={carcassDeep} />
      <text x={x0 + 2 * bayW} y={y0 + h + 30} fill={pMute} fontSize="10" {...pMonoFont} textAnchor="middle">3600 × 2400 × 600 · oak end-cap</text>
    </PerspCard>
  );
}

/* ============================================================
   4 — KBX-WD-04 · Sliding · Mirror (3 doors · centre mirror)
   ============================================================ */
function P_W_Sliding() {
  const x0 = 90, y0 = 50, w = 440, h = 280, d = 90;
  return (
    <PerspCard code="KBX-WD-04 · 3 SLIDE · 2400w" title="Sliding · Mirror"
      sub="Centre mirror panel half-open · frosted side panels · top + bottom track">
      <FloorShadow cx={x0 + w / 2 + d * PX / 2} cy={y0 + h + 14} rx={w / 2 + 50} ry="10" />
      <Carcass3D x={x0} y={y0} w={w} h={h} d={d} />
      {/* tracks */}
      <rect x={x0 - 2} y={y0 - 4} width={w + 4} height="6" fill={carcassDeep} />
      <rect x={x0 - 2} y={y0 + h - 2} width={w + 4} height="6" fill={carcassDeep} />
      {/* left door — frosted (closed back layer) */}
      <rect x={x0 + 4} y={y0 + 6} width={w / 3 - 8} height={h - 12} fill="#e8e3d3" stroke={doorEdge} strokeWidth="0.6" />
      <text x={x0 + w / 6} y={y0 + h / 2 + 4} fill={pMute} fontSize="10" {...pMonoFont} textAnchor="middle" opacity="0.7">FROSTED</text>
      {/* centre — slid 30% open. revealed back interior gap on right side */}
      <BayInterior x={x0 + w / 3 + w * 0.18} y={y0 + 8} w={w / 3 - 16} h={h - 16} d={d - 8} />
      <Rod3D x={x0 + w / 3 + w * 0.2} y={y0 + 50} w={w / 3 - 22} d={d - 10} />
      {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
        <rect key={i} x={x0 + w / 3 + w * 0.18 + 8 + i * 16} y={y0 + 70} width="12" height="80" rx="1" fill={['#9a8770', '#7d8b9a', '#a08574', '#7a6f5e'][i]} opacity="0.85" />
      ))}
      <Shelf3D x={x0 + w / 3 + w * 0.18 + 4} y={y0 + 200} w={w / 3 - 20} d={d - 10} />
      {/* mirror door slid leftward in front-track */}
      <rect x={x0 + w / 3 - 30} y={y0 + 4} width={w / 3} height={h - 8} fill="#cfd6e0" stroke={pInk} strokeOpacity="0.4" strokeWidth="0.8" />
      {/* mirror gradient streaks */}
      {Array.from({ length: 18 }).map((_, k) => (
        <line key={k} x1={x0 + w / 3 - 30 + 4} y1={y0 + 8 + k * 18}
          x2={x0 + w / 3 - 30 + w / 3 - 4} y2={y0 + 8 + k * 18 - 90}
          stroke="#8da0bb" strokeWidth="0.5" opacity="0.4" />
      ))}
      <text x={x0 + w / 3 - 30 + w / 6} y={y0 + h / 2 + 4} fill="#3d4d63" fontSize="11" fontWeight="700" {...pMonoFont} textAnchor="middle">MIRROR</text>
      {/* right door — frosted */}
      <rect x={x0 + 2 * w / 3 + 4} y={y0 + 6} width={w / 3 - 8} height={h - 12} fill="#e8e3d3" stroke={doorEdge} strokeWidth="0.6" />
      <text x={x0 + 5 * w / 6} y={y0 + h / 2 + 4} fill={pMute} fontSize="10" {...pMonoFont} textAnchor="middle" opacity="0.7">FROSTED</text>
      {/* recessed handles (vertical) */}
      <rect x={x0 + w / 3 - 2} y={y0 + h / 2 - 24} width="3" height="48" fill={pInk} opacity="0.4" />
      <rect x={x0 + 2 * w / 3 - 16} y={y0 + h / 2 - 24} width="3" height="48" fill={pInk} opacity="0.4" />
      <text x={x0 + w / 2} y={y0 + h + 30} fill={pMute} fontSize="10" {...pMonoFont} textAnchor="middle">2400 × 2400 × 650 · soft-glide track</text>
    </PerspCard>
  );
}

/* ============================================================
   5 — KBX-WD-05 · Corner Loft (L-config: 2400 + 1500)
   ============================================================ */
function P_W_Corner() {
  const x0 = 60, y0 = 60, h = 260, d = 80;
  const wA = 280;       // long run on left, faces front
  // Run B is rotated — we draw it as a deeper parallelogram at the right
  return (
    <PerspCard code="KBX-WD-05 · L-CORNER · 2400+1500w" title="Corner Loft"
      sub="L-configuration · long run faces front · perpendicular return into corner">
      <FloorShadow cx={x0 + wA / 2 + 60} cy={y0 + h + 14} rx={wA / 2 + 90} ry="11" />
      {/* RUN B — deeper, going "into" the page on the right */}
      <g>
        {/* Run B treated as a bay seen from the side — its FRONT face is the parallelogram that recedes */}
        {/* Front of Run B = a parallelogram from (x0+wA, y0) going (d_b*PX_b, d_b*PY_b) to the right */}
        {(() => {
          const wB = 170;
          const bx = x0 + wA, by = y0;
          // Run B "depth" (visual length receding) = wB-ish foreshortened
          const recX = wB * 0.85, recY = -wB * 0.18;
          // top face
          const topB = `M ${bx} ${by} L ${bx + recX} ${by + recY} L ${bx + recX + d * PX} ${by + recY + d * PY} L ${bx + d * PX} ${by + d * PY} Z`;
          // front face (toward camera)
          const frontB = `M ${bx} ${by} L ${bx + recX} ${by + recY} L ${bx + recX} ${by + recY + h} L ${bx} ${by + h} Z`;
          return (
            <g>
              <path d={topB} fill={carcassTop} stroke={pInk} strokeOpacity="0.4" strokeWidth="0.8" />
              <path d={frontB} fill={doorFace} />
              {/* doors on Run B (3 panels) */}
              {[0, 1, 2].map(i => {
                const t1 = i / 3, t2 = (i + 1) / 3;
                const a = `M ${bx + recX * t1} ${by + recY * t1 + 6} L ${bx + recX * t2 - 2} ${by + recY * t2 + 6} L ${bx + recX * t2 - 2} ${by + recY * t2 + h - 6} L ${bx + recX * t1} ${by + recY * t1 + h - 6} Z`;
                return <path key={i} d={a} fill={i === 1 ? doorEdge : doorFace} stroke={pInk} strokeOpacity="0.25" strokeWidth="0.5" />;
              })}
              {/* handles */}
              {[0.16, 0.5, 0.83].map((p, i) => (
                <rect key={i} x={bx + recX * p - 2} y={by + recY * p + h / 2 - 14} width="4" height="28"
                  fill={pInk} opacity="0.5" />
              ))}
              {/* base */}
              <path d={`M ${bx} ${by + h} L ${bx + recX} ${by + recY + h} L ${bx + recX} ${by + recY + h + 6} L ${bx} ${by + h + 6} Z`} fill={carcassDeep} />
            </g>
          );
        })()}
      </g>
      {/* corner filler post */}
      <rect x={x0 + wA - 10} y={y0} width="14" height={h} fill={carcassDeep} />
      <rect x={x0 + wA - 10} y={y0} width="14" height={h} fill={oakFace} opacity="0.4" />
      {/* RUN A — front-facing, with one bay open */}
      <Carcass3D x={x0} y={y0} w={wA} h={h} d={d} />
      {/* split into 3 bays: closed | open | closed */}
      <ClosedDoor x={x0 + 4} y={y0 + 4} w={wA / 3 - 8} h={h - 8} hinge="left" handleSide="right" />
      <BayInterior x={x0 + wA / 3 + 4} y={y0 + 4} w={wA / 3 - 8} h={h - 8} d={d - 6} />
      <Shelf3D x={x0 + wA / 3 + 8} y={y0 + 30} w={wA / 3 - 16} d={d - 8} />
      <Rod3D x={x0 + wA / 3 + 14} y={y0 + 52} w={wA / 3 - 28} d={d - 8} />
      <Shelf3D x={x0 + wA / 3 + 8} y={y0 + 130} w={wA / 3 - 16} d={d - 8} />
      {[0, 1, 2].map(i => (
        <DrawerFace key={i} x={x0 + wA / 3 + 10} y={y0 + 160 + i * 28} w={wA / 3 - 20} h="26" />
      ))}
      {/* swung-open door of middle */}
      <OpenDoor x={x0 + 2 * wA / 3 - 4} y={y0 + 6} h={h - 12} dWide={56} dy={-10} hinge="left" />
      <ClosedDoor x={x0 + 2 * wA / 3 + 4} y={y0 + 4} w={wA / 3 - 8} h={h - 8} hinge="right" handleSide="left" />
      <rect x={x0 + 4} y={y0 + h} width={wA - 8} height="6" fill={carcassDeep} />
      <text x={x0 + wA / 2 + 40} y={y0 + h + 30} fill={pMute} fontSize="10" {...pMonoFont} textAnchor="middle">2400 + 1500 × 2400 × 600</text>
    </PerspCard>
  );
}

Object.assign(window, {
  P_W_Compact, P_W_DoubleHang, P_W_Walkin, P_W_Sliding, P_W_Corner,
});
