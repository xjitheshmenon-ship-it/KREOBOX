import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KBOrder, KBInventory, OrderStage } from '../types/kreobox'
import { seedOrders, seedInventory } from '../data/catalog'

interface KreoboxState {
  orders: KBOrder[]
  inventory: KBInventory
  toast: string | null

  addOrder: (order: KBOrder) => void
  updateOrderStage: (orderId: string, stage: OrderStage) => void
  setInventory: (inv: KBInventory | ((prev: KBInventory) => KBInventory)) => void
  showToast: (msg: string) => void
  clearToast: () => void
}

export const useKreoboxStore = create<KreoboxState>()(
  persist(
    (set, get) => ({
      orders: seedOrders(),
      inventory: seedInventory(),
      toast: null,

      addOrder: (order) => {
        set(s => ({ orders: [order, ...s.orders] }))
        get().showToast(`New order ${order.id} created`)
      },

      updateOrderStage: (orderId, stage) => {
        set(s => ({
          orders: s.orders.map(o => o.id === orderId ? { ...o, stage } : o),
        }))
        get().showToast(`${orderId} → ${stage}`)
      },

      setInventory: (inv) => {
        set(s => ({
          inventory: typeof inv === 'function' ? inv(s.inventory) : inv,
        }))
      },

      showToast: (msg) => {
        set({ toast: msg })
        setTimeout(() => set({ toast: null }), 2400)
      },

      clearToast: () => set({ toast: null }),
    }),
    {
      name: 'kreobox-v1',
      partialize: (s) => ({ orders: s.orders, inventory: s.inventory }),
    }
  )
)
