import { Link, useLocation, useNavigate } from 'react-router-dom'

const ACCENT = '#c96442'

const navSections = [
  {
    label: 'DesignOS',
    items: [
      { to: '/app/studio',   label: 'Studio',   icon: '✦', dot: true  },
      { to: '/app/planner',  label: 'Planner',  icon: '🗺', dot: true  },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { to: '/app/customer', label: 'Home',     icon: '🏠', dot: false },
      { to: '/app/office',   label: 'Office',   icon: '💼', dot: false },
    ],
  },
]

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const navigate      = useNavigate()

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#141210' }}>
      {/* Sidebar */}
      <nav style={{
        width: 200, background: '#1c1814', borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        fontFamily: '"Inter Tight", sans-serif',
      }}>
        {/* Logo */}
        <Link to="/app/studio" style={{
          padding: '20px 18px 16px', display: 'flex', alignItems: 'center', gap: 10,
          textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <svg viewBox="0 0 100 100" style={{ width: 26, height: 26, flexShrink: 0 }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M16 28 H84 V84 Q84 90 78 90 H22 Q16 90 16 84 Z M30 42 V76 H70 V42 Z" fill={ACCENT}/>
            <rect x="20" y="10" width="68" height="14" rx="3" transform="rotate(-8 54 17)" fill={ACCENT} fillOpacity="0.7"/>
          </svg>
          <div>
            <div style={{ color: '#e8e6e1', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em' }}>KREOBOX</div>
            <div style={{ color: ACCENT, fontSize: 8, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 1 }}>Field</div>
          </div>
        </Link>

        {/* Nav sections */}
        <div style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {navSections.map(section => (
            <div key={section.label} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0 10px', marginBottom: 4 }}>
                {section.label}
              </div>
              {section.items.map(item => {
                const active = pathname === item.to
                return (
                  <Link key={item.to} to={item.to} style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '7px 10px', borderRadius: 8, marginBottom: 2,
                    textDecoration: 'none', fontSize: 12, fontWeight: active ? 600 : 400,
                    color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                    background: active ? 'rgba(201,100,66,0.14)' : 'transparent',
                    borderLeft: active ? `2px solid ${ACCENT}` : '2px solid transparent',
                    transition: 'all 0.1s',
                  }}>
                    <span style={{ fontSize: 13 }}>{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>C</div>
            <div>
              <div style={{ color: '#e8e6e1', fontSize: 11, fontWeight: 600 }}>Contractor</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9 }}>DesignOS Field</div>
            </div>
          </div>
          <button onClick={() => navigate('/')} style={{
            width: '100%', padding: '6px 10px', borderRadius: 7,
            border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
            color: 'rgba(255,255,255,0.35)', fontSize: 10, cursor: 'pointer',
            fontFamily: '"Inter Tight", sans-serif', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 10 }}>⇠</span> Switch portal
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
    </div>
  )
}
