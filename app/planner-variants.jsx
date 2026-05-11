/* ============================================================
   PLANNER VARIANTS · Wardrobe + Office (studio-side)
   Original Kreobox designs, not recreations of any third-party tool.
   - WardrobePlanner: front elevation of frames, drag interior modules
   - OfficePlanner:   linked top-down floor plan + active storage detail
   ============================================================ */

const vInk = '#1a1815';
const vPaper = '#fafaf7';
const vBg = '#f0eee9';
const vMute = 'rgba(26,24,21,0.55)';
const vLine = 'rgba(26,24,21,0.09)';
const vAccent = '#c96442';

const vS = {
  shell: {
    width: '100%', height: '100%', background: vBg, color: vInk,
    fontFamily: '"Inter Tight", sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  topbar: {
    height: 56, padding: '0 22px', background: vPaper, borderBottom: `1px solid ${vLine}`,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
  },
  body: { flex: 1, display: 'flex', minHeight: 0 },
  panel: { background: vPaper, borderRight: `1px solid ${vLine}`, display: 'flex', flexDirection: 'column' },
  fraunces: { fontFamily: '"Fraunces", Georgia, serif' },
  mono: { fontFamily: 'JetBrains Mono, monospace' },
  primaryBtn: { padding: '7px 13px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: vInk, color: vPaper },
  ghostBtn: { padding: '7px 13px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${vLine}` },
  productSwitch: {
    display: 'flex', background: 'rgba(26,24,21,0.05)', borderRadius: 8, padding: 3, gap: 2,
  },
};

function VLogo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M16 28 H84 V84 Q84 90 78 90 H22 Q16 90 16 84 Z M30 42 V76 H70 V42 Z" fill={vAccent} />
      <rect x="20" y="10" width="68" height="14" rx="3" transform="rotate(-8 54 17)" fill={vAccent} fillOpacity="0.7" />
    </svg>
  );
}

function ProductSwitch({ active = 'Wardrobe' }) {
  const opts = ['Kitchen', 'Wardrobe', 'Office'];
  return (
    <div style={vS.productSwitch}>
      {opts.map(o => (
        <span key={o} style={{
          padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 6,
          background: o === active ? vPaper : 'transparent',
          color: o === active ? vInk : vMute,
          boxShadow: o === active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
        }}>{o}</span>
      ))}
    </div>
  );
}

/* ── Wardrobe front elevation (3 bays, mixed interior) ───────── */
function WardrobeElevation({ selectedBay = 1 }) {
  // 3 bays, 2400h × 900w each, total 2700w
  // viewBox 540 × 360 (1u = 5mm-ish)
  const bayW = 180, bayH = 320;
  const start = 0;
  const yTop = 20;

  const interiors = [
    // bay 0: long hang + shelves
    [
      { y: 0,  h: 60, type: 'shelf', label: '1 shelf' },
      { y: 60, h: 200, type: 'hang', label: 'Long hang' },
      { y: 260, h: 60, type: 'drawer', label: '2 drawers' },
    ],
    // bay 1 (selected): double hang
    [
      { y: 0,  h: 30, type: 'shelf', label: 'Top shelf' },
      { y: 30, h: 130, type: 'hang', label: 'Hang · 1m' },
      { y: 160, h: 130, type: 'hang', label: 'Hang · 1m' },
      { y: 290, h: 30, type: 'shelf', label: 'Bottom' },
    ],
    // bay 2: drawers + shelves
    [
      { y: 0, h: 80, type: 'shelf', label: '2 shelves' },
      { y: 80, h: 80, type: 'basket', label: '2 baskets' },
      { y: 160, h: 160, type: 'drawer', label: '4 drawers' },
    ],
  ];

  const colors = {
    shelf: '#e8e2d5',
    hang: 'rgba(91,141,239,0.18)',
    drawer: 'rgba(201,100,66,0.18)',
    basket: 'rgba(124,92,255,0.18)',
  };
  const stroke = {
    shelf: '#a99a82',
    hang: '#5b8def',
    drawer: vAccent,
    basket: '#7c5cff',
  };

  return (
    <svg viewBox="0 0 600 380" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <pattern id="wgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(26,24,21,0.06)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="600" height="380" fill={vPaper} />
      <rect x="20" y={yTop} width="560" height={bayH + 20} fill="url(#wgrid)" />

      {/* floor line */}
      <line x1="20" y1={yTop + bayH + 20} x2="580" y2={yTop + bayH + 20} stroke={vInk} strokeWidth="2" />

      {[0, 1, 2].map(bi => {
        const x = 30 + bi * (bayW + 5);
        const isSel = bi === selectedBay;
        return (
          <g key={bi}>
            {/* frame */}
            <rect x={x} y={yTop} width={bayW} height={bayH}
              fill="none" stroke={isSel ? vAccent : vInk} strokeWidth={isSel ? 3 : 2} />
            {/* interior modules */}
            {interiors[bi].map((m, mi) => (
              <g key={mi}>
                <rect x={x + 4} y={yTop + 4 + (m.y * bayH / 320)} width={bayW - 8} height={(m.h * bayH / 320) - 4}
                  fill={colors[m.type]} stroke={stroke[m.type]} strokeWidth="1" />
                {/* hang rod */}
                {m.type === 'hang' && (
                  <line x1={x + 12} y1={yTop + 4 + (m.y * bayH / 320) + 8}
                    x2={x + bayW - 12} y2={yTop + 4 + (m.y * bayH / 320) + 8}
                    stroke={stroke.hang} strokeWidth="2" />
                )}
                {/* drawer pulls */}
                {m.type === 'drawer' && (() => {
                  const ny = (m.h * bayH / 320) - 4;
                  const rows = m.label.includes('4') ? 4 : 2;
                  return Array.from({ length: rows }).map((_, ri) => (
                    <line key={ri}
                      x1={x + bayW / 2 - 14} x2={x + bayW / 2 + 14}
                      y1={yTop + 4 + (m.y * bayH / 320) + (ri + 0.5) * (ny / rows)}
                      y2={yTop + 4 + (m.y * bayH / 320) + (ri + 0.5) * (ny / rows)}
                      stroke={stroke.drawer} strokeWidth="1.5" />
                  ));
                })()}
                <text x={x + bayW / 2} y={yTop + 4 + (m.y * bayH / 320) + (m.h * bayH / 320) / 2 + 3}
                  fill={vInk} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" opacity="0.7">
                  {m.label}
                </text>
              </g>
            ))}
            {/* bay label */}
            <text x={x + bayW / 2} y={yTop - 8} fill={isSel ? vAccent : vMute} fontSize="10"
              fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight={isSel ? 700 : 500}>
              BAY {String.fromCharCode(65 + bi)} · 900mm
            </text>
            {/* dim */}
            <text x={x + bayW / 2} y={yTop + bayH + 35} fill={vMute} fontSize="9"
              fontFamily="JetBrains Mono, monospace" textAnchor="middle">2400 × 900 × 600</text>
          </g>
        );
      })}

      {/* total dim */}
      <line x1="30" y1={yTop + bayH + 50} x2={30 + 3 * bayW + 10} y2={yTop + bayH + 50} stroke={vMute} strokeWidth="1" />
      <text x={30 + (3 * bayW + 10) / 2} y={yTop + bayH + 64} fill={vMute} fontSize="10"
        fontFamily="JetBrains Mono, monospace" textAnchor="middle">2,710 mm overall</text>
    </svg>
  );
}

/* ── WARDROBE PLANNER ────────────────────────────────────────── */
function WardrobePlanner() {
  return (
    <div style={vS.shell}>
      <div style={vS.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <VLogo size={22} />
          <div style={{ ...vS.fraunces, fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Kreobox</div>
          <div style={{ width: 1, height: 22, background: vLine }}></div>
          <div style={{ fontSize: 13 }}>
            <span style={{ color: vMute }}>Whitefield · MBR / </span>
            <span style={{ fontWeight: 600 }}>Wardrobe</span>
          </div>
        </div>
        <ProductSwitch active="Wardrobe" />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ ...vS.mono, fontSize: 11, color: vMute }}>3 bays · 2710 × 2400 mm</span>
          <span style={vS.ghostBtn}>Compare style</span>
          <span style={vS.primaryBtn}>Send to studio →</span>
        </div>
      </div>

      <div style={vS.body}>
        {/* LEFT — interior modules catalog */}
        <div style={{ ...vS.panel, width: 270 }}>
          <div style={{ padding: '18px 18px 8px' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: vMute, fontWeight: 700 }}>Interior</div>
            <div style={{ ...vS.fraunces, fontSize: 22, marginTop: 4 }}>What goes inside</div>
          </div>
          <div style={{ padding: '0 14px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Hang', 'Drawers', 'Shelves', 'Baskets', 'Pull-outs', 'Lighting'].map((c, i) => (
              <span key={c} style={{
                padding: '5px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                background: i === 1 ? vInk : 'transparent', color: i === 1 ? vPaper : vInk,
                border: i === 1 ? 'none' : `1px solid ${vLine}`,
              }}>{c}</span>
            ))}
          </div>
          <div style={{ padding: '8px 14px', flex: 1, overflow: 'hidden' }}>
            {[
              { lbl: 'Drawer · 200h · push', code: 'KBX-WI-DR-200P · ₹ 4,800', tone: vAccent },
              { lbl: 'Drawer · 150h · soft-close', code: 'KBX-WI-DR-150SC · ₹ 5,200', tone: vAccent },
              { lbl: 'Mesh basket · 150h', code: 'KBX-WI-BA-150 · ₹ 2,400', tone: '#7c5cff' },
              { lbl: 'Trouser pull-out', code: 'KBX-WI-TR-100 · ₹ 6,900', tone: '#5b8def' },
              { lbl: 'Tie / belt rack', code: 'KBX-WI-TB-050 · ₹ 1,800', tone: '#5b8def' },
              { lbl: 'Shoe shelf · pull-out', code: 'KBX-WI-SH-200P · ₹ 7,400', tone: '#1f8a5b' },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderRadius: 8,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 6, background: '#e8e2d5',
                  border: `1px solid ${vLine}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 28, height: 4, background: row.tone, borderRadius: 1 }}></div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{row.lbl}</div>
                  <div style={{ ...vS.mono, fontSize: 10, color: vMute }}>{row.code}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER — elevation viewport */}
        <div style={{ flex: 1, position: 'relative', background: vBg, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{
            position: 'absolute', top: 14, left: 14, zIndex: 2,
            background: vPaper, border: `1px solid ${vLine}`, borderRadius: 8,
            padding: '6px 10px', display: 'flex', gap: 10, alignItems: 'center',
            ...vS.mono, fontSize: 11, color: vMute,
          }}>
            <span>Elevation · 1:25</span>
            <span style={{ width: 1, height: 12, background: vLine }}></span>
            <span>3 bays · A B C</span>
          </div>
          <div style={{
            position: 'absolute', top: 14, right: 14, zIndex: 2,
            background: vPaper, border: `1px solid ${vLine}`, borderRadius: 8,
            display: 'flex', gap: 2, padding: 3,
          }}>
            {['Front', 'Plan', 'Open'].map((v, i) => (
              <span key={v} style={{
                padding: '5px 12px', fontSize: 11, fontWeight: 600, borderRadius: 5,
                background: i === 0 ? 'rgba(26,24,21,0.06)' : 'transparent',
              }}>{v}</span>
            ))}
          </div>
          <div style={{ flex: 1, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '100%', maxWidth: 720, aspectRatio: '600 / 380',
              background: vPaper, borderRadius: 12, border: `1px solid ${vLine}`,
              boxShadow: '0 30px 80px -30px rgba(0,0,0,0.18)', overflow: 'hidden',
            }}>
              <WardrobeElevation selectedBay={1} />
            </div>
          </div>
        </div>

        {/* RIGHT — selected bay detail */}
        <div style={{ ...vS.panel, width: 300, borderRight: 'none', borderLeft: `1px solid ${vLine}` }}>
          <div style={{ padding: '18px 20px', borderBottom: `1px solid ${vLine}` }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: vMute, fontWeight: 700 }}>Bay B · selected</div>
            <div style={{ ...vS.fraunces, fontSize: 22, marginTop: 4, letterSpacing: '-0.01em' }}>Double hang</div>
            <div style={{ ...vS.mono, fontSize: 11, color: vMute, marginTop: 2 }}>900 × 2400 × 600 · Bali oak</div>

            <div style={{ marginTop: 14, padding: '8px 12px', background: 'rgba(26,24,21,0.04)', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: vMute }}>Hangs</span>
              <span style={{ ...vS.mono, fontSize: 12, fontWeight: 700 }}>2 × 1.0 m</span>
            </div>
            <div style={{ marginTop: 6, padding: '8px 12px', background: 'rgba(26,24,21,0.04)', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: vMute }}>Hanging capacity</span>
              <span style={{ ...vS.mono, fontSize: 12, fontWeight: 700 }}>~ 80 garments</span>
            </div>
            <div style={{ marginTop: 6, padding: '8px 12px', background: 'rgba(26,24,21,0.04)', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: vMute }}>Suits Aarav's wardrobe</span>
              <span style={{ ...vS.mono, fontSize: 12, fontWeight: 700, color: '#1f8a5b' }}>Good fit</span>
            </div>
          </div>

          <div style={{ flex: 1, padding: '14px 20px' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: vMute, fontWeight: 700, marginBottom: 8 }}>Cost · 3 bays</div>
            {[
              { n: 'Carcass × 3', a: '₹ 64,200' },
              { n: 'Doors · Bali oak', a: '₹ 38,800' },
              { n: 'Hang rods × 4', a: '₹ 4,200' },
              { n: 'Drawers × 6', a: '₹ 28,400' },
              { n: 'Hardware', a: '₹ 9,800' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: i ? `1px solid ${vLine}` : 'none', fontSize: 12 }}>
                <span>{b.n}</span>
                <span style={{ ...vS.mono, color: vMute }}>{b.a}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${vLine}`, padding: '14px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: vMute, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 11, color: vMute }}>incl. install</span>
            </div>
            <div style={{ ...vS.fraunces, fontSize: 30, marginTop: 2 }}>₹ 1,45,400</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <span style={{ flex: 1, ...vS.primaryBtn, padding: '11px', textAlign: 'center' }}>Quote</span>
              <span style={{ ...vS.ghostBtn, padding: '11px 14px' }}>Save</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Office floor plan (SVG, top-down) ──────────────────────── */
function OfficeFloorPlan({ selected = 'storage-A' }) {
  const wall = vInk;
  const isSel = id => selected === id;
  const sel = id => isSel(id) ? { stroke: vAccent, strokeWidth: 3 } : { stroke: '#a99a82', strokeWidth: 1.5 };

  return (
    <svg viewBox="0 0 580 380" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <pattern id="ofgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(26,24,21,0.05)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="20" y="20" width="540" height="340" fill="url(#ofgrid)" />
      {/* outer walls */}
      <path d="M20 20 L560 20 L560 360 L20 360 Z" fill="none" stroke={wall} strokeWidth="6" />
      {/* door swing top */}
      <path d="M180 20 A30 30 0 0 1 210 50" fill="none" stroke={vMute} strokeWidth="1" />
      <line x1="180" y1="20" x2="180" y2="50" stroke={vMute} strokeWidth="1" />

      {/* zones */}
      {/* zone label: workstations */}
      <text x="40" y="44" fill={vMute} fontSize="10" fontFamily="JetBrains Mono, monospace" letterSpacing="0.14em" fontWeight="700">WORKSTATIONS · 6 SEATS</text>

      {/* desks (3+3) */}
      {[0, 1, 2].map(i => (
        <g key={'d' + i}>
          <rect x={50 + i * 80} y="80" width="70" height="44" fill={vPaper} stroke="#a99a82" strokeWidth="1.5" />
          <circle cx={50 + i * 80 + 35} cy="138" r="9" fill="none" stroke="#a99a82" strokeWidth="1.5" />
          <text x={50 + i * 80 + 35} y="106" fill={vMute} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">DESK</text>
        </g>
      ))}
      {[0, 1, 2].map(i => (
        <g key={'d2' + i}>
          <rect x={50 + i * 80} y="200" width="70" height="44" fill={vPaper} stroke="#a99a82" strokeWidth="1.5" />
          <circle cx={50 + i * 80 + 35} cy="186" r="9" fill="none" stroke="#a99a82" strokeWidth="1.5" />
          <text x={50 + i * 80 + 35} y="226" fill={vMute} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">DESK</text>
        </g>
      ))}

      {/* meeting room (right) */}
      <rect x="320" y="40" width="220" height="160" fill="rgba(26,24,21,0.025)" stroke="#a99a82" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="430" y="60" fill={vMute} fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle" letterSpacing="0.14em" fontWeight="700">MEETING · 8</text>
      <rect x="350" y="90" width="160" height="60" fill={vPaper} stroke="#a99a82" strokeWidth="1.5" />
      {[0, 1, 2, 3].map(i => (
        <circle key={i} cx={368 + i * 36} cy="80" r="7" fill="none" stroke="#a99a82" strokeWidth="1.5" />
      ))}
      {[0, 1, 2, 3].map(i => (
        <circle key={i + 'b'} cx={368 + i * 36} cy="160" r="7" fill="none" stroke="#a99a82" strokeWidth="1.5" />
      ))}

      {/* Storage wall A — selected */}
      <g {...sel('storage-A')}>
        <rect x="40" y="270" width="220" height="60" fill="rgba(201,100,66,0.08)" />
        <line x1="95"  y1="270" x2="95"  y2="330" stroke="#a99a82" strokeWidth="1" />
        <line x1="150" y1="270" x2="150" y2="330" stroke="#a99a82" strokeWidth="1" />
        <line x1="205" y1="270" x2="205" y2="330" stroke="#a99a82" strokeWidth="1" />
        <text x="150" y="304" fill={vAccent} fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="700">STORAGE WALL · A</text>
        <text x="150" y="318" fill={vMute} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">4 BAYS · 2200w · 2100h</text>
      </g>

      {/* Storage tower B */}
      <rect x="290" y="220" width="40" height="110" fill="rgba(91,141,239,0.08)" stroke="#5b8def" strokeWidth="1.5" />
      <text x="310" y="280" fill="#5b8def" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="700">TOWER B</text>

      {/* Cabinet C (under meeting credenza) */}
      <rect x="350" y="230" width="160" height="30" fill="rgba(124,92,255,0.08)" stroke="#7c5cff" strokeWidth="1.5" />
      <text x="430" y="250" fill="#7c5cff" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="700">CREDENZA C</text>

      {/* link line indicating active selection ↔ detail panel */}
      {isSel('storage-A') && (
        <>
          <path d="M 260 300 L 290 300" fill="none" stroke={vAccent} strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx="260" cy="300" r="4" fill={vAccent} />
        </>
      )}

      {/* dims */}
      <g fill={vMute} fontSize="10" fontFamily="JetBrains Mono, monospace">
        <text x="290" y="14" textAnchor="middle">5,400 mm</text>
        <text x="14" y="190" textAnchor="middle" transform="rotate(-90, 14, 190)">3,400 mm</text>
      </g>
    </svg>
  );
}

/* ── Office storage interior (selected) ─────────────────────── */
function OfficeStorageInterior() {
  // 4-bay storage wall, mixed: filing drawers, open shelves, lockers, AV gear bay
  const bayW = 140, bayH = 280, top = 30, gap = 4;
  const bays = [
    { name: 'A1 · LOCKER', sub: '6 personal lockers', mods: [
      { y: 0,   h: 280/3, label: '2 lockers' },
      { y: 280/3, h: 280/3, label: '2 lockers' },
      { y: 2*280/3, h: 280/3, label: '2 lockers' },
    ], color: '#5b8def' },
    { name: 'A2 · FILING', sub: '4 deep drawers', mods: [
      { y: 0,   h: 70, label: 'Drawer' },
      { y: 70,  h: 70, label: 'Drawer' },
      { y: 140, h: 70, label: 'Drawer' },
      { y: 210, h: 70, label: 'Drawer' },
    ], color: vAccent },
    { name: 'A3 · OPEN', sub: 'books + objects', mods: [
      { y: 0,   h: 56, label: 'Shelf' },
      { y: 56,  h: 56, label: 'Shelf' },
      { y: 112, h: 56, label: 'Shelf' },
      { y: 168, h: 56, label: 'Shelf' },
      { y: 224, h: 56, label: 'Shelf' },
    ], color: '#a99a82' },
    { name: 'A4 · AV', sub: 'gear + cables', mods: [
      { y: 0,   h: 90, label: 'AV gear' },
      { y: 90,  h: 100, label: 'Cable mgmt' },
      { y: 190, h: 90, label: 'Storage' },
    ], color: '#7c5cff' },
  ];

  return (
    <svg viewBox="0 0 600 360" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="0" y="0" width="600" height="360" fill={vPaper} />
      {/* floor */}
      <line x1="20" y1={top + bayH + 10} x2="580" y2={top + bayH + 10} stroke={vInk} strokeWidth="2" />

      {bays.map((b, bi) => {
        const x = 30 + bi * (bayW + gap);
        const isSel = bi === 1;
        return (
          <g key={bi}>
            <rect x={x} y={top} width={bayW} height={bayH}
              fill="none" stroke={isSel ? vAccent : vInk} strokeWidth={isSel ? 3 : 1.5} />
            {b.mods.map((m, mi) => (
              <g key={mi}>
                <rect x={x + 3} y={top + 3 + m.y} width={bayW - 6} height={m.h - 3}
                  fill={`${b.color}1f`} stroke={b.color} strokeWidth="1" />
                <text x={x + bayW / 2} y={top + 3 + m.y + m.h / 2 + 3}
                  fill={vInk} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" opacity="0.7">{m.label}</text>
              </g>
            ))}
            <text x={x + bayW / 2} y={top - 10} fill={isSel ? vAccent : vMute} fontSize="10"
              fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight={isSel ? 700 : 500}>{b.name}</text>
            <text x={x + bayW / 2} y={top + bayH + 26} fill={vMute} fontSize="9"
              fontFamily="JetBrains Mono, monospace" textAnchor="middle">{b.sub}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── OFFICE PLANNER (interconnected) ─────────────────────────── */
function OfficePlanner() {
  return (
    <div style={vS.shell}>
      <div style={vS.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <VLogo size={22} />
          <div style={{ ...vS.fraunces, fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Kreobox</div>
          <div style={{ width: 1, height: 22, background: vLine }}></div>
          <div style={{ fontSize: 13 }}>
            <span style={{ color: vMute }}>Indiranagar Studio · 540 sqft / </span>
            <span style={{ fontWeight: 600 }}>Office plan</span>
          </div>
        </div>
        <ProductSwitch active="Office" />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ ...vS.mono, fontSize: 11, color: vMute }}>2 modes · linked</span>
          <span style={vS.ghostBtn}>Ergonomics check</span>
          <span style={vS.primaryBtn}>Send to studio →</span>
        </div>
      </div>

      {/* Sub-bar — mode link breadcrumb */}
      <div style={{ padding: '10px 22px', background: vPaper, borderBottom: `1px solid ${vLine}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
          background: vInk, color: vPaper, ...vS.mono, letterSpacing: '0.06em',
        }}>SPACE</span>
        <span style={{ width: 24, height: 1, background: vLine }}></span>
        <span style={{
          padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
          background: 'rgba(201,100,66,0.15)', color: vAccent, ...vS.mono, letterSpacing: '0.06em',
        }}>STORAGE A</span>
        <span style={{ ...vS.mono, fontSize: 11, color: vMute }}>· linked · changes here update the floor plan and vice-versa</span>
        <div style={{ flex: 1 }}></div>
        <span style={{ ...vS.mono, fontSize: 11, color: vMute }}>Storage A: 4 bays · 2200w · 2100h · 600d</span>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.05fr 1.4fr 280px', minHeight: 0 }}>

        {/* Pane 1 — SPACE (floor plan) */}
        <div style={{ background: vBg, borderRight: `1px solid ${vLine}`, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{
            padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: vPaper, borderBottom: `1px solid ${vLine}`,
            ...vS.mono, fontSize: 11, color: vMute,
          }}>
            <span><strong style={{ color: vInk }}>SPACE · top-down</strong> · 1:50</span>
            <span>5.4 × 3.4 m · 18.4 m²</span>
          </div>
          <div style={{ flex: 1, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '100%', aspectRatio: '580 / 380',
              background: vPaper, borderRadius: 10, border: `1px solid ${vLine}`,
              boxShadow: '0 20px 50px -20px rgba(0,0,0,0.15)', overflow: 'hidden',
            }}>
              <OfficeFloorPlan selected="storage-A" />
            </div>
          </div>
          {/* layer toggles */}
          <div style={{ padding: '10px 16px', borderTop: `1px solid ${vLine}`, background: vPaper, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              ['Walls', true], ['Desks · 6', true], ['Storage · 3', true], ['Power · 14', false], ['Acoustics', false], ['Daylight', false],
            ].map(([l, on]) => (
              <span key={l} style={{
                padding: '5px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                background: on ? 'rgba(26,24,21,0.06)' : 'transparent',
                color: on ? vInk : vMute, border: `1px solid ${vLine}`,
              }}>{on ? '◉' : '○'} {l}</span>
            ))}
          </div>
        </div>

        {/* Pane 2 — STORAGE INTERIOR (linked) */}
        <div style={{ background: vBg, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{
            padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: vPaper, borderBottom: `1px solid ${vLine}`,
            ...vS.mono, fontSize: 11, color: vMute,
          }}>
            <span><strong style={{ color: vAccent }}>STORAGE A · interior</strong> · 1:25</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {['A1', 'A2', 'A3', 'A4'].map((b, i) => (
                <span key={b} style={{
                  padding: '3px 8px', borderRadius: 4, fontWeight: 700,
                  background: i === 1 ? vAccent : 'rgba(26,24,21,0.06)',
                  color: i === 1 ? '#fff' : vInk,
                }}>{b}</span>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '100%', aspectRatio: '600 / 360',
              background: vPaper, borderRadius: 10, border: `1px solid ${vLine}`,
              boxShadow: '0 20px 50px -20px rgba(0,0,0,0.15)', overflow: 'hidden',
            }}>
              <OfficeStorageInterior />
            </div>
          </div>
          <div style={{ padding: '10px 16px', borderTop: `1px solid ${vLine}`, background: vPaper, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              ['Lockers', '#5b8def'],
              ['Filing', vAccent],
              ['Open shelves', '#a99a82'],
              ['AV / cable', '#7c5cff'],
              ['Personal', '#1f8a5b'],
            ].map(([l, c]) => (
              <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: vInk, padding: '4px 10px', border: `1px solid ${vLine}`, borderRadius: 999 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c }}></span>{l}
              </span>
            ))}
          </div>
        </div>

        {/* Pane 3 — capacity + cost */}
        <div style={{ ...vS.panel, borderRight: 'none', borderLeft: `1px solid ${vLine}` }}>
          <div style={{ padding: '18px 20px', borderBottom: `1px solid ${vLine}` }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: vMute, fontWeight: 700 }}>Storage A · capacity</div>
            <div style={{ ...vS.fraunces, fontSize: 22, marginTop: 4 }}>For a team of 6</div>

            {[
              { l: 'Personal lockers', v: '6 of 6', s: 'one per desk', c: '#1f8a5b' },
              { l: 'Filing cm', v: '320 cm', s: '2 yrs typical', c: vAccent },
              { l: 'Open shelf cm', v: '700 cm', s: 'books + objects', c: '#a99a82' },
              { l: 'AV depth', v: '500 mm', s: 'fits switch + UPS', c: '#7c5cff' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: i ? `1px solid ${vLine}` : 'none' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{r.l}</div>
                  <div style={{ fontSize: 10, color: vMute }}>{r.s}</div>
                </div>
                <div style={{ ...vS.mono, fontSize: 12, fontWeight: 700, color: r.c }}>{r.v}</div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1, padding: '14px 20px' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: vMute, fontWeight: 700, marginBottom: 8 }}>Linked elements</div>
            <div style={{ ...vS.mono, fontSize: 11, color: vMute, lineHeight: 1.6 }}>
              <div>Storage A bay 4 (AV) ↔ floor outlet <span style={{ color: vAccent }}>P-08</span></div>
              <div>Storage A bay 1 (lockers) ↔ desks <span style={{ color: vAccent }}>D-01..06</span></div>
              <div>Floor depth 600 mm ↔ aisle clearance <span style={{ color: '#1f8a5b' }}>1,200 mm OK</span></div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${vLine}`, padding: '14px 20px' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: vMute, fontWeight: 700 }}>Total · office</div>
            <div style={{ ...vS.fraunces, fontSize: 28, marginTop: 4 }}>₹ 6,82,400</div>
            <div style={{ fontSize: 11, color: vMute, marginTop: 2 }}>Storage ₹ 2,18,000 · Desks ₹ 2,94,000 · Meeting ₹ 1,70,400</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <span style={{ flex: 1, ...vS.primaryBtn, padding: '11px', textAlign: 'center' }}>Quote</span>
              <span style={{ ...vS.ghostBtn, padding: '11px 14px' }}>Save</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WardrobePlanner, OfficePlanner });
