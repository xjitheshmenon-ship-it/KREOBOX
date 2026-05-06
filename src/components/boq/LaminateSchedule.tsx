import type { BOQ } from '../../types'
import { LAMINATE_PALETTE } from '../../data/modules'

export default function LaminateSchedule({ boq }: { boq: BOQ }) {
  const rows = boq.lineItems.map(li => ({
    roomName: li.roomName,
    moduleName: li.moduleName,
    sku: li.sku,
    laminate: li.laminate,
    panels: li.panels.length,
    totalQty: li.panels.reduce((s, p) => s + p.qty, 0),
  }))

  const laminateGroups = new Map<string, { code: string; moduleCount: number; panelCount: number }>()
  for (const li of boq.lineItems) {
    const code = li.laminate
    const existing = laminateGroups.get(code)
    const panelCount = li.panels.reduce((s, p) => s + p.qty, 0)
    if (existing) {
      existing.moduleCount++
      existing.panelCount += panelCount
    } else {
      laminateGroups.set(code, { code, moduleCount: 1, panelCount })
    }
  }

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 bg-purple-400 rounded-full" />
        <h2 className="text-base font-semibold text-ink">Laminate Schedule</h2>
      </div>

      {laminateGroups.size > 0 && (
        <div className="flex gap-3 mb-4 flex-wrap">
          {Array.from(laminateGroups.values()).map(lg => {
            const pal = LAMINATE_PALETTE[lg.code]
            return (
              <div
                key={lg.code}
                className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2"
              >
                <div
                  className="w-5 h-5 rounded border border-border shrink-0"
                  style={{ backgroundColor: pal?.hex ?? '#888' }}
                />
                <div>
                  <p className="text-xs text-ink font-medium">{pal?.name ?? lg.code}</p>
                  <p className="text-[10px] text-ink-3 font-mono">{lg.code}</p>
                </div>
                <div className="ml-2 text-right">
                  <p className="text-xs text-accent font-bold">{lg.panelCount}</p>
                  <p className="text-[10px] text-ink-3">panels</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="bg-card rounded-xl overflow-hidden border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-canvas text-ink-3 uppercase tracking-wider text-[10px]">
              <th className="text-left px-3 py-2.5">Room</th>
              <th className="text-left px-3 py-2.5">Module</th>
              <th className="text-left px-3 py-2.5">Laminate</th>
              <th className="text-left px-3 py-2.5">Code</th>
              <th className="text-right px-3 py-2.5">Panels</th>
              <th className="text-right px-3 py-2.5">Pieces</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const pal = LAMINATE_PALETTE[r.laminate]
              return (
                <tr key={i} className="border-t border-border hover:bg-canvas transition-colors">
                  <td className="px-3 py-2 text-ink-3">{r.roomName}</td>
                  <td className="px-3 py-2 text-ink">{r.moduleName}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: pal?.hex ?? '#888' }}
                      />
                      <span className="text-ink-2">{pal?.name ?? r.laminate}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono text-ink-3 text-[10px]">{r.laminate}</td>
                  <td className="px-3 py-2 text-right text-ink-2">{r.panels}</td>
                  <td className="px-3 py-2 text-right font-bold text-ink">{r.totalQty}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
