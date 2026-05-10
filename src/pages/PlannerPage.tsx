import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Design tokens ─────────────────────────────────────────────────
const BG     = '#f0eee9'
const PAPER  = '#fafaf7'
const INK    = '#1a1815'
const MUTE   = 'rgba(26,24,21,0.55)'
const LINE   = 'rgba(26,24,21,0.09)'
const ACCENT = '#c96442'

type ProductMode = 'kitchen' | 'wardrobe' | 'office'
type ViewMode    = '2D plan' | 'Elevation' | '3D view'

// ── Catalog types ─────────────────────────────────────────────────
interface CatalogEntry {
  id: string; name: string; code: string
  category: 'base' | 'upper' | 'tall' | 'island' | 'fridge' | 'wardrobe' | 'desk' | 'storage'
  width: number; height: number; depth: number; price: number
  hasHob?: boolean; hasSink?: boolean; isIsland?: boolean
  color: string
}

interface PlacedItem {
  uid: string
  entry: CatalogEntry
  x: number; y: number   // mm from room origin
  width: number
  finish: string
  hardware: string
}

// ── Catalogs ──────────────────────────────────────────────────────
const KITCHEN_CATALOG: CatalogEntry[] = [
  { id:'k-base-600',  name:'Base Cabinet',     code:'BSC-600',  category:'base',   width:600,  height:870, depth:600, price:18900, color:'#d4c9b0' },
  { id:'k-base-900',  name:'Base Cabinet',     code:'BSC-900',  category:'base',   width:900,  height:870, depth:600, price:24500, color:'#d4c9b0' },
  { id:'k-drawer-1000', name:'Drawer Unit',    code:'DRW-1000', category:'base',   width:1000, height:870, depth:600, price:32000, color:'#c8bda0' },
  { id:'k-sink-1200', name:'Sink Cabinet',     code:'SNK-1200', category:'base',   width:1200, height:870, depth:600, price:28000, hasSink:true, color:'#d4c9b0' },
  { id:'k-hob-900',   name:'Hob Unit',         code:'HOB-900',  category:'base',   width:900,  height:870, depth:600, price:22000, hasHob:true, color:'#d4c9b0' },
  { id:'k-pantry-600',name:'Pantry Tower',     code:'PNT-600',  category:'tall',   width:600,  height:2400,depth:600, price:42000, color:'#c0b49a' },
  { id:'k-fridge-600',name:'Fridge Surround',  code:'FRG-600',  category:'fridge', width:600,  height:2100,depth:650, price:15000, color:'#b8b0a0' },
  { id:'k-upper-600', name:'Wall Unit',        code:'WLC-600',  category:'upper',  width:600,  height:700, depth:300, price:12000, color:'#e0d8c8' },
  { id:'k-upper-900', name:'Wall Unit',        code:'WLC-900',  category:'upper',  width:900,  height:700, depth:300, price:16000, color:'#e0d8c8' },
  { id:'k-island',    name:'Kitchen Island',   code:'ISL-2200', category:'island', width:2200, height:900, depth:900, price:85000, isIsland:true, color:'#1a1815' },
]

const WARDROBE_CATALOG: CatalogEntry[] = [
  { id:'w-frame-600',  name:'Wardrobe Frame',  code:'WDF-600',  category:'wardrobe', width:600,  height:2400, depth:600, price:18000, color:'#c8bda0' },
  { id:'w-frame-900',  name:'Wardrobe Frame',  code:'WDF-900',  category:'wardrobe', width:900,  height:2400, depth:600, price:24000, color:'#c8bda0' },
  { id:'w-frame-1200', name:'Wardrobe Frame',  code:'WDF-1200', category:'wardrobe', width:1200, height:2400, depth:600, price:30000, color:'#c8bda0' },
  { id:'w-drawer-600', name:'Drawer Module',   code:'WDD-600',  category:'storage',  width:600,  height:400,  depth:560, price:9500,  color:'#d4c9b0' },
  { id:'w-shelf',      name:'Shelf Module',    code:'WDS-600',  category:'storage',  width:600,  height:200,  depth:560, price:4500,  color:'#e0d8c8' },
]

const OFFICE_CATALOG: CatalogEntry[] = [
  { id:'o-desk-1400',  name:'Standing Desk',   code:'DSK-1400', category:'desk',    width:1400, height:750, depth:700, price:38000, color:'#c8bda0' },
  { id:'o-desk-1800',  name:'L-Shape Desk',    code:'DSK-1800', category:'desk',    width:1800, height:750, depth:700, price:52000, color:'#c8bda0' },
  { id:'o-shelf-900',  name:'Bookshelf',        code:'BSH-900',  category:'storage', width:900,  height:2100,depth:350, price:22000, color:'#d4c9b0' },
  { id:'o-cabinet-600',name:'Filing Cabinet',  code:'FIL-600',  category:'storage', width:600,  height:1200,depth:500, price:18000, color:'#b8b0a0' },
]

const CATALOGS: Record<ProductMode, CatalogEntry[]> = {
  kitchen: KITCHEN_CATALOG,
  wardrobe: WARDROBE_CATALOG,
  office: OFFICE_CATALOG,
}

// ── Room configs (mm) ─────────────────────────────────────────────
const ROOMS = {
  kitchen:  { w: 3800, d: 2840, wallH: 2400 },
  wardrobe: { w: 2700, d: 600,  wallH: 2400 },
  office:   { w: 5400, d: 3400, wallH: 2600 },
}

// ── Finishes / hardware ───────────────────────────────────────────
const FINISHES  = ['Bali Oak', 'Espresso', 'Bone Matte', 'Sand Grey']
const HARDWARES = ['Push-to-open', 'Soft-close hinge', 'Handle pull']

// ── Default kitchen layout ─────────────────────────────────────────
const defaultKitchenItems: PlacedItem[] = [
  { uid:'di-1', entry: KITCHEN_CATALOG[2], x:0,    y:0,    width:1000, finish:'Bali Oak',   hardware:'Push-to-open' },
  { uid:'di-2', entry: KITCHEN_CATALOG[3], x:1000, y:0,    width:1200, finish:'Bali Oak',   hardware:'Push-to-open' },
  { uid:'di-3', entry: KITCHEN_CATALOG[4], x:2200, y:0,    width:900,  finish:'Bali Oak',   hardware:'Push-to-open' },
  { uid:'di-4', entry: KITCHEN_CATALOG[5], x:3200, y:0,    width:600,  finish:'Bali Oak',   hardware:'Soft-close hinge' },
  { uid:'di-5', entry: KITCHEN_CATALOG[6], x:0,    y:870,  width:600,  finish:'Bone Matte', hardware:'Push-to-open' },
  { uid:'di-6', entry: KITCHEN_CATALOG[9], x:800,  y:1600, width:2200, finish:'Espresso',   hardware:'Push-to-open' },
]

// ── SVG canvas constants ──────────────────────────────────────────
const SVG_W = 620
const SVG_H = 440
const ROOM_OX = 70
const ROOM_OY = 40
const MAX_ROOM_W = SVG_W - ROOM_OX - 10
const MAX_ROOM_H = SVG_H - ROOM_OY - 30

function getScale(room: { w: number; d: number }, zoom: number) {
  return Math.min(MAX_ROOM_W / room.w, MAX_ROOM_H / room.d) * zoom
}

// ── ISO 3D constants ──────────────────────────────────────────────
const ISO_SX = Math.cos(Math.PI / 6)
const ISO_SY = Math.sin(Math.PI / 6)
const ISO_SCALE_3D = 0.055

function iso(mx: number, my: number, mz: number, cx: number, cy: number) {
  return {
    x: cx + (mx - mz) * ISO_SX * ISO_SCALE_3D,
    y: cy - (mx + mz) * ISO_SY * ISO_SCALE_3D + my * ISO_SCALE_3D,
  }
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function lighten(hex: string, d: number) {
  if (!hex.startsWith('#') || hex.length < 7) return hex
  const { r, g, b } = hexToRgb(hex)
  const clamp = (v: number) => Math.min(255, Math.max(0, v))
  return `rgb(${clamp(r + d)},${clamp(g + d)},${clamp(b + d)})`
}

function darken(hex: string, d: number) {
  return lighten(hex, -d)
}

// ── Logo ──────────────────────────────────────────────────────────
function KreoboxLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M16 28 H84 V84 Q84 90 78 90 H22 Q16 90 16 84 Z M30 42 V76 H70 V42 Z"
        fill={ACCENT} />
      <rect x="20" y="10" width="68" height="14" rx="3"
        transform="rotate(-8 54 17)" fill={ACCENT} fillOpacity="0.7" />
    </svg>
  )
}

// ── Switcher components ───────────────────────────────────────────
function ProductSwitch({ active, onChange }: { active: ProductMode; onChange: (m: ProductMode) => void }) {
  const opts: ProductMode[] = ['kitchen', 'wardrobe', 'office']
  return (
    <div style={{ display: 'flex', background: 'rgba(26,24,21,0.05)', borderRadius: 8, padding: 3 }}>
      {opts.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{
          padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: 'none',
          background: o === active ? PAPER : 'transparent',
          color: o === active ? INK : MUTE,
          boxShadow: o === active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
          cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
        }}>{o}</button>
      ))}
    </div>
  )
}

function ViewToggle({ active, onChange }: { active: ViewMode; onChange: (v: ViewMode) => void }) {
  const opts: ViewMode[] = ['2D plan', 'Elevation', '3D view']
  return (
    <div style={{ display: 'flex', background: 'rgba(26,24,21,0.05)', borderRadius: 8, padding: 3 }}>
      {opts.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{
          padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: 'none',
          background: o === active ? PAPER : 'transparent',
          color: o === active ? INK : MUTE,
          boxShadow: o === active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
          cursor: 'pointer', fontFamily: 'inherit',
        }}>{o}</button>
      ))}
    </div>
  )
}

// ── 2D Floor Plan Canvas ───────────────────────────────────────────
interface Plan2DProps {
  product: ProductMode
  items: PlacedItem[]
  selectedUid: string | null
  zoom: number
  dragOverPos: { x: number; y: number } | null
  ghostEntry: CatalogEntry | null
  onSelect: (uid: string | null) => void
  onDrop: (entry: CatalogEntry, mmX: number, mmY: number) => void
  onDragOver: (mmX: number, mmY: number) => void
  onDragLeave: () => void
  onMoveItem: (uid: string, mmX: number, mmY: number) => void
}

function Plan2D({ product, items, selectedUid, zoom, dragOverPos, ghostEntry, onSelect, onDrop, onDragOver, onDragLeave, onMoveItem }: Plan2DProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const room = ROOMS[product]
  const scale = getScale(room, zoom)
  const rW = room.w * scale
  const rH = room.d * scale

  const toMm = useCallback((svgX: number, svgY: number) => {
    const mmX = Math.round((svgX - ROOM_OX) / scale / 100) * 100
    const mmY = Math.round((svgY - ROOM_OY) / scale / 100) * 100
    return { mmX: Math.max(0, Math.min(room.w, mmX)), mmY: Math.max(0, Math.min(room.d, mmY)) }
  }, [scale, room])

  const getSvgCoords = useCallback((e: React.DragEvent) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return null
    const svgX = (e.clientX - rect.left) / rect.width * SVG_W
    const svgY = (e.clientY - rect.top) / rect.height * SVG_H
    return toMm(svgX, svgY)
  }, [toMm])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    const pos = getSvgCoords(e)
    if (pos) onDragOver(pos.mmX, pos.mmY)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const pos = getSvgCoords(e)
    if (!pos || !ghostEntry) return
    onDrop(ghostEntry, pos.mmX, pos.mmY)
  }

  // drag-to-move state
  const movingUid = useRef<string | null>(null)

  const wallColor = '#1a1815'
  const gridMinor = 'rgba(26,24,21,0.05)'
  const gridMajor = 'rgba(26,24,21,0.10)'

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      onClick={e => { if (e.target === svgRef.current) onSelect(null) }}
    >
      <defs>
        <pattern id="pl-grid" width={scale * 100} height={scale * 100} patternUnits="userSpaceOnUse"
          patternTransform={`translate(${ROOM_OX},${ROOM_OY})`}>
          <path d={`M${scale*100} 0 L0 0 0 ${scale*100}`} fill="none" stroke={gridMinor} strokeWidth="0.5" />
        </pattern>
        <pattern id="pl-grid-maj" width={scale * 500} height={scale * 500} patternUnits="userSpaceOnUse"
          patternTransform={`translate(${ROOM_OX},${ROOM_OY})`}>
          <path d={`M${scale*500} 0 L0 0 0 ${scale*500}`} fill="none" stroke={gridMajor} strokeWidth="1" />
        </pattern>
      </defs>

      {/* Room fill + grid */}
      <rect x={ROOM_OX} y={ROOM_OY} width={rW} height={rH} fill="rgba(232,226,213,0.18)" />
      <rect x={ROOM_OX} y={ROOM_OY} width={rW} height={rH} fill="url(#pl-grid)" />
      <rect x={ROOM_OX} y={ROOM_OY} width={rW} height={rH} fill="url(#pl-grid-maj)" />

      {/* Walls */}
      <path d={`M${ROOM_OX} ${ROOM_OY+rH} L${ROOM_OX} ${ROOM_OY} L${ROOM_OX+rW} ${ROOM_OY}`}
        fill="none" stroke={wallColor} strokeWidth="5" strokeLinejoin="round" />
      <path d={`M${ROOM_OX+rW} ${ROOM_OY} L${ROOM_OX+rW} ${ROOM_OY+rH*0.4}`}
        fill="none" stroke={wallColor} strokeWidth="5" strokeLinecap="round" />
      <path d={`M${ROOM_OX} ${ROOM_OY+rH} L${ROOM_OX+rW*0.42} ${ROOM_OY+rH}`}
        fill="none" stroke={wallColor} strokeWidth="5" strokeLinecap="round" />

      {/* Placed items */}
      {items.map(item => {
        const iw = item.width * scale
        const ih = item.entry.depth * scale
        const ix = ROOM_OX + item.x * scale
        const iy = ROOM_OY + item.y * scale
        const isSel = item.uid === selectedUid
        const isIsland = item.entry.isIsland
        const fillColor = isIsland ? '#1a1815' : '#d4c9b0'
        const strokeColor = isSel ? ACCENT : '#a99a82'
        const sw = isSel ? 2.5 : 1.5

        return (
          <g key={item.uid}
            style={{ cursor: 'grab' }}
            draggable
            onDragStart={e => { movingUid.current = item.uid; e.dataTransfer.setData('move-uid', item.uid) }}
            onDragEnd={() => { movingUid.current = null }}
            onClick={e => { e.stopPropagation(); onSelect(item.uid) }}
          >
            <rect x={ix} y={iy} width={iw} height={ih}
              fill={fillColor} stroke={strokeColor} strokeWidth={sw} rx={2} />

            {/* Cabinet details */}
            {item.entry.hasSink && (
              <ellipse cx={ix + iw/2} cy={iy + ih/2} rx={iw*0.2} ry={ih*0.3}
                fill="#c0c8d0" stroke={strokeColor} strokeWidth="1" />
            )}
            {item.entry.hasHob && (
              <>
                <circle cx={ix + iw*0.28} cy={iy + ih*0.35} r={iw*0.06} fill="#2a2520" />
                <circle cx={ix + iw*0.55} cy={iy + ih*0.35} r={iw*0.06} fill="#2a2520" />
                <circle cx={ix + iw*0.28} cy={iy + ih*0.68} r={iw*0.06} fill="#2a2520" />
                <circle cx={ix + iw*0.55} cy={iy + ih*0.68} r={iw*0.06} fill="#2a2520" />
              </>
            )}
            {item.entry.category === 'tall' && (
              <line x1={ix + iw/2} y1={iy} x2={ix + iw/2} y2={iy + ih}
                stroke={strokeColor} strokeWidth="0.8" />
            )}
            {item.entry.isIsland && (
              <rect x={ix+6} y={iy+6} width={iw-12} height={ih-12}
                fill="#252018" rx={1} />
            )}

            {/* Label */}
            <text x={ix + iw/2} y={iy + ih/2 + 4}
              fill={isIsland ? 'rgba(255,255,255,0.4)' : 'rgba(26,24,21,0.5)'}
              fontSize={Math.max(7, Math.min(10, iw * 0.07))}
              fontFamily="JetBrains Mono, monospace"
              textAnchor="middle">{item.entry.code}</text>

            {/* Selection handles */}
            {isSel && (
              <>
                <rect x={ix-1} y={iy-1} width={iw+2} height={ih+2}
                  fill="none" stroke={ACCENT} strokeWidth="2" strokeDasharray="4 3" rx={3} />
                <circle cx={ix} cy={iy} r={4} fill={ACCENT} />
                <circle cx={ix+iw} cy={iy} r={4} fill={ACCENT} />
                <circle cx={ix+iw} cy={iy+ih} r={4} fill={ACCENT} />
                <circle cx={ix} cy={iy+ih} r={4} fill={ACCENT} />
              </>
            )}
          </g>
        )
      })}

      {/* Ghost preview while dragging from catalog */}
      {dragOverPos && ghostEntry && (() => {
        const gw = ghostEntry.width * scale
        const gh = ghostEntry.depth * scale
        const gx = ROOM_OX + dragOverPos.x * scale
        const gy = ROOM_OY + dragOverPos.y * scale
        return (
          <rect x={gx} y={gy} width={gw} height={gh}
            fill={`${ACCENT}22`} stroke={ACCENT} strokeWidth="1.5"
            strokeDasharray="4 3" rx={3} />
        )
      })()}

      {/* Dimension labels */}
      <line x1={ROOM_OX} y1={ROOM_OY - 14} x2={ROOM_OX + rW} y2={ROOM_OY - 14}
        stroke={MUTE} strokeWidth="0.8" />
      <line x1={ROOM_OX} y1={ROOM_OY - 18} x2={ROOM_OX} y2={ROOM_OY - 10}
        stroke={MUTE} strokeWidth="0.8" />
      <line x1={ROOM_OX + rW} y1={ROOM_OY - 18} x2={ROOM_OX + rW} y2={ROOM_OY - 10}
        stroke={MUTE} strokeWidth="0.8" />
      <text x={ROOM_OX + rW/2} y={ROOM_OY - 18}
        fill={MUTE} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
        {(room.w / 1000).toFixed(1)}m
      </text>

      <line x1={ROOM_OX - 14} y1={ROOM_OY} x2={ROOM_OX - 14} y2={ROOM_OY + rH}
        stroke={MUTE} strokeWidth="0.8" />
      <line x1={ROOM_OX - 18} y1={ROOM_OY} x2={ROOM_OX - 10} y2={ROOM_OY}
        stroke={MUTE} strokeWidth="0.8" />
      <line x1={ROOM_OX - 18} y1={ROOM_OY + rH} x2={ROOM_OX - 10} y2={ROOM_OY + rH}
        stroke={MUTE} strokeWidth="0.8" />
      <text x={ROOM_OX - 20} y={ROOM_OY + rH/2}
        fill={MUTE} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle"
        transform={`rotate(-90,${ROOM_OX - 20},${ROOM_OY + rH/2})`}>
        {(room.d / 1000).toFixed(1)}m
      </text>
    </svg>
  )
}

// ── Elevation View ────────────────────────────────────────────────
function ElevationView({ product, items, zoom }: { product: ProductMode; items: PlacedItem[]; zoom: number }) {
  const room = ROOMS[product]
  const scale = getScale(room, zoom)
  // Only items against the back wall (y ≈ 0, within first 700mm)
  const wallItems = items.filter(it => it.y < 700)
  const wallH = room.wallH
  const svgH = SVG_H - 60
  const elvScale = Math.min(MAX_ROOM_W / room.w, svgH / wallH)
  const baseY = ROOM_OY + svgH
  const oxEl = ROOM_OX

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Floor line */}
      <line x1={oxEl} y1={baseY} x2={oxEl + room.w * elvScale} y2={baseY}
        stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {/* Ceiling */}
      <line x1={oxEl} y1={baseY - wallH * elvScale} x2={oxEl + room.w * elvScale} y2={baseY - wallH * elvScale}
        stroke={MUTE} strokeWidth="1" strokeDasharray="5 4" />

      {/* Wall items */}
      {wallItems.map(item => {
        const iw = item.width * elvScale
        const icat = item.entry.category
        const ih = (icat === 'upper' ? 700 : item.entry.height) * elvScale
        const iy = baseY - ih
        const ix = oxEl + item.x * elvScale
        const isIsland = item.entry.isIsland

        return (
          <g key={item.uid}>
            <rect x={ix} y={iy} width={iw} height={ih}
              fill={isIsland ? '#1a1815' : '#d4c9b0'}
              stroke={isIsland ? '#3a352e' : '#a99a82'}
              strokeWidth="1.5" rx={2} />
            {/* Counter line for base cabs */}
            {(icat === 'base') && (
              <rect x={ix} y={iy} width={iw} height={ih * 0.05}
                fill="#b8a888" rx={1} />
            )}
            {/* Door lines */}
            {icat !== 'island' && (
              <line x1={ix + iw * 0.5} y1={iy} x2={ix + iw * 0.5} y2={iy + ih}
                stroke="#a99a82" strokeWidth="0.7" />
            )}
            {/* Sink visual */}
            {item.entry.hasSink && (
              <rect x={ix + iw * 0.2} y={iy + ih * 0.15} width={iw * 0.6} height={ih * 0.18}
                fill="#c0c8d0" stroke="#a0a8b0" strokeWidth="0.8" rx={2} />
            )}
            {/* Hob visual */}
            {item.entry.hasHob && (
              <>
                <circle cx={ix + iw * 0.35} cy={iy + ih * 0.08} r={iw * 0.05} fill="#2a2520" />
                <circle cx={ix + iw * 0.65} cy={iy + ih * 0.08} r={iw * 0.05} fill="#2a2520" />
              </>
            )}
            <text x={ix + iw/2} y={iy + ih/2 + 3}
              fill="rgba(26,24,21,0.35)" fontSize="8" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
              {item.entry.code}
            </text>
          </g>
        )
      })}

      {/* Counter height marker */}
      <line x1={oxEl - 12} y1={baseY - 870 * elvScale} x2={oxEl + room.w * elvScale + 12} y2={baseY - 870 * elvScale}
        stroke={ACCENT} strokeWidth="0.8" strokeDasharray="3 3" />
      <text x={oxEl + room.w * elvScale + 16} y={baseY - 870 * elvScale + 3}
        fill={ACCENT} fontSize="8" fontFamily="JetBrains Mono, monospace">870</text>

      {/* Wall height label */}
      <text x={oxEl - 30} y={baseY - wallH * elvScale / 2}
        fill={MUTE} fontSize="8" fontFamily="JetBrains Mono, monospace" textAnchor="middle"
        transform={`rotate(-90,${oxEl - 30},${baseY - wallH * elvScale / 2})`}>
        {(wallH / 1000).toFixed(1)}m
      </text>
    </svg>
  )
}

// ── 3D Isometric View ─────────────────────────────────────────────
function IsoView3D({ product, items, selectedUid }: { product: ProductMode; items: PlacedItem[]; selectedUid: string | null }) {
  const room = ROOMS[product]
  const cx = SVG_W * 0.45
  const cy = SVG_H * 0.72

  // Sort by painter's algorithm: render far items first
  const sorted = [...items].sort((a, b) => (b.entry.isIsland ? -1 : 1) || (b.x + b.y) - (a.x + a.y))

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Floor */}
      {(() => {
        const fl = [
          iso(0,        0, 0,        cx, cy),
          iso(room.w,   0, 0,        cx, cy),
          iso(room.w,   0, room.d,   cx, cy),
          iso(0,        0, room.d,   cx, cy),
        ]
        const pts = fl.map(p => `${p.x},${p.y}`).join(' ')
        return <polygon points={pts} fill="#e8e3d8" stroke="#c4bbb0" strokeWidth="1" />
      })()}

      {/* Back wall (z=0) */}
      {(() => {
        const w = [
          iso(0,          0,          0, cx, cy),
          iso(room.w,     0,          0, cx, cy),
          iso(room.w,     room.wallH, 0, cx, cy),
          iso(0,          room.wallH, 0, cx, cy),
        ]
        const pts = w.map(p => `${p.x},${p.y}`).join(' ')
        return <polygon points={pts} fill="#f0ece4" stroke="#d0c8bc" strokeWidth="0.8" />
      })()}

      {/* Left wall (x=0) */}
      {(() => {
        const lw = [
          iso(0, 0,          0,      cx, cy),
          iso(0, 0,          room.d, cx, cy),
          iso(0, room.wallH, room.d, cx, cy),
          iso(0, room.wallH, 0,      cx, cy),
        ]
        const pts = lw.map(p => `${p.x},${p.y}`).join(' ')
        return <polygon points={pts} fill="#e4e0d8" stroke="#d0c8bc" strokeWidth="0.8" />
      })()}

      {/* Items */}
      {sorted.map(item => {
        const isSel = item.uid === selectedUid
        const baseColor = item.entry.color
        const topColor  = lighten(baseColor, 40)
        const frontColor = darken(baseColor, 10)
        const sideColor  = darken(baseColor, 25)
        const iw = item.width
        const ih = item.entry.height
        const id = item.entry.depth
        const ix = item.x
        const iz = item.y

        // Top face
        const topFace = [
          iso(ix,    ih, iz,    cx, cy),
          iso(ix+iw, ih, iz,    cx, cy),
          iso(ix+iw, ih, iz+id, cx, cy),
          iso(ix,    ih, iz+id, cx, cy),
        ]
        // Front face (z = iz+id)
        const frontFace = [
          iso(ix,    0,  iz+id, cx, cy),
          iso(ix+iw, 0,  iz+id, cx, cy),
          iso(ix+iw, ih, iz+id, cx, cy),
          iso(ix,    ih, iz+id, cx, cy),
        ]
        // Right face (x = ix+iw)
        const rightFace = [
          iso(ix+iw, 0,  iz,    cx, cy),
          iso(ix+iw, 0,  iz+id, cx, cy),
          iso(ix+iw, ih, iz+id, cx, cy),
          iso(ix+iw, ih, iz,    cx, cy),
        ]

        const toPoints = (face: { x: number; y: number }[]) => face.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
        const selStroke = isSel ? ACCENT : 'none'
        const selSW = isSel ? 1.5 : 0

        return (
          <g key={item.uid}>
            <polygon points={toPoints(topFace)}   fill={topColor}   stroke={isSel ? ACCENT : '#0002'} strokeWidth={isSel ? 1.5 : 0.5} />
            <polygon points={toPoints(frontFace)} fill={frontColor} stroke={isSel ? ACCENT : '#0003'} strokeWidth={isSel ? 1.5 : 0.5} />
            <polygon points={toPoints(rightFace)} fill={sideColor}  stroke={isSel ? ACCENT : '#0004'} strokeWidth={isSel ? 1.5 : 0.5} />

            {/* Counter top for base cabinets */}
            {(item.entry.category === 'base') && (() => {
              const ctH = 30
              const ctTop = [
                iso(ix,    ih+ctH, iz,    cx, cy),
                iso(ix+iw, ih+ctH, iz,    cx, cy),
                iso(ix+iw, ih+ctH, iz+id, cx, cy),
                iso(ix,    ih+ctH, iz+id, cx, cy),
              ]
              return <polygon points={toPoints(ctTop)} fill="#c8c0a8" stroke="#0003" strokeWidth="0.5" />
            })()}

            {/* Hob rings */}
            {item.entry.hasHob && (() => {
              const centers = [
                iso(ix + iw * 0.28, ih + 31, iz + id * 0.35, cx, cy),
                iso(ix + iw * 0.55, ih + 31, iz + id * 0.35, cx, cy),
                iso(ix + iw * 0.28, ih + 31, iz + id * 0.68, cx, cy),
                iso(ix + iw * 0.55, ih + 31, iz + id * 0.68, cx, cy),
              ]
              return <>{centers.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={4} fill="#2a2520" />)}</>
            })()}
          </g>
        )
      })}

      {/* Label */}
      <text x={14} y={24} fill={MUTE} fontSize="10" fontFamily="JetBrains Mono, monospace">3D ISOMETRIC</text>
    </svg>
  )
}

// ── Main PlannerPage ──────────────────────────────────────────────
export default function PlannerPage() {
  const navigate = useNavigate()

  const [product, setProduct] = useState<ProductMode>('kitchen')
  const [view, setView]       = useState<ViewMode>('2D plan')
  const [zoom, setZoom]       = useState(1)
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>(defaultKitchenItems)
  const [selectedUid, setSelectedUid] = useState<string | null>(null)
  const [dragEntry, setDragEntry] = useState<CatalogEntry | null>(null)
  const [dragOverPos, setDragOverPos] = useState<{ x: number; y: number } | null>(null)

  const catalog = CATALOGS[product]
  const selectedItem = placedItems.find(it => it.uid === selectedUid) ?? null

  // Switch product → reset layout
  const handleProductChange = (p: ProductMode) => {
    setProduct(p)
    setPlacedItems([])
    setSelectedUid(null)
  }

  // Keyboard: Delete selected item
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedUid) {
        if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'SELECT') return
        setPlacedItems(prev => prev.filter(it => it.uid !== selectedUid))
        setSelectedUid(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedUid])

  // Drop from catalog
  const handleDrop = useCallback((entry: CatalogEntry, mmX: number, mmY: number) => {
    const uid = `item-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setPlacedItems(prev => [...prev, {
      uid, entry, x: mmX, y: mmY, width: entry.width,
      finish: FINISHES[0], hardware: HARDWARES[0],
    }])
    setSelectedUid(uid)
    setDragOverPos(null)
    setDragEntry(null)
  }, [])

  // Update selected item
  const updateItem = useCallback((patch: Partial<PlacedItem>) => {
    if (!selectedUid) return
    setPlacedItems(prev => prev.map(it => it.uid === selectedUid ? { ...it, ...patch } : it))
  }, [selectedUid])

  // Move item (drag existing)
  const handleMoveItem = useCallback((uid: string, mmX: number, mmY: number) => {
    setPlacedItems(prev => prev.map(it => it.uid === uid ? { ...it, x: mmX, y: mmY } : it))
  }, [])

  // BOM computation
  const bom = useMemo(() => {
    const map = new Map<string, { entry: CatalogEntry; qty: number; total: number }>()
    placedItems.forEach(it => {
      const existing = map.get(it.entry.id)
      if (existing) {
        existing.qty++
        existing.total += it.entry.price
      } else {
        map.set(it.entry.id, { entry: it.entry, qty: 1, total: it.entry.price })
      }
    })
    return Array.from(map.values())
  }, [placedItems])

  const grandTotal = bom.reduce((s, r) => s + r.total, 0)
  const formatPrice = (p: number) => `₹${(p / 100).toLocaleString('en-IN')}`

  // Catalog grouped
  const categories = [...new Set(catalog.map(e => e.category))]

  return (
    <div style={{
      width: '100vw', height: '100vh', background: BG,
      fontFamily: '"Inter Tight", sans-serif',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div style={{
        height: 52, borderBottom: `1px solid ${LINE}`,
        display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px',
        background: PAPER, flexShrink: 0,
      }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: 0 }}>
          <KreoboxLogo size={20} />
          <span style={{ fontFamily: '"Fraunces", serif', fontSize: 15, fontWeight: 600, color: INK, letterSpacing: '-0.02em' }}>Kreobox</span>
        </button>
        <div style={{ width: 1, height: 20, background: LINE }} />
        <ProductSwitch active={product} onChange={handleProductChange} />
        <div style={{ flex: 1 }} />
        <ViewToggle active={view} onChange={setView} />
        <div style={{ width: 1, height: 20, background: LINE }} />
        {/* Zoom controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={() => setZoom(z => Math.max(0.5, +(z - 0.25).toFixed(2)))} style={{ ...btnSm }}>−</button>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: MUTE, minWidth: 38, textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={() => setZoom(z => Math.min(3, +(z + 0.25).toFixed(2)))} style={{ ...btnSm }}>+</button>
        </div>
        {/* Reset */}
        <button onClick={() => { setPlacedItems([]); setSelectedUid(null) }} style={{ ...btnSm, color: MUTE }}>↺</button>
        <button onClick={() => navigate('/app/studio')} style={{
          padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          background: INK, color: PAPER, border: 'none', fontFamily: 'inherit',
        }}>Send to Studio →</button>
      </div>

      {/* ── 3-panel body ────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Left: catalog */}
        <div style={{
          width: 220, borderRight: `1px solid ${LINE}`,
          background: PAPER, overflowY: 'auto', flexShrink: 0,
        }}>
          <div style={{ padding: '14px 12px 6px', borderBottom: `1px solid ${LINE}` }}>
            <div style={{ fontFamily: '"Fraunces", serif', fontSize: 18, fontWeight: 600, color: INK, letterSpacing: '-0.02em' }}>Catalog</div>
            <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>Drag items to floor plan</div>
          </div>

          {categories.map(cat => (
            <div key={cat}>
              <div style={{ padding: '10px 12px 4px', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTE, fontWeight: 600 }}>
                {cat}
              </div>
              {catalog.filter(e => e.category === cat).map(entry => (
                <div
                  key={entry.id}
                  draggable
                  onDragStart={e => { setDragEntry(entry); e.dataTransfer.setData('catalog-id', entry.id) }}
                  onDragEnd={() => setDragEntry(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 12px', cursor: 'grab',
                    background: dragEntry?.id === entry.id ? 'rgba(201,100,66,0.06)' : 'transparent',
                    borderLeft: dragEntry?.id === entry.id ? `2px solid ${ACCENT}` : '2px solid transparent',
                    transition: 'background 120ms',
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 6, flexShrink: 0,
                    background: entry.color || '#d4c9b0',
                    border: `1px solid ${LINE}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: 'rgba(255,255,255,0.6)',
                  }}>
                    {Math.round(entry.width / 100) * 10}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: INK }}>
                      {entry.name}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: MUTE }}>
                      {entry.code} · {entry.width}mm
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Center: canvas */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* Canvas area */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: BG }}>
            {view === '2D plan' && (
              <Plan2D
                product={product}
                items={placedItems}
                selectedUid={selectedUid}
                zoom={zoom}
                dragOverPos={dragOverPos}
                ghostEntry={dragEntry}
                onSelect={setSelectedUid}
                onDrop={handleDrop}
                onDragOver={(x, y) => setDragOverPos({ x, y })}
                onDragLeave={() => setDragOverPos(null)}
                onMoveItem={handleMoveItem}
              />
            )}
            {view === 'Elevation' && (
              <ElevationView product={product} items={placedItems} zoom={zoom} />
            )}
            {view === '3D view' && (
              <IsoView3D product={product} items={placedItems} selectedUid={selectedUid} />
            )}

            {/* Empty state hint */}
            {placedItems.length === 0 && (
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
              }}>
                <div style={{ fontSize: 32, opacity: 0.15 }}>⬡</div>
                <div style={{ fontSize: 13, color: MUTE, marginTop: 8 }}>Drag items from the catalog to start</div>
              </div>
            )}
          </div>

          {/* BOM strip */}
          <div style={{
            height: 52, borderTop: `1px solid ${LINE}`, background: PAPER,
            display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', flexShrink: 0,
          }}>
            <div style={{ padding: '0 16px', borderRight: `1px solid ${LINE}`, whiteSpace: 'nowrap' }}>
              <span style={{ fontFamily: '"Fraunces", serif', fontSize: 13, fontWeight: 600, color: INK }}>{formatPrice(grandTotal)}</span>
              <span style={{ fontSize: 10, color: MUTE, marginLeft: 6 }}>{placedItems.length} items</span>
            </div>
            {bom.map(row => (
              <div key={row.entry.id} style={{
                padding: '0 14px', borderRight: `1px solid ${LINE}`,
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                whiteSpace: 'nowrap', height: '100%',
              }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: MUTE }}>{row.entry.code} ×{row.qty}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: INK }}>{formatPrice(row.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: properties panel */}
        <div style={{
          width: 240, borderLeft: `1px solid ${LINE}`,
          background: PAPER, overflowY: 'auto', flexShrink: 0,
          display: 'flex', flexDirection: 'column',
        }}>
          {selectedItem ? (
            <>
              <div style={{ padding: '16px 16px 10px', borderBottom: `1px solid ${LINE}` }}>
                <div style={{ fontFamily: '"Fraunces", serif', fontSize: 16, fontWeight: 600, color: INK }}>
                  {selectedItem.entry.name}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: MUTE, marginTop: 2 }}>
                  {selectedItem.entry.code}
                </div>
              </div>

              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Width slider */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTE, letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                    WIDTH
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="range"
                      min={300} max={2400} step={100}
                      value={selectedItem.width}
                      onChange={e => updateItem({ width: +e.target.value })}
                      style={{ flex: 1, accentColor: ACCENT }}
                    />
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600, color: INK, marginTop: 6 }}>
                    {selectedItem.width} mm
                  </div>
                </div>

                {/* Finish */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTE, letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                    FINISH
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {FINISHES.map(f => (
                      <button key={f} onClick={() => updateItem({ finish: f })} style={{
                        padding: '8px 6px', borderRadius: 6, border: `1.5px solid`,
                        borderColor: selectedItem.finish === f ? ACCENT : LINE,
                        background: selectedItem.finish === f ? `${ACCENT}10` : 'transparent',
                        fontSize: 10, fontWeight: 600, cursor: 'pointer',
                        color: selectedItem.finish === f ? ACCENT : MUTE,
                        fontFamily: 'inherit', textAlign: 'center',
                      }}>{f}</button>
                    ))}
                  </div>
                </div>

                {/* Hardware */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTE, letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                    HARDWARE
                  </label>
                  <select
                    value={selectedItem.hardware}
                    onChange={e => updateItem({ hardware: e.target.value })}
                    style={{
                      width: '100%', padding: '9px 10px', borderRadius: 7,
                      border: `1px solid ${LINE}`, background: BG,
                      fontFamily: 'inherit', fontSize: 12, color: INK, cursor: 'pointer',
                    }}
                  >
                    {HARDWARES.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                {/* Position */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTE, letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                    POSITION (mm)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 9, color: MUTE, marginBottom: 3 }}>X (from left)</div>
                      <input
                        type="number"
                        value={selectedItem.x}
                        step={100}
                        onChange={e => updateItem({ x: +e.target.value })}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '7px 8px', borderRadius: 6, border: `1px solid ${LINE}`, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: INK, background: BG }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: MUTE, marginBottom: 3 }}>Y (from top)</div>
                      <input
                        type="number"
                        value={selectedItem.y}
                        step={100}
                        onChange={e => updateItem({ y: +e.target.value })}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '7px 8px', borderRadius: 6, border: `1px solid ${LINE}`, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: INK, background: BG }}
                      />
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div style={{ padding: '12px 14px', borderRadius: 8, background: `${ACCENT}0D`, border: `1px solid ${ACCENT}33` }}>
                  <div style={{ fontSize: 10, color: MUTE, marginBottom: 2 }}>UNIT PRICE</div>
                  <div style={{ fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 600, color: INK }}>
                    {formatPrice(selectedItem.entry.price)}
                  </div>
                </div>

                {/* Delete */}
                <button onClick={() => {
                  setPlacedItems(prev => prev.filter(it => it.uid !== selectedUid))
                  setSelectedUid(null)
                }} style={{
                  padding: '10px', borderRadius: 8, border: `1px solid rgba(201,100,66,0.3)`,
                  background: 'transparent', color: ACCENT, fontWeight: 600, fontSize: 12,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  Remove item
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 }}>
              <div style={{ fontSize: 28, opacity: 0.12 }}>⬡</div>
              <div style={{ fontSize: 12, color: MUTE, textAlign: 'center', lineHeight: 1.5 }}>
                Click any item in the floor plan to edit its properties
              </div>
              <div style={{ fontSize: 11, color: MUTE, textAlign: 'center', opacity: 0.7, marginTop: 4 }}>
                Or drag from the catalog to place new items
              </div>
            </div>
          )}

          {/* Summary footer */}
          <div style={{ marginTop: 'auto', borderTop: `1px solid ${LINE}`, padding: 16 }}>
            <div style={{ fontSize: 10, color: MUTE, marginBottom: 4 }}>TOTAL ESTIMATE</div>
            <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 600, color: INK }}>
              {formatPrice(grandTotal)}
            </div>
            <div style={{ fontSize: 10, color: MUTE, marginTop: 2 }}>{placedItems.length} items placed</div>
            <button onClick={() => navigate('/app/studio')} style={{
              width: '100%', marginTop: 14, padding: '11px', borderRadius: 8,
              border: 'none', background: INK, color: PAPER,
              fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Request quote →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Button style helper ───────────────────────────────────────────
const btnSm: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 6, border: `1px solid ${LINE}`,
  background: 'transparent', cursor: 'pointer', fontSize: 14, color: INK,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'inherit',
}
