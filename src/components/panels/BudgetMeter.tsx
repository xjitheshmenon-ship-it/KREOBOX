interface Props {
  spent: number
  total: number
}

export default function BudgetMeter({ spent, total }: Props) {
  const pct       = total > 0 ? Math.min((spent / total) * 100, 100) : 0
  const color     = pct < 60 ? '#3CAF6A' : pct < 85 ? '#F59E0B' : '#E85228'
  const remaining = Math.max(total - spent, 0)

  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[10px] text-ink-3 uppercase tracking-widest font-medium">Budget</span>
        <span className="text-xs font-semibold" style={{ color }}>
          {pct.toFixed(0)}%
        </span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-ink-3">
        <span>₹{(spent / 100000).toFixed(1)}L used</span>
        <span>₹{(remaining / 100000).toFixed(1)}L left</span>
      </div>
    </div>
  )
}
