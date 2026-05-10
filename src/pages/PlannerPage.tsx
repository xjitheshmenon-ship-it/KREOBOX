import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Design tokens ─────────────────────────────────────────────────
const BG     = '#f0eee9'
const PAPER  = '#fafaf7'
const INK    = '#1a1815'
const MUTE   = 'rgba(26,24,21,0.55)'
const LINE   = 'rgba(26,24,21,0.09)'
const ACCENT = '#c96442'

type ProductMode = 'kitchen' | 'wardrobe' | 'office'
type ViewMode    = '2D plan' | 'Elevation' | '3D walk'

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
  const opts: ViewMode[] = ['2D plan', 'Elevation', '3D walk']
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

// ── Catalog helpers ───────────────────────────────────────────────
function CatalogSection({ title }: { title: string }) {
  return (
    <div style={{ padding: '14px 10px 8px', fontSize: 10, letterSpacing: '0.18em',
      textTransform: 'uppercase' as const, color: MUTE, fontWeight: 600 }}>{title}</div>
  )
}

function CatalogItem({ name, code, width, dragging }: { name: string; code: string; width: string; dragging?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderRadius: 8,
      background: dragging ? 'rgba(201,100,66,0.06)' : 'transparent',
      border: dragging ? `1px dashed ${ACCENT}` : '1px solid transparent', cursor: 'grab',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 6, background: '#e8e2d5', border: `1px solid ${LINE}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: MUTE, flexShrink: 0,
      }}>{width}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: MUTE }}>{code}</div>
      </div>
    </div>
  )
}

function FinishSwatch({ tones, label }: { tones: [string, string]; label: string }) {
  return (
    <div>
      <div style={{
        height: 56, borderRadius: 8,
        background: `linear-gradient(135deg, ${tones[0]}, ${tones[1]})`,
        marginBottom: 6, border: `1px solid ${LINE}`,
      }} />
      <div style={{ fontSize: 11, fontWeight: 500 }}>{label}</div>
    </div>
  )
}

// ── SVG Viewports ─────────────────────────────────────────────────
function KitchenPlan2D({ selected = 'pantry' }: { selected?: string }) {
  const cabFill = '#e8e2d5', cabStroke = '#a99a82'
  const isSel = (id: string) => selected === id
  return (
    <svg viewBox="0 0 480 380" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(26,24,21,0.06)" strokeWidth="1" />
        </pattern>
        <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M100 0 L0 0 0 100" fill="none" stroke="rgba(26,24,21,0.12)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="40" y="40" width="400" height="300" fill="url(#grid)" />
      <rect x="40" y="40" width="400" height="300" fill="url(#grid-major)" />
      <path d="M40 340 L40 40 L440 40" fill="none" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <path d="M440 40 L440 140" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M40 340 L160 340" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <rect x="44" y="44" width="392" height="292" fill="rgba(232,226,213,0.25)" />
      <rect x="48" y="48" width="380" height="40" fill="rgba(201,100,66,0.05)" stroke={cabStroke} strokeWidth="1" strokeDasharray="3 3" />
      <text x="238" y="73" fill={MUTE} fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">UPPERS — 3.8m</text>
      <rect x="48" y="92" width="100" height="60" fill={cabFill}
        stroke={isSel('base-top-1') ? ACCENT : cabStroke} strokeWidth={isSel('base-top-1') ? 4 : 2} />
      <line x1="98" y1="92" x2="98" y2="152" stroke={cabStroke} strokeWidth="1" />
      <text x="98" y="128" fill={INK} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" opacity="0.55">DRAWER · 1000</text>
      <rect x="148" y="92" width="120" height="60" fill={cabFill} stroke={cabStroke} strokeWidth="2" />
      <rect x="160" y="100" width="96" height="44" fill="#d9d2c3" stroke={cabStroke} strokeWidth="1" rx="3" />
      <circle cx="208" cy="122" r="3" fill={cabStroke} />
      <text x="208" y="170" fill={INK} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" opacity="0.55">SINK · 1200</text>
      <rect x="268" y="92" width="100" height="60" fill={cabFill} stroke={cabStroke} strokeWidth="2" />
      <rect x="278" y="100" width="80" height="44" fill={INK} rx="2" />
      <circle cx="294" cy="115" r="5" fill="#3a352e" />
      <circle cx="320" cy="115" r="5" fill="#3a352e" />
      <circle cx="294" cy="135" r="5" fill="#3a352e" />
      <circle cx="320" cy="135" r="5" fill="#3a352e" />
      <text x="318" y="170" fill={INK} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" opacity="0.55">HOB · 900</text>
      <rect x="368" y="92" width="60" height="60" fill={cabFill}
        stroke={isSel('pantry') ? ACCENT : cabStroke} strokeWidth={isSel('pantry') ? 3 : 2} />
      <line x1="368" y1="122" x2="428" y2="122" stroke={isSel('pantry') ? ACCENT : cabStroke} strokeWidth="1" />
      <text x="398" y="128" fill={INK} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" opacity="0.7">TALL · 600</text>
      <rect x="48" y="152" width="60" height="100" fill={cabFill} stroke={cabStroke} strokeWidth="2" />
      <text x="78" y="208" fill={INK} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" opacity="0.55">FRIDGE</text>
      <rect x="48" y="252" width="60" height="80" fill={cabFill} stroke={cabStroke} strokeWidth="2" />
      <text x="78" y="298" fill={INK} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" opacity="0.55">DRAWER</text>
      <rect x="180" y="220" width="220" height="80" fill="#0e0d0b" rx="2" />
      <rect x="190" y="230" width="200" height="60" fill="#1f1c19" rx="1" />
      <text x="290" y="265" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">ISLAND · 2.2m × 0.8m</text>
      <text x="290" y="280" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">QUARTZ · BREAKFAST</text>
      <line x1="48" y1="32" x2="428" y2="32" stroke={MUTE} strokeWidth="1" />
      <line x1="48" y1="28" x2="48" y2="36" stroke={MUTE} strokeWidth="1" />
      <line x1="428" y1="28" x2="428" y2="36" stroke={MUTE} strokeWidth="1" />
      <text x="238" y="24" fill={MUTE} fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">3,800 mm</text>
      <line x1="32" y1="48" x2="32" y2="332" stroke={MUTE} strokeWidth="1" />
      <line x1="28" y1="48" x2="36" y2="48" stroke={MUTE} strokeWidth="1" />
      <line x1="28" y1="332" x2="36" y2="332" stroke={MUTE} strokeWidth="1" />
      <text x="20" y="190" fill={MUTE} fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle" transform="rotate(-90, 20, 190)">2,840 mm</text>
      {isSel('pantry') && (
        <>
          <line x1="398" y1="92" x2="398" y2="62" stroke={ACCENT} strokeWidth="1" strokeDasharray="3 2" />
          <rect x="346" y="42" width="104" height="20" fill={PAPER} stroke={ACCENT} strokeWidth="1" rx="3" />
          <text x="398" y="55" fill={ACCENT} fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="600">PANTRY 600 × 2400</text>
        </>
      )}
    </svg>
  )
}

function WardrobeElevation() {
  const bayW = 180, bayH = 320, yTop = 20
  const cabStroke = '#a99a82'
  const interiors = [
    [
      { y: 0,   h: 60,  type: 'shelf',  label: '1 shelf' },
      { y: 60,  h: 200, type: 'hang',   label: 'Long hang' },
      { y: 260, h: 60,  type: 'drawer', label: '2 drawers' },
    ],
    [
      { y: 0,   h: 30,  type: 'shelf', label: 'Top shelf' },
      { y: 30,  h: 130, type: 'hang',  label: 'Hang · 1m' },
      { y: 160, h: 130, type: 'hang',  label: 'Hang · 1m' },
      { y: 290, h: 30,  type: 'shelf', label: 'Bottom' },
    ],
    [
      { y: 0,   h: 80,  type: 'shelf',  label: '2 shelves' },
      { y: 80,  h: 80,  type: 'basket', label: '2 baskets' },
      { y: 160, h: 160, type: 'drawer', label: '4 drawers' },
    ],
  ]
  const fills:   Record<string, string> = { shelf: '#e8e2d5', hang: 'rgba(91,141,239,0.18)', drawer: 'rgba(201,100,66,0.18)', basket: 'rgba(124,92,255,0.18)' }
  const strokes: Record<string, string> = { shelf: cabStroke, hang: '#5b8def', drawer: ACCENT, basket: '#7c5cff' }

  return (
    <svg viewBox="0 0 600 380" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <pattern id="wgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(26,24,21,0.06)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="600" height="380" fill={PAPER} />
      <rect x="20" y={yTop} width="560" height={bayH + 20} fill="url(#wgrid)" />
      <line x1="20" y1={yTop + bayH + 20} x2="580" y2={yTop + bayH + 20} stroke={INK} strokeWidth="2" />
      {[0, 1, 2].map(bi => {
        const x = 30 + bi * (bayW + 5)
        const sel = bi === 1
        return (
          <g key={bi}>
            <rect x={x} y={yTop} width={bayW} height={bayH}
              fill="none" stroke={sel ? ACCENT : INK} strokeWidth={sel ? 3 : 2} />
            {interiors[bi].map((m, mi) => (
              <g key={mi}>
                <rect x={x + 4} y={yTop + 4 + (m.y * bayH / 320)} width={bayW - 8} height={(m.h * bayH / 320) - 4}
                  fill={fills[m.type]} stroke={strokes[m.type]} strokeWidth="1" />
                {m.type === 'hang' && (
                  <line x1={x + 12} y1={yTop + 4 + (m.y * bayH / 320) + 8}
                    x2={x + bayW - 12} y2={yTop + 4 + (m.y * bayH / 320) + 8}
                    stroke={strokes.hang} strokeWidth="2" />
                )}
                <text x={x + bayW / 2} y={yTop + 4 + (m.y * bayH / 320) + (m.h * bayH / 320) / 2 + 3}
                  fill={INK} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" opacity="0.7">
                  {m.label}
                </text>
              </g>
            ))}
            <text x={x + bayW / 2} y={yTop - 8} fill={sel ? ACCENT : MUTE} fontSize="10"
              fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight={sel ? '700' : '500'}>
              BAY {String.fromCharCode(65 + bi)} · 900mm
            </text>
            <text x={x + bayW / 2} y={yTop + bayH + 35} fill={MUTE} fontSize="9"
              fontFamily="JetBrains Mono, monospace" textAnchor="middle">2400 × 900 × 600</text>
          </g>
        )
      })}
      <line x1="30" y1={yTop + bayH + 50} x2={30 + 3 * bayW + 10} y2={yTop + bayH + 50} stroke={MUTE} strokeWidth="1" />
      <text x={30 + (3 * bayW + 10) / 2} y={yTop + bayH + 64} fill={MUTE} fontSize="10"
        fontFamily="JetBrains Mono, monospace" textAnchor="middle">2,710 mm overall</text>
    </svg>
  )
}

function OfficeFloorPlan() {
  return (
    <svg viewBox="0 0 580 380" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <pattern id="ofgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(26,24,21,0.05)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="20" y="20" width="540" height="340" fill="url(#ofgrid)" />
      <path d="M20 20 L560 20 L560 360 L20 360 Z" fill="none" stroke={INK} strokeWidth="6" />
      <path d="M180 20 A30 30 0 0 1 210 50" fill="none" stroke={MUTE} strokeWidth="1" />
      <line x1="180" y1="20" x2="180" y2="50" stroke={MUTE} strokeWidth="1" />
      <text x="40" y="44" fill={MUTE} fontSize="10" fontFamily="JetBrains Mono, monospace" letterSpacing="0.14em" fontWeight="700">WORKSTATIONS · 6 SEATS</text>
      {[0, 1, 2].map(i => (
        <g key={'d' + i}>
          <rect x={50 + i * 80} y="80" width="70" height="44" fill={PAPER} stroke="#a99a82" strokeWidth="1.5" />
          <circle cx={50 + i * 80 + 35} cy="138" r="9" fill="none" stroke="#a99a82" strokeWidth="1.5" />
          <text x={50 + i * 80 + 35} y="106" fill={MUTE} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">DESK</text>
        </g>
      ))}
      {[0, 1, 2].map(i => (
        <g key={'d2' + i}>
          <rect x={50 + i * 80} y="200" width="70" height="44" fill={PAPER} stroke="#a99a82" strokeWidth="1.5" />
          <circle cx={50 + i * 80 + 35} cy="186" r="9" fill="none" stroke="#a99a82" strokeWidth="1.5" />
          <text x={50 + i * 80 + 35} y="226" fill={MUTE} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">DESK</text>
        </g>
      ))}
      <rect x="320" y="40" width="220" height="160" fill="rgba(26,24,21,0.025)" stroke="#a99a82" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="430" y="60" fill={MUTE} fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle" letterSpacing="0.14em" fontWeight="700">MEETING · 8</text>
      <rect x="350" y="90" width="160" height="60" fill={PAPER} stroke="#a99a82" strokeWidth="1.5" />
      {[0, 1, 2, 3].map(i => <circle key={i}       cx={368 + i * 36} cy="80"  r="7" fill="none" stroke="#a99a82" strokeWidth="1.5" />)}
      {[0, 1, 2, 3].map(i => <circle key={i + 'b'} cx={368 + i * 36} cy="160" r="7" fill="none" stroke="#a99a82" strokeWidth="1.5" />)}
      <rect x="40" y="270" width="220" height="60" fill="rgba(201,100,66,0.08)" stroke={ACCENT} strokeWidth="3" />
      <line x1="95"  y1="270" x2="95"  y2="330" stroke="#a99a82" strokeWidth="1" />
      <line x1="150" y1="270" x2="150" y2="330" stroke="#a99a82" strokeWidth="1" />
      <line x1="205" y1="270" x2="205" y2="330" stroke="#a99a82" strokeWidth="1" />
      <text x="150" y="304" fill={ACCENT} fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="700">STORAGE WALL · A</text>
      <text x="150" y="318" fill={MUTE} fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">4 BAYS · 2200w · 2100h</text>
      <rect x="290" y="220" width="40" height="110" fill="rgba(91,141,239,0.08)" stroke="#5b8def" strokeWidth="1.5" />
      <text x="310" y="280" fill="#5b8def" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="700">TOWER B</text>
      <rect x="350" y="230" width="160" height="30" fill="rgba(124,92,255,0.08)" stroke="#7c5cff" strokeWidth="1.5" />
      <text x="430" y="250" fill="#7c5cff" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="700">CREDENZA C</text>
      <text x="290" y="14" fill={MUTE} fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">5,400 mm</text>
      <text x="14" y="190" fill={MUTE} fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle" transform="rotate(-90, 14, 190)">3,400 mm</text>
    </svg>
  )
}

// ── Catalog panels per mode ───────────────────────────────────────
function KitchenCatalog() {
  return (
    <div style={{ flex: 1, overflow: 'hidden auto', padding: '0 8px' }}>
      <CatalogSection title="Base cabinets · 720h" />
      <CatalogItem name="Drawer base, 3-pull"    code="KBX-CB-300-D3 · ₹ 18,400"  width="600" />
      <CatalogItem name="Sink base, single basin" code="KBX-CB-1200-SB · ₹ 32,100" width="1200" dragging />
      <CatalogItem name="Corner carousel"         code="KBX-CB-900-CC · ₹ 41,200"  width="900" />
      <CatalogSection title="Tall units · 2400h" />
      <CatalogItem name="Pantry pull-out"         code="KBX-TU-600-PP · ₹ 64,800"  width="600" />
      <CatalogItem name="Tower oven housing"      code="KBX-TU-600-OV · ₹ 38,000"  width="600" />
      <CatalogSection title="Finishes" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '0 10px 16px' }}>
        <FinishSwatch tones={['#d4ccbe', '#b8a995']} label="Bali oak" />
        <FinishSwatch tones={['#3a352e', '#1a1815']} label="Espresso" />
        <FinishSwatch tones={['#fafaf7', '#dcd8d0']} label="Bone matte" />
      </div>
    </div>
  )
}

function WardrobeCatalog() {
  return (
    <div style={{ flex: 1, overflow: 'hidden auto', padding: '0 8px' }}>
      <CatalogSection title="Hang space" />
      <CatalogItem name="Long hang, 2400h"          code="KBX-WI-LH-2400 · ₹ 8,200"  width="full" />
      <CatalogItem name="Double hang, 2 × 1200h"    code="KBX-WI-DH-2400 · ₹ 9,400"  width="900" />
      <CatalogItem name="Trouser pull-out"          code="KBX-WI-TR-100 · ₹ 6,900"   width="100" />
      <CatalogSection title="Drawers & baskets" />
      <CatalogItem name="Drawer, 200h push-to-open" code="KBX-WI-DR-200P · ₹ 4,800"  width="200" dragging />
      <CatalogItem name="Drawer, 150h soft-close"   code="KBX-WI-DR-150SC · ₹ 5,200" width="150" />
      <CatalogItem name="Mesh basket, 150h"         code="KBX-WI-BA-150 · ₹ 2,400"   width="150" />
      <CatalogSection title="Shelves & pull-outs" />
      <CatalogItem name="Shoe shelf pull-out"       code="KBX-WI-SH-200P · ₹ 7,400"  width="200" />
      <CatalogItem name="Tie / belt rack"           code="KBX-WI-TB-050 · ₹ 1,800"   width="50" />
      <CatalogSection title="Finishes" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '0 10px 16px' }}>
        <FinishSwatch tones={['#d4ccbe', '#b8a995']} label="Bali oak" />
        <FinishSwatch tones={['#2e2a24', '#1a1815']} label="Espresso" />
        <FinishSwatch tones={['#e8e4dd', '#d0cbbf']} label="Sand grey" />
      </div>
    </div>
  )
}

function OfficeCatalog() {
  return (
    <div style={{ flex: 1, overflow: 'hidden auto', padding: '0 8px' }}>
      <CatalogSection title="Workstations" />
      <CatalogItem name="Linear desk, 1200w"        code="KBX-OF-WS-1200 · ₹ 28,400" width="1200" />
      <CatalogItem name="L-desk, 1600 × 1200"       code="KBX-OF-LD-1600 · ₹ 44,800" width="1600" dragging />
      <CatalogItem name="Bench seat, 4-person"      code="KBX-OF-BN-4P · ₹ 94,000"   width="2400" />
      <CatalogSection title="Storage" />
      <CatalogItem name="Filing cabinet, 3-drawer"  code="KBX-OF-FC-3D · ₹ 18,200"   width="450" />
      <CatalogItem name="Storage wall bay, 2100h"   code="KBX-OF-SW-600 · ₹ 36,400"  width="600" />
      <CatalogItem name="Personal locker × 3"       code="KBX-OF-LK-3P · ₹ 22,800"   width="900" />
      <CatalogSection title="Meeting" />
      <CatalogItem name="Conference table, 8-seat"  code="KBX-OF-CT-8 · ₹ 1,28,000"  width="2400" />
      <CatalogItem name="Credenza, 1600w"           code="KBX-OF-CR-1600 · ₹ 64,200" width="1600" />
    </div>
  )
}

// ── Right-panel detail per mode ───────────────────────────────────
const MODE_DETAIL = {
  kitchen: {
    name:  'Pantry pull-out',
    code:  'KBX-TU-600-PP · 600 × 2400 × 600 mm',
    props: [['Width', '600 mm'], ['Height', '2,400 mm'], ['Finish', 'Bali oak'], ['Hardware', 'Push-to-open']] as [string, string][],
    prov:  'Carcass HDF, FSC-certified. Laminate by Greenlam, Hosur. 7-year warranty.',
    bom:   [['Base cabinets · 4', '₹ 1,12,400'], ['Tall units · 2', '₹ 1,02,800'], ['Wall cabinets · 5', '₹ 86,500'], ['Quartz worktop · 5.4 m', '₹ 1,89,000'], ['Hardware & lighting', '₹ 47,200']] as [string, string][],
    total: '₹ 5,37,900', items: 14, cta: 'Request quote',
  },
  wardrobe: {
    name:  'Double hang · Bay B',
    code:  'KBX-WRD-B · 900 × 2400 × 600 mm',
    props: [['Bays', '3 × 900 mm'], ['Height', '2,400 mm'], ['Finish', 'Bali oak'], ['Hardware', 'Soft-close']] as [string, string][],
    prov:  'Carcass 18mm HDF. Handles Hettich, Germany. FSC-certified board.',
    bom:   [['Carcass × 3', '₹ 64,200'], ['Doors · Bali oak', '₹ 38,800'], ['Hang rods × 4', '₹ 4,200'], ['Drawers × 6', '₹ 28,400'], ['Hardware', '₹ 9,800']] as [string, string][],
    total: '₹ 1,45,400', items: 5, cta: 'Request quote',
  },
  office: {
    name:  'Storage wall · A',
    code:  'KBX-OF-SW-4B · 2200 × 2100 × 600 mm',
    props: [['Bays', '4 × 550 mm'], ['Height', '2,100 mm'], ['Finish', 'Sand grey'], ['Type', 'Mixed interior']] as [string, string][],
    prov:  '18mm HDHMR carcass. Hettich push-to-open fittings. Powder-coated steel accents.',
    bom:   [['Carcass × 4', '₹ 78,400'], ['Locker bays', '₹ 28,200'], ['Filing drawers × 4', '₹ 38,800'], ['Open shelf bays', '₹ 18,400'], ['Hardware', '₹ 14,200']] as [string, string][],
    total: '₹ 2,18,000', items: 8, cta: 'Request quote',
  },
}

const VIEWPORT_LABEL: Record<ProductMode, string> = {
  kitchen:  'L-shape · 3.8 × 2.84 m · Scale 1:25',
  wardrobe: 'Elevation · 1:25 · 3 bays · A B C',
  office:   'Top-down · 5.4 × 3.4 m · Scale 1:50',
}

const BREADCRUMB: Record<ProductMode, string> = {
  kitchen:  'Whitefield · 3BHK / Kitchen plan',
  wardrobe: 'Whitefield · MBR / Wardrobe',
  office:   'Indiranagar Studio / Office plan',
}

const AI_TIP: Record<ProductMode, React.ReactNode> = {
  kitchen:  <>Your sink-to-hob distance is <span style={{ color: ACCENT, fontWeight: 600 }}>1.2 m</span> — the comfortable working triangle. Consider a 600 mm drawer between them for utensils.</>,
  wardrobe: <>Bay B double-hang fits <span style={{ color: ACCENT, fontWeight: 600 }}>~80 garments</span>. Adding a shoe pull-out to bay C would increase utilisation by 18%.</>,
  office:   <>Storage wall A has <span style={{ color: ACCENT, fontWeight: 600 }}>1,200 mm aisle clearance</span> — ergonomics passed. Cable bay A4 aligns with floor outlet P-08.</>,
}

// ── Main component ────────────────────────────────────────────────
export default function PlannerPage() {
  const navigate = useNavigate()
  const [mode, setMode]    = useState<ProductMode>('kitchen')
  const [view, setView]    = useState<ViewMode>('2D plan')
  const [aiVisible, setAi] = useState(true)
  const detail = MODE_DETAIL[mode]

  return (
    <div style={{
      width: '100vw', height: '100vh', background: BG, color: INK,
      fontFamily: '"Inter Tight", -apple-system, system-ui, sans-serif',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* ── TopBar ─────────────────────────────────────────────── */}
      <div style={{
        height: 60, padding: '0 24px', background: PAPER, borderBottom: `1px solid ${LINE}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <KreoboxLogo size={22} />
          </button>
          <span style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Kreobox</span>
          <span style={{ width: 1, height: 22, background: LINE, flexShrink: 0 }} />
          <span style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ color: MUTE }}>{BREADCRUMB[mode].split(' / ')[0]} / </span>
            <strong>{BREADCRUMB[mode].split(' / ')[1]}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <ProductSwitch active={mode} onChange={m => { setMode(m); setAi(true) }} />
          <span style={{ width: 1, height: 22, background: LINE }} />
          <ViewToggle active={view} onChange={setView} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: MUTE, fontFamily: 'JetBrains Mono, monospace' }}>Saved · 2 min ago</span>
          <button style={{ padding: '7px 13px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1px solid ${LINE}`, background: 'transparent', fontFamily: 'inherit' }}>Share</button>
          <button style={{ padding: '7px 13px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: INK, color: PAPER, border: 'none', fontFamily: 'inherit' }}>Send to studio →</button>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* LEFT — Catalog */}
        <div style={{ width: 280, background: PAPER, borderRight: `1px solid ${LINE}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 18px 10px' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: MUTE, fontWeight: 600 }}>Catalog</div>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 22, marginTop: 4, letterSpacing: '-0.01em' }}>
              {mode === 'kitchen' ? 'Add to your kitchen' : mode === 'wardrobe' ? 'What goes inside' : 'Add to your office'}
            </div>
          </div>
          <div style={{ padding: '0 14px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
            {['All', 'Cabinets', 'Surfaces', 'Hardware', 'Appliances', 'Lighting'].map((c, i) => (
              <span key={c} style={{
                padding: '5px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                background: i === 1 ? INK : 'transparent', color: i === 1 ? PAPER : INK,
                border: i === 1 ? 'none' : `1px solid ${LINE}`,
              }}>{c}</span>
            ))}
          </div>
          <div style={{ padding: '4px 14px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'rgba(26,24,21,0.04)', borderRadius: 8, fontSize: 12, color: MUTE }}>
              <span style={{ fontSize: 15 }}>⌕</span>
              <span style={{ flex: 1 }}>Search 1,240 items…</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, padding: '1px 6px', background: PAPER, borderRadius: 4, border: `1px solid ${LINE}` }}>⌘K</span>
            </div>
          </div>
          {mode === 'kitchen'  && <KitchenCatalog />}
          {mode === 'wardrobe' && <WardrobeCatalog />}
          {mode === 'office'   && <OfficeCatalog />}
        </div>

        {/* CENTER — Viewport */}
        <div style={{ flex: 1, background: BG, display: 'flex', flexDirection: 'column', position: 'relative', minWidth: 0 }}>
          <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 2, background: PAPER, border: `1px solid ${LINE}`, borderRadius: 8, padding: '6px 10px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: MUTE }}>
            {VIEWPORT_LABEL[mode]}
          </div>
          <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['＋', '−', '⌖', '↺'].map(s => (
              <button key={s} style={{ width: 32, height: 32, borderRadius: 8, background: PAPER, border: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>{s}</button>
            ))}
          </div>
          <div style={{ flex: 1, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
            <div style={{
              width: '100%', maxWidth: 700,
              aspectRatio: mode === 'office' ? '580 / 380' : mode === 'wardrobe' ? '600 / 380' : '480 / 380',
              background: PAPER, borderRadius: 12, border: `1px solid ${LINE}`,
              boxShadow: '0 30px 80px -30px rgba(0,0,0,0.18)', overflow: 'hidden',
            }}>
              {mode === 'kitchen'  && <KitchenPlan2D selected="pantry" />}
              {mode === 'wardrobe' && <WardrobeElevation />}
              {mode === 'office'   && <OfficeFloorPlan />}
            </div>
          </div>
          {aiVisible && (
            <div style={{ margin: '0 24px 16px', background: '#0e0d0b', color: PAPER, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, ${ACCENT}, #d97042)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>K</div>
              <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5 }}>
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>Kreobox · </span>
                {AI_TIP[mode]}
              </div>
              <button style={{ padding: '7px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.08)', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', color: PAPER, fontFamily: 'inherit' }}>Apply</button>
              <button onClick={() => setAi(false)} style={{ padding: '7px 12px', borderRadius: 6, fontSize: 12, color: 'rgba(255,255,255,0.55)', cursor: 'pointer', border: 'none', background: 'transparent', fontFamily: 'inherit' }}>Dismiss</button>
            </div>
          )}
        </div>

        {/* RIGHT — Selected + BOM */}
        <div style={{ width: 320, background: PAPER, borderLeft: `1px solid ${LINE}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${LINE}`, flexShrink: 0 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: MUTE, fontWeight: 600 }}>Selected</div>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 22, marginTop: 4, letterSpacing: '-0.01em' }}>{detail.name}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: MUTE, marginTop: 4 }}>{detail.code}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
              {detail.props.map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: MUTE, fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, fontFamily: val.includes('mm') ? 'JetBrains Mono, monospace' : 'inherit' }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: '10px 12px', background: 'rgba(26,24,21,0.04)', borderRadius: 8 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: MUTE, fontWeight: 600 }}>Provenance</div>
              <div style={{ fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{detail.prov}</div>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'hidden auto', padding: '14px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: MUTE, fontWeight: 600 }}>Live cost · {detail.items} items</div>
              <span style={{ fontSize: 11, color: ACCENT, fontWeight: 600, cursor: 'pointer' }}>See full BOM</span>
            </div>
            {detail.bom.map(([n, a], i) => (
              <div key={n} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderTop: i ? `1px solid ${LINE}` : 'none', fontSize: 12 }}>
                <span>{n}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: MUTE }}>{a}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${LINE}`, padding: '16px 20px', background: PAPER, flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: MUTE, fontWeight: 600 }}>Total estimate</span>
              <span style={{ fontSize: 11, color: MUTE }}>incl. install</span>
            </div>
            <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 32, marginTop: 4 }}>{detail.total}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button style={{ flex: 1, padding: '11px', borderRadius: 8, border: 'none', background: INK, color: PAPER, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>{detail.cta}</button>
              <button style={{ padding: '11px 14px', borderRadius: 8, border: `1px solid ${LINE}`, background: 'transparent', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
