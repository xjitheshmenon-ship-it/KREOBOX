/* ============================================================
   PLANNER · BACKEND · Factory + Admin modules
   Same DesignOS shell (charcoal sidebar, mono IDs), but two new
   workspaces: shop-floor production and studio administration.
   ============================================================ */

const fInk = '#0e0d0b';
const fBg = '#1f1c19';
const fSub = '#27241f';
const fSub2 = '#191613';
const fLine = 'rgba(255,255,255,0.08)';
const fMute = 'rgba(255,255,255,0.55)';
const fAccent = '#c96442';
const fOk = '#4cba85';
const fWarn = '#d9a049';
const fInfo = '#5b8def';

const fS = {
  shell: {
    width: '100%', height: '100%', background: fBg, color: '#e8e6e1',
    fontFamily: '"Inter Tight", sans-serif', display: 'flex', overflow: 'hidden',
  },
  sidebar: {
    width: 200, padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 1,
    background: fInk, flexShrink: 0,
  },
  sbBrand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, paddingLeft: 6 },
  sbWm: {
    fontFamily: '"Fraunces", serif', fontSize: 14, fontWeight: 500,
    letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff',
  },
  sbSection: {
    fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)', padding: '14px 10px 6px', fontWeight: 700,
  },
  sbItem: {
    fontSize: 12, padding: '7px 10px', borderRadius: 6,
    color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 9,
  },
  sbItemActive: { background: 'rgba(255,255,255,0.07)', color: '#fff', fontWeight: 500 },
  card: { background: fSub, border: `1px solid ${fLine}`, borderRadius: 8, padding: '14px 16px' },
  topbar: {
    background: fSub, padding: '12px 22px', borderBottom: `1px solid ${fLine}`,
    display: 'flex', alignItems: 'center', gap: 16,
  },
  mono: { fontFamily: 'JetBrains Mono, monospace' },
  fraunces: { fontFamily: '"Fraunces", serif' },
  pill: {
    padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
  },
};

function FLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M16 28 H84 V84 Q84 90 78 90 H22 Q16 90 16 84 Z M30 42 V76 H70 V42 Z"
        fill={fAccent} />
      <rect x="20" y="10" width="68" height="14" rx="3" transform="rotate(-8 54 17)" fill={fAccent} fillOpacity="0.7" />
    </svg>
  );
}

function FSidebar({ active = 'Factory' }) {
  const items = {
    Workspace: [
      ['Pipeline', 14, null], ['Plans', 14, null], ['Drawings', null, null], ['Approvals', 5, fAccent],
    ],
    Operations: [
      ['Vendors', null, null], ['POs', 3, null], ['Inventory', null, null], ['Factory', 12, fAccent],
    ],
    Studio: [
      ['Team', null, null], ['Margin', null, null], ['Library', null, null], ['Admin', null, null],
    ],
  };
  return (
    <div style={fS.sidebar}>
      <div style={fS.sbBrand}>
        <FLogo size={20} />
        <span style={fS.sbWm}>Kreobox</span>
      </div>
      <div style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>Studio</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginTop: 2 }}>Atelier Reema</div>
      </div>
      {Object.entries(items).map(([sec, list]) => (
        <React.Fragment key={sec}>
          <div style={fS.sbSection}>{sec}</div>
          {list.map(([label, badge, badgeColor]) => {
            const isActive = label === active;
            return (
              <div key={label} style={{ ...fS.sbItem, ...(isActive ? fS.sbItemActive : {}) }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? fAccent : '#aaa', flexShrink: 0 }}></span>
                <span>{label}</span>
                {badge != null && (
                  <span style={{
                    marginLeft: 'auto',
                    background: badgeColor || 'transparent',
                    color: badgeColor ? '#fff' : 'rgba(255,255,255,0.6)',
                    ...fS.mono, fontSize: 9, padding: badgeColor ? '1px 6px' : '0',
                    borderRadius: 999, fontWeight: 700,
                  }}>{badge}</span>
                )}
              </div>
            );
          })}
        </React.Fragment>
      ))}
      <div style={{ flex: 1 }}></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 6, background: 'rgba(255,255,255,0.04)' }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${fAccent}, #d97042)` }}></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>Reema Iyer</span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Lead designer</span>
        </div>
      </div>
    </div>
  );
}

/* ── Cut-nest SVG (sheet layout for CNC) ───────────────────────── */
function CutNest({ active = true }) {
  const sheet = { w: 480, h: 220, pad: 16 };
  // pieces (mm-ish, scaled into sheet)
  const pieces = [
    { x: 20, y: 20, w: 180, h: 60, l: 'D-12', c: fAccent },
    { x: 20, y: 90, w: 90,  h: 90, l: 'D-13', c: fAccent },
    { x: 120, y: 90, w: 80,  h: 90, l: 'D-14', c: fAccent },
    { x: 220, y: 20, w: 220, h: 80, l: 'S-04 · pantry side', c: fInfo },
    { x: 220, y: 110, w: 100, h: 70, l: 'B-07', c: fOk },
    { x: 330, y: 110, w: 110, h: 70, l: 'B-08', c: fOk },
  ];
  return (
    <svg viewBox={`0 0 ${sheet.w} ${sheet.h}`} style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <pattern id="nestgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={sheet.w} height={sheet.h} fill="#1f1c19" />
      <rect x="6" y="6" width={sheet.w - 12} height={sheet.h - 12}
        fill="url(#nestgrid)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="4 3" />
      {pieces.map((p, i) => (
        <g key={i}>
          <rect x={p.x} y={p.y} width={p.w} height={p.h}
            fill={p.c} fillOpacity="0.18"
            stroke={p.c} strokeWidth={p === pieces[3] && active ? 2.5 : 1.5} />
          <text x={p.x + 8} y={p.y + 16} fill={p.c} fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="700">{p.l}</text>
          <text x={p.x + 8} y={p.y + p.h - 8} fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="JetBrains Mono, monospace">
            {p.w * 5}×{p.h * 5}mm
          </text>
        </g>
      ))}
      {/* offcut */}
      <rect x="20" y="190" width="180" height="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2" />
      <text x="22" y="200" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono, monospace">OFFCUT · 6.4%</text>

      {/* tool path hint on selected */}
      {active && (
        <path d={`M220 20 L440 20 L440 100 L220 100 Z`} fill="none" stroke={fAccent} strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
      )}

      <text x={sheet.w - 12} y={sheet.h - 8} fill="rgba(255,255,255,0.45)" fontSize="9"
        fontFamily="JetBrains Mono, monospace" textAnchor="end">SHEET 2440 × 1220 · HDF 18mm</text>
    </svg>
  );
}

/* ── FACTORY MODULE ────────────────────────────────────────────── */
function FactoryModule() {
  return (
    <div style={fS.shell}>
      <FSidebar active="Factory" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top */}
        <div style={fS.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ ...fS.mono, fontSize: 11, color: fMute }}>FACTORY · WHITEFIELD WORKS</div>
            <span style={{ ...fS.mono, fontSize: 10, padding: '2px 8px', border: `1px solid ${fLine}`, borderRadius: 4, color: fOk }}>● LIVE</span>
            <span style={{ ...fS.mono, fontSize: 10, color: fMute }}>3 machines · 2 shifts · 6 ops</span>
          </div>
          <div style={{ flex: 1 }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: fMute }}>Shift A · 14:30 IST</span>
            <span style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: `1px solid ${fLine}`, color: '#fff' }}>Print travelers</span>
            <span style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: fAccent, color: '#fff' }}>+ Release work order</span>
          </div>
        </div>

        {/* KPI strip */}
        <div style={{ padding: '14px 22px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, borderBottom: `1px solid ${fLine}`, background: fSub2 }}>
          {[
            { l: 'Sheets queued', v: '38', s: '12 today', c: '#fff' },
            { l: 'Sheets cut · today', v: '14', s: '+3 vs avg', c: fOk },
            { l: 'Yield', v: '93.6%', s: 'target 92%', c: fOk },
            { l: 'CNC utilization', v: '78%', s: 'idle 1h 12m', c: fWarn },
            { l: 'On-time WOs', v: '11 / 12', s: '1 at risk', c: fAccent },
          ].map((k, i) => (
            <div key={i} style={{ ...fS.card, padding: '12px 14px' }}>
              <div style={{ ...fS.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: fMute, fontWeight: 700 }}>{k.l}</div>
              <div style={{ ...fS.fraunces, fontSize: 24, color: k.c, marginTop: 4 }}>{k.v}</div>
              <div style={{ ...fS.mono, fontSize: 10, color: fMute, marginTop: 2 }}>{k.s}</div>
            </div>
          ))}
        </div>

        {/* Workspace 3 cols */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr 280px', minHeight: 0 }}>

          {/* LEFT — work orders */}
          <div style={{ background: fSub2, borderRight: `1px solid ${fLine}`, padding: '16px 14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 700 }}>Work orders · today</div>
              <span style={{ ...fS.mono, fontSize: 10, color: fMute }}>12</span>
            </div>
            {[
              { wo: 'WO-2401', proj: 'Whitefield · Kitchen', s: 'cutting', mach: 'CNC-01', pct: 64, eta: '15:40', c: fAccent },
              { wo: 'WO-2402', proj: 'Whitefield · Kitchen', s: 'queued', mach: 'CNC-01', pct: 0, eta: '16:20', c: fMute },
              { wo: 'WO-2399', proj: 'Indiranagar · MBR', s: 'edgebanding', mach: 'EB-01', pct: 32, eta: '17:00', c: fInfo },
              { wo: 'WO-2398', proj: 'Indiranagar · MBR', s: 'done', mach: 'CNC-02', pct: 100, eta: '13:10', c: fOk },
              { wo: 'WO-2395', proj: 'Sadashivnagar · Living', s: 'qc-hold', mach: 'QC', pct: 90, eta: '—', c: fWarn },
              { wo: 'WO-2391', proj: 'Whitefield · Wardrobes', s: 'queued', mach: 'CNC-02', pct: 0, eta: 'tmrw', c: fMute },
            ].map((w, i) => (
              <div key={i} style={{
                padding: '10px 12px', borderRadius: 6,
                background: w.s === 'cutting' ? 'rgba(201,100,66,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${w.s === 'cutting' ? fAccent : fLine}`,
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ ...fS.mono, fontSize: 10, color: w.c, fontWeight: 700 }}>{w.wo}</span>
                  <span style={{ ...fS.pill, background: 'rgba(255,255,255,0.06)', color: w.c, textTransform: 'uppercase' }}>{w.s}</span>
                </div>
                <div style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{w.proj}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: fMute }}>
                  <span>{w.mach}</span>
                  <span style={fS.mono}>ETA {w.eta}</span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${w.pct}%`, background: w.c }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* CENTER — cut nest viewer */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{
              padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: `1px solid ${fLine}`, background: fSub,
              fontSize: 11, color: fMute, ...fS.mono,
            }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>WO-2401 · NEST 03 / 05</span>
                <span>HDF 18mm · sheet 2440 × 1220</span>
                <span>11 parts</span>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <span>Yield <span style={{ color: fOk, fontWeight: 700 }}>93.6%</span></span>
                <span>Cut time <span style={{ color: '#fff' }}>11m 40s</span></span>
                <span>Tool T-04 · 6mm comp</span>
              </div>
            </div>
            <div style={{ flex: 1, padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: fBg }}>
              <div style={{
                width: '100%', maxWidth: 640, aspectRatio: '480 / 220',
                border: `1px solid ${fLine}`, borderRadius: 6, overflow: 'hidden',
              }}>
                <CutNest />
              </div>
            </div>

            {/* Machine timeline */}
            <div style={{ borderTop: `1px solid ${fLine}`, background: fSub, padding: '12px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: fMute, fontWeight: 700 }}>Machine timeline · today</div>
                <div style={{ display: 'flex', gap: 10, ...fS.mono, fontSize: 10, color: fMute }}>
                  <span>08</span><span>10</span><span>12</span><span>14</span><span>16</span><span>18</span><span>20</span>
                </div>
              </div>
              {[
                { m: 'CNC-01', segs: [['done', 5, 22], ['idle', 27, 6], ['cutting', 33, 18], ['queued', 51, 14]] },
                { m: 'CNC-02', segs: [['done', 5, 18], ['done', 23, 14], ['idle', 37, 8], ['queued', 45, 20]] },
                { m: 'EB-01',  segs: [['done', 5, 12], ['idle', 17, 14], ['cutting', 31, 16], ['queued', 47, 18]] },
              ].map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ ...fS.mono, fontSize: 11, color: '#fff', fontWeight: 600 }}>{row.m}</span>
                  <div style={{ position: 'relative', height: 18, background: 'rgba(255,255,255,0.04)', borderRadius: 3 }}>
                    {row.segs.map((s, j) => {
                      const c = s[0] === 'done' ? fOk : s[0] === 'cutting' ? fAccent : s[0] === 'idle' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.3)';
                      return (
                        <div key={j} style={{
                          position: 'absolute', left: `${s[1]}%`, width: `${s[2]}%`,
                          top: 2, bottom: 2, background: c, borderRadius: 2,
                          opacity: s[0] === 'queued' ? 0.5 : 1,
                          border: s[0] === 'queued' ? '1px dashed rgba(255,255,255,0.4)' : 'none',
                        }}></div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — operators + materials */}
          <div style={{ background: fSub2, borderLeft: `1px solid ${fLine}`, padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 700, marginBottom: 8 }}>On the floor · 6</div>
              {[
                { n: 'Suresh M.', r: 'CNC-01 op', s: 'cutting WO-2401', c: fAccent },
                { n: 'Vikram T.', r: 'CNC-02 op', s: 'idle · changing tool', c: fWarn },
                { n: 'Anil P.',  r: 'Edgebander', s: 'EB on WO-2399', c: fInfo },
                { n: 'Lakshmi R.', r: 'QC', s: 'inspecting WO-2395', c: fAccent },
              ].map((o, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i ? `1px solid ${fLine}` : 'none' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{o.n[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{o.n}</div>
                    <div style={{ fontSize: 10, color: fMute }}>{o.r} · <span style={{ color: o.c }}>{o.s}</span></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={fS.card}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 700, marginBottom: 8 }}>Material on hand</div>
              {[
                { mat: 'HDF 18mm', stk: '142 sheets', need: '38', c: fOk },
                { mat: 'Quartz 30mm · Carrara', stk: '6 slabs', need: '4', c: fWarn },
                { mat: 'Bali oak laminate', stk: '94 sheets', need: '22', c: fOk },
                { mat: 'Hettich rails 500mm', stk: '8 pairs', need: '24', c: fAccent },
              ].map((m, i) => (
                <div key={i} style={{ padding: '8px 0', borderTop: i ? `1px solid ${fLine}` : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: '#fff', fontWeight: 500 }}>{m.mat}</span>
                    <span style={{ ...fS.mono, fontSize: 10, color: m.c, fontWeight: 700 }}>{m.stk}</span>
                  </div>
                  <div style={{ ...fS.mono, fontSize: 10, color: fMute, marginTop: 2 }}>need {m.need}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ADMIN MODULE ──────────────────────────────────────────────── */
function AdminModule() {
  return (
    <div style={fS.shell}>
      <FSidebar active="Admin" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        <div style={fS.topbar}>
          <div style={{ ...fS.mono, fontSize: 11, color: fMute }}>STUDIO ADMIN · ATELIER REEMA</div>
          <div style={{ flex: 1 }}></div>
          <span style={{ ...fS.mono, fontSize: 10, color: fOk }}>● All systems operational</span>
          <span style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: `1px solid ${fLine}`, color: '#fff' }}>Audit log</span>
        </div>

        {/* admin sub-nav */}
        <div style={{ background: fSub2, padding: '10px 22px', borderBottom: `1px solid ${fLine}`, display: 'flex', gap: 6 }}>
          {['Overview', 'Members & roles', 'Billing', 'Integrations', 'Branding', 'Security', 'API'].map((t, i) => (
            <span key={t} style={{
              padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
              background: i === 0 ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: i === 0 ? '#fff' : fMute,
              border: i === 0 ? `1px solid ${fLine}` : '1px solid transparent',
            }}>{t}</span>
          ))}
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, padding: 22, overflow: 'hidden', background: fBg }}>

          {/* LEFT — members + plan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>

            <div style={fS.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: fMute, fontWeight: 700 }}>Members</div>
                  <div style={{ ...fS.fraunces, fontSize: 22, color: '#fff', marginTop: 2 }}>11 of 15 seats</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ padding: '7px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: `1px solid ${fLine}`, color: '#fff' }}>Roles</span>
                  <span style={{ padding: '7px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: fAccent, color: '#fff' }}>+ Invite</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 80px', gap: 12, padding: '8px 0', borderBottom: `1px solid ${fLine}`, ...fS.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: fMute, fontWeight: 700 }}>
                <span>Member</span><span>Role</span><span>Projects</span><span>Last seen</span><span></span>
              </div>
              {[
                { n: 'Reema Iyer', e: 'reema@atelier.in', r: 'Owner · Admin', p: 14, l: 'now', initials: 'RI', c: fAccent },
                { n: 'Aditya Shenoy', e: 'aditya@atelier.in', r: 'Designer', p: 8, l: '12m ago', initials: 'AS', c: fInfo },
                { n: 'Priya Nair', e: 'priya@atelier.in', r: 'PM · Site', p: 5, l: '1h ago', initials: 'PN', c: fOk },
                { n: 'Suresh M.', e: 'suresh@whitefield.in', r: 'Factory ops', p: 3, l: 'now', initials: 'SM', c: fWarn },
                { n: 'Hettich (vendor)', e: 'orders@hettich.in', r: 'External · POs', p: 14, l: 'yesterday', initials: 'H', c: 'rgba(255,255,255,0.4)' },
              ].map((m, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 80px', gap: 12,
                  padding: '12px 0', borderTop: i ? `1px solid ${fLine}` : 'none', alignItems: 'center', fontSize: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: m.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{m.initials}</div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{m.n}</div>
                      <div style={{ fontSize: 10, color: fMute, ...fS.mono }}>{m.e}</div>
                    </div>
                  </div>
                  <span style={{ color: '#fff' }}>{m.r}</span>
                  <span style={{ ...fS.mono, color: fMute }}>{m.p}</span>
                  <span style={{ ...fS.mono, color: fMute }}>{m.l}</span>
                  <span style={{ ...fS.mono, fontSize: 14, color: fMute, textAlign: 'right' }}>···</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={fS.card}>
                <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: fMute, fontWeight: 700 }}>Subscription</div>
                <div style={{ ...fS.fraunces, fontSize: 22, color: '#fff', marginTop: 4 }}>Studio · Annual</div>
                <div style={{ ...fS.mono, fontSize: 11, color: fMute, marginTop: 2 }}>Renews Mar 14, 2027</div>
                <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#fff' }}>15 seats · 50 projects</span>
                  <span style={{ ...fS.mono, fontSize: 12, color: '#fff', fontWeight: 700 }}>₹ 4,80,000 / yr</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <span style={{ flex: 1, padding: '8px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: `1px solid ${fLine}`, color: '#fff', textAlign: 'center' }}>Manage</span>
                  <span style={{ padding: '8px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: fAccent, color: '#fff' }}>Upgrade</span>
                </div>
              </div>

              <div style={fS.card}>
                <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: fMute, fontWeight: 700 }}>This month</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
                  <div>
                    <div style={{ ...fS.mono, fontSize: 9, color: fMute, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Plans created</div>
                    <div style={{ ...fS.fraunces, fontSize: 22, color: '#fff' }}>184</div>
                  </div>
                  <div>
                    <div style={{ ...fS.mono, fontSize: 9, color: fMute, textTransform: 'uppercase', letterSpacing: '0.12em' }}>POs issued</div>
                    <div style={{ ...fS.fraunces, fontSize: 22, color: '#fff' }}>62</div>
                  </div>
                  <div>
                    <div style={{ ...fS.mono, fontSize: 9, color: fMute, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Storage</div>
                    <div style={{ ...fS.fraunces, fontSize: 22, color: '#fff' }}>14.2 <span style={{ fontSize: 12, color: fMute }}>GB</span></div>
                  </div>
                  <div>
                    <div style={{ ...fS.mono, fontSize: 9, color: fMute, textTransform: 'uppercase', letterSpacing: '0.12em' }}>API calls</div>
                    <div style={{ ...fS.fraunces, fontSize: 22, color: '#fff' }}>112k</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — integrations + audit + branding */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
            <div style={fS.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: fMute, fontWeight: 700 }}>Integrations</div>
                <span style={{ ...fS.mono, fontSize: 10, color: fMute }}>4 connected · 2 available</span>
              </div>
              {[
                { n: 'Tally · Books', s: 'connected', d: 'Auto-sync POs and invoices', c: fOk },
                { n: 'Razorpay', s: 'connected', d: 'Milestone payments from clients', c: fOk },
                { n: 'WhatsApp Business', s: 'connected', d: 'Site-update push to homeowners', c: fOk },
                { n: 'Hettich · Vendor API', s: 'connected', d: 'Live pricing + lead times', c: fOk },
                { n: 'Caesarstone API', s: 'available', d: 'Live slab inventory', c: fMute },
                { n: 'Zoho People · HR', s: 'available', d: 'Sync floor staff & shifts', c: fMute },
              ].map((it, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0', borderTop: i ? `1px solid ${fLine}` : 'none',
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: `1px solid ${fLine}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{it.n[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{it.n}</div>
                    <div style={{ fontSize: 10, color: fMute }}>{it.d}</div>
                  </div>
                  <span style={{
                    ...fS.pill, background: it.s === 'connected' ? 'rgba(76,186,133,0.15)' : 'rgba(255,255,255,0.05)',
                    color: it.c, textTransform: 'uppercase',
                  }}>{it.s}</span>
                </div>
              ))}
            </div>

            <div style={fS.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: fMute, fontWeight: 700 }}>Audit · last 24h</div>
                <span style={{ ...fS.mono, fontSize: 10, color: fAccent, fontWeight: 700 }}>3 sensitive</span>
              </div>
              {[
                { who: 'Reema', act: 'released WO-2401 to factory', t: '14:28', tag: 'release' },
                { who: 'Aditya', act: 'changed margin floor on Whitefield to 22%', t: '12:04', tag: 'finance', warn: true },
                { who: 'System', act: 'auto-flagged sink B-05 spec mismatch', t: '11:42', tag: 'qa' },
                { who: 'Priya', act: 'invited suresh@whitefield.in as Factory ops', t: '09:15', tag: 'access', warn: true },
                { who: 'API', act: 'Hettich price list refreshed · 1,840 SKUs', t: '06:00', tag: 'sync' },
              ].map((a, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 60px 80px', gap: 10,
                  padding: '8px 0', borderTop: i ? `1px solid ${fLine}` : 'none', alignItems: 'center',
                  fontSize: 11,
                }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{a.who}</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>{a.act}</span>
                  <span style={{ ...fS.mono, fontSize: 10, color: a.warn ? fAccent : fMute, textTransform: 'uppercase', fontWeight: 700 }}>{a.tag}</span>
                  <span style={{ ...fS.mono, fontSize: 10, color: fMute, textAlign: 'right' }}>{a.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FactoryModule, AdminModule });
