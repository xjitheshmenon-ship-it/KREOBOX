import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      <nav className="w-56 bg-sidebar flex flex-col shrink-0">
        {/* Logo */}
        <Link to="/" className="px-5 py-5 flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 shrink-0">
            <path fillRule="evenodd" clipRule="evenodd" d="M16 28 H84 V84 Q84 90 78 90 H22 Q16 90 16 84 Z M30 42 V76 H70 V42 Z" fill="#c96442"/>
            <rect x="20" y="10" width="68" height="14" rx="3" transform="rotate(-8 54 17)" fill="#c96442" fillOpacity="0.7"/>
          </svg>
          <span className="text-white font-semibold tracking-widest text-xs">KREOBOX</span>
        </Link>

        {/* Platform modules */}
        <div className="px-3 mt-2">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium px-2 mb-1">
            Platform
          </p>
          <NavItem to="/customer"   label="Customer"   active={pathname === '/customer'} />
          <NavItem to="/contractor" label="Contractor"  active={pathname === '/contractor'} />
          <NavItem to="/factory"    label="Factory"     active={pathname === '/factory'} />
          <NavItem to="/admin"      label="Admin"       active={pathname === '/admin'} />
          <NavItem to="/office"     label="Office"      active={pathname === '/office'} />
        </div>

        {/* DesignOS section */}
        <div className="px-3 mt-5">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium px-2 mb-1">
            DesignOS
          </p>
          <NavItem to="/"           label="Overview"    active={pathname === '/'} dot />
          <NavItem to="/modules"    label="Modules"     active={pathname === '/modules'} />
          <NavItem to="/projects/new" label="New Project" active={pathname === '/projects/new'} />
        </div>

        <div className="mt-auto px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">Aarav K.</p>
              <p className="text-[10px] text-white/40">Homeowner</p>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

function NavItem({ to, label, active, dot }: { to: string; label: string; active: boolean; dot?: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors mb-0.5
        ${active
          ? 'bg-sidebar-act text-white font-medium'
          : 'text-white/50 hover:text-white hover:bg-sidebar-act/60'}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? 'bg-accent' : 'bg-transparent'}`} />
      )}
      {!dot && <span className="w-1.5 shrink-0" />}
      {label}
    </Link>
  )
}
