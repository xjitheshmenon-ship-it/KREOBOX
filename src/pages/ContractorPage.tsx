import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useKreoboxStore } from '../store/kreoboxStore'
import { inr, generatePanels } from '../data/catalog'
import type { KBOrder, Lead, OrderConfig, RoomConfig } from '../types/kreobox'
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

type ProjectKind = 'home' | 'office'

const HOME_TYPES = [
  { id: '1bhk', label: '1 BHK', desc: '1 bed · 1 bath' },
  { id: '2bhk', label: '2 BHK', desc: '2 bed · 2 bath' },
  { id: '3bhk', label: '3 BHK', desc: '3 bed · 2 bath' },
  { id: '4bhk', label: '4 BHK', desc: '4 bed · 3 bath' },
  { id: 'villa', label: 'Villa', desc: 'Duplex / Row house' },
  { id: 'penthouse', label: 'Penthouse', desc: 'Luxury floor unit' },
]

const OFFICE_TYPES = [
  { id: 'startup', label: 'Startup Pod', desc: '4–10 seats · open' },
  { id: 'smb', label: 'SMB Office', desc: '10–30 seats' },
  { id: 'enterprise', label: 'Enterprise Floor', desc: '30+ seats' },
  { id: 'cabin', label: 'Director Cabin', desc: 'Private executive' },
  { id: 'cowork', label: 'Co-working', desc: 'Shared / flexi-desk' },
  { id: 'showroom', label: 'Showroom / Retail', desc: 'Display + workspace' },
]

const HOME_ROOMS = [
  { id: 'master-wardrobe', label: 'Master Wardrobe',    icon: '🚪', type: 'wardrobe' as const },
  { id: 'bed2-wardrobe',   label: 'Bedroom 2 Wardrobe', icon: '🚪', type: 'wardrobe' as const },
  { id: 'bed3-wardrobe',   label: 'Bedroom 3 Wardrobe', icon: '🚪', type: 'wardrobe' as const },
  { id: 'kitchen',         label: 'Kitchen',             icon: '🍳', type: 'kitchen'  as const },
  { id: 'kids-wardrobe',   label: "Kids' Wardrobe",      icon: '🎒', type: 'wardrobe' as const },
  { id: 'tv-unit',         label: 'TV Unit',             icon: '📺', type: 'wardrobe' as const },
  { id: 'crockery',        label: 'Crockery Unit',       icon: '🍽️', type: 'kitchen'  as const },
  { id: 'home-office',     label: 'Home Office Corner',  icon: '💼', type: 'office'   as const },
]

const OFFICE_ROOMS = [
  { id: 'workstations',  label: 'Workstations',     icon: '🖥️', type: 'office' as const },
  { id: 'cabin',         label: 'Director Cabin',   icon: '🪑', type: 'office' as const },
  { id: 'meeting-room',  label: 'Meeting Room',     icon: '🤝', type: 'office' as const },
  { id: 'reception',     label: 'Reception Desk',   icon: '🏢', type: 'office' as const },
  { id: 'storage-wall',  label: 'Storage Wall',     icon: '📦', type: 'office' as const },
  { id: 'pantry',        label: 'Pantry / Breakout',icon: '☕', type: 'kitchen' as const },
  { id: 'lounge',        label: 'Lounge Area',      icon: '🛋️', type: 'office' as const },
  { id: 'server-room',   label: 'Server / Print Bay',icon: '🖨️', type: 'office' as const },
]

interface ContractorPageProps {
  pendingLead: Lead | null
  clearLead: () => void
}

type FlowStep = 'list' | 'kind' | 'flat-type' | 'rooms' | 'design' | 'summary'

interface ProjectDraft {
  kind: ProjectKind
  flatType: string
  rooms: string[]
  clientName: string
  clientPhone: string
}

const EMPTY_DRAFT: ProjectDraft = { kind: 'home', flatType: '', rooms: [], clientName: '', clientPhone: '' }

export default function ContractorPage({ pendingLead, clearLead }: ContractorPageProps) {
  const orders = useKreoboxStore(s => s.orders)
  const addOrder = useKreoboxStore(s => s.addOrder)
  const updateOrderStage = useKreoboxStore(s => s.updateOrderStage)
  const [step, setStep] = useState<FlowStep>(pendingLead ? 'design' : 'list')
  const [listTab, setListTab] = useState<'incoming' | 'active'>('incoming')
  const [draft, setDraft] = useState<ProjectDraft>(EMPTY_DRAFT)
  const [roomConfigs, setRoomConfigs] = useState<Record<string, { config: OrderConfig; total: number }>>({})
  const [activeRoomIdx, setActiveRoomIdx] = useState(0)

  useEffect(() => { if (pendingLead) setStep('design') }, [pendingLead])

  const roomOptions = draft.kind === 'office' ? OFFICE_ROOMS : HOME_ROOMS
  const typeOptions = draft.kind === 'office' ? OFFICE_TYPES : HOME_TYPES

  const toggleRoom = (id: string) =>
    setDraft(d => ({ ...d, rooms: d.rooms.includes(id) ? d.rooms.filter(r => r !== id) : [...d.rooms, id] }))

  // single-room path (pendingLead from customer catalog)
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
    setDraft(EMPTY_DRAFT)
    setStep('list')
  }

  // multi-room path: save each room config and advance
  const handleSaveRoom = (config: OrderConfig, total: number) => {
    const roomId = draft.rooms[activeRoomIdx]
    const updated = { ...roomConfigs, [roomId]: { config, total } }
    setRoomConfigs(updated)
    if (activeRoomIdx < draft.rooms.length - 1) {
      setActiveRoomIdx(prev => prev + 1)
    } else {
      setStep('summary')
    }
  }

  // create single project order from all room configs
  const handleCreateProjectOrder = () => {
    const rooms: RoomConfig[] = draft.rooms.map(roomId => {
      const meta = roomOptions.find(r => r.id === roomId)!
      const rc   = roomConfigs[roomId]
      return { roomId, roomLabel: meta.label, roomIcon: meta.icon, config: rc.config, total: rc.total }
    })
    const combinedTotal  = rooms.reduce((s, r) => s + r.total, 0)
    const primaryConfig  = rooms[0].config
    const combinedPanels = rooms.flatMap(r => generatePanels(r.config))
    const flatLabel      = typeOptions.find(t => t.id === draft.flatType)?.label

    const newOrder: KBOrder = {
      id: 'ORD-' + Math.floor(1050 + Math.random() * 900),
      customer: { name: draft.clientName || 'Walk-in client', phone: draft.clientPhone || '—', city: 'Bengaluru', area: '—' },
      contractor: 'Suresh Modulars',
      type: primaryConfig.type,
      config: primaryConfig,
      rooms,
      projectType: flatLabel,
      advance: Math.round(combinedTotal * 0.35),
      total: combinedTotal,
      stage: 'Confirmed',
      createdAt: new Date().toISOString().slice(0, 10),
      panels: combinedPanels,
    }
    addOrder(newOrder)
    clearLead()
    setDraft(EMPTY_DRAFT)
    setRoomConfigs({})
    setActiveRoomIdx(0)
    setStep('list')
  }

  const topbarLabel = (s: FlowStep) =>
    s === 'kind'      ? 'DesignOS · New Project' :
    s === 'flat-type' ? `DesignOS · ${draft.kind === 'office' ? 'Office' : 'Home'} Project` :
    s === 'rooms'     ? 'DesignOS · Select Rooms' :
    s === 'design'    ? 'DesignOS · Design & Place' :
    'DesignOS · Studio'

  // ── Multi-room design (new project flow) ──────────────────────────────
  if (step === 'design' && !pendingLead && draft.rooms.length > 0) {
    const activeRoomId   = draft.rooms[activeRoomIdx]
    const activeRoomMeta = roomOptions.find(r => r.id === activeRoomId)
    const isLastRoom     = activeRoomIdx === draft.rooms.length - 1
    const flatLabel      = typeOptions.find(t => t.id === draft.flatType)?.label ?? 'Project'
    const selectedRooms  = draft.rooms.map(id => roomOptions.find(r => r.id === id)!).filter(Boolean)
    const configuredTotal = Object.values(roomConfigs).reduce((s, rc) => s + rc.total, 0)

    return (
      <div style={{ ...S.page, display: 'flex', flexDirection: 'column', height: '100vh' }} className="kb-font-body">
        <header style={S.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontFamily: 'Fraunces', fontSize: 15, fontWeight: 500, letterSpacing: '0.12em' }}>KREOBOX</span>
            <span style={{ fontSize: 11, color: 'var(--kb-accent)', borderLeft: '1px solid var(--kb-line)', paddingLeft: 16, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>
              {flatLabel} · {activeRoomMeta?.icon} {activeRoomMeta?.label} ({activeRoomIdx + 1}/{draft.rooms.length})
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {Object.keys(roomConfigs).length > 0 && (
              <button onClick={() => setStep('summary')}
                style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(201,100,66,0.4)', background: 'rgba(201,100,66,0.08)', color: 'var(--kb-accent)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 700 }}>
                View summary ({Object.keys(roomConfigs).length} done) →
              </button>
            )}
            <button onClick={() => activeRoomIdx === 0 ? setStep('rooms') : setActiveRoomIdx(prev => prev - 1)} style={backBtnStyle}>
              ← {activeRoomIdx === 0 ? 'Room selection' : 'Previous room'}
            </button>
          </div>
        </header>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Room progress sidebar */}
          <div style={{ width: 220, borderRight: '1px solid var(--kb-line)', padding: '20px 14px', background: 'var(--kb-paper)', display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 700, marginBottom: 12 }}>Project rooms</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
              {selectedRooms.map((room, i) => {
                const done   = !!roomConfigs[room.id]
                const active = i === activeRoomIdx
                const rTotal = roomConfigs[room.id]?.total
                return (
                  <button key={room.id} onClick={() => setActiveRoomIdx(i)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 10px', borderRadius: 8, cursor: 'pointer',
                      border: active ? '2px solid var(--kb-accent)' : '1px solid transparent',
                      background: active ? 'rgba(201,100,66,0.06)' : done ? 'rgba(31,138,91,0.05)' : 'transparent',
                      textAlign: 'left', fontFamily: 'inherit' }}>
                    <span style={{ fontSize: 16 }}>{room.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: active ? 'var(--kb-accent)' : 'var(--kb-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{room.label}</div>
                      {rTotal ? (
                        <div style={{ fontSize: 10, color: '#1f8a5b', fontFamily: 'JetBrains Mono', marginTop: 1 }}>{inr(rTotal)}</div>
                      ) : (
                        <div style={{ fontSize: 10, color: 'var(--kb-ink-soft)', marginTop: 1 }}>{active ? 'Configuring…' : 'Pending'}</div>
                      )}
                    </div>
                    {done && <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#1f8a5b', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✓</span>}
                    {active && !done && <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--kb-accent)', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>→</span>}
                  </button>
                )
              })}
            </div>
            {configuredTotal > 0 && (
              <div style={{ marginTop: 16, padding: '12px', borderRadius: 8, background: 'var(--kb-bg)', border: '1px solid var(--kb-line)' }}>
                <div style={{ fontSize: 9, color: 'var(--kb-ink-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {Object.keys(roomConfigs).length}/{draft.rooms.length} configured
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 15, fontWeight: 700, color: 'var(--kb-accent)', marginTop: 4 }}>{inr(configuredTotal)}</div>
                <div style={{ fontSize: 9, color: 'var(--kb-ink-soft)', marginTop: 1 }}>running total</div>
              </div>
            )}
          </div>
          {/* Configurator area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
            <DesignConfigurator
              key={activeRoomId}
              lead={null}
              onBack={() => activeRoomIdx === 0 ? setStep('rooms') : setActiveRoomIdx(prev => prev - 1)}
              onConfirm={handleSaveRoom}
              confirmLabel={isLastRoom ? 'Save & review all rooms →' : `Save ${activeRoomMeta?.label ?? 'room'} & continue →`}
              roomContext={{ label: activeRoomMeta?.label ?? '', icon: activeRoomMeta?.icon ?? '', current: activeRoomIdx + 1, total: draft.rooms.length }}
            />
          </div>
        </div>
      </div>
    )
  }

  // ── Single-room design (pendingLead from customer catalog) ─────────────
  if (step === 'design') return (
    <div style={S.page} className="kb-font-body">
      <header style={S.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: 'Fraunces', fontSize: 15, fontWeight: 500, letterSpacing: '0.12em' }}>KREOBOX</span>
          <span style={{ fontSize: 11, color: 'var(--kb-accent)', borderLeft: '1px solid var(--kb-line)', paddingLeft: 16, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>
            {topbarLabel(step)}
          </span>
        </div>
        <button onClick={() => { clearLead(); setStep('rooms') }} style={backBtnStyle}>← Rooms</button>
      </header>
      <div style={S.content}>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--kb-accent)', fontWeight: 700 }}>Step 3 · Place merchandise</div>
            <div style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>Configure & price each space</div>
          </div>
          <Link to="/planner"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10,
              background: 'rgba(201,100,66,0.08)', border: '1.5px solid rgba(201,100,66,0.3)', color: 'var(--kb-accent)',
              textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x={3} y={3} width={18} height={18} rx={2}/><path d="M3 9h18M9 21V9"/>
            </svg>
            Open 3D Planner →
          </Link>
        </div>
        <DesignConfigurator lead={pendingLead} onBack={() => { clearLead(); setStep('rooms') }} onConfirm={handleConfirm} />
      </div>
    </div>
  )

  // ── Project summary — all rooms configured, single order ───────────────
  if (step === 'summary') {
    const selectedRooms  = draft.rooms.map(id => roomOptions.find(r => r.id === id)!).filter(Boolean)
    const combinedTotal  = Object.values(roomConfigs).reduce((s, rc) => s + rc.total, 0)
    const flatLabel      = typeOptions.find(t => t.id === draft.flatType)?.label ?? 'Project'
    const allConfigured  = draft.rooms.every(id => !!roomConfigs[id])
    return (
      <div style={S.page} className="kb-font-body">
        <header style={S.topbar}>
          <TitleBar label={`${flatLabel} · Project Summary`} />
          <button onClick={() => { setActiveRoomIdx(draft.rooms.length - 1); setStep('design') }} style={backBtnStyle}>← Edit rooms</button>
        </header>
        <div style={{ ...S.content, maxWidth: 860 }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'var(--kb-accent)', fontWeight: 700 }}>One project · One order</div>
            <h2 style={{ fontSize: 30, fontWeight: 600, margin: '6px 0 4px', letterSpacing: '-0.02em' }}>
              {draft.clientName || 'New project'} · {flatLabel}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--kb-ink-soft)' }}>
              {draft.rooms.length} spaces · all interconnected under one order that flows to factory, dispatch and site.
            </p>
          </div>

          {/* Per-room summary cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {selectedRooms.map((room, i) => {
              const rc = roomConfigs[room.id]
              return (
                <div key={room.id} style={{ background: 'var(--kb-paper)', borderRadius: 12, padding: '16px 20px', border: '1px solid var(--kb-line)', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 24 }}>{room.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{room.label}</div>
                    {rc ? (
                      <div style={{ fontSize: 12, color: 'var(--kb-ink-soft)', marginTop: 2 }}>
                        {rc.config.type} · {rc.config.wallWidth}mm wall · {rc.config.frames.length} frame{rc.config.frames.length !== 1 ? 's' : ''} · {rc.config.shutter} shutter
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: '#e8a820', marginTop: 2 }}>Not yet configured</div>
                    )}
                  </div>
                  {rc ? (
                    <div className="kb-font-mono" style={{ fontSize: 15, fontWeight: 700 }}>{inr(rc.total)}</div>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--kb-ink-soft)' }}>—</span>
                  )}
                  <button onClick={() => { setActiveRoomIdx(i); setStep('design') }}
                    style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--kb-line)', background: 'transparent', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: 'var(--kb-ink-soft)' }}>
                    {rc ? 'Edit' : 'Configure'}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Combined total */}
          <div style={{ background: 'rgba(201,100,66,0.06)', borderRadius: 14, padding: '22px 28px', border: '2px solid rgba(201,100,66,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'var(--kb-accent)' }}>Project total</div>
              <div style={{ fontSize: 12, color: 'var(--kb-ink-soft)', marginTop: 3 }}>
                {draft.rooms.length} spaces · supply + install · 35% advance = {inr(Math.round(combinedTotal * 0.35))}
              </div>
            </div>
            <div className="kb-font-display" style={{ fontSize: 40, fontWeight: 300, letterSpacing: '-0.02em' }}>{inr(combinedTotal)}</div>
          </div>

          {!allConfigured && (
            <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(232,168,32,0.1)', border: '1px solid rgba(232,168,32,0.3)', marginBottom: 16, fontSize: 13, color: '#7a6010' }}>
              Some rooms are not yet configured. Configure all rooms before confirming the order.
            </div>
          )}

          <PrimaryBtn disabled={!allConfigured} onClick={handleCreateProjectOrder}>
            Confirm project order — {inr(combinedTotal)} →
          </PrimaryBtn>
        </div>
      </div>
    )
  }

  // ── Room selector ──────────────────────────────────────────────────────
  if (step === 'rooms') return (
    <div style={S.page} className="kb-font-body">
      <header style={S.topbar}>
        <TitleBar label={topbarLabel(step)} />
        <button onClick={() => setStep('flat-type')} style={backBtnStyle}>← {draft.kind === 'office' ? 'Office type' : 'Flat type'}</button>
      </header>
      <div style={{ ...S.content, maxWidth: 720 }}>
        <StepHeader step="2" title="Which spaces to design?" sub={`${typeOptions.find(t => t.id === draft.flatType)?.label} · Select all that apply`} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 32 }}>
          {roomOptions.map(room => {
            const active = draft.rooms.includes(room.id)
            return (
              <button key={room.id} onClick={() => toggleRoom(room.id)} style={roomBtnStyle(active)}>
                <span style={{ fontSize: 22 }}>{room.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: active ? 'var(--kb-accent)' : 'var(--kb-ink)' }}>{room.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--kb-ink-soft)', marginTop: 1, textTransform: 'capitalize' }}>{room.type}</div>
                </div>
                {active && <CheckMark />}
              </button>
            )
          })}
        </div>
        <PrimaryBtn disabled={draft.rooms.length === 0} onClick={() => { setRoomConfigs({}); setActiveRoomIdx(0); setStep('design') }}>
          Configure each room → ({draft.rooms.length} space{draft.rooms.length !== 1 ? 's' : ''} selected)
        </PrimaryBtn>
      </div>
    </div>
  )

  // ── Space type selector ────────────────────────────────────────────────
  if (step === 'flat-type') return (
    <div style={S.page} className="kb-font-body">
      <header style={S.topbar}>
        <TitleBar label={topbarLabel(step)} />
        <button onClick={() => setStep('kind')} style={backBtnStyle}>← Project type</button>
      </header>
      <div style={{ ...S.content, maxWidth: 720 }}>
        <StepHeader step="2" title={draft.kind === 'office' ? 'What type of office?' : 'What type of flat?'} sub="This scopes the DesignOS project and merchandise plan." />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <Field label="Client / Company name" value={draft.clientName} onChange={v => setDraft(d => ({ ...d, clientName: v }))} placeholder={draft.kind === 'office' ? 'e.g. Acme Corp' : 'e.g. Ravi Sharma'} />
          <Field label="Phone" value={draft.clientPhone} onChange={v => setDraft(d => ({ ...d, clientPhone: v }))} placeholder="98765 43210" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 32 }}>
          {typeOptions.map(ft => {
            const active = draft.flatType === ft.id
            return (
              <button key={ft.id} onClick={() => setDraft(d => ({ ...d, flatType: ft.id, rooms: [] }))} style={typeBtnStyle(active)}>
                {active && <CheckMark abs />}
                <div style={{ fontSize: 20, fontWeight: 700, color: active ? 'var(--kb-accent)' : 'var(--kb-ink)', letterSpacing: '-0.01em' }}>{ft.label}</div>
                <div style={{ fontSize: 11, color: 'var(--kb-ink-soft)', marginTop: 4 }}>{ft.desc}</div>
              </button>
            )
          })}
        </div>
        <PrimaryBtn disabled={!draft.flatType} onClick={() => setStep('rooms')}>Select spaces →</PrimaryBtn>
      </div>
    </div>
  )

  // ── Project kind (home vs office) ──────────────────────────────────────
  if (step === 'kind') return (
    <div style={S.page} className="kb-font-body">
      <header style={S.topbar}>
        <TitleBar label="DesignOS · New Project" />
        <button onClick={() => setStep('list')} style={backBtnStyle}>← Studio</button>
      </header>
      <div style={{ ...S.content, maxWidth: 600 }}>
        <StepHeader step="1" title="What are you designing?" sub="DesignOS handles both home interiors and office spaces end-to-end." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 32 }}>
          {([
            { kind: 'home' as const, label: 'Home Interior', desc: 'Wardrobes · Kitchen · Living · Home office', icon: '🏠' },
            { kind: 'office' as const, label: 'Office Space', desc: 'Workstations · Cabins · Meeting rooms · Storage', icon: '🏢' },
          ]).map(({ kind, label, desc, icon }) => {
            const active = draft.kind === kind
            return (
              <button key={kind} onClick={() => setDraft(d => ({ ...d, kind, flatType: '', rooms: [] }))} style={{ ...typeBtnStyle(active), padding: '28px 22px' }}>
                {active && <CheckMark abs />}
                <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: active ? 'var(--kb-accent)' : 'var(--kb-ink)', letterSpacing: '-0.01em', marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--kb-ink-soft)', lineHeight: 1.5 }}>{desc}</div>
              </button>
            )
          })}
        </div>
        <PrimaryBtn disabled={false} onClick={() => setStep('flat-type')}>
          Continue →
        </PrimaryBtn>
      </div>
    </div>
  )

  // ── Studio list view ───────────────────────────────────────────────────
  const quoted   = orders.filter(o => o.stage === 'Quoted')
  const active   = orders.filter(o => o.stage !== 'Quoted')

  return (
    <div style={S.page} className="kb-font-body">
      <header style={S.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/contractor" style={{ fontFamily: 'Fraunces', fontSize: 15, fontWeight: 500, letterSpacing: '0.12em', color: 'inherit', textDecoration: 'none' }}>KREOBOX</Link>
          <span style={{ fontSize: 11, color: 'var(--kb-ink-soft)', borderLeft: '1px solid var(--kb-line)', paddingLeft: 16, letterSpacing: '0.14em', textTransform: 'uppercase' as const, fontWeight: 600 }}>DesignOS · Studio</span>
          {quoted.length > 0 && (
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: 'var(--kb-accent)', color: '#fff', fontWeight: 700 }}>
              {quoted.length} new {quoted.length === 1 ? 'order' : 'orders'}
            </span>
          )}
        </div>
        <button onClick={() => setStep('kind')} className="kb-btn" style={{ padding: '8px 18px', borderRadius: 8, background: 'var(--kb-accent)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          + New project
        </button>
      </header>

      <div style={S.content}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'var(--kb-accent)', fontWeight: 700 }}>DesignOS</div>
          <h1 className="kb-font-display" style={{ fontSize: 44, fontWeight: 300, letterSpacing: '-0.025em', margin: '6px 0 0', lineHeight: 0.95 }}>Studio</h1>
          <p style={{ fontSize: 13, marginTop: 10, color: 'var(--kb-ink-soft)' }}>Design homes and offices · Confirm orders · Send to factory.</p>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
          <KPI label="Awaiting confirmation" value={quoted.length} accent={quoted.length > 0} />
          <KPI label="In production" value={orders.filter(o => ['Confirmed','In Cut-list','Cut','Edge-banded'].includes(o.stage)).length} />
          <KPI label="At site" value={orders.filter(o => ['Dispatched','Installing'].includes(o.stage)).length} />
          <KPI label="GMV" value={inr(orders.reduce((s, o) => s + o.total, 0))} mono accent />
        </div>

        {/* Two entry points */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
          <ProjectKindCard kind="home" onClick={() => { setDraft(d => ({ ...d, kind: 'home' })); setStep('flat-type') }} />
          <ProjectKindCard kind="office" onClick={() => { setDraft(d => ({ ...d, kind: 'office' })); setStep('flat-type') }} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {([
            { id: 'incoming' as const, label: 'Incoming', count: quoted.length, alert: quoted.length > 0 },
            { id: 'active' as const, label: 'All projects', count: active.length, alert: false },
          ]).map(t => (
            <button key={t.id} onClick={() => setListTab(t.id)} style={{
              padding: '8px 16px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              background: listTab === t.id ? 'var(--kb-ink)' : 'transparent',
              color: listTab === t.id ? 'var(--kb-paper)' : 'var(--kb-ink-soft)',
              border: `1px solid ${listTab === t.id ? 'var(--kb-ink)' : 'var(--kb-line-2)'}`,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {t.label}
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, padding: '1px 6px', borderRadius: 99, background: t.alert ? 'var(--kb-accent)' : 'transparent', color: t.alert ? '#fff' : 'inherit' }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Incoming — quoted orders needing confirmation */}
        {listTab === 'incoming' && (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
            {quoted.length === 0 ? (
              <div style={{ background: 'var(--kb-paper)', borderRadius: 12, padding: '48px', textAlign: 'center' as const, color: 'var(--kb-ink-soft)', fontSize: 13, border: '1px solid var(--kb-line)' }}>
                No incoming orders — new customer orders appear here automatically.
              </div>
            ) : quoted.map(o => (
              <div key={o.id} style={{ background: 'var(--kb-paper)', borderRadius: 12, padding: '20px 24px', border: '2px solid rgba(201,100,66,0.3)', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span className="kb-font-mono" style={{ fontSize: 12 }}>{o.id}</span>
                    <StagePill stage={o.stage} />
                    <span style={{ fontSize: 11, textTransform: 'capitalize' as const, color: 'var(--kb-ink-soft)' }}>{o.type}</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{o.customer.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--kb-ink-soft)', marginTop: 2 }}>
                    {o.customer.phone} · {o.customer.area}, {o.customer.city}
                  </div>
                  {o.rooms ? (
                    <div style={{ fontSize: 12, color: 'var(--kb-ink-soft)', marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {o.rooms.map(r => (
                        <span key={r.roomId} style={{ padding: '1px 7px', borderRadius: 99, background: 'var(--kb-bg)', border: '1px solid var(--kb-line)', fontSize: 11 }}>
                          {r.roomIcon} {r.roomLabel}
                        </span>
                      ))}
                      <span style={{ fontSize: 11, color: 'var(--kb-ink-soft)' }}>· Advance: {inr(o.advance)}</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: 'var(--kb-ink-soft)', marginTop: 4 }}>
                      {o.config.frames.length} frame{o.config.frames.length !== 1 ? 's' : ''} · Advance paid: {inr(o.advance)}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' as const, marginRight: 16 }}>
                  <div className="kb-font-mono" style={{ fontSize: 16, fontWeight: 600 }}>{inr(o.total)}</div>
                  <div style={{ fontSize: 10, color: 'var(--kb-ink-soft)', marginTop: 2 }}>order value</div>
                  <div style={{ fontSize: 11, color: 'var(--kb-ink-soft)', marginTop: 4 }}>{o.createdAt}</div>
                </div>
                <button
                  onClick={() => updateOrderStage(o.id, 'Confirmed')}
                  style={{ padding: '12px 22px', borderRadius: 10, border: 'none', background: 'var(--kb-accent)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' as const }}
                >
                  Confirm & send to factory →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Active — all non-quoted orders */}
        {listTab === 'active' && (
          <div style={{ background: 'var(--kb-paper)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--kb-line)' }}>
            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--kb-line)', background: 'var(--kb-bg)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>All projects</div>
              <div className="kb-font-mono" style={{ fontSize: 11, color: 'var(--kb-ink-soft)' }}>{active.length} total</div>
            </div>
            {active.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center' as const, color: 'var(--kb-ink-soft)', fontSize: 13 }}>
                No active projects yet.
              </div>
            ) : (
              <table className="kb-crisp-table" style={{ width: '100%' }}>
                <thead><tr>
                  <th>Project ID</th><th>Client</th><th>Type</th><th>Created</th><th>Stage</th>
                  <th style={{ textAlign: 'right' }}>Value</th>
                </tr></thead>
                <tbody>
                  {active.map(o => (
                    <tr key={o.id} style={{ background: 'var(--kb-paper)' }}>
                      <td className="kb-font-mono" style={{ fontSize: 12 }}>{o.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{o.customer.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--kb-ink-soft)', marginTop: 1 }}>{o.customer.area}, {o.customer.city}</div>
                      </td>
                      <td style={{ fontSize: 12 }}>
                    <span style={{ textTransform: 'capitalize' as const }}>{o.projectType ?? o.type}</span>
                    {o.rooms && <span style={{ marginLeft: 5, fontSize: 10, padding: '1px 6px', borderRadius: 99, background: 'rgba(201,100,66,0.1)', color: 'var(--kb-accent)', fontWeight: 600 }}>{o.rooms.length} rooms</span>}
                  </td>
                      <td className="kb-font-mono" style={{ fontSize: 12, color: 'var(--kb-ink-soft)' }}>{o.createdAt}</td>
                      <td><StagePill stage={o.stage} /></td>
                      <td className="kb-font-mono" style={{ textAlign: 'right' as const }}>{inr(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Small reusable components ──────────────────────────────────────────────

function TitleBar({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <span style={{ fontFamily: 'Fraunces', fontSize: 15, fontWeight: 500, letterSpacing: '0.12em' }}>KREOBOX</span>
      <span style={{ fontSize: 11, color: 'var(--kb-accent)', borderLeft: '1px solid var(--kb-line)', paddingLeft: 16, letterSpacing: '0.14em', textTransform: 'uppercase' as const, fontWeight: 700 }}>{label}</span>
    </div>
  )
}

function StepHeader({ step, title, sub }: { step: string; title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'var(--kb-accent)', fontWeight: 700 }}>Step {step}</div>
      <h2 style={{ fontSize: 30, fontWeight: 600, margin: '6px 0 4px', letterSpacing: '-0.02em' }}>{title}</h2>
      <p style={{ fontSize: 13, color: 'var(--kb-ink-soft)' }}>{sub}</p>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--kb-ink-soft)', display: 'block', marginBottom: 6 }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--kb-line)', background: 'var(--kb-paper)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }} />
    </div>
  )
}

function PrimaryBtn({ children, disabled, onClick }: { children: React.ReactNode; disabled: boolean; onClick: () => void }) {
  return (
    <button onClick={() => !disabled && onClick()} disabled={disabled}
      style={{ padding: '13px 32px', borderRadius: 10, border: 'none', background: disabled ? 'var(--kb-line)' : 'var(--kb-accent)', color: disabled ? 'var(--kb-ink-soft)' : '#fff', fontWeight: 700, fontSize: 14, cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit', width: '100%' }}>
      {children}
    </button>
  )
}

function CheckMark({ abs }: { abs?: boolean }) {
  return (
    <span style={{ ...(abs ? { position: 'absolute' as const, top: 10, right: 10 } : { marginLeft: 'auto', flexShrink: 0 }), width: 20, height: 20, borderRadius: '50%', background: 'var(--kb-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>
  )
}

function ProjectKindCard({ kind, onClick }: { kind: ProjectKind; onClick: () => void }) {
  const isOffice = kind === 'office'
  return (
    <button onClick={onClick} style={{ padding: '24px', borderRadius: 14, border: '1px solid var(--kb-line)', background: 'var(--kb-paper)', cursor: 'pointer', textAlign: 'left' as const, fontFamily: 'inherit', transition: 'all 0.15s', position: 'relative' as const, overflow: 'hidden' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>{isOffice ? '🏢' : '🏠'}</div>
      <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>{isOffice ? 'Office Design' : 'Home Interior'}</div>
      <div style={{ fontSize: 12, color: 'var(--kb-ink-soft)', lineHeight: 1.5 }}>
        {isOffice ? 'Workstations · Cabins · Meeting · Storage' : 'Wardrobes · Kitchen · Living · Study'}
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: 'var(--kb-accent)', fontWeight: 600 }}>Start project →</div>
    </button>
  )
}

const backBtnStyle: React.CSSProperties = { padding: '7px 14px', borderRadius: 8, border: '1px solid var(--kb-line)', background: 'transparent', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }

const roomBtnStyle = (active: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: 12,
  padding: '14px 16px', borderRadius: 12, border: `2px solid ${active ? 'var(--kb-accent)' : 'var(--kb-line)'}`,
  background: active ? 'rgba(201,100,66,0.06)' : 'var(--kb-paper)',
  cursor: 'pointer', textAlign: 'left' as const, fontFamily: 'inherit', transition: 'all 0.15s',
})

const typeBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: '20px 16px', borderRadius: 12, border: `2px solid ${active ? 'var(--kb-accent)' : 'var(--kb-line)'}`,
  background: active ? 'rgba(201,100,66,0.06)' : 'var(--kb-paper)',
  cursor: 'pointer', textAlign: 'left' as const, fontFamily: 'inherit', transition: 'all 0.15s', position: 'relative' as const,
})
