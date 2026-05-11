// Kreobox wordmark + lockups
// Five typeface directions — each tuned for "premium / luxe" SaaS feel.

const WORDMARK_FONTS = {
  fraunces: {
    name: 'Fraunces',
    note: 'Editorial serif · soft, opsz-tuned',
    family: '"Fraunces", Georgia, serif',
    weight: 400,
    tracking: '-0.025em',
    feat: '"ss01" on, "ss02" on',
  },
  newsreader: {
    name: 'Newsreader',
    note: 'Literary serif · bookish, warm',
    family: '"Newsreader", Georgia, serif',
    weight: 500,
    tracking: '-0.02em',
    feat: 'normal',
  },
  instrument: {
    name: 'Instrument Serif',
    note: 'High-contrast display · luxury fashion',
    family: '"Instrument Serif", "Didot", serif',
    weight: 400,
    tracking: '-0.015em',
    feat: 'normal',
  },
  schibsted: {
    name: 'Schibsted Grotesk',
    note: 'Confident grotesk · editorial sans',
    family: '"Schibsted Grotesk", "Söhne", -apple-system, sans-serif',
    weight: 600,
    tracking: '-0.04em',
    feat: 'normal',
  },
  geist: {
    name: 'Geist',
    note: 'Modern neo-grotesk · technical, clean',
    family: '"Geist", "Inter Tight", -apple-system, sans-serif',
    weight: 600,
    tracking: '-0.045em',
    feat: 'normal',
  },
  serif: { // legacy alias → fraunces
    family: '"Fraunces", Georgia, serif',
    weight: 400, tracking: '-0.025em', feat: '"ss01" on',
  },
  sans: { // legacy alias → schibsted
    family: '"Schibsted Grotesk", -apple-system, sans-serif',
    weight: 600, tracking: '-0.04em', feat: 'normal',
  },
};

function Wordmark({ size = 48, color = 'currentColor', font = 'fraunces' }) {
  const f = WORDMARK_FONTS[font] || WORDMARK_FONTS.fraunces;
  return (
    <span
      style={{
        fontFamily: f.family,
        fontWeight: f.weight,
        fontSize: size,
        letterSpacing: '0.08em',
        color,
        lineHeight: 1,
        textTransform: 'uppercase',
        fontFeatureSettings: f.feat,
      }}
    >
      KREOBOX
    </span>
  );
}

window.WORDMARK_FONTS = WORDMARK_FONTS;

// Horizontal lockup: mark · wordmark
function Lockup({ Mark, size = 48, gap, color = '#1a1815', accent = '#1a1815', font = 'serif', label }) {
  const markSize = size * 1.4;
  const g = gap ?? size * 0.42;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: g, color }}>
      <Mark size={markSize} accent={accent} />
      <Wordmark size={size} color={color} font={font} />
      {label ? (
        <span style={{
          fontFamily: '"Inter Tight", -apple-system, sans-serif',
          fontSize: size * 0.32,
          fontWeight: 500,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.45)',
          marginLeft: size * 0.5,
          paddingLeft: size * 0.5,
          borderLeft: '1px solid rgba(0,0,0,0.18)',
          alignSelf: 'center',
        }}>{label}</span>
      ) : null}
    </div>
  );
}

// Stacked: mark above wordmark
function StackedLockup({ Mark, size = 48, color = '#1a1815', accent = '#1a1815', font = 'serif' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.55, color }}>
      <Mark size={size * 1.7} accent={accent} />
      <Wordmark size={size} color={color} font={font} />
    </div>
  );
}

Object.assign(window, { Wordmark, Lockup, StackedLockup });
