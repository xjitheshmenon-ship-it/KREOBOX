import { useState, useRef, useCallback, useEffect } from 'react'
import { useKreoboxStore } from '../store/kreoboxStore'
import { inr, generatePanels } from '../data/catalog'
import type { KBOrder } from '../types/kreobox'

// ── isometric engine ─────────────────────────────────────────────────────────
const SC   = 0.055
const COS  = 0.866
const SIN  = 0.5
const GRID = 200

type Pt = { x: number; y: number }
function iso(wx: number, wy: number, wz = 0): Pt {
  return { x: (wx - wy) * COS * SC, y: (wx + wy) * SIN * SC - wz * SC }
}
function poly(pts: Pt[]) { return pts.map(p => `${p.x},${p.y}`).join(' ') }
function fromIso(sx: number, sy: number): Pt {
  const wx = (sx / (COS * SC) + sy / (SIN * SC)) / 2
  const wy = (sy / (SIN * SC) - sx / (COS * SC)) / 2
  return { x: wx, y: wy }
}
function snap(v: number) { return Math.round(v / GRID) * GRID }

// ── wardrobe configurator types ───────────────────────────────────────────────
type WardType    = 'swing' | 'sliding' | 'open' | 'corner'
type WardLayout  = 'standard' | 'full-hang' | 'drawer-heavy' | 'loft-hang' | 'pantry'
type ShutterFin  = 'matt' | 'gloss' | 'membrane' | 'glass'
type HandleType  = 'none' | 'bar' | 'knob' | 'j-pull'
type Interior    = 'basic' | 'premium' | 'homeoffice' | 'kids'
type ModuleType  = 'hang-full' | 'hang-half' | 'shelves' | 'drawers' | 'shoe' | 'trouser' | 'mirror' | 'empty'

interface WardConfig {
  type: WardType; width: number; height: number; depth: number
  layout: WardLayout; shutterColor: string; shutterFinish: ShutterFin
  handle: HandleType; interior: Interior
  interiorSections: string[]
}

const DFLT: WardConfig = {
  type:'swing', width:900, height:2100, depth:600,
  layout:'standard', shutterColor:'#f0ece4',
  shutterFinish:'matt', handle:'bar', interior:'basic',
  interiorSections: ['hang-half', 'shelves'],
}

const WIDTH_OPTS  = [450,600,750,900,1050,1200,1500,1800,2100,2400,2700]
const HEIGHT_OPTS = [1800,2100,2400,2700]
const DEPTH_OPTS  = [450,600]

const SHUTTER_COLORS = [
  { hex:'#f0ece4', name:'White Matt' }, { hex:'#e8e0c8', name:'Ivory' },
  { hex:'#d4c8a8', name:'Linen' },      { hex:'#7a5c3c', name:'Walnut' },
  { hex:'#9a7050', name:'Teak' },       { hex:'#3a3a3a', name:'Charcoal' },
  { hex:'#1a2a4a', name:'Navy' },       { hex:'#5a1a1a', name:'Burgundy' },
]

// ── interior designer helpers ─────────────────────────────────────────────────
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

const MODULES: { id: ModuleType; label: string; sub: string }[] = [
  { id:'hang-full', label:'Full Hang',  sub:'Full-height rail' },
  { id:'hang-half', label:'Half Hang',  sub:'Rail + shelf below' },
  { id:'shelves',   label:'Shelves',    sub:'Fixed shelf stack' },
  { id:'drawers',   label:'Drawers',    sub:'3 drawer chest' },
  { id:'shoe',      label:'Shoe',       sub:'Angled shoe racks' },
  { id:'trouser',   label:'Trouser',    sub:'Pull-out trouser bars' },
  { id:'mirror',    label:'Mirror',     sub:'Full-length mirror' },
  { id:'empty',     label:'Empty',      sub:'Open reach-in space' },
]

const PRESET_MODELS: { label: string; sections: string[] }[] = [
  { label:'Classic',    sections:['hang-half','shelves'] },
  { label:'His & Hers', sections:['hang-full','hang-full'] },
  { label:'Organiser',  sections:['drawers','shelves','drawers'] },
  { label:'Kids',       sections:['hang-half','shoe','shelves'] },
  { label:'Linen',      sections:['shelves','shelves'] },
  { label:'Dressing',   sections:['mirror','hang-half','drawers'] },
]

function drawModule(id: string, x: number, y: number, w: number, h: number, accent = '#c96442'): React.ReactNode {
  const cx = x + w / 2
  const sh = '#e8e6e1'
  const mu = 'rgba(255,255,255,0.2)'
  switch (id) {
    case 'hang-full':
      return <g key="hf">
        <line x1={x+w*0.15} y1={y+h*0.08} x2={x+w*0.85} y2={y+h*0.08} stroke={sh} strokeWidth={1.2}/>
        <line x1={cx} y1={y+h*0.08} x2={cx} y2={y+h*0.22} stroke={sh} strokeWidth={0.8}/>
        <line x1={cx-3} y1={y+h*0.22} x2={cx+3} y2={y+h*0.22} stroke={sh} strokeWidth={0.8}/>
        <line x1={cx-6} y1={y+h*0.28} x2={cx-6} y2={y+h*0.65} stroke={sh} strokeWidth={0.8}/>
        <line x1={cx+6} y1={y+h*0.28} x2={cx+6} y2={y+h*0.65} stroke={sh} strokeWidth={0.8}/>
      </g>
    case 'hang-half':
      return <g key="hh">
        <line x1={x+w*0.15} y1={y+h*0.08} x2={x+w*0.85} y2={y+h*0.08} stroke={sh} strokeWidth={1.2}/>
        <line x1={cx} y1={y+h*0.08} x2={cx} y2={y+h*0.18} stroke={sh} strokeWidth={0.8}/>
        <line x1={cx-5} y1={y+h*0.25} x2={cx+5} y2={y+h*0.25} stroke={sh} strokeWidth={0.8}/>
        <line x1={x} y1={y+h*0.5} x2={x+w} y2={y+h*0.5} stroke={sh} strokeWidth={1}/>
        {[0.62,0.74,0.86].map((yp,i)=><line key={i} x1={x+4} y1={y+h*yp} x2={x+w-4} y2={y+h*yp} stroke={mu} strokeWidth={0.8}/>)}
      </g>
    case 'shelves':
      return <g key="sh">
        {[0.18,0.32,0.46,0.60,0.74,0.88].map((yp,i)=>(
          <line key={i} x1={x+4} y1={y+h*yp} x2={x+w-4} y2={y+h*yp} stroke={sh} strokeWidth={0.9}/>
        ))}
      </g>
    case 'drawers':
      return <g key="dr">
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
      return <g key="sh2">
        {[0.2,0.38,0.56,0.74].map((yp,i)=>(
          <line key={i} x1={x+4} y1={y+h*yp} x2={x+w-4} y2={y+h*(yp+0.1)} stroke={sh} strokeWidth={0.9}/>
        ))}
      </g>
    case 'trouser':
      return <g key="tr">
        {[0.2,0.4,0.6,0.8].map((yp,i)=>(
          <g key={i}>
            <line x1={x+6} y1={y+h*yp} x2={x+w-6} y2={y+h*yp} stroke={sh} strokeWidth={0.8}/>
            <line x1={cx} y1={y+h*yp} x2={cx} y2={y+h*(yp+0.1)} stroke={mu} strokeWidth={0.6}/>
          </g>
        ))}
      </g>
    case 'mirror':
      return <g key="mi">
        <rect x={x+6} y={y+h*0.06} width={w-12} height={h*0.88} rx={2}
          fill="rgba(180,210,230,0.15)" stroke="rgba(180,210,230,0.5)" strokeWidth={1}/>
        <line x1={x+10} y1={y+h*0.12} x2={x+w-10} y2={y+h*0.94} stroke="rgba(255,255,255,0.08)" strokeWidth={0.8}/>
      </g>
    default:
      return <g key="em">
        <line x1={x+8} y1={y+8} x2={x+w-8} y2={y+h-8} stroke={mu} strokeWidth={0.6}/>
        <line x1={x+w-8} y1={y+8} x2={x+8} y2={y+h-8} stroke={mu} strokeWidth={0.6}/>
      </g>
  }
}

function WardrobeFrontSVG({ sections, selectedIdx, onClick, scale = 1 }: {
  sections: string[]; selectedIdx?: number | null; onClick?: (i: number) => void; scale?: number
}) {
  const n   = sections.length
  const SW  = 56 * n   // total width per section
  const SH  = 120
  const TW  = SW * scale
  const TH  = SH * scale
  return (
    <svg viewBox={`0 0 ${SW} ${SH}`} width={TW} height={TH} style={{ display:'block' }}>
      <rect x={0} y={0} width={SW} height={SH} rx={2} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeWidth={1}/>
      {sections.map((sec, i) => {
        const sx = i * 56
        const isActive = selectedIdx === i
        return (
          <g key={i} style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={() => onClick?.(i)}>
            {isActive && <rect x={sx} y={0} width={56} height={SH} fill="rgba(201,100,66,0.18)"/>}
            {i > 0 && <line x1={sx} y1={2} x2={sx} y2={SH-2} stroke="rgba(255,255,255,0.18)" strokeWidth={0.8}/>}
            {drawModule(sec, sx+2, 2, 52, SH-4)}
            {isActive && <rect x={sx} y={0} width={56} height={SH} fill="none" stroke="#c96442" strokeWidth={1.5}/>}
          </g>
        )
      })}
    </svg>
  )
}

// ── BOQ ───────────────────────────────────────────────────────────────────────
function calcPrice(c: WardConfig) {
  const base = (c.width / 300) * 4500
  const hM   = c.height===2700?1.15:c.height===2400?1.08:c.height===1800?0.9:1.0
  const tM   = c.type==='sliding'?1.25:c.type==='corner'?1.45:c.type==='open'?0.75:1.0
  const lM   = c.layout==='drawer-heavy'?1.15:c.layout==='pantry'?1.1:1.0
  const fM   = c.shutterFinish==='glass'?1.25:c.shutterFinish==='gloss'?1.12:c.shutterFinish==='membrane'?1.08:1.0
  const iM   = c.interior==='premium'?1.2:c.interior==='homeoffice'?1.15:c.interior==='kids'?1.08:1.0
  return Math.round(base*hM*tM*lM*fM*iM/100)*100
}
function calcBOQ(c: WardConfig) {
  const doors   = c.type==='open'?0:c.type==='sliding'?Math.ceil(c.width/600)+1:Math.ceil(c.width/500)
  const shelves = c.layout==='full-hang'?1:c.layout==='pantry'?8:c.layout==='drawer-heavy'?4:5
  const drawers = c.layout==='drawer-heavy'?4:c.layout==='standard'?2:0
  const hinges  = c.type==='swing'?doors*3:0
  return { doors, shelves, drawers, hinges, total:calcPrice(c) }
}

// ── layout mini-SVG previews ──────────────────────────────────────────────────
function LayoutSVG({ id, active }: { id: WardLayout; active: boolean }) {
  const stroke = active ? '#fff' : '#6a6660'
  const bg     = active ? 'rgba(201,100,66,0.15)' : 'rgba(255,255,255,0.04)'
  return (
    <svg viewBox="0 0 50 70" style={{ width:50, height:70 }}>
      <rect x={1} y={1} width={48} height={68} rx={2} fill={bg} stroke={active?'#c96442':'rgba(255,255,255,0.15)'} strokeWidth={1} />
      {id==='standard' && <>
        <line x1={1} y1={25} x2={31} y2={25} stroke={stroke} strokeWidth={0.8} />
        <line x1={1} y1={10} x2={31} y2={10} stroke={stroke} strokeWidth={1.2} strokeDasharray="2 1" />
        <line x1={31} y1={1} x2={31} y2={69} stroke={stroke} strokeWidth={0.8} />
        {[18,26,34,42,50,58].map(y=><line key={y} x1={31} y1={y} x2={49} y2={y} stroke={stroke} strokeWidth={0.7}/>)}
        <rect x={2} y={53} width={13} height={7} rx={1} fill={stroke} fillOpacity={0.4}/>
        <rect x={17} y={53} width={13} height={7} rx={1} fill={stroke} fillOpacity={0.4}/>
      </>}
      {id==='full-hang' && <>
        <line x1={1} y1={14} x2={49} y2={14} stroke={stroke} strokeWidth={1.2} strokeDasharray="2 1" />
        <line x1={25} y1={14} x2={25} y2={65} stroke={stroke} strokeWidth={0.5} strokeDasharray="1 2" />
      </>}
      {id==='drawer-heavy' && <>
        {[14,24,34,44,54,64].slice(0,4).map((y,i)=><rect key={i} x={2} y={y} width={46} height={8} rx={1} fill={stroke} fillOpacity={0.3}/>)}
        {[14,24].map(y=><line key={y} x1={1} y1={y} x2={49} y2={y} stroke={stroke} strokeWidth={0.7}/>)}
        <line x1={1} y1={44} x2={49} y2={44} stroke={stroke} strokeWidth={0.8}/>
        <line x1={1} y1={12} x2={49} y2={12} stroke={stroke} strokeWidth={1.2} strokeDasharray="2 1" />
      </>}
      {id==='loft-hang' && <>
        <line x1={1} y1={20} x2={49} y2={20} stroke={stroke} strokeWidth={1} />
        <line x1={1} y1={34} x2={49} y2={34} stroke={stroke} strokeWidth={1.2} strokeDasharray="2 1" />
        <text x={25} y={14} textAnchor="middle" fontSize={5} fill={stroke} fontFamily="Inter Tight">LOFT</text>
        <line x1={25} y1={34} x2={25} y2={68} stroke={stroke} strokeWidth={0.5} strokeDasharray="1 2" />
      </>}
      {id==='pantry' && <>
        {[10,18,26,34,42,50,58,66].map(y=><line key={y} x1={1} y1={y} x2={49} y2={y} stroke={stroke} strokeWidth={0.8}/>)}
      </>}
    </svg>
  )
}

// ── furniture catalogue ───────────────────────────────────────────────────────
type Cat = 'wardrobe' | 'kitchen' | 'office' | 'living'
interface CatalogItem { id:string; label:string; w:number; d:number; h:number; cat:Cat; price:number; top:string; side:string; front:string }
interface Placed extends CatalogItem { uid:string; x:number; y:number; rot:0|90|180|270 }

const CATALOG: CatalogItem[] = [
  { id:'W-450',    label:'Wardrobe 450',  w:450,  d:580,  h:2100, cat:'wardrobe', price:9000,  top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  { id:'W-600',    label:'Wardrobe 600',  w:600,  d:580,  h:2100, cat:'wardrobe', price:11000, top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  { id:'W-750',    label:'Wardrobe 750',  w:750,  d:580,  h:2100, cat:'wardrobe', price:13000, top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  { id:'W-900',    label:'Wardrobe 900',  w:900,  d:580,  h:2100, cat:'wardrobe', price:15000, top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  { id:'K-B-600',  label:'Base 600',      w:600,  d:600,  h:870,  cat:'kitchen',  price:8000,  top:'#b8d4c8', side:'#7aa898', front:'#8ab8a8' },
  { id:'K-B-900',  label:'Base 900',      w:900,  d:600,  h:870,  cat:'kitchen',  price:11000, top:'#b8d4c8', side:'#7aa898', front:'#8ab8a8' },
  { id:'K-SINK',   label:'Sink unit',     w:900,  d:600,  h:870,  cat:'kitchen',  price:6000,  top:'#b8cce4', side:'#7898b8', front:'#88a8c8' },
  { id:'K-FRIDGE', label:'Fridge',        w:700,  d:700,  h:1800, cat:'kitchen',  price:0,     top:'#d8e0e8', side:'#a8b8c8', front:'#b8c8d8' },
  { id:'O-D-1200', label:'Desk 1200',     w:1200, d:600,  h:750,  cat:'office',   price:18000, top:'#d8c8e8', side:'#8870a8', front:'#a890c0' },
  { id:'O-D-1800', label:'Desk 1800',     w:1800, d:700,  h:750,  cat:'office',   price:26000, top:'#d8c8e8', side:'#8870a8', front:'#a890c0' },
  { id:'O-M-6P',   label:'Meeting 6P',    w:2400, d:1200, h:750,  cat:'office',   price:44000, top:'#e8d8c8', side:'#b89878', front:'#c8a888' },
  { id:'O-S-1200', label:'Storage wall',  w:1200, d:400,  h:1800, cat:'office',   price:19000, top:'#d8c8e8', side:'#8870a8', front:'#a890c0' },
  { id:'O-CHAIR',  label:'Chair',         w:600,  d:600,  h:800,  cat:'office',   price:0,     top:'#e8d8b8', side:'#b89858', front:'#c8a868' },
  { id:'L-BED-Q',  label:'Queen bed',     w:1600, d:2000, h:550,  cat:'living',   price:0,     top:'#e8e0d0', side:'#b8a880', front:'#c8b890' },
  { id:'L-SOFA',   label:'Sofa 3-seat',   w:2200, d:900,  h:850,  cat:'living',   price:0,     top:'#d8c0b8', side:'#a87868', front:'#b88878' },
  { id:'L-TV',     label:'TV unit',       w:1800, d:450,  h:500,  cat:'living',   price:12000, top:'#d8c8b8', side:'#a89878', front:'#b8a888' },
]

const newUid = () => Math.random().toString(36).slice(2,8)
function rotDims(it: Placed) {
  return it.rot===90||it.rot===270 ? { w:it.d, d:it.w } : { w:it.w, d:it.d }
}

// ── step labels ───────────────────────────────────────────────────────────────
const STEPS = ['01 Type','02 Dimensions','03 Frame Layout','04 Shutter Finish','05 Interior Preset','06 BOQ & Confirm']

// ── configurator panel ────────────────────────────────────────────────────────
interface ConfigPanelProps {
  config: WardConfig
  setConfig: (c: WardConfig) => void
  step: number
  setStep: (n: number) => void
  onPlace: () => void
  onClose: () => void
  clientName: string; setClientName: (v:string)=>void
  clientPhone: string; setClientPhone: (v:string)=>void
}

function ConfigPanel({ config, setConfig, step, setStep, onPlace, onClose, clientName, setClientName, clientPhone, setClientPhone }: ConfigPanelProps) {
  const set = (patch: Partial<WardConfig>) => {
    const next = { ...config, ...patch }
    if (patch.width !== undefined) {
      const n = getSectionCount(next.width)
      next.interiorSections = resizeSections(next.interiorSections, n)
    }
    setConfig(next)
  }
  const boq = calcBOQ(config)
  const [selectedSection, setSelectedSection] = useState<number | null>(null)

  const PANEL_BG   = '#1a1714'
  const BORDER     = 'rgba(255,255,255,0.08)'
  const TEXT       = '#e8e6e1'
  const MUTED      = 'rgba(255,255,255,0.35)'
  const ACCENT     = '#c96442'

  const pill  = (active: boolean): React.CSSProperties => ({
    padding:'6px 14px', borderRadius:99, cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:'inherit',
    background:active?ACCENT:'rgba(255,255,255,0.06)', color:active?'#fff':MUTED,
    border:`1px solid ${active?ACCENT:'rgba(255,255,255,0.1)'}`,
  })

  const optCard = (active: boolean): React.CSSProperties => ({
    padding:'10px 12px', borderRadius:10, cursor:'pointer', border:`1.5px solid ${active?ACCENT:'rgba(255,255,255,0.1)'}`,
    background:active?'rgba(201,100,66,0.12)':'rgba(255,255,255,0.03)',
    flex:1, textAlign:'center' as const, userSelect:'none' as const,
  })

  return (
    <div style={{ width:360, borderLeft:`1px solid ${BORDER}`, display:'flex', flexDirection:'column', background:PANEL_BG, flexShrink:0, height:'100%', overflow:'hidden' }}>

      {/* Step bar */}
      <div style={{ padding:'14px 16px 0', borderBottom:`1px solid ${BORDER}`, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:ACCENT }}>Wardrobe Configurator</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:MUTED, cursor:'pointer', fontSize:16, padding:'0 2px', lineHeight:1 }}>×</button>
        </div>
        <div style={{ display:'flex', gap:2, marginBottom:12, overflowX:'auto' }}>
          {STEPS.map((s, i) => {
            const done = i < step, cur = i === step
            return (
              <button key={i} onClick={() => setStep(i)}
                style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 8px', borderRadius:6, border:'none', cursor:'pointer', fontFamily:'inherit',
                  background:cur?'rgba(201,100,66,0.18)':done?'rgba(255,255,255,0.05)':'transparent',
                  color:cur?ACCENT:done?'rgba(255,255,255,0.6)':MUTED, flexShrink:0 }}>
                <span style={{ width:14, height:14, borderRadius:99, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:800,
                  background:cur?ACCENT:done?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.08)',
                  color:cur?'#fff':done?'rgba(255,255,255,0.8)':MUTED }}>
                  {done ? '✓' : i+1}
                </span>
                <span style={{ fontSize:9, fontWeight:cur?700:500, whiteSpace:'nowrap' }}>{s.split(' ').slice(1).join(' ')}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div style={{ flex:1, overflowY:'auto', padding:'20px 18px' }}>

        {/* ── 01 Type ── */}
        {step===0 && (
          <div>
            <h3 style={{ fontSize:15, fontWeight:700, color:TEXT, margin:'0 0 4px' }}>Wardrobe type</h3>
            <p style={{ fontSize:11, color:MUTED, margin:'0 0 18px' }}>Defines door mechanism and space requirement</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {([
                { id:'swing',   label:'Swing',   sub:'Hinged doors · 600mm clearance', icon:'⊟' },
                { id:'sliding', label:'Sliding', sub:'2–3 panels · no swing clearance', icon:'⊞' },
                { id:'open',    label:'Open',    sub:'No shutters · display & reach-in', icon:'⊠' },
                { id:'corner',  label:'Corner',  sub:'L-shape · maximises corner space', icon:'⌐' },
              ] as const).map(t => (
                <div key={t.id} onClick={() => set({ type:t.id })}
                  style={{ ...optCard(config.type===t.id), padding:'14px 12px' }}>
                  <div style={{ fontSize:22, marginBottom:6 }}>{t.icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:TEXT, marginBottom:3 }}>{t.label}</div>
                  <div style={{ fontSize:10, color:MUTED, lineHeight:1.4 }}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 02 Dimensions ── */}
        {step===1 && (
          <div>
            <h3 style={{ fontSize:15, fontWeight:700, color:TEXT, margin:'0 0 4px' }}>Dimensions</h3>
            <p style={{ fontSize:11, color:MUTED, margin:'0 0 20px' }}>Snap to standard module widths in mm</p>

            {/* Width */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Width (mm)</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                {WIDTH_OPTS.map(w => (
                  <button key={w} onClick={() => set({ width:w })} style={pill(config.width===w)}>{w}</button>
                ))}
              </div>
            </div>

            {/* Height */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Height (mm)</div>
              <div style={{ display:'flex', gap:6 }}>
                {HEIGHT_OPTS.map(h => (
                  <button key={h} onClick={() => set({ height:h })} style={pill(config.height===h)}>{h}</button>
                ))}
              </div>
            </div>

            {/* Depth */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Depth (mm)</div>
              <div style={{ display:'flex', gap:6 }}>
                {DEPTH_OPTS.map(d => (
                  <button key={d} onClick={() => set({ depth:d })} style={pill(config.depth===d)}>{d}</button>
                ))}
              </div>
            </div>

            {/* Preview box */}
            <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'14px 16px', display:'flex', alignItems:'center', gap:14 }}>
              <svg viewBox="0 0 60 80" width={60} height={80}>
                <rect x={2} y={2} width={56} height={76} rx={2} fill="rgba(201,100,66,0.15)" stroke={ACCENT} strokeWidth={1.5}/>
                <line x1={2} y1={60} x2={58} y2={60} stroke={ACCENT} strokeWidth={0.8}/>
                <text x={30} y={38} textAnchor="middle" fontSize={8} fill={TEXT} fontFamily="JetBrains Mono">{config.width}</text>
                <text x={30} y={48} textAnchor="middle" fontSize={7} fill={MUTED} fontFamily="JetBrains Mono">W mm</text>
              </svg>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:TEXT, fontFamily:'JetBrains Mono' }}>{config.width} × {config.depth} × {config.height}</div>
                <div style={{ fontSize:10, color:MUTED, marginTop:2 }}>Width × Depth × Height (mm)</div>
                <div style={{ fontSize:11, color:ACCENT, fontWeight:700, marginTop:6, fontFamily:'JetBrains Mono' }}>{inr(calcPrice(config))}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── 03 Frame layout ── */}
        {step===2 && (
          <div>
            <h3 style={{ fontSize:15, fontWeight:700, color:TEXT, margin:'0 0 4px' }}>Frame layout</h3>
            <p style={{ fontSize:11, color:MUTED, margin:'0 0 18px' }}>Internal structure — shelves, rails and drawers</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {([
                { id:'standard',     label:'Standard',      sub:'½ hanging + shelf tower + 2 drawers' },
                { id:'full-hang',    label:'Full Hang',     sub:'Full-width rail · ideal for suits & dresses' },
                { id:'drawer-heavy', label:'Drawer Heavy',  sub:'4 drawer units + fixed shelves above' },
                { id:'loft-hang',    label:'Loft + Hang',   sub:'Loft storage on top · hanging below' },
                { id:'pantry',       label:'Pantry / Shelf',sub:'8 fixed shelves · books, linen, display' },
              ] as const).map(l => (
                <div key={l.id} onClick={() => set({ layout:l.id })}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:10, cursor:'pointer',
                    border:`1.5px solid ${config.layout===l.id?ACCENT:'rgba(255,255,255,0.1)'}`,
                    background:config.layout===l.id?'rgba(201,100,66,0.1)':'rgba(255,255,255,0.03)' }}>
                  <LayoutSVG id={l.id} active={config.layout===l.id} />
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:config.layout===l.id?ACCENT:TEXT }}>{l.label}</div>
                    <div style={{ fontSize:10, color:MUTED, marginTop:3, lineHeight:1.4 }}>{l.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 04 Shutter finish ── */}
        {step===3 && (
          <div>
            <h3 style={{ fontSize:15, fontWeight:700, color:TEXT, margin:'0 0 4px' }}>Shutter finish</h3>
            <p style={{ fontSize:11, color:MUTED, margin:'0 0 18px' }}>Door colour · surface texture · handle style</p>

            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Colour</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8, marginBottom:18 }}>
              {SHUTTER_COLORS.map(c => (
                <div key={c.hex} onClick={() => set({ shutterColor:c.hex })}
                  style={{ cursor:'pointer' }}>
                  <div style={{ width:'100%', aspectRatio:'1', borderRadius:8, background:c.hex,
                    border:`2px solid ${config.shutterColor===c.hex?ACCENT:'transparent'}`,
                    boxShadow:config.shutterColor===c.hex?`0 0 0 3px rgba(201,100,66,0.3)`:undefined }} />
                  <div style={{ fontSize:8, color:MUTED, textAlign:'center', marginTop:4 }}>{c.name}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Surface</div>
            <div style={{ display:'flex', gap:6, marginBottom:18, flexWrap:'wrap' }}>
              {([
                { id:'matt',     label:'Matt',      sub:'Smooth flat' },
                { id:'gloss',    label:'Gloss',     sub:'High shine' },
                { id:'membrane', label:'Membrane',  sub:'Textured PVC' },
                { id:'glass',    label:'Glass',     sub:'Frosted / Clear' },
              ] as const).map(f => (
                <button key={f.id} onClick={() => set({ shutterFinish:f.id })}
                  style={{ ...pill(config.shutterFinish===f.id), display:'flex', flexDirection:'column', alignItems:'center', padding:'8px 10px', borderRadius:8 }}>
                  <span style={{ fontSize:11 }}>{f.label}</span>
                  <span style={{ fontSize:8, opacity:0.7, fontWeight:400 }}>{f.sub}</span>
                </button>
              ))}
            </div>

            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Handle</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {([
                { id:'none',   label:'Push-to-open', icon:'⊡' },
                { id:'bar',    label:'Bar pull',      icon:'⊟' },
                { id:'knob',   label:'Round knob',    icon:'●' },
                { id:'j-pull', label:'J-pull',        icon:'⌐' },
              ] as const).map(h => (
                <button key={h.id} onClick={() => set({ handle:h.id })}
                  style={{ ...pill(config.handle===h.id), display:'flex', alignItems:'center', gap:5 }}>
                  <span>{h.icon}</span><span>{h.label}</span>
                </button>
              ))}
            </div>

            {/* Live preview swatch */}
            <div style={{ marginTop:20, borderRadius:10, overflow:'hidden', border:`1px solid rgba(255,255,255,0.1)` }}>
              <div style={{ height:80, background:config.shutterColor, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {config.handle==='bar'   && <div style={{ width:40, height:4, background:'rgba(0,0,0,0.25)', borderRadius:99 }}/>}
                {config.handle==='knob'  && <div style={{ width:12, height:12, background:'rgba(0,0,0,0.25)', borderRadius:99 }}/>}
                {config.handle==='j-pull'&& <div style={{ width:6, height:28, background:'rgba(0,0,0,0.25)', borderRadius:3 }}/>}
              </div>
              <div style={{ padding:'8px 12px', background:'rgba(255,255,255,0.04)', fontSize:10, color:MUTED }}>
                {SHUTTER_COLORS.find(c=>c.hex===config.shutterColor)?.name} · {config.shutterFinish} · {config.handle==='none'?'Push-to-open':config.handle}
              </div>
            </div>
          </div>
        )}

        {/* ── 05 Interior designer ── */}
        {step===4 && (() => {
          const n = getSectionCount(config.width)
          const sections = resizeSections(config.interiorSections, n)
          const scale = Math.min(1.1, 270 / (n * 56))
          return (
            <div>
              <h3 style={{ fontSize:15, fontWeight:700, color:TEXT, margin:'0 0 4px' }}>Interior designer</h3>
              <p style={{ fontSize:11, color:MUTED, margin:'0 0 14px' }}>Design each section — pick a preset or customise</p>

              {/* Default models */}
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Quick presets</div>
              <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:18 }}>
                {PRESET_MODELS.map(m => (
                  <div key={m.label} onClick={() => {
                    const adapted = resizeSections(m.sections, n)
                    set({ interiorSections: adapted })
                    setSelectedSection(null)
                  }} style={{ cursor:'pointer', textAlign:'center' }}>
                    <div style={{ border:`1.5px solid rgba(255,255,255,0.15)`, borderRadius:6, padding:'4px 3px', background:'rgba(255,255,255,0.04)',
                      width:68 }}>
                      <WardrobeFrontSVG sections={resizeSections(m.sections, Math.min(m.sections.length, 3))} scale={68 / (Math.min(m.sections.length, 3) * 56)}/>
                    </div>
                    <div style={{ fontSize:8, color:MUTED, marginTop:3, lineHeight:1.2 }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Live canvas */}
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:MUTED, marginBottom:6 }}>Your layout</div>
              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'12px 8px', marginBottom:10, display:'flex', justifyContent:'center' }}>
                <WardrobeFrontSVG sections={sections} selectedIdx={selectedSection} scale={scale} onClick={i => setSelectedSection(selectedSection===i ? null : i)}/>
              </div>
              <div style={{ fontSize:9, color:MUTED, textAlign:'center', marginBottom:12 }}>
                {selectedSection === null ? 'Click a section to configure it' : `Section ${selectedSection+1} selected — choose a module:`}
              </div>

              {/* Module picker */}
              {selectedSection !== null && (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
                  {MODULES.map(m => {
                    const isCur = sections[selectedSection] === m.id
                    return (
                      <div key={m.id} onClick={() => {
                        const updated = [...sections]
                        updated[selectedSection] = m.id
                        set({ interiorSections: updated })
                      }} style={{ cursor:'pointer', textAlign:'center',
                        border:`1.5px solid ${isCur ? ACCENT : 'rgba(255,255,255,0.1)'}`,
                        borderRadius:7, padding:'5px 3px', background:isCur?'rgba(201,100,66,0.12)':'rgba(255,255,255,0.03)' }}>
                        <svg viewBox={`0 0 56 80`} width={42} height={60} style={{ display:'block', margin:'0 auto' }}>
                          <rect width={56} height={80} fill="rgba(255,255,255,0.04)"/>
                          {drawModule(m.id, 2, 2, 52, 76)}
                        </svg>
                        <div style={{ fontSize:8, fontWeight:isCur?700:500, color:isCur?ACCENT:MUTED, marginTop:2 }}>{m.label}</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })()}

        {/* ── 06 BOQ & Confirm ── */}
        {step===5 && (
          <div>
            <h3 style={{ fontSize:15, fontWeight:700, color:TEXT, margin:'0 0 4px' }}>Bill of Quantities</h3>
            <p style={{ fontSize:11, color:MUTED, margin:'0 0 16px' }}>Summary · confirm to place on floor and send to studio</p>

            {/* Config summary */}
            <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'12px 14px', marginBottom:14 }}>
              {[
                { label:'Type',     value: config.type[0].toUpperCase()+config.type.slice(1)+' wardrobe' },
                { label:'Size',     value: `${config.width} × ${config.depth} × ${config.height} mm` },
                { label:'Layout',   value: config.layout.replace('-',' ') },
                { label:'Finish',   value: `${SHUTTER_COLORS.find(c=>c.hex===config.shutterColor)?.name} · ${config.shutterFinish}` },
                { label:'Handle',   value: config.handle==='none'?'Push-to-open':config.handle },
                { label:'Interior', value: config.interior },
              ].map(r => (
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', fontSize:11, padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', color:MUTED }}>
                  <span style={{ fontWeight:600, color:'rgba(255,255,255,0.5)' }}>{r.label}</span>
                  <span style={{ color:TEXT, textTransform:'capitalize' }}>{r.value}</span>
                </div>
              ))}
            </div>

            {/* Component counts */}
            <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'12px 14px', marginBottom:14 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Components</div>
              {[
                { label:'Door panels',    value: boq.doors },
                { label:'Fixed shelves',  value: boq.shelves },
                { label:'Drawer units',   value: boq.drawers },
                { label:'Cabinet hinges', value: boq.hinges },
              ].filter(r=>r.value>0).map(r => (
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', fontSize:11, padding:'4px 0', color:MUTED }}>
                  <span>{r.label}</span>
                  <span style={{ fontFamily:'JetBrains Mono', color:TEXT, fontWeight:600 }}>{r.value} pcs</span>
                </div>
              ))}
            </div>

            {/* Interior layout preview */}
            {(() => {
              const n = getSectionCount(config.width)
              const sections = resizeSections(config.interiorSections, n)
              const scale = Math.min(1, (322) / (n * 56))
              const MODULE_LABELS: Record<string, string> = {
                'hang-full':'Full Hang','hang-half':'Half Hang','shelves':'Shelves',
                'drawers':'Drawers','shoe':'Shoe','trouser':'Trouser','mirror':'Mirror','empty':'Empty',
              }
              return (
                <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'10px 12px', marginBottom:14 }}>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Interior layout</div>
                  <WardrobeFrontSVG sections={sections} scale={scale}/>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:7 }}>
                    {sections.map((s,i) => (
                      <span key={i} style={{ fontSize:8, padding:'2px 6px', borderRadius:99, background:'rgba(255,255,255,0.08)', color:MUTED }}>
                        S{i+1}: {MODULE_LABELS[s]??s}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* Total */}
            <div style={{ background:'rgba(201,100,66,0.12)', borderRadius:10, padding:'14px 16px', marginBottom:18, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:10, color:ACCENT, fontWeight:700, letterSpacing:'0.1em' }}>ESTIMATED TOTAL</div>
                <div style={{ fontSize:8, color:MUTED, marginTop:2 }}>incl. supply + installation</div>
              </div>
              <div style={{ fontSize:22, fontWeight:800, color:ACCENT, fontFamily:'JetBrains Mono' }}>{inr(boq.total)}</div>
            </div>

            {/* Client details */}
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Client details (optional)</div>
            {[
              { label:'Name',  val:clientName,  set:setClientName,  ph:'Ravi Sharma' },
              { label:'Phone', val:clientPhone, set:setClientPhone, ph:'98765 43210' },
            ].map(f => (
              <input key={f.label} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
                style={{ width:'100%', padding:'8px 10px', marginBottom:8, borderRadius:8, border:'1px solid rgba(255,255,255,0.12)',
                  background:'rgba(255,255,255,0.06)', color:TEXT, fontSize:12, fontFamily:'inherit', outline:'none', boxSizing:'border-box' as const }} />
            ))}
          </div>
        )}
      </div>

      {/* Navigation footer */}
      <div style={{ padding:'14px 18px', borderTop:`1px solid ${BORDER}`, display:'flex', gap:8, flexShrink:0 }}>
        {step > 0 && (
          <button onClick={() => setStep(step-1)}
            style={{ flex:1, padding:'9px', borderRadius:8, border:`1px solid rgba(255,255,255,0.12)`, background:'transparent', color:TEXT, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            ← Back
          </button>
        )}
        {step < 5 ? (
          <button onClick={() => setStep(step+1)}
            style={{ flex:2, padding:'9px', borderRadius:8, border:'none', background:ACCENT, color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
            Next →
          </button>
        ) : (
          <button onClick={onPlace}
            style={{ flex:2, padding:'9px', borderRadius:8, border:'none', background:ACCENT, color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>
            Place on floor + Send to Studio →
          </button>
        )}
      </div>
    </div>
  )
}

// ── main component ────────────────────────────────────────────────────────────
export default function PlannerPage() {
  const addOrder   = useKreoboxStore(s => s.addOrder)
  const showToast  = useKreoboxStore(s => s.showToast)

  const [roomW, setRoomW] = useState(5000)
  const [roomD, setRoomD] = useState(4000)
  const WALL_H = 2700

  const [catFilter, setCatFilter] = useState<Cat|'all'>('all')
  const [items,     setItems]     = useState<Placed[]>([])
  const [selected,  setSelected]  = useState<string|null>(null)
  const [activePal, setActivePal] = useState<string|null>(null)
  const [view,      setView]      = useState<'3d'|'2d'>('3d')

  // configurator state
  const [showConfig,    setShowConfig]    = useState(true)
  const [configStep,    setConfigStep]    = useState(0)
  const [wardConfig,    setWardConfig]    = useState<WardConfig>(DFLT)
  const [clientName,    setClientName]    = useState('')
  const [clientPhone,   setClientPhone]   = useState('')
  const [pendingPlace,  setPendingPlace]  = useState(false)

  const svgRef = useRef<SVGSVGElement>(null)

  const offX = roomD * COS * SC
  const offY = WALL_H * SC + 20
  const svgW = (roomW + roomD) * COS * SC + 40
  const svgH = (roomW + roomD) * SIN * SC + WALL_H * SC + 60

  function pt(wx: number, wy: number, wz = 0): Pt {
    const p = iso(wx, wy, wz)
    return { x: p.x + offX + 20, y: p.y + offY }
  }

  // place configured wardrobe on floor
  const handlePlace = useCallback(() => {
    const uid  = newUid()
    const w    = wardConfig.width
    const d    = wardConfig.depth
    const h    = wardConfig.height
    const col  = wardConfig.shutterColor
    // compute tint colors from shutter color
    const placed: Placed = {
      uid, x: snap(100), y: snap(roomD - d - 200), rot: 0,
      id: `W-CUSTOM-${uid}`, label: `Wardrobe ${w}`, cat: 'wardrobe',
      w, d, h, price: calcPrice(wardConfig),
      top:  col+'cc', side: col+'88', front: col+'aa',
    }
    setItems(prev => [...prev, placed])
    setSelected(uid)

    // create order
    const orderId = 'ORD-' + Math.floor(1050 + Math.random() * 900)
    const order: KBOrder = {
      id: orderId,
      customer: { name: clientName||'Planner client', phone: clientPhone||'—', city:'Bengaluru', area:'—' },
      contractor: 'Suresh Modulars',
      type: 'wardrobe',
      config: {
        type:'wardrobe', wallWidth:w, height:h, frames:[], walls:[],
        shutter: wardConfig.shutterFinish.toUpperCase(),
        preset: wardConfig.layout.toUpperCase(),
      } as any,
      advance: Math.round(calcPrice(wardConfig) * 0.35),
      total: calcPrice(wardConfig),
      stage: 'Quoted',
      createdAt: new Date().toISOString().slice(0, 10),
      panels: generatePanels({ type:'wardrobe', wallWidth:w, height:h, frames:[], walls:[], shutter:'S-WHITE', preset:'PLANNER' }),
    }
    addOrder(order)
    showToast(`${orderId} · ${inr(calcPrice(wardConfig))} · sent to Studio`)
    setShowConfig(false)
    setPendingPlace(false)
  }, [wardConfig, roomD, clientName, clientPhone, addOrder, showToast])

  // SVG click to place palette item
  const onSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!activePal || !svgRef.current) return
    const rect  = svgRef.current.getBoundingClientRect()
    const sx    = e.clientX - rect.left - offX - 20
    const sy    = e.clientY - rect.top  - offY
    const world = fromIso(sx, sy)
    const src   = CATALOG.find(i => i.id === activePal)
    if (!src) return
    const x = Math.max(0, Math.min(snap(world.x - src.w/2), roomW - src.w))
    const y = Math.max(0, Math.min(snap(world.y - src.d/2), roomD - src.d))
    const uid = newUid()
    setItems(prev => [...prev, { ...src, uid, x, y, rot:0 }])
    setSelected(uid)
    setActivePal(null)
    // open configurator if it's a wardrobe
    if (src.cat === 'wardrobe') {
      setWardConfig({ ...DFLT, width:src.w, height:src.h, depth:src.d })
      setConfigStep(0)
      setShowConfig(true)
    }
  }, [activePal, offX, offY, roomW, roomD])

  const draggingPal = useRef<string|null>(null)
  const onPalDragStart = (id: string) => { draggingPal.current = id }

  const onSvgDrop = (e: React.DragEvent<SVGSVGElement>) => {
    e.preventDefault()
    if (!draggingPal.current || !svgRef.current) return
    const rect  = svgRef.current.getBoundingClientRect()
    const sx    = e.clientX - rect.left - offX - 20
    const sy    = e.clientY - rect.top  - offY
    const world = fromIso(sx, sy)
    const src   = CATALOG.find(i => i.id === draggingPal.current)
    if (!src) return
    const x = Math.max(0, Math.min(snap(world.x - src.w/2), roomW - src.w))
    const y = Math.max(0, Math.min(snap(world.y - src.d/2), roomD - src.d))
    const uid = newUid()
    setItems(prev => [...prev, { ...src, uid, x, y, rot:0 }])
    setSelected(uid)
    draggingPal.current = null
    if (src.cat === 'wardrobe') {
      setWardConfig({ ...DFLT, width:src.w, height:src.h, depth:src.d })
      setConfigStep(0)
      setShowConfig(true)
    }
  }

  const move = (dx: number, dy: number) => {
    if (!selected) return
    setItems(prev => prev.map(it => {
      if (it.uid !== selected) return it
      const { w, d } = rotDims(it)
      return { ...it, x:Math.max(0,Math.min(it.x+dx,roomW-w)), y:Math.max(0,Math.min(it.y+dy,roomD-d)) }
    }))
  }
  const rotSel = () => setItems(prev => prev.map(it => it.uid!==selected?it:{ ...it, rot:((it.rot+90)%360) as 0|90|180|270 }))
  const delSel = () => { setItems(prev => prev.filter(i=>i.uid!==selected)); setSelected(null) }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key==='Delete'||e.key==='Backspace') delSel()
      if (e.key==='r') rotSel()
      if (e.key==='ArrowLeft')  move(-GRID,0)
      if (e.key==='ArrowRight') move(GRID,0)
      if (e.key==='ArrowUp')    move(0,-GRID)
      if (e.key==='ArrowDown')  move(0,GRID)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  const selectedItem = items.find(i=>i.uid===selected)
  const totalPrice   = items.reduce((s,i)=>s+i.price,0)
  const sorted       = [...items].sort((a,b)=>(b.x+b.y)-(a.x+a.y))
  const palette      = catFilter==='all' ? CATALOG : CATALOG.filter(i=>i.cat===catFilter)

  return (
    <div style={{ display:'flex', height:'100vh', background:'#141210', color:'#e8e6e1', fontFamily:'"Inter Tight",sans-serif', overflow:'hidden' }}>

      {/* ── Left palette ──────────────────────────────────────────────────── */}
      <aside style={{ width:176, borderRight:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'12px 10px 8px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'#c96442', marginBottom:8 }}>Drag / click to place</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
            {(['all','wardrobe','kitchen','office','living'] as const).map(c => (
              <button key={c} onClick={()=>setCatFilter(c)}
                style={{ padding:'2px 7px', borderRadius:99, fontSize:9, fontWeight:600, cursor:'pointer', fontFamily:'inherit', textTransform:'capitalize',
                  background:catFilter===c?'#c96442':'transparent', color:catFilter===c?'#fff':'rgba(255,255,255,0.4)',
                  border:`1px solid ${catFilter===c?'#c96442':'rgba(255,255,255,0.12)'}` }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* "New Wardrobe" quick launcher */}
        <button onClick={() => { setWardConfig(DFLT); setConfigStep(0); setShowConfig(true) }}
          style={{ margin:'8px 8px 0', padding:'7px', borderRadius:8, border:'1px solid rgba(201,100,66,0.4)', background:'rgba(201,100,66,0.1)',
            color:'#c96442', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'inherit', textAlign:'center' }}>
          + New wardrobe
        </button>

        <div style={{ flex:1, overflowY:'auto', padding:'4px 0' }}>
          {palette.map(item => {
            const isActive = activePal===item.id
            return (
              <div key={item.id} draggable onDragStart={()=>onPalDragStart(item.id)}
                onClick={()=>setActivePal(isActive?null:item.id)}
                style={{ padding:'7px 10px', cursor:'pointer', borderBottom:'1px solid rgba(255,255,255,0.04)',
                  display:'flex', alignItems:'center', gap:7, userSelect:'none',
                  background:isActive?'rgba(201,100,66,0.18)':'transparent',
                  borderLeft:isActive?'2px solid #c96442':'2px solid transparent' }}
                onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background='rgba(255,255,255,0.04)' }}
                onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background='transparent' }}>
                <svg width={28} height={24} viewBox="0 0 32 28" style={{ flexShrink:0 }}>
                  <polygon points="16,4 28,10 28,22 16,28" fill={item.side}/>
                  <polygon points="4,10 16,4 28,10 16,16"  fill={item.top}/>
                  <polygon points="4,10 16,16 16,28 4,22"  fill={item.front}/>
                </svg>
                <div>
                  <div style={{ fontSize:10, fontWeight:600 }}>{item.label}</div>
                  <div style={{ fontSize:8, color:'rgba(255,255,255,0.3)', marginTop:1 }}>{item.w}×{item.d}mm</div>
                  {item.price>0 && <div style={{ fontSize:8, color:'#c96442', fontFamily:'JetBrains Mono' }}>{inr(item.price)}</div>}
                </div>
              </div>
            )
          })}
        </div>
        {activePal && (
          <div style={{ padding:'7px 10px', background:'rgba(201,100,66,0.15)', borderTop:'1px solid rgba(201,100,66,0.3)', fontSize:9, color:'#c96442', fontWeight:700 }}>
            ↗ Click room floor to place
          </div>
        )}
      </aside>

      {/* ── Main floor plan ───────────────────────────────────────────────── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>

        {/* Toolbar */}
        <div style={{ height:46, display:'flex', alignItems:'center', gap:8, padding:'0 12px', borderBottom:'1px solid rgba(255,255,255,0.08)', flexShrink:0 }}>
          <div style={{ display:'flex', borderRadius:8, overflow:'hidden', border:'1px solid rgba(255,255,255,0.12)' }}>
            {(['3d','2d'] as const).map(v => (
              <button key={v} onClick={()=>setView(v)}
                style={{ padding:'5px 11px', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:11, fontWeight:700, textTransform:'uppercase',
                  background:view===v?'#c96442':'transparent', color:view===v?'#fff':'rgba(255,255,255,0.45)' }}>
                {v}
              </button>
            ))}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ fontSize:9, color:'rgba(255,255,255,0.35)', fontWeight:700, letterSpacing:'0.1em' }}>ROOM</span>
            <input type="number" value={roomW} onChange={e=>setRoomW(+e.target.value||5000)} step={100} min={2000} max={12000}
              style={{ width:55, padding:'3px 4px', borderRadius:5, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.06)', color:'#e8e6e1', fontSize:10, fontFamily:'JetBrains Mono', textAlign:'center' }}/>
            <span style={{ color:'rgba(255,255,255,0.3)', fontSize:10 }}>×</span>
            <input type="number" value={roomD} onChange={e=>setRoomD(+e.target.value||4000)} step={100} min={2000} max={10000}
              style={{ width:55, padding:'3px 4px', borderRadius:5, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.06)', color:'#e8e6e1', fontSize:10, fontFamily:'JetBrains Mono', textAlign:'center' }}/>
            <span style={{ fontSize:9, color:'rgba(255,255,255,0.3)' }}>mm</span>
          </div>

          {selected && <>
            <div style={{ width:1, height:18, background:'rgba(255,255,255,0.1)' }}/>
            <button onClick={rotSel} style={tb}>↻</button>
            <button onClick={delSel} style={{ ...tb, color:'#ff8080', borderColor:'rgba(255,80,80,0.3)' }}>×</button>
            <button onClick={()=>move(-GRID,0)} style={tb}>←</button>
            <button onClick={()=>move(GRID,0)}  style={tb}>→</button>
            <button onClick={()=>move(0,-GRID)} style={tb}>↑</button>
            <button onClick={()=>move(0,GRID)}  style={tb}>↓</button>
            {selectedItem?.cat==='wardrobe' && (
              <button onClick={()=>{ setWardConfig({ ...DFLT, width:selectedItem.w, height:selectedItem.h, depth:selectedItem.d }); setConfigStep(0); setShowConfig(true) }}
                style={{ ...tb, color:'#c96442', borderColor:'rgba(201,100,66,0.4)', fontWeight:700 }}>⚙ Configure</button>
            )}
          </>}

          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>{items.length} items</span>
            {totalPrice>0 && <span style={{ fontFamily:'JetBrains Mono', fontSize:12, color:'#c96442', fontWeight:700 }}>{inr(totalPrice)}</span>}
            {!showConfig && (
              <button onClick={()=>{ setWardConfig(DFLT); setConfigStep(0); setShowConfig(true) }}
                style={{ padding:'6px 13px', borderRadius:8, border:'none', background:'rgba(201,100,66,0.15)', color:'#c96442', fontWeight:700, fontSize:11, cursor:'pointer', fontFamily:'inherit', border2:'1px solid rgba(201,100,66,0.3)' as any }}>
                + Configure wardrobe
              </button>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex:1, overflow:'auto', display:'flex', alignItems:'center', justifyContent:'center', background:'#0d0c0a', padding:32 }}
          onDragOver={e=>e.preventDefault()}>

          {view==='3d' ? (
            <svg ref={svgRef} width={svgW} height={svgH}
              style={{ display:'block', cursor:activePal?'crosshair':'default' }}
              onClick={onSvgClick} onDragOver={e=>e.preventDefault()} onDrop={onSvgDrop}>

              {/* Floor */}
              <polygon points={poly([pt(0,0),pt(roomW,0),pt(roomW,roomD),pt(0,roomD)])} fill="#e8e2d8" stroke="#b0a898" strokeWidth={1.5}/>

              {/* Grid */}
              {Array.from({length:Math.floor(roomW/GRID)-1},(_,i)=>(i+1)*GRID).map(x=>(
                <line key={`gx${x}`} x1={pt(x,0).x} y1={pt(x,0).y} x2={pt(x,roomD).x} y2={pt(x,roomD).y}
                  stroke={x%1000===0?"rgba(0,0,0,0.15)":"rgba(0,0,0,0.06)"} strokeWidth={x%1000===0?1:0.5}/>
              ))}
              {Array.from({length:Math.floor(roomD/GRID)-1},(_,i)=>(i+1)*GRID).map(y=>(
                <line key={`gy${y}`} x1={pt(0,y).x} y1={pt(0,y).y} x2={pt(roomW,y).x} y2={pt(roomW,y).y}
                  stroke={y%1000===0?"rgba(0,0,0,0.15)":"rgba(0,0,0,0.06)"} strokeWidth={y%1000===0?1:0.5}/>
              ))}

              {/* Back wall */}
              <polygon points={poly([pt(0,roomD,0),pt(roomW,roomD,0),pt(roomW,roomD,WALL_H),pt(0,roomD,WALL_H)])} fill="#d4c8b8" stroke="#b0a898" strokeWidth={1}/>
              <polygon points={poly([pt(0,roomD,0),pt(roomW,roomD,0),pt(roomW,roomD,120),pt(0,roomD,120)])} fill="#bfb3a3"/>

              {/* Left wall */}
              <polygon points={poly([pt(0,0,0),pt(0,roomD,0),pt(0,roomD,WALL_H),pt(0,0,WALL_H)])} fill="#c8bdb0" stroke="#b0a898" strokeWidth={1}/>
              <polygon points={poly([pt(0,0,0),pt(0,roomD,0),pt(0,roomD,120),pt(0,0,120)])} fill="#b8ada0"/>

              {/* Wall top edges */}
              <line x1={pt(0,0,WALL_H).x} y1={pt(0,0,WALL_H).y} x2={pt(roomW,0,WALL_H).x} y2={pt(roomW,0,WALL_H).y} stroke="#9a9080" strokeWidth={1}/>
              <line x1={pt(0,0,WALL_H).x} y1={pt(0,0,WALL_H).y} x2={pt(0,roomD,WALL_H).x} y2={pt(0,roomD,WALL_H).y} stroke="#9a9080" strokeWidth={1}/>

              {/* Furniture */}
              {sorted.map(item => {
                const { w, d } = rotDims(item)
                const ix=item.x, iy=item.y, ih=item.h
                const isSel = item.uid===selected
                const f00=pt(ix,iy,0), f10=pt(ix+w,iy,0), f11=pt(ix+w,iy+d,0), f01=pt(ix,iy+d,0)
                const t00=pt(ix,iy,ih), t10=pt(ix+w,iy,ih), t11=pt(ix+w,iy+d,ih), t01=pt(ix,iy+d,ih)
                const ss = isSel ? '#ffffff' : 'none'
                const sw = isSel ? 1.5 : 0
                return (
                  <g key={item.uid} style={{ cursor:'pointer' }}
                    onClick={e=>{ e.stopPropagation(); setSelected(isSel?null:item.uid); setActivePal(null) }}>
                    <polygon points={poly([f10,f11,t11,t10])} fill={item.side}  stroke={ss} strokeWidth={sw}/>
                    <polygon points={poly([f00,f10,t10,t00])} fill={item.front} stroke={ss} strokeWidth={sw}/>
                    <polygon points={poly([t00,t10,t11,t01])} fill={item.top}   stroke={ss} strokeWidth={sw}/>
                    {isSel && <>
                      <text x={(t00.x+t11.x)/2} y={(t00.y+t11.y)/2} textAnchor="middle" dominantBaseline="middle"
                        fontSize={8} fill="#1c1a16" fontFamily="Inter Tight, sans-serif" fontWeight="700" style={{ pointerEvents:'none' }}>{item.label}</text>
                      <polygon points={poly([f00,f10,f11,f01])} fill="rgba(201,100,66,0.15)" stroke="#c96442" strokeWidth={1.5} strokeDasharray="4 3"/>
                    </>}
                    <text x={(f00.x+f10.x)/2} y={(f00.y+f10.y)/2-(t00.y-f00.y)/2}
                      textAnchor="middle" fontSize={6} fill="rgba(0,0,0,0.4)" fontFamily="JetBrains Mono" style={{ pointerEvents:'none' }}>{item.w}</text>
                  </g>
                )
              })}

              {items.length===0 && (
                <text x={pt(roomW/2,roomD/2).x} y={pt(roomW/2,roomD/2).y}
                  textAnchor="middle" fontSize={12} fill="rgba(0,0,0,0.25)" fontFamily="Inter Tight, sans-serif">
                  Drag items or use "+ New wardrobe" →
                </text>
              )}
            </svg>

          ) : (
            // 2D floor plan
            <div style={{ position:'relative', width:roomW*0.057, height:roomD*0.057, background:'#f5f0e8',
              boxShadow:'0 0 0 10px #8B7355, 0 24px 80px rgba(0,0,0,0.6)', flexShrink:0 }}
              onDragOver={e=>e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (!draggingPal.current) return
                const rect = e.currentTarget.getBoundingClientRect()
                const sc2  = 0.057
                const src  = CATALOG.find(i=>i.id===draggingPal.current)
                if (!src) return
                const x = snap((e.clientX-rect.left)/sc2-src.w/2)
                const y = snap((e.clientY-rect.top)/sc2-src.d/2)
                const uid = newUid()
                setItems(prev=>[...prev,{ ...src, uid, x:Math.max(0,x), y:Math.max(0,y), rot:0 }])
                setSelected(uid); draggingPal.current=null
              }}
              onClick={()=>setSelected(null)}>
              {[...Array(Math.floor(roomW/1000))].map((_,i)=>(
                <div key={i} style={{ position:'absolute', left:(i+1)*1000*0.057, top:0, bottom:0, borderLeft:'1px solid rgba(0,0,0,0.08)' }}/>
              ))}
              {[...Array(Math.floor(roomD/1000))].map((_,i)=>(
                <div key={i} style={{ position:'absolute', top:(i+1)*1000*0.057, left:0, right:0, borderTop:'1px solid rgba(0,0,0,0.08)' }}/>
              ))}
              {items.map(item => {
                const sc2=0.057, { w,d }=rotDims(item), isSel=item.uid===selected
                return (
                  <div key={item.uid} onClick={e=>{ e.stopPropagation(); setSelected(isSel?null:item.uid) }}
                    style={{ position:'absolute', left:item.x*sc2, top:item.y*sc2, width:w*sc2, height:d*sc2,
                      background:item.top+'80', border:`2px solid ${isSel?'#c96442':item.top}`,
                      boxShadow:isSel?'0 0 0 2px white,0 0 0 4px #c96442':undefined,
                      display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', overflow:'hidden' }}>
                    <span style={{ fontSize:7, fontWeight:700, color:'#1c1a16', textAlign:'center', padding:'0 2px' }}>{item.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Configurator panel ────────────────────────────────────────────── */}
      {showConfig && (
        <ConfigPanel
          config={wardConfig} setConfig={setWardConfig}
          step={configStep}  setStep={setConfigStep}
          onPlace={handlePlace}
          onClose={()=>setShowConfig(false)}
          clientName={clientName}   setClientName={setClientName}
          clientPhone={clientPhone} setClientPhone={setClientPhone}
        />
      )}
    </div>
  )
}

const tb: React.CSSProperties = {
  padding:'4px 9px', borderRadius:6, border:'1px solid rgba(255,255,255,0.15)',
  background:'transparent', color:'#e8e6e1', fontSize:11, cursor:'pointer', fontFamily:'inherit', fontWeight:600,
}
