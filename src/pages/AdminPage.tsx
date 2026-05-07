import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useKreoboxStore } from '../store/kreoboxStore'
import { inr, CATALOG, findShutter } from '../data/catalog'
import type { KBOrder, KBInventory, LaminateStock, HardwareStock, OrderStage } from '../types/kreobox'
import StagePill from '../components/kreobox/StagePill'

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

export default function AdminPage() {
  const orders = useKreoboxStore(s => s.orders)
  const inventory = useKreoboxStore(s => s.inventory)
  const updateOrderStage = useKreoboxStore(s => s.updateOrderStage)
  const resetDemo = useKreoboxStore(s => s.resetDemo)
  const [view, setView] = useState<'pipeline' | 'dashboard' | 'installer'>('pipeline')

  const tabs = [
    { id: 'pipeline' as const, label: 'Live pipeline' },
    { id: 'dashboard' as const, label: 'Founder dashboard' },
    { id: 'installer' as const, label: 'Installer view' },
  ]

  return (
    <div style={S.page} className="kb-font-body">
      <header style={S.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/contractor" style={{ ...S.logo, color: 'inherit', textDecoration: 'none' }}>KREOBOX</Link>
          <span style={{ fontSize: 11, color: 'var(--kb-ink-soft)', borderLeft: '1px solid var(--kb-line)', paddingLeft: 16, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
            Platform · Admin
          </span>
        </div>
        <button onClick={resetDemo} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--kb-line)', background: 'transparent', color: 'var(--kb-ink-soft)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
          ↺ Reset demo
        </button>
      </header>

      <div style={S.content}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--kb-accent)', fontWeight: 700 }}>Module 3</div>
          <h1 className="kb-font-display" style={{ fontSize: 48, fontWeight: 300, letterSpacing: '-0.025em', margin: '8px 0 0', lineHeight: 0.95 }}>
            Installation + Admin
          </h1>
          <p style={{ fontSize: 13, marginTop: 10, color: 'var(--kb-ink-soft)' }}>Founder dashboard · Installer mobile workspace.</p>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--kb-line)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setView(t.id)}
              className="kb-btn"
              style={{
                padding: '8px 16px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                background: view === t.id ? 'var(--kb-ink)' : 'transparent',
                color: view === t.id ? 'var(--kb-paper)' : 'var(--kb-ink-soft)',
                border: `1px solid ${view === t.id ? 'var(--kb-ink)' : 'var(--kb-line-2)'}`,
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {view === 'pipeline' && <PipelineKanban orders={orders} updateOrderStage={updateOrderStage} />}
        {view === 'dashboard' && <FounderDashboard orders={orders} inventory={inventory} />}
        {view === 'installer' && <InstallerView orders={orders} updateOrderStage={updateOrderStage} />}
      </div>
    </div>
  )
}

function FounderDashboard({ orders, inventory }: { orders: KBOrder[]; inventory: KBInventory }) {
  const totalGMV = orders.reduce((s, o) => s + o.total, 0)
  const collected = orders.reduce((s, o) => {
    if (['Dispatched', 'Installing', 'Installed'].includes(o.stage)) return s + o.total
    if (['Confirmed', 'In Cut-list', 'Cut', 'Edge-banded', 'Packed'].includes(o.stage)) return s + o.advance
    return s
  }, 0)
  const installed = orders.filter(o => o.stage === 'Installed').length

  const kpis = [
    { label: 'GMV (all time)', value: inr(totalGMV), mono: true, accent: true },
    { label: 'Cash collected', value: inr(collected), mono: true },
    { label: 'Orders installed', value: installed },
    { label: 'Avg cycle (days)', value: 9 },
  ]

  const pipelineStages = ['Confirmed', 'Cut', 'Edge-banded', 'Packed', 'Dispatched', 'Installed']
  const stageCounts = pipelineStages.map(s => orders.filter(o => o.stage === s).length)
  const maxCount = Math.max(...stageCounts, 1)

  const lowStock = [
    ...inventory.laminates.filter((l: LaminateStock) => l.sheets < l.reorderAt).map((l: LaminateStock) => ({ name: l.label, level: l.sheets, unit: 'sheets' })),
    ...inventory.hardware.filter((h: HardwareStock) => h.units < h.reorderAt).map((h: HardwareStock) => ({ name: h.label, level: h.units, unit: 'units' })),
  ]

  return (
    <div>
      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {kpis.map(k => (
          <div key={k.label} style={{
            borderRadius: 12, padding: '18px 20px',
            background: k.accent ? 'var(--kb-ink)' : 'var(--kb-paper)',
            border: '1px solid var(--kb-line)',
            color: k.accent ? 'var(--kb-paper)' : 'var(--kb-ink)',
          }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6, fontWeight: 600 }}>{k.label}</div>
            <div className={k.mono ? 'kb-font-mono' : 'kb-font-display'} style={{ fontSize: k.mono ? 22 : 28, fontWeight: k.mono ? 500 : 300, marginTop: 8 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Pipeline chart */}
        <div style={{ background: 'var(--kb-paper)', borderRadius: 12, padding: '20px 24px', border: '1px solid var(--kb-line)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', marginBottom: 16 }}>Pipeline by stage</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pipelineStages.map((stage, i) => (
              <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, width: 96, color: 'var(--kb-ink-soft)', flexShrink: 0 }}>{stage}</span>
                <div style={{ flex: 1, height: 24, borderRadius: 4, background: 'var(--kb-bg)', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, width: `${(stageCounts[i] / maxCount) * 100}%`, background: 'var(--kb-ink)', transition: 'width 600ms ease' }} />
                </div>
                <span className="kb-font-mono" style={{ fontSize: 13, width: 20, textAlign: 'right' }}>{stageCounts[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock alerts */}
        <div style={{ background: 'var(--kb-paper)', borderRadius: 12, padding: '20px 24px', border: '1px solid var(--kb-line)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', marginBottom: 16 }}>Stock alerts</div>
          {lowStock.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--kb-ink-soft)' }}>All stock levels healthy ✓</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lowStock.map((x, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, background: 'rgba(201,100,66,0.06)' }}>
                  <span style={{ fontSize: 13 }}>{x.name}</span>
                  <span className="kb-font-mono" style={{ fontSize: 11, color: 'var(--kb-accent)' }}>{x.level} {x.unit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* All orders table */}
      <div style={{ background: 'var(--kb-paper)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--kb-line)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--kb-line)', background: 'var(--kb-bg)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          All orders
        </div>
        <table className="kb-crisp-table" style={{ width: '100%' }}>
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Type</th><th>Status</th><th style={{ textAlign: 'right' }}>Advance</th><th style={{ textAlign: 'right' }}>Total</th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td className="kb-font-mono" style={{ fontSize: 12 }}>{o.id}</td>
                <td style={{ fontWeight: 500 }}>{o.customer.name}</td>
                <td style={{ textTransform: 'capitalize', fontSize: 12 }}>{o.type}</td>
                <td><StagePill stage={o.stage} /></td>
                <td className="kb-font-mono" style={{ textAlign: 'right' }}>{inr(o.advance)}</td>
                <td className="kb-font-mono" style={{ textAlign: 'right' }}>{inr(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function InstallerView({ orders, updateOrderStage }: { orders: KBOrder[]; updateOrderStage: (id: string, stage: any) => void }) {
  const installable = orders.filter(o => ['Dispatched', 'Installing'].includes(o.stage))
  const [activeOrder, setActiveOrder] = useState<KBOrder>(installable[0] ?? orders[0])
  const [checks, setChecks] = useState<Record<number, boolean>>({})

  if (!activeOrder) {
    return <div style={{ fontSize: 13, color: 'var(--kb-ink-soft)' }}>No orders in install queue.</div>
  }

  const allFrames = [...(activeOrder.config.frames ?? []), ...(activeOrder.config.walls ?? [])]
  const checklist = [
    'Scan all panel QR codes (verify count)',
    'Mark wall — install rail',
    'Hang frames left-to-right',
    'Attach shutters + hardware',
    'Customer photo + signature',
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px auto 1fr', gap: 24 }}>
      {/* Queue list */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', marginBottom: 12 }}>Install queue</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {installable.map(o => (
            <button key={o.id} onClick={() => setActiveOrder(o)} className="kb-btn"
              style={{
                width: '100%', textAlign: 'left', padding: 12, borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                background: activeOrder.id === o.id ? 'var(--kb-ink)' : 'var(--kb-paper)',
                color: activeOrder.id === o.id ? 'var(--kb-paper)' : 'var(--kb-ink)',
                border: `1px solid ${activeOrder.id === o.id ? 'var(--kb-ink)' : 'var(--kb-line-2)'}`,
              }}>
              <div className="kb-font-mono" style={{ fontSize: 11, opacity: 0.7 }}>{o.id}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{o.customer.name}</div>
              <div style={{ fontSize: 11, marginTop: 2, opacity: 0.7 }}>{o.customer.area}</div>
            </button>
          ))}
          {installable.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--kb-ink-soft)', padding: '12px 0' }}>No orders dispatched yet.</div>
          )}
        </div>
      </div>

      {/* Phone mock */}
      <div style={{ width: 320, flexShrink: 0 }}>
        <div style={{ border: '8px solid #1a1815', borderRadius: 36, overflow: 'hidden', background: '#fff', boxShadow: '0 24px 60px rgba(26,24,21,0.2)' }}>
          <div style={{ padding: '12px 18px', background: 'var(--kb-ink)', color: 'var(--kb-paper)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
            <span>9:41</span>
            <span style={{ fontWeight: 600 }}>KREOBOX Installer</span>
            <span>●</span>
          </div>
          <div style={{ padding: '18px 18px 24px' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600 }}>Active install</div>
            <div className="kb-font-mono" style={{ fontSize: 12, marginTop: 4 }}>{activeOrder.id}</div>
            <div className="kb-font-display" style={{ fontSize: 22, fontWeight: 400, marginTop: 6, lineHeight: 1.1 }}>{activeOrder.customer.name}</div>
            <div style={{ fontSize: 12, color: 'var(--kb-ink-soft)', marginTop: 4 }}>{activeOrder.customer.area}, {activeOrder.customer.city}</div>

            <div style={{ marginTop: 18, padding: 14, borderRadius: 10, background: 'var(--kb-bg)', fontSize: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>Today's checklist</div>
              {checklist.map((item, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={checks[i] ?? false} onChange={e => setChecks(c => ({ ...c, [i]: e.target.checked }))} style={{ marginTop: 2, accentColor: 'var(--kb-accent)' }} />
                  <span style={{ textDecoration: checks[i] ? 'line-through' : 'none', color: checks[i] ? 'var(--kb-ink-soft)' : 'var(--kb-ink)', lineHeight: 1.4 }}>{item}</span>
                </label>
              ))}
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600, marginBottom: 8 }}>Panels in box</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                {allFrames.slice(0, 6).map((fid, i) => (
                  <div key={i} className="kb-font-mono" style={{ fontSize: 9, padding: '6px', borderRadius: 6, textAlign: 'center', background: 'var(--kb-bg)' }}>{fid}</div>
                ))}
              </div>
            </div>

            {activeOrder.stage === 'Dispatched' && (
              <button onClick={() => updateOrderStage(activeOrder.id, 'Installing')}
                style={{ width: '100%', marginTop: 16, padding: '12px', borderRadius: 10, border: 'none', background: 'var(--kb-accent)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Start install
              </button>
            )}
            {activeOrder.stage === 'Installing' && (
              <button onClick={() => updateOrderStage(activeOrder.id, 'Installed')}
                style={{ width: '100%', marginTop: 16, padding: '12px', borderRadius: 10, border: 'none', background: '#1f8a5b', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Mark installed ✓
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar notes */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', marginBottom: 12 }}>This view runs on</div>
        <div style={{ background: 'var(--kb-paper)', borderRadius: 10, padding: '16px', fontSize: 13, border: '1px solid var(--kb-line)', lineHeight: 2 }}>
          <div>📱 Installer's phone (PWA)</div>
          <div>📷 Camera for QR scan</div>
          <div>📍 Auto-locate on arrival</div>
          <div>🔔 WhatsApp to customer on install complete</div>
        </div>
      </div>
    </div>
  )
}

// ── Pipeline Kanban ────────────────────────────────────────────────────────

const ALL_STAGES: OrderStage[] = ['Quoted', 'Confirmed', 'In Cut-list', 'Cut', 'Edge-banded', 'Packed', 'Dispatched', 'Installing', 'Installed']

const STAGE_NEXT: Partial<Record<OrderStage, OrderStage>> = {
  'Quoted':      'Confirmed',
  'Confirmed':   'In Cut-list',
  'In Cut-list': 'Cut',
  'Cut':         'Edge-banded',
  'Edge-banded': 'Packed',
  'Packed':      'Dispatched',
  'Dispatched':  'Installing',
  'Installing':  'Installed',
}

const STAGE_COLOR: Record<string, string> = {
  'Quoted':      '#e8a820',
  'Confirmed':   '#4a90d9',
  'In Cut-list': '#7c63d4',
  'Cut':         '#c96442',
  'Edge-banded': '#d47a32',
  'Packed':      '#2a9d8f',
  'Dispatched':  '#2196a6',
  'Installing':  '#1f8a5b',
  'Installed':   '#1f8a5b',
}

function PipelineKanban({ orders, updateOrderStage }: { orders: KBOrder[]; updateOrderStage: (id: string, stage: OrderStage) => void }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--kb-ink-soft)', marginBottom: 20 }}>
        Full order journey from customer quote to installation. Click <strong>→ Stage</strong> to advance any order.
      </p>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 12 }}>
        {ALL_STAGES.map(stage => {
          const stageOrders = orders.filter(o => o.stage === stage)
          return (
            <div key={stage} style={{ minWidth: 195, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: STAGE_COLOR[stage], flexShrink: 0, display: 'inline-block' }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--kb-ink-soft)' }}>{stage}</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, marginLeft: 'auto', color: 'var(--kb-ink-3)' }}>{stageOrders.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                {stageOrders.length === 0 ? (
                  <div style={{ borderRadius: 10, border: '1px dashed var(--kb-line)', padding: '20px 12px', textAlign: 'center' as const, color: 'var(--kb-ink-3)', fontSize: 11 }}>—</div>
                ) : stageOrders.map(o => {
                  const next = STAGE_NEXT[stage]
                  return (
                    <div key={o.id} style={{ background: 'var(--kb-paper)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--kb-line)', borderLeft: `3px solid ${STAGE_COLOR[stage]}` }}>
                      <div className="kb-font-mono" style={{ fontSize: 10, color: 'var(--kb-ink-3)', marginBottom: 4 }}>{o.id}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{o.customer.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--kb-ink-soft)', textTransform: 'capitalize' as const, marginBottom: 8 }}>{o.type} · {inr(o.total)}</div>
                      {next ? (
                        <button onClick={() => updateOrderStage(o.id, next)} style={{
                          width: '100%', padding: '6px 10px', borderRadius: 6, border: 'none',
                          background: STAGE_COLOR[next] + '20',
                          color: STAGE_COLOR[next], fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                          → {next}
                        </button>
                      ) : (
                        <div style={{ fontSize: 11, color: '#1f8a5b', fontWeight: 700 }}>✓ Complete</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
