import { useState } from 'react'
import { SHOWROOM, inr, findShutter, generatePanels } from '../data/catalog'
import type { ShowroomItem } from '../data/catalog'
import CabinetPreview from '../components/kreobox/CabinetPreview'
import Modal from '../components/kreobox/Modal'
import type { Lead, KBCustomer, KBOrder } from '../types/kreobox'
import { useKreoboxStore } from '../store/kreoboxStore'

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
  content: { maxWidth: 1280, margin: '0 auto', padding: '0 40px 80px' },
}

interface CustomerPageProps {
  onCheckout: (lead: Lead) => void
}

export default function CustomerPage({ onCheckout }: CustomerPageProps) {
  const [tab, setTab] = useState<'all' | 'wardrobe' | 'kitchen' | 'office'>('all')
  const [selected, setSelected] = useState<ShowroomItem | null>(null)
  const [stage, setStage] = useState<'browse' | 'quote' | 'pay' | 'done'>('browse')
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('')
  const addOrder = useKreoboxStore(s => s.addOrder)

  const items = SHOWROOM.filter(s => tab === 'all' || s.type === tab)

  return (
    <div style={S.page} className="kb-font-body">
      {/* Top bar */}
      <header style={S.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={S.logo}>KREOBOX</span>
          <span style={{ fontSize: 11, color: 'var(--kb-ink-soft)', borderLeft: '1px solid var(--kb-line)', paddingLeft: 16, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
            Catalog
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--kb-ink-soft)', fontFamily: 'JetBrains Mono' }}>
          {items.length} designs
        </div>
      </header>

      <div style={S.content}>
        {/* Hero */}
        <div style={{ paddingTop: 64, paddingBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--kb-accent)', fontWeight: 700, marginBottom: 16 }}>
            The catalog
          </div>
          <h1 className="kb-font-display" style={{ fontSize: 72, fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.03em', margin: 0 }}>
            Modular wardrobes & kitchens,<br />
            <em style={{ fontFamily: '"Instrument Serif", "Fraunces"', fontStyle: 'italic', fontWeight: 400 }}>shipped pre-cut.</em>
          </h1>
          <p style={{ marginTop: 24, maxWidth: 540, fontSize: 15, lineHeight: 1.55, color: 'var(--kb-ink-soft)' }}>
            Pick a design. We send pre-cut laminated panels and a hardware kit to your contractor. Installs in 2–3 days. No factory visit, no eight-week wait.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--kb-line)' }}>
          {([
            { id: 'all', label: 'All collections' },
            { id: 'wardrobe', label: 'Wardrobes' },
            { id: 'kitchen', label: 'Kitchens' },
            { id: 'office', label: 'Office' },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="kb-btn"
              style={{
                padding: '7px 16px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                background: tab === t.id ? 'var(--kb-ink)' : 'transparent',
                color: tab === t.id ? 'var(--kb-paper)' : 'var(--kb-ink-soft)',
                border: tab === t.id ? '1px solid var(--kb-ink)' : '1px solid var(--kb-line-2)',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Catalog grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {items.map(item => (
            <CatalogCard
              key={item.id}
              item={item}
              onClick={() => { setSelected(item); setStage('quote') }}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      {selected && stage === 'quote' && (
        <QuoteSheet
          item={selected}
          onBack={() => { setSelected(null); setStage('browse') }}
          onContinue={() => setStage('pay')}
        />
      )}
      {selected && stage === 'pay' && (
        <PayAdvance
          item={selected}
          onBack={() => setStage('quote')}
          onPaid={(form) => {
            const orderId = 'ORD-' + Math.floor(1050 + Math.random() * 900)
            const advance = Math.round(selected.basePrice * 0.35)
            const panels = generatePanels({ type: selected.type, frames: selected.frames, walls: selected.walls, shutter: selected.shutter })
            const order: KBOrder = {
              id: orderId,
              customer: form,
              contractor: 'Unassigned',
              type: selected.type,
              config: { type: selected.type, wallWidth: selected.w, height: selected.h, frames: selected.frames, walls: selected.walls ?? [], shutter: selected.shutter, preset: selected.preset },
              advance,
              total: selected.basePrice,
              stage: 'Quoted',
              createdAt: new Date().toISOString().slice(0, 10),
              panels,
            }
            addOrder(order)
            setConfirmedOrderId(orderId)
            const lead: Lead = { id: orderId, customer: form, type: selected.type, showroomId: selected.id, advance, total: selected.basePrice }
            setStage('done')
            setTimeout(() => onCheckout(lead), 2000)
          }}
        />
      )}
      {selected && stage === 'done' && <SuccessCard orderId={confirmedOrderId} />}
    </div>
  )
}

function CatalogCard({ item, onClick }: { item: ShowroomItem; onClick: () => void }) {
  const shutter = findShutter(item.shutter)
  return (
    <button
      onClick={onClick}
      className="kb-btn kb-lift"
      style={{
        textAlign: 'left', background: 'var(--kb-paper)',
        borderRadius: 14, overflow: 'hidden',
        border: '1px solid var(--kb-line-2)',
        cursor: 'pointer', padding: 0,
      }}
    >
      <div style={{ height: 210, background: '#ebe8e2', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(26,24,21,0.05) 1px, transparent 0)',
          backgroundSize: '14px 14px',
        }} />
        <CabinetPreview item={item} />
        <div style={{
          position: 'absolute', top: 12, left: 12,
          fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
          padding: '4px 10px', borderRadius: 999,
          background: 'rgba(250,250,247,0.92)', color: 'var(--kb-ink-soft)',
        }}>
          {item.type === 'kitchen' ? 'Kitchen' : item.type === 'office' ? 'Office' : 'Wardrobe'}
        </div>
        {shutter && (
          <div style={{
            position: 'absolute', bottom: 12, right: 12,
            width: 20, height: 20, borderRadius: '50%',
            background: shutter.color, border: `2px solid ${shutter.border}`,
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }} />
        )}
      </div>
      <div style={{ padding: '16px 18px 18px' }}>
        <div className="kb-font-display" style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.15 }}>{item.title}</div>
        <div style={{ fontSize: 12, marginTop: 4, color: 'var(--kb-ink-soft)' }}>{item.subtitle}</div>
        <div style={{ marginTop: 14, paddingTop: 14, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderTop: '1px solid var(--kb-line)' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600 }}>Starting</div>
            <div className="kb-font-mono" style={{ fontSize: 16, fontWeight: 500, marginTop: 2 }}>{inr(item.basePrice)}</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--kb-accent)' }}>View →</span>
        </div>
      </div>
    </button>
  )
}

function QuoteSheet({ item, onBack, onContinue }: { item: ShowroomItem; onBack: () => void; onContinue: () => void }) {
  return (
    <Modal onClose={onBack}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ padding: 36, background: 'var(--kb-bg)' }}>
          <div style={{ height: 300, background: '#ebe8e2', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(26,24,21,0.05) 1px, transparent 0)', backgroundSize: '14px 14px' }} />
            <CabinetPreview item={item} />
          </div>
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Wall width', value: `${(item.w / 1000).toFixed(2)}m` },
              { label: 'Height', value: `${(item.h / 1000).toFixed(2)}m` },
              { label: 'Frames', value: item.frames.length },
              { label: 'Finish', value: findShutter(item.shutter)?.label ?? '—' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600 }}>{s.label}</div>
                <div className="kb-font-mono" style={{ fontSize: 13, marginTop: 4 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: 36, background: 'var(--kb-paper)' }}>
          <button onClick={onBack} style={{ fontSize: 12, color: 'var(--kb-ink-soft)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, padding: 0 }}>← Back to catalog</button>
          <h2 className="kb-font-display" style={{ fontSize: 30, fontWeight: 400, letterSpacing: '-0.015em', margin: 0 }}>{item.title}</h2>
          <p style={{ fontSize: 13, marginTop: 4, color: 'var(--kb-ink-soft)' }}>{item.subtitle}</p>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Pre-cut panels & frames', val: item.basePrice * 0.55 },
              { label: 'Shutters & finish', val: item.basePrice * 0.25 },
              { label: 'Hardware kit', val: item.basePrice * 0.13 },
              { label: 'Install + GST included', val: item.basePrice * 0.07 },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--kb-ink-soft)' }}>{r.label}</span>
                <span className="kb-font-mono">{inr(r.val)}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: '1px solid var(--kb-line)' }}>
            <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600 }}>All-in price</span>
            <span className="kb-font-display" style={{ fontSize: 34, fontWeight: 400 }}>{inr(item.basePrice)}</span>
          </div>

          <div style={{ marginTop: 14, paddingLeft: 14, paddingTop: 10, paddingBottom: 10, borderLeft: '2px solid var(--kb-accent)', fontSize: 12, color: 'var(--kb-ink-soft)' }}>
            <strong style={{ color: 'var(--kb-ink)' }}>35% advance</strong> · {inr(item.basePrice * 0.35)} now<br />
            <span>Balance on dispatch · {inr(item.basePrice * 0.65)}</span>
          </div>

          <button
            onClick={onContinue}
            className="kb-btn"
            style={{ width: '100%', marginTop: 20, padding: '12px', borderRadius: 10, background: 'var(--kb-ink)', color: 'var(--kb-paper)', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Continue to advance payment →
          </button>
          <div style={{ marginTop: 10, fontSize: 11, textAlign: 'center', color: 'var(--kb-ink-soft)' }}>
            Lead time: 8–10 working days · Install in 2–3 days
          </div>
        </div>
      </div>
    </Modal>
  )
}

function PayAdvance({ item, onBack, onPaid }: { item: ShowroomItem; onBack: () => void; onPaid: (form: KBCustomer) => void }) {
  const [form, setForm] = useState<KBCustomer>({ name: '', phone: '', city: 'Bengaluru', area: '' })
  const [paying, setPaying] = useState(false)
  const advance = Math.round(item.basePrice * 0.35)
  const ok = form.name.trim() && form.phone.trim() && form.area.trim()

  const handlePay = () => {
    if (!ok) return
    setPaying(true)
    setTimeout(() => onPaid(form), 1100)
  }

  return (
    <Modal onClose={onBack}>
      <div style={{ padding: '40px 48px', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600, marginBottom: 8 }}>Step 2 of 3 — Your details</div>
        <h2 className="kb-font-display" style={{ fontSize: 28, fontWeight: 400, margin: 0 }}>Pay advance to lock the design</h2>
        <p style={{ fontSize: 13, marginTop: 6, color: 'var(--kb-ink-soft)' }}>{item.title} · {findShutter(item.shutter)?.label}</p>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Full name', key: 'name' as const, ph: 'Your name' },
            { label: 'Phone (WhatsApp)', key: 'phone' as const, ph: '+91 9XXXX XXXXX' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--kb-ink-soft)' }}>{f.label}</label>
              <input
                type="text" value={form[f.key]} placeholder={f.ph}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                style={{ display: 'block', width: '100%', marginTop: 6, padding: '9px 12px', border: '1px solid var(--kb-line-2)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#fff', color: 'var(--kb-ink)', outline: 'none' }}
              />
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[{ label: 'City', key: 'city' as const }, { label: 'Area', key: 'area' as const, ph: 'HSR Layout' }].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--kb-ink-soft)' }}>{f.label}</label>
                <input
                  type="text" value={form[f.key]} placeholder={f.ph}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ display: 'block', width: '100%', marginTop: 6, padding: '9px 12px', border: '1px solid var(--kb-line-2)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#fff', color: 'var(--kb-ink)', outline: 'none' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 20, padding: 16, borderRadius: 10, background: 'var(--kb-bg)' }}>
          {[
            { l: 'Total', v: inr(item.basePrice) },
            { l: 'Advance (35%)', v: inr(advance), bold: true },
            { l: 'Balance on dispatch', v: inr(item.basePrice - advance) },
          ].map(r => (
            <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13 }}>
              <span style={{ color: 'var(--kb-ink-soft)' }}>{r.l}</span>
              <span className="kb-font-mono" style={{ fontWeight: r.bold ? 600 : 400 }}>{r.v}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handlePay} disabled={!ok || paying}
          className="kb-btn"
          style={{ width: '100%', marginTop: 16, padding: '13px', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 14, cursor: ok ? 'pointer' : 'not-allowed', fontFamily: 'inherit', background: ok ? 'var(--kb-accent)' : 'rgba(26,24,21,0.2)', color: ok ? '#fff' : 'var(--kb-ink-soft)' }}
        >
          {paying ? 'Processing payment…' : `Pay ${inr(advance)} via UPI/Razorpay →`}
        </button>
        {paying && <div style={{ marginTop: 8, height: 4, borderRadius: 4, overflow: 'hidden' }}><div className="kb-stripe" style={{ height: '100%' }} /></div>}
        <button onClick={onBack} style={{ display: 'block', width: '100%', marginTop: 10, padding: '10px', fontSize: 12, color: 'var(--kb-ink-soft)', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
      </div>
    </Modal>
  )
}

function SuccessCard({ orderId }: { orderId: string }) {
  return (
    <Modal>
      <div style={{ padding: '48px 56px', maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, margin: '0 auto 20px', borderRadius: '50%', background: '#1f8a5b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h2 className="kb-font-display" style={{ fontSize: 28, fontWeight: 400, margin: 0 }}>Advance received.</h2>
        <p style={{ marginTop: 10, fontSize: 14, color: 'var(--kb-ink-soft)', lineHeight: 1.55 }}>
          Your order is live. A KREOBOX-certified contractor will be assigned shortly.
        </p>
        <div style={{ marginTop: 16, padding: '10px 20px', background: 'var(--kb-bg)', borderRadius: 8, display: 'inline-block' }}>
          <span style={{ fontSize: 11, color: 'var(--kb-ink-soft)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Order ID </span>
          <span className="kb-font-mono" style={{ fontSize: 15, fontWeight: 600, color: 'var(--kb-accent)' }}>{orderId}</span>
        </div>
        <div style={{ marginTop: 20, padding: 16, borderRadius: 10, textAlign: 'left', fontSize: 12, background: 'var(--kb-bg)' }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>What happens next</div>
          <ol style={{ margin: 0, padding: '0 0 0 16px', color: 'var(--kb-ink-soft)', lineHeight: 2 }}>
            <li>Order appears in Contractor queue immediately.</li>
            <li>Contractor WhatsApps you within 2 hours.</li>
            <li>Site measurement within 48 hours.</li>
            <li>Panels cut and dispatched in 8 working days.</li>
          </ol>
        </div>
        <div style={{ marginTop: 16, fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--kb-ink-soft)' }}>Opening contractor view…</div>
      </div>
    </Modal>
  )
}
