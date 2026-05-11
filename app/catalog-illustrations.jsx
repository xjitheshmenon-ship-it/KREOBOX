/* ============================================================
   KREOBOX · Furniture catalog illustrations
   Front-elevation blueprint style, matching the planner panels.
   - 5 wardrobes, 5 modular cabinets, 5 officer desks, 5 storage/shelves
   ============================================================ */

const cInk    = '#1a1815';
const cPaper  = '#fafaf7';
const cBg     = '#f0eee9';
const cMute   = 'rgba(26,24,21,0.55)';
const cLine   = 'rgba(26,24,21,0.10)';
const cAccent = '#c96442';

const cBlue   = '#5b8def';
const cPurple = '#7c5cff';
const cGreen  = '#1f8a5b';
const cWood   = '#a99a82';
const cWoodFill = '#e8e2d5';

const cMono = { fontFamily: 'JetBrains Mono, monospace' };
const cFr   = { fontFamily: '"Fraunces", Georgia, serif' };

/* ---- shared SVG bits ---------------------------------------- */
function GridDefs({ id }) {
  return (
    <defs>
      <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(26,24,21,0.06)" strokeWidth="1" />
      </pattern>
    </defs>
  );
}

function Floor({ x1, x2, y }) {
  return <line x1={x1} y1={y} x2={x2} y2={y} stroke={cInk} strokeWidth="2" />;
}

function DimH({ x1, x2, y, label, color = cMute }) {
  // horizontal dimension line with tick marks
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth="1" />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} stroke={color} strokeWidth="1" />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} stroke={color} strokeWidth="1" />
      <text x={(x1 + x2) / 2} y={y + 14} fill={color} fontSize="10" {...cMono} textAnchor="middle">{label}</text>
    </g>
  );
}

function DimV({ x, y1, y2, label, color = cMute, side = 'left' }) {
  const tx = side === 'left' ? x - 8 : x + 8;
  const anchor = side === 'left' ? 'end' : 'start';
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth="1" />
      <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} stroke={color} strokeWidth="1" />
      <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} stroke={color} strokeWidth="1" />
      <text x={tx} y={(y1 + y2) / 2 + 3} fill={color} fontSize="10" {...cMono} textAnchor={anchor}
        transform={side === 'left' ? `rotate(-90, ${tx}, ${(y1 + y2) / 2 + 3})` : ''}>{label}</text>
    </g>
  );
}

function Card({ title, code, sub, children, gridId }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: cPaper,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* header strip */}
      <div style={{
        padding: '14px 18px 10px', borderBottom: `1px solid ${cLine}`,
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ ...cMono, fontSize: 10, letterSpacing: '0.18em', color: cMute, fontWeight: 700 }}>{code}</div>
          <div style={{ ...cFr, fontSize: 22, marginTop: 3, letterSpacing: '-0.01em', lineHeight: 1.05 }}>{title}</div>
        </div>
        <div style={{ ...cMono, fontSize: 10, color: cMute }}>elev · 1:25</div>
      </div>
      {/* drawing */}
      <div style={{ flex: 1, position: 'relative', background: cBg }}>
        <svg viewBox="0 0 620 380" style={{ width: '100%', height: '100%', display: 'block' }}>
          <GridDefs id={gridId} />
          <rect x="0" y="0" width="620" height="380" fill={cPaper} />
          <rect x="20" y="20" width="580" height="320" fill={`url(#${gridId})`} />
          {children}
        </svg>
      </div>
      {/* footer */}
      <div style={{
        padding: '10px 18px', borderTop: `1px solid ${cLine}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        ...cMono, fontSize: 10, color: cMute,
      }}>
        <span>{sub}</span>
        <span style={{ color: cInk, fontWeight: 700 }}>kreobox.in</span>
      </div>
    </div>
  );
}

/* ============================================================
   WARDROBES — front elevations
   ============================================================ */

function W_Compact() {
  // 2 bays, 1800 wide, 2200 high — hang + drawers
  const x0 = 110, y0 = 50, bayW = 200, bayH = 250;
  return (
    <Card gridId="gw1" code="KBX-WD-01 · 2 BAY · 1800w" title="Compact Hanger" sub="1800 × 2200 × 600 · Bali oak · 2 swing doors">
      {/* frame */}
      <rect x={x0} y={y0} width={bayW * 2} height={bayH} fill="none" stroke={cInk} strokeWidth="2" />
      {/* divider */}
      <line x1={x0 + bayW} y1={y0} x2={x0 + bayW} y2={y0 + bayH} stroke={cInk} strokeWidth="1.5" />
      {/* bay A */}
      <rect x={x0 + 4} y={y0 + 4} width={bayW - 8} height={30} fill={cWoodFill} stroke={cWood} />
      <text x={x0 + bayW / 2} y={y0 + 22} fill={cInk} fontSize="9" {...cMono} textAnchor="middle" opacity="0.7">Top shelf</text>
      <rect x={x0 + 4} y={y0 + 38} width={bayW - 8} height={170} fill="rgba(91,141,239,0.18)" stroke={cBlue} />
      <line x1={x0 + 12} y1={y0 + 50} x2={x0 + bayW - 12} y2={y0 + 50} stroke={cBlue} strokeWidth="2" />
      <text x={x0 + bayW / 2} y={y0 + 130} fill={cInk} fontSize="10" {...cMono} textAnchor="middle" opacity="0.7">Long hang · 1.7 m</text>
      <rect x={x0 + 4} y={y0 + 212} width={bayW - 8} height={34} fill="rgba(201,100,66,0.18)" stroke={cAccent} />
      {[0, 1].map(i => <line key={i} x1={x0 + bayW / 2 - 14} x2={x0 + bayW / 2 + 14}
        y1={y0 + 220 + i * 14} y2={y0 + 220 + i * 14} stroke={cAccent} strokeWidth="1.5" />)}
      {/* bay B */}
      {[0, 1, 2, 3].map(i => (
        <g key={'d' + i}>
          <rect x={x0 + bayW + 4} y={y0 + 4 + i * 60} width={bayW - 8} height={56}
            fill="rgba(201,100,66,0.18)" stroke={cAccent} />
          {[0, 1].map(j => <line key={j} x1={x0 + 1.5 * bayW - 16} x2={x0 + 1.5 * bayW + 16}
            y1={y0 + 4 + i * 60 + 18 + j * 18} y2={y0 + 4 + i * 60 + 18 + j * 18}
            stroke={cAccent} strokeWidth="1.5" />)}
        </g>
      ))}
      <text x={x0 + 1.5 * bayW} y={y0 + 130} fill={cInk} fontSize="10" {...cMono} textAnchor="middle" opacity="0.7">8 drawers</text>
      <Floor x1="40" x2="580" y={y0 + bayH + 8} />
      <DimH x1={x0} x2={x0 + 2 * bayW} y={y0 + bayH + 28} label="1,800 mm" />
      <DimV x={x0 - 14} y1={y0} y2={y0 + bayH} label="2,200 mm" />
      <text x={x0 + bayW / 2} y={y0 - 10} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">BAY A · 900</text>
      <text x={x0 + 1.5 * bayW} y={y0 - 10} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">BAY B · 900</text>
    </Card>
  );
}

function W_DoubleHang() {
  const x0 = 60, y0 = 50, bayW = 165, bayH = 260;
  const interiors = [
    [{ y: 0, h: 28, t: 'shelf', l: 'Shelf' }, { y: 28, h: 100, t: 'hang', l: 'Hang · 1m' }, { y: 128, h: 100, t: 'hang', l: 'Hang · 1m' }, { y: 228, h: 32, t: 'drawer', l: '2 drawers' }],
    [{ y: 0, h: 28, t: 'shelf', l: 'Shelf' }, { y: 28, h: 100, t: 'hang', l: 'Hang · 1m' }, { y: 128, h: 100, t: 'hang', l: 'Hang · 1m' }, { y: 228, h: 32, t: 'drawer', l: '2 drawers' }],
    [{ y: 0, h: 28, t: 'shelf', l: 'Shelf' }, { y: 28, h: 100, t: 'hang', l: 'Hang · 1m' }, { y: 128, h: 100, t: 'hang', l: 'Hang · 1m' }, { y: 228, h: 32, t: 'drawer', l: '2 drawers' }],
  ];
  const fill = { shelf: cWoodFill, hang: 'rgba(91,141,239,0.18)', drawer: 'rgba(201,100,66,0.18)' };
  const stroke = { shelf: cWood, hang: cBlue, drawer: cAccent };
  return (
    <Card gridId="gw2" code="KBX-WD-02 · 3 BAY · 2710w" title="Double-Hang Trio" sub="2710 × 2400 × 600 · Bali oak · 6 swing doors">
      {[0, 1, 2].map(bi => {
        const x = x0 + bi * (bayW + 6);
        return (
          <g key={bi}>
            <rect x={x} y={y0} width={bayW} height={bayH} fill="none" stroke={cInk} strokeWidth="2" />
            {interiors[bi].map((m, mi) => (
              <g key={mi}>
                <rect x={x + 3} y={y0 + 3 + (m.y * bayH / 260)} width={bayW - 6} height={(m.h * bayH / 260) - 3}
                  fill={fill[m.t]} stroke={stroke[m.t]} strokeWidth="1" />
                {m.t === 'hang' && <line x1={x + 12} x2={x + bayW - 12}
                  y1={y0 + 3 + (m.y * bayH / 260) + 8} y2={y0 + 3 + (m.y * bayH / 260) + 8}
                  stroke={cBlue} strokeWidth="2" />}
                {m.t === 'drawer' && [0, 1].map(j => <line key={j}
                  x1={x + bayW / 2 - 12} x2={x + bayW / 2 + 12}
                  y1={y0 + 3 + (m.y * bayH / 260) + (j + 0.5) * (((m.h * bayH / 260) - 3) / 2)}
                  y2={y0 + 3 + (m.y * bayH / 260) + (j + 0.5) * (((m.h * bayH / 260) - 3) / 2)}
                  stroke={cAccent} strokeWidth="1.5" />)}
                <text x={x + bayW / 2} y={y0 + 3 + (m.y * bayH / 260) + (m.h * bayH / 260) / 2 + 3}
                  fill={cInk} fontSize="9" {...cMono} textAnchor="middle" opacity="0.7">{m.l}</text>
              </g>
            ))}
            <text x={x + bayW / 2} y={y0 - 10} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">BAY {String.fromCharCode(65 + bi)}</text>
          </g>
        );
      })}
      <Floor x1="40" x2="580" y={y0 + bayH + 8} />
      <DimH x1={x0} x2={x0 + 3 * bayW + 12} y={y0 + bayH + 28} label="2,710 mm" />
      <DimV x={x0 - 14} y1={y0} y2={y0 + bayH} label="2,400 mm" />
    </Card>
  );
}

function W_Walkin() {
  // 4 bays — mixed walk-in
  const x0 = 50, y0 = 50, bayW = 130, bayH = 260;
  return (
    <Card gridId="gw3" code="KBX-WD-03 · 4 BAY · 3600w" title="Walk-In Suite" sub="3600 × 2400 × 600 · Smoked walnut · 4 bays + island">
      {[0, 1, 2, 3].map(bi => {
        const x = x0 + bi * (bayW + 4);
        return <rect key={bi} x={x} y={y0} width={bayW} height={bayH} fill="none" stroke={cInk} strokeWidth="2" />;
      })}
      {/* bay 0: shoe stack */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <g key={'sh' + i}>
          <rect x={x0 + 3} y={y0 + 3 + i * 42} width={bayW - 6} height={40}
            fill={`${cGreen}25`} stroke={cGreen} strokeWidth="1" />
          <rect x={x0 + 16} y={y0 + 14 + i * 42} width={bayW - 32} height={20} rx="2"
            fill="none" stroke={cGreen} strokeWidth="0.8" strokeDasharray="2 2" />
        </g>
      ))}
      <text x={x0 + bayW / 2} y={y0 - 10} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">SHOES · 12</text>
      {/* bay 1: hang full */}
      <rect x={x0 + bayW + 7} y={y0 + 3} width={bayW - 6} height={28} fill={cWoodFill} stroke={cWood} />
      <rect x={x0 + bayW + 7} y={y0 + 35} width={bayW - 6} height={184} fill="rgba(91,141,239,0.18)" stroke={cBlue} />
      <line x1={x0 + bayW + 18} x2={x0 + 2 * bayW - 4} y1={y0 + 47} y2={y0 + 47} stroke={cBlue} strokeWidth="2" />
      <text x={x0 + 1.5 * bayW + 2} y={y0 + 130} fill={cInk} fontSize="10" {...cMono} textAnchor="middle" opacity="0.7">Long hang</text>
      <rect x={x0 + bayW + 7} y={y0 + 223} width={bayW - 6} height={34} fill="rgba(201,100,66,0.18)" stroke={cAccent} />
      <line x1={x0 + 1.5 * bayW + 2 - 14} x2={x0 + 1.5 * bayW + 2 + 14} y1={y0 + 240} y2={y0 + 240} stroke={cAccent} strokeWidth="1.5" />
      <text x={x0 + 1.5 * bayW + 2} y={y0 - 10} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">HANG</text>
      {/* bay 2: double hang + jewellery */}
      {[0, 1, 2].map(i => (
        <rect key={'j' + i} x={x0 + 2 * bayW + 11} y={y0 + 3 + i * 12} width={bayW - 6} height={10}
          fill="rgba(124,92,255,0.18)" stroke={cPurple} strokeWidth="0.8" />
      ))}
      <text x={x0 + 2.5 * bayW + 4} y={y0 + 30} fill={cPurple} fontSize="8" {...cMono} textAnchor="middle">JEWEL · 3 trays</text>
      <rect x={x0 + 2 * bayW + 11} y={y0 + 42} width={bayW - 6} height={88} fill="rgba(91,141,239,0.18)" stroke={cBlue} />
      <line x1={x0 + 2 * bayW + 22} x2={x0 + 3 * bayW - 1} y1={y0 + 54} y2={y0 + 54} stroke={cBlue} strokeWidth="2" />
      <rect x={x0 + 2 * bayW + 11} y={y0 + 134} width={bayW - 6} height={88} fill="rgba(91,141,239,0.18)" stroke={cBlue} />
      <line x1={x0 + 2 * bayW + 22} x2={x0 + 3 * bayW - 1} y1={y0 + 146} y2={y0 + 146} stroke={cBlue} strokeWidth="2" />
      <rect x={x0 + 2 * bayW + 11} y={y0 + 226} width={bayW - 6} height={31} fill={cWoodFill} stroke={cWood} />
      <text x={x0 + 2.5 * bayW + 4} y={y0 - 10} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">DOUBLE</text>
      {/* bay 3: drawers + baskets */}
      {[0, 1].map(i => (
        <rect key={'b' + i} x={x0 + 3 * bayW + 15} y={y0 + 3 + i * 50} width={bayW - 6} height={48}
          fill="rgba(124,92,255,0.18)" stroke={cPurple} strokeWidth="1" />
      ))}
      {[0, 1, 2, 3, 4].map(i => (
        <g key={'d' + i}>
          <rect x={x0 + 3 * bayW + 15} y={y0 + 105 + i * 30} width={bayW - 6} height={28}
            fill="rgba(201,100,66,0.18)" stroke={cAccent} strokeWidth="1" />
          <line x1={x0 + 3.5 * bayW + 6} y1={y0 + 119 + i * 30} x2={x0 + 3.5 * bayW + 18}
            y2={y0 + 119 + i * 30} stroke={cAccent} strokeWidth="1.5" />
        </g>
      ))}
      <text x={x0 + 3.5 * bayW + 6} y={y0 - 10} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">DRAWERS</text>
      <Floor x1="30" x2="590" y={y0 + bayH + 8} />
      <DimH x1={x0} x2={x0 + 4 * bayW + 12} y={y0 + bayH + 28} label="3,600 mm" />
      <DimV x={x0 - 14} y1={y0} y2={y0 + bayH} label="2,400 mm" />
    </Card>
  );
}

function W_Sliding() {
  // 3 sliding doors with mirror centre
  const x0 = 80, y0 = 50, w = 460, h = 270;
  return (
    <Card gridId="gw4" code="KBX-WD-04 · 3 SLIDE · 2400w" title="Sliding · Mirror" sub="2400 × 2400 × 650 · Linen white + smoked mirror centre">
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke={cInk} strokeWidth="2" />
      {/* track top */}
      <rect x={x0 - 2} y={y0 - 6} width={w + 4} height={6} fill={cWoodFill} stroke={cWood} />
      <rect x={x0 - 2} y={y0 + h} width={w + 4} height={6} fill={cWoodFill} stroke={cWood} />
      {/* 3 doors — left frosted, centre mirror, right frosted */}
      {[0, 1, 2].map(i => {
        const dw = w / 3, dx = x0 + i * dw;
        const isMirror = i === 1;
        return (
          <g key={i}>
            <rect x={dx + 4} y={y0 + 4} width={dw - 8} height={h - 8}
              fill={isMirror ? 'rgba(91,141,239,0.10)' : '#f3efe5'}
              stroke={isMirror ? cBlue : cWood} strokeWidth="1.2" />
            {/* mirror diagonal hatch */}
            {isMirror && Array.from({ length: 14 }).map((_, k) => (
              <line key={k} x1={dx + 4} y1={y0 + 4 + k * 22} x2={dx + dw - 4} y2={y0 + 4 + k * 22 - 80}
                stroke={cBlue} strokeWidth="0.5" opacity="0.4" />
            ))}
            <text x={dx + dw / 2} y={y0 + h / 2 + 4} fill={isMirror ? cBlue : cMute} fontSize="11" {...cMono}
              textAnchor="middle" fontWeight={isMirror ? 700 : 500}>{isMirror ? 'MIRROR' : 'FROSTED'}</text>
            {/* handle recess */}
            <rect x={dx + dw - 18} y={y0 + h / 2 - 18} width="6" height="36" fill="none" stroke={cInk} strokeWidth="0.8" />
            {/* arrow indicating slide */}
            {i !== 1 && (
              <g opacity="0.5">
                <line x1={dx + 16} y1={y0 + h - 22} x2={dx + 36} y2={y0 + h - 22} stroke={cInk} strokeWidth="1" />
                <path d={`M${dx + 36} ${y0 + h - 22} l-4 -3 v6 z`} fill={cInk} />
              </g>
            )}
          </g>
        );
      })}
      <Floor x1="40" x2="580" y={y0 + h + 14} />
      <DimH x1={x0} x2={x0 + w} y={y0 + h + 34} label="2,400 mm" />
      <DimV x={x0 - 14} y1={y0 - 6} y2={y0 + h + 6} label="2,400 mm" />
      <text x={x0} y={y0 - 14} fill={cMute} fontSize="9" {...cMono}>FRAME · 800 mm panels · soft-close</text>
    </Card>
  );
}

function W_Corner() {
  // L-shape corner — 2 elevations
  const y0 = 50, hMain = 250;
  const x0 = 50, wA = 300, wB = 200;
  return (
    <Card gridId="gw5" code="KBX-WD-05 · L-CORNER · 2400+1500w" title="Corner Loft" sub="2400 + 1500 × 2400 × 600 · Bleached oak · L-config">
      {/* run A */}
      <rect x={x0} y={y0} width={wA} height={hMain} fill="none" stroke={cInk} strokeWidth="2" />
      {/* 3 sub-bays in A */}
      {[0, 1, 2].map(i => (
        <line key={i} x1={x0 + (i + 1) * wA / 3} y1={y0} x2={x0 + (i + 1) * wA / 3} y2={y0 + hMain}
          stroke={cInk} strokeWidth="0.8" opacity={i === 2 ? 0 : 1} />
      ))}
      <rect x={x0 + 4} y={y0 + 4} width={wA / 3 - 8} height={120} fill="rgba(91,141,239,0.18)" stroke={cBlue} />
      <line x1={x0 + 14} y1={y0 + 16} x2={x0 + wA / 3 - 6} y2={y0 + 16} stroke={cBlue} strokeWidth="2" />
      <text x={x0 + wA / 6} y={y0 + 70} fill={cInk} fontSize="10" {...cMono} textAnchor="middle" opacity="0.7">Hang</text>
      {[0, 1, 2, 3].map(i => (
        <rect key={'da' + i} x={x0 + 4} y={y0 + 128 + i * 30} width={wA / 3 - 8} height={28}
          fill="rgba(201,100,66,0.18)" stroke={cAccent} />
      ))}
      <rect x={x0 + wA / 3 + 4} y={y0 + 4} width={wA / 3 - 8} height={hMain - 8} fill="rgba(91,141,239,0.18)" stroke={cBlue} />
      <line x1={x0 + wA / 3 + 14} y1={y0 + 16} x2={x0 + 2 * wA / 3 - 6} y2={y0 + 16} stroke={cBlue} strokeWidth="2" />
      <text x={x0 + wA / 2} y={y0 + hMain / 2 + 4} fill={cInk} fontSize="10" {...cMono} textAnchor="middle" opacity="0.7">Long hang</text>
      {[0, 1].map(i => (
        <rect key={'sh' + i} x={x0 + 2 * wA / 3 + 4} y={y0 + 4 + i * (hMain / 2 - 6)} width={wA / 3 - 8} height={hMain / 2 - 10}
          fill={cWoodFill} stroke={cWood} />
      ))}
      <text x={x0 + 5 * wA / 6} y={y0 + hMain / 4} fill={cInk} fontSize="9" {...cMono} textAnchor="middle" opacity="0.7">Shelves · 5</text>
      <text x={x0 + 5 * wA / 6} y={y0 + 3 * hMain / 4} fill={cInk} fontSize="9" {...cMono} textAnchor="middle" opacity="0.7">Shelves · 5</text>
      {/* corner indicator */}
      <rect x={x0 + wA + 6} y={y0} width={28} height={hMain}
        fill="rgba(26,24,21,0.06)" stroke={cMute} strokeWidth="0.8" strokeDasharray="3 2" />
      <text x={x0 + wA + 20} y={y0 + hMain / 2 + 4} fill={cMute} fontSize="9" {...cMono}
        textAnchor="middle" transform={`rotate(-90, ${x0 + wA + 20}, ${y0 + hMain / 2 + 4})`}>CORNER 600</text>
      {/* run B */}
      <rect x={x0 + wA + 38} y={y0} width={wB} height={hMain} fill="none" stroke={cInk} strokeWidth="2" />
      <line x1={x0 + wA + 38 + wB / 2} y1={y0} x2={x0 + wA + 38 + wB / 2} y2={y0 + hMain} stroke={cInk} strokeWidth="0.8" />
      {/* dressing — open with mirror */}
      <rect x={x0 + wA + 42} y={y0 + 4} width={wB / 2 - 8} height={hMain - 8}
        fill="rgba(91,141,239,0.10)" stroke={cBlue} />
      {Array.from({ length: 10 }).map((_, k) => (
        <line key={k} x1={x0 + wA + 42} y1={y0 + 4 + k * 26} x2={x0 + wA + 42 + wB / 2 - 8} y2={y0 + 4 + k * 26 - 56}
          stroke={cBlue} strokeWidth="0.5" opacity="0.4" />
      ))}
      <text x={x0 + wA + 42 + (wB / 2 - 8) / 2} y={y0 + hMain / 2 + 4} fill={cBlue} fontSize="10" {...cMono}
        textAnchor="middle" fontWeight="700">DRESSING</text>
      {/* drawers + tie pull */}
      <rect x={x0 + wA + 38 + wB / 2 + 4} y={y0 + 4} width={wB / 2 - 8} height={42}
        fill="rgba(124,92,255,0.18)" stroke={cPurple} />
      <text x={x0 + wA + 38 + wB / 2 + (wB / 2) / 2 - 4} y={y0 + 30} fill={cInk} fontSize="9" {...cMono} textAnchor="middle" opacity="0.7">Tie rack</text>
      {[0, 1, 2, 3].map(i => (
        <rect key={'db' + i} x={x0 + wA + 38 + wB / 2 + 4} y={y0 + 50 + i * 48} width={wB / 2 - 8} height={44}
          fill="rgba(201,100,66,0.18)" stroke={cAccent} />
      ))}
      <Floor x1="30" x2="600" y={y0 + hMain + 8} />
      <DimH x1={x0} x2={x0 + wA} y={y0 + hMain + 28} label="2,400" />
      <DimH x1={x0 + wA + 38} x2={x0 + wA + 38 + wB} y={y0 + hMain + 28} label="1,500" />
    </Card>
  );
}

/* ============================================================
   MODULAR CABINETS — kitchen + storage
   ============================================================ */

function C_BaseRun() {
  const x0 = 50, y0 = 110, w = 540, h = 180;
  return (
    <Card gridId="gc1" code="KBX-CB-01 · BASE · 3000w" title="Base Run · Kitchen" sub="3000 × 900 × 600 · Pebble grey · drawers + sink + dishwasher">
      {/* counter */}
      <rect x={x0 - 4} y={y0 - 16} width={w + 8} height={16} fill={cWoodFill} stroke={cWood} strokeWidth="1.2" />
      <text x={x0 + w / 2} y={y0 - 22} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">QUARTZ COUNTER · 20mm</text>
      {/* carcass */}
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke={cInk} strokeWidth="2" />
      {/* modules: D600+D600+SINK900+DW600+TR300 */}
      {[
        { x: 0, w: 90, kind: 'drawers' },
        { x: 90, w: 90, kind: 'drawers' },
        { x: 180, w: 180, kind: 'sink' },
        { x: 360, w: 100, kind: 'dishwasher' },
        { x: 460, w: 80, kind: 'trash' },
      ].map((mod, i) => {
        const mx = x0 + mod.x;
        return (
          <g key={i}>
            <line x1={mx} y1={y0} x2={mx} y2={y0 + h} stroke={cInk} strokeWidth="0.8" opacity={i ? 1 : 0} />
            {mod.kind === 'drawers' && (
              <g>
                {[0, 1, 2].map(j => (
                  <rect key={j} x={mx + 4} y={y0 + 4 + j * 56} width={mod.w - 8} height={54}
                    fill="rgba(201,100,66,0.18)" stroke={cAccent} />
                ))}
                {[0, 1, 2].map(j => <line key={'h' + j} x1={mx + mod.w / 2 - 14} x2={mx + mod.w / 2 + 14}
                  y1={y0 + 30 + j * 56} y2={y0 + 30 + j * 56} stroke={cAccent} strokeWidth="1.5" />)}
              </g>
            )}
            {mod.kind === 'sink' && (
              <g>
                <rect x={mx + 4} y={y0 + 4} width={mod.w - 8} height={50}
                  fill={cWoodFill} stroke={cWood} />
                <rect x={mx + 16} y={y0 + 60} width={mod.w - 32} height={40} rx="3"
                  fill="rgba(91,141,239,0.10)" stroke={cBlue} strokeWidth="1.2" />
                <circle cx={mx + mod.w / 2} cy={y0 + 22} r="4" fill="none" stroke={cBlue} strokeWidth="1" />
                <line x1={mx + mod.w / 2} y1={y0 + 26} x2={mx + mod.w / 2} y2={y0 + 36} stroke={cBlue} strokeWidth="1" />
                <text x={mx + mod.w / 2} y={y0 + 86} fill={cBlue} fontSize="10" {...cMono} textAnchor="middle">SINK</text>
                <rect x={mx + 4} y={y0 + 110} width={mod.w - 8} height={66}
                  fill="rgba(124,92,255,0.10)" stroke={cPurple} strokeDasharray="3 2" />
                <text x={mx + mod.w / 2} y={y0 + 145} fill={cPurple} fontSize="9" {...cMono} textAnchor="middle">U-bend access</text>
              </g>
            )}
            {mod.kind === 'dishwasher' && (
              <g>
                <rect x={mx + 4} y={y0 + 4} width={mod.w - 8} height={h - 8}
                  fill="rgba(91,141,239,0.18)" stroke={cBlue} />
                <rect x={mx + 12} y={y0 + 14} width={mod.w - 24} height={20} rx="2"
                  fill="none" stroke={cBlue} strokeWidth="0.8" />
                <text x={mx + mod.w / 2} y={y0 + h / 2 + 4} fill={cBlue} fontSize="11" {...cMono} textAnchor="middle" fontWeight="700">DW</text>
                <text x={mx + mod.w / 2} y={y0 + h / 2 + 18} fill={cBlue} fontSize="8" {...cMono} textAnchor="middle">600 mm</text>
              </g>
            )}
            {mod.kind === 'trash' && (
              <g>
                <rect x={mx + 4} y={y0 + 4} width={mod.w - 8} height={h - 8}
                  fill="rgba(31,138,91,0.16)" stroke={cGreen} />
                <text x={mx + mod.w / 2} y={y0 + h / 2 - 6} fill={cGreen} fontSize="9" {...cMono} textAnchor="middle">PULL-OUT</text>
                <text x={mx + mod.w / 2} y={y0 + h / 2 + 8} fill={cGreen} fontSize="9" {...cMono} textAnchor="middle" fontWeight="700">2-BIN</text>
                <line x1={mx + mod.w / 2 - 12} x2={mx + mod.w / 2 + 12} y1={y0 + 30} y2={y0 + 30}
                  stroke={cGreen} strokeWidth="1.5" />
              </g>
            )}
          </g>
        );
      })}
      {/* toe-kick */}
      <rect x={x0} y={y0 + h} width={w} height={14} fill="rgba(26,24,21,0.06)" stroke={cInk} strokeWidth="0.8" />
      <Floor x1="30" x2="600" y={y0 + h + 14} />
      <DimH x1={x0} x2={x0 + w} y={y0 + h + 34} label="3,000 mm" />
      <DimV x={x0 - 14} y1={y0} y2={y0 + h} label="900" />
    </Card>
  );
}

function C_Pantry() {
  const x0 = 220, y0 = 35, w = 200, h = 290;
  return (
    <Card gridId="gc2" code="KBX-CB-02 · TALL · 600w" title="Pantry Column" sub="600 × 2200 × 600 · Linen white · 5-tier wire pull-out">
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke={cInk} strokeWidth="2" />
      {/* outer doors hint */}
      <line x1={x0 + w / 2} y1={y0} x2={x0 + w / 2} y2={y0 + h} stroke={cInk} strokeWidth="0.6" strokeDasharray="2 3" opacity="0.4" />
      {/* pull-out frame */}
      <rect x={x0 + 14} y={y0 + 8} width={w - 28} height={h - 16}
        fill="rgba(31,138,91,0.10)" stroke={cGreen} strokeWidth="1.4" />
      {[0, 1, 2, 3, 4].map(i => (
        <g key={i}>
          <rect x={x0 + 22} y={y0 + 18 + i * 52} width={w - 44} height={42}
            fill="rgba(31,138,91,0.18)" stroke={cGreen} strokeWidth="1" />
          {/* wire mesh */}
          {[0, 1, 2, 3, 4, 5, 6].map(k => (
            <line key={k} x1={x0 + 28 + k * 18} y1={y0 + 22 + i * 52} x2={x0 + 28 + k * 18}
              y2={y0 + 56 + i * 52} stroke={cGreen} strokeWidth="0.5" opacity="0.6" />
          ))}
          <text x={x0 + w / 2} y={y0 + 44 + i * 52} fill={cGreen} fontSize="9" {...cMono} textAnchor="middle">tier {i + 1}</text>
        </g>
      ))}
      {/* slide arrow */}
      <g opacity="0.7">
        <line x1={x0 + w + 20} y1={y0 + h / 2} x2={x0 + w + 50} y2={y0 + h / 2} stroke={cAccent} strokeWidth="1.2" />
        <path d={`M${x0 + w + 50} ${y0 + h / 2} l-5 -4 v8 z`} fill={cAccent} />
        <text x={x0 + w + 35} y={y0 + h / 2 - 6} fill={cAccent} fontSize="9" {...cMono} textAnchor="middle">PULL</text>
      </g>
      <Floor x1="30" x2="600" y={y0 + h + 8} />
      <DimH x1={x0} x2={x0 + w} y={y0 + h + 28} label="600" />
      <DimV x={x0 - 14} y1={y0} y2={y0 + h} label="2,200 mm" />
    </Card>
  );
}

function C_Wall() {
  const x0 = 60, y0 = 80, w = 500, h = 130;
  return (
    <Card gridId="gc3" code="KBX-CB-03 · WALL · 2400w" title="Overhead Wall Run" sub="2400 × 700 × 350 · Pebble grey · 4 lift-up doors with LED">
      {/* ceiling/soffit */}
      <line x1="30" y1={y0 - 14} x2="590" y2={y0 - 14} stroke={cMute} strokeWidth="1" strokeDasharray="3 2" />
      <text x="40" y={y0 - 18} fill={cMute} fontSize="9" {...cMono}>SOFFIT</text>
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke={cInk} strokeWidth="2" />
      {/* 4 lift-up doors */}
      {[0, 1, 2, 3].map(i => {
        const dw = w / 4, dx = x0 + i * dw;
        return (
          <g key={i}>
            <line x1={dx} y1={y0} x2={dx} y2={y0 + h} stroke={cInk} strokeWidth="0.8" opacity={i ? 1 : 0} />
            <rect x={dx + 4} y={y0 + 4} width={dw - 8} height={h - 30}
              fill="rgba(91,141,239,0.10)" stroke={cBlue} strokeWidth="1.2" />
            {/* lift hint */}
            <path d={`M ${dx + 12} ${y0 + 16} q ${dw / 2 - 12} -8 ${dw - 24} 0`}
              fill="none" stroke={cBlue} strokeWidth="0.8" strokeDasharray="2 2" />
            <text x={dx + dw / 2} y={y0 + h / 2 - 4} fill={cBlue} fontSize="10" {...cMono} textAnchor="middle" fontWeight="700">LIFT-UP</text>
            {/* handle */}
            <rect x={dx + dw / 2 - 14} y={y0 + h - 32} width="28" height="4" fill={cInk} />
          </g>
        );
      })}
      {/* LED strip */}
      <rect x={x0} y={y0 + h} width={w} height="4" fill={cAccent} opacity="0.5" />
      <text x={x0 + w / 2} y={y0 + h + 18} fill={cAccent} fontSize="9" {...cMono} textAnchor="middle">UNDER-CABINET LED · 18W/m</text>
      {/* counter beneath */}
      <rect x={x0 - 10} y={y0 + h + 60} width={w + 20} height="10" fill={cWoodFill} stroke={cWood} />
      <text x={x0 + w / 2} y={y0 + h + 88} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">▼ 460 mm to counter</text>
      <DimH x1={x0} x2={x0 + w} y={y0 - 28} label="2,400 mm" />
      <DimV x={x0 - 14} y1={y0} y2={y0 + h} label="700" />
    </Card>
  );
}

function C_Island() {
  const x0 = 80, y0 = 110, w = 460, h = 180;
  return (
    <Card gridId="gc4" code="KBX-CB-04 · ISLAND · 1800w" title="Island · Seat-Side" sub="1800 × 900 × 1100 · Stone-top with 350 cantilever for 3 seats">
      {/* counter overhang */}
      <rect x={x0 - 4} y={y0 - 16} width={w + 8 + 80} height={16} fill={cWoodFill} stroke={cWood} />
      <text x={x0 + w + 40} y={y0 - 22} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">350 mm cantilever ↓</text>
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke={cInk} strokeWidth="2" />
      {/* modules from working side: 2 wide drawers + cooktop ducting void + open shelf */}
      {[
        { x: 0, w: 140, kind: 'drawers' },
        { x: 140, w: 180, kind: 'cook' },
        { x: 320, w: 140, kind: 'shelf' },
      ].map((m, i) => {
        const mx = x0 + m.x;
        return (
          <g key={i}>
            <line x1={mx} y1={y0} x2={mx} y2={y0 + h} stroke={cInk} strokeWidth="0.8" opacity={i ? 1 : 0} />
            {m.kind === 'drawers' && [0, 1, 2].map(j => (
              <g key={j}>
                <rect x={mx + 4} y={y0 + 4 + j * 56} width={m.w - 8} height={54}
                  fill="rgba(201,100,66,0.18)" stroke={cAccent} />
                <line x1={mx + m.w / 2 - 16} x2={mx + m.w / 2 + 16}
                  y1={y0 + 30 + j * 56} y2={y0 + 30 + j * 56} stroke={cAccent} strokeWidth="1.5" />
              </g>
            ))}
            {m.kind === 'cook' && (
              <g>
                <rect x={mx + 4} y={y0 + 4} width={m.w - 8} height={32}
                  fill="rgba(124,92,255,0.18)" stroke={cPurple} />
                {[0, 1, 2, 3].map(k => (
                  <circle key={k} cx={mx + 22 + k * (m.w - 50) / 3} cy={y0 + 20} r="6" fill="none" stroke={cPurple} strokeWidth="1" />
                ))}
                <text x={mx + m.w / 2} y={y0 + 56} fill={cPurple} fontSize="9" {...cMono} textAnchor="middle">COOKTOP DUCT</text>
                <rect x={mx + 4} y={y0 + 70} width={m.w - 8} height={h - 80}
                  fill="rgba(91,141,239,0.10)" stroke={cBlue} strokeDasharray="3 2" />
                <text x={mx + m.w / 2} y={y0 + h / 2 + 30} fill={cBlue} fontSize="9" {...cMono} textAnchor="middle">VOID · 600d</text>
              </g>
            )}
            {m.kind === 'shelf' && [0, 1, 2].map(j => (
              <rect key={j} x={mx + 4} y={y0 + 4 + j * 56} width={m.w - 8} height={54}
                fill={cWoodFill} stroke={cWood} />
            ))}
          </g>
        );
      })}
      <rect x={x0} y={y0 + h} width={w} height={14} fill="rgba(26,24,21,0.06)" stroke={cInk} strokeWidth="0.8" />
      {/* seat-side stools */}
      {[0, 1, 2].map(i => (
        <g key={'s' + i}>
          <line x1={x0 + w + 20 + i * 40} y1={y0 - 4} x2={x0 + w + 20 + i * 40} y2={y0 + h + 18}
            stroke={cMute} strokeWidth="0.8" strokeDasharray="2 2" />
          <circle cx={x0 + w + 20 + i * 40} cy={y0 + 60} r="10" fill={cWoodFill} stroke={cWood} strokeWidth="1.2" />
        </g>
      ))}
      <text x={x0 + w + 60} y={y0 + 100} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">3 stools · 750 SH</text>
      <Floor x1="20" x2="600" y={y0 + h + 14} />
      <DimH x1={x0} x2={x0 + w} y={y0 + h + 32} label="1,800" />
    </Card>
  );
}

function C_Corner() {
  const x0 = 80, y0 = 110, wA = 250, wB = 180, h = 180;
  return (
    <Card gridId="gc5" code="KBX-CB-05 · L-CORNER · 1500+1200w" title="L-Cabinet · Magic Corner" sub="1500 + 1200 × 900 × 600 · Magic-corner pull-out reaches blind dead-zone">
      {/* counter */}
      <rect x={x0 - 4} y={y0 - 16} width={wA + wB + 30} height={16} fill={cWoodFill} stroke={cWood} />
      {/* run A */}
      <rect x={x0} y={y0} width={wA} height={h} fill="none" stroke={cInk} strokeWidth="2" />
      {[0, 1, 2].map(i => (
        <g key={i}>
          <line x1={x0 + (i + 1) * wA / 3} y1={y0} x2={x0 + (i + 1) * wA / 3} y2={y0 + h} stroke={cInk} strokeWidth="0.8" opacity={i === 2 ? 0 : 1} />
          {[0, 1, 2].map(j => (
            <rect key={j} x={x0 + i * wA / 3 + 4} y={y0 + 4 + j * 56} width={wA / 3 - 8} height={54}
              fill="rgba(201,100,66,0.18)" stroke={cAccent} />
          ))}
        </g>
      ))}
      {/* corner module */}
      <rect x={x0 + wA} y={y0} width={30} height={h} fill="rgba(124,92,255,0.18)" stroke={cPurple} strokeWidth="1.5" />
      {/* magic corner sweep */}
      <path d={`M ${x0 + wA + 4} ${y0 + 30} q 50 60 80 0`} fill="none" stroke={cPurple} strokeWidth="1" strokeDasharray="3 2" />
      <text x={x0 + wA + 15} y={y0 + h / 2 + 4} fill={cPurple} fontSize="9" {...cMono}
        textAnchor="middle" transform={`rotate(-90, ${x0 + wA + 15}, ${y0 + h / 2 + 4})`}>MAGIC CORNER</text>
      {/* run B (continuation) */}
      <rect x={x0 + wA + 30} y={y0} width={wB} height={h} fill="none" stroke={cInk} strokeWidth="2" />
      {[0, 1].map(i => (
        <line key={i} x1={x0 + wA + 30 + (i + 1) * wB / 2} y1={y0} x2={x0 + wA + 30 + (i + 1) * wB / 2} y2={y0 + h}
          stroke={cInk} strokeWidth="0.8" opacity={i === 1 ? 0 : 1} />
      ))}
      {/* oven stack */}
      <rect x={x0 + wA + 34} y={y0 + 4} width={wB / 2 - 8} height={h - 8}
        fill="rgba(91,141,239,0.18)" stroke={cBlue} />
      <rect x={x0 + wA + 42} y={y0 + 14} width={wB / 2 - 24} height={56} rx="2" fill={cPaper} stroke={cBlue} strokeWidth="1" />
      <rect x={x0 + wA + 42} y={y0 + 80} width={wB / 2 - 24} height={56} rx="2" fill={cPaper} stroke={cBlue} strokeWidth="1" />
      <text x={x0 + wA + 30 + wB / 4} y={y0 + 46} fill={cBlue} fontSize="10" {...cMono} textAnchor="middle" fontWeight="700">OVEN</text>
      <text x={x0 + wA + 30 + wB / 4} y={y0 + 112} fill={cBlue} fontSize="10" {...cMono} textAnchor="middle" fontWeight="700">MICROWAVE</text>
      <text x={x0 + wA + 30 + wB / 4} y={y0 + 158} fill={cBlue} fontSize="9" {...cMono} textAnchor="middle">drawer</text>
      {/* fridge column */}
      <rect x={x0 + wA + 34 + wB / 2} y={y0 + 4} width={wB / 2 - 8} height={h - 8}
        fill="rgba(31,138,91,0.16)" stroke={cGreen} />
      <text x={x0 + wA + 30 + 3 * wB / 4} y={y0 + h / 2 + 4} fill={cGreen} fontSize="11" {...cMono} textAnchor="middle" fontWeight="700">FRIDGE</text>
      <text x={x0 + wA + 30 + 3 * wB / 4} y={y0 + h / 2 + 20} fill={cGreen} fontSize="9" {...cMono} textAnchor="middle">600 mm</text>
      <rect x={x0} y={y0 + h} width={wA + wB + 30} height={14} fill="rgba(26,24,21,0.06)" stroke={cInk} strokeWidth="0.8" />
      <Floor x1="20" x2="600" y={y0 + h + 14} />
      <DimH x1={x0} x2={x0 + wA} y={y0 + h + 32} label="1,500" />
      <DimH x1={x0 + wA + 30} x2={x0 + wA + 30 + wB} y={y0 + h + 32} label="1,200" />
    </Card>
  );
}

/* ============================================================
   OFFICER DESKS — front + plan combo
   ============================================================ */

function D_Linear() {
  const x0 = 100, y0 = 70, w = 420, h = 30;
  // top-down rectangle + side elevation
  return (
    <Card gridId="gd1" code="KBX-DS-01 · LINEAR · 1800x900" title="Linear Executive" sub="1800 × 900 · 25mm walnut top · 2 fixed pedestals · cable cutout">
      {/* TOP-DOWN */}
      <text x={x0} y={y0 - 14} fill={cMute} fontSize="9" {...cMono}>PLAN</text>
      <rect x={x0} y={y0} width={w} height={140} fill={cWoodFill} stroke={cInk} strokeWidth="2" />
      {/* cable grommet */}
      <circle cx={x0 + w / 2} cy={y0 + 30} r="10" fill={cPaper} stroke={cInk} strokeWidth="1" />
      <circle cx={x0 + w / 2} cy={y0 + 30} r="6" fill="none" stroke={cInk} strokeWidth="0.6" />
      <text x={x0 + w / 2 + 18} y={y0 + 33} fill={cMute} fontSize="9" {...cMono}>cable cutout</text>
      {/* pedestals */}
      <rect x={x0 + 8} y={y0 + 60} width={120} height={70} fill="rgba(201,100,66,0.12)" stroke={cAccent} strokeWidth="1.2" />
      <text x={x0 + 68} y={y0 + 100} fill={cAccent} fontSize="10" {...cMono} textAnchor="middle">3-DRAWER PED</text>
      <rect x={x0 + w - 128} y={y0 + 60} width={120} height={70} fill="rgba(201,100,66,0.12)" stroke={cAccent} strokeWidth="1.2" />
      <text x={x0 + w - 68} y={y0 + 100} fill={cAccent} fontSize="10" {...cMono} textAnchor="middle">2-DRAWER + FILE</text>
      {/* chair */}
      <circle cx={x0 + w / 2} cy={y0 + 195} r="22" fill="rgba(91,141,239,0.10)" stroke={cBlue} strokeWidth="1.2" />
      <path d={`M ${x0 + w / 2 - 18} ${y0 + 175} q 18 -14 36 0`} fill="none" stroke={cBlue} strokeWidth="1.2" />
      <text x={x0 + w / 2} y={y0 + 199} fill={cBlue} fontSize="9" {...cMono} textAnchor="middle">CHAIR</text>
      {/* dims */}
      <DimH x1={x0} x2={x0 + w} y={y0 - 8} label="1,800 mm" />
      <DimV x={x0 - 14} y1={y0} y2={y0 + 140} label="900 mm" />
      {/* SIDE elevation strip */}
      <text x={x0} y={y0 + 240} fill={cMute} fontSize="9" {...cMono}>ELEV</text>
      <rect x={x0} y={y0 + 250} width={w} height="12" fill={cWoodFill} stroke={cInk} strokeWidth="1.5" />
      <rect x={x0 + 8} y={y0 + 262} width={120} height={48} fill="rgba(201,100,66,0.12)" stroke={cAccent} strokeWidth="1" />
      {[0, 1, 2].map(i => (
        <line key={i} x1={x0 + 24} x2={x0 + 112} y1={y0 + 274 + i * 14} y2={y0 + 274 + i * 14} stroke={cAccent} strokeWidth="0.8" />
      ))}
      <rect x={x0 + w - 128} y={y0 + 262} width={120} height={48} fill="rgba(201,100,66,0.12)" stroke={cAccent} strokeWidth="1" />
      {[0, 1].map(i => (
        <line key={i} x1={x0 + w - 112} x2={x0 + w - 16} y1={y0 + 276 + i * 18} y2={y0 + 276 + i * 18} stroke={cAccent} strokeWidth="0.8" />
      ))}
      <Floor x1="40" x2="580" y={y0 + 312} />
    </Card>
  );
}

function D_LShape() {
  const x0 = 90, y0 = 70;
  return (
    <Card gridId="gd2" code="KBX-DS-02 · L-SHAPE · 1800+1500" title="L-Shape Manager" sub="1800 × 1500 · main + return · pedestal + lateral file">
      <text x={x0} y={y0 - 14} fill={cMute} fontSize="9" {...cMono}>PLAN</text>
      {/* main top */}
      <rect x={x0} y={y0} width={420} height={75} fill={cWoodFill} stroke={cInk} strokeWidth="2" />
      {/* return */}
      <rect x={x0 + 420 - 75} y={y0 + 75} width={75} height={180} fill={cWoodFill} stroke={cInk} strokeWidth="2" />
      {/* grommets */}
      <circle cx={x0 + 220} cy={y0 + 18} r="8" fill={cPaper} stroke={cInk} strokeWidth="1" />
      <circle cx={x0 + 220} cy={y0 + 18} r="4" fill="none" stroke={cInk} strokeWidth="0.5" />
      <circle cx={x0 + 420 - 38} cy={y0 + 200} r="8" fill={cPaper} stroke={cInk} strokeWidth="1" />
      {/* pedestal under main left */}
      <rect x={x0 + 12} y={y0 + 14} width={90} height={55} fill="rgba(201,100,66,0.12)" stroke={cAccent} strokeWidth="1.2" />
      <text x={x0 + 57} y={y0 + 46} fill={cAccent} fontSize="9" {...cMono} textAnchor="middle">3-DRAWER</text>
      {/* lateral file along main right under */}
      <rect x={x0 + 240} y={y0 + 14} width={120} height={55} fill="rgba(124,92,255,0.14)" stroke={cPurple} strokeWidth="1.2" />
      <text x={x0 + 300} y={y0 + 46} fill={cPurple} fontSize="9" {...cMono} textAnchor="middle">LATERAL FILE</text>
      {/* keyboard tray hint along return */}
      <rect x={x0 + 420 - 70} y={y0 + 90} width={64} height="6" fill="rgba(91,141,239,0.18)" stroke={cBlue} strokeWidth="1" />
      <text x={x0 + 420 - 38} y={y0 + 110} fill={cBlue} fontSize="9" {...cMono} textAnchor="middle">kbd tray</text>
      {/* chair */}
      <circle cx={x0 + 380} cy={y0 + 130} r="20" fill="rgba(91,141,239,0.10)" stroke={cBlue} strokeWidth="1.2" />
      <text x={x0 + 380} y={y0 + 134} fill={cBlue} fontSize="9" {...cMono} textAnchor="middle">CHAIR</text>
      {/* visitor chairs */}
      {[0, 1].map(i => (
        <g key={i}>
          <circle cx={x0 + 80 + i * 100} cy={y0 + 220} r="16" fill={cPaper} stroke={cMute} strokeWidth="1" />
          <text x={x0 + 80 + i * 100} y={y0 + 224} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">v{i + 1}</text>
        </g>
      ))}
      {/* dims */}
      <DimH x1={x0} x2={x0 + 420} y={y0 - 8} label="1,800 mm" />
      <DimV x={x0 + 420 + 22} y1={y0} y2={y0 + 255} label="1,500 mm" side="right" />
      <DimV x={x0 - 14} y1={y0} y2={y0 + 75} label="750" />
      <Floor x1="30" x2="600" y={y0 + 290} />
      <text x={x0} y={y0 + 286} fill={cMute} fontSize="9" {...cMono}>SH 750 mm · clearance 600 knee · ergonomic verified ✓</text>
    </Card>
  );
}

function D_SitStand() {
  const x0 = 100, y0 = 60, w = 380, h = 180;
  return (
    <Card gridId="gd3" code="KBX-DS-03 · SIT-STAND · 1600x800" title="Height-Adjustable" sub="1600 × 800 · 650–1250 mm · 3-stage motor · memory presets">
      <text x={x0} y={y0 - 14} fill={cMute} fontSize="9" {...cMono}>FRONT ELEVATION · range</text>
      {/* sit position */}
      <g opacity="0.35">
        <rect x={x0} y={y0 + 110} width={w} height="10" fill={cWoodFill} stroke={cInk} />
        <rect x={x0 + 30} y={y0 + 120} width="14" height={70} fill={cInk} />
        <rect x={x0 + w - 44} y={y0 + 120} width="14" height={70} fill={cInk} />
      </g>
      {/* current standing position */}
      <rect x={x0} y={y0 + 30} width={w} height="14" fill={cWoodFill} stroke={cInk} strokeWidth="1.8" />
      <rect x={x0 + 30} y={y0 + 44} width="14" height={150} fill={cInk} />
      <rect x={x0 + w - 44} y={y0 + 44} width="14" height={150} fill={cInk} />
      {/* telescoping segments */}
      {[0, 1].map(side => {
        const sx = side === 0 ? x0 + 24 : x0 + w - 50;
        return [0, 1].map(i => (
          <line key={`${side}-${i}`} x1={sx} x2={sx + 26}
            y1={y0 + 80 + i * 35} y2={y0 + 80 + i * 35} stroke={cAccent} strokeWidth="0.8" />
        ));
      })}
      {/* range arrow */}
      <line x1={x0 + w + 18} y1={y0 + 30} x2={x0 + w + 18} y2={y0 + 195} stroke={cAccent} strokeWidth="1.2" />
      <path d={`M ${x0 + w + 18} ${y0 + 30} l-3 6 h6 z`} fill={cAccent} />
      <path d={`M ${x0 + w + 18} ${y0 + 195} l-3 -6 h6 z`} fill={cAccent} />
      <text x={x0 + w + 30} y={y0 + 110} fill={cAccent} fontSize="9" {...cMono}>650 → 1,250</text>
      <text x={x0 + w + 30} y={y0 + 124} fill={cAccent} fontSize="9" {...cMono}>mm</text>
      {/* preset pad */}
      <rect x={x0 + w / 2 - 30} y={y0 + 50} width={60} height={14} rx="2" fill={cInk} />
      {[0, 1, 2, 3].map(i => (
        <circle key={i} cx={x0 + w / 2 - 21 + i * 14} cy={y0 + 57} r="3" fill={i === 1 ? cAccent : cPaper} />
      ))}
      <text x={x0 + w / 2} y={y0 + 78} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">SIT · STAND · PRESET 1 · 2</text>
      {/* monitor */}
      <rect x={x0 + w / 2 - 80} y={y0 - 14} width={160} height={44} fill="rgba(91,141,239,0.10)" stroke={cBlue} strokeWidth="1.2" />
      <rect x={x0 + w / 2 - 6} y={y0 + 30} width={12} height={6} fill={cBlue} />
      <text x={x0 + w / 2} y={y0 + 12} fill={cBlue} fontSize="10" {...cMono} textAnchor="middle">27" MONITOR</text>
      <Floor x1="40" x2="580" y={y0 + 195} />
      <DimH x1={x0} x2={x0 + w} y={y0 + 215} label="1,600 mm" />
    </Card>
  );
}

function D_Bench() {
  const x0 = 60, y0 = 60, w = 500, h = 80;
  return (
    <Card gridId="gd4" code="KBX-DS-04 · BENCH · 4-PERSON" title="Bench · 4 Seats" sub="2800 × 1400 · shared run · 4 stations · centre power spine">
      <text x={x0} y={y0 - 14} fill={cMute} fontSize="9" {...cMono}>PLAN · 2 facing · 2 back-to-back</text>
      {/* bench rectangle */}
      <rect x={x0} y={y0} width={w} height={h} fill={cWoodFill} stroke={cInk} strokeWidth="2" />
      {/* power spine centre */}
      <rect x={x0} y={y0 + h / 2 - 6} width={w} height={12} fill="rgba(201,100,66,0.18)" stroke={cAccent} strokeWidth="1" />
      <text x={x0 + w / 2} y={y0 + h / 2 + 3} fill={cAccent} fontSize="9" {...cMono} textAnchor="middle" fontWeight="700">POWER + DATA SPINE</text>
      {/* dividers per seat */}
      {[1, 2, 3].map(i => (
        <line key={i} x1={x0 + i * w / 4} y1={y0} x2={x0 + i * w / 4} y2={y0 + h} stroke={cInk} strokeWidth="0.6" strokeDasharray="3 2" />
      ))}
      {/* monitors per seat (above) */}
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <rect x={x0 + i * w / 4 + 12} y={y0 + 18} width={w / 4 - 24} height={6}
            fill="rgba(91,141,239,0.18)" stroke={cBlue} strokeWidth="1" />
          <text x={x0 + i * w / 4 + w / 8} y={y0 + 12} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">monitor</text>
          <rect x={x0 + i * w / 4 + 12} y={y0 + h - 24} width={w / 4 - 24} height={6}
            fill="rgba(91,141,239,0.18)" stroke={cBlue} strokeWidth="1" />
        </g>
      ))}
      {/* chairs */}
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          {/* front side seats top */}
          <circle cx={x0 + i * w / 4 + w / 8} cy={y0 - 36} r="14" fill="rgba(91,141,239,0.10)" stroke={cBlue} strokeWidth="1" opacity={i < 2 ? 1 : 0.35} />
          <circle cx={x0 + i * w / 4 + w / 8} cy={y0 + h + 36} r="14" fill="rgba(91,141,239,0.10)" stroke={cBlue} strokeWidth="1" opacity={i >= 2 ? 1 : 0.35} />
        </g>
      ))}
      {/* end pedestals */}
      <rect x={x0 + 8} y={y0 + h + 60} width={80} height={32} fill="rgba(201,100,66,0.12)" stroke={cAccent} strokeWidth="1" />
      <text x={x0 + 48} y={y0 + h + 80} fill={cAccent} fontSize="9" {...cMono} textAnchor="middle">MOBILE PED</text>
      <rect x={x0 + w - 88} y={y0 + h + 60} width={80} height={32} fill="rgba(201,100,66,0.12)" stroke={cAccent} strokeWidth="1" />
      <text x={x0 + w - 48} y={y0 + h + 80} fill={cAccent} fontSize="9" {...cMono} textAnchor="middle">MOBILE PED</text>
      <text x={x0 + w / 2} y={y0 + h + 80} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">×4 personal · roll-under</text>
      {/* dims */}
      <DimH x1={x0} x2={x0 + w} y={y0 - 50} label="2,800 mm" />
      <DimV x={x0 - 14} y1={y0 - 50} y2={y0 + h + 50} label="1,400 mm" />
      <DimH x1={x0} x2={x0 + w / 4} y={y0 + h + 110} label="700 / seat" />
      <Floor x1="30" x2="600" y={y0 + h + 124} />
    </Card>
  );
}

function D_Reception() {
  const x0 = 70, y0 = 70;
  return (
    <Card gridId="gd5" code="KBX-DS-05 · RECEPTION · curved" title="Reception · Console" sub="2400 × 750 · curved walnut front · raised transaction shelf · branded panel">
      <text x={x0} y={y0 - 14} fill={cMute} fontSize="9" {...cMono}>FRONT ELEVATION + TRANSACTION SHELF</text>
      {/* outer console */}
      <path d={`M ${x0} ${y0 + 30} Q ${x0 + 240} ${y0 + 6} ${x0 + 480} ${y0 + 30} L ${x0 + 480} ${y0 + 180} L ${x0} ${y0 + 180} Z`}
        fill={cWoodFill} stroke={cInk} strokeWidth="2" />
      {/* transaction shelf top */}
      <path d={`M ${x0 + 20} ${y0 + 38} Q ${x0 + 240} ${y0 + 16} ${x0 + 460} ${y0 + 38}`}
        fill="none" stroke={cInk} strokeWidth="1" />
      <text x={x0 + 240} y={y0 + 30} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">↑ raised shelf · 1,150 mm</text>
      {/* fluted front panels */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
        <line key={i} x1={x0 + 20 + i * 38} y1={y0 + 60} x2={x0 + 20 + i * 38} y2={y0 + 178}
          stroke={cWood} strokeWidth="0.8" />
      ))}
      {/* branded plate */}
      <rect x={x0 + 180} y={y0 + 90} width={120} height={50} fill={cAccent} />
      <text x={x0 + 240} y={y0 + 120} fill={cPaper} fontSize="14" fontWeight="700"
        fontFamily='"Fraunces", Georgia, serif' textAnchor="middle" letterSpacing="0.16em">KREOBOX</text>
      {/* cabinets behind on plan strip below */}
      <text x={x0} y={y0 + 220} fill={cMute} fontSize="9" {...cMono}>PLAN · operator side</text>
      <rect x={x0} y={y0 + 230} width={480} height={50} fill="none" stroke={cInk} strokeWidth="1.5" />
      <rect x={x0 + 8} y={y0 + 234} width={130} height={42} fill="rgba(201,100,66,0.12)" stroke={cAccent} strokeWidth="1" />
      <text x={x0 + 73} y={y0 + 258} fill={cAccent} fontSize="9" {...cMono} textAnchor="middle">3-DRAWER</text>
      <rect x={x0 + 150} y={y0 + 234} width={180} height={42} fill="rgba(91,141,239,0.10)" stroke={cBlue} strokeWidth="1" />
      <text x={x0 + 240} y={y0 + 258} fill={cBlue} fontSize="9" {...cMono} textAnchor="middle">CPU + KBD TRAY</text>
      <rect x={x0 + 342} y={y0 + 234} width={130} height={42} fill="rgba(124,92,255,0.14)" stroke={cPurple} strokeWidth="1" />
      <text x={x0 + 407} y={y0 + 258} fill={cPurple} fontSize="9" {...cMono} textAnchor="middle">CABLE / DOC</text>
      <Floor x1="30" x2="600" y={y0 + 290} />
      <DimH x1={x0} x2={x0 + 480} y={y0 + 196} label="2,400 mm" />
    </Card>
  );
}

/* ============================================================
   STORAGE / SHELVES
   ============================================================ */

function S_Library() {
  const x0 = 90, y0 = 30, w = 420, h = 300;
  return (
    <Card gridId="gs1" code="KBX-ST-01 · LIBRARY · 2400h" title="Open Library Shelf" sub="1800 × 2400 × 350 · 6 fixed shelves · solid back · floor-anchored">
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke={cInk} strokeWidth="2" />
      {[0, 1, 2, 3, 4, 5].map(i => (
        <rect key={i} x={x0 + 4} y={y0 + 4 + i * (h - 8) / 6} width={w - 8} height={(h - 8) / 6 - 2}
          fill={cWoodFill} stroke={cWood} strokeWidth="0.8" />
      ))}
      {/* objects */}
      {[0, 1, 2, 3, 4, 5].map(row => (
        Array.from({ length: 9 + (row % 2) }).map((_, i) => {
          const sw = (w - 24) / (9 + (row % 2));
          const sh = (h - 8) / 6 - 8;
          const variants = [sh, sh - 6, sh - 12, sh - 4, sh - 10];
          const bH = variants[(i + row) % variants.length];
          const cols = ['rgba(201,100,66,0.6)', 'rgba(91,141,239,0.6)', 'rgba(124,92,255,0.6)', 'rgba(31,138,91,0.55)', 'rgba(169,154,130,0.7)', cInk + '99'];
          return (
            <rect key={`${row}-${i}`}
              x={x0 + 12 + i * sw}
              y={y0 + 4 + (row + 1) * (h - 8) / 6 - bH - 4}
              width={sw - 2} height={bH}
              fill={cols[(i + row * 3) % cols.length]} />
          );
        })
      ))}
      {/* one shelf has a bowl/object */}
      <ellipse cx={x0 + w - 70} cy={y0 + 4 + 3 * (h - 8) / 6 - 8} rx="20" ry="6" fill={cAccent} opacity="0.7" />
      <Floor x1="30" x2="600" y={y0 + h + 8} />
      <DimH x1={x0} x2={x0 + w} y={y0 + h + 28} label="1,800 mm" />
      <DimV x={x0 - 14} y1={y0} y2={y0 + h} label="2,400 mm" />
      <text x={x0 + w + 14} y={y0 + h / 2} fill={cMute} fontSize="9" {...cMono}>D 350</text>
    </Card>
  );
}

function S_Credenza() {
  const x0 = 60, y0 = 170, w = 500, h = 130;
  return (
    <Card gridId="gs2" code="KBX-ST-02 · CREDENZA · 1800w" title="Low Credenza" sub="1800 × 700 × 450 · 2 doors + 4 drawers · brass legs · objects on top">
      {/* objects on top */}
      <ellipse cx={x0 + 60} cy={y0 - 6} rx="22" ry="8" fill={cAccent} opacity="0.8" />
      <text x={x0 + 60} y={y0 - 22} fill={cMute} fontSize="8" {...cMono} textAnchor="middle">vase</text>
      <rect x={x0 + 130} y={y0 - 30} width={50} height={28} fill={cWoodFill} stroke={cWood} />
      <text x={x0 + 155} y={y0 - 36} fill={cMute} fontSize="8" {...cMono} textAnchor="middle">books</text>
      <rect x={x0 + 220} y={y0 - 24} width={70} height={22} fill="rgba(91,141,239,0.4)" stroke={cBlue} />
      <rect x={x0 + 380} y={y0 - 50} width={40} height={48} fill="none" stroke={cWood} strokeWidth="1.2" />
      <rect x={x0 + 384} y={y0 - 36} width={32} height={20} fill={cWoodFill} stroke={cWood} />
      <text x={x0 + 400} y={y0 - 56} fill={cMute} fontSize="8" {...cMono} textAnchor="middle">lamp</text>
      {/* carcass */}
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke={cInk} strokeWidth="2" />
      {/* 2 doors left + 4 drawers right */}
      <rect x={x0 + 4} y={y0 + 4} width={120} height={h - 8} fill="rgba(91,141,239,0.10)" stroke={cBlue} strokeWidth="1.2" />
      <rect x={x0 + 128} y={y0 + 4} width={120} height={h - 8} fill="rgba(91,141,239,0.10)" stroke={cBlue} strokeWidth="1.2" />
      {/* knobs */}
      <circle cx={x0 + 110} cy={y0 + h / 2} r="3" fill={cInk} />
      <circle cx={x0 + 142} cy={y0 + h / 2} r="3" fill={cInk} />
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <rect x={x0 + 252} y={y0 + 4 + i * (h - 8) / 4} width={w - 256} height={(h - 8) / 4 - 2}
            fill="rgba(201,100,66,0.18)" stroke={cAccent} />
          <line x1={x0 + 252 + (w - 256) / 2 - 18} x2={x0 + 252 + (w - 256) / 2 + 18}
            y1={y0 + 4 + i * (h - 8) / 4 + (h - 8) / 8} y2={y0 + 4 + i * (h - 8) / 4 + (h - 8) / 8}
            stroke={cAccent} strokeWidth="1.5" />
        </g>
      ))}
      <line x1={x0 + 250} y1={y0} x2={x0 + 250} y2={y0 + h} stroke={cInk} strokeWidth="0.8" />
      {/* brass legs */}
      {[0, 1].map(i => (
        <g key={i}>
          <rect x={x0 + 4 + i * (w - 14)} y={y0 + h} width="10" height="20" fill={cAccent} />
          <rect x={x0 + 4 + i * (w - 14)} y={y0 + h + 18} width="10" height="2" fill={cInk} />
        </g>
      ))}
      <Floor x1="30" x2="600" y={y0 + h + 20} />
      <DimH x1={x0} x2={x0 + w} y={y0 + h + 38} label="1,800 mm" />
      <DimV x={x0 - 14} y1={y0} y2={y0 + h + 20} label="700" />
    </Card>
  );
}

function S_Lockers() {
  const x0 = 80, y0 = 40, bayW = 90, bayH = 280, gap = 4;
  return (
    <Card gridId="gs3" code="KBX-ST-03 · LOCKER · 6-PERSON" title="Locker Bank · 6" sub="1800 × 2200 × 450 · 6 personal lockers · RFID lock · vent slots">
      {[0, 1, 2, 3, 4, 5].map(i => {
        const x = x0 + i * (bayW + gap);
        const col = [cBlue, cAccent, cPurple, cGreen, cBlue, cAccent][i];
        return (
          <g key={i}>
            <rect x={x} y={y0} width={bayW} height={bayH} fill={`${col}1f`} stroke={col} strokeWidth="1.5" />
            {/* RFID pad */}
            <rect x={x + bayW / 2 - 10} y={y0 + 30} width={20} height={14} rx="2" fill={cInk} />
            <circle cx={x + bayW / 2} cy={y0 + 37} r="3" fill={cAccent} />
            {/* vent slots */}
            {[0, 1, 2, 3].map(j => (
              <rect key={j} x={x + bayW / 2 - 12} y={y0 + 70 + j * 6} width={24} height={2} fill={cInk} opacity="0.5" />
            ))}
            {/* nameplate */}
            <rect x={x + bayW / 2 - 24} y={y0 + 110} width={48} height={14} fill={cPaper} stroke={col} strokeWidth="0.8" />
            <text x={x + bayW / 2} y={y0 + 120} fill={cInk} fontSize="8" {...cMono} textAnchor="middle">USR-{(i + 1).toString().padStart(2, '0')}</text>
            {/* handle recess */}
            <rect x={x + bayW / 2 - 10} y={y0 + bayH - 60} width={20} height={4} fill={cInk} />
            {/* number on door */}
            <text x={x + bayW / 2} y={y0 + bayH - 18} fill={col} fontSize="22" {...cFr} textAnchor="middle">{i + 1}</text>
          </g>
        );
      })}
      <Floor x1="40" x2="580" y={y0 + bayH + 8} />
      <DimH x1={x0} x2={x0 + 6 * bayW + 5 * gap} y={y0 + bayH + 28} label="1,800 mm" />
      <DimV x={x0 - 14} y1={y0} y2={y0 + bayH} label="2,200 mm" />
    </Card>
  );
}

function S_CubeGrid() {
  const x0 = 80, y0 = 40, n = 5, m = 5, cell = 56;
  return (
    <Card gridId="gs4" code="KBX-ST-04 · CUBE · 5×5" title="Modular Cube Grid" sub="2200 × 2200 × 350 · 25 cubes · selectable inserts: door / drawer / open">
      <rect x={x0} y={y0} width={n * cell} height={m * cell} fill="none" stroke={cInk} strokeWidth="2" />
      {Array.from({ length: m }).map((_, r) => (
        Array.from({ length: n }).map((_, c) => {
          // some cells get inserts
          const kind = ((r * 7 + c * 3) % 6); // pseudo-random
          const cx = x0 + c * cell, cy = y0 + r * cell;
          let fill = 'transparent', stroke = cWood;
          let label = '';
          if (kind === 0) { fill = cWoodFill; stroke = cWood; }
          else if (kind === 1) { fill = 'rgba(91,141,239,0.18)'; stroke = cBlue; label = 'door'; }
          else if (kind === 2) { fill = 'rgba(201,100,66,0.18)'; stroke = cAccent; label = 'drwr'; }
          else if (kind === 3) { fill = 'rgba(31,138,91,0.16)'; stroke = cGreen; label = 'plant'; }
          else if (kind === 4) { fill = 'rgba(124,92,255,0.18)'; stroke = cPurple; label = 'box'; }
          else { fill = cPaper; stroke = cWood; }
          return (
            <g key={`${r}-${c}`}>
              <rect x={cx + 1} y={cy + 1} width={cell - 2} height={cell - 2}
                fill={fill} stroke={stroke} strokeWidth="0.8" />
              {kind === 2 && (
                <line x1={cx + cell / 2 - 10} x2={cx + cell / 2 + 10}
                  y1={cy + cell / 2} y2={cy + cell / 2} stroke={cAccent} strokeWidth="1.5" />
              )}
              {kind === 1 && (
                <circle cx={cx + cell - 10} cy={cy + cell / 2} r="2" fill={cBlue} />
              )}
              {kind === 3 && (
                <g>
                  <ellipse cx={cx + cell / 2} cy={cy + cell - 14} rx="12" ry="4" fill={cGreen} opacity="0.6" />
                  <path d={`M ${cx + cell / 2} ${cy + cell - 14} q -10 -16 -2 -28 q 6 12 2 28 z`} fill={cGreen} opacity="0.6" />
                </g>
              )}
              {kind === 4 && label && (
                <text x={cx + cell / 2} y={cy + cell / 2 + 3} fill={cPurple} fontSize="8" {...cMono} textAnchor="middle">box</text>
              )}
            </g>
          );
        })
      ))}
      {/* legend */}
      <g transform={`translate(${x0 + n * cell + 22}, ${y0 + 10})`}>
        <text x="0" y="0" fill={cMute} fontSize="9" {...cMono}>INSERTS</text>
        {[
          ['Open', cWood],
          ['Door', cBlue],
          ['Drawer', cAccent],
          ['Plant', cGreen],
          ['Box', cPurple],
        ].map(([l, c], i) => (
          <g key={l} transform={`translate(0, ${20 + i * 16})`}>
            <rect x="0" y="-7" width="10" height="10" fill={c} opacity="0.4" stroke={c} strokeWidth="0.8" />
            <text x="14" y="2" fill={cInk} fontSize="9" {...cMono}>{l}</text>
          </g>
        ))}
      </g>
      <Floor x1="40" x2="580" y={y0 + m * cell + 8} />
      <DimH x1={x0} x2={x0 + n * cell} y={y0 + m * cell + 28} label="2,200 mm" />
      <DimV x={x0 - 14} y1={y0} y2={y0 + m * cell} label="2,200" />
    </Card>
  );
}

function S_FilingTower() {
  const x0 = 220, y0 = 35, w = 200, h = 290;
  return (
    <Card gridId="gs5" code="KBX-ST-05 · FILING · 600w" title="Filing Tower" sub="600 × 2200 × 600 · 4 deep drawers · A4 + foolscap · suspension rails">
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke={cInk} strokeWidth="2" />
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <rect x={x0 + 4} y={y0 + 4 + i * (h - 8) / 4} width={w - 8} height={(h - 8) / 4 - 2}
            fill="rgba(201,100,66,0.16)" stroke={cAccent} strokeWidth="1.2" />
          {/* handle */}
          <rect x={x0 + w / 2 - 22} y={y0 + 4 + i * (h - 8) / 4 + (h - 8) / 8 - 3} width={44} height={6}
            fill={cInk} />
          {/* label tag */}
          <rect x={x0 + 14} y={y0 + 4 + i * (h - 8) / 4 + 8} width={42} height={16} fill={cPaper} stroke={cAccent} strokeWidth="0.8" />
          <text x={x0 + 35} y={y0 + 4 + i * (h - 8) / 4 + 19} fill={cAccent} fontSize="8" {...cMono} textAnchor="middle">{['A–F', 'G–L', 'M–S', 'T–Z'][i]}</text>
          {/* hanging files visible */}
          {Array.from({ length: 14 }).map((_, k) => (
            <line key={k} x1={x0 + 14 + k * (w - 28) / 14} y1={y0 + 4 + i * (h - 8) / 4 + 36}
              x2={x0 + 14 + k * (w - 28) / 14} y2={y0 + 4 + i * (h - 8) / 4 + (h - 8) / 4 - 8}
              stroke={cAccent} strokeWidth="0.6" opacity="0.5" />
          ))}
        </g>
      ))}
      {/* anti-tilt bar at top */}
      <line x1={x0 - 2} y1={y0 - 10} x2={x0 + w + 2} y2={y0 - 10} stroke={cMute} strokeWidth="1" strokeDasharray="3 2" />
      <text x={x0 + w / 2} y={y0 - 16} fill={cMute} fontSize="9" {...cMono} textAnchor="middle">↳ wall anchor</text>
      <Floor x1="30" x2="600" y={y0 + h + 8} />
      <DimH x1={x0} x2={x0 + w} y={y0 + h + 28} label="600" />
      <DimV x={x0 - 14} y1={y0} y2={y0 + h} label="2,200 mm" />
    </Card>
  );
}

Object.assign(window, {
  W_Compact, W_DoubleHang, W_Walkin, W_Sliding, W_Corner,
  C_BaseRun, C_Pantry, C_Wall, C_Island, C_Corner,
  D_Linear, D_LShape, D_SitStand, D_Bench, D_Reception,
  S_Library, S_Credenza, S_Lockers, S_CubeGrid, S_FilingTower,
});
