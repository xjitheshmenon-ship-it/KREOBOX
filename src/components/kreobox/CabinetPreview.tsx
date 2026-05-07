import { CATALOG, findShutter } from '../../data/catalog'
import type { ProductType } from '../../types/kreobox'

interface PreviewItem {
  type: ProductType
  frames: string[]
  walls?: string[] | null
  shutter: string
  w: number
  h: number
}

export default function CabinetPreview({ item }: { item: PreviewItem }) {
  const shutter = findShutter(item.shutter)
  const cat = CATALOG[item.type]
  if (!cat || !shutter) return null

  const frames = item.frames.map(id => cat.frames.find(f => f.id === id)).filter(Boolean) as typeof cat.frames
  if (frames.length === 0) return null

  const totalW = frames.reduce((s, f) => s + f.w, 0)
  const maxH = Math.max(...frames.map(f => f.h))

  const VBW = 280, VBH = 160
  const padX = 30, padY = 20
  const drawW = VBW - padX * 2
  const drawH = VBH - padY * 2
  const scale = Math.min(drawW / totalW, drawH / maxH)

  let cursorX = padX + (drawW - totalW * scale) / 2

  return (
    <svg viewBox={`0 0 ${VBW} ${VBH}`} width="100%" height="100%" style={{ display: 'block' }}>
      <line x1={20} y1={padY + drawH + 4} x2={VBW - 20} y2={padY + drawH + 4}
        stroke="var(--kb-ink-soft)" strokeWidth="0.5" />
      {frames.map((f, i) => {
        const w = f.w * scale
        const h = f.h * scale
        const x = cursorX
        const y = padY + drawH - h
        cursorX += w
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h}
              fill={shutter.color} stroke={shutter.border} strokeWidth="1" rx="1.5" />
            <line x1={x + w / 2} y1={y + 3} x2={x + w / 2} y2={y + h - 3}
              stroke={shutter.border} strokeWidth="0.4" strokeDasharray="2 2" opacity="0.6" />
            <rect x={x + w / 2 + 2} y={y + h / 2 - 6} width="1.5" height="12" fill="#1a1815" opacity="0.5" />
            <rect x={x + w / 2 - 3.5} y={y + h / 2 - 6} width="1.5" height="12" fill="#1a1815" opacity="0.5" />
          </g>
        )
      })}
      <line x1={padX} y1={padY + drawH + 12} x2={VBW - padX} y2={padY + drawH + 12}
        stroke="var(--kb-ink-soft)" strokeWidth="0.3" />
      <text x={VBW / 2} y={padY + drawH + 20} fontSize="7" fill="var(--kb-ink-soft)"
        textAnchor="middle" fontFamily="JetBrains Mono">
        {(totalW / 1000).toFixed(2)}m wide
      </text>
    </svg>
  )
}
