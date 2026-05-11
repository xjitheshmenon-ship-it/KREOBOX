// Precut 04 — Factory floor / live CNC ops console
// Behind-the-glass view of Kreobox's cutting facility. A live queue,
// 4 CNC routers with their current job + ETA, a sheet-yield chart and
// a "now cutting" hero panel. Tone: ops dashboard but warm + premium.

function PrecutFactory() {
  return (
    <div style={{
      width:'100%', height:'100%', background:'#0e0d0b', color:'#e8e6e1',
      display:'grid', gridTemplateColumns: '280px 1fr 320px', gridTemplateRows:'56px 1fr',
      fontFamily:'"Inter Tight", sans-serif',
    }}>
      {/* TOP BAR */}
      <div style={{ gridColumn:'1 / -1', borderBottom:'1px solid rgba(255,255,255,0.08)',
        padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 16 }}>
          <span style={{ fontFamily:'Fraunces', fontWeight: 500, letterSpacing:'0.16em', fontSize: 14 }}>KREOBOX</span>
          <span style={{ fontSize: 11, color:'rgba(255,255,255,0.45)', borderLeft:'1px solid rgba(255,255,255,0.12)', paddingLeft: 14, fontWeight: 500 }}>
            Factory · Mysuru floor
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 18, fontFamily:'JetBrains Mono', fontSize: 11, color:'rgba(255,255,255,0.6)' }}>
          <span><Dot color="#1f8a5b"/> 4 / 4 routers online</span>
          <span><Dot color="#c96442"/> 38 jobs in queue</span>
          <span>14:08:41 · IST</span>
        </div>
      </div>

      {/* LEFT — queue */}
      <div style={{ borderRight:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'18px 20px 12px' }}>
          <div style={{ fontSize: 10, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', fontWeight: 600 }}>
            Queue · today
          </div>
          <div style={{ fontFamily:'Fraunces', fontSize: 24, letterSpacing:'-0.015em', marginTop: 4 }}>
            38 jobs · 142 sheets
          </div>
        </div>
        <div style={{ flex: 1, overflow:'auto' }}>
          {[
            { id:'WHF-3142', name:'Whitefield · Wardrobe', sheets: 6, eta:'14:32', state:'running' },
            { id:'KOR-0128', name:'Koramangala · Kitchen', sheets: 4, eta:'15:10', state:'queued' },
            { id:'IND-2207', name:'Indiranagar · TV unit',  sheets: 2, eta:'15:48', state:'queued' },
            { id:'HSR-0411', name:'HSR · Studio shelves',   sheets: 3, eta:'16:24', state:'queued' },
            { id:'JPN-0921', name:'JP Nagar · Foyer panel', sheets: 1, eta:'16:46', state:'queued' },
            { id:'BSV-1145', name:'Basavanagudi · Pooja',   sheets: 2, eta:'17:14', state:'queued' },
            { id:'WHF-3091', name:'Whitefield · Bedroom 2', sheets: 5, eta:'17:58', state:'queued' },
            { id:'YEL-0012', name:'Yelahanka · Mudroom',    sheets: 2, eta:'18:34', state:'queued' },
            { id:'CRP-3304', name:'Carpenter Studio · 12',  sheets: 8, eta:'19:50', state:'queued' },
          ].map((j,i) => (
            <div key={j.id} style={{
              padding:'12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)',
              display:'flex', alignItems:'center', gap: 10,
              background: j.state === 'running' ? 'rgba(201,100,66,0.10)' : 'transparent',
              borderLeft: j.state === 'running' ? '2px solid var(--accent)' : '2px solid transparent',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily:'JetBrains Mono', fontSize: 10.5, color:'rgba(255,255,255,0.55)', letterSpacing:'0.04em' }}>{j.id}</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{j.name}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:'JetBrains Mono', fontSize: 11.5, color: j.state === 'running' ? 'var(--accent)' : '#fff' }}>{j.eta}</div>
                <div style={{ fontSize: 10, color:'rgba(255,255,255,0.45)', marginTop: 2 }}>{j.sheets} sht</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER — main */}
      <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap: 20, overflow:'hidden' }}>
        {/* now cutting */}
        <div style={{
          background:'linear-gradient(135deg, #1c1814 0%, #2a2018 100%)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, padding:'22px 26px',
          display:'grid', gridTemplateColumns:'1.6fr 1fr', gap: 24,
        }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius:'50%', background:'var(--accent)',
                boxShadow:'0 0 0 6px rgba(201,100,66,0.18)', animation:'pulseDot 1.4s infinite' }}/>
              <span style={{ fontSize: 10, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--accent)', fontWeight: 700 }}>Now cutting</span>
              <span style={{ fontFamily:'JetBrains Mono', fontSize: 10.5, color:'rgba(255,255,255,0.45)', marginLeft:'auto' }}>Router 02 · Biesse Rover</span>
            </div>
            <div style={{ fontFamily:'Fraunces', fontSize: 32, letterSpacing:'-0.02em', lineHeight: 1.05 }}>
              Whitefield · Wardrobe
            </div>
            <div style={{ fontFamily:'JetBrains Mono', fontSize: 11.5, color:'rgba(255,255,255,0.55)', marginTop: 6 }}>
              WHF-3142 · sheet 4 of 6 · Bali Oak
            </div>

            {/* progress */}
            <div style={{ marginTop: 22 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, color:'rgba(255,255,255,0.55)', marginBottom: 6 }}>
                <span>Sheet progress</span>
                <span style={{ fontFamily:'JetBrains Mono' }}>62% · 4 min remaining</span>
              </div>
              <div style={{ height: 6, background:'rgba(255,255,255,0.08)', borderRadius: 3, overflow:'hidden' }}>
                <div style={{ width:'62%', height:'100%', background:'var(--accent)' }}/>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 16, marginTop: 22 }}>
              <Stat k="Spindle" v="18,400" u="rpm" />
              <Stat k="Feed" v="6.4" u="m/min" />
              <Stat k="Bit" v="Ø 8 mm" u="comp" />
              <Stat k="Yield" v="91%" u="this sheet" />
            </div>
          </div>

          {/* mini sheet view */}
          <div style={{
            background:'linear-gradient(135deg,#3a2f22,#5a4632)',
            borderRadius: 8, position:'relative', overflow:'hidden', minHeight: 200,
            backgroundImage:'repeating-linear-gradient(90deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 11px)',
          }}>
            {[
              { x:2, y:4, w:60, h:38, done:true },
              { x:64, y:4, w:34, h:38, done:true },
              { x:2, y:44, w:46, h:30, done:true },
              { x:50, y:44, w:48, h:30, cutting:true },
              { x:2, y:76, w:30, h:20, queued:true },
              { x:34, y:76, w:30, h:20, queued:true },
              { x:66, y:76, w:32, h:20, queued:true },
            ].map((p,i)=>(
              <div key={i} style={{
                position:'absolute', left:`${p.x}%`, top:`${p.y}%`, width:`${p.w}%`, height:`${p.h}%`,
                border: p.cutting ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.4)',
                background: p.done ? 'rgba(31,138,91,0.22)' :
                            p.cutting ? 'rgba(201,100,66,0.30)' : 'rgba(255,255,255,0.05)',
                borderRadius: 2,
                boxShadow: p.cutting ? '0 0 22px rgba(201,100,66,0.5)' : 'none',
              }}/>
            ))}
            {/* tool head crosshair */}
            <div style={{ position:'absolute', left:'72%', top:'58%',
              transform:'translate(-50%,-50%)', width: 26, height: 26, border:'1.5px solid var(--accent)',
              borderRadius:'50%', boxShadow:'0 0 0 4px rgba(201,100,66,0.2)' }}>
              <div style={{ position:'absolute', left:'50%', top:-8, width: 1.5, height: 8, background:'var(--accent)' }}/>
              <div style={{ position:'absolute', left:'50%', bottom:-8, width: 1.5, height: 8, background:'var(--accent)' }}/>
              <div style={{ position:'absolute', top:'50%', left:-8, width: 8, height: 1.5, background:'var(--accent)' }}/>
              <div style={{ position:'absolute', top:'50%', right:-8, width: 8, height: 1.5, background:'var(--accent)' }}/>
            </div>
          </div>
        </div>

        {/* router strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 12, flex: 1, minHeight: 0 }}>
          {[
            { id:'R01', model:'Biesse Rover A', job:'KOR-0128 · queued', state:'idle',    util: 0.0 },
            { id:'R02', model:'Biesse Rover A', job:'WHF-3142 · cutting',state:'running', util: 0.62, hero: true },
            { id:'R03', model:'Homag Centateq', job:'IND-2207 · loading',state:'loading', util: 0.0 },
            { id:'R04', model:'Homag Centateq', job:'Maintenance · 18m', state:'paused',  util: 0.0, paused: true },
          ].map(r => (
            <div key={r.id} style={{
              background:'#1a1612',
              border: r.hero ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding:'16px 18px',
              display:'flex', flexDirection:'column', gap: 10, position:'relative',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontFamily:'JetBrains Mono', fontSize: 11, color:'rgba(255,255,255,0.7)' }}>{r.id}</span>
                <StateChip state={r.state}/>
              </div>
              <div style={{ fontFamily:'Fraunces', fontSize: 16, letterSpacing:'-0.01em' }}>{r.model}</div>
              <div style={{ fontSize: 11, color:'rgba(255,255,255,0.55)' }}>{r.job}</div>
              <div style={{ marginTop:'auto' }}>
                <div style={{ height: 4, background:'rgba(255,255,255,0.08)', borderRadius: 2, overflow:'hidden' }}>
                  <div style={{ width:`${Math.max(r.util*100, r.paused ? 100 : 4)}%`, height:'100%',
                    background: r.paused ? 'rgba(255,255,255,0.18)' : (r.state==='running' ? 'var(--accent)' : '#1f8a5b') }}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — yield + dispatch */}
      <div style={{ borderLeft:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', gap: 0, overflow:'hidden' }}>
        <div style={{ padding:'18px 22px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 10, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', fontWeight: 600 }}>
            Today · yield
          </div>
          <div style={{ fontFamily:'Fraunces', fontSize: 44, letterSpacing:'-0.025em', lineHeight: 1, marginTop: 8 }}>
            89.4<span style={{ fontSize: 22, color:'rgba(255,255,255,0.55)' }}>%</span>
          </div>
          <div style={{ fontSize: 11, color:'#1f8a5b', marginTop: 8, fontWeight: 600 }}>+1.8 vs yesterday</div>

          {/* spark chart */}
          <svg viewBox="0 0 220 60" style={{ width:'100%', marginTop: 14, height: 60 }}>
            <defs>
              <linearGradient id="sparkF" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#c96442" stopOpacity="0.5"/>
                <stop offset="1" stopColor="#c96442" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0,40 L20,32 L40,38 L60,28 L80,30 L100,18 L120,24 L140,14 L160,20 L180,12 L200,16 L220,8 L220,60 L0,60 Z" fill="url(#sparkF)"/>
            <path d="M0,40 L20,32 L40,38 L60,28 L80,30 L100,18 L120,24 L140,14 L160,20 L180,12 L200,16 L220,8" fill="none" stroke="#c96442" strokeWidth="1.5"/>
          </svg>
        </div>

        <div style={{ padding:'18px 22px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 10, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', fontWeight: 600, marginBottom: 12 }}>
            Material draw · today
          </div>
          {[
            { name:'Bali Oak 0.8',     sheets: 42, color:'#d8c8af' },
            { name:'Walnut Smoke',     sheets: 28, color:'#6e5840' },
            { name:'Charcoal Linen',   sheets: 19, color:'#3e342a' },
            { name:'Sienna Burl',      sheets: 14, color:'#a48867' },
          ].map(m => (
            <div key={m.name} style={{ display:'flex', alignItems:'center', gap: 12, padding:'8px 0' }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, background: m.color }}/>
              <span style={{ flex: 1, fontSize: 12.5 }}>{m.name}</span>
              <span style={{ fontFamily:'JetBrains Mono', fontSize: 11.5, color:'rgba(255,255,255,0.7)' }}>{m.sheets} sht</span>
            </div>
          ))}
        </div>

        <div style={{ padding:'18px 22px', flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', fontWeight: 600, marginBottom: 12 }}>
            Dispatch · today
          </div>
          <div style={{ fontFamily:'Fraunces', fontSize: 28, letterSpacing:'-0.02em' }}>11 / 14</div>
          <div style={{ fontSize: 11.5, color:'rgba(255,255,255,0.55)', marginTop: 4 }}>orders shipped to sites</div>

          <button style={{
            marginTop: 22, width:'100%', padding:'12px', borderRadius: 10,
            background:'var(--accent)', color:'#fff', border:'none',
            fontFamily:'inherit', fontWeight: 700, fontSize: 13, cursor:'pointer',
          }}>Open dispatch board →</button>
        </div>
      </div>

      <style>{`
        @keyframes pulseDot { 0%,100% { box-shadow: 0 0 0 6px rgba(201,100,66,0.18); } 50% { box-shadow: 0 0 0 10px rgba(201,100,66,0.04); } }
      `}</style>
    </div>
  );
}

function Dot({ color }) {
  return <span style={{ display:'inline-block', width: 7, height: 7, borderRadius:'50%', background: color, marginRight: 6 }}/>;
}
function Stat({ k, v, u }) {
  return <div>
    <div style={{ fontSize: 10, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', fontWeight: 600 }}>{k}</div>
    <div style={{ fontFamily:'JetBrains Mono', fontSize: 18, marginTop: 4, color:'#fff' }}>{v}</div>
    <div style={{ fontSize: 10.5, color:'rgba(255,255,255,0.5)', marginTop: 2 }}>{u}</div>
  </div>;
}
function StateChip({ state }) {
  const map = {
    running: { fg:'#c96442', bg:'rgba(201,100,66,0.15)', label:'CUTTING' },
    idle:    { fg:'#1f8a5b', bg:'rgba(31,138,91,0.15)',  label:'IDLE' },
    loading: { fg:'#d4a83a', bg:'rgba(212,168,58,0.15)', label:'LOADING' },
    paused:  { fg:'rgba(255,255,255,0.55)', bg:'rgba(255,255,255,0.06)', label:'PAUSED' },
  };
  const t = map[state];
  return <span style={{ fontFamily:'JetBrains Mono', fontSize: 9.5, padding:'3px 7px',
    background: t.bg, color: t.fg, borderRadius: 4, letterSpacing:'0.12em', fontWeight: 600 }}>{t.label}</span>;
}

window.PrecutFactory = PrecutFactory;
