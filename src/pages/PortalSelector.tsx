import { useNavigate } from 'react-router-dom'

const portals = [
  {
    key:     'field',
    path:    '/app/studio',
    label:   'Field',
    sub:     'Customer · Contractor',
    icon:    '🏗',
    accent:  '#c96442',
    bg:      'rgba(201,100,66,0.06)',
    border:  'rgba(201,100,66,0.22)',
    hover:   'rgba(201,100,66,0.12)',
    items: [
      { icon: '👤', text: 'Customer showroom & catalog browsing' },
      { icon: '📐', text: 'Contractor studio & design configurator' },
      { icon: '🗺', text: '3D floor planner (Kitchen · Bedroom · Office)' },
      { icon: '💬', text: 'Quotes, BOQ generation, client handoff' },
    ],
    role: 'Contractor / Customer',
  },
  {
    key:     'ops',
    path:    '/ops/factory',
    label:   'Operations',
    sub:     'Factory · Admin',
    icon:    '🏭',
    accent:  '#3a8a6a',
    bg:      'rgba(58,138,106,0.06)',
    border:  'rgba(58,138,106,0.22)',
    hover:   'rgba(58,138,106,0.12)',
    items: [
      { icon: '🔧', text: 'Production queue & cut-list management' },
      { icon: '📦', text: 'Dispatch tracking & installer mobile view' },
      { icon: '📊', text: 'KPI dashboard — GMV, pipeline, collections' },
      { icon: '🗃', text: 'Inventory alerts & stock management' },
    ],
    role: 'Factory / Admin',
  },
]

export default function PortalSelector() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh', background: '#0d0c0a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Inter Tight", sans-serif', color: '#e8e6e1',
      padding: 32,
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 60, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: 36, height: 36 }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M16 28 H84 V84 Q84 90 78 90 H22 Q16 90 16 84 Z M30 42 V76 H70 V42 Z" fill="#c96442"/>
            <rect x="20" y="10" width="68" height="14" rx="3" transform="rotate(-8 54 17)" fill="#c96442" fillOpacity="0.7"/>
          </svg>
          <span style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 400, letterSpacing: '0.08em' }}>KREOBOX</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>
          DesignOS Platform
        </div>
      </div>

      {/* Portal cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%', maxWidth: 820, marginBottom: 48 }}>
        {portals.map(p => (
          <button key={p.key} onClick={() => navigate(p.path)}
            style={{
              background: p.bg, border: `1.5px solid ${p.border}`,
              borderRadius: 16, padding: '36px 32px',
              textAlign: 'left', cursor: 'pointer', color: '#e8e6e1',
              fontFamily: '"Inter Tight", sans-serif',
              transition: 'all 0.15s',
              outline: 'none',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = p.hover; (e.currentTarget as HTMLElement).style.borderColor = p.accent }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = p.bg; (e.currentTarget as HTMLElement).style.borderColor = p.border }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 36, marginBottom: 10, lineHeight: 1 }}>{p.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{p.label}</div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: p.accent }}>{p.sub}</div>
              </div>
              <div style={{ fontSize: 20, color: p.accent, opacity: 0.6, marginTop: 4 }}>→</div>
            </div>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {p.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{
              padding: '10px 18px', borderRadius: 8,
              background: p.accent, color: '#fff',
              fontSize: 12, fontWeight: 700, display: 'inline-block',
              letterSpacing: '0.04em',
            }}>
              Enter {p.label} →
            </div>
          </button>
        ))}
      </div>

      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
        KREOBOX DesignOS · v2 · {new Date().getFullYear()}
      </div>
    </div>
  )
}
