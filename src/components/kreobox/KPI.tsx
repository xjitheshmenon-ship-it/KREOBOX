interface KPIProps {
  label: string
  value: string | number
  mono?: boolean
  accent?: boolean
  alert?: boolean
}

export default function KPI({ label, value, mono, accent, alert }: KPIProps) {
  const isAlert = alert && (typeof value === 'number' ? value > 0 : false)
  return (
    <div
      className="kb-font-body"
      style={{
        borderRadius: 10,
        padding: '16px 18px',
        background: accent
          ? 'var(--kb-ink)'
          : isAlert
          ? 'rgba(201,100,66,0.08)'
          : 'var(--kb-paper)',
        border: `1px solid ${accent ? 'var(--kb-ink)' : 'var(--kb-line)'}`,
        color: accent ? 'var(--kb-paper)' : 'var(--kb-ink)',
      }}
    >
      <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6, fontWeight: 600 }}>
        {label}
      </div>
      <div
        className={mono ? 'kb-font-mono' : 'kb-font-display'}
        style={{ fontSize: mono ? 20 : 26, fontWeight: 500, marginTop: 6 }}
      >
        {value}
      </div>
    </div>
  )
}
