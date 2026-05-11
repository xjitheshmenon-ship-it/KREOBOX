// Precut 03 — Laminate Drop
// Treats laminate releases like a fashion capsule. Editorial hero,
// a countdown to release, large product tiles with grain swatches,
// and a "reserve precut" mechanism. Tone: premium, gallery, slow.

function PrecutDrop() {
  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--bg)',
      color: 'var(--ink)', overflow: 'hidden', position: 'relative',
      display:'flex', flexDirection:'column',
    }}>
      {/* NAV */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'20px 48px', borderBottom:'1px solid var(--line)' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
          <span style={{ fontFamily:'Fraunces', fontWeight: 500, letterSpacing:'0.18em', fontSize: 14 }}>KREOBOX</span>
          <span style={{ fontSize: 11, color:'var(--ink-soft)', borderLeft:'1px solid var(--line)', paddingLeft: 14, letterSpacing:'0.16em', textTransform:'uppercase', fontWeight: 600 }}>
            Drops · 02
          </span>
        </div>
        <div style={{ display:'flex', gap: 28, fontSize: 12.5, fontWeight: 500 }}>
          <span>Library</span><span>Precut</span><span style={{ color:'var(--accent)' }}>Drops</span><span>Studio</span><span>Account</span>
        </div>
        <div style={{ fontFamily:'JetBrains Mono', fontSize: 11, color:'var(--ink-soft)' }}>
          Releases Fri 03:00 IST
        </div>
      </div>

      {/* HERO */}
      <div style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', borderBottom:'1px solid var(--line)' }}>
        <div style={{ padding:'56px 56px 48px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 22 }}>
              <span style={{ width: 8, height: 8, borderRadius:'50%', background:'var(--accent)' }}/>
              <span style={{ fontSize: 11, letterSpacing:'0.22em', textTransform:'uppercase', fontWeight: 600 }}>Drop 02 · Quiet Earth</span>
            </div>
            <h1 style={{
              fontFamily:'Fraunces', fontWeight: 300, fontSize: 96, lineHeight: 0.92,
              letterSpacing:'-0.035em', margin: 0,
            }}>
              Six laminates,<br/>
              <em style={{ fontFamily:'"Instrument Serif", "Fraunces"', fontStyle:'italic', fontWeight: 400 }}>cut to fit.</em>
            </h1>
            <div style={{ marginTop: 24, fontSize: 15, lineHeight: 1.55, color:'var(--ink-soft)', maxWidth: 460 }}>
              A capsule from the Kreobox studio — six finishes, milled in Mysuru,
              precut to your room before they leave the shop floor.
              Reserve by Friday; arrives the week after.
            </div>
          </div>

          {/* countdown */}
          <div style={{ display:'flex', alignItems:'flex-end', gap: 24, marginTop: 32 }}>
            {[
              { n: '02', l: 'days' },
              { n: '14', l: 'hours' },
              { n: '38', l: 'minutes' },
              { n: '12', l: 'seconds' },
            ].map((t,i) => (
              <div key={i} style={{ display:'flex', alignItems:'baseline', gap: 6 }}>
                <span style={{ fontFamily:'Fraunces', fontSize: 56, fontWeight: 300, letterSpacing:'-0.03em', lineHeight: 1 }}>{t.n}</span>
                <span style={{ fontSize: 11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--ink-soft)', fontWeight: 600 }}>{t.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* hero swatch — vertical grain bands */}
        <div style={{ position:'relative', minHeight: 480, background:'#0e0d0b', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset: 0, display:'grid', gridTemplateColumns:'repeat(6, 1fr)' }}>
            {['#d8c8af','#a48867','#6e5840','#3e342a','#8a7a64','#221c16'].map((c,i)=>(
              <div key={i} style={{
                background: c,
                backgroundImage:'repeating-linear-gradient(180deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 5px),'+
                                 'repeating-linear-gradient(180deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 14px)',
              }}/>
            ))}
          </div>
          {/* film numbers */}
          <div style={{ position:'absolute', top: 24, left: 24, fontFamily:'JetBrains Mono', fontSize: 10,
            letterSpacing:'0.16em', color:'rgba(255,255,255,0.65)', fontWeight: 500 }}>
            QE/01 · QE/02 · QE/03 · QE/04 · QE/05 · QE/06
          </div>
          <div style={{ position:'absolute', bottom: 24, right: 24, fontFamily:'Fraunces', fontStyle:'italic', fontSize: 16, color:'#fff', opacity: 0.85 }}>
            Mysuru · 2026
          </div>
        </div>
      </div>

      {/* GRID OF DROPS */}
      <div style={{ flex: 1, padding:'40px 48px', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 24 }}>
        {[
          { code:'QE/01', name:'Bali Oak',     swatch:'#d8c8af', tag:'Limited · 240 sheets', stock: 0.74 },
          { code:'QE/02', name:'Sienna Burl',  swatch:'#a48867', tag:'Limited · 180 sheets', stock: 0.42, hot: true },
          { code:'QE/03', name:'Walnut Smoke', swatch:'#6e5840', tag:'Limited · 200 sheets', stock: 0.61 },
          { code:'QE/04', name:'Charcoal Linen', swatch:'#3e342a', tag:'Limited · 150 sheets', stock: 0.30, hot: true },
          { code:'QE/05', name:'Sand Reed',    swatch:'#8a7a64', tag:'Limited · 220 sheets', stock: 0.88 },
          { code:'QE/06', name:'Obsidian Stone', swatch:'#221c16', tag:'Limited · 100 sheets', stock: 0.18, hot: true },
        ].map(p => (
          <div key={p.code} style={{
            background:'var(--paper)', border:'1px solid var(--line)', borderRadius: 14,
            overflow:'hidden', display:'flex', flexDirection:'column',
          }}>
            <div style={{
              height: 220, background: p.swatch, position:'relative',
              backgroundImage:'repeating-linear-gradient(180deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 6px),'+
                               'repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 16px)',
            }}>
              {p.hot && (
                <div style={{ position:'absolute', top: 14, right: 14, padding:'4px 10px',
                  background:'var(--accent)', color:'#fff', fontSize: 10, fontWeight: 700,
                  letterSpacing:'0.16em', textTransform:'uppercase', borderRadius: 999 }}>
                  Selling fast
                </div>
              )}
              <div style={{ position:'absolute', bottom: 14, left: 14, fontFamily:'JetBrains Mono',
                fontSize: 10, letterSpacing:'0.14em', color:'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                {p.code}
              </div>
            </div>
            <div style={{ padding:'18px 20px 20px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <div style={{ fontFamily:'Fraunces', fontSize: 22, letterSpacing:'-0.015em' }}>{p.name}</div>
                <div style={{ fontFamily:'JetBrains Mono', fontSize: 11.5, color:'var(--ink-soft)' }}>
                  ₹ 4,820/sheet
                </div>
              </div>
              <div style={{ fontSize: 11, color:'var(--ink-soft)', marginTop: 6, letterSpacing:'0.04em' }}>{p.tag}</div>

              <div style={{ height: 4, background:'rgba(26,24,21,0.07)', borderRadius: 2, marginTop: 14, overflow:'hidden' }}>
                <div style={{ width:`${p.stock*100}%`, height:'100%', background: p.stock < 0.4 ? 'var(--accent)' : 'var(--ink)' }}/>
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 16 }}>
                <span style={{ fontSize: 11, color:'var(--ink-soft)' }}>
                  {Math.round(p.stock*100)}% remaining
                </span>
                <button style={{
                  padding:'8px 14px', borderRadius: 8, border:'1px solid var(--ink)',
                  background:'transparent', color:'var(--ink)',
                  fontSize: 12, fontWeight: 600, cursor:'pointer', fontFamily:'inherit',
                }}>Reserve precut →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.PrecutDrop = PrecutDrop;
