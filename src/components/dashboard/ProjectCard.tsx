import type { Project } from '../../types'
import { getProjectSpend } from '../../store/boqUtils'
import { Calendar, Home } from 'lucide-react'

interface Props {
  project: Project
  onOpen: () => void
}

const STATUS: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Draft',      cls: 'bg-border text-ink-2' },
  designing: { label: 'Designing',  cls: 'bg-accent/10 text-accent' },
  complete:  { label: 'Complete',   cls: 'bg-success-bg text-success' },
}

export default function ProjectCard({ project, onOpen }: Props) {
  const spent = getProjectSpend(project)
  const pct   = Math.min((spent / project.totalBudgetINR) * 100, 100)
  const totalModules = project.rooms.reduce((s, r) => s + r.placedModules.length, 0)
  const { label, cls } = STATUS[project.status] ?? STATUS.draft

  return (
    <button
      onClick={onOpen}
      className="bg-card rounded-xl p-5 border border-border hover:border-accent/40 hover:shadow-md text-left transition-all group w-full"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg text-ink group-hover:text-accent transition-colors truncate leading-snug">
            {project.name}
          </h3>
          <p className="text-xs text-ink-2 mt-0.5">{project.clientName}</p>
        </div>
        <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ml-2 shrink-0 ${cls}`}>
          {label}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4 text-xs text-ink-3">
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
          <span className="text-ink-3">Budget used</span>
          <span className="text-ink-2 font-medium">
            ₹{(spent / 100000).toFixed(1)}L
            <span className="text-ink-3 font-normal"> / ₹{(project.totalBudgetINR / 100000).toFixed(1)}L</span>
          </span>
        </div>
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              backgroundColor: pct < 60 ? '#3CAF6A' : pct < 85 ? '#F59E0B' : '#E85228',
            }}
          />
        </div>
      </div>
    </button>
  )
}
