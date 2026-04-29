import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { Project, PlacedModule, Room } from '../types'
import { ROOM_TEMPLATES } from '../data/roomTemplates'
import { getModuleById } from '../data/modules'

interface DesignState {
  projects: Project[]
  activeProjectId: string | null
  activeRoomId: string | null
  selectedInstanceId: string | null

  getActiveProject: () => Project | null
  getActiveRoom: () => Room | null

  createProject: (
    name: string,
    clientName: string,
    flatType: Project['flatType'],
    budget: number,
    customRooms?: Array<{ name: string; widthMM: number; depthMM: number }>
  ) => string
  setActiveProject: (id: string) => void
  setActiveRoom: (id: string) => void

  placeModule: (moduleId: string, x: number, y: number) => void
  moveModule: (instanceId: string, x: number, y: number) => void
  removeModule: (instanceId: string) => void
  selectModule: (instanceId: string | null) => void
  updateModuleLaminate: (instanceId: string, laminateCode: string) => void
  rotateModule: (instanceId: string) => void
}

export const useDesignStore = create<DesignState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,
      activeRoomId: null,
      selectedInstanceId: null,

      getActiveProject: () => {
        const { projects, activeProjectId } = get()
        return projects.find(p => p.id === activeProjectId) ?? null
      },

      getActiveRoom: () => {
        const project = get().getActiveProject()
        if (!project) return null
        return project.rooms.find(r => r.id === get().activeRoomId) ?? null
      },

      createProject: (name, clientName, flatType, budget, customRooms) => {
        const id = uuid()
        const template = customRooms ?? ROOM_TEMPLATES[flatType] ?? []
        const rooms: Room[] = template.map(r => ({
          ...r,
          id: uuid(),
          placedModules: [],
        }))
        const project: Project = {
          id, name, clientName, flatType,
          totalBudgetINR: budget,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'draft',
          rooms,
        }
        set(s => ({
          projects: [...s.projects, project],
          activeProjectId: id,
          activeRoomId: rooms[0]?.id ?? null,
        }))
        return id
      },

      setActiveProject: (id) => {
        const project = get().projects.find(p => p.id === id)
        if (!project) return
        set({ activeProjectId: id, activeRoomId: project.rooms[0]?.id ?? null })
      },

      setActiveRoom: (id) => set({ activeRoomId: id, selectedInstanceId: null }),

      placeModule: (moduleId, x, y) => {
        const mod = getModuleById(moduleId)
        if (!mod) return
        const instance: PlacedModule = {
          instanceId: uuid(),
          moduleId,
          x,
          y,
          rotation: 0,
          snapSide: 'free',
          selectedLaminateCode: mod.laminateCode,
        }
        set((s: DesignState) => updateRoom(s, s.activeRoomId!, room => ({
          ...room,
          placedModules: [...room.placedModules, instance],
        })))
      },

      moveModule: (instanceId: string, x: number, y: number) => {
        set((s: DesignState) => updateRoom(s, s.activeRoomId!, room => ({
          ...room,
          placedModules: room.placedModules.map(m =>
            m.instanceId === instanceId ? { ...m, x, y } : m
          ),
        })))
      },

      removeModule: (instanceId: string) => {
        set((s: DesignState) => updateRoom(s, s.activeRoomId!, room => ({
          ...room,
          placedModules: room.placedModules.filter(m => m.instanceId !== instanceId),
        })))
      },

      selectModule: (instanceId) => set({ selectedInstanceId: instanceId }),

      updateModuleLaminate: (instanceId: string, laminateCode: string) => {
        set((s: DesignState) => updateRoom(s, s.activeRoomId!, room => ({
          ...room,
          placedModules: room.placedModules.map(m =>
            m.instanceId === instanceId ? { ...m, selectedLaminateCode: laminateCode } : m
          ),
        })))
      },

      rotateModule: (instanceId: string) => {
        set((s: DesignState) => updateRoom(s, s.activeRoomId!, room => ({
          ...room,
          placedModules: room.placedModules.map(m => {
            if (m.instanceId !== instanceId) return m
            const next = ((m.rotation + 90) % 360) as PlacedModule['rotation']
            return { ...m, rotation: next }
          }),
        })))
      },
    }),
    {
      name: 'designos-v1',
      partialize: (state: DesignState) => ({ projects: state.projects }),
    }
  )
)

function updateRoom(
  state: DesignState,
  roomId: string,
  updater: (r: Room) => Room
): Partial<DesignState> {
  return {
    projects: state.projects.map(p =>
      p.id !== state.activeProjectId ? p : {
        ...p,
        updatedAt: new Date().toISOString(),
        rooms: p.rooms.map(r => r.id === roomId ? updater(r) : r),
      }
    ),
  }
}
