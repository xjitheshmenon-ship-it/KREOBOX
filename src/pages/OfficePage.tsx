import { useState } from 'react'
import { CATALOG, SHUTTERS, inr, generatePanels } from '../data/catalog'
import Modal from '../components/kreobox/Modal'
import type { KBOrder, KBCustomer } from '../types/kreobox'
import { useKreoboxStore } from '../store/kreoboxStore'

const cat = CATALOG.office

const TYPE_LABELS: Record<string, string> = {
  desk: 'Straight Desk', 'l-desk': 'L-Desk', workstation: 'Workstation',
  pedestal: 'Pedestal', storage: 'Storage Wall', credenza: 'Credenza',
  meeting: 'Meeting Table', partition: 'Partition Panel',
}

const TYPE_ICONS: Record<string, string> = {
  desk: '🖥', 'l-desk': '📐', workstation: '👥', pedestal: '📦',
  storage: '📚', credenza: '🗄', meeting: '🪑', partition: '🧱',
}

const FINISH_LABELS: Record<string, { label: string; color: string; border: string }> = {
  'S-WHITE':  { label: 'White Matte',      color: '#F5F2EC', border: '#E0DACE' },
  'S-STONE':  { label: 'Stone Grey',        color: '#9E9C95', border: '#7A7872' },
  'S-OAK':    { label: 'Light Oak',         color: '#C7A678', border: '#9D7F4F' },
  'S-WALNUT': { label: 'Walnut',            color: '#5C3D26', border: '#3F2A19' },
  'S-GLOSS':  { label: 'White Gloss',       color: '#FFFFFF', border: '#D8D4CA' },
  'S-CHAMP':  { label: 'Champagne',         color: '#D9C9A8', border: '#A89673' },
}

const PACKAGES = [
  {
    id: 'PKG-CEO',
    label: 'Director Cabin',
    desc: 'Executive L-desk · Storage wall · 4-person meeting table · Pedestal',
    frameIds: ['O-L-2100', 'O-S-1600', 'O-M-4P', 'O-P-3D'],
    preset: 'OP-3',
    icon: '👔',
    badge: 'Most popular',
  },
  {
    id: 'PKG-OPEN',
    label: 'Open Office — 4 seats',
    desc: '4-seat back-to-back workstation · 4 pedestals · Storage credenza',
    frameIds: ['O-WS-4', 'O-P-3D', 'O-P-3D', 'O-P-3D', 'O-P-3D', 'O-C-1200'],
    preset: 'OP-4',
    icon: '🏢',
    badge: null,
  },
  {
    id: 'PKG-MTG',
    label: 'Meeting Room — 6P',
    desc: '6-person conference table · Credenza · Storage wall · Partition panels',
    frameIds: ['O-M-6P', 'O-C-1800', 'O-S-1200', 'O-PT-1800'],
    preset: 'OP-5',
    icon: '🤝',
    badge: null,
  },
  {
    id: 'PKG-HOME',
    label: 'Home Office',
    desc: '1500mm straight desk · Pedestal · Bookshelf · Cable management',
    frameIds: ['O-D-1500', 'O-P-2D', 'O-S-800'],
    preset: 'OP-2',
    icon: '🏠',
    badge: null,
  },
]

const TABS = ['All', 'Desks', 'Workstations', 'Storage', 'Meeting', 'Packages']
const TAB_TYPES: Record<string, string[]> = {
  Desks: ['desk', 'l-desk'],
  Workstations: ['workstation'],
  Storage: ['storage', 'pedestal', 'credenza', 'partition'],
  Meeting: ['meeting'],
}

function framePrice(ids: string[]) {
  return ids.reduce((s, id) => {
    const f = cat.frames.find(fr => fr.id === id)
    return s + (f?.price ?? 0)
  }, 0)
}

export default function OfficePage() {
  const [activeTab, setActiveTab] = useState('All')
  const [selectedFinish, setSelectedFinish] = useState('S-WHITE')
  const [configItem, setConfigItem] = useState<typeof cat.frames[0] | null>(null)
  const [configPkg, setConfigPkg] = useState<typeof PACKAGES[0] | null>(null)
  const [checkoutFlow, setCheckoutFlow] = useState<{ frames: string[]; preset: string; label: string; price: number } | null>(null)
  const addOrder = useKreoboxStore(s => s.addOrder)

  const visibleFrames = activeTab === 'All' || activeTab === 'Packages'
    ? cat.frames
    : cat.frames.filter(f => TAB_TYPES[activeTab]?.includes(f.type ?? ''))

  const finish = FINISH_LABELS[selectedFinish] ?? FINISH_LABELS['S-WHITE']

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f3', color: '#1a1815', fontFamily: '"Inter Tight", sans-serif' }}>

      {/* Top bar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(247,246,243,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(26,24,21,0.1)', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'Fraunces', fontSize: 15, fontWeight: 500, letterSpacing: '0.12em' }}>KREOBOX</span>
          <span style={{ fontSize: 11, color: '#4a463f', borderLeft: '1px solid rgba(26,24,21,0.1)', paddingLeft: 16, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>Office</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#4a463f', fontFamily: 'JetBrains Mono' }}>Finish:</span>
          {Object.entries(FINISH_LABELS).map(([id, f]) => (
            <button key={id} onClick={() => setSelectedFinish(id)} title={f.label} style={{ width: 18, height: 18, borderRadius: '50%', background: f.color, border: `2px solid ${selectedFinish === id ? '#c96442' : f.border}`, cursor: 'pointer', padding: 0 }} />
          ))}
          <span style={{ marginLeft: 8, fontSize: 11, color: '#4a463f' }}>{finish.label}</span>
        </div>
      </header>

      {/* Hero */}
      <div style={{ padding: '64px 40px 40px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c96442', fontWeight: 700, marginBottom: 14 }}>Kreo Office</div>
        <h1 style={{ fontFamily: 'Fraunces', fontSize: 64, fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.03em', margin: 0 }}>
          Office interiors,<br />
          <em style={{ fontStyle: 'italic', fontWeight: 400 }}>pre-cut and precise.</em>
        </h1>
        <p style={{ marginTop: 20, maxWidth: 520, fontSize: 15, lineHeight: 1.6, color: '#4a463f' }}>
          Desks, workstations, storage walls, conference tables — all from pre-cut laminated panels. Finish selection, BOQ, and install in one flow.
        </p>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px 80px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 32, paddingBottom: 20, borderBottom: '1px solid rgba(26,24,21,0.1)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '7px 16px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, background: activeTab === t ? '#1a1815' : 'transparent', color: activeTab === t ? '#fafaf7' : '#4a463f', border: activeTab === t ? '1px solid #1a1815' : '1px solid rgba(26,24,21,0.18)', cursor: 'pointer' }}>
              {t}
            </button>
          ))}
        </div>

        {/* Packages tab */}
        {activeTab === 'Packages' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {PACKAGES.map(pkg => {
              const total = framePrice(pkg.frameIds)
              const presetPrice = cat.presets.find(p => p.id === pkg.preset)?.price ?? 0
              const grandTotal = Math.round((total + presetPrice * pkg.frameIds.length + 6500) * 1.18)
              return (
                <div key={pkg.id} style={{ background: '#fff', border: '1px solid rgba(26,24,21,0.1)', borderRadius: 16, padding: 28, position: 'relative', cursor: 'pointer' }} onClick={() => { setConfigPkg(pkg); setCheckoutFlow({ frames: pkg.frameIds, preset: pkg.preset, label: pkg.label, price: grandTotal }) }}>
                  {pkg.badge && <span style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 999, background: '#c96442', color: '#fff' }}>{pkg.badge}</span>}
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{pkg.icon}</div>
                  <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500 }}>{pkg.label}</div>
                  <div style={{ fontSize: 13, color: '#4a463f', marginTop: 6, lineHeight: 1.5 }}>{pkg.desc}</div>
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(26,24,21,0.08)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4a463f', fontWeight: 600 }}>All-in incl. GST</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 600, marginTop: 2 }}>{inr(grandTotal)}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#c96442' }}>Configure →</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Frame grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {visibleFrames.map(frame => {
              const unitPrice = Math.round((frame.price + 4200 + 6500) * 1.18 / 1)
              return (
                <button key={frame.id} onClick={() => { setConfigItem(frame); setCheckoutFlow({ frames: [frame.id], preset: 'OP-1', label: `${TYPE_LABELS[frame.type ?? ''] ?? frame.id}`, price: unitPrice }) }} style={{ textAlign: 'left', background: '#fff', border: '1px solid rgba(26,24,21,0.1)', borderRadius: 14, padding: 20, cursor: 'pointer' }}>
                  {/* Mini preview */}
                  <div style={{ height: 120, background: '#ede9e2', borderRadius: 8, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    <OfficePreview type={frame.type ?? ''} finish={finish} />
                    <div style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: 'rgba(250,250,247,0.9)', color: '#4a463f' }}>
                      {TYPE_ICONS[frame.type ?? '']} {TYPE_LABELS[frame.type ?? ''] ?? frame.type}
                    </div>
                    <div style={{ position: 'absolute', bottom: 8, right: 8, width: 14, height: 14, borderRadius: '50%', background: finish.color, border: `2px solid ${finish.border}` }} />
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4a463f', marginBottom: 4 }}>{frame.id}</div>
                  <div style={{ fontFamily: 'Fraunces', fontSize: 17, fontWeight: 500 }}>
                    {(frame.w / 1000).toFixed(1)}m × {(frame.d / 1000).toFixed(2)}m
                    {frame.type !== 'partition' && ` × ${(frame.h / 1000).toFixed(2)}m H`}
                  </div>
                  <div style={{ fontSize: 12, color: '#4a463f', marginTop: 2 }}>{TYPE_LABELS[frame.type ?? ''] ?? frame.type}</div>
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(26,24,21,0.08)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 15, fontWeight: 500 }}>{inr(unitPrice)}</div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#c96442' }}>Quote →</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Checkout modal */}
      {checkoutFlow && (
        <CheckoutModal
          flow={checkoutFlow}
          finish={{ id: selectedFinish, ...finish }}
          onClose={() => { setCheckoutFlow(null); setConfigItem(null); setConfigPkg(null) }}
          onConfirm={(customer) => {
            const orderId = 'ORD-' + Math.floor(2000 + Math.random() * 900)
            const panels = generatePanels({ type: 'office', frames: checkoutFlow.frames, shutter: selectedFinish })
            const order: KBOrder = {
              id: orderId,
              customer,
              contractor: 'Unassigned',
              type: 'office',
              config: { type: 'office', wallWidth: 3600, height: 2400, frames: checkoutFlow.frames, walls: [], shutter: selectedFinish, preset: checkoutFlow.preset },
              advance: Math.round(checkoutFlow.price * 0.35),
              total: checkoutFlow.price,
              stage: 'Quoted',
              createdAt: new Date().toISOString().slice(0, 10),
              panels,
            }
            addOrder(order)
            setCheckoutFlow(null)
            setConfigItem(null)
            setConfigPkg(null)
            return orderId
          }}
        />
      )}
    </div>
  )
}

function OfficePreview({ type, finish }: { type: string; finish: { color: string; border: string } }) {
  const c = finish.color
  const b = finish.border
  if (type === 'desk' || type === 'l-desk') return (
    <svg viewBox="0 0 120 80" style={{ width: 80 }}>
      <rect x="10" y="40" width="100" height="8" rx="2" fill={c} stroke={b} strokeWidth="1"/>
      <rect x="12" y="48" width="5" height="25" rx="1" fill={b}/>
      <rect x="103" y="48" width="5" height="25" rx="1" fill={b}/>
      <rect x="15" y="30" width="90" height="10" rx="2" fill={b} opacity="0.4"/>
    </svg>
  )
  if (type === 'workstation') return (
    <svg viewBox="0 0 120 80" style={{ width: 90 }}>
      <rect x="5" y="32" width="110" height="6" rx="2" fill={c} stroke={b} strokeWidth="1"/>
      <rect x="5" y="38" width="110" height="6" rx="2" fill={c} stroke={b} strokeWidth="1" transform="scale(1,-1) translate(0,-76)"/>
      <line x1="60" y1="28" x2="60" y2="52" stroke={b} strokeWidth="1.5"/>
      <rect x="8" y="44" width="4" height="16" rx="1" fill={b}/>
      <rect x="108" y="44" width="4" height="16" rx="1" fill={b}/>
    </svg>
  )
  if (type === 'storage' || type === 'credenza') return (
    <svg viewBox="0 0 80 100" style={{ height: 80 }}>
      <rect x="8" y="5" width="64" height="90" rx="2" fill={c} stroke={b} strokeWidth="1.5"/>
      {[20, 38, 56, 74].map(y => <line key={y} x1="8" y1={y} x2="72" y2={y} stroke={b} strokeWidth="0.8" strokeOpacity="0.5"/>)}
      <circle cx="40" cy="14" r="2" fill={b}/>
      <circle cx="40" cy="29" r="2" fill={b}/>
      <circle cx="40" cy="47" r="2" fill={b}/>
    </svg>
  )
  if (type === 'pedestal') return (
    <svg viewBox="0 0 60 80" style={{ height: 70 }}>
      <rect x="5" y="5" width="50" height="70" rx="2" fill={c} stroke={b} strokeWidth="1.5"/>
      {[24, 42, 60].map(y => <line key={y} x1="5" y1={y} x2="55" y2={y} stroke={b} strokeWidth="0.8" strokeOpacity="0.5"/>)}
      <circle cx="30" cy="15" r="1.5" fill={b}/>
    </svg>
  )
  if (type === 'meeting') return (
    <svg viewBox="0 0 140 80" style={{ width: 100 }}>
      <ellipse cx="70" cy="40" rx="60" ry="18" fill={c} stroke={b} strokeWidth="1.5"/>
      {[-40,-20,0,20,40].map(x => (
        <g key={x}>
          <circle cx={70+x} cy={20} r="4" fill={b} opacity="0.3"/>
          <circle cx={70+x} cy={60} r="4" fill={b} opacity="0.3"/>
        </g>
      ))}
    </svg>
  )
  if (type === 'partition') return (
    <svg viewBox="0 0 80 100" style={{ height: 80 }}>
      <rect x="10" y="5" width="60" height="80" rx="2" fill={c} stroke={b} strokeWidth="1.5"/>
      <rect x="20" y="15" width="40" height="55" rx="1" fill={b} opacity="0.1"/>
      <line x1="35" y1="5" x2="35" y2="85" stroke={b} strokeWidth="0.6" strokeOpacity="0.4"/>
      <line x1="55" y1="5" x2="55" y2="85" stroke={b} strokeWidth="0.6" strokeOpacity="0.4"/>
    </svg>
  )
  return <div style={{ fontSize: 28 }}>{TYPE_ICONS[type] ?? '🪑'}</div>
}

function CheckoutModal({ flow, finish, onClose, onConfirm }: {
  flow: { frames: string[]; preset: string; label: string; price: number }
  finish: { id: string; label: string; color: string; border: string }
  onClose: () => void
  onConfirm: (c: KBCustomer) => string
}) {
  const [form, setForm] = useState<KBCustomer>({ name: '', phone: '', city: 'Bengaluru', area: '' })
  const [step, setStep] = useState<'confirm' | 'pay' | 'done'>('confirm')
  const [orderId, setOrderId] = useState('')
  const [paying, setPaying] = useState(false)
  const advance = Math.round(flow.price * 0.35)
  const ok = form.name.trim() && form.phone.trim() && form.area.trim()

  const handlePay = () => {
    if (!ok) return
    setPaying(true)
    setTimeout(() => {
      const id = onConfirm(form)
      setOrderId(id)
      setStep('done')
    }, 1200)
  }

  return (
    <Modal onClose={step !== 'done' ? onClose : undefined}>
      {step === 'confirm' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ padding: 36, background: '#f0eee9' }}>
            <div style={{ height: 200, background: '#ebe8e2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <OfficePreview type={CATALOG.office.frames.find(f => f.id === flow.frames[0])?.type ?? 'desk'} finish={finish} />
            </div>
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4a463f', fontWeight: 600 }}>Includes</div>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {flow.frames.map((fid, i) => {
                  const fr = cat.frames.find(f => f.id === fid)
                  return fr ? (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#4a463f' }}>{TYPE_ICONS[fr.type ?? '']} {TYPE_LABELS[fr.type ?? '']} {(fr.w/1000).toFixed(1)}m</span>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>{inr(fr.price)}</span>
                    </div>
                  ) : null
                })}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, paddingTop: 8, borderTop: '1px solid rgba(26,24,21,0.1)' }}>
                  <span style={{ color: '#4a463f' }}>Finish: {finish.label}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: finish.color, border: `1.5px solid ${finish.border}`, display: 'inline-block' }}/>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>incl.</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: 36, background: '#fafaf7' }}>
            <h2 style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 400, margin: 0 }}>{flow.label}</h2>
            <p style={{ fontSize: 13, marginTop: 4, color: '#4a463f' }}>{flow.frames.length} unit{flow.frames.length > 1 ? 's' : ''} · {finish.label} finish</p>
            <div style={{ marginTop: 20, padding: 16, borderRadius: 10, background: '#f0eee9' }}>
              {[
                { l: 'Panel + frames', v: Math.round(flow.price * 0.52) },
                { l: 'Finish & hardware', v: Math.round(flow.price * 0.26) },
                { l: 'Install + GST', v: Math.round(flow.price * 0.22) },
              ].map(r => (
                <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                  <span style={{ color: '#4a463f' }}>{r.l}</span>
                  <span style={{ fontFamily: 'JetBrains Mono' }}>{inr(r.v)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, marginTop: 6, borderTop: '1px solid rgba(26,24,21,0.12)', fontSize: 15, fontWeight: 600 }}>
                <span>Total</span>
                <span style={{ fontFamily: 'JetBrains Mono' }}>{inr(flow.price)}</span>
              </div>
            </div>
            <div style={{ marginTop: 14, paddingLeft: 14, paddingTop: 10, paddingBottom: 10, borderLeft: '2px solid #c96442', fontSize: 12, color: '#4a463f' }}>
              <strong style={{ color: '#1a1815' }}>35% advance</strong> · {inr(advance)} now<br />
              Balance on dispatch · {inr(flow.price - advance)}
            </div>
            <button onClick={() => setStep('pay')} style={{ width: '100%', marginTop: 20, padding: 12, borderRadius: 10, background: '#1a1815', color: '#fafaf7', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              Continue to book →
            </button>
            <button onClick={onClose} style={{ display: 'block', width: '100%', marginTop: 8, padding: 10, fontSize: 12, color: '#4a463f', background: 'none', border: 'none', cursor: 'pointer' }}>← Back to catalog</button>
          </div>
        </div>
      )}

      {step === 'pay' && (
        <div style={{ padding: '40px 48px', maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4a463f', fontWeight: 600, marginBottom: 8 }}>Your details</div>
          <h2 style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 400, margin: 0 }}>Book your office</h2>
          <p style={{ fontSize: 13, marginTop: 4, color: '#4a463f' }}>{flow.label} · {finish.label}</p>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Contact name', key: 'name' as const, ph: 'Your name or company' },
              { label: 'Phone / WhatsApp', key: 'phone' as const, ph: '+91 9XXXX XXXXX' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: '#4a463f' }}>{f.label}</label>
                <input type="text" value={form[f.key]} placeholder={f.ph} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ display: 'block', width: '100%', marginTop: 6, padding: '9px 12px', border: '1px solid rgba(26,24,21,0.18)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#1a1815', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[{ label: 'City', key: 'city' as const }, { label: 'Area / Locality', key: 'area' as const, ph: 'Koramangala' }].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: '#4a463f' }}>{f.label}</label>
                  <input type="text" value={form[f.key]} placeholder={(f as { ph?: string }).ph} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ display: 'block', width: '100%', marginTop: 6, padding: '9px 12px', border: '1px solid rgba(26,24,21,0.18)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#1a1815', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
          </div>
          <button onClick={handlePay} disabled={!ok || paying} style={{ width: '100%', marginTop: 20, padding: 13, borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 14, cursor: ok ? 'pointer' : 'not-allowed', fontFamily: 'inherit', background: ok ? '#c96442' : 'rgba(26,24,21,0.15)', color: ok ? '#fff' : '#4a463f' }}>
            {paying ? 'Processing…' : `Pay ${inr(advance)} advance →`}
          </button>
          {paying && <div style={{ marginTop: 8, height: 4, borderRadius: 4, overflow: 'hidden', background: 'rgba(201,100,66,0.15)' }}><div className="kb-stripe" style={{ height: '100%' }} /></div>}
          <button onClick={() => setStep('confirm')} style={{ display: 'block', width: '100%', marginTop: 8, padding: 10, fontSize: 12, color: '#4a463f', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
        </div>
      )}

      {step === 'done' && (
        <div style={{ padding: '48px 56px', maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, margin: '0 auto 20px', borderRadius: '50%', background: '#1f8a5b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 400, margin: 0 }}>Office booked.</h2>
          <p style={{ marginTop: 10, fontSize: 14, color: '#4a463f', lineHeight: 1.55 }}>Your order is in the system and visible to our factory team.</p>
          <div style={{ marginTop: 16, padding: '10px 20px', background: '#f0eee9', borderRadius: 8, display: 'inline-block' }}>
            <span style={{ fontSize: 11, color: '#4a463f', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Order ID </span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 15, fontWeight: 600, color: '#c96442' }}>{orderId}</span>
          </div>
          <div style={{ marginTop: 20, padding: 16, borderRadius: 10, textAlign: 'left', fontSize: 12, background: '#f0eee9' }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>What happens next</div>
            <ol style={{ margin: 0, padding: '0 0 0 16px', color: '#4a463f', lineHeight: 2 }}>
              <li>Space measurement visit within 48 hours.</li>
              <li>Final layout confirmed in DesignOS.</li>
              <li>Pre-cut panels dispatched in 8 working days.</li>
              <li>Professional install in 2–3 days.</li>
            </ol>
          </div>
          <button onClick={onClose} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 8, background: '#1a1815', color: '#fafaf7', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Back to catalog</button>
        </div>
      )}
    </Modal>
  )
}
