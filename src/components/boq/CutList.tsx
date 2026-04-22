import type { BOQ } from '../../types'

export default function CutList({ boq }: { boq: BOQ }) {
  const allPanels = boq.lineItems.flatMap(li =>
    li.panels.map(p => ({
      ...p,
      roomName: li.roomName,
      moduleName: li.moduleName,
      sku: li.sku,
    }))
  )

  const totalPanels = allPanels.reduce((s, p) => s + p.qty, 0)

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 bg-accent rounded-full" />
        <h2 className="text-base font-bold text-white">Panel Cut-List</h2>
        <span className="text-xs text-white/30 ml-1">({totalPanels} panels)</span>
      </div>
      <div className="bg-sidebar rounded-xl overflow-hidden border border-white/5">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-white/5 text-white/30 uppercase tracking-wider text-[10px]">
              <th className="text-left px-3 py-2.5">Room</th>
              <th className="text-left px-3 py-2.5">Module</th>
              <th className="text-left px-3 py-2.5">Panel</th>
              <th className="text-right px-3 py-2.5">L mm</th>
              <th className="text-right px-3 py-2.5">W mm</th>
              <th className="text-right px-3 py-2.5">T mm</th>
              <th className="text-right px-3 py-2.5">Qty</th>
              <th className="text-left px-3 py-2.5">Laminate</th>
              <th className="text-left px-3 py-2.5">Grain</th>
            </tr>
          </thead>
          <tbody>
            {allPanels.map((p, i) => (
              <tr
                key={i}
                className="border-t border-white/5 hover:bg-white/2 transition-colors"
              >
                <td className="px-3 py-2 text-white/40">{p.roomName}</td>
                <td className="px-3 py-2 font-mono text-accent/80 text-[10px]">{p.sku}</td>
                <td className="px-3 py-2 text-white">{p.label}</td>
                <td className="px-3 py-2 text-right font-mono text-white/70">{p.length}</td>
                <td className="px-3 py-2 text-right font-mono text-white/70">{p.width}</td>
                <td className="px-3 py-2 text-right font-mono text-white/70">{p.thickness}</td>
                <td className="px-3 py-2 text-right font-mono text-white font-bold">{p.qty}</td>
                <td className="px-3 py-2 font-mono text-white/40 text-[10px]">{p.laminateCode}</td>
                <td className="px-3 py-2 text-white/40 capitalize">{p.grainDirection}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-white/5 border-t border-white/10">
              <td colSpan={6} className="px-3 py-2.5 text-xs font-semibold text-white">
                Total Panels
              </td>
              <td className="px-3 py-2.5 text-right font-bold text-accent">{totalPanels}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
