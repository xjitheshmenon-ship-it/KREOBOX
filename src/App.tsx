import { Routes, Route, Navigate } from 'react-router-dom'
import { useKreoboxStore } from './store/kreoboxStore'

import PortalSelector   from './pages/PortalSelector'
import CustomerPage     from './pages/CustomerPage'
import ContractorPage   from './pages/ContractorPage'
import OfficePage       from './pages/OfficePage'
import PlannerPage      from './pages/PlannerPage'
import FactoryPage      from './pages/FactoryPage'
import AdminPage        from './pages/AdminPage'

import FrontendLayout   from './components/layout/FrontendLayout'
import BackendLayout    from './components/layout/BackendLayout'

// ── DesignOS (legacy) pages ───────────────────────────────────────────────────
import Dashboard        from './pages/Dashboard'
import NewProject       from './pages/NewProject'
import DesignStudio     from './pages/DesignStudio'
import BOQExport        from './pages/BOQExport'
import ModuleCatalog    from './pages/ModuleCatalog'

export default function App() {
  const toast = useKreoboxStore(s => s.toast)

  return (
    <>
      <Routes>
        {/* ── Root portal selector ───────────────────────────────────────── */}
        <Route path="/" element={<PortalSelector />} />

        {/* ── Frontend portal: /app/* ────────────────────────────────────── */}
        <Route path="/app/studio"   element={<FrontendLayout><ContractorPage /></FrontendLayout>} />
        <Route path="/app/customer" element={<CustomerPage />} />
        <Route path="/app/office"   element={<FrontendLayout><OfficePage /></FrontendLayout>} />
        <Route path="/app/planner"  element={<PlannerPage />} />

        {/* DesignOS tools (frontend) */}
        <Route path="/app/overview" element={<FrontendLayout><Dashboard /></FrontendLayout>} />
        <Route path="/app/modules"  element={<FrontendLayout><ModuleCatalog /></FrontendLayout>} />
        <Route path="/app/projects/new"          element={<FrontendLayout><NewProject /></FrontendLayout>} />
        <Route path="/app/projects/:id/design"   element={<FrontendLayout><DesignStudio /></FrontendLayout>} />
        <Route path="/app/projects/:id/boq"      element={<FrontendLayout><BOQExport /></FrontendLayout>} />

        {/* ── Backend portal: /ops/* ─────────────────────────────────────── */}
        <Route path="/ops/factory" element={<BackendLayout><FactoryPage /></BackendLayout>} />
        <Route path="/ops/admin"   element={<BackendLayout><AdminPage /></BackendLayout>} />

        {/* ── Legacy route redirects ─────────────────────────────────────── */}
        <Route path="/contractor"  element={<Navigate to="/app/studio"   replace />} />
        <Route path="/customer"    element={<Navigate to="/app/customer" replace />} />
        <Route path="/office"      element={<Navigate to="/app/office"   replace />} />
        <Route path="/planner"     element={<Navigate to="/app/planner"  replace />} />
        <Route path="/factory"     element={<Navigate to="/ops/factory"  replace />} />
        <Route path="/admin"       element={<Navigate to="/ops/admin"    replace />} />
        <Route path="/projects/*"  element={<Navigate to="/app/studio"   replace />} />
        <Route path="/modules"     element={<Navigate to="/app/modules"  replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#1a1814', color: '#e8e6e1',
          padding: '12px 18px', borderRadius: 10,
          fontSize: 13, fontFamily: '"Inter Tight", sans-serif',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          zIndex: 9999, animation: 'kb-slideIn 240ms ease-out',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          {toast}
        </div>
      )}
    </>
  )
}
