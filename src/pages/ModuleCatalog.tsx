import { useState } from 'react'
import { Search } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { MODULE_CATALOG, LAMINATE_PALETTE } from '../data/modules'
import type { ModuleCategory } from '../types'

const CATEGORIES: { key: ModuleCategory | 'all'; label: string }[] = [
  { key: 'all',          label: 'All' },
  { key: 'wardrobe',     label: 'Wardrobes' },
  { key: 'kitchen-base', label: 'Kitchen Base' },
  { key: 'kitchen-wall', label: 'Kitchen Wall' },
  { key: 'tv-unit',      label: 'TV Units' },
  { key: 'utility',      label: 'Utility' },
]

const CATEGORY_COLORS: Record<string, string> = {
  'wardrobe':      'rgba(200,168,122,0.7)',
  'kitchen-base':  'rgba(107,143,163,0.7)',
  'kitchen-wall':  'rgba(107,143,163,0.5)',
  'tv-unit':       'rgba(138,122,181,0.7)',
  'utility':       'rgba(122,181,138,0.7)',
}

export default function ModuleCatalog() {
  const [search,  setSearch]  = useState('')
  const [cat,     setCat]     = useState<ModuleCategory | 'all'>('all')

  const filtered = MODULE_CATALOG.filter(m =>
    (cat === 'all' || m.category === cat) &&
    (
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.sku.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
    )
  )

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Module Catalog</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {MODULE_CATALOG.length} standard SKUs · Drag into Design Studio to place
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search SKUs..."
              className="bg-sidebar border border-white/8 rounded-lg pl-8 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:border-accent outline-none transition-colors w-56"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors
                  ${cat === c.key ? 'bg-accent text-white' : 'bg-sidebar text-white/50 hover:text-white border border-white/5'}`}
              >
                {c.label}
                <span className="ml-1.5 text-[10px] opacity-60">
                  {c.key === 'all' ? MODULE_CATALOG.length : MODULE_CATALOG.filter(m => m.category === c.key).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <Search size={24} className="mx-auto mb-3 opacity-50" />
            <p>No modules match your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(m => (
              <div
                key={m.id}
                className="bg-sidebar rounded-xl p-4 border border-white/5 hover:border-white/15 transition-all"
              >
                {/* Color bar */}
                <div
                  className="w-full h-1 rounded-full mb-3"
                  style={{ backgroundColor: CATEGORY_COLORS[m.category] ?? '#888' }}
                />

                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-semibold text-white leading-tight flex-1 pr-2">
                    {m.name}
                  </h3>
                  <span className="text-sm font-bold text-accent shrink-0">
                    ₹{(m.priceINR / 1000).toFixed(0)}K
                  </span>
                </div>

                <p className="text-[10px] text-white/30 font-mono mb-2">{m.sku}</p>

                <p className="text-xs text-white/40 mb-3 leading-relaxed line-clamp-2">
                  {m.description}
                </p>

                {/* Dimensions */}
                <div className="flex gap-1 mb-3 flex-wrap">
                  <Chip>{m.width}mm W</Chip>
                  <Chip>{m.height}mm H</Chip>
                  <Chip>{m.depth}mm D</Chip>
                </div>

                {/* Stats */}
                <div className="flex justify-between text-[10px] text-white/30 mb-3">
                  <span>{m.cutList.length} panels</span>
                  <span>{m.hardwareList.length} hw items</span>
                  <span>{m.cutList.reduce((s, p) => s + p.qty, 0)} pcs</span>
                </div>

                {/* Laminate swatches */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/20">Laminates:</span>
                  {m.laminateOptions.map(code => {
                    const pal = LAMINATE_PALETTE[code]
                    return (
                      <div
                        key={code}
                        title={pal?.name ?? code}
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: pal?.hex ?? '#888' }}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded font-mono">
      {children}
    </span>
  )
}
