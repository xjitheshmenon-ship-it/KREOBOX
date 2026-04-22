import { useEffect } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { useDesignStore } from '../../store/designStore'
import ModuleBlock from './ModuleBlock'
import RoomGrid from './RoomGrid'

const CELL_SIZE = 50

export default function DesignCanvas() {
  const { setNodeRef } = useDroppable({ id: 'design-canvas' })
  const room           = useDesignStore(s => s.getActiveRoom())
  const selectModule   = useDesignStore(s => s.selectModule)
  const selectedId     = useDesignStore(s => s.selectedInstanceId)
  const removeModule   = useDesignStore(s => s.removeModule)

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selectModule(null)
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        const tag = (e.target as HTMLElement).tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          removeModule(selectedId)
          selectModule(null)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, removeModule, selectModule])

  if (!room) {
    return (
      <div className="flex-1 bg-[#141414] flex items-center justify-center text-white/20 text-sm">
        No room selected
      </div>
    )
  }

  const cols = Math.ceil(room.widthMM / 300)
  const rows = Math.ceil(room.depthMM / 300)
  const W    = cols * CELL_SIZE
  const H    = rows * CELL_SIZE

  return (
    <div
      className="flex-1 overflow-auto bg-[#141414] flex items-center justify-center p-8"
      onClick={() => selectModule(null)}
    >
      {/* Room canvas */}
      <div
        id="design-canvas"
        ref={setNodeRef}
        className="relative bg-[#1C1C1C] shadow-2xl"
        style={{ width: W, height: H }}
      >
        <RoomGrid cols={cols} rows={rows} cellSize={CELL_SIZE} />

        {/* Room dimension label */}
        <div className="absolute -top-6 left-0 text-xs text-white/30 font-mono">
          {room.name} · {(room.widthMM / 1000).toFixed(1)}m × {(room.depthMM / 1000).toFixed(1)}m
        </div>

        {/* Width ruler */}
        <div className="absolute -bottom-5 left-0 right-0 flex justify-between text-[9px] text-white/20 font-mono px-0">
          {Array.from({ length: Math.ceil(room.widthMM / 600) + 1 }).map((_, i) => (
            <span key={i}>{i * 600}mm</span>
          ))}
        </div>

        {/* Empty state hint */}
        {room.placedModules.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-white/15 text-sm font-medium">
                Drag modules here
              </p>
              <p className="text-white/10 text-xs mt-1">
                from the panel on the left
              </p>
            </div>
          </div>
        )}

        {/* Placed modules */}
        {room.placedModules.map(pm => (
          <ModuleBlock key={pm.instanceId} placedModule={pm} />
        ))}
      </div>
    </div>
  )
}
