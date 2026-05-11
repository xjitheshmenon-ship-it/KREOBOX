/* ============================================================
   KREOBOX · Landing · Direction 02 · WORKSHOP
   Mono-dense, spec-sheet binder feel.
   ============================================================ */
const { useState: useStateW } = React;

const FAMILIES_W = [
  { id: 'wardrobe', code: 'WD', title: 'Wardrobes', count: '05 SKU',
    items: [
      ['WD-01', 'Compact Hanger',    '1800\u00d72200\u00d7600', '\u20b9 38,400'],
      ['WD-02', 'Double-Hang Trio',  '2710\u00d72200\u00d7600', '\u20b9 62,200'],
      ['WD-03', 'Walk-In Suite',     '3600\u00d72400\u00d7600', '\u20b9 1,18,000'],
      ['WD-04', 'Sliding · Mirror',  '2400\u00d72200\u00d7650', '\u20b9 71,500'],
      ['WD-05', 'Corner Loft',       '2400+1500\u00d72200',     '\u20b9 86,900'],
    ],
  },
  { id: 'cabinet', code: 'CB', title: 'Modular cabinets', count: '05 SKU',
    items: [
      ['CB-01', 'Base Run',      '3000\u00d7900\u00d7600',    '\u20b9 92,400'],
      ['CB-02', 'Pantry Column', '600\u00d72200\u00d7600',    '\u20b9 41,000'],
      ['CB-03', 'Wall Run',      '2400\u00d7720\u00d7350',    '\u20b9 38,800'],
      ['CB-04', 'Island',        '1800\u00d7900\u00d71000',   '\u20b9 1,04,200'],
      ['CB-05', 'L-Corner',      '1500+1200\u00d7900',        '\u20b9 79,600'],
    ],
  },
  { id: 'desk', code: 'DS', title: 'Officer desks', count: '05 SKU',
    items: [
      ['DS-01', 'Linear Executive',  '1800\u00d7900\u00d7750',     '\u20b9 28,700'],
      ['DS-02', 'L-Shape Manager',   '1800+1500\u00d7750',         '\u20b9 41,900'],
      ['DS-03', 'Sit-Stand',         '1600\u00d7800\u00d7650\u20131250', '\u20b9 64,400'],
      ['DS-04', 'Bench \u00b7 4 seats', '3200\u00d71400\u00d7750',   '\u20b9 89,200'],
      ['DS-05', 'Reception Console', '2400\u00d7750\u00d71100',    '\u20b9 56,800'],
    ],
  },
  { id: 'storage', code: 'ST', title: 'Storage & shelves', count: '05 SKU',
    items: [
      ['ST-01', 'Library Shelf',     '1800\u00d71800\u00d7350', '\u20b9 32,400'],
      ['ST-02', 'Credenza',          '1800\u00d7750\u00d7450',  '\u20b9 39,600'],
      ['ST-03', 'Locker Bank',       '2400\u00d71800\u00d7450', '\u20b9 71,200'],
      ['ST-04', 'Cube Grid 5\u00d75',   '1750\u00d71750\u00d7350','\u20b9 44,800'],
      ['ST-05', 'Filing Tower',      '600\u00d71500\u00d7450',  '\u20b9 24,900'],
    ],
  },
];

function WorkshopStatusBar({ tablet }) {
  return (
    <div style={{
      background: lInk, color: lPaper, padding: tablet ? '8px 28px' : '10px 48px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      ...lMono, fontSize: 10, letterSpacing: '0.1em',
    }}>
      <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7fc685', boxShadow: '0 0 6px #7fc685' }}></span>
          STUDIO ONLINE
        </span>
        <span style={{ color: 'rgba(240,238,233,0.6)' }}>v 2.6.1</span>
        <span style={{ color: 'rgba(240,238,233,0.6)' }}>20 SKU \u00b7 4 FAMILIES</span>
        {!tablet && <span style={{ color: 'rgba(240,238,233,0.6)' }}>1,820 VENDORS</span>}
        {!tablet && <span style={{ color: 'rgba(240,238,233,0.6)' }}>3 FACTORIES \u00b7 BLR \u00b7 NCR \u00b7 MMR</span>}
      </div>
      <div style={{ color: 'rgba(240,238,233,0.6)' }}>{tablet ? 'mm \u00b7 \u20b9' : 'units \u00b7 mm \u00b7 currency \u00b7 \u20b9 INR'}</div>
    </div>
  );
}

function WorkshopHero({ tablet, audience, setAudience, imagery }) {
  return (
    <div style={{ padding: tablet ? '32px 28px 28px' : '64px 48px 56px', borderBottom: `1px solid ${lLine}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Eyebrow style={{ color: lAccent }}>STUDIO \u00b7 CONTRACTOR EDITION \u00b7 KREOBOX</Eyebrow>
        <AudienceToggle value={audience} onChange={setAudience} dense />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: tablet ? '1fr' : '1.1fr 1fr', gap: tablet ? 28 : 56, marginTop: 28 }}>
        <div>
          <h1 style={{ ...lFr, fontSize: tablet ? 56 : 92, lineHeight: 0.95, letterSpacing: '-0.025em', margin: 0, fontWeight: 400 }}>
            One catalogue.<br/>
            One planner.<br/>
            <span style={{ fontStyle: 'italic', color: lAccent }}>One file.</span>
          </h1>
          <p style={{ ...lSans, fontSize: tablet ? 15 : 16, color: lSoft, maxWidth: 540, lineHeight: 1.6, marginTop: 24 }}>
            Twenty panel-furniture SKUs that share a cut-list grammar with the planner that designs them. Quote, render and fabricate from the same file. {audience === 'contractor' ? 'Built for contractors who carry their workshop in a backpack.' : audience === 'studio' ? 'Built for studios who bill by the room, not the hour.' : 'Built for homeowners who don\u2019t want to outsource their imagination.'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: tablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 0, marginTop: 32, border: `1px solid ${lLine2}` }}>
            {[
              ['20', 'SKUs in stock'],
              ['5\u20137 d', 'Lead time, BLR'],
              ['22 %', 'Partner margin'],
              ['1 mm', 'CNC tolerance'],
            ].map(([k, v], i) => (
              <div key={i} style={{ padding: '16px 18px', borderRight: i % 4 !== 3 ? `1px solid ${lLine2}` : 'none', background: lPaper }}>
                <div style={{ ...lFr, fontSize: 32, lineHeight: 1, color: lInk }}>{k}</div>
                <div style={{ ...lMono, fontSize: 10, color: lMute, marginTop: 6, letterSpacing: '0.05em' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
            <a href="Kreobox Planner.html" style={{
              ...lSans, textDecoration: 'none', background: lInk, color: lPaper,
              padding: '14px 22px', borderRadius: 2, fontWeight: 600, fontSize: 14,
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>Open the Planner <span style={{ ...lMono, fontSize: 11, opacity: 0.7 }}>\u2197</span></a>
            <a href="#" style={{
              ...lSans, textDecoration: 'none', color: lInk, border: `1px solid ${lLine2}`,
              padding: '13px 20px', borderRadius: 2, fontSize: 14,
            }}>Become a partner</a>
          </div>
        </div>
        {/* Contact sheet 4×3 */}
        <div style={{
          background: lPaper, border: `1px solid ${lLine}`, padding: tablet ? 14 : 18,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
        }}>
          {[
            'wardrobe','wardrobe','wardrobe','wardrobe',
            'cabinet','cabinet','cabinet','cabinet',
            'desk','desk','storage','storage',
          ].map((f, i) => (
            <div key={i} style={{ aspectRatio: '1', border: `1px solid ${lLine}`, background: lBg, padding: 4, position: 'relative' }}>
              <MiniPlate family={f} w={tablet ? 76 : 110} h={tablet ? 76 : 110} imagery={imagery} />
              <div style={{ position: 'absolute', bottom: 3, left: 4, ...lMono, fontSize: 8, color: lMute, letterSpacing: '0.05em' }}>
                {f.slice(0, 2).toUpperCase()}-{String(i + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkshopFamiliesGrid({ tablet, imagery }) {
  return (
    <div style={{ padding: tablet ? '32px 28px' : '56px 48px', borderBottom: `1px solid ${lLine}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
        <Eyebrow>04 \u00b7 product families \u00b7 20 SKU</Eyebrow>
        <span style={{ ...lMono, fontSize: 11, color: lMute }}>price excl. GST \u00b7 stock SKU</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: tablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 1, background: lLine2, border: `1px solid ${lLine2}` }}>
        {FAMILIES_W.map(fam => (
          <div key={fam.id} style={{ background: lBg, padding: tablet ? 18 : 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ ...lMono, fontSize: 11, color: lAccent, letterSpacing: '0.15em' }}>KBX-{fam.code}</span>
              <span style={{ ...lMono, fontSize: 9, color: lMute }}>{fam.count}</span>
            </div>
            <div style={{ ...lFr, fontSize: tablet ? 26 : 30, letterSpacing: '-0.01em', marginTop: 4, lineHeight: 1.05 }}>{fam.title}</div>
            <div style={{ marginTop: 16, background: lPaper, border: `1px solid ${lLine}`, padding: 10 }}>
              <MiniPlate family={fam.id} w={220} h={120} imagery={imagery} />
            </div>
            <div style={{ marginTop: 14 }}>
              {fam.items.map(([code, name, dim, price], i) => (
                <div key={code} style={{
                  display: 'grid', gridTemplateColumns: '64px 1fr auto',
                  gap: 8, padding: '8px 0', borderTop: i === 0 ? 'none' : `1px solid ${lLine}`,
                  ...lMono, fontSize: 10, color: lInk, alignItems: 'baseline',
                }}>
                  <span style={{ color: lMute, letterSpacing: '0.05em' }}>{code}</span>
                  <span style={{ ...lSans, fontSize: 12 }}>
                    {name}
                    <div style={{ ...lMono, fontSize: 9, color: lMute }}>{dim}</div>
                  </span>
                  <span style={{ color: lInk, fontWeight: 700 }}>{price}</span>
                </div>
              ))}
            </div>
            <a href="Kreobox Catalog.html" style={{
              ...lMono, fontSize: 10, color: lInk, letterSpacing: '0.12em',
              display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12,
              textDecoration: 'none', borderBottom: `1px solid ${lInk}`, paddingBottom: 2,
            }}>PLATES \u2192</a>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkshopDIY({ tablet }) {
  return (
    <div style={{ padding: tablet ? '32px 28px' : '64px 48px', background: '#16140f', color: lPaper, borderBottom: `1px solid ${lLine}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32, flexDirection: tablet ? 'column' : 'row', gap: 16 }}>
        <div>
          <Eyebrow color="rgba(240,238,233,0.55)">studio \u00b7 design it yourself \u00b7 3 modes</Eyebrow>
          <div style={{ ...lFr, fontSize: tablet ? 36 : 56, lineHeight: 1, letterSpacing: '-0.02em', marginTop: 12, color: lPaper }}>
            One file. Three<br/>pencils.
          </div>
        </div>
        <p style={{ ...lSans, fontSize: 14, color: 'rgba(240,238,233,0.7)', maxWidth: 340, lineHeight: 1.6 }}>
          The plan is the same atom no matter who picks it up first. Contractor, studio, or the
          homeowner themselves \u2014 same file, same SKUs, same quote.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: tablet ? '1fr' : 'repeat(3, 1fr)', gap: tablet ? 18 : 0, border: tablet ? 'none' : `1px solid rgba(240,238,233,0.14)` }}>
        {DIY_MODES.map((m, i) => (
          <div key={m.n} style={{
            padding: 26,
            borderRight: !tablet && i < 2 ? `1px solid rgba(240,238,233,0.14)` : 'none',
            border: tablet ? `1px solid rgba(240,238,233,0.14)` : 'none',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ ...lMono, fontSize: 11, color: lAccent, letterSpacing: '0.2em' }}>MODE {m.n}</span>
              <span style={{ ...lMono, fontSize: 9, color: 'rgba(240,238,233,0.4)' }}>{['on-site', 'remote', 'public'][i]}</span>
            </div>
            <div style={{ ...lFr, fontSize: 26, lineHeight: 1.05, color: lPaper, letterSpacing: '-0.01em' }}>{m.h}</div>
            <ModeIllustration kind={m.ill} dark={true} />
            <p style={{ ...lSans, fontSize: 13, color: 'rgba(240,238,233,0.7)', lineHeight: 1.6, margin: 0 }}>{m.s}</p>
            <div style={{ ...lMono, fontSize: 10, color: 'rgba(240,238,233,0.45)', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(240,238,233,0.1)', letterSpacing: '0.08em' }}>
              {['avg 18 min · client present', 'avg 42 min · solo', 'avg 1 h 20 · self-led'][i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkshopPlannerPeek({ tablet }) {
  return (
    <div style={{ padding: tablet ? '32px 28px' : '64px 48px', borderBottom: `1px solid ${lLine}` }}>
      <div style={{ display: 'flex', flexDirection: tablet ? 'column' : 'row', gap: tablet ? 24 : 48, alignItems: tablet ? 'flex-start' : 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: '0 0 auto', maxWidth: 320 }}>
          <Eyebrow>page 02 \u00b7 planner</Eyebrow>
          <div style={{ ...lFr, fontSize: tablet ? 32 : 40, lineHeight: 1.02, letterSpacing: '-0.02em', marginTop: 10 }}>
            The shop floor,<br/>in your browser.
          </div>
          <p style={{ ...lSans, fontSize: 13, color: lSoft, lineHeight: 1.6, marginTop: 16 }}>
            Walls in mm. Modules from the catalogue. The planner exports a cut-list a CNC can
            read, a render the client can sign, and a quote the studio can bill.
          </p>
          <div style={{ marginTop: 16, padding: 14, border: `1px solid ${lLine2}`, background: lPaper }}>
            <div style={{ ...lMono, fontSize: 10, color: lMute, letterSpacing: '0.1em', marginBottom: 8 }}>FROM ONE FILE</div>
            {['Cut-list \u00b7 DXF \u00b7 SVG', 'Render \u00b7 PNG \u00b7 PDF', 'Quote sheet \u00b7 contractor \u00b7 client', 'Material BOM \u00b7 vendor split'].map(s => (
              <div key={s} style={{ ...lSans, fontSize: 12, color: lInk, padding: '5px 0', borderTop: `1px solid ${lLine}` }}>{s}</div>
            ))}
          </div>
          <a href="Kreobox Planner.html" style={{
            ...lSans, textDecoration: 'none', background: lInk, color: lPaper,
            padding: '12px 18px', borderRadius: 2, fontWeight: 600, fontSize: 13,
            display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 16,
          }}>Open the Planner <span style={{ ...lMono, fontSize: 11, opacity: 0.7 }}>\u2197</span></a>
        </div>
        <div style={{ flex: 1, maxWidth: '100%' }}>
          <PlannerPeek width={tablet ? 720 : 820} height={tablet ? 380 : 460} tone="cad" />
        </div>
      </div>
    </div>
  );
}

function WorkshopMaterials({ tablet }) {
  return (
    <div style={{ padding: tablet ? '32px 28px' : '64px 48px', borderBottom: `1px solid ${lLine}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <div>
          <Eyebrow>materials & finishes \u00b7 08 surfaces \u00b7 18 mm</Eyebrow>
          <div style={{ ...lFr, fontSize: tablet ? 28 : 36, marginTop: 8, letterSpacing: '-0.01em' }}>Always in stock. Always certified.</div>
        </div>
        <span style={{ ...lMono, fontSize: 10, color: lMute }}>E1 \u00b7 BIFMA \u00b7 FSC mix</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: tablet ? 'repeat(4, 1fr)' : 'repeat(8, 1fr)', gap: 0, border: `1px solid ${lLine2}` }}>
        {MATERIALS.map((m, i) => (
          <div key={m.name} style={{ padding: 14, borderRight: (i+1) % (tablet?4:8) !== 0 ? `1px solid ${lLine2}` : 'none', borderTop: tablet && i >= 4 ? `1px solid ${lLine2}` : 'none', background: lPaper }}>
            <div style={{ width: '100%', aspectRatio: '1.4 / 1', background: m.color, backgroundImage: `linear-gradient(135deg, ${m.color} 0 50%, ${m.stripe} 50% 100%)`, border: `1px solid ${lLine}` }}></div>
            <div style={{ ...lSans, fontSize: 12, color: lInk, marginTop: 8 }}>{m.name}</div>
            <div style={{ ...lMono, fontSize: 9, color: lMute }}>{m.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkshopPricing({ tablet }) {
  return (
    <div style={{ padding: tablet ? '32px 28px' : '56px 48px', borderBottom: `1px solid ${lLine}` }}>
      <Eyebrow style={{ marginBottom: 16 }}>contractor margin \u00b7 2026 plan</Eyebrow>
      <PricingStrip />
    </div>
  );
}

function WorkshopFAQ({ tablet }) {
  return (
    <div style={{ padding: tablet ? '32px 28px' : '64px 48px', borderBottom: `1px solid ${lLine}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <Eyebrow>faq \u00b7 for contractors</Eyebrow>
          <div style={{ ...lFr, fontSize: tablet ? 32 : 40, marginTop: 8, letterSpacing: '-0.02em' }}>Q.01 \u2014 Q.06</div>
        </div>
        <span style={{ ...lMono, fontSize: 10, color: lMute }}>updated 2026-05-02</span>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: tablet ? '1fr' : '1fr 1fr',
        gap: tablet ? 0 : '0 56px',
      }}>
        {FAQS_CONTRACTOR.map((it, i) => (
          <div key={i} style={{ borderTop: `1px solid ${lLine2}`, padding: '18px 0' }}>
            <div style={{ ...lMono, fontSize: 10, color: lAccent, letterSpacing: '0.15em' }}>Q.{String(i + 1).padStart(2, '0')}</div>
            <div style={{ ...lFr, fontSize: 19, marginTop: 4, letterSpacing: '-0.01em' }}>{it.q}</div>
            <p style={{ ...lSans, fontSize: 13, color: lSoft, lineHeight: 1.6, marginTop: 8, marginBottom: 0 }}>{it.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LandingWorkshop({ tablet = false, imagery = 'blueprint', showPricing = true }) {
  const [audience, setAudience] = useStateW('contractor');
  return (
    <div style={{ background: lBg, color: lInk, ...lSans }}>
      <WorkshopStatusBar tablet={tablet} />
      <LandingNav variant="workshop" tablet={tablet} />
      <WorkshopHero tablet={tablet} audience={audience} setAudience={setAudience} imagery={imagery} />
      <WorkshopFamiliesGrid tablet={tablet} imagery={imagery} />
      <WorkshopDIY tablet={tablet} />
      <WorkshopPlannerPeek tablet={tablet} />
      <WorkshopMaterials tablet={tablet} />
      {showPricing && <WorkshopPricing tablet={tablet} />}
      <WorkshopFAQ tablet={tablet} />
      <LandingFooter tablet={tablet} variant="workshop" />
    </div>
  );
}

Object.assign(window, { LandingWorkshop });
