import type { OrderStage } from '../../types/kreobox'

const STAGE_COLORS: Record<string, [string, string]> = {
  'Quoted':      ['rgba(26,24,21,0.06)', 'var(--kb-ink-soft)'],
  'Confirmed':   ['rgba(31,138,91,0.12)', '#1f8a5b'],
  'In Cut-list': ['rgba(201,100,66,0.12)', 'var(--kb-accent)'],
  'Cut':         ['rgba(201,100,66,0.12)', 'var(--kb-accent)'],
  'Edge-banded': ['rgba(201,100,66,0.12)', 'var(--kb-accent)'],
  'Packed':      ['rgba(31,138,91,0.18)', '#1f8a5b'],
  'Dispatched':  ['rgba(31,138,91,0.22)', '#0d6b45'],
  'Installing':  ['rgba(31,138,91,0.22)', '#0d6b45'],
  'Installed':   ['var(--kb-ink)', 'var(--kb-paper)'],
}

export default function StagePill({ stage }: { stage: OrderStage | string }) {
  const [bg, fg] = STAGE_COLORS[stage] ?? ['rgba(26,24,21,0.06)', 'var(--kb-ink-soft)']
  return (
    <span className="kb-pill" style={{ background: bg, color: fg }}>
      <span className="kb-pill-dot" style={{ background: fg }} />
      {stage}
    </span>
  )
}
