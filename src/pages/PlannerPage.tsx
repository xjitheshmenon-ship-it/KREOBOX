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

// ── room types ────────────────────────────────────────────────────────────────
type RoomType = 'kitchen' | 'bedroom' | 'office' | 'living'
type CatId = 'k-base'|'k-wall'|'k-tall'|'k-appl'|'wardrobe'|'bed'|'b-storage'|'desk'|'o-storage'|'o-seating'|'l-seating'|'l-table'|'l-storage'

const ROOM_META: Record<RoomType, { label:string; icon:string; desc:string; w:number; d:number; accent:string }> = {
  kitchen: { label:'Kitchen',     icon:'🍳', desc:'Base, wall & tall cabinets', w:3600, d:3000, accent:'#3a8a6a' },
  bedroom: { label:'Bedroom',     icon:'🛏', desc:'Wardrobes, beds & storage',  w:4000, d:3500, accent:'#c96442' },
  office:  { label:'Office',      icon:'💼', desc:'Desks, storage & seating',   w:5000, d:4000, accent:'#7060b0' },
  living:  { label:'Living room', icon:'🛋', desc:'Sofas, TV units & tables',   w:5500, d:4500, accent:'#b07040' },
}

const ROOM_CATS: Record<RoomType, { id:CatId; label:string }[]> = {
  kitchen: [
    { id:'k-base', label:'Base cabinets'  },
    { id:'k-wall', label:'Wall cabinets'  },
    { id:'k-tall', label:'Tall cabinets'  },
    { id:'k-appl', label:'Appliances'     },
  ],
  bedroom: [
    { id:'wardrobe',   label:'Wardrobes' },
    { id:'bed',        label:'Beds'      },
    { id:'b-storage',  label:'Storage'   },
  ],
  office: [
    { id:'desk',      label:'Desks'   },
    { id:'o-storage', label:'Storage' },
    { id:'o-seating', label:'Seating' },
  ],
  living: [
    { id:'l-seating', label:'Seating' },
    { id:'l-table',   label:'Tables'  },
    { id:'l-storage', label:'Storage' },
  ],
}

// ── wardrobe configurator types ───────────────────────────────────────────────
type WardType   = 'swing' | 'sliding' | 'open' | 'corner'
type WardLayout = 'standard' | 'full-hang' | 'drawer-heavy' | 'loft-hang' | 'pantry'
type ShutterFin = 'matt' | 'gloss' | 'membrane' | 'glass'
type HandleType = 'none' | 'bar' | 'knob' | 'j-pull'
type Interior   = 'basic' | 'premium' | 'homeoffice' | 'kids'

interface WardConfig {
  type: WardType; width: number; height: number; depth: number
  layout: WardLayout; shutterColor: string; shutterFinish: ShutterFin
  handle: HandleType; interior: Interior
}

const DFLT: WardConfig = {
  type:'swing', width:900, height:2100, depth:600,
  layout:'standard', shutterColor:'#f0ece4',
  shutterFinish:'matt', handle:'bar', interior:'basic',
}

const WIDTH_OPTS  = [450,600,750,900,1050,1200,1500,1800,2100,2400,2700]
const HEIGHT_OPTS = [1800,2100,2400,2700]
const DEPTH_OPTS  = [450,600]

const SHUTTER_COLORS = [
  { hex:'#f0ece4', name:'White Matt' }, { hex:'#e8e0c8', name:'Ivory'    },
  { hex:'#d4c8a8', name:'Linen'      }, { hex:'#7a5c3c', name:'Walnut'   },
  { hex:'#9a7050', name:'Teak'       }, { hex:'#3a3a3a', name:'Charcoal' },
  { hex:'#1a2a4a', name:'Navy'       }, { hex:'#5a1a1a', name:'Burgundy' },
]

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
        {[14,24,34,44].map((y,i)=><rect key={i} x={2} y={y} width={46} height={8} rx={1} fill={stroke} fillOpacity={0.3}/>)}
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

// ── furniture catalogue (expanded) ────────────────────────────────────────────
interface CatalogItem { id:string; label:string; w:number; d:number; h:number; cat:CatId; price:number; top:string; side:string; front:string }
interface Placed extends CatalogItem { uid:string; x:number; y:number; rot:0|90|180|270 }

const CATALOG: CatalogItem[] = [
  // ── Kitchen — Base ───────────────────────────────────────────────────────────
  { id:'K-B-300',    label:'Base 300',       w:300,  d:600, h:870,  cat:'k-base', price:5000,  top:'#b8d4c8', side:'#7aa898', front:'#8ab8a8' },
  { id:'K-B-600',    label:'Base 600',       w:600,  d:600, h:870,  cat:'k-base', price:8000,  top:'#b8d4c8', side:'#7aa898', front:'#8ab8a8' },
  { id:'K-B-900',    label:'Base 900',       w:900,  d:600, h:870,  cat:'k-base', price:11000, top:'#b8d4c8', side:'#7aa898', front:'#8ab8a8' },
  { id:'K-SINK',     label:'Sink unit',      w:900,  d:600, h:870,  cat:'k-base', price:6000,  top:'#b8cce4', side:'#7898b8', front:'#88a8c8' },
  { id:'K-HOB',      label:'Hob unit',       w:900,  d:600, h:870,  cat:'k-base', price:9000,  top:'#b8d4c8', side:'#7aa898', front:'#8ab8a8' },
  { id:'K-CORNER-B', label:'Corner base',    w:900,  d:900, h:870,  cat:'k-base', price:14000, top:'#a8c8b8', side:'#68988a', front:'#78a89a' },
  { id:'K-DISH',     label:'Dishwasher',     w:600,  d:600, h:870,  cat:'k-base', price:0,     top:'#d0d8e0', side:'#a0aab8', front:'#b0bac8' },
  { id:'K-PULL',     label:'Pull-out 600',   w:600,  d:600, h:870,  cat:'k-base', price:10500, top:'#b8d4c8', side:'#7aa898', front:'#8ab8a8' },
  // ── Kitchen — Wall ───────────────────────────────────────────────────────────
  { id:'K-W-300',    label:'Wall 300',       w:300,  d:320, h:720,  cat:'k-wall', price:3500,  top:'#c8e4d8', side:'#8ab4a8', front:'#9ac4b8' },
  { id:'K-W-600',    label:'Wall 600',       w:600,  d:320, h:720,  cat:'k-wall', price:5500,  top:'#c8e4d8', side:'#8ab4a8', front:'#9ac4b8' },
  { id:'K-W-900',    label:'Wall 900',       w:900,  d:320, h:720,  cat:'k-wall', price:7000,  top:'#c8e4d8', side:'#8ab4a8', front:'#9ac4b8' },
  { id:'K-W-EXT',    label:'Extractor hood', w:600,  d:400, h:200,  cat:'k-wall', price:3500,  top:'#d0d8e0', side:'#a0aab8', front:'#b0bac8' },
  { id:'K-W-OPEN',   label:'Open shelf',     w:600,  d:320, h:720,  cat:'k-wall', price:3800,  top:'#c8e4d8', side:'#8ab4a8', front:'#9ac4b8' },
  { id:'K-W-CORNER', label:'Corner wall',    w:600,  d:600, h:720,  cat:'k-wall', price:9000,  top:'#b8d8cc', side:'#78a89a', front:'#88b8aa' },
  // ── Kitchen — Tall ───────────────────────────────────────────────────────────
  { id:'K-T-PANTRY', label:'Pantry 600',     w:600,  d:600, h:2100, cat:'k-tall', price:18000, top:'#a8c8b8', side:'#68988a', front:'#78a89a' },
  { id:'K-T-OVEN',   label:'Oven tower',     w:600,  d:600, h:2100, cat:'k-tall', price:14000, top:'#a8c8b8', side:'#68988a', front:'#78a89a' },
  { id:'K-T-FRIDGE', label:'Fridge housing', w:700,  d:700, h:1800, cat:'k-tall', price:4000,  top:'#c0d0d8', side:'#8898a8', front:'#98a8b8' },
  { id:'K-T-LARDER', label:'Larder pull-out',w:600,  d:600, h:2100, cat:'k-tall', price:22000, top:'#a8c8b8', side:'#68988a', front:'#78a89a' },
  // ── Kitchen — Appliances ─────────────────────────────────────────────────────
  { id:'K-APP-FRG',  label:'Fridge',         w:700,  d:700, h:1800, cat:'k-appl', price:0,     top:'#d8e0e8', side:'#a8b8c8', front:'#b8c8d8' },
  { id:'K-APP-MW',   label:'Microwave',      w:550,  d:400, h:320,  cat:'k-appl', price:0,     top:'#d0d8e0', side:'#a0aab8', front:'#b0bac8' },
  { id:'K-APP-OV',   label:'Oven',           w:600,  d:550, h:600,  cat:'k-appl', price:0,     top:'#d0d8e0', side:'#a0aab8', front:'#b0bac8' },
  { id:'K-APP-DW',   label:'Dishwasher',     w:600,  d:600, h:870,  cat:'k-appl', price:0,     top:'#d0d8e0', side:'#a0aab8', front:'#b0bac8' },
  { id:'K-APP-HOOD', label:'Island hood',    w:900,  d:600, h:300,  cat:'k-appl', price:0,     top:'#c8d0d8', side:'#9098a8', front:'#a0a8b8' },
  // ── Bedroom — Wardrobes ──────────────────────────────────────────────────────
  { id:'W-450',      label:'Wardrobe 450',   w:450,  d:580, h:2100, cat:'wardrobe', price:9000,  top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  { id:'W-600',      label:'Wardrobe 600',   w:600,  d:580, h:2100, cat:'wardrobe', price:11000, top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  { id:'W-750',      label:'Wardrobe 750',   w:750,  d:580, h:2100, cat:'wardrobe', price:13000, top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  { id:'W-900',      label:'Wardrobe 900',   w:900,  d:580, h:2100, cat:'wardrobe', price:15000, top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  { id:'W-1050',     label:'Wardrobe 1050',  w:1050, d:580, h:2100, cat:'wardrobe', price:17500, top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  { id:'W-1200',     label:'Wardrobe 1200',  w:1200, d:580, h:2100, cat:'wardrobe', price:20000, top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  { id:'W-1500',     label:'Wardrobe 1500',  w:1500, d:580, h:2100, cat:'wardrobe', price:24000, top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  { id:'W-1800',     label:'Wardrobe 1800',  w:1800, d:580, h:2100, cat:'wardrobe', price:28000, top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  { id:'W-CORNER',   label:'Corner wardrobe',w:1200, d:1200,h:2100, cat:'wardrobe', price:34000, top:'#e0c0a8', side:'#c09880', front:'#cca890' },
  // ── Bedroom — Beds ───────────────────────────────────────────────────────────
  { id:'BED-SINGLE', label:'Single 1000',    w:1000, d:2000, h:500, cat:'bed',      price:0,     top:'#e8e0d0', side:'#b8a880', front:'#c8b890' },
  { id:'BED-DOUBLE', label:'Double 1400',    w:1400, d:2000, h:500, cat:'bed',      price:0,     top:'#e8e0d0', side:'#b8a880', front:'#c8b890' },
  { id:'BED-QUEEN',  label:'Queen 1600',     w:1600, d:2000, h:500, cat:'bed',      price:0,     top:'#e8e0d0', side:'#b8a880', front:'#c8b890' },
  { id:'BED-KING',   label:'King 1800',      w:1800, d:2000, h:500, cat:'bed',      price:0,     top:'#e8e0d0', side:'#b8a880', front:'#c8b890' },
  { id:'BED-KING-2', label:'Super king 2000',w:2000, d:2100, h:500, cat:'bed',      price:0,     top:'#e0d8c8', side:'#b0a878', front:'#c0b888' },
  // ── Bedroom — Storage ────────────────────────────────────────────────────────
  { id:'BS-L',       label:'Bedside left',   w:500,  d:400,  h:600, cat:'b-storage',price:0,     top:'#e8dcc8', side:'#c8a888', front:'#d8b898' },
  { id:'BS-R',       label:'Bedside right',  w:500,  d:400,  h:600, cat:'b-storage',price:0,     top:'#e8dcc8', side:'#c8a888', front:'#d8b898' },
  { id:'DRESSER',    label:'Dresser 1200',   w:1200, d:500,  h:800, cat:'b-storage',price:0,     top:'#e8d4c0', side:'#c89870', front:'#d8a880' },
  { id:'OTTOMAN',    label:'Ottoman',        w:900,  d:600,  h:450, cat:'b-storage',price:0,     top:'#d8c8b8', side:'#a89878', front:'#b8a888' },
  { id:'SHOE-RACK',  label:'Shoe rack',      w:800,  d:350,  h:1200,cat:'b-storage',price:6000,  top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  // ── Office — Desks ───────────────────────────────────────────────────────────
  { id:'O-D-800',    label:'Desk 800',       w:800,  d:600,  h:750, cat:'desk',     price:12000, top:'#d8c8e8', side:'#8870a8', front:'#a890c0' },
  { id:'O-D-1200',   label:'Desk 1200',      w:1200, d:600,  h:750, cat:'desk',     price:18000, top:'#d8c8e8', side:'#8870a8', front:'#a890c0' },
  { id:'O-D-1800',   label:'Desk 1800',      w:1800, d:700,  h:750, cat:'desk',     price:26000, top:'#d8c8e8', side:'#8870a8', front:'#a890c0' },
  { id:'O-D-L',      label:'L-shape desk',   w:1800, d:1200, h:750, cat:'desk',     price:34000, top:'#c8b8d8', side:'#7860a0', front:'#9880b8' },
  { id:'O-RECEPTION',label:'Reception desk', w:1800, d:800,  h:1100,cat:'desk',     price:42000, top:'#d8c8e8', side:'#8870a8', front:'#a890c0' },
  // ── Office — Storage ─────────────────────────────────────────────────────────
  { id:'O-S-1200',   label:'Storage 1200',   w:1200, d:400,  h:1800,cat:'o-storage',price:19000, top:'#d8c8e8', side:'#8870a8', front:'#a890c0' },
  { id:'O-FILING',   label:'Filing cabinet', w:400,  d:500,  h:1200,cat:'o-storage',price:8000,  top:'#d0c8d8', side:'#8068a8', front:'#9880b0' },
  { id:'O-M-4P',     label:'Meeting 4P',     w:1800, d:900,  h:750, cat:'o-storage',price:32000, top:'#e8d8c8', side:'#b89878', front:'#c8a888' },
  { id:'O-M-6P',     label:'Meeting 6P',     w:2400, d:1200, h:750, cat:'o-storage',price:44000, top:'#e8d8c8', side:'#b89878', front:'#c8a888' },
  { id:'O-M-8P',     label:'Meeting 8P',     w:3000, d:1200, h:750, cat:'o-storage',price:58000, top:'#e8d8c8', side:'#b89878', front:'#c8a888' },
  // ── Office — Seating ─────────────────────────────────────────────────────────
  { id:'O-CHAIR',    label:'Office chair',   w:600,  d:600,  h:800, cat:'o-seating',price:0,     top:'#e8d8b8', side:'#b89858', front:'#c8a868' },
  { id:'O-VISITOR',  label:'Visitor chair',  w:550,  d:550,  h:750, cat:'o-seating',price:0,     top:'#e0d0b0', side:'#a89050', front:'#c0a060' },
  { id:'O-SOFA-2',   label:'2-seat sofa',    w:1700, d:800,  h:800, cat:'o-seating',price:0,     top:'#d8c8d0', side:'#a890a0', front:'#b8a0b0' },
  // ── Living — Seating ─────────────────────────────────────────────────────────
  { id:'L-SOFA-3',   label:'Sofa 3-seat',    w:2200, d:900,  h:850, cat:'l-seating',price:0,     top:'#d8c0b8', side:'#a87868', front:'#b88878' },
  { id:'L-SOFA-2',   label:'Sofa 2-seat',    w:1700, d:900,  h:850, cat:'l-seating',price:0,     top:'#d8c0b8', side:'#a87868', front:'#b88878' },
  { id:'L-ARMCHAIR', label:'Armchair',       w:900,  d:900,  h:850, cat:'l-seating',price:0,     top:'#d0b8b0', side:'#a07060', front:'#b08070' },
  { id:'L-CHAISE',   label:'Chaise longue',  w:2400, d:900,  h:800, cat:'l-seating',price:0,     top:'#d8c0b8', side:'#a87868', front:'#b88878' },
  // ── Living — Tables ──────────────────────────────────────────────────────────
  { id:'L-COFFEE',   label:'Coffee table',   w:1200, d:600,  h:450, cat:'l-table',  price:0,     top:'#d8c8b8', side:'#a89878', front:'#b8a888' },
  { id:'L-SIDE',     label:'Side table',     w:500,  d:500,  h:550, cat:'l-table',  price:0,     top:'#d8c8b8', side:'#a89878', front:'#b8a888' },
  { id:'L-DINING-4', label:'Dining 4P',      w:1400, d:800,  h:750, cat:'l-table',  price:0,     top:'#e0d0b8', side:'#b0a070', front:'#c0b080' },
  { id:'L-DINING-6', label:'Dining 6P',      w:1800, d:900,  h:750, cat:'l-table',  price:0,     top:'#e0d0b8', side:'#b0a070', front:'#c0b080' },
  { id:'L-DINING-8', label:'Dining 8P',      w:2400, d:1000, h:750, cat:'l-table',  price:0,     top:'#e0d0b8', side:'#b0a070', front:'#c0b080' },
  // ── Living — Storage ─────────────────────────────────────────────────────────
  { id:'L-TV',       label:'TV unit 1800',   w:1800, d:450,  h:500, cat:'l-storage',price:12000, top:'#d8c8b8', side:'#a89878', front:'#b8a888' },
  { id:'L-TV-2400',  label:'TV unit 2400',   w:2400, d:450,  h:500, cat:'l-storage',price:16000, top:'#d8c8b8', side:'#a89878', front:'#b8a888' },
  { id:'L-BOOKSHELF',label:'Bookshelf 800',  w:800,  d:350,  h:1800,cat:'l-storage',price:0,     top:'#d0c4b0', side:'#a09070', front:'#b0a080' },
  { id:'L-CABINET',  label:'Display cabinet',w:1200, d:400,  h:1800,cat:'l-storage',price:0,     top:'#d0c4b0', side:'#a09070', front:'#b0a080' },
]

const newUid = () => Math.random().toString(36).slice(2,8)
function rotDims(it: Placed) {
  return it.rot===90||it.rot===270 ? { w:it.d, d:it.w } : { w:it.w, d:it.d }
}

// ── step labels (wardrobe configurator) ──────────────────────────────────────
const STEPS = ['01 Type','02 Dimensions','03 Frame Layout','04 Shutter Finish','05 Interior Preset','06 BOQ & Confirm']

// ── wardrobe configurator panel ───────────────────────────────────────────────
interface ConfigPanelProps {
  config: WardConfig; setConfig: (c: WardConfig) => void
  step: number; setStep: (n: number) => void
  onPlace: () => void; onClose: () => void
  clientName: string; setClientName: (v:string)=>void
  clientPhone: string; setClientPhone: (v:string)=>void
}

function ConfigPanel({ config, setConfig, step, setStep, onPlace, onClose, clientName, setClientName, clientPhone, setClientPhone }: ConfigPanelProps) {
  const set = (patch: Partial<WardConfig>) => setConfig({ ...config, ...patch })
  const boq = calcBOQ(config)

  const PANEL_BG = '#1a1714'
  const BORDER   = 'rgba(255,255,255,0.08)'
  const TEXT     = '#e8e6e1'
  const MUTED    = 'rgba(255,255,255,0.35)'
  const ACCENT   = '#c96442'

  const pill = (active: boolean): React.CSSProperties => ({
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
                  background:cur?ACCENT:done?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.08)', color:cur?'#fff':done?'rgba(255,255,255,0.8)':MUTED }}>
                  {done ? '✓' : i+1}
                </span>
                <span style={{ fontSize:9, fontWeight:cur?700:500, whiteSpace:'nowrap' }}>{s.split(' ').slice(1).join(' ')}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 18px' }}>

        {/* 01 Type */}
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
                <div key={t.id} onClick={() => set({ type:t.id })} style={{ ...optCard(config.type===t.id), padding:'14px 12px' }}>
                  <div style={{ fontSize:22, marginBottom:6 }}>{t.icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:TEXT, marginBottom:3 }}>{t.label}</div>
                  <div style={{ fontSize:10, color:MUTED, lineHeight:1.4 }}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 02 Dimensions */}
        {step===1 && (
          <div>
            <h3 style={{ fontSize:15, fontWeight:700, color:TEXT, margin:'0 0 4px' }}>Dimensions</h3>
            <p style={{ fontSize:11, color:MUTED, margin:'0 0 20px' }}>Snap to standard module widths in mm</p>
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Width (mm)</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                {WIDTH_OPTS.map(w => <button key={w} onClick={() => set({ width:w })} style={pill(config.width===w)}>{w}</button>)}
              </div>
            </div>
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Height (mm)</div>
              <div style={{ display:'flex', gap:6 }}>
                {HEIGHT_OPTS.map(h => <button key={h} onClick={() => set({ height:h })} style={pill(config.height===h)}>{h}</button>)}
              </div>
            </div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Depth (mm)</div>
              <div style={{ display:'flex', gap:6 }}>
                {DEPTH_OPTS.map(d => <button key={d} onClick={() => set({ depth:d })} style={pill(config.depth===d)}>{d}</button>)}
              </div>
            </div>
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

        {/* 03 Frame layout */}
        {step===2 && (
          <div>
            <h3 style={{ fontSize:15, fontWeight:700, color:TEXT, margin:'0 0 4px' }}>Frame layout</h3>
            <p style={{ fontSize:11, color:MUTED, margin:'0 0 18px' }}>Internal structure — shelves, rails and drawers</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {([
                { id:'standard',     label:'Standard',       sub:'½ hanging + shelf tower + 2 drawers' },
                { id:'full-hang',    label:'Full Hang',       sub:'Full-width rail · ideal for suits & dresses' },
                { id:'drawer-heavy', label:'Drawer Heavy',    sub:'4 drawer units + fixed shelves above' },
                { id:'loft-hang',    label:'Loft + Hang',     sub:'Loft storage on top · hanging below' },
                { id:'pantry',       label:'Pantry / Shelf',  sub:'8 fixed shelves · books, linen, display' },
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

        {/* 04 Shutter finish */}
        {step===3 && (
          <div>
            <h3 style={{ fontSize:15, fontWeight:700, color:TEXT, margin:'0 0 4px' }}>Shutter finish</h3>
            <p style={{ fontSize:11, color:MUTED, margin:'0 0 18px' }}>Door colour · surface texture · handle style</p>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Colour</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8, marginBottom:18 }}>
              {SHUTTER_COLORS.map(c => (
                <div key={c.hex} onClick={() => set({ shutterColor:c.hex })} style={{ cursor:'pointer' }}>
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
                { id:'matt', label:'Matt', sub:'Smooth flat' }, { id:'gloss', label:'Gloss', sub:'High shine' },
                { id:'membrane', label:'Membrane', sub:'Textured PVC' }, { id:'glass', label:'Glass', sub:'Frosted' },
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
                { id:'none', label:'Push-to-open', icon:'⊡' }, { id:'bar', label:'Bar pull', icon:'⊟' },
                { id:'knob', label:'Round knob', icon:'●' }, { id:'j-pull', label:'J-pull', icon:'⌐' },
              ] as const).map(h => (
                <button key={h.id} onClick={() => set({ handle:h.id })} style={{ ...pill(config.handle===h.id), display:'flex', alignItems:'center', gap:5 }}>
                  <span>{h.icon}</span><span>{h.label}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop:20, borderRadius:10, overflow:'hidden', border:`1px solid rgba(255,255,255,0.1)` }}>
              <div style={{ height:80, background:config.shutterColor, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {config.handle==='bar'    && <div style={{ width:40, height:4, background:'rgba(0,0,0,0.25)', borderRadius:99 }}/>}
                {config.handle==='knob'   && <div style={{ width:12, height:12, background:'rgba(0,0,0,0.25)', borderRadius:99 }}/>}
                {config.handle==='j-pull' && <div style={{ width:6, height:28, background:'rgba(0,0,0,0.25)', borderRadius:3 }}/>}
              </div>
              <div style={{ padding:'8px 12px', background:'rgba(255,255,255,0.04)', fontSize:10, color:MUTED }}>
                {SHUTTER_COLORS.find(c=>c.hex===config.shutterColor)?.name} · {config.shutterFinish} · {config.handle==='none'?'Push-to-open':config.handle}
              </div>
            </div>
          </div>
        )}

        {/* 05 Interior preset */}
        {step===4 && (
          <div>
            <h3 style={{ fontSize:15, fontWeight:700, color:TEXT, margin:'0 0 4px' }}>Interior preset</h3>
            <p style={{ fontSize:11, color:MUTED, margin:'0 0 18px' }}>How the inside is organised and finished</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {([
                { id:'basic',      icon:'⊟', label:'Basic',       sub:'Standard shelves + hanging rail, no frills',     price:'' },
                { id:'premium',    icon:'✦', label:'Premium',     sub:'Velvet drawers · LED strip · mirror panel',       price:'+20%' },
                { id:'homeoffice', icon:'⊞', label:'Home Office', sub:'Pull-out desk shelf · cable tray · USB socket',  price:'+15%' },
                { id:'kids',       icon:'⊠', label:'Kids',        sub:'Low rails · activity shelf · rounded corners',   price:'+8%' },
              ] as const).map(p => (
                <div key={p.id} onClick={() => set({ interior:p.id })}
                  style={{ display:'flex', gap:12, padding:'14px', borderRadius:10, cursor:'pointer',
                    border:`1.5px solid ${config.interior===p.id?ACCENT:'rgba(255,255,255,0.1)'}`,
                    background:config.interior===p.id?'rgba(201,100,66,0.1)':'rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize:20, lineHeight:1.4 }}>{p.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:12, fontWeight:700, color:config.interior===p.id?ACCENT:TEXT }}>{p.label}</span>
                      {p.price && <span style={{ fontSize:10, color:'#6ab87a', fontWeight:600 }}>{p.price}</span>}
                    </div>
                    <div style={{ fontSize:10, color:MUTED, marginTop:4, lineHeight:1.5 }}>{p.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 06 BOQ & Confirm */}
        {step===5 && (
          <div>
            <h3 style={{ fontSize:15, fontWeight:700, color:TEXT, margin:'0 0 4px' }}>Bill of Quantities</h3>
            <p style={{ fontSize:11, color:MUTED, margin:'0 0 16px' }}>Summary · confirm to place on floor and send to Studio</p>
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
            <div style={{ background:'rgba(201,100,66,0.12)', borderRadius:10, padding:'14px 16px', marginBottom:18, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:10, color:ACCENT, fontWeight:700, letterSpacing:'0.1em' }}>ESTIMATED TOTAL</div>
                <div style={{ fontSize:8, color:MUTED, marginTop:2 }}>incl. supply + installation</div>
              </div>
              <div style={{ fontSize:22, fontWeight:800, color:ACCENT, fontFamily:'JetBrains Mono' }}>{inr(boq.total)}</div>
            </div>
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

// ── room picker ───────────────────────────────────────────────────────────────
function RoomPicker({ onStart }: { onStart: (rt: RoomType, w: number, d: number) => void }) {
  const [selected, setSelected] = useState<RoomType>('bedroom')
  const [w, setW] = useState(ROOM_META.bedroom.w)
  const [d, setD] = useState(ROOM_META.bedroom.d)

  const pick = (rt: RoomType) => { setSelected(rt); setW(ROOM_META[rt].w); setD(ROOM_META[rt].d) }

  return (
    <div style={{ minHeight:'100vh', background:'#0d0c0a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'"Inter Tight",sans-serif', color:'#e8e6e1', padding:32 }}>
      <div style={{ marginBottom:48, textAlign:'center' }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'#c96442', marginBottom:12 }}>KREOBOX · DesignOS Planner</div>
        <div style={{ fontFamily:'Fraunces', fontSize:44, fontWeight:300, letterSpacing:'-0.03em', lineHeight:1, marginBottom:10 }}>Plan your space</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>Choose a room type to get started</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:40, width:'100%', maxWidth:760 }}>
        {(Object.entries(ROOM_META) as [RoomType, typeof ROOM_META[RoomType]][]).map(([rt, meta]) => (
          <div key={rt} onClick={() => pick(rt)}
            style={{ padding:'28px 18px 22px', borderRadius:14, cursor:'pointer', textAlign:'center',
              border:`2px solid ${selected===rt?meta.accent:'rgba(255,255,255,0.1)'}`,
              background:selected===rt?`${meta.accent}18`:'rgba(255,255,255,0.03)',
              transition:'all 0.12s' }}>
            <div style={{ fontSize:38, marginBottom:14 }}>{meta.icon}</div>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:6, color:selected===rt?meta.accent:'#e8e6e1' }}>{meta.label}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', lineHeight:1.5 }}>{meta.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:36, background:'rgba(255,255,255,0.04)', borderRadius:12, padding:'18px 28px', border:'1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)' }}>Room size</span>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <input type="number" value={w} onChange={e=>setW(+e.target.value||2000)} step={100} min={2000} max={15000}
            style={{ width:72, padding:'7px 8px', borderRadius:8, border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.08)', color:'#e8e6e1', fontSize:14, fontFamily:'JetBrains Mono', textAlign:'center', outline:'none' }}/>
          <span style={{ color:'rgba(255,255,255,0.3)', fontSize:14 }}>×</span>
          <input type="number" value={d} onChange={e=>setD(+e.target.value||2000)} step={100} min={2000} max={12000}
            style={{ width:72, padding:'7px 8px', borderRadius:8, border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.08)', color:'#e8e6e1', fontSize:14, fontFamily:'JetBrains Mono', textAlign:'center', outline:'none' }}/>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginLeft:4 }}>mm</span>
        </div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', paddingLeft:12, borderLeft:'1px solid rgba(255,255,255,0.08)' }}>
          {(w/1000).toFixed(1)} m × {(d/1000).toFixed(1)} m = {((w/1000)*(d/1000)).toFixed(1)} m²
        </div>
      </div>

      <button onClick={() => onStart(selected, w, d)}
        style={{ padding:'14px 44px', borderRadius:10, border:'none', background:'#c96442', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.02em' }}>
        Start planning →
      </button>
    </div>
  )
}

// ── main planner ──────────────────────────────────────────────────────────────
export default function PlannerPage() {
  const addOrder  = useKreoboxStore(s => s.addOrder)
  const showToast = useKreoboxStore(s => s.showToast)

  const [plannerMode, setPlannerMode] = useState<'pick'|'plan'>('pick')
  const [roomType,    setRoomType]    = useState<RoomType>('bedroom')
  const [catTab,      setCatTab]      = useState<CatId>('wardrobe')

  const [roomW, setRoomW] = useState(4000)
  const [roomD, setRoomD] = useState(3500)
  const WALL_H = 2700

  const [items,    setItems]    = useState<Placed[]>([])
  const [selected, setSelected] = useState<string|null>(null)
  const [activePal,setActivePal]= useState<string|null>(null)
  const [view,     setView]     = useState<'3d'|'2d'>('3d')

  const [showConfig,  setShowConfig]  = useState(false)
  const [configStep,  setConfigStep]  = useState(0)
  const [wardConfig,  setWardConfig]  = useState<WardConfig>(DFLT)
  const [clientName,  setClientName]  = useState('')
  const [clientPhone, setClientPhone] = useState('')

  const svgRef = useRef<SVGSVGElement>(null)
  const draggingPal = useRef<string|null>(null)

  const handleStart = (rt: RoomType, w: number, d: number) => {
    setRoomType(rt); setRoomW(w); setRoomD(d)
    setCatTab(ROOM_CATS[rt][0].id)
    setItems([]); setSelected(null); setShowConfig(false)
    setPlannerMode('plan')
  }

  const offX = roomD * COS * SC
  const offY = WALL_H * SC + 20
  const svgW = (roomW + roomD) * COS * SC + 40
  const svgH = (roomW + roomD) * SIN * SC + WALL_H * SC + 60

  function pt(wx: number, wy: number, wz = 0): Pt {
    const p = iso(wx, wy, wz)
    return { x: p.x + offX + 20, y: p.y + offY }
  }

  const handlePlace = useCallback(() => {
    const uid  = newUid()
    const w    = wardConfig.width
    const d    = wardConfig.depth
    const h    = wardConfig.height
    const col  = wardConfig.shutterColor
    const placed: Placed = {
      uid, x:snap(100), y:snap(roomD - d - 200), rot:0,
      id:`W-CUSTOM-${uid}`, label:`Wardrobe ${w}`, cat:'wardrobe',
      w, d, h, price:calcPrice(wardConfig),
      top:col+'cc', side:col+'88', front:col+'aa',
    }
    setItems(prev => [...prev, placed])
    setSelected(uid)
    const orderId = 'ORD-' + Math.floor(1050 + Math.random() * 900)
    const order: KBOrder = {
      id: orderId,
      customer: { name:clientName||'Planner client', phone:clientPhone||'—', city:'Bengaluru', area:'—' },
      contractor: 'Suresh Modulars',
      type: 'wardrobe',
      config: { type:'wardrobe', wallWidth:w, height:h, frames:[], walls:[], shutter:wardConfig.shutterFinish.toUpperCase(), preset:wardConfig.layout.toUpperCase() } as any,
      advance: Math.round(calcPrice(wardConfig) * 0.35),
      total: calcPrice(wardConfig),
      stage: 'Quoted',
      createdAt: new Date().toISOString().slice(0, 10),
      panels: generatePanels({ type:'wardrobe', wallWidth:w, height:h, frames:[], walls:[], shutter:'S-WHITE', preset:'PLANNER' }),
    }
    addOrder(order)
    showToast(`${orderId} · ${inr(calcPrice(wardConfig))} · sent to Studio`)
    setShowConfig(false)
  }, [wardConfig, roomD, clientName, clientPhone, addOrder, showToast])

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
    setSelected(uid); setActivePal(null)
    if (src.cat === 'wardrobe') {
      setWardConfig({ ...DFLT, width:src.w, height:src.h, depth:src.d })
      setConfigStep(0); setShowConfig(true)
    }
  }, [activePal, offX, offY, roomW, roomD])

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
    setSelected(uid); draggingPal.current = null
    if (src.cat === 'wardrobe') {
      setWardConfig({ ...DFLT, width:src.w, height:src.h, depth:src.d })
      setConfigStep(0); setShowConfig(true)
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
  const palette      = CATALOG.filter(i => i.cat === catTab)
  const roomAccent   = ROOM_META[roomType].accent

  // Door position: front-bottom wall, centred
  const doorW = 900
  const doorX = Math.round((roomW - doorW) / 2 / GRID) * GRID
  const doorArc = Array.from({length:9}, (_, i) => {
    const angle = (i / 8) * Math.PI / 2
    return pt(doorX + doorW * (1 - Math.cos(angle)), doorW * Math.sin(angle))
  })

  if (plannerMode === 'pick') return <RoomPicker onStart={handleStart} />

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'#141210', color:'#e8e6e1', fontFamily:'"Inter Tight",sans-serif', overflow:'hidden' }}>

      {/* ── Top navigation bar ── */}
      <div style={{ height:46, display:'flex', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.08)', flexShrink:0 }}>
        {/* Logo */}
        <div style={{ padding:'0 16px', display:'flex', alignItems:'center', gap:8, borderRight:'1px solid rgba(255,255,255,0.08)', height:'100%', flexShrink:0 }}>
          <span style={{ fontFamily:'Fraunces', fontSize:14, fontWeight:500, letterSpacing:'0.1em' }}>KREOBOX</span>
          <span style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontWeight:600, letterSpacing:'0.08em' }}>Planner</span>
        </div>

        {/* Room switcher */}
        <button onClick={() => setPlannerMode('pick')}
          style={{ padding:'0 16px', height:'100%', border:'none', borderRight:'1px solid rgba(255,255,255,0.08)', background:'transparent',
            color:'rgba(255,255,255,0.6)', fontSize:11, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          <span>{ROOM_META[roomType].icon}</span>
          <span style={{ fontWeight:600 }}>{ROOM_META[roomType].label}</span>
          <span style={{ fontSize:9, color:'rgba(255,255,255,0.3)' }}>▾</span>
        </button>

        {/* Category tabs */}
        <div style={{ display:'flex', height:'100%', overflowX:'auto' }}>
          {ROOM_CATS[roomType].map(cat => (
            <button key={cat.id} onClick={() => setCatTab(cat.id)}
              style={{ padding:'0 20px', height:'100%', border:'none',
                borderBottom:`2px solid ${catTab===cat.id?roomAccent:'transparent'}`,
                background:'transparent',
                color:catTab===cat.id?roomAccent:'rgba(255,255,255,0.45)',
                fontSize:11, fontWeight:catTab===cat.id?700:500, cursor:'pointer', fontFamily:'inherit', flexShrink:0 }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10, padding:'0 14px', flexShrink:0 }}>
          <div style={{ display:'flex', borderRadius:7, overflow:'hidden', border:'1px solid rgba(255,255,255,0.12)' }}>
            {(['3d','2d'] as const).map(v => (
              <button key={v} onClick={()=>setView(v)}
                style={{ padding:'4px 11px', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:10, fontWeight:700, textTransform:'uppercase',
                  background:view===v?roomAccent:'transparent', color:view===v?'#fff':'rgba(255,255,255,0.4)' }}>
                {v}
              </button>
            ))}
          </div>
          <span style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontWeight:700, letterSpacing:'0.08em' }}>ROOM</span>
          <input type="number" value={roomW} onChange={e=>setRoomW(+e.target.value||3000)} step={100} min={2000} max={15000}
            style={{ width:58, padding:'3px 4px', borderRadius:5, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.06)', color:'#e8e6e1', fontSize:10, fontFamily:'JetBrains Mono', textAlign:'center' }}/>
          <span style={{ color:'rgba(255,255,255,0.3)', fontSize:10 }}>×</span>
          <input type="number" value={roomD} onChange={e=>setRoomD(+e.target.value||2000)} step={100} min={2000} max={12000}
            style={{ width:58, padding:'3px 4px', borderRadius:5, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.06)', color:'#e8e6e1', fontSize:10, fontFamily:'JetBrains Mono', textAlign:'center' }}/>
          <span style={{ fontSize:9, color:'rgba(255,255,255,0.3)' }}>mm</span>
          {totalPrice > 0 && (
            <button style={{ padding:'5px 13px', borderRadius:7, border:`1px solid ${roomAccent}`, background:`${roomAccent}22`, color:roomAccent, fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              → Studio  {inr(totalPrice)}
            </button>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* ── Left palette ── */}
        <aside style={{ width:180, borderRight:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', flexShrink:0, overflow:'hidden' }}>
          {/* Quick action for bedroom */}
          {roomType==='bedroom' && (
            <button onClick={() => { setWardConfig(DFLT); setConfigStep(0); setShowConfig(true) }}
              style={{ margin:'8px 8px 4px', padding:'8px 10px', borderRadius:8,
                border:`1px solid ${roomAccent}66`, background:`${roomAccent}18`,
                color:roomAccent, fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'inherit', textAlign:'center', flexShrink:0 }}>
              + Configure wardrobe
            </button>
          )}

          {/* Item count */}
          <div style={{ padding:'6px 10px', fontSize:9, color:'rgba(255,255,255,0.25)', fontWeight:700, letterSpacing:'0.1em', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
            {palette.length} items · drag or click to place
          </div>

          <div style={{ flex:1, overflowY:'auto' }}>
            {palette.map(item => {
              const isActive = activePal === item.id
              return (
                <div key={item.id} draggable onDragStart={()=>onPalDragStart(item.id)}
                  onClick={()=>setActivePal(isActive?null:item.id)}
                  style={{ padding:'7px 10px', cursor:'pointer', borderBottom:'1px solid rgba(255,255,255,0.04)',
                    display:'flex', alignItems:'center', gap:8, userSelect:'none',
                    background:isActive?`${roomAccent}28`:'transparent',
                    borderLeft:isActive?`2px solid ${roomAccent}`:'2px solid transparent' }}
                  onMouseEnter={e=>{ if(!isActive)(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)' }}
                  onMouseLeave={e=>{ if(!isActive)(e.currentTarget as HTMLElement).style.background='transparent' }}>
                  <svg width={26} height={22} viewBox="0 0 32 28" style={{ flexShrink:0 }}>
                    <polygon points="16,4 28,10 28,22 16,28" fill={item.side}/>
                    <polygon points="4,10 16,4 28,10 16,16"  fill={item.top}/>
                    <polygon points="4,10 16,16 16,28 4,22"  fill={item.front}/>
                  </svg>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:10, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.label}</div>
                    <div style={{ fontSize:8, color:'rgba(255,255,255,0.3)', marginTop:1 }}>{item.w}×{item.d}mm</div>
                    {item.price>0 && <div style={{ fontSize:8, color:roomAccent, fontFamily:'JetBrains Mono' }}>{inr(item.price)}</div>}
                  </div>
                </div>
              )
            })}
          </div>

          {activePal && (
            <div style={{ padding:'7px 10px', background:`${roomAccent}25`, borderTop:`1px solid ${roomAccent}44`, fontSize:9, color:roomAccent, fontWeight:700, flexShrink:0 }}>
              ↗ Click room floor to place
            </div>
          )}
        </aside>

        {/* ── Canvas area ── */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>

          {/* Selection toolbar */}
          <div style={{ height:36, display:'flex', alignItems:'center', gap:6, padding:'0 12px', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
            {selected ? <>
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.5)', fontWeight:600 }}>{selectedItem?.label}</span>
              <span style={{ fontSize:9, color:'rgba(255,255,255,0.25)' }}>{selectedItem?.w}×{selectedItem?.d}mm</span>
              <div style={{ width:1, height:14, background:'rgba(255,255,255,0.1)', margin:'0 4px' }}/>
              <button onClick={rotSel} style={tb}>↻ rotate</button>
              <button onClick={delSel} style={{ ...tb, color:'#ff8080', borderColor:'rgba(255,80,80,0.3)' }}>× remove</button>
              <button onClick={()=>move(-GRID,0)} style={tb}>←</button>
              <button onClick={()=>move(GRID,0)}  style={tb}>→</button>
              <button onClick={()=>move(0,-GRID)} style={tb}>↑</button>
              <button onClick={()=>move(0,GRID)}  style={tb}>↓</button>
              {selectedItem?.cat==='wardrobe' && (
                <button onClick={() => { setWardConfig({ ...DFLT, width:selectedItem.w, height:selectedItem.h, depth:selectedItem.d }); setConfigStep(0); setShowConfig(true) }}
                  style={{ ...tb, color:roomAccent, borderColor:`${roomAccent}66`, fontWeight:700 }}>⚙ configure</button>
              )}
            </> : (
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.2)' }}>Select an item to edit · Del to remove · R to rotate</span>
            )}
            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>{items.length} items</span>
              {!showConfig && roomType==='bedroom' && (
                <button onClick={()=>{ setWardConfig(DFLT); setConfigStep(0); setShowConfig(true) }}
                  style={{ ...tb, color:roomAccent, borderColor:`${roomAccent}55` }}>+ wardrobe</button>
              )}
            </div>
          </div>

          {/* Floor plan canvas */}
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

                {/* Door arc on floor (front wall) */}
                <polyline points={doorArc.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth={1} strokeDasharray="4 3"/>
                <line x1={pt(doorX,0).x} y1={pt(doorX,0).y} x2={pt(doorX,doorW).x} y2={pt(doorX,doorW).y} stroke="rgba(0,0,0,0.25)" strokeWidth={0.8}/>
                <line x1={pt(doorX,0).x} y1={pt(doorX,0).y} x2={pt(doorX+doorW,0).x} y2={pt(doorX+doorW,0).y} stroke="rgba(0,0,0,0.4)" strokeWidth={2}/>

                {/* Furniture (painter's sort) */}
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
                        <polygon points={poly([f00,f10,f11,f01])} fill={`${roomAccent}22`} stroke={roomAccent} strokeWidth={1.5} strokeDasharray="4 3"/>
                      </>}
                      <text x={(f00.x+f10.x)/2} y={(f00.y+f10.y)/2-(t00.y-f00.y)/2}
                        textAnchor="middle" fontSize={6} fill="rgba(0,0,0,0.4)" fontFamily="JetBrains Mono" style={{ pointerEvents:'none' }}>{item.w}</text>
                    </g>
                  )
                })}

                {items.length===0 && (
                  <text x={pt(roomW/2,roomD/2).x} y={pt(roomW/2,roomD/2).y}
                    textAnchor="middle" fontSize={12} fill="rgba(0,0,0,0.25)" fontFamily="Inter Tight, sans-serif">
                    Select a category and drag items to place
                  </text>
                )}
              </svg>

            ) : (
              // 2D floor plan
              <div style={{ position:'relative', width:roomW*0.057, height:roomD*0.057, background:'#f5f0e8',
                boxShadow:`0 0 0 10px #8B7355, 0 24px 80px rgba(0,0,0,0.6)`, flexShrink:0 }}
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
                {/* Grid lines */}
                {[...Array(Math.floor(roomW/1000))].map((_,i)=>(
                  <div key={i} style={{ position:'absolute', left:(i+1)*1000*0.057, top:0, bottom:0, borderLeft:'1px solid rgba(0,0,0,0.08)' }}/>
                ))}
                {[...Array(Math.floor(roomD/1000))].map((_,i)=>(
                  <div key={i} style={{ position:'absolute', top:(i+1)*1000*0.057, left:0, right:0, borderTop:'1px solid rgba(0,0,0,0.08)' }}/>
                ))}
                {/* Door arc in 2D */}
                <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', overflow:'visible', pointerEvents:'none' }}>
                  <path d={`M ${doorX*0.057} 0 A ${doorW*0.057} ${doorW*0.057} 0 0 1 ${(doorX+doorW)*0.057} ${doorW*0.057}`}
                    fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth={1} strokeDasharray="4 3"/>
                  <line x1={doorX*0.057} y1={0} x2={(doorX+doorW)*0.057} y2={0} stroke="rgba(0,0,0,0.5)" strokeWidth={2}/>
                </svg>
                {/* Furniture */}
                {items.map(item => {
                  const sc2=0.057, { w,d }=rotDims(item), isSel=item.uid===selected
                  return (
                    <div key={item.uid} onClick={e=>{ e.stopPropagation(); setSelected(isSel?null:item.uid) }}
                      style={{ position:'absolute', left:item.x*sc2, top:item.y*sc2, width:w*sc2, height:d*sc2,
                        background:item.top+'80', border:`2px solid ${isSel?roomAccent:item.top}`,
                        boxShadow:isSel?`0 0 0 2px white,0 0 0 4px ${roomAccent}`:undefined,
                        display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', overflow:'hidden' }}>
                      <span style={{ fontSize:7, fontWeight:700, color:'#1c1a16', textAlign:'center', padding:'0 2px' }}>{item.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Wardrobe configurator ── */}
        {showConfig && (
          <ConfigPanel
            config={wardConfig} setConfig={setWardConfig}
            step={configStep}   setStep={setConfigStep}
            onPlace={handlePlace} onClose={()=>setShowConfig(false)}
            clientName={clientName}   setClientName={setClientName}
            clientPhone={clientPhone} setClientPhone={setClientPhone}
          />
        )}
      </div>
    </div>
  )
}

const tb: React.CSSProperties = {
  padding:'3px 9px', borderRadius:6, border:'1px solid rgba(255,255,255,0.15)',
  background:'transparent', color:'#e8e6e1', fontSize:10, cursor:'pointer', fontFamily:'inherit', fontWeight:600,
}
