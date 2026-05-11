// LinkedIn page mock for Kreobox
// 1128px wide standard banner + profile card + about/posts area

function LinkedInPage({ accent = '#c96442' }) {
  const ink = '#1a1815';
  return (
    <div style={{
      width: 1128, background: '#f4f2ee', borderRadius: 8, overflow: 'hidden',
      fontFamily: '-apple-system, "Segoe UI", system-ui, sans-serif',
      color: ink,
      boxShadow: '0 30px 80px -30px rgba(0,0,0,0.25)',
    }}>
      {/* Top nav (LinkedIn chrome) */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e0ddd6',
        padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ width: 34, height: 34, borderRadius: 4, background: '#0a66c2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>in</div>
        <div style={{ flex: 1, height: 34, background: '#edf3f8', borderRadius: 4, padding: '0 12px', display: 'flex', alignItems: 'center', color: '#9ca3a4', fontSize: 13 }}>Search</div>
        <div style={{ display: 'flex', gap: 18, color: '#666', fontSize: 12 }}>
          <span>Home</span><span>My Network</span><span>Jobs</span><span>Messaging</span><span>Notifications</span><span>Me ▾</span>
        </div>
      </div>

      {/* Main column wrapper */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, padding: 24, alignItems: 'start' }}>

        {/* LEFT: profile card + about + posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* PROFILE CARD */}
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e0ddd6', overflow: 'hidden' }}>
            {/* Banner — branded */}
            <div style={{
              height: 200, background: '#0e0d0b', position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 56px',
            }}>
              {/* dotted grid texture */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '18px 18px', opacity: 0.8,
              }} />
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span style={{
                  fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)', fontWeight: 500,
                }}>Built for the work behind the work</span>
                <span style={{
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontSize: 44, fontWeight: 400, letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: '#fafaf7',
                }}>KREOBOX</span>
              </div>
              <div style={{ position: 'relative' }}>
                <MarkOpenFrame size={140} accent={accent} />
              </div>
            </div>

            {/* Logo bubble + content */}
            <div style={{ padding: '0 24px 24px', position: 'relative' }}>
              <div style={{
                width: 132, height: 132, borderRadius: '50%', background: '#fafaf7',
                border: '4px solid #fff', marginTop: -56, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              }}>
                <MarkOpenFrame size={70} accent={accent} />
              </div>

              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>
                    Kreobox
                  </div>
                  <div style={{ fontSize: 14, color: '#1a1815', marginBottom: 8 }}>
                    Somewhere between a measuring tape and a masterpiece, something always goes wrong. We're fixing that.
                  </div>
                  <div style={{ fontSize: 13, color: '#666', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span>Interior Design</span>
                    <span>·</span>
                    <span>Bangalore, India</span>
                    <span>·</span>
                    <span style={{ color: '#0a66c2', fontWeight: 600 }}>kreobox.com</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>
                    <span style={{ fontWeight: 600, color: ink }}>4,218</span> followers · <span style={{ fontWeight: 600, color: ink }}>52</span> employees
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <button style={{
                      background: '#0a66c2', color: '#fff', border: 'none', borderRadius: 999,
                      padding: '8px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                    }}>+ Follow</button>
                    <button style={{
                      background: '#fff', color: '#0a66c2', border: '1px solid #0a66c2', borderRadius: 999,
                      padding: '8px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                    }}>Visit website ↗</button>
                    <button style={{
                      background: '#fff', color: '#666', border: '1px solid #e0ddd6', borderRadius: 999,
                      padding: '8px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                    }}>More</button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ marginTop: 18, display: 'flex', gap: 24, borderBottom: '1px solid #e0ddd6', paddingTop: 6 }}>
                {[
                  { label: 'Home', active: true },
                  { label: 'About', active: false },
                  { label: 'Posts', active: false },
                  { label: 'Jobs', active: false },
                  { label: 'People', active: false },
                ].map(t => (
                  <div key={t.label} style={{
                    padding: '12px 2px', fontSize: 14, fontWeight: 600,
                    color: t.active ? '#0a6e2c' : '#666',
                    borderBottom: t.active ? '2px solid #0a6e2c' : '2px solid transparent',
                    marginBottom: -1,
                  }}>{t.label}</div>
                ))}
              </div>
            </div>
          </div>

          {/* ABOUT CARD */}
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e0ddd6', padding: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Overview</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: '#1a1815' }}>
              Somewhere between a measuring tape and a masterpiece, something always goes wrong. We're fixing that. The way interiors get built in India is about to change. KREOBOX — coming soon.
            </div>
            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, fontSize: 13 }}>
              {[
                ['Website', 'kreobox.com'],
                ['Industry', 'Interior Design'],
                ['Company size', '11–50 employees'],
                ['Headquarters', 'Bangalore, India'],
                ['Founded', '2024'],
                ['Specialties', 'Interior design, project delivery, build systems'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontWeight: 700, color: ink, marginBottom: 2 }}>{k}</div>
                  <div style={{ color: '#555' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* POST */}
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e0ddd6', padding: 20 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fafaf7', border: '1px solid #e0ddd6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MarkOpenFrame size={28} accent={accent} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Kreobox</div>
                <div style={{ fontSize: 12, color: '#666' }}>4,218 followers</div>
                <div style={{ fontSize: 12, color: '#666' }}>2d · 🌐</div>
              </div>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 14 }}>
              Somewhere between a measuring tape and a masterpiece, something always goes wrong.
              <br /><br />
              We're fixing that. The way interiors get built in India is about to change.
              <br /><br />
              KREOBOX — coming soon.
            </div>
            {/* Featured image — branded card */}
            <div style={{
              borderRadius: 8, overflow: 'hidden', height: 280,
              background: '#0e0d0b', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 18, position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '18px 18px',
              }} />
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <MarkOpenFrame size={76} accent={accent} />
                <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 38, fontWeight: 400, color: '#fafaf7', letterSpacing: '-0.01em', textAlign: 'center', maxWidth: 540, lineHeight: 1.1 }}>
                  Coming soon.
                </div>
                <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
                  kreobox.com
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 18, paddingTop: 14, marginTop: 12, borderTop: '1px solid #e0ddd6', color: '#666', fontSize: 14, fontWeight: 600 }}>
              <span>👍 Like</span>
              <span>💬 Comment</span>
              <span>🔁 Repost</span>
              <span>↗ Send</span>
            </div>
          </div>

        </div>

        {/* RIGHT: side cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e0ddd6', padding: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>People also viewed</div>
            {['Linear', 'Arc', 'Cron', 'Things'].map(c => (
              <div key={c} style={{ display: 'flex', gap: 10, padding: '8px 0', alignItems: 'center', borderTop: '1px solid #f0eee9' }}>
                <div style={{ width: 36, height: 36, borderRadius: 4, background: '#fafaf7', border: '1px solid #e0ddd6' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c}</div>
                  <div style={{ fontSize: 11, color: '#666' }}>Software · Follow</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e0ddd6', padding: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Recent jobs</div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>3 open roles</div>
            {[
              ['Senior Project Architect', 'Bangalore · Hybrid'],
              ['Founding Site Engineer', 'Remote'],
              ['Brand & Content Lead', 'Bangalore'],
            ].map(([t, l]) => (
              <div key={t} style={{ padding: '10px 0', borderTop: '1px solid #f0eee9' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0a66c2' }}>{t}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Kreobox · {l}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

window.LinkedInPage = LinkedInPage;
