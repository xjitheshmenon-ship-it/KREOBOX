/* ============================================================
   KREOBOX · Landing · Direction 01 · CATALOG
   Reads like a printed Muji/IKEA catalogue spread.
   Quietest of the three.
   ============================================================ */
const { useState: useStateC } = React;

const FAMILIES_CAT = [
  {
    id: 'wardrobe',
    eyebrow: 'WD · 5 plates',
    title: 'Wardrobes',
    italic: 'closet, cupboard, walk-in.',
    blurb: 'Carcass in 18 mm panel, doors in 18 mm. Compact two-bay through walk-in suite, sliding mirror, L-shape corner. Hang, drawer, glass, basket — same five module types as the rest of the catalogue.',
    items: [
      { code: 'KBX-WD-01', name: 'Compact Hanger',    dim: '1800 \u00d7 2200 \u00d7 600' },
      { code: 'KBX-WD-02', name: 'Double-Hang Trio',  dim: '2710 \u00d7 2200 \u00d7 600' },
      { code: 'KBX-WD-03', name: 'Walk-In Suite',     dim: '3600 \u00d7 2400 \u00d7 600' },
      { code: 'KBX-WD-04', name: 'Sliding · Mirror',  dim: '2400 \u00d7 2200 \u00d7 650' },
      { code: 'KBX-WD-05', name: 'Corner Loft',       dim: '2400 + 1500 \u00d7 2200' },
    ],
  },
  {
    id: 'cabinet',
    eyebrow: 'CB · 5 plates',
    title: 'Modular cabinets',
    italic: 'base, wall, pantry, island, L-corner.',
    blurb: 'Kitchen-grade carcasses. Quartz-ready tops, soft-close hardware, BIFMA-approved drawer slides. Magic-corner on the L. The pantry column carries five fixed shelves and one pull-out wirework basket.',
    items: [
      { code: 'KBX-CB-01', name: 'Base Run',     dim: '3000 \u00d7 900 \u00d7 600' },
      { code: 'KBX-CB-02', name: 'Pantry Column',dim: ' 600 \u00d7 2200 \u00d7 600' },
      { code: 'KBX-CB-03', name: 'Wall Run',     dim: '2400 \u00d7 720 \u00d7 350' },
      { code: 'KBX-CB-04', name: 'Island',       dim: '1800 \u00d7 900 \u00d7 1000' },
      { code: 'KBX-CB-05', name: 'L-Corner',     dim: '1500 + 1200 \u00d7 900' },
    ],
  },
  {
    id: 'desk',
    eyebrow: 'DS · 5 plates',
    title: 'Officer desks',
    italic: 'linear, L-shape, sit-stand, bench, reception.',
    blurb: 'For homes that work and studios that bill. Cable channels and grommets standard, electric sit-stand on DS-03. Walnut, oak, linen-laminate — same finish library as wardrobes so the office reads of a piece with the bedroom.',
    items: [
      { code: 'KBX-DS-01', name: 'Linear Executive',  dim: '1800 \u00d7 900 \u00d7 750' },
      { code: 'KBX-DS-02', name: 'L-Shape Manager',   dim: '1800 + 1500 \u00d7 750' },
      { code: 'KBX-DS-03', name: 'Sit-Stand',         dim: '1600 \u00d7 800 \u00d7 650 \u2013 1250' },
      { code: 'KBX-DS-04', name: 'Bench · 4 seats',   dim: '3200 \u00d7 1400 \u00d7 750' },
      { code: 'KBX-DS-05', name: 'Reception Console', dim: '2400 \u00d7 750 \u00d7 1100' },
    ],
  },
  {
    id: 'storage',
    eyebrow: 'ST · 5 plates',
    title: 'Storage & shelves',
    italic: 'library, credenza, lockers, cube grid, filing.',
    blurb: 'The quiet pieces. Library shelf with bracketed brass legs, low credenza with pocket doors, six-person locker bank with RFID, cube grid in 350-mm modules, filing tower with hanging-file drawer.',
    items: [
      { code: 'KBX-ST-01', name: 'Library Shelf',  dim: '1800 \u00d7 1800 \u00d7 350' },
      { code: 'KBX-ST-02', name: 'Credenza',       dim: '1800 \u00d7 750 \u00d7 450' },
      { code: 'KBX-ST-03', name: 'Locker Bank',    dim: '2400 \u00d7 1800 \u00d7 450' },
      { code: 'KBX-ST-04', name: 'Cube Grid 5\u00d75', dim: '1750 \u00d7 1750 \u00d7 350' },
      { code: 'KBX-ST-05', name: 'Filing Tower',   dim: ' 600 \u00d7 1500 \u00d7 450' },
    ],
  },
];

function CatalogFamily({ fam, tablet = false, imagery = 'blueprint' }) {
  const plateW = tablet ? 130 : 168;
  const plateH = tablet ? 96  : 124;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: tablet ? '1fr' : '340px 1fr',
      gap: tablet ? 18 : 56, padding: tablet ? '40px 28px' : '64px 64px',
      borderTop: `1px solid ${lLine}`,
    }}>
      <div>
        <Eyebrow>{fam.eyebrow}</Eyebrow>
        <div style={{ ...lFr, fontSize: tablet ? 36 : 48, letterSpacing: '-0.02em', lineHeight: 1.02, marginTop: 8 }}>
          {fam.title}<br/>
          <span style={{ fontStyle: 'italic', color: lSoft, fontSize: tablet ? 24 : 28 }}>{fam.italic}</span>
        </div>
        <p style={{ ...lSans, fontSize: 14, color: lSoft, lineHeight: 1.65, marginTop: 16, maxWidth: 340 }}>
          {fam.blurb}
        </p>
        <a href="Kreobox Catalog.html" style={{
          ...lMono, fontSize: 11, color: lInk, letterSpacing: '0.1em',
          display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14,
          textDecoration: 'none', borderBottom: `1px solid ${lInk}`, paddingBottom: 2,
        }}>SEE FIVE PLATES <span style={{ fontSize: 9 }}>\u2192</span></a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: tablet ? 'repeat(5, 1fr)' : 'repeat(5, 1fr)', gap: tablet ? 8 : 16 }}>
        {fam.items.map(it => (
          <div key={it.code}>
            <div style={{ background: lPaper, border: `1px solid ${lLine}`, padding: tablet ? 6 : 10, borderRadius: 2 }}>
              <MiniPlate family={fam.id} w={plateW - (tablet ? 12 : 20)} h={plateH - (tablet ? 12 : 20)} imagery={imagery} />
            </div>
            <div style={{ ...lMono, fontSize: 9, color: lMute, marginTop: 8, letterSpacing: '0.05em' }}>{it.code}</div>
            <div style={{ ...lSans, fontSize: tablet ? 11 : 12, color: lInk, marginTop: 2, lineHeight: 1.3 }}>{it.name}</div>
            <div style={{ ...lMono, fontSize: 9, color: lMute, marginTop: 2 }}>{it.dim}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CatalogHero({ tablet = false, audience, setAudience, imagery }) {
  return (
    <div style={{ position: 'relative', padding: tablet ? '36px 28px 48px' : '72px 64px 96px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Eyebrow>Catalogue No. 02 \u00b7 Spring \u201926 \u00b7 Twenty pieces</Eyebrow>
        <AudienceToggle value={audience} onChange={setAudience} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: tablet ? '1fr' : '1.05fr 1fr', gap: tablet ? 28 : 56, marginTop: tablet ? 28 : 40, alignItems: 'end' }}>
        <div>
          <h1 style={{
            ...lFr, fontSize: tablet ? 64 : 104, lineHeight: 0.95, letterSpacing: '-0.025em',
            margin: 0, fontWeight: 400,
          }}>
            Panel furniture,<br/>
            <span style={{ fontStyle: 'italic' }}>planned to the mm.</span>
          </h1>
          <p style={{ ...lSans, fontSize: tablet ? 16 : 18, color: lSoft, lineHeight: 1.55, maxWidth: 560, marginTop: 28 }}>
            Twenty SKUs across wardrobes, modular cabinets, officer desks and storage \u2014
            drawn the same way they\u2019re cut. A catalogue you can browse, and a planner that
            opens with one click. {audience === 'contractor' ? 'For partner contractors.' : audience === 'studio' ? 'For interior design studios.' : 'For homeowners who like to draw their own rooms.'}
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            <a href="planner.html" style={{
              ...lSans, textDecoration: 'none', background: lInk, color: lPaper,
              padding: '14px 22px', borderRadius: 2, fontWeight: 600, fontSize: 14,
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>Open the Planner <span style={{ ...lMono, fontSize: 11, opacity: 0.7 }}>\u2197</span></a>
            <a href="Kreobox Catalog.html" style={{
              ...lSans, textDecoration: 'none', color: lInk, border: `1px solid ${lLine2}`,
              padding: '13px 20px', borderRadius: 2, fontSize: 14,
            }}>See the full catalogue</a>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ background: lPaper, border: `1px solid ${lLine}`, padding: tablet ? 14 : 22, borderRadius: 2 }}>
            <MiniPlate family="wardrobe" w={tablet ? 720 : 540} h={tablet ? 320 : 380} imagery={imagery} />
          </div>
          <div style={{
            position: 'absolute', bottom: -18, left: tablet ? 14 : 22, background: lBg,
            padding: '8px 12px', ...lMono, fontSize: 10, color: lMute, letterSpacing: '0.1em',
          }}>
            FIG. 01 \u00b7 KBX-WD-03 \u00b7 WALK-IN SUITE \u00b7 ELEV 1:25
          </div>
        </div>
      </div>
      {/* tiny key strip */}
      <div style={{ display: 'flex', gap: 18, marginTop: tablet ? 56 : 80, flexWrap: 'wrap' }}>
        <KeyChip c={lBlue}   label="Hang / glass / appliance" />
        <KeyChip c={lOrange} label="Drawer / file" />
        <KeyChip c={lPurple} label="Basket / specialty" />
        <KeyChip c={lGreen}  label="Pull-out" />
        <KeyChip c={lWood}   label="Shelf / wood" />
      </div>
    </div>
  );
}

function CatalogDIY({ tablet = false }) {
  return (
    <div style={{ padding: tablet ? '40px 28px' : '80px 64px', borderTop: `1px solid ${lLine}` }}>
      <div style={{ display: 'flex', flexDirection: tablet ? 'column' : 'row', justifyContent: 'space-between', alignItems: tablet ? 'flex-start' : 'flex-end', gap: 20 }}>
        <div style={{ maxWidth: 560 }}>
          <Eyebrow>Studio \u00b7 design it yourself</Eyebrow>
          <div style={{ ...lFr, fontSize: tablet ? 36 : 48, lineHeight: 1.02, letterSpacing: '-0.02em', marginTop: 10 }}>
            Three ways to put pencil<br/>to the same plan.
          </div>
        </div>
        <p style={{ ...lSans, fontSize: 14, color: lSoft, maxWidth: 320, lineHeight: 1.6 }}>
          Studio holds one shared plan. Who draws it first \u2014 contractor on a tablet at the site,
          studio in the office, or the homeowner herself \u2014 is a preference, not a product decision.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: tablet ? '1fr' : 'repeat(3, 1fr)', gap: tablet ? 18 : 26, marginTop: 32 }}>
        {DIY_MODES.map(m => (
          <div key={m.n} style={{
            background: lPaper, border: `1px solid ${lLine}`, padding: 22, borderRadius: 2,
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ ...lMono, fontSize: 11, color: lAccent, letterSpacing: '0.15em' }}>MODE {m.n}</span>
            </div>
            <div style={{ ...lFr, fontSize: 24, letterSpacing: '-0.01em', lineHeight: 1.1 }}>{m.h}</div>
            <ModeIllustration kind={m.ill} dark={false} />
            <p style={{ ...lSans, fontSize: 13, color: lSoft, lineHeight: 1.55, margin: 0 }}>{m.s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CatalogPlannerPeek({ tablet = false }) {
  return (
    <div style={{ padding: tablet ? '40px 28px' : '80px 64px', borderTop: `1px solid ${lLine}` }}>
      <div style={{ display: 'flex', flexDirection: tablet ? 'column' : 'row', gap: tablet ? 24 : 56, alignItems: tablet ? 'flex-start' : 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: '0 0 auto', maxWidth: 380 }}>
          <Eyebrow>Planner \u00b7 inside Studio</Eyebrow>
          <div style={{ ...lFr, fontSize: tablet ? 34 : 42, lineHeight: 1.02, letterSpacing: '-0.02em', marginTop: 10 }}>
            The second page of Studio.
          </div>
          <p style={{ ...lSans, fontSize: 14, color: lSoft, lineHeight: 1.6, marginTop: 16 }}>
            Walls in plan, modules on a grid, mm-accurate dimensions. Each panel pulls from
            the catalogue you just browsed \u2014 nothing in the planner that you can\u2019t actually
            order. The cut-list, render and quote all generate from the same file.
          </p>
          <a href="planner.html" style={{
            ...lMono, fontSize: 11, color: lInk, letterSpacing: '0.1em',
            display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16,
            textDecoration: 'none', borderBottom: `1px solid ${lInk}`, paddingBottom: 2,
          }}>OPEN THE PLANNER <span style={{ fontSize: 9 }}>\u2192</span></a>
        </div>
        <div style={{ flex: 1, maxWidth: '100%' }}>
          <PlannerPeek width={tablet ? 720 : 760} height={tablet ? 360 : 440} tone="paper" />
        </div>
      </div>
    </div>
  );
}

function CatalogMaterials({ tablet = false }) {
  return (
    <div style={{ padding: tablet ? '40px 28px' : '80px 64px', borderTop: `1px solid ${lLine}` }}>
      <div style={{ display: 'flex', flexDirection: tablet ? 'column' : 'row', alignItems: tablet ? 'flex-start' : 'flex-end', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <Eyebrow>Materials & finishes</Eyebrow>
          <div style={{ ...lFr, fontSize: tablet ? 36 : 48, lineHeight: 1.02, letterSpacing: '-0.02em', marginTop: 10 }}>
            Eight surfaces.<br/>
            <span style={{ fontStyle: 'italic', color: lSoft }}>Always in stock.</span>
          </div>
        </div>
        <p style={{ ...lSans, fontSize: 13, color: lSoft, maxWidth: 320, lineHeight: 1.55 }}>
          Every panel ships in one of these eight surfaces. The full sample swatch book lands
          with your first partner order, free.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: tablet ? 'repeat(4, 1fr)' : 'repeat(8, 1fr)', gap: tablet ? 18 : 22, marginTop: 36 }}>
        {MATERIALS.map(m => <Swatch key={m.name} m={m} size={tablet ? 80 : 100} />)}
      </div>
    </div>
  );
}

function CatalogFAQ({ tablet = false }) {
  const [open, setOpen] = useStateC(0);
  return (
    <div style={{ padding: tablet ? '40px 28px' : '80px 64px', borderTop: `1px solid ${lLine}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexDirection: tablet ? 'column' : 'row', gap: 10 }}>
        <div>
          <Eyebrow>For contractors</Eyebrow>
          <div style={{ ...lFr, fontSize: tablet ? 36 : 48, lineHeight: 1, letterSpacing: '-0.02em', marginTop: 10 }}>Six questions, six answers.</div>
        </div>
        <a href="#" style={{ ...lMono, fontSize: 11, color: lMute, letterSpacing: '0.1em' }}>ALL FAQS \u2192</a>
      </div>
      <div style={{ marginTop: 36 }}>
        {FAQS_CONTRACTOR.map((it, i) => (
          <div key={i} onClick={() => setOpen(open === i ? -1 : i)} style={{ borderTop: `1px solid ${lLine2}`, padding: '20px 0', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
              <div style={{ ...lFr, fontSize: tablet ? 20 : 22, letterSpacing: '-0.01em' }}>
                <span style={{ ...lMono, fontSize: 10, color: lMute, marginRight: 14, letterSpacing: '0.12em' }}>
                  Q.{String(i + 1).padStart(2, '0')}
                </span>
                {it.q}
              </div>
              <span style={{ ...lMono, fontSize: 16, color: lMute }}>{open === i ? '\u2212' : '+'}</span>
            </div>
            {open === i && (
              <div style={{ ...lSans, fontSize: 14, color: lSoft, lineHeight: 1.65, marginTop: 12, maxWidth: 720, paddingLeft: 44 }}>
                {it.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CatalogPricing({ tablet = false }) {
  return (
    <div style={{ padding: tablet ? '40px 28px' : '60px 64px 20px', borderTop: `1px solid ${lLine}` }}>
      <PricingStrip />
    </div>
  );
}

function LandingCatalog({ tablet = false, imagery = 'blueprint', showPricing = true }) {
  const [audience, setAudience] = useStateC('contractor');
  return (
    <div style={{ background: lBg, color: lInk, ...lSans, minHeight: '100%' }}>
      <LandingNav variant="catalog" tablet={tablet} />
      <CatalogHero tablet={tablet} audience={audience} setAudience={setAudience} imagery={imagery} />
      {FAMILIES_CAT.map(fam => <CatalogFamily key={fam.id} fam={fam} tablet={tablet} imagery={imagery} />)}
      <CatalogDIY tablet={tablet} />
      <CatalogPlannerPeek tablet={tablet} />
      <CatalogMaterials tablet={tablet} />
      {showPricing && <CatalogPricing tablet={tablet} />}
      <CatalogFAQ tablet={tablet} />
      <LandingFooter tablet={tablet} variant="catalog" />
    </div>
  );
}

Object.assign(window, { LandingCatalog });
