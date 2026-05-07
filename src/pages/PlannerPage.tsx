import { useState, useCallback } from 'react'
import { useKreoboxStore } from '../store/kreoboxStore'
import { inr, generatePanels } from '../data/catalog'
import type { KBOrder } from '../types/kreobox'

// ── constants ───────────────────────────────────────────────────────────────
const SCALE = 0.175  // mm → px

const FINISHES = [
  { id: 'S-WHITE',  label: 'White Matte',  hex: '#f0ede8', border: '#ccc8c0' },
  { id: 'S-STONE',  label: 'Stone Grey',   hex: '#9ea09e', border: '#7a7c7a' },
  { id: 'S-OAK',    label: 'Light Oak',    hex: '#c8a96e', border: '#a07840' },
  { id: 'S-WALNUT', label: 'Walnut',       hex: '#6b4c30', border: '#3e2c18' },
  { id: 'S-GLOSS',  label: 'White Gloss',  hex: '#f8f8f8', border: '#b8b8b8' },
  { id: 'S-MIRROR', label: 'Mirror',       hex: '#c8dce8', border: '#90b4c8' },
]

// ── frame catalog ────────────────────────────────────────────────────────────
const WARDROBE_FRAMES = [
  { id: 'W-450-2100', w: 450, h: 2100, d: 580, label: '450 mm', sublabel: '2100 H', price: 8200 },
  { id: 'W-600-2100', w: 600, h: 2100, d: 580, label: '600 mm', sublabel: '2100 H', price: 9600 },
  { id: 'W-750-2100', w: 750, h: 2100, d: 580, label: '750 mm', sublabel: '2100 H', price: 11400 },
  { id: 'W-900-2100', w: 900, h: 2100, d: 580, label: '900 mm', sublabel: '2100 H', price: 13200 },
  { id: 'W-450-2400', w: 450, h: 2400, d: 580, label: '450 mm', sublabel: '2400 H', price: 9000 },
  { id: 'W-600-2400', w: 600, h: 2400, d: 580, label: '600 mm', sublabel: '2400 H', price: 10800 },
  { id: 'W-750-2400', w: 750, h: 2400, d: 580, label: '750 mm', sublabel: '2400 H', price: 12600 },
  { id: 'W-900-2400', w: 900, h: 2400, d: 580, label: '900 mm', sublabel: '2400 H', price: 15000 },
]

const KITCHEN_FRAMES = [
  { id: 'K-B-300', w: 300, h: 720, d: 560, label: '300 mm', sublabel: 'Base', price: 4800 },
  { id: 'K-B-400', w: 400, h: 720, d: 560, label: '400 mm', sublabel: 'Base', price: 5800 },
  { id: 'K-B-500', w: 500, h: 720, d: 560, label: '500 mm', sublabel: 'Base', price: 6600 },
  { id: 'K-B-600', w: 600, h: 720, d: 560, label: '600 mm', sublabel: 'Base', price: 7800 },
  { id: 'K-B-900', w: 900, h: 720, d: 560, label: '900 mm', sublabel: 'Base', price: 10200 },
  { id: 'K-W-300', w: 300, h: 600, d: 320, label: '300 mm', sublabel: 'Wall', price: 3600 },
  { id: 'K-W-450', w: 450, h: 600, d: 320, label: '450 mm', sublabel: 'Wall', price: 4800 },
  { id: 'K-W-600', w: 600, h: 600, d: 320, label: '600 mm', sublabel: 'Wall', price: 5800 },
  { id: 'K-W-900', w: 900, h: 600, d: 320, label: '900 mm', sublabel: 'Wall', price: 8400 },
  { id: 'K-T-600', w: 600, h: 2100, d: 560, label: '600 mm', sublabel: 'Tall', price: 12000 },
  { id: 'K-T-900', w: 900, h: 2100, d: 560, label: '900 mm', sublabel: 'Tall', price: 15600 },
]

const OFFICE_FRAMES = [
  { id: 'O-D-1200', w: 1200, h: 750, d: 600, label: '1200 mm', sublabel: 'Desk', price: 18000 },
  { id: 'O-D-1500', w: 1500, h: 750, d: 600, label: '1500 mm', sublabel: 'Desk', price: 22000 },
  { id: 'O-D-1800', w: 1800, h: 750, d: 600, label: '1800 mm', sublabel: 'Desk', price: 26000 },
  { id: 'O-S-800',  w: 800,  h: 1800, d: 400, label: '800 mm',  sublabel: 'Storage', price: 14000 },
  { id: 'O-S-1200', w: 1200, h: 1800, d: 400, label: '1200 mm', sublabel: 'Storage', price: 19000 },
  { id: 'O-P-2D',   w: 400,  h: 720,  d: 560, label: '400 mm',  sublabel: 'Pedestal', price: 7200 },
  { id: 'O-M-4P',   w: 1800, h: 750,  d: 900, label: '1800 mm', sublabel: 'Meeting', price: 32000 },
  { id: 'O-M-6P',   w: 2400, h: 750,  d: 900, label: '2400 mm', sublabel: 'Meeting', price: 44000 },
]

// ── organizer catalog ────────────────────────────────────────────────────────
const ORGANIZERS_BY_TYPE: Record<string, Organizer[]> = {
  wardrobe: [
    { id: 'shelf',     label: 'Fixed shelf',      hMm: 18,  price: 800,  icon: '─',  color: '#8B7355' },
    { id: 'adj-shelf', label: 'Adj. shelf',        hMm: 18,  price: 950,  icon: '╌',  color: '#8B7355' },
    { id: 'rail',      label: 'Hanging rail',      hMm: 50,  price: 1200, icon: '⊤',  color: '#7A9BB5' },
    { id: 'drawer-sm', label: 'Drawer (150)',       hMm: 150, price: 2400, icon: '▭',  color: '#6B8EA8' },
    { id: 'drawer-lg', label: 'Drawer (200)',       hMm: 200, price: 2900, icon: '▬',  color: '#6B8EA8' },
    { id: 'trouser',   label: 'Trouser rack',       hMm: 80,  price: 1800, icon: '≡',  color: '#7A9BB5' },
    { id: 'shoe',      label: 'Shoe shelf',         hMm: 120, price: 1400, icon: '◻',  color: '#8B8B8B' },
    { id: 'divider',   label: 'Vertical divider',   hMm: 0,   price: 600,  icon: '|',  color: '#8B7355' },
  ],
  kitchen: [
    { id: 'shelf',      label: 'Fixed shelf',       hMm: 18,  price: 800,  icon: '─', color: '#8B7355' },
    { id: 'drawer-sm',  label: 'Drawer (150)',       hMm: 150, price: 2200, icon: '▭', color: '#6B8EA8' },
    { id: 'bottle',     label: 'Bottle pull-out',    hMm: 600, price: 3200, icon: '⬸', color: '#7A9BB5' },
    { id: 'cutlery',    label: 'Cutlery tray',       hMm: 60,  price: 900,  icon: '≈', color: '#8B8B8B' },
    { id: 'plate',      label: 'Plate rack',         hMm: 180, price: 1600, icon: '⊞', color: '#8B8B8B' },
  ],
  office: [
    { id: 'shelf',     label: 'Fixed shelf',         hMm: 18,  price: 800,  icon: '─', color: '#8B7355' },
    { id: 'drawer-sm', label: 'Drawer (150)',         hMm: 150, price: 2400, icon: '▭', color: '#6B8EA8' },
    { id: 'cable',     label: 'Cable grommet',        hMm: 0,   price: 400,  icon: '◎', color: '#8B8B8B' },
    { id: 'monitor',   label: 'Monitor arm slot',     hMm: 0,   price: 600,  icon: '⊙', color: '#8B8B8B' },
  ],
}

// ── types ────────────────────────────────────────────────────────────────────
interface Organizer { id: string; label: string; hMm: number; price: number; icon: string; color: string }

interface PlacedUnit {
  uid: string
  frameId: string
  w: number; h: number; d: number
  finish: string
  label: string
  price: number
  organizers: Array<{ id: string; uid: string; label: string; hMm: number; price: number; color: string; icon: string }>
}

type ProductKind = 'wardrobe' | 'kitchen' | 'office'

// ── helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 8)

function px(mm: number) { return mm * SCALE }

// ── main component ────────────────────────────────────────────────────────────
export default function PlannerPage() {
  const addOrder = useKreoboxStore(s => s.addOrder)
  const showToast = useKreoboxStore(s => s.showToast)

  const [kind, setKind] = useState<ProductKind>('wardrobe')
  const [units, setUnits] = useState<PlacedUnit[]>([])
  const [selectedUid, setSelectedUid] = useState<string | null>(null)
  const [globalFinish, setGlobalFinish] = useState('S-WHITE')
  const [showOrder, setShowOrder] = useState(false)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')

  const frames = kind === 'kitchen' ? KITCHEN_FRAMES : kind === 'office' ? OFFICE_FRAMES : WARDROBE_FRAMES
  const organizers = ORGANIZERS_BY_TYPE[kind]
  const selectedUnit = units.find(u => u.uid === selectedUid) ?? null

  const totalWidth = units.reduce((s, u) => s + u.w, 0)
  const totalPrice = units.reduce((s, u) => s + u.price + u.organizers.reduce((a, o) => a + o.price, 0), 0)
  const maxHeight = units.length ? Math.max(...units.map(u => u.h)) : 2100

  const addFrame = useCallback((f: typeof frames[0]) => {
    const nu: PlacedUnit = {
      uid: uid(), frameId: f.id,
      w: f.w, h: f.h, d: f.d,
      finish: globalFinish,
      label: f.label, price: f.price,
      organizers: [],
    }
    setUnits(u => [...u, nu])
    setSelectedUid(nu.uid)
  }, [globalFinish])

  const addOrganizer = useCallback((o: Organizer) => {
    if (!selectedUid) return
    setUnits(u => u.map(unit =>
      unit.uid !== selectedUid ? unit : {
        ...unit,
        organizers: [...unit.organizers, { ...o, uid: uid() }],
      }
    ))
  }, [selectedUid])

  const removeOrganizer = (unitUid: string, orgUid: string) => {
    setUnits(u => u.map(unit =>
      unit.uid !== unitUid ? unit : { ...unit, organizers: unit.organizers.filter(o => o.uid !== orgUid) }
    ))
  }

  const removeUnit = (unitUid: string) => {
    setUnits(u => u.filter(x => x.uid !== unitUid))
    if (selectedUid === unitUid) setSelectedUid(null)
  }

  const applyFinishToAll = (finish: string) => {
    setGlobalFinish(finish)
    setUnits(u => u.map(x => ({ ...x, finish })))
  }

  const applyFinishToSelected = (finish: string) => {
    if (!selectedUid) { applyFinishToAll(finish); return }
    setUnits(u => u.map(x => x.uid !== selectedUid ? x : { ...x, finish }))
  }

  const placeOrder = () => {
    if (!units.length) return
    const orderId = 'ORD-' + Math.floor(1050 + Math.random() * 900)
    const frameIds = units.map(u => u.frameId)
    const config = {
      type: kind,
      wallWidth: totalWidth,
      height: maxHeight,
      frames: frameIds,
      walls: [],
      shutter: globalFinish,
      preset: 'PLANNER',
    }
    const order: KBOrder = {
      id: orderId,
      customer: { name: clientName || 'Showroom client', phone: clientPhone || '—', city: 'Bengaluru', area: '—' },
      contractor: 'Suresh Modulars',
      type: kind,
      config,
      advance: Math.round(totalPrice * 0.35),
      total: totalPrice,
      stage: 'Quoted',
      createdAt: new Date().toISOString().slice(0, 10),
      panels: generatePanels(config as any),
    }
    addOrder(order)
    showToast(`Order ${orderId} created · ₹${inr(totalPrice)}`)
    setShowOrder(false)
    setUnits([])
    setSelectedUid(null)
  }

  // canvas height in px (plus floor padding)
  const canvasH = px(maxHeight) + 60
  const canvasW = Math.max(px(totalWidth) + 120, 500)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1a1815', color: '#e8e6e1', fontFamily: '"Inter Tight", sans-serif' }}>

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <header style={{ height: 52, display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <span style={{ fontFamily: 'Fraunces', fontSize: 15, fontWeight: 500, letterSpacing: '0.12em' }}>KREOBOX</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: 14, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>DesignOS · Planner</span>

        {/* Kind tabs */}
        <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          {(['wardrobe', 'kitchen', 'office'] as ProductKind[]).map(k => (
            <button key={k} onClick={() => { setKind(k); setUnits([]); setSelectedUid(null) }}
              style={{ padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
                background: kind === k ? '#c96442' : 'transparent', color: kind === k ? '#fff' : 'rgba(255,255,255,0.5)',
                border: `1px solid ${kind === k ? '#c96442' : 'rgba(255,255,255,0.15)'}` }}>
              {k}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{units.length} unit{units.length !== 1 ? 's' : ''} · {totalWidth}mm wide</span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#c96442', fontWeight: 600 }}>{inr(totalPrice)}</span>
          <button onClick={() => setShowOrder(true)} disabled={units.length === 0}
            style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: units.length ? '#c96442' : 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: units.length ? 'pointer' : 'default', fontFamily: 'inherit' }}>
            Order →
          </button>
        </div>
      </header>

      {/* ── Main area ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left sidebar: frames ──────────────────────────────────── */}
        <aside style={{ width: 180, borderRight: '1px solid rgba(255,255,255,0.08)', overflowY: 'auto', flexShrink: 0, padding: '12px 0' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', padding: '0 12px', marginBottom: 10 }}>Add unit</div>
          {frames.map(f => (
            <button key={f.id} onClick={() => addFrame(f)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none', background: 'transparent', color: '#e8e6e1', cursor: 'pointer', fontFamily: 'inherit', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.12s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,100,66,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Mini unit preview */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 6 }}>
                <div style={{
                  width: Math.round((f.w / 900) * 44 + 8), height: Math.round((f.h / 2400) * 44 + 8),
                  background: FINISHES.find(x => x.id === globalFinish)?.hex ?? '#f0ede8',
                  border: `1.5px solid ${FINISHES.find(x => x.id === globalFinish)?.border ?? '#ccc8c0'}`,
                  borderRadius: 2, flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{f.label}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{f.sublabel}</div>
                  <div style={{ fontSize: 10, color: '#c96442', fontFamily: 'JetBrains Mono', marginTop: 2 }}>{inr(f.price)}</div>
                </div>
              </div>
            </button>
          ))}

          {/* Finish swatches */}
          <div style={{ padding: '12px 14px 0', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>Finish</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {FINISHES.map(f => (
                <button key={f.id} title={f.label} onClick={() => applyFinishToSelected(f.id)}
                  style={{ width: 24, height: 24, borderRadius: 4, background: f.hex, border: `2px solid ${globalFinish === f.id ? '#c96442' : f.border}`, cursor: 'pointer', padding: 0 }} />
              ))}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>
              {FINISHES.find(x => x.id === globalFinish)?.label}
            </div>
          </div>
        </aside>

        {/* ── Center canvas ──────────────────────────────────────────── */}
        <main style={{ flex: 1, overflowX: 'auto', overflowY: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '40px 40px 0', background: '#141210' }}>
          {units.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', paddingBottom: 80 }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>+</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Add a unit from the left panel</div>
              <div style={{ fontSize: 12, marginTop: 6, opacity: 0.7 }}>Click any frame size to place it on the canvas</div>
            </div>
          ) : (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', paddingBottom: 44 }}>
              {/* Wall & floor lines */}
              <svg style={{ position: 'absolute', top: 0, left: -20, width: canvasW + 40, height: canvasH, pointerEvents: 'none', overflow: 'visible' }}>
                {/* Floor */}
                <line x1={0} y1={canvasH - 44} x2={canvasW + 40} y2={canvasH - 44} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
                {/* Wall left */}
                <line x1={20} y1={0} x2={20} y2={canvasH - 44} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} strokeDasharray="4 4" />
                {/* Dimension line */}
                <line x1={20} y1={canvasH - 20} x2={20 + px(totalWidth)} y2={canvasH - 20} stroke="rgba(255,255,255,0.3)" strokeWidth={1} markerEnd="url(#arrow)" />
                <text x={20 + px(totalWidth) / 2} y={canvasH - 6} fill="rgba(255,255,255,0.45)" fontSize={10} textAnchor="middle" fontFamily="JetBrains Mono">{totalWidth} mm</text>
                <defs>
                  <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,0.3)" />
                  </marker>
                </defs>
              </svg>

              {/* Units */}
              {units.map(unit => (
                <UnitBlock
                  key={unit.uid}
                  unit={unit}
                  selected={unit.uid === selectedUid}
                  maxHeight={maxHeight}
                  onClick={() => setSelectedUid(unit.uid === selectedUid ? null : unit.uid)}
                  onRemove={() => removeUnit(unit.uid)}
                />
              ))}
            </div>
          )}
        </main>

        {/* ── Right sidebar: organizers + selected ───────────────────── */}
        <aside style={{ width: 220, borderLeft: '1px solid rgba(255,255,255,0.08)', overflowY: 'auto', flexShrink: 0 }}>
          {selectedUnit ? (
            <div>
              {/* Selected unit info */}
              <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(201,100,66,0.08)' }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c96442', marginBottom: 4 }}>Selected unit</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{selectedUnit.w} × {selectedUnit.h} mm</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                  {FINISHES.find(f => f.id === selectedUnit.finish)?.label}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <button onClick={() => removeUnit(selectedUnit.uid)}
                    style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(255,80,80,0.3)', background: 'rgba(255,80,80,0.1)', color: '#ff8080', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                    × Remove
                  </button>
                  {/* Finish swatches for this unit */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    {FINISHES.map(f => (
                      <button key={f.id} title={f.label} onClick={() => applyFinishToSelected(f.id)}
                        style={{ width: 18, height: 18, borderRadius: 3, background: f.hex, border: `2px solid ${selectedUnit.finish === f.id ? '#c96442' : f.border}`, cursor: 'pointer', padding: 0 }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Add organizers */}
              <div style={{ padding: '10px 0' }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', padding: '0 14px', marginBottom: 8 }}>Add organizer</div>
                {organizers.map(o => (
                  <button key={o.id} onClick={() => addOrganizer(o)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 14px', border: 'none', background: 'transparent', color: '#e8e6e1', cursor: 'pointer', fontFamily: 'inherit', borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'left' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,100,66,0.10)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ width: 24, height: 24, borderRadius: 4, background: o.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: o.color, flexShrink: 0, fontFamily: 'monospace' }}>{o.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{o.label}</div>
                      <div style={{ fontSize: 10, color: '#c96442', fontFamily: 'JetBrains Mono' }}>+{inr(o.price)}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Current organizers in this unit */}
              {selectedUnit.organizers.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '10px 14px' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>Inside this unit</div>
                  {selectedUnit.organizers.map(o => (
                    <div key={o.uid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{o.label}</span>
                      <button onClick={() => removeOrganizer(selectedUnit.uid, o.uid)}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,80,80,0.6)', cursor: 'pointer', fontSize: 14, padding: '0 2px' }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: 20, color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', marginTop: 40 }}>
              <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.4 }}>↖</div>
              Click any unit on the canvas to configure its internals
            </div>
          )}
        </aside>
      </div>

      {/* ── Order modal ───────────────────────────────────────────────── */}
      {showOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setShowOrder(false)}>
          <div style={{ background: '#fafaf7', color: '#1c1a16', borderRadius: 16, width: 480, maxHeight: '90vh', overflowY: 'auto', padding: 32 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c96442', fontWeight: 700, marginBottom: 8 }}>Place order</div>
            <h2 style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 400, margin: '0 0 20px' }}>Confirm your design</h2>

            {/* BOQ */}
            <div style={{ background: '#f5f3ee', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
              {units.map((u, i) => (
                <div key={u.uid} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0', borderBottom: i < units.length - 1 ? '1px solid #e8e5df' : 'none' }}>
                  <span style={{ color: '#4a463f' }}>{u.w}mm {u.label} frame {u.organizers.length > 0 && `+ ${u.organizers.length} org.`}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{inr(u.price + u.organizers.reduce((s, o) => s + o.price, 0))}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, marginTop: 10, paddingTop: 10, borderTop: '2px solid #e8e5df' }}>
                <span>Total</span>
                <span style={{ fontFamily: 'JetBrains Mono', color: '#c96442' }}>{inr(totalPrice)}</span>
              </div>
              <div style={{ fontSize: 11, color: '#7a7672', marginTop: 4 }}>Advance (35%): {inr(Math.round(totalPrice * 0.35))}</div>
            </div>

            {/* Client details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Client name', value: clientName, set: setClientName, ph: 'e.g. Ravi Sharma' },
                { label: 'Phone', value: clientPhone, set: setClientPhone, ph: '98765 43210' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a7672', display: 'block', marginBottom: 5 }}>{f.label}</label>
                  <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e8e5df', background: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>

            <button onClick={placeOrder}
              style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: '#c96442', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
              Confirm & place order →
            </button>
            <button onClick={() => setShowOrder(false)}
              style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #e8e5df', background: 'transparent', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginTop: 10, color: '#7a7672' }}>
              Back to design
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Unit SVG block ─────────────────────────────────────────────────────────
function UnitBlock({ unit, selected, maxHeight, onClick, onRemove }: {
  unit: PlacedUnit
  selected: boolean
  maxHeight: number
  onClick: () => void
  onRemove: () => void
}) {
  const w = px(unit.w)
  const h = px(unit.h)
  const baseY = px(maxHeight) - h  // align to floor
  const finish = FINISHES.find(f => f.id === unit.finish) ?? FINISHES[0]

  // compute organizer positions (stack from bottom up)
  const orgItems: Array<{ y: number; oh: number; color: string; icon: string; label: string }> = []
  let cursor = h - 10  // start near bottom
  ;[...unit.organizers].reverse().forEach(o => {
    const oh = o.hMm === 0 ? 10 : px(o.hMm)
    const y = cursor - oh
    orgItems.unshift({ y, oh, color: o.color, icon: o.icon, label: o.label })
    cursor = y - 8
  })

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        cursor: 'pointer',
        marginTop: baseY,
        flexShrink: 0,
        transition: 'transform 0.15s',
        transform: selected ? 'translateY(-4px)' : 'none',
      }}
    >
      <svg width={w} height={h} style={{ display: 'block', filter: selected ? 'drop-shadow(0 0 12px rgba(201,100,66,0.6))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
        {/* Frame body */}
        <rect x={0} y={0} width={w} height={h} fill={finish.hex} stroke={selected ? '#c96442' : finish.border} strokeWidth={selected ? 2.5 : 1.5} rx={1} />

        {/* Door split line (center vertical) */}
        {unit.w >= 600 ? (
          <>
            <line x1={w / 2} y1={6} x2={w / 2} y2={h - 6} stroke={finish.border} strokeWidth={1} opacity={0.6} />
            {/* Left door handle */}
            <line x1={w / 2 - 14} y1={h / 2 - 12} x2={w / 2 - 14} y2={h / 2 + 12} stroke={finish.border} strokeWidth={2.5} strokeLinecap="round" />
            {/* Right door handle */}
            <line x1={w / 2 + 14} y1={h / 2 - 12} x2={w / 2 + 14} y2={h / 2 + 12} stroke={finish.border} strokeWidth={2.5} strokeLinecap="round" />
          </>
        ) : (
          /* Single door handle */
          <line x1={w / 2} y1={h / 2 - 14} x2={w / 2} y2={h / 2 + 14} stroke={finish.border} strokeWidth={2.5} strokeLinecap="round" />
        )}

        {/* Top panel */}
        <rect x={2} y={2} width={w - 4} height={12} fill={finish.border} opacity={0.3} rx={0} />
        {/* Bottom panel */}
        <rect x={2} y={h - 14} width={w - 4} height={12} fill={finish.border} opacity={0.3} rx={0} />

        {/* Organizers (visible through door as ghost lines) */}
        {orgItems.map((o, i) => (
          <g key={i} opacity={0.7}>
            {o.oh <= 10 ? (
              /* Shelf: thin horizontal line */
              <line x1={8} y1={o.y} x2={w - 8} y2={o.y} stroke={o.color} strokeWidth={2} />
            ) : (
              /* Drawer / organizer: filled rect */
              <rect x={8} y={o.y} width={w - 16} height={o.oh} fill={o.color} opacity={0.2} rx={2} stroke={o.color} strokeWidth={1} />
            )}
          </g>
        ))}

        {/* Selected highlight overlay */}
        {selected && <rect x={0} y={0} width={w} height={h} fill="rgba(201,100,66,0.06)" rx={1} />}

        {/* Dimension label */}
        <text x={w / 2} y={h - 18} fontSize={9} fill={finish.border} textAnchor="middle" fontFamily="JetBrains Mono" opacity={0.8}>{unit.w}</text>
      </svg>

      {/* Remove button (shows on hover / when selected) */}
      {selected && (
        <button
          onClick={e => { e.stopPropagation(); onRemove() }}
          style={{ position: 'absolute', top: -10, right: -10, width: 22, height: 22, borderRadius: '50%', background: '#ff5050', border: 'none', color: '#fff', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, lineHeight: 1, zIndex: 10 }}
        >×</button>
      )}
    </div>
  )
}
