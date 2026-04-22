import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import { useDesignStore } from '../../store/designStore'

export default function TopBar() {
  const navigate      = useNavigate()
  const { id }        = useParams<{ id: string }>()
  const project       = useDesignStore(s => s.getActiveProject())
  const activeRoomId  = useDesignStore(s => s.activeRoomId)
  const setActiveRoom = useDesignStore(s => s.setActiveRoom)

  return (
    <header className="h-12 bg-sidebar border-b border-white/5 flex items-center px-4 gap-3 shrink-0">
      <button
        onClick={() => navigate('/')}
        className="text-white/40 hover:text-white transition-colors p-1"
      >
        <ArrowLeft size={16} />
      </button>

      <div className="w-px h-5 bg-white/10" />

      <span className="text-sm font-medium text-white/80 truncate max-w-48">
        {project?.name ?? '—'}
      </span>

      {project && (
        <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
          {project.flatType}
        </span>
      )}

      {/* Room tabs */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto ml-2">
        {project?.rooms.map(room => (
          <button
            key={room.id}
            onClick={() => setActiveRoom(room.id)}
            className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap transition-colors font-medium
              ${activeRoomId === room.id
                ? 'bg-accent/20 text-accent'
                : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            {room.name}
            {room.placedModules.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">
                {room.placedModules.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate(`/projects/${id}/boq`)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-orange-500 text-white text-xs font-medium rounded-lg transition-colors shrink-0"
      >
        <FileText size={13} /> Export BOQ
      </button>
    </header>
  )
}
