interface Props {
  spent: number
  total: number
}

export default function BudgetMeter({ spent, total }: Props) {
  const pct   = total > 0 ? Math.min((spent / total) * 100, 100) : 0
  const color = pct < 60 ? '#22C55E' : pct < 85 ? '#F59E0B' : '#EF4444'
  const remaining = Math.max(total - spent, 0)

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-xs text-white/40">Budget</span>
        <span className="text-xs font-semibold" style={{ color }}>
          ₹{(spent / 100000).toFixed(1)}L / ₹{(total / 100000).toFixed(1)}L
        </span>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden mb-1.5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-white/30">
        <span>{pct.toFixed(0)}% used</span>
        <span>₹{(remaining / 100000).toFixed(1)}L left</span>
      </div>
    </div>
  )
}
