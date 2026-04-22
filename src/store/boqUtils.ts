import type { PlacedModule, BOQ, BOQLineItem } from '../types'
import { getModuleById } from '../data/modules'

export function computeBOQ(
  projectId: string,
  roomName: string,
  placed: PlacedModule[]
): BOQ {
  const lineItems: BOQLineItem[] = placed.map(pm => {
    const module = getModuleById(pm.moduleId)!
    const laminate = pm.selectedLaminateCode || module.laminateCode
    return {
      roomName,
      instanceId: pm.instanceId,
      sku: module.sku,
      moduleName: module.name,
      qty: 1,
      unitPriceINR: module.priceINR,
      laminate,
      panels: module.cutList.map(p => ({ ...p, laminateCode: laminate })),
      hardware: module.hardwareList,
    }
  })

  const totalMaterialINR = lineItems.reduce((s, li) => s + li.unitPriceINR, 0)
  const totalHardwareINR = lineItems.reduce(
    (s, li) => s + li.hardware.reduce((hs, h) => hs + h.qty * h.unitPriceINR, 0),
    0
  )

  return {
    projectId,
    generatedAt: new Date().toISOString(),
    lineItems,
    totalMaterialINR,
    totalHardwareINR,
    totalINR: totalMaterialINR + totalHardwareINR,
  }
}

export function computeProjectBOQ(project: {
  id: string
  rooms: { name: string; placedModules: PlacedModule[] }[]
}): BOQ {
  const allItems: BOQLineItem[] = project.rooms.flatMap(r =>
    computeBOQ(project.id, r.name, r.placedModules).lineItems
  )
  const totalMaterialINR = allItems.reduce((s, li) => s + li.unitPriceINR, 0)
  const totalHardwareINR = allItems.reduce(
    (s, li) => s + li.hardware.reduce((hs, h) => hs + h.qty * h.unitPriceINR, 0),
    0
  )
  return {
    projectId: project.id,
    generatedAt: new Date().toISOString(),
    lineItems: allItems,
    totalMaterialINR,
    totalHardwareINR,
    totalINR: totalMaterialINR + totalHardwareINR,
  }
}

export function getProjectSpend(project: {
  rooms: { placedModules: PlacedModule[] }[]
}): number {
  return project.rooms.flatMap(r => r.placedModules).reduce((s, pm) => {
    const mod = getModuleById(pm.moduleId)
    return s + (mod?.priceINR ?? 0)
  }, 0)
}
