import type { BOQ, HardwareItem } from '../../types'

export default function HardwareMap({ boq }: { boq: BOQ }) {
  const hwMap = new Map<string, HardwareItem & { totalQty: number; totalCost: number; rooms: string[] }>()

  for (const li of boq.lineItems) {
    for (const hw of li.hardware) {
      const existing = hwMap.get(hw.sku)
      if (existing) {
        existing.totalQty += hw.qty
        existing.totalCost += hw.qty * hw.unitPriceINR
        if (!existing.rooms.includes(li.roomName)) existing.rooms.push(li.roomName)
      } else {
        hwMap.set(hw.sku, {
          ...hw,
          totalQty: hw.qty,
          totalCost: hw.qty * hw.unitPriceINR,
          rooms: [li.roomName],
        })
      }
    }
  }

  const items = Array.from(hwMap.values())
  const grandTotal = items.reduce((s, h) => s + h.totalCost, 0)

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 bg-blue-400 rounded-full" />
        <h2 className="text-base font-semibold text-ink">Hardware Map</h2>
        <span className="text-xs text-ink-3 ml-1">({items.length} line items)</span>
      </div>
      <div className="bg-card rounded-xl overflow-hidden border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-canvas text-ink-3 uppercase tracking-wider text-[10px]">
              <th className="text-left px-3 py-2.5">Item</th>
              <th className="text-left px-3 py-2.5">SKU</th>
              <th className="text-left px-3 py-2.5">Rooms</th>
              <th className="text-right px-3 py-2.5">Qty</th>
              <th className="text-right px-3 py-2.5">Unit ₹</th>
              <th className="text-right px-3 py-2.5">Total ₹</th>
            </tr>
          </thead>
          <tbody>
            {items.map((hw, i) => (
              <tr key={i} className="border-t border-border hover:bg-canvas transition-colors">
                <td className="px-3 py-2 text-ink">{hw.name}</td>
                <td className="px-3 py-2 font-mono text-ink-3 text-[10px]">{hw.sku}</td>
                <td className="px-3 py-2 text-ink-3">{hw.rooms.join(', ')}</td>
                <td className="px-3 py-2 text-right font-bold text-ink">{hw.totalQty}</td>
                <td className="px-3 py-2 text-right text-ink-2">
                  {hw.unitPriceINR.toLocaleString('en-IN')}
                </td>
                <td className="px-3 py-2 text-right font-semibold text-ink">
                  {hw.totalCost.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-canvas border-t border-border">
              <td colSpan={5} className="px-3 py-2.5 text-xs font-semibold text-ink">
                Hardware Total
              </td>
              <td className="px-3 py-2.5 text-right font-bold text-accent">
                ₹{grandTotal.toLocaleString('en-IN')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
