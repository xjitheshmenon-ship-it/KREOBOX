/* ============================================================
   PLANNER · BACKEND  (DesignOS, studio-facing)
   Audience: studio designer / project manager / fabrication ops.
   Tone: dense, operational, monospace IDs everywhere, charcoal sidebar,
   the same kitchen seen as: a buildable plan + vendor split + margin.
   Layout: app sidebar → workspace with three vertical zones:
     · top    — project context bar with status workflow chips
     · middle — CAD-grade plan (with cuts, dims, vendor color tags)
                + side rails (issues, vendor split)
     · bottom — fabrication queue table
   ============================================================ */

const bInk = '#0e0d0b';
const bPaper = '#fafaf7';
const bBg = '#1f1c19';
const bSub = '#27241f';
const bMute = 'rgba(255,255,255,0.55)';
const bLine = 'rgba(255,255,255,0.08)';
const bAccent = '#c96442';

// Vendor color tags
const VTAGS = {
  carc: { name: 'Carcass · Greenlam', color: '#c96442' },
  surf: { name: 'Surface · Caesarstone', color: '#5b8def' },
  hw:   { name: 'Hardware · Hettich',   color: '#7c5cff' },
  app:  { name: 'Appliances · Faber',   color: '#1f8a5b' },
};

const bStyles = {
  shell: {
    width: '100%', height: '100%',
    background: bBg, color: '#e8e6e1',
    fontFamily: '"Inter Tight", -apple-system, system-ui, sans-serif',
    display: 'flex', overflow: 'hidden',
  },
  sidebar: {
    width: 200, padding: '20px 14px',
    display: 'flex', flexDirection: 'column', gap: 1,
    background: bInk, color: '#e8e6e1',
    flexShrink: 0,
  },
  sbBrand: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22,
    paddingLeft: 6,
  },
  sbWm: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: 14, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
    color: '#fff',
  },
  sbSection: {
    fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)', padding: '14px 10px 6px', fontWeight: 700,
  },
  sbItem: {
    fontSize: 12, padding: '7px 10px', borderRadius: 6,
    color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 9,
  },
  sbItemActive: {
    background: 'rgba(255,255,255,0.07)', color: '#fff', fontWeight: 500,
  },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar: {
    background: bSub, padding: '12px 22px',
    borderBottom: `1px solid ${bLine}`,
    display: 'flex', alignItems: 'center', gap: 16,
  },
  card: {
    background: bSub, border: `1px solid ${bLine}`, borderRadius: 8, padding: '14px 16px',
  },
  mono: { fontFamily: 'JetBrains Mono, monospace' },
  fraunces: { fontFamily: '"Fraunces", Georgia, serif' },
  pill: {
    padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700,
    letterSpacing: '0.04em',
  },
  kbd: {
    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
    padding: '1px 6px', background: 'rgba(255,255,255,0.06)',
    border: `1px solid ${bLine}`, borderRadius: 4, color: 'rgba(255,255,255,0.7)',
  },
};

function BLogo({ size = 20, accent = bAccent }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path
        fillRule="evenodd" clipRule="evenodd"
        d="M16 28 H84 V84 Q84 90 78 90 H22 Q16 90 16 84 Z M30 42 V76 H70 V42 Z"
        fill={accent}
      />
      <rect x="20" y="10" width="68" height="14" rx="3" transform="rotate(-8 54 17)" fill={accent} fillOpacity="0.7" />
    </svg>
  );
}

function BSidebar() {
  const sb = bStyles.sbItem;
  const a = { ...sb, ...bStyles.sbItemActive };
  const dot = (color) => <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }}></span>;
  return (
    <div style={bStyles.sidebar}>
      <div style={bStyles.sbBrand}>
        <BLogo size={20} />
        <span style={bStyles.sbWm}>Kreobox</span>
      </div>

      <div style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>Studio</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginTop: 2 }}>Atelier Reema</div>
      </div>

      <div style={bStyles.sbSection}>Workspace</div>
      <div style={sb}>{dot('#aaa')} Pipeline</div>
      <div style={a}>{dot(bAccent)} Plans <span style={{ marginLeft: 'auto', ...bStyles.mono, fontSize: 9, opacity: 0.6 }}>14</span></div>
      <div style={sb}>{dot('#aaa')} Drawings</div>
      <div style={sb}>{dot('#aaa')} Approvals <span style={{ marginLeft: 'auto', background: bAccent, color: '#fff', fontSize: 9, padding: '1px 6px', borderRadius: 999, fontWeight: 700 }}>5</span></div>

      <div style={bStyles.sbSection}>Operations</div>
      <div style={sb}>{dot('#aaa')} Vendors</div>
      <div style={sb}>{dot('#aaa')} POs <span style={{ marginLeft: 'auto', ...bStyles.mono, fontSize: 9, opacity: 0.6 }}>3</span></div>
      <div style={sb}>{dot('#aaa')} Inventory</div>
      <div style={sb}>{dot('#aaa')} Fabrication</div>

      <div style={bStyles.sbSection}>Studio</div>
      <div style={sb}>{dot('#aaa')} Team</div>
      <div style={sb}>{dot('#aaa')} Margin</div>
      <div style={sb}>{dot('#aaa')} Library</div>

      <div style={{ flex: 1 }}></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 6, background: 'rgba(255,255,255,0.04)' }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${bAccent}, #d97042)` }}></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>Reema Iyer</span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Lead designer</span>
        </div>
      </div>
    </div>
  );
}

/* ── CAD-grade plan with vendor color tags ────────────────────── */
function KitchenPlanCAD() {
  const wallStroke = '#fafaf7';
  const cabFill = '#3a352e';
  const cabStroke = 'rgba(255,255,255,0.35)';
  const dimColor = 'rgba(255,255,255,0.55)';

  const tag = (vendor) => VTAGS[vendor].color;

  return (
    <svg viewBox="0 0 480 380" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <pattern id="cad-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </pattern>
        <pattern id="cad-grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M100 0 L0 0 0 100" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="480" height="380" fill="#1f1c19" />
      <rect x="40" y="40" width="400" height="300" fill="url(#cad-grid)" />
      <rect x="40" y="40" width="400" height="300" fill="url(#cad-grid-major)" />

      <path d="M40 340 L40 40 L440 40" fill="none" stroke={wallStroke} strokeWidth="6" strokeLinejoin="round" />
      <path d="M440 40 L440 140" fill="none" stroke={wallStroke} strokeWidth="6" strokeLinecap="round" />
      <path d="M40 340 L160 340" fill="none" stroke={wallStroke} strokeWidth="6" strokeLinecap="round" />

      {/* Vendor-tag colored cabinet bands */}
      <g>
        {/* uppers (carc) */}
        <rect x="48" y="48" width="380" height="40" fill="rgba(201,100,66,0.1)" stroke={tag('carc')} strokeWidth="1" strokeDasharray="3 3" />
        <text x="58" y="73" fill={tag('carc')} fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="600">UPPERS · GREENLAM HDF</text>

        {/* base — carc */}
        <rect x="48" y="92" width="100" height="60" fill={cabFill} stroke={tag('carc')} strokeWidth="2" />
        <text x="98" y="128" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">B-04 · 1000</text>
        <line x1="98" y1="92" x2="98" y2="152" stroke={cabStroke} strokeWidth="1" />

        {/* sink — surface tag */}
        <rect x="148" y="92" width="120" height="60" fill={cabFill} stroke={tag('surf')} strokeWidth="2" />
        <rect x="160" y="100" width="96" height="44" fill="#0e0d0b" stroke={tag('surf')} strokeWidth="1" />
        <text x="208" y="170" fill={tag('surf')} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">B-05 · SINK 1200</text>

        {/* hob — appliance */}
        <rect x="268" y="92" width="100" height="60" fill={cabFill} stroke={tag('app')} strokeWidth="2" />
        <rect x="278" y="100" width="80" height="44" fill="#0e0d0b" />
        <circle cx="294" cy="115" r="5" fill={tag('app')} />
        <circle cx="320" cy="115" r="5" fill={tag('app')} />
        <circle cx="294" cy="135" r="5" fill={tag('app')} />
        <circle cx="320" cy="135" r="5" fill={tag('app')} />
        <text x="318" y="170" fill={tag('app')} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">B-06 · FABER 900</text>

        {/* pantry — selected, carc */}
        <rect x="368" y="92" width="60" height="60" fill={cabFill} stroke={bAccent} strokeWidth="3" />
        <text x="398" y="128" fill={bAccent} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="600">T-01 · PANTRY</text>

        {/* fridge */}
        <rect x="48" y="152" width="60" height="100" fill={cabFill} stroke={tag('app')} strokeWidth="2" />
        <text x="78" y="208" fill={tag('app')} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">A-01 · FRIDGE</text>

        <rect x="48" y="252" width="60" height="80" fill={cabFill} stroke={tag('carc')} strokeWidth="2" />
        <text x="78" y="298" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">B-08 · 600</text>

        {/* island */}
        <rect x="180" y="220" width="220" height="80" fill={cabFill} stroke={tag('surf')} strokeWidth="2" />
        <text x="290" y="265" fill={tag('surf')} fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="600">I-01 · QUARTZ ISLAND</text>
        <text x="290" y="282" fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">2200 × 800 × 30 mm</text>
      </g>

      {/* Hardware tag pins */}
      {[
        [98, 145], [208, 145], [318, 145], [78, 245], [78, 325], [290, 295],
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="4" fill={tag('hw')} />
          <circle cx={p[0]} cy={p[1]} r="6" fill="none" stroke={tag('hw')} strokeWidth="1" opacity="0.5" />
        </g>
      ))}

      {/* dims */}
      <g fill={dimColor} fontSize="10" fontFamily="JetBrains Mono, monospace">
        <line x1="48" y1="32" x2="148" y2="32" stroke={dimColor} strokeWidth="1" />
        <line x1="48" y1="28" x2="48" y2="36" stroke={dimColor} strokeWidth="1" />
        <line x1="148" y1="28" x2="148" y2="36" stroke={dimColor} strokeWidth="1" />
        <text x="98" y="24" textAnchor="middle">1,000</text>

        <line x1="148" y1="32" x2="268" y2="32" stroke={dimColor} strokeWidth="1" />
        <line x1="268" y1="28" x2="268" y2="36" stroke={dimColor} strokeWidth="1" />
        <text x="208" y="24" textAnchor="middle">1,200</text>

        <line x1="268" y1="32" x2="368" y2="32" stroke={dimColor} strokeWidth="1" />
        <line x1="368" y1="28" x2="368" y2="36" stroke={dimColor} strokeWidth="1" />
        <text x="318" y="24" textAnchor="middle">1,000</text>

        <line x1="368" y1="32" x2="428" y2="32" stroke={dimColor} strokeWidth="1" />
        <line x1="428" y1="28" x2="428" y2="36" stroke={dimColor} strokeWidth="1" />
        <text x="398" y="24" textAnchor="middle">600</text>
      </g>

      {/* issue marker on sink */}
      <g>
        <circle cx="208" cy="100" r="9" fill={bAccent} />
        <text x="208" y="104" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">!</text>
      </g>
    </svg>
  );
}

/* ── BACKEND PLANNER (studio) ─────────────────────────────────── */
function PlannerBackend() {
  return (
    <div style={bStyles.shell}>
      <BSidebar />

      <div style={bStyles.main}>
        {/* Top context bar */}
        <div style={bStyles.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 11, color: bMute, ...bStyles.mono }}>WHITEFIELD-3BHK / KITCHEN</div>
            <span style={{ ...bStyles.mono, fontSize: 10, color: bMute, padding: '2px 8px', border: `1px solid ${bLine}`, borderRadius: 4 }}>v 3.2 · draft</span>
          </div>

          {/* approval workflow chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 24 }}>
            {[
              { l: 'Concept', s: 'done' },
              { l: 'Layout', s: 'done' },
              { l: 'Materials', s: 'active' },
              { l: 'Cost', s: 'next' },
              { l: 'Client sign-off', s: 'next' },
              { l: 'Fab queue', s: 'next' },
            ].map((c, i) => {
              const palette = c.s === 'done' ? { bg: 'rgba(31,138,91,0.18)', fg: '#4cba85' }
                : c.s === 'active' ? { bg: 'rgba(201,100,66,0.22)', fg: bAccent }
                : { bg: 'rgba(255,255,255,0.05)', fg: bMute };
              return (
                <React.Fragment key={c.l}>
                  <span style={{
                    ...bStyles.pill, background: palette.bg, color: palette.fg,
                    textTransform: 'uppercase',
                  }}>{c.l}</span>
                  {i < 5 && <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                </React.Fragment>
              );
            })}
          </div>

          <div style={{ flex: 1 }}></div>
          <span style={bStyles.kbd}>⌘ K</span>
          <span style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: `1px solid ${bLine}`, color: '#fff' }}>Compare v3.1</span>
          <span style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: bAccent, color: '#fff' }}>Send for approval →</span>
        </div>

        {/* Workspace 3 columns */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr 280px', minHeight: 0 }}>

          {/* LEFT — issues + history */}
          <div style={{ background: '#191613', borderRight: `1px solid ${bLine}`, padding: '16px 14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 700, marginBottom: 8 }}>Issues · 3</div>
              {[
                { sev: 'high', txt: 'Sink B-05: aperture 1200 mm exceeds Caesarstone 1180 mm slab spec', code: '#K-021' },
                { sev: 'med', txt: 'Hob A-02: missing chimney duct routing on plan', code: '#K-019' },
                { sev: 'low', txt: 'Pantry T-01: handle position not specified', code: '#K-014' },
              ].map((iss, i) => {
                const c = { high: bAccent, med: '#d9a049', low: 'rgba(255,255,255,0.5)' }[iss.sev];
                return (
                  <div key={i} style={{
                    padding: 10, borderRadius: 6, marginBottom: 6,
                    background: 'rgba(255,255,255,0.03)',
                    borderLeft: `2px solid ${c}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ ...bStyles.mono, fontSize: 9, color: c, fontWeight: 700, textTransform: 'uppercase' }}>{iss.sev}</span>
                      <span style={{ ...bStyles.mono, fontSize: 9, color: 'rgba(255,255,255,0.45)' }}>{iss.code}</span>
                    </div>
                    <div style={{ fontSize: 11, lineHeight: 1.4, color: 'rgba(255,255,255,0.85)' }}>{iss.txt}</div>
                  </div>
                );
              })}
            </div>

            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 700, marginBottom: 8 }}>Layers</div>
              {[
                { l: 'Walls & openings', visible: true },
                { l: 'Base cabinets', visible: true },
                { l: 'Wall cabinets', visible: true },
                { l: 'Worktops & sink', visible: true },
                { l: 'Appliances', visible: true },
                { l: 'Hardware tags', visible: true },
                { l: 'Electrical points', visible: false },
              ].map((l, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 8px', fontSize: 11,
                  color: l.visible ? '#fff' : 'rgba(255,255,255,0.4)',
                }}>
                  <span>{l.l}</span>
                  <span style={{ ...bStyles.mono, fontSize: 10 }}>{l.visible ? '◉' : '○'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER — CAD plan */}
          <div style={{ position: 'relative', background: bBg, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{
              padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: `1px solid ${bLine}`,
              fontSize: 11, color: bMute, ...bStyles.mono,
            }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <span>Plan · 1:25</span>
                <span>Snap 50 mm</span>
                <span>Units mm</span>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                {Object.entries(VTAGS).map(([k, v]) => (
                  <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: v.color }}></span>
                    {v.name}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '100%', maxWidth: 720, aspectRatio: '480 / 380',
                border: `1px solid ${bLine}`, borderRadius: 6, overflow: 'hidden',
                background: '#1f1c19',
              }}>
                <KitchenPlanCAD />
              </div>
            </div>
          </div>

          {/* RIGHT — vendor split + margin */}
          <div style={{ background: '#191613', borderLeft: `1px solid ${bLine}`, padding: '16px 16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 700, marginBottom: 8 }}>Vendor split</div>
              {[
                { v: VTAGS.carc, qty: 11, amt: '₹ 2,01,700', pct: 38 },
                { v: VTAGS.surf, qty: 2, amt: '₹ 1,89,000', pct: 35 },
                { v: VTAGS.app,  qty: 3, amt: '₹ 88,400',  pct: 16 },
                { v: VTAGS.hw,   qty: 24, amt: '₹ 58,800', pct: 11 },
              ].map((r, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#fff', fontWeight: 500 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: r.v.color }}></span>
                      {r.v.name}
                    </span>
                    <span style={{ ...bStyles.mono, fontSize: 10, color: bMute }}>×{r.qty}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden', marginRight: 10 }}>
                      <div style={{ height: '100%', width: `${r.pct}%`, background: r.v.color }}></div>
                    </div>
                    <span style={{ ...bStyles.mono, fontSize: 11, color: '#fff' }}>{r.amt}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={bStyles.card}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 700 }}>Studio margin</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                <div>
                  <div style={{ ...bStyles.mono, fontSize: 9, color: bMute, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Quoted</div>
                  <div style={{ ...bStyles.fraunces, fontSize: 18, color: '#fff', marginTop: 2 }}>₹ 5,37,900</div>
                </div>
                <div>
                  <div style={{ ...bStyles.mono, fontSize: 9, color: bMute, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Cost</div>
                  <div style={{ ...bStyles.fraunces, fontSize: 18, color: '#fff', marginTop: 2 }}>₹ 4,12,300</div>
                </div>
              </div>
              <div style={{ marginTop: 10, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
                <span style={{ width: '76.5%', background: 'rgba(255,255,255,0.5)' }}></span>
                <span style={{ width: '23.5%', background: '#4cba85' }}></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 10, color: bMute }}>Margin</span>
                <span style={{ ...bStyles.mono, fontSize: 11, color: '#4cba85', fontWeight: 700 }}>₹ 1,25,600 · 23.4%</span>
              </div>
            </div>

            <div style={bStyles.card}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 700, marginBottom: 8 }}>Activity</div>
              {[
                { who: 'Reema', act: 'changed pantry handle to push-to-open', t: '12m' },
                { who: 'Aarav', act: 'commented on island length', t: '1h' },
                { who: 'System', act: 'flagged sink aperture > slab spec', t: '3h' },
              ].map((a, i) => (
                <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', padding: '6px 0', borderTop: i ? `1px solid ${bLine}` : 'none', display: 'flex', gap: 8 }}>
                  <span style={{ color: '#fff', fontWeight: 600, width: 50, flexShrink: 0 }}>{a.who}</span>
                  <span style={{ flex: 1 }}>{a.act}</span>
                  <span style={{ ...bStyles.mono, fontSize: 10, color: bMute }}>{a.t}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM — fabrication queue */}
        <div style={{
          background: bSub, borderTop: `1px solid ${bLine}`, padding: '12px 22px',
          display: 'flex', gap: 22, alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: bMute, fontWeight: 700 }}>Fab queue</div>
            <div style={{ ...bStyles.fraunces, fontSize: 18, color: '#fff', marginTop: 2 }}>3 cuts pending</div>
          </div>
          <div style={{ flex: 1, display: 'flex', gap: 8, overflow: 'hidden' }}>
            {[
              { code: 'CUT-2401', what: 'Carcass · Pantry T-01', mat: 'HDF 18mm', sheets: 3, eta: 'Jun 18' },
              { code: 'CUT-2402', what: 'Worktop · Island I-01', mat: 'Quartz 30mm', sheets: 1, eta: 'Jun 22' },
              { code: 'CUT-2403', what: 'Doors · Base run', mat: 'Bali oak laminate', sheets: 5, eta: 'Jun 20' },
            ].map((q, i) => (
              <div key={i} style={{
                flex: 1, minWidth: 220,
                padding: '10px 14px', borderRadius: 8,
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${bLine}`,
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ ...bStyles.mono, fontSize: 10, color: bAccent, fontWeight: 700 }}>{q.code}</span>
                  <span style={{ ...bStyles.mono, fontSize: 10, color: bMute }}>ETA {q.eta}</span>
                </div>
                <div style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{q.what}</div>
                <div style={{ fontSize: 10, color: bMute }}>{q.mat} · {q.sheets} sheet{q.sheets > 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>
          <span style={{ padding: '8px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: `1px solid ${bLine}`, color: '#fff' }}>Open queue →</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PlannerBackend, KitchenPlanCAD });
