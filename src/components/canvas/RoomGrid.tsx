interface Props {
  cols: number
  rows: number
  cellSize: number
}

export default function RoomGrid({ cols, rows, cellSize }: Props) {
  const W = cols * cellSize
  const H = rows * cellSize

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={W}
      height={H}
    >
      <defs>
        <pattern id="minor-grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
          <path
            d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
          />
        </pattern>
        <pattern id="major-grid" width={cellSize * 2} height={cellSize * 2} patternUnits="userSpaceOnUse">
          <path
            d={`M ${cellSize * 2} 0 L 0 0 0 ${cellSize * 2}`}
            fill="none"
            stroke="rgba(255,255,255,0.09)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#minor-grid)" />
      <rect width="100%" height="100%" fill="url(#major-grid)" />
      {/* Room border */}
      <rect
        x="1" y="1"
        width={W - 2} height={H - 2}
        fill="none"
        stroke="rgba(255,107,53,0.35)"
        strokeWidth="2"
        rx="2"
      />
      {/* Corner markers */}
      {[[0,0],[W,0],[0,H],[W,H]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#FF6B35" opacity="0.5" />
      ))}
    </svg>
  )
}
