interface Props {
  cols: number
  rows: number
  cellSize: number
}

export default function RoomGrid({ cols, rows, cellSize }: Props) {
  const W = cols * cellSize
  const H = rows * cellSize

  return (
    <svg className="absolute inset-0 pointer-events-none" width={W} height={H}>
      <defs>
        <pattern id="minor-grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
          <path
            d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
            fill="none" stroke="rgba(28,26,22,0.05)" strokeWidth="0.5"
          />
        </pattern>
        <pattern id="major-grid" width={cellSize * 2} height={cellSize * 2} patternUnits="userSpaceOnUse">
          <path
            d={`M ${cellSize * 2} 0 L 0 0 0 ${cellSize * 2}`}
            fill="none" stroke="rgba(28,26,22,0.10)" strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#minor-grid)" />
      <rect width="100%" height="100%" fill="url(#major-grid)" />
      <rect x="1" y="1" width={W - 2} height={H - 2} fill="none" stroke="rgba(232,82,40,0.5)" strokeWidth="2" rx="2" />
      {([[0,0],[W,0],[0,H],[W,H]] as [number,number][]).map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#E85228" opacity="0.6" />
      ))}
    </svg>
  )
}
