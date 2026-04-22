import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package } from 'lucide-react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()

  return (
    <div className="flex h-screen bg-canvas text-white overflow-hidden">
      <nav className="w-14 bg-sidebar flex flex-col items-center py-4 gap-5 border-r border-white/5 shrink-0">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-sm font-bold text-white">
          K
        </div>
        <NavItem to="/" icon={<LayoutDashboard size={18} />} active={pathname === '/'} label="Dashboard" />
        <NavItem to="/modules" icon={<Package size={18} />} active={pathname === '/modules'} label="Modules" />
      </nav>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

function NavItem({
  to,
  icon,
  active,
  label,
}: {
  to: string
  icon: React.ReactNode
  active: boolean
  label: string
}) {
  return (
    <Link
      to={to}
      title={label}
      className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors
        ${active
          ? 'bg-accent/20 text-accent'
          : 'text-white/40 hover:text-white hover:bg-white/5'}`}
    >
      {icon}
    </Link>
  )
}
