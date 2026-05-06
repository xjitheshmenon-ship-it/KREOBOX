import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Layout from '../components/layout/Layout'
import StatCard from '../components/dashboard/StatCard'
import ProjectCard from '../components/dashboard/ProjectCard'
import { useDesignStore } from '../store/designStore'
import { getProjectSpend } from '../store/boqUtils'

export default function Dashboard() {
  const navigate  = useNavigate()
  const projects  = useDesignStore(s => s.projects)
  const setActive = useDesignStore(s => s.setActiveProject)

  const totalBudget   = projects.reduce((s, p) => s + p.totalBudgetINR, 0)
  const totalSpent    = projects.reduce((s, p) => s + getProjectSpend(p), 0)
  const totalModules  = projects.reduce((s, p) =>
    s + p.rooms.reduce((rs, r) => rs + r.placedModules.length, 0), 0)
  const budgetPct     = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] text-ink-3 uppercase tracking-widest font-medium mb-1">
              Interior Platform
            </p>
            <h1 className="font-serif text-4xl text-ink leading-none">DesignOS</h1>
          </div>
          <button
            onClick={() => navigate('/projects/new')}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            <Plus size={16} /> New Project
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Active Projects"
            value={projects.length}
            sub="in workspace"
          />
          <StatCard
            label="Total Pipeline"
            value={totalBudget > 0 ? `₹${(totalBudget / 100000).toFixed(1)}L` : '₹0'}
            sub="budgeted value"
          />
          <StatCard
            label="Modules Placed"
            value={totalModules}
            sub="across all projects"
          />
          <StatCard
            label="Budget Used"
            value={totalBudget > 0 ? `₹${(totalSpent / 100000).toFixed(1)}L` : '₹0'}
            sub={`of ₹${(totalBudget / 100000).toFixed(1)}L · ${budgetPct.toFixed(0)}%`}
            progress={budgetPct}
            progressColor="#3CAF6A"
          />
        </div>

        {/* Projects */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] text-ink-3 uppercase tracking-widest font-medium">
            Recent Projects
          </h2>
          {projects.length > 0 && (
            <button
              onClick={() => navigate('/projects/new')}
              className="text-xs text-accent hover:text-accent-hover font-medium transition-colors"
            >
              + New project
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-2xl p-20 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-accent" />
            </div>
            <p className="text-ink font-medium mb-1">No projects yet</p>
            <p className="text-sm text-ink-2 mb-5">
              Create your first project to start designing
            </p>
            <button
              onClick={() => navigate('/projects/new')}
              className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...projects].reverse().map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                onOpen={() => { setActive(p.id); navigate(`/projects/${p.id}/design`) }}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
