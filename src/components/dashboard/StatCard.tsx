interface Props {
  label: string
  value: string | number
  sub?: string
  progress?: number
  progressColor?: string
}

export default function StatCard({ label, value, sub, progress, progressColor = '#E85228' }: Props) {
  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      <p className="text-[11px] text-ink-3 uppercase tracking-widest font-medium mb-3">{label}</p>
      <p className="font-serif text-3xl font-normal text-ink leading-none mb-1">{value}</p>
      {sub && <p className="text-xs text-ink-2 mt-1">{sub}</p>}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: progressColor }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
