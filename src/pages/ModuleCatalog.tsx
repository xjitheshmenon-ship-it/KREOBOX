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

const CAT_COLOR: Record<string, string> = {
  'wardrobe':      '#C8A87A',
  'kitchen-base':  '#6B8FA3',
  'kitchen-wall':  '#5A7E96',
  'tv-unit':       '#8A7AB5',
  'utility':       '#6AA87A',
}

export default function ModuleCatalog() {
  const [search, setSearch] = useState('')
  const [cat,    setCat]    = useState<ModuleCategory | 'all'>('all')

  const filtered = MODULE_CATALOG.filter(m =>
    (cat === 'all' || m.category === cat) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) ||
     m.sku.toLowerCase().includes(search.toLowerCase()) ||
     m.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-[11px] text-ink-3 uppercase tracking-widest font-medium mb-1">Library</p>
          <h1 className="font-serif text-3xl text-ink">Module Catalog</h1>
          <p className="text-sm text-ink-2 mt-1">
            {MODULE_CATALOG.length} standard SKUs · Drag into Design Studio to place
          </p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search SKUs..."
              className="bg-card border border-border rounded-lg pl-8 pr-4 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-accent outline-none transition-colors w-56"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => setCat(c.key)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors
                  ${cat === c.key ? 'bg-accent text-white' : 'bg-card text-ink-2 hover:text-ink border border-border'}`}>
                {c.label}
                <span className="ml-1.5 text-[10px] opacity-60">
                  {c.key === 'all' ? MODULE_CATALOG.length : MODULE_CATALOG.filter(m => m.category === c.key).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-ink-3">
            <Search size={24} className="mx-auto mb-3 opacity-50" />
            <p>No modules match your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(m => (
              <div key={m.id} className="bg-card rounded-xl p-4 border border-border hover:border-accent/30 hover:shadow-sm transition-all">
                <div className="w-full h-1 rounded-full mb-3" style={{ backgroundColor: CAT_COLOR[m.category] ?? '#888' }} />
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-semibold text-ink leading-tight flex-1 pr-2">{m.name}</h3>
                  <span className="text-sm font-bold text-accent shrink-0">₹{(m.priceINR / 1000).toFixed(0)}K</span>
                </div>
                <p className="text-[10px] text-ink-3 font-mono mb-2">{m.sku}</p>
                <p className="text-xs text-ink-2 mb-3 leading-relaxed line-clamp-2">{m.description}</p>
                <div className="flex gap-1 mb-3 flex-wrap">
                  <Chip>{m.width}mm W</Chip>
                  <Chip>{m.height}mm H</Chip>
                  <Chip>{m.depth}mm D</Chip>
                </div>
                <div className="flex justify-between text-[10px] text-ink-3 mb-3">
                  <span>{m.cutList.length} panels</span>
                  <span>{m.hardwareList.length} hw items</span>
                  <span>{m.cutList.reduce((s, p) => s + p.qty, 0)} pcs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-ink-3">Laminates:</span>
                  {m.laminateOptions.map(code => {
                    const pal = LAMINATE_PALETTE[code]
                    return (
                      <div key={code} title={pal?.name ?? code}
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: pal?.hex ?? '#888' }} />
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
    <span className="text-[10px] bg-canvas text-ink-3 px-2 py-0.5 rounded font-mono border border-border">{children}</span>
  )
}
