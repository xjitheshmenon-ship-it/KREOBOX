// Precut 01 — Sheet Configurator
// Forward-looking parametric cut planner. Left: parts table (BOM-style).
// Center: a 8x4 ft laminate sheet with computer-nested rectangular cuts,
// kerf gaps, sienna accent on selected piece. Right: AI suggestions and
// quote breakdown. Tone: software-for-makers, calm, premium.

function PrecutConfigurator() {
  // Nested rectangles on a 1220x2440 mm sheet (8x4 ft)
  // Coordinates already in % of the sheet for easy SVG render.
  const parts = [
    { id: 'P-01', name: 'Wardrobe shutter L',  w: 1980, h: 580, qty: 2, finish: 'Bali Oak', x:  2, y:  2, ww: 81, hh: 24, sel: false },
    { id: 'P-02', name: 'Wardrobe shutter R',  w: 1980, h: 580, qty: 2, finish: 'Bali Oak', x:  2, y: 27, ww: 81, hh: 24, sel: true  },
    { id: 'P-03', name: 'Drawer front',        w: 1180, h: 280, qty: 4, finish: 'Bali Oak', x:  2, y: 52, ww: 48, hh: 11, sel: false },
    { id: 'P-04', name: 'Drawer front',        w: 1180, h: 280, qty: 4, finish: 'Bali Oak', x: 51, y: 52, ww: 48, hh: 11, sel: false },
    { id: 'P-05', name: 'Side panel',          w:  620, h: 480, qty: 2, finish: 'Bali Oak', x:  2, y: 64, ww: 25, hh: 19, sel: false },
    { id: 'P-06', name: 'Top trim',            w:  980, h: 120, qty: 1, finish: 'Bali Oak', x: 28, y: 64, ww: 40, hh:  5, sel: false },
    { id: 'P-07', name: 'Filler strip',        w:  980, h: 120, qty: 2, finish: 'Bali Oak', x: 28, y: 70, ww: 40, hh:  5, sel: false },
    { id: 'P-08', name: 'Toe-kick',            w:  980, h: 120, qty: 1, finish: 'Bali Oak', x: 28, y: 76, ww: 40, hh:  5, sel: false },
    { id: 'P-09', name: 'Plinth strip',        w:  580, h: 120, qty: 4, finish: 'Bali Oak', x: 70, y: 64, ww: 24, hh:  5, sel: false },
    { id: 'P-10', name: 'Plinth strip',        w:  580, h: 120, qty: 4, finish: 'Bali Oak', x: 70, y: 70, ww: 24, hh:  5, sel: false },
    { id: 'P-11', name: 'Edge banding strip',  w:  580, h: 120, qty: 6, finish: 'Bali Oak', x: 70, y: 76, ww: 24, hh:  5, sel: false },
    { id: 'P-12', name: 'Offcut · stocked',    w:  240, h: 320, qty: 1, finish: 'Offcut',   x: 84, y: 82, ww: 14, hh: 16, sel: false, scrap: true },
  ];

  return (
    <div style={{
      width:'100%', height:'100%', background:'var(--paper)', display:'grid',
      gridTemplateColumns: '320px 1fr 320px', gridTemplateRows: '56px 1fr',
      color:'var(--ink)', fontSize: 13,
    }}>
      {/* TOPBAR */}
      <div style={{ gridColumn:'1 / -1', display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 24px', borderBottom:'1px solid var(--line)', background:'#fff' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 16 }}>
          <KreoMark />
          <div style={{ fontFamily:'JetBrains Mono', fontSize: 11, color:'var(--ink-soft)', letterSpacing:'0.04em' }}>
            kbx://orders/WHF-3142/precut/<span style={{ color:'var(--accent)' }}>nest-04</span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <Pill tone="good">Auto-nested · 91% yield</Pill>
          <Btn ghost>Export DXF</Btn>
          <Btn>Send to factory →</Btn>
        </div>
      </div>

      {/* LEFT — parts list */}
      <div style={{ borderRight:'1px solid var(--line)', overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'18px 20px 12px' }}>
          <Eyebrow>Cut list · 12 parts</Eyebrow>
          <Title size={22}>Whitefield · Wardrobe</Title>
          <div style={{ fontSize:12, color:'var(--ink-soft)', marginTop: 4 }}>1× sheet · Bali Oak 0.8mm · matte</div>
        </div>
        <div style={{ padding:'4px 12px 4px', display:'grid', gridTemplateColumns:'auto 1fr 50px', fontSize:10,
          letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--ink-soft)', fontWeight:600,
          borderBottom:'1px solid var(--line)', paddingBottom: 8, paddingTop: 8 }}>
          <span style={{ paddingLeft: 8 }}>ID</span><span>Part · dimensions</span><span style={{ textAlign:'right' }}>Qty</span>
        </div>
        <div style={{ flex:1, overflow:'auto' }}>
          {parts.map(p => (
            <div key={p.id} style={{
              display:'grid', gridTemplateColumns:'auto 1fr 50px', gap: 8, padding:'10px 12px',
              borderBottom:'1px solid var(--line)', alignItems:'center',
              background: p.sel ? 'rgba(201,100,66,0.08)' : 'transparent',
              borderLeft: p.sel ? '2px solid var(--accent)' : '2px solid transparent',
            }}>
              <span style={{ fontFamily:'JetBrains Mono', fontSize: 11, color: p.scrap ? 'var(--ink-soft)' : 'var(--ink)', paddingLeft: 6 }}>{p.id}</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: p.scrap ? 'var(--ink-soft)' : 'var(--ink)' }}>
                  {p.name}
                </div>
                <div style={{ fontFamily:'JetBrains Mono', fontSize: 10.5, color:'var(--ink-soft)', marginTop: 2 }}>
                  {p.w} × {p.h} mm
                </div>
              </div>
              <span style={{ textAlign:'right', fontFamily:'JetBrains Mono', fontSize: 12,
                color: p.scrap ? 'var(--ink-soft)' : 'var(--ink)' }}>{p.scrap ? '—' : `×${p.qty}`}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER — sheet preview */}
      <div style={{ background:'#ebe8e2', position:'relative', overflow:'hidden',
        backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)',
        backgroundSize: '14px 14px',
        display:'flex', flexDirection:'column' }}>
        {/* tools strip */}
        <div style={{ padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', gap: 8 }}>
            <ToolBtn active>Auto-nest</ToolBtn>
            <ToolBtn>Manual</ToolBtn>
            <ToolBtn>Grain ↕</ToolBtn>
            <ToolBtn>Kerf 3.2 mm</ToolBtn>
          </div>
          <div style={{ fontFamily:'JetBrains Mono', fontSize: 11, color:'var(--ink-soft)' }}>
            Sheet 2440 × 1220 mm · 8 × 4 ft
          </div>
        </div>

        {/* sheet canvas */}
        <div style={{ flex:1, padding:'8px 32px 32px', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{
            width:'100%', aspectRatio:'2440 / 1220', position:'relative',
            background:'linear-gradient(135deg, #d8c8af 0%, #c0a988 100%)',
            borderRadius: 4, boxShadow:'0 30px 60px -20px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(0,0,0,0.06)',
            overflow:'hidden',
          }}>
            {/* wood grain stripes */}
            <div style={{ position:'absolute', inset: 0, backgroundImage:
              'repeating-linear-gradient(90deg, rgba(80,55,30,0.10) 0 2px, transparent 2px 11px),'+
              'repeating-linear-gradient(90deg, rgba(80,55,30,0.05) 0 1px, transparent 1px 4px)',
              opacity: 0.7 }}/>
            {/* parts */}
            {parts.map(p => (
              <div key={p.id} style={{
                position:'absolute', left: `${p.x}%`, top: `${p.y}%`, width: `${p.ww}%`, height: `${p.hh}%`,
                border: p.sel ? '2px solid var(--accent)' : (p.scrap ? '1px dashed rgba(26,24,21,0.4)' : '1px solid rgba(26,24,21,0.5)'),
                background: p.sel ? 'rgba(201,100,66,0.18)' : (p.scrap ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'),
                borderRadius: 2, display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow: p.sel ? '0 4px 14px rgba(201,100,66,0.35)' : 'none',
              }}>
                <span style={{ fontFamily:'JetBrains Mono', fontSize: 9, fontWeight: 600,
                  color: p.sel ? 'var(--accent)' : (p.scrap ? 'rgba(26,24,21,0.5)' : 'rgba(26,24,21,0.7)'),
                  letterSpacing:'0.04em' }}>
                  {p.scrap ? 'OFFCUT' : p.id}
                </span>
              </div>
            ))}
            {/* dim labels */}
            <div style={{ position:'absolute', top:-22, left:'50%', transform:'translateX(-50%)',
              fontFamily:'JetBrains Mono', fontSize: 10, color:'var(--ink-soft)' }}>2440 mm →</div>
            <div style={{ position:'absolute', left:-30, top:'50%', transform:'translateY(-50%) rotate(-90deg)',
              fontFamily:'JetBrains Mono', fontSize: 10, color:'var(--ink-soft)' }}>1220 mm →</div>
          </div>
        </div>
      </div>

      {/* RIGHT — AI + quote */}
      <div style={{ borderLeft:'1px solid var(--line)', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'18px 20px 14px', borderBottom:'1px solid var(--line)' }}>
          <Eyebrow>Selected · P-02</Eyebrow>
          <div style={{ fontFamily:'Fraunces', fontSize: 22, letterSpacing:'-0.01em', marginTop: 4 }}>
            Wardrobe shutter R
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginTop: 14 }}>
            <Cell label="Width" value="1980 mm" />
            <Cell label="Height" value="580 mm" />
            <Cell label="Edge" value="ABS 1mm · all" />
            <Cell label="Grain" value="Vertical" />
          </div>
        </div>

        <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--line)' }}>
          <Eyebrow>Kreo AI · suggestions</Eyebrow>
          <div style={{ display:'flex', flexDirection:'column', gap: 10, marginTop: 10 }}>
            <Suggest icon="↻" tag="Yield" body="Rotating P-09 saves 4.8% of sheet. Apply?" />
            <Suggest icon="✶" tag="Pair" body="P-12 offcut fits a 240×320 drawer base in your library." />
            <Suggest icon="!"  tag="Grain" body="P-04 grain runs against P-03. Align both vertical?" />
          </div>
        </div>

        <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--line)' }}>
          <Eyebrow>Quote</Eyebrow>
          <Row k="Sheet · Bali Oak 0.8" v="₹ 4,820" />
          <Row k="CNC cuts · 38 m" v="₹ 1,140" />
          <Row k="Edge banding · 16 m" v="₹    640" />
          <Row k="Drilling · 86 holes" v="₹    430" />
          <div style={{ borderTop:'1px solid var(--line)', marginTop: 8, paddingTop: 10,
            display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
            <span style={{ fontSize: 11, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--ink-soft)', fontWeight:600 }}>
              Total
            </span>
            <span style={{ fontFamily:'Fraunces', fontSize: 28, letterSpacing:'-0.015em' }}>₹ 7,030</span>
          </div>
        </div>

        <div style={{ flex:1 }}/>

        <div style={{ padding:'14px 20px', display:'flex', flexDirection:'column', gap: 8 }}>
          <Btn full>Cut & ship — 3 days</Btn>
          <Btn ghost full>Save to project</Btn>
        </div>
      </div>
    </div>
  );
}

// ── primitives (scoped) ─────────────────────────────────────
function KreoMark() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
      <svg width="20" height="20" viewBox="0 0 100 100">
        <path fillRule="evenodd" clipRule="evenodd"
          d="M16 28 H84 V84 Q84 90 78 90 H22 Q16 90 16 84 Z M30 42 V76 H70 V42 Z"
          fill="var(--accent)" />
        <rect x="20" y="10" width="68" height="14" rx="3" transform="rotate(-8 54 17)" fill="var(--accent)" fillOpacity="0.7" />
      </svg>
      <span style={{ fontFamily:'Fraunces', fontSize: 14, fontWeight: 500, letterSpacing:'0.1em' }}>KREOBOX</span>
      <span style={{ fontSize: 11, color:'var(--ink-soft)', borderLeft:'1px solid var(--line)', paddingLeft: 12, marginLeft: 4 }}>Precut</span>
    </div>
  );
}
function Eyebrow({ children }) {
  return <div style={{ fontSize: 10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--ink-soft)', fontWeight: 600 }}>{children}</div>;
}
function Title({ children, size = 24 }) {
  return <div style={{ fontFamily:'Fraunces', fontSize: size, letterSpacing:'-0.015em', marginTop: 4 }}>{children}</div>;
}
function Pill({ tone, children }) {
  const map = { good: { bg:'rgba(31,138,91,0.12)', fg:'#1f8a5b' } };
  const t = map[tone] || { bg:'rgba(26,24,21,0.06)', fg:'var(--ink-soft)' };
  return <span style={{ background:t.bg, color:t.fg, fontSize: 11, fontWeight: 600, padding:'5px 10px', borderRadius: 999,
    display:'inline-flex', alignItems:'center', gap: 6 }}>
    <span style={{ width: 6, height: 6, borderRadius:'50%', background: t.fg }}/> {children}
  </span>;
}
function Btn({ children, ghost, full }) {
  return <button style={{
    background: ghost ? 'transparent' : 'var(--ink)',
    color: ghost ? 'var(--ink)' : '#fafaf7',
    border: ghost ? '1px solid var(--line)' : 'none',
    padding:'9px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600,
    fontFamily:'inherit', cursor:'pointer', width: full ? '100%' : 'auto',
  }}>{children}</button>;
}
function ToolBtn({ children, active }) {
  return <button style={{
    background: active ? 'var(--ink)' : 'rgba(255,255,255,0.7)',
    color: active ? '#fafaf7' : 'var(--ink)',
    border: active ? 'none' : '1px solid var(--line)',
    padding:'7px 11px', borderRadius: 6, fontSize: 12, fontWeight: 500, fontFamily:'inherit', cursor:'pointer',
  }}>{children}</button>;
}
function Cell({ label, value }) {
  return <div>
    <div style={{ fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-soft)', fontWeight: 600 }}>{label}</div>
    <div style={{ fontFamily:'JetBrains Mono', fontSize: 12.5, marginTop: 4 }}>{value}</div>
  </div>;
}
function Suggest({ icon, tag, body }) {
  return <div style={{ display:'flex', gap: 10, padding:'10px', background:'rgba(26,24,21,0.03)', borderRadius: 8 }}>
    <div style={{ width: 22, height: 22, borderRadius: 6, background:'var(--accent)', color:'#fff',
      display:'flex', alignItems:'center', justifyContent:'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--accent)', fontWeight: 700 }}>{tag}</div>
      <div style={{ fontSize: 12, marginTop: 3, lineHeight: 1.4 }}>{body}</div>
    </div>
  </div>;
}
function Row({ k, v }) {
  return <div style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', fontSize: 12.5 }}>
    <span style={{ color:'var(--ink-soft)' }}>{k}</span>
    <span style={{ fontFamily:'JetBrains Mono' }}>{v}</span>
  </div>;
}

window.PrecutConfigurator = PrecutConfigurator;
