/* ============================================================
   KREOBOX · Landing · Direction 03 · SHOWROOM
   Editorial photography-led. Heavy on <image-slot>.
   ============================================================ */
const { useState: useStateS } = React;

const FAMILIES_S = [
  { id: 'wardrobe', code: 'WD', title: 'Wardrobes',
    line: 'For the room behind the bedroom door.',
    sub: '5 SKU \u00b7 Compact \u2192 Walk-in suite \u00b7 18 mm panel',
    slot: 'lp-show-wardrobe', ph: 'wardrobe \u00b7 bedroom in use' },
  { id: 'cabinet', code: 'CB', title: 'Modular cabinets',
    line: 'Kitchens that you live in, not look at.',
    sub: '5 SKU \u00b7 Base \u00b7 Wall \u00b7 Pantry \u00b7 Island \u00b7 Corner',
    slot: 'lp-show-cabinet', ph: 'kitchen \u00b7 morning light' },
  { id: 'desk', code: 'DS', title: 'Officer desks',
    line: 'For homes that bill by the hour.',
    sub: '5 SKU \u00b7 Linear \u2192 Reception console',
    slot: 'lp-show-desk', ph: 'desk \u00b7 studio in use' },
  { id: 'storage', code: 'ST', title: 'Storage & shelves',
    line: 'The pieces you stop noticing first.',
    sub: '5 SKU \u00b7 Library \u00b7 Credenza \u00b7 Lockers \u00b7 Grid \u00b7 Tower',
    slot: 'lp-show-storage', ph: 'library shelf \u00b7 in context' },
];

function ShowroomHero({ tablet, audience, setAudience, imagery }) {
  return (
    <div style={{ padding: tablet ? '24px 28px 40px' : '40px 64px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tablet ? 24 : 36 }}>
        <Eyebrow>In residence \u00b7 Spring 2026 \u00b7 No. 02</Eyebrow>
        <AudienceToggle value={audience} onChange={setAudience} />
      </div>
      <div style={{ position: 'relative' }}>
        <image-slot
          id="lp-show-hero"
          placeholder="hero photograph · room in residence · 16:9"
          style={{ width: '100%', aspectRatio: tablet ? '16/10' : '16/8', display: 'block', borderRadius: 2 }}
        ></image-slot>
        {/* overlay caption card */}
        <div style={{
          position: 'absolute', left: tablet ? 16 : 40, bottom: tablet ? 16 : 40,
          background: lBg, padding: tablet ? '20px 22px' : '28px 32px',
          maxWidth: tablet ? 320 : 460, borderRadius: 2,
          boxShadow: '0 30px 60px -30px rgba(26,24,21,0.4)',
        }}>
          <Eyebrow>Fig. 01 \u00b7 Whitefield 3BHK</Eyebrow>
          <div style={{ ...lFr, fontSize: tablet ? 32 : 48, lineHeight: 0.98, letterSpacing: '-0.02em', marginTop: 10 }}>
            Furniture you draw<br/>before you buy.
          </div>
          <p style={{ ...lSans, fontSize: 13, color: lSoft, lineHeight: 1.55, marginTop: 12 }}>
            Twenty SKUs, four families, one in-browser planner. Browse the catalogue, then sit at
            the planner and lay out the room \u2014 to the millimetre.
          </p>
          <a href="Kreobox Planner.html" style={{
            ...lSans, textDecoration: 'none', background: lInk, color: lPaper,
            padding: '12px 18px', borderRadius: 2, fontWeight: 600, fontSize: 13,
            display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 14,
          }}>Open the Planner <span style={{ ...lMono, fontSize: 11, opacity: 0.7 }}>\u2197</span></a>
        </div>
        {/* tiny corner blueprint sticker (matches catalog) */}
        <div style={{
          position: 'absolute', right: tablet ? 16 : 40, top: tablet ? 16 : 40,
          background: lBg, padding: 12, border: `1px solid ${lLine}`, borderRadius: 2,
        }}>
          <MiniPlate family="wardrobe" w={tablet ? 100 : 140} h={tablet ? 72 : 100} imagery={imagery} />
          <div style={{ ...lMono, fontSize: 8, color: lMute, marginTop: 6, letterSpacing: '0.1em' }}>KBX-WD-03 \u00b7 PLATE</div>
        </div>
      </div>
    </div>
  );
}

function ShowroomFamilies({ tablet, imagery }) {
  return (
    <div style={{ padding: tablet ? '40px 28px' : '64px 64px', borderTop: `1px solid ${lLine}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
        <div>
          <Eyebrow>Four families \u00b7 twenty rooms</Eyebrow>
          <div style={{ ...lFr, fontSize: tablet ? 36 : 48, marginTop: 8, letterSpacing: '-0.02em', lineHeight: 1 }}>
            The same SKUs,<br/><span style={{ fontStyle: 'italic', color: lSoft }}>photographed at home.</span>
          </div>
        </div>
        <a href="Kreobox Catalog.html" style={{ ...lMono, fontSize: 11, color: lInk, letterSpacing: '0.1em', textDecoration: 'none', borderBottom: `1px solid ${lInk}`, paddingBottom: 2 }}>FULL CATALOGUE \u2192</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: tablet ? '1fr' : 'repeat(2, 1fr)', gap: tablet ? 28 : 40 }}>
        {FAMILIES_S.map(fam => (
          <div key={fam.id}>
            <div style={{ position: 'relative' }}>
              <image-slot
                id={fam.slot}
                placeholder={fam.ph}
                style={{ width: '100%', aspectRatio: '4/3', display: 'block', borderRadius: 2 }}
              ></image-slot>
              <div style={{
                position: 'absolute', top: 14, left: 14, background: lBg,
                padding: 8, border: `1px solid ${lLine}`, borderRadius: 2,
              }}>
                <MiniPlate family={fam.id} w={80} h={56} imagery={imagery} />
              </div>
              <div style={{ position: 'absolute', top: 14, right: 14, background: lBg, ...lMono, fontSize: 10, padding: '6px 10px', color: lInk, letterSpacing: '0.1em' }}>
                KBX-{fam.code}
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <Eyebrow>{fam.sub}</Eyebrow>
              <div style={{ ...lFr, fontSize: tablet ? 26 : 32, letterSpacing: '-0.01em', marginTop: 6, lineHeight: 1.05 }}>
                {fam.title} \u2014 <span style={{ fontStyle: 'italic', color: lSoft }}>{fam.line}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShowroomDIY({ tablet }) {
  return (
    <div style={{ padding: tablet ? '40px 28px' : '80px 64px', background: lPaper, borderTop: `1px solid ${lLine}`, borderBottom: `1px solid ${lLine}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32, flexDirection: tablet ? 'column' : 'row', gap: 16 }}>
        <div>
          <Eyebrow>Design it yourself \u00b7 three ways</Eyebrow>
          <div style={{ ...lFr, fontSize: tablet ? 36 : 56, marginTop: 10, letterSpacing: '-0.02em', lineHeight: 1 }}>
            Whoever picks up<br/>the pencil first.
          </div>
        </div>
        <p style={{ ...lSans, fontSize: 14, color: lSoft, maxWidth: 360, lineHeight: 1.6 }}>
          Studio is the same file, whether the contractor opens it on a tablet at the site, the
          designer fits it in between meetings, or you sit down to draw your own house.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: tablet ? '1fr' : 'repeat(3, 1fr)', gap: tablet ? 24 : 32 }}>
        {DIY_MODES.map((m, i) => (
          <div key={m.n}>
            <image-slot
              id={'lp-show-mode-' + m.n}
              placeholder={['contractor on tablet \u00b7 site', 'designer at desk \u00b7 studio', 'homeowner at laptop \u00b7 home'][i]}
              style={{ width: '100%', aspectRatio: '4/3', display: 'block', borderRadius: 2 }}
            ></image-slot>
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ ...lFr, fontSize: 36, color: lAccent, lineHeight: 1, fontStyle: 'italic' }}>{m.n}</span>
              <div>
                <div style={{ ...lFr, fontSize: tablet ? 22 : 26, letterSpacing: '-0.01em', lineHeight: 1.1 }}>{m.h}</div>
              </div>
            </div>
            <p style={{ ...lSans, fontSize: 14, color: lSoft, lineHeight: 1.6, marginTop: 12 }}>{m.s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShowroomPlannerPeek({ tablet }) {
  return (
    <div style={{ padding: tablet ? '40px 28px' : '80px 64px' }}>
      <div style={{ display: 'flex', flexDirection: tablet ? 'column' : 'row', gap: tablet ? 28 : 48, alignItems: tablet ? 'flex-start' : 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: '0 0 auto', maxWidth: 380 }}>
          <Eyebrow>Studio \u00b7 page 02</Eyebrow>
          <div style={{ ...lFr, fontSize: tablet ? 40 : 52, lineHeight: 1, letterSpacing: '-0.02em', marginTop: 12 }}>
            And then there\u2019s<br/>
            <span style={{ fontStyle: 'italic', color: lAccent }}>the planner.</span>
          </div>
          <p style={{ ...lSans, fontSize: 15, color: lSoft, lineHeight: 1.6, marginTop: 18 }}>
            Walls, modules, mm-true dimensions. Pull pieces from the catalogue you just browsed.
            When the room reads right, the planner makes the cut-list, the render, and the quote
            in the same gesture.
          </p>
          <a href="Kreobox Planner.html" style={{
            ...lSans, textDecoration: 'none', background: lInk, color: lPaper,
            padding: '14px 22px', borderRadius: 2, fontWeight: 600, fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 20,
          }}>Open the Planner <span style={{ ...lMono, fontSize: 11, opacity: 0.7 }}>\u2197</span></a>
        </div>
        <div style={{ flex: 1, maxWidth: '100%', position: 'relative' }}>
          <PlannerPeek width={tablet ? 720 : 780} height={tablet ? 360 : 440} tone="paper" />
        </div>
      </div>
    </div>
  );
}

function ShowroomMaterials({ tablet }) {
  return (
    <div style={{ padding: tablet ? '40px 28px' : '80px 64px', background: lPaper, borderTop: `1px solid ${lLine}`, borderBottom: `1px solid ${lLine}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28, flexDirection: tablet ? 'column' : 'row', gap: 12 }}>
        <div>
          <Eyebrow>Materials \u00b7 In residence</Eyebrow>
          <div style={{ ...lFr, fontSize: tablet ? 32 : 44, letterSpacing: '-0.02em', marginTop: 8, lineHeight: 1 }}>
            Eight surfaces.<br/>
            <span style={{ fontStyle: 'italic', color: lSoft }}>Always in stock.</span>
          </div>
        </div>
        <p style={{ ...lSans, fontSize: 14, color: lSoft, maxWidth: 320, lineHeight: 1.6 }}>
          Photographs of finishes as they age. Sample swatch book ships free with your first
          partner order.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: tablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: tablet ? 18 : 24 }}>
        {MATERIALS.slice(0, tablet ? 4 : 8).map((m, i) => (
          <div key={m.name}>
            <image-slot
              id={'lp-show-mat-' + i}
              placeholder={`${m.name.toLowerCase()} \u00b7 detail`}
              style={{ width: '100%', aspectRatio: '5/4', display: 'block', borderRadius: 2 }}
            ></image-slot>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
              <span style={{ width: 16, height: 16, background: m.color, backgroundImage: `linear-gradient(135deg, ${m.color} 0 50%, ${m.stripe} 50% 100%)`, border: `1px solid ${lLine}`, flexShrink: 0 }}></span>
              <div>
                <div style={{ ...lSans, fontSize: 13, color: lInk }}>{m.name}</div>
                <div style={{ ...lMono, fontSize: 9, color: lMute }}>{m.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShowroomPricing({ tablet }) {
  return (
    <div style={{ padding: tablet ? '32px 28px 8px' : '64px 64px 8px' }}>
      <PricingStrip />
    </div>
  );
}

function ShowroomFAQ({ tablet }) {
  const [open, setOpen] = useStateS(0);
  return (
    <div style={{ padding: tablet ? '40px 28px' : '80px 64px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32, flexDirection: tablet ? 'column' : 'row', gap: 12 }}>
        <div>
          <Eyebrow>Six questions \u00b7 for contractors</Eyebrow>
          <div style={{ ...lFr, fontSize: tablet ? 36 : 48, marginTop: 8, letterSpacing: '-0.02em', lineHeight: 1 }}>
            The fine print,<br/>
            <span style={{ fontStyle: 'italic', color: lSoft }}>up front.</span>
          </div>
        </div>
        <a href="#" style={{ ...lMono, fontSize: 11, color: lMute, letterSpacing: '0.1em' }}>ALL FAQS \u2192</a>
      </div>
      <div>
        {FAQS_CONTRACTOR.map((it, i) => (
          <div key={i} onClick={() => setOpen(open === i ? -1 : i)} style={{ borderTop: `1px solid ${lLine2}`, padding: '22px 0', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
              <div style={{ ...lFr, fontSize: tablet ? 22 : 26, letterSpacing: '-0.01em' }}>
                {it.q}
              </div>
              <span style={{ ...lMono, fontSize: 14, color: lMute }}>{open === i ? '\u2212' : '+'}</span>
            </div>
            {open === i && (
              <div style={{ ...lSans, fontSize: 14, color: lSoft, lineHeight: 1.65, marginTop: 12, maxWidth: 720 }}>
                {it.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function LandingShowroom({ tablet = false, imagery = 'blueprint', showPricing = true }) {
  const [audience, setAudience] = useStateS('contractor');
  return (
    <div style={{ background: lBg, color: lInk, ...lSans }}>
      <LandingNav variant="showroom" tablet={tablet} />
      <ShowroomHero tablet={tablet} audience={audience} setAudience={setAudience} imagery={imagery} />
      <ShowroomFamilies tablet={tablet} imagery={imagery} />
      <ShowroomDIY tablet={tablet} />
      <ShowroomPlannerPeek tablet={tablet} />
      <ShowroomMaterials tablet={tablet} />
      {showPricing && <ShowroomPricing tablet={tablet} />}
      <ShowroomFAQ tablet={tablet} />
      <LandingFooter tablet={tablet} variant="showroom" />
    </div>
  );
}

Object.assign(window, { LandingShowroom });
