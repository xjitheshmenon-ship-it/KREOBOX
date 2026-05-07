import { useState, useRef, useCallback, useEffect } from 'react'
import { useKreoboxStore } from '../store/kreoboxStore'
import { inr, generatePanels } from '../data/catalog'
import type { KBOrder } from '../types/kreobox'

// ── isometric engine ─────────────────────────────────────────────────────────
const SC   = 0.055        // mm → px scale
const COS  = 0.866        // cos(30°)
const SIN  = 0.5          // sin(30°)
const GRID = 200          // mm snap grid

type Pt = { x: number; y: number }

function iso(wx: number, wy: number, wz = 0): Pt {
  return {
    x: (wx - wy) * COS * SC,
    y: (wx + wy) * SIN * SC - wz * SC,
  }
}

function poly(pts: Pt[]) {
  return pts.map(p => `${p.x},${p.y}`).join(' ')
}

// inverse iso (screen → floor world, z=0)
function fromIso(sx: number, sy: number): Pt {
  const wx = (sx / (COS * SC) + sy / (SIN * SC)) / 2
  const wy = (sy / (SIN * SC) - sx / (COS * SC)) / 2
  return { x: wx, y: wy }
}

function snap(v: number) { return Math.round(v / GRID) * GRID }

// ── furniture catalogue ───────────────────────────────────────────────────────
const ITEMS: CatalogItem[] = [
  // wardrobes
  { id:'W-450',   label:'Wardrobe 450',   w:450,  d:580,  h:2100, cat:'wardrobe', price:9000,  top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  { id:'W-600',   label:'Wardrobe 600',   w:600,  d:580,  h:2100, cat:'wardrobe', price:11000, top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  { id:'W-750',   label:'Wardrobe 750',   w:750,  d:580,  h:2100, cat:'wardrobe', price:13000, top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  { id:'W-900',   label:'Wardrobe 900',   w:900,  d:580,  h:2100, cat:'wardrobe', price:15000, top:'#e8c8b8', side:'#c9a08a', front:'#d4b09a' },
  // kitchen
  { id:'K-B-600', label:'Base 600',       w:600,  d:600,  h:870,  cat:'kitchen',  price:8000,  top:'#b8d4c8', side:'#7aa898', front:'#8ab8a8' },
  { id:'K-B-900', label:'Base 900',       w:900,  d:600,  h:870,  cat:'kitchen',  price:11000, top:'#b8d4c8', side:'#7aa898', front:'#8ab8a8' },
  { id:'K-SINK',  label:'Sink unit',      w:900,  d:600,  h:870,  cat:'kitchen',  price:6000,  top:'#b8cce4', side:'#7898b8', front:'#88a8c8' },
  { id:'K-FRIDGE',label:'Fridge',         w:700,  d:700,  h:1800, cat:'kitchen',  price:0,     top:'#d8e0e8', side:'#a8b8c8', front:'#b8c8d8' },
  // office
  { id:'O-D-1200',label:'Desk 1200',      w:1200, d:600,  h:750,  cat:'office',   price:18000, top:'#d8c8e8', side:'#8870a8', front:'#a890c0' },
  { id:'O-D-1800',label:'Desk 1800',      w:1800, d:700,  h:750,  cat:'office',   price:26000, top:'#d8c8e8', side:'#8870a8', front:'#a890c0' },
  { id:'O-M-6P',  label:'Meeting 6P',     w:2400, d:1200, h:750,  cat:'office',   price:44000, top:'#e8d8c8', side:'#b89878', front:'#c8a888' },
  { id:'O-S-1200',label:'Storage wall',   w:1200, d:400,  h:1800, cat:'office',   price:19000, top:'#d8c8e8', side:'#8870a8', front:'#a890c0' },
  { id:'O-CHAIR', label:'Chair',          w:600,  d:600,  h:800,  cat:'office',   price:0,     top:'#e8d8b8', side:'#b89858', front:'#c8a868' },
  // living
  { id:'L-BED-Q', label:'Queen bed',      w:1600, d:2000, h:550,  cat:'living',   price:0,     top:'#e8e0d0', side:'#b8a880', front:'#c8b890' },
  { id:'L-SOFA',  label:'Sofa 3-seat',    w:2200, d:900,  h:850,  cat:'living',   price:0,     top:'#d8c0b8', side:'#a87868', front:'#b88878' },
  { id:'L-TV',    label:'TV unit',        w:1800, d:450,  h:500,  cat:'living',   price:12000, top:'#d8c8b8', side:'#a89878', front:'#b8a888' },
]

type Cat = 'wardrobe' | 'kitchen' | 'office' | 'living'

interface CatalogItem {
  id: string; label: string
  w: number; d: number; h: number
  cat: Cat; price: number
  top: string; side: string; front: string
}

interface Placed extends CatalogItem {
  uid: string; x: number; y: number; rot: 0 | 90 | 180 | 270
}

// ── helpers ───────────────────────────────────────────────────────────────────
const newUid = () => Math.random().toString(36).slice(2, 8)

function rotDims(item: Placed) {
  return item.rot === 90 || item.rot === 270
    ? { w: item.d, d: item.w }
    : { w: item.w, d: item.d }
}

// ── component ─────────────────────────────────────────────────────────────────
export default function PlannerPage() {
  const addOrder  = useKreoboxStore(s => s.addOrder)
  const showToast = useKreoboxStore(s => s.showToast)

  const [roomW,  setRoomW]  = useState(5000)
  const [roomD,  setRoomD]  = useState(4000)
  const WALL_H = 2700

  const [catFilter,  setCatFilter]  = useState<Cat | 'all'>('all')
  const [items,      setItems]      = useState<Placed[]>([])
  const [selected,   setSelected]   = useState<string | null>(null)
  const [activePal,  setActivePal]  = useState<string | null>(null)
  const [showOrder,  setShowOrder]  = useState(false)
  const [clientName, setClientName] = useState('')
  const [clientPhone,setClientPhone]= useState('')
  const [view,       setView]       = useState<'3d' | '2d'>('3d')

  const svgRef = useRef<SVGSVGElement>(null)

  // SVG layout offsets
  const offX = roomD * COS * SC           // left margin for depth
  const offY = WALL_H * SC + 20           // top margin for wall height
  const svgW = (roomW + roomD) * COS * SC + 40
  const svgH = (roomW + roomD) * SIN * SC + WALL_H * SC + 60

  // iso with offset applied
  function pt(wx: number, wy: number, wz = 0): Pt {
    const p = iso(wx, wy, wz)
    return { x: p.x + offX + 20, y: p.y + offY }
  }

  // ── SVG click → place item ──────────────────────────────────────────────
  const onSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!activePal || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const sx = e.clientX - rect.left - offX - 20
    const sy = e.clientY - rect.top  - offY
    const world = fromIso(sx, sy)
    const src   = ITEMS.find(i => i.id === activePal)
    if (!src) return
    const x = Math.max(0, Math.min(snap(world.x - src.w / 2), roomW - src.w))
    const y = Math.max(0, Math.min(snap(world.y - src.d / 2), roomD - src.d))
    const uid = newUid()
    setItems(prev => [...prev, { ...src, uid, x, y, rot: 0 }])
    setSelected(uid)
    setActivePal(null)
  }, [activePal, offX, offY, roomW, roomD])

  // ── drag-and-drop from palette ───────────────────────────────────────────
  const draggingPal = useRef<string | null>(null)
  const onPalDragStart = (id: string) => { draggingPal.current = id }

  const onSvgDrop = (e: React.DragEvent<SVGSVGElement>) => {
    e.preventDefault()
    if (!draggingPal.current || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const sx   = e.clientX - rect.left - offX - 20
    const sy   = e.clientY - rect.top  - offY
    const world = fromIso(sx, sy)
    const src   = ITEMS.find(i => i.id === draggingPal.current)
    if (!src) return
    const x = Math.max(0, Math.min(snap(world.x - src.w / 2), roomW - src.w))
    const y = Math.max(0, Math.min(snap(world.y - src.d / 2), roomD - src.d))
    const uid = newUid()
    setItems(prev => [...prev, { ...src, uid, x, y, rot: 0 }])
    setSelected(uid)
    draggingPal.current = null
  }

  // ── move selected ────────────────────────────────────────────────────────
  const move = (dx: number, dy: number) => {
    if (!selected) return
    setItems(prev => prev.map(it => {
      if (it.uid !== selected) return it
      const { w, d } = rotDims(it)
      return {
        ...it,
        x: Math.max(0, Math.min(it.x + dx, roomW - w)),
        y: Math.max(0, Math.min(it.y + dy, roomD - d)),
      }
    }))
  }

  const rotSel = () => setItems(prev => prev.map(it =>
    it.uid !== selected ? it : { ...it, rot: ((it.rot + 90) % 360) as 0|90|180|270 }
  ))

  const delSel = () => { setItems(prev => prev.filter(i => i.uid !== selected)); setSelected(null) }

  // keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') delSel()
      if (e.key === 'r') rotSel()
      if (e.key === 'ArrowLeft')  move(-GRID, 0)
      if (e.key === 'ArrowRight') move(GRID, 0)
      if (e.key === 'ArrowUp')    move(0, -GRID)
      if (e.key === 'ArrowDown')  move(0, GRID)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  const selectedItem = items.find(i => i.uid === selected)
  const totalPrice   = items.reduce((s, i) => s + i.price, 0)

  // painter's sort: back-to-front (higher x+y = further from viewer in iso = render first)
  const sorted = [...items].sort((a, b) => (b.x + b.y) - (a.x + a.y))

  const palette = catFilter === 'all' ? ITEMS : ITEMS.filter(i => i.cat === catFilter)

  const placeOrder = () => {
    if (!items.length) return
    const orderId = 'ORD-' + Math.floor(1050 + Math.random() * 900)
    const config = { type: items[0].cat, wallWidth: roomW, height: 2100, frames: [] as string[], walls: [] as string[], shutter: 'S-WHITE', preset: 'PLANNER' }
    const order: KBOrder = {
      id: orderId,
      customer: { name: clientName || 'Planner client', phone: clientPhone || '—', city: 'Bengaluru', area: '—' },
      contractor: 'Suresh Modulars', type: config.type as any, config: config as any,
      advance: Math.round(totalPrice * 0.35), total: totalPrice,
      stage: 'Quoted', createdAt: new Date().toISOString().slice(0, 10),
      panels: generatePanels(config as any),
    }
    addOrder(order)
    showToast(`${orderId} created — ${inr(totalPrice)}`)
    setShowOrder(false)
  }

  return (
    <div style={{ display:'flex', height:'100vh', background:'#141210', color:'#e8e6e1', fontFamily:'"Inter Tight",sans-serif', overflow:'hidden' }}>

      {/* ── Left palette ─────────────────────────────────────────────────── */}
      <aside style={{ width:185, borderRight:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'12px 10px 8px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'#c96442', marginBottom:8 }}>Drag or click to place</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
            {(['all','wardrobe','kitchen','office','living'] as const).map(c => (
              <button key={c} onClick={() => setCatFilter(c as any)}
                style={{ padding:'3px 8px', borderRadius:99, fontSize:9, fontWeight:600, cursor:'pointer', fontFamily:'inherit', textTransform:'capitalize',
                  background: catFilter===c ? '#c96442':'transparent', color: catFilter===c ? '#fff':'rgba(255,255,255,0.4)',
                  border:`1px solid ${catFilter===c?'#c96442':'rgba(255,255,255,0.12)'}` }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'4px 0' }}>
          {palette.map(item => {
            const isActive = activePal === item.id
            return (
              <div key={item.id} draggable
                onDragStart={() => onPalDragStart(item.id)}
                onClick={() => setActivePal(isActive ? null : item.id)}
                style={{ padding:'8px 10px', cursor:'pointer', borderBottom:'1px solid rgba(255,255,255,0.04)',
                  display:'flex', alignItems:'center', gap:8, userSelect:'none',
                  background: isActive ? 'rgba(201,100,66,0.18)' : 'transparent',
                  borderLeft: isActive ? '2px solid #c96442':'2px solid transparent' }}
                onMouseEnter={e => { if(!isActive) e.currentTarget.style.background='rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if(!isActive) e.currentTarget.style.background='transparent' }}
              >
                {/* 3D mini preview */}
                <svg width={32} height={28} viewBox="0 0 32 28" style={{ flexShrink:0 }}>
                  <polygon points={`16,4 28,10 28,22 16,28`} fill={item.side} />
                  <polygon points={`4,10 16,4 28,10 16,16`} fill={item.top} />
                  <polygon points={`4,10 16,16 16,28 4,22`} fill={item.front} />
                </svg>
                <div>
                  <div style={{ fontSize:11, fontWeight:600 }}>{item.label}</div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', marginTop:1 }}>{item.w}×{item.d}mm</div>
                  {item.price > 0 && <div style={{ fontSize:9, color:'#c96442', fontFamily:'JetBrains Mono' }}>{inr(item.price)}</div>}
                </div>
              </div>
            )
          })}
        </div>

        {activePal && (
          <div style={{ padding:'8px 10px', background:'rgba(201,100,66,0.15)', borderTop:'1px solid rgba(201,100,66,0.3)', fontSize:10, color:'#c96442', fontWeight:700 }}>
            ↗ Click room floor to place
          </div>
        )}
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Toolbar */}
        <div style={{ height:46, display:'flex', alignItems:'center', gap:10, padding:'0 14px', borderBottom:'1px solid rgba(255,255,255,0.08)', flexShrink:0 }}>
          {/* View toggle */}
          <div style={{ display:'flex', borderRadius:8, overflow:'hidden', border:'1px solid rgba(255,255,255,0.12)' }}>
            {(['3d','2d'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding:'5px 12px', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:11, fontWeight:700, textTransform:'uppercase',
                  background: view===v ? '#c96442':'transparent', color: view===v ? '#fff':'rgba(255,255,255,0.45)' }}>
                {v}
              </button>
            ))}
          </div>

          {/* Room size */}
          <div style={{ display:'flex', alignItems:'center', gap:5, marginLeft:4 }}>
            <span style={{ fontSize:9, color:'rgba(255,255,255,0.35)', fontWeight:700, letterSpacing:'0.1em' }}>ROOM</span>
            <input type="number" value={roomW} onChange={e => setRoomW(+e.target.value||5000)} step={100} min={2000} max={12000}
              style={{ width:58, padding:'3px 5px', borderRadius:5, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.06)', color:'#e8e6e1', fontSize:11, fontFamily:'JetBrains Mono', textAlign:'center' }} />
            <span style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>×</span>
            <input type="number" value={roomD} onChange={e => setRoomD(+e.target.value||4000)} step={100} min={2000} max={10000}
              style={{ width:58, padding:'3px 5px', borderRadius:5, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.06)', color:'#e8e6e1', fontSize:11, fontFamily:'JetBrains Mono', textAlign:'center' }} />
            <span style={{ fontSize:9, color:'rgba(255,255,255,0.3)' }}>mm</span>
          </div>

          {selected && <>
            <div style={{ width:1, height:18, background:'rgba(255,255,255,0.1)' }} />
            <button onClick={rotSel} style={tb}>↻ Rotate (R)</button>
            <button onClick={delSel} style={{ ...tb, color:'#ff8080', borderColor:'rgba(255,80,80,0.3)' }}>× Delete</button>
            <button onClick={() => move(-GRID,0)} style={tb}>←</button>
            <button onClick={() => move(GRID,0)}  style={tb}>→</button>
            <button onClick={() => move(0,-GRID)} style={tb}>↑</button>
            <button onClick={() => move(0,GRID)}  style={tb}>↓</button>
            {selectedItem && <span style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontFamily:'JetBrains Mono' }}>{selectedItem.label}</span>}
          </>}

          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{items.length} items</span>
            {totalPrice > 0 && <span style={{ fontFamily:'JetBrains Mono', fontSize:13, color:'#c96442', fontWeight:700 }}>{inr(totalPrice)}</span>}
            <button onClick={() => setShowOrder(true)} disabled={items.length===0}
              style={{ padding:'7px 16px', borderRadius:8, border:'none', background:items.length?'#c96442':'rgba(255,255,255,0.08)', color:'#fff', fontWeight:700, fontSize:12, cursor:items.length?'pointer':'default', fontFamily:'inherit' }}>
              Order →
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex:1, overflow:'auto', display:'flex', alignItems:'center', justifyContent:'center', background:'#0d0c0a', padding:40 }}
          onDragOver={e => e.preventDefault()}>

          {view === '3d' ? (
            // ── 3D Isometric SVG ──────────────────────────────────────────
            <svg
              ref={svgRef}
              width={svgW} height={svgH}
              style={{ display:'block', cursor: activePal ? 'crosshair' : 'default' }}
              onClick={onSvgClick}
              onDragOver={e => e.preventDefault()}
              onDrop={onSvgDrop}
            >
              {/* ── Room floor ── */}
              <polygon
                points={poly([pt(0,0), pt(roomW,0), pt(roomW,roomD), pt(0,roomD)])}
                fill="#e8e2d8" stroke="#b0a898" strokeWidth={1.5}
              />

              {/* Floor grid */}
              {Array.from({length: Math.floor(roomW/GRID)-1}, (_,i) => (i+1)*GRID).map(x => (
                <line key={`gx${x}`}
                  x1={pt(x,0).x} y1={pt(x,0).y}
                  x2={pt(x,roomD).x} y2={pt(x,roomD).y}
                  stroke={x%1000===0?"rgba(0,0,0,0.15)":"rgba(0,0,0,0.06)"} strokeWidth={x%1000===0?1:0.5}
                />
              ))}
              {Array.from({length: Math.floor(roomD/GRID)-1}, (_,i) => (i+1)*GRID).map(y => (
                <line key={`gy${y}`}
                  x1={pt(0,y).x} y1={pt(0,y).y}
                  x2={pt(roomW,y).x} y2={pt(roomW,y).y}
                  stroke={y%1000===0?"rgba(0,0,0,0.15)":"rgba(0,0,0,0.06)"} strokeWidth={y%1000===0?1:0.5}
                />
              ))}

              {/* ── Back wall (y = roomD) ── */}
              <polygon
                points={poly([pt(0,roomD,0), pt(roomW,roomD,0), pt(roomW,roomD,WALL_H), pt(0,roomD,WALL_H)])}
                fill="#d4c8b8" stroke="#b0a898" strokeWidth={1}
              />
              {/* Back wall skirting */}
              <polygon
                points={poly([pt(0,roomD,0), pt(roomW,roomD,0), pt(roomW,roomD,120), pt(0,roomD,120)])}
                fill="#bfb3a3" stroke="none"
              />

              {/* ── Left wall (x = 0) ── */}
              <polygon
                points={poly([pt(0,0,0), pt(0,roomD,0), pt(0,roomD,WALL_H), pt(0,0,WALL_H)])}
                fill="#c8bdb0" stroke="#b0a898" strokeWidth={1}
              />
              {/* Left wall skirting */}
              <polygon
                points={poly([pt(0,0,0), pt(0,roomD,0), pt(0,roomD,120), pt(0,0,120)])}
                fill="#b8ada0" stroke="none"
              />

              {/* Wall top edges */}
              <line x1={pt(0,0,WALL_H).x} y1={pt(0,0,WALL_H).y} x2={pt(roomW,0,WALL_H).x} y2={pt(roomW,0,WALL_H).y} stroke="#9a9080" strokeWidth={1} />
              <line x1={pt(0,0,WALL_H).x} y1={pt(0,0,WALL_H).y} x2={pt(0,roomD,WALL_H).x} y2={pt(0,roomD,WALL_H).y} stroke="#9a9080" strokeWidth={1} />

              {/* ── Furniture (back-to-front) ── */}
              {sorted.map(item => {
                const { w, d } = rotDims(item)
                const ix = item.x, iy = item.y, ih = item.h
                const isSel = item.uid === selected

                // box corners
                const f00 = pt(ix,    iy,    0)
                const f10 = pt(ix+w,  iy,    0)
                const f11 = pt(ix+w,  iy+d,  0)
                const f01 = pt(ix,    iy+d,  0)
                const t00 = pt(ix,    iy,    ih)
                const t10 = pt(ix+w,  iy,    ih)
                const t11 = pt(ix+w,  iy+d,  ih)
                const t01 = pt(ix,    iy+d,  ih)

                const selStroke = isSel ? '#ffffff' : 'none'
                const selW      = isSel ? 1.5 : 0

                return (
                  <g key={item.uid} style={{ cursor:'pointer' }}
                    onClick={e => { e.stopPropagation(); setSelected(isSel ? null : item.uid); setActivePal(null) }}>
                    {/* Right face (x = ix+w) */}
                    <polygon points={poly([f10,f11,t11,t10])} fill={item.side} stroke={selStroke} strokeWidth={selW} />
                    {/* Front face (y = iy) */}
                    <polygon points={poly([f00,f10,t10,t00])} fill={item.front} stroke={selStroke} strokeWidth={selW} />
                    {/* Top face */}
                    <polygon points={poly([t00,t10,t11,t01])} fill={item.top} stroke={selStroke} strokeWidth={selW} />

                    {/* Label on top face */}
                    {isSel && (
                      <text
                        x={(t00.x+t11.x)/2} y={(t00.y+t11.y)/2}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={9} fill="#1c1a16" fontFamily="Inter Tight, sans-serif" fontWeight="700"
                        style={{ pointerEvents:'none' }}
                      >
                        {item.label}
                      </text>
                    )}

                    {/* Selection outline */}
                    {isSel && (
                      <polygon points={poly([f00,f10,f11,f01])} fill="rgba(201,100,66,0.15)" stroke="#c96442" strokeWidth={1.5} strokeDasharray="4 3" />
                    )}

                    {/* Dimension on front face */}
                    <text
                      x={(f00.x+f10.x)/2} y={(f00.y+f10.y)/2 - (t00.y - f00.y)/2}
                      textAnchor="middle" fontSize={7} fill="rgba(0,0,0,0.4)" fontFamily="JetBrains Mono"
                      style={{ pointerEvents:'none' }}
                    >
                      {item.w}
                    </text>
                  </g>
                )
              })}

              {/* ── Dimension labels ── */}
              <text x={(pt(roomW/2,0).x+pt(roomW/2,roomD).x)/2+14} y={(pt(roomW/2,0).y+pt(roomW/2,roomD).y)/2}
                textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.4)" fontFamily="JetBrains Mono"
                transform={`rotate(-30, ${(pt(roomW/2,0).x+pt(roomW/2,roomD).x)/2+14}, ${(pt(roomW/2,0).y+pt(roomW/2,roomD).y)/2})`}>
                {roomW}mm
              </text>

              {/* Empty hint */}
              {items.length === 0 && (
                <text x={pt(roomW/2, roomD/2).x} y={pt(roomW/2, roomD/2).y}
                  textAnchor="middle" fontSize={12} fill="rgba(0,0,0,0.25)" fontFamily="Inter Tight, sans-serif">
                  Drag or click items from the left →
                </text>
              )}
            </svg>

          ) : (
            // ── 2D Floor plan (top-down) ──────────────────────────────────
            <div style={{ position:'relative', width: roomW*0.095*0.6, height: roomD*0.095*0.6, background:'#f5f0e8',
              boxShadow:'0 0 0 10px #8B7355, 0 24px 80px rgba(0,0,0,0.6)', flexShrink:0 }}
              onDragOver={e => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (!draggingPal.current) return
                const rect = e.currentTarget.getBoundingClientRect()
                const sc2 = 0.095*0.6
                const src = ITEMS.find(i => i.id === draggingPal.current)
                if (!src) return
                const x = snap((e.clientX - rect.left) / sc2 - src.w/2)
                const y = snap((e.clientY - rect.top)  / sc2 - src.d/2)
                const uid = newUid()
                setItems(prev => [...prev, { ...src, uid, x: Math.max(0,x), y: Math.max(0,y), rot:0 }])
                setSelected(uid)
                draggingPal.current = null
              }}
              onClick={() => setSelected(null)}>

              {/* Grid */}
              {[...Array(Math.floor(roomW/1000))].map((_,i) => (
                <div key={`gv${i}`} style={{ position:'absolute', left:(i+1)*1000*0.095*0.6, top:0, bottom:0, borderLeft:'1px solid rgba(0,0,0,0.08)' }} />
              ))}
              {[...Array(Math.floor(roomD/1000))].map((_,i) => (
                <div key={`gh${i}`} style={{ position:'absolute', top:(i+1)*1000*0.095*0.6, left:0, right:0, borderTop:'1px solid rgba(0,0,0,0.08)' }} />
              ))}

              {items.map(item => {
                const sc2 = 0.095*0.6
                const { w, d } = rotDims(item)
                const isSel = item.uid === selected
                return (
                  <div key={item.uid}
                    onClick={e => { e.stopPropagation(); setSelected(isSel?null:item.uid) }}
                    style={{ position:'absolute', left:item.x*sc2, top:item.y*sc2, width:w*sc2, height:d*sc2,
                      background:item.top+'80', border:`2px solid ${isSel?'#c96442':item.top}`,
                      boxShadow: isSel?`0 0 0 2px white,0 0 0 4px #c96442`:'none',
                      display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', overflow:'hidden' }}>
                    <span style={{ fontSize:8, fontWeight:700, color:'#1c1a16', textAlign:'center', padding:'0 2px' }}>{item.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Order modal ────────────────────────────────────────────────────── */}
      {showOrder && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
          onClick={() => setShowOrder(false)}>
          <div style={{ background:'#fafaf7', color:'#1c1a16', borderRadius:16, width:460, padding:32, maxHeight:'90vh', overflowY:'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'#c96442', fontWeight:700, marginBottom:6 }}>Place order</div>
            <h2 style={{ fontFamily:'Fraunces', fontSize:24, fontWeight:400, margin:'0 0 20px' }}>Room plan — {items.length} items</h2>

            <div style={{ background:'#f5f3ee', borderRadius:10, padding:'14px 16px', marginBottom:20 }}>
              {items.filter(i => i.price>0).map((item,i,arr) => (
                <div key={item.uid} style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'5px 0', borderBottom: i<arr.length-1?'1px solid #e8e5df':'none' }}>
                  <span style={{ color:'#4a463f' }}>{item.label}</span>
                  <span style={{ fontFamily:'JetBrains Mono', fontWeight:600 }}>{inr(item.price)}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, fontWeight:700, marginTop:10, paddingTop:10, borderTop:'2px solid #e8e5df' }}>
                <span>Total</span>
                <span style={{ fontFamily:'JetBrains Mono', color:'#c96442' }}>{inr(totalPrice)}</span>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
              {[
                { label:'Client name', val:clientName, set:setClientName, ph:'e.g. Ravi Sharma' },
                { label:'Phone',       val:clientPhone, set:setClientPhone, ph:'98765 43210' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#7a7672', display:'block', marginBottom:5 }}>{f.label}</label>
                  <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                    style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid #e8e5df', fontSize:14, fontFamily:'inherit', outline:'none', boxSizing:'border-box' as const }} />
                </div>
              ))}
            </div>

            <button onClick={placeOrder}
              style={{ width:'100%', padding:14, borderRadius:10, border:'none', background:'#c96442', color:'#fff', fontWeight:700, fontSize:15, cursor:'pointer', fontFamily:'inherit' }}>
              Send to DesignOS Studio →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const tb: React.CSSProperties = {
  padding:'4px 10px', borderRadius:6, border:'1px solid rgba(255,255,255,0.15)',
  background:'transparent', color:'#e8e6e1', fontSize:11, cursor:'pointer', fontFamily:'inherit', fontWeight:600,
}
