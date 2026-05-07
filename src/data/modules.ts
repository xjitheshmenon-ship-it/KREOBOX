import type { Module } from '../types'

// ── LAMINATE PALETTE ────────────────────────────────────────────────────────
// 7 finish families per KREOBOX spec (IKEA reference doc)
export const LAMINATE_PALETTE: Record<string, { name: string; hex: string; family: string }> = {
  // Plain Matte family (AXSTAD/VEDDINGE equivalent)
  'CEN-0001-WT': { name: 'Polar White',      hex: '#F5F5F5', family: 'Plain Matte' },
  'CEN-1812-MT': { name: 'Cashmere Matt',    hex: '#C8A87A', family: 'Plain Matte' },
  'CEN-5502-GY': { name: 'Stone Grey',       hex: '#9EA4AB', family: 'Plain Matte' },
  // Wood Grain family (TISTORP/VEDHAMN equivalent)
  'CEN-0916-WD': { name: 'Light Oak',        hex: '#B8966A', family: 'Wood Grain' },
  'CEN-3301-WD': { name: 'Walnut',           hex: '#6B4226', family: 'Wood Grain' },
  // High-Gloss family (RINGHULT/VOXTORP equivalent)
  'CEN-4501-GL': { name: 'Gloss White',      hex: '#F0EDE8', family: 'High Gloss' },
  'CEN-5601-GL': { name: 'Champagne Gloss',  hex: '#D4C4A0', family: 'High Gloss' },
}

// Convenience shorthand laminates per category
const WD_LAMS = ['CEN-1812-MT', 'CEN-0916-WD', 'CEN-3301-WD', 'CEN-4501-GL']
const KT_LAMS = ['CEN-0001-WT', 'CEN-5502-GY', 'CEN-4501-GL', 'CEN-5601-GL']
const TV_LAMS = ['CEN-0916-WD', 'CEN-3301-WD', 'CEN-1812-MT', 'CEN-5502-GY']

export const MODULE_CATALOG: Module[] = [

  // ── WARDROBES ── Grid: 450/600/750/900 W × 600 D × 2100/2400 H ─────────────
  // Depth 600mm only (fits Indian hangers). Heights 2100 (standard) & 2400 (ceiling).
  {
    id: 'WD-450-H21', sku: 'WD-450-H21', name: 'Wardrobe 450 × 2100',
    category: 'wardrobe', width: 450, height: 2100, depth: 600,
    laminateCode: 'CEN-1812-MT', laminateOptions: WD_LAMS,
    priceINR: 18500,
    description: '450mm filler/narrow wardrobe frame, 2100H. All-hanging preset. Soft-close hinges.',
    hardwareList: [
      { name: 'Hettich Soft-Close Hinge 110°', sku: 'HTK-SCH-110', qty: 4,  unitPriceINR: 150 },
      { name: 'Chrome Wardrobe Rail',           sku: 'HW-WRD-RAIL', qty: 1,  unitPriceINR: 380 },
      { name: 'Cam Lock',                       sku: 'HW-CAM-15',   qty: 8,  unitPriceINR: 12  },
    ],
    cutList: [
      { label: 'Side Panel',   qty: 2, length: 2100, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Top Panel',    qty: 1, length: 414,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Bottom Panel', qty: 1, length: 414,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Fixed Shelf',  qty: 2, length: 414,  width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Back Panel',   qty: 1, length: 2064, width: 450, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
    ],
  },
  {
    id: 'WD-600-H21', sku: 'WD-600-H21', name: 'Wardrobe 600 × 2100',
    category: 'wardrobe', width: 600, height: 2100, depth: 600,
    laminateCode: 'CEN-1812-MT', laminateOptions: WD_LAMS,
    priceINR: 22000,
    description: '600mm wardrobe frame, 2100H. Drawers-below + hanging-above preset.',
    hardwareList: [
      { name: 'Hettich Soft-Close Hinge 110°', sku: 'HTK-SCH-110', qty: 4,  unitPriceINR: 150 },
      { name: 'Hettich Quadro 4D Drawer',      sku: 'HTK-Q4D-500', qty: 2,  unitPriceINR: 1850 },
      { name: 'Chrome Wardrobe Rail',           sku: 'HW-WRD-RAIL', qty: 1,  unitPriceINR: 380 },
      { name: 'Cam Lock',                       sku: 'HW-CAM-15',   qty: 10, unitPriceINR: 12  },
    ],
    cutList: [
      { label: 'Side Panel',   qty: 2, length: 2100, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Top Panel',    qty: 1, length: 564,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Bottom Panel', qty: 1, length: 564,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Fixed Shelf',  qty: 3, length: 564,  width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Back Panel',   qty: 1, length: 2064, width: 600, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
    ],
  },
  {
    id: 'WD-750-H21', sku: 'WD-750-H21', name: 'Wardrobe 750 × 2100',
    category: 'wardrobe', width: 750, height: 2100, depth: 600,
    laminateCode: 'CEN-1812-MT', laminateOptions: WD_LAMS,
    priceINR: 27500,
    description: '750mm wardrobe frame, 2100H. Shelves + 3 drawers preset.',
    hardwareList: [
      { name: 'Hettich Soft-Close Hinge 110°', sku: 'HTK-SCH-110', qty: 4,  unitPriceINR: 150 },
      { name: 'Hettich Quadro 4D Drawer',      sku: 'HTK-Q4D-500', qty: 3,  unitPriceINR: 1850 },
      { name: 'Chrome Wardrobe Rail',           sku: 'HW-WRD-RAIL', qty: 1,  unitPriceINR: 380 },
      { name: 'Cam Lock',                       sku: 'HW-CAM-15',   qty: 12, unitPriceINR: 12  },
    ],
    cutList: [
      { label: 'Side Panel',   qty: 2, length: 2100, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Top Panel',    qty: 1, length: 714,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Bottom Panel', qty: 1, length: 714,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Fixed Shelf',  qty: 4, length: 714,  width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Back Panel',   qty: 1, length: 2064, width: 750, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
    ],
  },
  {
    id: 'WD-900-H21', sku: 'WD-900-H21', name: 'Wardrobe 900 × 2100',
    category: 'wardrobe', width: 900, height: 2100, depth: 600,
    laminateCode: 'CEN-1812-MT', laminateOptions: WD_LAMS,
    priceINR: 32000,
    description: '900mm wardrobe frame, 2100H. Full hanging with 4 shelves.',
    hardwareList: [
      { name: 'Hettich Soft-Close Hinge 110°', sku: 'HTK-SCH-110', qty: 6,  unitPriceINR: 150 },
      { name: 'Chrome Wardrobe Rail',           sku: 'HW-WRD-RAIL', qty: 1,  unitPriceINR: 480 },
      { name: 'Cam Lock',                       sku: 'HW-CAM-15',   qty: 14, unitPriceINR: 12  },
    ],
    cutList: [
      { label: 'Side Panel',   qty: 2, length: 2100, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Top Panel',    qty: 1, length: 864,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Bottom Panel', qty: 1, length: 864,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Fixed Shelf',  qty: 4, length: 864,  width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Back Panel',   qty: 1, length: 2064, width: 900, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
    ],
  },
  {
    id: 'WD-600-H24', sku: 'WD-600-H24', name: 'Wardrobe 600 × 2400',
    category: 'wardrobe', width: 600, height: 2400, depth: 600,
    laminateCode: 'CEN-0916-WD', laminateOptions: WD_LAMS,
    priceINR: 26000,
    description: '600mm tall wardrobe frame, 2400H. Up-to-ceiling option for 8ft rooms.',
    hardwareList: [
      { name: 'Hettich Soft-Close Hinge 110°', sku: 'HTK-SCH-110', qty: 4,  unitPriceINR: 150 },
      { name: 'Chrome Wardrobe Rail',           sku: 'HW-WRD-RAIL', qty: 1,  unitPriceINR: 380 },
      { name: 'Cam Lock',                       sku: 'HW-CAM-15',   qty: 10, unitPriceINR: 12  },
    ],
    cutList: [
      { label: 'Side Panel',   qty: 2, length: 2400, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Top Panel',    qty: 1, length: 564,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Bottom Panel', qty: 1, length: 564,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Fixed Shelf',  qty: 4, length: 564,  width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Back Panel',   qty: 1, length: 2364, width: 600, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
    ],
  },
  {
    id: 'WD-900-H24', sku: 'WD-900-H24', name: 'Wardrobe 900 × 2400',
    category: 'wardrobe', width: 900, height: 2400, depth: 600,
    laminateCode: 'CEN-0916-WD', laminateOptions: WD_LAMS,
    priceINR: 38500,
    description: '900mm tall wardrobe frame, 2400H. 4-door up-to-ceiling configuration.',
    hardwareList: [
      { name: 'Hettich Soft-Close Hinge 110°', sku: 'HTK-SCH-110', qty: 6,  unitPriceINR: 150 },
      { name: 'Chrome Wardrobe Rail',           sku: 'HW-WRD-RAIL', qty: 1,  unitPriceINR: 480 },
      { name: 'Cam Lock',                       sku: 'HW-CAM-15',   qty: 14, unitPriceINR: 12  },
    ],
    cutList: [
      { label: 'Side Panel',   qty: 2, length: 2400, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Top Panel',    qty: 1, length: 864,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Bottom Panel', qty: 1, length: 864,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Fixed Shelf',  qty: 5, length: 864,  width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Back Panel',   qty: 1, length: 2364, width: 900, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
    ],
  },

  // ── KITCHEN BASE ── Grid: 300/450/600/750/900 W × 600 D × 720 carcass H ─────
  // Carcass 720mm. Finished height = 720 + 100mm plinth + 20mm worktop = 840mm.
  {
    id: 'KB-300-PLO', sku: 'KB-300-PLO', name: 'Base 300 – 1-Door',
    category: 'kitchen-base', width: 300, height: 840, depth: 600,
    laminateCode: 'CEN-0001-WT', laminateOptions: KT_LAMS,
    priceINR: 4800,
    description: '300mm base unit. 1 door + 1 shelf. Bottle pull-out or narrow filler position.',
    hardwareList: [
      { name: 'Hettich Clip Top Hinge 110°', sku: 'HTK-CTH-110', qty: 2, unitPriceINR: 150 },
      { name: 'Adjustable Leg 100mm',         sku: 'HW-LEG-100',  qty: 4, unitPriceINR: 55  },
      { name: 'Bar Handle 128mm',              sku: 'HW-HDL-128',  qty: 1, unitPriceINR: 220 },
    ],
    cutList: [
      { label: 'Side Panel',    qty: 2, length: 720, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Top Stretcher', qty: 2, length: 264, width: 100, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Bottom Panel',  qty: 1, length: 264, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Shelf',         qty: 1, length: 264, width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Door',          qty: 1, length: 714, width: 282, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Back Panel',    qty: 1, length: 720, width: 300, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
    ],
  },
  {
    id: 'KB-450-DRW', sku: 'KB-450-DRW', name: 'Base 450 – 3 Drawer',
    category: 'kitchen-base', width: 450, height: 840, depth: 600,
    laminateCode: 'CEN-0001-WT', laminateOptions: KT_LAMS,
    priceINR: 9200,
    description: '450mm 3-drawer unit with Hettich Quadro soft-close full-extension drawers.',
    hardwareList: [
      { name: 'Hettich Quadro 4D Drawer',  sku: 'HTK-Q4D-550', qty: 3, unitPriceINR: 1850 },
      { name: 'Adjustable Leg 100mm',       sku: 'HW-LEG-100',  qty: 4, unitPriceINR: 55   },
      { name: 'Bar Handle 128mm',            sku: 'HW-HDL-128',  qty: 3, unitPriceINR: 220  },
    ],
    cutList: [
      { label: 'Side Panel',   qty: 2, length: 720, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Drawer Front', qty: 3, length: 218, width: 414, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Back Panel',   qty: 1, length: 720, width: 450, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
    ],
  },
  {
    id: 'KB-600-SHL', sku: 'KB-600-SHL', name: 'Base 600 – 2-Door',
    category: 'kitchen-base', width: 600, height: 840, depth: 600,
    laminateCode: 'CEN-0001-WT', laminateOptions: KT_LAMS,
    priceINR: 7500,
    description: '600mm base unit. 2 doors + 1 adjustable shelf. The workhorse kitchen base.',
    hardwareList: [
      { name: 'Hettich Clip Top Hinge 110°', sku: 'HTK-CTH-110', qty: 4, unitPriceINR: 150 },
      { name: 'Adjustable Leg 100mm',         sku: 'HW-LEG-100',  qty: 4, unitPriceINR: 55  },
      { name: 'Bar Handle 128mm',              sku: 'HW-HDL-128',  qty: 2, unitPriceINR: 220 },
    ],
    cutList: [
      { label: 'Side Panel',    qty: 2, length: 720, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Top Stretcher', qty: 2, length: 564, width: 100, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Bottom Panel',  qty: 1, length: 564, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Shelf',         qty: 1, length: 564, width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Door',          qty: 2, length: 714, width: 297, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Back Panel',    qty: 1, length: 720, width: 600, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
    ],
  },
  {
    id: 'KB-600-SNK', sku: 'KB-600-SNK', name: 'Base 600 – Sink Unit',
    category: 'kitchen-base', width: 600, height: 840, depth: 600,
    laminateCode: 'CEN-0001-WT', laminateOptions: KT_LAMS,
    priceINR: 8200,
    description: '600mm sink base. Open below for plumbing, 2 doors, no floor panel.',
    hardwareList: [
      { name: 'Hettich Clip Top Hinge 110°', sku: 'HTK-CTH-110', qty: 4, unitPriceINR: 150 },
      { name: 'Adjustable Leg 100mm',         sku: 'HW-LEG-100',  qty: 4, unitPriceINR: 55  },
      { name: 'Bar Handle 128mm',              sku: 'HW-HDL-128',  qty: 2, unitPriceINR: 220 },
    ],
    cutList: [
      { label: 'Side Panel',    qty: 2, length: 720, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Top Stretcher', qty: 2, length: 564, width: 100, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Door',          qty: 2, length: 714, width: 297, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Back Panel',    qty: 1, length: 720, width: 600, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
    ],
  },
  {
    id: 'KB-750-SHL', sku: 'KB-750-SHL', name: 'Base 750 – 2-Door',
    category: 'kitchen-base', width: 750, height: 840, depth: 600,
    laminateCode: 'CEN-0001-WT', laminateOptions: KT_LAMS,
    priceINR: 9800,
    description: '750mm base unit. 2 doors + 1 shelf. For double-bowl sinks or wider storage.',
    hardwareList: [
      { name: 'Hettich Clip Top Hinge 110°', sku: 'HTK-CTH-110', qty: 4, unitPriceINR: 150 },
      { name: 'Adjustable Leg 100mm',         sku: 'HW-LEG-100',  qty: 4, unitPriceINR: 55  },
      { name: 'Bar Handle 128mm',              sku: 'HW-HDL-128',  qty: 2, unitPriceINR: 220 },
    ],
    cutList: [
      { label: 'Side Panel',    qty: 2, length: 720, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Top Stretcher', qty: 2, length: 714, width: 100, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Bottom Panel',  qty: 1, length: 714, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Shelf',         qty: 1, length: 714, width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Door',          qty: 2, length: 714, width: 357, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Back Panel',    qty: 1, length: 720, width: 750, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
    ],
  },
  {
    id: 'KB-900-HOB', sku: 'KB-900-HOB', name: 'Base 900 – Hob Unit',
    category: 'kitchen-base', width: 900, height: 840, depth: 600,
    laminateCode: 'CEN-0001-WT', laminateOptions: KT_LAMS,
    priceINR: 12500,
    description: '900mm hob unit. 3 drawers, open top for 90cm hob+chimney. Indian standard.',
    hardwareList: [
      { name: 'Hettich Quadro 4D Drawer',  sku: 'HTK-Q4D-550', qty: 3, unitPriceINR: 1850 },
      { name: 'Adjustable Leg 100mm',       sku: 'HW-LEG-100',  qty: 4, unitPriceINR: 55   },
      { name: 'Bar Handle 128mm',            sku: 'HW-HDL-128',  qty: 3, unitPriceINR: 220  },
    ],
    cutList: [
      { label: 'Side Panel',    qty: 2, length: 720, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Top Stretcher', qty: 2, length: 864, width: 100, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Drawer Front',  qty: 3, length: 218, width: 864, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Back Panel',    qty: 1, length: 720, width: 900, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
    ],
  },

  // ── KITCHEN WALL ── Grid: 300/450/600/750/900 W × 350 D × 600/750 H ─────────
  // Depth 350mm. Heights 600mm (standard) or 750mm (taller upper run).
  {
    id: 'KW-300-1D', sku: 'KW-300-1D', name: 'Wall 300 – 1-Door 600H',
    category: 'kitchen-wall', width: 300, height: 600, depth: 350,
    laminateCode: 'CEN-0001-WT', laminateOptions: KT_LAMS,
    priceINR: 3600,
    description: '300mm wall unit, 600H. 1 door + 2 shelves. Narrow filler or end position.',
    hardwareList: [
      { name: 'Hettich Clip Top Hinge 110°', sku: 'HTK-CTH-110', qty: 2, unitPriceINR: 150 },
      { name: 'Wall Bracket Set',             sku: 'HW-WB-02',    qty: 2, unitPriceINR: 280 },
      { name: 'Bar Handle 128mm',              sku: 'HW-HDL-128',  qty: 1, unitPriceINR: 220 },
    ],
    cutList: [
      { label: 'Side Panel',   qty: 2, length: 600, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Top Panel',    qty: 1, length: 264, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Bottom Panel', qty: 1, length: 264, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Shelf',        qty: 2, length: 264, width: 314, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Door',         qty: 1, length: 564, width: 282, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Back Panel',   qty: 1, length: 564, width: 300, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
    ],
  },
  {
    id: 'KW-450-1D', sku: 'KW-450-1D', name: 'Wall 450 – 1-Door 600H',
    category: 'kitchen-wall', width: 450, height: 600, depth: 350,
    laminateCode: 'CEN-0001-WT', laminateOptions: KT_LAMS,
    priceINR: 4800,
    description: '450mm wall unit, 600H. 1 door + 2 shelves.',
    hardwareList: [
      { name: 'Hettich Clip Top Hinge 110°', sku: 'HTK-CTH-110', qty: 2, unitPriceINR: 150 },
      { name: 'Wall Bracket Set',             sku: 'HW-WB-02',    qty: 2, unitPriceINR: 280 },
      { name: 'Bar Handle 128mm',              sku: 'HW-HDL-128',  qty: 1, unitPriceINR: 220 },
    ],
    cutList: [
      { label: 'Side Panel',   qty: 2, length: 600, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Top Panel',    qty: 1, length: 414, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Bottom Panel', qty: 1, length: 414, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Shelf',        qty: 2, length: 414, width: 314, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Door',         qty: 1, length: 564, width: 414, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Back Panel',   qty: 1, length: 564, width: 450, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
    ],
  },
  {
    id: 'KW-600-2D', sku: 'KW-600-2D', name: 'Wall 600 – 2-Door 600H',
    category: 'kitchen-wall', width: 600, height: 600, depth: 350,
    laminateCode: 'CEN-0001-WT', laminateOptions: KT_LAMS,
    priceINR: 6200,
    description: '600mm wall unit, 600H. 2 doors + 2 shelves. Standard upper cabinet.',
    hardwareList: [
      { name: 'Hettich Clip Top Hinge 110°', sku: 'HTK-CTH-110', qty: 4, unitPriceINR: 150 },
      { name: 'Wall Bracket Set',             sku: 'HW-WB-02',    qty: 2, unitPriceINR: 280 },
      { name: 'Bar Handle 128mm',              sku: 'HW-HDL-128',  qty: 2, unitPriceINR: 220 },
    ],
    cutList: [
      { label: 'Side Panel',   qty: 2, length: 600, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Top Panel',    qty: 1, length: 564, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Bottom Panel', qty: 1, length: 564, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Shelf',        qty: 2, length: 564, width: 314, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Door',         qty: 2, length: 564, width: 297, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Back Panel',   qty: 1, length: 564, width: 600, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
    ],
  },
  {
    id: 'KW-750-2D', sku: 'KW-750-2D', name: 'Wall 750 – 2-Door 750H',
    category: 'kitchen-wall', width: 750, height: 750, depth: 350,
    laminateCode: 'CEN-0001-WT', laminateOptions: KT_LAMS,
    priceINR: 7800,
    description: '750mm wall unit, 750H. 2 doors + 2 shelves. Taller upper run configuration.',
    hardwareList: [
      { name: 'Hettich Clip Top Hinge 110°', sku: 'HTK-CTH-110', qty: 4, unitPriceINR: 150 },
      { name: 'Wall Bracket Set',             sku: 'HW-WB-02',    qty: 2, unitPriceINR: 280 },
      { name: 'Bar Handle 128mm',              sku: 'HW-HDL-128',  qty: 2, unitPriceINR: 220 },
    ],
    cutList: [
      { label: 'Side Panel',   qty: 2, length: 750, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Top Panel',    qty: 1, length: 714, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Bottom Panel', qty: 1, length: 714, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Shelf',        qty: 2, length: 714, width: 314, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Door',         qty: 2, length: 714, width: 357, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Back Panel',   qty: 1, length: 714, width: 750, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
    ],
  },
  {
    id: 'KW-900-LFT', sku: 'KW-900-LFT', name: 'Wall 900 – Lift-Up 750H',
    category: 'kitchen-wall', width: 900, height: 750, depth: 350,
    laminateCode: 'CEN-0001-WT', laminateOptions: KT_LAMS,
    priceINR: 9500,
    description: '900mm wall unit, 750H. Lift-up flap (Hettich Free-flap). Ideal above hob.',
    hardwareList: [
      { name: 'Hettich Free-Flap 1.5',       sku: 'HTK-LUP-15',  qty: 2, unitPriceINR: 1400 },
      { name: 'Wall Bracket Set',             sku: 'HW-WB-02',    qty: 2, unitPriceINR: 280  },
      { name: 'Edge Pull Handle',              sku: 'HW-HDL-EP',   qty: 1, unitPriceINR: 180  },
    ],
    cutList: [
      { label: 'Side Panel',    qty: 2, length: 750, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Top Panel',     qty: 1, length: 864, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Bottom Panel',  qty: 1, length: 864, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Shelf',         qty: 1, length: 864, width: 314, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Lift-Up Front', qty: 1, length: 714, width: 882, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Back Panel',    qty: 1, length: 714, width: 900, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
    ],
  },

  // ── TALL COLUMN ── Grid: 450/600/900 W × 600 D × 2100/2400 H ─────────────────
  // Full-height columns: pantry, oven housing, fridge surround, pull-out larder.
  {
    id: 'TC-450-PNT', sku: 'TC-450-PNT', name: 'Tall Column 450 – Pantry',
    category: 'tall-column', width: 450, height: 2100, depth: 600,
    laminateCode: 'CEN-0001-WT', laminateOptions: KT_LAMS,
    priceINR: 16000,
    description: '450mm pantry column, 2100H. 6 adjustable shelves, 2-door. Pulls to full ceiling.',
    hardwareList: [
      { name: 'Hettich Clip Top Hinge 110°', sku: 'HTK-CTH-110',  qty: 4,  unitPriceINR: 150 },
      { name: 'Shelf Support Pin',            sku: 'HW-PIN-5',     qty: 24, unitPriceINR: 8   },
      { name: 'Bar Handle 128mm',              sku: 'HW-HDL-128',   qty: 2,  unitPriceINR: 220 },
      { name: 'Cam Lock',                      sku: 'HW-CAM-15',   qty: 10, unitPriceINR: 12  },
    ],
    cutList: [
      { label: 'Side Panel',   qty: 2, length: 2100, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Top Panel',    qty: 1, length: 414,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Bottom Panel', qty: 1, length: 414,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Shelf',        qty: 6, length: 414,  width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Door',         qty: 2, length: 1044, width: 207, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Back Panel',   qty: 1, length: 2064, width: 450, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
    ],
  },
  {
    id: 'TC-600-PNT', sku: 'TC-600-PNT', name: 'Tall Column 600 – Pantry',
    category: 'tall-column', width: 600, height: 2100, depth: 600,
    laminateCode: 'CEN-0001-WT', laminateOptions: KT_LAMS,
    priceINR: 19500,
    description: '600mm pantry column, 2100H. 6 adjustable shelves, 2-door. Full-height larder.',
    hardwareList: [
      { name: 'Hettich Clip Top Hinge 110°', sku: 'HTK-CTH-110',  qty: 4,  unitPriceINR: 150 },
      { name: 'Shelf Support Pin',            sku: 'HW-PIN-5',     qty: 24, unitPriceINR: 8   },
      { name: 'Bar Handle 128mm',              sku: 'HW-HDL-128',   qty: 2,  unitPriceINR: 220 },
      { name: 'Cam Lock',                      sku: 'HW-CAM-15',   qty: 10, unitPriceINR: 12  },
    ],
    cutList: [
      { label: 'Side Panel',   qty: 2, length: 2100, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Top Panel',    qty: 1, length: 564,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Bottom Panel', qty: 1, length: 564,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Shelf',        qty: 6, length: 564,  width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Door',         qty: 2, length: 1044, width: 282, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Back Panel',   qty: 1, length: 2064, width: 600, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
    ],
  },
  {
    id: 'TC-600-OVN', sku: 'TC-600-OVN', name: 'Tall Column 600 – Oven Housing',
    category: 'tall-column', width: 600, height: 2100, depth: 600,
    laminateCode: 'CEN-5502-GY', laminateOptions: KT_LAMS,
    priceINR: 22000,
    description: '600mm oven housing column, 2100H. Mid-height oven cutout + storage above/below.',
    hardwareList: [
      { name: 'Hettich Clip Top Hinge 110°', sku: 'HTK-CTH-110', qty: 4,  unitPriceINR: 150 },
      { name: 'Shelf Support Pin',            sku: 'HW-PIN-5',    qty: 8,  unitPriceINR: 8   },
      { name: 'Bar Handle 128mm',              sku: 'HW-HDL-128',  qty: 2,  unitPriceINR: 220 },
      { name: 'Cam Lock',                      sku: 'HW-CAM-15',  qty: 8,  unitPriceINR: 12  },
    ],
    cutList: [
      { label: 'Side Panel',        qty: 2, length: 2100, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-5502-GY' },
      { label: 'Top Panel',         qty: 1, length: 564,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-5502-GY' },
      { label: 'Bottom Panel',      qty: 1, length: 564,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-5502-GY' },
      { label: 'Oven Deck',         qty: 1, length: 564,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-5502-GY' },
      { label: 'Upper Shelf',       qty: 2, length: 564,  width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-5502-GY' },
      { label: 'Door (above oven)', qty: 1, length: 600,  width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-5502-GY' },
      { label: 'Door (below oven)', qty: 1, length: 456,  width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-5502-GY' },
      { label: 'Back Panel',        qty: 1, length: 2064, width: 600, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-5502-GY' },
    ],
  },
  {
    id: 'TC-900-FRG', sku: 'TC-900-FRG', name: 'Tall Column 900 – Fridge Surround',
    category: 'tall-column', width: 900, height: 2100, depth: 600,
    laminateCode: 'CEN-0001-WT', laminateOptions: KT_LAMS,
    priceINR: 25000,
    description: '900mm fridge surround, 2100H. Bridge storage above fridge, side panels.',
    hardwareList: [
      { name: 'Hettich Clip Top Hinge 110°', sku: 'HTK-CTH-110', qty: 2,  unitPriceINR: 150 },
      { name: 'Shelf Support Pin',            sku: 'HW-PIN-5',    qty: 4,  unitPriceINR: 8   },
      { name: 'Bar Handle 128mm',              sku: 'HW-HDL-128',  qty: 1,  unitPriceINR: 220 },
      { name: 'Cam Lock',                      sku: 'HW-CAM-15',  qty: 4,  unitPriceINR: 12  },
    ],
    cutList: [
      { label: 'Side Panel',        qty: 2, length: 2100, width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Top Bridge Panel',  qty: 1, length: 864,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Bottom Panel',      qty: 1, length: 864,  width: 600, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Bridge Shelf',      qty: 1, length: 864,  width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Bridge Door',       qty: 1, length: 420,  width: 882, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
      { label: 'Top Back Panel',    qty: 1, length: 420,  width: 900, thickness: 9,  grainDirection: 'length', laminateCode: 'CEN-0001-WT' },
    ],
  },

  // ── TV UNITS ──────────────────────────────────────────────────────────────────
  {
    id: 'TV-900-STD', sku: 'TV-900-STD', name: 'TV Unit 900 – Full Height',
    category: 'tv-unit', width: 900, height: 1800, depth: 350,
    laminateCode: 'CEN-0916-WD', laminateOptions: TV_LAMS,
    priceINR: 22000,
    description: '900mm full-height TV wall unit. Open shelves + lower shuttered storage.',
    hardwareList: [
      { name: 'Adjustable Shelf Pin',        sku: 'HW-PIN-5',    qty: 16, unitPriceINR: 8   },
      { name: 'Hettich Clip Top Hinge 110°', sku: 'HTK-CTH-110', qty: 4,  unitPriceINR: 150 },
      { name: 'Bar Handle 128mm',             sku: 'HW-HDL-128',  qty: 2,  unitPriceINR: 220 },
    ],
    cutList: [
      { label: 'Side Panel',   qty: 2, length: 1800, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Top Panel',    qty: 1, length: 864,  width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Bottom Panel', qty: 1, length: 864,  width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Fixed Shelf',  qty: 3, length: 864,  width: 332, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Door',         qty: 2, length: 420,  width: 432, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
    ],
  },
  {
    id: 'TV-900-FLT', sku: 'TV-900-FLT', name: 'TV Console 900 – Floating',
    category: 'tv-unit', width: 900, height: 450, depth: 400,
    laminateCode: 'CEN-0916-WD', laminateOptions: TV_LAMS,
    priceINR: 18500,
    description: '900mm floating TV console. 2 shuttered bays, push-to-open, wall-mounted.',
    hardwareList: [
      { name: 'Hettich Clip Top Hinge 110°', sku: 'HTK-CTH-110', qty: 4, unitPriceINR: 150 },
      { name: 'Wall Mount Bracket Heavy',     sku: 'HW-WB-04',    qty: 4, unitPriceINR: 320 },
      { name: 'Push-to-Open Latch',           sku: 'HW-PTO-01',   qty: 2, unitPriceINR: 95  },
    ],
    cutList: [
      { label: 'Top Panel',    qty: 1, length: 864, width: 400, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Bottom Panel', qty: 1, length: 864, width: 400, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Side Panel',   qty: 2, length: 414, width: 400, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Divider',      qty: 1, length: 414, width: 382, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
      { label: 'Door',         qty: 2, length: 408, width: 432, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-0916-WD' },
    ],
  },

  // ── UTILITY ───────────────────────────────────────────────────────────────────
  {
    id: 'UT-900-DSK', sku: 'UT-900-DSK', name: 'Study Desk 900 – Floating',
    category: 'utility', width: 900, height: 750, depth: 500,
    laminateCode: 'CEN-1812-MT', laminateOptions: ['CEN-1812-MT', 'CEN-0916-WD', 'CEN-3301-WD'],
    priceINR: 9800,
    description: '900mm floating study desk with pedestal sides and overhead shelf.',
    hardwareList: [
      { name: 'Desk Bracket Heavy Duty', sku: 'HW-DKB-02', qty: 2, unitPriceINR: 450 },
      { name: 'Cable Grommet 60mm',       sku: 'HW-CG-60',  qty: 2, unitPriceINR: 85  },
    ],
    cutList: [
      { label: 'Desk Top',       qty: 1, length: 900, width: 500, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Side Pedestal',  qty: 2, length: 700, width: 500, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
    ],
  },
  {
    id: 'UT-600-SHOE', sku: 'UT-600-SHOE', name: 'Shoe Rack 600 – 4 Shelf',
    category: 'utility', width: 600, height: 1200, depth: 350,
    laminateCode: 'CEN-1812-MT', laminateOptions: ['CEN-1812-MT', 'CEN-0916-WD'],
    priceINR: 7200,
    description: '600mm shoe rack, 4 angled shelves + top storage with door.',
    hardwareList: [
      { name: 'Hettich Clip Top Hinge 110°', sku: 'HTK-CTH-110', qty: 2, unitPriceINR: 150 },
      { name: 'Bar Handle 128mm',              sku: 'HW-HDL-128',  qty: 1, unitPriceINR: 220 },
    ],
    cutList: [
      { label: 'Side Panel',    qty: 2, length: 1200, width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Top Panel',     qty: 1, length: 564,  width: 350, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Shelf (angled)',qty: 4, length: 564,  width: 330, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
      { label: 'Door',          qty: 1, length: 594,  width: 564, thickness: 18, grainDirection: 'length', laminateCode: 'CEN-1812-MT' },
    ],
  },
]

export const getModuleById = (id: string) =>
  MODULE_CATALOG.find(m => m.id === id)

export const getModulesByCategory = (cat: string) =>
  MODULE_CATALOG.filter(m => m.category === cat)
