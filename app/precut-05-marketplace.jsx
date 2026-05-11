// Precut 05 — Marketplace
// A curated grid of precut "kits" published by independent designers.
// Editorial layout, mixed tile sizes (bento), filter rail, hero feature.
// Tone: gallery / commerce mash-up. Designers earn royalty per cut sheet.

function PrecutMarketplace() {
  return (
    <div style={{
      width:'100%', height:'100%', background:'var(--bg)', color:'var(--ink)',
      display:'flex', flexDirection:'column', overflow:'hidden',
    }}>
      {/* TOP NAV */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'18px 40px', borderBottom:'1px solid var(--line)', background:'var(--paper)' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 28 }}>
          <span style={{ fontFamily:'Fraunces', fontWeight: 500, letterSpacing:'0.16em', fontSize: 14 }}>KREOBOX</span>
          <div style={{ display:'flex', gap: 22, fontSize: 12.5, fontWeight: 500 }}>
            <span>Library</span>
            <span style={{ color:'var(--accent)' }}>Marketplace</span>
            <span>Studio</span>
            <span>Designers</span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
          <div style={{
            display:'flex', alignItems:'center', gap: 8, padding:'8px 14px',
            background:'rgba(26,24,21,0.05)', borderRadius: 999, fontSize: 12.5, color:'var(--ink-soft)', width: 280,
          }}>
            <span>⌕</span>
            <span>Search precut kits, finishes, makers…</span>
            <span style={{ marginLeft:'auto', fontFamily:'JetBrains Mono', fontSize: 10,
              background:'#fff', padding:'2px 6px', borderRadius: 4, border:'1px solid var(--line)' }}>⌘K</span>
          </div>
          <button style={{ padding:'8px 16px', borderRadius: 8, border:'none',
            background:'var(--ink)', color:'#fafaf7', fontWeight: 600, fontSize: 12.5, cursor:'pointer', fontFamily:'inherit' }}>
            Publish a kit
          </button>
        </div>
      </div>

      {/* EDITORIAL HEADER */}
      <div style={{ padding:'36px 40px 28px', display:'grid', gridTemplateColumns:'2fr 1fr', gap: 40, alignItems:'flex-end' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--accent)', fontWeight: 700, marginBottom: 14 }}>
            Marketplace · Issue 04 · Quiet Earth
          </div>
          <h1 style={{
            fontFamily:'Fraunces', fontWeight: 300, fontSize: 72, lineHeight: 0.95,
            letterSpacing:'-0.03em', margin: 0, maxWidth: 880,
          }}>
            Precut kits, by people who actually
            {' '}<em style={{ fontFamily:'"Instrument Serif", serif', fontStyle:'italic', fontWeight: 400 }}>build things.</em>
          </h1>
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.55, color:'var(--ink-soft)', maxWidth: 380 }}>
          Independent studios publish kits — wardrobes, TV units, kitchen runs.
          You order a kit, we cut and ship the panels to fit your room.
          They earn a royalty on every sheet.
        </div>
      </div>

      {/* FILTER ROW */}
      <div style={{ padding:'0 40px 20px', display:'flex', alignItems:'center', justifyContent:'space-between',
        borderBottom:'1px solid var(--line)' }}>
        <div style={{ display:'flex', gap: 6, flexWrap:'wrap' }}>
          {[
            { l:'All kits', n: 184, sel: true },
            { l:'Wardrobes', n: 42 },
            { l:'Kitchens',  n: 31 },
            { l:'TV units',  n: 28 },
            { l:'Shelving',  n: 36 },
            { l:'Pooja',     n: 12 },
            { l:'Foyer',     n: 18 },
            { l:'Mudroom',   n: 17 },
          ].map(c => (
            <span key={c.l} style={{
              padding:'7px 14px', borderRadius: 999,
              background: c.sel ? 'var(--ink)' : 'transparent',
              color: c.sel ? '#fafaf7' : 'var(--ink)',
              border: c.sel ? 'none' : '1px solid var(--line)',
              fontSize: 12, fontWeight: 600, display:'inline-flex', alignItems:'center', gap: 7, cursor:'pointer',
            }}>
              {c.l}
              <span style={{ fontFamily:'JetBrains Mono', fontSize: 10, opacity: 0.65 }}>{c.n}</span>
            </span>
          ))}
        </div>
        <div style={{ display:'flex', gap: 10, fontSize: 12, color:'var(--ink-soft)' }}>
          <span>Sort: <strong style={{ color:'var(--ink)' }}>Curated ↓</strong></span>
          <span style={{ borderLeft:'1px solid var(--line)', paddingLeft: 10 }}>Grid · List</span>
        </div>
      </div>

      {/* BENTO GRID */}
      <div style={{
        flex: 1, padding:'24px 40px 32px',
        display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gridTemplateRows:'repeat(2, 1fr)',
        gap: 16, overflow:'hidden',
      }}>
        {/* Hero feature — spans 2x2 */}
        <KitCard featured
          maker="Studio Lalbagh · Bengaluru"
          name="The Quiet Wardrobe"
          desc="A 7-foot precut wardrobe kit · 12 panels, Bali Oak, soft-close hinges, cane-mesh inserts."
          price="₹ 32,400"
          royalty="Studio earns ₹ 1,920"
          swatch="#a48867"
          tag="Editor's pick"
          sheets={6}
          sold={142}
        />

        <KitCard
          maker="Korai & Co"
          name="Kitchen Run · 10ft"
          desc="Quartz-ready base + tall cabinets"
          price="₹ 48,000"
          swatch="#6e5840"
          sheets={9}
          sold={88}
        />
        <KitCard
          maker="Atelier Nilgiri"
          name="Floating TV niche"
          desc="Charcoal linen + warm oak"
          price="₹ 14,200"
          swatch="#3e342a"
          sheets={3}
          sold={210}
          tag="Bestseller"
        />
        <KitCard
          maker="Two Houses"
          name="Foyer console + mirror"
          desc="Mitre-edged, cane bottom shelf"
          price="₹ 9,800"
          swatch="#d8c8af"
          sheets={2}
          sold={64}
        />
        <KitCard
          maker="Mahogany Lab"
          name="Bookcase · split level"
          desc="Walnut smoke, 14 cuts"
          price="₹ 18,400"
          swatch="#221c16"
          sheets={4}
          sold={31}
          tag="New"
        />
      </div>
    </div>
  );
}

function KitCard({ featured, maker, name, desc, price, royalty, swatch, tag, sheets, sold }) {
  return (
    <div style={{
      gridColumn: featured ? 'span 2' : 'auto',
      gridRow: featured ? 'span 2' : 'auto',
      background:'var(--paper)', border:'1px solid var(--line)', borderRadius: 14,
      overflow:'hidden', display:'flex', flexDirection: featured ? 'row' : 'column',
      position:'relative',
    }}>
      <div style={{
        flex: featured ? '1 1 50%' : '0 0 auto',
        height: featured ? 'auto' : '60%',
        background: swatch,
        backgroundImage:
          'repeating-linear-gradient(180deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 6px),'+
          'repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 16px)',
        position:'relative',
      }}>
        {tag && (
          <div style={{
            position:'absolute', top: 14, left: 14, padding:'4px 10px',
            background:'rgba(26,24,21,0.9)', color:'#fafaf7', fontSize: 10, fontWeight: 700,
            letterSpacing:'0.16em', textTransform:'uppercase', borderRadius: 999,
            backdropFilter:'blur(10px)',
          }}>{tag}</div>
        )}
        {/* mock floating panels — only on featured */}
        {featured && (
          <div style={{ position:'absolute', inset: 0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 60px)', gridTemplateRows:'repeat(2, 80px)', gap: 6 }}>
              {[0,1,2,3,4,5].map(i => (
                <div key={i} style={{
                  background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.35)',
                  borderRadius: 3, position:'relative',
                  transform:`translate(${(i%3)*0}px, ${Math.floor(i/3)*0}px)`,
                }}>
                  <span style={{ position:'absolute', bottom: 4, left: 6, fontFamily:'JetBrains Mono',
                    fontSize: 8, color:'rgba(255,255,255,0.85)', letterSpacing:'0.08em' }}>P-{(i+1).toString().padStart(2,'0')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ position:'absolute', bottom: 12, right: 14, fontFamily:'JetBrains Mono',
          fontSize: 10, color:'rgba(255,255,255,0.7)', fontWeight: 500 }}>
          {sheets} sheets
        </div>
      </div>

      <div style={{
        flex: featured ? '1 1 50%' : 1,
        padding: featured ? '32px 32px' : '16px 18px',
        display:'flex', flexDirection:'column', justifyContent: featured ? 'space-between' : 'flex-start', gap: featured ? 0 : 4,
      }}>
        <div style={{ fontSize: featured ? 11 : 10.5, letterSpacing:'0.14em', textTransform:'uppercase',
          color:'var(--ink-soft)', fontWeight: 600 }}>
          {maker}
        </div>
        <div style={{ fontFamily:'Fraunces', fontSize: featured ? 36 : 17, letterSpacing:'-0.02em', lineHeight: 1.05, marginTop: featured ? 12 : 6 }}>
          {name}
        </div>
        {featured && (
          <div style={{ fontSize: 14, lineHeight: 1.5, color:'var(--ink-soft)', marginTop: 14, maxWidth: 360 }}>
            {desc}
          </div>
        )}
        {!featured && (
          <div style={{ fontSize: 12, color:'var(--ink-soft)', marginTop: 4, lineHeight: 1.4 }}>{desc}</div>
        )}

        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between',
          marginTop: featured ? 32 : 'auto', paddingTop: featured ? 0 : 12,
          borderTop: featured ? 'none' : '1px solid var(--line)' }}>
          <div>
            <div style={{ fontFamily:'Fraunces', fontSize: featured ? 28 : 16, letterSpacing:'-0.015em' }}>{price}</div>
            {featured && royalty && (
              <div style={{ fontSize: 11, color:'var(--accent)', marginTop: 4, fontWeight: 600 }}>{royalty} per kit</div>
            )}
            {!featured && (
              <div style={{ fontSize: 10.5, color:'var(--ink-soft)', marginTop: 2 }}>{sold} sold</div>
            )}
          </div>
          <button style={{
            padding: featured ? '11px 20px' : '6px 12px', borderRadius: 8,
            background: featured ? 'var(--accent)' : 'transparent',
            color: featured ? '#fff' : 'var(--ink)',
            border: featured ? 'none' : '1px solid var(--ink)',
            fontSize: featured ? 13 : 11, fontWeight: 600, cursor:'pointer', fontFamily:'inherit',
          }}>
            {featured ? 'Order kit, precut →' : 'View kit →'}
          </button>
        </div>
      </div>
    </div>
  );
}

window.PrecutMarketplace = PrecutMarketplace;
