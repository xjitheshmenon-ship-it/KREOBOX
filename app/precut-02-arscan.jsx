// Precut 02 — Scan-to-Cut (mobile AR)
// Future-leaning mobile flow: phone scans the wall, Kreobox detects
// dimensions, returns a precut laminate panel manifest. Top half is a
// "live" AR viewport (faux camera feed + scanned mesh wireframe + corner
// brackets). Bottom is a sheet that's been dragged up showing the
// resulting panels and a one-tap CTA.

function PrecutArScan() {
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: '#0e0d0b', color: '#f0eee9',
      fontFamily: '"Inter Tight", sans-serif', overflow: 'hidden',
      borderRadius: 12,
    }}>
      {/* Faux camera image — soft warm wall */}
      <div style={{ position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 30%, #5a4a3a 0%, #2a2620 60%, #0e0d0b 100%)' }}/>
      {/* Scan grid overlay */}
      <ScanMesh />
      {/* Corner brackets — detected wall */}
      <Brackets />

      {/* Status bar */}
      <div style={{ position:'absolute', top: 0, left: 0, right: 0,
        padding: '14px 18px 8px', display: 'flex', justifyContent: 'space-between',
        fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(255,255,255,0.85)',
        zIndex: 5 }}>
        <span>9:41</span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>5G</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <span style={{ width: 18, height: 9, border: '1px solid #fff', borderRadius: 2, position: 'relative' }}>
              <span style={{ position: 'absolute', inset: 1, background: '#fff', borderRadius: 1, width: '70%' }}/>
            </span>
          </span>
        </span>
      </div>

      {/* Top chrome */}
      <div style={{ position: 'absolute', top: 48, left: 16, right: 16,
        display:'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
        <button style={{
          width: 36, height: 36, borderRadius: 18, border: 'none',
          background:'rgba(255,255,255,0.14)', color:'#fff', backdropFilter:'blur(20px)',
          fontSize: 18, cursor:'pointer',
        }}>×</button>
        <div style={{
          padding:'7px 14px', borderRadius: 999, background:'rgba(255,255,255,0.14)',
          backdropFilter:'blur(20px)', fontSize: 12, fontWeight: 600, display:'flex', alignItems:'center', gap: 8,
        }}>
          <span style={{ width: 7, height: 7, borderRadius:'50%', background:'var(--accent)',
            boxShadow:'0 0 0 4px rgba(201,100,66,0.25)', animation: 'pulse 1.4s infinite' }}/>
          Scanning · LiDAR
        </div>
        <button style={{
          width: 36, height: 36, borderRadius: 18, border: 'none',
          background:'rgba(255,255,255,0.14)', color:'#fff', backdropFilter:'blur(20px)',
          fontSize: 14, cursor:'pointer', fontWeight: 700,
        }}>?</button>
      </div>

      {/* Live measurements floating */}
      <FloatMeasure top="36%" left="22%" value="2.84 m" axis="W" />
      <FloatMeasure top="56%" left="78%" value="2.40 m" axis="H" />
      <FloatMeasure top="68%" left="50%" value="6.82 m²" highlight />

      {/* Bottom sheet — pulled up */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background:'#fafaf7', color:'var(--ink)',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        boxShadow:'0 -20px 60px rgba(0,0,0,0.4)',
        padding: '12px 22px 24px',
        height: '52%', display:'flex', flexDirection:'column',
      }}>
        {/* drag handle */}
        <div style={{ width: 40, height: 4, borderRadius: 4, background:'rgba(26,24,21,0.18)', margin:'0 auto 14px' }}/>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--ink-soft)', fontWeight: 600 }}>
              Scan complete · TV wall
            </div>
            <div style={{ fontFamily:'Fraunces', fontSize: 26, letterSpacing:'-0.015em', marginTop: 4, lineHeight: 1.05 }}>
              4 panels, precut.
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize: 10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--ink-soft)', fontWeight: 600 }}>
              Total
            </div>
            <div style={{ fontFamily:'Fraunces', fontSize: 22, marginTop: 4 }}>₹ 8,420</div>
          </div>
        </div>

        {/* finish chip row */}
        <div style={{ display:'flex', gap: 8, marginTop: 14, overflow:'hidden' }}>
          {[
            { c:'#d8c8af', n:'Bali Oak', sel:true },
            { c:'#3a3530', n:'Charcoal' },
            { c:'#e9e3d6', n:'Linen' },
            { c:'#7a5a40', n:'Walnut' },
            { c:'#2c4538', n:'Forest' },
          ].map((s,i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap: 6, padding:'6px 10px 6px 6px',
              background: s.sel ? 'var(--ink)' : 'rgba(26,24,21,0.05)',
              color: s.sel ? '#fafaf7' : 'var(--ink)',
              borderRadius: 999, fontSize: 11, fontWeight: 600, flexShrink: 0,
            }}>
              <span style={{ width: 16, height: 16, borderRadius:'50%', background: s.c, border:'1px solid rgba(0,0,0,0.1)' }}/>
              {s.n}
            </div>
          ))}
        </div>

        {/* panel rows */}
        <div style={{ marginTop: 16, flex: 1, overflow:'auto' }}>
          {[
            { id:'A', name:'Top spanner',  dim:'2840 × 600', edge:'Mitred', price:'₹ 2,840' },
            { id:'B', name:'Left column',  dim:'1800 × 420', edge:'ABS 1mm', price:'₹ 1,920' },
            { id:'C', name:'Right column', dim:'1800 × 420', edge:'ABS 1mm', price:'₹ 1,920' },
            { id:'D', name:'TV niche back',dim:'1200 × 720', edge:'Painted', price:'₹ 1,740' },
          ].map((p,i) => (
            <div key={p.id} style={{
              display:'flex', alignItems:'center', gap: 12, padding:'10px 0',
              borderTop: i ? '1px solid var(--line)' : 'none',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 8,
                background:'linear-gradient(135deg,#d8c8af,#b8a07a)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'Fraunces', fontSize: 15, fontWeight: 500,
              }}>{p.id}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontFamily:'JetBrains Mono', fontSize: 11, color:'var(--ink-soft)', marginTop: 2 }}>
                  {p.dim} mm · {p.edge}
                </div>
              </div>
              <div style={{ fontFamily:'Fraunces', fontSize: 14 }}>{p.price}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button style={{
          marginTop: 12, padding: '14px', borderRadius: 12, border: 'none',
          background: 'var(--accent)', color: '#fff',
          fontSize: 14, fontWeight: 700, fontFamily:'inherit', cursor:'pointer',
          display:'flex', justifyContent:'space-between', alignItems:'center',
        }}>
          <span>Cut & deliver Tue, Jun 24</span>
          <span style={{ fontFamily:'JetBrains Mono', fontSize: 12, opacity: 0.8 }}>→</span>
        </button>
      </div>

      {/* Home indicator */}
      <div style={{ position:'absolute', bottom: 6, left:'50%', transform:'translateX(-50%)',
        width: 110, height: 4, background:'rgba(26,24,21,0.4)', borderRadius: 2, zIndex: 10 }}/>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(201,100,66,0.25); }
          50% { box-shadow: 0 0 0 8px rgba(201,100,66,0.05); }
        }
      `}</style>
    </div>
  );
}

function ScanMesh() {
  // Wireframe mesh suggesting LiDAR scan of a wall
  return (
    <svg width="100%" height="60%" style={{ position:'absolute', top: '8%', left: 0, right: 0, opacity: 0.55 }}>
      <defs>
        <linearGradient id="meshFade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c96442" stopOpacity="0.5" />
          <stop offset="1" stopColor="#c96442" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* horizontal grid */}
      {Array.from({length: 11}).map((_,i) => (
        <line key={'h'+i} x1="6%" x2="94%" y1={`${10 + i*8}%`} y2={`${10 + i*8}%`}
          stroke="url(#meshFade)" strokeWidth="0.6"/>
      ))}
      {/* vertical grid */}
      {Array.from({length: 14}).map((_,i) => (
        <line key={'v'+i} x1={`${6 + i*7}%`} x2={`${6 + i*7}%`} y1="10%" y2="90%"
          stroke="url(#meshFade)" strokeWidth="0.6"/>
      ))}
      {/* highlighted plane outline */}
      <rect x="8%" y="14%" width="84%" height="72%" fill="rgba(201,100,66,0.06)"
        stroke="#c96442" strokeWidth="1.5" strokeDasharray="6 4"/>
    </svg>
  );
}
function Brackets() {
  // 4 corner L-brackets at the detected wall corners
  const corners = [
    { x: '7%',  y: '14%', r: 0 },
    { x: '93%', y: '14%', r: 90 },
    { x: '93%', y: '86%', r: 180 },
    { x: '7%',  y: '86%', r: 270 },
  ];
  return <>
    {corners.map((c,i)=>(
      <svg key={i} width="32" height="32" viewBox="0 0 32 32" style={{
        position:'absolute', left: c.x, top: c.y, transform:`translate(-50%,-50%) rotate(${c.r}deg)`,
      }}>
        <path d="M2 12 V2 H12" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>
    ))}
  </>;
}
function FloatMeasure({ top, left, value, axis, highlight }) {
  return (
    <div style={{
      position:'absolute', top, left, transform:'translate(-50%,-50%)',
      padding: highlight ? '8px 14px' : '5px 10px', borderRadius: 999,
      background: highlight ? 'var(--accent)' : 'rgba(0,0,0,0.6)',
      color:'#fff', fontFamily:'JetBrains Mono', fontSize: highlight ? 13 : 11, fontWeight: 600,
      backdropFilter:'blur(8px)', boxShadow: highlight ? '0 8px 22px rgba(201,100,66,0.5)' : '0 4px 14px rgba(0,0,0,0.3)',
      display:'flex', alignItems:'center', gap: 6,
    }}>
      {axis && <span style={{ opacity: 0.6 }}>{axis}</span>}
      {value}
    </div>
  );
}

window.PrecutArScan = PrecutArScan;
