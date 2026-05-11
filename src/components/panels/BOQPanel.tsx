import { useDesignStore } from '../../store/designStore'
import { computeBOQ, getProjectSpend } from '../../store/boqUtils'
import BudgetMeter from './BudgetMeter'
import ModuleProperties from './ModuleProperties'

export default function BOQPanel() {
  const project    = useDesignStore(s => s.getActiveProject())
  const room       = useDesignStore(s => s.getActiveRoom())
  const selectedId = useDesignStore(s => s.selectedInstanceId)

  if (!project || !room) {
    return <aside className="w-72 bg-card border-l border-border shrink-0" />
  }

  const spent   = getProjectSpend(project)
  const roomBOQ = computeBOQ(project.id, room.name, room.placedModules)

  return (
    <aside className="w-72 bg-card border-l border-border flex flex-col overflow-hidden shrink-0">
      {/* Budget meter */}
      <div className="p-4 border-b border-border">
        <BudgetMeter spent={spent} total={project.totalBudgetINR} />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedId ? (
          <ModuleProperties instanceId={selectedId} />
        ) : (
          <>
            <p className="text-[10px] text-ink-3 uppercase tracking-widest font-medium mb-3">
              {room.name} — Live BOQ
            </p>

            {roomBOQ.lineItems.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs text-ink-3">No modules placed yet</p>
                <p className="text-[10px] text-ink-3/60 mt-1">Drag from the left panel</p>
              </div>
            ) : (
              <>
                <div className="space-y-1.5 mb-4">
                  {roomBOQ.lineItems.map(li => (
                    <div key={li.instanceId} className="bg-canvas rounded-lg p-2.5 border border-border">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-ink font-medium truncate">{li.moduleName}</p>
                          <p className="text-[10px] text-ink-3 font-mono">{li.sku}</p>
                        </div>
                        <span className="text-xs font-semibold text-accent ml-2 shrink-0">
                          ₹{(li.unitPriceINR / 1000).toFixed(1)}K
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-3">Material</span>
                    <span className="text-ink-2">₹{(roomBOQ.totalMaterialINR / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-3">Hardware</span>
                    <span className="text-ink-2">₹{(roomBOQ.totalHardwareINR / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold mt-1 pt-2 border-t border-border">
                    <span className="text-ink">Room Total</span>
                    <span className="text-accent">₹{(roomBOQ.totalINR / 100000).toFixed(2)}L</span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {project.rooms.some(r => r.placedModules.length > 0) && (
        <div className="p-4 border-t border-border bg-canvas">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-ink-3">Project Total</span>
            <span className="text-ink font-semibold">₹{(spent / 100000).toFixed(2)}L</span>
          </div>
          <p className="text-[10px] text-ink-3">
            {project.rooms.reduce((s, r) => s + r.placedModules.length, 0)} modules · {project.rooms.length} rooms
          </p>
        </div>
      )}
    </aside>
  )
}
