import { useState } from 'react'
import { useKreoboxStore } from '../store/kreoboxStore'
import { inr, findShutter, findFrame, CATALOG } from '../data/catalog'
import type { KBOrder, KBInventory } from '../types/kreobox'
import StagePill from '../components/kreobox/StagePill'
import Modal from '../components/kreobox/Modal'

/* ── Dark theme palette (from precut-04 factory design) ── */
const D = {
  bg:       '#0e0d0b',
  surface:  '#1a1612',
  border:   'rgba(255,255,255,0.08)',
  text:     '#e8e6e1',
  muted:    'rgba(255,255,255,0.45)',
  accent:   '#c96442',
  good:     '#1f8a5b',
}

export default function FactoryPage() {
  const orders = useKreoboxStore(s => s.orders)
  const inventory = useKreoboxStore(s => s.inventory)
  const setInventory = useKreoboxStore(s => s.setInventory)
  const updateOrderStage = useKreoboxStore(s => s.updateOrderStage)
  const [tab, setTab] = useState<'queue' | 'dispatch' | 'inventory'>('queue')
  const [openOrder, setOpenOrder] = useState<KBOrder | null>(null)

  const queueOrders = orders.filter(o => ['Confirmed', 'In Cut-list', 'Cut', 'Edge-banded'].includes(o.stage))
  const dispatchOrders = orders.filter(o => o.stage === 'Packed')
  const lowStock = inventory.laminates.filter(l => l.sheets < l.reorderAt).length + inventory.hardware.filter(h => h.units < h.reorderAt).length

  const tabs = [
    { id: 'queue' as const, label: 'Production queue', count: queueOrders.length },
    { id: 'dispatch' as const, label: 'Dispatch desk', count: dispatchOrders.length },
    { id: 'inventory' as const, label: 'Inventory', count: inventory.laminates.length + inventory.hardware.length },
  ]

  return (
    <div style={{ minHeight: '100vh', background: D.bg, color: D.text, fontFamily: '"Inter Tight", -apple-system, sans-serif' }}>
      {/* Top bar */}
      <header style={{ height: 56, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${D.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: 'Fraunces', fontSize: 15, fontWeight: 500, letterSpacing: '0.12em' }}>KREOBOX</span>
          <span style={{ fontSize: 11, color: D.muted, borderLeft: `1px solid ${D.border}`, paddingLeft: 16, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
            Factory · Mysuru floor
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontFamily: 'JetBrains Mono', fontSize: 11, color: D.muted }}>
          <span><Dot color={D.good} /> {queueOrders.length} in production</span>
          {lowStock > 0 && <span><Dot color={D.accent} /> {lowStock} low-stock SKUs</span>}
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: D.accent, fontWeight: 700 }}>Module 2</div>
          <h1 style={{ fontFamily: 'Fraunces', fontSize: 48, fontWeight: 300, letterSpacing: '-0.025em', margin: '8px 0 0', lineHeight: 0.95 }}>
            Factory + Stock Depot
          </h1>
          <p style={{ fontSize: 13, marginTop: 10, color: D.muted }}>Production queue · Inventory · Dispatch.</p>
        </div>

        {/* KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'In production', value: queueOrders.length, accent: true },
            { label: 'Ready to dispatch', value: dispatchOrders.length },
            { label: 'Dispatched', value: orders.filter(o => o.stage === 'Dispatched').length },
            { label: 'Low-stock SKUs', value: lowStock, alert: lowStock > 0 },
          ].map(k => (
            <div key={k.label} style={{
              borderRadius: 10, padding: '16px 18px',
              background: k.accent ? D.accent : (k.alert && k.value > 0 ? 'rgba(201,100,66,0.10)' : D.surface),
              border: `1px solid ${k.accent ? D.accent : D.border}`,
            }}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6, fontWeight: 600 }}>{k.label}</div>
              <div style={{ fontFamily: 'Fraunces', fontSize: 32, fontWeight: 300, marginTop: 8, letterSpacing: '-0.02em' }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${D.border}` }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: '8px 16px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                background: tab === t.id ? D.text : 'transparent',
                color: tab === t.id ? D.bg : D.muted,
                border: `1px solid ${tab === t.id ? D.text : D.border}`,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
              {t.label}
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, opacity: 0.7 }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'queue' && <ProductionQueue orders={queueOrders} updateOrderStage={updateOrderStage} openOrder={openOrder} setOpenOrder={setOpenOrder} />}
        {tab === 'dispatch' && <DispatchDesk orders={dispatchOrders} updateOrderStage={updateOrderStage} />}
        {tab === 'inventory' && <InventoryView inventory={inventory} setInventory={setInventory} />}
      </div>

      {openOrder && <CutListModal order={openOrder} onClose={() => setOpenOrder(null)} />}
    </div>
  )
}

function Dot({ color }: { color: string }) {
  return <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: color, marginRight: 6 }} />
}

function ProductionQueue({ orders, updateOrderStage, openOrder, setOpenOrder }: {
  orders: KBOrder[]
  updateOrderStage: (id: string, stage: any) => void
  openOrder: KBOrder | null
  setOpenOrder: (o: KBOrder | null) => void
}) {
  const stages = ['Confirmed', 'In Cut-list', 'Cut', 'Edge-banded', 'Packed']
  const D2 = { bg: '#0e0d0b', surface: '#1a1612', border: 'rgba(255,255,255,0.08)', text: '#e8e6e1', muted: 'rgba(255,255,255,0.45)', accent: '#c96442' }
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 20 }}>
        {stages.map(s => (
          <div key={s} style={{ background: D2.surface, borderRadius: 10, padding: '12px 14px', textAlign: 'center', border: `1px solid ${D2.border}` }}>
            <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: D2.muted, fontWeight: 600 }}>{s}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 24, fontWeight: 500, marginTop: 6 }}>{orders.filter(o => o.stage === s).length}</div>
          </div>
        ))}
      </div>
      {orders.length === 0 ? (
        <div style={{ background: D2.surface, borderRadius: 12, padding: '48px', textAlign: 'center', fontSize: 13, color: D2.muted, border: `1px solid ${D2.border}` }}>
          No orders in queue. Confirmed orders from contractors appear here.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {orders.map(o => (
            <OrderCard key={o.id} order={o} onAction={next => updateOrderStage(o.id, next)} setOpenOrder={setOpenOrder} />
          ))}
        </div>
      )}
    </div>
  )
}

const STAGE_ORDER = ['Confirmed', 'In Cut-list', 'Cut', 'Edge-banded', 'Packed', 'Dispatched']

function OrderCard({ order, onAction, setOpenOrder }: { order: KBOrder; onAction: (s: string) => void; setOpenOrder: (o: KBOrder) => void }) {
  const ix = STAGE_ORDER.indexOf(order.stage)
  const next = STAGE_ORDER[ix + 1]
  const D2 = { surface: '#1a1612', border: 'rgba(255,255,255,0.08)', text: '#e8e6e1', muted: 'rgba(255,255,255,0.45)', accent: '#c96442' }
  return (
    <div style={{ background: D2.surface, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, border: `1px solid ${D2.border}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>{order.id}</span>
          <StagePill stage={order.stage} />
          <span style={{ fontSize: 11, textTransform: 'capitalize', color: D2.muted }}>{order.type}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>{order.customer.name}</div>
        <div style={{ fontSize: 11, color: D2.muted, marginTop: 2 }}>
          {findShutter(order.config.shutter)?.label} · {order.config.frames?.length ?? 0} frames
          {(order.config.walls?.length ?? 0) > 0 && ` + ${order.config.walls.length} wall units`}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13 }}>{inr(order.total)}</div>
        <div style={{ fontSize: 10, color: D2.muted, marginTop: 2 }}>{order.createdAt}</div>
      </div>
      <button onClick={() => setOpenOrder(order)}
        style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${D2.border}`, background: 'transparent', color: D2.text, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
        Cut-list
      </button>
      {next && (
        <button onClick={() => onAction(next)}
          style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: D2.accent, color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>
          Mark {next} →
        </button>
      )}
    </div>
  )
}

function CutListModal({ order, onClose }: { order: KBOrder; onClose: () => void }) {
  const cat = CATALOG[order.type]
  const allFrames = [...(order.config.frames ?? []), ...(order.config.walls ?? [])]
  const lines: Array<{ id: string; sku: string; part: string; w: number; h: number; qty: number; eb: string }> = []
  let lix = 1
  allFrames.forEach(fid => {
    const f = findFrame(order.type, fid)
    if (!f) return
    lines.push(
      { id: `${order.id}-${String(lix++).padStart(3, '0')}`, sku: fid, part: 'Side L', w: f.d - 18, h: f.h, qty: 1, eb: '1L' },
      { id: `${order.id}-${String(lix++).padStart(3, '0')}`, sku: fid, part: 'Side R', w: f.d - 18, h: f.h, qty: 1, eb: '1L' },
      { id: `${order.id}-${String(lix++).padStart(3, '0')}`, sku: fid, part: 'Top', w: f.w - 36, h: f.d - 18, qty: 1, eb: '1L' },
      { id: `${order.id}-${String(lix++).padStart(3, '0')}`, sku: fid, part: 'Bottom', w: f.w - 36, h: f.d - 18, qty: 1, eb: '1L' },
      { id: `${order.id}-${String(lix++).padStart(3, '0')}`, sku: fid, part: 'Back', w: f.w, h: f.h, qty: 1, eb: '0' },
      { id: `${order.id}-${String(lix++).padStart(3, '0')}`, sku: fid, part: 'Shutter', w: f.w - 4, h: f.h - 4, qty: 1, eb: '4L' },
    )
  })
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--kb-line)' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600 }}>Job card</div>
            <h2 style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 400, margin: '6px 0 0' }}>{order.id} · Cut-list</h2>
            <div style={{ fontSize: 12, color: 'var(--kb-ink-soft)', marginTop: 4 }}>
              {order.customer.name} · {findShutter(order.config.shutter)?.label} · {lines.length} pieces
            </div>
          </div>
          <button onClick={onClose} style={{ fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--kb-ink-soft)', padding: 4 }}>×</button>
        </div>
        <table className="kb-crisp-table" style={{ width: '100%' }}>
          <thead>
            <tr><th>Barcode</th><th>SKU</th><th>Part</th><th>W (mm)</th><th>H (mm)</th><th>Qty</th><th>Edge band</th></tr>
          </thead>
          <tbody>
            {lines.map(l => (
              <tr key={l.id}>
                <td style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>{l.id}</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>{l.sku}</td>
                <td style={{ fontSize: 13 }}>{l.part}</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{l.w}</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{l.h}</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{l.qty}</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>{l.eb}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 8, background: 'var(--kb-bg)', fontSize: 11, color: 'var(--kb-ink-soft)' }}>
          Each row prints as a Zebra label (50×30mm) with QR code · scans into the install module.
        </div>
      </div>
    </Modal>
  )
}

function DispatchDesk({ orders, updateOrderStage }: { orders: KBOrder[]; updateOrderStage: (id: string, stage: any) => void }) {
  const D2 = { surface: '#1a1612', border: 'rgba(255,255,255,0.08)', text: '#e8e6e1', muted: 'rgba(255,255,255,0.45)', good: '#1f8a5b' }
  if (orders.length === 0) {
    return <div style={{ background: D2.surface, borderRadius: 12, padding: '48px', textAlign: 'center', fontSize: 13, color: D2.muted, border: `1px solid ${D2.border}` }}>No orders ready for dispatch.</div>
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {orders.map(o => (
        <div key={o.id} style={{ background: D2.surface, borderRadius: 12, padding: '18px 22px', border: `1px solid ${D2.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>{o.id}</span>
                <StagePill stage={o.stage} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6 }}>{o.customer.name}</div>
              <div style={{ fontSize: 12, color: D2.muted, marginTop: 2 }}>{o.customer.area}, {o.customer.city}</div>
            </div>
            <div style={{ textAlign: 'right', marginRight: 16 }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14 }}>{inr(o.total - o.advance)} balance</div>
              <div style={{ fontSize: 10, color: D2.muted, marginTop: 2 }}>collect on dispatch</div>
            </div>
            <button onClick={() => updateOrderStage(o.id, 'Dispatched')}
              style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: D2.good, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Confirm dispatch →
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function InventoryView({ inventory, setInventory }: { inventory: KBInventory; setInventory: (fn: (prev: KBInventory) => KBInventory) => void }) {
  const D2 = { surface: '#1a1612', border: 'rgba(255,255,255,0.08)', text: '#e8e6e1', muted: 'rgba(255,255,255,0.45)', accent: '#c96442', warn: '#b45309' }

  const adjust = (kind: 'laminates' | 'hardware', id: string, delta: number) => {
    setInventory(prev => ({
      ...prev,
      [kind]: prev[kind].map((x: any) => {
        if (x.id !== id) return x
        const key = kind === 'laminates' ? 'sheets' : 'units'
        return { ...x, [key]: Math.max(0, x[key] + delta) }
      }),
    }))
  }

  const colStyle = { background: D2.surface, borderRadius: 12, overflow: 'hidden', border: `1px solid ${D2.border}` }
  const headerStyle = { padding: '14px 18px', borderBottom: `1px solid ${D2.border}`, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div style={colStyle}>
        <div style={headerStyle}>Laminate sheets</div>
        <table className="kb-crisp-table" style={{ width: '100%' }}>
          <thead style={{ background: 'transparent' }}>
            <tr>
              <th style={{ background: 'transparent', color: D2.muted }}>Finish</th>
              <th style={{ background: 'transparent', color: D2.muted }}>Sheets</th>
              <th style={{ background: 'transparent' }}></th>
            </tr>
          </thead>
          <tbody>
            {inventory.laminates.map(l => {
              const sh = findShutter(l.id)
              const low = l.sheets < l.reorderAt
              return (
                <tr key={l.id} style={{ borderBottom: `1px solid ${D2.border}` }}>
                  <td style={{ color: D2.text }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: sh?.color, border: `1px solid ${sh?.border}`, flexShrink: 0 }} />
                      {l.label}
                    </div>
                  </td>
                  <td style={{ color: low ? D2.accent : D2.text }}>
                    <span style={{ fontFamily: 'JetBrains Mono' }}>{l.sheets}</span>
                    {low && <span style={{ marginLeft: 8, fontSize: 10, color: D2.warn }}>⚠ low</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => adjust('laminates', l.id, -1)} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${D2.border}`, background: 'transparent', color: D2.text, cursor: 'pointer', fontSize: 14 }}>−</button>
                      <button onClick={() => adjust('laminates', l.id, 1)} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${D2.border}`, background: 'transparent', color: D2.text, cursor: 'pointer', fontSize: 14 }}>+</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={colStyle}>
        <div style={headerStyle}>Hardware kits</div>
        <table className="kb-crisp-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ background: 'transparent', color: D2.muted }}>Item</th>
              <th style={{ background: 'transparent', color: D2.muted }}>Units</th>
              <th style={{ background: 'transparent' }}></th>
            </tr>
          </thead>
          <tbody>
            {inventory.hardware.map(h => {
              const low = h.units < h.reorderAt
              return (
                <tr key={h.id} style={{ borderBottom: `1px solid ${D2.border}` }}>
                  <td style={{ fontSize: 12, color: D2.text }}>{h.label}</td>
                  <td style={{ color: low ? D2.accent : D2.text }}>
                    <span style={{ fontFamily: 'JetBrains Mono' }}>{h.units}</span>
                    {low && <span style={{ marginLeft: 8, fontSize: 10, color: D2.warn }}>⚠ low</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => adjust('hardware', h.id, -1)} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${D2.border}`, background: 'transparent', color: D2.text, cursor: 'pointer', fontSize: 14 }}>−</button>
                      <button onClick={() => adjust('hardware', h.id, 1)} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${D2.border}`, background: 'transparent', color: D2.text, cursor: 'pointer', fontSize: 14 }}>+</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
