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
        <h2 className="text-base font-semibold text-ink">Panel Cut-List</h2>
        <span className="text-xs text-ink-3 ml-1">({totalPanels} panels)</span>
      </div>
      <div className="bg-card rounded-xl overflow-hidden border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-canvas text-ink-3 uppercase tracking-wider text-[10px]">
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
                className="border-t border-border hover:bg-canvas transition-colors"
              >
                <td className="px-3 py-2 text-ink-3">{p.roomName}</td>
                <td className="px-3 py-2 font-mono text-accent text-[10px]">{p.sku}</td>
                <td className="px-3 py-2 text-ink">{p.label}</td>
                <td className="px-3 py-2 text-right font-mono text-ink-2">{p.length}</td>
                <td className="px-3 py-2 text-right font-mono text-ink-2">{p.width}</td>
                <td className="px-3 py-2 text-right font-mono text-ink-2">{p.thickness}</td>
                <td className="px-3 py-2 text-right font-mono text-ink font-bold">{p.qty}</td>
                <td className="px-3 py-2 font-mono text-ink-3 text-[10px]">{p.laminateCode}</td>
                <td className="px-3 py-2 text-ink-3 capitalize">{p.grainDirection}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-canvas border-t border-border">
              <td colSpan={6} className="px-3 py-2.5 text-xs font-semibold text-ink">
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
