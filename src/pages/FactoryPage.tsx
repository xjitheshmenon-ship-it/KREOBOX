import type { CSSProperties } from 'react'
import { useKreoboxStore } from '../store/kreoboxStore'
import { inr } from '../data/catalog'
import type { KBOrder, KBInventory } from '../types/kreobox'

/* ── Design tokens ── */
const fBg      = '#1f1c19'
const fSub     = '#27241f'
const fSub2    = '#191613'
const fInk     = '#0e0d0b'
const fLine    = 'rgba(255,255,255,0.08)'
const fMute    = 'rgba(255,255,255,0.55)'
const fAccent  = '#c96442'
const fOk      = '#4cba85'
const fWarn    = '#d9a049'
const fInfo    = '#5b8def'

const uiFont   = '"Inter Tight", sans-serif'
const monoFont = 'JetBrains Mono, monospace'
const dispFont = '"Fraunces", serif'

const sectionLabel: CSSProperties = {
  fontSize: 9,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.45)',
  fontWeight: 700,
  fontFamily: uiFont,
}

const card: CSSProperties = {
  background: fSub,
  border: `1px solid ${fLine}`,
  borderRadius: 8,
  padding: '14px 16px',
}

/* ── Stage → WO status mapping ── */
function stageStatus(stage: string, isCutting: boolean): { label: string; color: string } {
  if (isCutting) return { label: 'cutting', color: fAccent }
  switch (stage) {
    case 'In Cut-list': return { label: 'queued',      color: fMute }
    case 'Cut':         return { label: 'done',        color: fOk }
    case 'Edge-banded': return { label: 'edgebanding', color: fInfo }
    case 'Confirmed':   return { label: 'queued',      color: fMute }
    default:            return { label: stage.toLowerCase(), color: fMute }
  }
}

/* ── Machine mock progress for each order ── */
function orderProgress(stage: string): number {
  switch (stage) {
    case 'Confirmed':   return 0
    case 'In Cut-list': return 15
    case 'Cut':         return 55
    case 'Edge-banded': return 80
    case 'Packed':      return 95
    case 'Dispatched':  return 100
    default:            return 0
  }
}

/* keep inr available for value display if needed */
void inr

export default function FactoryPage() {
  const orders           = useKreoboxStore(s => s.orders)
  const inventory        = useKreoboxStore(s => s.inventory)
  const updateOrderStage = useKreoboxStore(s => s.updateOrderStage)

  /* KPI computations */
  const sheetsQueued   = orders.filter(o => ['Confirmed', 'In Cut-list'].includes(o.stage)).length
  const sheetsCutToday = orders.filter(o => o.stage === 'Cut').length
  const activeOrders   = orders.filter(o => !['Quoted'].includes(o.stage))
  const onTimeCount    = Math.max(0, activeOrders.length - 1)
  const onTimeWOs      = `${onTimeCount} / ${activeOrders.length}`

  /* Work-order list — only factory-relevant stages */
  const woOrders = orders.filter(o =>
    ['Confirmed', 'In Cut-list', 'Cut', 'Edge-banded'].includes(o.stage)
  )
  const firstCuttingIdx = woOrders.findIndex(o => o.stage === 'In Cut-list')

  return (
    <div style={{
      minHeight: '100vh',
      background: fBg,
      color: '#e8e6e1',
      fontFamily: uiFont,
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── TopBar ── */}
      <TopBar orders={orders} />

      {/* ── KPI strip ── */}
      <KpiStrip
        sheetsQueued={sheetsQueued}
        sheetsCutToday={sheetsCutToday}
        onTimeWOs={onTimeWOs}
      />

      {/* ── 3-column workspace ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: 0,
        overflow: 'hidden',
        minHeight: 0,
      }}>

        {/* Left 300px — Work orders */}
        <div style={{
          width: 300,
          flexShrink: 0,
          background: fSub2,
          borderRight: `1px solid ${fLine}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <WorkOrderList
            orders={woOrders}
            firstCuttingIdx={firstCuttingIdx}
            updateOrderStage={updateOrderStage}
          />
        </div>

        {/* Center flex — CutNest + Machine timeline */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: fBg,
        }}>
          <div style={{ flex: 1, padding: '20px 20px 0', overflowY: 'auto' }}>
            <div style={{ ...sectionLabel, marginBottom: 10 }}>CNC Nesting View</div>
            <CutNest />
          </div>
          <div style={{
            padding: '16px 20px 20px',
            borderTop: `1px solid ${fLine}`,
            flexShrink: 0,
          }}>
            <div style={{ ...sectionLabel, marginBottom: 10 }}>Machine Timeline — Today</div>
            <MachineTimeline />
          </div>
        </div>

        {/* Right 280px — Operators + Material */}
        <div style={{
          width: 280,
          flexShrink: 0,
          background: fSub2,
          borderLeft: `1px solid ${fLine}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <OperatorsPanel orders={woOrders} firstCuttingIdx={firstCuttingIdx} />
          <MaterialPanel inventory={inventory} />
        </div>

      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   TOP BAR
══════════════════════════════════════════════ */
function TopBar({ orders }: { orders: KBOrder[] }) {
  const activeWO = orders.find(o => o.stage === 'In Cut-list')

  return (
    <header style={{
      height: 52,
      background: fSub,
      borderBottom: `1px solid ${fLine}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 16,
      flexShrink: 0,
    }}>

      {/* Title */}
      <span style={{
        fontFamily: uiFont,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#e8e6e1',
      }}>
        Factory · Whitefield Works
      </span>

      {/* LIVE badge */}
      <span style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        background: 'rgba(76,186,133,0.12)',
        border: `1px solid ${fOk}`,
        borderRadius: 4,
        padding: '2px 8px',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: fOk,
        fontFamily: uiFont,
        textTransform: 'uppercase',
      }}>
        <span style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: fOk,
        }} />
        Live
      </span>

      {/* Shift info */}
      <span style={{ fontSize: 11, color: fMute, fontFamily: uiFont }}>
        Shift A · 08:00 – 20:00
        {activeWO && (
          <span style={{
            marginLeft: 12,
            color: fAccent,
            fontFamily: monoFont,
            fontSize: 10,
          }}>
            ▶ {activeWO.id} on CNC-01
          </span>
        )}
      </span>

      <div style={{ flex: 1 }} />

      {/* Action buttons */}
      <button style={{
        padding: '6px 14px',
        borderRadius: 6,
        border: `1px solid ${fLine}`,
        background: 'transparent',
        color: fMute,
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: uiFont,
      }}>
        Print travelers
      </button>

      <button style={{
        padding: '6px 14px',
        borderRadius: 6,
        border: 'none',
        background: fAccent,
        color: '#fff',
        fontSize: 11,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: uiFont,
      }}>
        + Release work order
      </button>
    </header>
  )
}

/* ══════════════════════════════════════════════
   KPI STRIP
══════════════════════════════════════════════ */
function KpiStrip({
  sheetsQueued,
  sheetsCutToday,
  onTimeWOs,
}: {
  sheetsQueued: number
  sheetsCutToday: number
  onTimeWOs: string
}) {
  const kpis = [
    { label: 'Sheets queued',    value: String(sheetsQueued),    sub: 'in cut-list',     color: fMute  },
    { label: 'Sheets cut today', value: String(sheetsCutToday),  sub: 'since 08:00',     color: fOk   },
    { label: 'Yield',            value: '93.6%',                 sub: 'target 92%',      color: fOk   },
    { label: 'CNC utilization',  value: '78%',                   sub: 'CNC-01 + CNC-02', color: fInfo },
    { label: 'On-time WOs',      value: onTimeWOs,               sub: 'within ETA',      color: fOk   },
  ]

  return (
    <div style={{
      background: fSub2,
      borderBottom: `1px solid ${fLine}`,
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      flexShrink: 0,
    }}>
      {kpis.map((k, i) => (
        <div key={k.label} style={{
          padding: '14px 18px',
          borderRight: i < 4 ? `1px solid ${fLine}` : 'none',
        }}>
          <div style={sectionLabel}>{k.label}</div>
          <div style={{
            fontFamily: dispFont,
            fontSize: 28,
            fontWeight: 300,
            color: k.color,
            marginTop: 4,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            {k.value}
          </div>
          <div style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.35)',
            marginTop: 2,
            fontFamily: uiFont,
          }}>
            {k.sub}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════
   WORK ORDER LIST (left column)
══════════════════════════════════════════════ */
function WorkOrderList({
  orders,
  firstCuttingIdx,
  updateOrderStage,
}: {
  orders: KBOrder[]
  firstCuttingIdx: number
  updateOrderStage: (id: string, stage: any) => void
}) {
  void updateOrderStage // available for future interactions

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '14px 16px 10px',
        borderBottom: `1px solid ${fLine}`,
        flexShrink: 0,
      }}>
        <div style={sectionLabel}>Work Orders</div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        {orders.length === 0 && (
          <div style={{
            fontSize: 12,
            color: fMute,
            textAlign: 'center',
            paddingTop: 32,
            fontFamily: uiFont,
          }}>
            No active work orders
          </div>
        )}

        {orders.map((order, idx) => {
          const isCutting = idx === firstCuttingIdx
          const { label: statusLabel, color: statusColor } = stageStatus(order.stage, isCutting)
          const progress = orderProgress(order.stage)
          const machine  = isCutting ? 'CNC-01' : order.stage === 'Edge-banded' ? 'EB-01' : 'CNC-02'

          return (
            <div key={order.id} style={{
              background: isCutting ? 'rgba(201,100,66,0.08)' : fSub,
              border: isCutting ? `1px solid ${fAccent}` : `1px solid ${fLine}`,
              borderRadius: 8,
              padding: '12px 14px',
            }}>

              {/* Header row: WO ID + status pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}>
                <span style={{
                  fontFamily: monoFont,
                  fontSize: 11,
                  color: fAccent,
                  fontWeight: 700,
                }}>
                  {order.id}
                </span>
                <span style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: statusColor,
                  fontFamily: uiFont,
                  padding: '2px 6px',
                  borderRadius: 3,
                  background: `${statusColor}18`,
                  border: `1px solid ${statusColor}44`,
                }}>
                  {statusLabel}
                </span>
              </div>

              {/* Project name */}
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#e8e6e1',
                marginBottom: 2,
                fontFamily: uiFont,
              }}>
                {order.customer.name}
              </div>

              {/* Meta: type · machine · ETA */}
              <div style={{
                fontSize: 10,
                color: fMute,
                fontFamily: uiFont,
                marginBottom: 8,
              }}>
                {order.type} · {machine} · ETA {order.createdAt}
              </div>

              {/* Progress bar */}
              <div style={{
                background: fLine,
                borderRadius: 3,
                height: 3,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: isCutting ? fAccent : statusColor,
                  borderRadius: 3,
                  transition: 'width 0.4s ease',
                }} />
              </div>
              <div style={{
                fontSize: 9,
                color: fMute,
                marginTop: 4,
                fontFamily: monoFont,
              }}>
                {progress}%
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   CUTNEST SVG VIEWER (center)
══════════════════════════════════════════════ */
function CutNest() {
  // Sheet 2440×1220 mm rendered at 600×300 viewport (scale ≈ 0.245)
  const SW = 600
  const SH = 300

  type Piece = {
    label: string
    sub?: string
    x: number   // % of SW
    y: number   // % of SH
    w: number   // % of SW
    h: number   // % of SH
    color: string
    toolPath?: boolean
  }

  // Layout: doors left two columns, sides far right, shelves bottom-left
  const pieces: Piece[] = [
    { label: 'D-12',  sub: 'door · shaker',   x:  2, y:  2, w: 28, h: 62, color: fAccent, toolPath: true },
    { label: 'D-13',  sub: 'door · shaker',   x: 32, y:  2, w: 28, h: 62, color: fAccent },
    { label: 'S-04',  sub: 'pantry side',      x: 62, y:  2, w: 17, h: 92, color: fInfo },
    { label: 'S-05',  sub: 'side panel',       x: 81, y:  2, w: 17, h: 92, color: fInfo },
    { label: 'SH-01', sub: 'shelf',            x:  2, y: 67, w: 28, h: 20, color: fOk },
    { label: 'SH-02', sub: 'shelf',            x: 32, y: 67, w: 28, h: 20, color: fOk },
    { label: 'SH-03', sub: 'shelf',            x:  2, y: 89, w: 58, h:  8, color: fOk },
  ]

  // Offcut region: top-right area between the door/shelf columns and side panels
  // Approx 62%..62% wide gap? Actually gap between col2 end (60%) and sides start (62%) is tiny.
  // Place offcut below shelves on the right of bottom area
  const offcutX   = 2
  const offcutY   = 67
  const offcutW   = 58
  const offcutH   = 29
  // We'll show offcut annotation in empty bottom-right area
  const ocAnnotX  = 62
  const ocAnnotY  = 67
  const ocAnnotW  = 36
  const ocAnnotH  = 30

  const offcutPct = (100 - 93.6).toFixed(1)
  void offcutX; void offcutY; void offcutW; void offcutH

  return (
    <div style={{
      background: fSub,
      border: `1px solid ${fLine}`,
      borderRadius: 8,
      overflow: 'hidden',
    }}>

      {/* Sheet label bar */}
      <div style={{
        padding: '8px 14px',
        borderBottom: `1px solid ${fLine}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: monoFont, fontSize: 10, color: fMute }}>
          SHEET 2440 × 1220 · HDF 18mm
        </span>
        <div style={{ display: 'flex', gap: 14 }}>
          {[
            { color: fAccent, label: 'Door panels' },
            { color: fInfo,   label: 'Sides' },
            { color: fOk,     label: 'Shelves' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: l.color,
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 9, color: fMute, fontFamily: uiFont }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG canvas */}
      <div style={{ padding: 12 }}>
        <svg
          viewBox={`0 0 ${SW} ${SH}`}
          width="100%"
          style={{ display: 'block', maxHeight: 240 }}
        >
          {/* Sheet background */}
          <rect x={0} y={0} width={SW} height={SH} fill={fInk} rx={4} />
          <rect x={0} y={0} width={SW} height={SH} fill="none" stroke={fLine} strokeWidth={1} rx={4} />

          {/* Subtle grid */}
          {[1, 2, 3, 4].map(i => (
            <line
              key={`v${i}`}
              x1={SW * i / 5} y1={0} x2={SW * i / 5} y2={SH}
              stroke={fLine} strokeWidth={0.5} strokeDasharray="3 4"
            />
          ))}
          {[1, 2, 3].map(i => (
            <line
              key={`h${i}`}
              x1={0} y1={SH * i / 4} x2={SW} y2={SH * i / 4}
              stroke={fLine} strokeWidth={0.5} strokeDasharray="3 4"
            />
          ))}

          {/* Pieces */}
          {pieces.map(p => {
            const px = (p.x / 100) * SW
            const py = (p.y / 100) * SH
            const pw = (p.w / 100) * SW
            const ph = (p.h / 100) * SH
            return (
              <g key={p.label}>
                <rect
                  x={px + 1} y={py + 1}
                  width={pw - 2} height={ph - 2}
                  fill={`${p.color}22`}
                  stroke={p.color}
                  strokeWidth={1.5}
                  rx={2}
                />
                {/* Tool path dashed overlay on active piece */}
                {p.toolPath && (
                  <rect
                    x={px + 5} y={py + 5}
                    width={pw - 10} height={ph - 10}
                    fill="none"
                    stroke={p.color}
                    strokeWidth={1}
                    strokeDasharray="4 3"
                    opacity={0.6}
                    rx={1}
                  />
                )}
                <text
                  x={px + pw / 2}
                  y={ph > 30 ? py + ph / 2 - 6 : py + ph / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={p.color}
                  fontSize={10}
                  fontFamily={monoFont}
                  fontWeight={700}
                >
                  {p.label}
                </text>
                {p.sub && ph > 28 && (
                  <text
                    x={px + pw / 2}
                    y={py + ph / 2 + 9}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={`${p.color}99`}
                    fontSize={7.5}
                    fontFamily={uiFont}
                  >
                    {p.sub}
                  </text>
                )}
              </g>
            )
          })}

          {/* Offcut annotation — bottom-right empty area */}
          <rect
            x={(ocAnnotX / 100) * SW}
            y={(ocAnnotY / 100) * SH}
            width={(ocAnnotW / 100) * SW}
            height={(ocAnnotH / 100) * SH}
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1}
            strokeDasharray="4 3"
            rx={2}
          />
          <text
            x={(ocAnnotX / 100) * SW + (ocAnnotW / 100) * SW / 2}
            y={(ocAnnotY / 100) * SH + (ocAnnotH / 100) * SH / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.3)"
            fontSize={9}
            fontFamily={monoFont}
            fontWeight={600}
          >
            OFFCUT · {offcutPct}%
          </text>

          {/* Sheet dimension label */}
          <text
            x={SW / 2}
            y={SH - 5}
            textAnchor="middle"
            dominantBaseline="auto"
            fill="rgba(255,255,255,0.2)"
            fontSize={8}
            fontFamily={monoFont}
          >
            2440 mm
          </text>
          <text
            x={5}
            y={SH / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.2)"
            fontSize={8}
            fontFamily={monoFont}
            transform={`rotate(-90, 5, ${SH / 2})`}
          >
            1220 mm
          </text>
        </svg>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   MACHINE TIMELINE (bottom of center)
══════════════════════════════════════════════ */
function MachineTimeline() {
  const hours  = [8, 10, 12, 14, 16, 18, 20]
  const totalH = 12 // span: 08 → 20

  type Seg = {
    start: number
    end: number
    color: string
    label: string
    dashed?: boolean
  }

  const machines: { id: string; segs: Seg[] }[] = [
    {
      id: 'CNC-01',
      segs: [
        { start: 8,    end: 9.5,  color: fOk,                       label: 'WO-2341 done' },
        { start: 9.5,  end: 12,   color: fAccent,                    label: 'WO-2342 cutting now' },
        { start: 12,   end: 13.5, color: 'rgba(255,255,255,0.15)',   label: 'lunch break' },
        { start: 13.5, end: 16,   color: fAccent, dashed: true,      label: 'WO-2343 queued' },
        { start: 16,   end: 18,   color: 'rgba(255,255,255,0.15)',   label: 'idle' },
      ],
    },
    {
      id: 'CNC-02',
      segs: [
        { start: 8,    end: 10,   color: fOk,                       label: 'done' },
        { start: 10,   end: 11.5, color: 'rgba(255,255,255,0.15)',   label: 'tool change' },
        { start: 11.5, end: 15,   color: fAccent, dashed: true,     label: 'WO-2344 queued' },
        { start: 15,   end: 18,   color: 'rgba(255,255,255,0.15)',   label: 'idle' },
      ],
    },
    {
      id: 'EB-01',
      segs: [
        { start: 8,    end: 11,   color: fOk,                       label: 'done' },
        { start: 11,   end: 14,   color: fInfo,                      label: 'edgebanding' },
        { start: 14,   end: 16.5, color: fInfo,   dashed: true,     label: 'queued edgebanding' },
        { start: 16.5, end: 18,   color: 'rgba(255,255,255,0.15)',   label: 'idle' },
      ],
    },
  ]

  const barH = 22

  return (
    <div>
      {/* Hour axis labels */}
      <div style={{ display: 'flex', marginLeft: 64, marginBottom: 4 }}>
        {hours.map(h => (
          <div key={h} style={{
            flex: 1,
            fontSize: 9,
            color: fMute,
            fontFamily: monoFont,
            textAlign: 'center',
          }}>
            {String(h).padStart(2, '0')}
          </div>
        ))}
      </div>

      {/* Machine rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {machines.map(m => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center' }}>
            {/* Machine ID label */}
            <div style={{
              width: 60,
              fontSize: 10,
              fontFamily: monoFont,
              color: fMute,
              flexShrink: 0,
              textAlign: 'right',
              paddingRight: 8,
            }}>
              {m.id}
            </div>

            {/* Timeline bar */}
            <div style={{
              flex: 1,
              height: barH,
              background: fInk,
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              border: `1px solid ${fLine}`,
            }}>
              {m.segs.map((seg, i) => {
                const left  = ((seg.start - 8) / totalH) * 100
                const width = ((seg.end - seg.start) / totalH) * 100
                return (
                  <div
                    key={i}
                    title={seg.label}
                    style={{
                      position: 'absolute',
                      left:   `${left}%`,
                      width:  `${width}%`,
                      top:    0,
                      bottom: 0,
                      background: seg.dashed
                        ? `repeating-linear-gradient(90deg, ${seg.color} 0px, ${seg.color} 6px, transparent 6px, transparent 10px)`
                        : seg.color,
                      opacity: seg.dashed ? 0.65 : 1,
                      borderRight: i < m.segs.length - 1 ? `1px solid ${fBg}` : undefined,
                    }}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginTop: 10, marginLeft: 64, flexWrap: 'wrap' }}>
        {[
          { color: fOk,                      label: 'Done' },
          { color: fAccent,                  label: 'Cutting' },
          { color: fInfo,                    label: 'Edgebanding' },
          { color: 'rgba(255,255,255,0.15)', label: 'Idle' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: l.color,
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 9, color: fMute, fontFamily: uiFont }}>{l.label}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{
            width: 10,
            height: 10,
            borderRadius: 2,
            flexShrink: 0,
            backgroundImage: `repeating-linear-gradient(90deg, ${fAccent} 0px, ${fAccent} 3px, transparent 3px, transparent 5px)`,
          }} />
          <span style={{ fontSize: 9, color: fMute, fontFamily: uiFont }}>Queued</span>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   OPERATORS PANEL (right column, top)
══════════════════════════════════════════════ */
function OperatorsPanel({
  orders,
  firstCuttingIdx,
}: {
  orders: KBOrder[]
  firstCuttingIdx: number
}) {
  const cuttingId = firstCuttingIdx >= 0 ? (orders[firstCuttingIdx]?.id ?? null) : null
  const ebOrder   = orders.find(o => o.stage === 'Edge-banded')
  const ebId      = ebOrder?.id ?? null

  const operators = [
    {
      name:   'Suresh M.',
      role:   'CNC-01 op',
      status: cuttingId ? `cutting ${cuttingId}` : 'idle',
      color:  cuttingId ? fAccent : fMute,
    },
    {
      name:   'Vikram T.',
      role:   'CNC-02 op',
      status: 'idle · changing tool',
      color:  fWarn,
    },
    {
      name:   'Anil P.',
      role:   'Edgebander',
      status: ebId ? `EB on ${ebId}` : 'idle',
      color:  ebId ? fInfo : fMute,
    },
    {
      name:   'Lakshmi R.',
      role:   'QC',
      status: 'inspecting',
      color:  fAccent,
    },
  ]

  return (
    <div style={{
      borderBottom: `1px solid ${fLine}`,
      padding: '14px 16px',
      flexShrink: 0,
    }}>
      <div style={{ ...sectionLabel, marginBottom: 10 }}>Operators on Floor</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {operators.map(op => (
          <div key={op.name} style={{
            ...card,
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}>
            {/* Avatar initial */}
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: `${op.color}22`,
              border: `1.5px solid ${op.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 10,
              fontWeight: 700,
              color: op.color,
              fontFamily: uiFont,
            }}>
              {op.name[0]}
            </div>
            <div>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#e8e6e1',
                fontFamily: uiFont,
              }}>
                {op.name}
              </div>
              <div style={{ fontSize: 10, color: fMute, fontFamily: uiFont }}>{op.role}</div>
              <div style={{ fontSize: 10, color: op.color, fontFamily: monoFont, marginTop: 2 }}>
                {op.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   MATERIAL ON HAND (right column, bottom)
══════════════════════════════════════════════ */
function MaterialPanel({ inventory }: { inventory: KBInventory }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
      <div style={{ ...sectionLabel, marginBottom: 10 }}>Material on Hand</div>

      {/* Laminate sheets */}
      <div style={{
        ...sectionLabel,
        fontSize: 8,
        marginBottom: 6,
        color: 'rgba(255,255,255,0.3)',
      }}>
        Laminate sheets
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {inventory.laminates.map(l => {
          const ok    = l.sheets > l.reorderAt
          const color = ok ? fOk : l.sheets === 0 ? fAccent : fWarn
          const pct   = Math.min(100, (l.sheets / Math.max(l.reorderAt * 2, 1)) * 100)
          return (
            <div key={l.id} style={{ ...card, padding: '9px 12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 5,
              }}>
                <span style={{ fontSize: 11, color: '#e8e6e1', fontFamily: uiFont }}>
                  {l.label}
                </span>
                <span style={{ fontFamily: monoFont, fontSize: 10, color }}>
                  {l.sheets}
                  <span style={{ color: fMute, fontWeight: 400 }}>/{l.reorderAt} min</span>
                </span>
              </div>
              <div style={{ background: fLine, borderRadius: 2, height: 3, overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: color,
                  borderRadius: 2,
                }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Hardware kits */}
      <div style={{
        ...sectionLabel,
        fontSize: 8,
        marginBottom: 6,
        color: 'rgba(255,255,255,0.3)',
      }}>
        Hardware kits
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {inventory.hardware.map(h => {
          const ok    = h.units > h.reorderAt
          const color = ok ? fOk : h.units === 0 ? fAccent : fWarn
          const pct   = Math.min(100, (h.units / Math.max(h.reorderAt * 2, 1)) * 100)
          return (
            <div key={h.id} style={{ ...card, padding: '9px 12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 5,
              }}>
                <span style={{ fontSize: 11, color: '#e8e6e1', fontFamily: uiFont }}>
                  {h.label}
                </span>
                <span style={{ fontFamily: monoFont, fontSize: 10, color }}>
                  {h.units}
                  <span style={{ color: fMute, fontWeight: 400 }}>/{h.reorderAt} min</span>
                </span>
              </div>
              <div style={{ background: fLine, borderRadius: 2, height: 3, overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: color,
                  borderRadius: 2,
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
