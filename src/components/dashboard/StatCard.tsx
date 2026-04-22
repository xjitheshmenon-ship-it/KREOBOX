interface Props {
  label: string
  value: string | number
  icon: React.ReactNode
  sub?: string
}

export default function StatCard({ label, value, icon, sub }: Props) {
  return (
    <div className="bg-sidebar rounded-xl p-5 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white/40 uppercase tracking-wider font-medium">{label}</span>
        <span className="text-white/20">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
    </div>
  )
}
