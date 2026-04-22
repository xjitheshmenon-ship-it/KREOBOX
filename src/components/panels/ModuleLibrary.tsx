import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { MODULE_CATALOG } from '../../data/modules'
import type { Module } from '../../types'

const CATEGORIES = [
  { key: 'wardrobe',      label: 'Wardrobes',     color: 'rgba(200,168,122,0.7)' },
  { key: 'kitchen-base',  label: 'Kitchen Base',   color: 'rgba(107,143,163,0.7)' },
  { key: 'kitchen-wall',  label: 'Kitchen Wall',   color: 'rgba(107,143,163,0.5)' },
  { key: 'tv-unit',       label: 'TV Units',       color: 'rgba(138,122,181,0.7)' },
  { key: 'utility',       label: 'Utility',        color: 'rgba(122,181,138,0.7)' },
]

export default function ModuleLibrary() {
  const [activeCat, setActiveCat] = useState('wardrobe')
  const filtered = MODULE_CATALOG.filter(m => m.category === activeCat)
  const catColor = CATEGORIES.find(c => c.key === activeCat)?.color ?? '#888'

  return (
    <aside className="w-60 bg-sidebar border-r border-white/5 flex flex-col overflow-hidden shrink-0">
      {/* Category tabs */}
      <div className="p-3 border-b border-white/5">
        <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-2">
          Modules
        </p>
        <div className="space-y-0.5">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setActiveCat(c.key)}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-2
                ${activeCat === c.key
                  ? 'bg-white/8 text-white'
                  : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: c.color }}
              />
              {c.label}
              <span className="ml-auto text-white/20 text-[10px]">
                {MODULE_CATALOG.filter(m => m.category === c.key).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Drag hint */}
      <div className="px-3 py-2 border-b border-white/5">
        <p className="text-[10px] text-white/20">Drag onto canvas to place</p>
      </div>

      {/* Module list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
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
      className={`bg-[#222] rounded-lg p-2.5 cursor-grab border border-transparent
        hover:border-white/10 transition-all select-none
        ${isDragging ? 'opacity-30 scale-95' : 'hover:bg-[#282828]'}`}
    >
      <div className="flex items-start justify-between gap-1 mb-1.5">
        <div
          className="w-2 h-2 rounded-full mt-1 shrink-0"
          style={{ backgroundColor: accentColor }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white leading-snug">{module.name}</p>
          <p className="text-[10px] text-white/30 font-mono">{module.sku}</p>
        </div>
        <span className="text-xs font-semibold text-accent shrink-0 ml-1">
          ₹{(module.priceINR / 1000).toFixed(0)}K
        </span>
      </div>
      <div className="flex gap-1">
        <span className="text-[9px] bg-white/5 text-white/30 px-1.5 py-0.5 rounded font-mono">
          {module.width}mm
        </span>
        <span className="text-[9px] bg-white/5 text-white/30 px-1.5 py-0.5 rounded font-mono">
          {module.height}H
        </span>
        <span className="text-[9px] bg-white/5 text-white/30 px-1.5 py-0.5 rounded font-mono">
          {module.depth}D
        </span>
      </div>
    </div>
  )
}
