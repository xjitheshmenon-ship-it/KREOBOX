import { useNavigate } from 'react-router-dom'
import { Plus, Layers, IndianRupee, Clock } from 'lucide-react'
import Layout from '../components/layout/Layout'
import StatCard from '../components/dashboard/StatCard'
import ProjectCard from '../components/dashboard/ProjectCard'
import { useDesignStore } from '../store/designStore'

export default function Dashboard() {
  const navigate   = useNavigate()
  const projects   = useDesignStore(s => s.projects)
  const setActive  = useDesignStore(s => s.setActiveProject)

  const totalPipeline = projects.reduce((s, p) => s + p.totalBudgetINR, 0)
  const totalModules  = projects.reduce((s, p) =>
    s + p.rooms.reduce((rs, r) => rs + r.placedModules.length, 0), 0)

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">DesignOS</h1>
            <p className="text-sm text-white/40 mt-0.5">KREOBOX Interior Platform</p>
          </div>
          <button
            onClick={() => navigate('/projects/new')}
            className="flex items-center gap-2 bg-accent hover:bg-orange-500 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            <Plus size={16} /> New Project
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Active Projects"
            value={projects.length}
            icon={<Layers size={18} />}
            sub="total in workspace"
          />
          <StatCard
            label="Total Pipeline"
            value={totalPipeline > 0 ? `₹${(totalPipeline / 100000).toFixed(1)}L` : '₹0'}
            icon={<IndianRupee size={18} />}
            sub="budgeted value"
          />
          <StatCard
            label="Modules Placed"
            value={totalModules}
            icon={<Clock size={18} />}
            sub="across all projects"
          />
        </div>

        {/* Projects */}
        <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
          Recent Projects
        </h2>

        {projects.length === 0 ? (
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-20 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-accent" />
            </div>
            <p className="text-white/60 font-medium mb-1">No projects yet</p>
            <p className="text-sm text-white/30 mb-5">
              Create your first project to start designing
            </p>
            <button
              onClick={() => navigate('/projects/new')}
              className="bg-accent hover:bg-orange-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
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
