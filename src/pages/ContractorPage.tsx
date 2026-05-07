import { useState, useEffect } from 'react'
import { useKreoboxStore } from '../store/kreoboxStore'
import { inr, generatePanels } from '../data/catalog'
import type { KBOrder, Lead, OrderConfig } from '../types/kreobox'
import StagePill from '../components/kreobox/StagePill'
import KPI from '../components/kreobox/KPI'
import DesignConfigurator from '../components/kreobox/DesignConfigurator'

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
  content: { maxWidth: 1280, margin: '0 auto', padding: '40px 40px 80px' },
}

const FLAT_TYPES = [
  { id: '1bhk', label: '1 BHK', desc: '1 bed · 1 bath', rooms: 1 },
  { id: '2bhk', label: '2 BHK', desc: '2 bed · 2 bath', rooms: 2 },
  { id: '3bhk', label: '3 BHK', desc: '3 bed · 2 bath', rooms: 3 },
  { id: '4bhk', label: '4 BHK', desc: '4 bed · 3 bath', rooms: 4 },
  { id: 'villa', label: 'Villa', desc: 'Duplex / Row house', rooms: 5 },
  { id: 'commercial', label: 'Commercial', desc: 'Office / Retail', rooms: 0 },
]

const ROOM_OPTIONS = [
  { id: 'master-wardrobe', label: 'Master Wardrobe', icon: '🚪', type: 'wardrobe' as const },
  { id: 'bed2-wardrobe', label: 'Bedroom 2 Wardrobe', icon: '🚪', type: 'wardrobe' as const },
  { id: 'bed3-wardrobe', label: 'Bedroom 3 Wardrobe', icon: '🚪', type: 'wardrobe' as const },
  { id: 'kitchen', label: 'Kitchen', icon: '🍳', type: 'kitchen' as const },
  { id: 'office-corner', label: 'Home Office', icon: '💼', type: 'office' as const },
  { id: 'kids-wardrobe', label: "Kids' Wardrobe", icon: '🎒', type: 'wardrobe' as const },
  { id: 'tv-unit', label: 'TV Unit', icon: '📺', type: 'wardrobe' as const },
  { id: 'crockery', label: 'Crockery Unit', icon: '🍽️', type: 'kitchen' as const },
]

interface ContractorPageProps {
  pendingLead: Lead | null
  clearLead: () => void
}

type FlowStep = 'list' | 'flat-type' | 'rooms' | 'design'

interface ProjectDraft {
  flatType: string
  rooms: string[]
  clientName: string
  clientPhone: string
}

export default function ContractorPage({ pendingLead, clearLead }: ContractorPageProps) {
  const orders = useKreoboxStore(s => s.orders)
  const addOrder = useKreoboxStore(s => s.addOrder)
  const [step, setStep] = useState<FlowStep>(pendingLead ? 'design' : 'list')
  const [draft, setDraft] = useState<ProjectDraft>({ flatType: '', rooms: [], clientName: '', clientPhone: '' })

  useEffect(() => {
    if (pendingLead) setStep('design')
  }, [pendingLead])

  const handleConfirm = (config: OrderConfig, total: number) => {
    const newOrder: KBOrder = {
      id: pendingLead?.id ?? 'ORD-' + Math.floor(1050 + Math.random() * 900),
      customer: pendingLead?.customer ?? {
        name: draft.clientName || 'Walk-in client',
        phone: draft.clientPhone || '—',
        city: 'Bengaluru', area: '—',
      },
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
    setDraft({ flatType: '', rooms: [], clientName: '', clientPhone: '' })
    setStep('list')
  }

  const toggleRoom = (id: string) => {
    setDraft(d => ({
      ...d,
      rooms: d.rooms.includes(id) ? d.rooms.filter(r => r !== id) : [...d.rooms, id],
    }))
  }

  // ── DesignOS: design configurator ──────────────────────────────────────
  if (step === 'design') {
    return (
      <div style={S.page} className="kb-font-body">
        <header style={S.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontFamily: 'Fraunces', fontSize: 15, fontWeight: 500, letterSpacing: '0.12em' }}>KREOBOX</span>
            <span style={{ fontSize: 11, color: 'var(--kb-accent)', borderLeft: '1px solid var(--kb-line)', paddingLeft: 16, letterSpacing: '0.14em', textTransform: 'uppercase' as const, fontWeight: 700 }}>
              DesignOS · Studio
            </span>
            {draft.flatType && (
              <span style={{ fontSize: 11, color: 'var(--kb-ink-soft)', background: 'var(--kb-line)', padding: '2px 10px', borderRadius: 99 }}>
                {FLAT_TYPES.find(f => f.id === draft.flatType)?.label} · {draft.rooms.length} rooms
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { clearLead(); setStep('rooms') }} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--kb-line)', background: 'transparent', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
              ← Rooms
            </button>
          </div>
        </header>
        <div style={S.content}>
          {/* Merchandise placement header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'var(--kb-accent)', fontWeight: 700 }}>DesignOS · Step 3</div>
              <div style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>Place merchandise</div>
              <div style={{ fontSize: 13, color: 'var(--kb-ink-soft)', marginTop: 2 }}>Configure each room product below.</div>
            </div>
            {draft.rooms.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                {draft.rooms.map(r => {
                  const room = ROOM_OPTIONS.find(o => o.id === r)
                  return room ? (
                    <span key={r} style={{ fontSize: 11, padding: '3px 10px', background: 'var(--kb-accent)', color: '#fff', borderRadius: 99, fontWeight: 600 }}>
                      {room.icon} {room.label}
                    </span>
                  ) : null
                })}
              </div>
            )}
          </div>
          <DesignConfigurator
            lead={pendingLead}
            onBack={() => { clearLead(); setStep('rooms') }}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    )
  }

  // ── DesignOS: rooms selector ────────────────────────────────────────────
  if (step === 'rooms') {
    return (
      <div style={S.page} className="kb-font-body">
        <header style={S.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontFamily: 'Fraunces', fontSize: 15, fontWeight: 500, letterSpacing: '0.12em' }}>KREOBOX</span>
            <span style={{ fontSize: 11, color: 'var(--kb-accent)', borderLeft: '1px solid var(--kb-line)', paddingLeft: 16, letterSpacing: '0.14em', textTransform: 'uppercase' as const, fontWeight: 700 }}>
              DesignOS · New Project
            </span>
          </div>
          <button onClick={() => setStep('flat-type')} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--kb-line)', background: 'transparent', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
            ← Flat type
          </button>
        </header>
        <div style={{ ...S.content, maxWidth: 720 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'var(--kb-accent)', fontWeight: 700 }}>Step 2 of 3</div>
            <h2 style={{ fontSize: 32, fontWeight: 600, margin: '8px 0 4px', letterSpacing: '-0.02em' }}>Which rooms to furnish?</h2>
            <p style={{ fontSize: 13, color: 'var(--kb-ink-soft)' }}>
              {FLAT_TYPES.find(f => f.id === draft.flatType)?.label} · Select all that apply
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 32 }}>
            {ROOM_OPTIONS.map(room => {
              const active = draft.rooms.includes(room.id)
              return (
                <button
                  key={room.id}
                  onClick={() => toggleRoom(room.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px', borderRadius: 12, border: `2px solid ${active ? 'var(--kb-accent)' : 'var(--kb-line)'}`,
                    background: active ? 'rgba(201,100,66,0.06)' : 'var(--kb-paper)',
                    cursor: 'pointer', textAlign: 'left' as const, fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 22 }}>{room.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: active ? 'var(--kb-accent)' : 'var(--kb-ink)' }}>{room.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--kb-ink-soft)', marginTop: 1, textTransform: 'capitalize' as const }}>{room.type}</div>
                  </div>
                  {active && (
                    <span style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: 'var(--kb-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  )}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => draft.rooms.length > 0 && setStep('design')}
            disabled={draft.rooms.length === 0}
            style={{
              padding: '13px 32px', borderRadius: 10, border: 'none',
              background: draft.rooms.length > 0 ? 'var(--kb-accent)' : 'var(--kb-line)',
              color: draft.rooms.length > 0 ? '#fff' : 'var(--kb-ink-soft)',
              fontWeight: 700, fontSize: 14, cursor: draft.rooms.length > 0 ? 'pointer' : 'default',
              fontFamily: 'inherit', width: '100%',
            }}
          >
            Continue to Design → ({draft.rooms.length} room{draft.rooms.length !== 1 ? 's' : ''} selected)
          </button>
        </div>
      </div>
    )
  }

  // ── DesignOS: flat type selector ────────────────────────────────────────
  if (step === 'flat-type') {
    return (
      <div style={S.page} className="kb-font-body">
        <header style={S.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontFamily: 'Fraunces', fontSize: 15, fontWeight: 500, letterSpacing: '0.12em' }}>KREOBOX</span>
            <span style={{ fontSize: 11, color: 'var(--kb-accent)', borderLeft: '1px solid var(--kb-line)', paddingLeft: 16, letterSpacing: '0.14em', textTransform: 'uppercase' as const, fontWeight: 700 }}>
              DesignOS · New Project
            </span>
          </div>
          <button onClick={() => setStep('list')} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--kb-line)', background: 'transparent', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
            ← Back
          </button>
        </header>
        <div style={{ ...S.content, maxWidth: 720 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'var(--kb-accent)', fontWeight: 700 }}>Step 1 of 3</div>
            <h2 style={{ fontSize: 32, fontWeight: 600, margin: '8px 0 4px', letterSpacing: '-0.02em' }}>What type of flat?</h2>
            <p style={{ fontSize: 13, color: 'var(--kb-ink-soft)' }}>This sets the scope for DesignOS and merchandise planning.</p>
          </div>

          {/* Client details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--kb-ink-soft)', display: 'block', marginBottom: 6 }}>Client name</label>
              <input
                value={draft.clientName}
                onChange={e => setDraft(d => ({ ...d, clientName: e.target.value }))}
                placeholder="e.g. Ravi Sharma"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--kb-line)', background: 'var(--kb-paper)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--kb-ink-soft)', display: 'block', marginBottom: 6 }}>Phone</label>
              <input
                value={draft.clientPhone}
                onChange={e => setDraft(d => ({ ...d, clientPhone: e.target.value }))}
                placeholder="e.g. 98765 43210"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--kb-line)', background: 'var(--kb-paper)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 32 }}>
            {FLAT_TYPES.map(ft => {
              const active = draft.flatType === ft.id
              return (
                <button
                  key={ft.id}
                  onClick={() => setDraft(d => ({ ...d, flatType: ft.id, rooms: [] }))}
                  style={{
                    padding: '20px 16px', borderRadius: 12, border: `2px solid ${active ? 'var(--kb-accent)' : 'var(--kb-line)'}`,
                    background: active ? 'rgba(201,100,66,0.06)' : 'var(--kb-paper)',
                    cursor: 'pointer', textAlign: 'left' as const, fontFamily: 'inherit',
                    transition: 'all 0.15s', position: 'relative' as const,
                  }}
                >
                  {active && (
                    <span style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: '50%', background: 'var(--kb-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>✓</span>
                  )}
                  <div style={{ fontSize: 20, fontWeight: 700, color: active ? 'var(--kb-accent)' : 'var(--kb-ink)', letterSpacing: '-0.01em' }}>{ft.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--kb-ink-soft)', marginTop: 4 }}>{ft.desc}</div>
                </button>
              )
            })}
          </div>

          <button
            onClick={() => draft.flatType && setStep('rooms')}
            disabled={!draft.flatType}
            style={{
              padding: '13px 32px', borderRadius: 10, border: 'none',
              background: draft.flatType ? 'var(--kb-accent)' : 'var(--kb-line)',
              color: draft.flatType ? '#fff' : 'var(--kb-ink-soft)',
              fontWeight: 700, fontSize: 14, cursor: draft.flatType ? 'pointer' : 'default',
              fontFamily: 'inherit', width: '100%',
            }}
          >
            Select rooms →
          </button>
        </div>
      </div>
    )
  }

  // ── Contractor list view ────────────────────────────────────────────────
  return (
    <div style={S.page} className="kb-font-body">
      <header style={S.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: 'Fraunces', fontSize: 15, fontWeight: 500, letterSpacing: '0.12em' }}>KREOBOX</span>
          <span style={{ fontSize: 11, color: 'var(--kb-ink-soft)', borderLeft: '1px solid var(--kb-line)', paddingLeft: 16, letterSpacing: '0.14em', textTransform: 'uppercase' as const, fontWeight: 600 }}>
            Contractor
          </span>
        </div>
        <button
          onClick={() => setStep('flat-type')}
          className="kb-btn"
          style={{ padding: '8px 18px', borderRadius: 8, background: 'var(--kb-accent)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          + New project
        </button>
      </header>

      <div style={S.content}>
        {/* Two-pillar header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          {/* DesignOS pillar */}
          <div
            onClick={() => setStep('flat-type')}
            style={{ padding: '24px', borderRadius: 16, background: 'var(--kb-dark)', color: '#f0eee9', cursor: 'pointer', position: 'relative' as const, overflow: 'hidden' }}
          >
            <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(201,100,66,0.9)', fontWeight: 700, marginBottom: 8 }}>Pillar 1</div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>DesignOS</div>
            <div style={{ fontSize: 12, color: 'rgba(240,238,233,0.55)', lineHeight: 1.5, marginBottom: 20 }}>
              Start with flat type → select rooms → design layout → place merchandise
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 8, background: 'var(--kb-accent)', color: '#fff', fontSize: 13, fontWeight: 700 }}>
              Start new project →
            </div>
            {/* decorative */}
            <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(201,100,66,0.08)' }} />
          </div>

          {/* Merchandise pillar */}
          <div style={{ padding: '24px', borderRadius: 16, background: 'var(--kb-paper)', border: '1px solid var(--kb-line)', position: 'relative' as const, overflow: 'hidden' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'var(--kb-accent)', fontWeight: 700, marginBottom: 8 }}>Pillar 2</div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Merchandise</div>
            <div style={{ fontSize: 12, color: 'var(--kb-ink-soft)', lineHeight: 1.5, marginBottom: 20 }}>
              Track order lifecycle · Cut-list → Factory → Dispatch → Install
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <KPI label="Active" value={orders.filter(o => !['Installed', 'Dispatched'].includes(o.stage)).length} />
              <KPI label="Confirmed" value={orders.filter(o => o.stage === 'Confirmed').length} />
              <KPI label="GMV" value={inr(orders.reduce((s, o) => s + o.total, 0))} mono accent />
            </div>
          </div>
        </div>

        {/* Orders table */}
        <div style={{ background: 'var(--kb-paper)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--kb-line)' }}>
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--kb-line)', background: 'var(--kb-bg)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>Merchandise orders</div>
            <div className="kb-font-mono" style={{ fontSize: 11, color: 'var(--kb-ink-soft)' }}>{orders.length} total</div>
          </div>
          {orders.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' as const, color: 'var(--kb-ink-soft)', fontSize: 13 }}>
              No orders yet — start a DesignOS project to place merchandise.
            </div>
          ) : (
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
                    <td style={{ textTransform: 'capitalize' as const, fontSize: 12 }}>{o.type}</td>
                    <td className="kb-font-mono" style={{ fontSize: 12, color: 'var(--kb-ink-soft)' }}>{o.createdAt}</td>
                    <td><StagePill stage={o.stage} /></td>
                    <td className="kb-font-mono" style={{ textAlign: 'right' as const }}>{inr(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
