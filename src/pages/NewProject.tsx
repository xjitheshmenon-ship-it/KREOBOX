import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useDesignStore } from '../store/designStore'
import { FLAT_TYPE_LABELS } from '../data/roomTemplates'
import type { Project } from '../types'

const FLAT_TYPES: Project['flatType'][] = ['Studio', '1BHK', '2BHK', '3BHK']

export default function NewProject() {
  const navigate      = useNavigate()
  const createProject = useDesignStore(s => s.createProject)

  const [step, setStep]         = useState<1 | 2>(1)
  const [flatType, setFlatType] = useState<Project['flatType']>('2BHK')
  const [name, setName]         = useState('')
  const [client, setClient]     = useState('')
  const [budget, setBudget]     = useState(1000000)

  const handleCreate = () => {
    const id = createProject(
      name.trim() || 'Untitled Project',
      client.trim() || 'Client',
      flatType,
      budget
    )
    navigate(`/projects/${id}/design`)
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-8">
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          <Step n={1} active={step === 1} done={step > 1} label="Room Template" />
          <div className="flex-1 h-px bg-white/10" />
          <Step n={2} active={step === 2} done={false} label="Project Details" />
        </div>

        {step === 1 && (
          <div>
            <h1 className="text-xl font-bold mb-1">Choose flat type</h1>
            <p className="text-sm text-white/40 mb-6">
              We'll pre-load room templates so you can start designing immediately.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {FLAT_TYPES.map(ft => (
                <button
                  key={ft}
                  onClick={() => setFlatType(ft)}
                  className={`p-5 rounded-xl border-2 text-left transition-all
                    ${flatType === ft
                      ? 'border-accent bg-accent/10'
                      : 'border-white/8 bg-sidebar hover:border-white/20'}`}
                >
                  <p className={`text-xl font-bold mb-1 ${flatType === ft ? 'text-accent' : 'text-white'}`}>
                    {ft}
                  </p>
                  <p className="text-xs text-white/40 leading-snug">
                    {FLAT_TYPE_LABELS[ft]}
                  </p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-orange-500 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-xl font-bold mb-1">Project details</h1>
            <p className="text-sm text-white/40 mb-6">
              Set the project name, client, and budget to track your design.
            </p>
            <div className="space-y-4 mb-6">
              <Field
                label="Project Name"
                value={name}
                onChange={setName}
                placeholder="Sharma Residence 2BHK"
              />
              <Field
                label="Client Name"
                value={client}
                onChange={setClient}
                placeholder="Ramesh Sharma"
              />
              <div>
                <label className="block text-sm text-white/50 mb-2">Total Budget</label>
                <div className="flex items-center gap-3 bg-sidebar border border-white/8 rounded-lg px-4 py-3">
                  <span className="text-white/40 text-sm">₹</span>
                  <input
                    type="range"
                    min={300000}
                    max={3000000}
                    step={100000}
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-white font-semibold text-sm w-14 text-right">
                    {(budget / 100000).toFixed(1)}L
                  </span>
                </div>
                <p className="text-xs text-white/30 mt-1">
                  Recommended ₹8–12L for a full {flatType} fit-out
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 border border-white/10 rounded-lg text-white/50 hover:text-white transition-colors text-sm"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-orange-500 text-white py-3 rounded-lg font-medium text-sm transition-colors"
              >
                <Check size={16} /> Create Project
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

function Step({ n, active, done, label }: { n: number; active: boolean; done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
          ${done ? 'bg-green-500 text-white' : active ? 'bg-accent text-white' : 'bg-white/10 text-white/40'}`}
      >
        {done ? <Check size={12} /> : n}
      </div>
      <span className={`text-sm ${active ? 'text-white' : 'text-white/40'}`}>{label}</span>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div>
      <label className="block text-sm text-white/50 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-sidebar border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-accent outline-none transition-colors"
      />
    </div>
  )
}
