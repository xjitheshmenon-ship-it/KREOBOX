// Application mocks — favicon, business card, app UI
// Show the brand in real-world contexts to validate the system.

function AppFavicon({ Mark, accent, bg = '#0a0a0a' }) {
  return (
    <div style={{
      width: 128, height: 128, borderRadius: 28, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 12px 40px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
    }}>
      <Mark size={72} accent={accent} />
    </div>
  );
}

function BusinessCard({ Mark, accent, name = 'Mira Halsey', role = 'Founder & CEO' }) {
  return (
    <div style={{
      width: 480, height: 280, borderRadius: 14, background: '#fafaf7',
      padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      boxShadow: '0 30px 60px -20px rgba(0,0,0,0.25), 0 1px 0 rgba(0,0,0,0.04)',
      fontFamily: '"Inter Tight", -apple-system, sans-serif',
      color: '#1a1815',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Mark size={36} accent={accent} />
        <span style={{
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 22, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>KREOBOX</span>
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.015em', marginBottom: 4 }}>{name}</div>
        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)', letterSpacing: '0.01em', marginBottom: 18 }}>{role}</div>
        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', display: 'flex', gap: 24, letterSpacing: '0.02em' }}>
          <span>mira@kreobox.com</span>
          <span>kreobox.com</span>
        </div>
      </div>
    </div>
  );
}

function AppMock({ Mark, accent }) {
  return (
    <div style={{
      width: 520, height: 340, borderRadius: 12, background: '#fafaf7',
      boxShadow: '0 30px 60px -20px rgba(0,0,0,0.25), 0 1px 0 rgba(0,0,0,0.04)',
      overflow: 'hidden', display: 'flex',
      fontFamily: '"Inter Tight", -apple-system, sans-serif',
      color: '#1a1815',
    }}>
      {/* sidebar */}
      <div style={{ width: 180, background: '#0e0d0b', color: '#e8e6e1', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
          <Mark size={20} accent={accent} />
          <span style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 13, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>KREOBOX</span>
        </div>
        {['Dashboard', 'Library', 'Spaces', 'Models', 'Settings'].map((it, i) => (
          <div key={it} style={{
            fontSize: 12, padding: '8px 10px', borderRadius: 6,
            background: i === 1 ? 'rgba(255,255,255,0.08)' : 'transparent',
            color: i === 1 ? '#fff' : 'rgba(255,255,255,0.55)',
          }}>{it}</div>
        ))}
      </div>
      {/* main */}
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Library</div>
        <div style={{ fontFamily: '"GT Sectra", Georgia, serif', fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 18 }}>
          Recent containers
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{
              height: 84, borderRadius: 8,
              background: i === 0 ? accent : '#f0eee9',
              border: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.06)',
              padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              color: i === 0 ? '#fff' : '#1a1815',
            }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, background: i === 0 ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)' }} />
              <div style={{ fontSize: 11, fontWeight: 500 }}>Container {String.fromCharCode(65 + i)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MerchTote({ Mark, accent }) {
  return (
    <div style={{
      width: 320, height: 360, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* tote shape */}
      <svg width="320" height="360" viewBox="0 0 320 360" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="totefab" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f0eee9" />
            <stop offset="1" stopColor="#dcd8d0" />
          </linearGradient>
        </defs>
        <path d="M70 90 Q70 50 110 50 Q110 80 110 90" stroke="#bcb6aa" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M210 90 Q210 50 250 50 Q250 80 250 90" stroke="#bcb6aa" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M40 90 H280 L268 340 H52 Z" fill="url(#totefab)" stroke="#c4bfb3" strokeWidth="1" />
      </svg>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 20 }}>
        <Mark size={64} accent={accent} />
        <span style={{
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 24, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1815',
        }}>KREOBOX</span>
      </div>
    </div>
  );
}

Object.assign(window, { AppFavicon, BusinessCard, AppMock, MerchTote });
