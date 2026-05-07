import type { KBOrder, KBInventory, OrderPanel, ProductType } from '../types/kreobox'

/* ── Frame catalog ── */
interface CatalogFrame {
  id: string
  type?: string
  w: number
  h: number
  d: number
  price: number
}

interface CatalogPreset {
  id: string
  label: string
  desc?: string
  scope?: string
  price: number
}

interface CatalogCategory {
  label: string
  frames: CatalogFrame[]
  presets: CatalogPreset[]
}

export const CATALOG: Record<string, CatalogCategory> = {
  wardrobe: {
    label: 'Wardrobe',
    frames: [
      { id: 'W-450-2100', w: 450, h: 2100, d: 600, price: 4800 },
      { id: 'W-600-2100', w: 600, h: 2100, d: 600, price: 5800 },
      { id: 'W-750-2100', w: 750, h: 2100, d: 600, price: 6800 },
      { id: 'W-900-2100', w: 900, h: 2100, d: 600, price: 7800 },
      { id: 'W-450-2400', w: 450, h: 2400, d: 600, price: 5400 },
      { id: 'W-600-2400', w: 600, h: 2400, d: 600, price: 6600 },
      { id: 'W-750-2400', w: 750, h: 2400, d: 600, price: 7600 },
      { id: 'W-900-2400', w: 900, h: 2400, d: 600, price: 8800 },
    ],
    presets: [
      { id: 'WP-1', label: 'All hangers',     desc: 'Single rod + top shelf',        price: 1200 },
      { id: 'WP-2', label: 'Drawers + hangers',desc: '3 drawers below, rod above',   price: 4800 },
      { id: 'WP-3', label: 'Shelves only',    desc: '5 adjustable shelves',           price: 1800 },
      { id: 'WP-4', label: 'Mixed',           desc: 'Drawers, shelves, rod',          price: 5200 },
    ],
  },
  kitchen: {
    label: 'Kitchen',
    frames: [
      { id: 'K-B-300', type: 'base', w: 300,  h: 720,  d: 600, price: 4200 },
      { id: 'K-B-450', type: 'base', w: 450,  h: 720,  d: 600, price: 5200 },
      { id: 'K-B-600', type: 'base', w: 600,  h: 720,  d: 600, price: 6800 },
      { id: 'K-B-750', type: 'base', w: 750,  h: 720,  d: 600, price: 7800 },
      { id: 'K-B-900', type: 'base', w: 900,  h: 720,  d: 600, price: 8900 },
      { id: 'K-W-300', type: 'wall', w: 300,  h: 600,  d: 350, price: 2400 },
      { id: 'K-W-450', type: 'wall', w: 450,  h: 600,  d: 350, price: 3200 },
      { id: 'K-W-600', type: 'wall', w: 600,  h: 600,  d: 350, price: 3900 },
      { id: 'K-W-750', type: 'wall', w: 750,  h: 600,  d: 350, price: 4500 },
      { id: 'K-W-900', type: 'wall', w: 900,  h: 600,  d: 350, price: 5200 },
      { id: 'K-T-450', type: 'tall', w: 450,  h: 2100, d: 600, price: 9200 },
      { id: 'K-T-600', type: 'tall', w: 600,  h: 2100, d: 600, price: 11800 },
      { id: 'K-T-900', type: 'tall', w: 900,  h: 2100, d: 600, price: 16400 },
    ],
    presets: [
      { id: 'KP-B1', label: 'Doors + shelf',        scope: 'base', price: 800 },
      { id: 'KP-B2', label: '3 drawers',             scope: 'base', price: 4800 },
      { id: 'KP-B3', label: 'Sink unit',             scope: 'base', price: 1200 },
      { id: 'KP-B4', label: 'Hob unit (fronts only)',scope: 'base', price: 3600 },
      { id: 'KP-W1', label: 'Doors + shelf',         scope: 'wall', price: 700 },
      { id: 'KP-W2', label: 'Lift-up flap',          scope: 'wall', price: 2200 },
      { id: 'KP-T1', label: 'Pantry shelves',        scope: 'tall', price: 1800 },
      { id: 'KP-T2', label: 'Pull-out larder',       scope: 'tall', price: 6800 },
    ],
  },
}

export interface Shutter {
  id: string
  label: string
  color: string
  border: string
}

export const SHUTTERS: Shutter[] = [
  { id: 'S-WHITE',  label: 'White matte',       color: '#F5F2EC', border: '#E0DACE' },
  { id: 'S-STONE',  label: 'Stone grey',         color: '#9E9C95', border: '#7A7872' },
  { id: 'S-OAK',    label: 'Light oak',          color: '#C7A678', border: '#9D7F4F' },
  { id: 'S-WALNUT', label: 'Walnut',             color: '#5C3D26', border: '#3F2A19' },
  { id: 'S-GLOSS',  label: 'White gloss',        color: '#FFFFFF', border: '#D8D4CA' },
  { id: 'S-CHAMP',  label: 'Champagne gloss',    color: '#D9C9A8', border: '#A89673' },
  { id: 'S-MIRROR', label: 'Mirror',             color: '#D4D9DC', border: '#9AA1A4' },
]

export const SHUTTER_PRICE_PER_SQM = 1800

/* ── Showroom items ── */
export interface ShowroomItem {
  id: string
  type: ProductType
  title: string
  subtitle: string
  w: number
  h: number
  frames: string[]
  walls?: string[]
  shutter: string
  preset: string
  basePrice: number
}

export const SHOWROOM: ShowroomItem[] = [
  {
    id: 'SR-1', type: 'wardrobe', title: 'Aria 8-foot', subtitle: '3-frame wardrobe in oak',
    w: 2400, h: 2100,
    frames: ['W-750-2100', 'W-900-2100', 'W-750-2100'],
    shutter: 'S-OAK', preset: 'WP-2', basePrice: 86400,
  },
  {
    id: 'SR-2', type: 'wardrobe', title: 'Stellar 10-foot', subtitle: 'Walnut + drawers, full height',
    w: 3000, h: 2400,
    frames: ['W-900-2400', 'W-900-2400', 'W-600-2400', 'W-600-2400'],
    shutter: 'S-WALNUT', preset: 'WP-4', basePrice: 124000,
  },
  {
    id: 'SR-3', type: 'wardrobe', title: 'Lumen 6-foot', subtitle: 'Compact mirror sliding wardrobe',
    w: 1800, h: 2100,
    frames: ['W-900-2100', 'W-900-2100'],
    shutter: 'S-MIRROR', preset: 'WP-3', basePrice: 64500,
  },
  {
    id: 'SR-4', type: 'kitchen', title: 'Pune L-Kitchen', subtitle: 'L-shape, hob + sink + tall larder',
    w: 3300, h: 2700,
    frames: ['K-B-600', 'K-B-900', 'K-B-600', 'K-B-750', 'K-T-600'],
    walls: ['K-W-600', 'K-W-900', 'K-W-600', 'K-W-750'],
    shutter: 'S-WHITE', preset: 'KP-B2', basePrice: 168000,
  },
  {
    id: 'SR-5', type: 'kitchen', title: 'Bombay Straight', subtitle: '10-foot straight modular',
    w: 3000, h: 2400,
    frames: ['K-B-600', 'K-B-900', 'K-B-750', 'K-B-750'],
    walls: ['K-W-600', 'K-W-900', 'K-W-750', 'K-W-750'],
    shutter: 'S-CHAMP', preset: 'KP-B2', basePrice: 142000,
  },
  {
    id: 'SR-6', type: 'kitchen', title: 'Coorg U-Kitchen', subtitle: 'U-shape, full appliance pack',
    w: 3600, h: 2400,
    frames: ['K-B-900', 'K-B-600', 'K-B-450', 'K-B-600', 'K-B-750', 'K-B-300', 'K-T-600'],
    walls: ['K-W-900', 'K-W-600', 'K-W-450', 'K-W-600', 'K-W-750'],
    shutter: 'S-STONE', preset: 'KP-B2', basePrice: 198000,
  },
]

export const STAGES = [
  'Quoted', 'Confirmed', 'In Cut-list', 'Cut',
  'Edge-banded', 'Packed', 'Dispatched', 'Installing', 'Installed',
]

/* ── Helpers ── */
export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')

export const findFrame = (catalogKey: string, id: string) =>
  CATALOG[catalogKey]?.frames.find(f => f.id === id)

export const findShutter = (id: string) => SHUTTERS.find(s => s.id === id)

export const findPreset = (catalogKey: string, id: string) =>
  CATALOG[catalogKey]?.presets.find(p => p.id === id)

export function calcShutterArea(frameIds: string[], catalogKey: string): number {
  return frameIds.reduce((sum, fid) => {
    const f = findFrame(catalogKey, fid)
    if (!f) return sum
    return sum + (f.w * f.h) / 1_000_000
  }, 0)
}

export function pricePresetBundle(frameIds: string[], catalogKey: string, presetId: string): number {
  const preset = findPreset(catalogKey, presetId)
  if (!preset) return 0
  return frameIds.length * preset.price
}

export function priceConfig(
  catalogKey: string,
  frames: string[],
  walls: string[],
  _shutterId: string,
  presetId: string,
): number {
  let total = 0
  frames.forEach(fid => { const f = findFrame(catalogKey, fid); if (f) total += f.price })
  walls.forEach(fid  => { const f = findFrame(catalogKey, fid); if (f) total += f.price })
  const shutterArea = calcShutterArea(frames, catalogKey) + calcShutterArea(walls, catalogKey)
  total += shutterArea * SHUTTER_PRICE_PER_SQM
  total += pricePresetBundle([...frames, ...walls], catalogKey, presetId)
  total += 6500
  total *= 1.18
  return Math.round(total)
}

export function autoPackWidths(target: number, available: number[]): number[] {
  const sorted = [...available].sort((a, b) => b - a)
  const result: number[] = []
  let remaining = target
  while (remaining > 0) {
    let placed = false
    for (const w of sorted) {
      if (w <= remaining + 1) {
        result.push(w)
        remaining -= w
        placed = true
        break
      }
    }
    if (!placed) break
  }
  return result
}

export function generatePanels(config: { type: ProductType; frames: string[]; walls?: string[]; shutter: string }): OrderPanel[] {
  const cat = CATALOG[config.type]
  const allFrames = [...(config.frames || []), ...(config.walls || [])]
  const orderId = 'P-' + Math.floor(1000 + Math.random() * 9000)
  const lam = config.shutter
  const panels: OrderPanel[] = []
  let ix = 1
  allFrames.forEach(fid => {
    const f = cat.frames.find(fr => fr.id === fid)
    if (!f) return
    panels.push(
      { id: `${orderId}-${String(ix++).padStart(2, '0')}`, name: `Side L (${fid})`, qty: 1, lam, status: 'pending' },
      { id: `${orderId}-${String(ix++).padStart(2, '0')}`, name: `Side R (${fid})`, qty: 1, lam, status: 'pending' },
      { id: `${orderId}-${String(ix++).padStart(2, '0')}`, name: `Top + base`, qty: 2, lam, status: 'pending' },
      { id: `${orderId}-${String(ix++).padStart(2, '0')}`, name: `Shutter`, qty: 1, lam, status: 'pending' },
    )
  })
  return panels
}

/* ── Seed data ── */
export function seedOrders(): KBOrder[] {
  return [
    {
      id: 'ORD-1042',
      customer: { name: 'Anita Reddy', phone: '+91 98XXX 12340', city: 'Bengaluru', area: 'HSR Layout' },
      contractor: 'Suresh Modulars',
      type: 'wardrobe',
      config: { type: 'wardrobe', wallWidth: 2400, height: 2100, frames: ['W-750-2100', 'W-900-2100', 'W-750-2100'], walls: [], shutter: 'S-WALNUT', preset: 'WP-2' },
      advance: 65000, total: 92400, stage: 'Cut', createdAt: '2026-04-29',
      panels: [
        { id: 'P-1042-01', name: 'Side panel L', qty: 4, lam: 'S-WALNUT', status: 'cut' },
        { id: 'P-1042-02', name: 'Side panel R', qty: 4, lam: 'S-WALNUT', status: 'cut' },
        { id: 'P-1042-03', name: 'Top panel',    qty: 3, lam: 'S-WALNUT', status: 'cut' },
        { id: 'P-1042-04', name: 'Bottom panel', qty: 3, lam: 'S-WALNUT', status: 'cut' },
        { id: 'P-1042-05', name: 'Back panel',   qty: 3, lam: 'S-WALNUT', status: 'cut' },
        { id: 'P-1042-06', name: 'Shutter',       qty: 6, lam: 'S-WALNUT', status: 'pending' },
        { id: 'P-1042-07', name: 'Drawer fronts', qty: 9, lam: 'S-WALNUT', status: 'pending' },
        { id: 'P-1042-08', name: 'Shelves',       qty: 9, lam: 'S-WALNUT', status: 'pending' },
      ],
    },
    {
      id: 'ORD-1041',
      customer: { name: 'Karthik Nair', phone: '+91 96XXX 88210', city: 'Bengaluru', area: 'Indiranagar' },
      contractor: 'Visruth Interiors',
      type: 'kitchen',
      config: { type: 'kitchen', wallWidth: 3000, height: 720, frames: ['K-B-600', 'K-B-900', 'K-B-750', 'K-B-750'], walls: ['K-W-600', 'K-W-900', 'K-W-750', 'K-W-750'], shutter: 'S-WHITE', preset: 'KP-B2' },
      advance: 99400, total: 142000, stage: 'Dispatched', createdAt: '2026-04-22',
      panels: [],
    },
    {
      id: 'ORD-1039',
      customer: { name: 'Pooja Iyer', phone: '+91 97XXX 30120', city: 'Mysuru', area: 'Vijayanagar' },
      contractor: 'Banasri Builds',
      type: 'wardrobe',
      config: { type: 'wardrobe', wallWidth: 1800, height: 2400, frames: ['W-900-2400', 'W-900-2400'], walls: [], shutter: 'S-MIRROR', preset: 'WP-3' },
      advance: 51000, total: 72800, stage: 'Installed', createdAt: '2026-04-12',
      panels: [],
    },
  ]
}

export function seedInventory(): KBInventory {
  return {
    laminates: [
      { id: 'S-WHITE',  label: 'White matte',       sheets: 24, reorderAt: 10 },
      { id: 'S-STONE',  label: 'Stone grey',         sheets: 18, reorderAt: 10 },
      { id: 'S-OAK',    label: 'Light oak',          sheets: 31, reorderAt: 10 },
      { id: 'S-WALNUT', label: 'Walnut',             sheets: 8,  reorderAt: 10 },
      { id: 'S-GLOSS',  label: 'White gloss',        sheets: 22, reorderAt: 10 },
      { id: 'S-CHAMP',  label: 'Champagne gloss',    sheets: 15, reorderAt: 10 },
      { id: 'S-MIRROR', label: 'Mirror',             sheets: 11, reorderAt: 6  },
    ],
    hardware: [
      { id: 'HW-SLIDE',  label: 'Soft-close drawer slides (450mm)', units: 142, reorderAt: 50 },
      { id: 'HW-HINGE',  label: 'Soft-close hinges (110°)',         units: 380, reorderAt: 100 },
      { id: 'HW-RAIL',   label: 'Wardrobe rail (chrome, adj.)',     units: 28,  reorderAt: 12 },
      { id: 'HW-LARDER', label: 'Pull-out larder kit (600mm)',      units: 6,   reorderAt: 4 },
      { id: 'HW-CARO',   label: 'Corner carousel',                  units: 4,   reorderAt: 3 },
      { id: 'HW-LED',    label: 'LED strip with sensor (1m)',       units: 47,  reorderAt: 20 },
      { id: 'HW-HANDLE', label: 'Bar handle (black, 192mm)',        units: 96,  reorderAt: 40 },
    ],
  }
}
