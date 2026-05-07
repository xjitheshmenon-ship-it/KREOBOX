export type ModuleCategory =
  | 'wardrobe'
  | 'kitchen-base'
  | 'kitchen-wall'
  | 'tall-column'
  | 'tv-unit'
  | 'utility'

export type StandardWidth = 300 | 450 | 600 | 750 | 900

export interface Panel {
  label: string
  qty: number
  length: number
  width: number
  thickness: 9 | 18
  grainDirection: 'length' | 'width'
  laminateCode: string
}

export interface HardwareItem {
  name: string
  sku: string
  qty: number
  unitPriceINR: number
}

export interface Module {
  id: string
  sku: string
  name: string
  category: ModuleCategory
  width: StandardWidth
  height: number
  depth: number
  laminateCode: string
  laminateOptions: string[]
  hardwareList: HardwareItem[]
  cutList: Panel[]
  priceINR: number
  description: string
}

export interface PlacedModule {
  instanceId: string
  moduleId: string
  x: number
  y: number
  rotation: 0 | 90 | 180 | 270
  selectedLaminateCode: string
  snapSide: 'north' | 'east' | 'south' | 'west' | 'free'
}

export interface Room {
  id: string
  name: string
  widthMM: number
  depthMM: number
  placedModules: PlacedModule[]
}

export type ProjectStatus = 'draft' | 'designing' | 'complete'

export interface Project {
  id: string
  name: string
  clientName: string
  flatType: 'Studio' | '1BHK' | '2BHK' | '3BHK'
  totalBudgetINR: number
  createdAt: string
  updatedAt: string
  status: ProjectStatus
  rooms: Room[]
}

export interface BOQLineItem {
  roomName: string
  instanceId: string
  sku: string
  moduleName: string
  qty: 1
  unitPriceINR: number
  laminate: string
  panels: Panel[]
  hardware: HardwareItem[]
}

export interface BOQ {
  projectId: string
  generatedAt: string
  lineItems: BOQLineItem[]
  totalMaterialINR: number
  totalHardwareINR: number
  totalINR: number
}
