import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      <nav className="w-56 bg-sidebar flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-2.5">
          <div className="w-7 h-7 bg-accent rounded flex items-center justify-center shrink-0">
            <svg viewBox="0 0 14 14" fill="none" className="w-4 h-4">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="white"/>
              <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity=".6"/>
              <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity=".6"/>
              <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity=".3"/>
            </svg>
          </div>
          <span className="text-white font-semibold tracking-widest text-xs">KREOBOX</span>
        </div>

        {/* Platform modules */}
        <div className="px-3 mt-2">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium px-2 mb-1">
            Platform
          </p>
          <NavItem to="/customer"   label="Customer"   active={pathname === '/customer'} />
          <NavItem to="/contractor" label="Contractor"  active={pathname === '/contractor'} />
          <NavItem to="/factory"    label="Factory"     active={pathname === '/factory'} />
          <NavItem to="/admin"      label="Admin"       active={pathname === '/admin'} />
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
