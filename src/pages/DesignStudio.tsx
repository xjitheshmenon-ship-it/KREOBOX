import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  pointerWithin,
} from '@dnd-kit/core'
import { useDesignStore } from '../store/designStore'
import TopBar from '../components/layout/TopBar'
import ModuleLibrary from '../components/panels/ModuleLibrary'
import DesignCanvas from '../components/canvas/DesignCanvas'
import BOQPanel from '../components/panels/BOQPanel'

const CELL_SIZE = 50

export default function DesignStudio() {
  const { id }           = useParams<{ id: string }>()
  const setActiveProject = useDesignStore(s => s.setActiveProject)
  const moveModule       = useDesignStore(s => s.moveModule)
  const placeModule      = useDesignStore(s => s.placeModule)
  const room             = useDesignStore(s => s.getActiveRoom())

  useEffect(() => {
    if (id) setActiveProject(id)
  }, [id, setActiveProject])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    const data = active.data.current

    const canvas = document.getElementById('design-canvas')
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()

    if (data?.type === 'placed') {
      // Moving an already-placed module
      const placed = room?.placedModules.find(m => m.instanceId === data.instanceId)
      if (!placed) return
      const newX = Math.max(0, Math.round(placed.x + delta.x / CELL_SIZE))
      const newY = Math.max(0, Math.round(placed.y + delta.y / CELL_SIZE))
      moveModule(data.instanceId, newX, newY)
    } else if (data?.moduleId) {
      // Dropping from the library
      const pointerX = (event.activatorEvent as PointerEvent).clientX + delta.x - rect.left
      const pointerY = (event.activatorEvent as PointerEvent).clientY + delta.y - rect.top

      if (pointerX < 0 || pointerY < 0 || pointerX > rect.width || pointerY > rect.height) return

      const gridX = Math.max(0, Math.round(pointerX / CELL_SIZE))
      const gridY = Math.max(0, Math.round(pointerY / CELL_SIZE))
      placeModule(data.moduleId, gridX, gridY)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-canvas overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          collisionDetection={pointerWithin}
        >
          <ModuleLibrary />
          <DesignCanvas />
          <BOQPanel />
        </DndContext>
      </div>
    </div>
  )
}
