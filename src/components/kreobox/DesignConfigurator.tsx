import { useState, useEffect, useMemo } from 'react'
import {
  CATALOG, SHUTTERS, inr, findFrame, findShutter,
  calcShutterArea, pricePresetBundle, priceConfig, autoPackWidths,
} from '../../data/catalog'
import type { OrderConfig, ProductType } from '../../types/kreobox'
import CabinetPreview from './CabinetPreview'
import type { Lead } from '../../types/kreobox'

// ── interior designer helpers ─────────────────────────────────────────────────
type ModuleType = 'hang-full' | 'hang-half' | 'shelves' | 'drawers' | 'shoe' | 'trouser' | 'mirror' | 'empty'

function getSectionCount(width: number): number {
  if (width <= 600)  return 1
  if (width <= 1050) return 2
  if (width <= 1500) return 3
  if (width <= 2100) return 4
  return Math.ceil(width / 600)
}

function resizeSections(sections: string[], count: number): string[] {
  if (!sections.length) return Array(count).fill('hang-half')
  if (sections.length >= count) return sections.slice(0, count)
  return [...sections, ...Array(count - sections.length).fill(sections[sections.length - 1])]
}

const MODULES: { id: ModuleType; label: string }[] = [
  { id:'hang-full', label:'Full Hang'  },
  { id:'hang-half', label:'Half Hang'  },
  { id:'shelves',   label:'Shelves'    },
  { id:'drawers',   label:'Drawers'    },
  { id:'shoe',      label:'Shoe'       },
  { id:'trouser',   label:'Trouser'    },
  { id:'mirror',    label:'Mirror'     },
  { id:'empty',     label:'Empty'      },
]

const PRESET_MODELS: { label: string; sections: string[]; wardPreset: string }[] = [
  { label:'Classic',    sections:['hang-half','shelves'],          wardPreset:'WP-2' },
  { label:'Full Hang',  sections:['hang-full','hang-full'],        wardPreset:'WP-1' },
  { label:'Organiser',  sections:['drawers','shelves','drawers'],  wardPreset:'WP-4' },
  { label:'Kids',       sections:['hang-half','shoe','shelves'],   wardPreset:'WP-2' },
  { label:'Linen',      sections:['shelves','shelves'],            wardPreset:'WP-3' },
  { label:'Dressing',   sections:['mirror','hang-half','drawers'], wardPreset:'WP-4' },
]

function sectionsToPreset(sections: string[]): string {
  const hasDrawers = sections.some(s => s === 'drawers')
  const hasHang    = sections.some(s => s === 'hang-full' || s === 'hang-half')
  const allHang    = sections.every(s => s === 'hang-full' || s === 'hang-half')
  if (allHang)               return 'WP-1'
  if (hasDrawers && hasHang) return 'WP-2'
  if (hasDrawers)            return 'WP-4'
  return 'WP-3'
}

function drawModule(id: string, x: number, y: number, w: number, h: number): React.ReactNode {
  const cx = x + w / 2
  const sh = 'rgba(26,24,21,0.55)'
  const mu = 'rgba(26,24,21,0.18)'
  switch (id) {
    case 'hang-full':
      return <g>
        <line x1={x+w*0.15} y1={y+h*0.08} x2={x+w*0.85} y2={y+h*0.08} stroke={sh} strokeWidth={1.2}/>
        <line x1={cx} y1={y+h*0.08} x2={cx} y2={y+h*0.22} stroke={sh} strokeWidth={0.8}/>
        <line x1={cx-3} y1={y+h*0.22} x2={cx+3} y2={y+h*0.22} stroke={sh} strokeWidth={0.8}/>
        <line x1={cx-6} y1={y+h*0.28} x2={cx-6} y2={y+h*0.65} stroke={sh} strokeWidth={0.8}/>
        <line x1={cx+6} y1={y+h*0.28} x2={cx+6} y2={y+h*0.65} stroke={sh} strokeWidth={0.8}/>
      </g>
    case 'hang-half':
      return <g>
        <line x1={x+w*0.15} y1={y+h*0.08} x2={x+w*0.85} y2={y+h*0.08} stroke={sh} strokeWidth={1.2}/>
        <line x1={cx} y1={y+h*0.08} x2={cx} y2={y+h*0.18} stroke={sh} strokeWidth={0.8}/>
        <line x1={cx-5} y1={y+h*0.25} x2={cx+5} y2={y+h*0.25} stroke={sh} strokeWidth={0.8}/>
        <line x1={x} y1={y+h*0.5} x2={x+w} y2={y+h*0.5} stroke={sh} strokeWidth={1}/>
        {[0.62,0.74,0.86].map((yp,i)=><line key={i} x1={x+4} y1={y+h*yp} x2={x+w-4} y2={y+h*yp} stroke={mu} strokeWidth={0.8}/>)}
      </g>
    case 'shelves':
      return <g>
        {[0.18,0.32,0.46,0.60,0.74,0.88].map((yp,i)=>(
          <line key={i} x1={x+4} y1={y+h*yp} x2={x+w-4} y2={y+h*yp} stroke={sh} strokeWidth={0.9}/>
        ))}
      </g>
    case 'drawers':
      return <g>
        {[0,1,2].map(i=>{
          const dy = y + h*(0.15 + i*0.27)
          const dh = h*0.22
          return <g key={i}>
            <rect x={x+4} y={dy} width={w-8} height={dh} rx={1} fill={mu}/>
            <line x1={cx-4} y1={dy+dh/2} x2={cx+4} y2={dy+dh/2} stroke={sh} strokeWidth={1}/>
          </g>
        })}
      </g>
    case 'shoe':
      return <g>
        {[0.2,0.38,0.56,0.74].map((yp,i)=>(
          <line key={i} x1={x+4} y1={y+h*yp} x2={x+w-4} y2={y+h*(yp+0.1)} stroke={sh} strokeWidth={0.9}/>
        ))}
      </g>
    case 'trouser':
      return <g>
        {[0.2,0.4,0.6,0.8].map((yp,i)=>(
          <g key={i}>
            <line x1={x+6} y1={y+h*yp} x2={x+w-6} y2={y+h*yp} stroke={sh} strokeWidth={0.8}/>
            <line x1={cx} y1={y+h*yp} x2={cx} y2={y+h*(yp+0.1)} stroke={mu} strokeWidth={0.6}/>
          </g>
        ))}
      </g>
    case 'mirror':
      return <g>
        <rect x={x+6} y={y+h*0.06} width={w-12} height={h*0.88} rx={2}
          fill="rgba(180,210,230,0.25)" stroke="rgba(100,160,200,0.5)" strokeWidth={1}/>
        <line x1={x+10} y1={y+h*0.12} x2={x+w-10} y2={y+h*0.94} stroke="rgba(255,255,255,0.4)" strokeWidth={0.8}/>
      </g>
    default:
      return <g>
        <line x1={x+8} y1={y+8} x2={x+w-8} y2={y+h-8} stroke={mu} strokeWidth={0.6}/>
        <line x1={x+w-8} y1={y+8} x2={x+8} y2={y+h-8} stroke={mu} strokeWidth={0.6}/>
      </g>
  }
}

function WardrobeFrontSVG({ sections, selectedIdx, onClick, scale = 1 }: {
  sections: string[]; selectedIdx?: number | null; onClick?: (i: number) => void; scale?: number
}) {
  const n  = sections.length
  const SW = 56 * n
  const SH = 120
  return (
    <svg viewBox={`0 0 ${SW} ${SH}`} width={SW * scale} height={SH * scale} style={{ display:'block' }}>
      <rect x={0} y={0} width={SW} height={SH} rx={2} fill="rgba(26,24,21,0.04)" stroke="rgba(26,24,21,0.2)" strokeWidth={1}/>
      {sections.map((sec, i) => {
        const sx = i * 56
        const isActive = selectedIdx === i
        return (
          <g key={i} style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={() => onClick?.(i)}>
            {isActive && <rect x={sx} y={0} width={56} height={SH} fill="rgba(201,100,66,0.1)"/>}
            {i > 0 && <line x1={sx} y1={2} x2={sx} y2={SH-2} stroke="rgba(26,24,21,0.15)" strokeWidth={0.8}/>}
            {drawModule(sec, sx+2, 2, 52, SH-4)}
            {isActive && <rect x={sx} y={0} width={56} height={SH} fill="none" stroke="#c96442" strokeWidth={1.5}/>}
          </g>
        )
      })}
    </svg>
  )
}

interface Props {
  lead: Lead | null
  onBack: () => void
  onConfirm: (config: OrderConfig, total: number) => void
  confirmLabel?: string
  roomContext?: { label: string; icon: string; current: number; total: number }
  lockedType?: ProductType
}

export default function DesignConfigurator({ lead, onBack, onConfirm, confirmLabel, roomContext, lockedType }: Props) {
  const startType: ProductType = lockedType ?? lead?.type ?? 'wardrobe'
  const [step, setStep] = useState(lockedType ? 2 : 1)
  const [type, setType] = useState<ProductType>(startType)
  const [wall, setWall] = useState({ width: 2400, height: 2100 })
  const [frames, setFrames] = useState<string[]>([])
  const [walls, setWalls] = useState<string[]>([])
  const [shutter, setShutter] = useState('S-WALNUT')
  const [preset, setPreset] = useState(startType === 'wardrobe' ? 'WP-2' : 'KP-B2')
  const [interiorSections, setInteriorSections] = useState<string[]>(['hang-half', 'shelves'])

  useEffect(() => {
    if (type === 'wardrobe') {
      const closestH = [2100, 2400].reduce((a, b) => Math.abs(b - wall.height) < Math.abs(a - wall.height) ? b : a)
      const packed = autoPackWidths(wall.width, [900, 750, 600, 450])
      setFrames(packed.map(w => `W-${w}-${closestH}`))
      setWalls([])
    } else {
      const packed = autoPackWidths(wall.width, [900, 750, 600, 450, 300])
      setFrames(packed.map(w => `K-B-${w}`))
      setWalls(packed.map(w => `K-W-${w}`))
    }
  }, [type, wall.width, wall.height])

  useEffect(() => { setPreset(type === 'wardrobe' ? 'WP-2' : 'KP-B2') }, [type])

  const total = useMemo(() => priceConfig(type, frames, walls, shutter, preset), [type, frames, walls, shutter, preset])
  const config: OrderConfig = { type, wallWidth: wall.width, height: wall.height, frames, walls, shutter, preset }

  const previewItem = { type, frames, walls: type === 'kitchen' ? walls : null, shutter, w: wall.width, h: wall.height }

  return (
    <div className="kb-slide-in kb-font-body" style={{ color: 'var(--kb-ink)' }}>
      <button onClick={onBack} style={{ fontSize: 12, color: 'var(--kb-ink-soft)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 16 }}>
        ← Back to orders
      </button>

      {roomContext && (
        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: 'rgba(201,100,66,0.06)', border: '1.5px solid rgba(201,100,66,0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>{roomContext.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--kb-accent)' }}>{roomContext.label}</div>
            <div style={{ fontSize: 11, color: 'var(--kb-ink-soft)', marginTop: 1 }}>Space {roomContext.current} of {roomContext.total} · configure and save to continue</div>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: roomContext.total }, (_, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: 99, background: i < roomContext.current ? 'var(--kb-accent)' : i === roomContext.current - 1 ? 'var(--kb-accent)' : 'var(--kb-line)', opacity: i === roomContext.current - 1 ? 1 : 0.4 }} />
            ))}
          </div>
        </div>
      )}

      {lead && (
        <div style={{ marginBottom: 20, padding: 16, borderRadius: 10, background: 'var(--kb-paper)', borderLeft: '3px solid var(--kb-accent)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--kb-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, flexShrink: 0 }}>
            {lead.customer.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>New lead from customer catalog</div>
            <div style={{ fontSize: 11, color: 'var(--kb-ink-soft)', marginTop: 2 }}>
              {lead.customer.name} · {lead.customer.area}, {lead.customer.city} · advance {inr(lead.advance)} received
            </div>
          </div>
          <div className="kb-font-mono" style={{ fontSize: 12, color: 'var(--kb-ink-soft)' }}>{lead.id}</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 300px', gap: 20 }}>
        {/* Left: Stepper */}
        <div style={{ background: 'var(--kb-paper)', borderRadius: 12, padding: 16, border: '1px solid var(--kb-line)', height: 'fit-content' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600, marginBottom: 8 }}>Configurator</div>
          {lockedType && (
            <div style={{ marginBottom: 10, padding: '6px 10px', borderRadius: 7, background: 'rgba(201,100,66,0.08)', border: '1px solid rgba(201,100,66,0.2)', fontSize: 11, fontWeight: 700, color: 'var(--kb-accent)', textTransform: 'capitalize' as const }}>
              {lockedType === 'kitchen' ? '🍳' : lockedType === 'office' ? '🏢' : '🚪'} {lockedType}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { n: 1, label: 'Type' },
              { n: 2, label: 'Dimensions' },
              { n: 3, label: 'Frame layout' },
              { n: 4, label: 'Shutter finish' },
              { n: 5, label: 'Interior preset' },
              { n: 6, label: 'BOQ & confirm' },
            ].filter(s => !(lockedType && s.n === 1)).map(s => (
              <button
                key={s.n}
                onClick={() => setStep(s.n)}
                className="kb-btn"
                style={{
                  width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px', borderRadius: 8, fontSize: 13, border: 'none', cursor: 'pointer',
                  background: step === s.n ? 'var(--kb-ink)' : 'transparent',
                  color: step === s.n ? 'var(--kb-paper)' : (s.n < step ? 'var(--kb-ink-soft)' : 'rgba(26,24,21,0.35)'),
                }}
              >
                <span className="kb-font-mono" style={{ fontSize: 10, opacity: 0.7 }}>0{s.n}</span>
                <span style={{ fontWeight: 600 }}>{s.label}</span>
                {s.n < step && <span style={{ marginLeft: 'auto', color: '#1f8a5b', fontSize: 12 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Live preview */}
        <div>
          <div style={{ background: 'var(--kb-paper)', borderRadius: 12, padding: 20, border: '1px solid var(--kb-line)', position: 'sticky', top: 80 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600, marginBottom: 12 }}>Live preview</div>
            <div style={{ height: type === 'kitchen' ? 240 : 280, background: '#ebe8e2', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(26,24,21,0.05) 1px, transparent 0)', backgroundSize: '14px 14px' }} />
              <CabinetPreview item={previewItem} />
            </div>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Frames', value: `${frames.length}${walls.length > 0 ? '+' + walls.length : ''}` },
                { label: 'Wall', value: `${(wall.width / 1000).toFixed(2)}m` },
                { label: 'Finish', value: findShutter(shutter)?.label ?? '—' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Step content */}
        <div style={{ background: 'var(--kb-paper)', borderRadius: 12, padding: 20, border: '1px solid var(--kb-line)' }}>
          {step === 1 && <StepType type={type} setType={setType} onNext={() => setStep(2)} />}
          {step === 2 && <StepDimensions wall={wall} setWall={setWall} type={type} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <StepFrames frames={frames} walls={walls} type={type} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <StepShutter shutter={shutter} setShutter={setShutter} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
          {step === 5 && <StepPreset preset={preset} setPreset={setPreset} type={type} wallWidth={wall.width} interiorSections={interiorSections} setInteriorSections={(s) => { setInteriorSections(s); setPreset(sectionsToPreset(s)) }} onNext={() => setStep(6)} onBack={() => setStep(4)} />}
          {step === 6 && <StepBOQ config={config} total={total} onConfirm={() => onConfirm(config, total)} onBack={() => setStep(5)} confirmLabel={confirmLabel} />}
        </div>
      </div>
    </div>
  )
}

/* ── Step primitives ── */
function StepHeader({ n, title, sub }: { n: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div className="kb-font-mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600 }}>Step {n}</div>
      <h3 className="kb-font-display" style={{ fontSize: 20, fontWeight: 400, margin: '6px 0 0', letterSpacing: '-0.01em' }}>{title}</h3>
      {sub && <p style={{ fontSize: 12, color: 'var(--kb-ink-soft)', margin: '4px 0 0' }}>{sub}</p>}
    </div>
  )
}

function NavBtns({ onBack, onNext, nextLabel = 'Continue →' }: { onBack: () => void; onNext: () => void; nextLabel?: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
      <button onClick={onBack} className="kb-btn" style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid var(--kb-line-2)', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>← Back</button>
      <button onClick={onNext} className="kb-btn" style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: 'var(--kb-ink)', color: 'var(--kb-paper)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 }}>{nextLabel}</button>
    </div>
  )
}

function StepType({ type, setType, onNext }: { type: ProductType; setType: (t: ProductType) => void; onNext: () => void }) {
  return (
    <div>
      <StepHeader n="01" title="What are you building?" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {([
          { id: 'wardrobe' as const, label: 'Wardrobe', desc: 'Bedroom, single wall, 5–12 ft' },
          { id: 'kitchen' as const, label: 'Kitchen', desc: 'Straight, L, U, parallel, island' },
        ]).map(t => (
          <button
            key={t.id} onClick={() => setType(t.id)} className="kb-btn"
            style={{ textAlign: 'left', padding: 14, borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', background: type === t.id ? 'rgba(201,100,66,0.06)' : '#fff', border: type === t.id ? '2px solid var(--kb-accent)' : '1px solid var(--kb-line-2)' }}
          >
            <div style={{ fontWeight: 600, fontSize: 14 }}>{t.label}</div>
            <div style={{ fontSize: 12, color: 'var(--kb-ink-soft)', marginTop: 3 }}>{t.desc}</div>
          </button>
        ))}
      </div>
      <button onClick={onNext} className="kb-btn" style={{ width: '100%', marginTop: 16, padding: '11px', borderRadius: 8, border: 'none', background: 'var(--kb-ink)', color: 'var(--kb-paper)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 }}>Continue →</button>
    </div>
  )
}

function StepDimensions({ wall, setWall, type, onNext, onBack }: { wall: { width: number; height: number }; setWall: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>; type: ProductType; onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <StepHeader n="02" title="Wall dimensions" sub="We snap to the nearest valid combination on the KREOBOX grid." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600 }}>Wall width (mm)</label>
          <input type="range" min={1200} max={4500} step={150} value={wall.width}
            onChange={e => setWall(w => ({ ...w, width: parseInt(e.target.value) }))}
            style={{ width: '100%', marginTop: 8, accentColor: 'var(--kb-accent)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
            <span style={{ color: 'var(--kb-ink-soft)' }}>1.2m</span>
            <span className="kb-font-mono" style={{ fontWeight: 600 }}>{wall.width} mm</span>
            <span style={{ color: 'var(--kb-ink-soft)' }}>4.5m</span>
          </div>
        </div>
        {type === 'wardrobe' && (
          <div>
            <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600 }}>Ceiling height</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {[2100, 2400].map(h => (
                <button key={h} onClick={() => setWall(w => ({ ...w, height: h }))} className="kb-btn"
                  style={{ flex: 1, padding: '9px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, background: wall.height === h ? 'rgba(201,100,66,0.06)' : '#fff', border: wall.height === h ? '2px solid var(--kb-accent)' : '1px solid var(--kb-line-2)' }}>
                  {(h / 1000).toFixed(1)}m
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <NavBtns onBack={onBack} onNext={onNext} />
    </div>
  )
}

function StepFrames({ frames, walls, type, onNext, onBack }: { frames: string[]; walls: string[]; type: ProductType; onNext: () => void; onBack: () => void }) {
  const cat = CATALOG[type]
  const frameObjs = frames.map(id => findFrame(type, id)).filter(Boolean) as typeof cat.frames
  const wallObjs = walls.map(id => findFrame(type, id)).filter(Boolean) as typeof cat.frames
  return (
    <div>
      <StepHeader n="03" title="Auto-packed frames" sub="Optimal mix from the KREOBOX grid." />
      <div style={{ padding: 12, borderRadius: 8, background: 'var(--kb-bg)', marginBottom: 10 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600, marginBottom: 8 }}>Base / vertical frames</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {frameObjs.map((f, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span className="kb-font-mono">{f.id}</span>
              <span style={{ color: 'var(--kb-ink-soft)' }}>{f.w}×{f.h}mm</span>
              <span className="kb-font-mono">{inr(f.price)}</span>
            </div>
          ))}
        </div>
      </div>
      {wallObjs.length > 0 && (
        <div style={{ padding: 12, borderRadius: 8, background: 'var(--kb-bg)', marginBottom: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600, marginBottom: 8 }}>Wall units</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {wallObjs.map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span className="kb-font-mono">{f.id}</span>
                <span style={{ color: 'var(--kb-ink-soft)' }}>{f.w}×{f.h}mm</span>
                <span className="kb-font-mono">{inr(f.price)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <NavBtns onBack={onBack} onNext={onNext} />
    </div>
  )
}

function StepShutter({ shutter, setShutter, onNext, onBack }: { shutter: string; setShutter: (s: string) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <StepHeader n="04" title="Shutter finish" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {SHUTTERS.map(s => (
          <button key={s.id} onClick={() => setShutter(s.id)} className="kb-btn"
            style={{ padding: 10, borderRadius: 10, textAlign: 'left', cursor: 'pointer', background: '#fff', border: shutter === s.id ? '2px solid var(--kb-accent)' : '1px solid var(--kb-line-2)' }}>
            <div style={{ width: '100%', height: 40, borderRadius: 6, background: s.color, border: `1px solid ${s.border}`, marginBottom: 8 }} />
            <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.2 }}>{s.label}</div>
          </button>
        ))}
      </div>
      <NavBtns onBack={onBack} onNext={onNext} />
    </div>
  )
}

function StepPreset({ preset, setPreset, type, wallWidth, interiorSections, setInteriorSections, onNext, onBack }: {
  preset: string; setPreset: (p: string) => void; type: ProductType
  wallWidth: number; interiorSections: string[]; setInteriorSections: (s: string[]) => void
  onNext: () => void; onBack: () => void
}) {
  const [selectedSection, setSelectedSection] = useState<number | null>(null)

  if (type === 'kitchen') {
    const cat = CATALOG[type]
    const presets = cat.presets.filter(p => p.scope === 'base')
    return (
      <div>
        <StepHeader n="05" title="Interior preset" sub="Pre-bundled hardware kits for each base cabinet." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {presets.map(p => (
            <button key={p.id} onClick={() => setPreset(p.id)} className="kb-btn"
              style={{ textAlign: 'left', padding: 12, borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', background: preset === p.id ? 'rgba(201,100,66,0.06)' : '#fff', border: preset === p.id ? '2px solid var(--kb-accent)' : '1px solid var(--kb-line-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.label}</div>
                  {p.desc && <div style={{ fontSize: 11, color: 'var(--kb-ink-soft)', marginTop: 2 }}>{p.desc}</div>}
                </div>
                <div className="kb-font-mono" style={{ fontSize: 11, color: 'var(--kb-ink-soft)' }}>{inr(p.price)}/frame</div>
              </div>
            </button>
          ))}
        </div>
        <NavBtns onBack={onBack} onNext={onNext} />
      </div>
    )
  }

  // Wardrobe: IKEA-style section designer
  const n = getSectionCount(wallWidth)
  const sections = resizeSections(interiorSections, n)
  const scale = Math.min(1, 260 / (n * 56))

  const WP_LABELS: Record<string, string> = { 'WP-1':'All hangers', 'WP-2':'Drawers + hangers', 'WP-3':'Shelves only', 'WP-4':'Shelves + drawers' }

  return (
    <div>
      <StepHeader n="05" title="Design interior" sub="Section by section — pick a preset or build your own." />

      {/* Quick presets */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', marginBottom: 8 }}>Quick presets</div>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 18 }}>
        {PRESET_MODELS.map(m => {
          const adapted = resizeSections(m.sections, Math.min(m.sections.length, 3))
          const sc = 64 / (adapted.length * 56)
          return (
            <div key={m.label} onClick={() => {
              const s = resizeSections(m.sections, n)
              setInteriorSections(s)
              setSelectedSection(null)
            }} style={{ cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ border: '1.5px solid var(--kb-line)', borderRadius: 7, padding: '4px 3px', background: 'var(--kb-bg)', width: 70 }}>
                <WardrobeFrontSVG sections={adapted} scale={sc} />
              </div>
              <div style={{ fontSize: 8, color: 'var(--kb-ink-soft)', marginTop: 3 }}>{m.label}</div>
            </div>
          )
        })}
      </div>

      {/* Live canvas */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', marginBottom: 6 }}>Your layout</div>
      <div style={{ background: 'var(--kb-bg)', borderRadius: 8, padding: '12px 8px', marginBottom: 8, display: 'flex', justifyContent: 'center', border: '1px solid var(--kb-line)' }}>
        <WardrobeFrontSVG sections={sections} selectedIdx={selectedSection} scale={scale}
          onClick={i => setSelectedSection(selectedSection === i ? null : i)} />
      </div>
      <div style={{ fontSize: 10, color: 'var(--kb-ink-soft)', textAlign: 'center', marginBottom: 12 }}>
        {selectedSection === null ? 'Click a section to configure it' : `Section ${selectedSection + 1} selected`}
      </div>

      {/* Module picker */}
      {selectedSection !== null && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14 }}>
          {MODULES.map(m => {
            const isCur = sections[selectedSection] === m.id
            return (
              <div key={m.id} onClick={() => {
                const updated = [...sections]
                updated[selectedSection] = m.id
                setInteriorSections(updated)
              }} style={{ cursor: 'pointer', textAlign: 'center', borderRadius: 8, padding: '5px 3px',
                border: `1.5px solid ${isCur ? 'var(--kb-accent)' : 'var(--kb-line)'}`,
                background: isCur ? 'rgba(201,100,66,0.07)' : 'var(--kb-bg)' }}>
                <svg viewBox="0 0 56 80" width={40} height={57} style={{ display: 'block', margin: '0 auto' }}>
                  <rect width={56} height={80} fill="rgba(26,24,21,0.04)"/>
                  {drawModule(m.id, 2, 2, 52, 76)}
                </svg>
                <div style={{ fontSize: 8, fontWeight: isCur ? 700 : 500, color: isCur ? 'var(--kb-accent)' : 'var(--kb-ink-soft)', marginTop: 2 }}>{m.label}</div>
              </div>
            )
          })}
        </div>
      )}

      {/* Auto-mapped hardware bundle */}
      <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(201,100,66,0.05)', border: '1px solid rgba(201,100,66,0.15)', fontSize: 11, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--kb-ink-soft)' }}>Hardware bundle</span>
        <span style={{ fontWeight: 700, color: 'var(--kb-accent)' }}>{WP_LABELS[preset] ?? preset}</span>
      </div>

      <NavBtns onBack={onBack} onNext={onNext} />
    </div>
  )
}

function StepBOQ({ config, total, onConfirm, onBack, confirmLabel }: { config: OrderConfig; total: number; onConfirm: () => void; onBack: () => void; confirmLabel?: string }) {
  const cat = CATALOG[config.type]
  const allFrames = [...config.frames, ...config.walls]
  const allObjs = allFrames.map(id => cat.frames.find(f => f.id === id)).filter(Boolean) as typeof cat.frames
  const framesTotal = allObjs.reduce((s, f) => s + f.price, 0)
  const shutterArea = calcShutterArea(config.frames, config.type) + calcShutterArea(config.walls, config.type)
  const shutterTotal = shutterArea * 1800
  const presetTotal = pricePresetBundle(allFrames, config.type, config.preset)
  const gstPart = total - (framesTotal + shutterTotal + presetTotal + 6500)

  return (
    <div>
      <StepHeader n="06" title="BOQ & confirm" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
        {[
          { label: `Frames (${allFrames.length})`, value: inr(framesTotal) },
          { label: `Shutters (${shutterArea.toFixed(2)} m²)`, value: inr(shutterTotal) },
          { label: `Hardware preset × ${allFrames.length}`, value: inr(presetTotal) },
          { label: 'Install fee', value: inr(6500) },
          { label: 'GST 18%', value: inr(gstPart), dim: true },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: r.dim ? 'var(--kb-ink-soft)' : 'var(--kb-ink)' }}>{r.label}</span>
            <span className="kb-font-mono">{r.value}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--kb-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--kb-ink-soft)', fontWeight: 600 }}>Total</span>
        <span className="kb-font-display" style={{ fontSize: 26, fontWeight: 400 }}>{inr(total)}</span>
      </div>
      <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: 'var(--kb-bg)', fontSize: 11 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Auto-generated on confirm:</div>
        <ul style={{ margin: 0, padding: '0 0 0 14px', color: 'var(--kb-ink-soft)', lineHeight: 1.8 }}>
          <li>Panel cut-list (PDF + barcoded labels)</li>
          <li>Hardware pick-list for stock depot</li>
          <li>2D install drawing</li>
          <li>WhatsApp updates to customer</li>
        </ul>
      </div>
      <NavBtns onBack={onBack} onNext={onConfirm} nextLabel={confirmLabel ?? 'Confirm order →'} />
    </div>
  )
}
