import { useState } from 'react'
import { useKreoboxStore } from '../store/kreoboxStore'

// ── Design tokens ────────────────────────────────────────────────────────────
const fBg = '#1f1c19'
const fSub = '#27241f'
const fSub2 = '#191613'
const fInk = '#0e0d0b'
const fLine = 'rgba(255,255,255,0.08)'
const fMute = 'rgba(255,255,255,0.55)'
const fAccent = '#c96442'
const fOk = '#4cba85'
const fWarn = '#d9a049'
const fInfo = '#5b8def'

// ── Shared styles ─────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: fSub,
  border: `1px solid ${fLine}`,
  borderRadius: 8,
  padding: '14px 16px',
}
const sectionLabel: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: fMute,
  fontWeight: 700,
}
const pill = (bg: string, color: string): React.CSSProperties => ({
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.04em',
  background: bg,
  color,
  display: 'inline-block',
  whiteSpace: 'nowrap',
})

// ── Static members ────────────────────────────────────────────────────────────
const MEMBERS = [
  { initials: 'RI', name: 'Reema Iyer',     role: 'Owner · Admin',     roleColor: fAccent, projects: null,  lastSeen: 'Now' },
  { initials: 'AS', name: 'Aditya Shenoy',  role: 'Designer',          roleColor: fInfo,   projects: null,  lastSeen: '2h ago' },
  { initials: 'PN', name: 'Priya Nair',     role: 'PM · Site',         roleColor: fOk,     projects: null,  lastSeen: '4h ago' },
  { initials: 'SM', name: 'Suresh M.',      role: 'Factory ops',       roleColor: fWarn,   projects: null,  lastSeen: 'Yesterday' },
  { initials: 'HV', name: 'Hettich vendor', role: 'External · POs',    roleColor: fMute,   projects: 0,     lastSeen: '3d ago' },
]

// ── Static integrations ───────────────────────────────────────────────────────
const INTEGRATIONS = [
  { letter: 'T', name: 'Tally · Books',        desc: 'Accounting sync · auto-invoicing',    connected: true },
  { letter: 'R', name: 'Razorpay',             desc: 'Payment gateway · advance collection', connected: true },
  { letter: 'W', name: 'WhatsApp Business',    desc: 'Customer comms · status notifications',connected: true },
  { letter: 'H', name: 'Hettich · Vendor API', desc: 'Price list · stock feed',              connected: true },
  { letter: 'C', name: 'Caesarstone API',      desc: 'Slab catalogue · lead times',          connected: false },
  { letter: 'Z', name: 'Zoho People · HR',     desc: 'Payroll · attendance',                 connected: false },
]

// ── Static audit entries ──────────────────────────────────────────────────────
const AUDIT = [
  { who: 'Reema',  act: 'released WO to factory',              tag: 'release', warn: false, t: '14:28' },
  { who: 'Aditya', act: 'changed margin floor to 22%',         tag: 'finance', warn: true,  t: '12:04' },
  { who: 'System', act: 'auto-flagged sink spec mismatch',      tag: 'qa',      warn: false, t: '11:42' },
  { who: 'Priya',  act: 'invited factory ops user',            tag: 'access',  warn: true,  t: '09:15' },
  { who: 'API',    act: 'Hettich price list refreshed · 1,840 SKUs', tag: 'sync', warn: false, t: '06:00' },
]

// ── Sub-nav tabs ──────────────────────────────────────────────────────────────
const NAV_TABS = ['Overview', 'Members & roles', 'Billing', 'Integrations', 'Branding', 'Security', 'API']

export default function AdminPage() {
  const orders = useKreoboxStore(s => s.orders)
  const [activeTab, setActiveTab] = useState('Overview')

  // Compute per-member project counts from orders
  const membersWithCounts = MEMBERS.map(m => {
    if (m.projects !== null) return m
    const count = orders.filter(o => o.contractor && o.contractor.toLowerCase().includes(m.name.split(' ')[0].toLowerCase())).length
    return { ...m, projects: count }
  })

  const plansCreated = orders.length
  const posIssued = orders.filter(o => o.stage !== 'Quoted').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: fBg, color: '#fff', fontFamily: '"Inter Tight", sans-serif', overflow: 'hidden' }}>

      {/* TopBar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 22px', height: 48, borderBottom: `1px solid ${fLine}`, flexShrink: 0, gap: 16 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: fMute, letterSpacing: '0.08em' }}>
          STUDIO ADMIN · ATELIER REEMA
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: fOk, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 9 }}>●</span> All systems operational
        </span>
        <button style={{ padding: '5px 12px', borderRadius: 6, border: `1px solid ${fLine}`, background: 'transparent', color: fMute, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>
          Audit log
        </button>
      </div>

      {/* Sub-nav */}
      <div style={{ display: 'flex', gap: 4, padding: '8px 22px', borderBottom: `1px solid ${fLine}`, flexShrink: 0 }}>
        {NAV_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${activeTab === tab ? fLine : 'transparent'}`,
              background: activeTab === tab ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: activeTab === tab ? '#fff' : fMute,
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'inherit',
              fontWeight: activeTab === tab ? 600 : 400,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main body: 2-col grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, padding: 22, background: fBg, overflow: 'hidden' }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto', minHeight: 0 }}>

          {/* 1. Members card */}
          <div style={card}>
            {/* Card header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14, gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={sectionLabel}>Members</div>
                <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 400, color: '#fff', lineHeight: 1.1, marginTop: 2 }}>
                  11 of 15 seats
                </div>
              </div>
              <button style={{ padding: '5px 12px', borderRadius: 6, border: `1px solid ${fLine}`, background: 'transparent', color: fMute, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>
                Roles
              </button>
              <button style={{ padding: '5px 14px', borderRadius: 6, border: 'none', background: fAccent, color: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: 600 }}>
                + Invite
              </button>
            </div>

            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 70px 90px 32px', gap: 8, padding: '0 4px 8px', borderBottom: `1px solid ${fLine}` }}>
              {['Member', 'Role', 'Projects', 'Last seen', ''].map(h => (
                <div key={h} style={{ ...sectionLabel, fontSize: 9 }}>{h}</div>
              ))}
            </div>

            {/* Member rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {membersWithCounts.map((m, i) => (
                <div
                  key={m.name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 120px 70px 90px 32px',
                    gap: 8,
                    padding: '10px 4px',
                    alignItems: 'center',
                    borderBottom: i < membersWithCounts.length - 1 ? `1px solid ${fLine}` : 'none',
                  }}
                >
                  {/* Avatar + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: fSub2,
                      border: `1px solid ${fLine}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10, fontWeight: 700, color: m.roleColor, flexShrink: 0,
                    }}>
                      {m.initials}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{m.name}</span>
                  </div>
                  {/* Role */}
                  <div style={{ ...pill('rgba(255,255,255,0.06)', m.roleColor), fontSize: 10 }}>{m.role}</div>
                  {/* Projects */}
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: fMute, paddingLeft: 4 }}>{m.projects}</div>
                  {/* Last seen */}
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: fMute }}>{m.lastSeen}</div>
                  {/* Actions */}
                  <button style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${fLine}`, background: 'transparent', color: fMute, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ···
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Bottom row: Subscription + This Month */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            {/* Subscription card */}
            <div style={card}>
              <div style={sectionLabel}>Subscription</div>
              <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 400, color: '#fff', marginTop: 4, lineHeight: 1.1 }}>
                Studio · Annual
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: fMute, marginTop: 4 }}>
                Renews Mar 14, 2027
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: `1px solid ${fLine}` }}>
                <div style={{ fontSize: 11, color: fMute }}>15 seats · 50 projects</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: '#fff' }}>₹ 4,80,000 / yr</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button style={{ flex: 1, padding: '7px 0', borderRadius: 6, border: `1px solid ${fLine}`, background: 'transparent', color: fMute, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>
                  Manage
                </button>
                <button style={{ flex: 1, padding: '7px 0', borderRadius: 6, border: 'none', background: fAccent, color: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: 600 }}>
                  Upgrade
                </button>
              </div>
            </div>

            {/* This month card */}
            <div style={card}>
              <div style={sectionLabel}>This month</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
                {[
                  { label: 'Plans created', value: String(plansCreated) },
                  { label: 'POs issued',    value: String(posIssued) },
                  { label: 'Storage',       value: '14.2 GB' },
                  { label: 'API calls',     value: '112k' },
                ].map(kpi => (
                  <div key={kpi.label} style={{ background: fSub2, borderRadius: 6, padding: '10px 12px', border: `1px solid ${fLine}` }}>
                    <div style={{ ...sectionLabel, fontSize: 9 }}>{kpi.label}</div>
                    <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 400, color: '#fff', marginTop: 4, lineHeight: 1 }}>
                      {kpi.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto', minHeight: 0 }}>

          {/* Integrations card */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={sectionLabel}>Integrations</div>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: fMute }}>
                4 connected · 2 available
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {INTEGRATIONS.map((intg, i) => (
                <div
                  key={intg.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 4px',
                    borderBottom: i < INTEGRATIONS.length - 1 ? `1px solid ${fLine}` : 'none',
                  }}
                >
                  {/* Icon square */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 6,
                    background: fSub2,
                    border: `1px solid ${fLine}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 12, fontWeight: 700, color: intg.connected ? '#fff' : fMute, flexShrink: 0,
                  }}>
                    {intg.letter}
                  </div>
                  {/* Name + desc */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{intg.name}</div>
                    <div style={{ fontSize: 10, color: fMute, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{intg.desc}</div>
                  </div>
                  {/* Status pill */}
                  <div style={{
                    ...pill(
                      intg.connected ? 'rgba(76,186,133,0.15)' : 'rgba(255,255,255,0.06)',
                      intg.connected ? fOk : fMute,
                    ),
                  }}>
                    {intg.connected ? 'connected' : 'available'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit log card */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={sectionLabel}>Audit · last 24h</div>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: fAccent, fontWeight: 700 }}>
                3 sensitive
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {AUDIT.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 60px 80px',
                    gap: 8,
                    alignItems: 'center',
                    padding: '9px 4px',
                    borderBottom: i < AUDIT.length - 1 ? `1px solid ${fLine}` : 'none',
                  }}
                >
                  {/* Who */}
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.who}
                  </div>
                  {/* Action */}
                  <div style={{ fontSize: 11, color: fMute, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.act}
                  </div>
                  {/* Tag */}
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: entry.warn ? fAccent : fMute,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {entry.tag}
                  </div>
                  {/* Time */}
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: fMute, textAlign: 'right' }}>
                    {entry.t}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
