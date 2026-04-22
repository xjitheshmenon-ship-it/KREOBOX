import { useParams, useNavigate } from 'react-router-dom'
import { Printer, ArrowLeft, Package } from 'lucide-react'
import { useDesignStore } from '../store/designStore'
import { computeProjectBOQ } from '../store/boqUtils'
import Layout from '../components/layout/Layout'
import CutList from '../components/boq/CutList'
import HardwareMap from '../components/boq/HardwareMap'
import LaminateSchedule from '../components/boq/LaminateSchedule'

function SummaryCard({ label, value, sub, highlight }: {
  label: string; value: string; sub?: string; highlight?: boolean
}) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? 'bg-accent/10 border-accent/30' : 'bg-sidebar border-white/5'}`}>
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <p className={`text-xl font-bold ${highlight ? 'text-accent' : 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function BOQExport() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const project  = useDesignStore(s => s.projects.find(p => p.id === id))

  if (!project) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full text-white/40">
          Project not found.
        </div>
      </Layout>
    )
  }

  const boq          = computeProjectBOQ(project)
  const totalModules = project.rooms.reduce((s, r) => s + r.placedModules.length, 0)
  const totalPanels  = boq.lineItems.flatMap(li => li.panels).reduce((s, p) => s + p.qty, 0)
  const generatedDate = new Date(boq.generatedAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 no-print">
          <div>
            <button
              onClick={() => navigate(`/projects/${id}/design`)}
              className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors mb-3"
            >
              <ArrowLeft size={14} /> Back to Design
            </button>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-white/40 text-sm mt-0.5">
              BOQ &amp; Fabrication Pack · {project.flatType} · {project.clientName}
            </p>
            <p className="text-xs text-white/20 mt-1">Generated {generatedDate}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:border-white/20 transition-colors text-sm"
          >
            <Printer size={15} /> Print / PDF
          </button>
        </div>

        {/* Empty state */}
        {totalModules === 0 && (
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-16 text-center mb-8">
            <Package size={32} className="mx-auto text-white/20 mb-3" />
            <p className="text-white/40 font-medium">No modules placed yet</p>
            <p className="text-sm text-white/20 mt-1">
              Go back to the design canvas and add some modules first.
            </p>
          </div>
        )}

        {totalModules > 0 && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <SummaryCard label="Modules"       value={String(totalModules)}   sub="placed across all rooms" />
              <SummaryCard label="Material Cost" value={`₹${(boq.totalMaterialINR / 100000).toFixed(2)}L`} />
              <SummaryCard label="Hardware Cost" value={`₹${(boq.totalHardwareINR / 100000).toFixed(2)}L`} />
              <SummaryCard label="Project Total" value={`₹${(boq.totalINR / 100000).toFixed(2)}L`} highlight sub={`of ₹${(project.totalBudgetINR/100000).toFixed(1)}L budget`} />
            </div>

            {/* Room summary */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">Room Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {project.rooms.map(room => {
                  const roomItems = boq.lineItems.filter(li => li.roomName === room.name)
                  const roomTotal = roomItems.reduce((s, li) => s + li.unitPriceINR, 0)
                  return (
                    <div key={room.id} className="bg-sidebar rounded-xl p-3 border border-white/5">
                      <p className="text-xs font-semibold text-white mb-1">{room.name}</p>
                      <p className="text-lg font-bold text-accent">
                        ₹{(roomTotal / 1000).toFixed(0)}K
                      </p>
                      <p className="text-[10px] text-white/30 mt-0.5">
                        {roomItems.length} modules
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            <CutList boq={boq} />
            <HardwareMap boq={boq} />
            <LaminateSchedule boq={boq} />
          </>
        )}
      </div>
    </Layout>
  )
}
