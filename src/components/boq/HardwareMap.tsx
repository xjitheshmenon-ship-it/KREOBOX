import type { BOQ, HardwareItem } from '../../types'

export default function HardwareMap({ boq }: { boq: BOQ }) {
  // Aggregate hardware across all modules
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
        <h2 className="text-base font-bold text-white">Hardware Map</h2>
        <span className="text-xs text-white/30 ml-1">({items.length} line items)</span>
      </div>
      <div className="bg-sidebar rounded-xl overflow-hidden border border-white/5">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-white/5 text-white/30 uppercase tracking-wider text-[10px]">
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
              <tr key={i} className="border-t border-white/5 hover:bg-white/2">
                <td className="px-3 py-2 text-white">{hw.name}</td>
                <td className="px-3 py-2 font-mono text-white/40 text-[10px]">{hw.sku}</td>
                <td className="px-3 py-2 text-white/40">{hw.rooms.join(', ')}</td>
                <td className="px-3 py-2 text-right font-bold text-white">{hw.totalQty}</td>
                <td className="px-3 py-2 text-right text-white/60">
                  {hw.unitPriceINR.toLocaleString('en-IN')}
                </td>
                <td className="px-3 py-2 text-right font-semibold text-white">
                  {hw.totalCost.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-white/5 border-t border-white/10">
              <td colSpan={5} className="px-3 py-2.5 text-xs font-semibold text-white">
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
