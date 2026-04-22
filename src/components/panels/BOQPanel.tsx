import { useDesignStore } from '../../store/designStore'
import { computeBOQ, getProjectSpend } from '../../store/boqUtils'
import { getModuleById } from '../../data/modules'
import BudgetMeter from './BudgetMeter'
import ModuleProperties from './ModuleProperties'

export default function BOQPanel() {
  const project    = useDesignStore(s => s.getActiveProject())
  const room       = useDesignStore(s => s.getActiveRoom())
  const selectedId = useDesignStore(s => s.selectedInstanceId)

  if (!project || !room) {
    return <aside className="w-72 bg-sidebar border-l border-white/5 shrink-0" />
  }

  const spent   = getProjectSpend(project)
  const roomBOQ = computeBOQ(project.id, room.name, room.placedModules)

  return (
    <aside className="w-72 bg-sidebar border-l border-white/5 flex flex-col overflow-hidden shrink-0">
      {/* Budget meter — always visible */}
      <div className="p-4 border-b border-white/5">
        <BudgetMeter spent={spent} total={project.totalBudgetINR} />
      </div>

      {/* Content: module properties if selected, else room BOQ */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedId ? (
          <ModuleProperties instanceId={selectedId} />
        ) : (
          <>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-3">
              {room.name} — Live BOQ
            </p>

            {roomBOQ.lineItems.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs text-white/20">No modules placed yet</p>
                <p className="text-[10px] text-white/15 mt-1">
                  Drag from the left panel
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1.5 mb-4">
                  {roomBOQ.lineItems.map(li => {
                    const mod = getModuleById(li.sku.split('-BWP')[0] + '-' + li.sku.split('-')[1] + '-' + li.sku.split('-')[2])
                    return (
                      <div key={li.instanceId} className="bg-[#222] rounded-lg p-2.5">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white font-medium truncate">{li.moduleName}</p>
                            <p className="text-[10px] text-white/30 font-mono">{li.sku}</p>
                          </div>
                          <span className="text-xs font-semibold text-accent ml-2 shrink-0">
                            ₹{(li.unitPriceINR / 1000).toFixed(1)}K
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Room subtotal */}
                <div className="border-t border-white/8 pt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Material</span>
                    <span className="text-white/70">₹{(roomBOQ.totalMaterialINR / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Hardware</span>
                    <span className="text-white/70">₹{(roomBOQ.totalHardwareINR / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold mt-1 pt-1 border-t border-white/8">
                    <span className="text-white">Room Total</span>
                    <span className="text-accent">₹{(roomBOQ.totalINR / 100000).toFixed(2)}L</span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* All-rooms total at bottom */}
      {project.rooms.some(r => r.placedModules.length > 0) && (
        <div className="p-4 border-t border-white/5 bg-[#1E1E1E]">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/40">Project Total</span>
            <span className="text-white font-semibold">
              ₹{(spent / 100000).toFixed(2)}L
            </span>
          </div>
          <p className="text-[10px] text-white/20">
            {project.rooms.reduce((s, r) => s + r.placedModules.length, 0)} modules across {project.rooms.length} rooms
          </p>
        </div>
      )}
    </aside>
  )
}
