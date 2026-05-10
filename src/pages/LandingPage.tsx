import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Design tokens ───────────────────────────────────────────────────────────
const BG     = '#f0eee9'
const PAPER  = '#fafaf7'
const INK    = '#1a1815'
const MUTE   = 'rgba(26,24,21,0.55)'
const SOFT   = 'rgba(26,24,21,0.72)'
const LINE   = 'rgba(26,24,21,0.10)'
const LINE2  = 'rgba(26,24,21,0.18)'
const ACCENT = '#c96442'
const GREEN  = '#1f8a5b'

// ─── Types ───────────────────────────────────────────────────────────────────
type Category = 'kitchen' | 'wardrobe' | 'office' | 'storage'

interface Product {
  id: string
  code: string
  name: string
  dim: string
  price: number
  category: Category
  provenance: string
}

// ─── Products data ────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  // Kitchen
  { id:'k-base-run',  code:'KBX-CB-01', name:'Base run, 3m',        dim:'3000 × 870 × 600 mm',       price:82000,  category:'kitchen',  provenance:'18mm HDHMR carcass. Quartz-ready top. Soft-close Hettich runners. 4 base units pre-assembled.' },
  { id:'k-pantry',    code:'KBX-CB-02', name:'Pantry column',        dim:'600 × 2400 × 600 mm',        price:64800,  category:'kitchen',  provenance:'5 fixed shelves + 1 pull-out wirework basket. Magic corner compatible.' },
  { id:'k-wall-run',  code:'KBX-CB-03', name:'Wall run, 2.4m',       dim:'2400 × 720 × 350 mm',        price:38400,  category:'kitchen',  provenance:'4 wall units pre-assembled. Clip-on hinges, push-to-open optional.' },
  { id:'k-island',    code:'KBX-CB-04', name:'Kitchen island',       dim:'1800 × 900 × 1000 mm',       price:85000,  category:'kitchen',  provenance:'Waterfall quartz top, 4 deep drawers, integrated power sockets.' },
  { id:'k-l-corner',  code:'KBX-CB-05', name:'L-corner kitchen',     dim:'1500 + 1200 × 900 mm',       price:148000, category:'kitchen',  provenance:'Magic-corner pull-out. Includes pantry, hob unit, sink base.' },
  { id:'k-sink-base', code:'KBX-CB-06', name:'Sink base, 1200',      dim:'1200 × 870 × 600 mm',        price:32100,  category:'kitchen',  provenance:'Marine-grade ply back. Single-basin stainless cut-out.' },
  // Wardrobe
  { id:'w-compact',    code:'KBX-WD-01', name:'Compact hanger',      dim:'1800 × 2200 × 600 mm',       price:42000,  category:'wardrobe', provenance:'2-bay, full-length hang. 18mm HDF carcass. FSC-certified.' },
  { id:'w-double',     code:'KBX-WD-02', name:'Double-hang trio',    dim:'2710 × 2200 × 600 mm',       price:68000,  category:'wardrobe', provenance:'3-bay double-hang + 4-drawer pedestal module.' },
  { id:'w-walkin',     code:'KBX-WD-03', name:'Walk-in suite',       dim:'3600 × 2400 × 600 mm',       price:128000, category:'wardrobe', provenance:'Island unit, mirror bay, full-length hang. Configure interior in Planner.' },
  { id:'w-sliding',    code:'KBX-WD-04', name:'Sliding · mirror',    dim:'2400 × 2200 × 650 mm',       price:78000,  category:'wardrobe', provenance:'Hettich Unimat sliding system. Mirror + fluted glass panel.' },
  { id:'w-corner',     code:'KBX-WD-05', name:'Corner loft',         dim:'2400 + 1500 × 2200 mm',      price:98000,  category:'wardrobe', provenance:'L-shape corner wardrobe. 5 bays mixed hang/drawer.' },
  { id:'w-open-shelf', code:'KBX-WD-06', name:'Open shelf bay',      dim:'900 × 2400 × 400 mm',        price:22000,  category:'wardrobe', provenance:'6-shelf open unit. FSC board. Can add fabric basket inserts.' },
  // Office
  { id:'o-linear',       code:'KBX-DS-01', name:'Linear executive',    dim:'1800 × 900 × 750 mm',      price:52000,  category:'office',   provenance:'Cable channels + grommet standard. Walnut/oak laminate.' },
  { id:'o-lshape',       code:'KBX-DS-02', name:'L-shape manager',     dim:'1800 + 1500 × 750 mm',     price:78000,  category:'office',   provenance:'Corner return 900×700. Under-desk pedestal included.' },
  { id:'o-sitstand',     code:'KBX-DS-03', name:'Sit-stand desk',      dim:'1600 × 800 × 650–1250 mm', price:68000,  category:'office',   provenance:'Electric lift 650–1300mm. Memory handset, 3 presets. Bamboo top.' },
  { id:'o-bench4',       code:'KBX-DS-04', name:'Bench · 4 seats',     dim:'3200 × 1400 × 750 mm',     price:138000, category:'office',   provenance:'Back-to-back bench. Fabric screens 400h. Power totem per pair.' },
  { id:'o-storage-wall', code:'KBX-DS-05', name:'Storage wall',        dim:'2200 × 2100 × 600 mm',     price:218000, category:'office',   provenance:'18mm HDHMR. Push-to-open fittings. Powder-coated steel accents.' },
  { id:'o-meeting-6p',   code:'KBX-DS-06', name:'Conference table 6P', dim:'2400 × 1100 × 750 mm',     price:78000,  category:'office',   provenance:'Boat-shape top. Integrated power × 4. Modesty panel.' },
  // Storage
  { id:'s-library',  code:'KBX-ST-01', name:'Library shelf',    dim:'1800 × 1800 × 350 mm', price:38000,  category:'storage', provenance:'Bracketed brass legs. 5-shelf, adjustable pitch 32mm.' },
  { id:'s-credenza', code:'KBX-ST-02', name:'Credenza',          dim:'1800 × 750 × 450 mm',  price:62000,  category:'storage', provenance:'4-door with shelf. Lockable. Usable top surface.' },
  { id:'s-lockers',  code:'KBX-ST-03', name:'Locker bank 6P',   dim:'2400 × 1800 × 450 mm', price:88000,  category:'storage', provenance:'RFID-ready locker bank. 6-person. Powder-coat finish.' },
  { id:'s-cube',     code:'KBX-ST-04', name:'Cube grid 5×5',    dim:'1750 × 1750 × 350 mm', price:45000,  category:'storage', provenance:'350mm cube modules. Adjustable interior dividers.' },
  { id:'s-filing',   code:'KBX-ST-05', name:'Filing tower',      dim:'600 × 1500 × 450 mm',  price:18000,  category:'storage', provenance:'3-drawer lateral file. A4/Foolscap. Anti-tilt mechanism.' },
  { id:'s-tv-unit',  code:'KBX-ST-06', name:'TV media unit',     dim:'1800 × 450 × 400 mm',  price:34000,  category:'storage', provenance:'2 door cabinets + open shelf. Cable management back panel.' },
]

// ─── Finish swatches ──────────────────────────────────────────────────────────
const FINISHES = [
  { name:'Bali Oak',   hex:'#c8bda0' },
  { name:'Espresso',   hex:'#5a3e28' },
  { name:'Bone Matte', hex:'#e8e2d5' },
  { name:'Sand Grey',  hex:'#a8a098' },
  { name:'White Matte',hex:'#f5f2ec' },
  { name:'Walnut',     hex:'#7a4e2d' },
  { name:'Charcoal',   hex:'#3a3530' },
  { name:'Teak',       hex:'#b8894a' },
]

const MODAL_FINISHES = FINISHES.slice(0, 4)

const HARDWARE_OPTIONS = ['Push-to-open', 'Soft-close', 'Handle pull']

// ─── Utility ──────────────────────────────────────────────────────────────────
const fmtPrice = (p: number) =>
  '₹ ' + p.toLocaleString('en-IN')

// ─── SVG Blueprints ───────────────────────────────────────────────────────────
const BlueprintHero = () => (
  <svg width="480" height="400" viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ display:'block', width:'100%', height:'auto' }}>
    {/* grid lines */}
    {[0,1,2,3,4,5,6,7,8].map(i => (
      <line key={`h${i}`} x1="20" y1={20+i*45} x2="460" y2={20+i*45} stroke={LINE} strokeWidth="0.5" />
    ))}
    {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
      <line key={`v${i}`} x1={20+i*44} y1="20" x2={20+i*44} y2="380" stroke={LINE} strokeWidth="0.5" />
    ))}
    {/* wardrobe carcass */}
    <rect x="60" y="60" width="320" height="280" stroke={INK} strokeWidth="1.5" fill="none" rx="1" />
    {/* bays */}
    <line x1="167" y1="60" x2="167" y2="340" stroke={INK} strokeWidth="1" />
    <line x1="274" y1="60" x2="274" y2="340" stroke={INK} strokeWidth="1" />
    {/* hang rails */}
    <line x1="70" y1="120" x2="157" y2="120" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 3" />
    <line x1="177" y1="120" x2="264" y2="120" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 3" />
    {/* shelves */}
    <line x1="284" y1="110" x2="370" y2="110" stroke={INK} strokeWidth="1" />
    <line x1="284" y1="160" x2="370" y2="160" stroke={INK} strokeWidth="1" />
    <line x1="284" y1="210" x2="370" y2="210" stroke={INK} strokeWidth="1" />
    <line x1="284" y1="260" x2="370" y2="260" stroke={INK} strokeWidth="1" />
    {/* drawer block */}
    <rect x="70" y="260" width="87" height="70" stroke={INK} strokeWidth="1" fill="none" />
    <line x1="70" y1="278" x2="157" y2="278" stroke={INK} strokeWidth="0.5" />
    <line x1="70" y1="296" x2="157" y2="296" stroke={INK} strokeWidth="0.5" />
    <line x1="70" y1="314" x2="157" y2="314" stroke={INK} strokeWidth="0.5" />
    {/* drawer handles */}
    <line x1="105" y1="268" x2="117" y2="268" stroke={ACCENT} strokeWidth="1.5" />
    <line x1="105" y1="287" x2="117" y2="287" stroke={ACCENT} strokeWidth="1.5" />
    <line x1="105" y1="305" x2="117" y2="305" stroke={ACCENT} strokeWidth="1.5" />
    <line x1="105" y1="323" x2="117" y2="323" stroke={ACCENT} strokeWidth="1.5" />
    {/* dimension annotations */}
    <line x1="60" y1="350" x2="380" y2="350" stroke={MUTE} strokeWidth="0.75" />
    <line x1="60" y1="346" x2="60" y2="354" stroke={MUTE} strokeWidth="0.75" />
    <line x1="380" y1="346" x2="380" y2="354" stroke={MUTE} strokeWidth="0.75" />
    <text x="220" y="365" textAnchor="middle" fill={MUTE} fontSize="9" fontFamily="JetBrains Mono, monospace">2400 mm</text>
    <line x1="390" y1="60" x2="390" y2="340" stroke={MUTE} strokeWidth="0.75" />
    <line x1="386" y1="60" x2="394" y2="60" stroke={MUTE} strokeWidth="0.75" />
    <line x1="386" y1="340" x2="394" y2="340" stroke={MUTE} strokeWidth="0.75" />
    <text x="420" y="205" textAnchor="middle" fill={MUTE} fontSize="9" fontFamily="JetBrains Mono, monospace" transform="rotate(90,420,205)">2200 mm</text>
    {/* label */}
    <text x="60" y="46" fill={ACCENT} fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="1">KBX-WD-02 · DOUBLE-HANG TRIO · PLAN VIEW</text>
    {/* zone label */}
    <text x="85" y="140" fill={SOFT} fontSize="7" fontFamily="JetBrains Mono, monospace">HANG</text>
    <text x="192" y="140" fill={SOFT} fontSize="7" fontFamily="JetBrains Mono, monospace">HANG</text>
    <text x="290" y="130" fill={SOFT} fontSize="7" fontFamily="JetBrains Mono, monospace">SHELF</text>
    <text x="82" y="290" fill={SOFT} fontSize="7" fontFamily="JetBrains Mono, monospace">DRWR</text>
  </svg>
)

const BlueprintKitchen = ({ size = 120 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="104" height="56" stroke={INK} strokeWidth="1.2" fill="none" />
    <line x1="34" y1="8" x2="34" y2="64" stroke={INK} strokeWidth="0.8" />
    <line x1="60" y1="8" x2="60" y2="64" stroke={INK} strokeWidth="0.8" />
    <line x1="86" y1="8" x2="86" y2="64" stroke={INK} strokeWidth="0.8" />
    <rect x="14" y="14" width="14" height="14" stroke={ACCENT} strokeWidth="0.8" fill="none" rx="1" />
    <line x1="8" y1="36" x2="34" y2="36" stroke={INK} strokeWidth="0.6" />
    <line x1="34" y1="36" x2="60" y2="36" stroke={INK} strokeWidth="0.6" />
    <rect x="90" y="14" width="16" height="12" stroke={ACCENT} strokeWidth="0.8" fill="none" rx="1" />
    <rect x="8" y="74" width="104" height="38" stroke={INK} strokeWidth="1.2" fill="none" />
    <line x1="56" y1="74" x2="56" y2="112" stroke={INK} strokeWidth="0.8" />
    <text x="60" y="118" textAnchor="middle" fill={MUTE} fontSize="6" fontFamily="JetBrains Mono, monospace">PLAN</text>
  </svg>
)

const BlueprintWardrobe = ({ size = 120 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="8" width="100" height="96" stroke={INK} strokeWidth="1.2" fill="none" />
    <line x1="43" y1="8" x2="43" y2="104" stroke={INK} strokeWidth="0.8" />
    <line x1="76" y1="8" x2="76" y2="104" stroke={INK} strokeWidth="0.8" />
    <line x1="10" y1="26" x2="43" y2="26" stroke={ACCENT} strokeWidth="0.8" strokeDasharray="3 2" />
    <line x1="43" y1="26" x2="76" y2="26" stroke={ACCENT} strokeWidth="0.8" strokeDasharray="3 2" />
    <line x1="76" y1="36" x2="110" y2="36" stroke={INK} strokeWidth="0.6" />
    <line x1="76" y1="52" x2="110" y2="52" stroke={INK} strokeWidth="0.6" />
    <line x1="76" y1="68" x2="110" y2="68" stroke={INK} strokeWidth="0.6" />
    <line x1="76" y1="84" x2="110" y2="84" stroke={INK} strokeWidth="0.6" />
    <rect x="10" y="78" width="33" height="26" stroke={INK} strokeWidth="0.8" fill="none" />
    <line x1="10" y1="87" x2="43" y2="87" stroke={INK} strokeWidth="0.4" />
    <line x1="10" y1="96" x2="43" y2="96" stroke={INK} strokeWidth="0.4" />
    <text x="60" y="116" textAnchor="middle" fill={MUTE} fontSize="6" fontFamily="JetBrains Mono, monospace">PLAN</text>
  </svg>
)

const BlueprintOffice = ({ size = 120 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="30" width="80" height="54" stroke={INK} strokeWidth="1.2" fill="none" />
    <rect x="88" y="64" width="24" height="20" stroke={INK} strokeWidth="1.2" fill="none" />
    <line x1="8" y1="52" x2="88" y2="52" stroke={INK} strokeWidth="0.6" />
    <rect x="14" y="58" width="20" height="20" stroke={ACCENT} strokeWidth="0.8" fill="none" rx="1" />
    <line x1="24" y1="58" x2="24" y2="78" stroke={ACCENT} strokeWidth="0.4" />
    <rect x="8" y="8" width="104" height="16" stroke={INK} strokeWidth="0.8" fill={LINE} />
    <text x="60" y="19" textAnchor="middle" fill={INK} fontSize="6" fontFamily="JetBrains Mono, monospace">MONITOR ZONE</text>
    <text x="60" y="116" textAnchor="middle" fill={MUTE} fontSize="6" fontFamily="JetBrains Mono, monospace">PLAN</text>
  </svg>
)

const BlueprintStorage = ({ size = 120 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="104" height="96" stroke={INK} strokeWidth="1.2" fill="none" />
    {[0,1,2,3].map(i => (
      <line key={i} x1={8+i*26} y1="8" x2={8+i*26} y2="104" stroke={INK} strokeWidth="0.8" />
    ))}
    {[0,1,2,3].map(i => (
      <line key={i} x1="8" y1={8+i*24} x2="112" y2={8+i*24} stroke={INK} strokeWidth="0.8" />
    ))}
    <text x="60" y="116" textAnchor="middle" fill={MUTE} fontSize="6" fontFamily="JetBrains Mono, monospace">PLAN</text>
  </svg>
)

const getBlueprintForCategory = (cat: Category, size = 120) => {
  switch (cat) {
    case 'kitchen':  return <BlueprintKitchen size={size} />
    case 'wardrobe': return <BlueprintWardrobe size={size} />
    case 'office':   return <BlueprintOffice size={size} />
    case 'storage':  return <BlueprintStorage size={size} />
  }
}

// ─── KreoboxMark ─────────────────────────────────────────────────────────────
const KreoboxMark = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="26" height="26" stroke={INK} strokeWidth="1.5" rx="2" />
    <text x="14" y="20" textAnchor="middle" fill={INK} fontSize="16" fontFamily="Fraunces, serif" fontWeight="700">K</text>
  </svg>
)

// ─── Styles helper ────────────────────────────────────────────────────────────
const pill: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '9px 18px',
  background: INK,
  color: '#fff',
  border: 'none',
  borderRadius: 2,
  fontSize: 13,
  fontFamily: '"Inter Tight", sans-serif',
  fontWeight: 600,
  cursor: 'pointer',
  letterSpacing: 0.2,
  textDecoration: 'none',
}

const outlinedBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '9px 18px',
  background: 'transparent',
  color: INK,
  border: `1.5px solid ${INK}`,
  borderRadius: 2,
  fontSize: 13,
  fontFamily: '"Inter Tight", sans-serif',
  fontWeight: 600,
  cursor: 'pointer',
  letterSpacing: 0.2,
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV_LINKS: { label: string; id: string }[] = [
  { label: 'Catalogue', id: 'catalogue' },
  { label: 'Kitchen',   id: 'kitchen'   },
  { label: 'Wardrobe',  id: 'wardrobe'  },
  { label: 'Office',    id: 'office'    },
  { label: 'Storage',   id: 'storage'   },
]

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

interface NavProps { onPlanner: () => void }
const Nav = ({ onPlanner }: NavProps) => {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? PAPER : 'transparent',
      borderBottom: scrolled ? `1px solid ${LINE}` : '1px solid transparent',
      transition: 'background 0.25s, border-color 0.25s',
      display: 'flex', alignItems: 'center',
      padding: '0 32px', height: 56,
      gap: 0,
    }}>
      {/* Logo */}
      <button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
        style={{ display:'flex', alignItems:'center', gap:10, background:'none', border:'none', cursor:'pointer', padding:0, marginRight:40 }}>
        <KreoboxMark size={26} />
        <span style={{ fontFamily:'"Fraunces", serif', fontSize:22, color:INK, fontWeight:400, lineHeight:1 }}>Kreobox</span>
      </button>

      {/* Center links */}
      <div style={{ display:'flex', gap:28, flex:1 }}>
        {NAV_LINKS.map(l => (
          <button key={l.id} onClick={() => scrollTo(l.id)}
            style={{ background:'none', border:'none', cursor:'pointer', padding:0,
              fontFamily:'"Inter Tight", sans-serif', fontSize:13, color:SOFT, fontWeight:500,
              letterSpacing:0.1 }}>
            {l.label}
          </button>
        ))}
      </div>

      {/* Right */}
      <div style={{ display:'flex', alignItems:'center', gap:20 }}>
        <button onClick={() => navigate('/app/studio')}
          style={{ background:'none', border:'none', cursor:'pointer', padding:0,
            fontFamily:'"Inter Tight", sans-serif', fontSize:13, color:MUTE, fontWeight:500 }}>
          Contractors →
        </button>
        <button onClick={onPlanner} style={pill}>Open Planner</button>
        <button onClick={() => navigate('/ops/factory')}
          style={{ background:'none', border:'none', cursor:'pointer', padding:0,
            fontFamily:'"Inter Tight", sans-serif', fontSize:11, color:MUTE, fontWeight:400,
            opacity: 0.5 }}>
          Ops
        </button>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
interface HeroProps { onPlanner: () => void }
const Hero = ({ onPlanner }: HeroProps) => (
  <section style={{
    minHeight: '100vh', display:'flex', flexDirection:'column', justifyContent:'center',
    background: BG, padding:'96px 32px 0', position:'relative',
  }}>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center', maxWidth:1200, margin:'0 auto', width:'100%' }}>
      {/* Left */}
      <div>
        <p style={{
          fontFamily:'JetBrains Mono, monospace', fontSize:11, color:MUTE,
          letterSpacing:2, textTransform:'uppercase', marginBottom:28, marginTop:0,
        }}>
          KREOBOX · Catalogue No. 02 · Spring '26
        </p>
        <h1 style={{ margin:0, lineHeight:1.05 }}>
          <span style={{ display:'block', fontFamily:'"Fraunces", serif', fontSize:80, fontWeight:400, color:INK }}>
            Panel furniture,
          </span>
          <span style={{ display:'block', fontFamily:'"Fraunces", serif', fontSize:80, fontWeight:700, fontStyle:'italic', color:INK }}>
            planned to the mm.
          </span>
        </h1>
        <p style={{
          fontSize:16, color:SOFT, marginTop:24, marginBottom:36, lineHeight:1.65,
          fontFamily:'"Inter Tight", sans-serif', maxWidth:480,
        }}>
          Twenty SKUs across wardrobes, modular kitchens, office desks and storage — drawn the same way they're cut. Browse, configure, and get a quote in one sitting.
        </p>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          <button onClick={() => scrollTo('catalogue')} style={outlinedBtn}>
            Browse catalogue →
          </button>
          <button onClick={onPlanner} style={pill}>
            Open the Planner
          </button>
        </div>
      </div>

      {/* Right — blueprint */}
      <div style={{
        background: PAPER, border:`1px solid ${LINE2}`, borderRadius:2,
        padding:24, boxSizing:'border-box',
      }}>
        <BlueprintHero />
      </div>
    </div>

    {/* Stat chips */}
    <div style={{
      display:'flex', gap:0, maxWidth:1200, margin:'48px auto 0', width:'100%',
      borderTop:`1px solid ${LINE}`,
    }}>
      {[
        { stat:'20 SKUs',     desc:'across 4 families' },
        { stat:'4 families',  desc:'kitchen · wardrobe · office · storage' },
        { stat:'18mm panel',  desc:'HDHMR & HDF carcass' },
        { stat:'India-made',  desc:'dispatched in 8 days' },
      ].map((c, i) => (
        <div key={i} style={{
          flex:1, padding:'24px 0 32px',
          borderRight: i < 3 ? `1px solid ${LINE}` : 'none',
          paddingLeft: i === 0 ? 0 : 24,
        }}>
          <div style={{ fontFamily:'"Fraunces", serif', fontSize:28, fontWeight:600, color:INK, marginBottom:4 }}>{c.stat}</div>
          <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:MUTE, letterSpacing:0.5 }}>{c.desc}</div>
        </div>
      ))}
    </div>
  </section>
)

// ─── Product Card ─────────────────────────────────────────────────────────────
interface CardProps { item: Product; onPlan: (item: Product) => void }
const ProductCard = ({ item, onPlan }: CardProps) => (
  <div style={{
    background: PAPER, border:`1px solid ${LINE2}`, borderRadius:2,
    padding:24, display:'flex', flexDirection:'column', gap:12,
    transition:'box-shadow 0.18s',
  }}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 4px 24px ${LINE}`)}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
  >
    {/* Blueprint illustration */}
    <div style={{
      background: BG, borderRadius:2, display:'flex', alignItems:'center',
      justifyContent:'center', padding:16, marginBottom:4,
      border:`1px solid ${LINE}`,
    }}>
      {getBlueprintForCategory(item.category, 100)}
    </div>

    <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:ACCENT, letterSpacing:1 }}>
      {item.code}
    </div>
    <div style={{ fontFamily:'"Fraunces", serif', fontSize:18, color:INK, fontWeight:500, lineHeight:1.2, marginTop:-4 }}>
      {item.name}
    </div>
    <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:MUTE, letterSpacing:0.3 }}>
      {item.dim}
    </div>
    <div style={{ marginTop:'auto', display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:`1px solid ${LINE}` }}>
      <span style={{ fontFamily:'"Inter Tight", sans-serif', fontSize:14, fontWeight:600, color:INK }}>
        from {fmtPrice(item.price)}
      </span>
      <button onClick={() => onPlan(item)}
        style={{
          background:'none', border:`1px solid ${ACCENT}`, borderRadius:2,
          color:ACCENT, fontFamily:'"Inter Tight", sans-serif', fontSize:12,
          fontWeight:600, cursor:'pointer', padding:'6px 12px', letterSpacing:0.2,
        }}>
        Plan this →
      </button>
    </div>
  </div>
)

// ─── Catalogue Section ────────────────────────────────────────────────────────
const TABS: { key: Category; label: string }[] = [
  { key:'kitchen',  label:'Kitchen'  },
  { key:'wardrobe', label:'Wardrobe' },
  { key:'office',   label:'Office'   },
  { key:'storage',  label:'Storage'  },
]

interface CatalogueProps {
  tab: Category
  setTab: (t: Category) => void
  onPlan: (item: Product) => void
}
const Catalogue = ({ tab, setTab, onPlan }: CatalogueProps) => {
  const items = PRODUCTS.filter(p => p.category === tab)
  return (
    <section id="catalogue" style={{ background: BG, padding:'80px 32px', borderTop:`1px solid ${LINE}` }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        {/* Section header */}
        <div style={{ marginBottom:40 }}>
          <p style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:MUTE, letterSpacing:2, textTransform:'uppercase', margin:'0 0 12px' }}>
            — Catalogue No. 02
          </p>
          <h2 style={{ fontFamily:'"Fraunces", serif', fontSize:44, fontWeight:400, color:INK, margin:0 }}>
            All products
          </h2>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:0, borderBottom:`1px solid ${LINE2}`, marginBottom:40 }}>
          {TABS.map(t => {
            const active = t.key === tab
            return (
              <button key={t.key}
                id={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  background:'none', border:'none', borderBottom: active ? `2px solid ${INK}` : '2px solid transparent',
                  padding:'10px 24px', cursor:'pointer', marginBottom:-1,
                  fontFamily:'"Inter Tight", sans-serif', fontSize:13, fontWeight: active ? 700 : 500,
                  color: active ? INK : MUTE, letterSpacing:0.2, transition:'color 0.15s',
                }}>
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20 }}>
          {items.map(item => <ProductCard key={item.id} item={item} onPlan={onPlan} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Product Detail Modal ─────────────────────────────────────────────────────
interface ModalProps {
  item: Product
  selectedFinish: string
  setSelectedFinish: (f: string) => void
  selectedHardware: string
  setSelectedHardware: (h: string) => void
  quoteStep: 'idle' | 'form' | 'done'
  setQuoteStep: (s: 'idle'|'form'|'done') => void
  quoteForm: { name:string; phone:string; city:string; area:string }
  setQuoteForm: (f: { name:string; phone:string; city:string; area:string }) => void
  onClose: () => void
  onPlanner: (item: Product) => void
}

const ProductModal = ({
  item, selectedFinish, setSelectedFinish,
  selectedHardware, setSelectedHardware,
  quoteStep, setQuoteStep, quoteForm, setQuoteForm,
  onClose, onPlanner,
}: ModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setQuoteStep('done')
  }

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:200,
      background:'rgba(26,24,21,0.55)', display:'flex', alignItems:'center', justifyContent:'center',
      padding:24,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: PAPER, borderRadius:2, border:`1px solid ${LINE2}`,
        width:'100%', maxWidth:860, maxHeight:'90vh', overflowY:'auto',
        position:'relative', display:'grid', gridTemplateColumns:'1fr 1fr',
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position:'absolute', top:16, right:16, background:'none', border:`1px solid ${LINE2}`,
          borderRadius:2, width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center',
          justifyContent:'center', color:SOFT, fontSize:16, zIndex:10,
        }}>×</button>

        {/* Left — blueprint */}
        <div style={{
          background: BG, display:'flex', alignItems:'center', justifyContent:'center',
          padding:40, borderRight:`1px solid ${LINE}`,
        }}>
          <div style={{ textAlign:'center' }}>
            {getBlueprintForCategory(item.category, 280)}
            <div style={{ marginTop:16, fontFamily:'JetBrains Mono, monospace', fontSize:9, color:MUTE, letterSpacing:1.5, textTransform:'uppercase' }}>
              Blueprint · Top view
            </div>
          </div>
        </div>

        {/* Right — detail */}
        <div style={{ padding:36, display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:ACCENT, letterSpacing:2, textTransform:'uppercase' }}>
            {item.category}
          </div>
          <h2 style={{ fontFamily:'"Fraunces", serif', fontSize:28, fontWeight:500, color:INK, margin:0, lineHeight:1.1 }}>
            {item.name}
          </h2>
          <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:11, color:MUTE, letterSpacing:0.5 }}>
            {item.code}
          </div>

          {/* Dimensions */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background:BG, borderRadius:2, border:`1px solid ${LINE}` }}>
            <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:MUTE, letterSpacing:0.5, marginRight:4 }}>DIM</span>
            <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:12, color:INK, fontWeight:700 }}>{item.dim}</span>
          </div>

          {/* Provenance */}
          <p style={{ fontFamily:'"Inter Tight", sans-serif', fontSize:13, color:SOFT, lineHeight:1.6, margin:0 }}>
            {item.provenance}
          </p>

          {/* Finishes */}
          <div>
            <div style={{ fontFamily:'"Inter Tight", sans-serif', fontSize:11, color:MUTE, fontWeight:600, letterSpacing:0.5, textTransform:'uppercase', marginBottom:8 }}>
              Finish
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {MODAL_FINISHES.map(f => (
                <button key={f.name} title={f.name} onClick={() => setSelectedFinish(f.name)}
                  style={{
                    width:32, height:32, borderRadius:2, background:f.hex, cursor:'pointer',
                    border: selectedFinish === f.name ? `2px solid ${INK}` : `1.5px solid ${LINE2}`,
                    transition:'border 0.15s',
                  }} />
              ))}
            </div>
            <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:MUTE, marginTop:6 }}>
              {selectedFinish}
            </div>
          </div>

          {/* Hardware toggle */}
          <div>
            <div style={{ fontFamily:'"Inter Tight", sans-serif', fontSize:11, color:MUTE, fontWeight:600, letterSpacing:0.5, textTransform:'uppercase', marginBottom:8 }}>
              Hardware
            </div>
            <div style={{ display:'flex', gap:0 }}>
              {HARDWARE_OPTIONS.map((h, i) => (
                <button key={h} onClick={() => setSelectedHardware(h)}
                  style={{
                    padding:'6px 12px', border:`1px solid ${LINE2}`,
                    borderLeft: i > 0 ? 'none' : `1px solid ${LINE2}`,
                    background: selectedHardware === h ? INK : 'none',
                    color: selectedHardware === h ? '#fff' : SOFT,
                    fontFamily:'"Inter Tight", sans-serif', fontSize:11, fontWeight:500,
                    cursor:'pointer', borderRadius:0, transition:'background 0.15s, color 0.15s',
                  }}>
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div style={{ fontFamily:'"Fraunces", serif', fontSize:22, color:INK, fontWeight:600 }}>
            from {fmtPrice(item.price)}
          </div>

          {/* Actions */}
          {quoteStep === 'idle' && (
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <button onClick={() => onPlanner(item)} style={{ ...pill, flex:1, justifyContent:'center' }}>
                Customize in Planner →
              </button>
              <button onClick={() => setQuoteStep('form')} style={{ ...outlinedBtn, flex:1, justifyContent:'center' }}>
                Request quote
              </button>
            </div>
          )}

          {quoteStep === 'form' && (
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {(['name','phone','city','area'] as const).map(field => (
                <input key={field} type="text"
                  placeholder={{ name:'Your name', phone:'Phone', city:'City', area:'Area / sq ft' }[field]}
                  value={quoteForm[field]}
                  onChange={e => setQuoteForm({ ...quoteForm, [field]: e.target.value })}
                  required={field !== 'area'}
                  style={{
                    padding:'9px 12px', border:`1px solid ${LINE2}`, borderRadius:2,
                    fontFamily:'"Inter Tight", sans-serif', fontSize:13, color:INK,
                    background:BG, outline:'none',
                  }} />
              ))}
              <div style={{ display:'flex', gap:10 }}>
                <button type="submit" style={{ ...pill, flex:1, justifyContent:'center' }}>Submit →</button>
                <button type="button" onClick={() => setQuoteStep('idle')} style={{ ...outlinedBtn, flex:1, justifyContent:'center' }}>Cancel</button>
              </div>
            </form>
          )}

          {quoteStep === 'done' && (
            <div style={{
              padding:16, background:`${GREEN}18`, border:`1px solid ${GREEN}`, borderRadius:2,
              fontFamily:'"Inter Tight", sans-serif', fontSize:13, color:GREEN, lineHeight:1.6,
            }}>
              Quote request received. Our team will call you within one business day.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Materials & Finishes ─────────────────────────────────────────────────────
const Materials = () => (
  <section style={{ background: PAPER, padding:'80px 32px', borderTop:`1px solid ${LINE}` }}>
    <div style={{ maxWidth:1200, margin:'0 auto' }}>
      <p style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:MUTE, letterSpacing:2, textTransform:'uppercase', margin:'0 0 12px' }}>
        — Materials & Finishes
      </p>
      <h2 style={{ fontFamily:'"Fraunces", serif', fontSize:44, fontWeight:400, color:INK, margin:'0 0 40px' }}>
        Eight standard finishes
      </h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:20 }}>
        {FINISHES.map(f => (
          <div key={f.name} style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{
              width:'100%', aspectRatio:'1/1', maxHeight:100,
              background: f.hex, borderRadius:2, border:`1px solid ${LINE2}`,
            }} />
            <div>
              <div style={{ fontFamily:'"Inter Tight", sans-serif', fontSize:13, fontWeight:600, color:INK }}>{f.name}</div>
              <span style={{
                display:'inline-block', marginTop:4,
                fontFamily:'JetBrains Mono, monospace', fontSize:9, color:GREEN,
                border:`1px solid ${GREEN}`, borderRadius:2, padding:'1px 6px', letterSpacing:0.5,
              }}>In stock</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ─── How It Works ─────────────────────────────────────────────────────────────
const HowItWorks = () => (
  <section style={{ background: BG, padding:'80px 32px', borderTop:`1px solid ${LINE}` }}>
    <div style={{ maxWidth:1200, margin:'0 auto' }}>
      <p style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:MUTE, letterSpacing:2, textTransform:'uppercase', margin:'0 0 12px' }}>
        — Process
      </p>
      <h2 style={{ fontFamily:'"Fraunces", serif', fontSize:44, fontWeight:400, color:INK, margin:'0 0 40px' }}>
        How it works
      </h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:1, background:LINE2 }}>
        {[
          {
            n:'01', title:'Browse & select',
            body:'Pick your product family and configure in the planner. Every dimension and finish is selectable.',
          },
          {
            n:'02', title:'Get your BOM',
            body:'The planner generates a full cut-list and price breakdown — ready to share with your contractor.',
          },
          {
            n:'03', title:'We manufacture & install',
            body:'Pre-cut panels dispatched in 8 days, installed in 2–3. Clean site, no on-site carpentry dust.',
          },
        ].map((s, i) => (
          <div key={i} style={{ background: PAPER, padding:36, display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:28, color:LINE2, fontWeight:700, lineHeight:1 }}>{s.n}</div>
            <h3 style={{ fontFamily:'"Fraunces", serif', fontSize:22, fontWeight:500, color:INK, margin:0 }}>{s.title}</h3>
            <p style={{ fontFamily:'"Inter Tight", sans-serif', fontSize:14, color:SOFT, lineHeight:1.65, margin:0 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'Do you offer trade pricing for interior designers?',
    a: 'Yes. Studios and contractors with a valid GST number qualify for 12–18% trade discount across all SKUs. Access Studio portal to register.',
  },
  {
    q: 'What is the minimum order for a project?',
    a: 'There is no minimum SKU count. However, delivery and installation is bundled per project — typically 3+ units to be viable in a single visit.',
  },
  {
    q: 'Can panels be cut to non-standard sizes?',
    a: 'All carcass panels are CNC-cut to order. Custom widths in 50mm increments are standard. Non-standard heights attract a ₹1,500 set-up fee per SKU.',
  },
]

const Accordion = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom:`1px solid rgba(250,250,247,0.15)` }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
        background:'none', border:'none', padding:'18px 0', cursor:'pointer',
        color:'#fff', fontFamily:'"Inter Tight", sans-serif', fontSize:14, fontWeight:500,
        textAlign:'left', gap:16,
      }}>
        {q}
        <span style={{ fontSize:18, opacity:0.6, flexShrink:0 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <p style={{
          fontFamily:'"Inter Tight", sans-serif', fontSize:13,
          color:'rgba(250,250,247,0.65)', lineHeight:1.65,
          margin:'0 0 18px', paddingRight:32,
        }}>{a}</p>
      )}
    </div>
  )
}

// ─── Contractors Strip ────────────────────────────────────────────────────────
const ContractorStrip = () => {
  const navigate = useNavigate()
  return (
    <section style={{ background: INK, padding:'80px 32px', borderTop:`1px solid ${LINE2}` }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'start' }}>
        {/* Left */}
        <div>
          <p style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'rgba(250,250,247,0.45)', letterSpacing:2, textTransform:'uppercase', margin:'0 0 12px' }}>
            — For professionals
          </p>
          <h2 style={{ fontFamily:'"Fraunces", serif', fontSize:44, fontWeight:400, color:'#fafaf7', margin:'0 0 16px' }}>
            For interior studios and contractors
          </h2>
          <p style={{ fontFamily:'"Inter Tight", sans-serif', fontSize:15, color:'rgba(250,250,247,0.65)', lineHeight:1.65, margin:'0 0 28px' }}>
            Get trade pricing, shared project dashboards, and a dedicated factory liaison. All through the Studio portal.
          </p>
          <button onClick={() => navigate('/app/studio')}
            style={{
              ...pill,
              background: '#fafaf7', color: INK,
              fontWeight: 700,
            }}>
            Access Studio →
          </button>
        </div>

        {/* Right — FAQ */}
        <div>
          <p style={{ fontFamily:'"Inter Tight", sans-serif', fontSize:12, color:'rgba(250,250,247,0.45)', fontWeight:600, letterSpacing:1, textTransform:'uppercase', margin:'0 0 8px' }}>
            FAQ
          </p>
          {FAQ_ITEMS.map((item, i) => <Accordion key={i} q={item.q} a={item.a} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => {
  const navigate = useNavigate()
  return (
    <footer style={{
      background: PAPER, borderTop:`1px solid ${LINE}`,
      padding:'40px 32px', display:'flex', alignItems:'center', gap:32,
    }}>
      <div style={{ display:'flex', flexDirection:'column', gap:6, flex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <KreoboxMark size={22} />
          <span style={{ fontFamily:'"Fraunces", serif', fontSize:18, color:INK, fontWeight:400 }}>Kreobox</span>
        </div>
        <p style={{ fontFamily:'"Inter Tight", sans-serif', fontSize:12, color:MUTE, margin:0, lineHeight:1.5 }}>
          Panel furniture, planned to the mm.
        </p>
      </div>

      <nav style={{ display:'flex', gap:24 }}>
        {[
          { label:'Catalogue', action: () => scrollTo('catalogue') },
          { label:'Planner',   action: () => navigate('/app/planner') },
          { label:'Materials', action: () => scrollTo('materials') },
          { label:'About',     action: () => {} },
        ].map(l => (
          <button key={l.label} onClick={l.action}
            style={{ background:'none', border:'none', cursor:'pointer', padding:0,
              fontFamily:'"Inter Tight", sans-serif', fontSize:13, color:SOFT, fontWeight:500 }}>
            {l.label}
          </button>
        ))}
      </nav>

      <button onClick={() => navigate('/ops/factory')}
        style={{ background:'none', border:'none', cursor:'pointer', padding:0,
          fontFamily:'JetBrains Mono, monospace', fontSize:9, color:MUTE, opacity:0.45,
          letterSpacing:0.5, marginLeft:'auto' }}>
        Operations portal
      </button>
    </footer>
  )
}

// ─── Main LandingPage ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()

  // State
  const [catalogTab,       setCatalogTab]       = useState<Category>('kitchen')
  const [selectedItem,     setSelectedItem]     = useState<Product | null>(null)
  const [selectedFinish,   setSelectedFinish]   = useState('Bali Oak')
  const [selectedHardware, setSelectedHardware] = useState('Push-to-open')
  const [quoteStep,        setQuoteStep]        = useState<'idle'|'form'|'done'>('idle')
  const [quoteForm,        setQuoteForm]        = useState({ name:'', phone:'', city:'Bengaluru', area:'' })

  const openPlanner = () => navigate('/app/planner')

  const handlePlanItem = (item: Product) => {
    setSelectedItem(item)
    setQuoteStep('idle')
    setQuoteForm({ name:'', phone:'', city:'Bengaluru', area:'' })
  }

  const handlePlannerFromModal = (item: Product) => {
    navigate('/app/planner', { state: { product: item.category, itemId: item.id } })
    setSelectedItem(null)
  }

  const closeModal = () => setSelectedItem(null)

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selectedItem ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedItem])

  return (
    <div style={{ background: BG, minHeight:'100vh', fontFamily:'"Inter Tight", sans-serif' }}>
      {/* Global font imports via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${BG}; }
        ::-webkit-scrollbar-thumb { background: ${LINE2}; border-radius: 2px; }
        input::placeholder { color: ${MUTE}; }
        input:focus { outline: none; border-color: ${INK} !important; }
      `}</style>

      <Nav onPlanner={openPlanner} />
      <Hero onPlanner={openPlanner} />

      {/* Catalogue — all four family anchors live here */}
      <div id="kitchen" /><div id="wardrobe" /><div id="office" /><div id="storage" />
      <Catalogue tab={catalogTab} setTab={t => { setCatalogTab(t); scrollTo('catalogue') }} onPlan={handlePlanItem} />

      <div id="materials" />
      <Materials />
      <HowItWorks />
      <ContractorStrip />
      <Footer />

      {/* Modal */}
      {selectedItem && (
        <ProductModal
          item={selectedItem}
          selectedFinish={selectedFinish}
          setSelectedFinish={setSelectedFinish}
          selectedHardware={selectedHardware}
          setSelectedHardware={setSelectedHardware}
          quoteStep={quoteStep}
          setQuoteStep={setQuoteStep}
          quoteForm={quoteForm}
          setQuoteForm={setQuoteForm}
          onClose={closeModal}
          onPlanner={handlePlannerFromModal}
        />
      )}
    </div>
  )
}
