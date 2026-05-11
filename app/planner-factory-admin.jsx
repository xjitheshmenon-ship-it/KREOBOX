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

function FSidebar({ module = 'factory', active = 'Fabrication', onSelect }) {
  const sections = {
    factory: {
      label: 'Factory Floor',
      items: [
        ['Vendors', null, null], ['POs', 3, null], ['Depot Stock', null, null], ['Fabrication', 12, fAccent],
      ],
    },
    admin: {
      label: 'Admin',
      items: [
        ['Team', null, null], ['Margin', null, null], ['Library', null, null],
      ],
    },
  };
  const { label, items } = sections[module] || sections.factory;
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
      <div style={fS.sbSection}>{label}</div>
      {items.map(([itemLabel, badge, badgeColor]) => {
        const isActive = itemLabel === active;
        return (
          <div key={itemLabel}
            onClick={() => onSelect && onSelect(itemLabel)}
            style={{ ...fS.sbItem, ...(isActive ? fS.sbItemActive : {}), cursor: 'pointer' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? fAccent : '#aaa', flexShrink: 0 }}></span>
            <span>{itemLabel}</span>
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

/* KreoStore, DEPOT_STOCK, PRECUT_TYPES defined in planner-backend.jsx — shared via global scope */

function DepotStockView() {
  const hdr = (t) => (
    <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: fMute, fontWeight: 700, marginBottom: 14 }}>{t}</div>
  );

  const totalByType = {};
  PRECUT_TYPES.forEach(t => { totalByType[t.id] = DEPOT_STOCK.reduce((s, d) => s + (d.modules[t.id] || 0), 0); });
  const lowDepots = DEPOT_STOCK.filter(d => PRECUT_TYPES.some(t => (d.modules[t.id] || 0) < d.min));

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: fSub2, padding: 22 }}>
      {hdr('Depot stock · pre-cut module inventory')}

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 22 }}>
        {[
          { l: 'Depots tracked', v: String(DEPOT_STOCK.length), s: 'live cities', c: '#fff' },
          { l: 'Low stock alerts', v: String(lowDepots.length), s: 'need replenish', c: lowDepots.length > 0 ? '#ff8080' : fOk },
          { l: 'Total modules', v: String(Object.values(totalByType).reduce((s,n) => s+n, 0)), s: 'across all depots', c: fOk },
        ].map((k, i) => (
          <div key={i} style={{ ...fS.card, padding: '12px 14px' }}>
            <div style={{ ...fS.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: fMute, fontWeight: 700 }}>{k.l}</div>
            <div style={{ ...fS.fraunces, fontSize: 26, color: k.c, marginTop: 4 }}>{k.v}</div>
            <div style={{ ...fS.mono, fontSize: 10, color: fMute, marginTop: 2 }}>{k.s}</div>
          </div>
        ))}
      </div>

      {/* Per-depot stock table */}
      <div style={{ ...fS.card, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
              {['Depot', 'City', ...PRECUT_TYPES.map(t => t.id), 'Status'].map(h => (
                <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: fMute, fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEPOT_STOCK.map((d) => {
              const anyLow = PRECUT_TYPES.some(t => (d.modules[t.id] || 0) < d.min);
              return (
                <tr key={d.depot} style={{ borderTop: `1px solid rgba(255,255,255,0.05)`, background: anyLow ? 'rgba(255,80,80,0.04)' : 'transparent' }}>
                  <td style={{ padding: '10px', ...fS.mono, color: fMute, fontSize: 10 }}>{d.depot}</td>
                  <td style={{ padding: '10px', color: '#fff', fontWeight: 600 }}>{d.city}</td>
                  {PRECUT_TYPES.map(t => {
                    const qty = d.modules[t.id] || 0;
                    const low = qty < d.min;
                    return (
                      <td key={t.id} style={{ padding: '10px', ...fS.mono, fontWeight: 700, color: low ? '#ff8080' : qty >= d.min * 2 ? fOk : fWarn }}>
                        {qty}{low && <span style={{ fontSize: 8, marginLeft: 2 }}>▼</span>}
                      </td>
                    );
                  })}
                  <td style={{ padding: '10px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                      background: anyLow ? 'rgba(255,80,80,0.15)' : 'rgba(76,186,133,0.15)',
                      color: anyLow ? '#ff8080' : fOk }}>
                      {anyLow ? 'Replenish' : 'OK'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: `2px solid rgba(255,255,255,0.1)` }}>
              <td colSpan={2} style={{ padding: '8px 10px', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: fMute, fontWeight: 700 }}>Total</td>
              {PRECUT_TYPES.map(t => (
                <td key={t.id} style={{ padding: '8px 10px', ...fS.mono, fontWeight: 700, color: '#fff' }}>{totalByType[t.id]}</td>
              ))}
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* SKU legend */}
      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {PRECUT_TYPES.map(t => (
          <div key={t.id} style={{ ...fS.card, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ ...fS.mono, fontSize: 10, fontWeight: 700, color: fAccent }}>{t.id}</span>
            <span style={{ fontSize: 11, color: '#fff' }}>{t.label}</span>
            <span style={{ fontSize: 10, color: fMute }}>{t.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── LOGISTICS DATA ───────────────────────────────────────────── */
const FACTORIES = [
  { id:'FAC-MUM', name:'Mumbai Manufacturing',   location:'Bhiwandi, Maharashtra',  capacity:120, active:true,  zones:['Mumbai','Pune','Nashik','Goa','Surat','Ahmedabad'] },
  { id:'FAC-BLR', name:'Bengaluru Manufacturing', location:'Peenya, Karnataka',      capacity:80,  active:true,  zones:['Bengaluru','Hyderabad','Chennai','Kochi','Coimbatore','Mysuru','Visakhapatnam'] },
  { id:'FAC-DEL', name:'Delhi NCR Manufacturing', location:'Manesar, Haryana',       capacity:100, active:true,  zones:['Delhi','Gurugram','Noida','Jaipur','Chandigarh','Lucknow','Bhopal','Indore'] },
];

const DEPOTS = [
  // Tier 1 — 1 depot per 10 km
  { city:'Mumbai',         state:'Maharashtra',      tier:1, depots:8,  radius:10, factory:'FAC-MUM' },
  { city:'Delhi NCR',      state:'Delhi / Haryana',  tier:1, depots:12, radius:10, factory:'FAC-DEL' },
  { city:'Bengaluru',      state:'Karnataka',        tier:1, depots:7,  radius:10, factory:'FAC-BLR' },
  { city:'Hyderabad',      state:'Telangana',        tier:1, depots:6,  radius:10, factory:'FAC-BLR' },
  { city:'Chennai',        state:'Tamil Nadu',       tier:1, depots:5,  radius:10, factory:'FAC-BLR' },
  { city:'Pune',           state:'Maharashtra',      tier:1, depots:4,  radius:10, factory:'FAC-MUM' },
  { city:'Ahmedabad',      state:'Gujarat',          tier:1, depots:4,  radius:10, factory:'FAC-MUM' },
  { city:'Kolkata',        state:'West Bengal',      tier:1, depots:5,  radius:10, factory:'FAC-BLR' },
  // Tier 2 — 1 depot per 20 km
  { city:'Jaipur',         state:'Rajasthan',        tier:2, depots:2,  radius:20, factory:'FAC-DEL' },
  { city:'Surat',          state:'Gujarat',          tier:2, depots:2,  radius:20, factory:'FAC-MUM' },
  { city:'Lucknow',        state:'Uttar Pradesh',    tier:2, depots:2,  radius:20, factory:'FAC-DEL' },
  { city:'Chandigarh',     state:'Punjab/Haryana',   tier:2, depots:1,  radius:20, factory:'FAC-DEL' },
  { city:'Kochi',          state:'Kerala',           tier:2, depots:2,  radius:20, factory:'FAC-BLR' },
  { city:'Coimbatore',     state:'Tamil Nadu',       tier:2, depots:1,  radius:20, factory:'FAC-BLR' },
  { city:'Indore',         state:'Madhya Pradesh',   tier:2, depots:1,  radius:20, factory:'FAC-MUM' },
  { city:'Nagpur',         state:'Maharashtra',      tier:2, depots:1,  radius:20, factory:'FAC-MUM' },
  { city:'Bhopal',         state:'Madhya Pradesh',   tier:2, depots:1,  radius:20, factory:'FAC-DEL' },
  { city:'Visakhapatnam',  state:'Andhra Pradesh',   tier:2, depots:1,  radius:20, factory:'FAC-BLR' },
];

const JOB_STAGES = ['Queued','Material Check','Cutting','Edge Banding','Assembly','Finishing','QC','Done'];
const STAGE_COLORS = ['rgba(255,255,255,0.5)','#d9a049','#c96442','#5b8def','#7c5cff','#c96442','#d9a049','#4cba85'];

/* ── FACTORY MODULE ────────────────────────────────────────────── */
function FactoryModule() {
  const { useState: useS, useEffect: useE } = React;
  const [section, setSection] = useS('Fabrication');
  const [jobs, setJobs]     = useS(() => KreoStore.getJobs());
  const [selId, setSelId]   = useS(null);
  const [cutFilter, setCutFilter] = useS('');

  const reload = () => setJobs(KreoStore.getJobs());
  useE(() => {
    window.addEventListener('kreobox-update', reload);
    window.addEventListener('focus', reload);
    return () => { window.removeEventListener('kreobox-update', reload); window.removeEventListener('focus', reload); };
  }, []);

  const sel = jobs.find(j => j.id === selId) || null;

  const advanceStage = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    const next = Math.min((job.currentStage || 0) + 1, JOB_STAGES.length - 1);
    const pct = Math.round((next / (JOB_STAGES.length - 1)) * 100);
    const log = [...(job.stageLog || []), { stage: JOB_STAGES[next].toLowerCase().replace(' ', '-'), ts: Date.now(), by: 'Factory' }];
    KreoStore.updateJob(jobId, { currentStage: next, progress: pct, stageLog: log, status: JOB_STAGES[next].toLowerCase().replace(' ', '-') });
    if (next === JOB_STAGES.length - 1) {
      KreoStore.updateOrder(job.orderId, { status: 'delivered' });
    }
    reload();
  };

  const fmtDate = ts => new Date(ts).toLocaleDateString('en-IN', { day:'2-digit', month:'short' });
  const fmt = n => '₹ ' + Number(n).toLocaleString('en-IN');

  const queuedJobs  = jobs.filter(j => (j.currentStage || 0) === 0);
  const activeJobs  = jobs.filter(j => (j.currentStage || 0) > 0 && (j.currentStage || 0) < JOB_STAGES.length - 1);
  const doneJobs    = jobs.filter(j => (j.currentStage || 0) === JOB_STAGES.length - 1);

  const filteredCut = sel ? (sel.cutList || []).filter(p =>
    !cutFilter || p.name.toLowerCase().includes(cutFilter.toLowerCase()) || p.mat.toLowerCase().includes(cutFilter.toLowerCase())
  ) : [];

  if (section === 'Depot Stock') {
    return (
      <div style={fS.shell}>
        <FSidebar module="factory" active={section} onSelect={setSection} />
        <DepotStockView />
      </div>
    );
  }

  return (
    <div style={fS.shell}>
      <FSidebar module="factory" active={section} onSelect={setSection} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top */}
        <div style={fS.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ ...fS.mono, fontSize: 11, color: fMute }}>FACTORY FLOOR</div>
            <span style={{ ...fS.mono, fontSize: 10, padding: '2px 8px', border: `1px solid ${fLine}`, borderRadius: 4, color: fOk }}>● LIVE</span>
            <span style={{ ...fS.mono, fontSize: 10, color: fMute }}>{jobs.length} jobs · {activeJobs.length} active · {queuedJobs.length} queued</span>
          </div>
          <div style={{ flex: 1 }}></div>
          {sel && (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ ...fS.mono, fontSize:10, color:fAccent }}>{sel.id}</span>
              <span style={{ fontSize:11, color:'#fff', fontWeight:600 }}>{sel.customerName}</span>
              <span style={{ ...fS.mono, fontSize:10, color:fMute }}>{JOB_STAGES[sel.currentStage || 0]}</span>
            </div>
          )}
        </div>

        {/* KPI strip */}
        <div style={{ padding:'10px 20px', display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, borderBottom:`1px solid ${fLine}`, background:fSub2 }}>
          {[
            { l:'Total jobs', v:String(jobs.length), s:'all time', c:'#fff' },
            { l:'Active', v:String(activeJobs.length), s:'in production', c:fAccent },
            { l:'Queued', v:String(queuedJobs.length), s:'awaiting start', c:fWarn },
            { l:'Done', v:String(doneJobs.length), s:'completed', c:fOk },
            { l:'Lead time', v:`${KreoStore.getSettings().leadTimeDays}d`, s:'avg target', c:'#fff' },
          ].map((k,i) => (
            <div key={i} style={{ ...fS.card, padding:'10px 12px' }}>
              <div style={{ ...fS.mono, fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', color:fMute, fontWeight:700 }}>{k.l}</div>
              <div style={{ ...fS.fraunces, fontSize:22, color:k.c, marginTop:3 }}>{k.v}</div>
              <div style={{ ...fS.mono, fontSize:10, color:fMute, marginTop:1 }}>{k.s}</div>
            </div>
          ))}
        </div>

        {/* Workspace 3 cols */}
        <div style={{ flex:1, display:'grid', gridTemplateColumns:'290px 1fr 300px', minHeight:0 }}>

          {/* LEFT — job queue */}
          <div style={{ background:fSub2, borderRight:`1px solid ${fLine}`, display:'flex', flexDirection:'column', overflow:'hidden' }}>
            <div style={{ padding:'10px 14px', borderBottom:`1px solid ${fLine}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', fontWeight:700 }}>Job queue</div>
              <span style={{ ...fS.mono, fontSize:10, color:fMute }}>{jobs.length} jobs</span>
            </div>
            <div style={{ flex:1, overflowY:'auto' }}>
              {jobs.length === 0 ? (
                <div style={{ padding:'32px 16px', textAlign:'center', fontSize:12, color:fMute }}>
                  No jobs yet.<br/>Approve an order in Studio to generate a factory job.
                </div>
              ) : jobs.map(j => {
                const stage = j.currentStage || 0;
                const sc = STAGE_COLORS[stage];
                const isActive = j.id === selId;
                return (
                  <div key={j.id} onClick={() => setSelId(j.id)} style={{
                    padding:'12px 14px', cursor:'pointer', borderBottom:`1px solid ${fLine}`,
                    background: isActive ? 'rgba(201,100,66,0.08)' : 'transparent',
                    borderLeft:`3px solid ${isActive ? fAccent : 'transparent'}`,
                  }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                      <span style={{ ...fS.mono, fontSize:10, color:fAccent, fontWeight:700 }}>{j.id}</span>
                      <span style={{ ...fS.pill, background:'rgba(255,255,255,0.06)', color:sc, fontSize:9, textTransform:'uppercase' }}>{JOB_STAGES[stage]}</span>
                    </div>
                    <div style={{ fontSize:12, color:'#fff', fontWeight:600, marginBottom:2 }}>{j.customerName}</div>
                    <div style={{ fontSize:11, color:fMute }}>{j.finish} · {j.room?.layout}</div>
                    <div style={{ fontSize:10, color:fMute, ...fS.mono, marginTop:2 }}>
                      {j.factoryId || 'FAC-MUM'} → {j.depotCity || 'Mumbai'}
                    </div>
                    <div style={{ marginTop:6, height:3, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${j.progress || 0}%`, background:sc }}></div>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontSize:10, color:fMute }}>
                      <span style={fS.mono}>{j.progress || 0}%</span>
                      <span>Due {j.dueDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CENTER — cut list */}
          <div style={{ display:'flex', flexDirection:'column', minHeight:0 }}>
            {!sel ? (
              <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
                <div style={{ fontSize:40, opacity:0.15 }}>↖</div>
                <div style={{ fontSize:13, color:fMute }}>Select a job to view cut list</div>
              </div>
            ) : (
              <>
                <div style={{ padding:'10px 18px', borderBottom:`1px solid ${fLine}`, background:fSub, display:'flex', alignItems:'center', gap:16, ...fS.mono, fontSize:10, color:fMute }}>
                  <span style={{ color:'#fff', fontWeight:600 }}>{sel.id}</span>
                  <span>{sel.finish}</span>
                  <span>Room {sel.room?.W}×{sel.room?.D}mm</span>
                  <span>{(sel.cutList || []).length} parts</span>
                  <div style={{ flex:1 }} />
                  <input value={cutFilter} onChange={e => setCutFilter(e.target.value)} placeholder="Filter parts…" style={{
                    padding:'5px 10px', background:'rgba(255,255,255,0.06)', border:`1px solid ${fLine}`,
                    borderRadius:6, color:'#fff', fontSize:11, fontFamily:'JetBrains Mono,monospace', outline:'none', width:160,
                  }} />
                </div>
                <div style={{ flex:1, overflowY:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11 }}>
                    <thead>
                      <tr style={{ borderBottom:`1px solid ${fLine}`, background:fSub2 }}>
                        {['Part ID','Name','Material','Qty','L (mm)','W (mm)','T (mm)','Edge band'].map(h => (
                          <th key={h} style={{ ...fS.mono, fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:fMute, fontWeight:700, padding:'8px 12px', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCut.map((p, i) => (
                        <tr key={p.id} style={{ borderBottom:`1px solid ${fLine}`, background:i%2?'rgba(255,255,255,0.01)':'transparent' }}>
                          <td style={{ ...fS.mono, padding:'7px 12px', color:fAccent, fontWeight:700 }}>{p.id}</td>
                          <td style={{ padding:'7px 12px', color:'#fff' }}>{p.name}</td>
                          <td style={{ padding:'7px 12px', color:fMute, fontSize:10 }}>{p.mat}</td>
                          <td style={{ ...fS.mono, padding:'7px 12px', color:'#fff', textAlign:'center' }}>{p.qty}</td>
                          <td style={{ ...fS.mono, padding:'7px 12px', color:'#fff' }}>{p.L}</td>
                          <td style={{ ...fS.mono, padding:'7px 12px', color:'#fff' }}>{p.W}</td>
                          <td style={{ ...fS.mono, padding:'7px 12px', color:fMute }}>{p.T}</td>
                          <td style={{ padding:'7px 12px', color:fMute, fontSize:10 }}>{p.edge}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* RIGHT — stage tracker + actions */}
          <div style={{ background:fSub2, borderLeft:`1px solid ${fLine}`, padding:'16px', display:'flex', flexDirection:'column', gap:14, overflow:'hidden' }}>
            {!sel ? (
              <div style={{ fontSize:12, color:fMute, marginTop:8 }}>Select a job to track production stages.</div>
            ) : (
              <>
                <div>
                  <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', fontWeight:700, marginBottom:10 }}>Production stages</div>
                  {JOB_STAGES.map((stage, i) => {
                    const cur = sel.currentStage || 0;
                    const done = i < cur; const active = i === cur;
                    return (
                      <div key={stage} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderTop:i?`1px solid ${fLine}`:'none' }}>
                        <div style={{ width:20, height:20, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700,
                          background: done ? '#4cba85' : active ? fAccent : 'rgba(255,255,255,0.08)',
                          color: done || active ? '#fff' : fMute,
                          border: active ? `2px solid ${fAccent}` : 'none',
                        }}>{done ? '✓' : i+1}</div>
                        <span style={{ fontSize:12, color: done ? '#4cba85' : active ? '#fff' : fMute, fontWeight: active ? 600 : 400 }}>{stage}</span>
                        {active && <span style={{ marginLeft:'auto', ...fS.mono, fontSize:9, color:fAccent }}>CURRENT</span>}
                        {done && <span style={{ marginLeft:'auto', ...fS.mono, fontSize:9, color:'#4cba85' }}>DONE</span>}
                      </div>
                    );
                  })}
                </div>

                <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${sel.progress || 0}%`, background:fAccent, transition:'width 0.3s' }}></div>
                </div>
                <div style={{ ...fS.mono, fontSize:10, color:fMute, textAlign:'center' }}>{sel.progress || 0}% complete</div>

                {(sel.currentStage || 0) < JOB_STAGES.length - 1 && (
                  <button onClick={() => advanceStage(sel.id)} style={{
                    padding:'11px', borderRadius:8, fontSize:12, fontWeight:600,
                    background:fAccent, color:'#fff', border:'none', cursor:'pointer',
                  }}>
                    Advance to {JOB_STAGES[Math.min((sel.currentStage||0)+1, JOB_STAGES.length-1)]} →
                  </button>
                )}
                {(sel.currentStage || 0) === JOB_STAGES.length - 1 && (
                  <div style={{ padding:'11px', borderRadius:8, fontSize:12, fontWeight:600, background:'rgba(76,186,133,0.15)', color:'#4cba85', textAlign:'center', border:'1px solid rgba(76,186,133,0.3)' }}>
                    ✓ Job complete — order marked delivered
                  </div>
                )}

                {sel.studioNote && (
                  <div style={{ ...fS.card, borderColor:'rgba(201,100,66,0.3)', borderWidth:1, borderStyle:'solid' }}>
                    <div style={{ fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:fAccent, fontWeight:700, marginBottom:6 }}>Studio note</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.8)', lineHeight:1.5 }}>{sel.studioNote}</div>
                  </div>
                )}

                {(sel.stageLog || []).length > 0 && (
                  <div style={fS.card}>
                    <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', fontWeight:700, marginBottom:8 }}>Stage log</div>
                    {[...sel.stageLog].reverse().map((log, i) => (
                      <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.7)', padding:'5px 0', borderTop:i?`1px solid ${fLine}`:'none' }}>
                        <span style={{ textTransform:'capitalize' }}>{log.stage}</span>
                        <span style={{ ...fS.mono, fontSize:10, color:fMute }}>{new Date(log.ts).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ADMIN MODULE ──────────────────────────────────────────────── */
function AdminModule() {
  const { useState: useS, useEffect: useE } = React;
  const [settings, setSettings] = useS(() => KreoStore.getSettings());
  const [saved, setSaved] = useS(false);
  const [adminTab, setAdminTab] = useS('dashboard');

  const update = (key, val) => setSettings(s => ({ ...s, [key]: val }));
  const handleSave = () => {
    KreoStore.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fmtInr = n => '₹ ' + Number(n).toLocaleString('en-IN');
  const numInput = (label, key, step=100, suffix='') => (
    <div style={{ marginBottom:12 }}>
      <div style={{ fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', color:fMute, fontWeight:700, marginBottom:4 }}>{label}</div>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <input type="number" value={settings[key]} step={step} onChange={e => update(key, Number(e.target.value))} style={{
          flex:1, padding:'8px 10px', background:'rgba(255,255,255,0.05)', border:`1px solid ${fLine}`,
          borderRadius:6, color:'#fff', fontSize:12, fontFamily:'JetBrains Mono,monospace', outline:'none',
        }} />
        {suffix && <span style={{ fontSize:11, color:fMute }}>{suffix}</span>}
      </div>
    </div>
  );

  const ADMIN_TABS = ['dashboard','pricing','finishes','vendors','team','audit','logistics'];

  return (
    <div style={fS.shell}>
      <FSidebar module="admin" active="Margin" />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>

        <div style={fS.topbar}>
          <div style={{ ...fS.mono, fontSize:11, color:fMute }}>ADMIN · ATELIER REEMA</div>
          <div style={{ flex:1 }}></div>
          {saved && <span style={{ ...fS.mono, fontSize:11, color:'#4cba85' }}>✓ Settings saved</span>}
          <button onClick={handleSave} style={{ padding:'7px 16px', borderRadius:6, fontSize:11, fontWeight:600, background:fAccent, color:'#fff', border:'none', cursor:'pointer' }}>Save all settings</button>
        </div>

        {/* Sub-nav */}
        <div style={{ background:fSub2, padding:'10px 22px', borderBottom:`1px solid ${fLine}`, display:'flex', gap:4 }}>
          {ADMIN_TABS.map(t => (
            <button key={t} onClick={() => setAdminTab(t)} style={{
              padding:'6px 14px', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', border:'none',
              background: t === adminTab ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: t === adminTab ? '#fff' : fMute, textTransform:'capitalize',
            }}>{t}</button>
          ))}
        </div>

        <div style={{ flex:1, overflow:'auto', padding:22, background:fBg }}>
          {adminTab === 'dashboard' && (
            <div>
              <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:fMute, fontWeight:700, marginBottom:6 }}>Kreobox ERP Platform</div>
              <div style={{ ...fS.fraunces, fontSize:26, color:'#fff', marginBottom:4 }}>Back-office Dashboard</div>
              <div style={{ fontSize:13, color:fMute, marginBottom:24 }}>Manage your entire kitchen manufacturing operation from one place.</div>

              {/* KPI row from live data */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:28 }}>
                {(() => {
                  const orders = KreoStore.getOrders();
                  const jobs = KreoStore.getJobs();
                  const revenue = orders.filter(o => o.status !== 'new').reduce((s,o) => s+(o.total||0), 0);
                  return [
                    { l:'Orders',     v:String(orders.length),    s:'total received',       c:fAccent },
                    { l:'Revenue',    v:`₹${Math.round(revenue/100000)}L`, s:'pipeline + delivered', c:fOk },
                    { l:'Active jobs',v:String(jobs.filter(j=>(j.currentStage||0)>0&&(j.currentStage||0)<7).length), s:'on factory floor', c:fInfo },
                    { l:'Depots',     v:'73', s:'across 18 cities', c:'#fff' },
                    { l:'Lead time',  v:`${KreoStore.getSettings().leadTimeDays}d`, s:'target avg', c:'#fff' },
                  ].map((k,i) => (
                    <div key={i} style={{ ...fS.card }}>
                      <div style={{ ...fS.mono, fontSize:9, color:fMute, letterSpacing:'0.14em', textTransform:'uppercase' }}>{k.l}</div>
                      <div style={{ ...fS.fraunces, fontSize:24, color:k.c, marginTop:4 }}>{k.v}</div>
                      <div style={{ fontSize:10, color:fMute, marginTop:2 }}>{k.s}</div>
                    </div>
                  ));
                })()}
              </div>

              {/* ERP module cards */}
              <div style={{ fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:fMute, fontWeight:700, marginBottom:12 }}>ERP Modules</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
                {[
                  { id:'crm',      icon:'⊠', label:'CRM & Orders',   desc:'Customer orders, quote review, design approval workflow.', page:'backend.html', color:fAccent },
                  { id:'finance',  icon:'₹', label:'Finance',         desc:'Revenue dashboard, order ledger, margin & GST tracking.', page:'backend.html#finance', color:fOk },
                  { id:'factory',  icon:'⚙', label:'Manufacturing',   desc:'Shop floor, 8-stage production, cut list & CNC nesting.', page:'factory.html', color:'#7c5cff' },
                  { id:'proc',     icon:'⊞', label:'Procurement',     desc:'Vendor management, PO tracking, material inventory.', page:'backend.html#procurement', color:fInfo },
                  { id:'log',      icon:'⊡', label:'Logistics',       desc:'3 factories, 73 depots, Tier 1/2 city delivery network.', page:null, color:fWarn },
                  { id:'hr',       icon:'⊟', label:'HR & Team',       desc:'Staff directory, roles, access levels, activity log.', page:'backend.html#hr', color:'#ff9060' },
                  { id:'pricing',  icon:'✦', label:'Pricing & Rates', desc:'Cabinet rates, markup, GST, lead time, finish catalog.', page:null, color:'#c0b0f0' },
                  { id:'audit',    icon:'≡', label:'Audit Trail',     desc:'Full order history, status changes, delivery tracking.', page:null, color:'#a0b0c0' },
                  { id:'settings', icon:'◈', label:'Settings',        desc:'Studio profile, notifications, integrations, API keys.', page:null, color:fMute },
                ].map(m => (
                  <div key={m.id} style={{ ...fS.card, borderLeft:`3px solid ${m.color}`, cursor: m.page ? 'pointer' : 'default', transition:'background 0.15s' }}
                    onClick={() => {
                      if (m.page && m.page.startsWith('backend')) setAdminTab(m.id === 'crm' ? 'pricing' : 'pricing');
                      if (m.id === 'log') setAdminTab('logistics');
                      if (m.id === 'pricing') setAdminTab('pricing');
                      if (m.id === 'audit') setAdminTab('audit');
                      if (m.id === 'settings') setAdminTab('pricing');
                      if (m.page && !m.page.includes('#')) window.open(m.page, '_blank');
                    }}
                    onMouseEnter={e => { if (m.page || m.id === 'log' || m.id === 'pricing' || m.id === 'audit') e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = fSub; }}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                      <span style={{ fontSize:20, color:m.color }}>{m.icon}</span>
                      <span style={{ fontSize:14, color:'#fff', fontWeight:600 }}>{m.label}</span>
                      {m.page && <span style={{ marginLeft:'auto', fontSize:10, color:fMute }}>→</span>}
                    </div>
                    <div style={{ fontSize:12, color:fMute, lineHeight:1.5 }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'pricing' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, maxWidth:900 }}>
              <div style={fS.card}>
                <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:fMute, fontWeight:700, marginBottom:14 }}>Material rates</div>
                {numInput('Cabinet rate · per running metre (₹)', 'cabinetRate', 500)}
                {numInput('Worktop rate · per running metre (₹)', 'worktopRate', 500)}
                {numInput('Appliances · flat per project (₹)', 'applianceFlat', 1000)}
                {numInput('Hardware rate · % of carcass cost', 'hardwareRate', 1, '%')}
                <div style={{ padding:'10px 12px', background:'rgba(255,255,255,0.04)', borderRadius:6, marginTop:6 }}>
                  <div style={{ fontSize:10, color:fMute, marginBottom:6 }}>Sample BOM for L-shape 3.8×2.84m · Bali Oak</div>
                  <div style={{ ...fS.mono, fontSize:11, color:'#fff' }}>
                    Estimated total: {fmtInr(Math.round(
                      (Math.max(2,Math.round(6.64*0.7/0.6)) * Math.round(settings.cabinetRate*0.6) +
                      Math.max(2,Math.round(6.64*0.7/0.6)) * Math.round(settings.cabinetRate*0.6*0.8) +
                      1 * Math.round(settings.cabinetRate*0.6*1.1) +
                      5.98 * settings.worktopRate + settings.applianceFlat) *
                      (1 + settings.hardwareRate/100) * (1 + settings.markup/100) * (1 + settings.gst/100)
                    ))}
                  </div>
                </div>
              </div>

              <div style={fS.card}>
                <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:fMute, fontWeight:700, marginBottom:14 }}>Pricing structure</div>
                {numInput('Studio markup (% over cost)', 'markup', 1, '%')}
                {numInput('GST rate (%)', 'gst', 1, '%')}
                {numInput('Lead time (days)', 'leadTimeDays', 1, 'days')}
                <div style={{ padding:'10px 12px', background:'rgba(255,255,255,0.04)', borderRadius:6, marginTop:6 }}>
                  <div style={{ fontSize:11, color:fMute, marginBottom:4 }}>Pricing breakdown</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', lineHeight:1.8 }}>
                    Material cost → +{settings.markup}% markup → +{settings.gst}% GST = customer total
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'finishes' && (
            <div style={{ maxWidth:600 }}>
              <div style={fS.card}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                  <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:fMute, fontWeight:700 }}>Finish catalog</div>
                  <button onClick={() => {
                    const name = window.prompt('New finish name:');
                    if (name) update('finishes', [...(settings.finishes||[]), name]);
                  }} style={{ padding:'5px 12px', borderRadius:6, fontSize:11, fontWeight:600, background:fAccent, color:'#fff', border:'none', cursor:'pointer' }}>+ Add finish</button>
                </div>
                {(settings.finishes || []).map((f, i) => (
                  <div key={f} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderTop:i?`1px solid ${fLine}`:'none' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:32, height:32, borderRadius:6, border:`1px solid ${fLine}`, background:'rgba(255,255,255,0.06)' }}></div>
                      <span style={{ fontSize:13, color:'#fff', fontWeight:500 }}>{f}</span>
                    </div>
                    <button onClick={() => update('finishes', settings.finishes.filter(x => x !== f))} style={{ padding:'4px 10px', borderRadius:6, fontSize:11, border:`1px solid rgba(255,80,80,0.3)`, color:'#ff6060', background:'transparent', cursor:'pointer' }}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'vendors' && (
            <div style={{ maxWidth:800 }}>
              <div style={fS.card}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                  <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:fMute, fontWeight:700 }}>Vendor directory</div>
                  <button style={{ padding:'5px 12px', borderRadius:6, fontSize:11, fontWeight:600, background:fAccent, color:'#fff', border:'none', cursor:'pointer' }}>+ Add vendor</button>
                </div>
                {[
                  { n:'Greenlam Industries', cat:'Laminates / Boards', contact:'orders@greenlam.com', status:'active' },
                  { n:'Hettich India', cat:'Hardware', contact:'india@hettich.com', status:'active' },
                  { n:'Caesarstone', cat:'Quartz worktops', contact:'sales@caesarstone.in', status:'active' },
                  { n:'Faber India', cat:'Appliances / Hoods', contact:'service@faberindia.com', status:'active' },
                  { n:'Hafele India', cat:'Hardware / Fittings', contact:'info@hafele.in', status:'inactive' },
                ].map((v, i) => (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1.4fr auto', gap:12, padding:'12px 0', borderTop:i?`1px solid ${fLine}`:'none', alignItems:'center' }}>
                    <div>
                      <div style={{ fontSize:13, color:'#fff', fontWeight:600 }}>{v.n}</div>
                      <div style={{ fontSize:10, color:fMute }}>{v.cat}</div>
                    </div>
                    <span style={{ fontSize:11, color:'rgba(255,255,255,0.6)', ...fS.mono }}>{v.contact}</span>
                    <span style={{ ...fS.pill, background: v.status==='active'?'rgba(76,186,133,0.15)':'rgba(255,255,255,0.05)', color: v.status==='active'?fOk:fMute, textTransform:'uppercase' }}>{v.status}</span>
                    <button style={{ padding:'5px 10px', borderRadius:6, fontSize:11, border:`1px solid ${fLine}`, color:'#fff', background:'transparent', cursor:'pointer' }}>Edit</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'team' && (
            <div style={{ maxWidth:800 }}>
              <div style={fS.card}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                  <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:fMute, fontWeight:700 }}>Team members</div>
                  <button style={{ padding:'5px 12px', borderRadius:6, fontSize:11, fontWeight:600, background:fAccent, color:'#fff', border:'none', cursor:'pointer' }}>+ Invite</button>
                </div>
                {[
                  { n:'Reema Iyer', e:'reema@atelier.in', r:'Owner · Admin', l:'now', initials:'RI', c:fAccent },
                  { n:'Aditya Shenoy', e:'aditya@atelier.in', r:'Designer', l:'12m ago', initials:'AS', c:fInfo },
                  { n:'Priya Nair', e:'priya@atelier.in', r:'PM · Site', l:'1h ago', initials:'PN', c:fOk },
                  { n:'Suresh M.', e:'suresh@factory.in', r:'Factory ops', l:'now', initials:'SM', c:fWarn },
                ].map((m, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderTop:i?`1px solid ${fLine}`:'none' }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:m.c, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff' }}>{m.initials}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, color:'#fff', fontWeight:600 }}>{m.n}</div>
                      <div style={{ fontSize:11, color:fMute }}>{m.e}</div>
                    </div>
                    <span style={{ fontSize:12, color:'rgba(255,255,255,0.6)' }}>{m.r}</span>
                    <span style={{ ...fS.mono, fontSize:10, color:fMute }}>{m.l}</span>
                    <button style={{ padding:'5px 10px', borderRadius:6, fontSize:11, border:`1px solid ${fLine}`, color:'#fff', background:'transparent', cursor:'pointer' }}>···</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'audit' && (
            <div style={{ maxWidth:900 }}>
              <div style={fS.card}>
                <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:fMute, fontWeight:700, marginBottom:14 }}>Order history</div>
                {KreoStore.getOrders().length === 0 ? (
                  <div style={{ fontSize:12, color:fMute, padding:'16px 0' }}>No orders yet.</div>
                ) : KreoStore.getOrders().map((o, i) => (
                  <div key={o.id} style={{ display:'grid', gridTemplateColumns:'150px 1fr 1fr auto auto', gap:12, padding:'10px 0', borderTop:i?`1px solid ${fLine}`:'none', alignItems:'center', fontSize:11 }}>
                    <span style={{ ...fS.mono, color:fAccent, fontWeight:700 }}>{o.id}</span>
                    <span style={{ color:'#fff', fontWeight:600 }}>{o.customerName}</span>
                    <span style={{ color:fMute }}>{o.room?.layout} · {o.finish}</span>
                    <span style={{ ...fS.mono, color:'#fff' }}>₹ {Number(o.total).toLocaleString('en-IN')}</span>
                    <span style={{ ...fS.pill, background:'rgba(255,255,255,0.05)', color:fMute, textTransform:'uppercase' }}>{o.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'logistics' && (
            <div style={{ maxWidth:1100 }}>
              {/* Factory cards */}
              <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:fMute, fontWeight:700, marginBottom:12 }}>
                Manufacturing Facilities · India
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:28 }}>
                {FACTORIES.map(f => {
                  const depotCount = DEPOTS.filter(d => d.factory === f.id).reduce((s,d) => s+d.depots, 0);
                  const cityCount  = DEPOTS.filter(d => d.factory === f.id).length;
                  const color = f.id === 'FAC-MUM' ? fAccent : f.id === 'FAC-BLR' ? fOk : fInfo;
                  return (
                    <div key={f.id} style={{ ...fS.card, borderLeft:`3px solid ${color}` }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                        <div>
                          <div style={{ ...fS.mono, fontSize:9, color, letterSpacing:'0.12em', fontWeight:700 }}>{f.id}</div>
                          <div style={{ fontSize:14, color:'#fff', fontWeight:600, marginTop:3 }}>{f.name}</div>
                          <div style={{ fontSize:11, color:fMute, marginTop:2 }}>{f.location}</div>
                        </div>
                        <span style={{ ...fS.pill, background: f.active ? 'rgba(76,186,133,0.15)' : 'rgba(255,255,255,0.05)', color: f.active ? fOk : fMute, textTransform:'uppercase' }}>
                          {f.active ? '● Active' : 'Offline'}
                        </span>
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:10 }}>
                        {[
                          ['Capacity', `${f.capacity} jobs/mo`, '#fff'],
                          ['Depots', String(depotCount), color],
                          ['Cities', String(cityCount), '#fff'],
                        ].map(([l,v,c]) => (
                          <div key={l} style={{ background:'rgba(255,255,255,0.04)', borderRadius:6, padding:'8px 10px' }}>
                            <div style={{ ...fS.mono, fontSize:9, color:fMute, letterSpacing:'0.1em' }}>{l}</div>
                            <div style={{ fontSize:16, fontWeight:700, color:c, marginTop:2 }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop:10 }}>
                        <div style={{ fontSize:9, letterSpacing:'0.1em', color:fMute, marginBottom:5, textTransform:'uppercase' }}>Service zones</div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                          {f.zones.map(z => (
                            <span key={z} style={{ ...fS.pill, background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.65)', fontSize:9 }}>{z}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Depot network */}
              <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:fMute, fontWeight:700, marginBottom:12 }}>
                Depot Network · {DEPOTS.reduce((s,d) => s+d.depots,0)} depots · {DEPOTS.length} cities
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[1,2].map(tier => (
                  <div key={tier} style={fS.card}>
                    <div style={{ fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:700, color: tier===1 ? fAccent : fInfo, marginBottom:12 }}>
                      Tier {tier} cities · coverage {tier===1?'10':'20'} km radius
                    </div>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11 }}>
                      <thead>
                        <tr style={{ borderBottom:`1px solid ${fLine}` }}>
                          {['City','State','Depots','Factory'].map(h => (
                            <th key={h} style={{ ...fS.mono, fontSize:9, color:fMute, fontWeight:700, padding:'4px 8px', textAlign:'left', letterSpacing:'0.1em', textTransform:'uppercase' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {DEPOTS.filter(d => d.tier === tier).map((d,i) => {
                          const fac = FACTORIES.find(f => f.id === d.factory);
                          const facColor = d.factory==='FAC-MUM' ? fAccent : d.factory==='FAC-BLR' ? fOk : fInfo;
                          return (
                            <tr key={d.city} style={{ borderTop:i?`1px solid ${fLine}`:'none' }}>
                              <td style={{ padding:'7px 8px', color:'#fff', fontWeight:600 }}>{d.city}</td>
                              <td style={{ padding:'7px 8px', color:fMute, fontSize:10 }}>{d.state}</td>
                              <td style={{ padding:'7px 8px', ...fS.mono, color: tier===1?fAccent:fInfo, fontWeight:700 }}>{d.depots}</td>
                              <td style={{ padding:'7px 8px' }}>
                                <span style={{ ...fS.mono, fontSize:9, color:facColor }}>{d.factory}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              {/* Summary KPIs */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginTop:16 }}>
                {[
                  { l:'Total factories', v:'3', s:'Mumbai · Bengaluru · Delhi NCR', c:fAccent },
                  { l:'Total depots', v:String(DEPOTS.reduce((s,d)=>s+d.depots,0)), s:'across India', c:'#fff' },
                  { l:'Tier 1 cities', v:String(DEPOTS.filter(d=>d.tier===1).length), s:'10 km coverage', c:fOk },
                  { l:'Tier 2 cities', v:String(DEPOTS.filter(d=>d.tier===2).length), s:'20 km coverage', c:fInfo },
                ].map((k,i) => (
                  <div key={i} style={{ ...fS.card }}>
                    <div style={{ ...fS.mono, fontSize:9, color:fMute, letterSpacing:'0.14em', textTransform:'uppercase' }}>{k.l}</div>
                    <div style={{ ...fS.fraunces, fontSize:28, color:k.c, marginTop:4 }}>{k.v}</div>
                    <div style={{ fontSize:11, color:fMute, marginTop:2 }}>{k.s}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FactoryModule, AdminModule, KreoStore });
