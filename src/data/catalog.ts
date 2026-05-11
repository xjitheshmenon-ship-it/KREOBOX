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
  office: {
    label: 'Office',
    frames: [
      { id: 'O-D-1200',  type: 'desk',        w: 1200, h: 720,  d: 750,  price: 18500 },
      { id: 'O-D-1500',  type: 'desk',        w: 1500, h: 720,  d: 750,  price: 22000 },
      { id: 'O-D-1800',  type: 'desk',        w: 1800, h: 720,  d: 750,  price: 26500 },
      { id: 'O-L-1800',  type: 'l-desk',      w: 1800, h: 720,  d: 1500, price: 42000 },
      { id: 'O-L-2100',  type: 'l-desk',      w: 2100, h: 720,  d: 1800, price: 52000 },
      { id: 'O-WS-2',    type: 'workstation', w: 1200, h: 720,  d: 1200, price: 38000 },
      { id: 'O-WS-4',    type: 'workstation', w: 2400, h: 720,  d: 1200, price: 68000 },
      { id: 'O-WS-6',    type: 'workstation', w: 3600, h: 720,  d: 1200, price: 96000 },
      { id: 'O-P-3D',    type: 'pedestal',    w: 400,  h: 600,  d: 500,  price: 8800 },
      { id: 'O-P-2D',    type: 'pedestal',    w: 400,  h: 500,  d: 500,  price: 6500 },
      { id: 'O-S-800',   type: 'storage',     w: 800,  h: 1800, d: 400,  price: 16500 },
      { id: 'O-S-1200',  type: 'storage',     w: 1200, h: 1800, d: 400,  price: 22000 },
      { id: 'O-S-1600',  type: 'storage',     w: 1600, h: 1800, d: 400,  price: 28500 },
      { id: 'O-C-1200',  type: 'credenza',    w: 1200, h: 740,  d: 450,  price: 19500 },
      { id: 'O-C-1800',  type: 'credenza',    w: 1800, h: 740,  d: 450,  price: 26000 },
      { id: 'O-M-4P',    type: 'meeting',     w: 1600, h: 720,  d: 800,  price: 32000 },
      { id: 'O-M-6P',    type: 'meeting',     w: 2400, h: 720,  d: 900,  price: 48000 },
      { id: 'O-M-10P',   type: 'meeting',     w: 3600, h: 720,  d: 1200, price: 72000 },
      { id: 'O-PT-1200', type: 'partition',   w: 1200, h: 1200, d: 60,   price: 9800 },
      { id: 'O-PT-1800', type: 'partition',   w: 1800, h: 1200, d: 60,   price: 13500 },
    ],
    presets: [
      { id: 'OP-1', label: 'Desk only',        desc: 'Worktop + modesty panel + cable tray',        price: 3500 },
      { id: 'OP-2', label: 'Desk + pedestal',  desc: 'Worktop + 3-drawer mobile pedestal',          price: 5800 },
      { id: 'OP-3', label: 'Executive setup',  desc: 'L-desk + pedestal + wall bookshelf',          price: 9200 },
      { id: 'OP-4', label: 'Workstation kit',  desc: 'Shared worktop + divider screen + pedestals', price: 7500 },
      { id: 'OP-5', label: 'Meeting room pack',desc: 'Table + power box + credenza',                price: 6400 },
      { id: 'OP-6', label: 'Storage wall',     desc: '3 bookshelves + 1 credenza, full bay',        price: 4200 },
    ],
  },
  wardrobe: {
    label: 'Wardrobe',
    frames: [
      // Standard height 2100 (covers most Indian flats)
      { id: 'W-450-2100', w: 450, h: 2100, d: 600, price: 4800 },
      { id: 'W-600-2100', w: 600, h: 2100, d: 600, price: 5800 },
      { id: 'W-750-2100', w: 750, h: 2100, d: 600, price: 6800 },
      { id: 'W-900-2100', w: 900, h: 2100, d: 600, price: 7800 },
      // Full height 2400 (up-to-ceiling option)
      { id: 'W-450-2400', w: 450, h: 2400, d: 600, price: 5400 },
      { id: 'W-600-2400', w: 600, h: 2400, d: 600, price: 6600 },
      { id: 'W-750-2400', w: 750, h: 2400, d: 600, price: 7600 },
      { id: 'W-900-2400', w: 900, h: 2400, d: 600, price: 8800 },
      // Loft / top box — 450mm high, sits on 2100 frame to reach ceiling
      { id: 'W-450-L450', type: 'loft', w: 450, h: 450, d: 600, price: 2200 },
      { id: 'W-600-L450', type: 'loft', w: 600, h: 450, d: 600, price: 2600 },
      { id: 'W-750-L450', type: 'loft', w: 750, h: 450, d: 600, price: 3200 },
      { id: 'W-900-L450', type: 'loft', w: 900, h: 450, d: 600, price: 3600 },
    ],
    presets: [
      { id: 'WP-1', label: 'All hangers',       desc: 'Single rod + top shelf, full height',      price: 1200 },
      { id: 'WP-2', label: 'Drawers + hangers', desc: '3 drawers below, hanging rod above',       price: 4800 },
      { id: 'WP-3', label: 'Shelves only',      desc: '5 adjustable laminate shelves',            price: 1800 },
      { id: 'WP-4', label: 'Shelves + drawers', desc: '3 soft-close drawers + 3 shelves + rod',   price: 5200 },
    ],
  },
  kitchen: {
    label: 'Kitchen',
    frames: [
      // Base units — 720mm carcass height (+ 100mm plinth + 20mm worktop = 840mm finished)
      { id: 'K-B-300',        type: 'base',   w: 300,  h: 720,  d: 600, price: 4200 },
      { id: 'K-B-450',        type: 'base',   w: 450,  h: 720,  d: 600, price: 5200 },
      { id: 'K-B-600',        type: 'base',   w: 600,  h: 720,  d: 600, price: 6800 },
      { id: 'K-B-750',        type: 'base',   w: 750,  h: 720,  d: 600, price: 7800 },
      { id: 'K-B-900',        type: 'base',   w: 900,  h: 720,  d: 600, price: 8900 },
      { id: 'K-B-CORNER',     type: 'corner-base', w: 900, h: 720, d: 900, price: 13800 },
      // Wall units — 600mm height (standard)
      { id: 'K-W-300',        type: 'wall',   w: 300,  h: 600,  d: 350, price: 2400 },
      { id: 'K-W-450',        type: 'wall',   w: 450,  h: 600,  d: 350, price: 3200 },
      { id: 'K-W-600',        type: 'wall',   w: 600,  h: 600,  d: 350, price: 3900 },
      { id: 'K-W-750',        type: 'wall',   w: 750,  h: 600,  d: 350, price: 4500 },
      { id: 'K-W-900',        type: 'wall',   w: 900,  h: 600,  d: 350, price: 5200 },
      // Wall units — 750mm height (taller, above chimney zone)
      { id: 'K-W-300-750',    type: 'wall',   w: 300,  h: 750,  d: 350, price: 3000 },
      { id: 'K-W-450-750',    type: 'wall',   w: 450,  h: 750,  d: 350, price: 4000 },
      { id: 'K-W-600-750',    type: 'wall',   w: 600,  h: 750,  d: 350, price: 4800 },
      { id: 'K-W-750-750',    type: 'wall',   w: 750,  h: 750,  d: 350, price: 5600 },
      { id: 'K-W-900-750',    type: 'wall',   w: 900,  h: 750,  d: 350, price: 6500 },
      { id: 'K-W-CORNER',     type: 'corner-wall', w: 900, h: 600, d: 350, price: 7800 },
      // Tall / column units — 2100mm (standard ceiling)
      { id: 'K-T-450',        type: 'tall',   w: 450,  h: 2100, d: 600, price: 9200 },
      { id: 'K-T-600',        type: 'tall',   w: 600,  h: 2100, d: 600, price: 11800 },
      { id: 'K-T-900',        type: 'tall',   w: 900,  h: 2100, d: 600, price: 16400 },
      // Tall / column units — 2400mm (floor-to-ceiling)
      { id: 'K-T-450-2400',   type: 'tall',   w: 450,  h: 2400, d: 600, price: 11500 },
      { id: 'K-T-600-2400',   type: 'tall',   w: 600,  h: 2400, d: 600, price: 14800 },
      { id: 'K-T-900-2400',   type: 'tall',   w: 900,  h: 2400, d: 600, price: 20500 },
    ],
    presets: [
      // Base presets (6)
      { id: 'KP-B1', label: 'Doors + 1 shelf',      desc: 'Standard door cabinet, 1 adjustable shelf', scope: 'base',   price: 800 },
      { id: 'KP-B2', label: '3 drawers',             desc: 'Full-height soft-close drawer bank',        scope: 'base',   price: 4800 },
      { id: 'KP-B3', label: 'Sink unit',             desc: 'Open below, plumbing-ready cutout',         scope: 'base',   price: 1200 },
      { id: 'KP-B4', label: 'Hob unit',              desc: '3 drawers below, hob fronts only',          scope: 'base',   price: 3600 },
      { id: 'KP-B5', label: '2 drawers + door',      desc: '2 drawers left, single door right',         scope: 'base',   price: 3800 },
      { id: 'KP-B6', label: 'Corner carousel',       desc: 'Blind corner with Hettich carousel',        scope: 'corner-base', price: 8500 },
      // Wall presets (5)
      { id: 'KP-W1', label: 'Doors + shelf',         desc: '2 hinged doors, 1 adjustable shelf',        scope: 'wall',   price: 700 },
      { id: 'KP-W2', label: 'Lift-up flap',          desc: 'Single panel hydraulic lift-up',            scope: 'wall',   price: 2200 },
      { id: 'KP-W3', label: 'Open shelves',          desc: 'No doors — 3 open display shelves',         scope: 'wall',   price: 400 },
      { id: 'KP-W4', label: 'Chimney housing',       desc: 'No shelf — sized around chimney duct',      scope: 'wall',   price: 600 },
      { id: 'KP-W5', label: 'Corner unit',           desc: 'L-shaped wall corner with shelf',           scope: 'corner-wall', price: 3600 },
      // Tall presets (4)
      { id: 'KP-T1', label: 'Pantry shelves',        desc: '6 fixed shelves, full height',              scope: 'tall',   price: 1800 },
      { id: 'KP-T2', label: 'Pull-out larder',       desc: 'Hettich full-extension pull-out larder',    scope: 'tall',   price: 6800 },
      { id: 'KP-T3', label: 'Oven housing',          desc: 'Mid-height oven niche + shelf above/below', scope: 'tall',   price: 2800 },
      { id: 'KP-T4', label: 'Fridge surround',       desc: 'Open niche sized for fridge + top cabinet', scope: 'tall',   price: 1600 },
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
  {
    id: 'SR-7', type: 'wardrobe', title: 'Nova 12-foot + Loft', subtitle: 'Full-wall wardrobe with loft storage',
    w: 3600, h: 2550,
    frames: ['W-900-2100', 'W-900-2100', 'W-900-2100', 'W-900-2100'],
    shutter: 'S-CHAMP', preset: 'WP-2', basePrice: 158000,
  },
  {
    id: 'SR-8', type: 'wardrobe', title: 'Slate Slim 5-foot', subtitle: 'Stone grey, shelves + single rod',
    w: 1500, h: 2400,
    frames: ['W-600-2400', 'W-900-2400'],
    shutter: 'S-STONE', preset: 'WP-1', basePrice: 52000,
  },
  {
    id: 'SR-9', type: 'kitchen', title: 'Delhi Parallel Kitchen', subtitle: 'Parallel layout, tall larder + oven tower',
    w: 4800, h: 2400,
    frames: ['K-B-600', 'K-B-900', 'K-B-600', 'K-B-750', 'K-T-600-2400', 'K-B-600', 'K-B-900', 'K-B-750'],
    walls: ['K-W-600', 'K-W-900', 'K-W-600-750', 'K-W-750', 'K-W-600', 'K-W-900', 'K-W-750'],
    shutter: 'S-WHITE', preset: 'KP-B1', basePrice: 248000,
  },
  {
    id: 'SR-11', type: 'office', title: 'Executive Corner', subtitle: 'L-desk + walnut storage wall + pedestal',
    w: 2100, h: 1800,
    frames: ['O-L-2100', 'O-P-3D', 'O-S-1200'],
    shutter: 'S-WALNUT', preset: 'OP-3', basePrice: 98000,
  },
  {
    id: 'SR-12', type: 'office', title: '4-Seat Workstation', subtitle: 'Back-to-back open plan, oak finish',
    w: 2400, h: 1200,
    frames: ['O-WS-4', 'O-P-3D', 'O-P-3D'],
    shutter: 'S-OAK', preset: 'OP-4', basePrice: 84000,
  },
  {
    id: 'SR-13', type: 'office', title: 'Boardroom 6P', subtitle: '6-person meeting table + credenza',
    w: 3600, h: 1200,
    frames: ['O-M-6P', 'O-C-1800'],
    shutter: 'S-WHITE', preset: 'OP-5', basePrice: 82000,
  },
  {
    id: 'SR-14', type: 'office', title: 'Director Cabin', subtitle: '1800 desk + storage wall + meeting unit',
    w: 3600, h: 2400,
    frames: ['O-D-1800', 'O-P-3D', 'O-S-1600', 'O-M-4P'],
    shutter: 'S-STONE', preset: 'OP-3', basePrice: 148000,
  },
  {
    id: 'SR-10', type: 'kitchen', title: 'Chai Walnut L', subtitle: 'Walnut shutter L-kitchen, corner carousel',
    w: 3000, h: 2100,
    frames: ['K-B-600', 'K-B-750', 'K-B-CORNER', 'K-B-600', 'K-T-450'],
    walls: ['K-W-600', 'K-W-750', 'K-W-CORNER', 'K-W-600'],
    shutter: 'S-WALNUT', preset: 'KP-B1', basePrice: 186000,
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
    // Quoted — customer placed, awaiting contractor confirmation
    {
      id: 'ORD-1048',
      customer: { name: 'Meera Pillai', phone: '+91 91XXX 44210', city: 'Bengaluru', area: 'Koramangala' },
      contractor: 'Unassigned',
      type: 'wardrobe',
      config: { type: 'wardrobe', wallWidth: 1800, height: 2100, frames: ['W-900-2100', 'W-900-2100'], walls: [], shutter: 'S-OAK', preset: 'WP-1' },
      advance: 31500, total: 58000, stage: 'Quoted', createdAt: '2026-05-07',
      panels: [],
    },
    {
      id: 'ORD-1047',
      customer: { name: 'Rakesh Menon', phone: '+91 99XXX 77650', city: 'Bengaluru', area: 'Whitefield' },
      contractor: 'Unassigned',
      type: 'kitchen',
      config: { type: 'kitchen', wallWidth: 2700, height: 720, frames: ['K-B-600', 'K-B-900', 'K-B-600'], walls: ['K-W-600', 'K-W-900'], shutter: 'S-WHITE', preset: 'KP-B1' },
      advance: 44100, total: 84000, stage: 'Quoted', createdAt: '2026-05-06',
      panels: [],
    },
    // Confirmed — contractor reviewed, sent to factory
    {
      id: 'ORD-1046',
      customer: { name: 'Divya Krishnan', phone: '+91 88XXX 55320', city: 'Bengaluru', area: 'Jayanagar' },
      contractor: 'Suresh Modulars',
      type: 'office',
      config: { type: 'office', wallWidth: 3600, height: 1200, frames: ['O-D-1800', 'O-P-3D'], walls: [], shutter: 'S-STONE', preset: 'OP-2' },
      advance: 24360, total: 69600, stage: 'Confirmed', createdAt: '2026-05-04',
      panels: [],
    },
    // In Cut-list — factory preparing cut-list
    {
      id: 'ORD-1045',
      customer: { name: 'Arun Sharma', phone: '+91 97XXX 11870', city: 'Bengaluru', area: 'Banashankari' },
      contractor: 'Visruth Interiors',
      type: 'wardrobe',
      config: { type: 'wardrobe', wallWidth: 2700, height: 2400, frames: ['W-900-2400', 'W-900-2400', 'W-900-2400'], walls: [], shutter: 'S-WALNUT', preset: 'WP-3' },
      advance: 73500, total: 105000, stage: 'In Cut-list', createdAt: '2026-05-02',
      panels: [],
    },
    // Cut — panels on cutting table
    {
      id: 'ORD-1042',
      customer: { name: 'Anita Reddy', phone: '+91 98XXX 12340', city: 'Bengaluru', area: 'HSR Layout' },
      contractor: 'Suresh Modulars',
      type: 'wardrobe',
      config: { type: 'wardrobe', wallWidth: 2400, height: 2100, frames: ['W-750-2100', 'W-900-2100', 'W-750-2100'], walls: [], shutter: 'S-WALNUT', preset: 'WP-2' },
      advance: 65000, total: 92400, stage: 'Cut', createdAt: '2026-04-29',
      panels: [
        { id: 'P-1042-01', name: 'Side panel L',  qty: 4, lam: 'S-WALNUT', status: 'cut' },
        { id: 'P-1042-02', name: 'Side panel R',  qty: 4, lam: 'S-WALNUT', status: 'cut' },
        { id: 'P-1042-03', name: 'Top panel',     qty: 3, lam: 'S-WALNUT', status: 'cut' },
        { id: 'P-1042-04', name: 'Bottom panel',  qty: 3, lam: 'S-WALNUT', status: 'cut' },
        { id: 'P-1042-05', name: 'Back panel',    qty: 3, lam: 'S-WALNUT', status: 'cut' },
        { id: 'P-1042-06', name: 'Shutter',       qty: 6, lam: 'S-WALNUT', status: 'pending' },
        { id: 'P-1042-07', name: 'Drawer fronts', qty: 9, lam: 'S-WALNUT', status: 'pending' },
        { id: 'P-1042-08', name: 'Shelves',       qty: 9, lam: 'S-WALNUT', status: 'pending' },
      ],
    },
    // Edge-banded
    {
      id: 'ORD-1043',
      customer: { name: 'Sunil Bhat', phone: '+91 94XXX 23410', city: 'Bengaluru', area: 'Malleshwaram' },
      contractor: 'Banasri Builds',
      type: 'kitchen',
      config: { type: 'kitchen', wallWidth: 3600, height: 720, frames: ['K-B-600', 'K-B-900', 'K-B-900', 'K-B-600'], walls: ['K-W-600', 'K-W-900', 'K-W-600'], shutter: 'S-STONE', preset: 'KP-B3' },
      advance: 88200, total: 126000, stage: 'Edge-banded', createdAt: '2026-04-27',
      panels: [],
    },
    // Packed — ready for dispatch
    {
      id: 'ORD-1044',
      customer: { name: 'Priya Venkat', phone: '+91 93XXX 99870', city: 'Bengaluru', area: 'Electronic City' },
      contractor: 'Suresh Modulars',
      type: 'wardrobe',
      config: { type: 'wardrobe', wallWidth: 1800, height: 2100, frames: ['W-900-2100', 'W-900-2100'], walls: [], shutter: 'S-WHITE', preset: 'WP-1' },
      advance: 42000, total: 60000, stage: 'Packed', createdAt: '2026-04-25',
      panels: [],
    },
    // Dispatched — on the way
    {
      id: 'ORD-1041',
      customer: { name: 'Karthik Nair', phone: '+91 96XXX 88210', city: 'Bengaluru', area: 'Indiranagar' },
      contractor: 'Visruth Interiors',
      type: 'kitchen',
      config: { type: 'kitchen', wallWidth: 3000, height: 720, frames: ['K-B-600', 'K-B-900', 'K-B-750', 'K-B-750'], walls: ['K-W-600', 'K-W-900', 'K-W-750', 'K-W-750'], shutter: 'S-WHITE', preset: 'KP-B2' },
      advance: 99400, total: 142000, stage: 'Dispatched', createdAt: '2026-04-22',
      panels: [],
    },
    // Installing
    {
      id: 'ORD-1040',
      customer: { name: 'Kavitha Subbu', phone: '+91 95XXX 43210', city: 'Bengaluru', area: 'JP Nagar' },
      contractor: 'Banasri Builds',
      type: 'wardrobe',
      config: { type: 'wardrobe', wallWidth: 2400, height: 2400, frames: ['W-750-2400', 'W-900-2400', 'W-750-2400'], walls: [], shutter: 'S-GLOSS', preset: 'WP-2' },
      advance: 71400, total: 102000, stage: 'Installing', createdAt: '2026-04-18',
      panels: [],
    },
    // Installed — done
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
      // Drawer slides — 3 lengths per spec
      { id: 'HW-SLIDE-450', label: 'Soft-close drawer slides (450mm)', units: 142, reorderAt: 50 },
      { id: 'HW-SLIDE-500', label: 'Soft-close drawer slides (500mm)', units: 88,  reorderAt: 40 },
      { id: 'HW-SLIDE-550', label: 'Soft-close drawer slides (550mm)', units: 64,  reorderAt: 30 },
      // Hinges — 110° standard + 165° corner
      { id: 'HW-HINGE-110', label: 'Soft-close hinges 110° (pair)',    units: 380, reorderAt: 100 },
      { id: 'HW-HINGE-165', label: 'Soft-close hinges 165° corner',    units: 52,  reorderAt: 20 },
      // Handles — 3 styles, 2 finishes
      { id: 'HW-HANDLE-BAR-BLK',  label: 'Bar handle black (192mm)',   units: 96,  reorderAt: 40 },
      { id: 'HW-HANDLE-EDGE-BLK', label: 'Edge profile handle black',  units: 44,  reorderAt: 20 },
      { id: 'HW-HANDLE-KNOB-BST', label: 'Knob handle brushed steel',  units: 60,  reorderAt: 24 },
      // Wardrobe fittings
      { id: 'HW-RAIL',    label: 'Wardrobe rail chrome adj. (600–900)', units: 28,  reorderAt: 12 },
      // Kitchen pull-outs
      { id: 'HW-BOTTLE',  label: 'Bottle pull-out unit (300mm)',        units: 14,  reorderAt: 6 },
      { id: 'HW-LARDER-450', label: 'Pull-out larder kit (450mm)',      units: 8,   reorderAt: 4 },
      { id: 'HW-LARDER-600', label: 'Pull-out larder kit (600mm)',      units: 6,   reorderAt: 4 },
      { id: 'HW-CARO',    label: 'Corner carousel (Hettich)',           units: 4,   reorderAt: 3 },
      { id: 'HW-PLATRACK',label: 'Plate rack above-sink kit',           units: 10,  reorderAt: 4 },
      // Lighting
      { id: 'HW-LED',     label: 'LED strip with sensor (1m extendable)', units: 47, reorderAt: 20 },
      // Trays & inserts
      { id: 'HW-CUTLERY', label: 'Cutlery tray (600mm)',               units: 22,  reorderAt: 10 },
      { id: 'HW-JEWEL',   label: 'Jewellery insert tray',              units: 8,   reorderAt: 4 },
      { id: 'HW-DIVIDER', label: 'Drawer divider set',                 units: 35,  reorderAt: 12 },
    ],
  }
}
