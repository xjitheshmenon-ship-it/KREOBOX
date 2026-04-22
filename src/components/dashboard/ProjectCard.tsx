import type { Project } from '../../types'
import { getProjectSpend } from '../../store/boqUtils'
import { Calendar, Home } from 'lucide-react'

interface Props {
  project: Project
  onOpen: () => void
}

const STATUS_COLORS: Record<string, string> = {
  draft:     'bg-white/10 text-white/50',
  designing: 'bg-blue-500/20 text-blue-400',
  complete:  'bg-green-500/20 text-green-400',
}

export default function ProjectCard({ project, onOpen }: Props) {
  const spent = getProjectSpend(project)
  const pct   = Math.min((spent / project.totalBudgetINR) * 100, 100)
  const totalModules = project.rooms.reduce((s, r) => s + r.placedModules.length, 0)

  return (
    <button
      onClick={onOpen}
      className="bg-sidebar rounded-xl p-5 border border-white/5 hover:border-accent/30 text-left transition-all hover:bg-[#1E1E1E] group w-full"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate group-hover:text-accent transition-colors">
            {project.name}
          </h3>
          <p className="text-xs text-white/40 mt-0.5">{project.clientName}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 shrink-0 ${STATUS_COLORS[project.status]}`}>
          {project.status}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4 text-xs text-white/40">
        <span className="flex items-center gap-1">
          <Home size={11} /> {project.flatType}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={11} /> {new Date(project.createdAt).toLocaleDateString('en-IN')}
        </span>
        <span>{totalModules} modules</span>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-white/40">Budget used</span>
          <span className="text-white/60">
            ₹{(spent / 100000).toFixed(1)}L / ₹{(project.totalBudgetINR / 100000).toFixed(1)}L
          </span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              backgroundColor: pct < 60 ? '#22C55E' : pct < 85 ? '#F59E0B' : '#EF4444',
            }}
          />
        </div>
      </div>
    </button>
  )
}
