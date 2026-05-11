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
      <div className="flex-1 bg-canvas flex items-center justify-center text-ink-3 text-sm">
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
      className="flex-1 overflow-auto bg-canvas flex items-center justify-center p-10"
      onClick={() => selectModule(null)}
    >
      <div>
        {/* Room label above */}
        <div className="mb-2 flex items-baseline gap-3">
          <span className="text-xs font-medium text-ink">{room.name}</span>
          <span className="text-xs text-ink-3 font-mono">
            {(room.widthMM / 1000).toFixed(1)}m × {(room.depthMM / 1000).toFixed(1)}m
          </span>
        </div>

        {/* Canvas */}
        <div
          id="design-canvas"
          ref={setNodeRef}
          className="relative bg-white shadow-lg"
          style={{ width: W, height: H }}
        >
          <RoomGrid cols={cols} rows={rows} cellSize={CELL_SIZE} />

          {room.placedModules.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-ink-3 text-sm font-medium">Drag modules here</p>
                <p className="text-ink-3/60 text-xs mt-1">from the panel on the left</p>
              </div>
            </div>
          )}

          {room.placedModules.map(pm => (
            <ModuleBlock key={pm.instanceId} placedModule={pm} />
          ))}
        </div>

        {/* Width ruler */}
        <div className="mt-1.5 flex justify-between text-[9px] text-ink-3 font-mono px-0" style={{ width: W }}>
          {Array.from({ length: Math.ceil(room.widthMM / 600) + 1 }).map((_, i) => (
            <span key={i}>{i * 600}mm</span>
          ))}
        </div>
      </div>
    </div>
  )
}
