import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import NewProject from './pages/NewProject'
import DesignStudio from './pages/DesignStudio'
import BOQExport from './pages/BOQExport'
import ModuleCatalog from './pages/ModuleCatalog'
import CustomerPage from './pages/CustomerPage'
import ContractorPage from './pages/ContractorPage'
import FactoryPage from './pages/FactoryPage'
import AdminPage from './pages/AdminPage'
import OfficePage from './pages/OfficePage'
import { useKreoboxStore } from './store/kreoboxStore'
import type { Lead } from './types/kreobox'

export default function App() {
  const toast = useKreoboxStore(s => s.toast)
  const [pendingLead, setPendingLead] = useState<Lead | null>(null)

  return (
    <>
      <Routes>
        {/* Existing DesignOS routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects/new" element={<NewProject />} />
        <Route path="/projects/:id/design" element={<DesignStudio />} />
        <Route path="/projects/:id/boq" element={<BOQExport />} />
        <Route path="/modules" element={<ModuleCatalog />} />

        {/* 4 new module pages */}
        <Route path="/customer" element={
          <CustomerPage onCheckout={lead => setPendingLead(lead)} />
        } />
        <Route path="/contractor" element={
          <ContractorPage pendingLead={pendingLead} clearLead={() => setPendingLead(null)} />
        } />
        <Route path="/factory" element={<FactoryPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/office" element={<OfficePage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: 'var(--kb-ink)', color: 'var(--kb-paper)',
          padding: '12px 18px', borderRadius: 10,
          fontSize: 13, fontFamily: '"Inter Tight", sans-serif',
          boxShadow: '0 8px 24px rgba(26,24,21,0.18)',
          zIndex: 999, animation: 'kb-slideIn 240ms ease-out',
        }}>
          {toast}
        </div>
      )}
    </>
  )
}
