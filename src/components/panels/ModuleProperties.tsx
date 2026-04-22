import { useDesignStore } from '../../store/designStore'
import { getModuleById, LAMINATE_PALETTE } from '../../data/modules'
import { RotateCw, Trash2 } from 'lucide-react'

interface Props {
  instanceId: string
}

export default function ModuleProperties({ instanceId }: Props) {
  const room            = useDesignStore(s => s.getActiveRoom())
  const updateLaminate  = useDesignStore(s => s.updateModuleLaminate)
  const rotateModule    = useDesignStore(s => s.rotateModule)
  const removeModule    = useDesignStore(s => s.removeModule)
  const selectModule    = useDesignStore(s => s.selectModule)

  const placed = room?.placedModules.find(m => m.instanceId === instanceId)
  const module = placed ? getModuleById(placed.moduleId) : null

  if (!placed || !module) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
          Selected Module
        </h3>
        <button
          onClick={() => { removeModule(instanceId); selectModule(null) }}
          className="p-1 text-red-400/60 hover:text-red-400 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="bg-[#222] rounded-lg p-3 mb-4">
        <p className="font-semibold text-sm text-white">{module.name}</p>
        <p className="text-xs text-white/40 font-mono mt-0.5">{module.sku}</p>
        <div className="flex gap-1.5 mt-2">
          <Chip>{module.width}mm W</Chip>
          <Chip>{module.height}mm H</Chip>
          <Chip>{module.depth}mm D</Chip>
        </div>
        <p className="text-accent font-semibold text-sm mt-2">
          ₹{module.priceINR.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Rotation */}
      <div className="mb-4">
        <p className="text-xs text-white/40 mb-2">Rotation: {placed.rotation}°</p>
        <button
          onClick={() => rotateModule(instanceId)}
          className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white bg-[#222] hover:bg-accent/20 px-3 py-2 rounded-lg transition-colors w-full"
        >
          <RotateCw size={13} /> Rotate 90°
        </button>
      </div>

      {/* Laminate selector */}
      <div>
        <p className="text-xs text-white/40 mb-2">Finish / Laminate</p>
        <div className="space-y-1.5">
          {module.laminateOptions.map(code => {
            const lam = LAMINATE_PALETTE[code]
            const isActive = placed.selectedLaminateCode === code
            return (
              <button
                key={code}
                onClick={() => updateLaminate(instanceId, code)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors
                  ${isActive ? 'bg-accent/20 border border-accent/40' : 'bg-[#222] border border-transparent hover:border-white/10'}`}
              >
                <div
                  className="w-4 h-4 rounded-full shrink-0 border border-white/20"
                  style={{ backgroundColor: lam?.hex ?? '#888' }}
                />
                <div>
                  <p className="text-xs text-white font-medium">{lam?.name ?? code}</p>
                  <p className="text-[10px] text-white/40 font-mono">{code}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Cut list preview */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-xs text-white/40 mb-2">{module.cutList.length} panels · {module.hardwareList.length} hardware items</p>
        <div className="space-y-1">
          {module.cutList.slice(0, 4).map((p, i) => (
            <div key={i} className="flex justify-between text-[10px] text-white/30">
              <span>{p.label} ×{p.qty}</span>
              <span className="font-mono">{p.length}×{p.width}×{p.thickness}</span>
            </div>
          ))}
          {module.cutList.length > 4 && (
            <p className="text-[10px] text-white/20">+{module.cutList.length - 4} more panels in BOQ</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] bg-white/8 text-white/50 px-2 py-0.5 rounded font-mono">
      {children}
    </span>
  )
}
