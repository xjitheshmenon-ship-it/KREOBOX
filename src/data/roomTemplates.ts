import type { Room } from '../types'

export const ROOM_TEMPLATES: Record<string, Omit<Room, 'id'>[]> = {
  Studio: [
    { name: 'Main Room', widthMM: 4500, depthMM: 3600, placedModules: [] },
    { name: 'Kitchen',   widthMM: 2100, depthMM: 1800, placedModules: [] },
  ],
  '1BHK': [
    { name: 'Bedroom',    widthMM: 3600, depthMM: 3000, placedModules: [] },
    { name: 'Kitchen',    widthMM: 2700, depthMM: 2100, placedModules: [] },
    { name: 'Living Room',widthMM: 4200, depthMM: 3600, placedModules: [] },
  ],
  '2BHK': [
    { name: 'Master Bedroom', widthMM: 3900, depthMM: 3600, placedModules: [] },
    { name: 'Bedroom 2',      widthMM: 3000, depthMM: 3000, placedModules: [] },
    { name: 'Kitchen',        widthMM: 3000, depthMM: 2400, placedModules: [] },
    { name: 'Living Room',    widthMM: 5100, depthMM: 3600, placedModules: [] },
  ],
  '3BHK': [
    { name: 'Master Bedroom', widthMM: 4500, depthMM: 3900, placedModules: [] },
    { name: 'Bedroom 2',      widthMM: 3600, depthMM: 3000, placedModules: [] },
    { name: 'Bedroom 3',      widthMM: 3300, depthMM: 2700, placedModules: [] },
    { name: 'Kitchen',        widthMM: 3600, depthMM: 2700, placedModules: [] },
    { name: 'Living Room',    widthMM: 6000, depthMM: 4200, placedModules: [] },
  ],
}

export const FLAT_TYPE_LABELS: Record<string, string> = {
  Studio: '1 room · Kitchen',
  '1BHK':  '1 bedroom · Kitchen · Living',
  '2BHK':  '2 bedrooms · Kitchen · Living',
  '3BHK':  '3 bedrooms · Kitchen · Living',
}
