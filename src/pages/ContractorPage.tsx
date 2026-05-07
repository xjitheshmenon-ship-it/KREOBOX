import { useState, useEffect } from 'react'
import { useKreoboxStore } from '../store/kreoboxStore'
import { inr, generatePanels } from '../data/catalog'
import type { KBOrder, Lead, OrderConfig } from '../types/kreobox'
import StagePill from '../components/kreobox/StagePill'
import KPI from '../components/kreobox/KPI'
import DesignConfigurator from '../components/kreobox/DesignConfigurator'
import { v4 as uuid } from 'uuid'

const S = {
  page: {
    minHeight: '100vh',
    background: 'var(--kb-bg)',
    color: 'var(--kb-ink)',
    fontFamily: '"Inter Tight", -apple-system, sans-serif',
  } as React.CSSProperties,
  topbar: {
    position: 'sticky' as const, top: 0, zIndex: 30,
    background: 'rgba(240,238,233,0.88)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--kb-line)',
    padding: '0 40px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: 56,
  },
  logo: { fontFamily: 'Fraunces', fontSize: 15, fontWeight: 500, letterSpacing: '0.12em' },
  content: { maxWidth: 1280, margin: '0 auto', padding: '40px 40px 80px' },
}

interface ContractorPageProps {
  pendingLead: Lead | null
  clearLead: () => void
}

export default function ContractorPage({ pendingLead, clearLead }: ContractorPageProps) {
  const orders = useKreoboxStore(s => s.orders)
  const addOrder = useKreoboxStore(s => s.addOrder)
  const [view, setView] = useState<'list' | 'design'>(pendingLead ? 'design' : 'list')

  useEffect(() => {
    if (pendingLead) setView('design')
  }, [pendingLead])

  const handleConfirm = (config: OrderConfig, total: number) => {
    const newOrder: KBOrder = {
      id: pendingLead?.id ?? 'ORD-' + Math.floor(1050 + Math.random() * 50),
      customer: pendingLead?.customer ?? { name: 'Walk-in client', phone: '—', city: 'Bengaluru', area: '—' },
      contractor: 'Suresh Modulars',
      type: config.type,
      config,
      advance: pendingLead?.advance ?? Math.round(total * 0.35),
      total,
      stage: 'Confirmed',
      createdAt: new Date().toISOString().slice(0, 10),
      panels: generatePanels(config),
    }
    addOrder(newOrder)
    clearLead()
    setView('list')
  }

  if (view === 'design') {
    return (
      <div style={S.page} className="kb-font-body">
        <header style={S.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={S.logo}>KREOBOX</span>
            <span style={{ fontSize: 11, color: 'var(--kb-ink-soft)', borderLeft: '1px solid var(--kb-line)', paddingLeft: 16, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
              DesignOS
            </span>
          </div>
        </header>
        <div style={S.content}>
          <DesignConfigurator
            lead={pendingLead}
            onBack={() => { clearLead(); setView('list') }}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={S.page} className="kb-font-body">
      <header style={S.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={S.logo}>KREOBOX</span>
          <span style={{ fontSize: 11, color: 'var(--kb-ink-soft)', borderLeft: '1px solid var(--kb-line)', paddingLeft: 16, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
            DesignOS · Contractor
          </span>
        </div>
        <button
          onClick={() => setView('design')}
          className="kb-btn"
          style={{ padding: '8px 18px', borderRadius: 8, background: 'var(--kb-accent)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          + New design
        </button>
      </header>

      <div style={S.content}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--kb-accent)', fontWeight: 700 }}>Module 1</div>
          <h1 className="kb-font-display" style={{ fontSize: 48, fontWeight: 300, letterSpacing: '-0.025em', margin: '8px 0 0', lineHeight: 0.95 }}>DesignOS</h1>
          <p style={{ fontSize: 13, marginTop: 10, color: 'var(--kb-ink-soft)' }}>Contractor workspace · Configure, quote, dispatch.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
          <KPI label="Active orders" value={orders.filter(o => !['Installed', 'Dispatched'].includes(o.stage)).length} />
          <KPI label="Awaiting site visit" value={orders.filter(o => o.stage === 'Confirmed').length} />
          <KPI label="GMV this month" value={inr(orders.reduce((s, o) => s + o.total, 0))} mono accent />
        </div>

        <div style={{ background: 'var(--kb-paper)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--kb-line)' }}>
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--kb-line)', background: 'var(--kb-bg)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>My orders</div>
            <div className="kb-font-mono" style={{ fontSize: 11, color: 'var(--kb-ink-soft)' }}>{orders.length} total</div>
          </div>
          <table className="kb-crisp-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Created</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ background: 'var(--kb-paper)' }}>
                  <td className="kb-font-mono" style={{ fontSize: 12 }}>{o.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.customer.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--kb-ink-soft)', marginTop: 1 }}>{o.customer.area}, {o.customer.city}</div>
                  </td>
                  <td style={{ textTransform: 'capitalize', fontSize: 12 }}>{o.type}</td>
                  <td className="kb-font-mono" style={{ fontSize: 12, color: 'var(--kb-ink-soft)' }}>{o.createdAt}</td>
                  <td><StagePill stage={o.stage} /></td>
                  <td className="kb-font-mono" style={{ textAlign: 'right' }}>{inr(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
