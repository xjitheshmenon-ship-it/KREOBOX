export type ProductType = 'wardrobe' | 'kitchen' | 'office'

export type OrderStage =
  | 'Quoted'
  | 'Confirmed'
  | 'In Cut-list'
  | 'Cut'
  | 'Edge-banded'
  | 'Packed'
  | 'Dispatched'
  | 'Installing'
  | 'Installed'

export interface KBCustomer {
  name: string
  phone: string
  city: string
  area: string
}

export interface OrderConfig {
  type: ProductType
  wallWidth: number
  height: number
  frames: string[]
  walls: string[]
  shutter: string
  preset: string
}

export interface OrderPanel {
  id: string
  name: string
  qty: number
  lam: string
  status: 'pending' | 'cut' | 'edge-banded' | 'packed'
}

export interface KBOrder {
  id: string
  customer: KBCustomer
  contractor: string
  type: ProductType
  config: OrderConfig
  advance: number
  total: number
  stage: OrderStage
  createdAt: string
  panels: OrderPanel[]
}

export interface LaminateStock {
  id: string
  label: string
  sheets: number
  reorderAt: number
}

export interface HardwareStock {
  id: string
  label: string
  units: number
  reorderAt: number
}

export interface KBInventory {
  laminates: LaminateStock[]
  hardware: HardwareStock[]
}

export interface Lead {
  id: string
  customer: KBCustomer
  type: ProductType
  showroomId?: string
  advance: number
  total: number
}
