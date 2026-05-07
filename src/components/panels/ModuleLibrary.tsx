import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { MODULE_CATALOG } from '../../data/modules'
import type { Module } from '../../types'

const CATEGORIES = [
  { key: 'wardrobe',      label: 'Wardrobes',    color: '#C8A87A' },
  { key: 'kitchen-base',  label: 'Kitchen Base', color: '#6B8FA3' },
  { key: 'kitchen-wall',  label: 'Kitchen Wall', color: '#5A7E96' },
  { key: 'tall-column',   label: 'Tall Column',  color: '#D4956A' },
  { key: 'tv-unit',       label: 'TV Units',     color: '#8A7AB5' },
  { key: 'utility',       label: 'Utility',      color: '#6AA87A' },
]

export default function ModuleLibrary() {
  const [activeCat, setActiveCat] = useState('wardrobe')
  const filtered  = MODULE_CATALOG.filter(m => m.category === activeCat)
  const catColor  = CATEGORIES.find(c => c.key === activeCat)?.color ?? '#888'

  return (
    <aside className="w-56 bg-card border-r border-border flex flex-col overflow-hidden shrink-0">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <p className="text-[10px] text-ink-3 uppercase tracking-widest font-medium mb-3">
          Module Library
        </p>
        <div className="space-y-0.5">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setActiveCat(c.key)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2
                ${activeCat === c.key
                  ? 'bg-accent/8 text-ink'
                  : 'text-ink-2 hover:text-ink hover:bg-canvas'}`}
              style={activeCat === c.key ? { backgroundColor: `${c.color}18` } : {}}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
              {c.label}
              <span className="ml-auto text-ink-3 text-[10px]">
                {MODULE_CATALOG.filter(m => m.category === c.key).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-2 border-b border-border">
        <p className="text-[10px] text-ink-3">Drag onto canvas to place</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.map(m => (
          <DraggableCard key={m.id} module={m} accentColor={catColor} />
        ))}
      </div>
    </aside>
  )
}

function DraggableCard({ module, accentColor }: { module: Module; accentColor: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${module.id}`,
    data: { moduleId: module.id },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`bg-canvas rounded-lg p-2.5 cursor-grab border border-border
        hover:border-accent/30 hover:shadow-sm transition-all select-none
        ${isDragging ? 'opacity-30 scale-95' : ''}`}
    >
      <div className="flex items-start justify-between gap-1 mb-1.5">
        <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: accentColor }} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-ink leading-snug">{module.name}</p>
          <p className="text-[10px] text-ink-3 font-mono">{module.sku}</p>
        </div>
        <span className="text-xs font-semibold text-accent shrink-0 ml-1">
          ₹{(module.priceINR / 1000).toFixed(0)}K
        </span>
      </div>
      <div className="flex gap-1">
        <Chip>{module.width}mm</Chip>
        <Chip>{module.height}H</Chip>
        <Chip>{module.depth}D</Chip>
      </div>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[9px] bg-border text-ink-3 px-1.5 py-0.5 rounded font-mono">{children}</span>
  )
}
