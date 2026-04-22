import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { RotateCw, Trash2 } from 'lucide-react'
import { useDesignStore } from '../../store/designStore'
import { getModuleById } from '../../data/modules'
import type { PlacedModule } from '../../types'

const CELL_SIZE = 50

const CATEGORY_BG: Record<string, string> = {
  'wardrobe':      'rgba(200,168,122,0.82)',
  'kitchen-base':  'rgba(107,143,163,0.82)',
  'kitchen-wall':  'rgba(107,143,163,0.60)',
  'tv-unit':       'rgba(138,122,181,0.82)',
  'utility':       'rgba(122,181,138,0.82)',
}

interface Props {
  placedModule: PlacedModule
}

export default function ModuleBlock({ placedModule }: Props) {
  const { instanceId, moduleId, x, y, rotation } = placedModule
  const module = getModuleById(moduleId)
  if (!module) return null

  const isSelected   = useDesignStore(s => s.selectedInstanceId === instanceId)
  const selectModule = useDesignStore(s => s.selectModule)
  const removeModule = useDesignStore(s => s.removeModule)
  const rotateModule = useDesignStore(s => s.rotateModule)

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `placed-${instanceId}`,
      data: { type: 'placed', instanceId },
    })

  const isRotated = rotation === 90 || rotation === 270
  const canvasW = isRotated
    ? Math.ceil(module.depth / 300) * CELL_SIZE
    : Math.ceil(module.width / 300) * CELL_SIZE
  const canvasH = isRotated
    ? Math.ceil(module.width / 300) * CELL_SIZE
    : Math.ceil(module.depth / 300) * CELL_SIZE

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={e => { e.stopPropagation(); selectModule(instanceId) }}
      style={{
        position: 'absolute',
        left: x * CELL_SIZE,
        top: y * CELL_SIZE,
        width: canvasW,
        height: canvasH,
        transform: CSS.Translate.toString(transform),
        rotate: `${rotation}deg`,
        backgroundColor: CATEGORY_BG[module.category] ?? 'rgba(120,120,120,0.8)',
        opacity: isDragging ? 0.4 : 1,
        zIndex: isSelected ? 20 : 10,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        borderRadius: 3,
        border: isSelected ? '2px solid #FF6B35' : '1px solid rgba(255,255,255,0.15)',
        boxShadow: isSelected ? '0 0 0 2px rgba(255,107,53,0.3)' : 'none',
        transition: 'box-shadow 0.15s, border-color 0.15s',
      }}
    >
      {/* Module label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-1 overflow-hidden">
        <span className="text-[9px] font-bold text-white/90 text-center leading-tight">
          {module.name.split(' ').slice(0, 3).join(' ')}
        </span>
        <span className="text-[8px] text-white/60 font-mono mt-0.5">
          {module.width}mm
        </span>
      </div>

      {/* Selected action buttons */}
      {isSelected && (
        <div
          className="absolute -top-7 right-0 flex gap-1"
          style={{ rotate: `${-rotation}deg` }}
        >
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); rotateModule(instanceId) }}
            className="w-6 h-6 bg-[#2A2A2A] border border-white/10 rounded flex items-center justify-center hover:bg-accent/20 transition-colors"
          >
            <RotateCw size={11} className="text-white/70" />
          </button>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); removeModule(instanceId); selectModule(null) }}
            className="w-6 h-6 bg-[#2A2A2A] border border-white/10 rounded flex items-center justify-center hover:bg-red-500/30 transition-colors"
          >
            <Trash2 size={11} className="text-red-400" />
          </button>
        </div>
      )}
    </div>
  )
}
