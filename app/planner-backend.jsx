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

function BSidebar({ newCount = 0 }) {
  const sb  = bStyles.sbItem;
  const a   = { ...sb, ...bStyles.sbItemActive };
  const dot = c => <span style={{ width:6, height:6, borderRadius:'50%', background:c, flexShrink:0 }}></span>;
  const badge = (n, col) => n > 0 ? <span style={{ marginLeft:'auto', background:col||bAccent, color:'#fff', fontSize:9, padding:'1px 6px', borderRadius:999, fontWeight:700 }}>{n}</span> : null;
  return (
    <div style={bStyles.sidebar}>
      <div style={bStyles.sbBrand}>
        <BLogo size={20} />
        <span style={bStyles.sbWm}>Kreobox</span>
      </div>
      <div style={{ padding:'6px 8px', background:'rgba(255,255,255,0.04)', borderRadius:6, marginBottom:8 }}>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:700 }}>Studio</div>
        <div style={{ fontSize:13, fontWeight:600, color:'#fff', marginTop:2 }}>Atelier Reema</div>
      </div>
      <div style={bStyles.sbSection}>Workspace</div>
      <div style={sb}>{dot('#aaa')} Pipeline</div>
      <div style={a}>{dot(bAccent)} Orders {badge(newCount)}</div>
      <div style={sb}>{dot('#aaa')} Drawings</div>
      <div style={sb}>{dot('#aaa')} Approvals {badge(newCount, '#5b8def')}</div>
      <div style={bStyles.sbSection}>Operations</div>
      <div style={sb}>{dot('#aaa')} Vendors</div>
      <div style={sb}>{dot('#aaa')} POs</div>
      <div style={sb}>{dot('#aaa')} Inventory</div>
      <div style={sb}>{dot('#aaa')} Fabrication</div>
      <div style={bStyles.sbSection}>Studio</div>
      <div style={sb}>{dot('#aaa')} Team</div>
      <div style={sb}>{dot('#aaa')} Margin</div>
      <div style={sb}>{dot('#aaa')} Library</div>
      <div style={{ flex:1 }}></div>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:8, borderRadius:6, background:'rgba(255,255,255,0.04)' }}>
        <div style={{ width:26, height:26, borderRadius:'50%', background:`linear-gradient(135deg,${bAccent},#d97042)` }}></div>
        <div style={{ display:'flex', flexDirection:'column' }}>
          <span style={{ fontSize:11, fontWeight:600, color:'#fff' }}>Reema Iyer</span>
          <span style={{ fontSize:9, color:'rgba(255,255,255,0.4)' }}>Lead designer</span>
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

/* ── KREO STORE ───────────────────────────────────────────────── */
const KreoStore = (() => {
  const fire = () => window.dispatchEvent(new Event('kreobox-update'));
  return {
    getOrders() { try { return JSON.parse(localStorage.getItem('kreobox_orders') || '[]'); } catch { return []; } },
    saveOrders(o) { localStorage.setItem('kreobox_orders', JSON.stringify(o)); fire(); },
    updateOrder(id, patch) { this.saveOrders(this.getOrders().map(o => o.id === id ? { ...o, ...patch } : o)); },
    getJobs() { try { return JSON.parse(localStorage.getItem('kreobox_jobs') || '[]'); } catch { return []; } },
    saveJobs(j) { localStorage.setItem('kreobox_jobs', JSON.stringify(j)); fire(); },
    addJob(j) { const jobs = this.getJobs(); jobs.unshift(j); this.saveJobs(jobs); },
    getSettings() {
      const D = { cabinetRate:22000, worktopRate:35000, applianceFlat:58400, hardwareRate:8, markup:18, gst:18, leadTimeDays:21 };
      try { return { ...D, ...JSON.parse(localStorage.getItem('kreobox_settings') || '{}') }; } catch { return D; }
    },
    nextJobId() {
      const d = new Date();
      return `FAB-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(this.getJobs().length+1).padStart(3,'0')}`;
    },
  };
})();

function generateCutList(room, finish, bom) {
  const parts = [];
  const baseCount = (bom.find(b => b.category === 'Base cabinets') || {}).qty || 3;
  const wallCount = (bom.find(b => b.category === 'Wall cabinets') || {}).qty || 3;
  const highCount = (bom.find(b => b.category === 'High cabinets') || {}).qty || 1;
  const carcassMat = '18mm HDF · Greenlam';
  const backMat    = '6mm HDF';
  const doorMat    = `18mm MDF · ${finish}`;
  for (let i = 0; i < baseCount; i++) {
    const n = String(i+1).padStart(2,'0');
    parts.push(
      { id:`BC${n}-SL`, name:`Base ${n} · Left side`, mat:carcassMat, qty:1, L:720, W:560, T:18, edge:'T-L' },
      { id:`BC${n}-SR`, name:`Base ${n} · Right side`, mat:carcassMat, qty:1, L:720, W:560, T:18, edge:'T-L' },
      { id:`BC${n}-BT`, name:`Base ${n} · Bottom`, mat:carcassMat, qty:1, L:564, W:560, T:18, edge:'F' },
      { id:`BC${n}-SH`, name:`Base ${n} · Shelf`, mat:carcassMat, qty:1, L:564, W:530, T:18, edge:'F' },
      { id:`BC${n}-BK`, name:`Base ${n} · Back`, mat:backMat, qty:1, L:720, W:564, T:6, edge:'none' },
      { id:`BD${n}`,    name:`Base ${n} · Door`, mat:doorMat, qty:1, L:696, W:596, T:18, edge:'FBLR' },
    );
  }
  for (let i = 0; i < wallCount; i++) {
    const n = String(i+1).padStart(2,'0');
    parts.push(
      { id:`WC${n}-SL`, name:`Wall ${n} · Left side`, mat:carcassMat, qty:1, L:700, W:320, T:18, edge:'T-L' },
      { id:`WC${n}-SR`, name:`Wall ${n} · Right side`, mat:carcassMat, qty:1, L:700, W:320, T:18, edge:'T-L' },
      { id:`WC${n}-BT`, name:`Wall ${n} · Bottom`, mat:carcassMat, qty:1, L:564, W:320, T:18, edge:'F' },
      { id:`WC${n}-TP`, name:`Wall ${n} · Top`, mat:carcassMat, qty:1, L:564, W:320, T:18, edge:'F' },
      { id:`WC${n}-BK`, name:`Wall ${n} · Back`, mat:backMat, qty:1, L:700, W:564, T:6, edge:'none' },
      { id:`WD${n}`,    name:`Wall ${n} · Door`, mat:doorMat, qty:1, L:676, W:596, T:18, edge:'FBLR' },
    );
  }
  for (let i = 0; i < highCount; i++) {
    const n = String(i+1).padStart(2,'0');
    parts.push(
      { id:`HC${n}-SL`, name:`High ${n} · Left side`, mat:carcassMat, qty:1, L:2200, W:560, T:18, edge:'T-L' },
      { id:`HC${n}-SR`, name:`High ${n} · Right side`, mat:carcassMat, qty:1, L:2200, W:560, T:18, edge:'T-L' },
      { id:`HC${n}-BT`, name:`High ${n} · Bottom`, mat:carcassMat, qty:1, L:564, W:560, T:18, edge:'F' },
      { id:`HC${n}-TP`, name:`High ${n} · Top`, mat:carcassMat, qty:1, L:564, W:560, T:18, edge:'F' },
      { id:`HC${n}-SH`, name:`High ${n} · Shelf ×2`, mat:carcassMat, qty:2, L:564, W:530, T:18, edge:'F' },
      { id:`HC${n}-BK`, name:`High ${n} · Back`, mat:backMat, qty:1, L:2200, W:564, T:6, edge:'none' },
      { id:`HD${n}`,    name:`High ${n} · Door ×2`, mat:doorMat, qty:2, L:1080, W:596, T:18, edge:'FBLR' },
    );
  }
  return parts;
}

const STATUS_COLORS = {
  new:       { bg:'rgba(91,141,239,0.15)', fg:'#5b8def', label:'New' },
  reviewing: { bg:'rgba(217,160,73,0.15)', fg:'#d9a049', label:'Reviewing' },
  quoted:    { bg:'rgba(201,100,66,0.15)', fg:'#c96442', label:'Quoted' },
  approved:  { bg:'rgba(76,186,133,0.15)', fg:'#4cba85', label:'Approved' },
  rejected:  { bg:'rgba(255,80,80,0.12)', fg:'#ff6060', label:'Rejected' },
  'in-fab':  { bg:'rgba(124,92,255,0.15)', fg:'#7c5cff', label:'In Fab' },
  delivered: { bg:'rgba(76,186,133,0.15)', fg:'#4cba85', label:'Delivered' },
};

/* ── BACKEND PLANNER (studio) ─────────────────────────────────── */
function PlannerBackend() {
  const { useState: useS, useEffect: useE } = React;
  const [orders, setOrders]   = useS(() => KreoStore.getOrders());
  const [selId, setSelId]     = useS(null);
  const [studioNote, setStudioNote] = useS('');
  const [quoteTotal, setQuoteTotal] = useS('');

  const reload = () => setOrders(KreoStore.getOrders());

  useE(() => {
    window.addEventListener('kreobox-update', reload);
    window.addEventListener('focus', reload);
    return () => { window.removeEventListener('kreobox-update', reload); window.removeEventListener('focus', reload); };
  }, []);

  const sel = orders.find(o => o.id === selId) || null;

  const advance = (id, status, extra = {}) => {
    KreoStore.updateOrder(id, { status, ...extra });
    reload();
  };

  const approveOrder = () => {
    if (!sel) return;
    const qt = Number(quoteTotal) || sel.total;
    const job = {
      id: KreoStore.nextJobId(), orderId: sel.id, ts: Date.now(),
      status: 'queued', priority: 'normal',
      customerName: sel.customerName, finish: sel.finish,
      room: sel.room, bom: sel.bom,
      cutList: generateCutList(sel.room, sel.finish, sel.bom),
      stages: ['queued','material-check','cutting','banding','assembly','finishing','qc','done'],
      currentStage: 0, progress: 0,
      dueDate: new Date(Date.now() + KreoStore.getSettings().leadTimeDays * 86400000).toISOString().slice(0,10),
      stageLog: [{ stage:'queued', ts: Date.now(), by:'Studio' }],
      studioNote: studioNote,
    };
    KreoStore.addJob(job);
    advance(sel.id, 'approved', { approvedTotal: qt, studioNote, jobId: job.id });
    setQuoteTotal(''); setStudioNote('');
  };

  const fmt = n => '₹ ' + Number(n).toLocaleString('en-IN');
  const newCount = orders.filter(o => o.status === 'new').length;

  const pill = (status) => {
    const c = STATUS_COLORS[status] || { bg:'rgba(255,255,255,0.05)', fg:bMute, label:status };
    return <span style={{ ...bStyles.pill, background:c.bg, color:c.fg, textTransform:'uppercase' }}>{c.label}</span>;
  };

  const fmtDate = ts => new Date(ts).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit' });
  const fmtTime = ts => new Date(ts).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });

  const WORKFLOW_STEPS = ['Concept','Layout','Materials','Cost','Sign-off','Fab'];
  const statusStep = { new:0, reviewing:1, quoted:2, approved:3, 'in-fab':4, delivered:5 };

  return (
    <div style={bStyles.shell}>
      <BSidebar newCount={newCount} />

      <div style={bStyles.main}>
        {/* Top context bar */}
        <div style={bStyles.topbar}>
          {sel ? (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ ...bStyles.mono, fontSize:11, color:bMute }}>{sel.id}</div>
                {pill(sel.status)}
                <div style={{ fontSize:13, color:'#fff', fontWeight:600 }}>{sel.customerName}</div>
                <div style={{ fontSize:11, color:bMute }}>{sel.room?.layout} · {sel.finish}</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:4, marginLeft:20 }}>
                {WORKFLOW_STEPS.map((step, i) => {
                  const cur = statusStep[sel.status] || 0;
                  const done = i < cur; const active = i === cur;
                  return (
                    <React.Fragment key={step}>
                      <span style={{
                        ...bStyles.pill, textTransform:'uppercase',
                        background: done ? 'rgba(76,186,133,0.15)' : active ? 'rgba(201,100,66,0.2)' : 'rgba(255,255,255,0.04)',
                        color: done ? '#4cba85' : active ? bAccent : bMute,
                      }}>{done ? '✓' : ''} {step}</span>
                      {i < 5 && <span style={{ color:'rgba(255,255,255,0.15)', fontSize:10 }}>›</span>}
                    </React.Fragment>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ ...bStyles.mono, fontSize:11, color:bMute }}>
              STUDIO · {orders.length} orders · {newCount} new
            </div>
          )}
          <div style={{ flex:1 }}></div>
          {sel && sel.status === 'new' && (
            <button onClick={() => advance(sel.id, 'reviewing')} style={{ padding:'6px 14px', borderRadius:6, fontSize:11, fontWeight:600, border:`1px solid ${bLine}`, color:'#fff', background:'transparent', cursor:'pointer' }}>
              Start review →
            </button>
          )}
          {sel && sel.status === 'approved' && sel.jobId && (
            <span style={{ ...bStyles.mono, fontSize:10, color:'#4cba85' }}>Job {sel.jobId} in factory</span>
          )}
        </div>

        {/* Workspace 3 columns */}
        <div style={{ flex:1, display:'grid', gridTemplateColumns:'280px 1fr 300px', minHeight:0 }}>

          {/* LEFT — order inbox */}
          <div style={{ background:'#191613', borderRight:`1px solid ${bLine}`, display:'flex', flexDirection:'column', overflow:'hidden' }}>
            <div style={{ padding:'12px 14px', borderBottom:`1px solid ${bLine}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', fontWeight:700 }}>Order inbox</div>
              <span style={{ ...bStyles.mono, fontSize:10, color:bMute }}>{orders.length} total</span>
            </div>
            <div style={{ flex:1, overflowY:'auto' }}>
              {orders.length === 0 ? (
                <div style={{ padding:'32px 16px', textAlign:'center', fontSize:12, color:bMute }}>
                  No orders yet.<br/>Customer quotes from the planner appear here.
                </div>
              ) : orders.map(o => {
                const sc = STATUS_COLORS[o.status] || { fg:bMute, bg:'transparent' };
                const isActive = o.id === selId;
                return (
                  <div key={o.id} onClick={() => { setSelId(o.id); setStudioNote(o.studioNote || ''); setQuoteTotal(o.approvedTotal || ''); }}
                    style={{
                      padding:'12px 14px', cursor:'pointer', borderBottom:`1px solid ${bLine}`,
                      background: isActive ? 'rgba(201,100,66,0.08)' : 'transparent',
                      borderLeft:`3px solid ${isActive ? bAccent : 'transparent'}`,
                    }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                      <span style={{ ...bStyles.mono, fontSize:10, color:bAccent, fontWeight:700 }}>{o.id}</span>
                      <span style={{ ...bStyles.pill, background:sc.bg, color:sc.fg, fontSize:9, textTransform:'uppercase' }}>{o.status}</span>
                    </div>
                    <div style={{ fontSize:12, color:'#fff', fontWeight:600, marginBottom:2 }}>{o.customerName}</div>
                    <div style={{ fontSize:11, color:bMute }}>{o.room?.layout} · {o.finish}</div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontSize:10, color:bMute }}>
                      <span style={bStyles.mono}>{fmt(o.total)}</span>
                      <span>{fmtDate(o.ts)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CENTER — order detail */}
          <div style={{ background:bBg, display:'flex', flexDirection:'column', minHeight:0 }}>
            {!sel ? (
              <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
                <div style={{ fontSize:40, opacity:0.15 }}>↖</div>
                <div style={{ fontSize:13, color:bMute }}>Select an order to review</div>
              </div>
            ) : (
              <>
                <div style={{ padding:'14px 20px', borderBottom:`1px solid ${bLine}`, ...bStyles.mono, fontSize:10, color:bMute, display:'flex', gap:20 }}>
                  <span>Room {sel.room?.W}×{sel.room?.D}×{sel.room?.H} mm</span>
                  <span>Layout: {sel.room?.layout}</span>
                  <span>Finish: {sel.finish}</span>
                  <span>Hardware: {sel.hardware}</span>
                  <span>Received: {fmtDate(sel.ts)} {fmtTime(sel.ts)}</span>
                </div>
                <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', fontWeight:700, marginBottom:10 }}>Customer</div>
                    <div style={{ ...bStyles.card, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                      {[['Name', sel.customerName], ['Phone', sel.customerPhone || '—'], ['Notes', sel.notes || '—']].map(([k,v]) => (
                        <div key={k} style={{ gridColumn: k === 'Notes' ? '1/-1' : 'auto' }}>
                          <div style={{ fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', color:bMute, fontWeight:700 }}>{k}</div>
                          <div style={{ fontSize:12, color:'#fff', marginTop:3 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', fontWeight:700, marginBottom:10 }}>Bill of materials</div>
                    <div style={bStyles.card}>
                      {(sel.bom || []).map((b,i) => (
                        <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderTop:i?`1px solid ${bLine}`:'none', fontSize:12 }}>
                          <div>
                            <span style={{ color:'#fff', fontWeight:500 }}>{b.category}</span>
                            <span style={{ color:bMute, marginLeft:8, fontSize:10 }}>×{b.qty} {b.unit}</span>
                          </div>
                          <span style={{ ...bStyles.mono, color:bMute }}>{fmt(b.amount)}</span>
                        </div>
                      ))}
                      <div style={{ paddingTop:10, marginTop:6, borderTop:`1px solid ${bLine}` }}>
                        {[['Subtotal',sel.subtotal],['Studio margin',sel.markup],['GST',sel.gst]].map(([l,v]) => (
                          <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:bMute, marginBottom:3 }}>
                            <span>{l}</span><span style={bStyles.mono}>{fmt(v)}</span>
                          </div>
                        ))}
                        <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, paddingTop:6, borderTop:`1px solid ${bLine}`, fontSize:13, fontWeight:700, color:'#fff' }}>
                          <span>Customer total</span><span style={bStyles.mono}>{fmt(sel.total)}</span>
                        </div>
                        {sel.approvedTotal && sel.approvedTotal !== sel.total && (
                          <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontSize:12, color:'#4cba85' }}>
                            <span>Approved quote</span><span style={bStyles.mono}>{fmt(sel.approvedTotal)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {sel.jobId && (
                    <div style={{ ...bStyles.card, borderColor:'rgba(124,92,255,0.3)', borderWidth:1, borderStyle:'solid' }}>
                      <div style={{ fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:'#7c5cff', fontWeight:700, marginBottom:6 }}>Factory job created</div>
                      <div style={{ ...bStyles.mono, fontSize:12, color:'#fff' }}>{sel.jobId}</div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* RIGHT — actions + quote builder */}
          <div style={{ background:'#191613', borderLeft:`1px solid ${bLine}`, padding:'16px', display:'flex', flexDirection:'column', gap:14, overflow:'hidden' }}>
            {!sel ? (
              <div style={{ fontSize:12, color:bMute, marginTop:8 }}>Select an order to see actions.</div>
            ) : (
              <>
                <div>
                  <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', fontWeight:700, marginBottom:8 }}>Status</div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {pill(sel.status)}
                    <span style={{ fontSize:11, color:bMute }}>· {fmtDate(sel.ts)}</span>
                  </div>
                </div>

                <div style={bStyles.card}>
                  <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', fontWeight:700, marginBottom:10 }}>Quote builder</div>
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:9, color:bMute, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>Final quote total</div>
                    <input type="number" value={quoteTotal} onChange={e => setQuoteTotal(e.target.value)}
                      placeholder={String(sel.total)} style={{
                        width:'100%', padding:'8px 10px', background:'rgba(255,255,255,0.05)',
                        border:`1px solid ${bLine}`, borderRadius:6, color:'#fff', fontSize:12,
                        fontFamily:'JetBrains Mono,monospace', outline:'none', boxSizing:'border-box',
                      }} />
                    <div style={{ fontSize:10, color:bMute, marginTop:4 }}>
                      System estimate: {fmt(sel.total)}
                    </div>
                  </div>
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:9, color:bMute, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>Studio note to factory</div>
                    <textarea value={studioNote} onChange={e => setStudioNote(e.target.value)} rows={3} style={{
                      width:'100%', padding:'8px 10px', background:'rgba(255,255,255,0.05)',
                      border:`1px solid ${bLine}`, borderRadius:6, color:'#fff', fontSize:11,
                      fontFamily:'"Inter Tight",sans-serif', outline:'none', resize:'vertical', boxSizing:'border-box',
                    }} placeholder="Special instructions for production…" />
                  </div>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {sel.status === 'new' && (
                    <button onClick={() => advance(sel.id, 'reviewing')} style={{ padding:'10px', borderRadius:8, fontSize:12, fontWeight:600, border:`1px solid ${bLine}`, color:'#fff', background:'rgba(255,255,255,0.06)', cursor:'pointer' }}>
                      Mark as Reviewing
                    </button>
                  )}
                  {(sel.status === 'new' || sel.status === 'reviewing') && (
                    <>
                      <button onClick={approveOrder} style={{ padding:'10px', borderRadius:8, fontSize:12, fontWeight:600, border:'none', color:'#fff', background:'#4cba85', cursor:'pointer' }}>
                        ✓ Approve & send to factory
                      </button>
                      <button onClick={() => advance(sel.id, 'rejected')} style={{ padding:'10px', borderRadius:8, fontSize:12, fontWeight:600, border:`1px solid rgba(255,80,80,0.3)`, color:'#ff6060', background:'rgba(255,80,80,0.06)', cursor:'pointer' }}>
                        ✕ Reject order
                      </button>
                    </>
                  )}
                  {sel.status === 'approved' && (
                    <button onClick={() => advance(sel.id, 'in-fab')} style={{ padding:'10px', borderRadius:8, fontSize:12, fontWeight:600, border:'none', color:'#fff', background:'#7c5cff', cursor:'pointer' }}>
                      Mark In Fabrication
                    </button>
                  )}
                  {sel.status === 'in-fab' && (
                    <button onClick={() => advance(sel.id, 'delivered')} style={{ padding:'10px', borderRadius:8, fontSize:12, fontWeight:600, border:'none', color:'#fff', background:'#4cba85', cursor:'pointer' }}>
                      Mark Delivered
                    </button>
                  )}
                </div>

                {orders.filter(o => o.status !== 'rejected' && o.status !== 'delivered').length > 0 && (
                  <div style={bStyles.card}>
                    <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', fontWeight:700, marginBottom:8 }}>Pipeline summary</div>
                    {[['New', 'new', '#5b8def'], ['Reviewing', 'reviewing', '#d9a049'], ['Approved', 'approved', '#4cba85'], ['In Fab', 'in-fab', '#7c5cff']].map(([l, s, c]) => {
                      const count = orders.filter(o => o.status === s).length;
                      return count > 0 ? (
                        <div key={s} style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.75)', marginBottom:4 }}>
                          <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                            <span style={{ width:6, height:6, borderRadius:'50%', background:c }}></span>{l}
                          </span>
                          <span style={{ ...bStyles.mono, color:c, fontWeight:700 }}>{count}</span>
                        </div>
                      ) : null;
                    })}
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

Object.assign(window, { PlannerBackend, KitchenPlanCAD, KreoStore });
