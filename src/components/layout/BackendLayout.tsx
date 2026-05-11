import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useKreoboxStore } from '../../store/kreoboxStore'

const ACCENT = '#3a8a6a'

const navSections = [
  {
    label: 'Production',
    items: [
      { to: '/ops/factory', label: 'Factory Queue', icon: '🔧' },
    ],
  },
  {
    label: 'Management',
    items: [
      { to: '/ops/admin', label: 'Admin Dashboard', icon: '📊' },
    ],
  },
]

export default function BackendLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const navigate      = useNavigate()
  const orders        = useKreoboxStore(s => s.orders)
  const resetDemo     = useKreoboxStore(s => s.resetDemo)

  const pendingCount = orders.filter(o => o.stage === 'Quoted' || o.stage === 'Confirmed').length
  const inCutCount   = orders.filter(o => o.stage === 'In Cut-list' || o.stage === 'Cut').length

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0f1210' }}>
      {/* Sidebar */}
      <nav style={{
        width: 200, background: '#141a16', borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        fontFamily: '"Inter Tight", sans-serif',
      }}>
        {/* Logo */}
        <Link to="/ops/factory" style={{
          padding: '20px 18px 16px', display: 'flex', alignItems: 'center', gap: 10,
          textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <svg viewBox="0 0 100 100" style={{ width: 26, height: 26, flexShrink: 0 }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M16 28 H84 V84 Q84 90 78 90 H22 Q16 90 16 84 Z M30 42 V76 H70 V42 Z" fill={ACCENT}/>
            <rect x="20" y="10" width="68" height="14" rx="3" transform="rotate(-8 54 17)" fill={ACCENT} fillOpacity="0.7"/>
          </svg>
          <div>
            <div style={{ color: '#e8e6e1', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em' }}>KREOBOX</div>
            <div style={{ color: ACCENT, fontSize: 8, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 1 }}>Operations</div>
          </div>
        </Link>

        {/* Live metrics strip */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, background: 'rgba(58,138,106,0.12)', borderRadius: 7, padding: '6px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT }}>{pendingCount}</div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>PENDING</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,160,60,0.1)', borderRadius: 7, padding: '6px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#c98a3a' }}>{inCutCount}</div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>IN CUT</div>
          </div>
        </div>

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
                    background: active ? `rgba(58,138,106,0.14)` : 'transparent',
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

          {/* Demo reset */}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={resetDemo} style={{
              width: '100%', padding: '6px 10px', borderRadius: 7,
              border: '1px solid rgba(255,255,255,0.08)', background: 'transparent',
              color: 'rgba(255,255,255,0.3)', fontSize: 10, cursor: 'pointer',
              fontFamily: '"Inter Tight", sans-serif', textAlign: 'left',
            }}>
              ↺ Reset demo data
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>F</div>
            <div>
              <div style={{ color: '#e8e6e1', fontSize: 11, fontWeight: 600 }}>Factory / Admin</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9 }}>DesignOS Ops</div>
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
