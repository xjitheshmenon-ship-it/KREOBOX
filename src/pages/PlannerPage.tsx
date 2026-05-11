import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// ── Design tokens ─────────────────────────────────────────────────
const BG     = '#f0eee9'
const PAPER  = '#fafaf7'
const INK    = '#1a1815'
const MUTE   = 'rgba(26,24,21,0.55)'
const LINE   = 'rgba(26,24,21,0.09)'
const ACCENT = '#c96442'

type ProductMode = 'kitchen' | 'wardrobe' | 'office'
type ViewMode    = '2D plan' | 'Elevation' | '3D view'
type FilterTab   = 'All' | 'Cabinets' | 'Surfaces' | 'Hardware' | 'Appliances' | 'Lighting' | 'Desks' | 'Workstations' | 'Storage' | 'Meeting' | 'Packages'

// ── Catalog types ─────────────────────────────────────────────────
interface CatalogEntry {
  id: string; name: string; code: string
  category: 'base' | 'upper' | 'tall' | 'island' | 'fridge' | 'wardrobe' | 'desk' | 'storage'
  filterTag: FilterTab
  width: number; height: number; depth: number; price: number
  hasHob?: boolean; hasSink?: boolean; isIsland?: boolean
  color: string
  provenance: string
  sectionLabel: string
}

interface PlacedItem {
  uid: string
  entry: CatalogEntry
  x: number; y: number
  width: number
  finish: string
}

// ── Material & hardware specs (auto-assigned, not user-selectable) ─
interface MatSpec { label: string; spec: string }

function getMaterialSpecs(entry: CatalogEntry, product: ProductMode): MatSpec[] {
  if (product === 'kitchen') {
    if (entry.filterTag === 'Surfaces')
      return [{ label: 'Surface', spec: '20mm engineered quartz' }, { label: 'Edge', spec: '3mm PVC / mitred quartz' }]
    if (entry.category === 'island')
      return [
        { label: 'Carcass', spec: '18mm HDHMR' },
        { label: 'Worktop', spec: '20mm engineered quartz' },
        { label: 'Drawer box', spec: '12mm HDHMR · 6mm HDF base' },
        { label: 'Back panel', spec: '9mm HDF' },
      ]
    if (entry.category === 'upper')
      return [
        { label: 'Carcass', spec: '18mm HDHMR' },
        { label: 'Back panel', spec: '6mm HDF' },
      ]
    if (entry.category === 'tall' || entry.category === 'fridge')
      return [
        { label: 'Carcass', spec: '18mm HDHMR' },
        { label: 'Back panel', spec: '9mm HDF' },
        { label: 'Shelf', spec: '18mm HDHMR' },
      ]
    // base
    return [
      { label: 'Carcass', spec: '18mm HDHMR' },
      { label: 'Back panel', spec: '9mm HDF' },
      { label: 'Shelf', spec: '18mm HDHMR' },
      { label: 'Drawer box', spec: '12mm HDHMR · 6mm HDF base' },
    ]
  }
  if (product === 'wardrobe') {
    if (entry.id.includes('drawer') || entry.id.includes('basket'))
      return [
        { label: 'Box sides', spec: '12mm MDF' },
        { label: 'Base', spec: '6mm HDF' },
      ]
    if (entry.category === 'wardrobe')
      return [
        { label: 'Carcass', spec: '18mm MDF' },
        { label: 'Back panel', spec: '9mm MDF' },
        { label: 'Shelf', spec: '18mm MDF' },
      ]
    return [
      { label: 'Carcass', spec: '18mm MDF' },
      { label: 'Back panel', spec: '9mm MDF' },
    ]
  }
  // office → plywood throughout
  if (entry.filterTag === 'Desks' || entry.filterTag === 'Workstations')
    return [
      { label: 'Desktop', spec: '25mm Commercial BWR ply' },
      { label: 'Modesty / frame', spec: '18mm BWR ply' },
      { label: 'Steel frame', spec: '2mm powder-coat MS' },
    ]
  if (entry.filterTag === 'Meeting')
    return [
      { label: 'Top', spec: '25mm BWR ply + veneer' },
      { label: 'Lipping', spec: '3mm solid wood' },
      { label: 'Base', spec: 'powder-coat mild steel' },
    ]
  return [
    { label: 'Carcass', spec: '18mm BWR ply' },
    { label: 'Back panel', spec: '9mm ply' },
    { label: 'Shelf', spec: '18mm BWR ply' },
  ]
}

function getAutoHardware(entry: CatalogEntry): string {
  const c = entry.category
  if (c === 'base' || c === 'upper') return 'Hettich Sensys soft-close hinges'
  if (c === 'tall')     return 'Hettich InnoTech soft-close pull-out'
  if (c === 'island')   return 'Hettich ArciTech drawer system'
  if (c === 'wardrobe') return 'Hettich InnoTech Atira drawer system'
  if (c === 'storage')  return 'Hettich push-to-open fittings'
  if (c === 'desk')     return 'Cable spine + steel frame connectors'
  return 'Standard hardware'
}

// ── Design validation ─────────────────────────────────────────────
interface DesignCheck { status: 'ok' | 'warn' | 'info'; message: string }

function validateDesign(items: PlacedItem[], product: ProductMode): DesignCheck[] {
  if (items.length === 0) return [{ status: 'warn', message: 'No items placed in the layout yet' }]
  const checks: DesignCheck[] = []

  if (product === 'kitchen') {
    const hasSink = items.some(it => it.entry.hasSink)
    const hasHob  = items.some(it => it.entry.hasHob)
    const baseItems = items.filter(it => it.entry.category === 'base')
    const hasUpper  = items.some(it => it.entry.category === 'upper')
    checks.push(hasSink
      ? { status: 'ok',   message: 'Sink unit placed' }
      : { status: 'warn', message: 'No sink — add a sink base cabinet' })
    checks.push(hasHob
      ? { status: 'ok',   message: 'Hob / cooking unit placed' }
      : { status: 'warn', message: 'No hob unit — a cooking zone is recommended' })
    checks.push(hasUpper
      ? { status: 'ok',   message: 'Wall cabinets placed' }
      : { status: 'info', message: 'No wall cabinets — upper units add ~40% more storage' })
    const counterW = baseItems.reduce((s, it) => s + it.width, 0)
    if (counterW > 0) checks.push({ status: 'ok', message: `${(counterW / 1000).toFixed(1)}m of base counter confirmed` })
    if (items.some(it => it.entry.isIsland)) checks.push({ status: 'info', message: 'Island included — ensure 900mm clearance on all sides' })
  }

  if (product === 'wardrobe') {
    const hasHang   = items.some(it => it.entry.id.includes('hang'))
    const hasDrawer = items.some(it => it.entry.category === 'storage')
    checks.push(hasHang
      ? { status: 'ok',   message: 'Hang space included' }
      : { status: 'warn', message: 'No hanging space — add long or double hang module' })
    checks.push(hasDrawer
      ? { status: 'ok',   message: 'Drawer / basket storage included' }
      : { status: 'info', message: 'No drawers or baskets — useful for folded items' })
    if (!items.some(it => it.entry.id.includes('frame')))
      checks.push({ status: 'info', message: 'No wardrobe frame — needed for door fitting' })
  }

  if (product === 'office') {
    const hasDesk    = items.some(it => it.entry.category === 'desk')
    const hasStorage = items.some(it => it.entry.category === 'storage')
    const hasMtg     = items.some(it => it.entry.filterTag === 'Meeting')
    checks.push(hasDesk
      ? { status: 'ok',   message: 'Workstations placed' }
      : { status: 'warn', message: 'No desks or workstations placed' })
    checks.push(hasStorage
      ? { status: 'ok',   message: 'Storage units included' }
      : { status: 'info', message: 'No storage — consider a credenza or filing cabinet' })
    if (hasMtg) checks.push({ status: 'ok', message: 'Meeting / conference table included' })
  }

  return checks
}

// ── Catalogs ──────────────────────────────────────────────────────
const KITCHEN_CATALOG: CatalogEntry[] = [
  {
    id:'k-drawer-300', name:'Drawer base, 3-pull', code:'KBX-CB-300-D3',
    category:'base', filterTag:'Cabinets', sectionLabel:'BASE CABINETS · 720H',
    width:600, height:870, depth:600, price:18400, color:'#d4c9b0',
    provenance:'18mm HDHMR carcass. Hettich soft-close runners. Pre-assembled drawer boxes.',
  },
  {
    id:'k-sink-1200', name:'Sink base, single basin', code:'KBX-CB-1200-SB',
    category:'base', filterTag:'Cabinets', sectionLabel:'BASE CABINETS · 720H',
    width:1200, height:870, depth:600, price:32100, hasSink:true, color:'#d4c9b0',
    provenance:'Marine-grade ply back panel. Included stainless basin cut-out.',
  },
  {
    id:'k-corner-900', name:'Corner carousel', code:'KBX-CB-900-CC',
    category:'base', filterTag:'Cabinets', sectionLabel:'BASE CABINETS · 720H',
    width:900, height:870, depth:900, price:41200, color:'#c8bda0',
    provenance:'Lemans II pull-out system. 18mm HDF carcass.',
  },
  {
    id:'k-pantry-600', name:'Pantry pull-out', code:'KBX-TU-600-PP',
    category:'tall', filterTag:'Cabinets', sectionLabel:'TALL UNITS · 2400H',
    width:600, height:2400, depth:600, price:64800, color:'#c0b49a',
    provenance:'Carcass HDF, FSC-certified. Laminate by Greenlam, Hosur. 7-year warranty.',
  },
  {
    id:'k-oven-600', name:'Tower oven housing', code:'KBX-TU-600-OV',
    category:'tall', filterTag:'Cabinets', sectionLabel:'TALL UNITS · 2400H',
    width:600, height:2400, depth:600, price:38000, color:'#b8b0a0',
    provenance:'Built-in oven bracket with heat-resistant lining. Universal fit 60cm ovens.',
  },
  {
    id:'k-upper-600', name:'Wall unit, 600', code:'KBX-WC-600',
    category:'upper', filterTag:'Cabinets', sectionLabel:'WALL CABINETS · 720H',
    width:600, height:700, depth:300, price:12000, color:'#e0d8c8',
    provenance:'9mm HDF back. Clip-on hinges. Adjustable shelf. Powder-coat interior.',
  },
  {
    id:'k-upper-900', name:'Wall unit, 900', code:'KBX-WC-900',
    category:'upper', filterTag:'Cabinets', sectionLabel:'WALL CABINETS · 720H',
    width:900, height:700, depth:300, price:16000, color:'#e0d8c8',
    provenance:'9mm HDF back. Clip-on hinges. Adjustable shelf. Powder-coat interior.',
  },
  {
    id:'k-hob-900', name:'Hob unit', code:'KBX-CB-900-HB',
    category:'base', filterTag:'Appliances', sectionLabel:'APPLIANCES',
    width:900, height:870, depth:600, price:22000, hasHob:true, color:'#d4c9b0',
    provenance:'Cut-out for 4-burner 86×50cm hob. Stainless liner. Ventilation slots.',
  },
  {
    id:'k-fridge-600', name:'Fridge surround', code:'KBX-TU-600-FR',
    category:'fridge', filterTag:'Appliances', sectionLabel:'APPLIANCES',
    width:600, height:2100, depth:650, price:15000, color:'#b8b0a0',
    provenance:'Adjustable for 60–75cm fridge depth. Ventilation top grille.',
  },
  {
    id:'k-quartz-surface', name:'Quartz worktop, 20mm', code:'KBX-WK-Q20',
    category:'base', filterTag:'Surfaces', sectionLabel:'SURFACES',
    width:600, height:40, depth:600, price:18900, color:'#e8e2d5',
    provenance:'Engineered quartz, 20mm. Calacatta vein. 15-year stain warranty.',
  },
  {
    id:'k-island', name:'Kitchen island', code:'KBX-ISL-2200',
    category:'island', filterTag:'Cabinets', sectionLabel:'ISLANDS',
    width:2200, height:900, depth:900, price:85000, isIsland:true, color:'#1a1815',
    provenance:'Waterfall quartz top. 4 × deep drawers. Integrated power sockets.',
  },
]

const WARDROBE_CATALOG: CatalogEntry[] = [
  {
    id:'w-long-hang', name:'Long hang, 2400h', code:'KBX-WI-LH-2400',
    category:'wardrobe', filterTag:'Cabinets', sectionLabel:'HANG SPACE',
    width:600, height:2400, depth:600, price:8200, color:'#c8bda0',
    provenance:'Full-length hanging rail. Chromed steel. Includes 2 shelf brackets.',
  },
  {
    id:'w-double-hang', name:'Double hang, 2 × 1200h', code:'KBX-WI-DH-2400',
    category:'wardrobe', filterTag:'Cabinets', sectionLabel:'HANG SPACE',
    width:900, height:2400, depth:600, price:9400, color:'#c8bda0',
    provenance:'Two short hang rails stacked. Ideal for shirts, jackets, trousers.',
  },
  {
    id:'w-trouser', name:'Trouser pull-out', code:'KBX-WI-TR-100',
    category:'wardrobe', filterTag:'Hardware', sectionLabel:'HANG SPACE',
    width:100, height:2400, depth:600, price:6900, color:'#b8b0a0',
    provenance:'10-bar chromed trouser rack. Soft-pull mechanism. Max load 8kg.',
  },
  {
    id:'w-drawer-200', name:'Drawer, 200h push-to-open', code:'KBX-WI-DR-200P',
    category:'storage', filterTag:'Cabinets', sectionLabel:'DRAWERS & BASKETS',
    width:200, height:2400, depth:600, price:4800, color:'#d4c9b0',
    provenance:'Push-to-open Hettich ActroNice. Wooden box, dovetail joint.',
  },
  {
    id:'w-drawer-150sc', name:'Drawer, 150h soft-close', code:'KBX-WI-DR-150SC',
    category:'storage', filterTag:'Cabinets', sectionLabel:'DRAWERS & BASKETS',
    width:150, height:2400, depth:600, price:5200, color:'#d4c9b0',
    provenance:'Hettich InnoTech Atira box. Incl. divider set.',
  },
  {
    id:'w-basket-150', name:'Mesh basket, 150h', code:'KBX-WI-BA-150',
    category:'storage', filterTag:'Hardware', sectionLabel:'DRAWERS & BASKETS',
    width:150, height:2400, depth:600, price:2400, color:'#c0b8a8',
    provenance:'Powder-coated steel mesh. Ventilated for knitwear. Max 6kg.',
  },
  {
    id:'w-frame-600', name:'Wardrobe frame, 600', code:'KBX-WDF-600',
    category:'wardrobe', filterTag:'Cabinets', sectionLabel:'FRAMES',
    width:600, height:2400, depth:600, price:18000, color:'#c8bda0',
    provenance:'18mm HDHMR. Includes top panel, base, and 2 side panels.',
  },
]

const OFFICE_CATALOG: CatalogEntry[] = [
  // DESKS
  {
    id:'o-desk-1500', name:'Straight desk, 1500', code:'KBX-D-1500',
    category:'desk', filterTag:'Desks', sectionLabel:'DESKS',
    width:1500, height:750, depth:700, price:32000, color:'#c8bda0',
    provenance:'18mm HDF top, powder-coat steel frame. Under-desk cable tray included.',
  },
  {
    id:'o-desk-1800', name:'Straight desk, 1800', code:'KBX-D-1800',
    category:'desk', filterTag:'Desks', sectionLabel:'DESKS',
    width:1800, height:750, depth:750, price:42000, color:'#c8bda0',
    provenance:'Extra-deep surface. Modesty panel. 3-way cable spine.',
  },
  {
    id:'o-ldsk-2100', name:'L-desk, 2100', code:'KBX-LD-2100',
    category:'desk', filterTag:'Desks', sectionLabel:'DESKS',
    width:2100, height:750, depth:700, price:58000, color:'#c0b49a',
    provenance:'Corner return 900×700. Under-desk pedestal bay. FSC-certified board.',
  },
  {
    id:'o-standdesk', name:'Standing desk, 1400', code:'KBX-SD-1400',
    category:'desk', filterTag:'Desks', sectionLabel:'DESKS',
    width:1400, height:1300, depth:700, price:68000, color:'#b8b0a0',
    provenance:'Electric height 650–1300mm. Memory handset, 3 presets. Bamboo top.',
  },
  // WORKSTATIONS
  {
    id:'o-ws-2', name:'2-seat workstation', code:'KBX-WS-2S',
    category:'desk', filterTag:'Workstations', sectionLabel:'WORKSTATIONS',
    width:1600, height:750, depth:1500, price:74000, color:'#c8bda0',
    provenance:'Back-to-back 1600mm. Shared cable spine. Privacy screens included.',
  },
  {
    id:'o-ws-4', name:'4-seat workstation', code:'KBX-WS-4S',
    category:'desk', filterTag:'Workstations', sectionLabel:'WORKSTATIONS',
    width:3200, height:750, depth:1500, price:138000, color:'#c0b49a',
    provenance:'Cluster of 4 back-to-back. Fabric screens 400h. Power totem per pair.',
  },
  {
    id:'o-cabin-panel', name:'Cabin partition, 1800h', code:'KBX-PT-1800',
    category:'desk', filterTag:'Workstations', sectionLabel:'WORKSTATIONS',
    width:1800, height:1800, depth:80, price:18500, color:'#d4c9b0',
    provenance:'Fabric-faced 50mm panel. Aluminium frame. Floor-to-ceiling option.',
  },
  // STORAGE
  {
    id:'o-storage-wall', name:'Storage wall · A', code:'KBX-SW-4B',
    category:'storage', filterTag:'Storage', sectionLabel:'STORAGE',
    width:2200, height:2100, depth:600, price:218000, color:'#b8b0a0',
    provenance:'18mm HDHMR carcass. Hettich push-to-open fittings. Powder-coated steel accents.',
  },
  {
    id:'o-credenza-1800', name:'Credenza, 1800', code:'KBX-CR-1800',
    category:'storage', filterTag:'Storage', sectionLabel:'STORAGE',
    width:1800, height:750, depth:500, price:62000, color:'#c8bda0',
    provenance:'4-door with adjustable shelf. Lockable. Top surface usable.',
  },
  {
    id:'o-bookshelf-900', name:'Open bookshelf, 900', code:'KBX-BSH-900',
    category:'storage', filterTag:'Storage', sectionLabel:'STORAGE',
    width:900, height:2100, depth:350, price:22000, color:'#d4c9b0',
    provenance:'Open shelves, 32mm pitch adjustable. Powder-coat back panel.',
  },
  {
    id:'o-filing-600', name:'Filing cabinet, 3-drawer', code:'KBX-FIL-600',
    category:'storage', filterTag:'Storage', sectionLabel:'STORAGE',
    width:600, height:1200, depth:500, price:18000, color:'#b8b0a0',
    provenance:'Lateral file A4/Foolscap. Lockable top drawer. Anti-tilt.',
  },
  {
    id:'o-pedestal', name:'Under-desk pedestal', code:'KBX-PD-3D',
    category:'storage', filterTag:'Storage', sectionLabel:'STORAGE',
    width:450, height:680, depth:500, price:9800, color:'#c0b8a8',
    provenance:'3-drawer on castors. Lockable. Cushion top. Matches desk finish.',
  },
  // MEETING
  {
    id:'o-mtg-4p', name:'Meeting table, 4-person', code:'KBX-MT-4P',
    category:'desk', filterTag:'Meeting', sectionLabel:'MEETING',
    width:1800, height:750, depth:900, price:48000, color:'#d4c9b0',
    provenance:'Rectangular 1800×900. Cable port centre. Powder-coat base.',
  },
  {
    id:'o-mtg-6p', name:'Conference table, 6-person', code:'KBX-MT-6P',
    category:'desk', filterTag:'Meeting', sectionLabel:'MEETING',
    width:2400, height:750, depth:1100, price:78000, color:'#c8bda0',
    provenance:'Boat-shape 2400×1100. Integrated power × 4. Modesty panel.',
  },
  {
    id:'o-mtg-8p', name:'Conference table, 8-person', code:'KBX-MT-8P',
    category:'desk', filterTag:'Meeting', sectionLabel:'MEETING',
    width:3000, height:750, depth:1200, price:112000, color:'#c0b49a',
    provenance:'Executive format. Veneer top. 8 power sockets, HDMI centre pod.',
  },
]

const CATALOGS: Record<ProductMode, CatalogEntry[]> = {
  kitchen: KITCHEN_CATALOG,
  wardrobe: WARDROBE_CATALOG,
  office: OFFICE_CATALOG,
}

interface CatalogMeta {
  eyebrow: string
  heading: string
  headingItalic: string
  subtitle: string
}

const CATALOG_META: Record<ProductMode, CatalogMeta> = {
  kitchen: {
    eyebrow: 'KREO KITCHEN',
    heading: 'Add to your kitchen',
    headingItalic: '',
    subtitle: 'Base cabinets, wall units, islands, appliances — all pre-cut and ready to install.',
  },
  wardrobe: {
    eyebrow: 'KREO WARDROBE',
    heading: 'What goes inside',
    headingItalic: '',
    subtitle: 'Hang space, drawers, shelves and baskets — configured to your bay width.',
  },
  office: {
    eyebrow: 'KREO OFFICE',
    heading: 'Office interiors,',
    headingItalic: 'pre-cut and precise.',
    subtitle: 'Desks, workstations, storage walls, conference tables — all from pre-cut laminated panels. Finish selection, BOQ, and install in one flow.',
  },
}

// ── Filter tabs per product ───────────────────────────────────────
const FILTER_TABS: Record<ProductMode, FilterTab[]> = {
  kitchen:  ['All', 'Cabinets', 'Surfaces', 'Appliances', 'Hardware', 'Lighting'],
  wardrobe: ['All', 'Cabinets', 'Hardware', 'Lighting'],
  office:   ['All', 'Desks', 'Workstations', 'Storage', 'Meeting', 'Packages'],
}

// ── Room configs (mm) ─────────────────────────────────────────────
const ROOMS = {
  kitchen:  { w: 3800, d: 2840, wallH: 2400 },
  wardrobe: { w: 2700, d: 600,  wallH: 2400 },
  office:   { w: 5400, d: 3400, wallH: 2600 },
}

// ── Finishes (surface laminate — customer selects colour) ─────────
const FINISHES = ['Bali oak', 'Espresso', 'Bone matte', 'Sand grey']

// ── Project info ──────────────────────────────────────────────────
type HomeType = '1BHK' | '2BHK' | '3BHK' | '4BHK+' | 'Villa' | 'Office' | 'Custom'

interface ProjectInfo {
  id: string
  name: string
  homeType: HomeType
  product: ProductMode
  createdAt: number
  updatedAt: number
}

interface SavedProject {
  info: ProjectInfo
  placedItems: PlacedItem[]
}

const SAVE_KEY = 'kreobox-planner-v1'

function loadSavedProjects(): SavedProject[] {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) ?? '[]') } catch { return [] }
}

function saveProject(project: SavedProject) {
  const all = loadSavedProjects().filter(p => p.info.id !== project.info.id)
  all.unshift(project)
  localStorage.setItem(SAVE_KEY, JSON.stringify(all.slice(0, 20)))
}

// ── SVG canvas constants ──────────────────────────────────────────
const SVG_W = 620
const SVG_H = 440
const ROOM_OX = 70
const ROOM_OY = 40
const MAX_ROOM_W = SVG_W - ROOM_OX - 10
const MAX_ROOM_H = SVG_H - ROOM_OY - 30

function getScale(room: { w: number; d: number }, zoom: number) {
  return Math.min(MAX_ROOM_W / room.w, MAX_ROOM_H / room.d) * zoom
}

// ── ISO 3D constants ──────────────────────────────────────────────
const ISO_SX = Math.cos(Math.PI / 6)
const ISO_SY = Math.sin(Math.PI / 6)
const ISO_SCALE_3D = 0.055

function iso(mx: number, my: number, mz: number, cx: number, cy: number) {
  return {
    x: cx + (mx - mz) * ISO_SX * ISO_SCALE_3D,
    y: cy - (mx + mz) * ISO_SY * ISO_SCALE_3D + my * ISO_SCALE_3D,
  }
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function lighten(hex: string, d: number) {
  if (!hex.startsWith('#') || hex.length < 7) return hex
  const { r, g, b } = hexToRgb(hex)
  const clamp = (v: number) => Math.min(255, Math.max(0, v))
  return `rgb(${clamp(r + d)},${clamp(g + d)},${clamp(b + d)})`
}

function darken(hex: string, d: number) { return lighten(hex, -d) }

function getFinishColor(finish: string): string {
  const map: Record<string, string> = {
    'Bali oak':  '#c8b080',
    'Espresso':  '#3a2010',
    'Bone matte':'#e0dcd4',
    'Sand grey': '#989290',
  }
  return map[finish] ?? '#d4c9b0'
}

// ── Logo ──────────────────────────────────────────────────────────
function KreoboxLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M16 28 H84 V84 Q84 90 78 90 H22 Q16 90 16 84 Z M30 42 V76 H70 V42 Z"
        fill={ACCENT} />
      <rect x="20" y="10" width="68" height="14" rx="3"
        transform="rotate(-8 54 17)" fill={ACCENT} fillOpacity="0.7" />
    </svg>
  )
}

// ── Switcher components ───────────────────────────────────────────
function ProductSwitch({ active, onChange }: { active: ProductMode; onChange: (m: ProductMode) => void }) {
  const opts: ProductMode[] = ['kitchen', 'wardrobe', 'office']
  return (
    <div style={{ display: 'flex', background: 'rgba(26,24,21,0.05)', borderRadius: 8, padding: 3 }}>
      {opts.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{
          padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: 'none',
          background: o === active ? PAPER : 'transparent',
          color: o === active ? INK : MUTE,
          boxShadow: o === active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
          cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
        }}>{o}</button>
      ))}
    </div>
  )
}

function ViewToggle({ active, onChange }: { active: ViewMode; onChange: (v: ViewMode) => void }) {
  const opts: ViewMode[] = ['2D plan', 'Elevation', '3D view']
  return (
    <div style={{ display: 'flex', background: 'rgba(26,24,21,0.05)', borderRadius: 8, padding: 3 }}>
      {opts.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{
          padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: 'none',
          background: o === active ? PAPER : 'transparent',
          color: o === active ? INK : MUTE,
          boxShadow: o === active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
          cursor: 'pointer', fontFamily: 'inherit',
        }}>{o}</button>
      ))}
    </div>
  )
}

// ── 2D Floor Plan Canvas ───────────────────────────────────────────
interface Plan2DProps {
  product: ProductMode
  items: PlacedItem[]
  selectedUid: string | null
  zoom: number
  dragOverPos: { x: number; y: number } | null
  ghostEntry: CatalogEntry | null
  onSelect: (uid: string | null) => void
  onDrop: (entry: CatalogEntry, mmX: number, mmY: number) => void
  onDragOver: (mmX: number, mmY: number) => void
  onDragLeave: () => void
  onMoveItem: (uid: string, mmX: number, mmY: number) => void
}

function Plan2D({ product, items, selectedUid, zoom, dragOverPos, ghostEntry, onSelect, onDrop, onDragOver, onDragLeave, onMoveItem }: Plan2DProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const room = ROOMS[product]
  const scale = getScale(room, zoom)
  const rW = room.w * scale
  const rH = room.d * scale

  // ── pointer-based item move ──────────────────────────────────────
  const moveState = useRef<{
    uid: string; startClientX: number; startClientY: number; itemX: number; itemY: number
  } | null>(null)
  const [livePos, setLivePos] = useState<{ uid: string; x: number; y: number } | null>(null)

  const clientToMm = useCallback((clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return null
    const svgX = (clientX - rect.left) / rect.width * SVG_W
    const svgY = (clientY - rect.top) / rect.height * SVG_H
    const mmX = Math.round((svgX - ROOM_OX) / scale / 100) * 100
    const mmY = Math.round((svgY - ROOM_OY) / scale / 100) * 100
    return { mmX: Math.max(0, Math.min(room.w, mmX)), mmY: Math.max(0, Math.min(room.d, mmY)) }
  }, [scale, room])

  const handleItemMouseDown = useCallback((e: React.MouseEvent, item: PlacedItem) => {
    e.stopPropagation()
    e.preventDefault()
    onSelect(item.uid)
    moveState.current = { uid: item.uid, startClientX: e.clientX, startClientY: e.clientY, itemX: item.x, itemY: item.y }
    setLivePos({ uid: item.uid, x: item.x, y: item.y })
  }, [onSelect])

  const handleSvgMouseMove = useCallback((e: React.MouseEvent) => {
    if (!moveState.current) return
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    const dSvgX = (e.clientX - moveState.current.startClientX) / rect.width * SVG_W
    const dSvgY = (e.clientY - moveState.current.startClientY) / rect.height * SVG_H
    const dMmX = Math.round(dSvgX / scale / 100) * 100
    const dMmY = Math.round(dSvgY / scale / 100) * 100
    const newX = Math.max(0, moveState.current.itemX + dMmX)
    const newY = Math.max(0, moveState.current.itemY + dMmY)
    setLivePos({ uid: moveState.current.uid, x: newX, y: newY })
  }, [scale])

  const commitMove = useCallback(() => {
    if (moveState.current && livePos) {
      onMoveItem(livePos.uid, livePos.x, livePos.y)
    }
    moveState.current = null
    setLivePos(null)
  }, [livePos, onMoveItem])

  // ── catalog DnD coords ───────────────────────────────────────────
  const toMm = useCallback((svgX: number, svgY: number) => {
    const mmX = Math.round((svgX - ROOM_OX) / scale / 100) * 100
    const mmY = Math.round((svgY - ROOM_OY) / scale / 100) * 100
    return { mmX: Math.max(0, Math.min(room.w, mmX)), mmY: Math.max(0, Math.min(room.d, mmY)) }
  }, [scale, room])

  const getSvgCoords = useCallback((e: React.DragEvent) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return null
    const svgX = (e.clientX - rect.left) / rect.width * SVG_W
    const svgY = (e.clientY - rect.top) / rect.height * SVG_H
    return toMm(svgX, svgY)
  }, [toMm])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    const pos = getSvgCoords(e)
    if (pos) onDragOver(pos.mmX, pos.mmY)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const pos = getSvgCoords(e)
    if (!pos || !ghostEntry) return
    onDrop(ghostEntry, pos.mmX, pos.mmY)
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ width: '100%', height: '100%', display: 'block', cursor: moveState.current ? 'grabbing' : 'crosshair', userSelect: 'none' }}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      onMouseMove={handleSvgMouseMove}
      onMouseUp={commitMove}
      onMouseLeave={commitMove}
      onClick={e => { if (!livePos && e.target === svgRef.current) onSelect(null) }}
    >
      <defs>
        <pattern id="pl-grid" width={scale * 100} height={scale * 100} patternUnits="userSpaceOnUse"
          patternTransform={`translate(${ROOM_OX},${ROOM_OY})`}>
          <path d={`M${scale*100} 0 L0 0 0 ${scale*100}`} fill="none" stroke="rgba(26,24,21,0.05)" strokeWidth="0.5" />
        </pattern>
        <pattern id="pl-grid-maj" width={scale * 500} height={scale * 500} patternUnits="userSpaceOnUse"
          patternTransform={`translate(${ROOM_OX},${ROOM_OY})`}>
          <path d={`M${scale*500} 0 L0 0 0 ${scale*500}`} fill="none" stroke="rgba(26,24,21,0.10)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x={ROOM_OX} y={ROOM_OY} width={rW} height={rH} fill="rgba(232,226,213,0.18)" />
      <rect x={ROOM_OX} y={ROOM_OY} width={rW} height={rH} fill="url(#pl-grid)" />
      <rect x={ROOM_OX} y={ROOM_OY} width={rW} height={rH} fill="url(#pl-grid-maj)" />
      <path d={`M${ROOM_OX} ${ROOM_OY+rH} L${ROOM_OX} ${ROOM_OY} L${ROOM_OX+rW} ${ROOM_OY}`}
        fill="none" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d={`M${ROOM_OX+rW} ${ROOM_OY} L${ROOM_OX+rW} ${ROOM_OY+rH*0.4}`}
        fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d={`M${ROOM_OX} ${ROOM_OY+rH} L${ROOM_OX+rW*0.42} ${ROOM_OY+rH}`}
        fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />

      {items.map(item => {
        const live = livePos?.uid === item.uid ? livePos : null
        const dispX = live ? live.x : item.x
        const dispY = live ? live.y : item.y
        const iw = item.width * scale
        const ih = item.entry.depth * scale
        const ix = ROOM_OX + dispX * scale
        const iy = ROOM_OY + dispY * scale
        const isSel = item.uid === selectedUid
        const isMoving = livePos?.uid === item.uid
        const isIsland = item.entry.isIsland
        const fillColor = isIsland ? '#1a1815' : '#d4c9b0'
        const strokeColor = isMoving ? ACCENT : isSel ? ACCENT : '#a99a82'
        return (
          <g key={item.uid}
            style={{ cursor: isMoving ? 'grabbing' : 'grab', opacity: isMoving ? 0.8 : 1 }}
            onMouseDown={e => handleItemMouseDown(e, item)}
            onClick={e => { e.stopPropagation(); if (!isMoving) onSelect(item.uid) }}
          >
            <rect x={ix} y={iy} width={iw} height={ih}
              fill={fillColor} stroke={strokeColor} strokeWidth={isSel ? 2.5 : 1.5} rx={2} />
            {item.entry.hasSink && (
              <ellipse cx={ix + iw/2} cy={iy + ih/2} rx={iw*0.2} ry={ih*0.3}
                fill="#c0c8d0" stroke={strokeColor} strokeWidth="1" />
            )}
            {item.entry.hasHob && (
              <>
                <circle cx={ix + iw*0.28} cy={iy + ih*0.35} r={iw*0.06} fill="#2a2520" />
                <circle cx={ix + iw*0.55} cy={iy + ih*0.35} r={iw*0.06} fill="#2a2520" />
                <circle cx={ix + iw*0.28} cy={iy + ih*0.68} r={iw*0.06} fill="#2a2520" />
                <circle cx={ix + iw*0.55} cy={iy + ih*0.68} r={iw*0.06} fill="#2a2520" />
              </>
            )}
            {item.entry.category === 'tall' && (
              <line x1={ix + iw/2} y1={iy} x2={ix + iw/2} y2={iy + ih}
                stroke={strokeColor} strokeWidth="0.8" />
            )}
            {item.entry.isIsland && (
              <rect x={ix+6} y={iy+6} width={iw-12} height={ih-12} fill="#252018" rx={1} />
            )}
            <text x={ix + iw/2} y={iy + ih/2 + 4}
              fill={isIsland ? 'rgba(255,255,255,0.4)' : 'rgba(26,24,21,0.5)'}
              fontSize={Math.max(7, Math.min(10, iw * 0.07))}
              fontFamily="JetBrains Mono, monospace" textAnchor="middle">{item.entry.code}</text>
            {isSel && (
              <>
                <rect x={ix-1} y={iy-1} width={iw+2} height={ih+2}
                  fill="none" stroke={ACCENT} strokeWidth="2" strokeDasharray="4 3" rx={3} />
                <circle cx={ix} cy={iy} r={4} fill={ACCENT} />
                <circle cx={ix+iw} cy={iy} r={4} fill={ACCENT} />
                <circle cx={ix+iw} cy={iy+ih} r={4} fill={ACCENT} />
                <circle cx={ix} cy={iy+ih} r={4} fill={ACCENT} />
              </>
            )}
          </g>
        )
      })}

      {dragOverPos && ghostEntry && (() => {
        const gw = ghostEntry.width * scale
        const gh = ghostEntry.depth * scale
        const gx = ROOM_OX + dragOverPos.x * scale
        const gy = ROOM_OY + dragOverPos.y * scale
        return (
          <rect x={gx} y={gy} width={gw} height={gh}
            fill={`${ACCENT}22`} stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 3" rx={3} />
        )
      })()}

      {/* Dimension labels */}
      <line x1={ROOM_OX} y1={ROOM_OY-14} x2={ROOM_OX+rW} y2={ROOM_OY-14} stroke={MUTE} strokeWidth="0.8" />
      <line x1={ROOM_OX} y1={ROOM_OY-18} x2={ROOM_OX} y2={ROOM_OY-10} stroke={MUTE} strokeWidth="0.8" />
      <line x1={ROOM_OX+rW} y1={ROOM_OY-18} x2={ROOM_OX+rW} y2={ROOM_OY-10} stroke={MUTE} strokeWidth="0.8" />
      <text x={ROOM_OX+rW/2} y={ROOM_OY-18} fill={MUTE} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
        {(room.w/1000).toFixed(1)}m
      </text>
      <line x1={ROOM_OX-14} y1={ROOM_OY} x2={ROOM_OX-14} y2={ROOM_OY+rH} stroke={MUTE} strokeWidth="0.8" />
      <line x1={ROOM_OX-18} y1={ROOM_OY} x2={ROOM_OX-10} y2={ROOM_OY} stroke={MUTE} strokeWidth="0.8" />
      <line x1={ROOM_OX-18} y1={ROOM_OY+rH} x2={ROOM_OX-10} y2={ROOM_OY+rH} stroke={MUTE} strokeWidth="0.8" />
      <text x={ROOM_OX-20} y={ROOM_OY+rH/2} fill={MUTE} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle"
        transform={`rotate(-90,${ROOM_OX-20},${ROOM_OY+rH/2})`}>{(room.d/1000).toFixed(1)}m</text>
    </svg>
  )
}

// ── Elevation View ────────────────────────────────────────────────
function ElevationView({ product, items }: { product: ProductMode; items: PlacedItem[] }) {
  const room = ROOMS[product]
  const wallItems = items.filter(it => it.y < 700)
  const wallH = room.wallH
  const svgH = SVG_H - 60
  const elvScale = Math.min(MAX_ROOM_W / room.w, svgH / wallH)
  const baseY = ROOM_OY + svgH
  const oxEl = ROOM_OX
  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', height: '100%', display: 'block' }}>
      <line x1={oxEl} y1={baseY} x2={oxEl+room.w*elvScale} y2={baseY} stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <line x1={oxEl} y1={baseY-wallH*elvScale} x2={oxEl+room.w*elvScale} y2={baseY-wallH*elvScale}
        stroke={MUTE} strokeWidth="1" strokeDasharray="5 4" />
      {wallItems.map(item => {
        const iw = item.width * elvScale
        const icat = item.entry.category
        const ih = (icat === 'upper' ? 700 : item.entry.height) * elvScale
        const iy = baseY - ih
        const ix = oxEl + item.x * elvScale
        const isIsland = item.entry.isIsland
        return (
          <g key={item.uid}>
            <rect x={ix} y={iy} width={iw} height={ih}
              fill={isIsland ? '#1a1815' : '#d4c9b0'} stroke={isIsland ? '#3a352e' : '#a99a82'}
              strokeWidth="1.5" rx={2} />
            {icat === 'base' && <rect x={ix} y={iy} width={iw} height={ih*0.05} fill="#b8a888" rx={1} />}
            {icat !== 'island' && <line x1={ix+iw*0.5} y1={iy} x2={ix+iw*0.5} y2={iy+ih} stroke="#a99a82" strokeWidth="0.7" />}
            {item.entry.hasSink && <rect x={ix+iw*0.2} y={iy+ih*0.15} width={iw*0.6} height={ih*0.18} fill="#c0c8d0" stroke="#a0a8b0" strokeWidth="0.8" rx={2} />}
            {item.entry.hasHob && <>
              <circle cx={ix+iw*0.35} cy={iy+ih*0.08} r={iw*0.05} fill="#2a2520" />
              <circle cx={ix+iw*0.65} cy={iy+ih*0.08} r={iw*0.05} fill="#2a2520" />
            </>}
            <text x={ix+iw/2} y={iy+ih/2+3} fill="rgba(26,24,21,0.35)" fontSize="8" fontFamily="JetBrains Mono, monospace" textAnchor="middle">{item.entry.code}</text>
          </g>
        )
      })}
      <line x1={oxEl-12} y1={baseY-870*elvScale} x2={oxEl+room.w*elvScale+12} y2={baseY-870*elvScale}
        stroke={ACCENT} strokeWidth="0.8" strokeDasharray="3 3" />
      <text x={oxEl+room.w*elvScale+16} y={baseY-870*elvScale+3} fill={ACCENT} fontSize="8" fontFamily="JetBrains Mono, monospace">870</text>
      <text x={oxEl-30} y={baseY-wallH*elvScale/2} fill={MUTE} fontSize="8" fontFamily="JetBrains Mono, monospace" textAnchor="middle"
        transform={`rotate(-90,${oxEl-30},${baseY-wallH*elvScale/2})`}>{(wallH/1000).toFixed(1)}m</text>
    </svg>
  )
}

// ── Perspective 3D View ───────────────────────────────────────────
type RFace = { pts: number[][]; fill: string; stroke: string; strokeW: number }

function PerspView3D({ product, items, selectedUid }: { product: ProductMode; items: PlacedItem[]; selectedUid: string | null }) {
  const [rotY, setRotY] = useState(-35)
  const [rotX, setRotX] = useState(22)
  const dragRef = useRef<{ sx: number; sy: number; ry0: number; rx0: number } | null>(null)

  const room = ROOMS[product]
  const { w: W, wallH, d: D } = room
  const camDist = Math.sqrt(W * W + D * D) * 1.6
  const fov = SVG_W * 0.40

  const project = useCallback((wx: number, wy: number, wz: number) => {
    const tx = wx - W / 2
    const ty = wy - wallH * 0.3
    const tz = wz - D / 2
    const cosY = Math.cos(rotY * Math.PI / 180)
    const sinY = Math.sin(rotY * Math.PI / 180)
    const cosX = Math.cos(rotX * Math.PI / 180)
    const sinX = Math.sin(rotX * Math.PI / 180)
    const x1 = tx * cosY + tz * sinY
    const z1 = -tx * sinY + tz * cosY
    const y1 = ty
    const x2 = x1
    const y2 = y1 * cosX - z1 * sinX
    const z2 = y1 * sinX + z1 * cosX
    const z3 = z2 + camDist
    if (z3 < 1) return { x: SVG_W / 2, y: SVG_H / 2, z: -1 }
    return { x: SVG_W / 2 + x2 * fov / z3, y: SVG_H / 2 - y2 * fov / z3, z: z3 }
  }, [rotY, rotX, W, wallH, D, camDist, fov])

  const faces = useMemo<RFace[]>(() => {
    const f: RFace[] = []
    f.push({ pts: [[0,0,0],[W,0,0],[W,0,D],[0,0,D]],         fill: '#ddd8cc', stroke: '#c8c4b8', strokeW: 0.5 })
    f.push({ pts: [[0,0,0],[W,0,0],[W,wallH,0],[0,wallH,0]], fill: '#ece8e0', stroke: '#d4cec8', strokeW: 0.5 })
    f.push({ pts: [[0,0,0],[0,0,D],[0,wallH,D],[0,wallH,0]], fill: '#e8e4dc', stroke: '#d4cec8', strokeW: 0.5 })
    items.forEach(item => {
      const ix = item.x, iz = item.y
      const iw = item.width, ih = item.entry.height, id = item.entry.depth
      const fc = getFinishColor(item.finish)
      const isSel = item.uid === selectedUid
      const ss = isSel ? ACCENT : '#00000030'
      const sw = isSel ? 1.5 : 0.5
      f.push({ pts: [[ix,0,iz],[ix+iw,0,iz],[ix+iw,0,iz+id],[ix,0,iz+id]],             fill: darken(fc,50), stroke: '#00000020', strokeW: 0.3 })
      f.push({ pts: [[ix+iw,0,iz],[ix,0,iz],[ix,ih,iz],[ix+iw,ih,iz]],                 fill: darken(fc,20), stroke: '#00000020', strokeW: 0.3 })
      f.push({ pts: [[ix,0,iz+id],[ix,0,iz],[ix,ih,iz],[ix,ih,iz+id]],                 fill: darken(fc,28), stroke: ss, strokeW: sw })
      f.push({ pts: [[ix+iw,0,iz],[ix+iw,0,iz+id],[ix+iw,ih,iz+id],[ix+iw,ih,iz]],   fill: darken(fc,28), stroke: ss, strokeW: sw })
      f.push({ pts: [[ix,0,iz+id],[ix+iw,0,iz+id],[ix+iw,ih,iz+id],[ix,ih,iz+id]],   fill: fc,            stroke: ss, strokeW: sw })
      f.push({ pts: [[ix,ih,iz],[ix+iw,ih,iz],[ix+iw,ih,iz+id],[ix,ih,iz+id]],        fill: lighten(fc,30),stroke: ss, strokeW: sw })
      if (item.entry.category === 'base' && item.entry.filterTag !== 'Surfaces') {
        const cx1 = Math.max(0, ix - 15), cx2 = Math.min(W, ix + iw + 15)
        f.push({ pts: [[cx1,ih+30,iz],[cx2,ih+30,iz],[cx2,ih+30,iz+id],[cx1,ih+30,iz+id]], fill: '#dad6ce', stroke: '#c4c0b8', strokeW: 0.5 })
      }
    })
    return f
  }, [items, selectedUid, W, wallH, D])

  const rendered = useMemo(() => {
    return faces
      .map(face => {
        const projPts = face.pts.map(p => project(p[0], p[1], p[2]))
        const depth = projPts.reduce((s, p) => s + p.z, 0) / projPts.length
        const pts = projPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
        return { ...face, depth, pts }
      })
      .sort((a, b) => b.depth - a.depth)
  }, [faces, project])

  const onMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { sx: e.clientX, sy: e.clientY, ry0: rotY, rx0: rotX }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return
    setRotY(dragRef.current.ry0 + (e.clientX - dragRef.current.sx) * 0.4)
    setRotX(Math.max(8, Math.min(65, dragRef.current.rx0 - (e.clientY - dragRef.current.sy) * 0.25)))
  }
  const onMouseUp = () => { dragRef.current = null }

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab', userSelect: 'none' }}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove}
      onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
    >
      <rect width={SVG_W} height={SVG_H} fill={BG} />
      {rendered.map((face, i) => face.depth > 0 &&
        <polygon key={i} points={face.pts} fill={face.fill} stroke={face.stroke} strokeWidth={face.strokeW} />
      )}
      <text x={12} y={SVG_H - 12} fill={MUTE} fontSize="9" fontFamily="JetBrains Mono, monospace" style={{ pointerEvents: 'none' }}>
        3D PERSPECTIVE · drag to rotate 360°
      </text>
    </svg>
  )
}

// ── Mini read-only SVG snapshots (for BOM review) ────────────────
function MiniPlanSvg({ product, items }: { product: ProductMode; items: PlacedItem[] }) {
  const room = ROOMS[product]
  const s = Math.min((SVG_W - 16) / room.w, (SVG_H - 16) / room.d)
  const ox = 6, oy = 6
  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x={ox} y={oy} width={room.w*s} height={room.d*s} fill="rgba(232,226,213,0.25)" stroke={INK} strokeWidth="4" />
      {items.map(it => (
        <rect key={it.uid} x={ox+it.x*s} y={oy+it.y*s} width={it.width*s} height={it.entry.depth*s}
          fill={it.entry.isIsland ? '#1a1815' : '#d4c9b0'} stroke="#a99a82" strokeWidth="1.5" rx={1} />
      ))}
    </svg>
  )
}

function MiniElevSvg({ product, items }: { product: ProductMode; items: PlacedItem[] }) {
  const room = ROOMS[product]
  const wallH = room.wallH
  const wallItems = items.filter(it => it.y < 700)
  const s = Math.min((SVG_W - 16) / room.w, (SVG_H - 20) / wallH)
  const ox = 6, baseY = SVG_H - 8
  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', height: '100%', display: 'block' }}>
      <line x1={ox} y1={baseY} x2={ox+room.w*s} y2={baseY} stroke={INK} strokeWidth="3" />
      {wallItems.map(it => {
        const ih = (it.entry.category === 'upper' ? 700 : it.entry.height) * s
        return <rect key={it.uid} x={ox+it.x*s} y={baseY-ih} width={it.width*s} height={ih}
          fill="#d4c9b0" stroke="#a99a82" strokeWidth="1.5" rx={1} />
      })}
    </svg>
  )
}

function MiniSideElevSvg({ product, items }: { product: ProductMode; items: PlacedItem[] }) {
  const room = ROOMS[product]
  const wallH = room.wallH
  const sideItems = items.filter(it => it.x < 700)
  const s = Math.min((SVG_W - 16) / room.d, (SVG_H - 20) / wallH)
  const ox = 6, baseY = SVG_H - 8
  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', height: '100%', display: 'block' }}>
      <line x1={ox} y1={baseY} x2={ox+room.d*s} y2={baseY} stroke={INK} strokeWidth="3" />
      {sideItems.map(it => {
        const ih = (it.entry.category === 'upper' ? 700 : it.entry.height) * s
        const iw = it.entry.depth * s
        return <rect key={it.uid} x={ox+it.y*s} y={baseY-ih} width={iw} height={ih}
          fill="#d4c9b0" stroke="#a99a82" strokeWidth="1.5" rx={1} />
      })}
    </svg>
  )
}

// ── Catalog Panel ─────────────────────────────────────────────────
function CatalogPanel({
  product, dragEntry, onDragStart, onDragEnd,
}: {
  product: ProductMode
  dragEntry: CatalogEntry | null
  onDragStart: (e: React.DragEvent, entry: CatalogEntry) => void
  onDragEnd: () => void
}) {
  const [filter, setFilter] = useState<FilterTab>('All')
  const [search, setSearch] = useState('')

  // Reset filter when product changes
  useEffect(() => { setFilter('All'); setSearch('') }, [product])

  const catalog = CATALOGS[product]
  const tabs = FILTER_TABS[product]
  const meta = CATALOG_META[product]

  const filtered = catalog.filter(e => {
    const matchTab = filter === 'All' || e.filterTag === filter
    const matchSearch = search === '' ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.code.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const sections = [...new Set(filtered.map(e => e.sectionLabel))]

  const formatPrice = (p: number) => `₹ ${(p / 100).toLocaleString('en-IN')}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '20px 18px 0' }}>
        {/* Eyebrow brand label */}
        <div style={{
          fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: ACCENT, fontWeight: 700, marginBottom: 10,
        }}>
          {meta.eyebrow}
        </div>

        {/* Heading — supports optional bold-italic second line */}
        <div style={{
          fontFamily: '"Fraunces", serif', letterSpacing: '-0.025em',
          lineHeight: 1.08, marginBottom: meta.subtitle ? 10 : 14,
        }}>
          <span style={{ fontSize: 24, fontWeight: 400, color: INK, display: 'block' }}>
            {meta.heading}
          </span>
          {meta.headingItalic && (
            <span style={{
              fontSize: 24, fontWeight: 700, fontStyle: 'italic',
              color: INK, display: 'block',
            }}>
              {meta.headingItalic}
            </span>
          )}
        </div>

        {/* Subtitle */}
        {meta.subtitle && (
          <p style={{
            fontSize: 12, color: MUTE, lineHeight: 1.55,
            marginBottom: 14, marginTop: 0,
          }}>
            {meta.subtitle}
          </p>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setFilter(tab)} style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
              border: `1.5px solid ${tab === filter ? INK : 'rgba(26,24,21,0.2)'}`,
              background: tab === filter ? INK : 'transparent',
              color: tab === filter ? PAPER : '#4a463f',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>{tab}</button>
          ))}
        </div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: BG, borderRadius: 8, padding: '8px 12px',
          border: `1px solid ${LINE}`, marginBottom: 14,
        }}>
          <span style={{ fontSize: 13, opacity: 0.4 }}>⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${catalog.length} items...`}
            style={{
              flex: 1, border: 'none', background: 'transparent',
              fontFamily: 'inherit', fontSize: 12, color: INK, outline: 'none',
            }}
          />
          <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: MUTE, background: LINE, padding: '2px 5px', borderRadius: 4 }}>⌘K</span>
        </div>
      </div>

      {/* Items list */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
        {sections.map(section => (
          <div key={section}>
            <div style={{
              padding: '8px 16px 6px', fontSize: 9.5, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: MUTE, fontWeight: 700,
            }}>
              {section}
            </div>
            {filtered.filter(e => e.sectionLabel === section).map(entry => {
              const isDragging = dragEntry?.id === entry.id
              return (
                <div
                  key={entry.id}
                  draggable
                  onDragStart={e => onDragStart(e, entry)}
                  onDragEnd={onDragEnd}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 16px', cursor: 'grab',
                    background: isDragging ? 'rgba(201,100,66,0.04)' : 'transparent',
                    border: isDragging ? `1px dashed ${ACCENT}` : '1px solid transparent',
                    borderRadius: isDragging ? 8 : 0,
                    margin: isDragging ? '0 8px' : 0,
                    transition: 'background 100ms',
                  }}
                >
                  {/* Width badge */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 8, flexShrink: 0,
                    background: entry.color || '#d4c9b0',
                    border: `1px solid ${LINE}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                    color: entry.isIsland ? 'rgba(255,255,255,0.55)' : 'rgba(26,24,21,0.55)',
                    fontWeight: 600,
                  }}>
                    {entry.width >= 1000 ? entry.width : entry.width}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 2 }}>
                      {entry.name}
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: ACCENT }}>{entry.code}</span>
                      <span style={{ fontSize: 10, color: MUTE }}>· {formatPrice(entry.price)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: MUTE, fontSize: 13 }}>
            No items match "{search}"
          </div>
        )}
      </div>
    </div>
  )
}

// ── Properties Panel ──────────────────────────────────────────────
function PropertiesPanel({
  selectedItem, placedItems, product, onUpdate, onDelete, onNavigate, onSave,
}: {
  selectedItem: PlacedItem | null
  placedItems: PlacedItem[]
  product: ProductMode
  onUpdate: (patch: Partial<PlacedItem>) => void
  onDelete: () => void
  onNavigate: () => void
  onSave: () => void
}) {
  const formatPrice = (p: number) => `₹ ${(p / 100).toLocaleString('en-IN')}`

  // BOM by category
  const bomByCategory = useMemo(() => {
    const map = new Map<string, { label: string; qty: number; total: number }>()
    const catLabel: Record<string, string> = {
      base: 'Base cabinets', upper: 'Wall cabinets', tall: 'Tall units',
      island: 'Islands', fridge: 'Appliances', wardrobe: 'Wardrobe frames',
      desk: 'Desks', storage: 'Storage units',
    }
    placedItems.forEach(it => {
      const cat = it.entry.category
      const existing = map.get(cat)
      if (existing) { existing.qty++; existing.total += it.entry.price }
      else map.set(cat, { label: catLabel[cat] ?? cat, qty: 1, total: it.entry.price })
    })
    return Array.from(map.values())
  }, [placedItems])

  const grandTotal = bomByCategory.reduce((s, r) => s + r.total, 0)

  if (!selectedItem) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 }}>
          <div style={{ fontSize: 28, opacity: 0.12 }}>◻</div>
          <div style={{ fontSize: 12, color: MUTE, textAlign: 'center', lineHeight: 1.6 }}>
            Click any item to see<br />details and edit properties
          </div>
        </div>

        {/* BOM summary when nothing selected */}
        <div style={{ borderTop: `1px solid ${LINE}`, padding: '16px 20px' }}>
          {placedItems.length > 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: MUTE }}>LIVE COST · {placedItems.length} ITEMS</span>
                <span style={{ fontSize: 11, color: ACCENT, fontWeight: 600, cursor: 'pointer' }}>See full BOM</span>
              </div>
              {bomByCategory.map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: INK }}>{row.label}{row.qty > 1 ? ` · ${row.qty}` : ''}</span>
                  <span style={{ fontSize: 12, color: INK, fontFamily: 'JetBrains Mono, monospace' }}>{formatPrice(row.total)}</span>
                </div>
              ))}
            </>
          )}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: MUTE }}>TOTAL ESTIMATE</span>
              <span style={{ fontSize: 10, color: MUTE }}>incl. install</span>
            </div>
            <div style={{ fontFamily: '"Fraunces", serif', fontSize: 26, fontWeight: 600, color: INK, marginTop: 4 }}>
              {formatPrice(grandTotal)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={onNavigate} style={{
              flex: 1, padding: '12px', borderRadius: 8, border: 'none',
              background: INK, color: PAPER, fontWeight: 700, fontSize: 13,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>Request quote</button>
            <button onClick={onSave} style={{
              padding: '12px 18px', borderRadius: 8, border: `1.5px solid ${LINE}`,
              background: 'transparent', color: INK, fontWeight: 600, fontSize: 13,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>Save</button>
          </div>
        </div>
      </div>
    )
  }

  const it = selectedItem

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTE, fontWeight: 700, marginBottom: 6 }}>
          SELECTED
        </div>
        <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 600, color: INK, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 4 }}>
          {it.entry.name}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: MUTE }}>
          {it.entry.code} · {it.width} × {it.entry.height} × {it.entry.depth} mm
        </div>
      </div>

      {/* Props grid */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', marginBottom: 14 }}>
          {/* Width */}
          <div>
            <div style={{ fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTE, fontWeight: 700, marginBottom: 4 }}>WIDTH</div>
            <input
              type="range" min={300} max={2400} step={100} value={it.width}
              onChange={e => onUpdate({ width: +e.target.value })}
              style={{ width: '100%', accentColor: ACCENT, marginBottom: 2 }}
            />
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: INK }}>{it.width} mm</div>
          </div>
          {/* Height */}
          <div>
            <div style={{ fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTE, fontWeight: 700, marginBottom: 4 }}>HEIGHT</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: INK, marginTop: 6 }}>{(it.entry.height / 1000).toFixed(1).replace('.', ',')} mm</div>
            <div style={{ fontSize: 10, color: MUTE }}>{it.entry.height >= 2000 ? 'Full height' : 'Standard'}</div>
          </div>
          {/* Finish — surface laminate (customer selects colour) */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTE, fontWeight: 700, marginBottom: 8 }}>SURFACE FINISH</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {FINISHES.map(f => (
                <button key={f} onClick={() => onUpdate({ finish: f })} style={{
                  padding: '5px 12px', borderRadius: 20, border: `1.5px solid`,
                  borderColor: it.finish === f ? INK : LINE,
                  background: it.finish === f ? INK : 'transparent',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  color: it.finish === f ? PAPER : MUTE,
                  fontFamily: 'inherit',
                }}>{f}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Position inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
          <div>
            <div style={{ fontSize: 9.5, color: MUTE, marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>X (mm)</div>
            <input type="number" value={it.x} step={100}
              onChange={e => onUpdate({ x: +e.target.value })}
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: 6, border: `1px solid ${LINE}`, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: INK, background: BG }} />
          </div>
          <div>
            <div style={{ fontSize: 9.5, color: MUTE, marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Y (mm)</div>
            <input type="number" value={it.y} step={100}
              onChange={e => onUpdate({ y: +e.target.value })}
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: 6, border: `1px solid ${LINE}`, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: INK, background: BG }} />
          </div>
        </div>
      </div>

      {/* Material specification — auto-assigned, read-only */}
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTE, fontWeight: 700, marginBottom: 10 }}>MATERIAL SPECIFICATION</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {getMaterialSpecs(it.entry, product).map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 11, color: MUTE }}>{s.label}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 600, color: INK }}>{s.spec}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4, paddingTop: 8, borderTop: `1px solid ${LINE}` }}>
            <span style={{ fontSize: 11, color: MUTE }}>Hardware</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 600, color: INK }}>{getAutoHardware(it.entry)}</span>
          </div>
        </div>
      </div>

      {/* Live BOM */}
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', color: MUTE }}>LIVE COST · {placedItems.length} ITEMS</span>
          <span style={{ fontSize: 11, color: ACCENT, fontWeight: 600, cursor: 'pointer' }}>See full BOM</span>
        </div>
        {bomByCategory.map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <span style={{ fontSize: 12.5, color: INK }}>{row.label}{row.qty > 1 ? ` · ${row.qty}` : ''}</span>
            <span style={{ fontSize: 12.5, color: INK, fontFamily: 'JetBrains Mono, monospace' }}>{formatPrice(row.total)}</span>
          </div>
        ))}
      </div>

      {/* Total + CTA */}
      <div style={{ padding: '14px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', color: MUTE }}>TOTAL ESTIMATE</span>
          <span style={{ fontSize: 10, color: MUTE }}>incl. install</span>
        </div>
        <div style={{ fontFamily: '"Fraunces", serif', fontSize: 28, fontWeight: 600, color: INK, marginTop: 4, marginBottom: 14 }}>
          {formatPrice(grandTotal)}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onNavigate} style={{
            flex: 1, padding: '13px', borderRadius: 9, border: 'none',
            background: INK, color: PAPER, fontWeight: 700, fontSize: 13,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Request quote</button>
          <button style={{
            padding: '13px 18px', borderRadius: 9, border: `1.5px solid ${LINE}`,
            background: 'transparent', color: INK, fontWeight: 600, fontSize: 13,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Save</button>
        </div>
        <button onClick={onDelete} style={{
          width: '100%', marginTop: 8, padding: '9px', borderRadius: 8,
          border: `1px solid rgba(201,100,66,0.3)`,
          background: 'transparent', color: ACCENT, fontWeight: 600, fontSize: 12,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>Remove item</button>
      </div>
    </div>
  )
}

// ── Project Setup Dialog ──────────────────────────────────────────
interface ProjectSetupDialogProps {
  initialProduct: ProductMode
  onStart: (info: ProjectInfo, product: ProductMode) => void
  savedProjects: SavedProject[]
  onLoad: (project: SavedProject) => void
}

const HOME_TYPES: HomeType[] = ['1BHK', '2BHK', '3BHK', '4BHK+', 'Villa', 'Office', 'Custom']

function ProjectSetupDialog({ initialProduct, onStart, savedProjects, onLoad }: ProjectSetupDialogProps) {
  const [tab, setTab] = useState<'new' | 'load'>('new')
  const [name, setName] = useState('')
  const [homeType, setHomeType] = useState<HomeType>('2BHK')
  const [product, setProduct] = useState<ProductMode>(
    initialProduct === 'office' ? 'office' : initialProduct
  )

  // Derive which products are available for this home type
  const allowedProducts: ProductMode[] = homeType === 'Office'
    ? ['office']
    : homeType === 'Custom'
      ? ['kitchen', 'wardrobe', 'office']
      : ['kitchen', 'wardrobe']

  // Auto-correct product selection when home type changes
  const handleHomeTypeChange = (ht: HomeType) => {
    setHomeType(ht)
    if (ht === 'Office') setProduct('office')
    else if (product === 'office' && ht !== 'Custom') setProduct('kitchen')
  }

  const handleStart = () => {
    const info: ProjectInfo = {
      id: `proj-${Date.now()}`,
      name: name.trim() || `${homeType} ${product.charAt(0).toUpperCase() + product.slice(1)}`,
      homeType,
      product,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    onStart(info, product)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(26,24,21,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: PAPER, borderRadius: 14, width: '100%', maxWidth: 520,
        boxShadow: '0 40px 80px rgba(26,24,21,0.3)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '28px 32px 0' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: ACCENT, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
            KREOBOX PLANNER
          </div>
          <div style={{ fontFamily: '"Fraunces", serif', fontSize: 26, fontWeight: 400, color: INK, marginBottom: 20, lineHeight: 1.15 }}>
            Start a new project,<br /><em style={{ fontStyle: 'italic', fontWeight: 600 }}>or pick up where you left off.</em>
          </div>

          {/* Tab switcher */}
          <div style={{ display: 'flex', background: 'rgba(26,24,21,0.06)', borderRadius: 8, padding: 3, marginBottom: 24 }}>
            {(['new', 'load'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '8px', borderRadius: 6, border: 'none',
                background: tab === t ? PAPER : 'transparent',
                color: tab === t ? INK : MUTE,
                fontFamily: '"Inter Tight", sans-serif', fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
                boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}>
                {t === 'new' ? 'New project' : `Saved projects (${savedProjects.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* New project form */}
        {tab === 'new' && (
          <div style={{ padding: '0 32px 32px' }}>
            {/* Project name */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTE, fontWeight: 700, marginBottom: 6 }}>
                Project name (optional)
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={`${homeType} ${product.charAt(0).toUpperCase() + product.slice(1)}`}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '10px 12px', border: `1px solid ${LINE2}`, borderRadius: 8,
                  fontFamily: '"Inter Tight", sans-serif', fontSize: 14, color: INK,
                  background: BG, outline: 'none',
                }}
              />
            </div>

            {/* Home type */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTE, fontWeight: 700, marginBottom: 8 }}>
                Home type
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {HOME_TYPES.map(ht => (
                  <button key={ht} onClick={() => handleHomeTypeChange(ht)} style={{
                    padding: '8px 16px', borderRadius: 20,
                    border: `1.5px solid ${homeType === ht ? INK : LINE2}`,
                    background: homeType === ht ? INK : 'transparent',
                    color: homeType === ht ? PAPER : INK,
                    fontFamily: '"Inter Tight", sans-serif', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer',
                  }}>{ht}</button>
                ))}
              </div>
            </div>

            {/* Room to plan */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTE, fontWeight: 700, marginBottom: 8 }}>
                What would you like to plan?
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['kitchen', 'wardrobe', 'office'] as ProductMode[]).map(p => {
                  const allowed = allowedProducts.includes(p)
                  const active  = product === p
                  return (
                    <button key={p}
                      onClick={() => allowed && setProduct(p)}
                      disabled={!allowed}
                      style={{
                        flex: 1, padding: '10px 8px', borderRadius: 8,
                        border: `1.5px solid ${active ? ACCENT : allowed ? LINE2 : 'rgba(26,24,21,0.08)'}`,
                        background: active ? `${ACCENT}10` : 'transparent',
                        color: active ? ACCENT : allowed ? MUTE : 'rgba(26,24,21,0.25)',
                        fontFamily: '"Inter Tight", sans-serif', fontSize: 13, fontWeight: 600,
                        cursor: allowed ? 'pointer' : 'not-allowed',
                        textTransform: 'capitalize',
                        position: 'relative',
                      }}
                    >
                      {p}
                      {!allowed && (
                        <div style={{ fontSize: 9, fontWeight: 400, marginTop: 2, letterSpacing: '0.06em', textTransform: 'none' }}>
                          {p === 'office' ? 'select "Office" type' : 'select a home type'}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              onClick={handleStart}
              style={{
                width: '100%', padding: '14px', borderRadius: 9, border: 'none',
                background: INK, color: PAPER,
                fontFamily: '"Inter Tight", sans-serif', fontSize: 14, fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Start planning →
            </button>
          </div>
        )}

        {/* Load saved */}
        {tab === 'load' && (
          <div style={{ padding: '0 32px 32px', maxHeight: 360, overflowY: 'auto' }}>
            {savedProjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: MUTE, fontSize: 13 }}>
                No saved projects yet.
              </div>
            ) : savedProjects.map(proj => (
              <button
                key={proj.info.id}
                onClick={() => onLoad(proj)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', marginBottom: 8, borderRadius: 10,
                  border: `1px solid ${LINE2}`, background: BG, cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontFamily: '"Inter Tight", sans-serif', fontSize: 14, fontWeight: 600, color: INK, marginBottom: 3 }}>
                    {proj.info.name}
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: MUTE }}>
                    {proj.info.homeType} · {proj.info.product} · {proj.placedItems.length} items
                  </div>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: MUTE, textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  {new Date(proj.info.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── BOM Checkout Modal ────────────────────────────────────────────
interface BOMModalProps {
  items: PlacedItem[]
  product: ProductMode
  onClose: () => void
  onConfirm: (name: string, phone: string, city: string) => void
}

function BOMModal({ items, product, onClose, onConfirm }: BOMModalProps) {
  const [step, setStep] = useState<'review' | 'bom' | 'form' | 'done'>('review')
  const [form, setForm] = useState({ name: '', phone: '', city: 'Bengaluru', area: '' })
  const [submitting, setSubmitting] = useState(false)

  const formatPrice = (p: number) => `₹ ${(p / 100).toLocaleString('en-IN')}`

  const subtotal = items.reduce((s, it) => s + it.entry.price, 0)
  const install  = Math.round(subtotal * 0.12)
  const gst      = Math.round((subtotal + install) * 0.18)
  const total    = subtotal + install + gst
  const advance  = Math.round(total * 0.35)

  const catLabel: Record<string, string> = {
    base:'Base cabinets', upper:'Wall cabinets', tall:'Tall units',
    island:'Islands', fridge:'Appliances', wardrobe:'Wardrobe frames',
    desk:'Desks', storage:'Storage', 'l-desk':'Desks',
  }

  const byCategory = items.reduce((acc, it) => {
    const cat = catLabel[it.entry.category] ?? it.entry.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(it)
    return acc
  }, {} as Record<string, PlacedItem[]>)

  const formOk = form.name.trim() && form.phone.trim() && form.area.trim()

  const handleSubmit = () => {
    if (!formOk) return
    setSubmitting(true)
    setTimeout(() => { setStep('done'); setSubmitting(false) }, 1000)
    onConfirm(form.name, form.phone, form.city)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(26,24,21,0.55)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={step !== 'done' ? onClose : undefined}>
      <div onClick={e => e.stopPropagation()} style={{
        background: PAPER, borderRadius: 12, overflow: 'hidden',
        width: '100%', maxWidth: 820, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 40px 80px rgba(26,24,21,0.25)',
      }}>

        {/* ── Step: Design review ── */}
        {step === 'review' && (
          <>
            <div style={{ padding: '18px 24px 14px', borderBottom: `1px solid ${LINE}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <div style={{ fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 600, color: INK }}>Design Review</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: MUTE, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {items.length} items · {product}
                </div>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: MUTE, padding: 4 }}>✕</button>
            </div>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 300px', overflow: 'hidden', minHeight: 0 }}>
              {/* Left: 3D view + 3 mini 2D views */}
              <div style={{ padding: '16px 16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden', borderRight: `1px solid ${LINE}` }}>
                {/* 3D perspective view */}
                <div style={{ flex: 1, border: `1px solid ${LINE}`, borderRadius: 8, overflow: 'hidden', background: BG, minHeight: 180 }}>
                  <PerspView3D product={product} items={items} selectedUid={null} />
                </div>
                {/* 3 mini 2D views */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, height: 110, flexShrink: 0 }}>
                  {[
                    { label: 'TOP PLAN',   Comp: MiniPlanSvg },
                    { label: 'FRONT ELEV', Comp: MiniElevSvg },
                    { label: 'SIDE ELEV',  Comp: MiniSideElevSvg },
                  ].map(({ label, Comp }) => (
                    <div key={label} style={{ position: 'relative', border: `1px solid ${LINE}`, borderRadius: 6, overflow: 'hidden', background: BG }}>
                      <Comp product={product} items={items} />
                      <div style={{ position: 'absolute', bottom: 4, left: 6, fontSize: 7, fontFamily: 'JetBrains Mono, monospace', color: MUTE, letterSpacing: '0.08em' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: design checks + cost summary */}
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
                <div style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTE, fontWeight: 700 }}>DESIGN VALIDATION</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {validateDesign(items, product).map((chk, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                        background: chk.status === 'ok' ? '#1f8a5b' : chk.status === 'warn' ? ACCENT : '#5b8a8a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, color: 'white', fontWeight: 700, lineHeight: 1,
                      }}>
                        {chk.status === 'ok' ? '✓' : chk.status === 'warn' ? '!' : 'i'}
                      </div>
                      <span style={{ fontSize: 12, color: INK, lineHeight: 1.45 }}>{chk.message}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'auto', borderTop: `1px solid ${LINE}`, paddingTop: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', rowGap: 6, columnGap: 10, marginBottom: 10 }}>
                    {[
                      { label: 'Materials', value: subtotal },
                      { label: 'Installation', value: install },
                      { label: 'GST @ 18%', value: gst },
                    ].map(r => (
                      <div key={r.label} style={{ display: 'contents' }}>
                        <span style={{ fontSize: 11, color: MUTE }}>{r.label}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: INK, textAlign: 'right' }}>{formatPrice(r.value)}</span>
                      </div>
                    ))}
                    <div style={{ gridColumn: '1/-1', borderTop: `1px solid ${LINE}`, margin: '2px 0' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>Total</span>
                    <span style={{ fontFamily: '"Fraunces", serif', fontSize: 16, fontWeight: 600, color: INK, textAlign: 'right' }}>{formatPrice(total)}</span>
                    <span style={{ fontSize: 10, color: MUTE }}>35% advance</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: ACCENT, textAlign: 'right' }}>{formatPrice(advance)}</span>
                  </div>
                  <button onClick={() => setStep('bom')} style={{
                    width: '100%', padding: '12px', borderRadius: 8, border: 'none',
                    background: INK, color: PAPER, fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>View full BOM →</button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Step: BOM detail ── */}
        {step === 'bom' && (
          <>
            <div style={{ padding: '22px 28px 16px', borderBottom: `1px solid ${LINE}`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 600, color: INK }}>
                  Bill of Materials
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: MUTE, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {items.length} items · {product}
                </div>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: MUTE, padding: 4 }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px' }}>
              {/* Items grouped by category */}
              {Object.entries(byCategory).map(([cat, catItems]) => (
                <div key={cat} style={{ paddingTop: 20, paddingBottom: 4 }}>
                  <div style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTE, fontWeight: 700, marginBottom: 10 }}>
                    {cat}
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                        {['Code', 'Name', 'Dimensions', 'Substrate', 'Finish', 'Hardware', 'Unit price'].map(h => (
                          <th key={h} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTE, fontWeight: 600, textAlign: 'left', padding: '4px 8px 8px 0' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {catItems.map(it => (
                        <tr key={it.uid} style={{ borderBottom: `1px solid ${LINE}` }}>
                          <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: ACCENT, padding: '10px 8px 10px 0', whiteSpace: 'nowrap' }}>{it.entry.code}</td>
                          <td style={{ fontWeight: 600, color: INK, padding: '10px 8px 10px 0' }}>{it.entry.name}</td>
                          <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: MUTE, padding: '10px 8px 10px 0', whiteSpace: 'nowrap' }}>{it.width} × {it.entry.height} × {it.entry.depth}</td>
                          <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: MUTE, padding: '10px 8px 10px 0' }}>{getMaterialSpecs(it.entry, product)[0]?.spec ?? '—'}</td>
                          <td style={{ fontSize: 11, color: MUTE, padding: '10px 8px 10px 0' }}>{it.finish}</td>
                          <td style={{ fontSize: 10, color: MUTE, padding: '10px 8px 10px 0' }}>{getAutoHardware(it.entry)}</td>
                          <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600, color: INK, padding: '10px 0 10px 0', textAlign: 'right', whiteSpace: 'nowrap' }}>{formatPrice(it.entry.price)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={5} style={{ fontWeight: 600, fontSize: 12, padding: '10px 0', textAlign: 'right', color: MUTE }}>Subtotal</td>
                        <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: INK, textAlign: 'right', paddingTop: 10 }}>
                          {formatPrice(catItems.reduce((s, it) => s + it.entry.price, 0))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}

              {/* Cost summary */}
              <div style={{ borderTop: `2px solid ${LINE}`, marginTop: 20, padding: '20px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px 40px', maxWidth: 360, marginLeft: 'auto' }}>
                  {[
                    { label: 'Materials & hardware', value: subtotal },
                    { label: 'Installation (est.)', value: install },
                    { label: 'GST @ 18%', value: gst },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'contents' }}>
                      <span style={{ fontSize: 12, color: MUTE }}>{r.label}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: INK, textAlign: 'right' }}>{formatPrice(r.value)}</span>
                    </div>
                  ))}
                  <div style={{ gridColumn: '1 / -1', borderTop: `1px solid ${LINE}`, margin: '6px 0' }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: INK }}>Total</span>
                  <span style={{ fontFamily: '"Fraunces", serif', fontSize: 18, fontWeight: 600, color: INK, textAlign: 'right' }}>{formatPrice(total)}</span>
                  <span style={{ fontSize: 11, color: MUTE }}>35% advance to book</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: ACCENT, textAlign: 'right' }}>{formatPrice(advance)}</span>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 28px 20px', borderTop: `1px solid ${LINE}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setStep('review')} style={{ padding: '11px 20px', borderRadius: 8, border: `1.5px solid ${LINE}`, background: 'transparent', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: INK }}>
                ← Review
              </button>
              <button onClick={() => setStep('form')} style={{ padding: '11px 24px', borderRadius: 8, border: 'none', background: INK, color: PAPER, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Confirm quote →
              </button>
            </div>
          </>
        )}

        {/* ── Step: Contact form ── */}
        {step === 'form' && (
          <div style={{ padding: '36px 40px', maxWidth: 440, margin: '0 auto', width: '100%' }}>
            <div style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTE, fontWeight: 700, marginBottom: 8 }}>Your details</div>
            <div style={{ fontFamily: '"Fraunces", serif', fontSize: 24, fontWeight: 600, color: INK, marginBottom: 4 }}>Book your project</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: MUTE, marginBottom: 24 }}>
              {items.length} items · Total {formatPrice(total)} · Advance {formatPrice(advance)}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Your name', key: 'name' as const, ph: 'Name or company' },
                { label: 'Phone / WhatsApp', key: 'phone' as const, ph: '+91 9XXXXX XXXX' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTE, fontWeight: 700, marginBottom: 6 }}>{f.label}</label>
                  <input value={form[f.key]} placeholder={f.ph}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: `1px solid ${LINE2}`, borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#fff', color: INK, outline: 'none' }} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[{ label: 'City', key: 'city' as const }, { label: 'Area / Locality', key: 'area' as const, ph: 'Koramangala' }].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTE, fontWeight: 700, marginBottom: 6 }}>{f.label}</label>
                    <input value={form[f.key]} placeholder={(f as {ph?:string}).ph}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: `1px solid ${LINE2}`, borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#fff', color: INK, outline: 'none' }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 16, padding: '12px 16px', borderLeft: `3px solid ${ACCENT}`, background: `${ACCENT}08`, borderRadius: '0 8px 8px 0', fontSize: 12, color: MUTE }}>
              <strong style={{ color: INK }}>35% advance</strong> · {formatPrice(advance)} now<br />
              Balance {formatPrice(total - advance)} on dispatch
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setStep('bom')} style={{ padding: '11px 16px', borderRadius: 8, border: `1.5px solid ${LINE}`, background: 'transparent', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: INK }}>← Back</button>
              <button onClick={handleSubmit} disabled={!formOk || submitting} style={{
                flex: 1, padding: '12px', borderRadius: 8, border: 'none',
                background: formOk ? ACCENT : 'rgba(26,24,21,0.12)',
                color: formOk ? '#fff' : MUTE,
                fontWeight: 700, fontSize: 13, cursor: formOk ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
              }}>
                {submitting ? 'Processing…' : `Pay ${formatPrice(advance)} advance →`}
              </button>
            </div>
          </div>
        )}

        {/* ── Step: Confirmation ── */}
        {step === 'done' && (
          <div style={{ padding: '48px 40px', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, margin: '0 auto 18px', borderRadius: '50%', background: '#1f8a5b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ fontFamily: '"Fraunces", serif', fontSize: 26, fontWeight: 600, color: INK, marginBottom: 8 }}>Quote confirmed.</div>
            <div style={{ fontSize: 13, color: MUTE, lineHeight: 1.6, maxWidth: 360, margin: '0 auto 20px' }}>
              Your project is in the system. Our team will call within 24 hours to schedule a site visit.
            </div>
            <div style={{ display: 'inline-block', padding: '8px 20px', background: BG, borderRadius: 6, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: MUTE, marginBottom: 24 }}>
              Order ref: KBX-{Math.floor(2000 + Math.random() * 8000)}
            </div>
            <div style={{ padding: '16px 20px', background: BG, borderRadius: 8, textAlign: 'left', fontSize: 12, color: MUTE, marginBottom: 24 }}>
              <div style={{ fontWeight: 700, color: INK, marginBottom: 8 }}>What happens next</div>
              <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 2 }}>
                <li>Space measurement visit within 48 hours</li>
                <li>Final layout confirmed in Planner</li>
                <li>Pre-cut panels dispatched in 24–48 hours</li>
                <li>Professional install in 3–4 hours — clean site, no carpentry dust</li>
              </ol>
            </div>
            <button onClick={onClose} style={{ padding: '11px 28px', borderRadius: 8, border: 'none', background: INK, color: PAPER, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              Back to planner
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const LINE2 = 'rgba(26,24,21,0.18)'

// ── Main PlannerPage ──────────────────────────────────────────────
export default function PlannerPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const navState  = (location.state ?? {}) as { product?: ProductMode }

  const initialProduct: ProductMode = (navState.product as ProductMode) ?? 'kitchen'

  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null)
  const [showSetup, setShowSetup]     = useState(true)
  const [product, setProduct] = useState<ProductMode>(initialProduct)
  const [view, setView]       = useState<ViewMode>('2D plan')
  const [zoom, setZoom]       = useState(1)
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([])
  const [selectedUid, setSelectedUid] = useState<string | null>(null)
  const [dragEntry, setDragEntry]     = useState<CatalogEntry | null>(null)
  const [dragOverPos, setDragOverPos] = useState<{ x: number; y: number } | null>(null)
  const [showBOM, setShowBOM] = useState(false)
  const [saveToast, setSaveToast] = useState(false)

  const savedProjects = loadSavedProjects()

  const handleProjectStart = (info: ProjectInfo, prod: ProductMode) => {
    setProjectInfo(info)
    setProduct(prod)
    setPlacedItems([])
    setSelectedUid(null)
    setShowSetup(false)
  }

  const handleLoadProject = (proj: SavedProject) => {
    setProjectInfo(proj.info)
    setProduct(proj.info.product)
    setPlacedItems(proj.placedItems)
    setSelectedUid(null)
    setShowSetup(false)
  }

  const handleSave = () => {
    if (!projectInfo) return
    const updated = { ...projectInfo, updatedAt: Date.now() }
    setProjectInfo(updated)
    saveProject({ info: updated, placedItems })
    setSaveToast(true)
    setTimeout(() => setSaveToast(false), 2000)
  }

  const selectedItem = placedItems.find(it => it.uid === selectedUid) ?? null

  const handleProductChange = (p: ProductMode) => {
    setProduct(p); setPlacedItems([]); setSelectedUid(null)
    if (projectInfo) setProjectInfo({ ...projectInfo, product: p, updatedAt: Date.now() })
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedUid) {
        if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'SELECT') return
        setPlacedItems(prev => prev.filter(it => it.uid !== selectedUid))
        setSelectedUid(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedUid])

  const handleDrop = useCallback((entry: CatalogEntry, mmX: number, mmY: number) => {
    const uid = `item-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setPlacedItems(prev => [...prev, { uid, entry, x: mmX, y: mmY, width: entry.width, finish: FINISHES[0] }])
    setSelectedUid(uid)
    setDragOverPos(null)
    setDragEntry(null)
  }, [])

  const updateItem = useCallback((patch: Partial<PlacedItem>) => {
    if (!selectedUid) return
    setPlacedItems(prev => prev.map(it => it.uid === selectedUid ? { ...it, ...patch } : it))
  }, [selectedUid])

  const handleMoveItem = useCallback((uid: string, mmX: number, mmY: number) => {
    setPlacedItems(prev => prev.map(it => it.uid === uid ? { ...it, x: mmX, y: mmY } : it))
  }, [])

  const handleCatalogDragStart = (e: React.DragEvent, entry: CatalogEntry) => {
    setDragEntry(entry)
    e.dataTransfer.setData('catalog-id', entry.id)
  }

  const grandTotal = useMemo(() =>
    placedItems.reduce((s, it) => s + it.entry.price, 0),
    [placedItems]
  )
  const formatPrice = (p: number) => `₹${(p / 100).toLocaleString('en-IN')}`

  return (
    <div style={{
      width: '100vw', height: '100vh', background: BG,
      fontFamily: '"Inter Tight", sans-serif',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div style={{
        height: 52, borderBottom: `1px solid ${LINE}`,
        display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px',
        background: PAPER, flexShrink: 0,
      }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: 0 }}>
          <KreoboxLogo size={20} />
          <span style={{ fontFamily: '"Fraunces", serif', fontSize: 15, fontWeight: 600, color: INK, letterSpacing: '-0.02em' }}>Kreobox</span>
        </button>
        <div style={{ width: 1, height: 20, background: LINE }} />
        <ProductSwitch active={product} onChange={handleProductChange} />
        <div style={{ flex: 1 }} />
        <ViewToggle active={view} onChange={setView} />
        <div style={{ width: 1, height: 20, background: LINE }} />
        {/* Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={() => setZoom(z => Math.max(0.5, +(z-0.25).toFixed(2)))} style={btnSm}>−</button>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: MUTE, minWidth: 38, textAlign: 'center' }}>{Math.round(zoom*100)}%</span>
          <button onClick={() => setZoom(z => Math.min(3, +(z+0.25).toFixed(2)))} style={btnSm}>+</button>
        </div>
        <button
          onClick={() => { setPlacedItems([]); setSelectedUid(null); setShowSetup(true) }}
          style={{ ...btnSm, color: MUTE }}
          title="New project"
        >↺</button>
        {projectInfo && (
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: MUTE, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {projectInfo.name}
          </span>
        )}
        <button onClick={() => navigate('/')} style={{ ...btnSm, color: MUTE, fontSize: 11, width: 'auto', padding: '0 10px' }}>← Home</button>
        <button
          onClick={() => placedItems.length > 0 && setShowBOM(true)}
          style={{
            padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: placedItems.length > 0 ? 'pointer' : 'not-allowed',
            background: placedItems.length > 0 ? INK : 'rgba(26,24,21,0.15)',
            color: placedItems.length > 0 ? PAPER : MUTE,
            border: 'none', fontFamily: 'inherit',
          }}>
          Get quote · {placedItems.length} items
        </button>
      </div>

      {/* ── 3-panel body ────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Left: catalog */}
        <div style={{ width: 280, borderRight: `1px solid ${LINE}`, background: PAPER, flexShrink: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <CatalogPanel
            product={product}
            dragEntry={dragEntry}
            onDragStart={handleCatalogDragStart}
            onDragEnd={() => setDragEntry(null)}
          />
        </div>

        {/* Center: canvas */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: BG }}>
            {view === '2D plan' && (
              <Plan2D
                product={product} items={placedItems} selectedUid={selectedUid}
                zoom={zoom} dragOverPos={dragOverPos} ghostEntry={dragEntry}
                onSelect={setSelectedUid} onDrop={handleDrop}
                onDragOver={(x,y) => setDragOverPos({x,y})}
                onDragLeave={() => setDragOverPos(null)}
                onMoveItem={handleMoveItem}
              />
            )}
            {view === 'Elevation' && <ElevationView product={product} items={placedItems} />}
            {view === '3D view' && <PerspView3D product={product} items={placedItems} selectedUid={selectedUid} />}
            {placedItems.length === 0 && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: 32, opacity: 0.15 }}>⬡</div>
                <div style={{ fontSize: 13, color: MUTE, marginTop: 8 }}>Drag items from the catalog to start</div>
              </div>
            )}
          </div>

          {/* BOM strip */}
          <div style={{ height: 48, borderTop: `1px solid ${LINE}`, background: PAPER, display: 'flex', alignItems: 'center', overflowX: 'auto', flexShrink: 0 }}>
            <div style={{ padding: '0 16px', borderRight: `1px solid ${LINE}`, whiteSpace: 'nowrap', height: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: '"Fraunces", serif', fontSize: 14, fontWeight: 600, color: INK }}>{formatPrice(grandTotal)}</span>
              <span style={{ fontSize: 10, color: MUTE }}>{placedItems.length} items</span>
            </div>
            {placedItems.map(item => (
              <div key={item.uid} onClick={() => setSelectedUid(item.uid)}
                style={{
                  padding: '0 12px', borderRight: `1px solid ${LINE}`,
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  whiteSpace: 'nowrap', height: '100%', cursor: 'pointer',
                  background: item.uid === selectedUid ? `${ACCENT}0A` : 'transparent',
                  transition: 'background 100ms',
                }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: item.uid === selectedUid ? ACCENT : MUTE }}>{item.entry.code}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: INK }}>{formatPrice(item.entry.price)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: properties */}
        <div style={{ width: 280, borderLeft: `1px solid ${LINE}`, background: PAPER, flexShrink: 0, overflow: 'hidden' }}>
          <PropertiesPanel
            selectedItem={selectedItem}
            placedItems={placedItems}
            product={product}
            onUpdate={updateItem}
            onDelete={() => { setPlacedItems(prev => prev.filter(it => it.uid !== selectedUid)); setSelectedUid(null) }}
            onNavigate={() => setShowBOM(true)}
            onSave={handleSave}
          />
        </div>
      </div>

      {/* BOM modal */}
      {showBOM && (
        <BOMModal
          items={placedItems}
          product={product}
          onClose={() => setShowBOM(false)}
          onConfirm={(name, phone, city) => {
            console.log('Quote confirmed', { name, phone, city, items: placedItems.length })
          }}
        />
      )}

      {/* Project setup dialog */}
      {showSetup && (
        <ProjectSetupDialog
          initialProduct={initialProduct}
          savedProjects={savedProjects}
          onStart={handleProjectStart}
          onLoad={handleLoadProject}
        />
      )}

      {/* Save toast */}
      {saveToast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: INK, color: PAPER, borderRadius: 8,
          padding: '10px 20px', fontSize: 13, fontWeight: 600,
          fontFamily: '"Inter Tight", sans-serif',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: '#4ade80' }}>✓</span> Project saved
        </div>
      )}
    </div>
  )
}

const btnSm: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 6, border: `1px solid ${LINE}`,
  background: 'transparent', cursor: 'pointer', fontSize: 14, color: INK,
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
}
