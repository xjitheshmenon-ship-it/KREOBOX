import { useNavigate, useParams } from 'react-router-dom'
import { FileText, ChevronRight } from 'lucide-react'
import { useDesignStore } from '../../store/designStore'

export default function TopBar() {
  const navigate      = useNavigate()
  const { id }        = useParams<{ id: string }>()
  const project       = useDesignStore(s => s.getActiveProject())
  const activeRoomId  = useDesignStore(s => s.activeRoomId)
  const setActiveRoom = useDesignStore(s => s.setActiveRoom)

  return (
    <header className="h-13 bg-card border-b border-border flex items-center px-6 gap-4 shrink-0" style={{ height: 52 }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-ink-2">
        <button onClick={() => navigate('/')} className="hover:text-ink transition-colors">
          Projects
        </button>
        <ChevronRight size={13} className="text-ink-3" />
        <span className="text-ink font-medium truncate max-w-40">
          {project?.name ?? '—'}
        </span>
        {project && (
          <>
            <ChevronRight size={13} className="text-ink-3" />
            <span className="text-ink-2">{project.flatType}</span>
          </>
        )}
      </div>

      {/* Room tabs */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto ml-4">
        {project?.rooms.map(room => (
          <button
            key={room.id}
            onClick={() => setActiveRoom(room.id)}
            className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap transition-colors font-medium
              ${activeRoomId === room.id
                ? 'bg-accent text-white'
                : 'text-ink-2 hover:text-ink hover:bg-border'}`}
          >
            {room.name}
            {room.placedModules.length > 0 && (
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${activeRoomId === room.id ? 'bg-white/20' : 'bg-border'}`}>
                {room.placedModules.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-success font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          On track
        </div>
        <button
          onClick={() => navigate(`/projects/${id}/boq`)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <FileText size={13} /> Export BOQ
        </button>
      </div>
    </header>
  )
}
