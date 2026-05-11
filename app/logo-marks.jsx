// Kreobox logo marks — six geometric explorations on a "subtly hinted box" theme.
// Each mark is a self-contained SVG component, sized via the `size` prop.
// All marks render in `currentColor` so they inherit foreground from parent.

// ── 01 · ISOMETRIC CUBE ─────────────────────────────────────────────
// A cube viewed from the corner — three rhombus faces meeting at a point.
// The top face is hollowed to suggest an opening / "kreo" (create from).
function MarkIsoCube({ size = 96, accent = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* left face */}
      <path d="M14 32 L50 50 L50 92 L14 74 Z" fill={accent} fillOpacity="0.55" />
      {/* right face */}
      <path d="M86 32 L50 50 L50 92 L86 74 Z" fill={accent} fillOpacity="0.85" />
      {/* top face — hollow K notch */}
      <path d="M14 32 L50 14 L86 32 L50 50 Z" fill={accent} />
      <path d="M38 32 L50 26 L62 32 L50 38 Z" fill="#fafaf7" />
    </svg>
  );
}

// ── 02 · CORNER BRACKET ─────────────────────────────────────────────
// Two thick L-strokes interlocking — reads as both a K and a box corner.
function MarkBracket({ size = 96, accent = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 14 H32 V42 L60 14 H80 L46 48 L80 86 H60 L32 56 V86 H18 Z" fill={accent} />
    </svg>
  );
}

// ── 03 · STACKED BLOCKS ─────────────────────────────────────────────
// Three squares in a 2x2 with one cell empty — the empty cell IS the box.
function MarkStacked({ size = 96, accent = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="14" width="34" height="34" rx="6" fill={accent} />
      <rect x="52" y="14" width="34" height="34" rx="6" fill={accent} fillOpacity="0.4" />
      <rect x="14" y="52" width="34" height="34" rx="6" fill={accent} fillOpacity="0.4" />
      <rect x="52" y="52" width="34" height="34" rx="6" fill={accent} />
    </svg>
  );
}

// ── 04 · OPEN FRAME ─────────────────────────────────────────────────
// A square container with its lid lifted at an angle — opening box.
// Refined: thicker, more confident strokes; lid sits naturally above frame.
function MarkOpenFrame({ size = 96, accent = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* container body — solid rounded square with hollow interior */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 28 H84 V84 Q84 90 78 90 H22 Q16 90 16 84 Z M30 42 V76 H70 V42 Z"
        fill={accent}
      />
      {/* lid — rotated, slightly offset, sitting above the body */}
      <rect
        x="20" y="10" width="68" height="14" rx="3"
        transform="rotate(-8 54 17)"
        fill={accent}
        fillOpacity="0.7"
      />
    </svg>
  );
}

// ── 05 · K MONOGRAM (negative space box) ────────────────────────────
// A solid square with a K cut from negative space.
function MarkMonogram({ size = 96, accent = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="84" height="84" rx="14" fill={accent} />
      <path
        d="M30 26 H40 V46 L58 26 H72 L52 50 L72 74 H58 L40 54 V74 H30 Z"
        fill="#fafaf7"
      />
    </svg>
  );
}

// ── 06 · DEPTH STACK ────────────────────────────────────────────────
// Three squares offset — boxes nesting / depth. Most subtle box reference.
function MarkDepth({ size = 96, accent = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="34" y="10" width="56" height="56" rx="10" fill={accent} fillOpacity="0.25" />
      <rect x="22" y="22" width="56" height="56" rx="10" fill={accent} fillOpacity="0.5" />
      <rect x="10" y="34" width="56" height="56" rx="10" fill={accent} />
    </svg>
  );
}

Object.assign(window, {
  MarkIsoCube, MarkBracket, MarkStacked, MarkOpenFrame, MarkMonogram, MarkDepth,
});
